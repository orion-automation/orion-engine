<template>
  <v-dialog v-model="setting.display" max-width="800">
    <v-card>
      <v-card-text style="padding-top: 24px">
        <v-banner v-model="topBanner.display" single-line transition="slide-y-transition">
          <div class="d-flex flex-row" style="align-items: center">
            <v-icon left color="#5a928d">mdi-check-circle</v-icon>
            {{ $t(topBanner.multi ? "taskCompleteNextTasks" : "taskCompleteNext") }}
          </div>
          <template v-slot:actions="{ dismiss }">
            <v-btn
              text
              color="primary"
              @click="dismiss"
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
        <formio
          v-if="formData"
          ref="formioNew"
          :form="formData"
          class="formioClass"
          :options="{ language: 'zh', noAlerts: true }"
          :submission="formValue"
        ></formio>
      </v-card-text>
      <v-card-actions style="padding-bottom: 16px">
        <v-spacer />
        <v-btn text @click="setting.display = false"> {{ $t('cancel') }} </v-btn>
        <v-btn style="color: #ffffff" color="#FF7754" @click="save()"> {{ $t('commit') }} </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import FormActionCommon from "@/components/common/formAction/mixins/index";

export default {
  name: "FormActionDialog",
  mixins: [FormActionCommon],
};
</script>

<style scoped></style>
