<template>
  <div style="padding: 0 0px 75px 0px">
    <v-card class="overview" outlined>
      <v-list
        style="padding: 0 0px; border-radius: 6px; background-color: unset"
      >
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
      <div
        class="d-flex flex-row"
        style="align-items: center; color: #b1abb6; font-size: 12px; gap: 10px"
      >
        <div style="height: 1px; background-color: #d4d4d4; flex: 1" />
        {{ $t('taskDirectFilter') }}
        <div style="height: 1px; background-color: #d4d4d4; flex: 1" />
      </div>
      <v-card-actions
        class="d-flex"
        style="justify-content: center; padding: 0 15px"
      >
        <v-icon
          @click="calendar.display = !calendar.display"
          size="20"
          color="#57928D"
          style="flex: 0"
        >
          {{
            calendar.display
              ? "mdi-format-list-bulleted-type"
              : "mdi-calendar-multiselect"
          }}
        </v-icon>
        <div style="flex: 1;width: 0;display: contents">
          <input
            v-model="tasks.nameLike"
            class="search"
            style="width: 100%;margin-right: 25px"
            :placeholder="$t('searchTaskWithDot')"
            @blur="refreshTasks"
          />
          <template
          v-if="(queryFilters&&Object.keys(queryFilters).length>0)||(processVariables&&processVariables.length>0)||(tasks.nameLike&&tasks.nameLike.length>0)">
            <v-badge bordered dot overlap color="#FF7754"
                     style="position: relative;right: 10px"
                     :value="(queryFilters&&Object.keys(queryFilters).length>0)||(processVariables&&processVariables.length>0)||(tasks.nameLike&&tasks.nameLike.length>0)">
              <v-icon
                size="20"
                color="#444262"
                @click="clearFilter"
                style="position: relative;right: 10px"
              >
                mdi-filter-remove-outline
              </v-icon>
            </v-badge>
          </template>
          <template v-else>
            <v-icon
              size="20"
              color="#444262"
              @click="clearFilter"
              style="position: relative;right: 10px"
            >
              mdi-filter-remove-outline
            </v-icon>
          </template>
        </div>
        <task-sort-menu
          :quick-filter="quickFilter"
          :tasks-active="tasks.active"
          :tasks-sort-order="tasks.sortOrder"
          @setSort="setSort"
          @setActive="setActive"
        />
      </v-card-actions>
    </v-card>
    <div
      v-if="quickFilter"
      class="d-flex"
      style="
        justify-content: center;
        padding: 0 15px;
        background-color: #ffffff;
        border-bottom: #eae9ec 1px solid;
      "
    >
      <v-icon
        @click="calendar.display = !calendar.display"
        size="20"
        color="#83829A"
        style="flex: 0"
      >
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
      <v-icon
        @click="calendar.display = !calendar.display"
        size="20"
        color="#83829A"
        style="flex: 0"
      >
        mdi-sort-variant
      </v-icon>
      <div class="quick-name">
        {{
          `${tasks.nameLike ? $t('customSearch')+" + " : ""}${
             $t(tasks.active ?'doing':'done')
          }`
        }}
      </div>
      <v-badge
        v-show="tasks.totalCount"
        class="count-badge"
        color="#FF7754"
        inline
      >
        <template #badge>
          <div>
            {{ tasks.totalCount }}
          </div>
        </template>
      </v-badge>
    </div>
    <task-calendar
      v-show="calendar.display"
      :items="calendar.items"
      @setRange="setRange"
      style="margin: 6px"
    />

    <v-card class="content" outlined>
      <v-list
        three-line
        style="padding: 0 0; border-radius: 6px"
        v-if="!calendar.display"
      >
        <task-item
          v-for="item in tasks.items"
          :key="item.id"
          @onItemClick="onTaskItemClick"
          :task="item" />
      </v-list>
      <infinite-loading
        v-if="!calendar.display"
        @infinite="getTasksPage"
        :identifier="tasks.infiniteId"
      >
        <template #no-more>
          <div class="d-flex flex-row infinite-more-container">
            <div class="infinite-more-container-pre" />
            <div class="infinite-more-container-content">{{ $t('noMoreTask') }}</div>
            <div class="infinite-more-container-pre" />
          </div>
        </template>
      </infinite-loading>

      <v-list
        three-line
        style="padding: 0 0; border-radius: 6px"
        v-if="calendar.display"
      >
        <task-item
          v-for="item in calendar.rangeItems"
          :key="item.id"
          @onItemClick="onTaskItemClick"
          :task="item" />
        <v-list-item
          v-show="!calendar.rangeItems.length"
          style="min-height: unset; padding: 10px 18px"
        >
          {{ $t('noData') }}
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>
<script>
import TaskListCommon from "@/components/common/task/mixins/list";

export default {
  mixins: [TaskListCommon],
  data() {
    return {};
  },
  methods: {
    onTaskItemClick(item) {
      this.$router.push({
        name: "task-detail",
        params: { id: item.id }
      });
    },
    clearFilter(){
      let self=this;
      self.tasks.nameLike=null;
      self.processVariables=[];
      self.queryFilters = {};
      self.getQuickFilters();
      self.refreshTasks();
    },
    async searchByScan() {
      let self=this;
      try {
        let str = "{}";
        let searchVars=JSON.parse(str);
        if (searchVars.processVariables){
          // 解析参数，搜索task列表
          self.processVariables=searchVars.processVariables;
          await self.refreshTasks();
        } else {
          throw new Error();
        }
      } catch (e) {
        self.$notify.error(self.$t("currentCodeErr"));
      }
    }
  }
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
  top: 1px;
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
