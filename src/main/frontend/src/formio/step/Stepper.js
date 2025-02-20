import Vue from "vue";
import { Formio } from "vue-formio-eorion";
import Stepper from "@/formio/step/Stepper.vue";
import StepperEditForm from "@/formio/step/Stepper.form";
import vuetify from "@/plugins/vuetify";
import _ from "lodash";

const StepperComponent = Vue.extend(Stepper);

const FieldComponent = Formio.Components.components.field;

export class StepperFormIOComponent extends FieldComponent {

    render(children) {
        return super.render(this.renderTemplate("qrCode"));
    }

    attach(element) {
        this.stepperComponentInstance=new StepperComponent({
            propsData: {
                component: this.component,
                instance: this,
                rootValue: this.rootValue,
            },
            vuetify
        });
        this.stepperComponentInstance.$mount(element.querySelector("#qr-code-container"));
        setTimeout(() => {
            this.setValue("");
        }, 100);
        return super.attach(element);
    }

    static schema(...extend) {
        return FieldComponent.schema({
            type: "stepper",
            label: "Stepper",
            key: "stepper",
            data: {
                url: "",
            },
        }, ...extend);
    }

    static get builderInfo() {
        return {
            title: "Stepper",
            group: "basic",
            icon: "arrow-progress",
            weight: 81,
            documentation: "/userguide/forms/form-components#stepper",
            schema: StepperFormIOComponent.schema()
        };
    }

    setValue(value){
        this.stepperComponentInstance.setValue(_.get(this.rootValue,this.component["data_key"]));
    }
}

StepperFormIOComponent.editForm = StepperEditForm;
