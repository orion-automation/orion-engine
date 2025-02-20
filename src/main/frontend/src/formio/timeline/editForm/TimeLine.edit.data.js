export default [
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
                    required: false
                }
            },
        ]
    },
    {
        type: "panel",
        title: "显示设置",
        collapsible: true,
        collapsed: false,
        components:[
            {
                type: "datagrid",
                input: true,
                label: "columns",
                key: "columns",
                defaultValue: [{ id: 1, label:"ID",value: "id",width:40 }],
                components: [
                    {
                        label: "ID",
                        key: "id",
                        input: true,
                        type: "textfield",
                        validate: {
                            required: true
                        }
                    },
                    {
                        label: "Label",
                        key: "label",
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
                    {
                        label: "expander",
                        key: "expander",
                        input: true,
                        type: "checkbox",
                    },
                    {
                        label: "Width",
                        key: "width",
                        input: true,
                        type: "number",
                        validate: {
                            required: true,min: 1
                        }
                    },
                ],
                conditional: {
                    json: { "===": [{ var: "data.dataSource" }, "url"] },
                },
            },
        ]
    },
    {
        type: "panel",
        title: "字段映射",
        tooltip:"https://github.com/neuronetio/gantt-elastic/wiki/Tasks",
        collapsible: true,
        collapsed: false,
        components:[
            {
                type: "input",
                label: "ID Key",
                key: "id-key",
                input: true,
                validate: {
                    required: true
                }
            },
            {
                type: "input",
                label: "Label Key",
                key: "label-key",
                input: true,
                validate: {
                    required: true
                }
            },
            {
                type: "panel",
                title: "开始时间",
                collapsible: true,
                collapsed: false,
                components:[
                    {
                        type: "input",
                        label: "Start Key",
                        key: "start-key",
                        input: true,
                        validate: {
                            required: true
                        }
                    },
                    {
                        key: "start-data-type",
                        data: {
                            values: [
                                {label: "时间戳", value: "timestamp"},
                                {label: "ISO", value: "iso"},
                            ],
                        },
                        type: "select",
                        input: true,
                        defaultValue: "timestamp",
                        label: "数据类型",
                        dataSrc: "values"
                    },
                ]
            },
            {
                type: "panel",
                title: "持续时间",
                collapsible: true,
                collapsed: false,
                components:[
                    {
                        type: "input",
                        label: "Duration Key",
                        key: "duration-key",
                        input: true
                    },
                    {
                        key: "duration-data-type",
                        data: {
                            values: [
                                {label: "毫秒", value: "milliseconds"},
                                {label: "天", value: "day"},
                            ],
                        },
                        type: "select",
                        input: true,
                        defaultValue: "milliseconds",
                        label: "单位",
                        dataSrc: "values"
                    },
                ]
            },
            {
                type: "input",
                label: "End Key",
                key: "end-key",
                input: true
            },
            {
                type: "input",
                label: "Progress Key",
                key: "progress-key",
                input: true,
                validate: {
                    required: true
                }
            },
            {
                type: "input",
                label: "Type Key",
                key: "type-key",
                input: true,
                validate: {
                    required: true
                }
            },
            {
                type: "input",
                label: "Collapsed Key",
                key: "collapsed-key",
                input: true
            },
            {
                type: "input",
                label: "DependentOn Key",
                key: "dependentOn-key",
                input: true
            },
            {
                type: "input",
                label: "ParentId Key",
                key: "parentId-key",
                input: true
            },
            {
                type: "input",
                label: "Style Key",
                key: "style-key",
                input: true
            },
        ]
    },
    {
        type: "panel",
        title: "点击事件",
        collapsible: true,
        collapsed: true,
        components: [
            {
                key: "operate_type",
                data: {
                    values: [
                        {label: "弹窗", value: "dialog"},
                        {label: "抽屉", value: "drawer"},
                    ],
                },
                type: "select",
                input: true,
                defaultValue: "dialog",
                label: "响应方式",
                dataSrc: "values",
            },
            {
                label: "相关流程Key",
                key: "operate_process_key",
                input: true,
                type: "textfield",
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
