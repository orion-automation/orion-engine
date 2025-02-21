<template>
  <div class="d-flex flex-column" style="width: 100%; height: 100%;border-top: 1px solid rgb(187, 187, 187)">
    <div
      class="d-flex flex-row"
      style="
        height: 48px;
        width: 100%;
        padding: 0px 15px;
        font-size: 13px;
        color: #312651;
        align-items: center;
        justify-items: center;
      "
    >
      <div>{{ $t("app") }}<span class="menu-split">|</span></div>
      <span class="badge badge-app">
        <v-icon size="15" color="white" left>mdi-all-inclusive</v-icon>{{
          applications.totalCount
        }}</span>
    </div>
    <div class="d-flex flex-row" style="width: 100%; height: 0; flex: 1">
      <v-navigation-drawer v-model="drawerOpen" :width="drawerOpen ? 350 : 0"
                           mobile-breakpoint="0"
                           style="border-right: 1px solid rgba(177, 171, 182);">
        <div
          class="d-flex flex-row custom-drawer-item"
          style="
            padding: 0 15px;
            gap: 20px;
            height: 43px;
            position: absolute;
            width: 349px;
            z-index: 1;
            opacity: 1;
            background: rgba(255, 255, 255, 1);
          "
        >
          <v-tooltip bottom z-index="1000">
            <template #activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
                class="custom-drawer-item-icon"
                size="18"
                color="#444262"
              >mdi-star-box-outline
              </v-icon>
            </template>
            <span>{{ $t("notAvailable") }}</span>
          </v-tooltip>
          <v-icon
            class="custom-drawer-item-icon"
            size="18"
            :color="
              searchDialog.nameLike || searchDialog.versionTagLike || searchDialog.processDefinitionKeyIn || searchDialog.processDefinitionKey ? '#FA4F07' : '#444262'
            "
            @click="searchDialog.display = true"
          >mdi-card-search-outline
          </v-icon>
          <application-list-sort-menu
            :current-order="applications"
            @onSetSort="setSort"
          />
          <v-spacer />
        </div>
        <div style="height: 43px"></div>
        <ApplicationListItem
          :application="item"
          v-for="(item, index) in applications.items"
          @onItemClick="selectProcess"
          :selected="process.id===item.id"
          :key="index" />
        <infinite-loading
          @infinite="getApplicationsPage"
          :identifier="infiniteId"
        >
          <template #no-more>
            <div class="d-flex flex-row infinite-more-container">
              <div class="infinite-more-container-pre" />
              <div class="infinite-more-container-content">{{ $t("noMoreApp") }}</div>
              <div class="infinite-more-container-pre" />
            </div>
          </template>
        </infinite-loading>
      </v-navigation-drawer>
      <div
        class="d-flex flex-column"
        style="width: 0; flex: 1; height: 100%; background-color: white">
        <div
          class="d-flex flex-row custom-drawer-item"
          style="padding-top: 0; padding-bottom: 0; padding-right: 0; padding-left:9px; height: 43px"
        >
          <v-icon color="#FF7754" @click="drawerOpen = !drawerOpen" style="margin-right:6px"
          >{{ drawerOpen ? "mdi-chevron-left" : "mdi-chevron-right" }}
          </v-icon>
          <div v-if="process.id" class="detail-name">{{ process.name }}</div>
          <v-select
            v-if="process.id"
            class="version-select mr-4"
            :full-width="true"
            :single-line="true"
            hide-details
            return-object
            @change="selectVersion()"
            :items="process.versions"
            item-value="id"
            :item-text="(item) => `${$t('version')}${item.version}`"
            v-model="version"
            dense
            :no-data-text="$t('noVersion')"
            style="margin: 0; flex: 0"
          />
          <v-btn icon v-if="process.id">
            <v-icon color="#0F40F5" small>mdi-link-box-outline</v-icon>
          </v-btn>

          <v-spacer />
          <v-switch
            hide-details
            style="margin: 0 15px; padding-top: 0"
            color="#312651"
            class="type-switch"
            v-model="typeSwitch"
            flat
            inset
            @change="resetTabs()"
          >
            <template #label>
              <span v-if="typeSwitch"
              ><span style="color: #83829a; font-size:14px">{{ $t("doing") }}/</span
              ><span style="font-weight: bold; color: #444262;font-size:14px">{{ $t("done") }}</span></span
              >
              <span v-else
              ><span style="font-weight: bold; color: #444262;font-size:14px">{{ $t("doing") }}</span
              ><span style="color: #83829a;font-size:14px">/{{ $t("done") }}</span></span
              >
            </template>
          </v-switch>
          <v-divider vertical />
          <v-btn
            text :disabled="!process.id" style="border-right: none; font-weight:400" color="#312651"
            @click="showAssociations(true)">
            <v-icon left small color="#312651" style="margin-right:6px">mdi-all-inclusive-box</v-icon>
            {{ $t("linkApp") }}
          </v-btn>
          <v-divider vertical />
          <v-btn text :disabled="!process.id" style="border-right: none; font-weight:400" color="#312651">
            <router-link
              :to="{
                name: 'task-application-detail',
                query: {key: process.key},
                params: { id: process.id },
              }"
              class="no-style"
            >
              <v-icon left small color="#57928D" style="margin-right:6px">mdi-list-box-outline</v-icon>
              {{ $t("viewOrCreateInstance") }}
            </router-link>
          </v-btn>
          <v-divider vertical />
          <v-btn
            @click="$router.push({
          name: 'application-create',
          params: { key: process.key }
          })"
            text
            style="border-right: none;font-weight: 400"
            color="#312651"
          >
            <v-icon color="#3D5AFE" left small style="margin-right:6px">mdi-plus-circle-multiple-outline</v-icon>
            {{ $t("createInstance") }}
          </v-btn>
        </div>

        <el-row class="diagram-container">
          <vue-bpmn
            ref="vueBpmnViwer"
            :node-properties="nodeProperties"
            :diagram-xml="xml"
            :node-actions="[]"
            :instructions="[]"
            :options="{ overlays: { defaults: { scale: true } } }"
            @onClickNode="onClickNode"
            @onGetCollaborations="function () {}"
          />
        </el-row>

        <re-size-layout
          class="bottom-border"
          ref="resizeLayoutBottom"
          v-show="process.id"
          @setTableHeight="setTableHeight"
          :min-height="50">
          <v-tabs
            background-color="#fafafa"
            v-model="tab"
            key="tab"
            color="#444262"
            style="flex: 0"
          >
            <div class="vertical-collapsed">
              <v-icon class="navigation-icon" @click="switchBottom()">
                {{ !bottom ? "mdi-chevron-down" : "mdi-chevron-up" }}
              </v-icon>
            </div>
            <v-tabs-slider color="#FF7754" />
            <v-tab key="document">{{ $t("processIntro") }}</v-tab>
          </v-tabs>
          <v-tabs-items
            v-model="tab"
            style="overflow-x: hidden; flex: 1"
            key="tab_items"
            class="tabs"
          >
            <v-tab-item key="document" transition="false">
              <element-document :current-element="currentElement" />
            </v-tab-item>
          </v-tabs-items>
        </re-size-layout>
      </div>
      <div class="d-flex flex-row"
           style="height: 100%;
           z-index: 101;
           background-color: #ffffff;
           border-top: 1px solid rgba(177, 171, 182);">
        <div class="d-flex flex-column" style="height: 100%;width: 50px;">
        </div>
        <v-navigation-drawer
          absolute
          :mini-variant="!right"
          mini-variant-width="50"
          style="height: calc(100% - 49px) !important;top: 49px !important;border-top: 1px solid rgb(187, 187, 187);border-left: 1px solid rgb(187, 187, 187)"
          right
          permanent
          :width="right ? 400 : 0">
          <v-list-item style="height: 100%;display: flex;flex-direction: row;width: 100%;padding: 0">
            <div class="d-flex flex-column" style="height: 100%;width: 50px">
              <v-btn
                icon
                style="border-right-width: 0; width: 100%; margin: 0; height: 42px"
                @click="right = !right"
              >
                <v-icon color="#ff7754">
                  {{ right ? "mdi-chevron-right" : "mdi-chevron-left" }}
                </v-icon>
              </v-btn>
            </div>
            <div class="d-flex flex-column" style="height: 100%;flex: 1;border-left: 1px solid rgb(187, 187, 187)">
              <div class="tab-title">{{ $t("linkTask") }}</div>
              <div class="tab-content" style="height: 0px;flex: 1">
                <div style="height: 100%;overflow-y: auto">
                  <task-item
                    v-for="item in tasks.items"
                    @onItemClick="selectTask(item)"
                    :task="item"
                    :key="item.id"
                    :mobile-mode="false" />
                  <infinite-loading
                    @infinite="getTasksPage"
                    :identifier="tasks.infiniteId"
                  >
                    <template #no-more>
                      <div class="d-flex flex-row infinite-more-container">
                        <div class="infinite-more-container-pre" />
                        <div class="infinite-more-container-content">{{ $t("noMoreTask") }}</div>
                        <div class="infinite-more-container-pre" />
                      </div>
                    </template>
                  </infinite-loading>
                </div>
              </div>
            </div>
          </v-list-item>
        </v-navigation-drawer>
      </div>
    </div>
    <v-dialog v-model="searchDialog.display" width="431">
      <v-card>
        <v-card-title style="color:#312651">{{ $t("searchProcess") }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="searchDialog.nameLike" label="" :placeholder="$t('processName')" />
          <v-text-field
            v-model="searchDialog.versionTagLike"
            label=""
            :placeholder="$t('versionTagLike')"
          />
          <v-text-field
            v-model="searchDialog.processDefinitionKey"
            label=""
            :placeholder="$t('processDefinitionKey')"
          />
          <v-text-field
            v-model="searchDialog.processDefinitionKeyIn"
            label=""
            :placeholder="$t('processDefinitionKeyIn')"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="resetSearch" style="font-weight:normal; color:#312651">
            <v-icon left>mdi-redo</v-icon>
            {{ $t("reset") }}
          </v-btn>
          <v-btn text @click="refreshApplications" style="font-weight:normal; color:#312651">
            <v-icon left>mdi-magnify</v-icon>
            {{ $t("search") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <application-associations
      v-if="process.id"
      ref="associationsDialog"
      @onItemClick="onAssociationItemClick"
      :process-deployment-id="process.deploymentId"
      :process-def-key="process.key" />
  </div>
</template>

<script>
import processRequest from "@/api/process";
import instanceRequest from "@/api/instance";
import VueBpmn from "@/components/common/BPMN";
import ElementDocument from "@/components/common/ElementDocument";

import InfiniteLoading from "vue-infinite-loading";
import applicationCommon from "@/components/common/application/mixins";
import ApplicationListItem from "@/components/common/application/ApplicationListItem";
import ApplicationListSortMenu from "@/components/common/application/ApplicationListSortMenu";
import ApplicationAssociations from "@/components/common/application/ApplicationAssociations";
import ReSizeLayout from "@/components/common/ReSizeLayout";
import taskRequest from "@/api/task";
import TaskItem from "@/components/common/task/TaskItem";

export default {
  name: "ApplicationList",
  mixins: [applicationCommon],
  components: {
    TaskItem,
    InfiniteLoading,
    ApplicationListItem,
    VueBpmn,
    ElementDocument,
    ApplicationListSortMenu,
    ApplicationAssociations,
    ReSizeLayout
  },
  data() {
    return {
      right: false,
      modeSwitch: true,
      typeSwitch: false,
      xml: "",
      followers: "",
      businessKey: "",
      filter: {
        startableBy: "",
        latestVersion: true,
        active: true,
        sortBy: "deployTime",
        sortOrder: "desc"
      },
      bottom: 1,
      version: {},
      process: {
        versions: [],
        relates: []
      },
      nodeProperties: {},
      currentElement: null,
      tab: 0,
      drawerOpen: true,
      searchDialog: {
        display: false,
        versionTagLike: "",
        nameLike: "",
        processDefinitionKey: "",
        processDefinitionKeyIn: ""
      },
      tasks: {
        infiniteId: +new Date(),
        itemsPerPage: 10,
        totalCount: 0,
        sortBy: "",
        sortOrder: "desc",
        active: true,
        linkTaskFilter: "all",
        items: []
      },
      tenantId: this.$store.getters["user/getTenant"].id
    };
  },
  mounted() {
    this.autoSelect = true;
    if (this.$route.query.defaultSearchVal) {
      this.searchDialog.nameLike = this.$route.query.defaultSearchVal;
    }
    if (this.$route.query.defaultSearchKey) {
      this.searchDialog.processDefinitionKey = this.$route.query.defaultSearchKey;
    }
    if (this.$route.query.defaultSearchProcessDefinitionKeyIn) {
      this.searchDialog.processDefinitionKeyIn = this.$route.query.defaultSearchProcessDefinitionKeyIn;
    }
    this.filter.startableBy = this.$store.state.user.profile.id;
    this.getAllApplicationCount();
  },
  methods: {
    async refreshTasks(active) {
      this.tasks.active = active;
      this.tasks.items = [];
      this.tasks.infiniteId++;
    },
    async getTasksPage($state) {
      let filter = {
        orQueries: []
      };
      filter.processDefinitionKey = this.version.key;
      filter.taskDefinitionKey = this.currentElement.id;
      filter.orQueries.push({
        candidateUser: this.userId,
        assignee: this.userId
      });
      filter.sorting = [
        {
          sortBy: "created",
          sortOrder: this.tasks.sortOrder
        }
      ];

      let taskList = await taskRequest.postTaskList("",
        {
          firstResult: this.tasks.items.length,
          maxResults: this.tasks.itemsPerPage
        },
        filter
      );
      taskList = await processRequest.getAllTaskItemInfo(
        taskList,
        this.tenantId
      );
      this.tasks.items = this.tasks.items.concat(taskList.filter(item => this.tasks.items.findIndex(data => data.id === item.id) === -1));
      $state.loaded();
      if (taskList.length < this.tasks.itemsPerPage) {
        $state.complete();
      }
    },
    selectTask(task) {
      this.$router.push({
        name: "task-list",
        query: { defaultSearchTaskId: task.id }
      });
    },
    switchBottom() {
      this.bottom = this.$refs.resizeLayoutBottom.switchShow();
    },
    setTableHeight() {
      let self = this;
      let height = self.$refs.resizeLayoutBottom.getCanShowHeight();
      this.$nextTick(() => {
        this.tableMaxHeight = height;
      });
    },
    onAssociationItemClick(association) {
    },
    showAssociations(show) {
      let self = this;
      let associationsRef = self.$refs.associationsDialog;
      if (associationsRef) {
        associationsRef.show(show);
      }
    },
    async getAllApplicationCount() {
      let filter = this.buildFilter();
      let { count } = await processRequest.getProcessCount(filter);
      this.applications.totalCount = count;
    },
    async resetTabs() {
      if (this.tab === 0) {
        this.getTab();
      } else {
        this.tab = 0;
      }
    },
    onClickNode(element) {
      this.currentElement = element.businessObject;
      this.$refs.vueBpmnViwer.setNodeSelected(element);
      if (this.currentElement.$type === "bpmn:UserTask") {
        this.right = true;
        this.$nextTick(() => {
          this.refreshTasks();
        });
      }
    },
    async getStatistics() {
      let self = this;
      // 获取执行数据
      let instances = await instanceRequest.postGetInstances({}, {
        startedBy: self.userId,
        processDefinitionId: self.process.id
      });
      if (!instances) {
        instances = [];
      }
      let statistics = await processRequest.getProcessStatistics(
        this.typeSwitch ? "history" : "",
        this.process.id,
        instances.map(instance => instance.id).join(",")
      );
      let nodeProperties = {};

      statistics.forEach((item) => {
        let incidents = 0;
        if (item.incidents) {
          item.incidents.forEach((incident) => {
            incidents += incident.incidentCount;
          });
        } else {
          incidents = item.openIncidents;
        }
        nodeProperties[item.id] = {
          instances: item.instances,
          incidents,
          failedJobs: item.failedJobs,
          canceled: item.canceled,
          finished: item.finished
        };
      });

      this.nodeProperties = nodeProperties;
    },
    buildFilter() {
      let filter = Object.assign({}, this.filter);
      if (this.searchDialog.nameLike) {
        filter.nameLike = `%${this.searchDialog.nameLike}%`;
      }
      if (this.searchDialog.versionTagLike) {
        filter.nameLike = `%${this.searchDialog.versionTagLike}%`;
      }
      if (this.searchDialog.processDefinitionKey) {
        filter.key = this.searchDialog.processDefinitionKey;
      }
      if (this.searchDialog.processDefinitionKeyIn) {
        filter.keysIn = this.searchDialog.processDefinitionKeyIn;
      }
      return filter;
    },
    async selectProcess(process) {
      let response = await processRequest.getProcessVersions(process.key);

      process.versions = response.sort(function (a, b) {
        return b.version - a.version;
      });
      this.version = process.versions.find(
        (version) => version.version == process.version
      );
      this.process = process;
      await this.selectVersion();
    },
    async selectVersion() {
      await this.resetTabs();
    },
    async getTab() {
      switch (this.tab) {
        case 0:
          await this.getStatistics();
          let response = await processRequest.getProcessXml(this.version.id);
          this.xml = response.bpmn20Xml;
          break;
        case 1: // 故障，history或runtime
          break;
      }
    },
    resetSearch() {
      this.searchDialog.nameLike = "";
      this.searchDialog.versionTagLike = "";
      this.searchDialog.processDefinitionKey = "";
      this.searchDialog.processDefinitionKeyIn = "";
    },
    async setSort(payload) {
      this.filter.sortBy = payload.sortBy;
      this.filter.sortOrder = payload.sortOrder;
      await this.refreshApplications();
    }
  },
  watch: {
    tab: {
      handler() {
        this.getTab();
      }
    }
  }
};
</script>

<style scoped>

.sider {
  background-color: #ffffff;
  border-top: 1px solid rgba(177, 171, 182);
}

.tab-title {
  margin: 13px 16px;
  color: rgba(16, 16, 16, 1);
  font-size: 14px;
}

/deep/ .v-navigation-drawer__border {
  display: none;
}

.menu-split {
  margin: 0 12px;
  color: #bbbbbb;
}

.custom-drawer-item-icon {
  cursor: pointer;
}

.custom-drawer-item.current {
  background-color: #f3f4f9;
}

.custom-drawer-item .name {
  font-weight: bold;
  color: rgba(68, 66, 98, 1);
  font-size: 14px;
  margin-bottom: 2px;
}

.custom-drawer-item .key {
  color: rgba(68, 66, 98, 1);
  font-size: 12px;
  margin-bottom: 2px;
}

.custom-drawer-item .description {
  color: rgba(131, 130, 154, 1);
  font-size: 12px;
}

.detail-name {
  font-weight: bold;
  color: rgba(49, 38, 81, 1);
  font-size: 14px;
  margin-right: 12px;
}

.detail-key {
  color: rgba(131, 130, 154, 1);
  font-size: 14px;
}

/deep/ .version-select.v-text-field > .v-input__control > .v-input__slot {
  width: 82px;
  height: 25px;
  min-height: 25px;
  border-radius: 4px;
  background-color: rgba(243, 244, 249, 1);
  color: rgba(49, 38, 81, 1);
  font-size: 12px;
  padding: 0 6px;
}

/deep/ .version-select.v-text-field > .v-input__control > .v-input__slot::before,
/deep/ .version-select.v-text-field > .v-input__control > .v-input__slot::after {
  border-style: none;
}

/deep/ .version-select.v-text-field > .v-input__control > .v-input__slot input {
  display: none;
}

/deep/ .version-select.v-text-field > .v-input__control > .v-input__slot .primary--text,
/deep/
.version-select.v-text-field
> .v-input__control
> .v-input__slot
.v-icon.notranslate.mdi-menu-down.theme--light {
  color: #ff7754 !important;
  caret-color: #ff7754 !important;
}

/deep/
.version-select.v-text-field
> .v-input__control
> .v-input__slot
.v-input__append-inner {
  margin-top: 2px;
}

.deployment {
  align-items: center;
}

.deployment div {
  margin-top: 5px;
  color: rgba(177, 171, 182, 1);
  font-size: 12px;
}

.deployment i {
  color: #444262;
  font-size: 34px;
}

div.diagram-container {
  background-color: rgba(232, 239, 247, 16);
  overflow: hidden;
  display: flex;
  flex: 1;
  height: 0px;
  justify-content: center;
  align-items: center;
  display: -webkit-flex;
}

.tabs {
  overflow-y: scroll;
}

/deep/ .tabs .v-window__container,
/deep/ .tabs .v-window-item.v-window-item--active {
  height: 100%;
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
  color: #fff;
}

.badge-instance {
  background-color: #2AD194;
}

.badge-incident {
  background-color: #FF7754;
}

.badge-group {
  background-color: #312651;
}

.badge-app {
  background-color: #83829A;
}

.badge-total i,
.badge-instance i,
.badge-group i,
.badge-app i,
.badge-incident i {
  margin-right: 4px;
}
</style>
