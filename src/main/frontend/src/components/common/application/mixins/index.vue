<template>
  <div>
  </div>
</template>

<script>
import utils from "@/utils/utils";
import processRequest from "@/api/process";

export default {
  name: "ApplicationMixins",
  data() {
    return {
      utils,
      infiniteId: +new Date(),
      applications: {
        itemsPerPage: 10,
        totalCount: 0,
        sortBy: "deployTime",
        sortOrder: "desc",
        nameLike: "",
        items: []
      },
      autoSelect: false,
      userId: this.$store.state.user.profile.id
    };
  },
  methods: {
    async refreshApplications() {
      this.applications.items = [];
      this.infiniteId++;
      if (this.searchDialog&&this.searchDialog.display){
        this.searchDialog.display=false;
      }
    },
    async getApplicationsPage($state) {
      let filter = this.buildFilter();

      let applications = await processRequest.getProcessByDeployment(Object.assign(filter,
        {
          firstResult: this.applications.items.length,
          maxResults: this.applications.itemsPerPage
        }));
      for (var i = 0; i < applications.length; i++) {
        let application = applications[i];
        let response = await processRequest.postInstanceCount("", null, {
          processDefinitionKey: application.key,
          variables: [
            {
              name: "startUserId",
              operator: "eq",
              value: this.userId
            }
          ]
        });
        application.count = response.count;
      }
      let processDefKeyIn = [];
      applications.forEach(association=>{
        if (!processDefKeyIn.includes(association.key)) {
          processDefKeyIn.push(association.key);
        }
      });
      // 获取流程对应icon
      let iconResults = await processRequest.getProcessIconByKeys(this.$store.getters["user/getTenant"].id, processDefKeyIn);
      applications.forEach(resource => {
        let iconResult = iconResults.find(iconResult => iconResult.appKey === resource.key);
        let icon = {  color: "#444262" };
        if (iconResult && iconResult.configJson) {
          icon.icon = `${iconResult.configJson.iconType} fa-fw ${iconResult.configJson.icon}`;
        }
        resource.icon = icon.icon;
        resource.color = icon.color;
      });
      if (!(this.process && this.process.id)) {
        if (this.autoSelect && applications.length>0) {
          // 自动选择第一个
          this.selectProcess(applications[0]);
        }
      }
      this.applications.items = this.applications.items.concat(applications);
      $state.loaded();
      if (applications.length < this.applications.itemsPerPage) {
        $state.complete();
      }
    }

  }
};
</script>

<style scoped>

</style>
