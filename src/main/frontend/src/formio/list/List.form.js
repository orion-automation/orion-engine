import baseEditForm from "formiojs-eorion/components/_classes/component/Component.form";

import ListEditData from "./editForm/List.edit.data";
import ListEditDisplay from "./editForm/List.edit.display";
export default function(...extend) {
  return baseEditForm([
    {
      key: "data",
      components: ListEditData
    },
    {
      key: "display",
      components: ListEditDisplay
    }
  ], ...extend);
}
