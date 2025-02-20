import Vue from "vue";
import { Formio } from "vue-formio-eorion";
import DataTable from "@/formio/dataTable/DataTable.vue";
import vuetify from "@/plugins/vuetify";
import store from "@/store";
import i18n from "@/i18n";
import DataTableEditForm from "@/formio/dataTable/DataTable.form";

const DataTableComponent = Vue.extend(DataTable);

const FieldComponent = Formio.Components.components.field;

export class DataTableFormIOComponent extends FieldComponent {

    render(children) {
        return super.render(this.renderTemplate("qrCode"));
    }

    attach(element) {
        new DataTableComponent({
            i18n,
            store,
            propsData: {
                component: this.component,
                instance: this,
                rootValue: this.rootValue,
            },
            vuetify
        }).$mount(element.querySelector("#qr-code-container"));
        return super.attach(element);
    }

    static schema(...extend) {
        return FieldComponent.schema({
            type: "datatable",
            label: "DataTable",
            key: "datatable",
            data: {
                url: "",
            },
        }, ...extend);
    }

    static get builderInfo() {
        return {
            title: "Data Table",
            group: "basic",
            icon: "table",
            weight: 81,
            documentation: "/userguide/forms/form-components#datatable",
            schema: DataTableFormIOComponent.schema()
        };
    }
}

DataTableFormIOComponent.editForm = DataTableEditForm;
