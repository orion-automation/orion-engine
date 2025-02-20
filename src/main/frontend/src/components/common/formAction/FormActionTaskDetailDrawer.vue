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
          <v-btn icon
                 @click="clearDrawers">
            <v-icon size="18"
                    color="#1976d2">
              mdi-close-box-multiple
            </v-icon>
          </v-btn>
          <v-spacer />
          <v-divider vertical />
          <v-btn
            text
            style="border-right: none; font-weight:normal; color:#444262"
            :disabled="!($refs.taskDetailRef&&$refs.taskDetailRef.formData&&$store.state.common.currentNavigation === 'form')"
            v-print="printObj"
            height="48"
            color="#444262"
          >
            <v-icon left small color="#FA4F07">mdi-printer-outline</v-icon>
            打印
          </v-btn>
          <v-divider vertical />
          <template v-if="$refs.taskDetailRef&&$refs.taskDetailRef.canExecute">
            <v-btn text
                   height="48"
                   style="font-weight:normal; color:#444262"
                   @click="$refs.taskDetailRef.onCommitBtnClick()">
              <v-icon
                :color="'#0F40F5'"
                left small
                size="18"
              >
                mdi-send
              </v-icon>
              {{ $t("execute") }}
            </v-btn>
            <v-divider vertical/>
          </template>
          <template v-if="$refs.taskDetailRef&&$refs.taskDetailRef.canClaim">
            <v-btn text
                   height="48"
                   style="font-weight:normal; color:#444262"
                   @click="$refs.taskDetailRef.onCommitBtnClick()">
              <v-icon
                left small
                :color="'#0F40F5'"
                size="18"
              >
                mdi-tray-arrow-down
              </v-icon>
              {{ $t("claim") }}
            </v-btn>
            <v-divider vertical/>
          </template>
          <template
            v-if="$refs.taskDetailRef"
          >
            <v-btn
              text
              height="48"
              :disabled="$refs.taskDetailRef.task.endTime || $refs.taskDetailRef.computedIsDelegatedTask"
              style="border-right: none; font-weight:normal; color:#444262"
              @click="toggleIcon('share')"
              color="#444262"
            >
              <v-icon left small color="#0F40F5">mdi-share-all</v-icon>
              {{ $t("delegate") }}
            </v-btn>
            <v-divider vertical/>
          </template>
          <template
            v-if="$store.state.common.currentNavigation === 'comment'"
          >
            <v-btn
              text
              height="48"
              style="border-right: none; font-weight:normal; color:#444262"
              @click="$refs.taskDetailRef.onCommitBtnClick()"
              color="#444262"
            >
              <v-icon left small color="#0F40F5">mdi-comment-account-outline</v-icon>
              {{ $t('commentBtnTxt') }}
            </v-btn>
            <v-divider vertical/>
          </template>
          <template v-if="$refs.taskDetailRef&&!$refs.taskDetailRef.task.endTime">
            <v-btn
              text
              height="48"
              :key="`task-priority-${$refs.taskDetailRef.task.priority}`"
              style="border-right: none; font-weight:normal; color:#444262"
              @click="toggleIcon('priority')"
              color="#444262"
            >
              <v-icon left small
                      :color="$refs.taskDetailRef.judgePriority($refs.taskDetailRef.task.priority).iconColor">
                {{ $refs.taskDetailRef.judgePriority($refs.taskDetailRef.task.priority).icon }}
              </v-icon>
              {{ $t("priority") }}
            </v-btn>
            <v-divider vertical />
          </template>
          <template v-if="$refs.taskDetailRef&&!$refs.taskDetailRef.task.endTime&&$refs.taskDetailRef.formKey">
            <v-btn
              text
              height="48"
              style="border-right: none; font-weight:normal; color:#444262"
              @click="toggleIcon('save')"
              color="#444262"
            >
              <v-icon left small
                      color="#444262">
                mdi-content-save
              </v-icon>
              {{ $t("save") }}
            </v-btn>
          </template>
        </div>
      </v-app-bar>
      <div style="flex: 1;height: 0;overflow-y: auto;padding-left: 15px;padding-right: 15px;">
        <v-main>
          <TaskDetail :id="action.taskId"
                      @routerToTaskList="routerToTaskList"
                      v-if="action.taskId"
                      ref="taskDetailRef"/>
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

import TaskDetail from "@/components/task/mobile/task/DetailNoRoute";

export default {
  name: "FormActionTaskDetailDrawer",
  props: {
    action: {
      type: Object
    }
  },
  components: { TaskDetail },
  data() {
    return {
      printObj: {
        id: "formTaskDetail",
        popTitle: "",
        extraCss: `${process.env.VUE_APP_ROOT_BASE_API}css/print.css`,
        preview: true,
        extraHead: "<meta http-equiv=\"Content-Language\" content=\"zh-cn\"/>",
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
      tenantId: this.$store.getters["user/getTenant"].id,
    };
  },
  mounted() {
    let self=this;
    let height = window.outerWidth;
    self.editDrawer.width = self.editDrawer.expand ? height * 0.67 : height * 0.5;
  },
  methods: {
    routerToTaskList(payload){
      this.$emit("routerToTaskList",payload);
    },
    clearDrawers(){
      this.$emit("clearDrawers");
    },
    goBack() {
      let self = this;
      if (self.action.sourceDrawer && self.action.sourceDrawer.length > 0) {
        this.$emit("onTaskDetailBack");
      } else {
        self.show(false);
      }
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
      if (!show && this.$refs.taskDetailRef){
        this.$refs.taskDetailRef.topBanner.display = false;
      }
      this.setting.display = show;
      if (show){
        this.$refs.taskDetailRef.task.id=this.action.taskId;
        this.$refs.taskDetailRef.getData();
      }
    },
    setExpand() {
      let self = this;
      self.editDrawer.expand = !self.editDrawer.expand;
      let height = window.outerWidth;
      self.editDrawer.width = self.editDrawer.expand ? height * 0.67 : height * 0.5;
    },
  },
  watch: {
    action: {
      handler(val) {
        if (this.setting.display) {
          this.show(true);
        }
      },
      deep: true
    },
    "setting.display":{
      handler(val) {
        if (!val) {
          this.$store.dispatch("common/setEditTaskId","");
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
