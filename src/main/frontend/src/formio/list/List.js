import Vue from "vue";
import { Formio } from "vue-formio-eorion";
import List from "@/formio/list/List.vue";
import ListEditForm from "@/formio/list/List.form";
import vuetify from "@/plugins/vuetify";

const ListComponent = Vue.extend(List);

const FieldComponent = Formio.Components.components.field;

export class ListFormIOComponent extends FieldComponent {

    render(children) {
        return super.render(this.renderTemplate("qrCode"));
    }

    attach(element) {
        new ListComponent({
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
            type: "list",
            label: "List",
            key: "list",
            data: {
                url: "",
            },
        }, ...extend);
    }

    static get builderInfo() {
        return {
            title: "List",
            group: "basic",
            icon: "list",
            weight: 81,
            documentation: "/userguide/forms/form-components#list",
            schema: ListFormIOComponent.schema()
        };
    }
}

ListFormIOComponent.editForm = ListEditForm;
