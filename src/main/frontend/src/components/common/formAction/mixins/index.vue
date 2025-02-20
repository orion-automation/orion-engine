<template>
  <div />
</template>

<script>
import processRequest from "@/api/process";
import formRequest from "@/api/form";
import utils from "@/utils/utils";
import { Form, Utils, Utils as FormioUtils } from "vue-formio-eorion";
import { formatVariables } from "@/utils/common";
import taskRequest from "@/api/task";

export default {
  name: "FormActionCommon",
  props: {
    action: {
      type: Object,
    },
  },
  components: { formio: Form },
  data() {
    return {
      formData: null,
      formValue: {},
      fieldsValue: {},
      process: {},
      setting: {
        display: false,
        commitLoading: false,
      },
      userId: this.$store.state.user.profile.id,
      userName: this.$store.getters["user/getUserName"],
      tenantId: this.$store.getters["user/getTenant"].id,
      topBanner: {
        display: false,
        multi: false
      },
      newInstanceId: null
    };
  },
  methods: {
    async onTaskNextClick() {
      let self = this;
      if (self.topBanner.multi) {
        // 跳转任务列表
        self.topBanner.display = false;
        self.$emit("routerToTaskList", {
          processInstanceId: self.newInstanceId,
          assignee: self.userId
        });
      } else {
        // 跳转其他task
        let tasks = await taskRequest.postTaskList("", {},
          {
            processInstanceId: self.newInstanceId,
            assignee: self.userId
          });
        if (tasks.length > 0) {
          self.topBanner.display = false;
          self.$store.dispatch("common/setEditTaskId",tasks[0].id);
        }
      }
    },
    async show(show) {
      let self=this;
      this.setting.display = show;
      if (!show){
        return;
      }
      let process = await processRequest.getProcessDefinitionByKey(
        this.action.processKey
      );
      this.process = process;
      this.fieldsValue = {};
      this.formData = null;
      this.formValue = {};
      let response = null;
      let startFormKey = await processRequest.getStartFormKey(this.process.id);
      if (startFormKey.key != null) {
        response = await formRequest.getFormDetail(startFormKey.key);
        if (!this.action.key||this.action.key.toLowerCase()!=="create") {
          this.action.columns.forEach((column, index) => {
            this.fieldsValue[column] = this.action.data[index];
            FormioUtils.eachComponent(response.formData, function(component, path) {
              if (path===column && component.type==="htmlEditor"){
                self.fieldsValue[column] = {html:self.action.data[index]};
              }
            });
          });
        }

        this.fieldsValue["formUserId"] = this.userId;
        this.fieldsValue["formUserName"] = this.userName;
        this.fieldsValue["tenant"] = this.$store.getters["user/getTenant"].id;
        this.fieldsValue["tenantName"] = this.$store.getters["user/getTenant"].name;
        this.formValue = { data: this.fieldsValue };
        this.formData = { components: response.formData };
      }
    },
    async save() {
      let self=this;
      try {
        let data = {};
        if (this.$refs.formioNew && this.$refs.formioNew.formio) {
          let formResult = await this.$refs.formioNew.formio.submit();
          data = formResult.data;
        }
        Utils.eachComponent(self.formData.components,(component,path)=>{
          if (component.type==="fileDownload"){
            delete data[`${path}`];
          }
        });
        data.startUserId = this.userId;
        data.startUserName = this.userName;
        let tenantId = this.$store.state.user.tenant;

        data.startUserTenant = tenantId;
        data.startUserTenantName = this.$store.state.user.tenantName;
        data.customLoginTenantId = tenantId;

        var variables = formatVariables(data);

        const queryData = {
          variables: variables,
          businessKey: `${this.action.field}+${this.action.label}+${utils.formatDateTime(
            new Date(),
            "YYYY-MM-DD HH:mm:SS"
          )}`,
          withVariablesInReturn: true,
        };
        let process = await processRequest.startProcess(this.process.key, queryData);
        this.$emit("onOperateSuccess");
        this.newInstanceId = process.id;
        // 获取实例任务数目
        let taskCount = await taskRequest.postTaskCount("", {}, {
          processInstanceId: self.newInstanceId,
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
        } else {
          this.$notify.success(this.$t("operateProcessSuccessWithOperate", { opt: this.action.label }));
          this.setting.display = false;
        }
      } catch (err) {
        if (err instanceof Array) {
          this.$notify.error(this.$t("exeErrWithAllRequired"));
        } else {
          this.$notify.error(err.toString());
        }
      }
    },
  },
  watch: {
    "setting.display": {
      handler(val) {},
    },
  },
};
</script>

<style scoped></style>
