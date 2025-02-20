import baseEditForm from "formiojs-eorion/components/_classes/component/Component.form";

import DataTableEditData from "./editForm/DataTable.edit.data";
import DataTableEditDisplay from "./editForm/DataTable.edit.display";
export default function(...extend) {
  return baseEditForm([
    {
      key: "data",
      components: DataTableEditData
    },
    {
      key: "display",
      components: DataTableEditDisplay
    }
  ], ...extend);
}
