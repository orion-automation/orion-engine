<template>
  <div class="d-flex flex-row" style="height: 100%;justify-content: center"
       :style="{backgroundColor:bg}">
    <v-spacer v-if="$vuetify.breakpoint.mdAndUp" style="flex: 1" />
    <div class="d-flex flex-column"
         :style="{width:width}"
         style="border: 1px solid #E6E4E6;border-radius: 6px;height: fit-content;background-color: white;margin-top: 16px;margin-bottom: 64px">
      <div style="overflow-y: auto;max-height: calc(100% - 50px)">
        <template v-if="result">
          <div v-if="result.success" class="d-flex flex-column"
               style="align-items: center;justify-content: center;padding: 40px 20px">
            <v-icon size="64" color="#57928D" style="margin-bottom: 40px">mdi-check-underline-circle</v-icon>
            <div class="result-title">{{ $t("commitTaskSuccess") }}</div>
            <div class="result-content">{{ result.id }}</div>
          </div>
          <div v-else class="d-flex flex-column"
               style="align-items: center;justify-content: center;padding: 40px 20px">
            <v-icon size="64" color="#FA4F07" style="margin-bottom: 40px">mdi-bug</v-icon>
            <div class="result-title">{{ $t("commitErr") }}</div>
            <div class="result-content">{{ $t("commitErrInfo") }}<span
              @click="copyError"
              style="color: #FF7754;cursor: pointer;font-weight: bold">{{ $t("copy") }}</span>{{ $t("errDetail") }}
            </div>
          </div>
        </template>
        <template v-else>
          <div class="d-flex flex-column" v-if="formData" style="margin: 20px">
            <div style="color: #444262;font-size: 18px;font-weight: bold;margin-bottom: 8px">{{ process.name }}</div>
            <div style="color: #83829A;font-size: 14px" class="d-flex flex-row">{{ dueDateText }} :
              <div style="color: #1749f1;font-weight: bold;margin-left: 5px">
                {{ process.due != null ? utils.formatDateTime(process.due, "YYYY-MM-DD HH:mm") : "--:--" }}
              </div>
            </div>
            <div style="color: #444262;font-size: 14px;margin-top: 5px"
                 v-if="process.description&&process.description.length>0">
              {{ process.description }}
            </div>
            <formio
              ref="formioNew"
              :form="formData"
              language="zh"
              class="formioClass"
              style="margin-top: 20px;overflow-y: auto"
              :options="formOptions"
              :submission="formValue"
            ></formio>
          </div>
          <div v-else class="d-flex flex-column" style="align-items: center;justify-content: center;padding: 40px 20px">
            <v-icon size="64" color="#83829A" style="margin-bottom: 40px">mdi-bandage</v-icon>
            <div class="result-title">{{ $t("resourceNotFound") }}</div>
            <div class="result-content">{{ $t("resourceNotFoundInfo") }}</div>
          </div>
        </template>
      </div>
      <div style="position: relative">
        <div
          class="d-flex flex-row"
          v-if="!$vuetify.breakpoint.xs&&(!result||(result&&!result.success))"
          style="z-index: 1;align-items: center;justify-content: center;margin: auto;left: 0; top: 0; right: 0; bottom: 0;width: fit-content;position: absolute;height: 100%;font-size: 14px;color: #B1ABB6">
        </div>
        <div class="d-flex flex-row" style="align-items: center;border-top: 1px solid #E6E4E6;z-index: 2">
          <img :src="require('@/assets/svg/oriori.svg')" style="height: 35px;padding-left: 12px">
          <v-spacer />
          <div v-if="result" class="d-flex flex-row" style="align-items: center">
            <div
              class="d-flex flex-row"
              style="align-items: center;justify-content: center;width: fit-content;height: 100%;font-size: 14px;color: #B1ABB6;padding-right: 20px">
            </div>
          </div>
          <template v-else>
            <div v-if="formData" class="d-flex flex-row" style="align-items: center">
              <div class="submit-btn-diver" />
              <v-btn class="submit-btn" text :loading="submitLoading" @click="submitForm">
                <v-icon color="#FF7754" left>mdi-send</v-icon>
                {{ submitText }}
              </v-btn>
            </div>
            <div v-else class="d-flex flex-row" style="align-items: center">
              <div class="submit-btn-diver" />
              <v-btn class="submit-btn" text @click="refreshData" :loading="loading">
                <v-icon color="#0F40F5" left>mdi-refresh</v-icon>
                {{ $t("refresh") }}
              </v-btn>
            </div>
          </template>
        </div>
      </div>
    </div>
    <v-spacer v-if="$vuetify.breakpoint.mdAndUp" style="flex: 1" />
  </div>
</template>

<script>
import i18n from "@/utils/i18n";
import { Form, Utils } from "vue-formio-eorion";
import taskRequest from "@/api/task";
import { filterFormKey, formatVariables } from "@/utils/common";
import utils from "@/utils/utils";

export default {
  name: "GuestTask",
  components: { formio: Form },
  data() {
    return {
      utils,
      formOptions: { noAlerts: true, i18n: i18n },
      formData: null,
      formValue: { data: {} },
      process: null,
      result: null,
      bg: "#f3f4f9",
      width: "70%",
      submitText: this.$t("commit"),
      dueDateText: this.$t("dueTime"),
      loading: false,
      submitLoading: false,
      valueData:{},
    };
  },
  mounted() {
    this.refreshData();
  },
  methods: {
    copyError() {
      navigator.clipboard.writeText(this.result.err);
      this.$message({
        message: this.$t("copySuccess"),
        type: "success",
        showClose:true
      });
    },
    reNew() {
      let self = this;
      this.result = null;
      try {
        self.formValue = { data: self.valueData };
        self.$refs.formioNew.formio.reset();
      } catch (e) {
      }
    },
    async refreshData() {
      this.loading = true;
      let { taskId } = this.$route.params;
      let { bg, width, submitText, dueDateText } = this.$route.query;
      if (bg) {
        this.bg = `#${bg}`;
      }
      if (submitText) {
        this.submitText = `${submitText}`;
      }
      if (dueDateText) {
        this.dueDateText = `${dueDateText}`;
      }
      if (width) {
        try {
          width = Number(width);
          this.width = `${width > 100 ? 100 : width}%`;
        } catch (e) {
        }
      }
      try {
        this.process = await taskRequest.getEnhancementOpenTaskById(taskId);
        this.valueData = {};
        let variableInstances = await taskRequest.getEnhancementOpenVariableInstance({ taskId: taskId });
        variableInstances.forEach((detail) => {
          let name = detail.variableName || detail.name;
          this.valueData[name] = detail.value;
          this.formValue.data[name]=detail.value;
          if (detail.type==="File"){
            this.valueData[name] = Object.assign(detail.valueInfo,{id:detail.id});
            this.formValue.data[name] = Object.assign(detail.valueInfo,{id:detail.id});
          }
        });
        // 二维码变量获取测试
        // this.process.formData.push({
        //   "label": "入场码",
        //   "width": 128,
        //   "align": "center",
        //   "key": "qrCode",
        //   "type": "qrCode",
        //   "value": "https://${data.name}-hh.com",
        //   "input": true,
        //   "tableView": false,
        //   "id": "e1xakep"
        // });
        // 扫码输入测试
        // this.process.formData[0].components[0].scanInput=true;
        this.formData = { components: this.process.formData };
      } catch (e) {
      } finally {
        this.loading = false;
      }
    },
    async submitForm() {
      let self = this;
      try {
        self.submitLoading = true;
        let data = {};
        if (self.$refs.formioNew && self.$refs.formioNew.formio) {
          let formResult = await self.$refs.formioNew.formio.submit();
          data = formResult.data;
        }
        let allProps=[];
        Utils.eachComponent(self.formData.components,(component,path)=>{
          if (component.type!=="fileDownload"){
            allProps.push(path);
          }
        });
        // 忽略字段
        allProps.push(...["formUserId","formUserName","tenant","tenantName","bpez_locationType","bpez_formattedAddress","bpez_location"]);
        filterFormKey(allProps,data,null);
        var variables = formatVariables(data);

        const queryData = {
          variables: variables,
          withVariablesInReturn: true
        };
        try {
          let process = await taskRequest.postEnhancementOpenSubmitTask(
            this.process.id,
            queryData
          );
          self.result = {
            success: true,
            id: process.id
          };
        } catch (err) {
          self.result = {
            success: false,
            err: `${err.response.status}:${err.response.data.message}`
          };
        }
        self.submitLoading = false;
      } catch (err) {
        self.submitLoading = false;
        console.log(err);
        let errTitle = self.$t("plsCompleteAllRequired");
        this.$notify.error(errTitle);
      }
    }
  },
  watch: {
    "$i18n.locale": {
      handler(val) {
        let self = this;
        self.submitText = self.$t("commit");
        self.dueDateText = self.$t("dueTime");
      }
    }
  }
};
</script>

<style scoped>
.submit-btn {
  color: #444262;
  border-radius: unset;
}

.submit-btn-diver {
  height: 50px;
  width: 1px;
  background-color: #E6E4E6;
}

.result-title {
  font-size: 18px;
  color: #101010;
  margin-bottom: 13px;
}

.result-content {
  font-size: 14px;
  color: #83829A;
}
</style>
