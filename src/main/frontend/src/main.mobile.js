import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import store from "./store";
import router from "./router/mobile";
import "./permission";
import element from "./plugins/element-ui";
import "@/assets/bpmn.css";
import "@/assets/mobile.css";
import "@/assets/fontawesome-free-6.6.0-web/css/all.css";
import i18n from "@/i18n";
import VCalendar from "v-calendar";
import VueClipboard from "vue-clipboard2";

VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);
Vue.config.productionTip = false;
Vue.use(VCalendar, {
  locale: "zh-CN", componentPrefix: "vc",
});

new Vue({
  i18n,
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
