<template>
  <iframe style="" class="report-container" :src="$route.query.url"></iframe>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
  async mounted() {
    await this.$store.dispatch("common/setNavigations", []);
    await this.$store.dispatch("common/setAppBarIcons", []);
    await this.$store.dispatch("common/setAppBarTitle", this.$route.query.name);
  },
};
</script>

<style>
.report-container {
  width: 100%;
  height: 100%;
  overflow-y: hidden;
}
</style>
