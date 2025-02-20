<template>
  <v-card style="height: 100%">
    <v-row style="height: 100%; margin: 0">
      <el-col
          :span="containerSpan"
          class="diagram-container"
          :class="`diagram-container-${refSuffix}`"
          style="height: 100%; padding: 0"
      />
      <el-col :span="24 - containerSpan" style="height: 100%; padding: 0">
        <div :class="`properties-panel-${refSuffix}`" style="height: 100%; overflow-y: auto;;border-left: 1px solid rgba(131, 130, 154, 1)"/>
      </el-col>
    </v-row>
  </v-card>
</template>

<script>
import { CamundaPlatformModeler as DmnModeler } from "camunda-dmn-js";
import "camunda-dmn-js/dist/assets/camunda-platform-modeler.css";
import {
  DmnPropertiesPanelModule,
  DmnPropertiesProviderModule,
  CamundaPropertiesProviderModule,
} from "dmn-js-properties-panel";
// a descriptor that defines Camunda related DMN 1.1 XML extensions
import CamundaDmnModdle from "camunda-dmn-moddle/resources/camunda.json";
import "dmn-js-properties-panel/dist/assets/properties-panel.css";

export default {
  name: "VueDMNModeler",
  props: {
    diagramXml: {
      type: String,
      required: true,
    },
    options: {
      type: Object,
    },
    outPutRules: {
      type: Array,
      required: false,
    },
    defaultShowTable: {
      type: String,
      required: false,
    },
    canViewDrd: {
      type: Boolean,
      default: true,
      required: false
    },
    canViewTable: {
      type: Boolean,
      default: true,
      required: false
    },
    parentRefSuffix: {
      type: Number,
    }
  },
  data: function () {
    return {
      refSuffix: this.parentRefSuffix || new Date().getTime(),
      // 是否正在载入xml
      onLoadingXml: true,
      zoomType: 0,
      containerSpan: 24,
    };
  },
  mounted: function () {
    let self = this;
    let _options = Object.assign(
        {
          container: `.diagram-container-${this.refSuffix}`,
          drd: {
            propertiesPanel: {
              parent: $(`#properties-panel-${this.refSuffix}`).length>0?`#properties-panel-${this.refSuffix}`:`.properties-panel-${this.refSuffix}`,
            },
          },
          keyboard: {
            bindTo: window
          },
          moddleExtensions: {
            camunda: CamundaDmnModdle
          }
        },
        this.options
    );
    this.dmnModeler = new DmnModeler(_options);
    this.dmnModeler.on("views.changed",(e)=>{
      self.dmnModeler.getActiveViewer().get("eventBus").on("elements.changed", (e) => {
        // 发生可回退的编辑
        self.$emit("onCommandStackChanged");
      });
    });
    this.dmnModeler.on("import.done", async function (event) {
      let error = event.error;
      let warnings = event.warnings;
      if (error) {
        self.$emit("error", error);
      } else {
        let activeEditor = self.dmnModeler.getActiveViewer();
        var eventBus = activeEditor.get("eventBus");

        var events = ["element.click"];

        if (activeEditor._definitions) {
          self.$emit("onClickNode", {
            type: activeEditor._definitions.$type,
            businessObject: activeEditor._definitions
          });
        } else {
          self.$emit("onClickNode", activeEditor);
        }
        events.forEach(function (event) {
          eventBus.on(event, function (e) {
            if (event === "element.click") {
              self.$emit("onClickNode", e.element);
            }
          });
        });
        // apply initial logic in DRD view
        if (activeEditor.type === "drd") {
          // access active editor components
          var canvas = activeEditor.get("canvas");
          // zoom to fit full viewport
          canvas.zoom("fit-viewport");
        }
        self.onLoadingXml = false;
        self.$emit("shown", warnings);
      }
    });
    if (this.diagramXml) {
      self.onLoadingXml = true;
      try {
        self.dmnModeler.importXML(this.diagramXml);
      } catch (e) {
        console.error("error loading DMN 1.3 XML", e);
      }
    }
  },
  beforeDestroy: function () {
    this.dmnModeler.destroy();
  },
  methods: {
    setShowProperty(show) {
      if (show) {
        this.containerSpan = 14;
      } else {
        this.containerSpan = 24;
      }
    },
    getDecisionKey() {
      let self = this;
      let key = null;
      let decisionViews = self.dmnModeler.getViews();
      let decisionTable = decisionViews.find(view => view.type === "decisionTable");
      if (decisionTable) {
        key = decisionTable.id;
      }
      return key;
    },
    traverseDOM(node, fn) {
      fn(node);
      node = node.firstChild;
      while (node) {
        this.traverseDOM(node, fn);
        node = node.nextSibling;
      }
    },
    getElementByAttr(dom, attr, val) {
      let result = [];
      this.traverseDOM(dom, function (node) {
        var valid = node.nodeType === 1 && node.getAttribute(attr);
        if (typeof valid === "string" && (valid === val || typeof val !== "string")) {
          result.push(node);
        }
      });
      return result;
    },
    async getXml(doExport) {
      let result = await this.dmnModeler.saveXML({ format: true });
      if (doExport) {
        var blob = new Blob([result.xml], { type: "text/xml" });
        saveAs(blob, `${this.exportName}.dmn`);
      }
      return result.xml;
    },
    async refreshXml(val) {
      let self = this;
      self.onLoadingXml = true;
      try {
        await self.dmnModeler.importXML(val);
      } catch (e) {
        console.error("error loading DMN 1.3 XML", e);
      }
    },
  },
  watch: {
    diagramXml: async function (val) {
      let self = this;
      self.onLoadingXml = true;
      try {
        await self.dmnModeler.importXML(val);
      } catch (e) {
        console.error("error loading DMN 1.3 XML", e);
      }
    },
    outPutRules: function () {
      let self = this;
      if (self.outPutRules) {
        self.outPutRules.forEach(ruleId => {
          let currentTds = self.getElementByAttr(self.$refs.container, "data-row-id", ruleId);
          if (currentTds.length > 0) {
            currentTds[0].parentNode.setAttribute("class", "dmn-highlight");
          }
        });
      }
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

/deep/ .dmn-highlight {
  background-color: #4caf507d !important
}

div.diagram-container {
  background-color: rgba(232, 239, 247, 16);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  display: -webkit-flex;
}

/*/deep/ .dmn-decision-table-container  tbody .dmn-highlight td:first-child{*/
/*  background-color: transparent;*/
/*}*/
</style>
