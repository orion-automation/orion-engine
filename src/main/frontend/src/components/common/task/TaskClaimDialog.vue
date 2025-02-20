<template>
  <v-dialog v-model="claimDialog.display" width="350">
    <v-card>
      <v-card-title>{{ $t('claimTask') }}</v-card-title>
      <v-card-text>{{ $t('claimTaskConfirm') }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="#83829A" text @click="claimDialog.display = false">
          {{ $t('cancel') }}
        </v-btn>
        <v-btn color="#0f40f5" text @click="onClaim()"> {{ $t('claim') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import taskRequest from "@/api/task";

export default {
  props: {
    taskId: {
      type: String,
      required: true,
    },
    ownerUserId: {
      type: String,
    },
  },
  name: "TaskClaimDialog",
  data() {
    return {
      claimDialog: {
        display: false,
      },
      userId: this.$store.state.user.profile.id,
    };
  },
  methods: {
    show(show) {
      this.claimDialog.display = show;
    },
    async onClaim() {
      await taskRequest.claimTask(this.taskId, this.ownerUserId || this.userId);
      this.$notify.success({ title: this.$t("success"), message:this.$t("claimSuccessAndStartEdit") });
      this.claimDialog.display = false;
      this.$emit("onClaimSuccess");
    },
  },
};
</script>

<style scoped></style>
