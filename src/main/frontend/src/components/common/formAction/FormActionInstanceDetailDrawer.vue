<template>
  <v-navigation-drawer
    absolute
    v-model="setting.display"
    :width="editDrawer.width"
    temporary
    stateless
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
                 @click="goBack">
            <v-icon size="18"
                    color="#1976d2">
              mdi-arrow-left
            </v-icon>
          </v-btn>
          <v-spacer />
          <v-divider vertical />
          <v-btn
            text
            style="border-right: none; font-weight:normal; color:#444262"
            height="48"
            @click="$refs.taskDetailRef.showDelete()"
            color="#FA4F07"
          >
            <v-icon left small color="#FA4F07">mdi-delete-forever</v-icon>
            {{ $t("delete") }}
          </v-btn>
          <v-divider vertical />
          <v-btn
            text
            style="border-right: none; font-weight:normal; color:#444262"
            height="48"
            @click="$refs.taskDetailRef.onClickAddInvolvedUser()"
            color="#312651"
          >
            <v-icon left small color="#312651">mdi-account-multiple-plus-outline</v-icon>
            {{ $t("addInviter") }}
          </v-btn>
          <v-divider vertical />
          <v-btn
            text
            style="border-right: none; font-weight:normal; color:#444262"
            height="48"
            @click="$refs.taskDetailRef.onCopyAddClick()"
            color="#0f40f5"
          >
            <v-icon left small color="#0f40f5">mdi-content-copy</v-icon>
            {{ $t("copyAndCreate") }}
          </v-btn>
        </div>
      </v-app-bar>
      <div style="flex: 1;height: 0;overflow-y: auto;padding-left: 15px;padding-right: 15px;">
        <v-main>
          <InstanceDetail :id="action.id"
                          v-if="action.id"
                          ref="taskDetailRef"
                          @onDeleteSuccess="goBack"
                          @openStartProcessDrawer="openStartProcessDrawer" />
        </v-main>
        <v-bottom-navigation
          absolute
          horizontal
          style="height: 64px"
          v-if="$store.state.common.navigations.length
      "
        >
          <v-btn
            @click="navigate(navigation.id)"
            text
            class="navigation-button"
            v-for="navigation in $store.state.common.navigations"
            :key="navigation.id"
            :class="{
          current: navigation.id == $store.state.common.currentNavigation,
        }"
          >
        <span>
          <span class="name">{{ navigation.name }}</span>
          <span class="badge" v-if="navigation.count">{{
              navigation.count
            }}</span></span
        >
          </v-btn>
        </v-bottom-navigation>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script>

import InstanceDetail from "@/components/task/mobile/application/InstanceDetailNoRote";

export default {
  name: "FormActionInstanceDetailDrawer",
  props: {
    action: {
      type: Object
    }
  },
  components: { InstanceDetail },
  data() {
    return {
      printObj: {
        id: "formTaskDetail",
        popTitle: "",
        extraCss: `${process.env.VUE_APP_ROOT_BASE_API}css/print.css`,
        preview: true,
        extraHead: "<meta http-equiv=\"Content-Language\" content=\"zh-cn\"/>"
      },
      editDrawer: {
        width: "500",
        expand: false
      },
      formData: null,
      formValue: {},
      fieldsValue: {},
      process: {},
      setting: {
        display: false,
        commitLoading: false
      },
      userId: this.$store.state.user.profile.id,
      userName: this.$store.getters["user/getUserName"],
      tenantId: this.$store.getters["user/getTenant"].id
    };
  },
  mounted() {
    let self = this;
    let height = window.outerWidth;
    self.editDrawer.width = self.editDrawer.expand ? height * 0.67 : height * 0.5;
  },
  methods: {
    goBack() {
      let self = this;
      if (self.action.sourceDrawer && self.action.sourceDrawer.length > 0) {
        this.$emit("onInstanceDetailBack");
      } else {
        self.show(false);
      }
    },
    openStartProcessDrawer(payload) {
      this.$emit("openStartProcessDrawer", payload);
    },
    async navigate(id) {
      await this.$store.dispatch("common/setCurrentNavigation", id);
    },
    async toggleIcon(id) {
      await this.$store.dispatch("common/setCurrentAppBarIcon", id);
    },
    getShow() {
      return this.setting.display;
    },
    async show(show) {
      this.setting.display = show;
    },
    setExpand() {
      let self = this;
      self.editDrawer.expand = !self.editDrawer.expand;
      let height = window.outerWidth;
      self.editDrawer.width = self.editDrawer.expand ? height * 0.67 : height * 0.5;
    }
  },
  watch: {
    "setting.display": {
      handler(val) {
        if (!val) {
          this.$store.dispatch("common/setEditInstanceId", "");
        } else {
          if (this.$refs.taskDetailRef) {
            this.$refs.taskDetailRef.getData();
          }
        }
      },
      deep: true
    }
  }
};
</script>

<style scoped>
/deep/ .toolbar .v-badge .app-bar-icon {
  margin-right: 12px;
  margin-left: 12px;
}

/deep/ .toolbar .app-bar-icon {
  margin-right: 12px;
  margin-left: 12px;
}

/deep/ .toolbar {
  border-left: 1px solid #e6e4e6 !important;
  border-top: 1px solid #e6e4e6 !important;
  z-index: 200 !important;
}


.navigation-button span.badge {
  background-color: #e6e4e6;
  color: #83829a;
  margin-left: 5px;
  margin-right: 0;
  vertical-align: middle;
}

.navigation-button.current span.badge {
  background-color: #0f40f5;
  color: #ffffff;
}

.navigation-button span.name {
  color: #b1abb6;
}

.navigation-button.current span.name {
  color: rgba(68, 66, 98, 1);
  font-weight: bold;
}
</style>
