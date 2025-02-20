import {find, includes} from 'lodash';
import {getScriptType, getScriptFormat} from './props/ScriptProps';
import {getBusinessObject} from 'bpmn-js/lib/util/ModelUtil';
import {
    getScriptLanguage, getScriptType as getConditionalScriptType
} from './props/ConditionalProps';

var cm = require("./lib/codemirror.js")
require("./lib/codemirror/groovy.js")
require("./lib/codemirror/javascript.js")
require("./addon/edit/matchbrackets.js")
require("./addon/hint/show-hint.js")
require("./addon/hint/javascript-hint.js")
require("./addon/hint/anyword-hint.js")
require("./addon/edit/closebrackets.js")
require("./addon/dialog/dialog.js")
require("./addon/search/searchcursor.js")
require("./addon/search/search.js")
require("./addon/scroll/annotatescrollbar.js")
require("./addon/search/matchesonscrollbar.js")
require("./addon/search/jump-to-line.js")
require("./addon/selection/active-line.js")
require("./addon/search/match-highlighter.js")
require("./addon/display/autorefresh")
require("./addon/lint/lint")
require("./addon/lint/javascript-lint")
require("./addon/lint/lint.css")
require("./addon/fold/foldcode")
require("./addon/fold/foldgutter")
require("./addon/fold/brace-fold")
require("./addon/fold/comment-fold")

const LOW_PRIORITY = 499;
const SUPPORTED_LANGUAGES = ['groovy', 'javascript'];

/**
 * A bpmn-js extension service, providing the actual，面板分组改变时初始化/更新codemirror
 * plug-in feature.
 */
function PluginService(propertiesPanel, eventBus, canvas,translate) {

    this.getGroups = function (element) {
        return function (groups) {
            const businessObject = getBusinessObject(element);
            let scriptGroup = find(groups, entry => entry.id === 'CamundaPlatform__Script');
            if (scriptGroup && getScriptType(element) === 'script') {
                let scriptGroupFormat = getScriptFormat(businessObject);
                if (!scriptGroupFormat || scriptGroupFormat.length === 0) {
                    scriptGroupFormat = "javascript";
                }
                if (includes(SUPPORTED_LANGUAGES, scriptGroupFormat.toLowerCase())) {
                    setTimeout(initCodeEditor, 50);
                }
            }

            let conditionGroup = find(groups, entry => entry.id === 'CamundaPlatform__Condition');
            if (conditionGroup && getConditionalScriptType(element) === 'script') {
                let conditionGroupFormat = getScriptLanguage(businessObject);
                if (!conditionGroupFormat || conditionGroupFormat.length === 0) {
                    conditionGroupFormat = "javascript";
                }
                if (includes(SUPPORTED_LANGUAGES, conditionGroupFormat.toLowerCase())) {
                    setTimeout(initCodeEditor, 50);
                }
            }

            // I/O Params
            let inputGroup = find(groups, entry => entry.id === 'CamundaPlatform__Input');
            if (inputGroup) {
                decorateGroup(inputGroup);
            }
            let outputGroup = find(groups, entry => entry.id === 'CamundaPlatform__Output');
            if (outputGroup) {
                decorateGroup(outputGroup);
            }
            let connectorInputGroup = find(groups, entry => entry.id === 'CamundaPlatform__ConnectorInput');
            if (connectorInputGroup) {
                decorateGroup(connectorInputGroup);
            }
            let connectorOutputGroup = find(groups, entry => entry.id === 'CamundaPlatform__ConnectorOutput');
            if (connectorOutputGroup) {
                decorateGroup(connectorOutputGroup);
            }
            // Listeners
            let taskListenerGroup = find(groups, entry => entry.id === 'CamundaPlatform__TaskListener');
            if (taskListenerGroup) {
                decorateGroup(taskListenerGroup);
            }
            let execListenerGroup = find(groups, entry => entry.id === 'CamundaPlatform__ExecutionListener');
            if (execListenerGroup) {
                decorateGroup(execListenerGroup);
            }
            return groups;
        }
    }

    propertiesPanel.registerProvider(LOW_PRIORITY, this);

    function decorateGroup(group) {
        group.items.map(item => {
            let scriptValue = find(item.entries, entry => entry.id.endsWith('scriptValue'));
            if (scriptValue) {
                let scriptObject = scriptValue.script;
                let scriptFormat = scriptObject.get('scriptFormat');
                if (!scriptFormat || scriptFormat.length === 0) {
                    scriptFormat = "javascript";
                }
                if (includes(SUPPORTED_LANGUAGES, scriptFormat.toLowerCase())) {
                    setTimeout(initCodeEditor, 50);
                }
            }
        });
    }

    function removeEditor() {
        [...document.getElementsByClassName("CodeMirror")].map(n => n && n.remove());
        [...document.getElementsByClassName("plugin-editor")].map(n => n && n.remove());
        [...document.getElementsByClassName("native-editor")].map(n => n && n.remove());
    }

    function getId() {
        return Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36)
    }

    function initCodeEditor() {
        document.querySelectorAll(`textarea[id*="scriptValue"]`).forEach(originalTA => {
            if (originalTA === undefined || originalTA.attributes === undefined || originalTA.style.display == 'none') {
                if (originalTA && originalTA.attributes && originalTA.attributes['custom-id']) {
                    document.querySelectorAll('.CodeMirror').forEach(item => {
                        if (item.CodeMirror.options.customId === originalTA.getAttribute('custom-id')) {
                            let editor = item.CodeMirror;
                            if (editor.getValue() !== originalTA.value) {
                                editor.setValue(originalTA.value);
                            }
                        }
                    });
                }
                return
            }

            var textAreaId = getId();
            var myTextArea = document.createElement('textarea')
            myTextArea.setAttribute('id', 'myTextArea-' + textAreaId)
            myTextArea.setAttribute('class', 'custom-textarea')
            myTextArea.setAttribute('style', 'display:block')

            // bio-properties-panel-scriptFormat
            let scriptFormatNode = originalTA.parentNode.parentNode.parentNode.querySelectorAll(`input[id*="scriptFormat"]`)[0];
            let scriptFormat = scriptFormatNode.value;
            if (!scriptFormat || scriptFormat.length === 0) {
                scriptFormat = "javascript";
            }
            scriptFormat = scriptFormat.toLowerCase();
            originalTA.setAttribute('custom-id', textAreaId)
            originalTA.setAttribute("style", "display:none")

            originalTA.parentNode.insertBefore(myTextArea, originalTA)

            // 添加ide按钮(有custom-id之后再添加expand按钮，传入custom-id值，修复相同节点导致expand之后的编辑器内容重复的问题)
            originalTA.parentNode.querySelectorAll(`label[for*="scriptValue"]`).forEach(label => {
                let textAreaId = label.getAttribute("for");
                // bio-properties-panel-scriptFormat
                let scriptFormatNode = label.parentNode.parentNode.parentNode.querySelectorAll(`input[id*="scriptFormat"]`)[0];
                let scriptFormat = scriptFormatNode.value;
                if (!scriptFormat || scriptFormat.length === 0) {
                    scriptFormat = "javascript";
                }
                let customId=label.parentNode.querySelectorAll(`textarea[id*="scriptValue"]`)[0];
                customId = customId.getAttribute('custom-id');
                scriptFormat = scriptFormat.toLowerCase();
                if (label.innerHTML.endsWith("Script")) {
                    // 初次
                    label.insertAdjacentHTML("beforeend", `<div style="display: flex;width: 0;flex: 1">
<div style="flex: 1"></div><button id="btn-edit-code-${textAreaId}" class="btn-edit-code" onclick="window.openCode({textAreaId:'${textAreaId}',customId:'${customId}',scriptFormat:'${scriptFormat}'})" type="button">${translate('Expand')}</button>
</div>`);
                } else {
                    // 重新设置button的click，因为scriptFormat有可能改变
                    label.querySelector(`#btn-edit-code-${textAreaId}`).onclick=function () {
                        window.openCode({textAreaId:`${textAreaId}`,customId:`${customId}`,scriptFormat:`${scriptFormat}`});
                    };
                }
            });

            cm.commands.autocompletejavascript = function (codeMirror) {
                codeMirror.showHint({hint: cm.hint.javascript});
            }
            cm.commands.autocompletegroovy = function (codeMirror) {
                codeMirror.showHint({hint: cm.hint.groovy});
            }
            var myCodeMirror = cm(function (elt) {
                myTextArea.parentNode.replaceChild(elt, myTextArea);
            }, {
                autoRefresh: true,
                value: originalTA !== null ? originalTA.value : "",
                lineNumbers: true,
                mode: scriptFormat,
                customId: textAreaId,
                theme: "material-ocean",
                hintOptions: {completeSingle: false},
                matchBrackets: true,
                autoCloseBrackets: true,
                highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true},
                lint: {options: {esversion: 2021}},
                foldGutter: true,
                gutters: [
                    "CodeMirror-lint-markers",
                    "CodeMirror-linenumbers",
                    "CodeMirror-foldgutter"
                ],
            });
            scriptFormatNode.onchange = function () {
                // 切换编辑器模式
                let scriptFormat = scriptFormatNode.value;
                if (!scriptFormat || scriptFormat.length === 0) {
                    scriptFormat = "javascript";
                }
                scriptFormat = scriptFormat.toLowerCase();
                if (includes(SUPPORTED_LANGUAGES, scriptFormat)) {
                    myCodeMirror.setOption("mode", scriptFormat);
                }
            }

            // autocomplete only on alphabets, numbers, and (.) with an exception of ctrl key pressed
            myCodeMirror.on("keyup", function (cm, event) {
                if (!(event.ctrlKey) && (event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 97 && event.keyCode <= 122) || (event.keyCode >= 46 && event.keyCode <= 57)) {
                    let scriptFormat = scriptFormatNode.value;
                    if (!scriptFormat || scriptFormat.length === 0) {
                        scriptFormat = "javascript";
                    }
                    scriptFormat = scriptFormat.toLowerCase();
                    myCodeMirror.execCommand(`autocomplete${scriptFormat}`);
                }
            });

            myCodeMirror.on('change', function (cMirror) {
                writeToNativeEditor(cMirror);
            });

            myCodeMirror.on('paste', function (cMirror) {
                writeToNativeEditor(cMirror);
            });
        });

    }

    function writeToNativeEditor(cMirror) {
        // bio-properties-panel-Activity_1stog2t-executionListener-0scriptValue
        var cmEditor = document.querySelector('textarea[id*="scriptValue"][custom-id="' + cMirror.options.customId + '"]')
        if (cmEditor.value === cMirror.getValue()) {
            return;
        }
        cmEditor.value = cMirror.getValue();
        var evt = document.createEvent("Events");
        evt.initEvent("input", true, true);
        cmEditor.dispatchEvent(evt);
    }
}


PluginService.$inject = ["propertiesPanel", 'eventBus', 'canvas','translate'];


/**
 * The service and it's dependencies, exposed as a bpmn-js module.
 *
 * --------
 *
 * WARNING: This is an example plug-in.
 *
 * Make sure you rename the plugin and the name it is exposed (PLEASE_CHANGE_ME)
 * to something unique.
 *
 * --------
 *
 */
export default {
    __init__: ['CAMUNDA_SCRIPT_EDITOR'], CAMUNDA_SCRIPT_EDITOR: ['type', PluginService]
};
