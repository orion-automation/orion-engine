<template>
  <div style="margin: 14px" ref="root">
    <div class="editor-title" style="margin-bottom: 8px">{{ $t('outline') }}</div>
    <ckeditor :editor="editor" v-model="config.root" :config="editorConfig" />
    <v-menu offset-y max-height="300">
      <template #activator="{ on, attrs }">
        <v-btn
          large
          text
          class="process-menu"
          v-show="showNodeDoc"
          v-bind="attrs"
          v-on="on"
          style="margin: 8px 0; border-right: 0"
          @click="startAdd"
        >
          <v-icon size="16" color="#FF7754" style="margin-right: 6px">
            mdi-bookmark-plus-outline
          </v-icon>
          <span style="color: #444262; font-size: 14px">{{ $t('addChildDoc') }}</span>
        </v-btn>
      </template>
      <v-list style="cursor: pointer" dense>
        <v-list-item v-for="node in nodes" :key="node.id">
          <v-list-item-title @click="add(node)">
            <span style="font-size: 14px" class="d-flex flex-row"><span class="bpmn-icon" :class="buildClass(node.businessObject.$type)" />
              <span style="margin: auto 0">
                {{ node.businessObject.id }}
                {{
                  node.businessObject.name ? "(" + node.businessObject.name + ")" : ""
                }}</span>
            </span>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <div v-for="item in config.items" ref="items" :key="item.id">
      <!-- <div class="editor-title" style="margin-top: 8px"></div> -->
      <div class="d-flex flex-row menu-border" style="align-items: center">
        <div class="editor-title">
          <span class="bpmn-icon" :class="buildClass(item.type)" />
          {{ item.id }}
          {{ item.name ? "(" + item.name + ")" : "" }}
        </div>
        <v-spacer />
        <v-btn
          icon
          class="node-menu"
          @click="moveUp(item)"
          :disabled="config.items.indexOf(item) === 0"
        >
          <v-icon size="20" color="#312651" style="margin: 0 6px"> mdi-arrow-up </v-icon>
        </v-btn>

        <v-btn
          icon
          class="node-menu"
          @click="moveDown(item)"
          :disabled="config.items.indexOf(item) === config.items.length - 1"
        >
          <v-icon size="20" color="#312651" style="margin: 0 6px">
            mdi-arrow-down
          </v-icon>
        </v-btn>
        <v-btn icon class="node-menu" @click="select(item)">
          <v-icon size="20" color="#312651" style="margin: 0 6px"> mdi-cog-box </v-icon>
        </v-btn>

        <v-menu offset-y max-height="300">
          <template #activator="{ on, attrs }">
            <v-btn icon class="node-menu" v-bind="attrs" v-on="on" @click="startLink">
              <v-icon size="20" color="#444262" style="margin: 0 6px"> mdi-link </v-icon>
            </v-btn>
          </template>
          <v-list style="cursor: pointer" dense>
            <v-list-item>
              <v-list-item-title>
                <span style="font-size: 14px; color: #312651; font-weight: bold">{{ $t('modifyLinkDocAndConfig') }}</span>
              </v-list-item-title>
            </v-list-item>
            <v-list-item v-for="node in linkNodes" :key="node.id">
              <v-list-item-title @click="link(item, node)">
                <span style="font-size: 14px" class="d-flex flex-row"><span
                                                                        class="bpmn-icon"
                                                                        :class="buildClass(node.businessObject.$type)"
                                                                      />
                  <span style="margin: auto 0">
                    {{ node.businessObject.id }}
                    {{
                      node.businessObject.name ? "(" + node.businessObject.name + ")" : ""
                    }}</span>
                </span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-menu v-model="item.confirm">
          <template #activator="{ on, attrs }">
            <v-btn icon class="node-menu" v-bind="attrs" v-on="on">
              <v-icon size="20" color="#FF7754" style="margin: 0 6px">
                mdi-trash-can-outline
              </v-icon>
            </v-btn>
          </template>

          <v-card>
            <v-card-title class="small-headline" />
            <v-card-text>
              {{ $t('deleteDocAlert') }}<br>{{ $t('deleteDocAlertConfirmWithName',{name:`${item.id}${item.name ? "(" + item.name + ")" : ""}`}) }}？
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn text @click="item.confirm = false">{{ $t('back') }}</v-btn>

              <v-btn style="color: #ffffff" color="#FF7754" @click="remove(item)">
                <v-icon size="16" color="#ffffff" style="margin-right: 6px">
                  mdi-delete
                </v-icon>
                {{ $t('delete') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>

        <v-btn icon class="node-menu" @click="item.fold = !item.fold">
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
    showNodeDoc: {
      type: Boolean,
      default: true,
    }
  },
  components: {},
  computed: {},
  data() {
    return {
      excludeTypes: [
        "bpmn:Process",
        "bpmn:SequenceFlow",
        "bpmn:Collaboration",
        // "bpmn:Lane",
        // "bpmn:Participant",
      ],
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
        toolbar: {
          items: [
            "undo",
            "redo",
            "|",
            "heading",
            "|",
            "fontFamily",
            "fontSize",
            "fontColor",
            "fontBackgroundColor",
            "|",
            "bold",
            "italic",
            "|",
            "link",
            "uploadImage",
            "|",
            "bulletedList",
            "numberedList",
            "outdent",
            "indent",
            "|",
            "insertTable",
            "codeBlock",
            "blockQuote",
            "alignment",
          ],
        },
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
      this.$emit("select", true);
      this.parentRefs.bpmnModeler.selectNode(node.id);
    },
    startAdd() {
      let nodes = this.parentRefs.bpmnModeler
        .getAllNodes()
        .filter(
          (element) =>
            element.type !== "label" &&
            this.excludeTypes.indexOf(element.businessObject.$type) < 0
        );
      this.nodes = nodes.filter(
        (element) =>
          !this.config.items.find((item) => item.id === element.businessObject.id)
      );
    },
    add(node) {
      this.config.items.push({
        id: node.businessObject.id,
        name: node.businessObject.name,
        type: node.businessObject.$type,
        value: "",
        fold: false,
      });

      setTimeout(() => {
        let ref = this.$refs.items[this.$refs.items.length - 1];
        ref.scrollIntoView({ behavior: "smooth" });
      });
    },
    startLink(node) {
      let excludeIds = this.config.items.map((item) => item.id);
      let linkNodes = this.parentRefs.bpmnModeler
        .getAllNodes()
        .filter(
          (element) =>
            element.type !== "label" &&
            this.excludeTypes.indexOf(element.businessObject.$type) < 0 &&
            excludeIds.indexOf(element.businessObject.id) < 0
        );
      this.linkNodes = linkNodes;
    },
    link(current, selected) {
      current.id = selected.businessObject.id;
      current.type = selected.businessObject.$type;
      current.name = selected.businessObject.name;
    },

    remove(node) {
      let index = this.config.items.indexOf(node);
      this.config.items.splice(index, 1);
    },
    moveUp(node) {
      let index = this.config.items.indexOf(node);
      this.config.items.splice(index, 1);
      this.config.items.splice(index - 1, 0, node);
    },
    moveDown(node) {
      let index = this.config.items.indexOf(node);
      this.config.items.splice(index, 1);
      this.config.items.splice(index + 1, 0, node);
    },
    locate(businessObject) {
      let item = this.config.items.find((item) => item.id === businessObject.id);

      if (item) {
        let index = this.config.items.indexOf(item);
        let ref = this.$refs.items[index];
        ref.scrollIntoView({ behavior: "smooth" });
      }
      if (businessObject.$type === "bpmn:Process") {
        let ref = this.$refs.root;
        if (ref) {
          ref.parentNode.scrollTo(0, 0);
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
.node-menu.v-btn.v-btn--icon.v-btn--round {
  margin: 8px 3px;
  border-right: 0;
}
.bpmn-icon {
  font-size: 25px;
  margin-right: 8px;
}
</style>
