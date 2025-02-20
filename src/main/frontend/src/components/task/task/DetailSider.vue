<template>
  <div class="sider d-flex flex-row" style="height: 100%">
    <div class="d-flex flex-column" style="height: 100%;width: 50px;">
    </div>
    <v-navigation-drawer
      absolute
      :mini-variant="!right"
      mini-variant-width="50"
      style="height: calc(100% - 49px) !important;top: 50px !important;border-top: 1px solid rgb(187, 187, 187);border-left: 1px solid rgb(187, 187, 187)"
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
          <div class="drawer-menu d-flex flex-column" style="margin-top: 44px">
            <v-btn
              v-for="item in tabs"
              :key="item.id"
              icon
              @click="selectTab(item)"
              style="border-right-width: 0; width: 100%; margin: 0; height: 45px"
            >
              <v-badge bordered dot overlap color="#FF7754"
                       :value="similarTaskCount && item.id==='task'">
                <v-icon :class="{ current: tab === item.id }" @click="selectTab(item)">
                  {{ item.icon }}
                </v-icon>
              </v-badge>
            </v-btn>
          </div>
        </div>
        <div class="d-flex flex-column" style="height: 100%;flex: 1;border-left: 1px solid rgb(187, 187, 187)">
          <div class="tab-title">{{ tabName }}</div>
          <div class="tab-content" style="height: 0px;flex: 1">
            <v-list v-show="tab === 'information'" style="height: 100%;overflow-y: auto">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-subtitle class="subtitle">
                    {{ $t('taskName') }}
                  </v-list-item-subtitle>
                  <div class="value">
                    {{ task.name }}
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-subtitle class="subtitle">
                    {{ $t('taskIntro') }}
                  </v-list-item-subtitle>
                  <div class="value">
                    {{ "--" }}
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-subtitle class="subtitle">
                    {{ $t('belongToProcess') }}
                  </v-list-item-subtitle>
                  <div class="value">{{ instance.processDefinitionName || $t('noTopic') }}
                    <v-icon
                      class="copyIcon"
                      v-show="instance.id"
                      style="cursor: pointer"
                      color="#FF7754"
                      :title="$t('clickToCopy') + instance.id"
                      size="12.8"
                      @click="copy(instance.id)"
                    >
                      mdi-file-move
                    </v-icon>
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-subtitle class="subtitle">
                    {{ $t('priority') }}
                  </v-list-item-subtitle>
                  <div class="value">{{ task.priority }}
                    <v-icon
                      size="12.8"
                      :color="judgePriority(task.priority).iconColor"
                    >
                      {{ judgePriority(task.priority).icon }}
                    </v-icon>
                  </div>
                </v-list-item-content>
              </v-list-item>

              <div
                style="
              border-bottom: 1px dashed #bbbbbb;
              margin: 12px 16px 22px 16px;
            "
              />

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-subtitle class="subtitle">
                    {{ $t('createTime') }}
                  </v-list-item-subtitle>
                  <div class="value">
                    {{ utils.formatDateTime(
                    task.created || task.startTime,
                    "YYYY-MM-DD HH:mm"
                  ) || "--:--" }}
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-subtitle class="subtitle">
                    {{ $t('dueTime') }}
                  </v-list-item-subtitle>
                  <div class="value">
                    {{ task.due ? utils.formatDateTime(task.due) : "--:--" }}
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-subtitle class="subtitle">
                    {{ $t('followTime') }}
                  </v-list-item-subtitle>
                  <div class="value">
                    {{ utils.formatDateTime(task.followUp) || "--:--" }}
                  </div>
                </v-list-item-content>
              </v-list-item>
              <div
                style="
              border-bottom: 1px dashed #bbbbbb;
              margin: 12px 16px 22px 16px;
            "
              />
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-subtitle class="subtitle">
                    {{ $t('exeUser') }}
                  </v-list-item-subtitle>
                  <div class="value">
                    {{ task.assignee && task.assigneeName ? task.assigneeName : "--" }}
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-subtitle class="subtitle">
                    {{ $t('doUser') }}
                  </v-list-item-subtitle>
                  <div class="value">
                    {{ task.owner && task.ownerName ? task.ownerName : "--" }}
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-subtitle class="subtitle">
                    {{ $t('waitGroup') }}
                  </v-list-item-subtitle>
                  <div class="value">
                    {{ "--" }}
                  </div>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <div v-show="tab === 'task'" style="height: 100%;overflow-y: auto">
              <task-item
                v-for="item in similarTask.items"
                @onItemClick="selectTask(item)"
                :task="item"
                :key="item.id"
                :mobile-mode="false" />
              <infinite-loading
                @infinite="getSimilarTask"
                :identifier="similarTask.infiniteId"
              >
                <template #no-more>
                  <div class="d-flex flex-row infinite-more-container">
                    <div class="infinite-more-container-pre" />
                    <div class="infinite-more-container-content">{{ $t('noMoreTask') }}</div>
                    <div class="infinite-more-container-pre" />
                  </div>
                </template>
              </infinite-loading>
            </div>

            <div v-show="tab === 'history'">
              <ProcessTimeLine
                v-if="instance.id"
                :task="task"
                ref="processTimeLineRef"
                @onRejectTask="onRejectTask"
                :can-reject="true"
                :instance-id="instance.id"
              ></ProcessTimeLine>
            </div>
            <div v-show="tab === 'conversation'" style="height: 100%">
              <application-instance-message
                :mobile-mode="false"
                :task="task"
                ref="applicationInstanceMessageRef"
                :instance-id="task.processInstanceId"
                v-if="task.id" />
            </div>
          </div>
        </div>
      </v-list-item>
    </v-navigation-drawer>
  </div>
</template>

<script>
import utils from "@/utils/utils";
import ProcessTimeLine from "@/components/common/ProcessTimeLine";
import ApplicationInstanceMessage from "@/components/common/application/ApplicationInstanceMessage";
import TaskItem from "@/components/common/task/TaskItem";
import SimilarTask from "@/components/common/task/mixins/similarTask";
import taskRequest from "@/api/task";

export default {
  name: "DetailSider",
  mixins: [SimilarTask],
  props: {
    task: {
      type: Object,
      required: true
    },
    instance: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      right: false,
      tab: "information",
      utils,
      tabs: [
        {
          icon: "mdi-information-box-outline",
          id: "information",
          name: this.$t("basicInfo")
        },
        {
          icon: "mdi-list-box-outline",
          id: "task",
          name: this.$t("linkTask")
        },
        {
          icon: "mdi-weather-cloudy-clock",
          id: "history",
          name: this.$t("processHistory")
        },
        {
          icon: "mdi-message-text-outline",
          id: "conversation",
          name: this.$t("comment")
        }
      ],
      similarTaskCount: 0
    };
  },
  computed: {
    tabName() {
      let tab = this.tabs.find((tab) => tab.id == this.tab);
      return tab && tab.name;
    }
  },
  methods: {
    onRejectTask(){
      this.$emit("onRejectTask");
    },
    judgePriority(priority) {
      if (priority === 99) {
        return { text: this.$t("topCard"), color: "color: #673ab7", icon: "mdi-ticket", iconColor: "#0F40F5" };
      } else if (priority > 60) {
        return { text: this.$t("top"), color: "color: #e91e63", icon: "mdi-flag", iconColor: "#FA4F07" };
      } else if (priority > 30) {
        return { text: this.$t("medium"), color: "color: #ff9800", icon: "mdi-flag-outline", iconColor: "#FA4F07" };
      } else {
        return { text: this.$t("low"), color: "color: #009688", icon: "mdi-flag-outline", iconColor: "#0F40F5" };
      }
    },
    copy(value) {
      navigator.clipboard.writeText(value);
      this.$message({
        message: this.$t("copyTxtSuccessWithValue",{txt:value}),
        type: "success",
        showClose:true
      });
    },
    selectTab(tab) {
      this.right = true;
      this.tab = tab.id;
    },
    selectTask(task) {
      this.$emit("selectTask",task);
    }
  },
  watch: {
    "$i18n.locale": {
      handler(val){
        let self=this;
        self.tabs = [
          {
            icon: "mdi-information-box-outline",
            id: "information",
            name: this.$t("basicInfo")
          },
          {
            icon: "mdi-list-box-outline",
            id: "task",
            name: this.$t("linkTask")
          },
          {
            icon: "mdi-weather-cloudy-clock",
            id: "history",
            name: this.$t("processHistory")
          },
          {
            icon: "mdi-message-text-outline",
            id: "conversation",
            name: this.$t("comment")
          }
        ];
      },
    },
    "task.id": {
      async handler(id) {
        let self = this;
        if (!id) {
          return;
        }
        // 获取相关task数量
        let reqData = {};
        if (self.similarTask.filter.searchVal) {
          reqData["orQueries"] = [
            {
              processInstanceBusinessKeyLike: `%${self.similarTask.filter.searchVal}%`,
              processDefinitionNameLike: `%${self.similarTask.filter.searchVal}%`
            },
            {
              assignee: self.userId
            },
            {
              taskDefinitionKey: self.task.taskDefinitionKey
            }
          ];
        } else {
          reqData["orQueries"] = [
            {
              processInstanceId:self.task.processInstanceId,
              taskDefinitionKey: self.task.taskDefinitionKey
            },
            {
              assignee: self.userId
            },
          ];
        }
        let taskCountResult = await taskRequest.postTaskCount("", {}, reqData);
        self.similarTaskCount = taskCountResult.count - 1;
        // 刷新状态
        if (self.tab === "task") {
          self.onSearchSimilarTask();
        }
        if (self.tab === "history") {
          self.$refs.processTimeLineRef.refreshData();
        }
        if (self.tab === "conversation") {
          self.$refs.applicationInstanceMessageRef.getComments();
        }
      }
    },
    tab: {
      async handler() {
        let self = this;
        if (self.tab === "task") {
          self.onSearchSimilarTask();
        }
        if (self.tab === "history") {
        }
        if (self.tab === "conversation") {
          self.$refs.applicationInstanceMessageRef.getComments();
        }
      }
    }
  },
  // eslint-disable-next-line vue/no-unused-components
  components: { TaskItem, ProcessTimeLine, ApplicationInstanceMessage },
  async mounted() {
    // 刷新taskCount
    let self = this;
    if (!self.task.id) {
      return;
    }
    // 获取相关task数量
    let reqData = {};
    if (self.similarTask.filter.searchVal) {
      reqData["orQueries"] = [
        {
          processInstanceBusinessKeyLike: `%${self.similarTask.filter.searchVal}%`,
          processDefinitionNameLike: `%${self.similarTask.filter.searchVal}%`
        },
        {
          assignee: self.userId
        },
        {
          taskDefinitionKey: self.task.taskDefinitionKey
        }
      ];
    } else {
      reqData["orQueries"] = [
        {
          taskDefinitionKey: self.task.taskDefinitionKey,
          processInstanceId:self.task.processInstanceId
        },
        {
          assignee: self.userId
        }
      ];
    }
    let taskCountResult = await taskRequest.postTaskCount("", {}, reqData);
    self.similarTaskCount = taskCountResult.count - 1;
  },
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
/deep/ .v-navigation-drawer__border{
  display: none;
}
</style>

<style>
.tab-content
.theme--light.v-list-item:not(.v-list-item--disabled)
.v-list-item__subtitle.subtitle {
  color: rgba(177, 171, 182, 1);
  font-size: 12px;
}

.tab-content .theme--light.v-list-item:not(.v-list-item--disabled) div.value {
  color: rgba(49, 38, 81, 1);
  font-size: 14px;
  margin-top: 5px;
}

.tab-content .d-flex.flex-column.custom-drawer-item {
  padding: 12px 15px;
  align-items: start;
  cursor: pointer;
}

.tab-content .d-flex.flex-column.custom-drawer-item:not(:first-child) {
  border-top: none;
}

.tab-content .d-flex.flex-column.custom-drawer-item .key {
  font-weight: bold;
  color: rgba(68, 66, 98, 1);
  font-size: 14px;
}

.tab-content .d-flex.flex-column.custom-drawer-item .detail {
  color: rgba(68, 66, 98, 1);
  font-size: 12px;
  margin-top: 2px;
}

.tab-content .d-flex.flex-column.custom-drawer-item .date {
  display: flex;
  align-items: center;
  width: 100%;
  color: rgba(131, 130, 154, 1);
  font-size: 12px;
}
</style>
