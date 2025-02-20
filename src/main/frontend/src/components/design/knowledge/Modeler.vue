<template>
  <div
    class="d-flex flex-column"
    style="border-top: 1px solid rgba(187, 187, 187, 1); height: 100%"
  >
    <div class="d-flex flex-row" style="padding: 14px 15px">
      <v-breadcrumbs
        :items="idBreadcrumbs"
        style="background-color: #e8eff7; padding: 0px; border: none"
        divider="|"
      />
    </div>
    <v-card
      class="detail-card"
      style="border-top: 1px solid rgba(187, 187, 187, 1); flex: 1; height: 0"
    >
      <v-layout style="margin: 0; height: 100%" class="stretch">
        <re-size-drawer ref="resizeDrawer" :init-width="700" @setLeftWidth="setLeftWidth">
          <v-icon class="navigation-icon" @click="switchLeft()">
            mdi-chevron-left
          </v-icon>
          <div style="display: flex; flex-direction: column; height: 100%">
            <div style="flex: 0">
              <div class="d-flex flex-row menu-border">
                <v-switch
                    color="#312651"
                    class="type-switch"
                    v-model="editXml"
                    :label="$t('xmlViewer')"
                    style="margin-left: 20px"
                    flat
                    inset
                    @change="changeXmlViewer()"
                >
                  <template #label>
                    <span style="color: rgb(68, 66, 98);font-size: 14px">{{ $t('xmlViewer') }}</span>
                  </template>
                </v-switch>
                <template v-if="!editXml">
                  <v-switch
                      color="#312651"
                      class="type-switch"
                      v-model="language"
                      flat
                      inset
                      @change="changeLanguage()"
                  >
                    <template #label>
                    <span v-if="language" style="font-size: 14px"
                    ><span style="font-weight: bold; color: #444262">中文</span
                    ><span style="color: #83829a">/EN</span></span
                    >
                      <span v-else style="font-size: 14px"
                      ><span style="font-weight: bold; color: #444262">EN</span
                      ><span style="color: #83829a">/中文</span></span
                      >
                    </template>
                  </v-switch>

                  <v-switch
                      color="#312651"
                      class="type-switch"
                      v-model="showProperty"
                      :label="$t('propertyPanel')"
                      style="margin-left: 20px"
                      flat
                      inset
                      @change="setShowProperty(showProperty)"
                  >
                    <template #label>
                <span style="color: rgb(68, 66, 98);font-size: 14px">{{ $t('propertyPanel') }}</span
                >
                    </template>
                  </v-switch>
                </template>
              </div>
            </div>
            <div v-if="showEditXml" id="xmlContainer" style="flex: 1;width: 100%;height: calc(100% - 45px)">
              <codemirror
                  style="height: 100%"
                  v-model="item.xml"
                  :options="options"
                  @input="resourceUpdated=true"
              />
            </div>
            <bpmn-modeler
              v-else
              style="flex: 1"
              ref="bpmnModeler"
              :diagram-xml="item.xml"
              @onClickNode="selectElement"
              :export-name="
                item.name ? `${resource.name}-${item.name}` : `${resource.name}`
              "
              @save="save"
            />
          </div>
        </re-size-drawer>
        <div class="horizontal-collapsed" v-if="!left">
          <v-icon class="navigation-icon" @click="switchLeft()">
            mdi-chevron-right
          </v-icon>
        </div>
        <div style="display: flex; flex-direction: column; width: 100%">
          <div class="d-flex flex-row menu-border" :style="leftStylePadding">
            <v-spacer />
            <v-menu
              v-model="tag.display"
              v-if="item.id"
              offset-y
              :close-on-content-click="false"
            >
              <template #activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  large
                  text
                  class="process-menu"
                  style="
                    border-left: 1px solid rgba(187, 187, 187, 1);
                    border-right: 1px solid rgba(187, 187, 187, 1);
                  "
                >
                  <v-icon size="16" color="#83829A" style="margin-right: 6px">
                    mdi-tag-multiple-outline
                  </v-icon>
                  <span style="color: #444262; font-size: 14px">{{ $t('tag') }}</span>
                </v-btn>
              </template>
              <v-card width="300" class="share">
                <v-card-text>
                  <v-form ref="form" lazy-validation>
                    <v-row>
                      <v-col>
                        <v-text-field
                          :placeholder="$t('plsEnterTagName')"
                          v-model="tag.name"
                          hide-details
                          @keydown.enter="saveTags()"
                        />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-chip
                          v-for="(name, index) in tag.names"
                          :key="name"
                          color="#444262"
                        >
                          <span class="chip-text">{{ name }}</span>
                          <v-icon size="16" @click="removeTag(index)">
                            mdi-close-circle
                          </v-icon>
                        </v-chip>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>
                <!-- <v-card-actions>
                  <v-spacer />
                  <v-btn text @click="generate.display = false"> 取消 </v-btn>
                  <v-btn
                    @click="generateResource"
                    color="#FF7754"
                    :disabled="!generate.groupId || !generate.projectId || !generate.name"
                    text
                  >
                    创建
                  </v-btn>
                </v-card-actions> -->
              </v-card>
            </v-menu>

            <v-btn
              large
              text
              class="process-menu"
              @click="onImportClick"
              style="border-right: 1px solid rgba(187, 187, 187, 1)"
            >
              <v-icon size="16" color="#83829A" style="margin-right: 6px">
                mdi-import
              </v-icon>
              <span style="color: #444262; font-size: 14px">{{ $t('importFile') }}</span>
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

            <v-menu v-if="item.id" offset-y>
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
                  <v-icon size="16" color="#83829A" style="margin-right: 6px">
                    mdi-content-save
                  </v-icon>
                  <span style="color: #444262; font-size: 14px">{{ $t('save') }}</span>
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

            <v-menu v-if="item.id&&!showEditXml" offset-y>
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
                  <v-list-item-title @click="$refs.bpmnModeler.getXML(true)">
                    <span style="font-size: 14px">BPMN</span>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item key="svg" @click="$refs.bpmnModeler.getSVG(true)">
                  <v-list-item-title>
                    <span style="font-size: 14px">SVG</span>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-menu
              v-model="share.display"
              v-if="item.id"
              offset-y
              :close-on-content-click="false"
            >
              <template #activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  large
                  text
                  class="process-menu"
                  style="border-right: 1px solid rgba(187, 187, 187, 1)"
                >
                  <v-icon size="16" color="#83829A" style="margin-right: 6px">
                    mdi-share-outline
                  </v-icon>
                  <span style="color: #444262; font-size: 14px">{{ $t('share') }}</span>
                </v-btn>
              </template>
              <v-card width="500" class="share">
                <v-card-title class="small-headline">{{ $t('shareCurrentDesign') }}</v-card-title>
                <v-card-text>
                  <v-form ref="form" lazy-validation>
                    <v-row style="margin: 0">
                      <v-col style="padding: 0 20px 0 0" cols="10">
                        <input disabled="true" :value="url" />
                      </v-col>
                      <v-col style="padding: 0 50px 0 0" cols="2">
                        <v-btn
                          color="#ffffff"
                          style="background-color: #ff7754"
                          text
                          outlined
                          @click="copy(url)"
                        >
                          {{ $t('copy') }}
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-row v-if="share.displayPassword" style="margin: 10px 0 0 0">
                      <v-col style="padding: 0 20px 0 0" cols="10">
                        <input
                          type="password"
                          v-model="share.password"
                          :placeholder="$t('enterNewPwdSave')"
                        />
                      </v-col>
                      <v-col style="padding: 0 50px 0 0" cols="2">
                        <v-btn
                          color="#ffffff"
                          style="background-color: #ff7754"
                          text
                          outlined
                          @click="savePassword"
                        >
                          {{ $t('save') }}
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <div v-if="!item.password" class="password-setting">
                    <v-icon size="16" color="#312651"> mdi-lock-open</v-icon>
                    <span>{{ $t('noAuthShare') }}</span>
                  </div>
                  <div v-if="item.password" class="password-setting">
                    <v-icon size="16" color="#312651"> mdi-lock</v-icon>
                    <span>{{ $t('authShare') }}</span>
                  </div>
                  <span class="password-split">|</span>
                  <v-btn @click="togglePassword" color="#FF7754" text>
                    {{ $t(share.displayPassword ? "remove" : "add") }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
            <v-menu
              v-model="generate.display"
              v-if="item.id"
              offset-y
              :close-on-content-click="false"
            >
              <template #activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  large
                  text
                  class="process-menu"
                  style="border-right: 1px solid rgba(187, 187, 187, 1)"
                >
                  <v-icon size="16" color="#83829A" style="margin-right: 6px">
                    mdi-export-variant
                  </v-icon>
                  <span style="color: #444262; font-size: 14px">{{ $t('generate') }}</span>
                </v-btn>
              </template>
              <v-card width="300" class="share">
                <v-card-title class="small-headline">{{ $t('generateProcess') }}</v-card-title>
                <v-card-text>
                  <v-form ref="form" lazy-validation>
                    <v-row>
                      <v-col>
                        <v-select
                          :label="$t('selectBpmnGroup')"
                          :full-width="true"
                          :single-line="true"
                          hide-details
                          @change="getProjects()"
                          :items="groups"
                          item-value="id"
                          item-text="name"
                          v-model="generate.groupId"
                          dense
                          :no-data-text="$t('noGroupData')"
                          style="
                            height: 100%;
                            margin: 0;
                            margin-top: 1px;
                            font-size: 14px;
                          "
                        />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12">
                        <v-select
                          :label="$t('selectProject')"
                          :full-width="true"
                          :single-line="true"
                          hide-details
                          :items="projects"
                          item-value="id"
                          item-text="name"
                          v-model="generate.projectId"
                          dense
                          :no-data-text="$t('noProject')"
                          style="
                            height: 100%;
                            margin: 0;
                            margin-top: 1px;
                            font-size: 14px;
                          "
                        />
                      </v-col>
                      <v-col cols="12" style="padding: 0 12px; font-size: 12px">
                        <router-link
                          :to="{
                            name: 'knowledge-list',
                          }"
                          @click.native.capture="goToList"
                        >
                          {{ $t('createNewProject') }}
                        </router-link>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field
                          :label="$t('designFileName')"
                          :placeholder="$t('plsEnterDesignFileName')"
                          v-model="generate.name"
                          hide-details
                          @keydown.enter="createProject()"
                        />
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn text @click="generate.display = false"> {{ $t('cancel') }} </v-btn>

                  <v-btn
                    @click="generateResource"
                    color="#FF7754"
                    :disabled="!generate.groupId || !generate.projectId || !generate.name"
                    text
                  >
                    {{ $t('create') }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </div>
          <el-row
            style="
              height: 100%;
              border-top: 1px solid rgba(187, 187, 187, 1);
              overflow-y: scroll;
            "
            :style="leftStyleMargin"
          >
            <editors
              :config="item.configJson"
              :parent-refs="$refs"
              @select="setShowProperty"
              ref="editors"
            />
            <v-navigation-drawer
              :width="330"
              absolute
              mobile-breakpoint="0"
              v-model="right"
              style="z-index: 199"
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
                            utils.formatDateTime(
                              Number(versionItem.updatedTs ?? versionItem.createdTs)
                            )
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
                            <v-list-item-title @click="$refs.modelRename.start()">
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
                          <v-list-item key="delete" @click="deleteDialog.display = true">
                            <v-list-item-title>{{ $t('delete') }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </div>
                  </div>
                </div>
              </div>
            </v-navigation-drawer>
          </el-row>
        </div>
      </v-layout>
      <v-dialog v-model="deleteDialog.display" max-width="300">
        <v-card>
          <v-card-title class="headline" style="color: #444262">
            {{ $t('deleteMilestone') }}
          </v-card-title>
          <v-card-text> {{ $t('deleteMilestoneConfirmWithName',{name:historyItem.name}) }} </v-card-text>
          <v-card-actions style="padding-bottom: 16px">
            <v-spacer />
            <v-btn text @click="deleteDialog.display = false"> {{ $t('cancel') }}</v-btn>
            <v-btn style="color: #ffffff" color="#FF7754" @click="deleteVersion()">
              <v-icon size="16" color="#ffffff" style="margin-right: 6px">
                mdi-comment-quote-outline
              </v-icon>
              {{ $t('delete') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
    <model-save :items="items" ref="modelSave" @save="save" />
    <model-save :items="items" ref="modelSaveHistory" @save="saveHistory" />
    <model-rename :item="historyItem" ref="modelRename" @save="rename" />
    <model-association
      :role="role"
      :associations="resource.associations"
      ref="modelAssociation"
      @save="saveAssociation"
    />
    <v-dialog v-model="importBPMNDialog.display" max-width="450">
      <v-card>
        <v-card-title class="headline" style="color: #444262"> {{ $t('importFile') }} </v-card-title>
        <v-card-text>
          <v-row style="margin: 0">
            <v-col style="padding: 0" cols="12">
              <v-file-input
                :placeholder="$t('selectFile')"
                hide-details
                accept=".bpmn"
                v-model="importBPMNDialog.file"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer />
          <v-btn text @click="onImportCancel()"> {{ $t('cancel') }}</v-btn>
          <v-btn
            style="color: #ffffff"
            color="#FF7754"
            :disabled="!importBPMNDialog.file"
            @click="onImportSubmit()"
          >
            <v-icon size="16" color="#ffffff" style="margin-right: 6px">
              mdi-content-save
            </v-icon>
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="saveResult.display" width="450">
      <v-card>
        <v-card-title style="color: #444262"><v-icon color="#FF7754" left>mdi-folder-alert</v-icon>{{ $t('versionConflicts') }}</v-card-title>
        <v-card-text>{{ $t('versionConflictsWithUserAndTime',{user:saveResult.data.updatedBy,time:utils.formatDateTime(saveResult.data.updatedTs)}) }}
        </v-card-text>
        <v-card-actions style="padding: 24px 16px">
          <v-spacer />
          <v-btn @click="saveResult.type==='rename'?rename($refs.modelRename.getCurrentName(),true):save({ id: item.id,forceSave:true })" color="#FF7754" class="white--text"><v-icon color="white" left>mdi-alert-circle</v-icon> {{ $t('stillSave') }}</v-btn>
          <v-btn text @click="saveResult.type==='rename'?$refs.modelSaveHistory.start():$refs.modelSave.start()" color="#312651"><v-icon color="#B1ABB6" left>mdi-source-branch</v-icon>{{ $t('saveAs') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import BpmnModeler from "@/components/common/modeler/BPMNModeler";
import Editors from "./Editors";
import ModelSave from "@/components/common/modeler/ModelSave";
import ModelRename from "@/components/common/modeler/ModelRename";
import ModelConversation from "@/components/common/modeler/ModelConversation";
import ModelAssociation from "@/components/common/modeler/ModelAssociation";
import utils from "@/utils/utils";
import modelerUtils from "@/utils/modeler/modeler";
import camundaRequest from "@/api/camunda-service";
import collaborationRequest from "@/api/collaboration";
import ReSizeDrawer from "@/components/common/ReSizeDrawer";
import { isAny } from "bpmn-js/lib/features/modeling/util/ModelingUtil";
import { getExtensionElementsList } from "camunda-bpmn-js/lib/util/ExtensionElementsUtil";
import userRequest from "@/api/user";
import modelerCommon from "./mixins/index";

export default {
  mixins: [modelerCommon],
  components: {
    BpmnModeler,
    ModelSave,
    ModelRename,
    ModelConversation,
    ModelAssociation,
    ReSizeDrawer,
    Editors,
  },
  computed: {
    isEditNodeProps() {
      let self = this;
      return (
        self.element &&
        self.element.businessObject &&
        isAny(self.element.businessObject, [
          "bpmn:UserTask",
          "bpmn:ServiceTask",
          "bpmn:BusinessRuleTask",
          "bpmn:CallActivity",
        ])
      );
    },
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
    url() {
      let url=this.parseUrl();
      return `${url}/viewer.html#/automation/bpmn/index/${this.item.id}`;
    },
  },
  data() {
    return {
      editXml: false,
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
      importBPMNDialog: {
        display: false,
        file: null,
      },
      utils,
      collectionName: "test1",
      language: false,
      showProperty: false,
      left: true,
      leftStylePadding: {},
      leftStyleMargin: {},
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
        tags: "",
      },
      project: {},
      setNodeProps: {
        selectItem: {
          configJson: {},
        },
        listeners: [],
        commitLoading: false,
        dataLoading: false,
        searchString: "",
        items: [],
        dmnMapDecisionResults: [
          { text: "collectEntries (List<Object>)", value: "collectEntries" },
          {
            text: "resultList (List<Map<String, Object>>)",
            value: "resultList",
          },
          { text: "singleEntry (TypedValue)", value: "singleEntry" },
          { text: "singleResult (Map<String, Object>)", value: "singleResult" },
        ],
        userTask: {
          input: [],
          assignee: "",
          candidateUsers: [],
          candidateGroups: [],
          assigneeItems: [],
          assigneeLoading: false,
          candidateUsersItems: [],
          candidateUsersLoading: false,
          candidateGroupsItems: [],
          candidateGroupsLoading: false,
          assigneeSearchStr: null,
          candidateUsersSearchStr: null,
          candidateGroupsSearchStr: null,
        },
      },
    };
  },
  watch: {
    "setNodeProps.userTask.assigneeSearchStr": {
      async handler(val) {
        let self = this;
        if (!val || val.length === 0) {
          return;
        }

        // Items have already been requested
        if (self.setNodeProps.userTask.assigneeLoading) return;

        self.setNodeProps.userTask.assigneeLoading = true;
        let users = await userRequest.getUsers({ firstNameLike: `%${val}%` });
        self.setNodeProps.userTask.assigneeItems = users;
        self.setNodeProps.userTask.assigneeLoading = false;
      },
    },
    "setNodeProps.userTask.candidateUsersSearchStr": {
      async handler(val) {
        let self = this;
        if (!val || val.length === 0) {
          return;
        }
        // 保留已选项目
        let selectItems = self.setNodeProps.userTask.candidateUsersItems.filter(
          (item) => {
            return self.setNodeProps.userTask.candidateUsers.includes(item.id);
          }
        );

        // Items have already been requested
        if (self.setNodeProps.userTask.candidateUsersLoading) return;

        self.setNodeProps.userTask.candidateUsersLoading = true;
        let users = await userRequest.getUsers({ firstNameLike: `%${val}%` });
        selectItems.forEach((selectItem) => {
          if (!users.includes(selectItem)) {
            users.push(selectItem);
          }
        });
        self.setNodeProps.userTask.candidateUsersItems = users;
        self.setNodeProps.userTask.candidateUsersLoading = false;
      },
    },
    "setNodeProps.userTask.candidateGroupsSearchStr": {
      async handler(val) {
        let self = this;
        if (!val || val.length === 0) {
          return;
        }
        // 保留已选项目
        let selectItems = self.setNodeProps.userTask.candidateGroupsItems.filter(
          (item) => {
            return self.setNodeProps.userTask.candidateGroups.includes(item.id);
          }
        );

        // Items have already been requested
        if (self.setNodeProps.userTask.candidateGroupsLoading) return;

        self.setNodeProps.userTask.candidateGroupsLoading = true;
        let users = await userRequest.getGroupsWithParams({ nameLike: `%${val}%` });
        selectItems.forEach((selectItem) => {
          if (!users.includes(selectItem)) {
            users.push(selectItem);
          }
        });
        self.setNodeProps.userTask.candidateGroupsItems = users;
        self.setNodeProps.userTask.candidateGroupsLoading = false;
      },
    },
    $route: {
      handler() {
        this.getData();
      },
    },
  },
  methods: {
    parseUrl() {
      let url = window.location.href;
      if (url.indexOf("/index.html")>-1){
        url = url.split("/index.html")[0];
      }else {
        url = url.split("/#")[0];
      }
      return url;
    },
    onNodeSetPropsSelectItemClick(item) {
      let self = this;
      self.setNodeProps.selectItem = item;
      // 自动保存
      self.submitSetProps();
    },
    onAddListener(item) {
      this.setNodeProps.listeners.push(Object.assign(item, { event: "start" }));
      this.submitSetProps();
    },
    onRemoveListener(index) {
      this.$delete(this.setNodeProps.listeners, index);
      this.submitSetProps();
    },
    parseQuickSetSelectSubTitle() {
      let self = this;
      let subTitle = "--";
      if (self.setNodeProps.selectItem.configJson) {
        switch (self.element.businessObject.$type) {
          case "bpmn:BusinessRuleTask":
            subTitle = self.setNodeProps.selectItem.configJson.decisionRef;
            break;
          case "bpmn:ServiceTask":
            subTitle = self.setNodeProps.selectItem.configJson.type;
            break;
          case "bpmn:CallActivity":
            subTitle = self.setNodeProps.selectItem.configJson.calledElement;
            break;
          case "bpmn:UserTask":
            subTitle = self.setNodeProps.selectItem.configJson.formKey;
            break;
        }
      }
      return subTitle;
    },
    async submitSetProps(isManal) {
      let self = this;
      let updateId = null;
      if (self.element.businessObject.$type === "bpmn:BusinessRuleTask") {
        // dmn
        // 保存属性
        self.$refs.bpmnModeler.setElementProps(
          self.element,
          self.setNodeProps.selectItem.configJson
        );
        // 对比数据并更新id
        if (self.setNodeProps.selectItem.id) {
          updateId = self.setNodeProps.selectItem.id;
        }
      }
      if (self.element.businessObject.$type === "bpmn:ServiceTask") {
        // dmn
        // 保存属性
        self.$refs.bpmnModeler.setElementProps(
          self.element,
          Object.assign(self.setNodeProps.selectItem.configJson, {
            type: "external",
          })
        );
        // 对比数据并更新id
        if (self.setNodeProps.selectItem.id) {
          updateId = self.setNodeProps.selectItem.id;
        }
      }
      if (self.element.businessObject.$type === "bpmn:CallActivity") {
        // dmn
        // 保存属性
        self.$refs.bpmnModeler.setElementProps(
          self.element,
          self.setNodeProps.selectItem.configJson
        );
        // 对比数据并更新id
        if (self.setNodeProps.selectItem.id) {
          updateId = self.setNodeProps.selectItem.id;
        }
        // 保存taskDelegateOption(Inputs)
        self.$refs.bpmnModeler.updateCamundaIn({
          value: self.setNodeProps.selectItem.configJson.businessKey,
          binding: {
            type: "camunda:in:businessKey",
          },
        });
      }
      if (self.element.businessObject.$type === "bpmn:UserTask") {
        // userTask
        // 保存属性
        self.$refs.bpmnModeler.setElementProps(
          self.element,
          self.setNodeProps.selectItem.configJson
        );
        self.$refs.bpmnModeler.setElementProps(self.element, {
          assignee: self.setNodeProps.userTask.assignee,
          candidateUsers: self.setNodeProps.userTask.candidateUsers.join(","),
          candidateGroups: self.setNodeProps.userTask.candidateGroups.join(","),
        });

        // 对比数据并更新id
        if (self.setNodeProps.selectItem.id) {
          updateId = self.setNodeProps.selectItem.id;
        }
        // 保存taskDelegateOption(Inputs)
        self.$refs.bpmnModeler.updateInputOutputParameterProperty({
          value: self.setNodeProps.userTask.input.join(","),
          binding: {
            type: "camunda:inputParameter",
            name: "taskDelegateOption",
            scriptFormat: null,
          },
        });
      }
      self.$refs.bpmnModeler.updateExtensionProperty(
        "duoApplicationId",
        updateId === null ? "" : `${updateId}`
      );
      // 保存listeners
      self.$refs.bpmnModeler.updateListeners(self.setNodeProps.listeners);
      if (isManal) {
        // 手动保存做提示
        self.$notify.success(this.$t("saveSuccess"));
      }
    },
    async getNodePropsItems(category) {
      let self = this;
      if (!category) {
        switch (self.element.businessObject.$type) {
          case "bpmn:BusinessRuleTask":
            category = "dmn";
            break;
          case "bpmn:ServiceTask":
            category = "externalTask";
            break;
          case "bpmn:CallActivity":
            category = "call";
            break;
          case "bpmn:UserTask":
            category = "form";
            break;
        }
      }
      let data = {
        type: "duo",
        category: category,
      };
      if (self.setNodeProps.searchString && self.setNodeProps.searchString.length > 0) {
        data.nameLike = self.setNodeProps.searchString;
      }
      self.setNodeProps.items = await camundaRequest.getApplications(data);
    },
    async selectElement(element) {
      this.element = element;
      this.setNodeProps.selectItem = {
        configJson: {},
      };
      this.setNodeProps.listeners = [];
      this.setNodeProps.userTask.input = [];
      this.setNodeProps.userTask.candidateUsers = [];
      this.setNodeProps.userTask.candidateGroups = [];
      this.setNodeProps.userTask.assignee = "";
      const props = getExtensionElementsList(
        element.businessObject,
        "camunda:Properties"
      )[0];
      if (props) {
        for (const value of props.get("values")) {
          if (
            value.name === "duoApplicationId" &&
            value.get("value") &&
            value.get("value").length > 0
          ) {
            await camundaRequest.getApplication(value.get("value")).then((res) => {
              this.setNodeProps.selectItem = res;
            });
          }
          if (
            value.name === "duoListenerApplicationId" &&
            value.get("value") &&
            value.get("value").length > 0
          ) {
            // 暂时认为ids.length和listeners.length一定相等
            let ids = value.get("value").split(",");
            let listeners = getExtensionElementsList(
              element.businessObject,
              "camunda:ExecutionListener"
            );
            // if (listeners){
            //   listeners.forEach(listener=>{
            //     // 获取icon/name
            //     let index=listener.get("fields").findIndex(field=>field.name==="duoAppId" && field.string);
            //     if (index>-1){
            //     }
            //   });
            // }
            ids.forEach((id, index) => {
              camundaRequest.getApplication(id).then((res) => {
                this.setNodeProps.listeners.push(
                  Object.assign(res, { event: listeners[index].get("event") })
                );
              });
            });
          }
        }
      }
      const inputOutputs = getExtensionElementsList(
        element.businessObject,
        "camunda:InputOutput"
      )[0];
      if (inputOutputs) {
        inputOutputs.get("inputParameters").forEach((inputParameter) => {
          if (inputParameter.name === "taskDelegateOption") {
            if (inputParameter.value){
              this.setNodeProps.userTask.input = inputParameter.value.split(",");
            }
          }
        });
      }
      if (element.businessObject.$type === "bpmn:UserTask") {
        if (element.businessObject.assignee) {
          this.setNodeProps.userTask.assignee = element.businessObject.assignee;
        }
        if (element.businessObject.candidateUsers) {
          this.setNodeProps.userTask.candidateUsers = element.businessObject.candidateUsers.split(
            ","
          );
        }
        if (element.businessObject.candidateGroups) {
          this.setNodeProps.userTask.candidateGroups = element.businessObject.candidateGroups.split(
            ","
          );
        }
      }
      Object.assign(
        this.setNodeProps.selectItem.configJson,
        modelerUtils.getDMNProps(element)
      );
      this.documentation = modelerUtils.getDocumentation(element);
      this.node = {
        id: element.id,
      };
      this.$refs.editors.locate(element.businessObject);
    },
    async changeLanguage() {
      if (this.item.id) {
        await this.save({ isAuto: true });
      }
      this.item.xml = await this.$refs.bpmnModeler.getXML();
      await this.$refs.bpmnModeler.initModeler(this.language);
      await this.$refs.bpmnModeler.setConnectorIcons(this.item.configJson);
    },
    setShowProperty(showProperty) {
      this.showProperty = showProperty;
      this.$refs.bpmnModeler.setShowProperty(showProperty);
    },
    async changeXmlViewer() {
      let self = this;
      if (self.editXml) {
        self.item.xml = await this.$refs.bpmnModeler.getXML();
        self.showProperty=false;
      }
      self.showEditXml = self.editXml;
    }
  },
};
</script>

<style scoped>
/deep/ #xmlContainer .vue-codemirror .CodeMirror {
  overscroll-y: scroll !important;
  height: 100% !important;
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

.id-breadcrumbs .v-breadcrumbs__item.v-breadcrumbs__item--disabled {
  color: #83829a;
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
  border-bottom: 1px solid rgba(238, 238, 238, 100);
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
  border: 1px solid #e6e4e6;
}

/deep/
  .box
  div.v-textarea.v-text-field--enclosed.v-text-field--outlined:not(.v-input--dense)
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

.box .nav-input div.v-input.theme--light.v-text-field.v-text-field--placeholder {
  margin: 0;
  padding: 0;
}

.box .nav-input input {
  flex: 1;
  height: 30px;
  border: 1px solid #e6e4e6;
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
  border: 1px solid #e6e4e6;
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

.v-chip.theme--light {
  color: #ffffff;
  font-size: 14px;
  margin: 0 4px 4px 0;
}
.v-chip.theme--light .v-icon {
  cursor: pointer;
}
.chip-text {
  margin-right: 4px;
}
</style>
