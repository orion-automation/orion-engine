<template>
  <div class="d-flex flex-column"
       style="width: 100%">
    <gantt-elastic
      :options="options"
      :tasks="tasks"
      @taskList-task-click="onTaskClick"
      @taskList-project-click="onTaskClick"
      @taskList-milestone-click="onTaskClick"
      @chart-task-click="onTaskClick"
      @chart-project-click="onTaskClick"
      @chart-milestone-click="onTaskClick"
    >
    </gantt-elastic>
    <form-action-dialog :action="action" ref="formActionDialogRef" @onSaveSuccess="refreshTables"/>
  </div>
</template>

<script>
import axios from "axios";
import _ from "lodash";
import FormActionDialog from "@/components/common/formAction/FormActionDialog";

import GanttElastic from "gantt-elastic";
import dayjs from "dayjs";

export default {
  name: "TimeLine",
  components: {
    GanttElastic,FormActionDialog
  },
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
      dataSourceUrl: "",
      requestHeaders: [],
      requestMethod: "",
      requestBody: "",
      requestDataPath: "",
      tasks: [],
      options: {
        taskMapping: {
          progress: "percent"
        },
        maxRows: 100,
        maxHeight: 500,
        title: {
          label: "Your project title as html (link or whatever...)",
          html: false
        },
        row: {
          height: 24
        },
        calendar: {
          hour: {
            display: true
          }
        },
        chart: {
          progress: {
            bar: false
          },
          expander: {
            display: true
          }
        },
        taskList: {
          expander: {
            straight: false
          },
          columns: []
        },
        locale: {
          name: "en",
          Now: "Now",
          "X-Scale": "Zoom-X",
          "Y-Scale": "Zoom-Y",
          "Task list width": "Task list",
          "Before/After": "Expand",
          "Display task list": "Task list"
        }
      },
      dynamicStyle: {},
      lastId: 16,
      operateType: "dialog",
      operateProcessKey: "",
      action: {
        field: "",
        key: "",
        label: "",
        processKey: "",
        data: [],
        columns: [],
      },
    };
  },
  mounted() {
    let self = this;
    self.options.taskList.columns = self.component["columns"];
    self.options.maxHeight = self.component["maxHeight"];
    self.dataSourceUrl = self.component["data-source-url"];
    self.requestHeaders = self.component.request["headers"];
    self.requestMethod = self.component.request["method"];
    self.requestBody = self.component.request["body"];
    self.requestDataPath = self.component.request["dataPath"];
    self.operateType = self.component["operate_type"];
    self.operateProcessKey = self.component["operate_process_key"];
    self.getList();
  },
  methods: {
    refreshTables() {
      this.getList();
    },
    onTaskClick({data}) {
      let self = this;
      let item=data;
      if (!self.operateProcessKey||self.operateProcessKey.length===0){
        return;
      }
      let processKey = self.operateProcessKey;
      let label = item[`${self.component["label-key"]}`]||"";
      let field = self.component.key;
      let key = "modify";
      let dataAction = Object.keys(item).map(key => item[`${key}`]);
      let columns = Object.keys(item);
      let action = {
        field,
        key,
        label,
        processKey,
        data:dataAction,
        columns
      };
      Object.assign(this.action, action);
      if (self.operateType === "dialog") {
        self.$refs.formActionDialogRef.show(true);
      } else {
        window.editDataTableItemByDrawer(self.action);
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
    async getList() {
      let self = this;
      if (self.dataSourceUrl) {
        let params = {};
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
          if (!self.requestDataPath || self.requestDataPath.length === 0) {
            items = result.data;
          }
          self.tasks = items.map(item => {
            let task = Object.assign({},item);
            if (self.component["id-key"] && item[`${self.component["id-key"]}`]) {
              task.id = item[`${self.component["id-key"]}`];
            }
            if (self.component["label-key"] && item[`${self.component["label-key"]}`]) {
              task.label = item[`${self.component["label-key"]}`];
            }
            if (self.component["start-key"] && item[`${self.component["start-key"]}`]) {
              // 支持ISO数据格式
              if (self.component["start-data-type"] === "timestamp") {
                task.start = item[`${self.component["start-key"]}`];
              } else if (self.component["start-data-type"] === "iso") {
                let isoStr = item[`${self.component["start-key"]}`];
                task.start = new Date(isoStr).getTime();
                ;
              } else {
                task.start = item[`${self.component["start-key"]}`];
              }
            }
            if (self.component["progress-key"] && item[`${self.component["progress-key"]}`]) {
              task.percent = item[`${self.component["progress-key"]}`];
            }
            if (self.component["type-key"] && item[`${self.component["type-key"]}`]) {
              task.type = item[`${self.component["type-key"]}`];
            } else {
              task.type = "project";
            }
            if (self.component["collapsed-key"] && item[`${self.component["collapsed-key"]}`]) {
              task.collapsed = item[`${self.component["collapsed-key"]}`];
            }
            if (self.component["duration-key"] && item[`${self.component["duration-key"]}`]) {
              // 支持时间单位:天
              if (self.component["duration-data-type"] === "milliseconds") {
                task.duration = item[`${self.component["duration-key"]}`];
              } else if (self.component["duration-data-type"] === "day") {
                let dayStr = item[`${self.component["duration-key"]}`];
                // 转换天为毫秒
                try {
                  task.duration = Math.floor(Number.parseFloat(dayStr) * 24 * 60 * 60 * 1000);
                }catch (e) {
                  // parse duration faild
                  console.log("parse duration faild:",e);
                }
              } else {
                task.duration = item[`${self.component["duration-key"]}`];
              }
            }
            if (self.component["end-key"] && item[`${self.component["end-key"]}`]) {
              task.end = item[`${self.component["end-key"]}`];
            }
            if (self.component["dependentOn-key"] && item[`${self.component["dependentOn-key"]}`]) {
              task.dependentOn = item[`${self.component["dependentOn-key"]}`];
              if (task.dependentOn) {
                task.dependentOn = task.dependentOn.split(",");
              }
            }
            if (self.component["parentId-key"] && item[`${self.component["parentId-key"]}`]) {
              task.parentId = item[`${self.component["parentId-key"]}`];
            }
            if (self.component["style-key"] && item[`${self.component["style-key"]}`]) {
              task.style = item[`${self.component["style-key"]}`];
            }
            return task;
          });
        } catch (e) {
          console.log(e);
        }
      }
    },
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
