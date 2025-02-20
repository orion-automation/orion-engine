<template>
  <div class="d-flex flex-column" :style="{width:`${component.width}`}">
    <v-text-field placeholder="搜索..."
                  v-if="searchKey&&searchKey.trim().length>0"
                  v-model="searchStr" append-outer-icon="mdi-search-web"/>
    <div style="overflow-y: auto;border: 1px solid rgba(230, 228, 230, 1);border-radius: 6px"
         :style="{maxHeight:`${component.maxListHeight}`}">
      <v-list three-line style="padding: 0">
        <template v-for="(item,index) in items">
          <v-list-item
              :key="`list-title-${index}`"
              @click="onItemClick(item)">
            <v-list-item-content>
              <v-list-item-title v-html="item[`${component['title-key']}`]" style="color: black;font-weight: 600"></v-list-item-title>
              <v-list-item-subtitle v-html="item[`${component['sub-title-key']}`]"
                                    style="color: #FF7754 !important;"
                                    class="text--primary"></v-list-item-subtitle>
              <v-list-item-subtitle v-text="item[`${component['desc-key']}`]"
                                    style="color: #83829A !important;"></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-list-item-action-text v-text="item[`${component['mark-key']}`]"></v-list-item-action-text>
            </v-list-item-action>
          </v-list-item>
          <v-divider
              v-if="index < items.length - 1"
              :key="index"
              style="margin: 0"
          ></v-divider>
        </template>
      </v-list>
      <infinite-loading @infinite="getList" :identifier="infiniteId">
        <template #no-more>
          <div class="d-flex flex-row infinite-more-container">
            <div class="infinite-more-container-pre"/>
            <div class="infinite-more-container-content">没有更多了</div>
            <div class="infinite-more-container-pre"/>
          </div>
        </template>
      </infinite-loading>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import InfiniteLoading from "vue-infinite-loading";
import debounce from "lodash/debounce";
import _ from "lodash";

export default {
  name: "List",
  components: {InfiniteLoading},
  props: {
    component: {
      type: Object,
      default: () => {
      }
    },
    rootValue: {
      type: Object,
      default: () => {
      }
    },
    instance: null,
  },
  data() {
    this.onSearch = debounce(this.searchList, 800);
    return {
      infiniteId: +new Date(),
      searchStr: "",
      items: [],
      pageSize: 0,
      pageSizeKey: "",
      offsetKey: "",
      searchKey: "",
      dataSourceUrl: "",
      requestHeaders: [],
      requestMethod: "",
      requestBody: "",
      requestDataPath: "",
    };
  },
  mounted() {
    let self = this;
    self.pageSize = self.component["page-size-value"];
    self.pageSizeKey = self.component["page-size-key"];
    self.searchKey = self.component["search-key"];
    self.offsetKey = self.component["offset-key"];
    self.dataSourceUrl = self.component["data-source-url"];
    self.requestHeaders = self.component.request["headers"];
    self.requestMethod = self.component.request["method"];
    self.requestBody = self.component.request["body"];
    self.requestDataPath = self.component.request["dataPath"];
    self.infiniteId += 1;
  },
  methods: {
    onItemClick(item) {
      console.log(item);
    },
    get(path, obj, fb = `$\{${path}}`) {
      return path.split(".").reduce((res, key) => {
        return res[key] || fb;
      }, obj);
    },
    parseTpl(template, map, fallback) {
      if (template && template.length > 0) {
        try {
          return template.replace(/\$\{.+?}/g, (match) => {
            const path = match.substr(2, match.length - 3).trim();
            return this.get(path, map, fallback);
          });
        } catch (e) {
          console.log(e);
        }
      }
      return "{}";
    },
    async getList($state) {
      let self = this;
      if (self.dataSourceUrl) {
        let params = {};
        if (self.searchStr && self.searchKey) {
          params[`${self.searchKey}`] = self.searchStr;
        }
        if (self.pageSize && self.pageSizeKey && self.offsetKey) {
          params[`${self.pageSizeKey}`] = self.pageSize;
          params[`${self.offsetKey}`] = self.items.length;
        }
        let headers = {};
        self.requestHeaders.forEach(header => {
          headers[`${header.key}`] = self.parseTpl(header.value, {data: self.rootValue}, null);
        });
        let requestConfig = {
          url: self.dataSourceUrl,
          params,
          headers,
          method: self.requestMethod
        };
        if (self.requestMethod === "POST") {
          // data
          try {
            requestConfig.data = JSON.parse(this.parseTpl(JSON.stringify(self.requestBody) || "{}", {data: self.rootValue}, null));
          } catch (e) {
          }
        }
        try {
          let result = await axios(requestConfig);
          let items = _.get(result.data, self.requestDataPath);
          if (!self.requestDataPath || self.requestDataPath.length===0) {
            items = result.data;
          }
          this.items = this.items.concat(items);
          $state.loaded();
          if (items.length < self.pageSize) {
            $state.complete();
          }
        } catch (e) {
          $state.error();
        }
      } else {
        $state.loaded();
        $state.complete();
      }
    },
    searchList() {
      let self = this;
      self.items = [];
      self.infiniteId += 1;
    },
  },
  watch: {
    searchStr: {
      handler(val) {
        let self = this;
        self.onSearch();
      }
    }
  }
};
</script>

<style scoped>
.infinite-more-container {
  font-size: 12px;
  color: #B1ABB6;
  align-items: center;
  justify-content: center;
}

.infinite-more-container-pre {
  width: 15px;
  height: 1px;
  border: 1px dashed rgba(177, 171, 182, 1);
}

.infinite-more-container-content {
  padding: 10px;
}
</style>
