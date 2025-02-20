<template>
  <v-navigation-drawer
      absolute
      right
      temporary
      width="80%"
      v-model="left"
      :stateless="true"
      @input="onDrawerInput"
      style="z-index: 199; border-left: 1px solid rgba(187, 187, 187, 1);padding-left: 1px;border-top: 1px solid rgba(187, 187, 187, 1);"
  >
    <div class="d-flex flex-column" style="height: 100%;width: 100%">
      <div class="d-flex flex-row" style="align-items: center;padding: 6px 8px">
        <v-icon left color="#FF7754">mdi-code-braces-box</v-icon>
        <div style="flex: 1">
          {{ options.mode }}
        </div>
        <v-btn icon @click="left=false" style="border-right: none">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <div style="flex: 1;width: 100%">
        <codemirror
            style="height: 100%"
            v-model="code"
            :options="options"
            @input="onCodeInput"
            @ready="onCMReady"
        />
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "EditCode",
  data() {
    return {
      left: false,
      code: "",
      options: {
        line: true,
        theme: "material-ocean", // 主题
        tabSize: 4, // 制表符的宽度
        indentUnit: 2, // 一个块应该缩进多少个空格（无论这在编辑语言中意味着什么）。默认值为 2。
        firstLineNumber: 1, // 从哪个数字开始计算行数。默认值为 1。
        readOnly: false, // 只读
        autorefresh: true,
        smartIndent: true, // 上下文缩进
        lineNumbers: true, // 是否显示行号
        styleActiveLine: true, // 高亮选中行
        viewportMargin: Infinity, //处理高度自适应时搭配使用
        showCursorWhenSelecting: true, // 当选择处于活动状态时是否应绘制游标
        hintOptions: {completeSingle: false},
        lint: {options: {esversion: 2021}},
        mode: "application/xml",
        gutters: [
          "CodeMirror-lint-markers",
          "CodeMirror-linenumbers",
          "CodeMirror-foldgutter"
        ],
        foldGutter: true, // 启用行槽中的代码折叠
      },
      linkTextAreaId: "",
      linkTextAreaCustomId: ""
    };
  },
  methods: {
    onCMReady(cmInstance){
      cmInstance.on("keyup", this.onCodeKeyUp);
    },
    onCodeKeyUp(cm, event){
      if (!(event.ctrlKey) && (event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 97 && event.keyCode <= 122) || (event.keyCode >= 46 && event.keyCode <= 57)) {
        cm.showHint();
      }
    },
    onCodeInput(val) {
      // 设置关联的codemirror内容
      let customId = this.linkTextAreaCustomId;
      document.querySelectorAll(".CodeMirror").forEach(item => {
        if (item.CodeMirror.options.customId === customId) {
          let editor = item.CodeMirror;
          editor.setValue(val);
        }
      });
    },
    onDrawerInput(val) {
      this.setLeft(val, {textAreaId: this.linkTextAreaId, customId:this.linkTextAreaCustomId, scriptFormat: this.options.mode});
    },
    setLeft(left, payload) {
      this.left = left;
      this.linkTextAreaId = payload.textAreaId;
      this.options.mode = payload.scriptFormat;
      this.linkTextAreaCustomId = payload.customId;
      // 设置初始值
      this.code = $(`#${this.linkTextAreaId}[custom-id="${this.linkTextAreaCustomId}"]`).val();
    },
  },
};
</script>

<style scoped>
.v-navigation-drawer__content > div {
  height: 100%;
}

/deep/ .vue-codemirror .CodeMirror {
  overscroll-y: scroll !important;
  height: 100% !important;
}
</style>
