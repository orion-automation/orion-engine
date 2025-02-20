<template>
  <div class="d-flex flex-column" style="border-top: 1px solid rgba(187, 187, 187, 1);height: 100%">
    <div class="d-flex flex-row" style="padding: 14px 15px">
      <v-breadcrumbs
        :items="idBreadcrumbs"
        style="background-color: #e8eff7;padding: 0px;border: none"
        divider="|"
      />
    </div>
    <v-card
      class="detail-card"
      style="border-top: 1px solid rgba(187, 187, 187, 1);flex: 1;height: 0"
    >
      <v-layout style="margin: 0;height: 100%" class="stretch">
        <re-size-drawer ref="resizeDrawer" @setLeftWidth="setLeftWidth" :init-width="700">
          <v-icon class="navigation-icon" @click="switchLeft()">
            mdi-chevron-left
          </v-icon>
          <div style="display: flex; flex-direction: column; height: 100%">
            <div style="flex: 0">
              <div class="d-flex flex-row menu-border">
                <v-switch
                    color="#312651"
                    class="type-switch"
                    v-model="showProperty"
                    :label="$t('propertyPanel')"
                    style="margin-left: 20px"
                    flat
                    inset
                    @change="setShowProperty()"
                >
                  <template #label>
                <span style="color: rgb(68, 66, 98);font-size: 14px">{{ $t('propertyPanel') }}</span
                >
                  </template>
                </v-switch>
                <v-spacer />
              </div>
            </div>
            <el-row
                style="flex: 1; border-top: 1px solid rgba(187, 187, 187, 1)"
            >
              <vue-dmn-modeler
                  :export-name="
                item.name ? `${resource.name}-${item.name}` : `${resource.name}`
              "
                  :diagram-xml="item.xml" ref="vueDmnModeler" @save="save" @onClickNode="selectElement" />
            </el-row>
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

            <v-menu v-if="item.id" offset-y>
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
                <v-card-title class="small-headline">{{ $t('generateDmn') }}</v-card-title>
                <v-card-text>
                  <v-form ref="form" lazy-validation>
                    <v-row>
                      <v-col>
                        <v-select
                            :label="$t('selectDmnGroup')"
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
                :show-node-doc="false"
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
          <v-card-text>
            {{ $t('deleteMilestoneConfirmWithName',{name:historyItem.name}) }}
          </v-card-text>
          <v-card-actions style="padding-bottom: 16px">
            <v-spacer />
            <v-btn text @click="deleteDialog.display = false">{{ $t('cancel') }}</v-btn>
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
        <v-card-title class="headline" style="color: #444262">{{ $t('importFile') }}</v-card-title>
        <v-card-text>
          <v-row style="margin: 0">
            <v-col style="padding: 0" cols="12">
              <v-file-input
                  :placeholder="$t('selectFile')"
                  hide-details
                  accept=".dmn"
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
        <v-card-text>{{ $t('versionConflictsWithUserAndTime',{user:saveResult.data.updatedBy,time:utils.formatDateTime(saveResult.data.updatedTs)}) }}</v-card-text>
        <v-card-actions style="padding: 24px 16px">
          <v-spacer />
          <v-btn @click="saveResult.type==='rename'?rename($refs.modelRename.getCurrentName(),true):save({ id: item.id,forceSave:true })" color="#FF7754" class="white--text"><v-icon color="white" left>mdi-alert-circle</v-icon>{{ $t('stillSave') }}</v-btn>
          <v-btn text @click="saveResult.type==='rename'?$refs.modelSaveHistory.start():$refs.modelSave.start()" color="#312651"><v-icon color="#B1ABB6" left>mdi-source-branch</v-icon>{{ $t('saveAs') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import utils from "@/utils/utils";
import ReSizeDrawer from "@/components/common/ReSizeDrawer";
import VueDmnModeler from "@/components/common/DMNModeler";
import ModelSave from "@/components/common/modeler/ModelSave";
import ModelRename from "@/components/common/modeler/ModelRename";
import ModelConversation from "@/components/common/modeler/ModelConversation";
import ModelAssociation from "@/components/common/modeler/ModelAssociation";
import {saveAs} from "file-saver";
import modelerCommon from "./mixins/index";
import Editors from "./Editors";
import collaborationRequest from "@/api/collaboration";

export default {
  mixins: [modelerCommon],
  components: {
    VueDmnModeler,
    ReSizeDrawer,
    ModelSave,
    ModelRename,
    ModelConversation,
    ModelAssociation,
    Editors
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
    url() {
      let url=this.parseUrl();
      return `${url}/viewer.html#/automation/dmn/index/${this.item.id}`;
    },
  },
  data() {
    return {
      utils,
      importBPMNDialog: {
        display: false,
        file: null,
      },
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
    async downXML() {
      let xml = await this.$refs.vueDmnModeler.getXml();
      var blob = new Blob([xml], {type: "text/xml"});
      saveAs(blob, this.item.name?`${this.resource.name}-${this.item.name}.dmn`:`${this.resource.name}.dmn`);
    },
    selectElement(element) {
      this.element = element;
    },
    setShowProperty() {
      this.$refs.vueDmnModeler.setShowProperty(this.showProperty);
    },
  },
};
</script>

<style scoped>
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
