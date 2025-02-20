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
            <div class="result-title">{{ $t('createProcessSuccess') }}</div>
            <div class="result-content">{{ result.id }}</div>
          </div>
          <div v-else class="d-flex flex-column"
               style="align-items: center;justify-content: center;padding: 40px 20px">
            <v-icon size="64" color="#FA4F07" style="margin-bottom: 40px">mdi-bug</v-icon>
            <div class="result-title">{{ $t('commitErr') }}</div>
            <div class="result-content">{{ $t('commitErrInfo') }}<span
              @click="copyError"
              style="color: #FF7754;cursor: pointer;font-weight: bold">{{ $t('copy') }}</span>{{ $t('errDetail') }}
            </div>
          </div>
        </template>
        <template v-else>
          <formio
            v-if="formData"
            ref="formioNew"
            :form="formData"
            class="formioClass"
            language="zh"
            style="margin: 20px"
            :options="formOptions"
            :submission="formValue"
          ></formio>
          <div v-else class="d-flex flex-column" style="align-items: center;justify-content: center;padding: 40px 20px">
            <v-icon size="64" color="#83829A" style="margin-bottom: 40px">mdi-bandage</v-icon>
            <div class="result-title">{{ $t('resourceNotFound') }}</div>
            <div class="result-content">{{ $t('resourceNotFoundInfo') }}</div>
          </div>
        </template>
      </div>
      <div style="position: relative">
        <div
          class="d-flex flex-row"
          style="z-index: 1;align-items: center;justify-content: center;margin: auto;left: 0; top: 0; right: 0; bottom: 0;width: fit-content;position: absolute;height: 100%;font-size: 14px;color: #B1ABB6">
        </div>
        <div class="d-flex flex-row" style="align-items: center;border-top: 1px solid #E6E4E6;z-index: 2">
          <img :src="require('@/assets/svg/oriori.svg')" style="height: 35px;padding-left: 12px">
          <v-spacer />
          <div v-if="result" class="d-flex flex-row" style="align-items: center">
            <div class="submit-btn-diver" />
            <v-btn class="submit-btn" text @click="reNew">
              <v-icon color="#0F40F5" left>mdi-message-question</v-icon>
              {{ $t('createNew') }}
            </v-btn>
          </div>
          <template v-else>
            <div v-if="formData" class="d-flex flex-row" style="align-items: center">
              <div class="submit-btn-diver" />
              <v-btn class="submit-btn" text :loading="submitLoading" @click="submitForm">
                <v-icon color="#FF7754" left>mdi-send</v-icon>
                {{submitText}}
              </v-btn>
            </div>
            <div v-else class="d-flex flex-row" style="align-items: center">
              <div class="submit-btn-diver" />
              <v-btn class="submit-btn" text @click="refreshData" :loading="loading">
                <v-icon color="#0F40F5" left>mdi-refresh</v-icon>
                {{ $t('refresh') }}
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
import processRequest from "@/api/process";
import { formatVariables } from "@/utils/common";

export default {
  name: "ProcessByKey",
  components: { formio: Form },
  data() {
    return {
      formOptions: { noAlerts: true, i18n: i18n },
      formData: null,
      formValue: { data: {} },
      process: null,
      result: null,
      bg: "#f3f4f9",
      width: "70%",
      submitText:this.$t("commit"),
      loading: false,
      submitLoading: false
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
        self.formValue = { data: {} };
        self.$refs.formioNew.formio.reset();
      } catch (e) {
      }
    },
    async refreshData() {
      this.loading = true;
      let { processDefKey } = this.$route.params;
      let { bg, width, submitText } = this.$route.query;
      if (bg) {
        this.bg = `#${bg}`;
      }
      if (submitText) {
        this.submitText = `${submitText}`;
      }
      if (width) {
        try {
          width = Number(width);
          this.width = `${width > 100 ? 100 : width}%`;
        } catch (e) {
        }
      }
      try {
        this.process = await processRequest.getEnhancementProcessDefinitionByKey(processDefKey);
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
        Utils.eachComponent(self.formData.components,(component,path)=>{
          if (component.type==="fileDownload"){
            delete data[`${path}`];
          }
        });
        var variables = formatVariables(data);

        const queryData = {
          variables: variables,
          withVariablesInReturn: true
        };
        try {
          let process = await processRequest.postEnhancementOpenProcessDefinitionByIdSubmitForm(
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
  watch:{
    "$i18n.locale": {
      handler(val){
        let self=this;
        self.submitText=self.$t("commit");
      },
    },
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
