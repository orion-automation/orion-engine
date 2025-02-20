<template>
  <v-navigation-drawer
    absolute
    v-model="setting.display"
    :width="editDrawer.width"
    :stateless="!!action.lockDrawer"
    temporary
    right>
    <div class="d-flex flex-column"
         style="height: 100%;padding-top:10px;gap: 10px;background-color: #fafafa;border-top: 1px solid #e6e4e6;">

      <v-app-bar
        class="toolbar"
        dense
        color="#FFFFFF"
        style="border-bottom: 1px solid #b1abb6; z-index: 3;padding: 0"
        absolute
        elevation="2"
      >
        <div class="d-flex flex-row" style="width: 100%;height: 100%">
          <v-btn icon @click="setExpand">
            <v-icon size="18" color="#1976d2">
              {{ editDrawer.expand ? "mdi-arrow-collapse" : "mdi-arrow-expand"
              }}
            </v-icon>
          </v-btn>
          <v-btn icon
                 v-if="action.sourceDrawer && action.sourceDrawer.length>0"
                 @click="goBack">
            <v-icon size="18"
                    color="#1976d2">
              mdi-arrow-left
            </v-icon>
          </v-btn>
          <v-spacer />
          <v-divider vertical />
          <v-btn text
                 style="border-right: none; font-weight:normal; color:#444262"
                 height="48"
                 color="#FA4F07"
                 @click="setting.display = false">
            <v-icon left small
                    color="#444262">
              mdi-window-close
            </v-icon>{{ $t("close") }}</v-btn>
          <v-divider vertical />
          <v-btn
            text
            height="48"
            style="border-right: none; font-weight:normal; color:#444262"
            @click="save()"
            color="#444262"
          >
            <v-icon left small
                    color="#444262">
              mdi-send
            </v-icon>
            {{ $t("commit") }}
          </v-btn>
        </div>
      </v-app-bar>
      <div style="flex: 1;height: 0;overflow-y: auto;padding-left: 15px;padding-right: 15px;">
        <v-main>
          <div class="d-flex flex-column" style="height: 100%">
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
            <div class="formioClass" style="flex: 1;height: 0;overflow-y: hidden;padding-left: 15px;padding-right: 15px;">
              <formio
                v-if="formData"
                ref="formioNew"
                :form="formData"
                :options="{ language: 'zh', noAlerts: true }"
                :submission="formValue"
              ></formio>
            </div>
          </div>
        </v-main>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script>

import processRequest from "@/api/process";
import formRequest from "@/api/form";
import utils from "@/utils/utils";
import { Form, Utils } from "vue-formio-eorion";
import { formatVariables, getBase64 } from "@/utils/common";
import instanceRequest from "@/api/instance";
import taskRequest from "@/api/task";

export default {
  name: "FormActionStartProcessDrawer",
  props: {
    action: {
      type: Object
    }
  },
  components: { formio: Form },
  data() {
    return {
      editDrawer: {
        width: "500",
        expand: false
      },
      topBanner: {
        display: false,
        multi: false
      },
      newInstanceId: null,
      formData: null,
      formValue: {},
      fieldsValue: {},
      process: {},
      instance: {},
      setting: {
        display: false,
        commitLoading: false
      },
      userId: this.$store.state.user.profile.id,
      userName: this.$store.getters["user/getUserName"],
      tenantId: this.$store.getters["user/getTenant"].id,
      instanceId: this.$store.state.common.editInstanceId
    };
  },
  mounted() {
    let self = this;
    let height = window.outerWidth;
    self.editDrawer.width = self.editDrawer.expand ? height * 0.67 : height * 0.5;
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
    goBack() {
      this.$emit("onStartProcessBack");
    },
    getShow() {
      return this.setting.display;
    },
    setExpand() {
      let self = this;
      self.editDrawer.expand = !self.editDrawer.expand;
      let height = window.outerWidth;
      self.editDrawer.width = self.editDrawer.expand ? height * 0.67 : height * 0.5;
    },
    async show(show) {
      this.setting.display = show;
      if (!show){
        this.topBanner.display = false;
        return;
      }
      let process = await processRequest.getProcessDefinitionByKey(
        this.action.processKey
      );
      this.fieldsValue = {};
      if (this.action.instanceId && this.action.instanceId.length > 0) {
        // 复制并创建
        this.instance.id = this.action.instanceId;
        let variables = await instanceRequest.getHistoryDetail({
          processInstanceId: this.instance.id,
          initial: true
        });

        for (let i in variables) {
          const variable = variables[i];
          if (variable.variableType === "File") {
            let file = await instanceRequest.getHistoryDetailFile(
              variable.id
            );
            let base64 = await getBase64(file);
            this.fieldsValue[variable.variableName] = base64;
          } else {
            this.fieldsValue[variable.variableName] = variable.value;
          }
        }
      }
      this.process = process;
      this.formData = null;
      this.formValue = {};
      let response = null;
      let startFormKey = await processRequest.getStartFormKey(this.process.id);
      if (startFormKey.key != null) {
        response = await formRequest.getFormDetail(startFormKey.key);

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
          withVariablesInReturn: true
        };
        let process = await processRequest.startProcess(this.process.key, queryData);
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
        }else {
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
    }
  },
  watch: {
    action: {
      handler(val) {
        if (this.setting.display) {
          this.show(true);
        }
      },
      deep: true
    }
  }
};
</script>

<style scoped></style>
