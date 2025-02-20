import editForm from "@/formio/DataSourceGroup/DataSourceGroup.form";
import { Formio } from "vue-formio-eorion";
import store from "@/store";
import {  getBasicToken } from "@/utils/auth";

const FieldComponent = Formio.Components.components.field;

export class DataSourceGroupFormIOComponent extends FieldComponent {

  static schema(...extend) {
    return FieldComponent.schema({
      label: "Data Source Group",
      key: "dataSourceGroup",
      type: "dataSourceGroup",
      clearOnHide: false,
      hidden: false,
      hideLabel: true,
    }, ...extend);
  }

  static get builderInfo() {
    return {
      title: "Data Source Group",
      icon: "th-list",
      group: "data",
      documentation: "/userguide/forms/data-components#data-map",
      weight: 20,
      schema: DataSourceGroupFormIOComponent.schema()
    };
  }

  render(children) {
    return super.render(this.renderTemplate("qrCode"));
  }

  /**
   * After the html string has been mounted into the dom, the dom element is returned here. Use refs to find specific
   * elements to attach functionality to.
   *
   * @param element
   * @returns {Promise}
   */
  attach(element) {
    const refs = {};

    this.loadRefs(element, refs);

    return super.attach(element);
  }

  /**
   * Get the value of the component from the dom elements.
   *
   * @returns {Array}
   */
  getValue() {
    return this.dataValue;
  }

  setValue(value) {
    var canvas = this.element.querySelector("#qr-code-container");
    canvas.innerHTML = "";
    let self=this;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `${process.env.VUE_APP_BASE_API}/group?member=${store.state.user.profile.id}`, true);
    xhr.responseType = "json";
    xhr.setRequestHeader("Authorization", getBasicToken());

    xhr.onload = function() {
      var status = xhr.status;

      if (status === 200) {
        self.dataValue=xhr.response.map(item=>item.id).join(",");
      }
    };
    xhr.send();
    return true;
  }
}

DataSourceGroupFormIOComponent.editForm = editForm;
