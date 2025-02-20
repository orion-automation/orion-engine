export function isWeChat() {
  let ua = window.navigator.userAgent.toLowerCase();
  let matched = ua.match(/MicroMessenger/i);
  return !!matched && matched.toString() === "micromessenger";
}

export function isWorkWeChat() {
  let ua = window.navigator.userAgent.toLowerCase();
  let matched = ua.match(/wxwork/i);
  return !!matched && matched.toString() === "wxwork";
}

export function isBase64(str) {
  str = String(str);
  if (str.indexOf("data:") != -1 && str.indexOf("base64") != -1) {
    return true;
  } else {
    return false;
  }
}

export async function getBase64(file) {
  return new Promise(function(resolve, reject) {
    let reader = new FileReader();
    let imgResult = "";
    reader.readAsDataURL(file);
    reader.onload = function() {
      imgResult = reader.result;
    };
    reader.onerror = function(error) {
      reject(error);
    };
    reader.onloadend = function() {
      resolve(imgResult);
    };
  });
};

export function buildDraft(data, formData) {
  let result = {};
  Object.keys(data).forEach((key) => {
    let value = data[key];
    let field = findField(key, formData);
    if (field) {
      result[key] = value;
    }
  });
  return result;
};

export function findField(key, components) {
  for (let i = 0; i < components.length; i++) {
    let component = components[i];
    if (component.key === key) {
      return component;
    }
    if (component.components) {
      let child = findField(key, component.components);
      if (child) {
        return child;
      }
    }
    if (component.columns) {
      for (let j = 0; j < component.columns.length; j++) {
        let column = component.columns[j];
        if (column.components) {
          let child = findField(key, column.components);
          if (child) {
            return child;
          }
        }
      }

    }
  }
  return null;
};

/**
 * 删除不在表单中的数据
 * @param allProps 表单所有结构数据
 * @param formData 获取到的数据
 * @param parentKey 当前value的所有上级路径 ex:list.tables.kpis
 */
export function filterFormKey(allProps, formData, parentKey) {
  Object.keys(formData).forEach(key => {
    let value = formData[`${key}`];
    let valueKey= parentKey ? `${parentKey}.${key}` : key;
    if (allProps.findIndex(item => item === valueKey) === -1) {
      // 属性不在表单内，删除
      delete formData[`${key}`];
    } else {
      // 会误删掉object类型的组件(selectBoxes)数据，所以去掉
      // if (typeof value === "object") {
      //   // obj/array
      //   if (Array.isArray(value)) {
      //     value.forEach(item => {
      //       filterFormKey(allProps, item, valueKey);
      //     });
      //   } else {
      //     filterFormKey(allProps, value, valueKey);
      //   }
      // }
    }
  });
}


export function formatVariables(formData) {
  var variables = {};
  for (var item in formData) {
    if (typeof formData[item] == "object") {
      if (Array.isArray(formData[item])) {
        variables[item] = {
          value: JSON.stringify(formData[item]),
          type: "Object",
          valueInfo: {
            objectTypeName: "java.util.ArrayList",
            serializationDataFormat: "application/json"
          }
        };
      } else {
        variables[item] = {
          value: JSON.stringify(formData[item]),
          type: "Object",
          valueInfo: {
            objectTypeName: "java.util.Map",
            serializationDataFormat: "application/json"
          }
        };
      }
    } else if (typeof formData[item] == "boolean") {
      variables[item] = {
        value: JSON.stringify(formData[item]),
        type: "Boolean"
      };
    } else if (typeof formData[item] == "number") {
      if (formData[item] == parseInt(formData[item])) {
        variables[item] = {
          value: JSON.stringify(formData[item]),
          type: "Integer"
        };
      } else if (formData[item] == parseFloat(formData[item])) {
        variables[item] = {
          value: JSON.stringify(formData[item]),
          type: "Double"
        };
      }
    } else {
      if (isBase64(formData[item])) {
        let fileType = JSON.stringify(formData[item]).match(
          /data:(\S*);/
        )[1];
        variables[item] = {
          value: JSON.stringify(formData[item]).split(",")[1],
          type: "File",
          valueInfo: {
            filename:
              Date.parse(new Date()) +
              "." +
              fileType.match(/\/(\S*)/)[1],
            mimeType: fileType
          }
        };
      } else {
        variables[item] = {
          value: formData[item],
          type: "String"
        };
      }
    }
  }
  return variables;
}
