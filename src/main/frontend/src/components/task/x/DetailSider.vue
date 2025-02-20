<template>
  <div class="sider d-flex flex-row" style="height: 100%">
    <v-dialog v-model="setFollowDialog.display" max-width="600">
      <v-card>
        <v-card-title> {{ $t("setFollowTime") }}</v-card-title>
        <v-card-text>
          <div class="d-flex flex-row" style="gap: 30px">
            <vc-date-picker
              mode="dateTime"
              is24hr
              v-model="setFollowDialog.form.followupDate"
            />
            <div class="d-flex flex-column" style="height: 335px; width: 250px">
              <v-text-field
                v-model="setFollowDialog.form.title"
                hide-details
                dense
                :placeholder="$t('notifyTitle')"
              ></v-text-field>
              <v-radio-group
                v-model="setFollowDialog.form.importance"
                row
                dense
                hide-details
                style="margin-bottom: 20px"
              >
                <v-radio :label="$t('normal')" value="普通" />
                <v-radio :label="$t('important')" value="重要" />
              </v-radio-group>
              <v-textarea
                v-model="setFollowDialog.form.remark"
                :placeholder="$t('inputNotifyDesc')"
                outlined
              ></v-textarea>
              <v-spacer />
              <div class="d-flex flex-row">
                <v-spacer />
                <v-btn text @click="setFollowDialog.display = false" small> {{ $t("cancel") }}</v-btn>
                <v-btn
                  @click="onFollowCommitClick"
                  :loading="setFollowDialog.commitLoading"
                  small
                  color="#FF7754"
                  class="text-white"
                >
                  {{ $t("add") }}
                </v-btn>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-navigation-drawer
      absolute
      style="height: 100%; border-top: 0px solid #e6e4e6"
      right
      temporary
      stateless
      v-model="$store.state.common.xDetailRightDrawer"
      :width="$store.state.common.xDetailRightDrawer ? 400 : 0"
    >
      <v-list-item
        style="
          display: flex;
          flex-direction: row;
          width: 100%;
          padding: 0;
          align-items: start;
        "
      >
        <div class="d-flex flex-column" style="width: 50px">
          <v-btn
            icon
            style="border-right-width: 0; width: 100%; margin: 0; height: 42px"
            @click="$store.dispatch('common/setXDetailRightDrawer')"
          >
            <v-icon color="#ff7754">
              {{ $store.state.common.xDetailRightDrawer ? "mdi-chevron-right" : "mdi-chevron-left" }}
            </v-icon>
          </v-btn>
          <div class="drawer-menu d-flex flex-column" style="margin-top: 44px">
            <v-btn
              v-for="item in tabs"
              :key="item.id"
              icon
              style="border-right-width: 0; width: 100%; margin: 0; height: 45px"
            >
              <v-badge
                bordered
                dot
                overlap
                color="#FF7754"
                :value="taskTotalCount && item.id === 'task'"
              >
                <v-icon :class="{ current: tab == item.id }" @click="selectTab(item)">
                  {{ item.icon }}
                </v-icon>
              </v-badge>
            </v-btn>
          </div>
        </div>
        <div
          class="d-flex flex-column"
          style="flex: 1; border-left: 0px solid #e6e4e6; min-height: calc(100vh - 50px)"
        >
          <div class="d-flex flex-row" style="padding: 13px 16px">
            <div class="tab-title" style="margin: 0">{{ tabName }}</div>
            <v-spacer />
            <v-badge
              bordered
              dot
              overlap
              color="#FF7754"
              v-if="tab === 'calendar'"
              :value="extraProcessKeys.length||($refs.taskList&&$refs.taskList.quickFilter==='custom')"
            >
              <v-icon v-if="tab === 'calendar'" size="16" @click="clearExtraProcessKeys">
                mdi-refresh
              </v-icon>
            </v-badge>
          </div>

          <div class="tab-content" style="height: 100%; flex: 1">
            <div v-show="tab === 'calendar'">
              <v-overlay :value="calendar.loading" z-index="10000">
                <v-progress-circular indeterminate size="30" />
              </v-overlay>

              <div
                style="
                  margin: 10px 0;
                  background-color: white;
                  border-radius: 0.5rem;
                  border: 1px solid rgba(230, 228, 230, 1);
                "
              >
                <task-calendar
                  ref="calendarRef"
                  :items="calendar.items"
                  @setRange="setRange"
                />
              </div>
              <div
                style="
                  margin: 10px 0;
                  background-color: white;
                  border-radius: 6px;
                  min-height: 100px;
                  border: 1px solid rgba(230, 228, 230, 1);
                  flex: 1;
                "
              >
                <task-list
                  :process-keys="allProcessKeys"
                  ref="taskList"
                  @selectQuickFilter="onSelectQuickFilter"
                />
              </div>
            </div>
            <div v-show="tab === 'process'">
              <v-list three-line style="padding: 0 0px; border-radius: 6px">
                <v-list-item
                  @click="goToProcess(item)"
                  v-for="item in processList.items"
                  :key="item.id"
                  style="
                      min-height: unset;
                      padding-top: 18px;
                      padding-bottom: 18px;
                      border-bottom: 1px solid rgb(230, 228, 230);
                      cursor: pointer;
                    "
                >
                  <i
                    :class="item.icon"
                    style="color: #83829a; font-size: 35px; margin-right: 18px"
                  ></i>

                  <v-list-item-content style="padding: 0; max-width: 252px">
                    <div style="display: flex">
                      <div style="flex: 10">
                        <v-list-item-title
                          style="font-weight: bold; font-size: 1rem; color: #312651"
                        >
                          {{ item.name }}
                        </v-list-item-title>
                      </div>
                      <div style="flex: 2; text-align: right">
                        <span v-show="item.count" class="badge">{{ item.count }}</span>
                      </div>
                    </div>
                    <div style="display: flex; margin-top: 4px">
                      <div style="flex: 6">
                        <v-list-item-subtitle style="font-size: 12px; color: #b1abb6"
                        >{{ item.description }}
                        </v-list-item-subtitle>
                      </div>
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <infinite-loading
                @infinite="getProcessList"
                :identifier="processList.infiniteId"
              >
                <template #no-more>
                  <div class="d-flex flex-row infinite-more-container">
                    <div class="infinite-more-container-pre" />
                    <div class="infinite-more-container-content">{{ $t("noMoreProcess") }}</div>
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
</template>

<script>
import utils from "@/utils/utils";
import taskRequest from "@/api/task";
import processRequest from "@/api/process";
import instanceRequest from "@/api/instance";
import moment from "moment/moment";
import { Form } from "vue-formio-eorion";
import InfiniteLoading from "vue-infinite-loading";
import TaskList from "@/components/task/home/TaskList";
import TaskCalendar from "@/components/common/TaskCalendar";


export default {
  name: "DetailSider",
  props: {
    application: {
      type: Object,
      required: true
    },
    page: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      extraProcessKeys: [],
      allProcessKeys: "",
      pageSize: 10,
      processList: {
        items: [],
        infiniteId: +new Date()
      },

      copilotCalls: [],
      instance: { id: "" },
      historyTasks: {
        itemsPerPage: 5,
        totalCount: 0,
        sortBy: "startTime",
        sortOrder: "desc",
        loading: true,
        items: [],
        filter: {},
        identifier: +new Date()
      },
      userId: this.$store.state.user.profile.id,
      userName: this.$store.getters["user/getUserName"],
      tenantId: this.$store.getters["user/getTenant"].id,
      setFollowDialog: {
        display: false,
        commitLoading: false,
        form: {
          title: "",
          importance: "普通",
          remark: "",
          followupDate: new Date()
        },
        type: "",
        extraData: {}
      },
      question: {
        value: "",
        loading: false
      },
      firstCalendarRange: true,
      task: {},
      calendar: {
        loading: false,
        items: []
      },
      taskRight: false,
      utils,
      tabs: [
        {
          icon: "mdi-calendar-check-outline",
          id: "calendar",
          name: this.$t("task")
        },
        {
          icon: "mdi-all-inclusive",
          id: "process",
          name: this.$t("process")
        }
      ],
      tab: "calendar",
      taskTotalCount: 0,
    };
  },
  async mounted() {
  },
  methods: {
    clearExtraProcessKeys() {
      let self = this;
      self.extraProcessKeys = [];
      self.$refs.taskList.quickFilter = "";
      self.$refs.taskList.customFilter = {};
      self.refresh();
    },
    addExtraProcessKeys(processKeys) {
      let self = this;
      if (processKeys && processKeys.length > 0) {
        self.extraProcessKeys = processKeys.split(",");
      } else {
        self.extraProcessKeys = [];
      }
      self.refresh();
    },
    goToApplication(event, item) {
      const routeData = this.$router.resolve({
        name: "task-application-detail",
        params: { id: "null" },
        query: {
          defaultSearchInstanceId: item.resultObjectId,
          key: item.resource
        }
      });
      window.open(routeData.href, "_blank");
      event.stopPropagation();
      event.preventDefault();
    },
    async refresh() {
      let self = this;
      this.calendar.loading = true;
      this.allProcessKeys = self.page.processKeys.split(",").concat(self.extraProcessKeys).join(",");
      await this.getCalendar();
      await this.$refs.taskList.refreshTasks();
      await this.$refs.taskList.getQuickFilters();

      this.calendar.loading = false;
    },
    copy(value) {
      navigator.clipboard.writeText(value);
      this.$message({
        message: this.$t("copyTxtSuccessWithValue", { txt: value }),
        type: "success",
        showClose:true
      });
    },
    async selectTab(tab) {
      await this.$store.dispatch("common/setXDetailRightDrawer",true);
      this.tab = tab.id;
      if (this.tab === "process") {
        setTimeout(() => {
          this.processList.items = [];
          this.processList.infiniteId += 1;
        }, 300);
      }
    },
    goToProcess(item) {
      this.$emit("onProcessItemClick", item.key);
    },
    async getProcessList($state) {
      try {
        let keysIn = this.page.processKeys
          .split(",")
          .map((key) => key.trim())
          .filter((key) => key.length)
          .toString();
        let processes = await processRequest.getProcessByDeployment({
          firstResult: this.processList.items.length,
          maxResults: this.pageSize,
          startableBy: this.userId,
          latestVersion: true,
          sortBy:"deployTime",
          sortOrder:"desc",
          keysIn
        });
        for (var i = 0; i < processes.length; i++) {
          let process = processes[i];
          let response = await processRequest.postInstanceCount("", null, {
            processDefinitionKey: process.key,
            variables: [
              {
                name: "startUserId",
                operator: "eq",
                value: this.userId
              }
            ]
          });
          process.count = response.count;
        }
        let processDefKeyIn = [];
        processes.forEach((association) => {
          if (!processDefKeyIn.includes(association.key)) {
            processDefKeyIn.push(association.key);
          }
        });
        // 获取流程对应icon
        let iconResults = await processRequest.getProcessIconByKeys(
          this.$store.getters["user/getTenant"].id,
          processDefKeyIn
        );
        processes.forEach((resource) => {
          let iconResult = iconResults.find(
            (iconResult) => iconResult.appKey === resource.key
          );
          let icon = { color: "#444262" };
          if (iconResult && iconResult.configJson) {
            icon.icon = `${iconResult.configJson.iconType} fa-fw ${iconResult.configJson.icon}`;
          }
          resource.icon = icon.icon;
          resource.color = icon.color;
        });
        this.processList.items = this.processList.items.concat(processes);
        $state.loaded();
        if (processes.length < this.pageSize) {
          // 加载完成
          $state.complete();
        }
      } catch (e) {
        console.log(e);
        $state.complete();
      }
    },
    selectTask(task) {
      this.$router.push({
        name: "task-list",
        query: { defaultSearchTaskId: task.id }
      });
    },
    onSelectCustomQuickFilter(payload) {
      this.selectTab({id:"calendar"});
      this.$refs.taskList.selectCustomQuickFilter("custom", payload);
      this.selectQuickFilterTimeStamp = new Date();
      this.$refs.calendarRef.setRange({});
    },
    onSelectQuickFilter() {
      this.selectQuickFilterTimeStamp = new Date();
      this.$refs.calendarRef.setRange({});
    },
    async getCalendar() {
      let data = {
        orQueries: [{ candidateUser: this.userId, assignee: this.userId }],
        nameNotLike: "Complete a Question"
      };
      if (this.allProcessKeys) {
        data.processDefinitionKeyIn = this.allProcessKeys
          .split(",")
          .map((key) => key.trim())
          .filter((key) => key.length);
      }
      let tasks = await taskRequest.postTaskList("", {}, data);
      this.calendar.items = tasks;
    },
    setRange(range, date) {
      // 200ms以内，视为是通过quickSelect触发的清空操作，不请求日期
      if (
        !this.selectQuickFilterTimeStamp ||
        moment().diff(this.selectQuickFilterTimeStamp) >= 200
      ) {
        if (this.firstCalendarRange) {
          this.firstCalendarRange = false;
          return;
        }

        this.$refs.taskList.setRange(range, date);
      }
    },
    async onFollowCommitClick() {
      //提交跟进
      let self = this;
      // 校验
      if (!self.setFollowDialog.form.title) {
        self.$notify.error(self.$t("plsInputFollowTitle"));
        return;
      }
      self.setFollowDialog.commitLoading = true;
      let variables = {
        startUserId: {
          value: self.userId,
          type: "String"
        },
        followupType: {
          value: self.setFollowDialog.type,
          type: "String"
        },
        title: {
          value: self.setFollowDialog.form.title,
          type: "String"
        },
        remarks: {
          value: self.setFollowDialog.form.remark,
          type: "String"
        },
        importance: {
          value: self.setFollowDialog.form.importance,
          type: "String"
        },
        followupDate: {
          value: self.setFollowDialog.form.followupDate.toISOString(),
          type: "String"
        }
      };
      Object.keys(self.setFollowDialog.extraData).forEach((key) => {
        variables[`${key}`] = {
          value: self.setFollowDialog.extraData[`${key}`],
          type: "String"
        };
      });
      processRequest
        .startProcess("bpez_Process_taskfollowup", {
          variables: variables,
          businessKey: self.setFollowDialog.form.title
        })
        .then(async (response) => {
          self.setFollowDialog.display = false;
          self.setFollowDialog.commitLoading = false;
          self.$notify.success(self.$t("setFollowSuccess"));
        })
        .catch((err) => {
          self.$message.error(`${err.response.status}:${err.response.data.message}`);
          self.setFollowDialog.commitLoading = false;
        });
    },
  },
  computed: {
    tabName() {
      let tab = this.tabs.find((tab) => tab.id == this.tab);
      return tab && tab.name;
    },
    email() {
      return this.$store.state.user.profile.email || "N/A";
    }
  },
  watch: {
    "$i18n.locale": {
      handler(val) {
        let self = this;
        self.tabs = [
          {
            icon: "mdi-calendar-check-outline",
            id: "calendar",
            name: this.$t("task")
          },
          {
            icon: "mdi-all-inclusive",
            id: "process",
            name: this.$t("process")
          }
        ];
      }
    },
    tab: {
      async handler() {
      }
    },
    "$store.state.common.xDetailRightDrawer": {
      async handler(value) {
        if (value) {
          // this.aiRight = false;
          await this.refresh();
        }
      }
    },
    aiRight: {
      handler(value) {
        if (value) {
          this.taskRight = false;
        }
      }
    }
  },

  components: {
    TaskList,
    TaskCalendar,
    InfiniteLoading,
    formio: Form,
  }
};
</script>
<style scoped>
/*.v-navigation-drawer--open:not(.v-navigation-drawer--mini-variant, .v-navigation-drawer--custom-mini-variant) {*/
/*  box-shadow: 0px 0px 50px #444262;*/
/*}*/

/deep/ .v-chip .v-chip__content {
  max-width: 100%;
  height: auto;
  min-height: 32px;
  white-space: pre-wrap;
  padding: 10px 0;
}

.sider {
  background-color: #ffffff;
  border-top: 1px solid rgba(177, 171, 182);
}

.action-item {
  display: inline-block;
  margin-bottom: 5px;
}

.ai-icon {
  color: #444262;
}

.ai-icon.current {
  color: #0f40f5;
}

.v-input.v-text-field.v-text-field--outlined:deep(fieldset) {
  border: unset;
}

.v-text-field--outlined.v-input--dense.v-text-field--outlined:deep(> .v-input__control
    > .v-input__slot),
.v-text-field--outlined.v-input--dense.v-text-field--outlined:deep(input) {
  min-height: 60px;
  height: 60px;
  font-size: 18px;
}

.tab-title {
  margin: 13px 16px;
  color: rgba(16, 16, 16, 1);
  font-size: 14px;
}
</style>
