export default [
  {
    key: "multiple",
    ignore: true,
  },
  {
    key: "defaultValue",
    ignore: true,
  },
  {
    key: "persistent",
    ignore: true,
  },
  {
    key: "protected",
    ignore: true,
  },
  {
    key: "dbIndex",
    ignore: true,
  },
  {
    key: "encrypted",
    ignore: true,
  },
  {
    key: "customDefaultValue",
    ignore: true,
  },
  {
    key: "calculateValue",
    ignore: true,
  },
  {
    key: "calculateServer",
    ignore: true,
  },
  {
    key: "allowCalculateOverride",
    ignore: true,
  },
  {
    type: "panel",
    title: "请求参数",
    collapsible: true,
    collapsed: true,
    weight:0,
    components: [
      {
        label:"type",
        key: "params_type",
        type: "textfield",
        input: true,
      },
    ]
  },
];
