<template>
  <div class="d-flex flex-column" style="height: 100%">
    <v-text-field
      outlined
      v-model="searchVal"
      :placeholder="$t('inputKeyToSearch')"
      hide-details
      solo
      clearable
      @input="onSearch"
      dense
      style="margin: 20px 13px; flex: 0; background-color: white"
    />
    <v-list three-line style="padding: 0 0px; border-radius: 6px">
      <application-instance-data-item
        v-for="item in dataList.items"
        @onItemClick="onDataItemClick"
        :key="item.id"
        :item="item"
      />
    </v-list>
    <infinite-loading @infinite="getDataList" :identifier="dataList.infiniteId">
      <template #no-more>
        <div class="d-flex flex-row infinite-more-container">
          <div class="infinite-more-container-pre" />
          <div class="infinite-more-container-content">{{ $t('noMoreData') }}</div>
          <div class="infinite-more-container-pre" />
        </div>
      </template>
    </infinite-loading>
  </div>
</template>

<script>
import { myDestroyed } from "@/components/task/mobile/mixins";
import DataListCommon from "@/components/common/data/mixins/list";

export default {
  mixins: [myDestroyed, DataListCommon],
  methods:{
    onDataItemClick(item){
      this.$router.push({
        name: "application-report",
        query: { url: item.configJson.url, name: item.configJson.name },
      });
    },
  }
};
</script>

<style scoped>

.v-text-field--outlined:deep(fieldset) {
  top: 0;
}
</style>
