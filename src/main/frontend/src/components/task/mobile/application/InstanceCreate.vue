<template>
  <div style="padding: 0 0 0 0">
    <v-banner v-model="topBanner.display" transition="slide-y-transition">
      <div class="d-flex flex-row" style="align-items: center">
        <v-icon left color="#5a928d">mdi-check-circle</v-icon>
        {{ $t(topBanner.multi ? "taskCompleteNextNew" : "taskCompleteNextNew") }}
      </div>
      <template v-slot:actions="{ dismiss }">
        <v-btn
          text
          color="primary"
          @click="onTaskNextCancel(dismiss)"
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
    <v-card class="content" outlined>
      <div class="form-head" style="margin: 18px 10px 0 10px">
        <div class="d-flex">
          <v-icon size="20" color="#0F40F5" class="business-icon">
            mdi-account-multiple-plus-outline
          </v-icon>
          <v-text-field
            hide-details
            dense
            v-model="businessKey"
            :placeholder="$t('inputTopic')"
            style="font-size: 14px; margin-top: 0; height: 100%"
          ></v-text-field>
        </div>

        <div
          class="formioClass"
          style="margin: 10px 0 0 0; padding-bottom: 10px"
        >
          <formio
            v-if="formData"
            ref="formioNew"
            :form="formData"
            language="zh"
            :options="formOptions"
            :submission="formValue"
          ></formio>
        </div>
      </div>
    </v-card>
    <v-btn
      @click="add"
      style="
        background-color: #0f40f5;
        width: 50px;
        height: 50px;
        bottom: 80px;
        position: fixed;
      "
      color="#FFFFFF"
      text
      raised
      rounded
      fixed
      fab
      elevation="6"
      :loading="addLoading"
      large
      right
    >
      <v-icon>mdi-send</v-icon>
    </v-btn>
    <involved-user-dialog-mobile
      ref="involvedUserDialogRef"
      :read-only="false"
      :off-line="true" />
    <v-menu
      v-model="setInvolvedUserMenu.display"
      :position-x="screenWidth - 50"
      :position-y="50"
      absolute
      offset-y>
      <v-list
        style="cursor: pointer; padding: 0px 0px"
        class="menu-list"
        dense
      >
        <v-list-item>
          <v-list-item-title
            @click="onClickAddInvolvedUser"
          >
            <span>{{ $t('addInviter') }}</span>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
<script>
import AppCreateCommon from "@/components/common/application/mixins/AppCreate";
import InvolvedUserDialogMobile from "@/components/common/involveduser/InvolvedUserDialogMobile";
import i18n from "@/utils/i18n";
import taskRequest from "@/api/task";

export default {
  components: { InvolvedUserDialogMobile },
  mixins: [AppCreateCommon],
  data() {
    return {
      setInvolvedUserMenu: {
        display: false
      },
      formOptions:{ noAlerts: true,i18n:i18n },
      topBanner: {
        display: false,
        multi: false
      }
    };
  },
  watch: {
    "$store.state.common.currentAppBarIcon": {
      async handler(value) {
        let self=this;
        if (value === "scan") {
          let str="";
          self.$copyText(str).then(function (e) {
            self.$notify.success({ title: self.$t("success"), message: self.$t("scanResultHasCopyToClip") });
          }, function (e) {
          });
        }
        if (value === "save") {
          this.saveDraft();
        }
        if (value === "delete") {
          this.setInvolvedUserMenu.display = true;
        }
        await this.$store.dispatch("common/setCurrentAppBarIcon", "");
      }
    }
  },
  methods: {
    onClickAddInvolvedUser() {
      let self = this;
      self.$refs.involvedUserDialogRef.show(true);
    },
    onTaskNextCancel(dismiss){
      let self = this;
      dismiss();
      let target = this.$route.query.taskId
        ? {
          name: "task-detail",
          params: { id: this.$route.query.taskId }
        }
        : {
          name: "application-detail",
          params: { key: this.process.key }
        };
      self.$router.replace(target);
    },
    async onTaskNextClick() {
      let self = this;
      if (self.topBanner.multi) {
        // 跳转任务列表
        self.topBanner.display = false;
        self.$router.replace({
          name:"task-list",
          query: {
            processInstanceId: self.instanceNew.id,
            assignee: self.userId
          }
        });
      } else {
        // 跳转其他task
        let tasks = await taskRequest.postTaskList("", {},
          {
            processInstanceId: self.instanceNew.id,
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
    async onAddSuccess() {
      let self = this;
      // 获取实例任务数目
      let taskCount = await taskRequest.postTaskCount("", {}, {
        processInstanceId: self.instanceNew.id,
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
        self.$notify.success({ title: self.$t("success"), message: self.$t("createInstanceSuccess") });
        let target = this.$route.query.taskId
          ? {
            name: "task-detail",
            params: { id: this.$route.query.taskId }
          }
          : {
            name: "application-detail",
            params: { key: this.process.key }
          };
        self.$router.replace(target);
      }
    }
  },
  computed: {
    screenWidth() {
      return document.body.clientWidth;
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
