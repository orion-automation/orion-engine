<template>
  <div class="d-flex flex-row" style="width: 100%; height: 100%; flex: 1">
    <v-icon
      color="#FF7754"
      v-if="false"
      @click="drawerOpen = !drawerOpen"
      style="left: 10px; bottom: 10px; position: absolute; z-index: 100"
    >{{ drawerOpen ? "mdi-chevron-left" : "mdi-chevron-right" }}
    </v-icon>
    <v-navigation-drawer
      v-model="drawerOpen"
      :width="drawerOpen ? 350 : 0"
      absolute
      temporary
    >
      <div
        class="d-flex flex-column custom-drawer-item"
        style="
          padding: 0;
          position: absolute;
          z-index: 1;
          opacity: 1;
          background: rgba(255, 255, 255, 1);
          width: 349px;
          border-bottom: unset;
          align-items: start;
        "
      >
        <div style="margin: 26px 0 10px 0; padding: 0 15px; width: 100%">
          <v-text-field dense
                        v-model="applications.nameLike"
                        :placeholder="$t('searchAppWithDot')" hide-details
                        style="font-size: 14px;line-height: 20px;height: 30px"
                        @keydown.enter="refreshApplications"
                        @click:append="refreshApplications"
                        append-icon="mdi-magnify"
          />
        </div>
      </div>

      <div style="height: 67px"></div>

      <router-link
        class="d-flex flex-row no-style drawer-item-container"
        v-for="item in applications.items"
        :key="item.id"
        style="margin: 14px 20px"
        @click.native="onClickXapp({id:item.id})"
        :to="{}"
      >
        <div class="custom-drawer-item-icon">
          <i
            class="fa-fw"
            :style="{color:'#444262'}"
            :class="item.configJson.basic.iconType+' fa-' + (item.configJson.basic.icon)"
            style="font-size: 16px"
          ></i>
        </div>

        <span style="font-size: 16px; color: #444262;flex: 1">{{ item.name }}</span>
        <v-btn icon x-small color="#FF7754"
               class="btn-fav-menu"
               v-if="myFavXapp.findIndex(app=>app.id===item.id)===-1"
               @click.native.stop="addToMyFav({id:item.id,name:item.name})">
          <v-icon>mdi-star-check-outline</v-icon>
        </v-btn>
        <v-btn icon x-small color="#FF7754"
               v-else
               class="btn-fav-menu"
               @click.native.stop="removeFromMyFav({id:item.id})">
          <v-icon>mdi-star-check</v-icon>
        </v-btn>
      </router-link>
      <infinite-loading @infinite="getApplicationsPage" :identifier="infiniteId">
        <template #no-more>
          <div class="d-flex flex-row infinite-more-container">
          </div>
        </template>
      </infinite-loading>
    </v-navigation-drawer>
    <div
      class="d-flex flex-column home-container"
      style="
        height: calc(100vh - 48px);
        width: 100%;
        border-top: 0 solid rgb(187, 187, 187);
        overflow-y: hidden;
        align-items: center
      "
    >
      <div class="d-flex flex-row" style="flex: 1;overflow-y: auto;width: 100%;justify-content: center">
        <div style="height: 100%;width: 480px;gap: 50px;padding-bottom: 50px;" class="d-flex flex-column">
          <div style="align-items: center;padding-top: 20%" class="d-flex flex-column">
            <div style="color: #444262;font-weight: 800;font-size: 28px;margin-bottom: 15px">
              Hi, {{ name }}
            </div>
            <div style="color: #444262;font-weight: 300;font-size: 20px;margin-bottom: 36px">{{ $t('welcomeBackDpa') }}</div>
            <div
              @click="drawerOpen=true"
              style="padding: 7px;cursor: pointer;background-color: white;border-radius: 6px;box-shadow: 0px 2px 6px 0px rgba(230, 228, 230, 1);">
              <v-icon size="24" color="#0F40F5">mdi-apps</v-icon>
            </div>
          </div>
          <div class="d-flex flex-column" v-if="recentUsedXapp.length>0" style="gap: 15px;">
            <div style="color: #83829A;font-size: 14px">{{ $t("lastUse") }}</div>
            <div class="d-flex flex-row" style="gap: 40px;flex-wrap: wrap">
              <div class="d-flex flex-column"
                   v-for="app in recentUsedXapp"
                   :key="`recent-app-${app.id}`"
                   @click="onClickXapp(app)"
                   style="gap: 12px;width: 64px;cursor: pointer">
                <div
                  class="container-app"
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
                  <v-menu offset-y>
                    <template #activator="{ on, attrs }">
                      <v-btn icon x-small
                             class="btn-more-menu"
                             v-bind="attrs"
                             style="position: absolute;right: 5px;bottom: 5px"
                             v-on="on">
                        <v-icon x-small>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list
                      style="border-radius: 6px;border: 1px solid rgba(177, 171, 182, 1);padding: 0"
                      width="150">
                      <v-list-item @click="removeFromRecent({id:app.id})"
                                   style="border-bottom: 1px solid rgba(177, 171, 182, 1)">
                        <v-list-item-content>
                          <div class="d-flex flex-row" style="align-items: center;font-size: 13px;color: #595172">
                            {{ $t("remove") }}
                          </div>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item @click="addToMyFav({id:app.id,name:app.name})">
                        <v-list-item-content>
                          <div class="d-flex flex-row" style="align-items: center;font-size: 13px;color: #595172">
                            {{ $t("addToCollect") }}
                          </div>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <div
                      v-bind="attrs"
                      v-on="on"
                      class="app-item-name">
                      {{ app.name }}
                    </div>
                  </template>
                  <span>{{ app.name }}</span>
                </v-tooltip>
              </div>
            </div>
          </div>
          <div class="d-flex flex-column" v-if="myFavXapp.length>0" style="gap: 15px;">
            <div style="color: #83829A;font-size: 14px">{{ $t("collect") }}</div>
            <div class="d-flex flex-row" style="gap: 40px;flex-wrap: wrap">
              <div class="d-flex flex-column"
                   v-for="app in myFavXapp"
                   :key="`my-fav-app-${app.id}`"
                   @click="onClickXapp(app)"
                   style="gap: 12px;width: 64px;cursor: pointer">
                <div
                  class="container-app"
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
                  <v-menu offset-y>
                    <template #activator="{ on, attrs }">
                      <v-btn icon x-small
                             class="btn-more-menu"
                             v-bind="attrs"
                             style="position: absolute;right: 5px;bottom: 5px"
                             v-on="on">
                        <v-icon x-small>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list
                      style="border-radius: 6px;border: 1px solid rgba(177, 171, 182, 1);padding: 0"
                      width="150">
                      <v-list-item @click="removeFromMyFav({id:app.id})" style="">
                        <v-list-item-content>
                          <div class="d-flex flex-row" style="align-items: center;font-size: 13px;color: #595172">
                            {{ $t("remove") }}
                          </div>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <div
                      v-bind="attrs"
                      v-on="on"
                      class="app-item-name">
                      {{ app.name }}
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
        class="d-flex flex-column"
        style="flex: 0; width: 100%; align-items: center"
      >
        <div style="flex: 0; width: 20px; min-height: 20px">
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
import SearchCommon from "@/components/task/mobile/search/index";
import utils from "@/utils/utils";
import taskRequest from "@/api/task";
import camundaServiceRequest from "@/api/camunda-service";
import InfiniteLoading from "vue-infinite-loading";
import userRequest from "@/api/user";

export default {
  name: "Index",
  components: { InfiniteLoading, SearchCommon },
  data() {
    return {
      utils,
      infiniteId: +new Date(),
      applications: {
        itemsPerPage: 10,
        totalCount: 0,
        sortBy: "deployTime",
        sortOrder: "asc",
        nameLike: "",
        items: [],
        allItems: []
      },

      userId: this.$store.state.user.profile.id,
      tenantId: this.$store.getters["user/getTenant"].id,
      drawerOpen: false,
      disableXappDialog: {
        display: false
      }
    };
  },
  async mounted() {
    this.applications.allItems = await camundaServiceRequest.getPda({
      userId: this.userId
    });
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
    myFavXapp() {
      let recentApps = this.$store.state.user.preferenceJson.myFavXapp ?? [];
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
    userName() {
      return (
        this.$store.state.user.profile.firstName +
        " " +
        this.$store.state.user.profile.lastName
      );
    },
    name() {
      return (
        this.$store.state.user.profile.firstName
      );
    },
    email() {
      return this.$store.state.user.profile.email || "N/A";
    }
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
    async removeFromMyFav(data) {
      let userSettings = this.$store.state.user.preferenceJson;
      if (Object.keys(userSettings).length > 0) {
        let myFavXapp = userSettings.myFavXapp ?? [];
        let index = myFavXapp.findIndex(item => item.id === data.id);
        if (index > -1) {
          // 移除已有
          myFavXapp.splice(index, 1);
        }
        let preferenceJson = Object.assign(
          this.$store.state.user.preferenceJson, { myFavXapp }
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
    onRecentParentClick() {
      this.$router.push({ name: "task-application-list" });
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
    async refreshApplications() {
      this.applications.items = [];
      this.infiniteId++;
    },

    async getApplicationsPage($state) {
      let applications = await camundaServiceRequest.getPda({
        userId: this.userId,
        nameLike: this.applications.nameLike
      });
      this.applications.items = this.applications.items.concat(applications);
      $state.loaded();
      $state.complete();
    }
  },

  watch: {
    "$i18n.locale": {
      handler(val) {
        let self = this;
      }
    },
    drawerOpen: {
      handler(value) {
        if (value) {
          setTimeout(async () => {
            await this.refreshApplications();
          }, 500);
        }
      }
    }
  }
};
</script>

<style scoped>
.btn-fav-menu {
  opacity: 0;
}

.drawer-item-container:hover .btn-fav-menu {
  opacity: 1;
}
.btn-more-menu {
  opacity: 0;
}

.container-app:hover .btn-more-menu {
  opacity: 1;
}

.v-text-field--outlined:deep(fieldset) {
  top: 0;
}

.v-text-field--outlined:deep(.v-text-field__slot) {
  padding: 0 40px;
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
  background: linear-gradient(
    90deg,
    rgba(201, 255, 191, 1) 0%,
    rgba(255, 176, 190, 1) 99%
  );
}

.summary-item-title {
  font-size: 14px;
  color: #83829a;
}

.app-cell {
  width: 60px;
  height: 60px;
  border: 1px solid #e6e4e6;
  border-radius: 12px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search {
  outline: unset;
  flex: 1;
  height: 30px;
  line-height: 20px;
  margin: 0;
  width: 100%;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 1);
  font-size: 14px;
  border: 1px solid #f3f4f9;
  padding: 0 10px;
  text-align: left;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.28);
}

.app-item-name {
  color: #83829A;
  text-overflow: ellipsis;
  font-size: 14px;
  width: 100%;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
}
</style>
