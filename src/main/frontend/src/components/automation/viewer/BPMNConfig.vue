<template>
  <div style="width: 100%; height: 100%">
    <re-size-drawer :init-width="showEditor?700:screenWidth" @setLeftWidth="setLeftWidth">
      <div style="display: flex; flex-direction: column; height: 100%">
        <BPMNModeler
            ref="bpmnModeler"
            @onClickNode="selectElement"
            :node-properties="{}"
            :diagram-xml="xml"
        />
      </div>
    </re-size-drawer>
    <div style="display: flex; flex-direction: column; width: 100%">
      <el-row
          style="
          height: 100%;
          min-height: calc(100vh - 48px);
          border-left: 1px solid rgba(187, 187, 187, 1);
          overflow-y: scroll;
          background-color: #ffffff;
        "
          :style="leftStyleMargin"
      >
        <editors ref="editors" :parent-refs="$refs" :config="item.configJson" v-if="showEditor"/>
      </el-row>
    </div>
  </div>
</template>

<script>
import BPMNModeler from "@/components/common/BPMNModeler";
import Editors from "./Editors";
import ReSizeDrawer from "@/components/common/ReSizeDrawer";

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    xml: {
      type: String,
      required: true,
    },
    resource: {
      type: Object,
      required: true,
    }
  },
  computed: {
    showEditor() {
      if (this.resource.projectType){
        return this.resource.projectType.value == 3;
      }
      return true;
    },
    screenWidth() {
      return window.innerWidth;
    }
  },
  components: {
    BPMNModeler,
    ReSizeDrawer,
    Editors,
  },
  data: function () {
    return {
      leftStylePadding: {},
      leftStyleMargin: {},
    };
  },
  mounted: function () {
  },
  beforeDestroy: function () {
  },
  watch: {},
  methods: {
    setLeftWidth(payload) {
      let self = this;
      self.left = payload.left;
      self.leftStylePadding = {
        paddingLeft: `${payload.left ? payload.width : 0}px`,
      };
      self.leftStyleMargin = {
        marginLeft: `${payload.left ? payload.width : 0}px`,
      };
    },

    async selectElement(element) {
      if (this.showEditor){
        this.$refs.editors.locate(element.businessObject);
      }
    },
  },
};
</script>

<style scoped>
.v-navigation-drawer.v-navigation-drawer--absolute {
  border-right: unset !important;
}
</style>
