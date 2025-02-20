<template>
  <v-dialog v-model="setFollowDialog.display" max-width="600" :scrollable="mobileMode">
    <v-card>
      <v-card-title>
        {{ $t('setFollowTime') }}
      </v-card-title>
      <v-card-text>
        <div class="d-flex" :class="mobileMode?'flex-column':'flex-row'" style="gap: 30px">
          <vc-date-picker mode="dateTime"
                          :style="mobileMode?{'width':'100%'}:{}"
                          is24hr v-model="setFollowDialog.form.followupDate" />
          <div class="d-flex flex-column" :style="mobileMode?{}:{'height':'335px','width':'250px'}">
            <v-text-field
              v-model="setFollowDialog.form.title" hide-details dense
              :placeholder="$t('notifyTitle')"></v-text-field>
            <v-radio-group
              v-model="setFollowDialog.form.importance" row dense hide-details
              style="margin-bottom: 20px">
              <v-radio :label="$t('normal')" value="普通" />
              <v-radio :label="$t('important')" value="重要" />
            </v-radio-group>
            <v-textarea v-model="setFollowDialog.form.remark" :placeholder="$t('inputNotifyDesc')" outlined></v-textarea>
            <v-spacer />
            <div class="d-flex flex-row" v-if="!mobileMode">
              <v-spacer />
              <v-btn text @click="setFollowDialog.display=false" small>
                {{ $t('cancel') }}
              </v-btn>
              <v-btn
                @click="onFollowCommitClick"
                :loading="setFollowDialog.commitLoading"
                small color="#FF7754" class="text-white">
                {{ $t('add') }}
              </v-btn>
            </div>
          </div>
        </div>
      </v-card-text>
      <v-card-actions v-if="mobileMode">
        <v-spacer />
        <v-btn text @click="setFollowDialog.display=false" small>
          {{ $t('cancel') }}
        </v-btn>
        <v-btn
          @click="onFollowCommitClick"
          :loading="setFollowDialog.commitLoading"
          small color="#FF7754" class="text-white">
          {{ $t('add') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import processRequest from "@/api/process";
import taskRequest from "@/api/task";
import moment from "moment";

export default {
  name: "FlowCalendarDialog",
  props: {
    mobileMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      setFollowDialog: {
        display: false,
        commitLoading: false,
        form: {
          title: "",
          importance: "普通",
          remark: "",
          followupDate: new Date()
        },
        type: "",
        extraData: {}
      }
    };
  },
  methods: {
    show(show, type, extraData, defaultDate) {
      this.setFollowDialog.type = type;
      this.setFollowDialog.extraData = extraData;
      this.setFollowDialog.form = {
        title: "",
        importance: "普通",
        remark: "",
        followupDate: defaultDate ? moment(defaultDate).toDate() : new Date()
      };
      this.setFollowDialog.display = show;
    },
    async onFollowCommitClick() {
      //提交跟进
      let self = this;
      // 校验
      if (!self.setFollowDialog.form.title) {
        self.$notify.error(self.$t("plsInputFollowTitle"));
        return;
      }
      self.setFollowDialog.commitLoading = true;
      let variables = {
        startUserId: {
          value: self.userId,
          type: "String"
        },
        followupType: {
          value: self.setFollowDialog.type,
          type: "String"
        },
        title: {
          value: self.setFollowDialog.form.title,
          type: "String"
        },
        remarks: {
          value: self.setFollowDialog.form.remark,
          type: "String"
        },
        importance: {
          value: self.setFollowDialog.form.importance,
          type: "String"
        },
        followupDate: {
          value: self.setFollowDialog.form.followupDate.toISOString(),
          type: "String"
        }
      };
      Object.keys(self.setFollowDialog.extraData).forEach(key => {
        variables[`${key}`] = {
          value: self.setFollowDialog.extraData[`${key}`],
          type: "String"
        };
      });
      if (self.setFollowDialog.type === "userTask") {
        let task = await taskRequest.getTaskById(self.setFollowDialog.extraData.originalTaskId);
        await taskRequest.putUpdateTask(task.id, Object.assign(task, { followUp: moment(self.setFollowDialog.form.followupDate).format("yyyy-MM-DDTHH:mm:ss.SSSZZ") }));
      }
      processRequest.startProcess("bpez_Process_taskfollowup", {
        variables: variables,
        businessKey: self.setFollowDialog.form.title
      }).then(async response => {
        self.$emit("onFollowSuccess", self.setFollowDialog.form);
        self.setFollowDialog.display = false;
        self.setFollowDialog.commitLoading = false;
        self.$notify.success({ title: self.$t("success"), message: self.$t("setFollowSuccess") });
      }).catch(err => {
        self.$message.error(`${err.response.status}:${err.response.data.message}`);
        self.setFollowDialog.commitLoading = false;
      });
    }
  }
};
</script>

<style scoped>

</style>
