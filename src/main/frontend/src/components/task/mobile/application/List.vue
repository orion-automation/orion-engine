<template>
  <div style="padding: 0 0px 75px 0px">
    <v-card class="overview" outlined>
      <v-list
        style="padding: 0 0px; border-radius: 6px; background-color: unset"
      >
        <v-list-item style="padding: 12px 0 0px;">
          <v-list-item-content>
            <div class="d-flex" style="justify-content: center">
              <div
                style="flex: 1; text-align: center"
                v-for="(item, index) in recents"
                :key="index"
              >
                <router-link
                  v-show="item.key"
                  :to="{
                    name: 'application-detail',
                    params: { key: item.key },
                  }"
                  class="no-style"
                >
                  <v-badge
                    bordered
                    dot
                    overlap
                    color="#FF7754"
                    :value="item.processTaskCount"
                  >
                    <i
                      :class="item.icon?item.icon:'fa-fw fa-paperclip'"
                      style="font-size: 18px"
                      :style="{
                      color: item.color || '#444262',
                    }"
                    ></i>
                  </v-badge>
                </router-link>
                <div v-show="!item.key"></div>
              </div>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <div class="d-flex flex-row" style="align-items: center;color: #B1ABB6;font-size: 12px;gap: 10px">
        <div style="height: 1px; background-color:#d4d4d4;flex: 1" />
        {{ $t('lastUseApp') }}
        <div style="height: 1px; background-color:#d4d4d4;flex: 1" />
      </div>
      <v-card-actions
        class="d-flex"
        style="justify-content: center; padding: 0 15px"
      >
        <v-icon
          size="20"
          color="#444262"
          style="flex: 0"
        >
          mdi-apps
        </v-icon>
        <input
          v-model="applications.nameLike"
          class="search"
          :placeholder="$t('searchAppWithDot')"
          @blur="refreshApplications"
        />
        <application-list-sort-menu
          :current-order="applications"
          @onSetSort="setSort"
        />
      </v-card-actions>
    </v-card>

    <v-card class="content" outlined>
      <v-list three-line style="padding: 0 0px; border-radius: 6px">
        <application-list-item
          :application="item"
          v-for="item in applications.items"
          :key="item.id"
          @onItemClick="goApplicationDetail" />
      </v-list>
      <infinite-loading
        @infinite="getApplicationsPage"
        :identifier="infiniteId"
      >
        <template #no-more>
          <div class="d-flex flex-row infinite-more-container">
            <div class="infinite-more-container-pre" />
            <div class="infinite-more-container-content">{{ $t('noMoreApp') }}</div>
            <div class="infinite-more-container-pre" />
          </div>
        </template>
      </infinite-loading>
    </v-card>
  </div>
</template>
<script>
import processRequest from "@/api/process";
import InfiniteLoading from "vue-infinite-loading";
import applicationCommon from "@/components/common/application/mixins";
import ApplicationListItem from "@/components/common/application/ApplicationListItem";
import ApplicationListSortMenu from "@/components/common/application/ApplicationListSortMenu";

export default {
  mixins: [applicationCommon],
  data() {
    return {
      recents: []
    };
  },
  components: { InfiniteLoading, ApplicationListItem, ApplicationListSortMenu },
  watch: {},
  async mounted() {
    await this.getRecents();
  },

  methods: {
    goApplicationDetail(item) {
      this.$router.push({
        name: "application-detail",
        params: { key: item.key }
      });
    },
    buildFilter() {
      let filter = {
        sortBy: this.applications.sortBy,
        sortOrder: this.applications.sortOrder,
        startableBy: this.userId,
        latestVersion: true
      };
      if (this.applications.nameLike) {
        filter.nameLike = `%${this.applications.nameLike}%`;
      }
      return filter;
    },

    async getRecents() {
      let applications = [];
      let items = await processRequest.getFilter({
        resourceType: "Task",
        name: "recentUseProcessDef",
        owner: this.userId,
        maxResults: 1
      });
      if (items.length) {
        applications = items[0].properties.applications;
      } else {
        await processRequest.postFilter({
          resourceType: "Task",
          name: "recentUseProcessDef",
          owner: this.userId,
          query: {
            candidateGroup: this.$store.state.user.tenant
          },
          properties: {
            applications: []
          }
        });
      }

      for (var i = 0; i < applications.length; i++) {
        let item = applications[i];
        // 数量
        item.processTaskCount = await processRequest.getTaskCountByProcessKey(item.key, this.userId);
      }
      let processDefKeyIn = [];
      applications.forEach(association=>{
        if (!processDefKeyIn.includes(association.key)) {
          processDefKeyIn.push(association.key);
        }
      });
      // 获取流程对应icon
      let iconResults = await processRequest.getProcessIconByKeys(this.$store.getters["user/getTenant"].id, processDefKeyIn);
      applications.forEach(resource => {
        let iconResult = iconResults.find(iconResult => iconResult.appKey === resource.key);
        let icon = { color: "#444262" };
        if (iconResult && iconResult.configJson) {
          icon.icon = `${iconResult.configJson.iconType} fa-fw ${iconResult.configJson.icon}`;
        }
        resource.icon = icon.icon;
        resource.color = icon.color;
      });

      for (var i = 0; i < 6; i++) {
        if (!applications[i]) {
          applications.push({});
        }
      }
      this.recents = applications.slice(0, 6);
    },

    async setSort(payload) {
      this.applications.sortBy = payload.sortBy;
      this.applications.sortOrder = payload.sortOrder;
      await this.refreshApplications();
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
  top:1px;
  z-index:1;
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

.badge {
  display: inline-block;
  min-width: 10px;
  padding: 3px 7px;
  font-weight: bold;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  border-radius: 6px;
  background-color: #ff7754;
  border: 0;
  margin-right: 10px;
  color: #fff;
}
</style>
