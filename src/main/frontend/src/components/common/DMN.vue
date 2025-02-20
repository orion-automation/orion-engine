<template>
  <div
    ref="container"
    class="vue-dmn-diagram-container"
    style="width: 100%; height: 100%; background-color: rgba(232, 239, 247, 16)"
  />
</template>

<script>
import DmnViewer from "dmn-js";
import "dmn-js/dist/assets/diagram-js.css";
import "dmn-js/dist/assets/dmn-js-drd.css";
import "dmn-js/dist/assets/dmn-js-decision-table.css";
import "dmn-js/dist/assets/dmn-js-literal-expression.css";
import "dmn-js/dist/assets/dmn-js-shared.css";
import "dmn-js/dist/assets/dmn-font/css/dmn.css";

export default {
  name: "VueDMN",
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
  },
  data: function () {
    return {
      // 是否正在载入xml
      onLoadingXml: true,
      zoomType: 0,
    };
  },
  mounted: function () {
    let self = this;
    let container = self.$refs.container;
    let _options = Object.assign(
        {
          container: container,
        },
        this.options
    );
    this.dmnViewer = new DmnViewer(_options);

    this.dmnViewer.on("import.done", async function (event) {
      var error = event.error;
      var warnings = event.warnings;
      if (error) {
        self.$emit("error", error);
      } else {
        //如果只有一个drd,则直接展示decisionTable,并且不能返回查看drd
        let decisionViews = self.dmnViewer.getViews();
        let activeEditor = self.dmnViewer.getActiveViewer();
        activeEditor.get("canvas").zoom("fit-viewport");
        if (self.defaultShowTable && decisionViews.filter(view => view.type === "decisionTable" && view.id === self.defaultShowTable).length > 0) {
          await self.dmnViewer.open(decisionViews[decisionViews.findIndex(view => view.type === "decisionTable" && view.id === self.defaultShowTable)]);
          if (self.outPutRules) {
            self.outPutRules.forEach(ruleId =>{
              let currentTds=self.getElementByAttr(self.$refs.container,"data-row-id",ruleId);
              if (currentTds.length>0){
                currentTds[0].parentNode.setAttribute("class", "dmn-highlight");
              }
            });
          }
        }
        if (!self.canViewDrd){
          let viewDrds=self.$refs.container.getElementsByClassName("view-drd");
          if (viewDrds.length > 0){
            viewDrds[0].style.display = "none";
          }
        }
        if (!self.canViewTable){
          let overlays = activeEditor.get("overlays");
          activeEditor["_definitions"]["drgElement"].forEach(drg=>{
            overlays.remove({element: drg.id});
          });
        }
        self.onLoadingXml = false;
        self.$emit("shown", warnings);
      }
    });

    if (this.diagramXml){
      self.onLoadingXml = true;
      try {
        self.dmnViewer.importXML(this.diagramXml);
      } catch (e) {
        console.error("error loading DMN 1.3 XML", e);
      }
    }
  },
  beforeDestroy: function () {
    this.dmnViewer.destroy();
  },
  methods:{
    traverseDOM(node, fn) {
      fn(node);
      node = node.firstChild;
      while(node) {
        this.traverseDOM(node, fn);
        node = node.nextSibling;
      }
    },
    getElementByAttr(dom,attr, val) {
      let result = [];
      this.traverseDOM(dom, function(node){
        var valid = node.nodeType===1 && node.getAttribute(attr);
        if(typeof valid === "string" &&(valid===val || typeof val !== "string")) {
          result.push(node);
        }
      });
      return result;
    }
  },
  watch: {
    diagramXml: async function (val) {
      let self = this;
      self.onLoadingXml = true;
      try {
        await self.dmnViewer.importXML(val);
      } catch (e) {
        console.error("error loading DMN 1.3 XML", e);
      }
    },
    outPutRules: function (){
      let self=this;
      if (self.outPutRules) {
        self.outPutRules.forEach(ruleId =>{
          let currentTds=self.getElementByAttr(self.$refs.container,"data-row-id",ruleId);
          if (currentTds.length>0){
            currentTds[0].parentNode.setAttribute("class", "dmn-highlight");
          }
        });
      }
    },
  },
};
</script>

<style scoped>
/deep/ .dmn-highlight {
  background-color: #4caf507d !important
}
/deep/ .dmn-definitions{
  display: none;
}
/*/deep/ .dmn-decision-table-container  tbody .dmn-highlight td:first-child{*/
/*  background-color: transparent;*/
/*}*/
</style>
