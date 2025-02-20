import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';

// helper utils
export function getScriptType(element) {
  const businessObject = getBusinessObject(element);
  const scriptValue = getScriptValue(businessObject);

  if (typeof scriptValue !== 'undefined') {
    return 'script';
  }

  const resource = businessObject.get('camunda:resource');

  if (typeof resource !== 'undefined') {
    return 'resource';
  }
}

export function getScriptFormat(businessObject) {
  return businessObject.get('scriptFormat');
}

function getScriptValue(businessObject) {
  return businessObject.get(getScriptProperty(businessObject));
}

function getScriptProperty(businessObject) {
  return isScript(businessObject) ? 'value' : 'script';
}

function isScript(element) {
  return is(element, 'camunda:Script');
}
