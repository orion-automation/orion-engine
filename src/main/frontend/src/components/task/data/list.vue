<template>
  <div class="d-flex flex-column" style="width: 100%; height: 100%;border-top: 1px solid rgb(187, 187, 187)">
    <div
      class="d-flex flex-row"
      style="
        height: 48px;
        width: 100%;
        padding: 0px 15px;
        font-size: 13px;
        color: #312651;
        align-items: center;
        justify-items: center;
      "
    >
      <v-breadcrumbs
        class="id-breadcrumbs" :items="idBreadcrumbs"
        style="background-color: #e8eff7;padding: 0;border: none" divider="|" />
      <span class="badge badge-app">
        <v-icon size="15" left color="white">mdi-finance</v-icon>{{
          totalCount
        }}</span>
    </div>
    <div class="d-flex flex-row" style="width: 100%; height: 0; flex: 1">
      <v-navigation-drawer v-model="drawerOpen" :width="drawerOpen ? 350 : 0" mobile-breakpoint="0">
        <div
          class="d-flex flex-row custom-drawer-item"
          style="
            padding: 0 15px;
            gap: 20px;
            height: 43px;
            position: absolute;
            width: 349px;
            z-index: 1;
            opacity: 1;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 1);
          "
        >
          <v-badge bordered dot overlap color="#FF7754" :value="searchVal">
            <v-icon
              class="custom-drawer-item-icon"
              size="18"
              @click="searchDialog.display = true">mdi-card-search-outline
            </v-icon>
          </v-badge>
        </div>
        <div style="height: 43px"></div>
        <v-list three-line style="padding: 0 0px; border-radius: 6px">
          <application-instance-data-item
            v-for="item in dataList.items"
            @onItemClick="onDataItemClick"
            :selected="data&&data.id===item.id"
            :key="item.id"
            :item="item"
          />
        </v-list>
        <infinite-loading @infinite="getDataList" :identifier="dataList.infiniteId" v-if="groups!==null">
          <template #no-more>
            <div class="d-flex flex-row infinite-more-container">
              <div class="infinite-more-container-pre" />
              <div class="infinite-more-container-content">{{ $t('noMoreData') }}</div>
              <div class="infinite-more-container-pre" />
            </div>
          </template>
        </infinite-loading>
      </v-navigation-drawer>
      <div
        class="d-flex flex-column"
        style="width: 0; flex: 1; height: 100%; background-color: white">
        <div
          class="d-flex flex-row custom-drawer-item"
          style="padding: 0 0 0 9px;height: 43px"
        >
          <v-icon color="#FF7754" @click="drawerOpen = !drawerOpen" style="margin-right:6px"
          >{{ drawerOpen ? "mdi-chevron-left" : "mdi-chevron-right" }}
          </v-icon>
          <div v-if="data.id" class="detail-name">{{ data.configJson.name }}</div>
          <div v-if="data.id" class="detail-key" style="margin-right:12px">|</div>
          <div v-if="data.id" class="detail-key">{{ data.configJson.desc }}</div>
          <v-spacer />
          <v-divider vertical />
          <v-btn text :disabled="!data.id"
                 @click="$refs.iframeContainer.src=`${data.configJson.url}`"
                 style="border-right: none; font-weight:400" color="#312651">
            <v-icon left small style="margin-right:6px">mdi-refresh</v-icon>
            {{ $t('refresh') }}
          </v-btn>
        </div>
        <div style="flex: 1;height: 0px;width: 100%">
          <iframe style="height: 100%;width: 100%"
                  v-if="data.id"
                  ref="iframeContainer"
                  class="report-container"
                  :src="data.configJson.url"></iframe>
        </div>
      </div>
    </div>
    <v-dialog v-model="searchDialog.display" width="431">
      <v-card>
        <v-card-title style="color:#312651">{{ $t('search') }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="searchVal" label="" :placeholder="$t('name')" @keydown.enter="onSearchCommit"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="resetSearch" style="font-weight:normal; color:#312651">
            <v-icon left>mdi-redo</v-icon>
            {{ $t('reset') }}
          </v-btn>
          <v-btn text @click="onSearchCommit" style="font-weight:normal; color:#312651">
            <v-icon left>mdi-magnify</v-icon>
            {{ $t('search') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import DataListCommon from "@/components/common/data/mixins/list";
import camundaRequest from "@/api/camunda-service";

export default {
  name: "DataList",
  mixins: [DataListCommon],
  data() {
    return {
      idBreadcrumbs: [
        {
          text: this.$t("data"),
          disabled: true,
          href: "#/task/data/list"
        },
        {
          text: "",
          disabled: true
        }
      ],
      drawerOpen: true,
      searchDialog: {
        display: false,
        dataId: "",
      },
      data: {},
      totalCount: 0
    };
  },
  methods: {
    async onMounted() {
      this.autoSelect = true;
      if (this.$route.query.defaultSearchNameLike) {
        this.searchVal = this.$route.query.defaultSearchNameLike;
      }
      // 获取数据总数
      let { count } = await camundaRequest.getApplicationCount({
        tenant: this.$store.state.user.tenant,
        type: "ux",
        category: "bpezAppReport",
        groups: this.groups.map((group) => group.id)
      });
      this.totalCount = count;
    },
    onSearchCommit(){
      this.searchDialog.display=false;
      this.onSearch();
    },
    onDataItemClick(item) {
      this.data = item;
    }
  },
  watch:{
    "$i18n.locale": {
      handler(val){
        let self=this;
        self.idBreadcrumbs[0].text=self.$t("data");
      },
    },
  }
};
</script>

<style scoped>
.menu-split {
  margin: 0 12px;
  color: #bbbbbb;
}

.custom-drawer-item-icon {
  cursor: pointer;
}

.custom-drawer-item.current {
  background-color: #f3f4f9;
}

.custom-drawer-item .name {
  font-weight: bold;
  color: rgba(68, 66, 98, 1);
  font-size: 14px;
  margin-bottom: 2px;
}

.custom-drawer-item .key {
  color: rgba(68, 66, 98, 1);
  font-size: 12px;
  margin-bottom: 2px;
}

.custom-drawer-item .description {
  color: rgba(131, 130, 154, 1);
  font-size: 12px;
}

.detail-name {
  font-weight: bold;
  color: rgba(49, 38, 81, 1);
  font-size: 14px;
  margin-right: 12px;
}

.detail-key {
  color: rgba(131, 130, 154, 1);
  font-size: 14px;
}

/deep/ .version-select.v-text-field > .v-input__control > .v-input__slot {
  width: 82px;
  height: 25px;
  min-height: 25px;
  border-radius: 4px;
  background-color: rgba(243, 244, 249, 1);
  color: rgba(49, 38, 81, 1);
  font-size: 12px;
  padding: 0 6px;
}

/deep/ .version-select.v-text-field > .v-input__control > .v-input__slot::before,
/deep/ .version-select.v-text-field > .v-input__control > .v-input__slot::after {
  border-style: none;
}

/deep/ .version-select.v-text-field > .v-input__control > .v-input__slot input {
  display: none;
}

/deep/ .version-select.v-text-field > .v-input__control > .v-input__slot .primary--text,
/deep/
.version-select.v-text-field
> .v-input__control
> .v-input__slot
.v-icon.notranslate.mdi-menu-down.theme--light {
  color: #ff7754 !important;
  caret-color: #ff7754 !important;
}

/deep/
.version-select.v-text-field
> .v-input__control
> .v-input__slot
.v-input__append-inner {
  margin-top: 2px;
}

.deployment {
  align-items: center;
}

.deployment div {
  margin-top: 5px;
  color: rgba(177, 171, 182, 1);
  font-size: 12px;
}

.deployment i {
  color: #444262;
  font-size: 34px;
}

div.diagram-container {
  background-color: rgba(232, 239, 247, 16);
  overflow: hidden;
  display: flex;
  flex: 1;
  height: 0px;
  justify-content: center;
  align-items: center;
  display: -webkit-flex;
}

.tabs {
  overflow-y: scroll;
}

/deep/ .tabs .v-window__container,
/deep/ .tabs .v-window-item.v-window-item--active {
  height: 100%;
}

.badge {
  display: inline-block;
  min-width: 10px;
  padding: 3px 7px;
  font-weight: bold;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  border-radius: 6px;
  background-color: #70b8db;
  border: 0;
  color: #fff;
}

.badge-instance {
  background-color: #2AD194;
}

.badge-incident {
  background-color: #FF7754;
}

.badge-group {
  background-color: #312651;
}

.badge-app {
  background-color: #83829A;
}

.badge-total i,
.badge-instance i,
.badge-group i,
.badge-app i,
.badge-incident i {
  margin-right: 4px;
}
</style>
