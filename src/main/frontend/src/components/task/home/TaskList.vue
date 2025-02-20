<template>
  <div style="padding: 0 0px 75px 0px">
    <v-card class="overview" outlined>
      <v-list style="padding: 0 0px; border-radius: 6px; background-color: unset">
        <div
          class="d-flex"
          style="
            height: 60px;
            justify-content: center;
            align-items: center;
            padding-top: 9px;
          "
        >
          <div
            class="filter"
            :class="{
              current: quickFilter === item.key,
            }"
            @click="selectQuickFilter(item.key)"
            v-for="item in quickFilters"
            :key="item.key"
          >
            <v-badge bordered dot overlap color="#FF7754" :value="item.count">
              <v-icon size="22">
                {{ item.icon }}
              </v-icon>
            </v-badge>
          </div>
        </div>
      </v-list>
      <v-card-actions class="d-flex" style="justify-content: center; padding: 0 15px">
        <input
          v-model="tasks.nameLike"
          class="search"
          :placeholder="$t('searchTaskWithDot')"
          @blur="refreshTasks"
        />
      </v-card-actions>
    </v-card>
    <div
      v-if="quickFilter&&selectedQuickFilter"
      class="d-flex"
      style="
        justify-content: center;
        padding: 0 15px;
        background-color: #ffffff;
        border-bottom: #eae9ec 1px solid;
      "
    >
      <v-icon size="20" color="#83829A" style="flex: 0">
        {{ selectedQuickFilter.icon }}
      </v-icon>
      <div class="quick-name">{{ selectedQuickFilter.name }}</div>
      <v-badge
        v-show="selectedQuickFilter.count"
        class="count-badge"
        color="#FF7754"
        inline
      >
        <template #badge>
          <div>
            {{ selectedQuickFilter.count }}
          </div>
        </template>
      </v-badge>
    </div>
    <div
      v-else
      class="d-flex"
      style="
        justify-content: center;
        padding: 0 15px;
        background-color: #ffffff;
        border-bottom: #eae9ec 1px solid;
      "
    >
      <v-icon size="20" color="#83829A" style="flex: 0">
        mdi-calendar-multiselect
      </v-icon>
      <div class="quick-name">
        {{ `${tasks.nameLike ? $t('customSearch')+" + " : ""}` }}{{ $t('recentTask') }}
      </div>
      <v-badge v-show="tasks.totalCount" class="count-badge" color="#FF7754" inline>
        <template #badge>
          <div>
            {{ tasks.totalCount }}
          </div>
        </template>
      </v-badge>
    </div>
    <v-card class="content" outlined>
      <v-list three-line style="padding: 0 0; border-radius: 6px">
        <task-item
          v-for="(item,index) in tasks.items"
          :key="`task-item-${index}-${item.id}`"
          @onItemClick="onTaskItemClick"
          :task="item"
        />
      </v-list>
      <infinite-loading @infinite="getTasksPage" :identifier="tasks.infiniteId">
        <template #no-more>
          <div class="d-flex flex-row infinite-more-container">
            <div class="infinite-more-container-pre" />
            <div class="infinite-more-container-content">{{ $t('noMoreTask') }}</div>
            <div class="infinite-more-container-pre" />
          </div>
        </template>
      </infinite-loading>
    </v-card>
  </div>
</template>
<script>
import TaskListCommon from "@/components/common/task/mixins/list";
import moment from "moment/moment";
import utils from "@/utils/utils";
import taskRequest from "@/api/task";

export default {
  mixins: [TaskListCommon],
  props: {
    processKeys: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      rangeFilter: {},
      customFilter: {}
    };
  },
  computed: {
    keys() {
      let keys = (this.processKeys || "")
        .split(",")
        .map((key) => key.trim())
        .filter((key) => key.length);

      return keys;
    },
  },
  methods: {
    async getQuickFilters() {
      for (let i = 0; i < this.quickFilters.length; i++) {
        let filter = this.quickFilters[i];
        let data = this.getQuickFilter(filter.key, this.keys);
        if (!this.isPc) {
          delete data.nameLike;
        }
        const response = await taskRequest.postTaskCount("", null, data);
        filter.count = response.count;
      }
    },
    getFilter() {
      if (this.quickFilter) {
        let data = this.getQuickFilter(this.quickFilter, this.keys);
        return data;
      }

      let filter = {
        orQueries: [],
        processDefinitionKeyIn: this.keys,
      };
      if (this.tasks.nameLike) {
        filter.orQueries.push({
          processInstanceBusinessKeyLike: `%${this.tasks.nameLike}%`,
        });
      }
      filter.orQueries.push({
        candidateUser: this.userId,
        assignee: this.userId,
      });

      filter["nameNotLike"] = "Complete a Question";
      Object.assign(filter, this.rangeFilter);
      return filter;
    },
    async selectCustomQuickFilter(key,customFilter) {
      this.quickFilter = key;
      this.tasks.nameLike = "";
      this.tasks.sortBy = "created";
      this.rangeFilter = {};
      this.customFilter=customFilter;
      this.$emit("selectQuickFilter");
      await this.refreshTasks();
    },
    async selectQuickFilter(key) {
      this.quickFilter = key;
      this.tasks.nameLike = "";
      this.tasks.sortBy = "created";
      this.rangeFilter = {};
      this.$emit("selectQuickFilter");
      await this.refreshTasks();
    },
    async setRange(range, date) {
      if ((range && range.start) || date) {
        this.quickFilter = "";
        let start = moment(date).startOf("month");
        let end = moment(date).endOf("month");
        if (range && range.start) {
          start = range.start;
          end = range.end;
        }
        this.rangeFilter = {
          dueBefore: utils.formatDateTime(end, "YYYY-MM-DDT24:00:00.SSS+0800"),
          dueAfter: utils.formatDateTime(start, "YYYY-MM-DDT00:00:00.SSS+0800"),
        };
        await this.refreshTasks();
      }
    },
    onTaskItemClick(item) {
      let routeData = {
        name: "task-list",
        query: { defaultSearchTaskId: item.id },
      };

      if (this.processKeys === null) {
        this.$router.push(routeData);
      } else {
        this.$store.dispatch("common/setEditTaskId",item.id);
      }
    },
    async refreshTasks() {
      if (this.searchDialog && this.searchDialog.display) {
        this.searchDialog.display = false;
      }
      this.tasks.items = [];
      this.tasks.infiniteId++;
      let data = this.getFilter();
      let response = await taskRequest.postTaskCount("", null, data);
      this.tasks.totalCount = response.count;
    },
  },
};
</script>

<style scoped>
.overview {
  margin-top: 0px;
  border-radius: 0px;
  border: none;
  color: #444262;
  background-color: #e6e4e6b5;
  position: sticky;
  z-index: 1;
  backdrop-filter: blur(10px);
}

.point::after {
  font-size: 14px;
  content: "";
  display: block;
  width: 7px;
  height: 7px;
  background-color: #ff7754;
  border-radius: 50%;
  position: relative;
  left: -5px;
  top: -8px;
  opacity: 1;
}

.search {
  flex: 1;
  height: 30px;
  line-height: 20px;
  margin: 15px;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 1);
  /* color: rgba(131, 130, 154, 1); */
  font-size: 14px;
  border: 1px solid rgba(177, 171, 182, 1);
  text-align: center;
  padding: 0 10px;
}

.quick-name {
  flex: 1;
  margin: 15px;
  color: #444262;
  font-size: 16px;
}

.content {
  border-radius: 0px;
  background-color: rgba(255, 255, 255, 1);
  color: rgba(16, 16, 16, 1);
  font-size: 14px;
  border: none;
  margin-top: 0px;
}

.v-list--dense.menu-list .v-list-item {
  height: 50px;
}

.v-list--dense.menu-list .v-list-item:not(:last-child) {
  border-bottom: 1px solid #e6e4e6;
}

.v-list--dense.menu-list .v-list-item .v-list-item__title {
  color: #444262;
  font-size: 14px;
}

.v-list--dense.menu-list .v-list-item .v-list-item__title .v-icon {
  margin-right: 5px;
}

.v-list--dense.menu-list .v-list-item .v-list-item__title.current {
  font-weight: bold;
}

.dashed {
  border-bottom: 1px #bbbbbb dashed;
  margin: 14px 0;
}

.subtitle {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.filter {
  flex: 1;
  text-align: center;
  position: relative;
}

.filter:deep(i.theme--light.v-icon) {
  color: #444262;
}

.filter.current:deep(i.theme--light.v-icon) {
  color: #ff7754;
}

.count-badge:deep(.v-badge__wrapper) {
  height: auto;
}
</style>
