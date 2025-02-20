export default [
    {
        type: "input",
        label: "Table Title",
        key: "table-title",
        weight: 10,
        input: true
    },
    {
        type: "checkbox",
        label: "启用 group by",
        key: "table-enable-group-by",
        weight: 10,
        tooltip: "group by的具体字段名称在列设置分组",
        defaultValue: false,
    },
    {
        type: "panel",
        title: "数据源",
        weight: 10,
        collapsible: true,
        collapsed: true,
        components: [
            {
                key: "dataSource",
                data: {
                    values: [
                        {label: "URL", value: "url"},
                        {label: "nocoDB", value: "noco_db"},
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
                    json: {
                        in: [
                            {var: "data.dataSource"},
                            [
                                "url",
                                "noco_db",
                            ],
                        ],
                    },
                },
            },
            {
                key: "request.method",
                data: {
                    values: [
                        {label: "GET", value: "GET"},
                        {label: "POST", value: "POST"},
                    ],
                },
                type: "select",
                input: true,
                defaultValue: "GET",
                label: "Request Method",
                dataSrc: "values",
                conditional: {
                    json: {
                        in: [
                            {var: "data.dataSource"},
                            [
                                "url",
                                "noco_db",
                            ],
                        ],
                    },
                },
            },
            {
                type: "datagrid",
                input: true,
                label: "Request Headers",
                key: "request.headers",
                defaultValue: [{key: "", value: ""}],
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
                    json: {
                        in: [
                            {var: "data.dataSource"},
                            [
                                "url",
                                "noco_db",
                            ],
                        ],
                    },
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
                    json: {
                        in: [
                            {var: "data.dataSource"},
                            [
                                "url",
                                "noco_db",
                            ],
                        ],
                    },
                },
            },
            {
                type: "textfield",
                input: true,
                label: "Table Data Path",
                key: "request.dataPath",
                description: "The object path to the iterable items.",
                tooltip: "The property within the source data, where iterable items reside. For example: results.items or results[0].items",
                conditional: {
                    json: {
                        in: [
                            {var: "data.dataSource"},
                            [
                                "url",
                                "noco_db",
                            ],
                        ],
                    },
                },
            },
        ]
    },
    {
        type: "panel",
        title: "搜索设置",
        weight: 10,
        collapsible: true,
        collapsed: true,
        components: [
            {
                type: "datagrid",
                input: true,
                label: "nocoDb conditions",
                key: "data.noco_db_conditions",
                weight: 11,
                components: [
                    {
                        label: "Logical Operator",
                        key: "logical_operator",
                        input: true,
                        type: "select",
                        data: {
                            values: [
                                {label: "~or", value: "~or"},
                                {label: "~and", value: "~and"},
                                {label: "~not", value: "~not"}
                            ],
                        },
                    },
                    {
                        label: "Name",
                        key: "name",
                        input: true,
                        type: "textfield",
                    },
                    {
                        label: "Operator",
                        key: "operator",
                        input: true,
                        type: "select",
                        data: {
                            values: [
                                {label: "equal", value: "eq"},
                                {label: "not equal", value: "neq"},
                                {label: "not equal (alias of neq)", value: "not"},
                                {label: "greater than", value: "gt"},
                                {label: "greater or equal", value: "ge"},
                                {label: "less than", value: "lt"},
                                {label: "less or equal", value: "le"},
                                {label: "is", value: "is"},
                                {label: "is not", value: "isnot"},
                                {label: "in", value: "in"},
                                {label: "between", value: "btw"},
                                {label: "not between", value: "nbtw"},
                                {label: "like", value: "like"},
                                {label: "is Within (Available in Date and DateTime only)", value: "isWithin"},
                                {label: "includes all of", value: "allof"},
                                {label: "includes any of", value: "anyof"},
                                {
                                    label: "does not include all of (includes none or some, but not all of)",
                                    value: "nallof"
                                },
                                {label: "does not include any of (includes none of)", value: "nanyof"}
                            ],
                        },
                    },
                    {
                        label: "Value",
                        key: "value",
                        input: true,
                        type: "textfield",
                        tooltip: "nocoDb 查询参数值，有值时取当前输入值，否则取表格搜索框的输入值",
                    },
                ],
                conditional: {
                    json: {
                        in: [
                            {var: "data.dataSource"},
                            [
                                "noco_db",
                            ],
                        ],
                    },
                },
            },
            {
                type: "input",
                label: "Search Key",
                key: "search-key",
                input: true,
                conditional: {
                    json: {
                        in: [
                            {var: "data.dataSource"},
                            [
                                "url",
                            ],
                        ],
                    },
                },
            },
        ]
    },
    {
        type: "panel",
        title: "分页参数",
        weight: 11,
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
                type: "input",
                input: true,
                key: "total-count-path",
                label: "Total Count Path",
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
        type: "panel",
        title: "表格操作",
        weight: 11,
        collapsible: true,
        collapsed: true,
        components: [
            {
                key: "table_operate_type",
                data: {
                    values: [
                        {label: "弹窗", value: "dialog"},
                        {label: "抽屉", value: "drawer"},
                    ],
                },
                type: "select",
                input: true,
                defaultValue: "dialog",
                label: "表格操作方式",
                dataSrc: "values",
            },
            {
                type: "datagrid",
                input: true,
                label: "按钮功能",
                key: "table_operate",
                defaultValue: [
                    {column_key: "create", column_show_title: "创建", column_process_key: "", column_hide: false, column_lock_drawer: false}
                ],
                disableAddingRemovingRows: true,
                components: [
                    {
                        label: "操作",
                        key: "column_key",
                        input: true,
                        type: "textfield",
                        disabled: true,
                        validate: {
                            required: true
                        },
                    },
                    {
                        label: "按钮名称",
                        key: "column_show_title",
                        input: true,
                        type: "textfield",
                        attributes: {style: "width:150px"},
                    },
                    {
                        label: "相关流程Key",
                        key: "column_process_key",
                        input: true,
                        type: "textfield",
                        attributes: {style: "width:150px"},
                    },
                    {
                        label: "隐藏",
                        key: "column_hide",
                        type: "checkbox",
                    },
                    {
                        label: "锁定抽屉",
                        key: "column_lock_drawer",
                        type: "checkbox",
                    },
                ],
            },
            {
                type: "datagrid",
                input: true,
                label: "编辑设置",
                reorder: true,
                key: "table_operate_more",
                defaultValue: [],
                disableAddingRemovingRows: false,
                components: [
                    {
                        label: "按钮名称",
                        key: "column_show_title",
                        input: true,
                        type: "textfield",
                    },
                    {
                        label: "相关流程Key",
                        key: "column_process_key",
                        input: true,
                        type: "textfield",
                    },
                    {
                        label: "锁定抽屉",
                        key: "column_lock_drawer",
                        type: "checkbox",
                        defaultValue: false,
                    },
                ],
            },
            {
                type: "panel",
                title: "行单击事件",
                collapsible: true,
                collapsed: true,
                components: [
                    {
                        key: "table_row_operate_type",
                        data: {
                            values: [
                                {label: "弹窗", value: "dialog"},
                                {label: "抽屉", value: "drawer"},
                            ],
                        },
                        type: "select",
                        input: true,
                        defaultValue: "dialog",
                        label: "操作方式",
                        dataSrc: "values",
                    },
                    {
                        label: "相关流程Key",
                        key: "table_row_process_key",
                        input: true,
                        type: "textfield",
                    },
                    {
                        label: "锁定抽屉",
                        key: "table_row_click_lock_drawer",
                        type: "checkbox",
                        defaultValue: false,
                    },
                ]
            },
        ]
    },
    {
        type: "panel",
        title: "列设置",
        weight: 11,
        collapsible: true,
        collapsed: true,
        components: [
            {
                label: "默认全部隐藏",
                key: "column_hide_all",
                type: "checkbox",
                defaultValue: false,
            },
            {
                type: "datagrid",
                input: true,
                key: "column_set",
                initEmpty: true,
                reorder: true,
                weight: 11,
                components: [
                    {
                        label: "字段key",
                        key: "column_key",
                        input: true,
                        type: "textfield",
                        attributes: {style: "width:150px"},
                        validate: {
                            required: true
                        },
                    },
                    {
                        label: "显示名称",
                        key: "column_show_title",
                        input: true,
                        attributes: {style: "width:150px"},
                        type: "textfield",
                    },
                    {
                        label: "数据显示类型",
                        key: "column_show_type",
                        input: true,
                        type: "select",
                        attributes: {style: "width:150px"},
                        data: {
                            values: [
                                {label: "金额", value: "amount"},
                                {label: "badge", value: "badge"},
                                {label: "Email", value: "email"},
                                {label: "资源", value: "resource"},
                            ],
                        },
                    }, {
                        label: "默认颜色",
                        tableView: true,
                        key: "column_show_type_color",
                        defaultValue:"#ff7754",
                        attributes: {style: "width:100px"},
                        type: "textfield",
                        input: true,
                        conditional: {
                            json: { "===": [{ var: "row.column_show_type" }, "badge"] },
                        },
                    },{
                        label: "自定义颜色",
                        key: "column_show_type_color_custom",
                        defaultValue:"{}",
                        type: "textarea",
                        attributes: {style: "width:300px;"},
                        input: true,
                        conditional: {
                            json: { "===": [{ var: "row.column_show_type" }, "badge"] },
                        },
                    },
                    {
                        label: "操作方式",
                        tableView: true,
                        key: "column_operate_type",
                        data: {
                            values: [
                                {label: "弹窗", value: "dialog"},
                                {label: "抽屉", value: "drawer"},
                            ],
                        },
                        type: "select",
                        input: true,
                        defaultValue: "dialog",
                        dataSrc: "values",
                        conditional: {
                            json: { "===": [{ var: "row.column_show_type" }, "resource"] },
                        },
                    },
                    {
                        label: "相关流程Key",
                        key: "column_operate_process_key",
                        input: true,
                        type: "textfield",
                        attributes: {style: "width:150px"},
                        conditional: {
                            json: { "===": [{ var: "row.column_show_type" }, "resource"] },
                        },
                    },
                    {
                        label: "锁定抽屉",
                        key: "column_lock_drawer",
                        type: "checkbox",
                        defaultValue: false,
                        conditional: {
                            json: { "===": [{ var: "row.column_show_type" }, "resource"] },
                        },
                    },
                    {
                        label: "隐藏列",
                        key: "column_hide",
                        type: "checkbox",
                    },
                    {
                        label: "可排序",
                        key: "column_sortable",
                        type: "checkbox",
                    },
                    {
                        label: "分组",
                        key: "column_group_by",
                        type: "checkbox",
                    },
                ],
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
