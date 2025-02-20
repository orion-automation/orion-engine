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
                       :value="taskTotalCount && item.id==='task'">
                <v-icon :class="{ current: tab == item.id }" @click="selectTab(item)">
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
                    {{ $t('createTime') }}
                  </v-list-item-subtitle>
                  <div class="value">
                    {{ utils.formatDateTime(instance.startTime) }}
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-subtitle class="subtitle">
                    {{ $t('endTime') }}
                  </v-list-item-subtitle>
                  <div class="value">
                    {{ instance.endTime ? utils.formatDateTime(instance.endTime) : "--:--" }}
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-subtitle class="subtitle">
                    {{ $t('creator') }}
                  </v-list-item-subtitle>
                  <div class="value">
                    {{ instance.startUser ? `${instance.startUser.firstName} ${instance.startUser.lastName}` : instance.startUserId
                    }}
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-subtitle class="subtitle">
                    {{ $t('inviter') }}
                  </v-list-item-subtitle>
                  <div class="value">
                    {{ instance.involvedUsers ? instance.involvedUsers.map(user => `${user.firstName} ${user.lastName}`).join(",") : "--"
                    }}
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
                    {{ $t('processName') }}
                  </v-list-item-subtitle>
                  <div class="value">
                    {{ instance.processDefinitionName }}
                    <v-icon
                      class="copyIcon"
                      v-show="instance.processDefinitionName"
                      style="cursor: pointer"
                      color="#FF7754"
                      :title="$t('clickToCopy') + instance.processDefinitionName"
                      size="12.8"
                      @click="copy(instance.processDefinitionKey)"
                    >
                      mdi-file-move
                    </v-icon>
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-subtitle class="subtitle">
                    {{ $t('processDefId') }}
                  </v-list-item-subtitle>
                  <div class="value">
                    {{ instance.processDefinitionId }}
                    <v-icon
                      class="copyIcon"
                      v-show="instance.processDefinitionId"
                      style="cursor: pointer"
                      color="#FF7754"
                      :title="$t('clickToCopy') + instance.processDefinitionId"
                      size="12.8"
                      @click="copy(instance.processDefinitionId)"
                    >
                      mdi-file-move
                    </v-icon>
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-subtitle class="subtitle">
                    {{ $t('version') }}
                  </v-list-item-subtitle>
                  <div class="value">
                    {{ instance.processDefinitionVersion }}
                  </div>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <div v-show="tab === 'task'" style="height: 100%;overflow-y: auto">
              <v-radio-group row dense
                             @change="refreshTasks(tasks.active)"
                             v-model="tasks.linkTaskFilter" hide-details style="margin-top: 0;margin-left: 10px;padding-right: 10px;padding-bottom: 10px">
                <v-radio value="all" color="#fd775a">
                  <template #label>
                    <div style="font-size: 14px;color: #3a3a3a">
                      {{ $t('allItems') }}
                    </div>
                  </template>
                </v-radio>
                <v-radio value="current" color="#fd775a">
                  <template #label>
                    <div style="font-size: 14px;color: #3a3a3a">
                      {{ $t('currentInstance') }}
                    </div>
                  </template>
                </v-radio>
              </v-radio-group>
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
                    <div class="infinite-more-container-content">{{ $t('noMoreTask') }}</div>
                    <div class="infinite-more-container-pre" />
                  </div>
                </template>
              </infinite-loading>
            </div>

            <div v-show="tab === 'history'">
              <ProcessTimeLine
                v-if="instance.id"
                :instance-id="instance.id"
              ></ProcessTimeLine>
            </div>
            <div v-show="tab === 'conversation'" style="height: 100%">
              <application-instance-message
                :mobile-mode="false"
                :instance-id="instance.id"
                v-if="instance.id" />
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
import AppDetailCommon from "@/components/common/application/mixins/AppDetail";
import taskRequest from "@/api/task";

export default {
  name: "DetailSider",
  mixins: [AppDetailCommon],
  props: {
    instance: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      task: {},
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
      taskTotalCount: 0
    };
  },
  computed: {
    tabName() {
      let tab = this.tabs.find((tab) => tab.id == this.tab);
      return tab && tab.name;
    }
  },
  async mounted() {
    let filter = this.buildTaskFilter();
    if (!filter.processDefinitionKey) {
      this.taskTotalCount = 0;
      return;
    }
    // 获取关联任务数
    let { count } = await taskRequest.postTaskCount(
      this.tasks.active || !this.process.key ? "" : "history",
      {},
      this.buildTaskFilter()
    );
    this.taskTotalCount = count;
  },
  methods: {
    refresh() {
      this.$forceUpdate();
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
      this.$router.push({
        name: "task-list",
        query: { defaultSearchTaskId: task.id }
      });
    }
  },
  watch: {
    "$i18n.locale": {
      handler(val){
        let self=this;
        self.tabs[0].name=self.$t("basicInfo");
        self.tabs[1].name=self.$t("linkTask");
        self.tabs[2].name=self.$t("processHistory");
        self.tabs[3].name=self.$t("comment");
      },
    },
    tab: {
      async handler() {
        let self = this;
        if (self.tab === "task") {
          // 刷新任务
          await self.refreshTasks(self.tasks.active);
        }
      }
    },
    right:{
      async handler() {
        let self = this;
        if (self.right && self.tab === "task") {
          // 刷新任务
          await self.refreshTasks(self.tasks.active);
        }
      }
    },
    "instance.id": {
      async handler(val) {
        let filter = this.buildTaskFilter();
        if (!filter.processDefinitionKey) {
          this.taskTotalCount = 0;
          return;
        }
        // 获取关联任务数
        let { count } = await taskRequest.postTaskCount(
          this.tasks.active || !this.process.key ? "" : "history",
          {},
          this.buildTaskFilter()
        );
        this.taskTotalCount = count;
        this.refreshTasks(this.tasks.active);
      },
      immediate: true
    }
  },
  components: { TaskItem, ProcessTimeLine, ApplicationInstanceMessage }
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
