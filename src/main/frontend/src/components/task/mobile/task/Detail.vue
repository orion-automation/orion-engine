<template>
  <div style="padding: 0 0 85px 0">
    <v-banner v-model="topBanner.display" transition="slide-y-transition">
      <div class="d-flex flex-row" style="align-items: center">
        <v-icon left color="#5a928d">mdi-check-circle</v-icon>
        {{ $t(topBanner.multi ? "taskCompleteNextNew" : "taskCompleteNextNew") }}
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
      {{ $t('delegateMode') }}
    </div>
    <v-card class="content" outlined>
      <div
        class="form-head"
        style="margin: 15px 10px 0 10px"
        v-if="$store.state.common.currentNavigation === 'form'"
      >
        <div class="d-flex flex-column props-title-container" style="padding-left: 0;padding-right: 0;gap: 0">
          <div style="color: #312651;font-size: 14px;overflow: hidden;
              text-overflow: ellipsis;
              font-weight: bold;
              width: 100%;
              padding-left: 13px;
              padding-right: 13px;
              white-space: nowrap;">{{ task.name }}
          </div>
          <div style="color: #B1ABB6;font-size: 14px;overflow: hidden;
              text-overflow: ellipsis;
              width: 100%;
              padding-left: 13px;
              padding-right: 13px;
              white-space: nowrap;">{{ task.description }}
          </div>
          <div style="width: 100%;background-color: #E6E4E6;height: 1px;margin-top: 12px;margin-bottom: 12px"></div>
          <div class="d-flex flex-row" style="width: 100%;align-items: center;
  font-size: 12px;
  color: #83829A;
  padding-left: 13px;
              padding-right: 13px;
  gap: 6px;">
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
                {{ $t('by') }} <b style="color: #312651">{{
                  instance.startUserId && instance.startUser
                    ? `${instance.startUser.firstName} ${instance.startUser.lastName}`
                    : "--"
                }}</b> {{ $t('createBy') }}{{ utils.formatDateTime(instance.startTime, "YYYY-MM-DD HH:mm") }}
              </div>
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
                  {{ $t('taskCreatedIn') }}
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
                  {{ $t('completedIn') }}
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
                  {{ $t('dueDate') }}
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
                  {{ $t('notifyDate') }}
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
                $t('hasDelegateToWithType',{delegateType:$t(localVariables["bpezDelegateType"] === "0" ?'normal':'auth')})
                }}
                <b style="font-weight: bold;color: #0F40F5">{{
                    `${task.assigneeName || task.assignee}`
                  }}</b>
              </span>
            </template>
            <template v-else>
              <span>
                {{ $t('by') }}<b style="font-weight: bold;color: #0F40F5">{{
                  `${task.ownerName || task.owner}`
                }}</b
              >{{
                  $t('delegateToMeWithType',{delegateType:$t(localVariables["bpezDelegateType"] === "0" ?'normal':'auth')})
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
                  <span>{{ $t('backAuth') }}</span>
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
            {{ $t('noFormConfig') }}
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
    <v-btn
      v-if="
        ($store.state.common.currentNavigation === 'form' &&
          !task.endTime &&
          !(computedIsDelegatedTask && task.assignee !== userId) &&
          task.assignee === userId) ||
        task.assignee === delegate.ownerUserId
      "
      @click="onCommitTask"
      style="background-color: #0f40f5; width: 50px; height: 50px; bottom: 80px"
      color="#FFFFFF"
      text
      raised
      rounded
      fab
      elevation="6"
      large
      fixed
      right
    >
      <v-icon>mdi-send</v-icon>
    </v-btn>
    <v-btn
      v-if="
        $store.state.common.currentNavigation === 'form' &&
        !task.endTime &&
        !task.assignee
      "
      @click="onClaimClick"
      style="background-color: #0f40f5; width: 50px; height: 50px; bottom: 80px"
      color="#FFFFFF"
      text
      raised
      rounded
      fab
      elevation="6"
      large
      fixed
      right
    >
      <v-icon>mdi-tray-arrow-down</v-icon>
    </v-btn>

    <v-btn
      v-if="$store.state.common.currentNavigation === 'comment'"
      key="comment"
      @click="$refs.applicationInstanceMessageRef.startSend()"
      style="
        background-color: #101010;
        width: 50px;
        height: 50px;
        bottom: 80px;
        position: fixed;
      "
      color="#FFFFFF"
      text
      raised
      rounded
      fab
      elevation="6"
      large
      fixed
      right
    >
      <v-icon>mdi-message-text</v-icon>
    </v-btn>
    <v-bottom-sheet v-model="similarTask.display" inset>
      <v-sheet>
        <div class="drawer-title">{{ $t('similarTask') }}</div>
        <div class="drawer-title-line" style="margin-bottom: 24px"></div>
        <v-text-field
          outlined
          :placeholder="$t('inputKeySearchTask')"
          style="margin: 10px 15px"
          @input="onSearchSimilarTask"
          v-model="similarTask.filter.searchVal"
          dense
          hide-details
        ></v-text-field>
        <div style="height: 60vh; overflow-y: auto">
          <v-list three-line>
            <task-item
              v-for="item in similarTask.items"
              :key="item.id"
              @onItemClick="onClickTaskId"
              :task="item"
            />
          </v-list>
          <infinite-loading
            @infinite="getSimilarTask"
            :identifier="similarTask.infiniteId"
          >
            <template #no-more>
              <div class="d-flex flex-row infinite-more-container">
                <div class="infinite-more-container-pre" />
                <div class="infinite-more-container-content">
                  {{ $t('noMoreTask') }}
                </div>
                <div class="infinite-more-container-pre" />
              </div>
            </template>
          </infinite-loading>
        </div>
      </v-sheet>
    </v-bottom-sheet>

    <application-associations
      v-if="process.id"
      ref="associationsDialogRef"
      :title="$t('startLinKApp')"
      :current-app="process"
      @onItemClick="onAssociationItemClick"
      :process-deployment-id="process.deploymentId"
      :process-def-key="process.key"
    />
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
import TaskDetailCommon from "@/components/common/task/mixins/detail";
import similarTask from "@/components/common/task/mixins/similarTask";
import ApplicationInstanceMessage from "@/components/common/application/ApplicationInstanceMessage";
import TaskItem from "@/components/common/task/TaskItem";
import utils from "@/utils/utils";
import FlowCalendarDialog from "@/components/common/task/FlowCalendarDialog";
import moment from "moment/moment";
import { isWeChat, isWorkWeChat } from "@/utils/common";
import taskRequest from "@/api/task";

export default {
  mixins: [TaskDetailCommon, similarTask],
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
    async onTaskNextClick() {
      let self = this;
      if (self.topBanner.multi||true) {
        // 跳转任务列表
        self.topBanner.display = false;
        self.$router.replace({
          name:"task-list",
          query: {
            processInstanceId: self.task.processInstanceId,
            assignee: self.userId
          }
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
          self.$router.replace({
            name:"task-detail",
            params: { id: tasks[0].id }
          });
        }
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
    onTaskDelegtateSuccess() {
      this.getData();
    },
    onAssociationItemClick(association) {
      this.$router.push({
        name: "application-create",
        params: { key: association.key },
        query: { instanceId: this.instance.id, taskId: this.task.id }
      });
    },
    async onSetPrioritySuccess(priority) {
      this.task.priority = priority;
      let index = this.appBarIcons.findIndex((icon) => icon.id === "priority");
      if (index > -1) {
        this.appBarIcons[index] = {
          id: "priority",
          icon: this.judgePriority(this.task.priority).icon,
          color: this.judgePriority(this.task.priority).iconColor
        };
      }
      await this.$store.dispatch(
        "common/setAppBarIcons",
        JSON.parse(JSON.stringify(this.appBarIcons))
      );
    },

    onClickTaskId(item) {
      this.similarTask.display = false;
      this.$router.push({ name: "task-detail", params: { id: item.id } });
    },
    onClickProcessDefKey(key) {
      if (this.instance.currentUserStart) {
        this.$router.push({
          name: "application-detail",
          params: { key: key }
        });
      } else {
        this.$notify.error(this.$t("noAuthViewProcessApp"));
      }
    },
    onClickProcessInstance(id) {
      if (this.instance.currentUserCreate) {
        this.$router.push({
          name: "application-instance",
          params: { id: id }
        });
      } else {
        this.$notify.error(this.$t("noAuthViewProcess"));
      }
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
      await this.$store.dispatch("common/setCurrentNavigation", "");
      await this.$store.dispatch("common/setCurrentAppBarIcon", "");
      this.task.id = this.$route.params.id;
      await this.getTask();
      this.appBarIcons = [
        {
          id: "association",
          icon: "mdi-all-inclusive-box",
          color: "#F50057"
        },
        {
          id: "more",
          icon: "mdi-source-merge",
          color: "#FF7754"
        }
      ];
      if (!this.task.endTime) {
        this.appBarIcons.push({
          id: "priority",
          icon: this.judgePriority(this.task.priority).icon,
          color: this.judgePriority(this.task.priority).iconColor
        });
        if (this.formKey) {
          this.appBarIcons.push({
            id: "save",
            icon: "mdi-content-save",
            color: "#444262"
          });
        }
      }
      if (!this.task.endTime && !this.computedIsDelegatedTask) {
        // 未结束且未转办
        this.appBarIcons = [
          {
            id: "share",
            icon: "mdi-share-all",
            color: "#0F40F5"
          }
        ].concat(this.appBarIcons);
      }

      if (isWeChat()||isWorkWeChat()){
        this.appBarIcons = [
          {
            id: "scan",
            icon: "mdi-line-scan",
            color: "#444262",
          }
        ].concat(this.appBarIcons);
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
    $route: {
      async handler() {
        await this.getData();
      },
      immediate: true
    },
    "$store.state.common.currentAppBarIcon": {
      async handler(value) {
        let self=this;
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
        }else if (value === "scan") {
          let str="";
          self.$copyText(str).then(function (e) {
            self.$notify.success({ title: self.$t("success"), message: self.$t("scanResultHasCopyToClip") });
          }, function (e) {
          });
        }
        await this.$store.dispatch("common/setCurrentAppBarIcon", "");
      }
    },
    "$store.state.common.currentNavigation": {
      async handler(value) {
        let self=this;
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

.form-head :not(/deep/ .formioClass *) {
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
