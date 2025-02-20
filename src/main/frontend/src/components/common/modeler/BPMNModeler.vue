<template>
  <v-card style="height: 100%" :id="`dialog-container-${refSuffix}`">
    <v-navigation-drawer
        v-model="setElementDrawer.display"
        right
        absolute
        mobile-breakpoint="0"
        temporary
        width="500"
    >
      <div class="d-flex flex-column" style="height: 100%; padding: 15px">
        <div
            class="d-flex flex-row"
            style="align-items: center; justify-items: center; margin-bottom: 10px"
        >
          <div>便捷设置</div>
          <v-spacer/>
          <v-btn @click="submitDirectSet" color="#FF7754" class="white--text" dense>
            提交
          </v-btn>
        </div>
        <div style="flex: 1; height: 0; overflow-y: scroll">
          <Form id="formData"/>
        </div>
      </div>
    </v-navigation-drawer>
    <v-row style="height: 100%; margin: 0">
      <el-col
          :span="containerSpan"
          :class="`diagram-container-${refSuffix}`"
          :id="`diagram-container-${refSuffix}`"
          class="diagram-container"
          style="height: 100%; padding: 0"
      />
      <el-col :span="24 - containerSpan" style="height: 100%; padding: 0">
        <div :class="`properties-panel-${refSuffix}`" style="height: 100%; overflow-y: auto;border-left: 1px solid rgba(131, 130, 154, 1)"/>
      </el-col>
    </v-row>
    <v-menu
        v-model="propsDialog.display"
        :position-x="propsDialog.position.x"
        :position-y="propsDialog.position.y"
        absolute
        :attach="`#dialog-container-${refSuffix}`"
        min-width="400"
        :close-on-content-click="false"
        offset-y
    >
      <div
          style="background-color: white;box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.13);border-radius: 10px;">
        <v-tabs
            v-model="propsDialog.selectTab"
            style="flex: 0;"
            color="#444262"
        >
          <v-tabs-slider color="#FF7754"/>
          <v-tab key="input">{{ $t('inputTab') }}</v-tab>
          <v-tab key="output">{{ $t('outputTab') }}</v-tab>
        </v-tabs>
        <v-tabs-items
            v-model="propsDialog.selectTab"
        >
          <v-tab-item
              key="input"
              style="max-height: 300px; overflow-y: auto;padding: 5px 15px 15px;"
          >
            <template
                v-if="element&&element.id && configJson &&configJson[element.id]&&configJson[element.id].configJson.inputs"
            >
              <div v-for="input in configJson[element.id].configJson.inputs" :key="`input-${input.key}`">
                <v-textarea
                    v-if="input.type==='textarea'"
                    :label="input.label"
                    @input="onInputChange(input)"
                    :placeholder="input.hint"
                    v-model="input.value"
                />
                <v-text-field
                    v-else
                    :label="input.label"
                    :type="input.type==='number'?'number':'text'"
                    :placeholder="input.hint"
                    @input="onInputChange(input)"
                    @keydown.enter="()=>{}"
                    v-model="input.value"
                />
              </div>
            </template>
          </v-tab-item>
          <v-tab-item
              key="output"
              style="max-height: 300px; overflow-y: auto;padding: 5px 15px 15px;"
          >
            <template
                v-if="element&&element.id&&configJson&&configJson[element.id]&&configJson[element.id].configJson.outputs"
            >
              <div v-for="input in configJson[element.id].configJson.outputs" :key="`output-${input.key}`">
                <v-textarea
                    v-if="input.type==='textarea'"
                    :label="input.label"
                    :placeholder="input.hint"
                    @input="onInputChange(input)"
                    v-model="input.value"
                />
                <v-text-field
                    v-else
                    :label="input.label"
                    :type="input.type==='number'?'number':'text'"
                    :placeholder="input.hint"
                    @input="onInputChange(input)"
                    @keydown.enter="()=>{}"
                    v-model="input.value"
                />
              </div>
            </template>
          </v-tab-item>
        </v-tabs-items>
      </div>
    </v-menu>
    <v-menu
        v-model="userTaskFormDialog.display"
        :position-x="userTaskFormDialog.position.x"
        :position-y="userTaskFormDialog.position.y"
        absolute
        :attach="`#dialog-container-${refSuffix}`"
        min-width="400"
        :close-on-content-click="false"
        offset-y
    >
      <div
          class="d-flex flex-column"
          style="background-color: white;
          padding: 15px 13px;
          box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.13);border-radius: 10px;gap: 20px">
        <div style="color: #312651;font-weight: bold;font-size: 14px;margin-bottom: 20px">{{ $t('formDirectSetting') }}</div>
        <v-combobox v-model="userTaskFormDialog.form.value"
                    :menu-props="{ zIndex: 1000 }"
                    :items="userTaskFormDialog.form.items"
                    :loading="userTaskFormDialog.form.loading"
                    :search-input.sync="userTaskFormDialog.form.searchStr"
                    :item-text="(item) => `${item.name}/${item.externalResourceId}`"
                    @input="submitSetProps"
                    return-object
                    dense
                    :label="$t('searchForm')"
                    hide-details/>
      </div>
    </v-menu>
    <v-menu
        v-model="dmnDialog.display"
        :position-x="dmnDialog.position.x"
        :position-y="dmnDialog.position.y"
        absolute
        :attach="`#dialog-container-${refSuffix}`"
        min-width="400"
        :close-on-content-click="false"
        offset-y
    >
      <div
          class="d-flex flex-column"
          style="background-color: white;
          padding: 15px 13px;
          box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.13);border-radius: 10px;gap: 20px">
        <div style="color: #312651;font-weight: bold;font-size: 14px;margin-bottom: 20px">{{ $t('dmnDirectSetting') }}</div>
        <v-combobox v-model="dmnDialog.form.value"
                    :menu-props="{ zIndex: 1000 }"
                    :items="dmnDialog.form.items"
                    :loading="dmnDialog.form.loading"
                    :search-input.sync="dmnDialog.form.searchStr"
                    :item-text="(item) => `${item.name}/${item.key}/${item.version}`"
                    @input="onDmnDialogFormInput"
                    return-object
                    dense
                    :label="$t('searchDmn')"
                    hide-details/>
        <v-text-field
            v-model="dmnDialog.form.variableName"
            :label="$t('resultSaveInVars')"
            hide-details
            @keydown.enter="()=>{}"
            @input="submitDmnSetProps"
            dense/>
        <v-select
            :items="dmnDialog.dmnMapDecisionResults"
            dense
            hide-details
            @change="submitDmnSetProps"
            :label="$t('resultList')"
            v-model="dmnDialog.form.MapDecisionResult"
        />
      </div>
    </v-menu>
  </v-card>
</template>

<script>
import {isPaste} from "diagram-js/lib/features/keyboard/KeyboardUtil";

import {saveAs} from "file-saver";
import modelerUtils from "@/utils/modeler/modeler";
import Modeler from "camunda-bpmn-js/lib/base/Modeler";
import "camunda-bpmn-js/dist/assets/base-modeler.css";
import "bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css";
import "bpmn-js-color-picker/colors/color-picker.css";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import fileDrop from "file-drops";
import fileOpen from "file-open";
import customControlsModule from "./js/customControls";
import stepPropertiesProvider from "./js/provider/step";
// import propertyInfoPlugin from "./js/provider/propertyInfo/modeler";
// import "./js/provider/propertyInfo/style/style.css";
import scriptEditorPlugin from "./js/provider/camunda-script-editor/module";
import "./js/provider/camunda-script-editor/style/style.css";
import {Form} from "vue-formio-eorion";

import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule,
} from "bpmn-js-properties-panel";
import TokenSimulationModule from "bpmn-js-token-simulation";
import BpmnColorPickerModule from "bpmn-js-color-picker";
import CamundaBpmnModdle from "camunda-bpmn-moddle/resources/camunda.json";
import EorionBpmnModdle from "@/components/common/modeler/js/descriptors/eorion.json";
import elementHelper from "@/components/common/modeler/js/helper/ElementHelper";
import {getExtensionElementsList} from "camunda-bpmn-js/lib/util/ExtensionElementsUtil";
import {
  createCamundaExecutionListenerScript,
  createCamundaInWithBusinessKey,
  createInputParameter,
  createOutputParameter,
} from "@/components/common/modeler/js/helper/CreateHelper";
import {find, isString, keys, without} from "min-dash";
import {is} from "bpmn-js/lib/features/modeling/util/ModelingUtil";
import BpmnHelper from "@/components/common/modeler/js/helper/BpmnHelper";
import camundaRequest from "@/api/camunda-service";
import decisionRequest from "@/api/decision";
// bpmnlint start
import lintModule from "bpmn-js-bpmnlint";
import "bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css";
import bpmnlintConfig from "./.bpmnlintrc";
// bpmnlint end

export default {
  name: "BpmnModeler",
  components: {Form},
  props: {
    diagramXml: {
      type: String,
      required: true,
    },
    exportName: {
      type: String,
      required: true,
    },
    configJson: {
      type: Object,
    },
    parentRefSuffix: {
      type: Number,
    }
  },
  computed: {
    activeActions() {
      return this.nodeActions.filter((action) => action.show);
    },
  },
  data: function () {
    return {
      refSuffix: this.parentRefSuffix || new Date().getTime(),
      modeler: null,
      element: null,
      events: {},
      interval: null,
      setElementDrawer: {
        display: false,
      },
      formValue: {},
      form: {},
      formData: {},
      formKey: "",
      containerSpan: 24,
      aiTaskNodes: [],
      propsDialog: {
        display: false,
        position: {
          x: 500, y: 200
        },
        selectTab: 0,
      },
      userTaskFormDialog: {
        display: false,
        position: {
          x: 500, y: 200
        },
        form: {
          items: [],
          value: null,
          loading: false,
          searchStr: "",
        }
      },
      dmnDialog: {
        display: false,
        position: {
          x: 500, y: 200
        },
        dmnMapDecisionResults: [
          {text: "collectEntries (List<Object>)", value: "collectEntries"},
          {
            text: "resultList (List<Map<String, Object>>)",
            value: "resultList",
          },
          {text: "singleEntry (TypedValue)", value: "singleEntry"},
          {text: "singleResult (Map<String, Object>)", value: "singleResult"},
        ],
        form: {
          items: [],
          value: null,
          loading: false,
          searchStr: "",
          variableName: "",
          MapDecisionResult: "resultList"
        }
      },
    };
  },
  mounted: function () {
    window.showPropsDialog = this.showPropsDialog;
    window.showUserTaskFormDialog = this.showUserTaskFormDialog;
    window.showDmnDialog = this.showDmnDialog;
    this.initModeler();
  },
  beforeDestroy: function () {
    this.modeler.destroy();
    for (var type in this.events) {
      this.removeEvent(type, this.events[type]);
    }
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  },
  watch: {
    "userTaskFormDialog.form.searchStr": {
      async handler(val) {
        let self = this;
        if (!val || val.length === 0) {
          return;
        }

        // Items have already been requested
        if (self.userTaskFormDialog.form.loading) return;

        self.userTaskFormDialog.form.loading = true;
        let items = await camundaRequest.searchResources({
          typesIn: 4,
          nameLike: val,
        });
        self.userTaskFormDialog.form.items = items;
        self.userTaskFormDialog.form.loading = false;
      },
    },
    "dmnDialog.form.searchStr": {
      async handler(val) {
        let self = this;
        if (!val || val.length === 0) {
          return;
        }

        // Items have already been requested
        if (self.dmnDialog.form.loading) return;

        self.dmnDialog.form.loading = true;
        let items = await decisionRequest.getDecisionDefinitionList({
          nameLike: `%${val}%`, sortBy: "version", sortOrder: "desc"
        });
        self.dmnDialog.form.items = items;
        self.dmnDialog.form.loading = false;
      },
    },
    diagramXml: async function (xml) {
      if (!xml || !this.modeler) {
        return;
      }
      try {
        await this.modeler.importXML(xml);
        this.setScriptTaskIcons();
        if (this.configJson) {
          this.setConnectorIcons(this.configJson);
        }
      } catch (err) {
      }
    },
    configJson: {
      handler(val) {
        // 节点属性变化,刷新tag
        this.setConnectorIcons(val);
      },
      deep: true,
    },
  },
  methods: {
    bindKeyboard(){
      this.modeler.get("keyboard").bind(window);
    },
    unbindKeyboard(){
      this.modeler.get("keyboard").unbind();
    },
    setNodeToType(type){
      let self=this;
      let bpmnReplace = self.modeler.get("bpmnReplace");
      const newElementData = {
        type
      };
      this.element = bpmnReplace.replaceElement(this.element, newElementData);
    },
    submitSetProps(val) {
      // 设置form
      let self = this;
      if (typeof val !== "string") {
        self.userTaskFormDialog.form.value = val.externalResourceId;
        self.userTaskFormDialog.form.searchStr = val.externalResourceId;
      }
      let element = self.element;
      let commandStack = self.modeler.get("commandStack");
      let businessObject = self.element.businessObject;
      const commands = [];
      commands.push({
        cmd: "element.updateModdleProperties",
        context: {
          element,
          moddleElement: businessObject,
          properties: {
            "camunda:formKey": self.userTaskFormDialog.form.value,
          }
        }
      });
      commandStack.execute("properties-panel.multi-command-executor", commands);
    },
    onDmnDialogFormInput(val) {
      let self = this;
      if (typeof val !== "string") {
        self.dmnDialog.form.value = val.key;
        self.dmnDialog.form.searchStr = val.key;
      }
      self.submitDmnSetProps();
    },
    submitDmnSetProps() {
      // 设置form
      let self = this;
      let element = self.element;
      let commandStack = self.modeler.get("commandStack");
      let businessObject = self.element.businessObject;
      const commands = [];
      commands.push({
        cmd: "element.updateModdleProperties",
        context: {
          element,
          moddleElement: businessObject,
          properties: {
            "camunda:decisionRef": self.dmnDialog.form.value,
            "camunda:decisionRefBinding": "latest",
            "camunda:resultVariable": self.dmnDialog.form.variableName,
            "camunda:mapDecisionResult": self.dmnDialog.form.MapDecisionResult,
          }
        }
      });
      commandStack.execute("properties-panel.multi-command-executor", commands);
    },
    onInputChange() {
      let self = this;
      // 保存input
      let element = self.element;
      let commandStack = this.modeler.get("commandStack");
      let bpmnFactory = this.modeler.get("bpmnFactory");
      let businessObject = this.element.businessObject;
      let configJson = self.configJson[element.id].configJson;
      const commands = [];
      let extensionElements = businessObject.get("extensionElements");
      let inputOutputs = elementHelper.createElement("camunda:InputOutput", {
        inputParameters: configJson.inputs && configJson.inputs.length > 0 ? configJson.inputs.map(input => {
          return bpmnFactory.create("camunda:InputParameter", {
            name: input.key,
            value: input.value,
          });
        }) : [],
        outputParameters: configJson.outputs && configJson.outputs.length > 0 ? configJson.outputs.map(input => {
          return bpmnFactory.create("camunda:OutputParameter", {
            name: input.key,
            value: input.value,
          });
        }) : []
      }, extensionElements, bpmnFactory);
      commands.push({
        cmd: "element.updateModdleProperties",
        context: {
          element,
          moddleElement: extensionElements,
          properties: {
            values: [
              ...without(extensionElements.get("values"), (value) =>
                  value.$type === "camunda:InputOutput"
              ),
              inputOutputs
            ],
          },
        },
      });
      commands.push(
          this.CreateParameterCmd(
              element,
              "camunda:InputParameter",
              inputOutputs,
              bpmnFactory
          )
      );
      commands.push(
          this.CreateParameterCmd(
              element,
              "camunda:OutParameter",
              inputOutputs,
              bpmnFactory
          )
      );
      commandStack.execute("properties-panel.multi-command-executor", commands);
    },
    showPropsDialog() {
      let self = this;
      let x = self.element.x;
      let y = self.element.y + self.element.height + 20;
      let allMatrix = document.defaultView.getComputedStyle($(`.diagram-container-${self.refSuffix} g.viewport`)[0], null).transform;
      if (allMatrix && allMatrix !== "none") {
        allMatrix = allMatrix.split(",");
        x = x + Number(allMatrix[4].replaceAll(" ", ""));
        y = y + Number(allMatrix[5].replaceAll(" ", "").replaceAll(")", ""));
      }
      this.propsDialog.position = {x: x, y: y};
      if (self.element.id && self.configJson[self.element.id]) {
        let inputs = getExtensionElementsList(self.element.businessObject, "camunda:InputOutput");
        if (inputs.length > 0) {
          inputs = inputs[0];
        }
        if (self.configJson[self.element.id].configJson.inputs) {
          self.configJson[self.element.id].configJson.inputs.forEach(input => {
            let currentIndex = inputs.inputParameters.findIndex(inputXml => inputXml.name === input.key);
            if (currentIndex !== -1) {
              input.value = inputs.inputParameters[currentIndex].value;
            }
            if ((input.value && input.value.length > 0) || input.value === 0) {
            } else {
              input.value = input.defaultValue;
            }
          });
        }
        if (self.configJson[self.element.id].configJson.outputs) {
          self.configJson[self.element.id].configJson.outputs.forEach(input => {
            let currentIndex = inputs.outputParameters.findIndex(inputXml => inputXml.name === input.key);
            if (currentIndex !== -1) {
              input.value = inputs.outputParameters[currentIndex].value;
            }
            if ((input.value && input.value.length > 0) || input.value === 0) {
            } else {
              input.value = input.defaultValue;
            }
          });
        }
      }
      this.propsDialog.display = true;
    },
    async showUserTaskFormDialog() {
      let self = this;
      let x = self.element.x;
      let y = self.element.y + self.element.height + 20;
      let allMatrix = document.defaultView.getComputedStyle($(`.diagram-container-${self.refSuffix} g.viewport`)[0], null).transform;
      if (allMatrix && allMatrix !== "none") {
        allMatrix = allMatrix.split(",");
        x = x + Number(allMatrix[4].replaceAll(" ", ""));
        y = y + Number(allMatrix[5].replaceAll(" ", "").replaceAll(")", ""));
      }
      this.userTaskFormDialog.position = {x: x, y: y};
      if (self.element.id) {
        let formKey = self.element.businessObject.get("camunda:formKey");
        if (formKey) {
          self.userTaskFormDialog.form.value = formKey;
          self.userTaskFormDialog.form.searchStr = formKey;
        } else {
          self.userTaskFormDialog.form.value = null;
          self.userTaskFormDialog.form.searchStr = "";
        }
      }
      this.userTaskFormDialog.display = true;
    },
    showDmnDialog() {
      let self = this;
      let x = self.element.x;
      let y = self.element.y + self.element.height + 20;
      let allMatrix = document.defaultView.getComputedStyle($(`.diagram-container-${self.refSuffix} g.viewport`)[0], null).transform;
      if (allMatrix && allMatrix !== "none") {
        allMatrix = allMatrix.split(",");
        x = x + Number(allMatrix[4].replaceAll(" ", ""));
        y = y + Number(allMatrix[5].replaceAll(" ", "").replaceAll(")", ""));
      }
      this.dmnDialog.position = {x: x, y: y};
      if (self.element.id) {
        let formKey = self.element.businessObject.get("camunda:decisionRef");
        if (formKey) {
          self.dmnDialog.form.value = formKey;
          self.dmnDialog.form.searchStr = formKey;
        } else {
          self.dmnDialog.form.value = "";
          self.dmnDialog.form.searchStr = "";
        }
        formKey = self.element.businessObject.get("camunda:resultVariable");
        if (formKey) {
          self.dmnDialog.form.variableName = formKey;
        } else {
          self.dmnDialog.form.variableName = "";
        }
        formKey = self.element.businessObject.get("camunda:mapDecisionResult");
        if (formKey) {
          self.dmnDialog.form.mapDecisionResult = formKey;
        } else {
          self.dmnDialog.form.mapDecisionResult = "resultList";
        }
      }
      this.dmnDialog.display = true;
    },
    createAiTask(event) {
      let self = this;
      let elementFactory = this.modeler.get("elementFactory");
      let create = this.modeler.get("create");
      var shape = elementFactory.createShape({type: "bpmn:ServiceTask"});
      let id = shape.id;
      if (!self.aiTaskNodes.includes(id)) {
        self.aiTaskNodes.push(id);
      }
      create.start(event, shape);
    },
    setConnectorIcons(configJson) {
      let self = this;
      const elementRegistry = self.modeler.get("elementRegistry");
      let overlays = self.modeler.get("overlays");
      overlays.remove({type: "connector-icon"});
      Object.keys(configJson || {}).forEach((nodeId) => {
        let node = elementRegistry.get(nodeId);
        if (!node) {
          return;
        }
        var property = configJson[nodeId];
        let icon = `fad fa-fw fa-${property.icon}`;
        let overlaysInstances = $(
            `<i
              class="${icon}" style="color: #444262"></i>`
        );
        overlays.add(nodeId, "connector-icon", {
          position: {
            top: 1,
            left: 25,
          },
          html: overlaysInstances,
        });
      });
    },
    setScriptTaskIcons() {
      let self = this;
      const elementRegistry = self.modeler.get("elementRegistry");
      let overlays = self.modeler.get("overlays");
      overlays.remove({type: "script-task-icon"});
      elementRegistry.getAll()
          .filter(element=>element.businessObject.$type==="bpmn:ScriptTask")
          .forEach(element=>{
            let scriptFormat=element.businessObject.scriptFormat;
            if (scriptFormat){
              let overlaysInstances;
              switch (scriptFormat.toLowerCase()){
                case "javascript":
                  overlaysInstances = $(
                      `<i
              class="v-icon notranslate mdi mdi-language-javascript theme--light" style="color: #FF7754"></i>`
                  );
                  break;
                case "python":
                  overlaysInstances = $(
                      `<i
              class="v-icon notranslate mdi mdi-language-python theme--light" style="color: #FF7754"></i>`
                  );
                  break;
                case "groovy":
                  overlaysInstances = $(
                      `<i
              class="v-icon notranslate mdi mdi-alpha-g-box theme--light" style="color: #FF7754"></i>`
                  );
                  break;
              }
              if (overlaysInstances){
                overlays.add(element.businessObject.id, "script-task-icon", {
                  position: {
                    top: 1,
                    left: 25,
                  },
                  html: overlaysInstances,
                });
              }
            }
          });
    },
    // 输出所有节点id
    getAllNodes() {
      let self = this;
      const elementRegistry = self.modeler.get("elementRegistry");
      return elementRegistry.getAll();
    },
    selectNode(id) {
      let self = this;
      const elementRegistry = self.modeler.get("elementRegistry");
      const selection = self.modeler.get("selection");
      const element = elementRegistry.get(id);
      if (element) {
        selection.select(element);
      }
      return element;
    },

    setElementProps(element, props) {
      this.modeler.get("modeling").updateProperties(this.element, props);
    },
    setTypeConnector(element, configJson) {
      let self = this;
      let commandStack = this.modeler.get("commandStack");
      let bpmnFactory = this.modeler.get("bpmnFactory");
      let businessObject = this.element.businessObject;
      const commands = [];
      let extensionElements = businessObject.get("extensionElements");

      // (4.1) remove all connectors on type change
      const connectors = this.getConnectors(businessObject);
      const inputOutputsOld = this.getInputOutputs(businessObject);

      // (4.2) create connector
      // ensure extension elements
      if (!extensionElements) {
        extensionElements = elementHelper.createElement(
            "bpmn:ExtensionElements",
            {values: []},
            businessObject,
            bpmnFactory
        );

        commands.push(
            this.UpdateModdlePropertiesCommand(element, businessObject, {
              extensionElements,
            })
        );
      }

      const connector = elementHelper.createElement(
          "camunda:Connector",
          {connectorId: "http-connector"},
          extensionElements,
          bpmnFactory
      );

      if (configJson.queryTemplate && configJson.queryTemplate.length > 0) {
        configJson.url = configJson.url + "?";
        configJson.queryTemplate.forEach((query) => {
          if (query.type === "value") {
            configJson.url = configJson.url + `${query.key}=${query.value}&`;
          } else {
            configJson.url = configJson.url + `${query.key}=\${${query.value}}&`;
          }
        });
        configJson.url = configJson.url.substring(0, configJson.url.length - 1);
      }
      let inputParameters = [
        bpmnFactory.create("camunda:InputParameter", {
          name: "url",
          value: configJson.url,
        }),
        bpmnFactory.create("camunda:InputParameter", {
          name: "method",
          value: configJson.method,
        }),
        bpmnFactory.create("camunda:InputParameter", {
          name: "headers",
          definition: bpmnFactory.create("camunda:Map", {
            entries: configJson.headerTemplate.map((header) => {
              return bpmnFactory.create("camunda:Entry", {
                key: header.key,
                value: header.type === "value" ? header.value : `\${${header.value}}`,
              });
            }),
          }),
        }),
      ];
      if (configJson.requestBody) {
        try {
          let requestBody = JSON.parse(configJson.requestBody);
          // 扁平化,方便赋值
          requestBody = self.flatten(requestBody);
          configJson.requestBodyTemplate.forEach((bodyValue) => {
            if (bodyValue.type === "value") {
              requestBody[`${bodyValue.key}`] = bodyValue.value;
              if (bodyValue.value.startsWith("\"") && bodyValue.value.endsWith("\"")) {
                // 去掉双引号，作为string
                requestBody[`${bodyValue.key}`] = bodyValue.value.substring(1, bodyValue.value.length - 1);
              } else {
                try {
                  requestBody[`${bodyValue.key}`] = Number(bodyValue.value);
                } catch (e) {
                }
                try {
                  requestBody[`${bodyValue.key}`] = JSON.parse(bodyValue.value);
                } catch (e) {
                }
              }
            } else {
              requestBody[`${bodyValue.key}`] = `\${execution.getVariable("${bodyValue.value}")}`;
            }
          });
          // 还原
          requestBody = self.unflatten(requestBody);
          inputParameters.push(
              bpmnFactory.create("camunda:InputParameter", {
                name: "payload",
                definition: bpmnFactory.create("camunda:Script", {
                  scriptFormat: "JavaScript",
                  value: `const payload = ${JSON.stringify(requestBody).replaceAll(
                      /("\${)([^,]+)(}")/g,
                      "$2"
                  ).replaceAll(/\\"/g, "\"")}
JSON.stringify(payload);`,
                }),
              })
          );
        } catch (e) {
        }
      }
      let outputParameters=[];
      if (configJson.response && configJson.response.length>0){
        outputParameters.push(bpmnFactory.create("camunda:OutputParameter", {
          name: "responseBody",
          definition: bpmnFactory.create("camunda:Script", {
            scriptFormat: "JavaScript",
            value: `const ${configJson.response} = connector.getVariable("response");
S(${configJson.response})`,
          }),
        }));
      }
      if (configJson.statusCode && configJson.statusCode.length>0){
        outputParameters.push(bpmnFactory.create("camunda:OutputParameter", {
          name: `${configJson.statusCode}`,
          definition: bpmnFactory.create("camunda:Script", {
            scriptFormat: "JavaScript",
            value: "connector.getVariable(\"statusCode\");",
          }),
        }));
      }
      let inputOutput = elementHelper.createElement(
          "camunda:InputOutput",
          {
            inputParameters: inputParameters,
            outputParameters: outputParameters,
          },
          connector,
          bpmnFactory
      );

      commands.push({
        cmd: "element.updateModdleProperties",
        context: {
          element: element,
          moddleElement: connector,
          properties: {
            inputOutput,
          },
        },
      });
      // inputs/outputs
      let inputOutputs;
      if (inputOutputsOld.length===0){
        // 新建
        inputOutputs = elementHelper.createElement("camunda:InputOutput", {
          inputParameters: configJson.inputs && configJson.inputs.length > 0 ? configJson.inputs.map(input => {
            return bpmnFactory.create("camunda:InputParameter", {
              name: input.key,
              value: ((input.value && input.value.length > 0) || input.value === 0) ? input.value : input.defaultValue,
            });
          }) : [],
          outputParameters: configJson.outputs && configJson.outputs.length > 0 ? configJson.outputs.map(input => {
            return bpmnFactory.create("camunda:OutputParameter", {
              name: input.key,
              value: ((input.value && input.value.length > 0) || input.value === 0) ? input.value : input.defaultValue,
            });
          }) : []
        }, extensionElements, bpmnFactory);
      } else {
        // 修改已有
        let inputOutputsOldFirst=inputOutputsOld[0];
        inputOutputs = elementHelper.createElement("camunda:InputOutput", {
          inputParameters: inputOutputsOldFirst.inputParameters.map(input=>{
            return bpmnFactory.create("camunda:InputParameter", {
              name: input.name,
              value: input.value,
            });
          }).concat(configJson.inputs && configJson.inputs.length > 0 ? configJson.inputs.map(input => {
            return bpmnFactory.create("camunda:InputParameter", {
              name: input.key,
              value: ((input.value && input.value.length > 0) || input.value === 0) ? input.value : input.defaultValue,
            });
          }) : []),
          outputParameters: inputOutputsOldFirst.inputParameters.map(input=>{
            return bpmnFactory.create("camunda:InputParameter", {
              name: input.name,
              value: input.value,
            });
          }).concat(configJson.outputs && configJson.outputs.length > 0 ? configJson.outputs.map(input => {
            return bpmnFactory.create("camunda:OutputParameter", {
              name: input.key,
              value: ((input.value && input.value.length > 0) || input.value === 0) ? input.value : input.defaultValue,
            });
          }) : [])
        }, extensionElements, bpmnFactory);
      }

      commands.push({
        cmd: "element.updateModdleProperties",
        context: {
          element,
          moddleElement: extensionElements,
          properties: {
            values: [
              ...without(extensionElements.get("values"), (value) =>
                  connectors.includes(value)||inputOutputsOld.includes(value)
              ),
              connector, inputOutputs
            ],
          },
        },
      });

      // (2) create + add parameter
      commands.push(
          this.CreateParameterCmd(
              element,
              "camunda:InputParameter",
              inputOutput,
              bpmnFactory
          )
      );
      commands.push(
          this.CreateParameterCmd(
              element,
              "camunda:OutputParameter",
              inputOutput,
              bpmnFactory
          )
      );
      commands.push(
          this.CreateParameterCmd(
              element,
              "camunda:InputParameter",
              inputOutputs,
              bpmnFactory
          )
      );
      commands.push(
          this.CreateParameterCmd(
              element,
              "camunda:OutputParameter",
              inputOutputs,
              bpmnFactory
          )
      );

      commandStack.execute("properties-panel.multi-command-executor", commands);
    },
    unflatten(data) {
      if (Object(data) !== data || Array.isArray(data)) {
        return data;
      }
      const regex = /\.?([^.\[\]]+)$|\[(\d+)\]$/;
      const props = Object.keys(data);
      let result, p;
      while ((p = props.shift())) {
        const match = regex.exec(p);
        let target;
        if (match.index) {
          const rest = p.slice(0, match.index);
          if (!(rest in data)) {
            data[rest] = match[2] ? [] : {};
            props.push(rest);
          }
          target = data[rest];
        } else {
          if (!result) {
            result = match[2] ? [] : {};
          }
          target = result;
        }
        target[match[2] || match[1]] = data[p];
      }
      return result;
    },
    flatten(data) {
      const result = {};
      const isEmpty = (x) => Object.keys(x).length === 0;
      const recurse = (cur, prop) => {
        if (Object(cur) !== cur) {
          result[prop] = cur;
        } else if (Array.isArray(cur)) {
          const length = cur.length;
          for (let i = 0; i < length; i++) {
            recurse(cur[i], `${prop}[${i}]`);
          }
          if (length === 0) {
            result[prop] = [];
          }
        } else {
          if (!isEmpty(cur)) {
            Object.keys(cur).forEach((key) =>
                recurse(cur[key], prop ? `${prop}.${key}` : key)
            );
          } else {
            result[prop] = {};
          }
        }
      };
      recurse(data, "");
      return result;
    },
    CreateParameterCmd(element, type, parent, bpmnFactory) {
      const isInput = type === "camunda:InputParameter";

      const propertyName = isInput ? "inputParameters" : "outputParameters";
      let params = [...parent.get(propertyName)];
      return {
        cmd: "element.updateModdleProperties",
        context: {
          element,
          moddleElement: parent,
          properties: {
            [propertyName]: params,
          },
        },
      };
    },
    UpdateModdlePropertiesCommand(element, businessObject, newProperties) {
      return {
        cmd: "element.updateModdleProperties",
        context: {
          element,
          moddleElement: businessObject,
          properties: newProperties,
        },
      };
    },
    getConnectors(businessObject) {
      return getExtensionElementsList(businessObject, "camunda:Connector");
    },
    getInputOutputs(businessObject) {
      return getExtensionElementsList(businessObject, "camunda:InputOutput");
    },
    // 会覆盖所有原有listeners,包括已配置的field injection
    updateListeners(listeners) {
      let commandStack = this.modeler.get("commandStack");
      let bpmnFactory = this.modeler.get("bpmnFactory");
      let element = this.element;
      let businessObject = this.element.businessObject;
      let extensionElements = businessObject.get("extensionElements");
      // 更新对应属性
      const commands = [];
      // (1) ensure extension elements
      if (!extensionElements) {
        extensionElements = elementHelper.createElement(
            "bpmn:ExtensionElements",
            {values: []},
            businessObject,
            bpmnFactory
        );

        commands.push({
          cmd: "element.updateModdleProperties",
          context: {
            element,
            moddleElement: businessObject,
            properties: {extensionElements},
          },
        });
      }
      // (2) remove old execution listeners
      const oldExecutionListeners = getExtensionElementsList(
          element.businessObject,
          "camunda:ExecutionListener"
      );
      let newListeners = listeners.map((listener) => {
        // listenerType
        let binding = {
          type: "camunda:executionListener",
          event: listener.event,
        };
        if (listener.configJson.listenerType === "Script") {
          // Script
          binding.scriptFormat = listener.configJson.scriptFormat;
        } else {
          // Expression
        }
        let executionListener = createCamundaExecutionListenerScript(
            binding,
            listener.configJson.scriptCode,
            bpmnFactory
        );
        // let newCamundaFieldInjection=createCamundaFieldInjection({name:"duoAppId",expression:false},`${listener.id}`,bpmnFactory);
        // commandStack.execute("element.updateModdleProperties", {
        //   element,
        //   moddleElement: executionListener,
        //   properties: {
        //     [ "fields" ]: [ ...executionListener.get("fields"), newCamundaFieldInjection ]
        //   }
        // });
        return executionListener;
      });
      commandStack.execute("element.updateModdleProperties", {
        element,
        moddleElement: extensionElements,
        properties: {
          values: [
            ...without(extensionElements.get("values"), (value) =>
                oldExecutionListeners.includes(value)
            ),
            ...newListeners,
          ],
        },
      });
      this.updateExtensionProperty(
          "duoListenerApplicationId",
          listeners.map((listener) => listener.id).join(",")
      );
    },
    updateExtensionProperty(name, value) {
      let commandStack = this.modeler.get("commandStack");
      let bpmnFactory = this.modeler.get("bpmnFactory");
      let element = this.element;
      let businessObject = this.element.businessObject;
      let extensionElements = businessObject.get("extensionElements");
      let properties = getExtensionElementsList(
          this.element.businessObject,
          "camunda:Properties"
      )[0];

      // 更新对应属性
      const commands = [];

      // (1) ensure extension elements
      if (!extensionElements) {
        extensionElements = elementHelper.createElement(
            "bpmn:ExtensionElements",
            {values: []},
            businessObject,
            bpmnFactory
        );

        commands.push({
          cmd: "element.updateModdleProperties",
          context: {
            element,
            moddleElement: businessObject,
            properties: {extensionElements},
          },
        });
      }

      // (2) ensure camunda:Properties
      if (!properties) {
        const parent = extensionElements;

        properties = elementHelper.createElement(
            "camunda:Properties",
            {
              ["values"]: [],
            },
            parent,
            bpmnFactory
        );

        commands.push({
          cmd: "element.updateModdleProperties",
          context: {
            element,
            moddleElement: extensionElements,
            properties: {
              values: [...extensionElements.get("values"), properties],
            },
          },
        });
      }

      // (3) create camunda:Property
      const property = elementHelper.createElement(
          "camunda:Property",
          {
            name: name,
            value: value,
          },
          properties,
          bpmnFactory
      );

      let newValues = [
        ...properties.get("values").filter((value) => value.name !== name),
      ];

      if (value && value.length > 0) {
        newValues.push(property);
      }

      // (4) add property to list
      commands.push({
        cmd: "element.updateModdleProperties",
        context: {
          element,
          moddleElement: properties,
          properties: {
            ["values"]: newValues,
          },
        },
      });

      // (5) commit all updates
      commandStack.execute("properties-panel.multi-command-executor", commands);
    },
    updateExtensionPropertyById(name, value) {
      let commandStack = this.modeler.get("commandStack");
      let bpmnFactory = this.modeler.get("bpmnFactory");
      let element = this.element;
      let businessObject = element.businessObject.get("processRef");
      let extensionElements = businessObject.get("extensionElements");
      let properties = getExtensionElementsList(
          businessObject,
          "camunda:Properties"
      )[0];

      // 更新对应属性
      const commands = [];
      // (1) ensure extension elements
      if (!extensionElements) {
        extensionElements = elementHelper.createElement(
            "bpmn:ExtensionElements",
            {values: []},
            businessObject,
            bpmnFactory
        );

        commands.push({
          cmd: "element.updateModdleProperties",
          context: {
            element,
            moddleElement: businessObject,
            properties: {extensionElements},
          },
        });
      }

      // (2) ensure camunda:Properties
      if (!properties) {
        const parent = extensionElements;

        properties = elementHelper.createElement(
            "camunda:Properties",
            {
              ["values"]: [],
            },
            parent,
            bpmnFactory
        );

        commands.push({
          cmd: "element.updateModdleProperties",
          context: {
            element,
            moddleElement: extensionElements,
            properties: {
              values: [...extensionElements.get("values"), properties],
            },
          },
        });
      }

      // (3) create camunda:Property
      const property = elementHelper.createElement(
          "camunda:Property",
          {
            name: name,
            value: value,
          },
          properties,
          bpmnFactory
      );

      let newValues = [
        ...properties.get("values").filter((value) => value.name !== name),
      ];

      if (value && value.length > 0) {
        newValues.push(property);
      }

      // (4) add property to list
      commands.push({
        cmd: "element.updateModdleProperties",
        context: {
          element,
          moddleElement: properties,
          properties: {
            ["values"]: newValues,
          },
        },
      });

      // (5) commit all updates
      commandStack.execute("properties-panel.multi-command-executor", commands);
    },
    updateCamundaIn(newProperty) {
      let commandStack = this.modeler.get("commandStack");
      let bpmnFactory = this.modeler.get("bpmnFactory");
      let element = this.element;
      let extensionElements = this.element.businessObject.get("extensionElements");

      // (1) ensure extension elements
      if (!extensionElements) {
        extensionElements = elementHelper.createElement(
            "bpmn:ExtensionElements",
            {values: []},
            element.businessObject,
            bpmnFactory
        );

        commandStack.execute("element.updateModdleProperties", {
          element,
          moddleElement: element.businessObject,
          properties: {extensionElements: extensionElements},
        });
      }

      let oldBusinessObject = find(
          extensionElements.get("values"),
          function (oldBusinessObject) {
            return isString(oldBusinessObject.get("businessKey"));
          }
      );
      let newInOrOut;
      let properties = {};
      let newPropertyValue = newProperty.value;

      // (2) update old ins and outs
      if (oldBusinessObject) {
        properties["camunda:businessKey"] = newPropertyValue;
        if (keys(properties)) {
          commandStack.execute("element.updateModdleProperties", {
            element,
            moddleElement: oldBusinessObject,
            properties,
          });
        }
      }
      // (3) add new ins and outs
      else {
        newInOrOut = createCamundaInWithBusinessKey(newPropertyValue, bpmnFactory);

        commandStack.execute("element.updateModdleProperties", {
          element,
          moddleElement: extensionElements,
          properties: {
            values: [...extensionElements.get("values"), newInOrOut,bpmnFactory.create("camunda:Out", {
              variables: "all"
            })],
          },
        });
      }
    },
    // 更新/添加单个InputOutputParameterProperty
    updateInputOutputParameterProperty(newProperty) {
      let commandStack = this.modeler.get("commandStack");
      let bpmnFactory = this.modeler.get("bpmnFactory");
      let element = this.element;
      let businessObject = this.element.businessObject.get("extensionElements");

      // (1) ensure extension elements
      if (!businessObject) {
        businessObject = elementHelper.createElement(
            "bpmn:ExtensionElements",
            {values: []},
            element.businessObject,
            bpmnFactory
        );

        commandStack.execute("element.updateModdleProperties", {
          element,
          moddleElement: element.businessObject,
          properties: {extensionElements: businessObject},
        });
      }

      let inputOutput;

      if (is(businessObject, "camunda:Connector")) {
        inputOutput = businessObject.get("camunda:inputOutput");

        if (!inputOutput) {
          inputOutput = bpmnFactory.create("camunda:InputOutput");

          commandStack.execute("element.updateModdleProperties", {
            element,
            moddleElement: businessObject,
            properties: {
              inputOutput,
            },
          });
        }
      } else {
        inputOutput = getExtensionElementsList(
            this.element.businessObject,
            "camunda:InputOutput"
        )[0];

        if (!inputOutput) {
          inputOutput = bpmnFactory.create("camunda:InputOutput");

          commandStack.execute("element.updateModdleProperties", {
            element,
            moddleElement: businessObject,
            properties: {
              values: [...businessObject.get("values"), inputOutput],
            },
          });
        }
      }

      const oldInputs = inputOutput.get("camunda:inputParameters")
          ? inputOutput.get("camunda:inputParameters").slice()
          : [];

      const oldOutputs = inputOutput.get("camunda:outputParameters")
          ? inputOutput.get("camunda:outputParameters").slice()
          : [];

      let propertyName;

      let oldTemplate = {
        properties: [],
      };
      oldTemplate.properties.push(
          ...oldInputs.map((oldInput) => {
            return {
              binding: {
                name: oldInput.name,
                type: "camunda:inputParameter",
                scriptFormat: oldInput.definition ? oldInput.definition.scriptFormat : null,
              },
              value: oldInput.definition ? oldInput.definition.value : oldInput.value,
            };
          })
      );
      oldTemplate.properties.push(
          ...oldOutputs.map((oldOutput) => {
            return {
              binding: {
                name: oldOutput.name,
                type: "camunda:outputParameter",
                scriptFormat: oldOutput.definition
                    ? oldOutput.definition.scriptFormat
                    : null,
              },
              value: oldOutput.definition ? oldOutput.definition.value : oldOutput.value,
            };
          })
      );
      const oldProperty = BpmnHelper.findOldProperty(oldTemplate, newProperty),
          oldInputOrOutput =
              oldProperty && BpmnHelper.findOldBusinessObject(businessObject, oldProperty),
          newPropertyValue = newProperty.value,
          newBinding = newProperty.binding,
          newBindingType = newBinding.type;

      let newInputOrOutput, properties;
      // (2) update old inputs and outputs
      if (oldProperty && oldInputOrOutput) {
        if (!BpmnHelper.propertyChanged(oldInputOrOutput, oldProperty)) {
          if (is(oldInputOrOutput, "camunda:InputParameter")) {
            properties = {
              value: newPropertyValue,
            };
          } else {
            properties = {
              name: newPropertyValue,
            };
          }

          commandStack.execute("element.updateModdleProperties", {
            element,
            moddleElement: oldInputOrOutput,
            properties,
          });
        }

        if (is(oldInputOrOutput, "camunda:InputParameter")) {
          BpmnHelper.remove(oldInputs, oldInputOrOutput);
        } else {
          BpmnHelper.remove(oldOutputs, oldInputOrOutput);
        }
      }

      // (3) add new inputs and outputs
      else {
        if (newBindingType === "camunda:inputParameter") {
          propertyName = "inputParameters";

          newInputOrOutput = createInputParameter(
              newBinding,
              newPropertyValue,
              bpmnFactory
          );
        } else {
          propertyName = "outputParameters";

          newInputOrOutput = createOutputParameter(
              newBinding,
              newPropertyValue,
              bpmnFactory
          );
        }

        commandStack.execute("element.updateModdleProperties", {
          element,
          moddleElement: inputOutput,
          properties: {
            [propertyName]: [...inputOutput.get(propertyName), newInputOrOutput],
          },
        });
      }
    },
    async submitDirectSet() {
      let self = this;
      try {
        let formResponse = await self.form.submit();
        let formData = formResponse.data;
        switch (this.element.businessObject.$type) {
          case "bpmn:UserTask":
            formData.candidateUsers = formData.candidateUsers.join(",");
            formData.candidateGroups = formData.candidateGroups.join(",");
            let candidateParams = {};
            if (formData.assignee && formData.assignee.length > 0) {
              candidateParams.assignee = formData.assignee;
            }
            if (formData.candidateUsers && formData.candidateUsers > 0) {
              candidateParams.candidateUsers = !Array.isArray(formData.candidateUsers)
                  ? formData.candidateUsers
                  : formData.candidateUsers.join(",");
            }
            if (formData.candidateGroups && formData.candidateGroups.length > 0) {
              candidateParams.candidateGroups = !Array.isArray(formData.candidateGroups)
                  ? formData.candidateGroups
                  : formData.candidateGroups.join(",");
            }
            self.modeler.get("modeling").updateProperties(this.element, candidateParams);
            // multi instance
            let isMultiInstance =
                this.element.businessObject &&
                this.element.businessObject.loopCharacteristics &&
                this.element.businessObject.loopCharacteristics.$type ===
                "bpmn:MultiInstanceLoopCharacteristics";
            if (isMultiInstance) {
              const modeling = this.modeler.get("modeling");
              const bpmnFactory = this.modeler.get("bpmnFactory");
              modeling.updateProperties(this.element, {
                loopCharacteristics: Object.assign(
                    this.element.businessObject.loopCharacteristics,
                    {
                      collection: formData.collection,
                      elementVariable: formData.elementVariable,
                    }
                ),
              });
              // let extensionElements = bpmnFactory.create("bpmn:MultiInstanceLoopCharacteristics",
              //     {
              //       collection: formData.collection,
              //       elementVariable: formData.elementVariable,
              //     });
              let completionCondition = bpmnFactory.create("bpmn:FormalExpression", {
                body: formData.completionCondition,
              });
              this.element.businessObject.loopCharacteristics.completionCondition = completionCondition;
              // completionCondition.$parent=this.element.businessObject.loopCharacteristics;
              if (modeling) {
                modeling.updateProperties(this.element, {
                  loopCharacteristics: this.element.businessObject.loopCharacteristics,
                });
              }
            }
            break;
          case "bpmn:ServiceTask":
            break;
          case "bpmn:BusinessRuleTask":
            break;
          case "bpmn:CallActivity":
            break;
        }
        self.setElementDrawer.display = false;
      } catch (err) {
        console.log(err);
        let errString = "";
        err.forEach((e) => {
          if (errString == "") {
            errString += `【${e.message.replace(" is required", "")}】必填`;
          } else {
            errString += `,【${e.message.replace(" is required", "")}】`;
          }
        });
        self.$notify.error(errString);
      }
    },
    setShowProperty(show) {
      if (show) {
        this.containerSpan = 14;
      } else {
        this.containerSpan = 24;
      }
    },
    // getElements() {
    //   var rootElement = this.modeler.get("canvas").getRootElement();
    //   return rootElement.children.filter(
    //     (element) => element.type === "bpmn:SequenceFlow"
    //   );
    // },
    async initModeler(language) {
      let self=this;
      function createReviver(moddle) {
        var elCache = {};

        /**
         * The actual reviewer that creates model instances
         * for elements with a $type attribute.
         *
         * Elements with ids will be re-used, if already
         * created.
         *
         * @param  {String} key
         * @param  {Object} object
         *
         * @return {Object} actual element
         */
        return function (key, object) {
          if (typeof object === "object" && object && typeof object.$type === "string") {
            var objectId = object.id;

            if (objectId && elCache[objectId]) {
              return elCache[objectId];
            }

            var type = object.$type;
            var attrs = Object.assign({}, object);

            delete attrs.$type;

            var newEl = moddle.create(type, attrs);

            if (objectId) {
              elCache[objectId] = newEl;
            }

            return newEl;
          }

          return object;
        };
      }

      const CopyModule = {
        __init__: ["nativeCopyPaste"],
        nativeCopyPaste: [
          "type",
          function (keyboard, eventBus, moddle, clipboard) {
            // persist into local storage whenever
            // copy took place
            eventBus.on("copyPaste.elementsCopied", (event) => {
              const {tree} = event;

              // persist in local storage, encoded as json
              localStorage.setItem("bpmnClipboard", JSON.stringify(tree));
            });

            // intercept global paste keybindings and
            // inject reified pasted stack
            keyboard.addListener(2000, (event) => {
              const {keyEvent} = event;

              if (!isPaste(keyEvent)) {
                return;
              }

              // retrieve from local storage
              const serializedCopy = localStorage.getItem("bpmnClipboard");

              if (!serializedCopy) {
                return;
              }

              // parse tree, reinstantiating contained objects
              const parsedCopy = JSON.parse(serializedCopy, createReviver(moddle));


              // put into clipboard
              clipboard.set(parsedCopy);
            });
          },
        ],
      };

      if (this.modeler) {
        this.modeler.destroy();
      }

      const TranslateModule = {
        translate: ["value", modelerUtils.customTranslate],
      };

      const additionalModules = [
        customControlsModule,
        TokenSimulationModule,
        BpmnColorPickerModule,
        CopyModule,
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        CamundaPlatformPropertiesProviderModule,
        stepPropertiesProvider,
        scriptEditorPlugin,
        lintModule
      ];
      if (language) {
        additionalModules.push(TranslateModule);
      }
      this.modeler = new Modeler({
        container: `.diagram-container-${this.refSuffix}`,
        linting: {
          bpmnlint: bpmnlintConfig
        },
        propertiesPanel: {
          parent: $(`#properties-panel-${this.refSuffix}`).length>0?`#properties-panel-${this.refSuffix}`:`.properties-panel-${this.refSuffix}`,
        },
        additionalModules,
        keyboard: {
          bindTo: window,
        },
        moddleExtensions: {
          camunda: CamundaBpmnModdle,
          eorion: EorionBpmnModdle,
        },
      });
      // this.modeler.get("keyboard").addListener(2000, (event) => {
      //   const {keyEvent} = event;
      //
      //   console.log("paste on:",self.refSuffix,event.keyEvent.key,event.keyEvent.code);
      //   if (!isPaste(keyEvent)) {
      //     return;
      //   }
      //
      //   console.log("paste on:",self.refSuffix);
      //   // retrieve from local storage
      //   // const serializedCopy = localStorage.getItem("bpmnClipboard");
      //   //
      //   // if (!serializedCopy) {
      //   //   return;
      //   // }
      //   //
      //   // // parse tree, reinstantiating contained objects
      //   // const parsedCopy = JSON.parse(serializedCopy, createReviver(moddle));
      //   //
      //   //
      //   // // put into clipboard
      //   // clipboard.set(parsedCopy);
      // });
      // window.modeler = this.modeler;
      this.setup();

      var eventBus = this.modeler.get("eventBus");

      // eventBus.on("copyPaste.elementsCopied", (event) => {
      //   const {tree} = event;
      //
      //   // persist in local storage, encoded as json
      //   localStorage.setItem("bpmnClipboard", JSON.stringify(tree));
      // });

      eventBus.on("selection.changed", (e) => {
        var rootElement = this.modeler.get("canvas").getRootElement();
        if (modelerUtils.isImplicitRoot(rootElement)) {
          return;
        }
        var element = e.newSelection.length ? e.newSelection[0] : rootElement;
        this.element = element;
        var businessObject = element.businessObject;
        this.$emit("onClickNode", element);

        // 是否是aiTask选中
        if (this.aiTaskNodes.includes(element.id)) {
          this.$emit("onAiTaskCreated", {});
          this.aiTaskNodes = this.aiTaskNodes.filter(nodeId => nodeId !== element.id);
        }

        let documentation = "";
        if (businessObject.get("documentation").length) {
          documentation = element.businessObject.get("documentation")[0].text || "";
        }

        this.documentation = documentation;
      });
      eventBus.on("commandStack.changed", (e) => {
        // 发生可回退的编辑
        this.$emit("onCommandStackChanged");
      });
      eventBus.on("elements.changed", (e) => {
        // 元素改变
        this.setScriptTaskIcons();
        this.$emit("onCommandStackChanged");
      });
      if (this.diagramXml) {
        await this.modeler.importXML(this.diagramXml);
      }
    },
    setDocumentation(value) {
      modelerUtils.setDocumentation(this.modeler, this.element, value);
    },
    async getXML(doExport) {
      let result = await this.modeler.saveXML({format: true});
      if (doExport) {
        var blob = new Blob([result.xml], {type: "text/xml"});
        saveAs(blob, `${this.exportName}.bpmn`);
      }

      return result.xml;
    },
    async getSVG(doExport) {
      let result = await this.modeler.saveSVG();
      if (doExport) {
        var blob = new Blob([result.svg]);
        saveAs(blob, `${this.exportName}.svg`);
      }
      return result.svg;
    },
    openDiagram(diagram) {
      return this.modeler
          .importXML(diagram)
          .then(({warnings}) => {
            if (warnings.length) {
              console.warn(warnings);
            }
          })
          .catch((err) => {
            console.error(err);
          });
    },
    openFile(files) {
      if (!files.length) {
        return;
      }
      this.openDiagram(files[0].contents);
    },

    setup() {
      const handleDragOver = fileDrop("Open BPMN diagram", this.openFile);

      const handleKeys = (event) => {
        if (event.code === "KeyS" && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();

          if (this.modeler.get("keyboard").getBinding()){
            this.$emit("saveByModelerKeyboard");
          }
        }

        if (event.code === "KeyO" && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          if (this.modeler.get("keyboard").getBinding()){
            fileOpen().then(this.openFile);
          }
        }
      };

      for (var type in this.events) {
        this.removeEvent(type, this.events[type]);
      }

      this.addEvent("keydown", handleKeys);
      this.addEvent("dragover", handleDragOver);
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    },
    addEvent(type, handler) {
      document.body.addEventListener(type, handler);
      this.events[type] = handler;
    },
    removeEvent(type, handler) {
      document.body.removeEventListener(type, handler);
      delete this.events[type];
    },
  },
};
</script>

<style scoped>
/*/deep/ .bio-properties-panel-header {*/
/*  z-index: 0;*/
/*}*/

/*/deep/ .bio-properties-panel-group-header {*/
/*  z-index: 0;*/
/*}*/

/deep/ .djs-overlay-context-pad {
  z-index: 6;
}

div.diagram-container {
  background-color: rgba(232, 239, 247, 16);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  display: -webkit-flex;
}

/** file-drops */

.drop-message {
  position: absolute;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #efefef;
  border-radius: 2px;
  padding: 6px 12px;
  font-size: 16px;
  color: #212121;
  user-select: none;
}

.drop-message.error {
  background: #dd7373;
}

.drop-overlay {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  padding: 50px;

  background: rgba(255, 255, 255, 0.9);

  z-index: 1000;
}

.drop-overlay .box {
  text-align: center;
  border: dashed 4px #ccc;
  height: 100%;
  width: 100%;
  display: table;
}

.drop-overlay .label {
  font-size: 26px;
  color: #888;
  margin: auto;

  display: table-cell;
  vertical-align: middle;
}
</style>
