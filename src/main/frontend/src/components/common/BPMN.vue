<template>
  <div
    :ref="`container-${refSuffix}`"
    class="vue-bpmn-diagram-container"
    :style="{backgroundColor: backgroundColor}"
    style="width: 100%; height: 100%;position: relative"
  >
    <v-menu
      offset-y
      v-model="actionsDropDown.show"
      :position-x="actionsDropDown.posX"
      :position-y="actionsDropDown.posY"
      absolute
      style="z-index: 100"
    >
      <v-list>
        <v-list-item
          v-for="item in activeActions"
          :key="item.id"
          @click="onClickMoreAction(item)"
          dense
        >
          <v-list-item-title style="font-size: 14px">
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-btn-toggle class="zoom-btn-toggle" dense>
      <v-btn small @click="zoom('reset')">
        <v-icon>mdi-backup-restore</v-icon>
      </v-btn>
      <v-btn small @click="zoom('in')">
        <v-icon>mdi-plus</v-icon>
      </v-btn>

      <v-btn small @click="zoom('out')">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
    </v-btn-toggle>
  </div>
</template>

<script>
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import BpmnJS from "bpmn-js/lib/NavigatedViewer";

export default {
  name: "VueBpmn",
  props: {
    diagramXml: {
      type: String,
      required: true,
    },
    options: {
      type: Object,
    },
    nodeProperties: {
      type: Object,
    },
    instructions: {
      type: Array,
      default: ()=>([]),
    },
    nodeActions: {
      type: Array,
      default: ()=>([]),
    },
    backgroundColor: {
      type: String,
      default: "#F3F4F9"
    },
  },
  computed: {
    activeActions() {
      return this.nodeActions.filter((action) => action.show);
    },
  },
  data: function () {
    return {
      refSuffix: new Date().getTime(),
      // 是否正在载入xml
      onLoadingXml: true,
      // 选中的节点id
      selectedNode: {},
      actionsDropDown: {
        show: false,
        posX: 0,
        posY: 0,
      },
      actionsPosition: {
        userTask: {
          bottom: 30,
          right: 30,
        },
        callActivity: {
          bottom: 30,
          right: 30,
        },
        event: {
          // top: -20,
          // left: -20,
          bottom: 5,
          right: 5,
        },
        gateway: {
          bottom: 15,
          right: 15,
        },
      },
      zoomType: 0,
    };
  },
  mounted: function () {
    var container = this.$refs[`container-${this.refSuffix}`];
    var self = this;
    var _options = Object.assign(
      {
        container: container,
      },
      this.options
    );
    this.bpmnViewer = new BpmnJS(_options);

    this.bpmnViewer.on("import.done", function (event) {
      var error = event.error;
      var warnings = event.warnings;

      if (error) {
        self.$emit("error", error);
      } else {
        self.onLoadingXml = false;
        self.$emit("shown", warnings);
        //是否是协同流程
        const elementRegistry = self.bpmnViewer.get("elementRegistry");
        self.$emit("onGetCollaborations",elementRegistry.getAll()
            .filter(element=>element.businessObject.$type==="bpmn:Participant" && element.businessObject.processRef)
            .map(element=>{
              return {
                id:element.businessObject.processRef.id,
                name:element.businessObject.processRef.name,
              };
            }));
      }
      self.bpmnViewer.get("canvas").zoom("fit-viewport");
    });
    this.resetZoomButton();
    if (this.diagramXml){
      self.onLoadingXml = true;
      try {
        self.bpmnViewer.importXML(this.diagramXml);
      } catch (e) {
        console.error("error loading DMN 1.3 XML", e);
      }
    }
  },
  beforeDestroy: function () {
    this.bpmnViewer.destroy();
  },
  watch: {
    diagramXml: async function (val) {
      let self = this;
      this.onLoadingXml = true;
      await this.bpmnViewer.importXML(val);
      if (this.nodeProperties) {
        this.setNodeOverLays(this.nodeProperties);
      }
      var eventBus = self.bpmnViewer.get("eventBus");

      var events = ["element.click"];

      events.forEach(function (event) {
        eventBus.on(event, function (e) {
          if (
            event === "element.click" &&
            e.element.type !== "bpmn:Participant" &&
            e.element.type !== "bpmn:Collaboration"
          ) {
            self.$emit("onClickNode", e.element);
          }
        });
      });
    },
    nodeActions(actions) {
      var btn = $("#nodeSetBtn");
      if (!actions.length && btn) {
        btn.remove();
      }
    },
    nodeProperties: {
      handler(val) {
        // 节点属性变化,刷新tag
        this.setNodeOverLays(val);
      },
      deep: true,
    },
    instructions: {
      handler(val) {
        this.setInstructionOverLays(val);
      },
      deep: true,
    },
  },
  methods: {
    // 清除选中信息
    clearNodeSelected(){
      let self=this;
      if (self.selectedNode.id) {
        self.bpmnViewer
            .get("canvas")
            .removeMarker(self.selectedNode.id, "highlight");
        self.selectedNode={};
      }
    },
    // 计算迁移计划错误信息
    validateMigration(instructions){
      let self=this;
      // 获取所有activity类型的节点
      self.bpmnViewer.get("elementRegistry")
          .getAll()
          .forEach(element=>{
              // 节点必须有实例
              self.bpmnViewer
                .get("canvas")
                .removeMarker(element.businessObject.id, "validate_error");
              if (self.nodeProperties&&self.nodeProperties[`${element.businessObject.id}`]
                  &&self.nodeProperties[`${element.businessObject.id}`].instances){
                // 节点必须有流程实例
                let index=instructions.findIndex(instruction=>instruction.sourceActivityIds[0]===element.businessObject.id);
                if (index===-1){
                  // 优先显示select样式
                  if (!self.selectedNode.id||self.selectedNode.id!==element.businessObject.id){
                    // 显示错误
                    self.bpmnViewer
                        .get("canvas")
                        .addMarker(element.businessObject.id, "validate_error");
                  }
                }
              }
          });
    },
    getNodeById(nodeId) {
      let self = this;
      const elementRegistry = self.bpmnViewer.get("elementRegistry");
      return elementRegistry.get(nodeId);
    },
    // 设置消息按钮
    setInstructionOverLays(val) {
      let self = this;
      if (!self.onLoadingXml) {
        const elementRegistry = self.bpmnViewer.get("elementRegistry");
        let overlays = self.bpmnViewer.get("overlays");
        overlays.remove({ type: "badge" });
        val
          .map((item) => item.activityId)
          .forEach((nodeId) => {
            let node = elementRegistry.get(nodeId);
            if (!node) {
              return;
            }

            var hasAdd =
              val.filter(
                (item) =>
                  item.activityId.replace("#multiInstanceBody", "") ===
                    nodeId && item.type.indexOf("cancel") < 0
              ).length > 0;
            var hasMinus =
              val.filter(
                (item) =>
                  item.activityId === nodeId && item.type.indexOf("cancel") >= 0
              ).length > 0;
            var texts = [];
            if (hasAdd) {
              texts.push("+");
            }
            if (hasMinus) {
              texts.push("-");
            }
            if (texts.length) {
              let overlaysInstances = $(
                `<div class="overlays_badge overlays">${texts.join(" ")}</div>`
              );

              overlays.add(nodeId, "badge", {
                position: {
                  top: -10,
                  left: -10,
                },
                html: overlaysInstances,
              });
            }
          });
      }
    },
    setNodeOverLays(val) {
      let self = this;
      if (!self.onLoadingXml) {
        const elementRegistry = self.bpmnViewer.get("elementRegistry");
        let overlays = self.bpmnViewer.get("overlays");
        overlays.remove({ type: "tags" });
        Object.keys(val).forEach((nodeId) => {
          let node = elementRegistry.get(nodeId);
          if (!node) {
            return;
          }
          var property = val[nodeId];
          if (property.instances) {
            let overlaysInstances = $(
                `<div class="overlays_instances overlays"><i
              class="v-icon notranslate mdi mdi-play-circle theme--light"
          style="margin-right: 3px"></i>${property.instances}</div>`
            );
            overlaysInstances.click(() => {
              // console.log("overlaysInstances click", nodeId);
              // self.setNodeSelected(nodeId, node.type);
            });
            overlays.add(nodeId, "tags", {
              position: {
                bottom: 15,
                left: -8,
              },
              html: overlaysInstances,
            });
          }
          if (property.incidents) {
            let overlaysIncidents = $(
              `<div class="overlays_incidents overlays">${property.incidents}</div>`
            );
            overlaysIncidents.click(() => {
              // self.setNodeSelected(nodeId, node.type);
              // console.log("overlaysIncidents click", nodeId);
            });
            overlays.add(nodeId, "tags", {
              position: {
                bottom: 15,
                left: 15,
              },
              html: overlaysIncidents,
            });
          }

          if (property.finished) {
            let overlaysFinished = $(
              `<div class="overlays_finished overlays">${property.finished}</div>`
            );
            overlaysFinished.click(() => {
              // self.setNodeSelected(nodeId, node.type);
              // console.log("overlaysFinished click", nodeId);
            });
            overlays.add(nodeId, "tags", {
              position: {
                bottom: 15,
                left: 38,
              },
              html: overlaysFinished,
            });
          }

          if (property.canceled) {
            let overlaysCanceled = $(
              `<div class="overlays_canceled overlays">${property.canceled}</div>`
            );
            overlaysCanceled.click(() => {
              // self.setNodeSelected(nodeId, node.type);
              // console.log("overlaysCanceled click", nodeId);
            });
            overlays.add(nodeId, "tags", {
              position: {
                bottom: 15,
                left: 61,
              },
              html: overlaysCanceled,
            });
          }

          if (property.failedJobs) {
            let overlaysFailedJobs = $(
              `<div class="overlays_failedJobs overlays">${property.failedJobs}</div>`
            );
            overlaysFailedJobs.click(() => {
              // self.setNodeSelected(nodeId, node.type);
              // console.log("overlaysFailedJobs click", nodeId);
            });
            overlays.add(nodeId, "tags", {
              position: {
                top: -10,
                right: 8,
              },
              html: overlaysFailedJobs,
            });
          }
        });
      }
    },
    // 通过id将节点设置为选中状态
    setNodeSelected(node) {
      let self = this;
      if (self.selectedNode.id && self.selectedNode.id !== node.id) {
        self.bpmnViewer
          .get("canvas")
          .removeMarker(self.selectedNode.id, "highlight");
        let overlays = self.bpmnViewer.get("overlays");
        overlays.remove({ element: self.selectedNode.id, type: "actions" });
      }
      let type = node.type;
      if (type !== "bpmn:Lane" && type != "bpmn:Process") {
        if (self.selectedNode.id !== node.id) {
          self.selectedNode = node;
          self.bpmnViewer.get("canvas").removeMarker(node.id, "validate_error");
          self.bpmnViewer.get("canvas").addMarker(node.id, "highlight");
          // type.endsWith("Task") || type.endsWith("Event") ||type.endsWith("Gateway")
          if (self.nodeActions.length) {
            let typeStr = type.indexOf(":") >= 0 ? type.split(":")[1] : type;
            typeStr =
              typeStr.substring(0, 1).toLowerCase() + typeStr.substring(1);
            let position =
              self.actionsPosition[typeStr] || self.actionsPosition.userTask;

            let overlays = self.bpmnViewer.get("overlays");
            let setHtml = $(
              "<i id='nodeSetBtn' class='v-icon notranslate mdi mdi-tune theme--light' style='width: 25px;height: 25px'>"
            );
            setHtml.click((event) => {
              self.onClickNodeSet(node, event);
            });

            overlays.add(node.id, "actions", {
              position,
              html: setHtml,
            });
          }
        }
      } else {
        self.selectedNode = {};
      }
    },
    onClickNodeSet(node, event) {
      let self = this;

      var property = self.nodeProperties[node.id] || {};
      this.nodeActions.forEach((action) => {
        var show = true;
        if (action.condition) {
          show = !!property[action.condition];
        }
        if (show && action.id.indexOf("MultiInstance") > 0) {
          var isMultiInstance =
            node.businessObject &&
            node.businessObject.loopCharacteristics &&
            node.businessObject.loopCharacteristics.$type ===
              "bpmn:MultiInstanceLoopCharacteristics";
          show = isMultiInstance;
        }
        action.show = show;
      });

      Object.assign(self.actionsDropDown, {
        show: true,
        posX: event.originalEvent.x,
        posY: event.originalEvent.y,
      });
    },
    onClickMoreAction(action) {
      if (action.id.indexOf("on") === 0) {
        this.$emit(action.id, this.selectedNode.businessObject);
        return;
      }
      var name =
        this.selectedNode.businessObject &&
        this.selectedNode.businessObject.name;
      if (!name) {
        name = "(" + this.selectedNode.type.split(":")[1] + ")";
      }
      var isMultiInstance = action.id.indexOf("MultiInstance") > 0;
      let instruction = {
        type: action.id,
        node: this.selectedNode,
        activityId: isMultiInstance
          ? this.selectedNode.id + "#multiInstanceBody"
          : this.selectedNode.id,
        name,
      };
      if (action.id === "cancel") {
        instruction.cancelCurrentActiveActivityInstances = true;
      }

      this.instructions.push(instruction);
    },
    resetZoomButton() {
      setTimeout(() => {
        var button = $(".zoom-btn-toggle button.v-btn--active");
        button.removeClass("v-btn--active").removeClass("v-item--active");
      }, 0);
    },
    byZoom(value){
      let zoomScroll = this.bpmnViewer.get("zoomScroll");
      if (value !== "reset") {
        zoomScroll.stepZoom(value === "in" ? 1 : -1);
      } else {
        zoomScroll.reset();
      }
      this.resetZoomButton();
    },
    zoom(value) {
      this.byZoom(value);
      this.$emit("onZoom",value);
    },
  },
};
</script>

<style scoped>
/deep/ .overlays {
  min-width: 17px;
  width: auto;
  height: auto;
  padding: 3px 3px;
  border-radius: 6px;
  color: white;
  text-align: center;
  font-size: 3px;
  margin-right: 5px;
  display: inline-block;
  line-height: 10px;
  white-space: nowrap;
  border: 1px solid #312651;
}

/deep/ .overlays_instances {
  background-color: #4caf50;
  font-size: 10px;
}

/deep/ .overlays_failedJobs {
  background-color: #ff9800;
  font-size: 10px;
}

/deep/ .overlays_incidents {
  background-color: #ff3501;
  font-size: 10px;
}

/deep/ .overlays_finished {
  background-color: #83829a;
  font-size: 10px;
}

/deep/ .overlays_canceled {
  background-color: #fcca00;
  font-size: 10px;
}

/deep/ .overlays_badge {
  min-width: 18px;
  height: 18px;
  border-radius: 35%;
  background-color: #333333;
  font-size: 10px;
}

/deep/ .highlight:not(.djs-connection) .djs-visual > :nth-child(1) {
  fill: orange !important; /* color elements as orange */
}

/deep/ .validate_error:not(.djs-connection) .djs-visual > :nth-child(1) {
  fill: #ffeb3b !important; /* color elements as red */
}
.zoom-btn-toggle {
  position: absolute;
  top: 10px;
  right: 10px;
  /*bottom: 10px;*/
  z-index: 100;
}

/deep/ .zoom-btn-toggle .v-icon.v-icon {
  font-size: 18px;
}
</style>
