<template>
  <!--  :class="{
      normal: pageName !== 'index' && pageName.indexOf('create') < 0,
    }"-->
  <div class="layout-content">
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <div
        class="d-flex flex-column"
        style="
          width: 100%;
          height: 100%;
          background-color: #312651;
          padding: 10px;
          align-items: start;
        "
      >
        <router-link
          :to="{
            name: 'index',
          }"
          class="no-style"
          style="width: unset"
        >
          <div
            class="d-flex flex-row"
            style="align-items: center; padding: 10px"
          >
            <v-icon color="#ffffff" size="24">mdi-apps-box</v-icon>
            <div style="font-size: 16px; color: white; margin-left: 17px">
              {{ $t("home") }}
            </div>
          </div>
        </router-link>
        <router-link
          :to="{
            name: 'data',
          }"
          class="no-style"
          style="width: unset"
        >
          <div
            class="d-flex flex-row"
            style="align-items: center; padding: 10px"
          >
            <v-icon color="#ffffff" size="24">mdi-chart-line-variant</v-icon>
            <div style="font-size: 16px; color: white; margin-left: 17px">
              {{ $t("data") }}
            </div>
          </div>
        </router-link>
        <router-link
          :to="{
            name: 'delegate-execute',
          }"
          class="no-style"
          style="width: unset"
        >
          <div
            class="d-flex flex-row"
            style="align-items: center; padding: 10px"
          >
            <v-icon color="#ffffff" size="24"
            >mdi-account-supervisor-circle-outline
            </v-icon
            >
            <div style="font-size: 16px; color: white; margin-left: 17px">
              {{ $t("delegateTask") }}
            </div>
          </div>
        </router-link>
        <router-link
          :to="{
            name: 'delegate',
          }"
          class="no-style"
          style="width: unset"
        >
          <div
            class="d-flex flex-row"
            style="align-items: center; padding: 10px"
          >
            <v-icon color="#ffffff" size="24">mdi-account-cog</v-icon>
            <div style="font-size: 16px; color: white; margin-left: 17px">
              {{ $t("authSetting") }}
            </div>
          </div>
        </router-link>
        <div
          class="d-flex flex-row"
          style="align-items: center; padding: 10px"
          @click="goHelp"
        >
          <v-icon color="#ffffff" size="24"
          >mdi-comment-question-outline
          </v-icon>
          <div style="font-size: 16px; color: white; margin-left: 17px">
            {{ $t("help") }}
          </div>
        </div>
        <v-spacer />
        <img
          style="margin: 10px"
          src="../assets/svg/oriori.svg"
          height="32px"
        />
      </div>
    </v-navigation-drawer>

    <v-app-bar
      dense
      app
      class="toolbar"
      color="#FFFFFF"
      style="border-bottom: 0px; padding: 0;z-index: 3"
      absolute
      elevation="2"
      v-if="pageName.indexOf('list') > 0"
    >
      <v-btn
        icon
        @click="drawer = true"
        style="margin-left: 5px; color: #83829a"
      >
        <v-icon>mdi-apps</v-icon>
      </v-btn>

      <router-link
        :to="{
          name: 'index',
        }"
        class="no-style"
        style="width: unset"
      >
        <div
          class="d-flex flex-row"
          style="align-items: center; font-size: 14px"
        >
          <img
            src="../assets/svg/oriori.svg"
            style="height: 32px; margin-right: 8px"
          />
        </div>
      </router-link>

      <v-spacer />

      <v-btn
        text
        class="user"
        ref="scanButton"
        v-if="pageName==='task-list' && canScan"
        style="
          border-right: 0px solid #ffffff;
          min-width: 20px;
          padding: 0 10px;
        "
        @click="scanCode"
      >
        <v-icon ref="menuIcon" size="24" color="#83829A">mdi-line-scan</v-icon>
      </v-btn>

      <v-btn
        text
        class="user"
        ref="scanButton"
        v-if="['index-list','application-list'].includes(pageName) && canScan"
        style="
          border-right: 0px solid #ffffff;
          min-width: 20px;
          padding: 0 10px;
        "
        @click="scanCodeStartProcess"
      >
        <v-icon ref="menuIcon" size="24" color="#83829A">mdi-line-scan</v-icon>
      </v-btn>

      <v-btn
        text
        class="user"
        ref="searchButton"
        style="
          border-right: 0px solid #ffffff;
          min-width: 20px;
          padding: 0 10px;
        "
        @click="showSearch"
      >
        <v-icon ref="menuIcon" size="24" color="#83829A"> mdi-magnify</v-icon>
      </v-btn>
      <v-badge
        v-if="delegates.length"
        bordered
        dot
        overlap
        color="#FF7754"
        style="margin: 0 10px"
      >
        <router-link
          :to="{
            name: 'delegate-execute',
          }"
          class="no-style"
        >
          <v-icon color="#83829A" size="24">
            mdi-account-supervisor-circle
          </v-icon>
        </router-link>
      </v-badge>
      <v-btn
        text
        class="user"
        ref="menuButton"
        @click="showMenu = true"
        style="
          border-right: 0px solid #ffffff;
          min-width: 20px;
          padding: 0 10px;
        "
      >
        <v-icon ref="menuIcon" size="24" color="#83829A">
          mdi-account-circle-outline
        </v-icon>
      </v-btn>
      <v-menu bottom offset-y v-if="false">
        <template #activator="{ on, attrs }">

          <v-btn v-bind="attrs"
                 icon
                 style="border-right: none;border-left: none;margin-right: 0"
                 v-on="on">
            <v-icon size="16" color="#83829A">mdi-translate</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="setLocale(item.value)" v-for="item in locale.items" :key="item.value">
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-app-bar
      class="toolbar"
      dense
      app
      color="#FFFFFF"
      style="border-bottom: 1px solid #b1abb6; padding: 0;z-index: 3"
      absolute
      elevation="2"
      v-if="pageName.indexOf('list') < 0"
    >
      <v-icon
        color="#312651"
        size="20"
        style="cursor: pointer; margin-right: 18px; margin-left: 18px"
        @click="goBack"
      >
        mdi-arrow-left
      </v-icon>
      <div class="app-bar-title" style="margin-right: 16px">
        {{ $store.state.common.appBarTitle }}
      </div>
      <template v-for="item in $store.state.common.appBarIcons">
        <v-badge
          v-if="item.dot"
          :key="`${item.id}-${item.icon}`"
          bordered
          dot
          overlap
          color="#FF7754"
        >
          <v-icon
            class="app-bar-icon"
            :key="`${item.id}-${item.icon}`"
            :color="item.color || '#312651'"
            size="20"
            @click="toggleIcon(item.id)"
          >
            {{ item.icon }}
          </v-icon>
        </v-badge>
        <v-icon
          class="app-bar-icon"
          v-if="!item.dot"
          :key="`${item.id}-${item.icon}`"
          :color="item.color || '#312651'"
          size="20"
          @click="toggleIcon(item.id)"
        >
          {{ item.icon }}
        </v-icon>
      </template>
    </v-app-bar>
    <v-bottom-sheet v-model="showMenu" inset>
      <v-sheet class="setting">
        <div class="d-flex" style="margin: 0 18px; padding-top: 18px">
          <v-icon> mdi-account-circle-outline</v-icon>
          <div style="flex: 1">
            <div class="setting-name">{{ userName }}</div>
            <div class="setting-detail">{{ email }}</div>
          </div>

          <v-icon class="out" @click="logout"> mdi-login-variant</v-icon>
        </div>
        <div class="d-flex" style="margin: 14px 18px 8px 18px">
          <v-icon> mdi-domain</v-icon>
          <div style="flex: 1">
            <div class="setting-name">{{ $store.state.user.tenant }}</div>
            <div class="setting-detail">
              {{ $store.state.user.tenantName || "N/A" }}
            </div>
          </div>
        </div>
        <div
          class="d-flex"
          style="margin: 14px 18px 8px 18px"
          v-if="locationResult"
        >
          <v-icon> mdi-map-marker-outline</v-icon>
          <div style="flex: 1">
            <div class="setting-name">
              {{ locationResult.formattedAddress }}
            </div>
            <div class="setting-detail">
              {{ locationResult.showType }}:{{ locationResult.showLocation }}
            </div>
          </div>
        </div>
        <div class="d-flex" style="border-top: 1px solid rgb(230, 228, 230)">
          <v-spacer />
          <v-btn
            text
            class="setting-button"
            color="#57928D"
            @click="resetPasswordMenu.display = true"
          >
            {{ $t("resetPassword") }}
          </v-btn>
        </div>
      </v-sheet>
    </v-bottom-sheet>
    <v-bottom-sheet v-model="resetPasswordMenu.display" inset>
      <v-sheet class="setting">
        <div class="d-flex" style="margin: 0 18px; padding-top: 18px">
          <v-icon> mdi-account-circle-outline</v-icon>
          <div style="flex: 1">
            <div class="setting-name">{{ userName }}</div>
            <div class="setting-detail">{{ email }}</div>
          </div>
        </div>
        <div class="d-flex flex-column" style="margin: 14px 18px 8px 18px">
          <v-form ref="accountForm" style="width: 100%" lazy-validation>
            <v-text-field
              v-model="resetPasswordMenu.form.password"
              :rules="[
                () => !!resetPasswordMenu.form.password || $t('itemNotAllowEmpty'),
              ]"
              required
              type="password"
              :label="$t('plsInputNowPassword')"
            />
            <v-text-field
              v-model="resetPasswordMenu.form.newPassword"
              :rules="resetPasswordMenu.newPasswordRule"
              required
              type="password"
              autocomplete="new-password"
              :label="$t('plsInputNewPassword')"
            />
            <v-text-field
              v-model="resetPasswordMenu.form.reNewPassword"
              :rules="resetPasswordMenu.checkPasswordRule"
              required
              auto-complete="new-password"
              type="password"
              :label="$t('plsInputNewPasswordAgain')"
            />
          </v-form>
          <div
            v-if="!!resetPasswordMenu.error"
            style="font-size: 12px; color: #fa4f07"
          >
            {{ resetPasswordMenu.error }}
          </div>
        </div>
        <div class="d-flex" style="border-top: 1px solid rgb(230, 228, 230)">
          <v-spacer />
          <v-btn
            text
            class="setting-button"
            :loading="resetPasswordMenu.commitLoading"
            color="#57928D"
            @click="onCommitResetPassword"
          >
            {{ $t("submitUpdate") }}
          </v-btn>
        </div>
      </v-sheet>
    </v-bottom-sheet>
    <v-dialog v-model="resetPasswordMenu.success" persistent>
      <v-card>
        <v-card-title>{{ $t("resetPasswordSuccess") }}</v-card-title>
        <v-card-text
        >{{ $t("resetPasswordSuccessBackInfo") }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="logout" text>
            <v-icon left color="#FF7754">mdi-logout</v-icon>
            {{ $t("confirm") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Sizes your content based upon application components -->
    <v-main
      class="overflow-y-auto"
      style="overflow-x: hidden; height: 100%"
      id="container"
    >
      <!-- Provides the application the proper gutter -->
      <v-container fluid class="subpage">
        <!-- If using vue-router -->
        <keep-alive :exclude="excludeName">
          <router-view v-if="$route.meta.keepAlive" ref="refAliveRoute">
            <!-- 这里是会被缓存的视图组件，比如 Home！ -->
          </router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" ref="refNotAliveRoute">
          <!-- 这里是不被缓存的视图组件，比如 Edit！ -->
        </router-view>
      </v-container>
    </v-main>
    <v-bottom-navigation
      absolute
      horizontal
      style="height: 64px"
      v-if="
        pageName.indexOf('list') < 0 && $store.state.common.navigations.length
      "
    >
      <v-btn
        @click="navigate(navigation.id)"
        text
        class="navigation-button"
        v-for="navigation in $store.state.common.navigations"
        :key="navigation.id"
        :class="{
          current: navigation.id == $store.state.common.currentNavigation,
        }"
      >
        <span>
          <span class="name">{{ navigation.name }}</span>
          <span class="badge" v-if="navigation.count">{{
              navigation.count
            }}</span></span
        >
      </v-btn>
    </v-bottom-navigation>
    <v-bottom-navigation
      absolute
      horizontal
      style="height: 64px"
      v-if="pageName.indexOf('list') > 0"
    >
      <v-btn
        v-for="navigation in applicationNavigations"
        :key="navigation.id"
        text
        class="navigation-button"
        :class="{ current: isCurrent(navigation.id) }"
      >
        <router-link
          :to="{
            name: navigation.id,
          }"
          class="no-style d-flex flex-column"
          style="align-items: center"
        >
          <template>
            <v-icon class="gray-icon" style="margin: 0 0 5px 0" size="20"
                    v-if="navigation.name !== 'EOai'"
            >{{ navigation.icon }}
            </v-icon>
            <img
              class="gray-icon"
              v-else
              style="margin: 0 0 5px 0;height: 20px"
              :src="require(`@/assets/svg/${$store.state.user.preferenceJson.mobile.eoaiAvatar}.svg`)"
            />
          </template>

          <img
            class="color-icon"
            :src="require(`@/assets/svg/${navigation.name === 'EOai'?$store.state.user.preferenceJson.mobile.eoaiAvatar:navigation.id}.svg`)"
            style="height: 20px"
          />
          <span v-if="navigation.name === 'EOai'"
          >{{ $store.state.user.preferenceJson.mobile.eoaiName }}<sup>ai</sup></span>
          <span v-else>{{ navigation.name }}</span>
        </router-link>
      </v-btn>
    </v-bottom-navigation>

    <v-overlay :value="$store.getters['common/getLoading']" z-index="10000">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
  </div>
</template>

<script>
import userRequest from "@/api/user";
import processRequest from "@/api/process";
import camundaRequest from "@/api/camunda-service";
import { mapGetters } from "vuex";
import utils from "@/utils/utils";
import { setI18nLocale } from "@/utils/auth";
import { isWorkWeChat, isWeChat } from "@/utils/common";

export default {
  name: "Layout",
  components: {},
  async mounted() {
    this.getUserSetting();
    await this.getDelegates();
  },
  events: {},
  data() {
    return {
      locale: {
        items: [{ name: "中文", value: "zh" }, { name: "English", value: "en" }, {
          name: "日本語",
          value: "jp"
        }, { name: "Deutsch", value: "de" }]
      },
      utils,
      delegates: [],
      drawer: false,
      locationResult: null,
      showMenu: false,
      resetPasswordMenu: {
        display: false,
        form: {
          password: "",
          newPassword: "",
          reNewPassword: ""
        },
        error: null,
        success: false,
        commitLoading: false,
        newPasswordRule: [
          (v) => !!v || this.$t("itemNotAllowEmpty"),
          (v) =>
            (v && v.length >= 6 && v.length <= 20) ||
            this.$t("errorNotRulesPassword")
        ],
        checkPasswordRule: [
          (v) => !!v || this.$t("itemNotAllowEmpty"),
          (v) =>
            (v && v.length >= 6 && v.length <= 20) ||
            this.$t("errorNotRulesPassword"),
          (v) =>
            (v &&
              this.resetPasswordMenu.form.newPassword &&
              v === this.resetPasswordMenu.form.newPassword) ||
            this.$t("errorNotSameTwoInputPassword")
        ]
      },
      applicationNavigations: [
        {
          id: "application-list",
          name: this.$t("app"),
          icon: "mdi-all-inclusive"
        },
        {
          id: "task-list",
          name: this.$t("task"),
          icon: "mdi-timeline-check"
        }
      ],
    };
  },
  computed: {
    ...mapGetters("page", ["excludeName"]),
    canScan() {
      return isWeChat() || isWorkWeChat();
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
    pageName() {
      return this.$route.name;
    }
  },
  methods: {
    setLocale(locale) {
      setI18nLocale(locale);
      this.$i18n.locale = locale;
    },
    scanCode() {
      this.$refs.refNotAliveRoute.searchByScan();
    },
    async scanCodeStartProcess() {
      let self = this;
      try {
        let str = "{}";
        let searchVars = JSON.parse(str);
        if (searchVars.pk) {
          // 查询当前用户可启动的流程
          let processList = await processRequest.getProcessList(
            {
              key: searchVars.pk,
              startableBy: this.$store.state.user.profile.id
            }, 1, 1);
          if (processList.length > 0) {
            // 启动流程，传入参数
            await self.$store.dispatch("common/setCreateInstanceVars",searchVars["vars"]);
            self.$router.push({
              name: "application-create",
              params: { key: searchVars.pk }
            });
          } else {
            self.$notify.error(self.$t("currentQRCodeErrNoAuth"));
          }
        } else {
          self.$notify.error(self.$t("currentQRCodeErr"));
        }
      } catch (e) {
        self.$notify.error(self.$t("currentCodeErr"));
      }
    },
    showSearch() {
      let self = this;
      if (self.pageName === "search-index") {
        // 返回
        self.goBack();
      } else {
        self.$router.push({
          name: "search-index"
        });
      }
    },
    goHelp() {
      window.location.href = "https://www.eorion.com/documents.html";
    },
    async onCommitResetPassword() {
      let self = this;
      if (this.$refs.accountForm.validate()) {
        let payload = {
          password: this.resetPasswordMenu.form.newPassword,
          authenticatedUserPassword: this.resetPasswordMenu.form.password
        };
        self.resetPasswordMenu.commitLoading = true;
        userRequest
          .putUpdateUserCredentials(self.$store.state.user.profile.id, payload)
          .then((res) => {
            self.resetPasswordMenu.success = true;
            self.resetPasswordMenu.display = false;
            self.showMenu = false;
          })
          .catch(() => {
            self.resetPasswordMenu.error = self.$t("errInputNowPassword");
          })
          .finally(() => {
            self.resetPasswordMenu.commitLoading = false;
          });
      }
    },
    async navigate(id) {
      await this.$store.dispatch("common/setCurrentNavigation", id);
    },
    async toggleIcon(id) {
      await this.$store.dispatch("common/setCurrentAppBarIcon", id);
    },
    isCurrent(page) {
      var regex = /-.*/;
      let result = page.replace(regex, "") == this.pageName.replace(regex, "");
      return result || this.pageName === "index-list";
    },
    goBack() {
      this.$router.back();
    },
    logout() {
      this.$store.dispatch("user/logout").then(() => {
        this.$router.replace("/login");
      });
    },
    async getDelegates() {
      let now = utils.formatDateTime(new Date(), "x");
      let params = {
        tenant: this.$store.state.user.tenant,
        delegateToUserId: this.$store.state.user.profile.id,
        startDateTimeBefore: now,
        endDateTimeAfter: now,
        status: 1,
        orderBy: "startDateTime",
        sort: "asc"
      };
      let { data } = await camundaRequest.getGranted(params);
      this.delegates = data;
    },
    async getUserSetting() {
      try {
        let userSettingResult = await userRequest.getUserSetting({ userId: this.$store.state.user.profile.id });
        if (userSettingResult && userSettingResult.preference) {
          this.$store.commit(
            "user/SET_PREFERENCE_JSON",
            userSettingResult.preference
          );
        }
      } catch (e) {
      }
    }
  },
  watch: {
    "$i18n.locale": {
      handler(val) {
        let self = this;
        self.applicationNavigations = [
          {
            id: "application-list",
            name: this.$t("app"),
            icon: "mdi-all-inclusive"
          },
          {
            id: "task-list",
            name: this.$t("task"),
            icon: "mdi-timeline-check"
          }
        ];
        self.resetPasswordMenu.newPasswordRule = [
          (v) => !!v || this.$t("itemNotAllowEmpty"),
          (v) =>
            (v && v.length >= 6 && v.length <= 20) ||
            this.$t("errorNotRulesPassword")
        ];
        self.resetPasswordMenu.checkPasswordRule = [
          (v) => !!v || this.$t("itemNotAllowEmpty"),
          (v) =>
            (v && v.length >= 6 && v.length <= 20) ||
            this.$t("errorNotRulesPassword"),
          (v) =>
            (v &&
              this.resetPasswordMenu.form.newPassword &&
              v === this.resetPasswordMenu.form.newPassword) ||
            this.$t("errorNotSameTwoInputPassword")
        ];
      }
    },
  }
};
</script>

<style scoped>

div.layout-content {
  /* background-color: #ffffff; */
  background-color: #f3f4f9;
  height: 100vh;
}

/* div.layout-content.normal {
  background-color: #ffffff;
} */

div.container.container--fluid.subpage {
  height: 100%;
  padding: 0;
}

div.version {
  color: rgba(0, 0, 0, 0.69);
  font-size: 12px;
  text-align: left;
}

span.user-name {
  margin-right: 5px;
}

i.logo {
  margin-right: 16px;
}

span.app-title {
  color: rgba(12, 41, 200, 100);
  font-size: 18px;
  text-align: left;
  margin-right: 100px;
  vertical-align: middle;
}

span.app-title span.bold {
  font-weight: bold;
}

div.v-btn-toggle button span.top-menu {
  color: #000000;
  font-size: 14px;
}

div.v-btn-toggle button.v-btn {
  padding: 0 24px;
  border-width: 0;
  border-radius: 0;
  color: #444262;
}

div.v-btn-toggle button.v-btn--active span.top-menu {
  color: #ffffff;
}

div.v-btn-toggle button.v-btn i {
  margin-right: 10px;
  color: #444262 !important;
  font-size: 26px;
}

div.v-btn-toggle button.v-btn--active i {
  color: #ffffff !important;
}

div.v-btn-toggle button.v-btn--active {
  color: #ffffff;
  background-color: #444262;
}

div.v-btn-toggle {
  border-radius: 0;
}

.v-btn.user:not(.v-btn--round).v-size--default {
  height: 100%;
  border-radius: 0;
}

div.v-btn,
button.v-btn {
  text-transform: none;
}

.v-list-item {
  cursor: pointer;
}

header.v-sheet.v-app-bar.v-toolbar.detail-bar {
  box-shadow: 0 0px 0px 0px;
  border-bottom: 1px solid #e6e4e6;
  z-index: 200;
}

.setting {
  background-color: #f3f4f9;
}

.setting .v-icon {
  flex: 0;
  color: #83829a;
  font-size: 24px;
  margin-right: 20px;
  cursor: pointer;
}

.setting .v-icon.out {
  color: #444262;
  font-size: 24px;
  margin-right: 0;
}

.setting .setting-button {
  height: 52px;
  border-right: 0px;
  font-size: 14px;
}

.setting-name {
  font-weight: bold;
  color: rgba(16, 16, 16, 1);
  font-size: 14px;
}

.setting-detail {
  color: rgba(131, 130, 154, 1);
  font-size: 14px;
}

.no-style {
  width: 100%;
}

.theme--light.v-bottom-navigation
.v-btn:not(.v-btn--round).v-size--default.navigation-button {
  height: 100%;
  width: 100%;
  color: #b1abb6 !important;
  font-size: 13px;
}

.theme--light.v-bottom-navigation
.v-btn:not(.v-btn--round).v-size--default.navigation-button.current {
  color: #312651 !important;
}

.theme--light.v-bottom-navigation
.v-btn:not(.v-btn--round).v-size--default.navigation-button.current
.gray-icon {
  display: none;
}

.theme--light.v-bottom-navigation
.v-btn:not(.v-btn--round).v-size--default.navigation-button
.color-icon {
  margin-bottom: 4px;
  display: none;
}

.theme--light.v-bottom-navigation
.v-btn:not(.v-btn--round).v-size--default.navigation-button.current
.color-icon {
  display: block;
}

/deep/
.v-item-group.v-bottom-navigation--horizontal
.v-btn.navigation-button
> .v-btn__content {
  flex-direction: column;
  align-items: center;
}

/deep/ .toolbar.v-toolbar--dense .v-toolbar__content {
  padding: 0;
}

.navigation-button span.badge {
  background-color: #e6e4e6;
  color: #83829a;
  margin-left: 5px;
  margin-right: 0;
  vertical-align: middle;
}

.navigation-button.current span.badge {
  background-color: #0f40f5;
  color: #ffffff;
}

.navigation-button span.name {
  color: #b1abb6;
}

.navigation-button.current span.name {
  color: rgba(68, 66, 98, 1);
  font-weight: bold;
}

.app-bar-title {
  font-size: 14px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-bar-icon,
.toolbar .v-badge {
  cursor: pointer;
  margin-right: 30px;
}

.toolbar .v-badge .app-bar-icon {
  margin-right: 0;
}

.toolbar .v-badge:last-child,
.app-bar-icon:last-child {
  margin-right: 16px;
}

.set-item-title {
  color: #B1ABB6;
  margin-top: 20px;
  margin-bottom: 10px;
}

.set-item-icon-indicator {
  width: 28px;
  height: 5px;
  background-color: #FF7754;
  border-radius: 2px;
}

.set-item-icon {
  height: 28px;
  margin-bottom: 5px;
}
</style>
