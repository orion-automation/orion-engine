<template>
  <div style="padding: 0 0 85px 0">
    <v-card class="content" outlined>
      <v-list
        v-if="$store.state.common.currentNavigation === 'process'"
        three-line
        style="padding: 0; border-radius: 0px"
      >
        <application-instance-list-item
          v-for="item in instances.items"
          :key="item.id"
          @onItemClick="onInstanceItemClick"
          :instance="item"
        />
      </v-list>
      <infinite-loading
        v-if="$store.state.common.currentNavigation === 'process'"
        @infinite="getInstancesPage"
        :identifier="instances.infiniteId"
      >
        <template #no-more>
          <div class="d-flex flex-row infinite-more-container">
            <div class="infinite-more-container-pre" />
            <div class="infinite-more-container-content">{{ $t("noMoreProcess") }}</div>
            <div class="infinite-more-container-pre" />
          </div>
        </template>
      </infinite-loading>

      <v-list
        v-if="$store.state.common.currentNavigation === 'task'"
        three-line
        style="padding: 0; border-radius: 0px"
      >
        <task-item
          v-for="item in tasks.items"
          :key="item.id"
          @onItemClick="onTaskItemClick"
          :task="item"
        />
      </v-list>

      <infinite-loading
        v-if="$store.state.common.currentNavigation === 'task'"
        @infinite="getTasksPage"
        :identifier="tasks.infiniteId"
      >
        <template #no-more>
          <div class="d-flex flex-row infinite-more-container">
            <div class="infinite-more-container-pre" />
            <div class="infinite-more-container-content">{{ $t("noMoreTask") }}</div>
            <div class="infinite-more-container-pre" />
          </div>
        </template>
      </infinite-loading>

      <v-list
        v-if="$store.state.common.currentNavigation === 'data'"
        three-line
        style="padding: 0; border-radius: 0px"
      >
        <application-instance-data-item
          v-for="item in datas.items"
          @onItemClick="onDataItemClick"
          :key="item.id"
          :item="item"
        />
      </v-list>
      <infinite-loading
        v-if="$store.state.common.currentNavigation === 'data'"
        @infinite="getDatasPage"
        :identifier="datas.infiniteId"
      >
        <template #no-more>
          <div class="d-flex flex-row infinite-more-container">
            <div class="infinite-more-container-pre" />
            <div class="infinite-more-container-content">{{ $t("noMoreData") }}</div>
            <div class="infinite-more-container-pre" />
          </div>
        </template>
      </infinite-loading>
    </v-card>

    <v-menu
      :position-y="55"
      :position-x="2000"
      absolute
      offset-y
      v-model="displaySortMenu"
    >
      <v-list style="cursor: pointer; padding: 0px 0px" class="menu-list" dense>
        <v-list-item v-if="$store.state.common.currentNavigation === 'process'">
          <v-list-item-title
            :class="{ current: instances.active }"
            @click="setActive('instances', true)"
          >
            <v-icon size="14">mdi-play</v-icon>
            <span>{{ $t("doing") }}</span>
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="$store.state.common.currentNavigation === 'process'">
          <v-list-item-title
            :class="{ current: !instances.active }"
            @click="setActive('instances', false)"
            style="display: flex"
          >
            <v-icon size="14">mdi-stop</v-icon>
            <span>{{ $t("done") }}</span>
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="$store.state.common.currentNavigation === 'process'">
          <v-list-item-title
            :class="{ current: instances.sortOrder === 'asc' }"
            @click="setSort('instances', 'asc')"
            style="display: flex"
          >
            <v-icon size="14">mdi-sort-ascending</v-icon>
            <span>{{ $t("createTimeAsc") }}</span>
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="$store.state.common.currentNavigation === 'process'">
          <v-list-item-title
            :class="{ current: instances.sortOrder === 'desc' }"
            @click="setSort('instances', 'desc')"
            style="display: flex"
          >
            <v-icon size="14">mdi-sort-descending</v-icon>

            <span>{{ $t("createTimeDesc") }}</span>
          </v-list-item-title>
        </v-list-item>

        <v-list-item v-if="$store.state.common.currentNavigation === 'task'">
          <v-list-item-title
            :class="{ current: tasks.active }"
            @click="setActive('tasks', true)"
          >
            <v-icon size="14">mdi-play</v-icon>
            <span>{{ $t("doing") }}</span>
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="$store.state.common.currentNavigation === 'task'">
          <v-list-item-title
            :class="{ current: !tasks.active }"
            @click="setActive('tasks', false)"
            style="display: flex"
          >
            <v-icon size="14">mdi-stop</v-icon>
            <span>{{ $t("done") }}</span>
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="$store.state.common.currentNavigation === 'task'">
          <v-list-item-title
            :class="{ current: tasks.sortOrder === 'asc' }"
            @click="setSort('tasks', 'asc')"
            style="display: flex"
          >
            <v-icon size="14">mdi-sort</v-icon>
            <span>{{ $t("createTimeAsc") }}</span>
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="$store.state.common.currentNavigation === 'task'">
          <v-list-item-title
            :class="{ current: tasks.sortOrder === 'desc' }"
            @click="setSort('tasks', 'desc')"
            style="display: flex"
          >
            <v-icon size="14">mdi-sort-descending</v-icon>
            <span>{{ $t("createTimeDesc") }}</span>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-menu
      :position-y="55"
      :position-x="2000"
      absolute
      offset-y
      v-model="displayAssociationMenu"
    >
      <v-list style="cursor: pointer; padding: 0px 0px" class="menu-list" dense>
        <v-list-item @click="showAssociations(true)">
          <v-list-item-title>
            <v-icon size="14">mdi-all-inclusive-box</v-icon>
            <span>{{ $t("linkApp") }}</span>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-dialog v-model="searchDialog.display" width="350">
      <v-card>
        <v-card-title style="font-size:16px">{{ `${searchName}` }}{{ $t("search") }}</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="searchDialog.searchKey"
            label=""
            :placeholder="$t('inputKey')"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="#83829A" text @click="searchDialog.display = false">
            {{ $t("back") }}
          </v-btn>
          <v-btn color="#0F40F5" text @click="search()"> {{ $t("search") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dataReportDialog.display" width="1200">
      <v-card>
        <v-card-title>{{ dataReportDialog.formData.name }}</v-card-title>
        <v-card-text>
          <iframe style="width:100%;height: 70vh;overflow-y: hidden;border: none" :src="dataReportDialog.formData.url"></iframe>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="#83829A" text @click="dataReportDialog.display = false">
            {{ $t("close") }}
          </v-btn>
        </v-card-actions>
      </v-card>

    </v-dialog>
  </div>
</template>
<script>
import userRequest from "@/api/user";
import utils from "@/utils/utils";
import ApplicationAssociations from "@/components/common/application/ApplicationAssociations";
import AppDetailCommon from "@/components/common/application/mixins/AppDetail";
import TaskItem from "@/components/common/task/TaskItem";
import ApplicationInstanceDataItem from "@/components/common/application/ApplicationInstanceDataItem";

export default {
  props: {
    processKey: {
      type: String
    }
  },
  mixins: [AppDetailCommon],
  data() {
    return {
      prevRoute: null,
      utils,
      icons: [
        {
          id: "search",
          icon: "mdi-card-search-outline"
        },
        {
          id: "sort",
          icon: "mdi-sort-variant"
        },
        {
          id: "association",
          icon: "mdi-all-inclusive-box",
          color: "#F50057"
        }
      ],

      displaySortMenu: false,
      displayAssociationMenu: false,
      userId: this.$store.state.user.profile.id,
      dataReportDialog: {
        display: false,
        formData: {}
      }
    };
  },
  mounted() {
    this.process.key = this.processKey;
  },
  components: {
    ApplicationAssociations,
    TaskItem,
    ApplicationInstanceDataItem
  },
  beforeRouteEnter(to, from, next) {
    next((model) => {
      model.prevRoute = from;
    });
  },
  methods: {
    onDataItemClick(item) {
      // 显示iframe
      this.dataReportDialog.formData = {
        url: item.configJson.url, name: item.configJson.name
      };
      this.dataReportDialog.display = true;
    },
    onTaskItemClick(item) {
      this.$store.dispatch("common/setEditTaskId", item.id);
    },
    onInstanceItemClick(item) {
      this.$store.dispatch("common/setEditInstanceId", item.id);
    },
    async getData(defaultTab) {
      await this.$store.dispatch("common/setNavigations", [
        {
          id: "process",
          name: this.$t("process"),
          count: 0
        },
        {
          id: "task",
          name: this.$t("task"),
          count: 0
        },
        {
          id: "data",
          name: this.$t("data"),
          count: 0
        }
      ]);

      this.process.key = this.processKey;
      await this.$store.dispatch("common/setCurrentNavigation", "");
      await this.getProcess();
      await this.$store.dispatch("common/setAppBarTitle", this.process.name);

      let tab = defaultTab??"process";
      await this.$store.dispatch("common/setCurrentNavigation", tab);
      await this.refreshInstances();
      await this.getTasks();
      await this.getDatas();
      await this.$store.dispatch("common/setPageLoading", false);
    },
    async search() {
      if (this.$store.state.common.currentNavigation === "process") {
        this.searchDialog.processInstanceBusinessKeyLike =
          this.searchDialog.searchKey;
        await this.refreshInstances();
        this.searchDialog.display = false;
      } else if (this.$store.state.common.currentNavigation === "task") {
        this.searchDialog.taskLike = this.searchDialog.searchKey;
        await this.getTasks();
      } else if (this.$store.state.common.currentNavigation === "data") {
        this.searchDialog.dataLike = this.searchDialog.searchKey;
        await this.getDatas();
      }
    },
    async setActive(field, active) {
      this[field].active = active;
      let method = `get${field.substring(0, 1).toUpperCase()}${field.substring(
        1
      )}`;
      if (method === "getInstances") {
        await this.refreshInstances();
      } else {
        await this[method]();
      }
    },
    async setSort(field, sortOrder) {
      this[field].sortOrder = sortOrder;
      let method = `get${field.substring(0, 1).toUpperCase()}${field.substring(
        1
      )}`;
      if (method === "getInstances") {
        await this.refreshInstances();
      } else if (method === "getTasks") {
        await this.getTasks();
      } else {
        await this[method]();
      }
    },
    async getTasks() {
      this.searchDialog.display = false;
      this.tasks.totalCount = 0;
      await this.refreshTasks(this.tasks.active);

      let navigations = this.$store.state.common.navigations;
      navigations[1].count = this.tasks.totalCount;
      await this.$store.dispatch("common/setNavigations", navigations);
    },
    async getDatas() {
      this.searchDialog.display = false;
      this.datas.totalCount = 0;
      await this.refreshDatas();

      let navigations = this.$store.state.common.navigations;
      navigations[2].count = this.datas.totalCount;
      await this.$store.dispatch("common/setNavigations", navigations);
    }
  },
  computed: {
    searchName() {
      let names = {
        process: this.$t("processInstance"),
        task: this.$t("task"),
        data: this.$t("data")
      };
      return names[this.$store.state.common.currentNavigation];
    }
  },
  watch: {
    "instances.totalCount": {
      async handler() {
        // 查询数量变化
        let navigations = this.$store.state.common.navigations;
        if (navigations && navigations[0]) {
          navigations[0].count = this.instances.totalCount;
          await this.$store.dispatch("common/setNavigations", navigations);
        }
      },
      immediate: true
    },
    processKey: {
      async handler() {
        this.process = {};
        this.process.key = this.processKey;
        this.groups = await userRequest.getGroupList({
          member: this.userId
        });
        await this.getData();
      },
      immediate: true
    },
    "$store.state.common.currentNavigation": {
      async handler(value) {
        if (value === "process") {
          await this.$store.dispatch("common/setAppBarIcons", this.icons);
          await this.refreshInstances();
        } else if (value === "task") {
          await this.$store.dispatch("common/setAppBarIcons", this.icons);
          await this.getTasks();
        } else if (value === "data") {
          await this.$store.dispatch("common/setAppBarIcons", [
            this.icons[0],
            this.icons[2]
          ]);
          await this.getDatas();
        }
      }
    },
    "$store.state.common.currentAppBarIcon": {
      async handler(value) {
        if (value === "search") {
          let type = this.$store.state.common.currentNavigation;
          this.searchDialog.searchKey =
            type === "process"
              ? this.searchDialog.processInstanceBusinessKeyLike
              : this.searchDialog.taskLike;
          this.searchDialog.display = true;
        } else if (value === "sort") {
          this.displaySortMenu = true;
        } else if (value === "association") {
          this.showAssociations(true);
        }
        await this.$store.dispatch("common/setCurrentAppBarIcon", "");
      }
    }
  }
};
</script>

<style scoped>
.content.theme--light.v-sheet--outlined {
  background-color: rgba(255, 255, 255, 1);
  color: rgba(16, 16, 16, 1);
  font-size: 14px;
  margin-top: 0px;
  padding: 0;
  border-radius: 0;
  border: unset;
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

.subtitle {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.dashed {
  border-bottom: 1px #bbbbbb dashed;
  margin: 14px 0;
}

.v-navigation-drawer--absolute {
  position: fixed;
  height: auto !important;
}
</style>
