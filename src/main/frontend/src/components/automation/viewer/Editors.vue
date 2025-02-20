<template>
  <div style="margin: 14px" ref="root">
    <div class="editor-title" style="margin-bottom: 8px">{{ $t('galance') }}</div>
    <ckeditor
      :editor="editor"
      :disabled="true"
      v-model="config.root"
      :config="editorConfig"
    />
    <div v-for="item in config.items" ref="items" :key="item.id">
      <div class="d-flex flex-row menu-border" style="align-items: center">
        <div class="editor-title">
          <span class="bpmn-icon" :class="buildClass(item.type)" />

          {{ item.id }} {{ item.name ? "(" + item.name + ")" : "" }}
        </div>
        <v-spacer />
        <v-btn
          icon
          style="margin: 8px 5px; border-right: 0"
          @click="select(item)"
        >
          <v-icon size="20" color="#312651" style="margin: 0 6px">
            mdi-cog-box
          </v-icon>
        </v-btn>
        <v-btn
          icon
          style="margin: 8px 5px; border-right: 0"
          @click="item.fold = !item.fold"
        >
          <v-icon size="20" color="#0F40F5" style="margin: 0 6px">
            {{ item.fold ? "mdi-menu-up" : "mdi-menu-down" }}
          </v-icon>
        </v-btn>
      </div>
      <ckeditor
        v-if="!item.fold"
        :editor="editor"
        v-model="item.value"
        :config="editorConfig"
      />
    </div>
  </div>
</template>
<script>
import utils from "@/utils/utils";

//import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";
import { Essentials } from "@ckeditor/ckeditor5-essentials";
import { Bold, Italic } from "@ckeditor/ckeditor5-basic-styles";
import { Font } from "@ckeditor/ckeditor5-font";
import { Link, LinkImage } from "@ckeditor/ckeditor5-link";
import { Paragraph } from "@ckeditor/ckeditor5-paragraph";
import { Table, TableToolbar } from "@ckeditor/ckeditor5-table";
import { List } from "@ckeditor/ckeditor5-list";
import { Heading } from "@ckeditor/ckeditor5-heading";
import { CodeBlock } from "@ckeditor/ckeditor5-code-block";
import { BlockQuote } from "@ckeditor/ckeditor5-block-quote";
import { Indent } from "@ckeditor/ckeditor5-indent";
import { Base64UploadAdapter } from "@ckeditor/ckeditor5-upload";

import {
  Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
} from "@ckeditor/ckeditor5-image";
import { Alignment } from "@ckeditor/ckeditor5-alignment";

export default {
  props: {
    config: {
      type: Object,
      required: true,
    },
    parentRefs: {
      type: Object,
      required: true,
    },
  },
  components: {},
  computed: {},
  data() {
    return {
      utils,
      editor: ClassicEditor,
      editorConfig: {
        plugins: [
          Essentials,
          Bold,
          Italic,
          Link,
          Paragraph,
          Font,
          Table,
          CodeBlock,
          BlockQuote,
          TableToolbar,
          Heading,
          List,
          Indent,
          Image,
          ImageUpload,
          ImageToolbar,
          ImageCaption,
          ImageStyle,
          ImageResize,
          LinkImage,
          Alignment,
          Base64UploadAdapter,
        ],
        image: {
          toolbar: [
            "imageStyle:block",
            "imageStyle:side",
            "|",
            "toggleImageCaption",
            "imageTextAlternative",
            "|",
            "linkImage",
          ],
        },
        fontColor: {
          colors: [
            {
              color: "#FF7754",
              label: "Color 1",
            },
            {
              color: "#57928D",
              label: "Color 2",
            },
            {
              color: "#0F40F5",
              label: "Color 3",
            },
            {
              color: "#83829A",
              label: "Color 4",
            },
            {
              color: "#312651",
              label: "Color 5",
            },
            {
              color: "#000000",
              label: "Color 6",
            },
          ],
        },
        fontBackgroundColor: {
          colors: [
            {
              color: "#FFEA00",
              label: "Color 1",
            },
            {
              color: "#E6E4E6",
              label: "Color 2",
            },
            {
              color: "#76FF03",
              label: "Color 3",
            },
            {
              color: "#FF3D00",
              label: "Color 4",
            },
          ],
          table: {
            contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
          },
        },
        toolbar: false,
      },
      nodes: [],
      linkNodes: [],
    };
  },
  watch: {
    $route: {
      handler() {},
    },
  },
  methods: {
    select(node) {
      this.parentRefs.bpmnModeler.selectNode(node.id);
      this.parentRefs.bpmnModeler.setShowProperty(true);
    },
    locate(businessObject) {
      let item = (this.config.items || []).find(
        (item) => item.id === businessObject.id
      );

      if (item) {
        let index = this.config.items.indexOf(item);
        let ref = this.$refs.items[index];
        ref.scrollIntoView({ behavior: "smooth" });
      }
      if (businessObject.$type === "bpmn:Process") {
        let ref = this.$refs.root;
        if (ref) {
          // ref.scrollIntoView({ behavior: "smooth" });
          ref.parentElement.parentElement.parentElement.parentElement.scrollTo(
            0,
            0
          );
        }
      }
    },
    buildClass(type) {
      if (!type) {
        return "";
      }
      let items = type
        .replace(/bpmn:/, "")
        .replace(/IntermediateCatchEvent/, "IntermediateEvent")
        .replace(/SubProcess/, "SubprocessCollapsed")
        .replace(/BoundaryEvent/, "IntermediateEventCatchMessage")
        .split(/(?=[A-Z])/)
        .filter((item) => !!item)
        .map((item) => item.toLowerCase());
      let lastName = items[items.length - 1];
      if (lastName === "event") {
        items.push("none");
      }
      if (lastName === "gateway") {
        items.splice(0, 1);
        items.push("none");
      }

      let name = items.join("-");
      return `bpmn-icon-${name}`;
    },
  },
};
</script>

<style scoped>
.editor-title {
  font-size: 18px;
  color: #444262;
  display: flex;
  align-items: center;
}
.bpmn-icon {
  font-size: 25px;
  margin-right: 8px;
}
</style>
