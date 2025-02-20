import zhTranslations from "./i18n/zh-CN";

import { isPaste } from "diagram-js/lib/features/keyboard/KeyboardUtil";

export default {

  getDMNProps(element){
    let props={};
    switch (element.businessObject.$type) {
      case "bpmn:BusinessRuleTask":
        // 读取对应属性
        if (element.businessObject.resultVariable) {
          props.resultVariable = element.businessObject.resultVariable;
        }
        if (element.businessObject.decisionRef) {
          props.decisionRef = element.businessObject.decisionRef;
        }
        if (element.businessObject.mapDecisionResult) {
          props.mapDecisionResult = element.businessObject.mapDecisionResult;
        }
        break;
      case "bpmn:ServiceTask":
        if (element.businessObject.type) {
          props.type = element.businessObject.type;
        }
        if (element.businessObject.topic) {
          props.topic = element.businessObject.topic;
        }
        break;
      case "bpmn:CallActivity":
        if (element.businessObject.businessKey) {
          props.businessKey = element.businessObject.businessKey;
        }
        if (element.businessObject.calledElement) {
          props.calledElement = element.businessObject.calledElement;
        }
        break;
      case "bpmn:UserTask":
        if (element.businessObject.formKey) {
          props.formKey = element.businessObject.formKey;
        }
        break;
    }
    return props;
  },
  isImplicitRoot(element) {
    return (
      element && (element.isImplicit || element.id === "__implicitroot")
    );
  },
  getDocumentation(element) {
    let documentations = element.businessObject.get("documentation");
    let value = documentations.length ? documentations[0].text : "";
    return value;
  },
  getDUOApplicationId(element){
    let extensionProps=this.getExtensionProps(element);
    let index=extensionProps.findIndex(prop=>prop.values.findIndex(value=>value.name==="duoApplicationId")>-1);
    if (index>-1){
      return extensionProps[index].values[extensionProps[index].values.findIndex(value=>value.name==="duoApplicationId")].value;
    }
    return null;
  },
  getExtensionProps(element) {
    let extensionElements = element.businessObject.get("extensionElements");
    let extensionProps = [];
    if (extensionElements){
      extensionProps = extensionElements.values.filter(element=>element.$type==="camunda:Properties");
    }
    return extensionProps;
  },
  setDocumentation(modeler, element, value) {
    value = (value || "").trim();
    let businessObject = element.businessObject;
    let documentation = businessObject.get("documentation")[0];
    let bpmnFactory = modeler.get("bpmnFactory");
    let commandStack = modeler.get("commandStack");
    // (1) update or removing existing documentation
    if (documentation) {
      if (value) {
        return commandStack.execute("element.updateModdleProperties", {
          element,
          moddleElement: documentation,
          properties: {
            text: value,
          },
        });
      } else {
        var documents = businessObject.get("documentation");
        var index = documents.indexOf(documentation);
        documents.splice(index, 1);
        return commandStack.execute("element.updateModdleProperties", {
          element,
          moddleElement: businessObject,
          properties: {
            documentation: documents,
          },
        });
      }
    }

    // (2) create new documentation entry
    if (value) {
      documentation = bpmnFactory.create("bpmn:Documentation", {
        text: value,
      });

      return commandStack.execute("element.updateModdleProperties", {
        element,
        moddleElement: businessObject,
        properties: {
          documentation: [
            ...businessObject.get("documentation"),
            documentation,
          ],
        },
      });
    }
  },
  customTranslate(template, replacements) {
    replacements = replacements || {};
    template = zhTranslations[template] || template;
    return template.replace(/{([^}]+)}/g, (_, key) => {
      return replacements[key] || "{" + key + "}";
    });
  },


  CopyModule: {
    __init__: ["nativeCopyPaste"],
    nativeCopyPaste: [
      "type",
      (keyboard, eventBus, moddle, clipboard) => {
        // persist into local storage whenever
        // copy took place
        eventBus.on("copyPaste.elementsCopied", (event) => {

          const { tree } = event;

          console.log("PUT localStorage", tree);

          // persist in local storage, encoded as json
          localStorage.setItem("bpmnClipboard", JSON.stringify(tree));
        });

        // intercept global paste keybindings and
        // inject reified pasted stack
        keyboard.addListener(2000, (event) => {
          const { keyEvent } = event;
          if (!isPaste(keyEvent)) {
            return;
          }

          // retrieve from local storage
          const serializedCopy = localStorage.getItem("bpmnClipboard");

          if (!serializedCopy) {
            return;
          }

          // parse tree, reinstantiating contained objects
          const parsedCopy = JSON.parse(
            serializedCopy,
            this.createReviver(moddle)
          );

          console.log("GET localStorage", parsedCopy);

          // put into clipboard
          clipboard.set(parsedCopy);
        });
      },
    ],
  },
  createReviver(moddle) {

    var elCache = {};

    /**
     * The actual reviewer that creates model instances
     * for elements with a $type attribute.
     *
     * Elements with ids will be re-used, if already
     * created.
     *
     * @param  {String} key
     * @param  {Object} object
     *
     * @return {Object} actual element
     */
    return function (key, object) {

      if (typeof object === "object" && typeof object.$type === "string") {

        var objectId = object.id;

        if (objectId && elCache[objectId]) {
          return elCache[objectId];
        }

        var type = object.$type;
        var attrs = Object.assign({}, object);

        delete attrs.$type;

        var newEl = moddle.create(type, attrs);

        if (objectId) {
          elCache[objectId] = newEl;
        }

        return newEl;
      }

      return object;
    };
  },



};