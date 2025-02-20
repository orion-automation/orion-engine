<template>
  <div style="border-top: 1px solid rgba(187, 187, 187, 1)">
    <div class="d-flex flex-row" style="padding: 14px 15px">
      <v-breadcrumbs
          :items="idBreadcrumbs"
          style="background-color: #e8eff7; padding: 0px; border: none"
          divider="|"
      />
    </div>

    <v-card class="detail-card" style="border-top: 1px solid rgba(187, 187, 187, 1)">
      <v-layout style="margin: 0" class="stretch">
        <re-size-drawer ref="resizeDrawer" @setLeftWidth="setLeftWidth">
          <v-icon class="navigation-icon" @click="switchLeft()">
            mdi-chevron-left
          </v-icon>
          <div style="display: flex; flex-direction: column; height: 100%">
            <div style="flex: 0">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-subtitle class="subtitle">
                    {{ application.appKey }}
                  </v-list-item-subtitle>
                  <div class="main-value" style="margin-top: 5px">
                    {{ application.name }}
                  </div>
                </v-list-item-content>
              </v-list-item>
            </div>
            <div class="box" style="flex: 0">
              <div class="box-header">
                <div class="box-icon">
                  <v-icon> mdi-filter-variant</v-icon>
                </div>
                <div class="box-title box-inline">
                  <v-select
                      class="setting-input ml-4 mr-2"
                      :full-width="true"
                      :single-line="true"
                      hide-details
                      :items="types"
                      item-value="id"
                      item-text="name"
                      v-model="editingApplication.type"
                      dense
                      style="height: 100%; margin: 0"
                      @change="changeType()"
                  />
                </div>
                <div class="box-title box-inline">
                  <v-select
                      class="setting-input ml-4 mr-2"
                      :full-width="true"
                      :single-line="true"
                      hide-details
                      :items="categories[editingApplication.type]"
                      @change="changeCategory()"
                      item-value="id"
                      item-text="name"
                      v-model="editingApplication.category"
                      dense
                      style="height: 100%; margin: 0"
                  />
                </div>
              </div>

              <div class="box-header">
                <div class="box-icon">
                  <v-tooltip right>
                    <template #activator="{ on, attrs }">
                      <v-icon v-bind="attrs" v-on="on"> mdi-key-minus</v-icon>
                    </template>
                    <span>应用Key</span>
                  </v-tooltip>
                </div>
                <div class="box-title">
                  <v-text-field
                      class="setting-input ml-4 mr-2"
                      :full-width="true"
                      :single-line="true"
                      :placeholder="$t('appKey')"
                      v-model="editingApplication.appKey"
                      hide-details
                      dense
                      style="height: 100%; margin: 0"
                  />
                </div>
              </div>

              <div class="box-header">
                <div class="box-icon">
                  <v-tooltip right>
                    <template #activator="{ on, attrs }">
                      <v-icon v-bind="attrs" v-on="on"> mdi-information-outline</v-icon>
                    </template>
                    <span>{{ $t('appName') }}</span>
                  </v-tooltip>
                </div>
                <div class="box-title">
                  <v-text-field
                      class="setting-input ml-4 mr-2"
                      :full-width="true"
                      :single-line="true"
                      :placeholder="$t('appName')"
                      v-model="editingApplication.name"
                      hide-details
                      dense
                      style="height: 100%; margin: 0"
                  />
                </div>
              </div>

              <div class="box-header">
                <div class="box-icon">
                  <v-tooltip right>
                    <template #activator="{ on, attrs }">
                      <v-icon v-bind="attrs" v-on="on"> mdi-bookmark-outline</v-icon>
                    </template>
                    <span>{{ $t('appTag') }}</span>
                  </v-tooltip>
                </div>
                <div class="box-title">
                  <v-text-field
                      class="setting-input ml-4 mr-2"
                      :full-width="true"
                      :single-line="true"
                      :placeholder="$t('appTag')"
                      v-model="editingApplication.tags"
                      hide-details
                      dense
                      style="height: 100%; margin: 0"
                  />
                </div>
              </div>

              <div class="box-header">
                <div class="box-icon">
                  <v-tooltip right>
                    <template #activator="{ on, attrs }">
                      <v-icon v-bind="attrs" v-on="on"> mdi-source-branch</v-icon>
                    </template>
                    <span>{{ $t('appVersion') }}</span>
                  </v-tooltip>
                </div>
                <div class="box-title">
                  <v-text-field
                      type="number"
                      class="setting-input ml-4 mr-2"
                      :full-width="true"
                      :single-line="true"
                      :placeholder="$t('appVersion')"
                      v-model="editingApplication.versionTag"
                      hide-details
                      dense
                      style="height: 100%; margin: 0"
                  />
                </div>
              </div>

              <div class="box-header last">
                <div class="box-icon">
                  <v-tooltip right>
                    <template #activator="{ on, attrs }">
                      <!-- <v-icon color="#FF7754">
                        mdi-{{ editingApplication.icon }}
                      </v-icon> -->

                      <i
                          v-bind="attrs"
                          v-on="on"
                          :class="'fa-' + editingApplication.icon"
                          class="fad fa-fw"
                          style="font-size: 16px; color: #ff7754"
                      />
                    </template>
                    <span>{{ $t('appIcon') }}</span>
                  </v-tooltip>
                </div>
                <div class="box-title">
                  <v-text-field
                      class="setting-input ml-4 mr-2"
                      :full-width="true"
                      :single-line="true"
                      :placeholder="$t('appIcon')"
                      v-model="editingApplication.icon"
                      hide-details
                      dense
                      style="height: 100%; margin: 0"
                  />
                </div>
              </div>

              <!-- <div class="box-header last">
                <div class="box-icon">
                  <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon v-bind="attrs" v-on="on">
                        mdi-file-document
                      </v-icon>
                    </template>
                    <span>应用描述</span>
                  </v-tooltip>
                </div>
                <div class="box-title">
                  <span>描述</span>
                </div>
              </div> -->

              <v-textarea
                  rows="3"
                  outlined
                  v-model="editingApplication.description"
                  :placeholder="$t('appDescWithDot')"
                  hide-details
              />
            </div>
          </div>
        </re-size-drawer>
        <div class="horizontal-collapsed" v-if="!left">
          <v-icon class="navigation-icon" @click="switchLeft()">
            mdi-chevron-right
          </v-icon>
        </div>
        <div style="display: flex; flex-direction: column; width: 100%">
          <el-row type="flex" justify="start" class="menu-border">
            <v-spacer/>

            <v-menu offset-y>
              <template #activator="{ on, attrs }">
                <v-btn
                    large
                    text
                    class="process-menu"
                    v-show="true"
                    v-bind="attrs"
                    v-on="on"
                    style="
                    border-left: 1px solid rgba(187, 187, 187, 1);
                    border-right: none;
                  "
                >
                  <v-icon size="16" color="#83829A" style="margin-right: 6px">
                    mdi-import
                  </v-icon>
                  <span style="color: #444262; font-size: 14px">{{ $t('importFile') }}</span>
                </v-btn>
              </template>
              <v-list style="cursor: pointer" dense>
                <v-list-item key="1">
                  <v-list-item-title @click="startUploadResource">
                    <v-icon
                        size="14"
                        color="#101010"
                        style="margin-right: 6px; margin-bottom: 3px"
                    >
                      mdi-code-block-braces
                    </v-icon>
                    <span style="font-size: 14px">JSON</span>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-menu>
              <template #activator="{ on, attrs }">
                <v-btn
                    large
                    text
                    class="process-menu"
                    style="border-left: 1px solid rgba(187, 187, 187, 1)"
                    v-bind="attrs"
                    v-on="on"
                >
                  <v-icon size="16" color="#83829A" style="margin-right: 6px">
                    mdi-content-save
                  </v-icon>
                  <span style="color: #444262; font-size: 14px">{{ $t('save') }}</span>
                </v-btn>
              </template>
              <v-list style="cursor: pointer" dense>
                <v-list-item @click="save()">
                  <v-list-item-title>
                    <v-icon size="16" color="#83829A" style="margin-right: 6px">
                      mdi-content-save
                    </v-icon>
                    <span style="font-size: 14px">{{ $t('save') }}</span>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="startSaveAs()">
                  <v-list-item-title>
                    <v-icon size="16" color="#83829A" style="margin-right: 6px">
                      mdi-content-save-all
                    </v-icon>
                    <span style="font-size: 14px">{{ $t('saveAs') }}</span>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="exportFile()">
                  <v-list-item-title>
                    <v-icon size="16" color="#83829A" style="margin-right: 6px">
                      mdi-export
                    </v-icon>
                    <span style="font-size: 14px">{{ $t('export') }}</span>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </el-row>

          <el-row
              class="form-row"
              style="height: 100%; border-top: 1px solid rgba(187, 187, 187, 1)"
              :style="leftStylePadding"
          >
            <el-col
                :span="
                ['connector', 'combination'].indexOf(editingApplication.category) >= 0
                  ? 24
                  : 8
              "
            >
              <v-form
                  ref="dmn"
                  v-if="editingApplication.category === 'dmn'"
                  style="margin: 20px"
                  lazy-validation
              >
                <v-text-field
                    v-model="editingApplication.configJson.decisionRef"
                    :label="$t('dmnDefId1')"
                />

                <v-text-field
                    v-model="editingApplication.configJson.resultVariable"
                    :label="$t('resultVariable')"
                />
                <v-select
                    :label="$t('mapDecisionResult')"
                    :items="mapDecisions"
                    item-value="id"
                    item-text="name"
                    v-model="editingApplication.configJson.mapDecisionResult"
                />
              </v-form>
              <v-form
                  ref="externalTask"
                  v-if="editingApplication.category === 'externalTask'"
                  style="margin: 20px"
                  lazy-validation
              >
                <v-text-field
                    v-model="editingApplication.configJson.topic"
                    :label="$t('topic')"
                />
              </v-form>
              <v-form
                  ref="call"
                  v-if="editingApplication.category === 'call'"
                  style="margin: 20px"
                  lazy-validation
              >
                <v-text-field
                    v-model="editingApplication.configJson.calledElement"
                    :label="$t('callProcessDefKey')"
                />
                <v-text-field
                    v-model="editingApplication.configJson.businessKey"
                    :label="$t('businessKey')"
                />
              </v-form>
              <v-form
                  ref="form"
                  v-if="editingApplication.category === 'form'"
                  style="margin: 20px"
                  lazy-validation
              >
                <v-text-field
                    v-model="editingApplication.configJson.formKey"
                    label="Form ID"
                />
              </v-form>
              <v-form
                  ref="listener"
                  v-if="editingApplication.category === 'listener'"
                  style="margin: 20px"
                  lazy-validation
              >
                <v-text-field
                    v-model="editingApplication.configJson.listenerType"
                    :label="$t('type')"
                />
                <v-select
                    :label="$t('language')"
                    :items="scriptFormats"
                    item-value="id"
                    item-text="name"
                    v-model="editingApplication.configJson.scriptFormat"
                />

                <v-textarea
                    rows="10"
                    outlined
                    v-model="editingApplication.configJson.scriptCode"
                    :placeholder="$t('inputCodeWithDot')"
                />
              </v-form>

              <connector
                  ref="connector"
                  :application="editingApplication"
                  :types="objectDialog.types"
              />

              <combination ref="combination" :application="editingApplication"/>

              <v-form
                  ref="bpezAppIcons"
                  v-if="editingApplication.category === 'bpezAppIcons'"
                  style="margin: 20px"
                  lazy-validation
              >
                <v-text-field
                    aria-required=""
                    required
                    mandatory
                    v-model="editingApplication.configJson.name"
                    :label="$t('appShortName')"
                />
                <v-text-field
                    v-model="editingApplication.configJson.icon"
                    :label="$t('faIcon')"
                />

                <v-radio-group
                    v-model="editingApplication.configJson.iconType"
                    mandatory
                    :label="$t('property')"
                >
                  <v-radio
                      v-for="option in iconTypes"
                      :key="option.name"
                      :label="option.name"
                      :value="option.id"
                  />
                </v-radio-group>
              </v-form>

              <v-form
                  ref="bpezVarsInList"
                  v-if="
                  editingApplication.category === 'bpezAppVarsInList' ||
                  editingApplication.category === 'bpezTaskVarsInList'
                "
                  style="margin: 20px"
                  lazy-validation
              >
                <v-text-field v-model="variableItem.name" :label="$t('variable')"/>

                <v-select
                    :label="$t('type')"
                    :items="variableTypes"
                    item-value="id"
                    item-text="name"
                    v-model="variableItem.type"
                />

                <v-text-field v-model="variableItem.label" :label="$t('showName')"/>

                <v-btn
                    @click="addVariable"
                    style="color: #ffffff"
                    color="#FF7754"
                    :disabled="
                    !variableItem.name || !variableItem.type || !variableItem.label
                  "
                >
                  {{ $t('add') }}
                </v-btn>
                <el-table
                    :data="editingApplication.configJson.variables"
                    style="min-width: 600px"
                >
                  <el-table-column prop="name" :label="$t('variable')"/>
                  <el-table-column :label="$t('type')" width="100">
                    <template slot-scope="props">
                      {{ variableTypes.find((type) => type.id == props.row.type).name }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="label" :label="$t('showName')"/>

                  <el-table-column :label="$t('operate')" width="100">
                    <template slot-scope="props">
                      <span
                          style="color: #ff7754; cursor: pointer"
                          @click="removeVariable(props.row)"
                      ><v-icon dense color="#ff7754">mdi-close</v-icon></span>
                    </template>
                  </el-table-column>
                </el-table>
              </v-form>
              <v-form
                  ref="bpezAppReport"
                  v-if="editingApplication.category === 'bpezAppReport'"
                  style="margin: 20px"
                  lazy-validation
              >
                <v-text-field v-model="editingApplication.userGroup" :label="$t('userPermissionGroup')"/>
                <v-text-field
                    v-model="editingApplication.configJson.name"
                    :label="$t('reportName')"
                />
                <v-textarea
                    rows="3"
                    outlined
                    v-model="editingApplication.configJson.desc"
                    :placeholder="$t('enterReportDescWithDot')"
                />
                <v-text-field
                    v-model="editingApplication.configJson.icon"
                    :label="$t('faIcon')"
                />

                <v-radio-group
                    v-model="editingApplication.configJson.iconType"
                    mandatory
                    :label="$t('property')"
                >
                  <v-radio
                      v-for="option in iconTypes"
                      :key="option.name"
                      :label="option.name"
                      :value="option.id"
                  />
                </v-radio-group>

                <v-textarea
                    rows="3"
                    outlined
                    v-model="editingApplication.configJson.url"
                    :placeholder="$t('enterReportUrlWithDot')"
                />
              </v-form>
            </el-col>
          </el-row>
        </div>
      </v-layout>
    </v-card>
    <v-dialog v-model="createDialog.display" max-width="300">
      <v-card>
        <v-card-title class="headline" style="color: #444262"/>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row style="margin: 0">
              <v-col style="padding: 0" cols="12">
                <v-text-field
                    :label="$t('name')"
                    :placeholder="$t('plsEnterAppName')"
                    v-model="createDialog.name"
                    hide-details
                    @keydown.enter="saveAs()"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer/>
          <v-btn text @click="createDialog.display = false"> {{ $t('cancel') }}</v-btn>
          <v-btn
              :disabled="!createDialog.name"
              style="color: #ffffff"
              color="#FF7754"
              @click="saveAs()"
          >
            <v-icon size="16" color="#ffffff" style="margin-right: 6px">
              mdi-content-save
            </v-icon>
            {{ $t('save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="objectDialog.display" max-width="700">
      <v-card>
        <v-card-title class="headline" style="color: #444262">
          {{ $t('businessObjCenterResource') }}
        </v-card-title>
        <v-card-text>
          <div class="d-flex flex-column" style="max-height: calc(90vh - 150px);width: 100%;height: 100%">
            <div class="d-flex flex-row" style="width: 100%;gap: 15px">
              <div class="object-title" style="flex: 1">{{ $t('project') }}</div>
              <div class="object-title" style="flex: 1">{{ $t('dataTable') }}</div>
              <div class="object-title" style="flex: 1">REST API</div>
            </div>
            <div class="d-flex flex-row" style="flex: 1;height: 0;overflow-y: auto;width: 100%;gap: 15px">
              <div style="flex: 1;width: 0">
                <v-list v-show="objectDialog.projects.length">
                  <v-list-item
                      :class="{
                    current: objectDialog.project.id === item.id,
                  }"
                      v-for="item in objectDialog.projects"
                      :key="item.id"
                      @click="selectProject(item)"
                      style="
                    cursor: pointer;
                    padding-top: 0em;
                    padding-bottom: 0em;
                    border: 1px solid #e6e4e6;
                  "
                  >
                    <v-list-item-content>
                      <v-list-item-title
                          style="
                        font-size: 14px;
                        color: #444262；
                        white-space: unset;
                        text-overflow: unset;
                      "
                      >
                        <v-icon size="18" color="#83829A" style="margin-right: 6px">
                          mdi-database-settings-outline
                        </v-icon>
                        <span style="vertical-align: middle">{{ item.title }}</span>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </div>
              <div style="flex: 1;width: 0">
                <v-list v-show="objectDialog.tables.length">
                  <v-list-item
                      :class="{
                    current: objectDialog.table.id === item.id,
                  }"
                      v-for="item in objectDialog.tables"
                      :key="item.id"
                      @click="selectTable(item)"
                      style="
                    cursor: pointer;
                    padding-top: 0em;
                    padding-bottom: 0em;
                    border: 1px solid #e6e4e6;
                  "
                  >
                    <v-list-item-content>
                      <v-list-item-title
                          style="
                        font-size: 14px;
                        color: #444262；
                        white-space: unset;
                        text-overflow: unset;
                      "
                      >
                        <v-icon size="18" color="#83829A" style="margin-right: 6px">
                          mdi-table
                        </v-icon>
                        <span style="vertical-align: middle">{{ item.title }}</span>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </div>
              <div style="flex: 1;width: 0">
                <v-radio-group
                    v-model="objectDialog.api"
                    mandatory
                    label=""
                    @change="selectAPI"
                >
                  <v-radio
                      v-for="item in objectDialog.apis"
                      :key="item.id"
                      :label="item.name"
                      :value="item"
                  >
                    <template #label>
                      <!-- v-label theme--light -->
                      <div>
                        {{ item.name }}
                        <span
                            class="badge"
                            style="margin-left: 5px"
                            :class="`badge-${item.type.toLowerCase()}`"
                        >{{ item.type.toUpperCase() }}
                      </span>
                      </div>
                    </template>
                  </v-radio>
                </v-radio-group>
              </div>
            </div>
          </div>
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer/>
          <v-btn text @click="objectDialog.display = false"> {{ $t('cancel') }}</v-btn>
          <v-btn
              :disabled="
              !(
                objectDialog.api &&
                objectDialog.api.id &&
                objectDialog.project.id &&
                objectDialog.table.id
              )
            "
              style="color: #ffffff"
              color="#FF7754"
              @click="createObject()"
          >
            <v-icon size="16" color="#ffffff" style="margin-right: 6px">
              mdi-content-save
            </v-icon>
            {{ $t('create') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="uploadResourceDialog.display" max-width="300">
      <v-card>
        <v-card-title class="headline" style="color: #444262"/>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row style="margin: 0 0 20px 0">
              <v-col style="padding: 0" cols="12">
                <v-file-input
                    :placeholder="$t('selectFile')" accept=".json" hide-details
                    v-model="uploadResourceDialog.xml"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer/>
          <v-btn text @click="uploadResourceDialog.display = false">
            {{ $t('cancel') }}
          </v-btn>
          <v-btn style="color: #ffffff" color="#FF7754" @click="uploadResource()">
            <v-icon size="16" color="#ffffff" style="margin-right: 6px">
              mdi-upload
            </v-icon>
            {{ $t('confirm1') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import camundaRequest from "@/api/camunda-service";
import utils from "@/utils/utils";
import FolderNavigate from "@/components/common/modeler/FolderNavigate";
import ReSizeDrawer from "@/components/common/ReSizeDrawer";
import Connector from "./Connector";
import Combination from "./Combination";

import {saveAs} from "file-saver";
import nocodbRequest from "@/api/nocodb";
import i18n from "@/i18n";
import collaborationRequest from "@/api/collaboration";

export default {
  components: {FolderNavigate, ReSizeDrawer, Connector, Combination},
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
      leftStylePadding: {},
      leftStyleMargin: {},
      utils,
      idBreadcrumbs: [
        {
          text: this.$t("app"),
          href: "#/design/application/list",
          disabled: false,
        },
        {
          text: "",
          href: "",
        },
      ],
      createDialog: {
        display: false,
        name: "",
      },
      objectDialog: {
        display: false,
        projects: [],
        tables: [],
        apis: [],
        project: {},
        table: {},
        api: {},
        types: {},
      },
      application: {},
      editingApplication: {configJson: {}},
      defaultApplication: {
        name: "",
        icon: "robot",
        tags: "",
        owner: "",
        type: "duo",
        category: "dmn",
        appKey: null,
        description: null,
        versionTag: 1,
      },
      variableItem: {
        name: "",
        type: "string",
        label: "",
      },
      left: true,
      types: utils.application.types,
      categories: utils.application.categories,
      mapDecisions: [
        {id: "resultList", name: "Result List"},
        {id: "collectEntries", name: "Collect Entries"},
        {id: "singleEntry", name: "Single Entry"},
        {id: "singleResult", name: "Single Result"},
      ],
      scriptFormats: [
        {id: "JavaScript", name: "JavaScript"},
        {id: "Python", name: "Python"},
        {id: "Ruby", name: "Ruby"},
        {id: "Groovy", name: "Groovy"},
        {id: "JUEL", name: "JUEL"},
      ],
      variableTypes: [
        {id: "string", name: this.$t("variableTypeText")},
        {id: "number", name: this.$t("variableTypeNumber")},
      ],
      iconTypes: [
        {id: "fal", name: this.$t("iconTypeLight")},
        {id: "far", name: this.$t("iconTypeRegular")},
        {id: "fas", name: this.$t("iconTypeSolid")},
        {id: "fad", name: this.$t("iconTypeDuotone")},
        {id: "fab", name: this.$t("iconTypeBrand")},
      ],
      uploadResourceDialog: {
        name: "",
        xml: null,
        display: false,
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
    "$i18n.locale": {
      handler(val) {
        let self = this;
        self.idBreadcrumbs[0].text = self.$t("app");
        self.variableTypes[0].name = self.$t("variableTypeText");
        self.variableTypes[1].name = self.$t("variableTypeNumber");
        self.iconTypes[0].name = self.$t("iconTypeLight");
        self.iconTypes[1].name = self.$t("iconTypeRegular");
        self.iconTypes[2].name = self.$t("iconTypeSolid");
        self.iconTypes[3].name = self.$t("iconTypeDuotone");
        self.iconTypes[4].name = self.$t("iconTypeBrand");
        self.types[0].name=self.$t("collaboration");
        self.types[1].name=self.$t("custom");
        self.categories={
          duo: [
            {
              id: "dmn",
              name: self.$t("dmn"),
              item: {
                decisionRef: "",
                resultVariable: "",
                mapDecisionResult: "",
              },
            },
            {
              id: "externalTask",
              name: self.$t("externalTask"),
              item: {
                topic: "",
              },
            },
            {
              id: "call",
              name: self.$t("callProcess"),
              item: {
                calledElement: "",
                businessKey: "#{execution.processBusinessKey}",
              },
            },
            {
              id: "form",
              name: self.$t("form"),
              item: {
                formKey: "",
              },
            },
            {
              id: "listener",
              name: self.$t("listener"),
              item: {
                listenerType: "Script",
                scriptFormat: "JavaScript",
                scriptCode: "",
              },
            },
            {
              id: "connector",
              name: self.$t("connector"),
              item: {
                url: "",
                method: "GET",
                headerTemplate: [],
                queryTemplate: [],
                requestBodyTemplate: [],
                responseBodyTemplate: [],
                requestBody: "{}",
                statusCode: "",
                response: "",
                inputs: [],
                outputs: []
              },
            },
            {
              id: "combination",
              name: self.$t("linkMenu.xApp"),
              item: {
                basic: {
                  name: "",
                  icon: "",
                  iconType: "fal",
                  color: "#FF7754"
                },
                authority: {
                  users: [],
                  groups: []
                },
                page: [],
                data: [],
              },
            },
          ],
          ux: [
            {
              id: "bpezAppIcons",
              name: self.$t("appIcon"),
              item: {
                name: "",
                icon: "",
                iconType: "fal"
              },
            },
            {
              id: "bpezAppVarsInList",
              name: self.$t("appTopVars"),
              item: {
                variables: []
              },
            },
            {
              id: "bpezTaskVarsInList",
              name: self.$t("taskTopVars"),
              item: {
                variables: []
              }
            },
            {
              id: "bpezAppReport",
              name: self.$t("dataReportTable"),
              item: {
                name: "",
                icon: "",
                iconType: "fal",
                url: ""
              },
            }
          ]
        };
      }
    }
  },
  mounted() {
    this.defaultApplication.configJson = this.categories[
        this.defaultApplication.type
        ][0].item;
    this.application = JSON.parse(JSON.stringify(this.defaultApplication));
    this.editingApplication = JSON.parse(JSON.stringify(this.defaultApplication));
    this.getData();
  },
  methods: {
    startUploadResource() {
      this.uploadResourceDialog.xml = null;
      this.uploadResourceDialog.display = true;
    },
    async uploadResource() {
      if (!this.uploadResourceDialog.xml) {
        this.$message({
          message: this.$t("inputInfoMiss"),
          type: "error",
          showClose:true
        });
        return;
      }
      var reader = new FileReader();
      reader.readAsText(this.uploadResourceDialog.xml);
      reader.onloadend = async () => {
        let xml = reader.result;
        this.editingApplication.configJson=JSON.parse(xml);
        this.$message({
          message: this.$t("templateImportSuccess"),
          type: "success",
          showClose:true
        });
        this.uploadResourceDialog.display = false;
      };
    },
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
    switchLeft() {
      this.$refs.resizeDrawer.setLeft(!this.left);
    },

    copy(value) {
      navigator.clipboard.writeText(value);
      this.$message({
        message: this.$t("copySuccessWithValue",{value:value}),
        type: "success",
        showClose:true
      });
      this.share.display = false;
    },

    async getData() {
      const id = this.$route.params.id;
      let data = await camundaRequest.getApplication(id);
      this.application = data;
      this.project = await camundaRequest.getProject(data.editGroup);
      this.editingApplication = JSON.parse(JSON.stringify(data));
      if (this.editingApplication.category === "connector") {
        if (!this.editingApplication.configJson.inputs) {
          this.editingApplication.configJson.inputs = [];
        }
        if (!this.editingApplication.configJson.outputs) {
          this.editingApplication.configJson.outputs = [];
        }
      }
      if (this.editingApplication.category == "combination") {
        this.$nextTick(this.$refs.combination.init);
      }

      let backUrlRoot = "#/design/application/list";
      if (this.$route.query.groupId) {
        backUrlRoot = `${backUrlRoot}?defaultGroup=${this.$route.query.groupId}`;
      }
      this.idBreadcrumbs[0].href = backUrlRoot;

      this.idBreadcrumbs[1].text = this.project.name;
      let backUrl = `#/design/application/detail/${this.project.id}?groupId=${this.$route.query.groupId}`;
      this.idBreadcrumbs[1].href = backUrl;

      let group = this.$store.state.user.groups.find(
          (group) => group.id === data.coeCode
      );
      if (!group) {
        this.$store.dispatch("common/setAuthorizedDialog", true);
      }
    },

    changeType() {
      this.editingApplication.category = this.categories[
          this.editingApplication.type
          ][0].id;
      this.changeCategory();
    },

    changeCategory() {
      let item = this.categories[this.editingApplication.type].find(
          (category) => category.id === this.editingApplication.category
      ).item;

      this.editingApplication.configJson = JSON.parse(JSON.stringify(item));
      this.editingApplication.userGroup = "";
      this.variableItem = {
        name: "",
        type: "string",
        label: "",
      };
      if (this.editingApplication.category == "combination") {
        this.$refs.combination.init();
      }
    },

    addVariable() {
      if (
          this.editingApplication.configJson.variables.some(
              (item) => item.name == this.variableItem.name
          )
      ) {
        this.$message({
          message: `变量名${this.variableItem.name}已经存在。`,
          type: "error",
          showClose:true
        });
        return;
      }
      let item = Object.assign({}, this.variableItem);
      this.editingApplication.configJson.variables.push(item);
      this.variableItem = {
        name: "",
        type: "string",
        label: "",
      };
    },

    removeVariable(variable) {
      let index = this.editingApplication.configJson.variables.indexOf(variable);
      this.editingApplication.configJson.variables.splice(index, 1);
    },

    async save() {
      let data = JSON.parse(JSON.stringify(this.editingApplication));
      await camundaRequest.updateApplication(data);
      this.$message({
        message: `${this.$t("app")}${data.name}${this.$t("saveSuccess")}`,
        type: "success",
        showClose:true
      });
      await this.getData();
    },
    async startSaveAs() {
      this.createDialog.name = `${this.editingApplication.name}副本`;
      this.createDialog.display = true;
    },
    async saveAs() {
      let data = JSON.parse(JSON.stringify(this.editingApplication));
      data.name = this.createDialog.name;
      data.versionTag = 1;
      let {id} = await camundaRequest.createApplication(data);
      this.$message({
        message: `${this.$t("app")}${data.name}${this.$t("saveSuccess")}`,
        type: "success",
        showClose:true
      });
      this.$router.push({
        name: "application-resource-detail",
        params: {id},
        query: {groupId: this.$route.query.groupId}
      });
      this.createDialog.display = false;
    },
    async exportFile() {
      let name = `${this.application.name}-${this.editingApplication.category}.json`;
      let content = JSON.stringify(this.editingApplication.configJson);
      var blob = new Blob([content], {type: "text/xml"});
      saveAs(blob, name);
    },

    async startImport() {
      await this.selectProject({});
      let {list} = await nocodbRequest.getProjects();
      this.objectDialog.projects = list;
      this.objectDialog.display = true;
    },
    async selectProject(project) {
      this.objectDialog.project = project;
      this.objectDialog.table = {};
      this.objectDialog.apis = [];
      if (!project.id) {
        this.objectDialog.tables = [];
        return;
      }
      try {
        let {list} = await nocodbRequest.getTables(project.id);
        this.objectDialog.tables = list;
      } catch (e) {
      }
    },
    async selectTable(table) {
      this.objectDialog.table = table;
      this.objectDialog.api = {};
      let response = await nocodbRequest.getAPIs(table.base_id);
      let paths = Object.keys(response.paths).filter(
          (path) =>
              path.indexOf("/views/") < 0 &&
              path.indexOf("/bulk/") < 0 &&
              path.indexOf("/export/") < 0 &&
              path.indexOf(`/${table.base_id}/${table.title}`) > 0
      );

      this.objectDialog.types = {
        components: response.components,
      };

      let listPath = paths.find((path) =>
          path.endsWith(`/${table.base_id}/${table.title}`)
      );
      let itemPath = paths.find((path) => path.endsWith(`/${table.base_id}/${table.title}/{rowId}`));
      let countPath = paths.find((path) => path.endsWith(`/${table.base_id}/${table.title}/count`));
      let groupPath = paths.find((path) => path.endsWith(`/${table.base_id}/${table.title}/groupby`));
      let findPath = paths.find((path) => path.endsWith(`/${table.base_id}/${table.title}/find-one`));

      let items = [
        {
          id: "list",
          name: this.$t("nocoApiListTitle"),
          path: listPath,
          type: "GET",
          setting: response.paths[listPath].get,
        },
        {
          id: "create",
          name: this.$t("nocoApiCreateTitle"),
          path: listPath,
          type: "POST",
          setting: response.paths[listPath].post,
        },
        {
          id: "update",
          name: this.$t("nocoApiUpdateTitle"),
          path: itemPath,
          type: "PATCH",
          setting: response.paths[itemPath].patch,
        },
        {
          id: "delete",
          name: this.$t("nocoApiDeleteTitle"),
          path: itemPath,
          type: "DELETE",
          setting: response.paths[itemPath].delete,
        },
        {
          id: "get",
          name: this.$t("nocoApiGetTitle"),
          path: itemPath,
          type: "GET",
          setting: response.paths[itemPath].get,
        },
        {
          id: "count",
          name: this.$t("nocoApiCountTitle"),
          path: countPath,
          type: "GET",
          setting: response.paths[countPath].get,
        },
        {
          id: "group",
          name: this.$t("nocoApiGroupTitle"),
          path: groupPath,
          type: "GET",
          setting: response.paths[groupPath].get,
        },
        {
          id: "find",
          name: this.$t("nocoApiFindTitle"),
          path: findPath,
          type: "GET",
          setting: response.paths[findPath].get,
        },
      ];
      this.objectDialog.apis = items;
    },

    async selectAPI() {
    },

    async createObject() {
      this.objectDialog.display = false;
      let setting = this.objectDialog.api.setting;
      setting.path = this.objectDialog.api.path;
      setting.type = this.objectDialog.api.type;

      this.$refs.connector.importAPI(setting);
      this.$message({
        message: this.$t("importApiSuccessMsgWithName",{name:this.objectDialog.api.name}),
        type: "success",
        showClose:true
      });
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
  padding: 0 15px;
  font-size: 14px;
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
  background-color: #444262;
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

.box {
  display: flex;
  flex-direction: column;
}

.box-header {
  border-top: 1px solid rgba(187, 187, 187, 1);
  height: 42px;
}

.box-header.last {
  border-bottom: 1px solid rgba(187, 187, 187, 1);
  margin-bottom: 5px;
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

.box-title.box-inline:not(:last-child) {
  float: left;
  width: 108px;
}

.box-title.box-inline:last-child {
  border-left: 1px solid rgba(187, 187, 187, 1);
}

.box-title > span {
  font-size: 16px;
  color: #83829a;
  margin: auto 16px;
}

.box-title .box-title-left {
  color: #444262;
  font-size: 14px;
  margin: auto 10px;
}

.box-title .box-title-left span.badge {
  color: #ffffff;
  background-color: #444262;
  font-size: 12px;
}

.box-icon i.theme--light.v-icon {
  font-size: 18px;
}

.box
div.theme--light.v-input.v-textarea.v-textarea.v-text-field--enclosed.v-text-field--outlined {
  /* border: 1px solid#E6E4E6; */
  background-color: unset;
  margin: 10px;
  padding: 0;
}

.box textarea {
  background-color: unset;
  margin: 20px 10px 0 1px;
  padding: 5px;
  border: 1px solid #E6E4E6;
}

/deep/
.box
div.v-textarea.v-text-field--enclosed.v-text-field--outlined:not(.v-input--dense)
.v-text-field__slot
textarea {
  margin-top: 0;
}

.form-row:deep(div.v-textarea.v-text-field--enclosed.v-text-field--outlined:not(.v-input--dense)
    .v-text-field__slot
    textarea) {
  margin-top: 0;
}

.box .nav-item {
  display: flex;
}

.box .nav-item:hover {
  background-color: rgba(243, 244, 249);
}

.box .nav-item.current {
  background-color: rgba(243, 244, 249);
}

.box .nav-item .name {
  color: #444262;
  vertical-align: middle;
  flex: 1;
  margin: auto 0 auto 20px;
  font-size: 16px;
}

.box .nav-item .content {
  flex: 0;

  margin: 10px 0;
}

.box .nav-item .main {
  color: #444262;
  width: 60px;
  font-size: 14px;
}

.box .nav-item.active .main {
  color: #312651;
  font-weight: bold;
  font-size: 14px;
}

.box .more {
  margin: auto 10px;
  height: 20px;
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

/deep/ .setting-input.v-text-field > .v-input__control > .v-input__slot::before,
/deep/ .setting-input.v-text-field > .v-input__control > .v-input__slot::after {
  border-style: none;
}

.current {
  background-color: #f3f4f9;
}

.object-title {
  font-size: 14px;
  color: #101010;
}

.badge.badge-get {
  background-color: #81b337;
}

.badge.badge-post {
  background-color: #ff7754;
}

.badge.badge-patch {
  /* background-color: #444262; */
  background-color: #57928d;
}

.badge.badge-delete {
  background-color: #dc3545;
}
</style>
