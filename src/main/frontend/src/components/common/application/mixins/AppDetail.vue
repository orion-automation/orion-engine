<template>
  <div />
</template>

<script>
import processRequest from "@/api/process";
import instanceRequest from "@/api/instance";
import utils from "@/utils/utils";
import InfiniteLoading from "vue-infinite-loading";
import ApplicationInstanceListItem from "@/components/common/application/ApplicationInstanceListItem";
import { getBase64 } from "@/utils/common";
import formRequest from "@/api/form";
import { Form } from "vue-formio-eorion";
import taskRequest from "@/api/task";
import ApplicationAssociations from "@/components/common/application/ApplicationAssociations";
import camundaService from "@/api/camunda-service";
import InstanceMilestone from "@/components/common/InstanceMilestone";

export default {
  name: "AppDetail",
  components: {
    InfiniteLoading,
    ApplicationInstanceListItem,
    formio: Form,
    ApplicationAssociations,
    InstanceMilestone
  },
  data() {
    return {
      utils,
      formValue: {},
      formData: null,
      groups: [],
      instances: {
        infiniteId: +new Date(),
        itemsPerPage: 10,
        totalCount: 0,
        sortBy: "startTime",
        sortOrder: "desc",
        active: true,
        items: [],
      },
      tasks: {
        infiniteId: +new Date(),
        itemsPerPage: 10,
        totalCount: 0,
        sortBy: "",
        sortOrder: "desc",
        active: true,
        linkTaskFilter: "all",
        items: [],
      },
      datas: {
        infiniteId: +new Date(),
        itemsPerPage: 10,
        totalCount: 0,
        items: [],
      },
      searchDialog: {
        display: false,
        searchKey: "",
        processInstanceBusinessKeyLike: "",
        processInstanceId: "",
        taskLike: "",
        dataLike: "",
        startedBefore: "",
        startedAfter: "",
        displayStartedBefore: false,
        displayStartedAfter: false,
      },
      process: {
        versions: [],
        relates: [],
        deploymentId: "",
        key: "",
      },
      userId: this.$store.state.user.profile.id,
      tenantId: this.$store.getters["user/getTenant"].id,
      autoSelect: false,
    };
  },
  methods: {
    async stopInstance(instance) {
      if (instance.state !== "COMPLETED") {
        await instanceRequest.deleteProcessInstanceById(instance.id, {
          skipCustomListeners: true,
          skipIoMappings: true,
        });
      }
      await instanceRequest.deleteHistoryProcessInstanceById(instance.id);
    },
    async getForm(id) {
      this.formData = null;
      let startFormKey = await processRequest.getStartFormKey(id);

      let variables = await instanceRequest.getHistoryDetail({
        processInstanceId: this.instance.id,
        initial: true,
      });

      this.formValue = {};
      this.formValue["formUserId"] = this.$store.state.user.profile.id;
      this.formValue["formUserName"] = this.$store.getters["user/getUserName"];
      this.formValue["tenant"] = this.$store.getters["user/getTenant"].id;
      this.formValue["tenantName"] = this.$store.getters["user/getTenant"].name;
      for (var i in variables) {
        const variable = variables[i];
        if (variable.variableType == "File") {
          let file = await instanceRequest.getHistoryDetailFile(variable.id);
          let base64 = await getBase64(file);
          this.formValue[variable.variableName] = base64;
        } else {
          this.formValue[variable.variableName] = variable.value;
        }
      }
      this.formValue = { data: this.formValue };

      if (startFormKey.key != null) {
        let response = await formRequest.getFormDetail(startFormKey.key);
        var formData = {
          components: response.formData,
        };
        this.formData = formData;
      }
    },
    async getProcess() {
      let process;
      if (this.process.id && this.process.id !== "null") {
        process = await processRequest.getProcess(this.process.id);
      } else {
        process = await processRequest.getProcessDefinitionByKey(
          this.process.key
        );
      }
      let processDefKeyIn = [process.key];
      // 获取流程对应icon
      let iconResults = await processRequest.getProcessIconByKeys(
        this.tenantId,
        processDefKeyIn
      );
      let iconResult = iconResults.find(
        (iconResult) => iconResult.appKey === process.key
      );
      let icon = { color: "#444262" };
      if (iconResult && iconResult.configJson) {
        icon.icon = `${iconResult.configJson.iconType} fa-fw ${iconResult.configJson.icon}`;
      }
      process.icon = icon.icon;
      process.iconColor = icon.color;
      process.versions = [];
      process.relates = [];
      this.process = process;
    },
    buildInstanceFilter() {
      let filter = {
        variables: [
          {
            name: "startUserId",
            operator: "eq",
            value: this.userId,
          },
        ],
        orQueries: [
          {
            name: "involvedUserId",
            operator: "eq",
            value: this.userId,
          },
        ],
      };
      if (this.process.key || this.$route.params.key) {
        filter.processDefinitionKey =
          this.process.key || this.$route.params.key;
      }

      if (this.searchDialog.processInstanceBusinessKeyLike) {
        filter.processInstanceBusinessKeyLike = `%${this.searchDialog.processInstanceBusinessKeyLike}%`;
      }
      if (this.searchDialog.processInstanceId) {
        filter.processInstanceId = this.searchDialog.processInstanceId;
      }

      let field = this.instances.active ? "active" : "completed";
      filter[field] = true;

      let formattedDate;
      if (this.searchDialog.startedBefore) {
        formattedDate =
          utils.formatDateTime(
            this.searchDialog.startedBefore,
            "yyyy-MM-DDTHH:mm:ss.SSS"
          ) +
          utils
            .formatDateTime(this.searchDialog.startedBefore, "Z")
            .replace(":", "");

        filter.startedBefore = formattedDate;
      }
      if (this.searchDialog.startedAfter) {
        formattedDate =
          utils.formatDateTime(
            this.searchDialog.startedAfter,
            "yyyy-MM-DDTHH:mm:ss.SSS"
          ) +
          utils
            .formatDateTime(this.searchDialog.startedAfter, "Z")
            .replace(":", "");

        filter.startedAfter = formattedDate;
      }
      return filter;
    },
    buildTaskFilter() {
      let filter = {
        orQueries: [],
      };
      if (this.instance && this.instance.processDefinitionKey) {
        filter.processDefinitionKey = this.instance.processDefinitionKey;
      }
      if (this.process && this.process.key) {
        filter.processDefinitionKey = this.process.key;
      }
      if (this.instance && this.tasks.linkTaskFilter==="current"){
        filter.processInstanceId = this.instance.id;
      }
      if (this.searchDialog.taskLike) {
        filter.orQueries.push({
          processInstanceBusinessKeyLike: `%${this.searchDialog.taskLike}%`,
        });
      }
      if (this.searchDialog.processInstanceBusinessKeyLike) {
        filter.orQueries.push({
          processInstanceBusinessKeyLike: `%${this.searchDialog.processInstanceBusinessKeyLike}%`,
        });
      }

      if (this.tasks.active || !this.process.key) {
        filter.orQueries.push({
          candidateUser: this.userId,
          assignee: this.userId,
        });
      } else {
        filter.taskAssignee = this.userId;
        filter.finished = true;
      }

      return filter;
    },
    buildDataFilter() {
      let filter = {
        tenant: this.$store.state.user.tenant,
        nameLike: this.searchDialog.dataLike,
        appKey: this.process.key,
        type: "ux",
        category: "bpezAppReport",
        groups: this.groups.map((group) => group.id),
      };

      return filter;
    },
    async refreshInstances() {
      this.instances.items = [];
      this.instances.infiniteId++;
      // 获取总数
      let { count } = await processRequest.postInstanceCount(
        "history",
        {},
        this.buildInstanceFilter()
      );
      this.instances.totalCount = count;
      // 查询数量变化
      let navigations = this.$store.state.common.navigations;
      if (navigations && navigations[0]) {
        navigations[0].count = this.instances.totalCount;
        await this.$store.dispatch("common/setNavigations", navigations);
      }
    },
    async getInstancesPage($state) {
      let filter = this.buildInstanceFilter();
      filter.sorting = [
        {
          sortBy: this.instances.sortBy,
          sortOrder: this.instances.sortOrder,
        },
      ];
      let items = await processRequest.postInstanceListWithParams(
        "history",
        {
          firstResult: this.instances.items.length,
          maxResults: this.instances.itemsPerPage,
        },
        filter
      );
      items = await processRequest.getAllInstanceItemInfo(items, this.tenantId);
      if (!(this.instance && this.instance.id)) {
        if (this.autoSelect && items.length > 0) {
          // 自动选择第一个
          this.selectInstance(items[0]);
        }
      }
      this.instances.items = this.instances.items.concat(items.filter(item=>this.instances.items.findIndex(data=>data.id===item.id)===-1));
      $state.loaded();
      if (items.length < this.instances.itemsPerPage) {
        $state.complete();
      }
    },
    async refreshTasks(active) {
      this.tasks.active = active;
      this.tasks.items = [];
      let filter = this.buildTaskFilter();
      if (!filter.processDefinitionKey) {
        this.tasks.totalCount = 0;
        return;
      }
      this.tasks.infiniteId++;
      // 获取总数
      let { count } = await taskRequest.postTaskCount(
        this.tasks.active || !this.process.key ? "" : "history",
        {},
        this.buildTaskFilter()
      );
      this.tasks.totalCount = count;
    },
    async refreshDatas() {
      this.datas.items = [];
      this.datas.infiniteId++;

      let { count } = await camundaService.getApplicationCount(
        this.buildDataFilter()
      );
      this.datas.totalCount = count;
    },
    async getTasksPage($state) {
      let filter = this.buildTaskFilter();
      if (!filter.processDefinitionKey) {
        $state.complete();
        return;
      }
      filter.sorting = [
        {
          sortBy:
            this.tasks.active || !this.process.key ? "created" : "startTime",
          sortOrder: this.tasks.sortOrder,
        },
      ];

      let taskList = await taskRequest.postTaskList(
        this.tasks.active || !this.process.key ? "" : "history",
        {
          firstResult: this.tasks.items.length,
          maxResults: this.tasks.itemsPerPage,
        },
        filter
      );
      taskList = await processRequest.getAllTaskItemInfo(
        taskList,
        this.tenantId
      );
      this.tasks.items = this.tasks.items.concat(taskList.filter(item=>this.tasks.items.findIndex(data=>data.id===item.id)===-1));
      $state.loaded();
      if (taskList.length < this.tasks.itemsPerPage) {
        $state.complete();
      }
    },
    async getDatasPage($state) {
      let filter = this.buildDataFilter();
      let dataList = await camundaService.getApplications(
        {
          firstResult: this.datas.items.length,
          maxResults: this.datas.itemsPerPage,
        },
        filter
      );
      this.datas.items = this.datas.items.concat(dataList.filter(item=>this.datas.items.findIndex(data=>data.id===item.id)===-1));
      $state.loaded();
      if (this.datas.items.length >= this.datas.totalCount) {
        $state.complete();
      }
    },
  },
};
</script>

<style scoped></style>
