<template>
  <div style="padding: 0 0 85px 0">
    <v-card class="content" outlined>
      <div
        class="form-head"
        style="margin: 15px 10px 0 10px"
        v-if="$store.state.common.currentNavigation === 'form'"
      >

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
                 @click="onClickProcessDefKey(instance.processDefinitionKey)">
              <div style="overflow: hidden;
              text-overflow: ellipsis;
              font-weight: bold;
              white-space: nowrap;">{{ instance.businessKey }}
              </div>
              |
              <div style="overflow: hidden;
              text-overflow: ellipsis;
              font-weight: bold;
              white-space: nowrap;">
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

        <div
          class="formioClass"
          style="margin: 10px 0 0 0; padding-bottom: 10px"
        >
          <formio
            v-if="instance.id && formData"
            :ref="`formio-${instance.id}`"
            :form="formData"
            :options="{ readOnly: true, language: 'zh', noAlerts: true }"
            :submission="formValue"
          >
          </formio>
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
          v-if="instance.id"
          :instance-id="instance.id"
          ref="applicationInstanceMessage"
        />
      </div>
    </v-card>
    <v-dialog v-model="deleteDialog.display" width="350">
      <v-card>
        <v-card-title style="font-size: 16px">{{ $t("deleteCurrentInstance") }}</v-card-title>
        <v-card-text>
          {{ $t("deleteCurrentInstanceWarning") }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="#83829A" text @click="deleteDialog.display = false">
            {{ $t("cancel") }}
          </v-btn>
          <v-btn color="#FF7754" text @click="deleteInstance()"> {{ $t("delete") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <application-associations
      v-if="process.id"
      ref="associationsDialog"
      :title="$t('copyAndCreate')"
      :current-app="process"
      @onItemClick="onAssociationItemClick"
      :process-deployment-id="process.deploymentId"
      :process-def-key="process.key"
    />
    <involved-user-dialog-mobile
      ref="involvedUserDialogRef"
      :read-only="instance && instance.startUserId && instance.startUserId!==userId"
      :resource-id="instance.id"
      :off-line="false" />
  </div>
</template>
<script>
import processRequest from "@/api/process";
import instanceRequest from "@/api/instance";
import ProcessTimeLine from "@/components/common/ProcessTimeLine";
import userRequest from "@/api/user";
import AppDetailCommon from "@/components/common/application/mixins/AppDetail";
import ApplicationInstanceMessage from "@/components/common/application/ApplicationInstanceMessage";
import InvolvedUserDialogMobile from "@/components/common/involveduser/InvolvedUserDialogMobile";

export default {
  props: {
    id: {
      type: String
    }
  },
  mixins: [AppDetailCommon],
  data() {
    return {
      comments: [],
      comment: {
        item: {},
        display: false
      },
      instance: {},
      deleteDialog: {
        display: false
      }
    };
  },
  methods: {
    onAddCommentBtnClick(){
      this.$refs.applicationInstanceMessage.startSend();
    },
    onClickAddInvolvedUser() {
      let self = this;
      self.$refs.involvedUserDialogRef.show(true);
    },
    onCopyAddClick() {
      let self = this;
      let associationsRef = self.$refs.associationsDialog;
      if (associationsRef) {
        associationsRef.show(true);
      }
    },
    onAssociationItemClick(association) {
      // 复制创建
      this.$emit("openStartProcessDrawer", { key: association.key, instanceId: this.instance.id });
    },
    onClickProcessDefKey(key) {
    },
    async getData() {
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
      await this.$store.dispatch("common/setAppBarIcons", [
        {
          id: "delete",
          icon: "mdi-delete-forever",
          color: "#FA4F07"
        },
        {
          id: "assign",
          icon: "mdi-account-multiple-plus-outline"
        }
      ]);
      this.instance.id = this.id;
      await this.getInstance();
      await this.$store.dispatch("common/setAppBarTitle", "");
      await this.$store.dispatch("common/setCurrentNavigation", "form");
    },

    async getInstance() {
      await this.$store.dispatch("common/setPageLoading", true);

      let instance;
      try {
        instance = await instanceRequest.getInstance(this.instance.id);
      } catch (err) {
        this.$notify.error(this.$t("currentInstanceHaveNoAndGoHome"));
        this.$router.replace({
          name: "index"
        });
      }
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
      instance.iconColor = icon.color;
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
    async deleteInstance() {
      await this.$store.dispatch("common/setPageLoading", true);
      await this.stopInstance(this.instance);
      this.deleteDialog.display = false;
      this.$notify.success({ title: this.$t("success"), message: this.$t("deleteInstanceSuccess") });
      await this.$store.dispatch("common/setPageLoading", false);
      this.$emit("onDeleteSuccess");
    },
    showDelete(){
      this.deleteDialog.display = true;
    }
  },
  watch: {
    id: {
      async handler() {
        await this.getData();
      },
      immediate: true
    },
    "$store.state.common.currentNavigation": {
      async handler(value) {
        if (value === "form") {
          await this.getForm(this.instance.processDefinitionId);
        } else if (value === "history") {
        } else if (value === "comment") {
          if (this.$refs.applicationInstanceMessage) {
            await this.$refs.applicationInstanceMessage.getComments();
          }
        }
      }
    }
  },
  computed: {
    userName() {
      return `${this.$store.state.user.profile.firstName} ${this.$store.state.user.profile.lastName}`;
    }
  },
  components: {
    ProcessTimeLine,
    ApplicationInstanceMessage,
    InvolvedUserDialogMobile
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
</style>
