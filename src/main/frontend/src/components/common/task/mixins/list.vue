<template>
  <div></div>
</template>

<script>
import TaskCalendar from "@/components/common/TaskCalendar";
import utils from "@/utils/utils";
import InfiniteLoading from "vue-infinite-loading";
import moment from "moment/moment";
import taskRequest from "@/api/task";
import instanceRequest from "@/api/instance";
import TaskItem from "@/components/common/task/TaskItem";
import processRequest from "@/api/process";
import TaskSortMenu from "@/components/common/task/TaskSortMenu";

export default {
  name: "TaskListCommon",
  // eslint-disable-next-line vue/no-unused-components
  components: { TaskCalendar, InfiniteLoading, TaskItem, TaskSortMenu },
  data() {
    return {
      utils,
      calendar: {
        display: false,
        items: [],
        rangeItems: [],
      },
      tasks: {
        page: 0,
        pageCount: 0,
        itemsPerPage: 10,
        totalCount: 0,
        sortBy: "created",
        sortOrder: "desc",
        nameLike: "",
        active: true,
        columns: 1,
        items: [],
        infiniteId: +new Date(),
      },
      autoSelect: false,
      userId: this.$store.state.user.profile.id,
      tenantId: this.$store.getters["user/getTenant"].id,
      selectedDate: null,
      quickFilter: "",
      queryFilters: {},
      quickFilters: [
        {
          name: this.$t("mineTask"),
          key: "mine",
          icon: "mdi-playlist-check",
          count: 0,
        },
        {
          name: this.$t("dueTask"),
          key: "due",
          icon: "mdi-alarm-multiple",
          count: 0,
        },
        {
          name:this.$t("priorityTask"),
          key: "priority",
          icon: "mdi-flag-checkered",
          count: 0,
        },
        {
          name: this.$t("groupTask"),
          key: "group",
          icon: "mdi-account-multiple-outline",
          count: 0,
        },
        {
          name: this.$t("delegateToMeTask"),
          key: "in",
          icon: "mdi-account-arrow-left-outline",
          count: 0,
        },
        {
          name: this.$t("delegateToOthersTask"),
          key: "out",
          icon: "mdi-account-arrow-right",
          count: 0,
        },
      ],
      processVariables:[],
    };
  },
  async mounted() {
    this.queryFilters = this.$route.query;
    this.quickFilter = this.$route.query.type || "mine";
    await this.refreshTasks();
    await this.getQuickFilters();
  },
  methods: {
    getFilter() {
      if (this.quickFilter) {
        return this.getQuickFilter(this.quickFilter);
      }

      let filter = {
        orQueries: [],
      };
      if (this.tasks.nameLike) {
        filter.orQueries.push({
          processInstanceBusinessKeyLike: `%${this.tasks.nameLike}%`,
        });
      }

      if (this.tasks.active) {
        filter.orQueries.push({
          candidateUser: this.userId,
          assignee: this.userId,
        });
      } else {
        filter.taskAssignee = this.userId;
        filter.finished = true;
      }
      if (this.tasks.active || this.quickFilter) {
        // not history
        filter["nameNotLike"] = "Complete a Question";
      }
      return filter;
    },
    getQuickFilter(key, processDefinitionKeyIn) {
      let data;
      switch (key) {
        case "mine":
          data = {
            assignee: this.userId,
          };
          break;
        case "priority":
          data = {
            assignee: this.userId,
            minPriority: 80,
            maxPriority: 90,
          };
          break;
        case "due":
          const dueBefore = utils.formatDateTime(
            new Date(),
            "YYYY-MM-DDT24:00:00.SSS+0800"
          );
          data = {
            assignee: this.userId,
            dueBefore,
          };
          break;

        case "group":
          if (this.delegate && this.delegate.groups) {
            // data = {
            //   candidateGroup: this.delegate.groups,
            // };
            data = {
              candidateGroups: this.delegate.groups.split(","),
            };
          } else {
            data = {
              candidateUser: this.userId,
            };
          }

          break;
        case "in":
          data = {
            delegationState: "PENDING",
            assignee: this.userId,
          };
          break;
        case "out":
          data = {
            delegationState: "PENDING",
            owner: this.userId,
            //  assigneeNotIn: [this.userId],
          };
          break;
        case "custom":
          data = this.customFilter;
          break;
        default:
          break;
      }
      if (this.tasks.nameLike) {
        data.nameLike = `%${this.tasks.nameLike}%`;
      }
      data.processVariables = this.processVariables;
      if (this.queryFilters){
        Object.keys(this.queryFilters).forEach(key=>{
          data[`${key}`]=this.queryFilters[`${key}`];
        });
      }
      if (this.tasks.active || this.quickFilter) {
        // not history
        data["nameNotLike"] = "Complete a Question";
      }
      if (key!=="custom"){
        data.processDefinitionKeyIn = processDefinitionKeyIn || [];
      }
      return data;
    },
    async getQuickFilters() {
      for (let i = 0; i < this.quickFilters.length; i++) {
        let filter = this.quickFilters[i];
        let data = this.getQuickFilter(filter.key);
        if (!this.isPc) {
          delete data.nameLike;
        }
        const response = await taskRequest.postTaskCount("", null, data);
        filter.count = response.count;
      }
    },

    async selectQuickFilter(key) {
      this.quickFilter = key;
      this.tasks.nameLike = "";
      this.tasks.sortBy = "created";
      await this.refreshTasks();
    },
    async setSort(payloads) {
      this.tasks.sortBy = payloads.sortBy;
      this.tasks.sortOrder = payloads.sortOrder;
      await this.refreshTasks();
    },
    async setActive(active) {
      this.quickFilter = "";
      this.tasks.active = active;
      this.tasks.sortBy = active ? "created" : "startTime";
      await this.refreshTasks();
    },
    async refreshTasks() {
      if (this.searchDialog && this.searchDialog.display) {
        this.searchDialog.display = false;
      }
      this.tasks.items = [];
      this.tasks.infiniteId++;
      let data = this.getFilter();
      await this.getCalendar();
      let isRuntime;
      if (this.isPc) {
        // pc
        isRuntime = this.tasks.active;
      } else {
        // mobile
        isRuntime = this.tasks.active || this.quickFilter;
      }
      let response = await taskRequest.postTaskCount(
        isRuntime ? "" : "history",
        null,
        data
      );
      this.tasks.totalCount = response.count;
    },
    async setRange(range, date) {
      await this.$store.dispatch("common/setPageLoading", true);
      let start = moment(date).startOf("month");
      let end = moment(date).endOf("month");
      if (range) {
        start = range.start;
        end = range.end;
      }
      let data = this.getFilter();
      if (!data.dueBefore) {
        data.dueBefore = utils.formatDateTime(end, "YYYY-MM-DDT24:00:00.SSS+0800");
      }

      if (!data.dueAfter) {
        data.dueAfter = utils.formatDateTime(start, "YYYY-MM-DDT00:00:00.SSS+0800");
      }

      let isRuntime;
      if (this.isPc) {
        // pc
        isRuntime = this.tasks.active;
      } else {
        // mobile
        isRuntime = this.tasks.active || this.quickFilter;
      }
      let tasks = await taskRequest.postTaskList(isRuntime ? "" : "history", {}, data);
      tasks = await processRequest.getAllTaskItemInfo(tasks, this.tenantId);
      this.calendar.rangeItems = tasks;
      await this.$store.dispatch("common/setPageLoading", false);
    },
    async getTasksPage($state) {
      let data = this.getFilter();
      data.sorting = [{ sortBy: this.tasks.sortBy, sortOrder: this.tasks.sortOrder }];

      let isRuntime;
      if (this.isPc) {
        // pc
        isRuntime = this.tasks.active;
      } else {
        // mobile
        isRuntime = this.tasks.active || this.quickFilter;
      }
      let tasks = await taskRequest.postTaskList(
        isRuntime ? "" : "history",
        {
          firstResult: this.tasks.items.length,
          maxResults: this.tasks.itemsPerPage,
        },
        data
      );
      tasks = await processRequest.getAllTaskItemInfo(tasks, this.tenantId);
      if (!(this.task && this.task.id)) {
        if (this.autoSelect && tasks.length > 0) {
          // 自动选择第一个
          this.onTaskItemClick(tasks[0]);
        }
      }
      this.tasks.items = this.tasks.items.concat(tasks);
      if (this.tasks.items.length===0 && this.pcCommitSuccess){
        this.noTaskDialog.display = true;
        this.pcCommitSuccess = false;
      }
      this.pcCommitSuccess = false;
      $state.loaded();
      if (tasks.length < this.tasks.itemsPerPage) {
        $state.complete();
      }
    },
    async getCalendar() {
      let data = this.getFilter();
      data.sorting = [{ sortBy: this.tasks.sortBy, sortOrder: this.tasks.sortOrder }];
      let isRuntime;
      if (this.isPc) {
        // pc
        isRuntime = this.tasks.active;
      } else {
        // mobile
        isRuntime = this.tasks.active || this.quickFilter;
      }
      let tasks = await taskRequest.postTaskList(isRuntime ? "" : "history", {}, data);
      this.calendar.items = tasks;
    },
  },
  computed: {
    isPc() {
      return this.idBreadcrumbs;
    },
    selectedQuickFilter() {
      if (this.quickFilter) {
        return this.quickFilters.find((filter) => filter.key === this.quickFilter);
      }
      return null;
    },
  },
  watch:{
    "$i18n.locale": {
      handler(val){
        let self=this;
        self.quickFilters = [
          {
            name: this.$t("mineTask"),
            key: "mine",
            icon: "mdi-playlist-check",
            count: 0,
          },
          {
            name: this.$t("dueTask"),
            key: "due",
            icon: "mdi-alarm-multiple",
            count: 0,
          },
          {
            name:this.$t("priorityTask"),
            key: "priority",
            icon: "mdi-flag-checkered",
            count: 0,
          },
          {
            name: this.$t("groupTask"),
            key: "group",
            icon: "mdi-account-multiple-outline",
            count: 0,
          },
          {
            name: this.$t("delegateToMeTask"),
            key: "in",
            icon: "mdi-account-arrow-left-outline",
            count: 0,
          },
          {
            name: this.$t("delegateToOthersTask"),
            key: "out",
            icon: "mdi-account-arrow-right",
            count: 0,
          },
        ];
      },
    },
  }
};
</script>

<style scoped></style>
