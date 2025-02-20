/**
 *bpmnjs的工具类
 */
import {find, isString, isUndefined} from "min-dash";
import {is, isAny} from "bpmn-js/lib/features/modeling/util/ModelingUtil";

const getBusinessObject = require("bpmn-js/lib/util/ModelUtil").getBusinessObject;
export default {
    getBpmnTempate() {
        return `
      <?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:activiti="http://activiti.org/bpmn" xmlns:xsd="http://www.w3.org/2001/XMLSchema"
targetNamespace="">
  <process id="Process_1" isExecutable="true">
    <startEvent id="StartEvent_1">
    </startEvent>
  </process>
   <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds height="36.0" width="36.0" x="412.0" y="50.0"/>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>
      `;
    },

    isImplicitRoot(element) {
        return element.id === "__implicitroot";
    },
    //更新模型属性
    updateProperties(element, properties) {
        let bo = getBusinessObject(element);
        Object.keys(properties).forEach(key => {
            bo.set(key, properties[key]);
        });
    },
    //通过命令更新属性
    updatePropertiesByCmd(element, commandStack, properties) {
        commandStack.execute("element.updateProperties", {element: element, properties: properties});
    },
    //获取元素的属性
    getProperties(element, propNames) {
        let bo = this.getBo(element);
        let properties = {};
        for (let propName of propNames) {
            properties[propName] = bo.get(propName);
        }
        return properties;
    },
    //获取单个元素属性
    getPropertie(element, propName) {
        let bo = this.getBo(element);
        return bo.get(propName);
    },

    //获取元素的模型对象
    getBo(element) {
        return getBusinessObject(element);
    },
    //创建一个元素
    createElement(vm, elementName, properties) {
        let bpmnFactory = vm.bpmn.bpmnFactory;
        return bpmnFactory.create(elementName, properties);
    },
    /**
     * Find old business object matching specified old property.
     *
     * @param {djs.model.Base|ModdleElement} element
     * @param {Object} oldProperty
     *
     * @returns {ModdleElement}
     */
    findOldBusinessObject(element, oldProperty) {
        let businessObject = getBusinessObject(element),
            propertyName;

        const oldBinding = oldProperty.binding,
            oldBindingType = oldBinding.type;

        if (oldBindingType === "camunda:field") {

            if (isAny(businessObject, ["camunda:ExecutionListener", "camunda:TaskListener"])) {
                propertyName = "camunda:fields";
            } else {
                propertyName = "bpmn:values";
            }

            if (!businessObject || !businessObject.get(propertyName) || !businessObject.get(propertyName).length) {
                return;
            }

            return find(businessObject.get(propertyName), function (oldBusinessObject) {
                return oldBusinessObject.get("camunda:name") === oldBinding.name;
            });
        }

        if (oldBindingType === "camunda:in") {
            return find(businessObject.get("values"), function (oldBusinessObject) {
                return oldBusinessObject.get("target") === oldBinding.target;
            });
        }

        if (oldBindingType === "camunda:in:businessKey") {
            return find(businessObject.get("values"), function (oldBusinessObject) {
                return isString(oldBusinessObject.get("businessKey"));
            });
        }

        if (oldBindingType === "camunda:out") {
            return find(businessObject.get("values"), function (oldBusinessObject) {
                return oldBusinessObject.get("source") === oldBinding.source ||
                    oldBusinessObject.get("sourceExpression") || oldBinding.sourceExpression;
            });
        }

        if (oldBindingType === "camunda:inputParameter" || oldBindingType === "camunda:outputParameter") {

            if (is(businessObject, "camunda:Connector")) {
                businessObject = businessObject.get("camunda:inputOutput");

                if (!businessObject) {
                    return;
                }
            } else {
                businessObject = this.findExtension(businessObject, "camunda:InputOutput");

                if (!businessObject) {
                    return;
                }
            }

            if (oldBindingType === "camunda:inputParameter") {
                return find(businessObject.get("camunda:inputParameters"), function (oldBusinessObject) {
                    return oldBusinessObject.get("camunda:name") === oldBinding.name;
                });
            } else {
                return find(businessObject.get("camunda:outputParameters"), function (oldBusinessObject) {
                    if (oldBinding.scriptFormat) {
                        const definition = oldBusinessObject.get("camunda:definition");

                        return definition && definition.get("camunda:value") === oldBinding.source;
                    } else {
                        return oldBusinessObject.get("camunda:value") === oldBinding.source;
                    }
                });
            }

        }

        if (oldBindingType === "camunda:property") {
            if (!businessObject || !businessObject.get("values") || !businessObject.get("values").length) {
                return;
            }

            businessObject = this.findExtension(businessObject, "camunda:Properties");

            if (!businessObject) {
                return;
            }

            return find(businessObject.get("values"), function (oldBusinessObject) {
                return oldBusinessObject.get("camunda:name") === oldBinding.name;
            });
        }

        if (oldBindingType === "camunda:errorEventDefinition") {
            return this.findCamundaErrorEventDefinition(element, oldBinding.errorRef);
        }
    },

    /**
     * Find old property matching specified new property.
     *
     * @param {Object} oldTemplate
     * @param {Object} newProperty
     *
     * @returns {Object}
     */
    findOldProperty(oldTemplate, newProperty) {
        if (!oldTemplate) {
            return;
        }

        const oldProperties = oldTemplate.properties,
            newBinding = newProperty.binding,
            newBindingName = newBinding.name,
            newBindingType = newBinding.type;

        if (newBindingType === "property") {
            return find(oldProperties, function (oldProperty) {
                const oldBinding = oldProperty.binding,
                    oldBindingName = oldBinding.name,
                    oldBindingType = oldBinding.type;

                return oldBindingType === "property" && oldBindingName === newBindingName;
            });
        }

        if (newBindingType === "camunda:field") {
            return find(oldProperties, function (oldProperty) {
                const oldBinding = oldProperty.binding,
                    oldBindingName = oldBinding.name,
                    oldBindingType = oldBinding.type;

                return oldBindingType === "camunda:field" && oldBindingName === newBindingName;
            });
        }

        if (newBindingType === "camunda:in") {
            return find(oldProperties, function (oldProperty) {
                const oldBinding = oldProperty.binding,
                    oldBindingType = oldBinding.type;

                if (oldBindingType !== "camunda:in") {
                    return;
                }

                // always override if change from source to source expression or vice versa
                if ((oldBinding.expression && !newBinding.expression) ||
                    !oldBinding.expression && newBinding.expression) {
                    return;
                }

                return oldBinding.target === newBinding.target;
            });
        }

        if (newBindingType === "camunda:in:businessKey") {
            return find(oldProperties, function (oldProperty) {
                const oldBinding = oldProperty.binding,
                    oldBindingType = oldBinding.type;

                return oldBindingType === "camunda:in:businessKey";
            });
        }

        if (newBindingType === "camunda:out") {
            return find(oldProperties, function (oldProperty) {
                const oldBinding = oldProperty.binding,
                    oldBindingType = oldBinding.type;

                return oldBindingType === "camunda:out" && (
                    oldBinding.source === newBinding.source ||
                    oldBinding.sourceExpression === newBinding.sourceExpression
                );
            });
        }

        if (newBindingType === "camunda:inputParameter") {
            return find(oldProperties, function (oldProperty) {
                const oldBinding = oldProperty.binding,
                    oldBindingName = oldBinding.name,
                    oldBindingType = oldBinding.type;

                if (oldBindingType !== "camunda:inputParameter") {
                    return;
                }
                return oldBindingName === newBindingName
                    && oldBinding.scriptFormat === newBinding.scriptFormat;
            });
        }

        if (newBindingType === "camunda:outputParameter") {
            return find(oldProperties, function (oldProperty) {
                const oldBinding = oldProperty.binding,
                    oldBindingType = oldBinding.type;

                if (oldBindingType !== "camunda:outputParameter") {
                    return;
                }

                return oldBinding.source === newBinding.source
                    && oldBinding.scriptFormat === newBinding.scriptFormat;
            });
        }

        if (newBindingType === "camunda:property") {
            return find(oldProperties, function (oldProperty) {
                const oldBinding = oldProperty.binding,
                    oldBindingName = oldBinding.name,
                    oldBindingType = oldBinding.type;

                return oldBindingType === "camunda:property" && oldBindingName === newBindingName;
            });
        }

        if (newBindingType === "camunda:errorEventDefinition") {
            return find(oldProperties, function (oldProperty) {
                const newBindingRef = newBinding.errorRef,
                    oldBinding = oldProperty.binding,
                    oldBindingRef = oldBinding.errorRef,
                    oldBindingType = oldBinding.type;

                return oldBindingType === "camunda:errorEventDefinition"
                    && oldBindingRef === newBindingRef;
            });
        }
    },

    /**
     * Find extension with given type in
     * BPMN element, diagram element or ExtensionElement.
     *
     * @param {ModdleElement|djs.model.Base} element
     * @param {String} type
     *
     * @return {ModdleElement} the extension
     */
    findExtension(element, type) {
        const businessObject = getBusinessObject(element);

        let extensionElements;

        if (is(businessObject, "bpmn:ExtensionElements")) {
            extensionElements = businessObject;
        } else {
            extensionElements = businessObject.get("extensionElements");
        }

        if (!extensionElements) {
            return null;
        }

        return extensionElements.get("values").find((value) => {
            return is(value, type);
        });
    },
    findCamundaErrorEventDefinition(element, errorRef) {
        const errorEventDefinitions = this.findExtensions(element, ["camunda:ErrorEventDefinition"]);

        let error;

        // error ID has to start with <Error_${ errorRef }_>
        return errorEventDefinitions.find((definition) => {
            error = definition.get("bpmn:errorRef");

            if (error) {
                return error.get("bpmn:id").startsWith(`Error_${errorRef}`);
            }
        });
    },
    findExtensions(element, types) {
        const extensionElements = this.getExtensionElements(element);

        if (!extensionElements) {
            return [];
        }

        return extensionElements.get("values").filter((value) => {
            return isAny(value, types);
        });
    },
    getExtensionElements(element) {
        const businessObject = getBusinessObject(element);

        if (is(businessObject, "bpmn:ExtensionElements")) {
            return businessObject;
        } else {
            return businessObject.get("extensionElements");
        }
    },
    /**
     * Check whether property was changed after being set by template.
     *
     * @param {djs.model.Base|ModdleElement} element
     * @param {Object} oldProperty
     *
     * @returns {boolean}
     */
    propertyChanged(element, oldProperty) {
        const businessObject = getBusinessObject(element);

        const oldBinding = oldProperty.binding,
            oldBindingName = oldBinding.name,
            oldBindingType = oldBinding.type,
            oldPropertyValue = oldProperty.value;

        let conditionExpression,
            definition;

        if (oldBindingType === "property") {
            if (oldBindingName === "conditionExpression") {
                conditionExpression = businessObject.get("bpmn:conditionExpression");

                return conditionExpression.get("bpmn:body") !== oldPropertyValue;
            }

            return businessObject.get(oldBindingName) !== oldPropertyValue;
        }

        if (oldBindingType === "camunda:field") {
            return businessObject.get("camunda:string") !== oldPropertyValue;
        }

        if (oldBindingType === "camunda:in") {
            if (oldBinding.expression) {
                return businessObject.get("sourceExpression") !== oldPropertyValue;
            } else {
                return businessObject.get("camunda:source") !== oldPropertyValue;
            }
        }

        if (oldBindingType === "camunda:in:businessKey") {
            return businessObject.get("camunda:businessKey") !== oldPropertyValue;
        }

        if (oldBindingType === "camunda:out") {
            return businessObject.get("camunda:target") !== oldPropertyValue;
        }

        if (oldBindingType === "camunda:inputParameter") {
            if (oldBinding.scriptFormat) {
                definition = businessObject.get("camunda:definition");

                return definition && definition.get("camunda:value") !== oldPropertyValue;
            } else {
                return businessObject.get("camunda:value") !== oldPropertyValue;
            }
        }

        if (oldBindingType === "camunda:outputParameter") {
            return businessObject.get("camunda:name") !== oldPropertyValue;
        }

        if (oldBindingType === "camunda:property") {
            return businessObject.get("camunda:value") !== oldPropertyValue;
        }

        if (oldBindingType === "camunda:errorEventDefinition") {
            return businessObject.get("expression") !== oldPropertyValue;
        }
    },

    remove(array, item) {
        const index = array.indexOf(item);

        if (isUndefined(index)) {
            return array;
        }

        array.splice(index, 1);

        return array;
    },
};
