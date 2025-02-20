<template>
  <div class="d-flex flex-column" style="width: 100%; height: 100%;border-top: 1px solid rgb(187, 187, 187)">
    <div
      class="d-flex flex-row"
      style="
        width: 100%;
        padding: 14px 15px;
        font-size: 13px;
        color: #312651;
        align-items: center;
        justify-items: center;
      "
    >
      <v-breadcrumbs
        class="id-breadcrumbs" :items="idBreadcrumbs"
        style="background-color: #e8eff7;padding: 0; font-weight:400; border: none" divider="|" />
      <span class="badge badge-app-detail">
        <v-icon size="15" left color="white">mdi-filter-variant</v-icon>{{
          instances.totalCount
        }}</span>
    </div>
    <div class="d-flex flex-row" style="width: 100%; height: 0; flex: 1">
      <v-navigation-drawer v-model="left" :width="left ? 350 : 0" mobile-breakpoint="0">
        <div
          class="d-flex flex-row custom-drawer-item"
          style="
            padding: 0 15px;
            height: 43px;
            position: absolute;
            width: 349px;
            z-index: 1;
            opacity: 1;
            background: rgba(255, 255, 255, 1);
          "
        >
          <v-icon
            class="custom-drawer-item-icon"
            size="18"
            :color="
              searchDialog.processInstanceBusinessKeyLike ||
              searchDialog.processInstanceId ||
              searchDialog.startedBefore ||
              searchDialog.startedAfter
                ? '#FA4F07'
                : '#444262'
            "
            style="margin-right: 20px"
            @click="searchDialog.display = true"
          >mdi-card-search-outline
          </v-icon
          >

          <v-menu offset-y bottom z-index="100">
            <template #activator="{ on, attrs }">
              <v-icon
                class="custom-drawer-item-icon"
                size="18"
                color="#444262"
                style="margin-right: 20px"
                v-bind="attrs"
                v-on="on"
              >{{
                  instances.sortBy === "startTime"
                    ? "mdi-sort"
                    : "mdi-sort-bool-descending"
                }}
              </v-icon
              >
            </template>
            <v-list style="cursor: pointer; width: 130px" dense>
              <v-list-item key="edit">
                <v-list-item-title @click="setSort('startTime')" style="display: flex">
                  <span style="font-size: 14px">{{ $t('startTime') }}</span>
                  <v-spacer />
                  <v-icon size="14" :color="instances.sortBy==='startTime'?'#57928D':'#83829A'">
                    {{ instances.sortBy === "startTime" ? (instances.sortOrder === "desc" ? "mdi-sort-descending" : "mdi-sort-ascending") : "mdi-sort"
                    }}
                  </v-icon>
                </v-list-item-title>
              </v-list-item>
              <v-list-item key="delete">
                <v-list-item-title @click="setSort('endTime')" style="display: flex">
                  <span style="font-size: 14px">{{ $t('endTime') }}</span>
                  <v-spacer />
                  <v-icon size="14" :color="instances.sortBy==='endTime'?'#57928D':'#83829A'">
                    {{ instances.sortBy === "endTime" ? (instances.sortOrder === "desc" ? "mdi-sort-bool-descending" : "mdi-sort-bool-ascending") : "mdi-sort-bool-descending"
                    }}
                  </v-icon>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-menu offset-y bottom z-index="100">
            <template #activator="{ on, attrs }">
              <v-icon
                class="custom-drawer-item-icon"
                size="18"
                :color="instances.active ? '#57928D' : '#83829A'"
                style="margin-right: 20px"
                v-bind="attrs"
                v-on="on"
              >{{ instances.active ? "mdi-play-circle-outline" : "mdi-stop" }}
              </v-icon
              >
            </template>
            <v-list style="cursor: pointer; width: 130px" dense>
              <v-list-item key="edit">
                <v-list-item-title @click="setStatus('active')" style="display: flex">
                  <span style="font-size: 14px">{{ $t('doing') }}</span>
                  <v-spacer />
                  <v-icon color="#57928D" size="14">mdi-play-circle-outline</v-icon>
                </v-list-item-title>
              </v-list-item>
              <v-list-item key="delete">
                <v-list-item-title @click="setStatus('completed')" style="display: flex">
                  <span style="font-size: 14px">{{ $t('done') }}</span>
                  <v-spacer />
                  <v-icon color="#83829A" size="14">mdi-stop</v-icon>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer />
        </div>
        <div style="height: 43px"></div>

        <application-instance-list-item
          v-for="item in instances.items"
          :key="item.id"
          @onItemClick="selectInstance"
          :selected="instance.id===item.id"
          :instance="item" />
        <infinite-loading
          @infinite="getInstancesPage"
          :identifier="instances.infiniteId"
        >
          <template #no-more>
            <div class="d-flex flex-row infinite-more-container">
              <div class="infinite-more-container-pre" />
              <div class="infinite-more-container-content">{{ $t('noMoreProcess') }}</div>
              <div class="infinite-more-container-pre" />
            </div>
          </template>
        </infinite-loading>
      </v-navigation-drawer>

      <div
        class="d-flex flex-column"
        style="width: 0; flex: 1; height: 100%; background-color: white"
        ref="resizeLayoutBottom"
      >
        <div
          class="d-flex flex-row custom-drawer-item"
          style="padding-top: 0; padding-bottom: 0; padding-right: 0; padding-left:9px; height: 43px"
        >
          <v-icon color="#FF7754" @click="left = !left" style="margin-right:6px"
          >{{ left ? "mdi-chevron-left" : "mdi-chevron-right" }}
          </v-icon>
          <div v-if="instance.id" class="detail-name">
            {{ instance.businessKey || $t('noTopic') }}
          </div>

          <v-spacer />
          <v-divider vertical />
          <v-btn
            @click="startAdd(false)"
            text
            style="border-right: none;font-weight: normal"
            color="#312651"
          >
            <v-icon color="#3D5AFE" left small style="margin-right:6px">mdi-plus-circle-multiple-outline</v-icon>
            {{ $t('createInstance') }}
          </v-btn>
          <v-divider vertical />
          <template v-if="instance.id">
            <v-btn
              text
              style="border-right: none;font-weight: normal"
              @click="onClickAddInvolvedUser">
              <v-icon left style="margin-right:6px">mdi-account-supervisor-circle</v-icon>
              <v-badge
                color="#FF7754"
                dot
                bordered
                overlap
                :value="$refs.involvedUserDialogRef && $refs.involvedUserDialogRef.getInvolvedUsers().length>0"
              >
                {{ $t('groupIO') }}
              </v-badge>
            </v-btn>
            <v-divider vertical />
          </template>
          <v-btn
            text
            @click="stopDialog.display = true"
            :disabled="!instance.id"
            style="border-right: none;font-weight: normal"
            color="#312651"
          >
            <v-icon color="#FA4F07" left small style="margin-right:6px">mdi-close-circle-multiple</v-icon>
            {{ $t('stopCurrentInstance') }}
          </v-btn>
          <v-divider vertical />
          <v-btn
            text
            style="border-right: none; font-weight:normal; color:#444262"
            color="#444262"
            :disabled="!instance.id"
            @click="bpmnDialog.display=true"
          >
            <v-icon left small color="#57928D">mdi-map-legend</v-icon>
            {{ $t('bpmnView') }}
          </v-btn>
          <v-divider vertical />
          <v-btn
            @click="startAdd(true)"
            :disabled="!instance.id"
            text
            style="border-right: none;font-weight: normal"
            color="#312651"
          >
            <v-icon color="#57928D" left small style="margin-right:6px">mdi-content-copy</v-icon>
            {{ $t('copyCreate') }}
          </v-btn>
        </div>

        <div class="d-flex flex-column" style="flex:1;height: 0px;overflow-y: auto;padding: 13px" v-if="instance.id">
          <instance-milestone :instance="instance" style="margin-bottom: 10px"/>
          <div class="d-flex flex-row" style="align-items: center;color: #83829A;font-size: 12px;margin-bottom: 10px">
            {{ instance.id }}
            <v-icon
              class="copyIcon"
              v-show="instance.id"
              style="cursor: pointer;margin-left: 3px"
              color="#FF7754"
              :title="$t('clickToCopy') + instance.id"
              size="12.8"
              @click="copy(instance.id)"
            >
              mdi-file-move
            </v-icon>
          </div>
          <div class="d-flex flex-row" style="align-items: center;color: #83829A;font-size: 12px; margin-bottom:12px">
            <v-icon size="15" style="margin-right: 6px">mdi-plus</v-icon>
            <span>
              {{ utils.formatDateTime(instance.startTime, "YYYY-MM-DD HH:mm") }}
            </span>
            <div style="width: 20px"></div>
            <v-icon style="margin-right: 6px" size="15">mdi-account-check</v-icon>
            <span> {{ instance.startUserId && instance.startUser ? `${instance.startUser.firstName} ${instance.startUser.lastName}` : "--:--"
              }}</span>
          </div>
          <formio
            v-if="formData"
            :ref="`formio-${instance.id}`"
            :form="formData"
            class="formioClass"
            style="height: 0"
            :options="{readOnly:true,language: 'zh',noAlerts:true}"
            :submission="formValue"></formio>
        </div>
      </div>
      <detail-sider :instance="instance" ref="DetailSiderRef" />
    </div>
    <v-dialog v-model="searchDialog.display" width="431">
      <v-card>
        <v-card-title style="font-weight:normal; color:#312651">{{ $t('searchInstance') }}</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="searchDialog.processInstanceBusinessKeyLike"
            label=""
            :placeholder="$t('processTopic')"
          />
          <v-text-field
            v-model="searchDialog.processInstanceId"
            label=""
            :placeholder="$t('processInstanceId')"
          />

          <v-row>
            <v-col cols="6" sm="6">
              <v-menu
                ref="startedAfter"
                v-model="searchDialog.displayStartedAfter"
                :close-on-content-click="false"
                :nudge-left="80"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="searchDialog.startedAfter"
                    :label="$t('startDateFrom')"
                    append-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="searchDialog.startedAfter"
                  @input="searchDialog.displayStartedAfter = false"
                >
                </v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="6" sm="6">
              <v-menu
                ref="startedBefore"
                v-model="searchDialog.displayStartedBefore"
                :close-on-content-click="false"
                :nudge-left="80"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="searchDialog.startedBefore"
                    :label="$t('startDateTo')"
                    append-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="searchDialog.startedBefore"
                  @input="searchDialog.displayStartedBefore = false"
                >
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="resetSearch" style="font-weight:normal; color:#312651">
            <v-icon left>mdi-redo</v-icon>
            {{ $t('reset') }}
          </v-btn>
          <v-btn text @click="onSearchCommit" style="font-weight:normal; color:#312651">
            <v-icon left>mdi-magnify</v-icon>
            {{ $t('search') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="stopDialog.display" max-width="400">
      <v-card>
        <v-card-title class="headline" style="color: #444262">
          {{ $t('stopCurrentInstance') }}
        </v-card-title>
        <v-card-text>{{ $t('confirmStopCurrentInstance') }}</v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer />
          <v-btn text @click="stopDialog.display = false"> {{ $t('cancel') }}</v-btn>
          <v-btn style="color: #ffffff" color="#FF7754" @click="stop()">
            <v-icon size="16" color="#ffffff" style="margin-right: 6px">
              mdi-close-circle-multiple
            </v-icon>
            {{ $t('delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <application-associations
      v-if="process.id"
      ref="associationsDialog"
      :title="$t('copyAndCreate')"
      :current-app="process"
      @onItemClick="onAssociationItemClick"
      :process-deployment-id="process.deploymentId"
      :process-def-key="process.key" />

    <involved-user-dialog
      ref="involvedUserDialogRef"
      :read-only="instance && instance.startUserId && instance.startUserId!==userId"
      :resource-id="instance.id"
      @onInvolvedUsersChange="onInvolvedUsersChange"
      :off-line="false" />
    <v-dialog v-model="bpmnDialog.display">
      <v-card>
        <v-card-text style="padding: 0">
          <vue-bpmn
            ref="vueBpmnViwer"
            :node-properties="bpmnDialog.nodeProperties"
            :diagram-xml="bpmnDialog.xml"
            style="height: 70vh"
            background-color="#FFFFFF"
            :options="{ overlays: { defaults: { scale: true } } }" />
        </v-card-text>
        <v-card-actions style="padding: 0">
          <v-spacer />
          <v-btn text @click="bpmnDialog.display=false">{{ $t('close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import DetailSider from "./DetailSider";
import AppDetailCommon from "@/components/common/application/mixins/AppDetail";
import userRequest from "@/api/user";
import InvolvedUserDialog from "@/components/common/involveduser/InvolvedUserDialog";
import VueBpmn from "@/components/common/BPMN";
import processRequest from "@/api/process";
import instanceRequest from "@/api/instance";

export default {
  name: "ApplicationDetail",
  mixins: [AppDetailCommon],
  data() {
    return {
      bpmnDialog: {
        display: false,
        nodeProperties: {},
        xml: ""
      },
      idBreadcrumbs: [
        {
          text: this.$t("app"),
          disabled: false,
          href: "#/task/application/list"
        },
        {
          text: "",
          disabled: false
        },
        {
          text: "",
          disabled: true
        }
      ],
      id: "",
      nowStep: 0,
      xml: "",
      showInstance: false,
      tasks: {
        page: 0,
        pageCount: 0,
        itemsPerPage: 30,
        totalCount: 0,
        sortBy: "created",
        sortOrder: "desc",
        items: []
      },
      callInstances: {
        page: 0,
        pageCount: 0,
        itemsPerPage: 10,
        totalCount: 0,
        items: []
      },
      version: {},
      instance: {},
      nodeProperties: {},
      currentElement: null,
      tab: 0,
      left: true,
      stopDialog: {
        display: false
      }
    };
  },
  async mounted() {
    if (this.$route.query.defaultSearchInstanceId) {
      this.searchDialog.processInstanceId = this.$route.query.defaultSearchInstanceId;
    }
    this.autoSelect = true;
    this.process.id = this.$route.params.id;
    this.process.key = this.$route.query.key;
    await this.getProcess();
    this.idBreadcrumbs[1].text = this.process.name;
    this.idBreadcrumbs[1].href = `#/task/application/list?defaultSearchVal=${this.process.name}`;
    await this.$refs.DetailSiderRef.refreshTasks(this.instances.active);
  },
  methods: {
    onInvolvedUsersChange(involvedUsers) {
      this.instance = Object.assign(this.instance, {
        involvedUsers
      });
      if (this.$refs.DetailSiderRef) {
        this.$refs.DetailSiderRef.refresh();
      }
    },
    onClickAddInvolvedUser() {
      let self = this;
      self.$refs.involvedUserDialogRef.show(true);
    },
    onAssociationItemClick(association) {
      // 复制创建
      this.$router.push({
        name: "application-create",
        params: { key: association.key },
        query: { instanceId: this.instance.id }
      });
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
    },
    async stop() {
      await this.stopInstance(this.instance);
      await this.selectInstance();
      await this.refreshInstances();
      this.stopDialog.display = false;
      this.$notify.success(this.$t("stopProcessSuccess"));
    },

    async setSort(field) {
      this.instances.sortBy = field;
      this.instances.sortOrder = this.instances.sortOrder === "desc" ? "asc" : "desc";
      await this.refreshInstances();
    },

    async setStatus(field) {
      var opposite = field === "completed" ? "active" : "completed";
      this.instances[field] = true;
      this.instances[opposite] = false;
      await this.refreshInstances();
      await this.$refs.DetailSiderRef.refreshTasks(this.instances.active);
    },
    async selectInstance(instance) {
      if (instance) {
        if (instance.startUserId) {
          instance.startUser = await userRequest.getProfile(instance.startUserId);
        }
        instance.involvedUsers = await instanceRequest.getInvolvedUsersByInstanceId(instance.id);
      }
      this.instance = instance || {};
      await this.resetTabs();
    },

    async getTab() {
      switch (this.tab) {
        case 0:
          await this.getForm(this.process.id);
          break;
        case 1:
          await this.getCallInstances();
          break;
      }
    },
    onSearchCommit() {
      this.refreshInstances();
      this.searchDialog.display = false;
    },
    resetSearch() {
      this.searchDialog.processInstanceBusinessKeyLike = "";
      this.searchDialog.startedAfter = "";
      this.searchDialog.startedBefore = "";
      this.searchDialog.processInstanceId = "";
    },
    async startAdd(isCopy) {
      if (isCopy) {
        let self = this;
        let associationsRef = self.$refs.associationsDialog;
        if (associationsRef) {
          associationsRef.show(true);
        }
      } else {
        this.$router.push({
          name: "application-create",
          params: { key: this.process.key }
        });
      }
    },
    copy(value) {
      navigator.clipboard.writeText(value);
      this.$message({
        message: this.$t("copyTxtSuccessWithValue",{txt:value}),
        type: "success",
        showClose:true
      });
    }
  },
  watch: {
    "$i18n.locale": {
      handler(val){
        let self=this;
        self.idBreadcrumbs[0].text=self.$t("app");
      },
    },
    tab: {
      handler() {
        this.getTab();
      }
    },
    "bpmnDialog.display": {
      async handler(val) {
        let self = this;
        if (val) {
          let response = await processRequest.getProcessXml(self.instance.processDefinitionId);
          let statistics = await processRequest.getProcessStatistics(
            "history",
            self.instance.processDefinitionId,
            self.instance.id
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

          self.bpmnDialog.xml = response.bpmn20Xml;
          this.bpmnDialog.nodeProperties = nodeProperties;
        }
      }
    }
  },
  components: {
    DetailSider, InvolvedUserDialog, VueBpmn
  }
};
</script>
<style scoped>
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
  font-weight: bold;
  margin-bottom: 2px;
  color: rgba(68, 66, 98, 1);
  font-size: 14px;
}

.custom-drawer-item .detail {
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
  height: 100%;
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

.point::after {
  font-size: 14px;
  content: "";
  display: block;
  width: 8px;
  height: 8px;
  background-color: #651fff;
  border-radius: 50%;
  position: relative;
  right: 3px;
  top: -7px;
  opacity: 1;
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

.badge-app-detail {
  background-color: #34C758;
}

.badge-total i,
.badge-instance i,
.badge-group i,
.badge-app i,
.badge-app-detail i,
.badge-incident i {
  margin-right: 4px;
}
</style>
