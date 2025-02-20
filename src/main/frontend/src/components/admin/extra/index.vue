<template>
  <iframe :src="url" style="width: 100vw;height: calc(100vh - 48px);margin-left: -15px;margin-top: -8px" />
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      url: this.$route.name==="extra-report"?this.$store.getters["user/getBiUrl"]:JSON.parse(process.env.VUE_APP_EXTRA_URL)[this.$route.name],
    };
  },
  watch:{
    $route: {
      handler() {
        this.url= this.$route.name==="extra-report"?this.$store.getters["user/getBiUrl"]:JSON.parse(process.env.VUE_APP_EXTRA_URL)[this.$route.name];
      }
    }
  }
};
</script>

<style scoped>

</style>
