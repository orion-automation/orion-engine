<template>
  <div
    class="d-flex flex-column"
    style="width: 100%; height: 100%; border-top: 1px solid rgb(187, 187, 187)"
  >
    <div
      class="d-flex flex-row"
      style="
        width: 100%;
        padding: 14px 15px;
        font-size: 13px;
        color: #312651;
        align-items: center;
        justify-items: center;
      "
    >
      <v-breadcrumbs
        class="id-breadcrumbs"
        :items="idBreadcrumbs"
        style="background-color: #e8eff7; padding: 0; border: none"
        divider="|"
      />
      <v-chip color="#34C758" x-small class="white--text">
        <v-icon x-small>mdi-play</v-icon>
        {{ instances.totalCount }}
      </v-chip>
    </div>
    <div class="d-flex flex-row" style="width: 100%; height: 0; flex: 1">
      <div
        class="d-flex flex-column"
        style="width: 100%; height: 100%; background-color: white"
      >
        <div
          class="d-flex flex-row"
          style="
            align-items: center;
            border-top: 1px solid #b1abb6;
            border-bottom: 1px solid #b1abb6;
          "
        >
          <v-btn text @click="onAddSuccess">
            <v-icon left color="#FF7754">mdi-arrow-left</v-icon>
            {{ $t('back') }}
          </v-btn>
          <v-divider vertical />
          <div
            class="d-flex flex-row"
            style="align-items: end; gap: 6px; margin-left: 10px"
          >
            <div style="color: #101010; font-size: 14px">
              {{ process.name }}
            </div>
            <div style="color: #83829a; font-size: 12px">
              {{ process.key }}
            </div>
          </div>
        </div>
        <div
          class="d-flex flex-column"
          style="flex: 1; height: 0px; overflow-y: auto; padding: 20px"
        >
          <v-text-field
            hide-details
            dense
            v-model="businessKey"
            :placeholder="$t('inputTopic')"
            style="
              font-size: 14px;
              flex: unset;
              width: 300px;
              margin-bottom: 12px;
            "
          ></v-text-field>
          <formio
            v-if="formData"
            ref="formioNew"
            class="formioClass"
            :form="formData"
            :options="{ language: 'zh', noAlerts: true }"
            :submission="formValue"
          ></formio>
        </div>
        <div
          class="d-flex flex-row"
          style="align-items: center;border-top: 1px solid #E6E4E6;border-bottom: 1px solid #E6E4E6;height：42px"
        >
          <v-spacer />
          <v-divider vertical />
          <v-btn
            text
            @click="onClickAddInvolvedUser"
            style="font-weight: 400; padding: 0 24px"
          >
            <v-icon left color="#0F40F5"
              >mdi-account-multiple-plus-outline</v-icon
            >
            <v-badge
              color="#FF7754"
              dot
              bordered
              overlap
              :value="
                $refs.involvedUserDialogRef &&
                $refs.involvedUserDialogRef.getInvolvedUsers().length > 0
              "
            >
              {{ $t('commonUser') }}
            </v-badge>
          </v-btn>
          <v-divider vertical />
          <v-btn text style="font-weight: 400; padding: 0 24px">
            <v-icon left color="#57928D">mdi-toolbox-outline</v-icon>
            {{ $t('tool') }}
          </v-btn>
          <v-divider vertical />
          <v-btn text @click="reset" style="font-weight: 400; padding: 0 24px">
            <v-icon left color="#83829A">mdi-redo</v-icon>
            {{ $t('reset') }}
          </v-btn>
          <v-divider vertical />
          <v-btn
            text
            :loading="addLoading"
            @click="add"
            style="font-weight: 400; padding: 0 24px"
          >
            <v-icon left color="#FF7754">mdi-send</v-icon>
            {{ $t('commit') }}
          </v-btn>
        </div>
      </div>
    </div>
    <involved-user-dialog
      ref="involvedUserDialogRef"
      :read-only="false"
      :off-line="true"
    />

    <form-action-dialog
      :action="action"
      ref="formActionDialogRef"
    />
  </div>
</template>
<script>
import AppCreateCommon from "@/components/common/application/mixins/AppCreate";
import InvolvedUserDialog from "@/components/common/involveduser/InvolvedUserDialog";
import FormActionDialog from "@/components/common/formAction/FormActionDialog";

export default {
  mixins: [AppCreateCommon],
  components: { InvolvedUserDialog, FormActionDialog },
  data() {
    return {
      idBreadcrumbs: [
        {
          text: this.$t("app"),
          disabled: false,
          href: "#/task/application/list",
        },
        {
          text: "",
          disabled: false,
        },
        {
          text: "",
          disabled: true,
        },
      ],
      instances: {
        totalCount: 0,
      },
    };
  },
  methods: {
    onClickAddInvolvedUser() {
      let self = this;
      self.$refs.involvedUserDialogRef.show(true);
    },
    onAddSuccess() {
      // 添加成功,跳转到应用详情页
      this.$router.push({
        name: "task-application-detail",
        query: { key: this.process.key },
        params: { id: this.process.id },
      });
    },
  },
  watch:{
    "$i18n.locale": {
      handler(val){
        let self=this;
        self.idBreadcrumbs[0].text=self.$t("app");
      },
    },
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
