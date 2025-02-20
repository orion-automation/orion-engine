import moment from "moment";
import i18n from "@/i18n/index";

const generateRandomString = (length) => {
  var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var result = "";
  for (var i = 0; i < length; i++) {
    let range = i === 0 ? chars.length - 10 : chars.length;
    result += chars.charAt(Math.floor(Math.random() * range));
  }
  return result;
};
const flattenObj = (ob) => {

  // The object which contains the
  // final result
  let result = {};

  // loop through the object "ob"
  for (const i in ob) {
    // We check the type of the i using
    // typeof() function and recursively
    // call the function again
    let isArray = Array.isArray(ob[i]);
    if ((typeof ob[i]) === "object" && ob[i] !== null
        && !(isArray && !ob[i].length)) {
      const temp = flattenObj(ob[i]);
      for (const j in temp) {
        let key = j;
        if (isArray) {
          let index = key.indexOf(".");
          if (index >= 0) {
            key = "[" + key.substring(0, index) + "]" + key.substring(index);
          } else {
            key = "[" + key + "]";
          }
        } else {
          key = "." + key;
        }

        // Store temp in result
        result[i + key] = temp[j];
      }
    }

    // Else store ob[i] in result directly
    else {
      result[i] = ob[i];
    }
  }
  return result;
};

export default {
  formatDateTime(date, format) {
    if (!date) {
      return "";
    }
    if (!format) {
      format = "YYYY-MM-DD HH:mm:ss";
    }
    return moment(date).format(format);
  },
  // 计算距离现在的差值(天)
  generatePreviousFromNow(date,unitOfTime) {
    if (!date) {
      return "";
    }
    return moment().diff(moment(date),unitOfTime);
  },
  formatVariable(variable) {
    let value = variable.value;
    if (variable.dataType === "number") {
      return this.formatNumber(value);
    }
    return value;
  },
  formatVariableWithType(type,value) {
    if (type === "number") {
      return this.formatNumber(value);
    }
    return value;
  },
  formatNumber(num) {
    var result = [], counter = 0;
    num = (num || 0).toString().split("");
    for (var i = num.length - 1; i >= 0; i--) {
      counter++;
      result.unshift(num[i]);
      if (!(counter % 3) && i != 0) { result.unshift(","); }
    }
    return result.join("");
  },
  application: {
    types: [
      { id: "duo", name: i18n.tc("collaboration") },
      {
        id: "ux", name: i18n.tc("custom")
      }],
    categories: {
      duo: [
        {
          id: "dmn",
          name: i18n.tc("dmn"),
          item: {
            decisionRef: "",
            resultVariable: "",
            mapDecisionResult: "",
          },
        },
        {
          id: "externalTask",
          name: i18n.tc("externalTask"),
          item: {
            topic: "",
          },
        },
        {
          id: "call",
          name: i18n.tc("callProcess"),
          item: {
            calledElement: "",
            businessKey: "#{execution.processBusinessKey}",
          },
        },
        {
          id: "form",
          name: i18n.tc("form"),
          item: {
            formKey: "",
          },
        },
        {
          id: "listener",
          name: i18n.tc("listener"),
          item: {
            listenerType: "Script",
            scriptFormat: "JavaScript",
            scriptCode: "",
          },
        },
        {
          id: "connector",
          name: i18n.tc("connector"),
          item: {
            url: "",
            method: "GET",
            headerTemplate: [],
            queryTemplate: [],
            requestBodyTemplate: [],
            responseBodyTemplate: [],
            requestBody: "{}",
            statusCode: "",
            response: "",
            inputs: [],
            outputs: []
          },
        },
        {
          id: "combination",
          name: i18n.tc("linkMenu.xApp"),
          item: {
            basic: {
              name: "",
              icon: "",
              iconType: "fal",
              color: "#FF7754"
            },
            authority: {
              users: [],
              groups: []
            },
            page: [],
            data: [],
          },
        },
      ],
      ux: [
        {
          id: "bpezAppIcons",
          name: i18n.tc("appIcon"),
          item: {
            name: "",
            icon: "",
            iconType: "fal"
          },
        },
        {
          id: "bpezAppVarsInList",
          name: i18n.tc("appTopVars"),
          item: {
            variables: []
          },
        },
        {
          id: "bpezTaskVarsInList",
          name: i18n.tc("taskTopVars"),
          item: {
            variables: []
          }
        },
        {
          id: "bpezAppReport",
          name: i18n.tc("dataReport"),
          item: {
            name: "",
            icon: "",
            iconType: "fal",
            url: ""
          },
        }
      ]
    }
  },

  options: {
    type: [
      { id: "textfield", name: "文本" },
      { id: "textarea", name: "多行文本" },
      { id: "number", name: "数字" },
      { id: "date", name: "日期" },
      { id: "radio", name: "单选" },
      { id: "select", name: "下拉框" },
      { id: "file", name: "文件" },
      { id: "fieldset", name: "抬头" }
    ],
    required: [
      { id: true, name: "是" },
      { id: false, name: "否" }]
  },
  format: function (type, value, reverse) {
    var source = reverse ? "name" : "id";
    var target = reverse ? "id" : "name";
    var option = this.options[type].find(function (option) {
      return option[source] === value;
    }) || this.options[type][0];
    return option[target];
  },
  buildFormData: function (aoa, auto) {
    var that = this;
    var result = [];
    if (!aoa || !aoa.length) {
      return result;
    }
    var names = aoa.shift();
    if (auto) {
      result = names.filter(function (name) {
        return name && name.trim();
      }).map(function (name) {
        return {
          name: name.trim(),
          type: "textfield",
          options: null
        };
      });
      return result;
    }
    var mapping = {
      "name": "名称",
      "type": "类型",
      "required": "必填",
      "options": "选项",
      "key": "变量"
    };

    aoa.forEach(function (row) {
      var field = {};
      for (var i in mapping) {
        var propertyName = mapping[i];
        var propertyIndex = names.indexOf(propertyName);
        var value = row[propertyIndex] || null;
        if (i === "type" || i === "required") {
          value = that.format(i, value, true);
        }
        field[i] = value;
      }
      if (field.name) {
        result.push(field);
      }
    });
    return result;
  },
  toFormIO: function (fields) {
    var mapping = [
      {
        id: "textfield",
        field: {
          "label": "",
          "labelPosition": "top",
          "placeholder": "",
          "description": "",
          "tooltip": "",
          "prefix": "",
          "suffix": "",
          "widget": { "type": "input" },
          "inputMask": "",
          "allowMultipleMasks": false,
          "customClass": "",
          "tabindex": "",
          "hidden": false,
          "hideLabel": false,
          "showWordCount": false,
          "showCharCount": false,
          "mask": false,
          "autofocus": false,
          "spellcheck": true,
          "disabled": false,
          "tableView": true,
          "modalEdit": false,
          "multiple": false,
          "persistent": true,
          "inputFormat": "plain",
          "protected": false,
          "dbIndex": false,
          "case": "",
          "encrypted": false,
          "redrawOn": "",
          "clearOnHide": true,
          "customDefaultValue": "",
          "calculateValue": "",
          "calculateServer": false,
          "allowCalculateOverride": false,
          "validateOn": "change",
          "validate": {
            "required": false,
            "pattern": "",
            "customMessage": "",
            "custom": "",
            "customPrivate": false,
            "json": "",
            "minLength": "",
            "maxLength": "",
            "strictDateValidation": false,
            "multiple": false,
            "unique": false
          },
          "unique": false,
          "errorLabel": "",
          "key": "",
          "tags": [],
          "properties": {},
          "conditional": { "show": null, "when": null, "eq": "", "json": "" },
          "customConditional": "",
          "logic": [],
          "attributes": {},
          "overlay": { "style": "", "page": "", "left": "", "top": "", "width": "", "height": "" },
          "type": "textfield",
          "input": true,
          "refreshOn": "",
          "inputType": "text",
          "id": "",
          "defaultValue": ""
        }
      },

      {
        id: "radio",
        field: {
          "label": "",
          "labelPosition": "top",
          "optionsLabelPosition": "right",
          "description": "",
          "tooltip": "",
          "customClass": "",
          "tabindex": "",
          "inline": false,
          "hidden": false,
          "hideLabel": false,
          "autofocus": false,
          "disabled": false,
          "tableView": false,
          "modalEdit": false,
          "values": [],
          "dataType": "",
          "persistent": true,
          "protected": false,
          "dbIndex": false,
          "encrypted": false,
          "redrawOn": "",
          "clearOnHide": true,
          "customDefaultValue": "",
          "calculateValue": "",
          "calculateServer": false,
          "allowCalculateOverride": false,
          "validate": {
            "required": false,
            "customMessage": "",
            "custom": "",
            "customPrivate": false,
            "json": "",
            "strictDateValidation": false,
            "multiple": false,
            "unique": false
          },
          "errorLabel": "",
          "key": "",
          "tags": [],
          "properties": {},
          "conditional": {
            "show": null,
            "when": null,
            "eq": "",
            "json": ""
          },
          "customConditional": "",
          "logic": [],
          "attributes": {},
          "overlay": {
            "style": "",
            "page": "",
            "left": "",
            "top": "",
            "width": "",
            "height": ""
          },
          "type": "radio",
          "input": true,
          "placeholder": "",
          "prefix": "",
          "suffix": "",
          "multiple": false,
          "unique": false,
          "refreshOn": "",
          "widget": null,
          "validateOn": "change",
          "showCharCount": false,
          "showWordCount": false,
          "allowMultipleMasks": false,
          "inputType": "radio",
          "fieldSet": false,
          "id": "",
          "defaultValue": ""
        }
      },
      {
        id: "textarea",
        field: {
          "label": "",
          "labelPosition": "top",
          "placeholder": "",
          "description": "",
          "tooltip": "",
          "prefix": "",
          "suffix": "",
          "widget": { "type": "input" },
          "editor": "",
          "autoExpand": false,
          "customClass": "",
          "tabindex": "",
          "hidden": false,
          "hideLabel": false,
          "showWordCount": false,
          "showCharCount": false,
          "autofocus": false,
          "spellcheck": true,
          "disabled": false,
          "tableView": true,
          "modalEdit": false,
          "multiple": false,
          "persistent": true,
          "inputFormat": "html",
          "protected": false,
          "dbIndex": false,
          "case": "",
          "encrypted": false,
          "redrawOn": "",
          "clearOnHide": true,
          "customDefaultValue": "",
          "calculateValue": "",
          "calculateServer": false,
          "allowCalculateOverride": false,
          "validateOn": "change",
          "validate": {
            "required": false,
            "pattern": "",
            "customMessage": "",
            "custom": "",
            "customPrivate": false,
            "json": "",
            "minLength": "",
            "maxLength": "",
            "minWords": "",
            "maxWords": "",
            "strictDateValidation": false,
            "multiple": false,
            "unique": false
          },
          "unique": false,
          "errorLabel": "",
          "key": "",
          "tags": [],
          "properties": {},
          "conditional":
            { "show": null, "when": null, "eq": "", "json": "" },
          "customConditional": "",
          "logic": [],
          "attributes": {},
          "overlay": { "style": "", "page": "", "left": "", "top": "", "width": "", "height": "" },
          "type": "textarea",
          "rows": 3,
          "wysiwyg": false,
          "input": true,
          "refreshOn": "",
          "allowMultipleMasks": false,
          "mask": false,
          "inputType": "text",
          "inputMask": "",
          "id": "",
          "defaultValue": null
        }
      },
      {
        id: "number",
        field: {
          "label": "",
          "labelPosition": "top",
          "placeholder": "",
          "description": "",
          "tooltip": "",
          "prefix": "",
          "suffix": "",
          "widget": { "type": "input" },
          "customClass": "",
          "tabindex": "",
          "hidden": false,
          "hideLabel": false,
          "mask": false,
          "autofocus": false,
          "spellcheck": true,
          "disabled": false,
          "tableView": false,
          "modalEdit": false,
          "multiple": false,
          "persistent": true,
          "delimiter": false,
          "requireDecimal": false,
          "inputFormat": "plain",
          "protected": false,
          "dbIndex": false,
          "encrypted": false,
          "redrawOn": "",
          "clearOnHide": true,
          "customDefaultValue": "",
          "calculateValue": "",
          "calculateServer": false,
          "allowCalculateOverride": false,
          "validateOn": "change",
          "validate": {
            "required": false,
            "customMessage": "",
            "custom": "",
            "customPrivate": false,
            "json": "",
            "min": "",
            "max": "",
            "strictDateValidation": false,
            "multiple": false,
            "unique": false,
            "step": "any",
            "integer": ""
          },
          "errorLabel": "",
          "key": "",
          "tags": [],
          "properties": {},
          "conditional": { "show": null, "when": null, "eq": "", "json": "" },
          "customConditional": "",
          "logic": [],
          "attributes": {},
          "overlay": { "style": "", "page": "", "left": "", "top": "", "width": "", "height": "" },
          "type": "number",
          "input": true,
          "unique": false,
          "refreshOn": "",
          "showCharCount": false,
          "showWordCount": false,
          "allowMultipleMasks": false,
          "id": "",
          "defaultValue": null
        }
      },
      {
        id: "date",
        field: {
          "label": "",
          "labelPosition": "top",
          "displayInTimezone": "viewer",
          "useLocaleSettings": false,
          "allowInput": true,
          "format": "yyyy-MM-dd hh:mm a",
          "placeholder": "",
          "description": "",
          "tooltip": "",
          "customClass": "",
          "tabindex": "",
          "hidden": false,
          "hideLabel": false,
          "autofocus": false,
          "disabled": false,
          "tableView": false,
          "modalEdit": false,
          "enableDate": true,
          "datePicker": {
            "minDate": null,
            "maxDate": null,
            "disable": "",
            "disableFunction": "",
            "disableWeekends": false,
            "disableWeekdays": false,
            "showWeeks": true,
            "startingDay": 0,
            "initDate": "",
            "minMode": "day",
            "maxMode": "year",
            "yearRows": 4,
            "yearColumns": 5
          },
          "enableTime": true,
          "timePicker": {
            "showMeridian": true,
            "hourStep": 1,
            "minuteStep": 1,
            "readonlyInput": false,
            "mousewheel": true,
            "arrowkeys": true
          },
          "multiple": false,
          "defaultValue": "",
          "defaultDate": "",
          "customOptions": {},
          "persistent": true,
          "protected": false,
          "dbIndex": false,
          "encrypted": false,
          "redrawOn": "",
          "clearOnHide": true,
          "customDefaultValue": "",
          "calculateValue": "",
          "calculateServer": false,
          "allowCalculateOverride": false,
          "validate": {
            "required": false,
            "customMessage": "",
            "custom": "",
            "customPrivate": false,
            "json": "",
            "strictDateValidation": false,
            "multiple": false,
            "unique": false
          },
          "unique": false,
          "validateOn": "change",
          "errorLabel": "",
          "key": "",
          "tags": [],
          "properties": {},
          "conditional": { "show": null, "when": null, "eq": "", "json": "" },
          "customConditional": "",
          "logic": [],
          "attributes": {},
          "overlay": {
            "style": "",
            "page": "",
            "left": "",
            "top": "",
            "width": "",
            "height": ""
          },
          "type": "datetime",
          "timezone": "",
          "input": true,
          "prefix": "",
          "suffix": "<i ref=\"icon\" class=\"fa fa-calendar\" style=\"\"></i>",
          "refreshOn": "",
          "widget": {
            "type": "calendar",
            "displayInTimezone": "viewer",
            "language": "en",
            "useLocaleSettings": false,
            "allowInput": true,
            "mode": "single",
            "enableTime": true,
            "noCalendar": false,
            "format": "yyyy-MM-dd hh:mm a",
            "hourIncrement": 1,
            "minuteIncrement": 1,
            "time_24hr": false,
            "minDate": null,
            "disabledDates": "",
            "disableWeekends": false,
            "disableWeekdays": false,
            "disableFunction": "",
            "maxDate": null
          },
          "showCharCount": false,
          "showWordCount": false,
          "allowMultipleMasks": false,
          "datepickerMode": "day",
          "id": ""
        }
      },
      {
        id: "select",
        field: {
          "label": "",
          "labelPosition": "top",
          "widget": "choicesjs",
          "placeholder": "",
          "description": "",
          "tooltip": "",
          "customClass": "",
          "tabindex": "",
          "hidden": false,
          "hideLabel": false,
          "autofocus": false,
          "disabled": false,
          "tableView": true,
          "modalEdit": false,
          "multiple": false,
          "dataSrc": "values",
          "data": {
            "values": [],
            "resource": "",
            "json": "",
            "url": "",
            "custom": ""
          },
          "valueProperty": "",
          "dataType": "",
          "template": "<span>{{ item.label }}</span>",
          "searchEnabled": true,
          "selectThreshold": 0.3,
          "readOnlyValue": false,
          "customOptions": {},
          "persistent": true,
          "protected": false,
          "dbIndex": false,
          "encrypted": false,
          "clearOnHide": true,
          "customDefaultValue": "",
          "calculateValue": "",
          "calculateServer": false,
          "allowCalculateOverride": false,
          "validateOn": "change",
          "validate": {
            "required": false,
            "customMessage": "",
            "custom": "",
            "customPrivate": false,
            "json": "",
            "strictDateValidation": false,
            "multiple": false,
            "unique": false
          },
          "unique": false,
          "errorLabel": "",
          "key": "",
          "tags": [],
          "properties": {},
          "conditional":
            { "show": null, "when": null, "eq": "", "json": "" },
          "customConditional": "",
          "logic": [],
          "attributes": {},
          "overlay": { "style": "", "page": "", "left": "", "top": "", "width": "", "height": "" },
          "type": "select",
          "indexeddb": { "filter": {} },
          "selectFields": "",
          "searchField": "",
          "minSearch": 0,
          "filter": "",
          "limit": 100,
          "refreshOn": "",
          "redrawOn": "",
          "input": true,
          "prefix": "",
          "suffix": "",
          "showCharCount": false,
          "showWordCount": false,
          "allowMultipleMasks": false,
          "clearOnRefresh": false,
          "lazyLoad": true,
          "authenticate": false,
          "searchThreshold": 0.3,
          "fuseOptions": { "include": "score", "threshold": 0.3 },
          "id": "",
          "defaultValue": ""
        }
      }, {
        id: "file",
        field: {
          "label": "",
          "labelPosition": "top",
          "description": "",
          "tooltip": "",
          "customClass": "",
          "tabindex": "",
          "hidden": false,
          "hideLabel": false,
          "autofocus": false,
          "disabled": false,
          "tableView": false,
          "modalEdit": false,
          "storage": "url",
          "dir": "",
          "fileNameTemplate": "",
          "image": false,
          "webcam": false,
          "fileTypes": [
          ],
          "filePattern": "*",
          "fileMinSize": "0KB",
          "fileMaxSize": "1GB",
          "multiple": false,
          "persistent": true,
          "protected": false,
          "dbIndex": false,
          "encrypted": false,
          "redrawOn": "",
          "clearOnHide": true,
          "customDefaultValue": "",
          "calculateValue": "",
          "calculateServer": false,
          "allowCalculateOverride": false,
          "validate": {
            "required": false,
            "customMessage": "",
            "custom": "",
            "customPrivate": false,
            "json": "",
            "strictDateValidation": false,
            "multiple": false,
            "unique": false
          },
          "errorLabel": "",
          "key": "upload",
          "tags": [],
          "properties": {},
          "conditional": {
            "show": null,
            "when": null,
            "eq": "",
            "json": ""
          },
          "customConditional": "",
          "logic": [],
          "attributes": {},
          "overlay": {
            "style": "",
            "page": "",
            "left": "",
            "top": "",
            "width": "",
            "height": ""
          },
          "type": "file",
          "imageSize": "200",
          "input": true,
          "placeholder": "",
          "prefix": "",
          "suffix": "",
          "defaultValue": null,
          "unique": false,
          "refreshOn": "",
          "widget": null,
          "validateOn": "change",
          "showCharCount": false,
          "showWordCount": false,
          "allowMultipleMasks": false,
          "privateDownload": false,
          "uploadOnly": false,
          "id": "",
          "url": "https://www.baidu.com",
          "options": "",
          "fileKey": ""
        }
      }, {
        id: "fieldset",
        field: {
          "legend": "",
          "tooltip": "",
          "customClass": "",
          "tabindex": "",
          "hidden": false,
          "disabled": false,
          "tableView": false,
          "modalEdit": false,
          "key": "",
          "tags": [],
          "properties": {},
          "conditional": { "show": null, "when": null, "eq": "", "json": "" },
          "customConditional": "",
          "logic": [],
          "attributes": {},
          "overlay": { "style": "", "page": "", "left": "", "top": "", "width": "", "height": "" },
          "type": "fieldset",
          "label": "",
          "input": false,
          "components": [],
          "placeholder": "",
          "prefix": "",
          "suffix": "",
          "multiple": false,
          "defaultValue": null,
          "protected": false,
          "unique": false,
          "persistent": false,
          "clearOnHide": true,
          "refreshOn": "",
          "redrawOn": "",
          "labelPosition": "top",
          "description": "",
          "errorLabel": "",
          "hideLabel": false,
          "autofocus": false,
          "dbIndex": false,
          "customDefaultValue": "",
          "calculateValue": "",
          "widget": null,
          "validateOn": "change",
          "validate": {
            "required": false,
            "custom": "",
            "customPrivate": false,
            "strictDateValidation": false,
            "multiple": false,
            "unique": false
          },
          "allowCalculateOverride": false,
          "encrypted": false,
          "showCharCount": false,
          "showWordCount": false,
          "allowMultipleMasks": false,
          "tree": false,
          "id": ""
        }
      }];
    var formatted = fields.map(function (field) {
      var newField = JSON.parse(JSON.stringify(mapping.find(function (item) {
        return item.id === field.type;
      }).field));
      if (field.type === "fieldset") {
        newField.legend = field.name;
      } else {
        newField.label = field.name;
      }
      newField.validate.required = field.required;
      var randomKey = newField.type + Math.random().toString(36).substr(3, 8);
      newField.id = randomKey;

      newField.key = field.key || randomKey;
      if (field.type === "select" || field.type === "radio") {
        var options = (field.options || "").split(/[，,]/).filter(function (text) {
          return text && text.trim();
        }).map(function (text) {
          var value = text.trim();
          return {
            label: value,
            value: value
          };
        });
        if (newField.values) {
          newField.values = options;
        } else if (newField.data.values) {
          newField.data.values = options;
        }
      }
      return newField;
    });

    var result = [];
    var currentSet = null;
    for (var i in formatted) {
      var field = formatted[i];
      var isFieldSet = field.type === "fieldset";
      if (isFieldSet) {
        if (currentSet) {
          result.push(currentSet);
        }
        currentSet = field;
      } else {
        if (currentSet) {
          currentSet.components.push(field);
        } else {
          result.push(field);
        }
      }
    }
    if (currentSet) {
      result.push(currentSet);
    }

    return result;
  },
  calculateStatistics(activity, properties) {
    var property = properties[activity.activityId];
    if (!property) {
      property = {
        instances: 0,
        incidents: 0,
        finished: 0,
        canceled: 0
      };
      properties[activity.activityId] = property;
    }

    property.instances++;
    //property.incidents += activity.incidentIds.length;

    var children = activity.childActivityInstances || [];
    children.forEach(child => {
      this.calculateStatistics(child, properties);
    });

    children = activity.childTransitionInstances || [];
    children.forEach(child => {
      this.calculateStatistics(child, properties);
    });

    var incidents = activity.incidents || [];
    incidents.forEach(incident => {
      var property = properties[incident.activityId];
      if (!property) {
        property = {
          instances: 0,
          incidents: 0,
          finished: 0,
          canceled: 0
        };
        properties[incident.activityId] = property;
      }
      property.incidents++;
    });
  },
  copyArray(source, destination) {
    destination.splice(0, destination.length);
    destination.push.apply(destination, source);
  },

  uuid() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

};
