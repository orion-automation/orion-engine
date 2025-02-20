<template>
  <v-bottom-sheet v-model="resolveDelegtateTask.display" inset>
    <v-sheet>
      <div class="drawer-title">{{ $t('resolveTask') }}</div>
      <div class="drawer-title-line"></div>
      <div style="color: #B1ABB6;font-size: 13px;padding: 20px">
        {{ $t('resolveTaskInfo') }}
      </div>
      <div class="d-flex flex-row" style="align-items: center;padding-bottom: 20px">
        <v-spacer />
        <v-btn text @click="resolveDelegtateTask.display=false" style="color: #83829A">{{ $t('back') }}</v-btn>
        <v-btn
          text style="color: #0F40F5" @click="onResolveDelegtateTask"
          :loading="resolveDelegtateTask.commitLoading">{{ $t('commit') }}
        </v-btn>
      </div>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
import taskRequest from "@/api/task";

export default {
  props: {
    taskId: {
      type: String,
      required: true
    }
  },
  name: "TaskResolveDelegtateDialog",
  data() {
    return {
      resolveDelegtateTask: {
        display: false,
        commitLoading: false
      }
    };
  },
  methods: {
    show(show) {
      this.resolveDelegtateTask.display = true;
    },
    async onResolveDelegtateTask() {
      // 撤销授权
      let self = this;
      try {
        self.resolveDelegtateTask.commitLoading = true;
        await taskRequest.postResolveTask(self.taskId, {});
        self.$notify.success({ title: self.$t("success"), message: self.$t("resolveDelegateTaskSuccess") });
        self.$emit("onResolveDelegtateTaskSuccess");
        self.resolveDelegtateTask.display = false;
      } catch (e) {
        self.$notify.error(self.$t("resolveDelegateTaskErr"));
      } finally {
        self.resolveDelegtateTask.commitLoading = false;
      }
    }
  }
};
</script>

<style scoped>
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
</style>
