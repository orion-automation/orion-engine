<template>
  <div :style="{width:width}" style="height: fit-content">
    <v-data-table
      v-if="tableEnableGroupBy"
      :headers="headers"
      :items="items"
      multi-sort
      @click:row="onClickRow"
      :fixed-header="true"
      :group-by="groupByKey"
      :options.sync="options"
      :server-items-length="totalCount"
      :items-per-page="pageSize"
      :loading="loading"
      :height="height"
      :footer-props="{
      disableItemsPerPage: true,
      itemsPerPageOptions:[pageSize,-1],
      itemsPerPageText:'每页条目数',
      pageText: '{0}-{1}'
    }"
      :style="{width:width}"
    >
      <template #top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>{{ tableTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field placeholder="搜索" dense v-model="searchVal" hide-details
                        style="width: 300px;margin-right: 20px;flex: none"/>

          <v-btn-toggle dense color="#444262">
            <v-btn
              color="#444262"
              @click="exportData"
              outlined
            >
              {{ $t('exportTitle') }}
            </v-btn>
            <v-btn
              color="#444262"
              @click="refreshTables"
              outlined
            >
              {{ $t('refreshTable') }}
            </v-btn>
            <v-btn
              color="#444262"
              @click="onCreateItem"
              outlined
              v-if="canCreate"
            >
              {{ $t(`${canCreate.column_show_title}`) }}
            </v-btn>
          </v-btn-toggle>
        </v-toolbar>
      </template>
      <template #[`item.actions`]="{ item }" v-if="tableOperatesMore.length>0">
        <v-menu z-index="200" left bottom>
          <template #activator="{ on, attrs }">
            <v-icon
              class="more"
              color="#83829A"
              v-bind="attrs"
              v-on="on"
            >
              mdi-dots-horizontal
            </v-icon>
          </template>

          <v-list
            style="border-radius: 6px;border: 1px solid rgba(177, 171, 182, 1);padding: 0"
            width="200">
            <v-list-item
              v-for="operate in tableOperatesMore"
              :key="operate.column_show_title"
              @click="onEditItem(item,operate)"
              style="border-bottom: 1px solid rgba(177, 171, 182, 1)">
              <v-list-item-content>
                <div class="d-flex flex-row" style="align-items: center;font-size: 13px;color: #30254f;font-weight: bold">
                  {{ operate.column_show_title }}
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <template v-for="column in columnSetUsed"
                #[`item.${column.value}`]="{ item,index }">
        <span :key="`column-${index}-${column.value}-amount`"
              style="font-weight: bold"
              v-if="column.dataType==='amount'">{{ format_with_mod(item[`${column.value}`]) }}</span>
        <v-chip
          :key="`column-${index}-${column.value}-badge`"
          v-else-if="column.dataType==='badge'"
          v-show="(typeof item[`${column.value}`]==='string'&&item[`${column.value}`].length>0)||(typeof item[`${column.value}`]!=='string'&&item[`${column.value}`]!==null&&item[`${column.value}`]!==undefined)"
          :color="column.colorCustom[`${item[`${column.value}`]}`]??column.color"
          dark
        >
          {{ item[`${column.value}`] }}
        </v-chip>
        <a v-else-if="column.dataType==='email'"
           @click.stop="onClickHref"
           :key="`column-${index}-${column.value}-email`"
           :href="`mailto:${item[`${column.value}`]}`"  target="_blank">{{ item[`${column.value}`] }}</a>
        <a v-else-if="column.dataType==='resource'"
           @click.stop="onEditItemByResource(item, column)"
           :key="`column-${index}-${column.value}-resource`"
           href="javascript:void(0)">{{ item[`${column.value}`] }}</a>
        <span :key="`column-${index}-${column.value}-normal`" v-else>{{ item[`${column.value}`] }}</span>
      </template>
      <template #no-data>
        <v-btn
          color="#444262"
          outlined
          dark
          style="border-radius: 5px;margin-right: 20px;border-right: thin solid currentColor"
          @click="getTableItems"
        >
          {{ $t('dataTableNoData') }}
        </v-btn>
      </template>
    </v-data-table>
    <v-data-table
      v-else
      :headers="headers"
      :items="items"
      multi-sort
      @click:row="onClickRow"
      :options.sync="options"
      :fixed-header="true"
      :server-items-length="totalCount"
      :items-per-page="pageSize"
      :loading="loading"
      :height="height"
      :footer-props="{
      disableItemsPerPage: true,
      itemsPerPageOptions:[pageSize,-1],
      itemsPerPageText:'每页条目数',
      pageText: '{0}-{1}'
    }"
      :style="{width:width}"
    >
      <template #top>
        <v-toolbar
          flat
        >
          <v-toolbar-title v-if="tableTitle" style="margin-right: 20px">{{ tableTitle }}</v-toolbar-title>
          <v-text-field placeholder="搜索" dense v-model="searchVal" hide-details
                        style="width: 300px;margin-right: 20px;flex: none"/>
          <v-spacer></v-spacer>
          <v-btn-toggle dense color="#444262">
            <v-btn
              color="#444262"
              @click="exportData"
              outlined
            >
              {{ $t('exportTitle') }}
            </v-btn>
            <v-btn
              color="#444262"
              @click="refreshTables"
              outlined
            >
              {{ $t('refreshTable') }}
            </v-btn>
            <v-btn
              color="#444262"
              @click="onCreateItem"
              outlined
              v-if="canCreate"
            >
              {{ $t(`${canCreate.column_show_title}`) }}
            </v-btn>
          </v-btn-toggle>
        </v-toolbar>
      </template>
      <template #[`item.actions`]="{ item }" v-if="tableOperatesMore.length>0">
        <v-menu z-index="200" left bottom>
          <template #activator="{ on, attrs }">
            <v-icon
              class="more"
              color="#83829A"
              v-bind="attrs"
              v-on="on"
            >
              mdi-dots-horizontal
            </v-icon>
          </template>

          <v-list
            style="border-radius: 6px;border: 1px solid rgba(177, 171, 182, 1);padding: 0"
            width="200">
            <v-list-item
              v-for="operate in tableOperatesMore"
              :key="operate.column_show_title"
              @click="onEditItem(item,operate)"
              style="border-bottom: 1px solid rgba(177, 171, 182, 1)">
              <v-list-item-content>
                <div class="d-flex flex-row" style="align-items: center;font-size: 13px;color: #30254f;font-weight: bold">
                  {{ operate.column_show_title }}
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <template v-for="column in columnSetUsed"
                #[`item.${column.value}`]="{ item,index }">
        <span :key="`column-${index}-${column.value}-amount`"
              style="font-weight: bold"
              v-if="column.dataType==='amount'">{{ format_with_mod(item[`${column.value}`]) }}</span>
        <v-chip
          :key="`column-${index}-${column.value}-badge`"
          v-else-if="column.dataType==='badge'"
          v-show="(typeof item[`${column.value}`]==='string'&&item[`${column.value}`].length>0)||(typeof item[`${column.value}`]!=='string'&&item[`${column.value}`]!==null&&item[`${column.value}`]!==undefined)"
          :color="column.colorCustom[`${item[`${column.value}`]}`]??column.color"
          dark
        >
          {{ item[`${column.value}`] }}
        </v-chip>
        <a v-else-if="column.dataType==='email'"
           :key="`column-${index}-${column.value}-email`"
           @click.stop="onClickHref"
           :href="`mailto:${item[`${column.value}`]}`" target="_blank">{{ item[`${column.value}`] }}</a>
        <a v-else-if="column.dataType==='resource'"
           @click.stop="onEditItemByResource(item, column)"
           :key="`column-${index}-${column.value}-resource`"
           href="javascript:void(0)">{{ item[`${column.value}`] }}</a>
        <span :key="`column-${index}-${column.value}-normal`" v-else>{{ item[`${column.value}`] }}</span>
      </template>
      <template #no-data>
        <v-btn
          color="#444262"
          outlined
          dark
          style="border-radius: 5px;margin-right: 20px;border-right: thin solid currentColor"
          @click="getTableItems"
        >
          {{ $t('dataTableNoData') }}
        </v-btn>
      </template>
    </v-data-table>
    <form-action-dialog :action="action" ref="formActionDialogRef" @onSaveSuccess="refreshTables"/>
  </div>
</template>

<script>
import axios from "axios";
import _ from "lodash";
import debounce from "lodash/debounce";
import FormActionDialog from "@/components/common/formAction/FormActionDialog";
import XLSX from "xlsx";
import moment from "moment/moment";

export default {
  name: "DataTable",
  components: {FormActionDialog},
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
    this.onSearch = debounce(this.refreshTables, 800);
    return {
      sortBy: [],
      sortDesc: [],
      randomColors: ["#6d6b82", "#828097", "#ed7554"],
      headers: [],
      items: [],
      totalCount: 0,
      loading: true,
      options: {},
      action: {
        field: "",
        key: "",
        label: "",
        processKey: "",
        data: [],
        columns: [],
      },
      searchVal: "",
      groupByKey: "",
      columnSetUsed: [],
      lastestReqTime: null,

      width: null,
      height: null,
      tableTitle: "",
      pageSize: 0,
      pageSizeKey: "",
      offsetKey: "",
      searchKey: "",
      dataSourceUrl: "",
      requestHeaders: [],
      requestMethod: "",
      requestBody: "",
      requestDataPath: "",
      totalCountPath: "",
      columnHideAll: false,
      columnSet: [],
      tableOperateType: "dialog",
      tableOperates: [],
      tableOperatesMore: [],
      dataSource: "url",
      nocoDbConditions: [],
      tableEnableGroupBy: false,
    };
  },
  mounted() {
    let self = this;
    self.width = self.component["width"];
    self.height = self.component["height"];
    self.tableTitle = self.component["table-title"];
    self.pageSize = self.component["page-size-value"];
    self.pageSizeKey = self.component["page-size-key"];
    self.searchKey = self.component["search-key"];
    self.offsetKey = self.component["offset-key"];
    self.dataSourceUrl = self.component["data-source-url"];
    self.requestHeaders = self.component.request["headers"];
    self.requestMethod = self.component.request["method"];
    self.requestBody = self.component.request["body"];
    self.requestDataPath = self.component.request["dataPath"];
    self.totalCountPath = self.component["total-count-path"];
    self.columnHideAll = self.component["column_hide_all"];
    self.columnSet = self.component["column_set"];
    self.tableOperateType = self.component["table_operate_type"];
    self.tableOperates = self.component["table_operate"];
    self.tableOperatesMore = self.component["table_operate_more"];
    // 筛选有效值
    self.tableOperatesMore = self.tableOperatesMore.filter(item => item.column_show_title && item.column_show_title.length > 0);
    self.dataSource = self.component["dataSource"];
    self.nocoDbConditions = self.component.data["noco_db_conditions"];
    self.tableEnableGroupBy = self.component["table-enable-group-by"];
    if (self.tableEnableGroupBy) {
      // 分组，取消分页
      self.pageSize = -1;
    }
    self.getTableItems();
  },
  computed: {
    canCreate() {
      let currentIndex = this.tableOperates.findIndex(operate => operate.column_key === "create");
      if (currentIndex !== -1) {
        if (!this.tableOperates[currentIndex].column_hide) {
          return this.tableOperates[currentIndex];
        }
      }
      return false;
    }
  },
  methods: {
    importXLSX(){
      return import("xlsx");
    },
    onClickHref(){
    },
    onClickRow(item){
      let self=this;
      if (self.component["table_row_process_key"]&&self.component["table_row_process_key"].length>0){
        let processKey = self.component["table_row_process_key"];
        let label = "";
        let field = self.component.key;
        let key = "modify";
        let data=[];
        let columns=[];
        let lockDrawer=self.component["table_row_click_lock_drawer"];
        Object.keys(item).forEach(key=>{
          data.push(item[`${key}`]);
          columns.push(key);
        });
        let action = {
          field,
          key,
          label,
          processKey,
          data,
          columns,
          lockDrawer
        };
        Object.assign(this.action, action);
        if (self.component["table_row_operate_type"] === "dialog") {
          self.$refs.formActionDialogRef.show(true);
        } else {
          window.editDataTableItemByDrawer(self.action);
        }
      }
    },
    async exportData() {
      let self=this;
      let dataAll = [self.headers.filter(header=>header.value!=="actions").map(header=>header.text)];
      this.items.forEach(item => {
        let values=[];
        self.headers.forEach(header=>{
          values.push(item[`${header.value}`]);
        });
        dataAll.push(values);
      });
      try {
        let XLSX=await self.importXLSX();
        // 创建workbook
        let wb = XLSX.utils.book_new();
        // 把sheet放入workbook
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(dataAll), "overview");
        // 写入文件(通过文件名控制导出的类型)
        XLSX.writeFile(
          wb,
          `${self.component.id}_${self.component.key}_${moment().format("YYYY_MM_DD_HH_mm_ss")}.xlsx`
        );
      }catch (e) {
        console.log(e);
      }
    },
    format_with_mod(number) {
      let n = number;
      // 是否是负数
      let negative = n < 0;
      if (negative) {
        // 转正数
        n = n * -1;
      }
      let r = "";
      let temp = "";
      let mod;
      do {
        // 求模的值， 用于获取高三位，这里可能有小数
        mod = n % 1000;
        // 值是不是大于1，是继续的条件
        n = n / 1000;
        // 高三位
        temp = ~~mod;
        // 1.填充: n > 1 循环未结束， 就要填充为比如 1 => 001
        // 不然temp = ~~mod的时候, 1 001， 就会变成 "11"
        // 2.拼接“,”
        r = (n >= 1 ? `${temp}`.padStart(3, "0") : temp) + (!!r ? "," + r : "");
      } while (n >= 1);
      const strNumber = number + "";
      let index = strNumber.indexOf(".");
      // 拼接小数部分
      if (index >= 0) {
        r += strNumber.substring(index);
      }
      if (negative) {
        r = `-${r}`;
      }
      return r;
    },
    refreshTables() {
      this.options.page = 1;
      this.getTableItems();
    },
    onCreateItem() {
      let self = this;
      let processKey = self.canCreate.column_process_key;
      let label = self.canCreate.column_show_title;
      let field = self.component.key;
      let key = self.canCreate.column_key;
      let data = {};
      let columns = self.headers.map(header => header.value);
      let lockDrawer=self.canCreate.column_lock_drawer;
      let action = {
        field,
        key,
        label,
        processKey,
        data,
        columns,
        lockDrawer
      };
      Object.assign(this.action, action);
      if (self.tableOperateType === "dialog") {
        self.$refs.formActionDialogRef.show(true);
      } else {
        window.editDataTableItemByDrawer(self.action);
      }
    },
    onEditItem(item, operate) {
      let self = this;
      let processKey = operate.column_process_key;
      let label = operate.column_show_title;
      let field = self.component.key;
      let key = "modify";
      let data=[];
      let columns=[];
      let lockDrawer=operate.column_lock_drawer;
      Object.keys(item).forEach(key=>{
        data.push(item[`${key}`]);
        columns.push(key);
      });
      let action = {
        field,
        key,
        label,
        processKey,
        data,
        columns,
        lockDrawer
      };
      Object.assign(this.action, action);
      if (self.tableOperateType === "dialog") {
        self.$refs.formActionDialogRef.show(true);
      } else {
        window.editDataTableItemByDrawer(self.action);
      }
    },
    onEditItemByResource(item, column) {
      let self = this;
      let processKey = column.operateProcessKey;
      let label = column.text;
      let field = self.component.key;
      let lockDrawer=column.lockDrawer;
      let key = "modify";
      let data=[];
      let columns=[];
      Object.keys(item).forEach(key=>{
        data.push(item[`${key}`]);
        columns.push(key);
      });
      let action = {
        field,
        key,
        label,
        processKey,
        data,
        columns,
        lockDrawer
      };
      Object.assign(this.action, action);
      if (self.tableOperateType === "dialog") {
        self.$refs.formActionDialogRef.show(true);
      } else {
        window.editDataTableItemByDrawer(self.action);
      }
    },
    async getTableItems() {
      let self = this;
      if (self.dataSourceUrl) {
        const {sortBy, sortDesc, page, itemsPerPage} = this.options;
        let params = {};
        let headers = {};
        self.requestHeaders.forEach(header => {
          headers[`${header.key}`] = self.parseTpl(header.value, {data: self.rootValue}, null);
        });
        // 搜索
        if (self.dataSource === "url") {
          params[`${self.searchKey}`] = self.searchVal;
        } else if (self.dataSource === "noco_db") {
          if (self.nocoDbConditions) {
            let where = "";
            this.component.data.noco_db_conditions.forEach((item, index) => {
              if (item.value && item.value.length > 0) {
                let conditionVal = self.parseTpl(item.value, {data: self.rootValue}, null);
                if (index === 0 && item.logical_operator === "~not") {
                  where += `(${item.name},${item.operator},${conditionVal})`;
                } else {
                  where += `${item.logical_operator}(${item.name},${item.operator},${conditionVal})`;
                }
              } else if (self.searchVal && self.searchVal.length > 0) {
                if (index === 0 && item.logical_operator === "~not") {
                  where += `(${item.name},${item.operator},${self.searchVal})`;
                } else {
                  where += `${item.logical_operator}(${item.name},${item.operator},${self.searchVal})`;
                }
              }
            });
            params.where = where;
          }
          if (self.options.sortBy && self.options.sortBy.length > 0) {
            params.sort = self.options.sortBy.map((column, index) => {
              return !self.options.sortDesc[index] ? column : `-${column}`;
            }).join(",");
          }
        }
        // 分页
        if (self.pageSize !== -1) {
          params[`${self.pageSizeKey}`] = self.pageSize;
        }
        params[`${self.offsetKey}`] = (page - 1) * itemsPerPage;
        // records
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
          self.loading = true;
          let lastestReqTime = new Date().getTime();
          self.lastestReqTime = lastestReqTime;
          let result = await axios(requestConfig);
          // 确保最后更新的数据是最新一次请求的接口数据
          if (lastestReqTime-self.lastestReqTime===0){
            let items = _.get(result.data, self.requestDataPath);
            // pageInfo.totalRows
            self.totalCount = _.get(result.data, self.totalCountPath);
            if (!self.requestDataPath || self.requestDataPath.length === 0) {
              items = result.data;
            }
            if (items && items.length > 0) {
              self.headers = [];
              self.columnSetUsed = [];
              Object.keys(items[0]).forEach(itemKey => {
                let currentIndex = -1;
                if (self.columnSet && self.columnSet.length > 0) {
                  currentIndex = self.columnSet.findIndex(set => set.column_key === itemKey);
                }
                if (currentIndex === -1) {
                  // 默认配置，未设置规则
                  if (!self.columnHideAll) {
                    self.headers.push({
                      text: itemKey, value: itemKey, sortable: false
                    });
                  }
                } else {
                  let columnSet = self.columnSet[currentIndex];
                  // 未设置隐藏
                  if (!columnSet["column_hide"]) {
                    if (self.tableEnableGroupBy && !!columnSet["column_group_by"]) {
                      // 分组，取消分页
                      self.groupByKey = itemKey;
                    }
                    let title = itemKey;
                    if (columnSet["column_show_title"] && columnSet["column_show_title"].trim().length > 0) {
                      title = columnSet["column_show_title"];
                    }
                    let dataType;
                    if (columnSet["column_show_type"] && columnSet["column_show_type"].trim().length > 0) {
                      dataType = columnSet["column_show_type"];
                    }
                    let colorCustom=columnSet["column_show_type_color_custom"];
                    try {
                      colorCustom = JSON.parse(colorCustom);
                    }catch (e) {
                      colorCustom = {};
                    }
                    self.columnSetUsed.push({
                      text: title, value: itemKey, sortable: !!columnSet["column_sortable"], dataType: dataType,color:columnSet["column_show_type_color"],colorCustom,operateProcessKey:columnSet["column_operate_process_key"],lockDrawer:columnSet["column_lock_drawer"]
                    });
                    self.headers.push({
                      text: title, value: itemKey, sortable: !!columnSet["column_sortable"], dataType: dataType,cellClass:dataType==="amount"?"text-end":""
                    });
                  }
                }
              });
            }
            // 默认隐藏时表头排序
            if (self.columnHideAll) {
              self.headers.sort((a, b) => {
                let currentIndexA = -1;
                let currentIndexB = -1;
                if (self.columnSet && self.columnSet.length > 0) {
                  currentIndexA = self.columnSet.findIndex(set => set.column_key === a.value && !set.column_hide );
                  currentIndexB = self.columnSet.findIndex(set => set.column_key === b.value && !set.column_hide );
                }
                return currentIndexA - currentIndexB;
              });
            }
            if (self.tableOperatesMore.length > 0) {
              self.headers.push({text: self.$t("dataTableOpt"), value: "actions", sortable: false});
            }
            // 排序
            if (self.dataSource !== "noco_db" && sortBy && sortBy.length > 0) {
              items.sort((a, b) => {
                if (sortDesc[0]) {
                  if (typeof a[`${sortBy[0]}`] === "number") {
                    return a[`${sortBy[0]}`] - b[`${sortBy[0]}`];
                  } else {
                    return a[`${sortBy[0]}`].localeCompare(b[`${sortBy[0]}`]);
                  }
                } else {
                  if (typeof a[`${sortBy[0]}`] === "number") {
                    return b[`${sortBy[0]}`] - a[`${sortBy[0]}`];
                  } else {
                    return b[`${sortBy[0]}`].localeCompare(a[`${sortBy[0]}`]);
                  }
                }
              });
            }
            self.items = items;
            self.loading = false;
          }
        } catch (e) {
          console.log(e);
        }
      }
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
  },
  watch: {
    options: {
      handler(val) {
        this.getTableItems();
      },
      deep: true,
    },
    searchVal: {
      handler(val) {
        let self = this;
        self.onSearch();
      }
    }
  },
};
</script>

<style scoped>
/deep/ .v-data-table > .v-data-table__wrapper > table > tbody > tr > td, .v-data-table > .v-data-table__wrapper > table > thead > tr > td, .v-data-table > .v-data-table__wrapper > table > tfoot > tr > td {
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  white-space: nowrap;
}

/deep/ .v-data-table > .v-data-table__wrapper > table > thead > tr > th > span {
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  white-space: nowrap;
}

/deep/ .v-data-table > .v-data-table__wrapper > table > tbody > tr > td:first-child {
  position: sticky !important;
  position: -webkit-sticky !important;
  left: 0;
  z-index: 3;
  background: white;
  left: 0;
}

/deep/ .v-data-table > .v-data-table__wrapper > table > thead > tr > th:first-child {
  position: sticky !important;
  position: -webkit-sticky !important;
  left: 0;
  z-index: 4;
  background: white;
  left: 0;
}

/deep/ .v-data-table-header th {
  white-space: nowrap;
}

/deep/ .v-data-table > .v-data-table__wrapper > table > tbody > tr > td:last-child {
  position: sticky !important;
  position: -webkit-sticky !important;
  left: 0;
  z-index: 3;
  background: white;
  right: 0;
}

/deep/ .v-data-table > .v-data-table__wrapper > table > thead > tr > th:last-child {
  position: sticky !important;
  position: -webkit-sticky !important;
  left: 0;
  z-index: 4;
  background: white;
  right: 0;
}

/deep/ .v-data-table > .v-data-table__wrapper > table > tbody > tr:hover > td {
  background: inherit !important;
}
</style>
