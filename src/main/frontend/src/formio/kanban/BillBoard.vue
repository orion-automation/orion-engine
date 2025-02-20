<template>
  <div :style="{width}" style="height: fit-content;overflow-x: auto" class="d-flex flex-column">
    <v-menu bottom offset-y>
      <template #activator="{ on, attrs }">
        <v-btn
          icon
          style="border-right: none"
          v-bind="attrs"
          :style="hideLabel?{}:{position: 'absolute',top:0,left: `${labelWidth+5}px`}"
          v-on="on"
        >
          <v-icon size="16" color="#83829A">
            mdi-filter
          </v-icon>
        </v-btn>
      </template>
      <div class="d-flex flex-column" style="background-color: white;gap: 5px;padding: 10px 15px 15px;">
        <v-checkbox v-model="groupsFilter"
                    dense
                    hide-details
                    @change="refreshTables"
                    v-for="group in dataGroupSet"
                    :key="group.name"
                    :label="group['show_name']||group.name"
                    :value="group.name"/>
      </div>
    </v-menu>
    <div class="d-flex flex-row" style="height: fit-content;gap: 1.5rem;width: 100%">
      <div class="column" v-for="group in groups" :key="group.id" :style="{maxHeight}">
        <div class="d-flex flex-row" style="align-items: center">
          <h1 class="column-title">
            {{ group.showTitle || group.title }}
          </h1>
          <div style="flex: 1"></div>
          <span class="column-title-desc">{{ group.items.length }}</span>
        </div>
        <div class="d-flex flex-column" style="gap: 1rem">
          <div class="column-card"
               v-for="item in group.items"
               :key="item.id"
               @click="onEditItem(item)"
               style="background-color: white">
            <div class="column-card-title">
              {{ item[`${keyTitle}`] }}
            </div>
            <div class="d-flex flex-row" style="gap: 5px;flex-wrap: wrap">
              <v-chip
                small
                :color="chip.color"
                class="text-white"
                v-for="(chip,index) in dataChips"
                :key="`chip-${group.id}-${item.id}-${index}`">
                {{ item[`${chip.chip_key}`] }}
              </v-chip>
            </div>
            <span class="column-card-badge">
			{{ subTitleAddPre ? subTitleAddPreValue : '' }}
            {{ subTitleShowType === 'amount' ? format_with_mod(item[`${keySubTitle}`]) : item[`${keySubTitle}`] }}
		</span>
          </div>
        </div>
      </div>
    </div>
    <form-action-dialog :action="action" ref="formActionDialogRef" @onSaveSuccess="refreshTables"/>
  </div>
</template>

<script>
import axios from "axios";
import _ from "lodash";
import FormActionDialog from "@/components/common/formAction/FormActionDialog";

export default {
  name: "BillBoard",
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
    return {
      groups: [
        {
          title: "Backlog", id: "backlog", items: [{
            id: "1",
            title: "Demo Task one",
            desc: "This is a demo task one",
            level: 3,
            assignee: "Kromate"
          }]
        },
        {
          title: "To do", id: "todo", items: [
            {
              id: "2",
              title: "Demo Task two",
              desc: "This is a demo task two",
              level: 1,
              assignee: "Kromate"
            },
            {
              id: "3",
              title: "Demo Task three",
              desc: "This is a demo task three",
              level: 2,
              assignee: "Kromate"
            },
            {
              id: "4",
              title: "Demo Task four",
              desc: "This is a demo task four",
              level: 3,
              assignee: "Kromate"
            }
          ]
        },
        {
          title: "In progress", id: "inprogress", items: [
            {
              id: "5",
              title: "Demo Task five",
              desc: "This is a demo task five",
              level: 3,
              assignee: "Kromate"
            },
            {
              id: "6",
              title: "Demo Task six",
              desc: "This is a demo task six",
              level: 2,
              assignee: "Kromate"
            }
          ]
        },
        {title: "Done", id: "done", items: []},
        {title: "Pending", id: "pend", items: []}
      ],
      groupsFilter: [],
      randomColors: ["#6d6b82", "#828097", "#ed7554"],

      action: {
        field: "",
        key: "",
        label: "",
        processKey: "",
        data: [],
        columns: [],
      },
      width: "",
      maxHeight: "",
      dataSourceUrl: "",
      requestHeaders: [],
      requestMethod: "",
      requestBody: "",
      requestDataPath: "",
      requestGroupKey: "",
      columnSet: [],
      tableOperateType: "dialog",
      tableOperates: [],
      dataSource: "url",
      nocoDbConditions: [],
      keyTitle: "",
      dataChips: [],
      keySubTitle: "",
      subTitleShowType: "",
      subTitleAddPre: false,
      subTitleAddPreValue: "",
      dataGroupSet: [],
      operateType: "dialog",
      operateProcessKey: "",
      hideLabel: null,
      labelWidth: 0,
    };
  },
  mounted() {
    let self = this;
    self.width = self.component["width"];
    self.maxHeight = self.component["max-height"];
    self.dataSourceUrl = self.component["data-source-url"];
    self.requestHeaders = self.component.request["headers"];
    self.requestMethod = self.component.request["method"];
    self.requestBody = self.component.request["body"];
    self.requestDataPath = self.component.request["dataPath"];
    self.requestGroupKey = self.component.request["group-key"];
    self.columnSet = self.component["column_set"];
    self.dataSource = self.component["dataSource"];
    self.keyTitle = self.component["key_title"];
    self.keySubTitle = self.component["key_sub_title"];
    self.dataChips = self.component.data["chips"];
    if (self.dataChips) {
      self.dataChips.forEach(chip => {
        chip.color = self.randomColors[Math.floor(Math.random() * 3)];
      });
    }
    self.subTitleShowType = self.component["sub_title_show_type"];
    self.subTitleAddPre = self.component["sub_title_add_pre"];
    self.subTitleAddPreValue = self.component["sub_title_add_pre_value"];
    self.nocoDbConditions = self.component.data["noco_db_conditions"];
    self.dataGroupSet = self.component.data["group_set"];
    self.operateType = self.component["operate_type"];
    self.operateProcessKey = self.component["operate_process_key"];
    self.hideLabel = self.component.hideLabel;
    if (!self.hideLabel) {
      self.labelWidth = document.getElementById(`l-${self.component.id}-${self.component.key}`).getBoundingClientRect().width;
    }
    self.getTableItems();
  },
  methods: {
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
      this.getTableItems();
    },
    onEditItem(item) {
      let self = this;
      if (!self.operateProcessKey||self.operateProcessKey.length===0){
        return;
      }
      let processKey = self.operateProcessKey;
      let label = item[`${self.keyTitle}`];
      let field = self.component.key;
      let key = "modify";
      let data = Object.keys(item).map(key => item[`${key}`]);
      let columns = Object.keys(item);
      let action = {
        field,
        key,
        label,
        processKey,
        data,
        columns
      };
      Object.assign(this.action, action);
      if (self.operateType === "dialog") {
        self.$refs.formActionDialogRef.show(true);
      } else {
        window.editDataTableItemByDrawer(self.action);
      }
    },
    async getTableItems() {
      let self = this;
      if (self.dataSourceUrl) {
        let params = {};
        let headers = {};
        self.requestHeaders.forEach(header => {
          headers[`${header.key}`] = self.parseTpl(header.value, {data: self.rootValue}, null);
        });
        // 搜索
        if (self.dataSource === "noco_db") {
          if (self.nocoDbConditions) {
            let where = "";
            this.component.data.noco_db_conditions.forEach((item, index) => {
              if (index === 0 && item.logical_operator === "~not") {
                where += `(${item.name},${item.operator},${item.value})`;
              } else {
                where += `${item.logical_operator}(${item.name},${item.operator},${item.value})`;
              }
            });
            params.where = where;
          }
        }
        // records
        let requestConfig = {
          url: self.parseTpl(self.dataSourceUrl, {data: self.rootValue}, null),
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
          let result = await axios(requestConfig);
          let items = _.get(result.data, self.requestDataPath);
          if (!self.requestDataPath || self.requestDataPath.length === 0) {
            items = result.data;
          }
          if (items && items.length > 0) {
            // 数据分组
            if (self.requestGroupKey) {
              self.groups = [];
              items.forEach(item => {
                let groupKey = item[`${self.requestGroupKey}`];
                let groupInFilter = true;
                if (self.groupsFilter && self.groupsFilter.length > 0) {
                  groupInFilter = self.groupsFilter.findIndex(group => group === groupKey) > -1;
                }
                let currentIndex = self.groups.findIndex(group => group.title === item[`${self.requestGroupKey}`]);
                // 不在预设分组中，不添加分组
                let currentSetIndex = self.dataGroupSet.findIndex(set => set.name === item[`${self.requestGroupKey}`]);
                if (currentSetIndex > -1 && groupInFilter) {
                  if (currentIndex === -1) {
                    // new group
                    self.groups.push({
                      title: item[`${self.requestGroupKey}`],
                      id: item[`${self.requestGroupKey}`],
                      items: [item],
                      showTitle: self.dataGroupSet[currentSetIndex]["show_name"]
                    });
                  } else {
                    // add item to group items
                    self.groups[currentIndex].items.push(item);
                  }
                }
              });
              // group sort
              self.groups.sort((a, b) => {
                let currentIndexA = self.dataGroupSet.findIndex(set => set.name === a.title);
                let aIndex, bIndex;
                if (currentIndexA !== -1) {
                  // aIndex = self.dataGroupSet[currentIndexA].index;
                  aIndex = currentIndexA;
                } else {
                  aIndex = -1;
                }
                let currentIndexB = self.dataGroupSet.findIndex(set => set.name === b.title);
                if (currentIndexB !== -1) {
                  // bIndex = self.dataGroupSet[currentIndexB].index;
                  bIndex = currentIndexB;
                } else {
                  bIndex = -1;
                }
                return aIndex - bIndex;
              });
            }
          }
          self.loading = false;
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
};
</script>

<style scoped>
.column {
  position: relative;
  display: flex;
  width: 300px;
  flex-direction: column;
  gap: 1rem;
  border-radius: 0.5rem;
  background-color: #F3F4F9;
  padding: 0.875rem;
  overflow-y: auto;
  min-width: 300px;
  max-width: 300px;
}

.column-title {
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 700;
  color: #312651;
  margin: 0;
}

.column-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  border-radius: 0.25rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12), 0px 16px 32px rgba(0, 0, 0, 0.08);
}

.column-title-desc {
  color: #312651;
  font-size: 14px;
}

.column-card-title {
  font-weight: 600;
  font-size: inherit;
  color: #312651;
  margin: 0;
}

.column-card-desc {
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #312651;
  opacity: 0.75;
  margin: 0;
}

.column-card-badge {
  align-self: flex-start;
  border-radius: 0.25rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  font-size: 13px;
  color: #312651;
  opacity: 0.75;
  border: 1px solid rgba(187, 187, 187, 0.75);
}
</style>
