<template>
  <div>
    <v-dialog v-model="dialogError.display">
      <v-card>
        <v-card-title :title="dialogError.title" />
        <v-card-subtitle :title="dialogError.desc" />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import processRequest from "@/api/process";

export default {
  name: "IncidentDetail",
  data() {
    return {
      dialogError: {
        display: false,
        title: this.$t("notify"),
        desc: this.$t("errNotShow")
      },
      incident: {}
    };
  },
  async mounted() {
    //获取故障信息
    let self = this;
    self.incident.id = self.$route.params.id;
    try {
      self.incident = await processRequest.getIncidentNoParams(self.incident.id);
      self.$router.replace({
        name: "instance-detail",
        params: {id: self.incident.processInstanceId},
        query: {defaultIncident: self.incident.id},
      });
    } catch (e) {
      self.dialogError.display = true;
    }
  },
  watch:{
    "$i18n.locale": {
      handler(val){
        let self=this;
        self.dialogError.title = self.$t("notify");
        self.dialogError.desc = self.$t("errNotShow");
      },
    },
  }
};
</script>

<style scoped>

</style>
