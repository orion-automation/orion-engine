import Vue from "vue";
import { Formio } from "vue-formio-eorion";
import TimeLine from "@/formio/timeline/TimeLine.vue";
import vuetify from "@/plugins/vuetify";
import TimeLineEditForm from "@/formio/timeline/TimeLine.form";

const TimeLineComponent = Vue.extend(TimeLine);

const FieldComponent = Formio.Components.components.field;

export class TimeLineFormIOComponent extends FieldComponent {

    render(children) {
        return super.render(this.renderTemplate("qrCode"));
    }

    attach(element) {
        new TimeLineComponent({
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
            type: "timeline",
            label: "TimeLine",
            key: "timeline",
            data: {
                url: "",
            },
        }, ...extend);
    }

    static get builderInfo() {
        return {
            title: "TimeLine",
            group: "basic",
            icon: "timeline",
            weight: 81,
            documentation: "/userguide/forms/form-components#timeline",
            schema: TimeLineFormIOComponent.schema()
        };
    }
}

TimeLineFormIOComponent.editForm = TimeLineEditForm;
