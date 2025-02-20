<template>
  <v-card style="height: 100%">
    <div class="diagram-menu">
      <div class="d-flex flex-row" style="gap: 20px;align-items: center">
        <v-btn icon @click="$emit('closeDialog')" v-if="showClose" style="margin-top: 19px;margin-left: 15px">
          <v-icon size="14">mdi-close</v-icon>
        </v-btn>
        <v-switch
            color="#312651"
            class="type-switch"
            hide-details
            inset
            v-model="showProperty"
            flat
        >
          <template #label>
            <span style="color: #83829a;font-size: 14px">{{ $t('propertyPanel') }}</span
            >
          </template>
        </v-switch>
        <v-switch
            color="#312651"
            hide-details
            class="type-switch"
            v-model="language"
            flat
            inset
            @change="changeLanguage()"
        >
          <template #label>
                    <span v-if="language" style="font-size: 14px"
                    ><span style="font-weight: bold; color: #444262">中文</span
                    ><span style="color: #83829a">/EN</span></span
                    >
            <span v-else style="font-size: 14px"
            ><span style="font-weight: bold; color: #444262">EN</span
            ><span style="color: #83829a">/中文</span></span
            >
          </template>
        </v-switch>
        <v-btn
            text
            @click="getXML(true)"
            style="
          border-right: 0 solid rgba(187, 187, 187, 1);
          margin: 18px 0 0 -10px;
        "
        >
          <v-icon size="16" color="#83829A" style="margin-right: 6px">
            mdi-download
          </v-icon>
          <span style="color: #444262; font-size: 14px">{{ $t('download') }}</span>
        </v-btn>
      </div>
    </div>

    <el-row style="height: 100%; margin: 0">
      <el-col
          :span="showProperty ? 16 : 24"
          class="diagram-container"
          id="diagram-container"
          style="height: 100%; padding: 0"
      />
      <el-col :span="showProperty ? 8 : 0" style="height: 100%; padding: 0">
        <div class="properties-panel" style="height: 100%; overflow-y: auto"/>
      </el-col>
    </el-row>
  </v-card>
</template>

<script>
import modelerUtils from "@/utils/modeler/modeler";
import Modeler from "camunda-bpmn-js/lib/base/Modeler";
import "camunda-bpmn-js/dist/assets/base-modeler.css";
import "bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css";
import "bpmn-js-color-picker/colors/color-picker.css";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import stepPropertiesProvider from "@/components/common/modeler/js/provider/step";
import scriptEditorPlugin from "@/components/common/modeler/js/provider/camunda-script-editor/module";
import fileDrop from "file-drops";
import fileOpen from "file-open";

import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule,
} from "bpmn-js-properties-panel";
import CamundaBpmnModdle from "camunda-bpmn-moddle/resources/camunda.json";
import EorionBpmnModdle from "@/components/common/modeler/js/descriptors/eorion.json";

export default {
  name: "BpmnModeler",
  components: {},
  props: {
    diagramXml: {
      type: String,
      required: true,
    },
    showClose: {
      type: Boolean,
      default: false,
    }
  },
  computed: {},
  data: function () {
    return {
      language: false,
      showProperty: true,
      modeler: null,
      events: {},
      interval: null,
      setElementDrawer: {
        display: false,
      },
      formValue: {},
      form: {},
      formData: {},
      formKey: "",
    };
  },
  mounted: function () {
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
    diagramXml: async function (xml) {
      if (!xml || !this.modeler) {
        return;
      }
      try {
        await this.modeler.importXML(xml);
      } catch (err) {
      }
    },
  },
  methods: {
    async changeLanguage() {
      await this.initModeler(this.language);
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
    // getElements() {
    //   var rootElement = this.modeler.get("canvas").getRootElement();
    //   return rootElement.children.filter(
    //     (element) => element.type === "bpmn:SequenceFlow"
    //   );
    // },
    setShowProperty(value) {
      this.showProperty = value;
    },
    async initModeler(language) {
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
          if (typeof object === "object" && typeof object.$type === "string") {
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

      if (this.modeler) {
        this.modeler.destroy();
      }

      const TranslateModule = {
        translate: ["value", modelerUtils.customTranslate],
      };

      const additionalModules = [
        {
          bendpoints: ["value", ""], // 禁止拖动线
          paletteProvider: ["value", ""], // 禁用左侧面板
          contextPadProvider: ["value", ""], // 禁止点击节点出现contextPad
          labelEditingProvider: ["value", ""], // 禁止双击节点出现label编辑框
        },
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        CamundaPlatformPropertiesProviderModule,
        stepPropertiesProvider,
        scriptEditorPlugin,
      ];
      if (language) {
        additionalModules.push(TranslateModule);
      }
      this.modeler = new Modeler({
        container: "#diagram-container",
        propertiesPanel: {
          parent: ".properties-panel",
        },
        additionalModules,
        keyboard: {
          bindTo: document.body,
        },
        moddleExtensions: {
          camunda: CamundaBpmnModdle,
        },
      });

      window.modeler = this.modeler;
      this.setup();

      var eventBus = this.modeler.get("eventBus");

      eventBus.on("selection.changed", (e) => {
        var rootElement = this.modeler.get("canvas").getRootElement();
        if (modelerUtils.isImplicitRoot(rootElement)) {
          return;
        }
        var element = e.newSelection.length ? e.newSelection[0] : rootElement;
        this.element = element;
        var businessObject = element.businessObject;

        this.$emit("onClickNode", element);

        let documentation = "";
        if (businessObject.get("documentation").length) {
          documentation =
              element.businessObject.get("documentation")[0].text || "";
        }

        this.documentation = documentation;
      });
      if (this.diagramXml) {
        await this.modeler.importXML(this.diagramXml);
      }
    },
    setDocumentation(value) {
      modelerUtils.setDocumentation(this.modeler, this.element, value);
    },

    setup() {
      const handleDragOver = fileDrop("Open BPMN diagram", this.openFile);

      const handleKeys = (event) => {
        if (event.code === "KeyS" && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();

          this.getXML(true);
        }

        if (event.code === "KeyO" && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();

          fileOpen().then(this.openFile);
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
      setInterval(() => {
        this.$emit("save", {isAuto: true});
      }, 10 * 60 * 1000);
    },
    addEvent(type, handler) {
      document.body.addEventListener(type, handler);
      this.events[type] = handler;
    },
    removeEvent(type, handler) {
      document.body.removeEventListener(type, handler);
      delete this.events[type];
    },
    async getXML(doExport) {
      let result = await this.modeler.saveXML({format: true});
      if (doExport) {
        var blob = new Blob([result.xml], {type: "text/xml"});
        saveAs(blob, "export.bpmn");
      }

      return result.xml;
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

/deep/ #xmlContainer .vue-codemirror .CodeMirror {
  overscroll-y: scroll !important;
  height: 100% !important;
}

div.diagram-container {
  background-color: #f3f4f9;
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

.diagram-menu {
  position: absolute;
  top: 0;
  left: 10px;
  z-index: 100;
}

/deep/ .diagram-menu .v-icon.v-icon {
  font-size: 18px;
}
</style>
