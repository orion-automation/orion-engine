<template>
  <v-card>
    <v-card-title>联系流程专家获取支持</v-card-title>
    <v-card-text>
      <v-form ref="form" lazy-validation>
        <v-row style="margin: 0">
          <v-col style="padding: 0" cols="12">
            <v-text-field
              :label="$t('contact')"
              :placeholder="$t('plsEnterContact')"
              v-model="support.name"
              hide-details
              @keydown.enter="()=>{}"
            />
          </v-col>
          <v-col style="padding: 0" cols="12">
            <v-text-field
              :label="$t('email')"
              :placeholder="$t('plsEnterEmail')"
              v-model="support.email"
              hide-details
              @keydown.enter="()=>{}"
            />
          </v-col>
          <v-col style="padding: 0" cols="12">
            <v-textarea rows="3" :label="$t('remark')" :placeholder="$t('plsEnterRemark')" hide-details />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn text>{{ $t('close') }}</v-btn>
      <v-btn text color="#0F40F5">{{ $t('send') }}</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import utils from "@/utils/utils";

export default {
  props: {
    support: {
      type: Object,
      required: true,
    },
  },
  components: {},
  computed: {
    userName() {
      return (
        this.$store.state.user.profile.firstName +
        " " +
        this.$store.state.user.profile.lastName
      );
    },
    userId() {
      return this.$store.state.user.profile.id;
    },
  },
  data() {
    return {};
  },
  watch: {},
  methods: {},
};
</script>

<style scoped></style>
