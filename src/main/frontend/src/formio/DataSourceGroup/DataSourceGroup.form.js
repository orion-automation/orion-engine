import componentForm from "formiojs-eorion/components/_classes/component/Component.form";
import DataSourceGroupEditData from "./editForm/DataSourceGroup.edit.data";
export default function(...extend) {
  return componentForm([
    {
      key: "data",
      components: DataSourceGroupEditData
    }
  ], ...extend);
}
