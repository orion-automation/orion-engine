<template>
  <div class="layout-content">
    <v-app-bar
        dense
        app
        color="white"
        absolute
        :class="{
        'detail-bar': true,
      }"
    >
      <img src="../assets/svg/oriori.svg" style="height: 36px">
      <img v-if="iconPath" :src="iconPath" style="height: 32px;margin-left: 10px">
      <div id="viewer-name"/>
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
          :class="{
          detail: true,
        }"
      >
        <!-- If using vue-router -->
        <router-view/>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import {setI18nLocale} from "@/utils/auth";

export default {
  name: "Layout",
  components: {},
  mounted() {
  },

  data() {
    return {
      locale: {
        items: [{name: "中文", value: "zh"}, {name: "English", value: "en"}, {
          name: "日本語",
          value: "jp"
        }, {name: "Deutsch", value: "de"},]
      },
    };
  },
  computed: {
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
    setLocale(locale) {
      setI18nLocale(locale);
      this.$i18n.locale = locale;
    },
  },
};
</script>

<style scoped>
div.layout-content {
  background-color: rgb(243, 244, 249);
  height: 100vh;
}

div.container.container--fluid.subpage {
  /*padding: 8px 15px 0 15px;*/
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

/deep/ .v-tab {
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

#viewer-name {
  flex: 1;
  text-align: center;
  font-weight: bold;
}
</style>
