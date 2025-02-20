<template>
  <div style="height: 100%;width: 100%;overflow-y: auto;padding-left: 20px;padding-right: 10px">
    <vue-formio
        style="overflow-y: auto"
        :form="formBuilder.form"
        v-if="formBuilder.show"
        :options="formBuilder.options"
        language="zh"
        class="formioClass"
        :submission="formBuilder.formValue"
    />
  </div>
</template>

<script>
import i18n from "@/utils/i18n";
import formRequest from "@/api/form";
import {Form} from "vue-formio-eorion";

export default {
  name: "FormRender",
  components: {vueFormio: Form},
  data() {
    return {
      formBuilder: {
        form: {components: []},
        options: {
          language: this.$i18n.locale, noDefaultSubmitButton: true, i18n: i18n,
        },
        show: false,
      }
    };
  },
  async mounted() {
    let formResult = await formRequest.getFormDetail(this.$route.params.id);
    this.formBuilder.form.components = formResult.formData;
    this.formBuilder.show = true;
  }
};
</script>

<style scoped>

</style>
