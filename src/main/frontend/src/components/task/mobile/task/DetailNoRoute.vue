<template>
  <div style="padding: 0 0 85px 0">
    <v-banner v-model="topBanner.display" single-line transition="slide-y-transition">
      <div class="d-flex flex-row" style="align-items: center">
        <v-icon left color="#5a928d">mdi-check-circle</v-icon>
        {{ $t(topBanner.multi ? "taskCompleteNextTasks" : "taskCompleteNext") }}
      </div>
      <template v-slot:actions="{ dismiss }">
        <v-btn
          text
          color="primary"
          @click="dismiss"
        >
          {{ $t("cancel") }}
        </v-btn>
        <v-btn
          text
          color="primary"
          @click="onTaskNextClick"
        >
          <v-icon>mdi-arrow-right</v-icon>
          {{ $t("goRightNow") }}
        </v-btn>
      </template>
    </v-banner>
    <div
      v-if="delegate.id"
      class="d-flex flex-row alert-bar"
      style="
        position: sticky;
        top: 0px;
        z-index: 3;
        backdrop-filter: blur(10px);
        background-color: #ff00009c;
      "
      :class="{
        invalid: delegate.status === 0,
      }"
    >
      {{ $t("delegateMode") }}
    </div>
    <v-card class="content" outlined>
      <div
        class="form-head"
        style="margin: 15px 10px 0 10px"
        v-if="$store.state.common.currentNavigation === 'form'"
      >
        <div style="color: #312651;font-size: 14px;overflow: hidden;
              text-overflow: ellipsis;
              font-weight: bold;
              white-space: nowrap;">{{ task.name }}
        </div>
        <div style="color: #B1ABB6;font-size: 14px;overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;">{{ task.description }}
        </div>

        <div class="d-flex flex-row props-title-container">
          <div class="d-flex flex-row props-title-icon">
            <i
              :class="instance.icon"
              style="color: #e6e4e6;font-size: 15px;"
              :style="{ color: instance.iconColor }"
            />
          </div>
          <div class="d-flex flex-column" style="flex: 1;width: 0">
            <div class="d-flex flex-row" style="align-items: center;gap: 6px"
                 @click="onClickProcessInstance(instance.id)">
              <div>{{ instance.businessKey }}</div>
              |
              <div @click.stop="onClickProcessDefKey(instance.processDefinitionKey)">
                {{ instance.processDefinitionName }}
              </div>
            </div>
            <div>
              {{ $t("by") }} <b style="color: #312651">{{
                instance.startUserId && instance.startUser
                  ? `${instance.startUser.firstName} ${instance.startUser.lastName}`
                  : "--"
              }}</b> {{ $t("createBy") }}{{ utils.formatDateTime(instance.startTime, "YYYY-MM-DD HH:mm") }}
            </div>
          </div>
        </div>
        <div class="d-flex flex-row props-title-container" style="gap: 10px">
          <div class="d-flex flex-column" style="flex: 1;width: 0;gap: 10px">
            <div class="d-flex flex-row" style="align-items: center;gap: 6px">
              <div class="d-flex flex-row props-title-icon">
                <v-icon color="#83829A" size="18">mdi-tray-arrow-down</v-icon>
              </div>
              <div class="d-flex flex-column" style="flex: 1;width: 0">
                <div class="d-flex flex-row" style="align-items: center;gap: 6px">
                  {{ $t("taskCreatedIn") }}
                </div>
                <div class="props-title-content">
                  {{ task.created || task.startTime ? utils.formatDateTime(task.created || task.startTime, "YYYY-MM-DD HH:mm") : "--:--"
                  }}
                </div>
              </div>
            </div>
            <div class="d-flex flex-row" style="align-items: center;gap: 6px">
              <div class="d-flex flex-row props-title-icon">
                <v-icon color="#83829A" size="18">mdi-stop</v-icon>
              </div>
              <div class="d-flex flex-column" style="flex: 1;width: 0">
                <div class="d-flex flex-row" style="align-items: center;gap: 6px">
                  {{ $t("completedIn") }}
                </div>
                <div class="props-title-content">
                  {{ task.endTime ? utils.formatDateTime(task.endTime, "YYYY-MM-DD HH:mm") : "--:--" }}
                </div>
              </div>
            </div>
          </div>

          <div class="d-flex flex-column" style="flex: 1;width: 0;gap: 10px">
            <div class="d-flex flex-row" style="align-items: center;gap: 6px">
              <div class="d-flex flex-row props-title-icon">
                <v-icon color="#83829A" size="18">mdi-alarm</v-icon>
              </div>
              <div class="d-flex flex-column" style="flex: 1;width: 0">
                <div class="d-flex flex-row" style="align-items: center;gap: 6px">
                  {{ $t("dueDate") }}
                </div>
                <div class="props-title-content">
                  {{ task.due ? utils.formatDateTime(task.due, "YYYY-MM-DD HH:mm") : "--:--" }}
                </div>
              </div>
            </div>
            <div class="d-flex flex-row" style="align-items: center;gap: 6px">
              <div class="d-flex flex-row props-title-icon" style="background-color: #0F40F5">
                <v-icon color="white" size="18">mdi-calendar-multiselect</v-icon>
              </div>
              <div class="d-flex flex-column" style="flex: 1;width: 0">
                <div class="d-flex flex-row" style="align-items: center;gap: 6px"
                     @click="setFollowUp">
                  {{ $t("notifyDate") }}
                  <v-icon small color="#FA4F07">mdi-dots-horizontal</v-icon>
                </div>
                <div class="props-title-content">
                  {{ task.followUp ? utils.formatDateTime(task.followUp, "YYYY-MM-DD HH:mm") : "--:--" }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="computedIsDelegatedTask" class="d-flex flex-row props-title-container">
          <div class="d-flex flex-row props-title-icon" style="background-color: #0F40F5">
            <v-icon color="white" size="18">mdi-account-arrow-right</v-icon>
          </div>
          <div class="d-flex flex-column" style="flex: 1;width: 0">
            <template v-if="task.owner === userId">
              <span>
                {{
                  $t("hasDelegateToWithType", { delegateType: $t(localVariables["bpezDelegateType"] === "0" ? "normal" : "auth") })
                }}
                <b style="font-weight: bold;color: #0F40F5">{{
                    `${task.assigneeName || task.assignee}`
                  }}</b>
              </span>
            </template>
            <template v-else>
              <span>
                {{ $t("by") }}<b style="font-weight: bold;color: #0F40F5">{{
                  `${task.ownerName || task.owner}`
                }}</b
              >{{
                  $t("delegateToMeWithType", { delegateType: $t(localVariables["bpezDelegateType"] === "0" ? "normal" : "auth") })
                }}
              </span>
            </template>
            <div class="props-title-content">
              {{ localVariables["bpezDelegateComments"] }}
            </div>
          </div>

          <v-menu bottom offset-y v-if="task.owner === userId">
            <template #activator="{ on, attrs }">
              <v-icon v-bind="attrs"
                      v-on="on" small color="#FA4F07">mdi-dots-horizontal
              </v-icon>
            </template>

            <v-list
              style="cursor: pointer; padding: 0px 0px"
              class="menu-list"
              dense
            >
              <v-list-item>
                <v-list-item-title @click="onTaskResolveDelegtateClick">
                  <span>{{ $t("backAuth") }}</span>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <div
          class="formioClass"
          style="margin: 10px 0 0 0; padding-bottom: 10px"
        >
          <formio
            v-if="formData"
            ref="formTask"
            id="formTaskDetail"
            class="formioClass"
            :form="formData"
            :options="{
              readOnly: !!task.endTime || (!task.endTime && !task.assignee),
              language: 'zh',
              noAlerts: true,
            }"
            :submission="formValue"
          ></formio>
          <div
            v-else
            class="d-flex flex-row"
            style="
              align-items: center;
              justify-content: center;
              color: #101010;
              font-size: 14px;
              min-height: 50px;
            "
          >
            {{ $t("noFormConfig") }}
            <v-icon color="#83829A" right size="14"
            >mdi-google-downasaur
            </v-icon
            >
          </div>
        </div>
      </div>
      <div
        style="margin: 30px 18px 0 18px"
        v-if="$store.state.common.currentNavigation === 'history'"
      >
        <ProcessTimeLine
          v-if="instance.id"
          :instance-id="instance.id"
        ></ProcessTimeLine>
      </div>

      <div
        style="margin: 30px 18px 0 18px"
        v-if="$store.state.common.currentNavigation === 'comment'"
      >
        <application-instance-message
          v-if="task.id && instance.id"
          :task="task"
          ref="applicationInstanceMessageRef"
          :instance-id="instance.id"
        />
      </div>
    </v-card>
    <task-priority-set-menu
      ref="taskPrioritySetMenuRef"
      @onSetPrioritySuccess="onSetPrioritySuccess"
      v-if="task && task.id"
      :task-id="task.id"
    />
    <task-delegtate-dialog
      ref="taskDelegtateDialogRef"
      @onTaskDelegtateSuccess="onTaskDelegtateSuccess"
      :task-id="task.id"
      v-if="task && task.id"
    />
    <task-resolve-delegtate-dialog
      ref="taskResolveDelegtateDialogRef"
      @onResolveDelegtateTaskSuccess="onTaskDelegtateSuccess"
      :task-id="task.id"
      v-if="task && task.id"
    />
    <task-claim-dialog
      ref="taskClaimDialogDialogRef"
      @onClaimSuccess="onTaskDelegtateSuccess"
      :task-id="task.id"
      :owner-user-id="delegate.ownerUserId"
      v-if="task && task.id"
    />
    <flow-calendar-dialog ref="flowCalendarDialogRef"
                          :mobile-mode="true"
                          @onFollowSuccess="onFollowSuccess" />
  </div>
</template>
<script>
import camundaRequest from "@/api/camunda-service";
import taskRequest from "@/api/task";
import TaskDetailCommon from "@/components/common/task/mixins/detail";
import ApplicationInstanceMessage from "@/components/common/application/ApplicationInstanceMessage";
import TaskItem from "@/components/common/task/TaskItem";
import utils from "@/utils/utils";
import FlowCalendarDialog from "@/components/common/task/FlowCalendarDialog";
import moment from "moment/moment";

export default {
  props: {
    id: {
      type: String
    }
  },
  mixins: [TaskDetailCommon],
  computed: {
    canExecute() {
      let self = this;
      return !self.task.endTime &&
        !(self.computedIsDelegatedTask && self.task.assignee !== self.userId) &&
        self.task.assignee === self.userId &&
        self.$store.state.common.currentNavigation === "form";
    },
    canClaim() {
      let self = this;
      return !self.task.endTime && !self.task.assignee;
    }
  },
  components: { ApplicationInstanceMessage, TaskItem, FlowCalendarDialog },
  data() {
    return {
      appBarIcons: [],
      topBanner: {
        display: false,
        multi: false
      }
    };
  },
  methods: {
    async onTaskNextClick() {
      let self = this;
      if (self.topBanner.multi) {
        // 跳转任务列表
        self.topBanner.display = false;
        self.$emit("routerToTaskList", {
          processInstanceId: self.task.processInstanceId,
          assignee: self.userId
        });
      } else {
        // 跳转其他task
        let tasks = await taskRequest.postTaskList("", {},
          {
            processInstanceId: self.task.processInstanceId,
            assignee: self.userId
          });
        if (tasks.length > 0) {
          self.topBanner.display = false;
          self.task.id = tasks[0].id;
          await self.getData();
        }
      }
    },
    async onCommitSuccess() {
      let self = this;
      // 获取实例任务数目
      let taskCount = await taskRequest.postTaskCount("", {}, {
        processInstanceId: self.task.processInstanceId,
        assignee: self.userId
      });
      taskCount = taskCount.count;
      if (taskCount == "1") {
        // 下个任务 ex:2ae3679b-1f22-11ef-8a1a-00163e176ba4
        self.topBanner.display = true;
        self.topBanner.multi = false;
      } else if (taskCount > 1) {
        // 任务列表
        self.topBanner.display = true;
        self.topBanner.multi = true;
      }
    },
    async onCommitBtnClick() {
      let self = this;
      if ((self.$store.state.common.currentNavigation === "form" &&
          !self.task.endTime &&
          !(self.computedIsDelegatedTask && self.task.assignee !== self.userId) &&
          self.task.assignee === self.userId) ||
        self.task.assignee === self.delegate.ownerUserId
      ) {
        await self.onCommitTask();
      }
      if (
        self.$store.state.common.currentNavigation === "form" &&
        !self.task.endTime &&
        !self.task.assignee
      ) {
        self.onClaimClick();
      }
      if (self.$store.state.common.currentNavigation === "comment") {
        self.$refs.applicationInstanceMessageRef.startSend();
      }
    },
    onFollowSuccess(payload) {
      this.task.followUp = moment(payload.followupDate).format("yyyy-MM-DDTHH:mm:ss.SSSZZ");
    },
    async setFollowUp() {
      // 设置提醒
      let self = this;
      let flowCalendarDialogRef = self.$refs.flowCalendarDialogRef;
      if (flowCalendarDialogRef) {
        flowCalendarDialogRef.show(true, "userTask", {
          originalTaskId: self.task.id,
          originalProcessInstanceId: self.instance.id
        }, self.task.followUp);
      }
    },
    async onTaskDelegtateSuccess() {
      await this.getData();
    },
    async onSetPrioritySuccess(priority) {
      // 刷新优先级
      this.task.priority = priority;
    },

    onClickProcessDefKey(key) {
    },
    onClickProcessInstance(id) {
    },
    buildParam() {
      let now = utils.formatDateTime(new Date(), "x");
      let filter = {
        tenant: this.$store.state.user.tenant,
        //groups: this.groups.map((group) => group.id).toString(),
        delegateToUserId: this.userId,
        startDateTimeBefore: now,
        endDateTimeAfter: now,
        status: 1,
        orderBy: "startDateTime",
        sort: "asc"
      };
      return filter;
    },
    async getData() {
      let id = Number(this.$route.query.delegate || "");
      this.delegate.id = id;
      if (id) {
        let { data } = await camundaRequest.getGranted(this.buildParam());
        let item = data.find((delegate) => delegate.id == id);
        if (item && item.delegateToUserId === this.userId) {
          this.delegate = item;
        } else {
          this.delegate.status = 0;
        }
      }
      await this.$store.dispatch("common/setNavigations", [
        {
          id: "form",
          name: this.$t("form")
        },
        {
          id: "history",
          name: this.$t("history")
        },
        {
          id: "comment",
          name: this.$t("comment")
        }
      ]);
      await this.getTask();
      await this.getForm();
      this.appBarIcons = [];
      if (!this.task.endTime) {
        if (this.formKey) {
          this.appBarIcons.push({
            id: "save",
            icon: "mdi-content-save",
            color: "#444262"
          });
        }
      }
      await this.$store.dispatch(
        "common/setAppBarIcons",
        JSON.parse(JSON.stringify(this.appBarIcons))
      );

      await this.$store.dispatch("common/setAppBarTitle", "");
      await this.$store.dispatch("common/setCurrentNavigation", "form");
    }
  },
  watch: {
    id: {
      async handler(val) {
        this.task.id = val;
        await this.getData();
      },
      immediate: true
    },
    "$store.state.common.currentAppBarIcon": {
      async handler(value) {
        let self = this;
        if (value === "save") {
          this.saveDraft();
        } else if (value === "share") {
          this.onTaskDelegtateClick();
        } else if (value === "association") {
          this.onStartAssociationsClick();
        } else if (value === "priority") {
          this.onSetPriorityClick();
        } else if (value === "more") {
          // 同类任务
          this.similarTask.display = true;
          // this.similarTask.filter.searchVal = "";
        } else if (value === "scan") {
          let str = "";
          self.$copyText(str).then(function(e) {
            self.$notify.success({ title: self.$t("success"), message: self.$t("scanResultHasCopyToClip") });
          }, function(e) {
          });
        }
        await this.$store.dispatch("common/setCurrentAppBarIcon", "");
      }
    },
    "$store.state.common.currentNavigation": {
      async handler(value) {
        let self = this;
        if (value === "form") {
          await this.getForm();
        } else if (value === "history") {
        } else if (value === "comment") {
          if (self.$refs.applicationInstanceMessageRef) {
            self.$refs.applicationInstanceMessageRef.getComments();
          }
        }
      }
    }
  }
};
</script>

<style scoped>
.content.theme--light.v-sheet--outlined {
  background-color: unset;
  color: rgba(16, 16, 16, 1);
  font-size: 14px;
  margin-top: 0px;
  padding: 0;
  border-radius: 0;
  border: unset;
}

.v-list--dense.menu-list .v-list-item {
  height: 50px;
}

.v-list--dense.menu-list .v-list-item:not(:last-child) {
  border-bottom: 1px solid #e6e4e6;
}

.v-list--dense.menu-list .v-list-item .v-list-item__title {
  color: #444262;
  font-size: 14px;
}

.v-list--dense.menu-list .v-list-item .v-list-item__title .v-icon {
  margin-right: 5px;
}

.v-list--dense.menu-list .v-list-item .v-list-item__title.current {
  font-weight: bold;
}

.subtitle {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.drawer-icon {
  cursor: pointer;
  color: #83829a;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.drawer-title {
  text-align: center;
  padding: 10px 0 7px 0;
  color: #ff7754;
  font-size: 14px;
}

.drawer-title-line {
  width: 34px;
  height: 3px;
  background-color: #e6e4e6;
  margin: auto;
}

.dashed {
  border-bottom: 1px #bbbbbb dashed;
  margin: 14px 0;
}

.v-navigation-drawer--absolute {
  position: fixed;
  height: auto !important;
}

.form-head :not(/deep/ .formioClass *){
  color: #b1abb6;
  font-size: 14px;
}

.comment .name {
  font-size: 14px;
  color: #312651;
  margin-right: 17px;
}

.comment .date {
  color: #83829a;
  font-size: 14px;
}

.comment .comment-text {
  margin: 8px 28px 17px 28px;
  color: #312651;
  font-size: 14px;
  background-color: #f3f4f9;
  border-radius: 6px;
  background-color: rgba(243, 244, 249, 1);
  padding: 10px 15px;
}

.comment .comment-text .tag {
  color: #0f40f5;
  font-size: 14px;
  cursor: pointer;
}

.comment.current .comment-text {
  color: #ffffff;
  background-color: #101010;
}

.comment.current .comment-text .tag {
  color: #fcca00;
}

div.v-textarea.v-text-field--enclosed.v-text-field--outlined:not(
    .v-input--dense
  ):deep(.v-text-field__slot)
textarea {
  margin-top: 0;
}

.v-text-field--outlined:deep(fieldset) {
  border-color: #e6e4e6;
}

/*div.theme--light.v-input.v-textarea.v-textarea.v-text-field--enclosed.v-text-field--outlined {*/
/*  !* border: 1px solid#E6E4E6; *!*/
/*  background-color: #f3f4f9;*/
/*  margin: 14px 0 0 0;*/
/*  padding: 0;*/
/*}*/

.send-title {
  color: rgba(68, 66, 98, 1);
  font-size: 18px;
}

.send-topic {
  color: rgb(15, 64, 245);
  font-size: 14px;
  margin: 8px 0 16px;
}

.alert-bar {
  height: 40px;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #ffffff;
  background-color: #ff7754;
}

.alert-bar.invalid {
  background-color: #f50057;
}

.props-title-icon {
  background-color: #E6E4E6;
  height: 30px;
  width: 30px;
  justify-content: center;
  border-radius: 5px;
  align-items: center;
}

.props-title-container {
  align-items: center;
  font-size: 12px;
  color: #83829A;
  padding: 13px;
  gap: 6px;
  border-radius: 5px;
  background-color: white;
  margin-top: 10px;
  margin-bottom: 10px;
}

.props-title-content {
  color: #312651;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
