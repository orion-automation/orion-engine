<template>
  <div ref="resizeWrap" class="resize_wrap" :style="{'height':`${defaultHeight}px`}">
    <div
      ref="resizeLine"
      style="height: 2px;cursor: ns-resize;"
      @mousedown="handleMouseDown"
    />

    <div class="content_container">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "ReSizeLayout",
  props: {
    maxHeight: {
      type: Number,
      default: document.documentElement.clientHeight / 4 * 3,
    },
    minHeight: {
      type: Number,
      default: 5,
    },
    defaultHeight: {
      type: Number,
      default: document.documentElement.clientHeight / 3,
    },
  },
  data() {
    return {
      currentHeight: this.defaultHeight,
    };
  },
  mounted() {
    this.$emit("setTableHeight");
  },
  methods: {
    getCanShowHeight() {
      // 获取底部可显示的高度=当前父容器高度-tab高度-分割线高度
      return this.currentHeight - this.minHeight - 3;
    },
    /**
     * 自动切换隐藏/显示
     *
     * @returns {boolean} true:隐藏
     */
    switchShow() {
      const {resizeWrap, resizeLine} = this.$refs;
      // 修改光标为可移动
      resizeLine.style.cursor = "ns-resize";
      if (resizeWrap.style.height.replace("px", "") > this.minHeight) {
        //隐藏
        resizeWrap.style.height = this.minHeight + "px";
        return true;
      } else {
        //最大化
        resizeWrap.style.height = this.maxHeight + "px";
        this.currentHeight = this.maxHeight;
        this.$emit("setTableHeight");
        return false;
      }
    },
    /**
     * 手动管理隐藏显示
     * @param hidden 是否隐藏
     * @returns {boolean}
     */
    manageShow(hidden) {
      const {resizeWrap, resizeLine} = this.$refs;
      // 修改光标为可移动
      resizeLine.style.cursor = "ns-resize";
      if (hidden) {
        //隐藏
        resizeWrap.style.height = this.minHeight + "px";
      } else {
        //最大化
        resizeWrap.style.height = this.maxHeight + "px";
        this.currentHeight = this.maxHeight;
        this.$emit("setTableHeight");
      }
    },
    /**
     * 处理鼠标按下事件
     *
     * @param {MouseEvent} 鼠标事件
     */
    handleMouseDown(event) {
      // 禁止用户选择网页中文字
      document.onselectstart = () => false;
      // 禁止用户拖动元素
      document.ondragstart = () => false;

      // 保存鼠标最后移动的位置（Y轴）
      this.dragState = {
        // 鼠标开始移动的位置（Y轴）
        "startMouseTop": event.clientY,
        // 鼠标最后移动的位置（Y轴）
        "endMouseTop": event.clientY
      };

      // 绑定鼠标移动事件
      document.addEventListener("mousemove", this.handleMouseMove);
      // 绑定鼠标放开事件
      document.addEventListener("mouseup", this.handleMouseUp);
    },

    /**
     * 处理鼠标移动事件
     *
     * @param {MouseEvent} 鼠标事件
     */
    handleMouseMove(event) {
      const {resizeWrap, resizeLine} = this.$refs;
      // 获取鼠标最后移动的位置（Y轴）
      const {endMouseTop} = this.dragState;
      // 获取当前的文本框高度
      const oldTextAreaHeight = resizeWrap.getBoundingClientRect().height;
      // 新的文本框高度
      let newTextAreaHeight = 0;

      // 计算鼠标移动的距离
      const distance = Math.abs(
          parseInt(((endMouseTop - event.clientY) * 100).toString(), 10) / 100
      );

      // 若鼠标向上移动
      if (endMouseTop > event.clientY) {
        // 发送框高度达到最大
        if (oldTextAreaHeight >= this.maxHeight) {
          // 修改光标为可被向下移动
          resizeLine.style.cursor = "s-resize";
          return false;
        }

        // 计算新的发送框高度
        newTextAreaHeight = oldTextAreaHeight + distance;
      }
      // 若鼠标向下移动
      else {
        // 发送框高度达到最小
        if (oldTextAreaHeight <= this.minHeight) {
          // 修改光标为可被向上移动
          resizeLine.style.cursor = "n-resize";
          return false;
        }

        // 计算新的发送框高度
        newTextAreaHeight = oldTextAreaHeight - distance;
      }

      // 兼容鼠标快速拖动的情况：新的发送框高度不能超过最大值
      if (newTextAreaHeight > this.maxHeight) {
        newTextAreaHeight = this.maxHeight;
      }

      // 兼容鼠标快速拖动的情况：新的发送框高度不能小于最小值
      if (newTextAreaHeight < this.minHeight) {
        newTextAreaHeight = this.minHeight;
      }

      // 修改发送框高度
      resizeWrap.style.height = newTextAreaHeight + "px";
      this.currentHeight = newTextAreaHeight;
      this.$emit("setTableHeight");
      // 修改光标为可移动
      resizeLine.style.cursor = "ns-resize";

      // 更新鼠标最后移动的位置（Y轴）
      this.dragState.endMouseTop = event.clientY;
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

<style>
.v-window__container {
  height: 100% !important;
  overflow-y: auto;
}
</style>

<style scoped>
.resize_wrap .content_container {
  width: 100%;
  /* 重点属性 */
  height: calc(100% - 2px);
  padding: 0;
  resize: none;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
</style>
