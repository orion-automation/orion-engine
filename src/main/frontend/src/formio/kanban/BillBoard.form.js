import baseEditForm from "formiojs-eorion/components/_classes/component/Component.form";

import BillBoardEditData from "./editForm/BillBoard.edit.data";
import BillBoardEditDisplay from "./editForm/BillBoard.edit.display";
export default function(...extend) {
  return baseEditForm([
    {
      key: "data",
      components: BillBoardEditData
    },
    {
      key: "display",
      components: BillBoardEditDisplay
    }
  ], ...extend);
}
