<template>
  <div class="d-flex flex-column" style="width: 100%;height: 100%">
    <div
        style="padding: 14px 15px;border-top: 1px solid rgba(187, 187, 187, 1);"
    >
      <v-breadcrumbs :items="breadcrumbs" style="background-color: #e8eff7;padding: 0;border: none" divider="|"/>
    </div>
    <div class="d-flex flex-row" style="width: 100%;height: 0;flex: 1">
      <v-navigation-drawer v-model="drawerOpen" :width="drawerOpen?256:0" mobile-breakpoint="0">
        <div class="d-flex flex-column" style="height: 100%">
          <div
              class="d-flex flex-row custom-drawer-item"
              :class="tabSelect==='config'?'custom-drawer-item-selected':''"
              @click="onConfigTabClick"
          >
            <v-icon class="custom-drawer-item-icon" size="18" color="#444262">mdi-information-box</v-icon>
            {{ $t('config') }}
            <v-spacer/>
          </div>
        </div>
      </v-navigation-drawer>
      <div
          class="d-flex flex-column" style="width: 0;flex: 1;height: 100%;background-color: white"
          ref="resizeLayoutBottom"
      >
        <template v-if="tabSelect==='config'">
          <div
              class="d-flex flex-row custom-drawer-item"
              style="padding-top: 0;padding-bottom: 0;padding-right: 0;height: 43px"
          >
            <v-icon color="#FF7754" @click="drawerOpen=!drawerOpen">mdi-chevron-left</v-icon>
            <v-spacer/>
            <div style="width: 1px;height: 100%;background-color: rgb(187, 187, 187)"/>
            <v-btn text @click="onConfigTabClick">
              <v-icon left size="16" color="#83829A">mdi-refresh</v-icon>
              {{ $t('refresh') }}
            </v-btn>
          </div>
          <div class="d-flex flex-row"
               style="flex-wrap: wrap;row-gap: 20px;column-gap: 20px;padding: 20px;flex: 1;height: 0;overflow-y: auto">
            <v-treeview :items="engineInfo.items" open-all v-if="engineInfo.items.length>0">
              <template v-slot:label="{ item }">
                <div class="d-flex flex-row">
                  <div v-if="item.name">
                    {{ item.name }}
                  </div>
                  <div v-if="item.name&&item.value" style="margin-right: 5px">
                    :
                  </div>
                  <div v-if="item.value" style="color: #0F40F5">
                    {{ item.value }}
                  </div>
                </div>
              </template>
            </v-treeview>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import userRequest from "@/api/user";
import processRequest from "@/api/process";
import moment from "moment";

export default {
  name: "Index",
  data() {
    return {
      drawerOpen: true,
      tabSelect: "config",
      breadcrumbs: [
        {
          text: this.$t("system"),
          disabled: true,
        }
      ],
      engineInfo: {
        items: [],
        nodeId: 0,
      },
      commitLoading: false,
    };
  },
  mounted() {
    this.onConfigTabClick();
  },
  methods: {
    async onConfigTabClick() {
      let self = this;
      self.tabSelect = "config";
      self.engineInfo.items = [];
      let engineInfo = await processRequest.getEnhancementProcessEngineInfo();
      self.engineInfo.items = self.parseData2Tree(engineInfo);
    },
    parseData2Tree(engineInfo) {
      let self = this;
      let items = [];
      if (engineInfo) {
        if (engineInfo instanceof Array) {
          engineInfo.forEach(key => {
            let item = {id: ++self.engineInfo.nodeId};
            if (key instanceof Array) {
              item.name = key;
              item.children = self.parseData2Tree(key);
            } else if (key instanceof Object) {
              item.name = key;
              item.children = self.parseData2Tree(key);
            } else {
              item.value = key;
            }
            items.push(item);
          });
        } else if (engineInfo instanceof Object) {
          Object.keys(engineInfo).forEach(key => {
            let item = {id: ++self.engineInfo.nodeId};
            if (engineInfo[`${key}`] instanceof Array) {
              item.name = key;
              item.children = self.parseData2Tree(engineInfo[`${key}`]);
            } else if (engineInfo[`${key}`] instanceof Object) {
              item.name = key;
              item.children = self.parseData2Tree(engineInfo[`${key}`]);
            } else {
              item.name = `${key}`;
              item.value = `${engineInfo[`${key}`]}`;
            }
            items.push(item);
          });
        }
      }
      return items;
    },
  },
  watch: {
    "$i18n.locale": {
      handler(val){
        this.breadcrumbs[0].text=this.$t("system");
      },
    },
  }
};
</script>

<style scoped>

</style>
