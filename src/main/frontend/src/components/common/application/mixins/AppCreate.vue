<template>
  <div />
</template>

<script>
import processRequest from "@/api/process";
import instanceRequest from "@/api/instance";
import formRequest from "@/api/form";
import utils from "@/utils/utils";
import { formatVariables, getBase64, buildDraft } from "@/utils/common";
import { Form, Utils } from "vue-formio-eorion";
import camundaService from "@/api/camunda-service";
import userRequest from "@/api/user";
import {isWorkWeChat,isWeChat} from "@/utils/common";

export default {
  name: "AppCreate",
  components: { formio: Form },
  data() {
    return {
      utils,
      businessKey: "",
      formData: null,
      formValue: {},
      fieldsValue: {},
      process: {},
      instance: {},
      instanceNew: {},
      action: {
        key: "",
        label: "",
        processKey: "",
        data: [],
        columns: [],
      },
      userId: this.$store.state.user.profile.id,
      userName: this.$store.getters["user/getUserName"],
      addLoading: false,
    };
  },
  mounted() {
    this.getData();
  },
  beforeDestroy() {
    this.$store.dispatch("common/setCreateInstanceVars",[]);
  },
  methods: {
    async getData() {
      await this.$store.dispatch("common/setNavigations", []);
      await this.$store.dispatch("common/setCurrentNavigation", "");
      await this.$store.dispatch("common/setCurrentAppBarIcon", "");
      let icons=[];
      if (isWeChat()||isWorkWeChat()){
        icons.push({
          id: "scan",
          icon: "mdi-line-scan",
          color: "#444262",
        });
      }
      icons.push({
        id: "delete",
        icon: "mdi-toolbox",
        color: "#444262",
      },
        {
          id: "save",
          icon: "mdi-content-save",
          color: "#444262",
        });
      await this.$store.dispatch("common/setAppBarIcons", icons);
      this.process.key = this.$route.params.key;
      this.instance.id = this.$route.query.instanceId;
      await this.$store.dispatch("common/setAppBarTitle", "");
      await this.$store.dispatch("common/setCurrentNavigation", "");
      let process = await processRequest.getProcessDefinitionByKey(
        this.process.key
      );
      this.process = process;
      // 设置面包屑
      if (this.idBreadcrumbs && this.idBreadcrumbs[1]) {
        this.idBreadcrumbs[1].text = this.process.name;
        this.idBreadcrumbs[1].href = `#/task/application/list?defaultSearchVal=${this.process.name}`;
        let { count } = await instanceRequest.postHistoryInstancesCount({
          processDefinitionKey: this.process.key,
          unfinished: true,
        });
        this.instances.totalCount = count;
      }

      if (this.instance.id) {
        let instance = await instanceRequest.getInstance(this.instance.id);
        this.instance = instance;
      }
      await this.getForm(!!this.instance.id);
    },
    buildDraftParam() {
      return {
        tenant: this.$store.state.user.tenant,
        userId: this.userId,
        resourceType: 1,
        processDefinitionKey: this.process.key,
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
      if (this.$refs.involvedUserDialogRef) {
        // 协同人
        draft.formDraft["eoaiInvolvedUser"] = this.$refs.involvedUserDialogRef
          .getInvolvedUsers()
          .map((user) => user.id)
          .join(",");
      }
      draft.processDefinitionName = this.process.name;

      if (draft.id) {
        await camundaService.putDraft(draft);
      } else {
        await camundaService.postDraft(draft);
      }
      await this.getDraft();
      this.$notify.success({ title: this.$t("success"), message: this.$t("saveDraftSuccess") });
    },
    reset() {
      let self = this;
      try {
        self.businessKey = "";
        self.fieldsValue = {};
        self.formValue = { data: self.fieldsValue };
        self.$refs.formioNew.formio.reset();
      } catch (e) {}
    },
    async add() {
      let self = this;
      try {
        self.addLoading = true;
        let data = {};
        if (self.$refs.formioNew && self.$refs.formioNew.formio) {
          let formResult = await self.$refs.formioNew.formio.submit();
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
        if (self.$refs.involvedUserDialogRef) {
          // 协同人
          data["eoaiInvolvedUser"] = self.$refs.involvedUserDialogRef
            .getInvolvedUsers()
            .map((user) => user.id)
            .join(",");
        }
        var variables = formatVariables(data);

        const queryData = {
          variables: variables,
          businessKey: this.businessKey,
          withVariablesInReturn: true,
        };
        let process = await processRequest.startProcess(
          this.process.key,
          queryData
        );
        self.instanceNew = process;
        process.key = this.process.key;
        if (this.draft && this.draft.id) {
          await camundaService.deleteDraft(this.draft.id);
        }
        self.addLoading = false;
        if (self.$route.name!=="application-create"){
          this.$notify.success({ title: self.$t("success"), message: self.$t("createInstanceSuccess") });
        }
        this.formData = null;
        this.onAddSuccess();
      } catch (err) {
        self.addLoading = false;
        console.log(err);
        var errString = "";
        let errTitle = self.$t("plsCompleteAllRequired");
        err.forEach((e) => {
          if (errString == "") {
            errString +=
              "【" + e.message.replace(" is required", "") + "】必填";
          } else {
            errString += ",【" + e.message.replace(" is required", "") + "】";
          }
        });
        this.$notify.error(errTitle);
      }
    },
    async getForm(isCopy) {
      this.formData = null;
      this.businessKey = "";
      this.fieldsValue = {};
      let startFormKey = await processRequest.getStartFormKey(this.process.id);
      if (startFormKey.key != null) {
        let response = await formRequest.getFormDetail(startFormKey.key);

        if (isCopy) {
          let variables = await instanceRequest.getHistoryDetail({
            processInstanceId: this.instance.id,
            initial: true,
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
        // 来自router的预设变量
        if (this.$store.getters["common/getCreateInstanceVars"]){
          let routerVars = this.$store.getters["common/getCreateInstanceVars"];
          if (routerVars){
            routerVars.forEach(item=>{
              Object.keys(item).forEach((name) => {
                this.fieldsValue[name] = item[name];
              });
            });
          }
        }

        await this.getDraft();
        let formDraft = this.draft.formDraft || {};
        Object.keys(formDraft).forEach((name) => {
          this.fieldsValue[name] = formDraft[name];
        });
        // 协同人
        if (this.fieldsValue.eoaiInvolvedUser) {
          let involvedUsers = await userRequest.getUsers({
            idIn: this.fieldsValue.eoaiInvolvedUser,
          });
          if (this.$refs.involvedUserDialogRef) {
            // 协同人
            this.$refs.involvedUserDialogRef.setInvolvedUsers(involvedUsers);
          }
        }
        this.fieldsValue["formUserId"] = this.userId;
        this.fieldsValue["formUserName"] = this.userName;
        this.fieldsValue["tenant"] = this.$store.getters["user/getTenant"].id;
        this.fieldsValue["tenantName"] =
          this.$store.getters["user/getTenant"].name;
        this.formValue = { data: this.fieldsValue };
        this.formData = { components: response.formData };
        setTimeout(this.handleProcessMenu, 2000);
      }
    },

    handleProcessMenu() {
      let jQuery = window.jQuery;
      jQuery(".processtable").on("click", "button", (e) => {
        let target = jQuery(e.target);
        let label = target.data("label") || "";
        let key = target.data("key") || "";
        let processKey = target.closest("button").data("process-key") || "";
        let data = [];
        let table = jQuery(e.target.closest("table")).DataTable();

        let columns = table
          .columns()
          .header()
          .map((d) => d.textContent)
          .toArray();
        if (key.toLowerCase().indexOf("create") < 0) {
          data = table.row(e.target.closest("tr")).data();
        }
        let action = {
          key,
          label,
          processKey,
          data,
          columns,
        };
        Object.assign(this.action, action);
        this.$refs.formActionDialogRef.show(true);
      });
    },
  },
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

.v-icon.business-icon {
  width: 30px;
  height: 30px;
  line-height: 20px;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 1);
  text-align: center;
  vertical-align: middle;
  margin-right: 20px;
}
</style>
