import Vue from "vue";
import { Formio } from "vue-formio-eorion";
import BillBoard from "@/formio/kanban/BillBoard.vue";
import vuetify from "@/plugins/vuetify";
import store from "@/store";
import i18n from "@/i18n";

import BillBoardEditForm from "@/formio/kanban/BillBoard.form";
import DataTableEditForm from "@/formio/dataTable/DataTable.form";
import {DataTableFormIOComponent} from "@/formio/dataTable/DataTable";

const BillBoardComponent = Vue.extend(BillBoard);

const FieldComponent = Formio.Components.components.field;

export class BillBoardFormIOComponent extends FieldComponent {

    render(children) {
        return super.render(this.renderTemplate("qrCode"));
    }

    attach(element) {
        new BillBoardComponent({
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
            type: "billboard",
            label: "BillBoard",
            key: "billboard",
            data: {
                url: "",
            },
        }, ...extend);
    }

    static get builderInfo() {
        return {
            title: "Bill Board",
            group: "basic",
            icon: "clapperboard",
            weight: 81,
            documentation: "/userguide/forms/form-components#billboard",
            schema: BillBoardFormIOComponent.schema()
        };
    }
}

BillBoardFormIOComponent.editForm = BillBoardEditForm;

