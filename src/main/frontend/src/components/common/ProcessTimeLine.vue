<template>
  <v-timeline
    align-top
    dense
    v-show="instance.id"
    style="margin-left: -10px; margin-right: 23px"
    class="timeline"
  >
    <v-timeline-item icon="mdi-play" icon-color="#312651" color="#ffffff" small>
      <div class="timeLineList">
        <div>
          <div class="timeLineTitle">{{ $t("startExe") }}</div>
          <div class="timeLineUser">
            {{ instance.startUserId || "" }}
          </div>
        </div>
        <span class="timeLineDate">
          {{ utils.formatDateTime(instance.startTime, "YYYY-MM-DD HH:mm") }}
        </span>
      </div>
    </v-timeline-item>
    <template v-for="(item, index) in historyData">
      <v-timeline-item
        :key="index"
        icon="mdi-stop-circle"
        icon-color="#2EB372"
        color="#ffffff"
        small
        v-if="item.state"
      >
        <div class="timeLineList">
          <div>
            <div class="timeLineTitle">
              {{ item.name }}
            </div>
            <div class="timeLineUser" v-if="item.endTime">
              {{ item.assignee || "" }}
            </div>
          </div>
          <span class="timeLineDate">
            <v-icon v-show="item.endTime" size="12">
              mdi-clock-time-three</v-icon
            >
            {{ utils.formatDateTime(item.endTime, "YYYY-MM-DD HH:mm") }}
          </span>
        </div>
      </v-timeline-item>
      <v-timeline-item
        :key="index"
        :icon="item.endTime ? 'mdi-play' : 'mdi-record-circle-outline'"
        icon-color="#2EB372"
        color="#ffffff"
        small
        v-else
      >
        <div class="timeLineList">
          <div>
            <div class="timeLineTitle">
              {{ item.name || $t("noTaskName") }}
              <v-menu bottom offset-y>
                <template #activator="{ on, attrs }">
                  <v-icon
                    class="copyIcon"
                    v-show="item.taskDefinitionKey&&canReject&&item.id!==task.id"
                    style="cursor: pointer"
                    color="#FF7754"
                    v-bind="attrs"
                    v-on="on"
                    size="14"
                  >
                    mdi-dots-vertical
                  </v-icon>
                </template>
                <v-list
                  style="border-radius: 6px;border: 1px solid rgba(177, 171, 182, 1);padding: 0"
                  width="150">
                  <v-list-item @click="rejectToTask(item,false)" style="border-bottom: 1px solid rgba(177, 171, 182, 1)">
                    <v-list-item-content>
                      <div class="d-flex flex-row" style="align-items: center;font-size: 13px;color: #595172">
                        {{ $t("rejectTo") }}
                      </div>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="rejectToTask(item,true)">
                    <v-list-item-content>
                      <div class="d-flex flex-row" style="align-items: center;font-size: 13px;color: #595172">
                        {{ `${$t("rejectTo")}-${$t("rejectToMultiSuffix")}` }}
                      </div>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
            <div class="timeLineUser" v-if="item.endTime">
              {{ item.assignee || "" }}
            </div>
          </div>
          <span class="timeLineDate">
            <v-icon v-show="item.endTime" size="12" style="margin-bottom:2px">
              mdi-timeline-clock-outline</v-icon
            >
            {{ utils.formatDateTime(item.endTime, "YYYY-MM-DD HH:mm") }}
          </span>
        </div>
        <div v-for="showVariable in item.showVariables" :key="`${item.id}-${showVariable.name}`">
          <template v-if="showVariable.name==='coreaction'">
            <div v-if="item.coreaction">
              <v-btn
                color="#444262"
                small
                style="margin-top: 5px; font-size: 13px"
                elevation="0"
              >
                <v-icon color="white" dense left>mdi-alert-circle</v-icon>
                <span style="color: #ffffff">{{ item.coreaction }}</span>
              </v-btn>
            </div>
          </template>
          <template v-else-if="showVariable.name==='corevalue'">
            <div v-if="item.corevalue">
              <v-btn
                color="#FF7754"
                small
                style="margin-top: 5px; font-size: 13px"
                elevation="0"
              >
                <v-icon color="white" dense left>mdi-calculator</v-icon>
                <span style="color: #ffffff">{{ item.corevalue }}</span>
              </v-btn>
            </div>
          </template>
          <template v-else-if="showVariable.name==='corecomments'">
            <div v-if="item.corecomments">
              <v-textarea
                style="color: #83829a; margin-top: 5px"
                readonly
                auto-grow
                filled
                color="#83829A"
                :value="item.corecomments"
              ></v-textarea>
            </div>
          </template>
          <template v-else>
            <div style="color: #162b4d; font-size: 14px;margin-top: 5px">
              <div class="timeLineUser" style="font-weight: bold">
                {{ showVariable.label }}
              </div>
              <span class="timeLineTitle">
                        {{ utils.formatVariableWithType(showVariable.type, item[`${showVariable.name}`]) }}
              </span>
            </div>
          </template>
        </div>
      </v-timeline-item>
    </template>
    <v-dialog v-model="rejectDialog.display" width="350">
      <v-card style="padding-top: 15px">
        <v-card-text style="padding-bottom: 10px">
          {{ $t("rejectTaskConfirmWithName", { name: rejectDialog.toTask && rejectDialog.toTask.name ? rejectDialog.toTask.name : $t("noTaskName") })
          }}
        </v-card-text>
        <v-card-actions style="padding-bottom: 15px">
          <v-spacer />
          <v-btn text @click="rejectDialog.display=false">
            {{ $t("cancel") }}
          </v-btn>
          <v-btn
            class="white--text"
            color="#FF7754"
            :loading="rejectDialog.commitLoading"
            @click="rejectToTaskCommit">
            {{ $t("confirm") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-timeline>
</template>
<script>
import groupRequest from "@/api/group";
import utils from "@/utils/utils";
import instanceRequest from "@/api/instance";
import taskRequest from "@/api/task";

export default {
  name: "ProcessTimeLine",
  data() {
    return {
      utils,
      historyData: [],
      instance: {},
      rejectDialog: {
        display: false,
        toTask: null,
        commitLoading: false,
        isMultiInstance: false,
      }
    };
  },
  props: {
    instanceId: {
      type: String,
      required: true
    },
    task: {
      type: Object
    },
    canReject: {
      type: Boolean,
      default: () => false
    }
  },
  mounted() {
    this.refreshData();
  },
  methods: {
    rejectToTask(task,multi) {
      // multi=>退回至，会签
      let self = this;
      self.rejectDialog.toTask = task;
      self.rejectDialog.display = true;
      self.rejectDialog.isMultiInstance = !!multi;
    },
    rejectToTaskCommit() {
      let self = this;
      self.rejectDialog.commitLoading = true;
      instanceRequest.postExecuteModification({
        processDefinitionId: self.instance.processDefinitionId,
        processInstanceIds: [self.instanceId],
        instructions: [
          { type: "cancel", activityId: self.task.taskDefinitionKey,cancelCurrentActiveActivityInstances:true },
          { type: "startBeforeActivity", activityId: `${self.rejectDialog.toTask.taskDefinitionKey}${self.rejectDialog.isMultiInstance?"#multiInstanceBody":""}` }
        ]
      }).then(() => {
        self.$notify.success(self.$t("rejectTaskSuccess"));
        self.rejectDialog.display = false;
        // 刷新页面
        self.$emit("onRejectTask");
      })
        .catch(err => {
          if (err.response&&err.response.data&&err.response.data.message){
            self.$message.error(`${self.$t("rejectTaskFail")}:${err.response.data.message}`);
          }else {
            self.$message.error(`${self.$t("rejectTaskFail")}`);
          }
        })
        .finally(() => {
          self.rejectDialog.commitLoading = false;
        });
    },
    async refreshData() {
      let id = this.instanceId;
      // 获取实例历史
      if (!id) {
        return;
      }
      const instance = await instanceRequest.getInstance(id);
      const variables = await instanceRequest.getHistoryDetail({
        processInstanceId: id,
        initial: true
      });

      let variable = await variables.find(
        (variable) => variable.variableName === "startUserId"
      );
      if (variable) {
        const user = await groupRequest.getUser({ id: variable.value });
        instance.startUserId = `${user[0].lastName} ${user[0].firstName}`;
      }
      this.instance = instance;

      var queryParams = {
        processInstanceId: this.instance.id,
        sortBy: "startTime",
        sortOrder: "asc"
      };
      const taskList = await instanceRequest.getHistoryTasks(queryParams);

      let taskDefinitionKeyIn = [];
      taskList.forEach(task => {
        if (task.taskDefinitionKey) {
          if (!taskDefinitionKeyIn.includes(task.taskDefinitionKey)) {
            taskDefinitionKeyIn.push(task.taskDefinitionKey);
          }
        }
      });
      let showVariableResults = await taskRequest.getTaskShowVariablesByKeys(this.$store.getters["user/getTenant"].id, taskDefinitionKeyIn);
      taskList.forEach(task => {
        if (task.taskDefinitionKey) {
          let showVariables = [
            { name: "coreaction", label: "", type: "String" },
            { name: "corevalue", label: "", type: "String" },
            { name: "corecomments", label: "", type: "String" }];
          let instance = showVariableResults.find(instance => instance.appKey === task.taskDefinitionKey);
          if (instance) {
            showVariables = showVariables.concat(instance.configJson.variables);
          }
          task.showVariables = showVariables;
        }
      });
      //查询variables
      const detailList = await instanceRequest.getHistoryDetail({
        processInstanceId: this.instance.id
      });
      let userIds = [];
      taskList.forEach((historyTask) => {
        if (historyTask.assignee) {
          if (!userIds.includes(historyTask.assignee)) {
            userIds.push(historyTask.assignee);
          }
        }
        detailList.forEach((historyDetail) => {
          // 属于该任务的变量
          if (historyTask.activityInstanceId === historyDetail.activityInstanceId) {
            // 要显示的变量
            if (historyTask.showVariables.map(showVariable => showVariable.name).includes(historyDetail.variableName)) {
              historyTask[`${historyDetail.variableName}`] = historyDetail.value;
            }
          }
        });
      });
      const users = await groupRequest.getUser({
        idIn: userIds.join(",")
      });
      taskList.forEach((item) => {
        if (item.assignee) {
          let user = users.find((user) => item.assignee === user.id);
          if (user) {
            item.assignee = `${user.firstName} ${user.lastName}`;
          }
        }
      });

      this.historyData = taskList;
      if (instance.state === "COMPLETED") {
        this.historyData.push({
          name: this.$t("processEnd"),
          endTime: instance.endTime,
          state: instance.state
        });
      }
    }
  },
  watch: {
    instanceId: {
      async handler() {
        await this.refreshData();
      }
    }
  }
};
</script>
<style scoped>
.copyIcon {
  opacity: 0;
}

.copyIcon:hover {
  opacity: 1;
}

.timeLineList:hover .copyIcon {
  opacity: 1;
}

.timeLineList {
  display: flex;
  font-size: 0.875rem;
  color: #101010;
}

.timeLineList > div {
  flex: 1;
}

.timeLineTitle {
  font-weight: bold;
  color: rgb(16, 16, 16);
  font-size: 14px;
}

.timeLineUser {
  color: rgb(131, 130, 154);
  font-size: 12px;
}

.timeLineDate {
  color: rgb(131, 130, 154);
  font-size: 12px;
  font-weight: normal;
}

.v-timeline.timeline {
  margin-top: 25px;
  padding-top: 0;
}

.timeline .v-timeline-item.theme--light:last-child {
  padding-bottom: 0;
}
</style>
