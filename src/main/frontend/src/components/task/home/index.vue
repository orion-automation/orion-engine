<template>
  <div class="d-flex flex-row"
       style="align-items: center;justify-content: center;height: 100%;border-top: 1px solid rgb(187, 187, 187);">
    <div class="d-flex flex-column home-container"
         style="height: 100%;width: 100%;max-width: 1690px;gap: 35px;overflow-y: auto">
      <div class="d-flex flex-row" style="gap: 35px;width: 100%">
        <div
          class="d-flex flex-column"
          style="flex:1;width: 0;background-color: white;border-radius: 6px;border: 1px solid rgba(230, 228, 230, 1);">
          <div class="d-flex flex-row" style="align-items: center;padding: 17px;border-bottom: 1px solid #E6E4E6">
            <div class="d-flex flex-column" style="width: 0;flex: 1;gap: 6px">
              <div
                class="d-flex flex-row"
                style="align-items: center; font-size: 14px"
              >
                <div style="font-weight: bold">
                  {{ $store.state.user.profile.lastName }}
                </div>
                ,{{ nickTime }}
                <div
                  style="
              margin-left: 7px;
              margin-right: 3px;
              width: 6px;
              height: 6px;
              line-height: 20px;
              background-color: rgba(68, 66, 98, 1);
              text-align: center;
            "
                ></div>
                <div
                  style="
              width: 6px;
              height: 6px;
              line-height: 20px;
              background-color: rgba(255, 119, 84, 1);
              border-radius: 50%;
              text-align: center;
            "
                ></div>
              </div>
              <span style="font-size: 14px;color: #83829A">
              eo<sup>ai</sup>{{ $t("welcomeBack") }}
            </span>
            </div>
            <i v-if="weatherResult" :class="`qi-${weatherResult.now.icon}`" style="font-size: 32px;color: #E6E4E6"></i>
          </div>
          <div class="d-flex flex-row" style="align-items: center;padding: 20px 15px">
            <div class="summary-item" @click="onTaskListClick('unfinished')">
              <v-icon size="48" color="#E6E4E6" style="margin-right: 5px">
                mdi-download-box
              </v-icon>
              <div class="d-flex flex-column" style="width: 0;flex: 1">
                <span class="summary-item-title">{{ $t("notComplete") }}</span>
                <span style="font-size: 18px; font-weight:800">{{ count.mine }}</span>
              </div>
            </div>
            <div class="summary-item" @click="onTaskListClick('due')">
              <v-icon size="48" color="#E6E4E6" style="margin-right: 5px">
                mdi-clock-alert
              </v-icon>
              <div class="d-flex flex-column" style="width: 0;flex: 1">
                <span class="summary-item-title">{{ $t("due") }}</span>
                <span style="font-size: 18px; font-weight:800">{{ count.due }}</span>
              </div>
            </div>
            <div class="summary-item" @click="onTaskListClick('important')">
              <v-icon size="48" color="#E6E4E6" style="margin-right: 5px">
                mdi-alert-box
              </v-icon>
              <div class="d-flex flex-column" style="width: 0;flex: 1">
                <span class="summary-item-title">{{ $t("important") }}</span>
                <span style="font-size: 18px; font-weight:800">{{ count.priority }}</span>
              </div>
            </div>
          </div>
          <div class="d-flex flex-column"
               style="background-color: #FAFBFD;padding: 18px 14px;gap: 10px;flex: 1;height:0;border-bottom-right-radius: 6px;border-bottom-left-radius: 6px">
            <div
              style="width: 100%;background-color: white;border-radius: 0.5rem;border: 1px solid rgba(230, 228, 230, 1);">
              <task-calendar
                ref="calendarRef"
                :items="calendar.items"
                @setRange="setRange"
              />
            </div>
            <div
              class="d-flex flex-column"
              style="width: 100%;background-color: white;border-radius: 6px;border: 1px solid rgba(230, 228, 230, 1);height: 0;flex: 1">
              <div class="d-flex flex-row" style="align-items: center;border-bottom: 1px solid #E6E4E6;padding: 10px 15px">
                <v-icon color="#101010" size="20">mdi-history</v-icon>
                <span
                  style="color: #444262;font-size: 16px;font-weight: bold;flex: 1;width: 0;padding-left: 10px">{{ $t("lastUseApp")
                  }}</span>
                <v-icon size="20" color="#E6E4E6" @click="onRecentParentClick">mdi-chevron-right-circle</v-icon>
              </div>
              <div class="d-flex flex-row" style="flex-wrap: wrap;flex: 1;height: 0;gap: 13px;padding: 20px;overflow-y: auto">
                <div class="d-flex flex-column"
                     v-for="app in recentUsedXapp"
                     :key="`recent-app-${app.id}`"
                     @click="onClickXapp(app)"
                     style="gap: 12px;cursor: pointer;flex: 0 0 calc((100% - 60px)/5);height: 64px">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <div
                        class="container-app"
                        v-bind="attrs"
                        v-on="on"
                        style="position: relative;text-align: center;line-height:3.6;border-radius: 12px;width: 100%;height: 64px;background-color: rgba(255, 255, 255, 1);border: 1px solid rgba(230, 228, 230, 1);">
                        <v-icon
                          v-if="app.disabled"
                          style="margin: auto"
                          size="16"
                          color="#83829a">
                          mdi-link-off
                        </v-icon>
                        <i
                          class="fa-fw"
                          v-else
                          :class="app.configJson.basic.iconType+' fa-' + (app.configJson.basic.icon)"
                          style="font-size: 16px;color: #312651;margin: auto"
                        ></i>
                      </div>
                    </template>
                    <span>{{ app.name }}</span>
                  </v-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          style="flex: 1;width: 0;background-color: white;border-radius: 6px;border: 1px solid rgba(230, 228, 230, 1);height: 818.47px;overflow-y: auto">
          <task-list ref="taskList" @selectQuickFilter="onSelectQuickFilter" />
        </div>
        <div
          style="flex: 1;width: 0;background-color: white;border-radius: 6px;border: 1px solid rgba(230, 228, 230, 1);height:818.47px">
          <search-common :home-mode="true" />
        </div>
      </div>
    </div>
    <v-dialog v-model="disableXappDialog.display" width="350">
      <v-card>
        <v-card-title>{{ $t("alert") }}</v-card-title>
        <v-card-text>
          {{ $t("disabledXapp") }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="#0f40f5" text @click="disableXappDialog.display=false"> {{ $t("confirm") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import TaskList from "@/components/task/home/TaskList";
import SearchCommon from "@/components/task/mobile/search/index";
import utils from "@/utils/utils";
import taskRequest from "@/api/task";
import TaskCalendar from "@/components/common/TaskCalendar";
import moment from "moment/moment";
import camundaServiceRequest from "@/api/camunda-service";
import userRequest from "@/api/user";

export default {
  name: "Index",
  components: { TaskList, SearchCommon, TaskCalendar },
  data() {
    return {
      utils,
      selectQuickFilterTimeStamp: moment().add(220, "ms").toDate(),
      calendar: {
        items: []
      },
      userId: this.$store.state.user.profile.id,
      tenantId: this.$store.getters["user/getTenant"].id,
      count: {
        mine: 0,
        due: 0,
        priority: 0
      },
      recents: [],
      weatherResult: null,
      firstCalendarRange: true,
      applications: {
        allItems: []
      },
      disableXappDialog: {
        display: false
      }
    };
  },
  async mounted() {
    let self = this;
    self.getCalendar();
    self.getCount();
    self.getRecents();
    try {
    } catch (e) {
    }
  },
  computed: {
    recentUsedXapp() {
      let recentApps = this.$store.state.user.preferenceJson.recentUsedXapp ?? [];
      return recentApps.map(app => {
        let index = this.applications.allItems.findIndex(item => item.id === app.id);
        if (index > -1) {
          return this.applications.allItems[index];
        } else {
          app.disabled = true;
          return app;
        }
      });
    },
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
    userName() {
      return (
        this.$store.state.user.profile.firstName +
        " " +
        this.$store.state.user.profile.lastName
      );
    },
    email() {
      return this.$store.state.user.profile.email || "N/A";
    },
  },
  methods: {
    onClickXapp(data) {
      if (data.disabled) {
        this.disableXappDialog.display = true;
      } else {
        this.$router.push({
          name: "x-app-detail",
          params: { id: data.id }
        });
      }
    },
    async removeFromRecent(data) {
      let userSettings = this.$store.state.user.preferenceJson;
      if (Object.keys(userSettings).length > 0) {
        let recentUsedXapp = userSettings.recentUsedXapp ?? [];
        let index = recentUsedXapp.findIndex(item => item.id === data.id);
        if (index > -1) {
          // 移除已有
          recentUsedXapp.splice(index, 1);
        }
        let preferenceJson = Object.assign(
          this.$store.state.user.preferenceJson, { recentUsedXapp }
        );
        await userRequest.postUserSetting({
          userId: this.$store.state.user.profile.id,
          preferenceJson: preferenceJson
        });
        this.$store.commit("user/SET_PREFERENCE_JSON", preferenceJson);
        this.$notify.success(this.$t("removeSuccess"));
      }
    },
    async addToMyFav(data) {
      // 最近使用
      let userSettings = this.$store.state.user.preferenceJson;
      if (Object.keys(userSettings).length > 0) {
        let myFavXapp = userSettings.myFavXapp ?? [];
        let index = myFavXapp.findIndex(item => item.id === data.id);
        if (index > -1) {
          // 移除已有
          myFavXapp.splice(index, 1);
        }
        // 添加到首位
        myFavXapp.splice(0, 0, data);
        // 长度控制
        if (myFavXapp.length > 10) {
          myFavXapp = myFavXapp.slice(0, 10);
        }
        let preferenceJson = Object.assign(
          this.$store.state.user.preferenceJson, { myFavXapp }
        );
        await userRequest.postUserSetting({
          userId: this.$store.state.user.profile.id,
          preferenceJson: preferenceJson
        });
        this.$store.commit("user/SET_PREFERENCE_JSON", preferenceJson);
        this.$notify.success(this.$t("addToCollectSuccess"));
      }
    },
    onSelectQuickFilter() {
      this.selectQuickFilterTimeStamp = new Date();
      this.$refs.calendarRef.setRange({});
    },
    async getCalendar() {
      let data = {
        orQueries: [
          { candidateUser: this.userId, assignee: this.userId }
        ],
        nameNotLike: "Complete a Question"
      };
      let tasks = await taskRequest.postTaskList(
        "",
        {},
        data
      );
      this.calendar.items = tasks;
    },
    onTaskListClick(type) {
      if (type === "unfinished") {
        this.$router.push({ name: "task-list" });
      }
      if (type === "due") {
        this.$router.push({ name: "task-list", query: { defaultDueFilter: "before" } });
      }
      if (type === "important") {
        this.$router.push({ name: "task-list", query: { defaultPriorityFilter: "top" } });
      }
    },
    onRecentParentClick() {
      this.$router.push({ name: "x-detail" });
    },
    async getRecents() {
      this.applications.allItems = await camundaServiceRequest.getPda({
        userId: this.userId
      });
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
    },
    setRange(range, date) {
      // 200ms以内，视为是通过quickSelect触发的清空操作，不请求日期
      if (moment().diff(this.selectQuickFilterTimeStamp) >= 200) {
        if (this.firstCalendarRange) {
          this.firstCalendarRange = false;
          return;
        }
        this.$refs.taskList.setRange(range, date);
      }
    }
  },
  watch: {
    "$i18n.locale": {
      handler(val) {
        let self = this;
      }
    }
  }
};
</script>

<style scoped>
.v-text-field--outlined:deep(fieldset) {
  top: 0;
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

@media screen and (min-width: 0px) {
  .home-container {
    padding: 10px 20px;
  }
}

@media screen and (min-width: 667px) {
  .home-container {
    padding: 10px 30px;
  }
}

@media screen and (max-width: 992px) and (min-width: 300px) {
  .home-container {
    padding: 20px 40px;
  }
}

@media screen and (min-width: 992px) {
  .home-container {
    padding: 30px 50px;
  }
}

@media screen and (min-width: 1200px) {
  .home-container {
    padding: 60px 80px;
  }
}

@media screen and (min-width: 1600px) {
  .home-container {
    padding: 80px 100px;
  }
}

.summary-item-title {
  font-size: 14px;
  color: #83829A;
}

/deep/ .v-text-field--outlined fieldset {
  color: transparent !important;
}
</style>
