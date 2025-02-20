import baseEditForm from "formiojs-eorion/components/_classes/component/Component.form";

import TimeLineEditData from "./editForm/TimeLine.edit.data";
import TimeLineEditDisplay from "./editForm/TimeLine.edit.display";
export default function(...extend) {
  return baseEditForm([
    {
      key: "data",
      components: TimeLineEditData
    },
    {
      key: "display",
      components: TimeLineEditDisplay
    }
  ], ...extend);
}
