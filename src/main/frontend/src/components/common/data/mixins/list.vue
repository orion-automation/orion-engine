<template>
  <div />
</template>

<script>

import debounce from "lodash/debounce";
import userRequest from "@/api/user";
import camundaRequest from "@/api/camunda-service";
import InfiniteLoading from "vue-infinite-loading";
import utils from "@/utils/utils";
import ApplicationInstanceDataItem from "@/components/common/application/ApplicationInstanceDataItem";

export default {
  name: "List",
  components: {
    InfiniteLoading,
    ApplicationInstanceDataItem
  },
  data() {
    this.onSearch = debounce(this.getDataCount, 800);
    return {
      utils,
      searchVal: "",
      dataList: {
        items: [],
        infiniteId: +new Date(),
        count: "",
        pageSize: 10
      },
      userId: "",
      groups: null,
      autoSelect: false
    };
  },
  async mounted() {
    await this.$store.dispatch("common/setAppBarTitle", this.$t("data"));
    await this.$store.dispatch("common/setAppBarIcons", []);

    this.userId = this.$store.state.user.profile.id;
    let groups = await userRequest.getGroupList({
      member: this.userId
    });
    this.groups = groups;
    await this.onMounted();
  },
  computed: {
    dataFilter() {
      let filter = {
        tenant: this.$store.state.user.tenant,
        type: "ux",
        category: "bpezAppReport",
        nameLike: this.searchVal
      };
      if (this.groups) {
        filter.groups = this.groups.map((group) => group.id);
      }
      return filter;
    }
  },
  methods: {
    onMounted() {
      this.getDataCount();
    },
    async getDataCount() {
      let { count } = await camundaRequest.getApplicationCount(this.dataFilter);
      this.dataList.count = count;

      this.dataList.items = [];
      this.dataList.infiniteId += 1;
    },
    async getDataList($state) {
      let datas = await camundaRequest.getApplications(
        {
          firstResult: this.dataList.items.length,
          maxResults: this.dataList.pageSize
        },
        this.dataFilter
      );
      if (!(this.data && this.data.id)) {
        if (this.autoSelect && datas.length > 0) {
          // 自动选择第一个
          this.onDataItemClick(datas[0]);
        }
      }
      this.dataList.items = this.dataList.items.concat(datas);
      $state.loaded();
      if (this.dataList.items.length >= this.dataList.count) {
        $state.complete();
      }
    },
    resetSearch() {
      this.searchVal = "";
      this.onSearchCommit();
    }
  }
};
</script>

<style scoped>

</style>
