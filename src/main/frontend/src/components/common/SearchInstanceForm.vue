<template>
  <v-card max-height="100%" style="margin: 12px;z-index: 10">
    <v-card-title style="color: #444262">{{ $t('filter') }}</v-card-title>
    <v-card-text style="height: calc(100vh - 188px);overflow-y: auto">
      <div
        style="
              margin: -10px;
              padding: 10px;
              background-color: white;
            "
      >
        <Form id="formData" />
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" text @click="onFilterCancel">{{ $t('cancel') }}</v-btn>
      <v-btn color="primary" text @click="onFilterClear">{{ $t('reset') }}</v-btn>
      <v-btn color="#FF7754" @click="onFilterOk" style="color: #fff">
        {{ $t('query') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>

import { Form } from "vue-formio-eorion";
export default {
  name: "SearchInstanceForm",
  components: {Form},
  methods:{
    onFilterCancel(){
      this.$emit("onFilterCancel");
    },
    onFilterClear(){
      this.$emit("onFilterClear");
    },
    onFilterOk(){
      this.$emit("onFilterOk",);
    }
  }
};
</script>

<style scoped>

</style>
