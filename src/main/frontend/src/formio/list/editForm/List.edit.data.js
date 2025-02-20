export default [
    {
        key: "clickEvent",
        data: {
            values: [
                { label: "跳转url", value: "url" },
            ],
        },
        type: "select",
        input: true,
        defaultValue: "url",
        label: "点击相应",
        dataSrc: "values"
    },
    {
        type: "panel",
        title: "数据源",
        collapsible: true,
        collapsed: false,
        components:[
            {
                key: "dataSource",
                data: {
                    values: [
                        { label: "URL", value: "url" },
                    ],
                },
                type: "select",
                input: true,
                defaultValue: "url",
                label: "Data Source",
                dataSrc: "values"
            },
            {
                type: "input",
                label: "Data Source Url",
                key: "data-source-url",
                input: true,
                tooltip: "",
                conditional: {
                    json: { "===": [{ var: "data.dataSource" }, "url"] },
                },
            },
            {
                key: "request.method",
                data: {
                    values: [
                        { label: "GET", value: "GET" },
                        { label: "POST", value: "POST" },
                    ],
                },
                type: "select",
                input: true,
                defaultValue: "GET",
                label: "Request Method",
                dataSrc: "values",
                conditional: {
                    json: { "===": [{ var: "data.dataSource" }, "url"] },
                },
            },
            {
                type: "datagrid",
                input: true,
                label: "Request Headers",
                key: "request.headers",
                defaultValue: [{ key: "", value: "" }],
                components: [
                    {
                        label: "Key",
                        key: "key",
                        input: true,
                        type: "textfield",
                        validate: {
                            required: true
                        }
                    },
                    {
                        label: "Value",
                        key: "value",
                        input: true,
                        type: "textfield",
                        validate: {
                            required: true
                        }
                    },
                ],
                conditional: {
                    json: { "===": [{ var: "data.dataSource" }, "url"] },
                },
            },
            {
                type: "textarea",
                label: "Request Body",
                key: "request.body",
                input: true,
                editor: "ace",
                as: "json",
                placeholder: `{
        "token": "\${data.token}"
      }`,
                tooltip: "输入请求的body(json)",
                conditional: {
                    json: { "===": [{ var: "data.request.method" }, "POST"] },
                },
            },
            {
                type: "textfield",
                input: true,
                label: "Data Path",
                key: "request.dataPath",
                description: "The object path to the iterable items.",
                tooltip: "The property within the source data, where iterable items reside. For example: results.items or results[0].items",
                conditional: {
                    json: { "===": [{ var: "data.dataSource" }, "url"] },
                },
                validate: {
                    required: true
                }
            },
        ]
    },
    {
        type: "panel",
        title: "字段映射",
        collapsible: true,
        collapsed: false,
        components:[
            {
                type: "input",
                label: "Title Key",
                key: "title-key",
                input: true,
                validate: {
                    required: true
                }
            },
            {
                type: "input",
                label: "SubTitle Key",
                key: "sub-title-key",
                input: true,
                validate: {
                    required: true
                }
            },
            {
                type: "input",
                label: "Desc Key",
                key: "desc-key",
                input: true,
                validate: {
                    required: true
                }
            },
            {
                type: "input",
                label: "Mark Key",
                key: "mark-key",
                input: true,
                validate: {
                    required: true
                }
            },
        ]
    },
    {
        type: "input",
        label: "Search Key",
        key: "search-key",
        input: true
    },
    {
        type: "panel",
        title: "分页参数",
        collapsible: true,
        collapsed: false,
        components: [
            {
                type: "input",
                input: true,
                key: "offset-key",
                label: "Offset Key",
                validate: {
                    required: true
                },
            },
            {
                type: "input",
                input: true,
                key: "page-size-key",
                label: "Page Size Key",
                validate: {
                    required: true
                },
            },
            {
                type: "number",
                input: true,
                key: "page-size-value",
                label: "Page Size Value",
                validate: {
                    min: 1
                },
            },
        ]
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
