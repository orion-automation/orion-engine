<template>
  <v-navigation-drawer
    :width="leftWidth"
    absolute
    floating
    right
    mobile-breakpoint="0"
    id="drawer_demo"
    v-model="left"
    @input="onDrawerInput"
    style="z-index: 199; border-left: 1px solid rgba(187, 187, 187, 1);padding-left: 1px"
  >
    <div>
      <slot name="default" />
    </div>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "ReSizeDrawer",
  props: {
    initWidth: {
      type: Number,
    },
  },
  data() {
    return {
      leftWidth: 330,
      left: true,
      maxLeftWidth: parseInt(document.body.clientWidth * 0.75),
      minLeftWidth: 200,
    };
  },
  mounted() {
    let self = this;
    if (this.initWidth) {
      this.leftWidth = this.initWidth;
    }
    //初始化抽屉拖动
    $("#drawer_demo .v-navigation-drawer__border").css("cursor", "ew-resize");
    $("#drawer_demo  .v-navigation-drawer__border").mousedown(function (event) {
      // 禁止用户选择网页中文字
      document.onselectstart = () => false;
      // 禁止用户拖动元素
      document.ondragstart = () => false;
      // 保存鼠标最后移动的位置（X轴）
      self.dragState = {
        // 鼠标开始移动的位置（X轴）
        startMouseTop: event.clientX,
        // 鼠标最后移动的位置（X轴）
        endMouseTop: event.clientX,
      };

      // 绑定鼠标移动事件
      document.addEventListener("mousemove", self.handleMouseMove);
      // 绑定鼠标放开事件
      document.addEventListener("mouseup", self.handleMouseUp);
    });
    this.$emit("setLeftWidth", { left: this.left, width: this.leftWidth });
  },
  methods: {
    onDrawerInput(val) {
      this.setLeft(val);
    },
    setLeft(left) {
      this.left = left;
      this.$emit("setLeftWidth", { left: left, width: this.leftWidth });
    },
    /**
     * 处理鼠标移动事件
     *
     * @param {MouseEvent} 鼠标事件
     */
    handleMouseMove(event) {
      // 获取鼠标最后移动的位置（Y轴）
      const { endMouseTop } = this.dragState;
      // 获取当前的文本框高度
      let oldWidth = this.leftWidth;
      // 新的文本框高度
      let newTextAreaHeight = 0;

      // 计算鼠标移动的距离
      const distance = Math.abs(
        parseInt(((endMouseTop - event.clientX) * 100).toString(), 10) / 100
      );

      // 若鼠标向右移动
      if (endMouseTop > event.clientX) {
        // 发送框高度达到最大
        if (oldWidth >= this.maxLeftWidth) {
          // 修改光标为可被向下移动
          $(".v-navigation-drawer__border").css("cursor", "w-resize");
          return false;
        }

        // 计算新的发送框高度
        newTextAreaHeight = oldWidth + distance;
      }
      // 若鼠标向左移动
      else {
        // 发送框高度达到最小
        if (oldWidth <= this.minLeftWidth) {
          // 修改光标为可被向上移动
          $(".v-navigation-drawer__border").css("cursor", "e-resize");
          return false;
        }

        // 计算新的发送框高度
        newTextAreaHeight = oldWidth - distance;
      }

      // 兼容鼠标快速拖动的情况：新的发送框高度不能超过最大值
      if (newTextAreaHeight > this.maxLeftWidth) {
        newTextAreaHeight = this.maxLeftWidth;
      }

      // 兼容鼠标快速拖动的情况：新的发送框高度不能小于最小值
      if (newTextAreaHeight < this.minLeftWidth) {
        newTextAreaHeight = this.minLeftWidth;
      }

      // 修改发送框高度
      this.leftWidth = newTextAreaHeight;
      this.$emit("setLeftWidth", { left: this.left, width: this.leftWidth });
      // 修改光标为可移动
      $(".v-navigation-drawer__border").css("cursor", "ew-resize");

      // 更新鼠标最后移动的位置（Y轴）
      this.dragState.endMouseTop = event.clientX;
    },

    /**
     * 处理鼠标放开事件
     */
    handleMouseUp() {
      // 移除鼠标移动事件
      document.removeEventListener("mousemove", this.handleMouseMove);
      // 移除鼠标放开事件
      document.removeEventListener("mouseup", this.handleMouseUp);
      // 允许用户选择网页中文字
      document.onselectstart = null;
      // 允许用户拖动元素
      document.ondragstart = null;
    },
  },
};
</script>

<style scoped>
.v-navigation-drawer__content > div {
  height: 100%;
}
</style>
