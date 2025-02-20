<template>
  <div class="d-flex flex-column" style="height: 100%">
    <v-text-field
      outlined
      v-if="homeMode"
      filled
      v-model="searchVal"
      :placeholder="$t('inputKeySearchMulti')"
      hide-details
      dense
      style="margin: 20px 13px; flex: 0"
    >
      <template #append-outer>
        <v-icon @click="onSearch" color="#E6E4E6" size="25">mdi-card-search</v-icon>
      </template>
    </v-text-field>
    <v-text-field
      outlined
      v-else
      v-model="searchVal"
      :placeholder="$t('inputKeySearchMulti')"
      hide-details
      @input="onSearch"
      dense
      style="margin: 20px 13px; flex: 0; background-color: white"
    />
    <v-divider style="height: 1px; margin: 0px" />
    <v-tabs
      v-model="tabIndex"
      style="flex: 0"
      background-color="transparent"
      color="#444262"
      grow
      @change="onTabChange"
    >
      <v-tabs-slider color="#FF7754"></v-tabs-slider>
      <v-tab key="process">
        <v-badge color="#E6E4E6" inline>
          {{ $t('processInstance') }}
          <template #badge>
            <div class="tab-search-count">
              {{ processCount }}
            </div>
          </template>
        </v-badge>
      </v-tab>
      <v-tab key="task">
        <v-badge inline color="#E6E4E6">
          {{ $t('task') }}
          <template #badge>
            <div class="tab-search-count">
              {{ taskCount }}
            </div>
          </template>
        </v-badge>
      </v-tab>
      <v-tab key="application">
        <v-badge inline color="#E6E4E6">
          {{ $t('process') }}
          <template #badge>
            <div class="tab-search-count">
              {{ applicationCount }}
            </div>
          </template>
        </v-badge>
      </v-tab>
      <v-tab key="data">
        <v-badge inline color="#E6E4E6">
          {{ $t('data') }}
          <template #badge>
            <div class="tab-search-count">
              {{ dataCount }}
            </div>
          </template>
        </v-badge>
      </v-tab>
    </v-tabs>
    <v-tabs-items
      v-model="tabIndex"
      :style="
        homeMode ? { borderBottomRightRadius: '6px', borderBottomLeftRadius: '6px' } : {}
      "
      style="overflow-x: hidden; overflow-y: auto; height: 0px; flex: 1"
    >
      <v-tab-item key="process" transition="false" style="height: 100%">
        <v-list three-line style="padding: 0; border-radius: 0px">
          <router-link
            v-for="item in processList.items"
            :key="item.id"
            :to="
              homeMode
                ? {
                    name: 'task-application-detail',
                    params: { id: item.processDefinitionId },
                    query: {
                      defaultSearchInstanceId: item.id,
                      key: item.processDefinitionKey,
                    },
                  }
                : {
                    name: 'application-instance',
                    params: { id: item.id },
                  }
            "
            class="no-style"
          >
            <v-list-item
              style="
                padding-top: 0.5em;
                padding-bottom: 0.5em;
                border-bottom: 1px solid #e6e4e6;
                background-image: linear-gradient(
                  to bottom,
                  #f4f4f4,
                  #f7f7f7,
                  #f9f9f9,
                  #fcfcfc,
                  #ffffff
                );
              "
            >
              <v-list-item-content>
                <div style="display: flex">
                  <div style="flex: 12">
                    <v-list-item-title
                      style="
                        font-size: 14px;
                        font-weight: bold;
                        color: RGB(49, 38, 81);
                        line-height: 22px;
                      "
                    >
                      {{ item.processDefinitionName || $t('noTopic') }}
                    </v-list-item-title>
                  </div>
                  <div style="flex: 1">
                    <v-icon dense v-if="item.state == 'COMPLETED'" color="#e6e4e6">mdi-stop-circle</v-icon>
                    <v-icon dense v-if="item.state == 'ACTIVE'" color="#e6e4e6">mdi-play-outline</v-icon>
                  </div>
                </div>
                <div style="display: flex">
                  <div style="flex: 6">
                    <v-list-item-subtitle
                      style="margin-top: 2px; width: 15em; color: #9e9e9e"
                    >
                      <div class="subtitle">{{ item.businessKey }}</div>
                    </v-list-item-subtitle>
                  </div>
                </div>
                <div style="display: flex; margin-top: 6px">
                  <div style="flex: 6">
                    <v-list-item-subtitle
                      style="display: flex; color: #83829a; font-size: 14px"
                    >
                      <v-icon color="#FF7754" size="14" style="margin-right: 6px"
                        >mdi-plus
                      </v-icon>

                      <span>
                        {{
                          utils.formatDateTime(item.startTime, "YYYY-MM-DD HH:mm")
                        }}</span
                      >
                    </v-list-item-subtitle>
                  </div>
                </div>
                <div v-show="item.variables.length">
                  <v-row no-gutters>
                    <div class="dashed" />
                    <v-col cols="6" v-for="variable in item.variables" :key="variable.id">
                      <div style="color: #162b4d; font-size: 14px; margin-bottom: 9px">
                        <div
                          style="
                            color: #90a4ae;
                            padding-top: 0.5em;
                            padding-bottom: 0.5em;
                          "
                        >
                          {{ variable.label }}
                        </div>
                        <span>
                          {{ utils.formatVariable(variable) }}
                        </span>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </v-list-item-content>
            </v-list-item>
          </router-link>
        </v-list>
        <infinite-loading @infinite="getProcessList" :identifier="processList.infiniteId">
          <template #no-more>
            <div class="d-flex flex-row infinite-more-container">
              <div class="infinite-more-container-pre" />
              <div class="infinite-more-container-content">{{ $t('noMoreInstances') }}</div>
              <div class="infinite-more-container-pre" />
            </div>
          </template>
        </infinite-loading>
      </v-tab-item>
      <v-tab-item key="task" transition="false" style="height: 100%">
        <v-list three-line style="padding: 0 0px; border-radius: 6px">
          <task-item
            v-for="item in taskList.items"
            :key="item.id"
            @onItemClick="onClickTaskId"
            :task="item"
          />
        </v-list>
        <infinite-loading @infinite="getTaskList" :identifier="taskList.infiniteId">
          <template #no-more>
            <div class="d-flex flex-row infinite-more-container">
              <div class="infinite-more-container-pre" />
              <div class="infinite-more-container-content">{{ $t('noMoreTask') }}</div>
              <div class="infinite-more-container-pre" />
            </div>
          </template>
        </infinite-loading>
      </v-tab-item>

      <v-tab-item key="application" transition="false" style="height: 100%">
        <v-list three-line style="padding: 0 0px; border-radius: 6px">
          <router-link
            v-for="item in applicationList.items"
            :key="item.id"
            :to="
              homeMode
                ? {
                    name: 'task-application-detail',
                    params: { id: item.id },
                    query: { key: item.key },
                  }
                : {
                    name: 'task-application-detail',
                    params: { key: item.key },
                  }
            "
            class="no-style"
          >
            <v-list-item
              style="
                min-height: unset;
                padding-top: 18px;
                padding-bottom: 18px;
                border-bottom: 1px solid rgb(230, 228, 230);
                cursor: pointer;
              "
            >
              <i
                :class="item.icon"
                style="color: #83829a; font-size: 35px; margin-right: 18px"
              ></i>

              <v-list-item-content style="padding: 0">
                <div style="display: flex">
                  <div style="flex: 10">
                    <v-list-item-title
                      style="font-weight: bold; font-size: 1rem; color: #312651"
                    >
                      {{ item.name }}
                    </v-list-item-title>
                  </div>
                  <div style="flex: 2; text-align: right">
                    <span v-show="item.count" class="badge">{{ item.count }}</span>
                  </div>
                </div>
                <div style="display: flex; margin-top: 4px">
                  <div style="flex: 6">
                    <v-list-item-subtitle style="font-size: 12px; color: #b1abb6"
                      >{{ item.description }}
                    </v-list-item-subtitle>
                  </div>
                </div>
              </v-list-item-content>
            </v-list-item>
          </router-link>
        </v-list>
        <infinite-loading
          @infinite="getApplicationList"
          :identifier="applicationList.infiniteId"
        >
          <template #no-more>
            <div class="d-flex flex-row infinite-more-container">
              <div class="infinite-more-container-pre" />
              <div class="infinite-more-container-content">{{ $t('noMoreProcess') }}</div>
              <div class="infinite-more-container-pre" />
            </div>
          </template>
        </infinite-loading>
      </v-tab-item>
      <v-tab-item key="data" transition="false" style="height: 100%">
        <v-list three-line style="padding: 0 0px; border-radius: 6px">
          <application-instance-data-item
            v-for="item in dataList.items"
            @onItemClick="onDataItemClick"
            :key="item.id"
            :item="item"
          />
        </v-list>
        <infinite-loading @infinite="getDataList" :identifier="dataList.infiniteId">
          <template #no-more>
            <div class="d-flex flex-row infinite-more-container">
              <div class="infinite-more-container-pre" />
              <div class="infinite-more-container-content">{{ $t('noMoreData') }}</div>
              <div class="infinite-more-container-pre" />
            </div>
          </template>
        </infinite-loading>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import debounce from "lodash/debounce";
import instanceRequest from "@/api/instance";
import taskRequest from "@/api/task";
import processRequest from "@/api/process";
import userRequest from "@/api/user";
import camundaRequest from "@/api/camunda-service";
import InfiniteLoading from "vue-infinite-loading";
import utils from "@/utils/utils";
import { myDestroyed } from "@/components/task/mobile/mixins";
import ApplicationInstanceDataItem from "@/components/common/application/ApplicationInstanceDataItem";
import TaskItem from "@/components/common/task/TaskItem";

export default {
  name: "SearchList",
  components: {
    InfiniteLoading,
    ApplicationInstanceDataItem,
    TaskItem,
  },
  props: {
    homeMode: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [myDestroyed],
  data() {
    this.onSearch = debounce(this.onSearch, 800);
    return {
      utils,
      searchVal: "",
      tabIndex: 0,
      processCount: 0,
      taskCount: 0,
      applicationCount: 0,
      dataCount: 0,
      pageSize: 10,
      processList: {
        items: [],
        infiniteId: +new Date(),
        searchVal: "",
      },
      taskList: {
        items: [],
        infiniteId: +new Date(),
        searchVal: "",
      },
      applicationList: {
        items: [],
        infiniteId: +new Date(),
        searchVal: "",
      },
      dataList: {
        items: [],
        infiniteId: +new Date(),
        searchVal: "",
      },
      userId: "",
      groups: [],
      tenantId: this.$store.getters["user/getTenant"].id,
    };
  },
  activated() {
    this.$store.dispatch("common/setAppBarTitle", this.$t("allScopeSearch"));
    this.$store.dispatch("common/setNavigations", []);
  },
  async mounted() {
    await this.$store.dispatch("common/setNavigations", []);
    this.userId = this.$store.state.user.profile.id;
    let groups = await userRequest.getGroupList({
      member: this.userId,
    });
    this.groups = groups;
    await this.getAllCount();
  },
  computed: {
    processFilter() {
      let orQueries = [{ startedBy: this.userId }, { unfinished: true }];
      if (this.searchVal && this.searchVal.length > 0) {
        let likeVal = `%${this.searchVal}%`;
        orQueries.push({
          processInstanceBusinessKeyLike: likeVal,
          processDefinitionNameLike: likeVal,
        });
      }
      return { orQueries: orQueries };
    },
    applicationFilter() {
      let params = {
        startableBy: this.userId,
        latestVersion: true,
      };
      if (this.searchVal && this.searchVal.length > 0) {
        let likeVal = `%${this.searchVal}%`;
        params.nameLike = likeVal;
      }
      return params;
    },
    taskFilter() {
      let orQueries = [{ assignee: this.userId }];
      if (this.searchVal && this.searchVal.length > 0) {
        let likeVal = `%${this.searchVal}%`;
        orQueries.push({
          processInstanceBusinessKeyLike: likeVal,
          processDefinitionNameLike: likeVal,
          nameLike: likeVal,
          descriptionLike: likeVal,
        });
      }
      return { orQueries: orQueries };
    },

    dataFilter() {
      let filter = {
        tenant: this.$store.state.user.tenant,
        type: "ux",
        category: "bpezAppReport",
        groups: this.groups.map((group) => group.id),
        nameLike: this.searchVal,
      };
      return filter;
    },
  },
  methods: {
    onDataItemClick(item) {
      this.$router.push(
        this.homeMode
          ? {
              name: "data-list",
              query: { defaultSearchNameLike: item.name },
            }
          : {
              name: "application-report",
              query: { url: item.configJson.url, name: item.configJson.name },
            }
      );
    },
    onClickTaskId(item) {
      this.$router.push(
        this.homeMode
          ? {
              name: "task-list",
              query: { defaultSearchTaskId: item.id },
            }
          : { name: "task-detail", params: { id: item.id } }
      );
    },
    onTabChange() {
      switch (this.tabIndex) {
        case 0:
          if (this.processList.searchVal !== this.searchVal) {
            this.processList.items = [];
            this.processList.infiniteId += 1;
          }
          break;
        case 1:
          if (this.taskList.searchVal !== this.searchVal) {
            this.taskList.items = [];
            this.taskList.infiniteId += 1;
          }
          break;
        case 2:
          if (this.applicationList.searchVal !== this.searchVal) {
            this.applicationList.items = [];
            this.applicationList.infiniteId += 1;
          }
          break;
      }
    },
    judgePriority(priority) {
      if (priority === 99) {
        return { text: this.$t("topCard"), color: "color: #673ab7" };
      } else if (priority > 60) {
        return { text: this.$t("top"), color: "color: #e91e63" };
      } else if (priority > 30) {
        return { text: this.$t("medium"), color: "color: #ff9800" };
      } else {
        return { text: this.$t("low"), color: "color: #009688" };
      }
    },
    async onSearch() {
      // 获取count
      this.getAllCount();
      let keys = ["processList", "taskList", "applicationList", "dataList"];
      let list = this[keys[this.tabIndex]];
      if (list) {
        list.items = [];
        list.infiniteId += 1;
      }
    },
    async getAllCount() {
      // 获取count
      let countResult = await instanceRequest.postHistoryInstancesCount(
        this.processFilter
      );
      this.processCount = countResult.count;
      countResult = await taskRequest.postTaskCount("", {}, this.taskFilter);
      this.taskCount = countResult.count;
      countResult = await processRequest.getProcessCount(this.applicationFilter);
      this.applicationCount = countResult.count;

      countResult = await camundaRequest.getApplicationCount(this.dataFilter);
      this.dataCount = countResult.count;
    },
    async getProcessList($state) {
      try {
        this.processList.searchVal = this.searchVal;
        let items = await instanceRequest.postHistoryInstances(
          {
            firstResult: this.processList.items.length,
            maxResults: this.pageSize,
          },
          this.processFilter
        );
        items = await processRequest.getAllInstanceItemInfo(items, this.tenantId);
        this.processList.items = this.processList.items.concat(items);
        $state.loaded();
        if (items.length < this.pageSize) {
          // 加载完成
          $state.complete();
        }
      } catch (e) {
        console.log(e);
        $state.complete();
      }
    },
    async getTaskList($state) {
      try {
        this.taskList.searchVal = this.searchVal;
        let tasks = await taskRequest.postTaskList(
          "",
          {
            firstResult: this.taskList.items.length,
            maxResults: this.pageSize,
          },
          this.taskFilter
        );
        tasks = await processRequest.getAllTaskItemInfo(tasks, this.tenantId);
        this.taskList.items = this.taskList.items.concat(tasks);
        $state.loaded();
        if (tasks.length < this.pageSize) {
          // 加载完成
          $state.complete();
        }
      } catch (e) {
        console.log(e);
        $state.complete();
      }
    },
    async getApplicationList($state) {
      try {
        this.applicationList.searchVal = this.searchVal;
        let applications = await processRequest.getProcessByDeployment(
          Object.assign(
            {
              firstResult: this.applicationList.items.length,
              maxResults: this.pageSize,
            },
            this.applicationFilter
          )
        );
        for (var i = 0; i < applications.length; i++) {
          let application = applications[i];
          let response = await processRequest.postInstanceCount("", null, {
            processDefinitionKey: application.key,
            variables: [
              {
                name: "startUserId",
                operator: "eq",
                value: this.userId,
              },
            ],
          });
          application.count = response.count;
        }
        let processDefKeyIn = [];
        applications.forEach((association) => {
          if (!processDefKeyIn.includes(association.key)) {
            processDefKeyIn.push(association.key);
          }
        });
        // 获取流程对应icon
        let iconResults = await processRequest.getProcessIconByKeys(
          this.$store.getters["user/getTenant"].id,
          processDefKeyIn
        );
        applications.forEach((resource) => {
          let iconResult = iconResults.find(
            (iconResult) => iconResult.appKey === resource.key
          );
          let icon = { color: "#444262" };
          if (iconResult && iconResult.configJson) {
            icon.icon = `${iconResult.configJson.iconType} fa-fw ${iconResult.configJson.icon}`;
          }
          resource.icon = icon.icon;
          resource.color = icon.color;
        });
        this.applicationList.items = this.applicationList.items.concat(applications);
        $state.loaded();
        if (applications.length < this.pageSize) {
          // 加载完成
          $state.complete();
        }
      } catch (e) {
        console.log(e);
        $state.complete();
      }
    },
    async getDataList($state) {
      let datas = await camundaRequest.getApplications(
        {
          firstResult: this.dataList.items.length,
          maxResults: this.pageSize,
        },
        this.dataFilter
      );

      this.dataList.items = this.dataList.items.concat(datas);
      $state.loaded();
      if (this.dataList.items.length >= this.dataCount) {
        $state.complete();
      }
    },
  },
  watch: {
    $route: {
      async handler(value) {
        if (value.name === "search-index") {
          await this.$store.dispatch("common/setAppBarIcons", []);
        }
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.tab-search-count {
  color: #312651;
  font-size: 12px;
  font-weight: bold;
}

.dashed {
  border-bottom: 1px #bbbbbb dashed;
  margin: 14px 0;
}

.v-text-field--outlined:deep(fieldset) {
  top: 0;
}

/deep/
  .v-tabs:not(.v-tabs--vertical):not(.v-tabs--right)
  > .v-slide-group--is-overflowing.v-tabs-bar--is-mobile:not(.v-slide-group--has-affixes)
  .v-slide-group__prev {
  display: none;
}

.v-text-field fieldset, .v-text-field .v-input__control{
  border-radius: 5px;
}
</style>
