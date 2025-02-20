<template>
  <div class="layout-content">
    <v-app-bar
        dense
        app
        color="white"
        absolute
        :class="pageName?{
        'detail-bar':
          pageName.indexOf('-detail') >= 0 ||
          pageName.indexOf('collaboration') >= 0||
          pageName.indexOf('application') >= 0
      }:{}"
    >
      <img src="../../assets/svg/oriori.svg" style="height: 36px">
      <img v-if="iconPath" :src="iconPath" style="height: 32px;margin-left: 10px">
      <v-spacer/>
      <v-menu offset-y>
        <template #activator="{ on, attrs }">
          <v-btn text class="user" v-bind="attrs" v-on="on">
            <span class="user-name">{{ userName }}</span>&nbsp;
            <v-icon size="22" color="#444262">
              mdi-account-box
            </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item key="logout">
            <v-list-item-title @click="logout()">{{ $t('quit') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
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
          class="subpage"
          style="padding: 0"
          :class="pageName?{
          detail:
            pageName.indexOf('-detail') >= 0 ||
            pageName.indexOf('collaboration') >= 0 ||
            pageName.indexOf('application') >= 0
        }:{}"
      >
        <div class="d-flex flex-column" style="align-items: center;justify-items: center;height: 100%;overflow-y: auto">
          <div
              style="background: white;border-bottom-left-radius: 12px;border-bottom-right-radius: 12px;width: 50%;max-width: 600px;min-width: 400px"
          >
            <img src="../../assets/home_header.jpg" style="width: 100%;display: block">
            <div style="font-weight: bolder;font-size: 30px;color: white;display: none">{{ nickTime }}</div>
            <div
                class="d-flex flex-row"
                style="align-items: center;border-top: 1px solid #E6E4E6"
            >
              <div style="color: #83829A;padding: 15px">{{ $t('welcomeWithName', {name: userName}) }}</div>
              <v-spacer/>
              <v-btn text color="#83829A" height="55px"
                     @click="goDoc"
                     style="border-left: 1px solid #E6E4E6;border-right: none;border-bottom-right-radius: 12px"
              >
                <v-icon left small>mdi-bookmark-box-outline</v-icon>
                {{ $t('document') }}
              </v-btn>
            </div>
          </div>
          <div class="d-flex flex-row" style="width: 50%;margin-top: 30px;margin-left:-10px;margin-right:-10px;max-width: 600px;min-width: 400px">
            <div class="d-flex flex-column home-item" @click="goDesignCenter" style="margin-left: 0">
              <v-icon :color="$store.getters['user/hasTenant']?'#312651':'#83829A'" large>mdi-drawing</v-icon>
              <div class="home-item-txt">{{ $t('linkMenu.designCenter') }}</div>
            </div>
            <div class="d-flex flex-column home-item" @click="goAutomationCenter">
              <v-icon color="#312651" large>mdi-thermostat-auto</v-icon>
              <div class="home-item-txt">{{ $t('linkMenu.automationCenter') }}</div>
            </div>
            <div class="d-flex flex-column home-item" @click="goTaskCenter">
              <v-icon :color="$store.getters['user/hasTenant']?'#312651':'#83829A'" large>mdi-calendar-multiselect
              </v-icon>
              <div class="home-item-txt">{{ $t('linkMenu.taskCenter') }}</div>
            </div>
            <div class="d-flex flex-column home-item" @click="goAdminCenter" style="margin-right: 0">
              <v-icon color="#312651" large>mdi-tune-variant</v-icon>
              <div class="home-item-txt">{{ $t('linkMenu.adminCenter') }}</div>
            </div>
          </div>
          <div class="d-flex flex-row" style="width: 50%;margin-top: 20px;margin-left:-10px;margin-right:-10px;max-width: 600px;min-width: 400px">
            <div class="d-flex flex-column home-item" @click="goXAppCenter" style="margin-left: 0">
              <v-icon :color="$store.getters['user/hasTenant']?'#312651':'#83829A'" large>mdi-apps-box</v-icon>
              <div class="home-item-txt">{{ $t('linkMenu.app') }}</div>
            </div>
            <div style="flex: 3;margin-right: 0;margin-left: 50px"></div>
          </div>
          <v-spacer style="min-height: 128px"/>
          <div
              style="background: white;border-top-left-radius: 12px;border-top-right-radius: 12px;width: 50%;max-width: 600px;min-width: 400px;
              font-size: 14px;"
          >
            <div
                class="d-flex flex-column"
                style="border-bottom: 1px dashed #E6E4E6;padding: 15px"
                v-if="updateLogs.length>0"
            >
              <div
                  class="d-flex flex-row update-log-title" style="margin-top: 0"
              >
                {{ $t('updateLogTitleWithVersion', {version: version}) }}
                <v-icon x-small color="#FF7754" style="margin-left: 10px">mdi-party-popper</v-icon>
              </div>
              <template v-for="(log,index) in updateLogs">
                <div class="update-log-title" :key="`${index}-log-title`">{{ log.title }}</div>
                <div v-for="(item,indexChild) in log.items" :key="`${index}-${indexChild}-log-content`">
                  {{ item }}
                </div>
              </template>
            </div>
            <div style="padding-top: 15px;padding-left: 15px;padding-right: 15px">
              <div class="update-log-title" style="margin-top: 0">{{ $t('learnMore') }}</div>
              <a style="font-size: 14px">{{ $t('learnMoreContent') }}</a>
            </div>
            <img src="../../assets/home_footer.jpg" style="width: 100%;display: block">
          </div>
        </div>
      </v-container>
    </v-main>

    <v-overlay :value="$store.getters['common/getIsLoading']" z-index="10000">
      <v-progress-circular indeterminate size="64"/>
    </v-overlay>
    <v-dialog v-model="$store.getters['common/getAuthorizedDialog']" persistent>
      <v-card>
        <v-card-title style="color: #444262">{{ $t('notify') }}</v-card-title>
        <v-card-text>
          {{ $t('noAuthCurrentPage') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="#FF7754" @click="logout" style="color: #fff">
            {{ $t('backLogin') }}
          </v-btn>
          <v-btn color="#FF7754" @click="goIndex" style="color: #fff">
            {{ $t('backHome') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {setUserPreference} from "@/api/user";
import config from "../../../package.json";
import {setI18nLocale} from "@/utils/auth";

export default {
  name: "Home",
  components: {},
  data() {
    return {
      locale: {
        items: [{name: "中文", value: "zh"}, {name: "English", value: "en"}, {
          name: "日本語",
          value: "jp"
        }, {name: "Deutsch", value: "de"},]
      },
      version: config.version,
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
      },
      updateLogs: []
    };
  },
  computed: {
    userName() {
      return (
          this.$store.state.user.profile.firstName +
          " " +
          this.$store.state.user.profile.lastName
      );
    },
    pageName() {
      return this.$route.name;
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
    iconPath() {
      if (window.webConfig && window.webConfig.iconPath) {
        return `${process.env.VUE_APP_ROOT_BASE_API}${window.webConfig.iconPath}`;
      } else {
        return null;
      }
    },
  },
  methods: {
    setLocale(locale) {
      setI18nLocale(locale);
      this.$i18n.locale = locale;
    },
    goIndex() {
      this.$store.dispatch("common/setAuthorizedDialog", false);
      this.$router.replace("/");
    },
    goDoc() {
      window.open("https://www.eorion.com/documents.html", "_blank");
    },
    goDesignCenter() {
      if (!this.$store.getters["user/hasTenant"]) {
        return;
      }
      this.$router.push({path:"/design/"});
    },
    goAutomationCenter() {
      this.$router.push({path:"/automation/process"});
    },
    goAdminCenter() {
      this.$router.push({path:"/admin/user/list"});
    },
    goXAppCenter() {
      if (!this.$store.getters["user/hasTenant"]) {
        return;
      }
      this.$router.push({path:"/task/x/index"});
    },
    goTaskCenter() {
      if (!this.$store.getters["user/hasTenant"]) {
        return;
      }
      this.$router.push({path:"/task/"});
    },
    logout() {
      this.$store.dispatch("user/logout").then(() => {
        this.$router.push({
          name: "login",
        });
        this.loading = false;
      });
    },
  },
  watch: {
    "$i18n.locale": {
      handler(val) {
        let self = this;
        self.updateLogs = [];
      },
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
  }
};
</script>

<style scoped>
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

.home-item {
  align-content: center;
  justify-items: center;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  background-color: rgba(255, 255, 255, 1);
  flex: 1;
  padding-top: 20px;
  padding-bottom: 20px;
  cursor: pointer;
  margin-left: 10px;
  margin-right: 10px;
}

.home-item-txt {
  margin-top: 10px;
  color: rgba(131, 130, 154, 1);
  font-size: 14px;
}

.update-log-title {
  font-size: 14px;
  align-items: center;
  color: #312651;
  font-weight: bold;
  margin-top: 20px;
}

.update-log-content {
  font-size: 14px;
  color: #312651;
}
</style>
