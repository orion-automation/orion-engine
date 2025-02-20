<template>
  <div class="d-flex flex-column" style="height: 100%">
    <div v-show="delegate.id">
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
          style="
            align-items: center;
            color: #b1abb6;
            font-size: 12px;
            gap: 10px;
          "
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
          <input
            v-model="tasks.nameLike"
            class="search"
            :placeholder="$t('searchTaskWithDot')"
            @blur="refreshTasks"
          />
          <task-sort-menu
            :delegate-mode="true"
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
            :task="item"
          />
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
            :task="item"
          />
          <v-list-item
            v-show="!calendar.rangeItems.length"
            style="min-height: unset; padding: 10px 18px"
          >
            {{ $t('noData') }}
          </v-list-item>
        </v-list>
      </v-card>
    </div>
    <delegate-select
      :delegates="delegates"
      :delegate="delegate"
      ref="delegateSelectRef"
      @select="selectDelegate"
    />

    <v-menu
      :position-y="55"
      :position-x="320"
      absolute
      offset-y
      v-model="displayMenu"
    >
      <v-card class="delegate-menu" outlined>
        <v-list
          v-if="delegates.length == 0"
          style="padding: 0 0px; border-radius: 6px; background-color: unset"
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title
                style="
                  font-weight: bold;
                  font-size: 14px;
                  white-space: unset;
                  text-overflow: unset;
                  color: #312651;
                  margin: 5px 0;
                "
              >
                {{ $t('noValidAuthLog') }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-list
          v-if="delegates.length"
          style="padding: 0 0px; border-radius: 6px; background-color: unset"
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title
                style="
                  font-weight: bold;
                  font-size: 14px;
                  white-space: unset;
                  text-overflow: unset;
                  color: #312651;
                  margin: 5px 0;
                "
              >
                {{ delegate.delegateName }}
              </v-list-item-title>

              <v-list-item-subtitle class="attribute">
                <v-icon size="18" style="margin-right: 5px" color="#B1ABB6"
                  >mdi-key</v-icon
                >
                {{
                  delegate.displayGroups &&
                  delegate.displayGroups.map((group) => group.name).join(", ")
                }}
              </v-list-item-subtitle>

              <v-list-item-subtitle class="attribute">
                <v-icon size="18" style="margin-right: 5px" color="#FF7754"
                  >mdi-calendar-expand-horizontal-outline</v-icon
                >
                {{
                  utils.formatDateTime(
                    delegate.startDateTime,
                    "YYYY-MM-DD HH:mm"
                  )
                }}
                {{ $t('to') }}
                {{
                  utils.formatDateTime(delegate.endDateTime, "YYYY-MM-DD HH:mm")
                }}
              </v-list-item-subtitle>
              <v-list-item-subtitle class="attribute">
                <v-icon size="18" style="margin-right: 5px" color="#0F40F5"
                  >mdi-account-arrow-left-outline</v-icon
                >
                {{ delegate.ownerUserName }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-card-actions
          v-if="delegates.length > 1"
          class="d-flex"
          style="
            cursor: pointer;
            justify-content: start;
            height: fit-content;
            padding: 15px;
            border-top: 1px solid #e6e4e6;
          "
          @click="$refs.delegateSelectRef.show()"
        >
          <div class="d-flex flex-column" style="width: 100%">
            <div class="d-flex flex-row" style="align-items: center">
              <span style="margin-right: 15px; font-size: 14px; flex: 1">
                <v-icon size="14" color="#0F40F5" style="margin-right: 10px">
                  mdi-account-convert</v-icon
                ><span>{{ $t('changeAuth') }}</span></span
              >
              <span class="badge">{{ delegates.length }}</span>
            </div>
          </div>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import userRequest from "@/api/user";
import camundaRequest from "@/api/camunda-service";
import utils from "@/utils/utils";
import DelegateSelect from "@/components/common/delegate/DelegateSelect";
import TaskListCommon from "@/components/common/task/mixins/list";

export default {
  name: "DelegateExecute",
  components: {
    DelegateSelect,
  },
  mixins: [TaskListCommon],
  data() {
    return {
      utils,
      displayMenu: false,
      searchVal: "",
      delegates: [],
      delegate: {},
      userId: "",
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
          name: this.$t("priorityTask"),
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
      ],
    };
  },
  async mounted() {
    await this.$store.dispatch("common/setAppBarTitle", this.$t("delegateTaskStart"));
    await this.$store.dispatch("common/setNavigations", []);

    await this.getDelegates();
    this.quickFilter = this.$route.query.type || "mine";
  },

  methods: {
    async getDelegates() {
      let { data } = await camundaRequest.getGranted(this.buildParam());

      let ids = [];
      data.forEach((item) => {
        let groupIds = item.groups.split(",");
        groupIds.forEach((groupId) => {
          if (ids.indexOf(groupId) < 0) {
            ids.push(groupId);
          }
        });
      });

      let groups = await userRequest.getGroupList({
        idIn: ids.toString(),
      });

      data.forEach((item) => {
        item.displayGroups = [];
        let groupIds = item.groups.split(",");
        groupIds.forEach((groupId) => {
          let group = groups.find((group) => group.id === groupId);
          item.displayGroups.push(group);
        });
      });

      this.delegates = data;

      let id = this.$store.getters["common/getDelegateId"];
      await this.$store.dispatch("common/setAppBarIcons", [
        {
          id: "menu",
          icon: "mdi-account-supervisor-circle",
          dot: data.length > 0,
        },
      ]);
      let item;
      if (id) {
        item = data.find((delegate) => delegate.id == id);
      }
      if (!item) {
        item = data[0] || {};
      }
      await this.selectDelegate(item);
    },

    async selectDelegate(item) {
      this.delegate = item;
      this.userId = this.delegate.ownerUserId;

      await this.$store.dispatch("common/setDelegateId", item.id);
      await this.refreshTasks();
      await this.getQuickFilters();
    },

    buildParam() {
      let now = utils.formatDateTime(new Date(), "x");
      let filter = {
        tenant: this.$store.state.user.tenant,
        delegateToUserId: this.$store.state.user.profile.id,
        startDateTimeBefore: now,
        endDateTimeAfter: now,
        status: 1,
        orderBy: "startDateTime",
        sort: "asc",
      };
      return filter;
    },
    onTaskItemClick(item) {
      this.$router.push({
        name: "task-detail",
        params: { id: item.id },
        query: { delegate: this.delegate.id },
      });
    },
  },
  watch: {
    "$i18n.locale": {
      handler(val){
        let self=this;
        self.quickFilters= [
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
            name: this.$t("priorityTask"),
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
        ];
      },
    },
    "$store.state.common.currentAppBarIcon": {
      async handler(value) {
        if (value === "menu") {
          this.displayMenu = true;
        }
        await this.$store.dispatch("common/setCurrentAppBarIcon", "");
      },
    },
  },
};
</script>

<style scoped>
.delegate-menu {
  width: 320px;
}

span.badge {
  margin-right: 0;
}

.attribute {
  margin-top: 4px;
  font-size: 14px;
  color: #83829a;
}

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
