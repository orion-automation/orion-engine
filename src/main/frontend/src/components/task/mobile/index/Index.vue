<template>
  <div style="padding: 0 0px 75px 0px">
    <div class="d-flex flex-column overview" style="padding: 16px">
      <div class="d-flex flex-column" style="align-items: center;padding: 20px">
        <v-icon color="white" size="55">mdi-percent-circle-outline</v-icon>
      </div>
      <div style="color: white;font-size: 16px">{{ $store.state.user.profile.lastName }},{{ nickTime }}</div>
    </div>

    <div class="summary"
         style="position: sticky; top: 0px; z-index: 1; backdrop-filter: blur(10px);background-color: #ffffffab;">
      <v-row style="margin: 0">
        <v-col
          cols="7"
          class="d-flex"
          style="border-right: 1px solid #e6e4e6; justify-content: center"
        >
          <router-link
            :to="{
              name: 'task-list',
              query: { type: 'mine' },
            }"
            class="no-style summary-item"
          >
            <v-icon size="18" color="#B1ABB6" style="margin-right: 5px">
              mdi-download-box
            </v-icon>
            <span style="font-size: 18px; font-weight:800">{{ count.mine }}</span>
          </router-link>
          <router-link
            :to="{
              name: 'task-list',
              query: { type: 'due' },
            }"
            class="no-style summary-item"
          >
            <v-icon size="18" color="#B1ABB6" style="margin-right: 5px">
              mdi-clock-alert
            </v-icon
            >
            <span style="font-size: 18px; font-weight:800">{{ count.due }}</span>
          </router-link>

          <router-link
            :to="{
              name: 'task-list',
              query: { type: 'priority' },
            }"
            class="no-style summary-item"
          >
            <v-icon size="18" color="#B1ABB6" style="margin-right: 5px">
              mdi-alert-box
            </v-icon
            >
            <span style="font-size: 18px; font-weight:800">{{ count.priority }}</span>
          </router-link>
        </v-col>
        <v-col
          cols="5"
          class="d-flex"
          style="justify-content: center; padding-left: 6px; padding-right: 3px"
        >
          <div class="summary-item" v-for="item in recents" :key="item.key">
            <router-link
              :to="{
                name: 'task-application-detail',
                params: { key: item.key },
              }"
              class="no-style"
            >
              <v-badge
                bordered
                dot
                overlap
                color="#FF7754"
                :value="item.processTaskCount && item.key"
              >
                <i
                  :class="item.icon"
                  style="margin-right: 0px; font-size: 18px"
                  :style="{
                  color: item.color || '#444262',
                }"
                ></i>
              </v-badge>
            </router-link>
          </div>
        </v-col>
      </v-row>
    </div>
    <v-card class="content" outlined>
      <v-card-title style="border-bottom: 1px solid rgb(230, 228, 230)">
        <v-icon size="20" color="#444262" left>
          mdi-calendar-multiselect
        </v-icon>

        <span class="title-text">{{ $t('recentTask') }}</span>
        <v-spacer />
        <!-- <span class="badge">{{ 21 }}</span> -->
        <router-link
          :to="{
            name: 'task-list',
          }"
          class="no-style"
        >
          <v-icon style="cursor: pointer" size="22" color="#444262">
            mdi-chevron-right
          </v-icon>
        </router-link>
      </v-card-title>

      <v-list three-line style="padding: 0 0px; border-radius: 6px">
        <task-item
          v-for="item in tasks"
          :key="item.id"
          @onItemClick="onClickTaskId"
          :task="item" />
      </v-list>
    </v-card>

    <v-btn
      @click="getPriorityTasks"
      :loading="priorityTask.loading"
      color="#F50057"
      style="width: 50px; height: 50px; bottom: 80px"
      raised
      rounded
      fab
      elevation="6"
      large
      fixed
      right>
      <v-icon color="white">mdi-ticket</v-icon>
    </v-btn>
    <v-bottom-sheet v-model="priorityTask.display" inset>
      <v-sheet>
        <div class="drawer-title">{{ $t('topView') }}</div>
        <div class="drawer-title-line"></div>
        <v-window @change="onPriorityTaskCardChange" v-model="priorityTask.currentIndex">
          <v-window-item v-for="item in priorityTask.items" :key="item.id">
            <v-list
              three-line
              style="padding: 15px">
              <v-list-item
                style="padding: 0;">
                <v-list-item-content style="padding: 0">
                  <div
                    class="d-flex flex-row"
                    style="align-items: center;width: 100%">
                    <div
                      class="d-flex flex-row" style="align-items: center;flex: 1;width: 0px"
                      @click="onClickTaskId(item)">
                      <i
                        :class="item.icon"
                        style="font-size: 28px;margin-right: 13px"
                        :style="{color:item.iconColor}"
                      ></i>
                      <div class="d-flex flex-column" style="flex: 1;width: 0px">
                        <div style="display: flex">
                          <div>
                            <v-list-item-title
                              style="
                      font-size: 14px;
                      font-weight: bold;
                      color: RGB(49, 38, 81);
                      line-height: 22px;
                      overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
                    "
                            >
                              {{ item.name }}
                            </v-list-item-title>
                          </div>
                        </div>
                        <v-list-item-subtitle
                          style="margin-top: 2px; color: #9e9e9e"
                        >
                          <div
                            class="subtitle" style="overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;">{{ item.instance ? item.instance.businessKey : "--" }}
                          </div>
                        </v-list-item-subtitle>
                      </div>
                    </div>
                    <div class="d-flex flex-column" v-if="item.due">
                      <div
                        class="d-flex" style="font-size: 14px;
                      font-weight: bold;
                      color: RGB(49, 38, 81);
                      line-height: 22px;">
                        <v-icon color="#FF7754" size="14" style="margin-right: 6px">mdi-calendar-outline</v-icon>
                        <span>{{ utils.formatDateTime(item.due, "MM-DD HH:mm") }}</span>
                      </div>
                      <v-list-item-subtitle
                        style="margin-top: 2px; color: #9e9e9e"
                      >
                        <div class="subtitle" style="text-align: end">
                          {{ utils.generatePreviousFromNow(item.due, "days") > 0 ? $t('hasExpWithDays',{days:utils.generatePreviousFromNow(item.due, "days")}):$t('toExpWithDays',{days:-utils.generatePreviousFromNow(item.due, "days")}) }}
                        </div>
                      </v-list-item-subtitle>
                    </div>
                  </div>
                  <div :style="!item.variables?{minHeight: '118.59px'}:{minHeight: '118.59px'}">
                    <v-row no-gutters v-if="item.variables && item.variables.length">
                      <div class="dashed" />
                      <v-col
                        cols="6"
                        v-for="variable in item.variables"
                        :key="variable.id"
                      >
                        <div style="color: #162b4d; font-size: 14px;margin-bottom: 9px">
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
            </v-list>
          </v-window-item>
        </v-window>
        <v-item-group
          style="padding-bottom: 5px"
          v-model="priorityTask.currentIndex"
          class="text-center"
          mandatory
        >
          <v-item
            v-for="item in  priorityTask.items"
            :key="item.id"
            v-slot="{ active, toggle }"
          >
            <v-btn
              :input-value="active"
              icon
              @click="toggle"
              x-small
            >
              <v-icon x-small>mdi-record</v-icon>
            </v-btn>
          </v-item>
        </v-item-group>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>
<script>
import processRequest from "@/api/process";
import instanceRequest from "@/api/instance";
import taskRequest from "@/api/task";
import utils from "@/utils/utils";
import TaskItem from "@/components/common/task/TaskItem";
import groupRequest from "@/api/group";

export default {
  components: { TaskItem },
  data() {
    return {
      utils,
      recents: [],
      tasks: [],
      count: {
        mine: 0,
        due: 0,
        priority: 0
      },
      userId: this.$store.state.user.profile.id,
      tenantId: this.$store.getters["user/getTenant"].id,
      priorityTask: {
        items: [],
        display: false,
        loading: false,
        currentIndex: 0
      }
    };
  },
  computed: {
    nickTime() {
      // 获取当前时间
      let timeNow = new Date();
      // 获取当前小时
      let hours = timeNow.getHours();
      // 设置默认文字
      let text = "";
      // 判断当前时间段
      if (hours >= 0 && hours <= 4) {
        text = this.$t("morningPreHello");
      } else if (hours > 4 && hours <= 11) {
        text = this.$t("morningHello");
      } else if (hours > 11 && hours <= 13) {
        text = this.$t("launchHello");
      } else if (hours > 13 && hours <= 18) {
        text = this.$t("afternoonHello");
      } else if (hours > 18 && hours <= 24) {
        text = this.$t("eveningHello");
      }
      // 返回当前时间段对应的状态
      return text;
    },
  },
  async mounted() {
    await this.$store.dispatch("common/setPageLoading", true);
    await this.getRecents();
    await this.getTasks();
    await this.getCount();
    await this.$store.dispatch("common/setPageLoading", false);
  },
  methods: {
    onClickTaskId(item) {
      this.$router.push({ name: "task-detail", params: { id: item.id } });
    },
    async onPriorityTaskCardChange(index) {
      let self = this;
    },
    async getPriorityTasks() {
      let self = this;
      self.priorityTask.loading = true;
      let tasks = await taskRequest.postGetTasks({ maxResults: 20 },
        {
          assignee: this.userId, priority: 99, sorting: [
            {
              sortBy: "dueDate",
              sortOrder: "asc"
            }
          ]
        });
      tasks = await processRequest.getAllTaskItemInfo(tasks, self.tenantId);
      let processDefKeyIn = [];
      tasks.forEach(association=>{
        if (!processDefKeyIn.includes(association.instance.processDefinitionKey)) {
          processDefKeyIn.push(association.instance.processDefinitionKey);
        }
      });
      // 获取流程对应icon
      let iconResults = await processRequest.getProcessIconByKeys(this.tenantId, processDefKeyIn);
      tasks.forEach(resource => {
        let iconResult = iconResults.find(iconResult => iconResult.appKey === resource.instance.processDefinitionKey);
        let icon = { color: "#444262" };
        if (iconResult && iconResult.configJson) {
          icon.icon = `${iconResult.configJson.iconType} fa-fw ${iconResult.configJson.icon}`;
        }
        resource.icon = icon.icon;
        resource.iconColor = icon.color;
      });
      self.priorityTask.items = tasks;
      if (self.priorityTask.items.length > 0) {
        await self.onPriorityTaskCardChange(0);
        self.priorityTask.display = true;
      } else {
        self.$message.info(self.$t("noGetCollectTask"));
      }
      self.priorityTask.loading = false;
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
      for (var i = 0; i < 3; i++) {
        if (!applications[i]) {
          applications.push({});
        }
      }
      this.recents = applications.slice(0, 3);
    },

    isSubTask(task) {
      return task.parentTaskId && !task.processInstanceId;
    },
    judgePriority(priority) {
      if (priority === 99) {
        return { text: this.$t("topCard"), color: "color: #4a148c" };
      } else if (priority > 60) {
        return { text: this.$t("top"), color: "color: #FF7754" };
      } else if (priority > 30) {
        return { text: this.$t("medium"), color: "color: #ffc107" };
      } else {
        return { text: this.$t("low"), color: "color: #E6E4E6" };
      }
    },
    async getTasks() {
      let payload = {
        sorting: [
          {
            sortBy: "created",
            sortOrder: "desc"
          }
        ],
        assignee: this.userId,
        nameNotLike: "Complete a Question"
      };
      let taskList = await taskRequest.postTaskList(
        "",
        {
          firstResult: 0,
          maxResults: 10
        },
        payload
      );
      this.tasks = await processRequest.getAllTaskItemInfo(taskList, this.tenantId);
    },
    async getCount() {
      let data;
      for (var i in this.count) {
        switch (i) {
          case "mine":
            data = {
              assignee: this.userId
            };
            break;
          case "priority":
            data = {
              assignee: this.userId,
              minPriority: 80,
              maxPriority: 90
            };
            break;
          case "due":
            const dueBefore = utils.formatDateTime(
              new Date(),
              "YYYY-MM-DDT24:00:00.SSS+0800"
            );
            data = {
              assignee: this.userId,
              dueBefore
            };
            break;
          default:
            break;
        }
        const response = await taskRequest.postTaskCount("", null, data);
        this.count[i] = response.count;
      }
    }
  },
  watch:{
    "$i18n.locale": {
      handler(val){
        let self=this;
      },
    },
  }
};
</script>

<style scoped>
.overview {
  margin-top: 0px;
  border-radius: 0px;
  border: none;
  background-image: linear-gradient(135deg, #3c3667 0%, #92588f 46%, #d4be96 100%);
}

.empty-overview {
  margin-top: 0px;
  border-radius: 0px;
  border: none;
  background: linear-gradient(90deg, rgba(201, 255, 191, 1) 0%, rgba(255, 176, 190, 1) 99%);
}

.summary {
  margin-top: 0px;
  border-radius: 0px;
  background-color: rgba(255, 255, 255, 1);
  border: 1px solid rgba(230, 228, 230, 1);
}

.content {
  border-radius: 0px;
  background-color: rgba(255, 255, 255, 1);
  border: none;
  margin-top: 0px;
}

.title-text {
  color: rgba(49, 38, 81, 1);
  font-size: 16px;
  line-height: 20px;
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
  background-color: #70b8db;
  border: 0;
  margin-right: 10px;
  color: #fff;
}

.summary-item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: rgba(49, 38, 81, 1);
  font-size: 20px;
  font-weight: bold;
}

/deep/ .v-window__next {
  margin: 0;
  background-color: transparent;
  border-radius: 0;
}

/deep/ .v-window__prev {
  margin: 0;
  background-color: transparent;
  border-radius: 0;
}

.drawer-title {
  text-align: center;
  padding: 10px 0 7px 0;
  color: #ff7754;
  font-size: 14px;
}

.drawer-title-line {
  width: 34px;
  height: 3px;
  background-color: #e6e4e6;
  margin: auto;
}

.dashed {
  border-bottom: 1px #bbbbbb dashed;
  margin: 14px 0;
}

/deep/ .v-text-field--outlined fieldset {
  top: 0;
  border: none;
}
</style>
