<template>
  <v-layout style="margin: 0;height: 100%" class="stretch">
    <div style="display: flex; flex-direction: column; width: 100%">
      <div class="d-flex flex-row menu-border" :style="leftStylePadding">
        <div style="flex: 1;text-overflow: ellipsis;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #444262;
    padding-left: 15px;
    word-break: break-all;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;"><template v-if="item && item.name">
          <v-icon color="#83829A" size="16">mdi-source-branch</v-icon>{{ item.name }}
        </template></div>
        <v-menu offset-y z-index="202" :close-on-content-click="false">
          <template #activator="{ on, attrs }">
            <v-btn
                large
                text
                class="process-menu"
                v-show="true"
                v-bind="attrs"
                v-on="on"
                style="border-left: 1px solid rgba(187, 187, 187, 1);border-right: 1px solid rgba(187, 187, 187, 1)"
            >
              <v-icon size="16" color="#83829A">
                mdi-toggle-switch-off-outline
              </v-icon>
              <span style="color: #444262; font-size: 14px;margin-left: 6px">{{ $t('devPanel') }}</span>
            </v-btn>
          </template>
          <div class="d-flex flex-column" style="background-color: white;padding-top: 10px;padding-bottom: 10px">
            <v-switch
                color="#312651"
                class="type-switch"
                v-model="showProperty"
                :label="$t('devPanel')"
                dense
                style="margin: 12px 20px"
                flat
                inset
                @change="setShowProperty()"
            >
              <template #label>
                <span style="color: rgb(68, 66, 98);font-size: 14px">{{ $t('devPanel') }}</span
                >
              </template>
            </v-switch>
            <v-switch
                color="#312651"
                class="type-switch"
                v-model="editXml"
                dense
                :label="$t('xmlViewer')"
                style="margin: 12px 20px"
                flat
                inset
                @change="changeXmlViewer()"
            >
              <template #label>
                <span style="color: rgb(68, 66, 98);font-size: 14px">{{ $t('xmlViewer') }}</span>
              </template>
            </v-switch>
          </div>
        </v-menu>
        <v-btn
            large
            text
            class="process-menu"
            style="border-right: 1px solid rgba(187, 187, 187, 1)"
            @click="$refs.modelAssociation.contentDialog.display = true"
        >
          <v-icon
              size="16"
              :class="{
                  point: resource.associations && resource.associations.length,
                }"
              color="#83829A"
              style="margin-right: 6px"
          >
            mdi-link-box
          </v-icon>
          <span style="color: #444262; font-size: 14px">{{ $t('related') }}</span>
        </v-btn>

        <v-menu v-if="item.id" z-index="202" offset-y>
          <template #activator="{ on, attrs }">
            <v-btn
                large
                text
                class="process-menu"
                v-show="true"
                v-bind="attrs"
                v-on="on"
                style="border-right: 1px solid rgba(187, 187, 187, 1)"
            >
              <v-badge
                  dot
                  bordered
                  overlap
                  :value="resourceUpdated"
                  offset-x="5"
                  offset-y="5"
                  color="#FF7754"
              >
                <v-icon size="16" color="#83829A">
                  mdi-content-save
                </v-icon>
              </v-badge>
              <span style="color: #444262; font-size: 14px;margin-left: 6px">{{ $t('save') }}</span>
            </v-btn>
          </template>
          <v-list style="cursor: pointer" dense>
            <v-list-item key="1">
              <v-list-item-title @click="save({ id: item.id })">
                <span style="font-size: 14px">{{ $t('save') }}</span>
              </v-list-item-title>
            </v-list-item>
            <v-list-item key="2" @click="$refs.modelSave.start()">
              <v-list-item-title>
                <span style="font-size: 14px">{{ $t('saveAs') }}</span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn
            v-if="!item.id"
            large
            text
            class="process-menu"
            v-show="true"
            @click="$refs.modelSave.start()"
            style="border-right: 1px solid rgba(187, 187, 187, 1)"
        >
          <v-icon size="16" color="#83829A" style="margin-right: 6px">
            mdi-content-save
          </v-icon>
          <span style="color: #444262; font-size: 14px">{{ $t('save') }}</span>
        </v-btn>

        <v-btn
            large
            text
            class="process-menu"
            @click="switchRight()"
            style="border-right: 1px solid rgba(187, 187, 187, 1)"
        >
          <v-icon size="16" color="#83829A" style="margin-right: 6px">
            mdi-database-clock-outline
          </v-icon>
          <span style="color: #444262; font-size: 14px">{{ $t('history') }}</span>
        </v-btn>

        <v-btn
            large
            text
            class="process-menu"
            @click="deployDialog.display = true"
            style="border-right: 1px solid rgba(187, 187, 187, 1)"
        >
          <v-icon size="16" color="#83829A" style="margin-right: 6px">
            mdi-upload-network
          </v-icon>
          <span style="color: #444262; font-size: 14px">{{ $t('deploy') }}</span>
        </v-btn>

        <v-menu v-if="item.id&&!showEditXml" z-index="202" offset-y>
          <template #activator="{ on, attrs }">
            <v-btn
                large
                text
                class="process-menu"
                v-bind="attrs"
                v-on="on"
                style="border-right: 1px solid rgba(187, 187, 187, 1)"
            >
              <v-icon size="16" color="#83829A" style="margin-right: 6px">
                mdi-download-box-outline
              </v-icon>
              <span style="color: #444262; font-size: 14px">{{ $t('download') }}</span>
            </v-btn>
          </template>
          <v-list style="cursor: pointer" dense>
            <v-list-item key="xml">
              <v-list-item-title @click="downXML()">
                <span style="font-size: 14px">DMN</span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <el-row
          style="height: 100%; border-top: 1px solid rgba(187, 187, 187, 1)"
          :style="leftStyleMargin"
      >
        <div v-if="showEditXml" id="xmlContainer" style="width: 100%;height: calc(100% - 45px)">
          <codemirror
              style="height: 100%"
              v-model="item.xml"
              :options="options"
              @input="resourceUpdated=true"
          />
        </div>

        <vue-dmn-modeler
            v-else
            :diagram-xml="item.xml"
            ref="vueDmnModeler"
            @save="save"
            :parent-ref-suffix="refSuffix"
            @onClickNode="selectElement"
            :style="rightStyleMargin"
            @onCommandStackChanged="resourceUpdated = true"/>
        <v-navigation-drawer
            :width="330"
            absolute
            mobile-breakpoint="0"
            v-model="right"
            style="z-index: 201"
            right
        >
          <v-icon class="navigation-icon" @click="switchRight()">
            mdi-chevron-right
          </v-icon>
          <div style="display: flex; flex-direction: column; height: 100%">
            <div style="flex: 0">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-subtitle class="subtitle">
                    {{ $t('milestone') }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </div>
            <div class="box history">
              <div style="flex: 1; margin: 0">
                <div
                    class="nav-item"
                    @click="selectVersion(versionItem)"
                    :class="{ active: versionItem.id == item.id }"
                    v-for="versionItem in items"
                    :key="versionItem.id"
                >
                  <div class="content">
                    <div class="main">{{ versionItem.name }}</div>
                    <div class="tip">
                      {{
                        utils.formatDateTime(Number(versionItem.updatedTs ?? versionItem.createdTs))
                      }}&nbsp;{{ versionItem.updatedBy ?? versionItem.createdBy }}
                    </div>
                  </div>

                  <v-menu>
                    <template #activator="{ on, attrs }">
                      <v-icon
                          class="more"
                          size="15"
                          color="#83829A"
                          v-bind="attrs"
                          v-on="on"
                          @click="historyItem = versionItem"
                      >
                        mdi-dots-vertical
                      </v-icon>
                    </template>
                    <v-list style="cursor: pointer">
                      <v-list-item key="rename">
                        <v-list-item-title
                            @click="$refs.modelRename.start()"
                        >
                          {{ $t('editName') }}
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                          key="save"
                          v-if="
                              historyItem.version &&
                                historyItem.version !== items[0].version
                            "
                      >
                        <v-list-item-title @click="saveVersion()">
                          {{ $t('saveAsNewest') }}
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                          key="delete"
                          @click="deleteDialog.display = true"
                      >
                        <v-list-item-title>{{ $t('delete') }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </div>
            </div>
          </div>
        </v-navigation-drawer>
        <ReSizeDrawerRight :init-width="500" ref="resizeDrawerRight" @setLeftWidth="setRightWidth">
          <v-expansion-panels flat tile accordion multiple v-model="defaultPanel">
            <v-expansion-panel>
              <v-expansion-panel-header style="padding: 15px 13px;" color="#f3f4f9">
                <template #default>
                  <span style="line-height: 1.3">{{ $t('quickSetting') }}</span>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div style="display: flex; flex-direction: column; height: 100%">
                  <div style="border-bottom: 1px solid rgba(187, 187, 187, 1)"></div>
                  <div style="flex: 0">
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-subtitle class="subtitle">
                          {{ (element.type || "").replace("dmn:", "") }}
                        </v-list-item-subtitle>
                        <div class="main-value" style="margin-top: 5px">
                          {{
                            element.businessObject &&
                            (element.businessObject.name || element.businessObject.id)
                          }}
                        </div>
                      </v-list-item-content>
                    </v-list-item>
                  </div>
                  <model-conversation
                      :node="node"
                      :item="item"
                      :user-id="userId"
                      @save="saveConversation"
                      ref="modelConversation"
                  />
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel readonly>
              <v-expansion-panel-header hide-actions style="padding: 0">
                <template #default>
                  <div class="d-flex flex-row"
                       style="padding: 15px 13px;background-color: #F3F4F9;border-top: 1px solid rgba(187, 187, 187, 1);border-bottom: 1px solid rgba(187, 187, 187, 1)">
                    <span style="line-height: 1.3">{{ $t('propertyPanel') }}</span>
                    <v-spacer/>
                  </div>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div :id="`properties-panel-${refSuffix}`"></div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </ReSizeDrawerRight>
      </el-row>
    </div>
    <v-dialog v-model="deleteDialog.display" max-width="300">
      <v-card>
        <v-card-title class="headline" style="color: #444262">
          {{ $t('deleteMilestone') }}
        </v-card-title>
        <v-card-text>
          {{ $t('deleteMilestoneConfirmWithName',{name:historyItem.name}) }}
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer/>
          <v-btn text @click="deleteDialog.display = false"> {{ $t('cancel') }}</v-btn>
          <v-btn
              style="color: #ffffff"
              color="#FF7754"
              @click="deleteVersion()"
          >
            <v-icon size="16" color="#ffffff" style="margin-right: 6px">
              mdi-comment-quote-outline
            </v-icon>
            {{ $t('delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <model-save :items="items" ref="modelSave" @save="save"/>
    <model-rename :item="historyItem" ref="modelRename" @save="rename"/>
    <model-association
        :role="role"
        :associations="resource.associations"
        ref="modelAssociation"
        @save="saveAssociation"
    />
    <v-dialog v-model="deployDialog.display" width="450">
      <v-card>
        <v-card-title>{{ $t('deploy') }}</v-card-title>
        <v-card-text>
          {{ $t('deployAlert') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="deployDialog.display = false">{{ $t('cancel') }}</v-btn>
          <v-btn
              class="text-white"
              color="#EB4F2E"
              :loading="deployDialog.commitLoading"
              @click="onDeployCommit"
          >
            {{ $t('deploy') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deployErrorDialog.display" width="600">
      <v-card>
        <v-card-title style="color: #ff7754">{{ $t('deployFail') }}</v-card-title>
        <v-card-text>
          <div class="d-flex flex-column">
            <span
            >{{ $t('plsViewErrorInfoWithInfo',{info:deployErrorDialog.result &&
              deployErrorDialog.result.response &&
              deployErrorDialog.result.response.status
                  ? deployErrorDialog.result.response.status
                  : deployErrorDialog.result}) }}</span
            >
            <span
                v-if="
                deployErrorDialog.result.response &&
                deployErrorDialog.result.response.data &&
                deployErrorDialog.result.response.data.message
              "
                style="
                border: 1px solid grey;
                border-radius: 5px;
                background-color: #f3f4f9;
                padding: 10px;
                margin-top: 20px;
                max-height: 300px;
                overflow-y: auto;
              "
            >{{ deployErrorDialog.result.response.data.message }}</span
            >
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="deployErrorDialog.display = false" text>{{ $t('back') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deploySuccessDialog.display" width="450">
      <v-card>
        <v-card-title style="color: #57928d">{{ $t('deploySuccess') }}</v-card-title>
        <v-card-text>{{ $t('deployDmnSuccess') }}</v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="deploySuccessDialog.display = false">{{ $t('back') }}</v-btn>
          <v-btn text @click="goDeployCenter" color="#0F40F5"
          >{{ $t('goToDeploy') }}
          </v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="saveResult.display" width="450">
      <v-card>
        <v-card-title style="color: #444262">
          <v-icon color="#FF7754" left>mdi-folder-alert</v-icon>
          {{ $t('versionConflicts') }}
        </v-card-title>
        <v-card-text>{{ $t('versionConflictsWithUserAndTime',{user:saveResult.data.updatedBy,time:utils.formatDateTime(saveResult.data.updatedTs)}) }}
        </v-card-text>
        <v-card-actions style="padding: 24px 16px">
          <v-spacer/>
          <v-btn
              @click="saveResult.type==='rename'?rename($refs.modelRename.getCurrentName(),true):save({ id: item.id,forceSave:true })"
              color="#FF7754" class="white--text">
            <v-icon color="white" left>mdi-alert-circle</v-icon>
            {{ $t('stillSave') }}
          </v-btn>
          <v-btn text @click="saveResult.type==='rename'?$refs.modelSaveHistory.start():$refs.modelSave.start()"
                 color="#312651">
            <v-icon color="#B1ABB6" left>mdi-source-branch</v-icon>
            {{ $t('saveAs') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import utils from "@/utils/utils";
import VueDmnModeler from "@/components/common/DMNModeler";
import ModelSave from "@/components/common/modeler/ModelSave";
import ModelRename from "@/components/common/modeler/ModelRename";
import ModelConversation from "@/components/common/modeler/ModelConversation";
import ModelAssociation from "@/components/common/modeler/ModelAssociation";
import {saveAs} from "file-saver";
import modelerCommon from "./mixins/index";
import decisionRequest from "@/api/decision";
import ReSizeDrawerRight from "@/components/common/ReSizeDrawerRight";

export default {
  mixins: [modelerCommon],
  components: {
    VueDmnModeler,
    ModelSave,
    ModelRename,
    ModelConversation,
    ModelAssociation,
    ReSizeDrawerRight
  },
  computed: {
    userName() {
      return (
          this.$store.state.user.profile.firstName +
          " " +
          this.$store.state.user.profile.lastName
      );
    },
    userId() {
      return this.$store.state.user.profile.id;
    },
  },
  data() {
    return {
      refSuffix: new Date().getTime(),
      utils,
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
        mode: "application/xml",
        gutters:[
          "CodeMirror-lint-markers",
          "CodeMirror-linenumbers",
          "CodeMirror-foldgutter"
        ],
        foldGutter: true, // 启用行槽中的代码折叠
      },
      deploySuccessDialog: {
        display: false,
        commitLoading: false,
      },
      deployDialog: {
        display: false,
        commitLoading: false,
      },
      deployErrorDialog: {
        display: false,
        result: {},
      },
      collectionName: "test1",
      language: false,
      showProperty: false,
      left: true,
      editXml: false,
      defaultPanel: [0, 1],
      leftStylePadding: {},
      leftStyleMargin: {},
      rightStyleMargin: {},
      right: false,
      modeler: null,
      element: {},
      businessObject: {},
      documentation: "",
      node: {
        id: "",
        conversation: [],
      },
      historyItem: {},
      items: [],
      deleteDialog: {
        display: false,
      },
      role: "",
      resource: {
        associations: [],
      },
      project: {},
    };
  },
  watch: {
    $route: {
      handler() {
        this.getData();
      },
    },
    resourceUpdated:{
      handler(val){
        this.$emit("onResourceUpdated",val);
      }
    }
  },
  methods: {
    setRightWidth(payload) {
      let self = this;
      self.showProperty = payload.left;
      self.rightStyleMargin = {
        marginRight: `${payload.left ? payload.width : 0}px`,
      };
    },
    goDeployCenter() {
      this.$router.replace("/automation/deploy/index");
    },
    async onDeployCommit() {
      let self = this;
      if (self.$refs.vueDmnModeler) {
        self.deployDialog.commitLoading = true;
        let xml = self.showEditXml?self.item.xml:await self.$refs.vueDmnModeler.getXml(false);
        try {
          let formData = new FormData();
          let blob = new Blob([xml], {type: "text/xml"});
          let timestamp = new Date().getTime();
          formData.append(
              "data0",
              new File([blob], `${self.resource.name}-${timestamp}.dmn`, {
                type: "text/xml",
              })
          );
          formData.append("deployment-name", `${self.resource.name}`);
          formData.append("deployment-source", "bpez");
          formData.append("deploy-changed-only", "true");
          let response = await decisionRequest.createDeployment(formData);
          await self.save({id: self.item.id});
          self.deployDialog.commitLoading = false;
          self.deployDialog.display = false;
          self.deploySuccessDialog.display = true;
        } catch (e) {
          console.log(e);
          self.deployErrorDialog.result = e;
          self.deployErrorDialog.display = true;
          self.deployDialog.display = false;
          self.deployDialog.commitLoading = false;
        }
      }
    },
    setShowProperty() {
      this.$refs.resizeDrawerRight.setLeft(this.showProperty);
    },
    async changeXmlViewer() {
      let self = this;
      if (self.editXml) {
        self.item.xml = await this.$refs.vueDmnModeler.getXml();
        self.showProperty = false;
        this.$refs.resizeDrawerRight.setLeft(false);
      }
      self.showEditXml = self.editXml;
    },
    async downXML() {
      let xml = await this.$refs.vueDmnModeler.getXml(false);
      var blob = new Blob([xml], {type: "text/xml"});
      saveAs(blob, this.item.name ? `${this.resource.name}-${this.item.name}.dmn` : `${this.resource.name}.dmn`);
    },
    selectElement(element) {
      this.element = element;
    },
  },
};
</script>

<style scoped>
/deep/ #xmlContainer .vue-codemirror .CodeMirror {
  overscroll-y: scroll !important;
  height: 100% !important;
}

/deep/ .v-window__container {
  height: 100% !important;
  overflow-y: auto;
}

.copyIcon {
  opacity: 0;
}

.tabCopy:hover .copyIcon {
  opacity: 1;
}

.value:hover .copyIcon,
.main-value:hover .copyIcon {
  opacity: 1;
}

.small-headline {
  color: #444262;
  font-size: 16px;
  font-weight: bold;
}

.checkbox-tip {
  margin: 0;
}

div.v-list-item__subtitle.subtitle {
  color: rgba(136, 136, 136, 100);
  font-size: 0.8em;
  text-align: left;
}

div.value {
  color: rgba(16, 16, 16, 100);
  font-size: 0.8em;
  text-align: left;
}

div.main-value {
  color: #444262;
  font-size: 18px;
  text-align: left;
}

button.process-menu {
  padding: 0 10px;
}

.title-menu {
  padding-left: 15px;
  font-size: 13px;
  color: #312651;
  margin-top: auto;
  margin-bottom: auto;
}

button.process-menu span {
  color: rgba(33, 33, 33, 100);
  font-size: 0.8em;
}

div.stretch {
  min-height: calc(100vh - 113px);
}

.badge {
  display: inline-block;
  min-width: 10px;
  padding: 3px 7px;
  font-weight: bold;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  border-radius: 6px;
  background-color: #70b8db;
  border: 0;
  margin-right: 10px;
  color: #fff;
}

.closed-incidents,
.activity-instance-canceled,
.activity-instance-completed,
.instance-count,
.instance-incidents {
  cursor: pointer;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 120px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  padding: 0px 16px;
  z-index: 1;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.menu-border {
  border-bottom: none;
  height: 45px;
}

div.v-sheet.v-card.detail-card:not(.v-sheet--outlined) {
  box-shadow: 0 0px 0px 0px;
}

.badge-total {
  background-color: #b1abb6;
}

.badge-instance {
  background-color: #57928d;
}

.badge-incident {
  background-color: #fa4f07;
}

.badge-total i,
.badge-instance i,
.badge-incident i {
  margin-right: 2px;
}

i.v-icon.point::after {
  font-size: 14px;
  content: "";
  display: block;
  width: 6px;
  height: 6px;
  background-color: #ff7754;
  border-radius: 50%;
  position: relative;
  right: 5px;
  top: -5px;
  opacity: 1;
}

.box {
  display: flex;
  flex-direction: column;
}

.box-header {
  border-top: 1px solid rgba(187, 187, 187, 1);
  border-bottom: 1px solid rgba(187, 187, 187, 1);
  height: 42px;
}

.box-icon {
  width: 45px;
  height: 100%;
  border-right: 1px solid rgba(187, 187, 187, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  float: left;
}

.box-title {
  display: flex;
  align-items: center;
  height: 100%;
}

.box-title span {
  color: #444262;
  font-size: 14px;
  margin-left: 10px;
}

.box-icon i.theme--light.v-icon {
  font-size: 18px;
}

.box
div.theme--light.v-input.v-textarea.v-textarea.v-text-field--enclosed.v-text-field--outlined {
  /* border: 1px solid#E6E4E6; */
  background-color: #f3f4f9;
  margin: 10px;
  padding: 0;
}

.box textarea {
  background-color: #f3f4f9;
  margin: 10px;
  padding: 5px;
  border: 1px solid #E6E4E6;
}

/deep/
.box
div.v-textarea.v-text-field--enclosed.v-text-field--outlined:not(
    .v-input--dense
  )
.v-text-field__slot
textarea {
  margin-top: 0;
}

.box .nav-item {
  display: flex;
}

.box .nav-item .name {
  width: 30px;
  height: 30px;
  background-color: #312651;
  color: #ffffff;
  margin-top: 10px;
  border-radius: 50%;
  text-align: center;
}

.box .nav-item .name span {
  vertical-align: middle;
  font-size: 14px;
}

.box .nav-item .content {
  flex: 1;
  margin: 10px 0 10px 15px;
}

.box.history .nav-item {
  flex: 1;
  margin: 0;
  padding: 20px 16px;
}

.box.history .nav-item .content {
  flex: 1;
  margin: 0;
}

.box.history .nav-item:hover {
  background-color: rgba(243, 244, 249);
}

.box.history .nav-item:not(:last-child) {
  border-bottom: 1px solid #bbbbbb;
}

.box .nav-item .main {
  color: #444262;
  font-size: 14px;
}

.box .nav-item.active .main {
  color: #312651;
  font-weight: bold;
  font-size: 14px;
}

.box .more {
  margin: auto;
  height: 25px;
  opacity: 0;
}

.box .nav-item:hover .more {
  opacity: 1;
}

.box.history .nav-item .main {
  color: #312651;
  font-size: 14px;
}

.box.history .nav-item .tip {
  color: #83829a;
  font-size: 12px;
  margin-top: 10px;
}

.box .nav-item .sub {
  color: #83829a;
  font-size: 12px;
  margin-top: 8px;
}

.box .nav-item .tip {
  color: #83829a;
  font-size: 12px;
  margin-top: 0px;
}

.box .nav-input {
  margin: 15px 20px;
  display: flex;
}

.box
.nav-input
div.v-input.theme--light.v-text-field.v-text-field--placeholder {
  margin: 0;
  padding: 0;
}

.box .nav-input input {
  flex: 1;
  height: 30px;
  border: 1px solid #E6E4E6;
  padding: 5px;
}

/deep/
.box
.nav-input
div.v-input.theme--light.v-text-field.v-text-field--placeholder
input {
  padding: 0;
}

/deep/ .v-expansion-panel-content__wrap {
  padding: 0;
}

/deep/ .v-expansion-panel--active > .v-expansion-panel-header {
  min-height: unset;
}

.share input {
  flex: 1;
  height: 36px;
  border: 1px solid #E6E4E6;
  padding: 5px;
  width: 100%;
}

div.password-setting span {
  color: #83829a;
  font-size: 14px;
  margin-left: 8px;
}

span.password-split {
  color: #83829a;
  font-size: 20px;
  margin: 0 8px;
}

div.type-switch {
  margin: auto 0 auto 15px;
  padding: 0;
  height: 24px;
}
</style>

<style>
.el-message .el-icon-success {
  color: #444262;
}

.el-message--success .el-message__content {
  color: #444262;
}

.el-notification {
  min-width: 380px;
  border-radius: 4px;
  border-width: 1px;
  border-style: solid;
  overflow: hidden;
  background-color: #fef0f0;
  border-color: #fde2e2;
}

.el-notification__title {
  color: #f56c6c;
  font-size: 14px;
  font-weight: 400;
}

.el-icon-error {
  font-size: 16px;
}

.el-notification__icon {
  height: auto;
  width: auto;
}
</style>
