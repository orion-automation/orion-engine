import {useService} from "bpmn-js-properties-panel";
import {html} from "htm/preact";
import {TextFieldEntry} from "@bpmn-io/properties-panel";
import {getExtensionElementsList} from "camunda-bpmn-js/lib/util/ExtensionElementsUtil";

const LOW_PRIORITY = 499;


/**
 * A provider with a `#getGroups(element)` method
 * that exposes groups for a diagram element.
 *
 * @param {PropertiesPanel} propertiesPanel
 * @param {Function} translate
 */
export default function StepPropertiesProvider(propertiesPanel, translate) {

    /**
     * Return the groups provided for the given element.
     *
     * @param {DiagramElement} element
     *
     * @return {(Object[]) => (Object[])} groups middleware
     */
    this.getGroups = function (element) {

        /**
         * We return a middleware that modifies
         * the existing groups.
         *
         * @param {Object[]} groups
         *
         * @return {Object[]} modified groups
         */
        return function (groups) {
            groups.forEach(group => {
                if (["CamundaPlatform__TaskListener", "CamundaPlatform__ExecutionListener"].includes(group.id)) {
                    let extensionName;
                    if (group.id==="CamundaPlatform__TaskListener"){
                        extensionName="camunda:TaskListener";
                    }
                    if (group.id==="CamundaPlatform__ExecutionListener"){
                        extensionName="camunda:ExecutionListener";
                    }
                    const listeners = getExtensionElementsList(element.businessObject, extensionName);
                    group.items.forEach((item, index) => {
                        item.entries.splice(item.entries.length-1,0,{
                            id: `${item.id}-order`,
                            component: Step,
                            listener: listeners[index]
                        });
                    });
                }
            });

            return groups;
        };
    };

    propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

StepPropertiesProvider.$inject = ["propertiesPanel", "translate"];

function Step(props) {
    let {id, element, listener} = props;
    const debounce = useService("debounceInput");
    const translate = useService("translate");
    const commandStack = useService("commandStack");

    const getValue = () => {
        return listener.get("order");
    };

    const setValue = (value, validate) => {
        if (!validate) {
            commandStack.execute("element.updateModdleProperties", {
                element,
                moddleElement: listener,
                properties: {order: value && value.length > 0 ? value : ""}
            });
        }
    };

    function validateValue(value) {
        if (!value || value.length === 0) {
            return null;
        } else {
            return Number.isInteger(Number(value)) ? null : translate("Must be a integer.");
        }
    }

    return html`
        <${TextFieldEntry}
                id=${id}
                element=${element}
                label=${translate("Execution order")}
                getValue=${getValue}
                setValue=${setValue}
                debounce=${debounce}
                validate="${validateValue}"
        />`;
}
