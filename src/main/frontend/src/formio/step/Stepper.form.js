import baseEditForm from "formiojs-eorion/components/_classes/component/Component.form";

import StepperEditData from "./editForm/Stepper.edit.data";
import StepperEditDisplay from "./editForm/Stepper.edit.display";
export default function(...extend) {
    return baseEditForm([
        {
            key: "data",
            components: StepperEditData
        },
        {
            key: "display",
            components: StepperEditDisplay
        }
    ], ...extend);
}
