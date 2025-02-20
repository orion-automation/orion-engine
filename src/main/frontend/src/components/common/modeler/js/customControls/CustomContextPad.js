import {assign} from "min-dash";
import {
    isAny
} from "bpmn-js/lib/features/modeling/util/ModelingUtil";

//自定义节点延伸选项(删除/箭头)
export default class CustomContextPad {
    constructor(config, contextPad, create, elementFactory, injector, translate, modeling, connect, popupMenu, canvas) {
        this.contextPad = contextPad;
        this.create = create;
        this.elementFactory = elementFactory;
        this.translate = translate;
        this.modeling = modeling;
        this.connect = connect;
        this.popupMenu = popupMenu;
        this.canvas = canvas;
        //自动摆放位置
        if (config.autoPlace !== false) {
            this.autoPlace = injector.get("autoPlace", false);
        }
        //注册工具
        contextPad.registerProvider(this);
    }

    getContextPadEntries(element) {
        const {
            canvas,
            contextPad,
            autoPlace,
            create,
            elementFactory,
            translate,
            modeling,
            connect,
            popupMenu,
        } = this;
        var businessObject = element.businessObject;

        function getReplaceMenuPosition(element) {

            var Y_OFFSET = 5;

            var diagramContainer = canvas.getContainer(),
                pad = contextPad.getPad(element).html;

            var diagramRect = diagramContainer.getBoundingClientRect(),
                padRect = pad.getBoundingClientRect();

            var top = padRect.top - diagramRect.top;
            var left = padRect.left - diagramRect.left;

            var pos = {
                x: left,
                y: top + padRect.height + Y_OFFSET
            };

            return pos;
        }

        function appendAction(type, className, title, options) {

            if (typeof title !== "string") {
                options = title;
                title = translate("Append {type}", {type: type.replace(/^bpmn:/, "")});
            }

            function appendStart(event, element) {

                var shape = elementFactory.createShape(assign({type: type}, options));
                create.start(event, shape, {
                    source: element
                });
            }


            var append = autoPlace ? function (event, element) {
                var shape = elementFactory.createShape(assign({type: type}, options));

                autoPlace.append(element, shape);
            } : appendStart;


            return {
                group: "model",
                className: className,
                title: title,
                action: {
                    dragstart: appendStart,
                    click: append
                }
            };
        }

        function startConnect(event, element) {
            connect.start(event, element);
        }

        function appendUserTask(event, element) {
            if (autoPlace) {
                const shape = elementFactory.createShape({type: "bpmn:UserTask"});
                autoPlace.append(element, shape);
            } else {
                appendUserTaskStart(event, element);
            }
        }

        function appendUserTaskStart(event, element) {
            const shape = elementFactory.createShape({type: "bpmn:UserTask"});
            create.start(event, shape, element);
        }

        function appendServiceTask(event, element) {
            if (autoPlace) {
                const shape = elementFactory.createShape({type: "bpmn:ServiceTask"});
                autoPlace.append(element, shape);
            } else {
                appendServiceTaskStart(event, element);
            }
        }

        function appendServiceTaskStart(event, element) {
            const shape = elementFactory.createShape({type: "bpmn:ServiceTask"});
            create.start(event, shape, element);
        }

        function appendTerminateEndEvent(event, element) {
            if (autoPlace) {
                const shape = elementFactory.createShape({type: "bpmn:EndEvent", eventDefinitionType: "bpmn:TerminateEventDefinition"});
                autoPlace.append(element, shape);
            } else {
                appendTerminateEndEventStart(event, element);
            }
        }

        function appendTerminateEndEventStart(event, element) {
            const shape = elementFactory.createShape({type: "bpmn:EndEvent", eventDefinitionType: "bpmn:TerminateEventDefinition"});
            create.start(event, shape, element);
        }

        function appendCallActivityStart(event) {
            const shape = elementFactory.createShape({type: "bpmn:CallActivity"});
            create.start(event, shape, element);
        }

        function appendCallActivity(event, element) {
            if (autoPlace) {
                const shape = elementFactory.createShape({type: "bpmn:CallActivity"});
                autoPlace.append(element, shape);
            } else {
                appendCallActivityStart(event, element);
            }
        }

        function removeElement(e) { // 点击的时候实现删除功能
            modeling.removeElements([element]);
        }

        let actions = {};

        if (element.type === "label") {
            return actions;
        }


        if (
            element.type === "bpmn:ServiceTask"
        ) {
            assign(actions, {
                edit: {
                    group: "edit",
                    className: "bpmn-icon-props-dialog",
                    title: translate("属性"),
                    action: {
                        click:()=>{
                            window.showPropsDialog();
                        }
                    }
                }
            });
        }
        if (
            element.type === "bpmn:UserTask"
        ) {
            assign(actions, {
                edit: {
                    group: "edit",
                    className: "bpmn-icon-form-dialog",
                    title: translate("表单"),
                    action: {
                        click:()=>{
                            window.showUserTaskFormDialog();
                        }
                    }
                }
            });
        }
        if (
            element.type === "bpmn:BusinessRuleTask"
        ) {
            assign(actions, {
                edit: {
                    group: "edit",
                    className: "bpmn-icon-dmn-dialog",
                    title: translate("决策"),
                    action: {
                        click:()=>{
                            window.showDmnDialog();
                        }
                    }
                }
            });
        }

        return actions;
    }
}
CustomContextPad.$inject = [
    "config",
    "contextPad",
    "create",
    "elementFactory",
    "injector",
    "translate",
    "modeling",
    "connect",
    "popupMenu",
    "canvas",
];
