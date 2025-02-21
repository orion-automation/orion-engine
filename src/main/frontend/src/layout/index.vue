<template>
  <div class="layout-content">
    <v-app-bar
        dense
        app
        v-if="pageName==='x-app-detail'"
        color="white"
        style="border-bottom: 1px solid white"
        absolute
        class="detail-bar"
    >
      <v-icon
          size="16"
          @click="$store.dispatch('common/setXDetailLeftDrawer')"
          color="#444262"
          style="margin-right: 20px;cursor: auto;margin-left: 2px">
        {{ !$store.state.common.xDetailLeftDrawer ? "mdi-menu" : "mdi-close" }}
      </v-icon>

      <img src="../assets/svg/oriori.svg" style="height: 36px"/>

      <img v-if="iconPath" :src="iconPath" style="height: 32px;margin-left: 10px;margin-right: 10px">

      <span style="color: #444262;font-size: 16px;font-weight: 400;margin-right: 10px">|</span>

      <span style="color: #444262;font-size: 16px;font-weight: 400">{{ $store.getters["common/getXDetailName"] }}</span>

      <v-spacer/>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text
                 class="user"
                 v-bind="attrs"
                 v-on="on"
                 @click="$router.push({
              name: 'x-detail',
            })">
            <v-icon size="22" color="#444262">
              mdi-apps-box
            </v-icon>
          </v-btn>
        </template>
        <span>{{ $t("backToAppCenter") }}</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text
                 class="user"
                 v-bind="attrs"
                 v-on="on"
                 @click="$router.push({
              name: 'task-home',
            })">
            <v-icon size="22" color="#444262">
              mdi-home-import-outline
            </v-icon>
          </v-btn>
        </template>
        <span>{{ $t("backToTaskCenter") }}</span>
      </v-tooltip>
      <v-btn text class="user" @click="showMenu = true">
        <v-icon size="22" color="#444262">
          mdi-account-circle-outline
        </v-icon>
      </v-btn>
      <v-menu bottom offset-y :key="`${rerenderMenu}-menu-translate`">
        <template #activator="{ on, attrs }">

          <v-btn v-bind="attrs"
                 text
                 class="user"
                 style="border-right: none;border-left: none"
                 v-on="on">
            <v-icon size="16" color="#444262">mdi-translate</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="setLocale(item.value)" v-for="item in locale.items" :key="item.value">
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu bottom offset-y :key="`${rerenderMenu}-menu-drawer`">
        <template #activator="{ on, attrs }">
          <v-btn
              v-bind="attrs"
              v-on="on"
              text class="user" @click="$store.dispatch('common/setXDetailRightDrawer')">
            <v-icon size="22" color="#444262">
              {{ !$store.state.common.xDetailRightDrawer ? "mdi-dock-right" : "mdi-dock-left" }}
            </v-icon>
          </v-btn>
        </template>
        <div></div>
      </v-menu>
    </v-app-bar>
    <v-app-bar
        dense
        app
        v-else
        color="white"
        style="border-bottom: 1px solid #B1ABB6"
        absolute
        :class="
        pageName
          ? {
              'detail-bar':
                pageName.indexOf('-detail') >= 0 ||
                pageName.indexOf('collaboration') >= 0 ||
                pageName.indexOf('task') >= 0 ||
                pageName.indexOf('data') >= 0 ||
                pageName.indexOf('application') >= 0,
            }
          : {}
      "
    >

      <v-icon
          v-show="pageName === 'x-detail'"
          color="#312651"
          size="20"
          style="margin-right: 10px; cursor: pointer"
          @click="toggleApps"
      >mdi-apps
      </v-icon>

      <v-menu bottom offset-y z-index="2001" v-if="!['x-detail','x-app-detail'].includes(pageName)">
        <template #activator="{ on, attrs }">
          <div
              v-bind="attrs"
              v-on="on"
              class="d-flex flex-row"
          >
            <img src="../assets/svg/oriori.svg" style="height: 36px">
            <v-icon color="#FF7754">mdi-menu-down</v-icon>
          </div>
        </template>
        <link-menu/>
      </v-menu>
      <img v-if="iconPath" :src="iconPath" style="height: 32px;margin-left: 10px">
      <v-spacer/>
      <v-btn-toggle v-model="menuIndex" height="100%">
        <v-btn
            @click="selectMenu(menu)"
            text
            v-for="menu in menus.slice(0,6)"
            :key="menu.id"
        >
          <v-icon size="18" style="margin-right: 6px">{{ menu.icon }}</v-icon>
          <span class="top-menu">{{ $t(`mainMenus.${menu.name}`) }}</span>
        </v-btn>

        <v-menu offset-y v-if="menus.length > 6">
          <template #activator="{ on, attrs }">
            <v-btn text v-bind="attrs" v-on="on">
              <v-icon size="18" style="margin-right: 6px">
                mdi-dots-horizontal
              </v-icon>
              <span class="top-menu">{{ $t('more') }}</span>
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="menu in menus.slice(-(menus.length-6))" :key="menu.id" style="width: 150px"
                         @click="selectMenu(menu)">
              <v-list-item-title style="font-size: 14px;">{{ menu.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn-toggle>

      <v-btn text class="user" @click="showMenu=true" style="border-right: none">
        <span class="user-name">{{ userName }}</span>&nbsp;
        <v-icon size="22" color="#444262">
          mdi-account-box
        </v-icon>
      </v-btn>
      <v-menu bottom offset-y>
        <template #activator="{ on, attrs }">

          <v-btn v-bind="attrs"
                 icon
                 style="border-right: none;border-left: none;margin-right: 0"
                 v-on="on">
            <v-icon size="16">mdi-translate</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="setLocale(item.value)" v-for="item in locale.items" :key="item.value">
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main class="overflow-y-auto" style="overflow-x: hidden; height: 100%">
      <!-- Provides the application the proper gutter -->
      <v-container
          fluid
          class="subpage detail"
      >
        <!-- If using vue-router -->
        <router-view/>
      </v-container>
    </v-main>

    <v-overlay :value="$store.getters['common/getIsLoading']" z-index="10000">
      <v-progress-circular indeterminate size="64"/>
    </v-overlay>
    <v-dialog v-model="userSetDialog.show" max-width="700">
      <v-card>
        <v-card-title style="color: #444262">{{ $t('personalSetting') }}</v-card-title>
        <v-card-text>
          流程默认视图
          <v-radio-group :column="false" v-model="userSetDialog.preferenceJson.processDefault">
            <v-radio label="进行时" value="runtime" style="margin-right: 20px" color="#FF7754"/>
            <v-radio label="历史" value="history" color="#FF7754"/>
          </v-radio-group>
          <v-text-field label="BI URL" v-model="userSetDialog.preferenceJson.biUrl"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" text @click="userSetDialog.show=false">{{ $t('cancel') }}</v-btn>
          <v-btn color="#FF7754" @click="onCommitUserSet" style="color: #fff" :loading="userSetDialog.commitLoading">
            {{ $t('save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="$store.getters['common/getAuthorizedDialog']" persistent>
      <v-card>
        <v-card-title style="color: #444262">{{ $t('alert') }}</v-card-title>
        <v-card-text>
          {{ $t('noPageAuth') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="#FF7754" @click="logout" style="color: #fff">
            {{ $t('backToLogin') }}
          </v-btn>
          <v-btn color="#FF7754" @click="goIndex" style="color: #fff">
            {{ $t('backToHome') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="$store.getters['common/getShowResourceDialog']" persistent width="500">
      <v-card>
        <v-card-title style="color: #444262">{{ $t('noAuth') }}</v-card-title>
        <v-card-text>{{ $t('noAuthInfo') }}</v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer/>
          <v-btn @click="$store.dispatch('common/setResourceDialog', {show: false})" text>{{ $t('back') }}</v-btn>
          <v-btn color="#FF7754" @click="logout" class="white--text"><v-icon left color="white">mdi-logout-variant</v-icon>{{ $t('loginOtherAccount') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
          <v-spacer/>
          <v-btn
              text
              class="setting-button"
              color="#57928D"
              @click="resetPasswordMenu.display = true"
          >
            {{ $t('resetPassword') }}
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
          <v-spacer/>
          <v-btn
              text
              class="setting-button"
              :loading="resetPasswordMenu.commitLoading"
              color="#57928D"
              @click="onCommitResetPassword"
          >
            {{ $t('submitUpdate') }}
          </v-btn>
        </div>
      </v-sheet>
    </v-bottom-sheet>
    <v-dialog v-model="resetPasswordMenu.success" persistent>
      <v-card>
        <v-card-title>{{ $t('resetPasswordSuccess') }}</v-card-title>
        <v-card-text
        >{{ $t('resetPasswordSuccessBackInfo') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="logout" text>
            <v-icon left color="#FF7754">mdi-logout</v-icon>
            {{ $t('confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import userRequest from "@/api/user";
import LinkMenu from "@/components/common/LinkMenu";
import {setI18nLocale} from "@/utils/auth";

export default {
  name: "Layout",
  components: {LinkMenu},
  mounted() {
    let name = this.$route.matched[0].name;
    if (!name) {
      this.selectMenu(this.menus[0]);
    }
    this.menuIndex = this.menus.findIndex((menu) => this.$route.matched[0].path.includes(menu.path));
  },

  data() {
    return {
      rerenderMenu: 0,
      locale: {
        items: [{name: "中文", value: "zh"}, {name: "English", value: "en"}, {
          name: "日本語",
          value: "jp"
        }, {name: "Deutsch", value: "de"},]
      },
      showMenu: false,
      locationResult: null,
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
      menuIndex: -1,
      userSetDialog: {
        show: false,
        commitLoading: false,
        preferenceJson: {
          processDefault: "runtime",
          biUrl: "",
        },
      },
      authorizedDialog: {
        show: false,
      }
    };
  },
  computed: {
    menus() {
      if (this.$route.path.includes("/admin/")) {
        return [{
          "id": "user",
          "name": "user",
          "icon": "mdi-account-group-outline",
          "show": true,
          "resourceId": "bpezduo",
          "path":"/admin/user",
        }, {
          "id": "group",
          "name": "group",
          "icon": "mdi-select-group",
          "show": true,
          "resourceId": "bpezduo",
          "path":"/admin/group",
        }, {
          "id": "tenant",
          "name": "tenant",
          "icon": "mdi-cube-scan",
          "show": true,
          "resourceId": "bpezduo",
          "path":"/admin/tenant",
        }, {
          "id": "authorization",
          "name": "authorization",
          "icon": "mdi-shield-lock-open-outline",
          "show": true,
          "resourceId": "bpezauth",
          "path":"/admin/authorization",
        }, {
          "id": "license",
          "name": "system",
          "icon": "mdi-folder-information-outline",
          "show": true,
          "resourceId": "bpezduo",
          "path":"/admin/license",
        }].filter(
            (tab) => {
              if (tab.show) {
                return true;
              } else {
                return this.$store.state.user.authorization.findIndex(resource => resource.resourceId === tab.resourceId) > -1;
              }
            }
        );
      }
      if (this.$route.path.includes("/automation/")) {
        return [{
          "id": "process",
          "name": "process",
          "icon": "mdi-alpha-b-box-outline",
          "show": true,
          "resourceId": "bpezprocess",
          "path":"/automation/process",
        }, {
          "id": "decision",
          "name": "decision",
          "icon": "mdi-alpha-d-box-outline",
          "show": true,
          "resourceId": "bpezdmn",
          "path":"/automation/decision",
        }, {
          "id": "batch",
          "name": "batch",
          "icon": "mdi-form-select",
          "show": true,
          "resourceId": "bpezbatch",
          "path":"/automation/batch",
        }, {"id": "deploy", "name": "deploy", "icon": "mdi-package-up", "show": true, "resourceId": "bpezdeploy",
          "path":"/automation/deploy",}
        ].filter(
            (tab) => {
              if (tab.show) {
                return true;
              } else {
                return this.$store.state.user.authorization.findIndex(resource => resource.resourceId === tab.resourceId) > -1;
              }
            }
        );
      }
      if (this.$route.path.includes("/design/")) {
        return [{
          "id": "collaboration",
          "name": "collaboration",
          "icon": "mdi-drawing-box",
          "show": true,
          "resourceId": "bpezduo",
          "path":"/design/collaboration",
        }, {
          "id": "application",
          "name": "application",
          "icon": "mdi-apps-box",
          "show": true,
          "resourceId": "bpezduo",
          "path":"/design/application",
        }, {
          "id": "knowledge",
          "name": "knowledge",
          "icon": "mdi-book-open",
          "show": true,
          "resourceId": "bpezduo",
          "path":"/design/knowledge",
        }].filter(
            (tab) => {
              if (tab.show) {
                return true;
              } else {
                return this.$store.state.user.authorization.findIndex(resource => resource.resourceId === tab.resourceId) > -1;
              }
            }
        );
      }
      if (this.$route.path.includes("/task/")) {
        return [{
          "id": "task-home",
          "name": "home",
          "icon": "mdi-view-dashboard-variant-outline",
          "show": true,
          "resourceId": "bpezduo",
          "path":"/task/home",
        },
          {"id": "x", "name": "app", "icon": "mdi-apps-box", "show": true,
            "resourceId": "bpezduo",
            "path":"/task/x",},
          {
            "id": "task",
            "name": "task",
            "icon": "mdi-timeline-check",
            "show": true,
            "resourceId": "bpezduo",
            "path":"/task/task",
          }, {
            "id": "task-application",
            "name": "process",
            "icon": "mdi-all-inclusive",
            "show": true,
            "resourceId": "bpezduo",
            "path":"/task/application",
          }, {
            "id": "data",
            "name": "data",
            "icon": "mdi-chart-box-outline",
            "show": true,
            "resourceId": "bpezduo",
            "path":"/task/data",
          }].filter(
            (tab) => {
              if (tab.show) {
                return true;
              } else {
                return this.$store.state.user.authorization.findIndex(resource => resource.resourceId === tab.resourceId) > -1;
              }
            }
        );
      }
      return [];
    },
    userName() {
      return (
          this.$store.state.user.profile.firstName +
          " " +
          this.$store.state.user.profile.lastName
      );
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
        text = "凌晨好";
      } else if (hours > 4 && hours <= 11) {
        text = "早上好";
      } else if (hours > 11 && hours <= 13) {
        text = "中午好";
      } else if (hours > 13 && hours <= 18) {
        text = "下午好";
      } else if (hours > 18 && hours <= 24) {
        text = "晚上好";
      }
      // 返回当前时间段对应的状态
      return text;
    },
    email() {
      return this.$store.state.user.profile.email || "N/A";
    },
    pageName() {
      return this.$route.name;
    },
    iconPath() {
      if (window.webConfig && window.webConfig.iconPath) {
        return `${process.env.VUE_APP_ROOT_BASE_API}${window.webConfig.iconPath}`;
      } else {
        return null;
      }
    },
  },
  methods: {
    toggleApps() {
      let item = this.$children[1].$children[0];
      if (typeof item.drawerOpen === "boolean") {
        item.drawerOpen = !item.drawerOpen;
      }
    },
    setLocale(locale) {
      setI18nLocale(locale);
      this.$i18n.locale = locale;
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
    goIndex() {
      this.$store.dispatch("common/setAuthorizedDialog", false);
      this.$router.replace("/");
    },
    onCommitUserSet() {
      // 保存用户偏好
      this.userSetDialog.commitLoading = true;
      userRequest.setUserPreference({
        userId: this.$store.state.user.profile.id,
        preferenceJson: this.userSetDialog.preferenceJson,
      })
          .then(result => {
            this.$store.commit("user/SET_PREFERENCE_JSON", this.userSetDialog.preferenceJson);
            this.userSetDialog.show = false;
          }).catch(e => {
        this.$message.error(`保存个人偏好失败${e}`);
      }).finally(() => {
        this.userSetDialog.commitLoading = false;
      });
    },
    logout() {
      let self = this;
      this.$store.dispatch("user/logout").then(() => {
        this.$router.replace("/login");
        this.loading = false;
      });
    },
    selectMenu(menu) {
      if (menu.id.startsWith("extra-")) {
        let url = JSON.parse(process.env.VUE_APP_EXTRA_URL)[menu.id];
        if (menu.iframe) {
          this.$router.push({
            name: menu.id,
          });
        } else {
          //开启新标签页,避免跨域
          window.open(url);
        }
      } else {
        this.$router.push({
          name: menu.id,
        });
      }
    },
  },
  watch: {
    pageName: {
      handler(val) {
        this.rerenderMenu++;
      }
    },
    "$i18n.locale": {
      handler(val) {
        let self = this;
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
    "userSetDialog.show": {
      handler(val) {
        if (val) {
          if (Object.keys(this.$store.state.user.preferenceJson).length > 0) {
            this.userSetDialog.preferenceJson = Object.assign({}, this.$store.state.user.preferenceJson);
          }
        }
      }
    },
    $route: {
      handler: function (route) {
        this.$nextTick(()=>{
          this.menuIndex = this.menus.findIndex((menu) => route.matched[0].path.includes(menu.path));
        });
      },
      immediate: true,
    }
  }
};
</script>

<style scoped>
/deep/ .v-btn {
  letter-spacing: normal;
}

div.layout-content {
  background-color: rgba(232, 239, 247, 16);
  height: 100vh;
}

div.container.container--fluid.subpage {
  /*padding: 8px 15px 0 15px;*/
  background-color: #e8eff7;
  height: 100%;
  /*height: calc(100vh - 48px);*/
}

div.container.container--fluid.subpage.detail {
  padding: 0;
  /*height: calc(100vh - 64px);*/
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


header.v-sheet.v-app-bar.v-toolbar.detail-bar {
  box-shadow: 0 0px 0px 0px;
  border-bottom: 1px solid #e6e4e6;
  z-index: 200;
}

.setting {
  background-color: white;
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
</style>
