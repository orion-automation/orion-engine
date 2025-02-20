<template>
  <div class="d-flex flex-row" style="width: 100%; height: 100%; flex: 1">
    <v-navigation-drawer
      v-model="$store.state.common.xDetailLeftDrawer"
      :width="$store.state.common.xDetailLeftDrawer?256:0"
      left
      temporary
      style="border-top: 1px solid #e6e4e6;"
      absolute
    >
      <v-list nav dense>
        <v-list-item
          link
          v-for="pageItem in application.configJson.page"
          :key="pageItem.id"
          class="left-page"
          :class="{ current: pageItem.id == tabs[0].page.id }"
          @click="selectPage(pageItem)"
        >
          <v-list-item-icon>
            <i
              :class="pageItem.icon"
              style="font-size: 16px; margin: auto"
            ></i>
          </v-list-item-icon>
          <v-list-item-title style="font-size: 16px"
          >{{ pageItem.name || pageItem.id }}
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <template #append>
        <div style="margin: 16px">
          <div class="d-flex">
            <i
              class="fa-fw"
              :style="{
                color: application.configJson.basic.color ?? '#83829a',
              }"
              :class="
                application.configJson.basic.iconType +
                ' fa-' +
                (application.configJson.basic.icon)
              "
              style="font-size: 16px; margin: auto 5px"
            ></i>
            <div style="margin-left: 15px; color: #444262; font-size: 16px">
              {{ application.name }}
            </div>
          </div>
          <div class="d-flex">
            <i
              class="fa-fw"
              :class="
                application.configJson.basic.iconType +
                ' fa-' +
                (application.configJson.basic.icon)
              "
              style="font-size: 16px; margin: auto 5px; visibility: hidden"
            ></i>
            <div style="margin-left: 15px; font-size: 12px; color: #83829a">
              {{ application.versionTag ? "v" + application.versionTag : "" }}
            </div>
          </div>
          <div class="d-flex">
            <i
              class="fa-fw"
              :class="
                application.configJson.basic.iconType +
                ' fa-' +
                (application.configJson.basic.icon)
              "
              style="font-size: 16px; margin: auto 5px; visibility: hidden"
            ></i>
            <div style="margin-left: 15px; font-size: 12px; color: #83829a">
              {{ utils.formatDateTime(application.updatedTs, "YYYY-MM-DD HH:mm") }}
            </div>
          </div>
        </div>
      </template>
    </v-navigation-drawer>
    <div style="flex: 1; height: 100%; overflow: hidden;" class="d-flex flex-column">
      <div class="d-flex flex-row" style="background-color: #ffffff; align-items: center;display: none !important;">
        <div style="margin: 15px" class="d-flex flex-row">
          <v-icon color="#007AFF">mdi-checkbox-blank-badge</v-icon>
          <span style="margin: 0 24px; color: #312651; font-weight: bold">{{
              application.name
            }}</span>
        </div>
        <v-spacer />
        <div class="d-flex flex-row" style="display: none !important;">
          <v-btn
            text
            style="margin-right: 10px; background-color: #007aff"
            color="#FFFFFF"
          >
            <v-icon color="#FFFFFF" size="18" left>mdi-account-multiple</v-icon>
            团队
          </v-btn>
          <v-btn text style="margin-right: 10px">
            <v-icon color="#FF7754" size="18" left>mdi-progress-clock</v-icon>
            流程
          </v-btn>
          <v-btn text style="margin-right: 10px">
            <v-icon color="#0F40F5" size="18" left>mdi-calendar-range</v-icon>
            待办
          </v-btn>
          <v-btn text style="margin-right: 20px">
            <v-icon color="#70B1E6" size="18" left>mdi-creation</v-icon>
            AI助理
          </v-btn>
        </div>
      </div>
      <v-tabs
        background-color="white"
        v-model="tab"
        key="tab"
        color="white"
        style="flex: 0"
      >
        <v-tabs-slider color="#444262" />
        <!-- <v-tab key="dashboard">
          <div d-flex flex-row>
            <span style="font-size: 14px; color: #312651; margin: 0 15px 0 8px">
              {{ $t("Dashboard") }}</span
            >
            <v-icon size="18" color="#83829A"> mdi-dots-horizontal </v-icon>
          </div>
        </v-tab> -->
        <v-tab :key="`tab-${index}-${item.id}`" v-for="(item,index) in tabs">
          <div class="d-flex flex-row" style="align-items: center">
            <span style="font-size: 14px; color: #444262;">
              {{ item.name || item.page.name }}</span
            >
            <v-menu bottom offset-y>
              <template #activator="{ on, attrs }">
                <v-btn icon style="margin-left: 5px"
                       v-bind="attrs"
                       v-on="on"
                       color="#83829A"
                       x-small
                       v-if="index!==0">
                  <v-icon>mdi-dots-horizontal</v-icon>
                </v-btn>
              </template>
              <v-list
                style="border-radius: 6px;border: 1px solid rgba(177, 171, 182, 1);padding: 0"
                width="150">
                <v-list-item @click="closeTab(index)" style="border-bottom: 1px solid rgba(177, 171, 182, 1)">
                  <v-list-item-content>
                    <div class="d-flex flex-row" style="align-items: center;font-size: 13px;color: #595172">
                      {{ $t("close") }}
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab" style="overflow-x: hidden; flex: 1" class="tabs">
        <!-- <v-tab-item key="dashboard" transition="false">

        </v-tab-item> -->
        <v-tab-item :key="`tab-${index}-${item.id}`" v-for="(item,index) in tabs" transition="false">
          <div class="formioClass" style="margin: 0 20px 20px 20px">
            <formio
              v-if="item.formData"
              :form="item.formData"
              language="zh"
              :ref="`formioRef${item.id}`"
              :options="formOptions"
              :submission="item.formValue"
            ></formio>
          </div>
        </v-tab-item>
      </v-tabs-items>
    </div>

    <detail-sider
      style="flex: 0"
      :application="application"
      :page="tabs[0].page"
      @onProcessItemClick="openProcessDetailDrawer"
      ref="detailSiderRef"
    />
    <form-action-dialog :action="action" ref="formActionDialogRef" />
    <form-action-drawer :action="action" ref="formActionDrawerRef" @onOperateSuccess="refreshCurrentTab" />
    <form-action-start-process-drawer :action="startProcessDrawer"
                                      @routerToTaskList="routerToTaskList"
                                      @onStartProcessBack="onStartProcessBack"
                                      ref="formActionStartProcessDrawerRef" />
    <form-action-task-detail-drawer :action="taskDetailDrawer"
                                    @routerToTaskList="routerToTaskList"
                                    @clearDrawers="clearDrawers"
                                    @onTaskDetailBack="onTaskDetailBack"
                                    ref="formActionTaskDetailDrawerRef" />
    <form-action-process-detail-drawer :action="processDetailDrawer" ref="formActionProcessDetailRef"
                                       @openStartProcessDrawer="openStartProcessDrawer" />
    <form-action-instance-detail-drawer :action="instanceDetailDrawer"
                                        @onInstanceDetailBack="onInstanceDetailBack"
                                        @openStartProcessDrawer="openStartProcessDrawer"
                                        ref="formActionInstanceDetailRef" />
  </div>
</template>

<script>
import utils from "@/utils/utils";
import formRequest from "@/api/form";
import { Form } from "vue-formio-eorion";
import DetailSider from "./DetailSider";
import FormActionDialog from "@/components/common/formAction/FormActionDialog";
import FormActionDrawer from "@/components/common/formAction/FormActionDrawer";
import FormActionStartProcessDrawer from "@/components/common/formAction/FormActionStartProcessDrawer";
import FormActionTaskDetailDrawer from "@/components/common/formAction/FormActionTaskDetailDrawer";
import FormActionProcessDetailDrawer from "@/components/common/formAction/FormActionProcessDetailDrawer";
import FormActionInstanceDetailDrawer from "@/components/common/formAction/FormActionInstanceDetailDrawer";
import i18n from "@/utils/i18n";
import camundaService from "@/api/camunda-service";
import userRequest from "@/api/user";

export default {
  name: "Index",
  components: {
    DetailSider,
    formio: Form,
    FormActionDialog,
    FormActionDrawer,
    FormActionStartProcessDrawer,
    FormActionTaskDetailDrawer,
    FormActionProcessDetailDrawer,
    FormActionInstanceDetailDrawer
  },
  data() {
    return {
      utils,
      tab: 0,
      tabs: [
        {
          id: "dashboard",
          name: "",
          icon: "",
          formData: null,
          formValue: {},
          fieldsValue: {},
          page: {
            id: ""
          }
        }
      ],
      tabsOld: {},
      action: {
        field: "",
        key: "",
        label: "",
        processKey: "",
        data: [],
        columns: []
      },
      drawerLeft: false,
      application: {
        id: "",
        configJson: {
          basic: {},
          authority: {},
          page: [],
          data: []
        }
      },

      formOptions: { noAlerts: true, i18n },

      userId: this.$store.state.user.profile.id,
      userName: this.$store.getters["user/getUserName"],
      tenantId: this.$store.getters["user/getTenant"].id,
      groups: [],
      instanceDetailDrawer: {
        id: "",
        fromDrawer: "",
        sourceDrawer: ""
      },
      startProcessDrawer: {
        key: "",
        instanceId: "",
        sourceDrawer: ""
      },
      taskDetailDrawer: {
        sourceDrawer: ""
      },
      processDetailDrawer: {
        sourceDrawer: ""
      }
    };
  },
  async mounted() {
    let self = this;
    this.application.id = this.$route.params.id;

    window.editDataTableItemByDrawer = function(item) {
      Object.assign(self.action, item);
      self.$nextTick(() => {
        self.$refs.formActionDrawerRef.show(true);
      });
    };
    window.editDataTableItemByDialog = function(item) {
      Object.assign(self.action, item);
      self.$nextTick(() => {
        self.$refs.formActionDialogRef.show(true);
      });
    };
    // 新建流程实例
    window.startProcessByDrawer = function(item) {
      self.startProcessDrawer = {
        processKey: item.processKey,
        field: item.field,
        label: item.label,
        instanceId: null,
        sourceDrawer: "",
        lockDrawer: item.lockDrawer??false,
      };
      self.$nextTick(() => {
        if (!self.$refs.formActionStartProcessDrawerRef.getShow()) {
          self.$refs.formActionStartProcessDrawerRef.show(true);
        }
      });
    };
    // 打开任务列表panel
    window.openTaskListByDrawer = function(processKeys) {
      self.$refs.detailSiderRef.tab = "calendar";
      self.$store.dispatch("common/setXDetailRightDrawer", true);
      // self.$refs.detailSiderRef.aiRight = false;
      if (self.$refs.detailSiderRef && self.$refs.detailSiderRef.extraProcessKeys.join(",") !== processKeys.processKey) {
        self.$refs.detailSiderRef.addExtraProcessKeys(processKeys.processKey);
      }
    };
    // 打开新tab
    window.openNewTab = async function(payloads) {
      let page = {
        externalResourceId: payloads.formId
      };

      let tab = {
        formData: null,
        formValue: {},
        fieldsValue: {},
        page,
        id: payloads.formId,
        icon: "mdi-image-filter-hdr"
      };

      self.tabs.push(tab);
      self.getForm(self.tabs.length - 1);
    };
    await this.getApplication();
    // 最近使用
    let userSettings = this.$store.state.user.preferenceJson;
    if (Object.keys(userSettings).length > 0) {
      let recentUsedXapp = userSettings.recentUsedXapp ?? [];
      let index = recentUsedXapp.findIndex(item => item.id === this.application.id);
      if (index > -1) {
        // 移除已有
        recentUsedXapp.splice(index, 1);
      }
      // 添加到首位
      recentUsedXapp.splice(0, 0, { id: this.application.id, name: this.application.name });
      // 长度控制
      if (recentUsedXapp.length > 10) {
        recentUsedXapp = recentUsedXapp.slice(0, 10);
      }
      let preferenceJson = Object.assign(
        this.$store.state.user.preferenceJson, { recentUsedXapp }
      );
      await userRequest.postUserSetting({
        userId: this.$store.state.user.profile.id,
        preferenceJson: preferenceJson
      });
      this.$store.commit("user/SET_PREFERENCE_JSON", preferenceJson);
    }
  },
  methods: {
    clearDrawers() {
      let self = this;
      self.$refs.formActionDrawerRef.show(false);
      self.$refs.formActionTaskDetailDrawerRef.show(false);
      self.$refs.formActionStartProcessDrawerRef.show(false);
      self.$refs.formActionProcessDetailRef.show(false);
      self.$refs.formActionInstanceDetailRef.show(false);
      self.$refs.formActionDialogRef.show(false);
    },
    routerToTaskList(payload) {
      let self = this;
      self.$refs.formActionDrawerRef.show(false);
      self.$refs.formActionTaskDetailDrawerRef.show(false);
      self.$refs.formActionStartProcessDrawerRef.show(false);
      self.$refs.detailSiderRef.onSelectCustomQuickFilter(payload);
    },
    closeTab(index) {
      this.tabs.splice(index, 1);
    },
    refreshCurrentTab() {
      if (this.$refs[`formioRef${this.tabs[this.tab].id}`] && this.$refs[`formioRef${this.tabs[this.tab].id}`][0]) {
        this.$refs[`formioRef${this.tabs[this.tab].id}`][0].formio.redraw();
      }
    },
    onStartProcessBack() {
      let self = this;
      if (self.startProcessDrawer.sourceDrawer && self.startProcessDrawer.sourceDrawer.length > 0) {
        self.$refs.formActionStartProcessDrawerRef.show(false);
        self.$refs[`${self.startProcessDrawer.sourceDrawer}`].show(true);
      }
    },
    onInstanceDetailBack() {
      let self = this;
      if (self.instanceDetailDrawer.sourceDrawer && self.instanceDetailDrawer.sourceDrawer.length > 0) {
        self.$refs.formActionInstanceDetailRef.show(false);
        self.$refs[`${self.instanceDetailDrawer.sourceDrawer}`].show(true);
      }
    },
    onTaskDetailBack() {
      let self = this;
      if (self.taskDetailDrawer.sourceDrawer && self.taskDetailDrawer.sourceDrawer.length > 0) {
        self.$refs.formActionTaskDetailDrawerRef.show(false);
        self.$refs[`${self.taskDetailDrawer.sourceDrawer}`].show(true, "task");
      }
    },
    openStartProcessDrawer(payload) {
      let self = this;
      if (payload.instanceId) {
        // 实例详情创建
        self.startProcessDrawer = {
          processKey: payload.key,
          instanceId: payload.instanceId,
          sourceDrawer: "formActionInstanceDetailRef",
          lockDrawer: true,
        };
      } else {
        // 流程详情创建
        self.startProcessDrawer = {
          processKey: payload,
          instanceId: null,
          sourceDrawer: "formActionProcessDetailRef",
          lockDrawer: true,
        };
      }
      self.$nextTick(() => {
        if (!self.$refs.formActionStartProcessDrawerRef.getShow()) {
          self.$refs.formActionProcessDetailRef.show(false);
          self.$refs.formActionInstanceDetailRef.show(false);
          self.$refs.formActionStartProcessDrawerRef.show(true);
        }
      });
    },
    openTaskDetailDrawer(taskId) {
      let self = this;
      self.taskDetailDrawer = {
        taskId: taskId,
        sourceDrawer: self.$refs.formActionProcessDetailRef.getShow() ? "formActionProcessDetailRef" : ""
      };
      self.$nextTick(() => {
        self.$refs.formActionDrawerRef.show(false);
        self.$refs.formActionStartProcessDrawerRef.show(false);
        self.$refs.formActionProcessDetailRef.show(false);
        self.$refs.formActionTaskDetailDrawerRef.show(true);
      });
    },
    openProcessDetailDrawer(key) {
      let self = this;
      self.processDetailDrawer = {
        key: key
      };
      self.$nextTick(() => {
        self.$refs.formActionProcessDetailRef.show(true);
      });
    },
    openInstanceDetailDrawer(key) {
      let self = this;
      self.instanceDetailDrawer = {
        id: key,
        sourceDrawer: self.$refs.formActionProcessDetailRef.getShow() ? "formActionProcessDetailRef" : ""
      };
      self.$nextTick(() => {
        self.$refs.formActionProcessDetailRef.show(false);
        self.$refs.formActionInstanceDetailRef.show(true);
      });
    },
    openAI() {
      this.$refs.detailSiderRef && this.$refs.detailSiderRef.openInstance();
    },
    async getApplication() {
      let application = await camundaService.getApplication(this.application.id);

      this.groups = await this.$store.dispatch("user/getGroups");
      let page = this.checkAuth(application.configJson.page);
      application.configJson.page = page;
      let data = this.checkAuth(application.configJson.data);
      application.configJson.data = data;
      for (var i = 0; i < application.configJson.page.length; i++) {
        let id = application.configJson.page[i].id;
        let designPage = await camundaService.getResource(id);
        application.configJson.page[i].externalResourceId = designPage.externalResourceId;
        application.configJson.page[i].name = designPage.name;
      }

      this.application = application;
      this.$store.dispatch("common/setXDetailName", this.application.configJson.basic.name);
      this.selectPage(this.application.configJson.page[0]);
    },
    async selectPage(page) {
      this.$store.state.common.xDetailLeftDrawer = false;
      // 保存现有tab
      if (this.tabs.length > 1) {
        this.tabsOld[`${this.tabs[0].page.id}`] = this.tabs.slice(1);
      }
      this.tabs = this.tabs.slice(0, 1);
      this.tabs[0].page = page || { id: `${new Date().getTime()}` };
      if (this.tabsOld[`${this.tabs[0].page.id}`] && this.tabsOld[`${this.tabs[0].page.id}`].length > 0) {
        this.tabs = this.tabs.concat(this.tabsOld[`${this.tabs[0].page.id}`]);
      }
      await this.getForm(0);

      if (this.$refs.detailSiderRef) {
        this.$refs.detailSiderRef.tab = "calendar";
        this.$store.dispatch("common/setXDetailRightDrawer", false);
        // this.$refs.detailSiderRef.aiRight = false;
      }
    },
    async getForm(index) {
      this.tab = index;
      this.tabs[index].formData = null;
      let components = [];
      if (this.tabs[index].page.externalResourceId) {
        let response = await formRequest.getFormDetail(
          this.tabs[index].page.externalResourceId
        );
        components = response.formData;
        if (!this.tabs[index].page.id) {
          // by open new tab,没有对应page,设置tab名称
          this.tabs[index].page.name = response.name;
        }
      }
      var formData = {
        components
      };
      let fieldsValue = this.tabs[index].fieldsValue;
      fieldsValue.formUserId = this.userId;
      fieldsValue.formUserName = this.userName;
      fieldsValue.tenant = this.$store.state.user.tenant;
      fieldsValue.tenantName = this.$store.state.user.tenantName;
      this.tabs[index].formValue = { data: fieldsValue };
      this.tabs[index].formData = formData;

      setTimeout(this.handleProcessMenu, 2000);
    },
    checkAuth(items) {
      return items.filter(
        (item) =>
          item.groups.find((group) =>
            this.groups.find((groupItem) => groupItem.id === group.id)
          ) || item.users.find((user) => user.id === this.userId)
      );
    },
    handleProcessMenu() {
      let jQuery = window.jQuery;
      jQuery(".v-window-item.v-window-item--active .processtable").on(
        "click",
        "button",
        (e) => {
          let target = jQuery(e.target).closest("button");
          let label = target.data("label") || "";
          let key = target.data("key") || "";
          let field = target.data("field") || "";
          let processKey = target.data("process-key") || "";
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
            field,
            key,
            label,
            processKey,
            data,
            columns
          };
          Object.assign(this.action, action);
          this.$refs.formActionDialogRef.show(true);
        }
      );

      // 防止重复添加listener
      if (jQuery(".v-window-item.v-window-item--active .formio-component-actionButton").attr("listenerOnClick") !== "true") {
        jQuery(".v-window-item.v-window-item--active .formio-component-actionButton").attr("listenerOnClick", "true");

        jQuery(".v-window-item.v-window-item--active .formio-component-actionButton").click(
          async (e) => {
            let target = jQuery(e.target).closest(".formio-component-actionButton");
            let setting = JSON.parse(target.attr("setting") || "{}");
            if (setting.action === "openPage") {
              let id = parseInt(setting.page);

              let page = await camundaService.getResource(id);

              let tab = {
                formData: null,
                formValue: {},
                fieldsValue: {},
                page,
                id,
                icon: "mdi-image-filter-hdr"
              };

              this.tabs.push(tab);
              this.getForm(this.tabs.length - 1);
            }
          }
        );
      }
    }
  },
  watch: {
    "$store.state.common.editTaskId": function(newVal) {
      if (newVal && newVal.length > 0) {
        this.openTaskDetailDrawer(newVal);
      }
    },
    "$store.state.common.editInstanceId": function(newVal) {
      if (newVal && newVal.length > 0) {
        this.openInstanceDetailDrawer(newVal);
      }
    }
  }
};
</script>

<style scoped>
/deep/ .v-window__container {
  height: 100% !important;
  background-color: #e7eef8;
  overflow-y: auto;
}

/deep/ .theme--light.v-tabs > .v-tabs-bar {
  padding-left: 1.5em;
}

/deep/ .tabs .v-window-item.v-window-item {
  background-color: #e7eef8;
  height: 100%;
}

.v-list-item.v-list-item--link.left-page {
  color: #312651;
}

.v-list-item.v-list-item--link.left-page.current {
  color: #ff7754;
}

.v-list-item.v-list-item--link.left-page.current:deep(.v-list-item__title) {
  font-weight: bold;
}

div.v-navigation-drawer__content {
  overflow-y: hidden;
}
</style>
