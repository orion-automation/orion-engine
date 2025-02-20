export default [
    {
        input: true,
        key: "width",
        type: "textfield",
        label: "宽度",
        clearOnHide: false,
        weight: 0
    },
    {
        key: "orientation",
        data: {
            values: [
                { label: "水平", value: "horizontal" },
                { label: "垂直", value: "vertical" },
            ],
        },
        weight:10,
        type: "select",
        input: true,
        defaultValue: "horizontal",
        label: "方向",
        dataSrc: "values"
    },
    {
        key: "step_label_position",
        weight:10,
        data: {
            values: [
                { label: "右侧", value: "right" },
                { label: "底部", value: "bottom" },
            ],
        },
        type: "select",
        input: true,
        defaultValue: "right",
        label: "组件标签位置",
        dataSrc: "values"
    },
    {
        type: "panel",
        title: "颜色和图标",
        weight:10,
        collapsible: true,
        collapsed: true,
        components:[
            {
                type: "panel",
                title: "未完成",
                collapsible: true,
                collapsed: false,
                components:[
                    {
                        type: "input",
                        label: "颜色",
                        key: "undo_color",
                        input: true,
                        tooltip: "",
                        defaultValue:"#B1ABB6"
                    }
                ]
            },
            {
                type: "panel",
                title: "已完成",
                collapsible: true,
                collapsed: false,
                components:[
                    {
                        type: "input",
                        label: "颜色",
                        key: "finished_color",
                        input: true,
                        tooltip: "",
                        defaultValue:"#FF7754"
                    },
                    {
                        type: "input",
                        label: "图标(mdi)",
                        key: "finished_icon",
                        input: true,
                        tooltip: "mdi图标",
                    },
                ]
            },
        ]
    },
];
