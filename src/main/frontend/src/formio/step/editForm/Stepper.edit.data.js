export default [
    {
        input: true,
        key: "data_key",
        type: "textfield",
        label: "对应表单字段key",
        clearOnHide: false,
        weight: 0,
        validate: {
            required: true
        }
    },
    {
        type: "datagrid",
        input: true,
        weight: 11,
        label: "数据列表",
        reorder: true,
        key: "items",
        defaultValue: [{ title: "", value: "" }],
        components: [
            {
                label: "对应字段值",
                key: "link_value",
                input: true,
                attributes: {style: "width:150px"},
                type: "textfield",
                validate: {
                    required: true
                }
            },
            {
                label: "顺序",
                key: "value",
                input: true,
                type: "textfield",
                attributes: {style: "width:100px"},
                validate: {
                    required: true
                }
            },
            {
                label: "显示名称",
                key: "title",
                input: true,
                type: "textfield",
                attributes: {style: "width:150px"},
                validate: {
                    required: true
                }
            },
        ],
        validate: {
            required: true
        },
    },
    {
        key: "multiple",
        ignore: true
    },
    {
        key: "defaultValue",
        ignore: true
    },
    {
        key: "persistent",
        ignore: true
    },
    {
        key: "protected",
        ignore: true
    },
    {
        key: "dbIndex",
        ignore: true
    },
    {
        key: "encrypted",
        ignore: true
    },
    {
        key: "clearOnHide",
        ignore: true
    },
    {
        key: "calculateValue-js",
        ignore: true
    },
    {
        key: "customDefaultValue-js",
        ignore: true
    },
    {
        key: "calculateServer",
        ignore: true
    },
    {
        key: "allowCalculateOverride",
        ignore: true
    },
];
