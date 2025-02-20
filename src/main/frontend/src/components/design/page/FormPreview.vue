<template>
  <div>
    <v-dialog v-model="previewDialog.display"
              :width="previewDialog.size[`${previewDialog.currentSize}`].width">
      <div class="d-flex flex-column" style="background-color: white;height: 90vh">
        <div class="d-flex flex-row" style="align-items: center;width: 100%;padding: 10px 20px;font-size: 16px">
          <span style="font-weight: bold">{{ $t('preview') }}</span>
          <v-spacer/>
          <v-btn icon @click="previewDialog.currentSize='pc'" v-if="$vuetify.breakpoint.mdAndUp">
            <v-icon :color="previewDialog.currentSize==='pc'?'#0F40F5':'#B1ABB6'">mdi-monitor</v-icon>
          </v-btn>
          <v-btn icon @click="previewDialog.currentSize='tab'" v-if="$vuetify.breakpoint.mdAndUp">
            <v-icon :color="previewDialog.currentSize==='tab'?'#0F40F5':'#B1ABB6'">mdi-tablet</v-icon>
          </v-btn>
          <v-btn icon @click="previewDialog.currentSize='mobile'">
            <v-icon :color="previewDialog.currentSize==='mobile'?'#0F40F5':'#B1ABB6'">mdi-cellphone</v-icon>
          </v-btn>
        </div>
        <div style="height: 0;flex: 1;">
          <iframe :src="`${preUrl}form-preview/${formId}`"
                  ref="refIframe"
                  v-if="previewDialog.display"
                  style="height: 100%;max-width: 100%"
                  :style="{width:`${previewDialog.size[`${previewDialog.currentSize}`].width}px`}"/>
        </div>
        <div class="d-flex flex-row" style="align-items: center;padding: 10px 20px">
          <v-spacer></v-spacer>
          <v-btn text @click="previewDialog.display=false" color="#FF7754">{{ $t('close') }}</v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import {Form} from "vue-formio-eorion";

export default {
  components: {vueFormio: Form},
  name: "FormPreview",
  props: {
    formBuilder: {
      type: Object,
    },
    formId: {
      type: String
    }
  },
  computed: {
    preUrl() {
      return `${window.location.href.split("#/")[0]}#/`;
    }
  },
  data() {
    return {
      previewDialog: {
        display: false,
        size: {
          pc: {width: 1200, height: 600},
          tab: {width: 900, height: 600},
          mobile: {width: 350, height: 600}
        },
        currentSize: this.$vuetify.breakpoint.mdAndDown ? "mobile" : "pc",
      }
    };
  },
  methods: {
    show() {
      this.previewDialog.display = true;
    }
  }
};
</script>

<style scoped>

</style>
