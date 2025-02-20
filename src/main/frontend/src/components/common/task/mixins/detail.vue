<template>
  <div></div>
</template>

<script>
import taskRequest from "@/api/task";
import instanceRequest from "@/api/instance";
import groupRequest from "@/api/group";
import processRequest from "@/api/process";
import userRequest from "@/api/user";
import formRequest from "@/api/form";
import utils from "@/utils/utils";
import { Form,Utils } from "vue-formio-eorion";

import ProcessTimeLine from "@/components/common/ProcessTimeLine";
import InfiniteLoading from "vue-infinite-loading";
import ApplicationAssociations from "@/components/common/application/ApplicationAssociations";
import TaskPrioritySetMenu from "@/components/common/task/TaskPrioritySetMenu";
import TaskDelegtateDialog from "@/components/common/task/TaskDelegtateDialog";
import TaskResolveDelegtateDialog from "@/components/common/task/TaskResolveDelegtateDialog";
import TaskClaimDialog from "@/components/common/task/TaskClaimDialog";
import { formatVariables, buildDraft,filterFormKey } from "@/utils/common";
import camundaService from "@/api/camunda-service";

export default {
  name: "TaskDetailCommon",
  // eslint-disable-next-line vue/no-unused-components
  components: {
    formio: Form,
    ProcessTimeLine,
    InfiniteLoading,
    ApplicationAssociations,
    TaskPrioritySetMenu,
    TaskDelegtateDialog,
    TaskResolveDelegtateDialog,
    TaskClaimDialog,
  },
  data() {
    return {
      utils,
      delegate: {},
      draft: {},
      task: {},
      instance: {},
      process: {},
      userId: this.$store.state.user.profile.id,
      userName: this.$store.getters["user/getUserName"],
      formKey: "",
      form: {},
      formValue: {},
      fieldsValue: {},
      formData: null,
      localVariables: {},
      originTaskVariables:[],
    };
  },
  methods: {
    async onCommitTask() {
      try {
        let data = this.formValue.data;
        if (this.formData) {
          let formData = await this.$refs.formTask.formio.submit();
          data = formData.data;
        }
        let keyName = "formKey-" + this.task.id;
        data[keyName] = this.formKey;

        let allProps=[];
        Utils.eachComponent(this.formData.components,(component,path)=>{
          if (component.type!=="fileDownload"){
            allProps.push(path);
          }
        });
        // 忽略字段
        allProps.push(...["formUserId","formUserName","tenant","tenantName","bpez_locationType","bpez_formattedAddress","bpez_location"],keyName);
        filterFormKey(allProps,data,null);
        const queryData = {
          variables: formatVariables(data),
        };
        if (this.delegate.delegateToUserId === this.userId) {
          await taskRequest.postDelegateTask(this.task.id, {
            userId: this.userId,
          });
        }

        if (
          this.computedIsDelegatedTask &&
          this.localVariables["bpezDelegateType"] === "0"
        ) {
          // 普通转办提交
          await taskRequest.postResolveTask(this.task.id, queryData);
        } else {
          await taskRequest.completeTask(this.task.id, queryData);
        }
        if (this.draft.id) {
          await camundaService.deleteDraft(this.draft.id);
        }
        await this.onTaskDelegtateSuccess();
        if (this.onCommitSuccess){
          await this.onCommitSuccess();
        } else {
          this.$notify.success({ title: this.$t("success"), message: this.$t("exeTaskSuccess") });
        }
      } catch (err) {
        if (err instanceof Array) {
          this.$notify.error(this.$t("exeTaskErrWithAllRequired"));
        } else {
          this.$notify.error(err.toString());
        }
      }
    },
    onAssociationItemClick(association) {
      let self = this;
      self.$router.push({
        name: "application-create",
        params: { key: association.key },
        query: { instanceId: self.instance.id, taskId: self.task.id },
      });
    },
    onClaimClick() {
      let self = this;
      let taskClaimDialogDialogRef = self.$refs.taskClaimDialogDialogRef;
      if (taskClaimDialogDialogRef) {
        taskClaimDialogDialogRef.show(true);
      }
    },
    onStartAssociationsClick() {
      let self = this;
      let associationsRef = self.$refs.associationsDialogRef;
      if (associationsRef) {
        associationsRef.show(true);
      }
    },
    onTaskResolveDelegtateClick() {
      let self = this;
      let taskResolveDelegtateDialogRef =
        self.$refs.taskResolveDelegtateDialogRef;
      if (taskResolveDelegtateDialogRef) {
        taskResolveDelegtateDialogRef.show(true);
      }
    },
    onTaskDelegtateClick() {
      let self = this;
      let taskDelegtateDialogRef = self.$refs.taskDelegtateDialogRef;
      if (taskDelegtateDialogRef) {
        taskDelegtateDialogRef.show(true);
      }
    },
    onSetPriorityClick() {
      let self = this;
      let taskPrioritySetMenuRef = self.$refs.taskPrioritySetMenuRef;
      if (taskPrioritySetMenuRef) {
        if (this.idBreadcrumbs) {
          // pc
          taskPrioritySetMenuRef.show(true, {
            x: self.screenWidth - 300,
            y: 150,
          });
        } else {
          // mobile
          taskPrioritySetMenuRef.show(true, {
            x: self.screenWidth - 20,
            y: 50,
          });
        }
      }
    },
    judgePriority(priority) {
      if (priority === 99) {
        return {
          text: this.$t("topCard"),
          color: "color: #673ab7",
          icon: "mdi-ticket",
          iconColor: "#0F40F5",
        };
      } else if (priority > 60) {
        return {
          text: this.$t("top"),
          color: "color: #e91e63",
          icon: "mdi-flag",
          iconColor: "#FA4F07",
        };
      } else if (priority > 30) {
        return {
          text: this.$t("medium"),
          color: "color: #ff9800",
          icon: "mdi-flag-outline",
          iconColor: "#FA4F07",
        };
      } else {
        return {
          text: this.$t("low"),
          color: "color: #009688",
          icon: "mdi-flag-outline",
          iconColor: "#0F40F5",
        };
      }
    },
    async getTask() {
      await this.$store.dispatch("common/setPageLoading", true);
      let taskId = this.task.id;
      let tasks = await taskRequest.getTasks("history", { taskId });

      let task = tasks[0];

      let details;
      this.fieldsValue = {};
      if (task.endTime) {
        details = await instanceRequest.getHistoryDetail({
          activityInstanceId: task.activityInstanceId,
        });
      } else {
        details = await instanceRequest.getVariableInstanceList({
          processInstanceIdIn: task.processInstanceId,
        });
        task = await taskRequest.getTaskById(taskId);
        this.formKey = task.formKey;
      }
      this.localVariables = {};
      let currentActivityInstanceId = null;
      let historyJobTasks = await instanceRequest.getHistoryJobTasks({
        taskId: this.task.id,
      });
      if (historyJobTasks) {
        currentActivityInstanceId = historyJobTasks[0].activityInstanceId;
      }
      await this.getDraft();
      let formDraft = this.draft.formDraft || {};
      Object.keys(formDraft).forEach((name) => {
        this.fieldsValue[name] = formDraft[name];
      });

      this.fieldsValue.formUserId = this.userId;
      this.fieldsValue.formUserName = this.userName;
      this.fieldsValue.tenant = this.$store.state.user.tenant;
      this.fieldsValue.tenantName = this.$store.state.user.tenantName;

      details.forEach((detail) => {
        let name = detail.variableName || detail.name;
        // 暂时取instance的变量数据
        if (
          ["bpezTaskCenterJumpFrom", "bpezTaskCenterJumpType"].includes(
            detail.name
          )
        ) {
          this.localVariables[detail.name] = detail.value;
        }
        if (detail.activityInstanceId === currentActivityInstanceId) {
          this.localVariables[detail.name] = detail.value;
        }
        this.fieldsValue[name] = detail.value;
        if (detail.type==="File"){
          this.fieldsValue[name] = Object.assign(detail.valueInfo,{id:detail.id});
        }
        if (detail.variableName == "formKey-" + task.id) {
          this.formKey = detail.value;
        }
      });
      this.originTaskVariables=details;
      if (task.assignee) {
        const users = await groupRequest.getUser({
          idIn: task.assignee,
        });
        task.assigneeName = `${users[0].firstName} ${users[0].lastName}`;
      }
      if (task.owner) {
        const users = await groupRequest.getUser({
          idIn: task.owner,
        });
        task.ownerName = `${users[0].firstName} ${users[0].lastName}`;
      }
      if (this.comment && this.comment.item) {
        this.comment.item.taskId = task.id;
        this.comment.item.taskName = task.name;
      }
      this.task = task;
      let instance = await instanceRequest.getInstance(
        this.task.processInstanceId
      );
      let processDefKeyIn = [instance.processDefinitionKey];
      // 获取流程对应icon
      let iconResults = await processRequest.getProcessIconByKeys(
        this.$store.getters["user/getTenant"].id,
        processDefKeyIn
      );
      let iconResult = iconResults.find(
        (iconResult) => iconResult.appKey === instance.processDefinitionKey
      );
      let icon = { color: "#444262" };
      if (iconResult && iconResult.configJson) {
        icon.icon = `${iconResult.configJson.iconType} fa-fw ${iconResult.configJson.icon}`;
      }
      instance.icon = icon.icon;
      let canStart = await processRequest.validateCanUserStart(
        instance.processDefinitionKey,
        this.userId
      );
      instance.currentUserStart = canStart;
      let isStart = await processRequest.validateInstanceIsUserStart(
        instance.id,
        this.userId
      );
      instance.currentUserCreate = isStart;
      instance.iconColor = canStart ? "#3d5afe" : "#83829A";
      if (instance.startUserId) {
        instance.startUser = await userRequest.getProfile(instance.startUserId);
      }
      this.instance = instance;

      let process = await processRequest.getProcess(
        this.instance.processDefinitionId
      );
      this.process = process;
      await this.$store.dispatch("common/setPageLoading", false);
    },

    buildDraftParam() {
      return {
        tenant: this.$store.state.user.tenant,
        userId: this.userId,
        resourceType: 2,
        taskInstanceId: this.task.id,
        type: 1,
      };
    },
    async getDraft() {
      let response = await camundaService.getDrafts({}, this.buildDraftParam());
      this.draft = response.data[0] || {};
    },
    async saveDraft() {
      let draft = this.buildDraftParam();
      draft.id = this.draft.id;
      let data = JSON.parse(JSON.stringify(this.formValue.data));
      let components = JSON.parse(JSON.stringify(this.formData.components));
      draft.formDraft = buildDraft(data, components);
      draft.taskDefinitionKey = this.task.taskDefinitionKey;
      draft.taskDefinitionName = this.task.name;

      if (draft.id) {
        await camundaService.putDraft(draft);
      } else {
        await camundaService.postDraft(draft);
      }
      await this.getDraft();
      this.$notify.success({title:this.$t("success"),message:this.$t("saveDraftSuccess")});
    },
    async getForm() {
      this.formData = null;
      if (this.formKey) {
        try {
          let response = await formRequest.getFormDetail(this.formKey);
          var formData = {
            components: response.formData,
          };
          this.fieldsValue.formUserId = this.userId;
          this.fieldsValue.formUserName = this.userName;
          this.fieldsValue.tenant = this.$store.state.user.tenant;
          this.fieldsValue.tenantName = this.$store.state.user.tenantName;
          this.formValue = { data: this.fieldsValue };
          this.formData = formData;
        } catch (e) {}
      }
    },
  },
  computed: {
    computedIsDelegatedTask() {
      return (
        this.task &&
        this.task.delegationState &&
        this.task.delegationState !== "RESOLVED"
      );
    },
    screenWidth() {
      let self = this;
      return document.body.clientWidth;
    },
  },
};
</script>

<style scoped></style>
