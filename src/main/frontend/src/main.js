import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import store from "./store";
import "./permission";
import element from "./plugins/element-ui";
import i18n from "@/i18n";
import "datatables.net-dt";
import VCalendar from "v-calendar";
import VueClipboard from "vue-clipboard2";
import "@/assets/bpmn.css";
import "@/assets/pc.css";
import "@/assets/fontawesome-free-6.6.0-web/css/all.css";
import CKEditor from "@ckeditor/ckeditor5-vue2";
import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/xml/xml";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/groovy/groovy";
import "codemirror/addon/hint/anyword-hint";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/javascript-hint";
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/foldcode";
import "codemirror/addon/fold/foldgutter";
import "codemirror/addon/fold/xml-fold";
import "codemirror/addon/fold/indent-fold";
import "codemirror/addon/fold/comment-fold";
import "codemirror/addon/fold/brace-fold";
import "codemirror/addon/lint/lint";
import "codemirror/addon/lint/lint.css";
import "codemirror/addon/lint/json-lint";
import "codemirror/addon/lint/javascript-lint";
import "codemirror/theme/material-ocean.css";
require("script-loader!jsonlint");
window.jQuery=$;

import Print from "vue-print-nb";
Vue.use(Print);

import {Formio} from "vue-formio-eorion";
if (process.env.VUE_APP_ENV === "production"){
  Formio.cdn.setBaseUrl("../static");
}
import { ListFormIOComponent } from "@/formio/list/List";
Formio.Components.addComponent("list", ListFormIOComponent);
import { TimeLineFormIOComponent } from "@/formio/timeline/TimeLine";
Formio.Components.addComponent("timeline", TimeLineFormIOComponent);
import { DataTableFormIOComponent } from "@/formio/dataTable/DataTable";
Formio.Components.addComponent("datatable", DataTableFormIOComponent);
import { BillBoardFormIOComponent } from "@/formio/kanban/BillBoard";
Formio.Components.addComponent("billboard", BillBoardFormIOComponent);
import { DataSourceGroupFormIOComponent } from "@/formio/DataSourceGroup/DataSourceGroup";
Formio.Components.addComponent("dataSourceGroup", DataSourceGroupFormIOComponent);
import { StepperFormIOComponent } from "@/formio/step/Stepper";
Formio.Components.addComponent("stepper", StepperFormIOComponent);

Vue.config.productionTip = false;
Vue.use(CKEditor);
Vue.component("Codemirror", codemirror);
Vue.use(VCalendar, {
  locale: "zh-CN", componentPrefix: "vc",  // Use <vc-calendar /> instead of <v-calendar />
});
VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);
new Vue({
  i18n,
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount("#app");

function execute() {
  var instance = document.getElementsByClassName("detail")[0].children[0].__vue__;
  var fn = instance[arguments[0]];
  fn.apply(instance, Array.prototype.slice.apply(arguments, [1]));
}

window.execute = execute;
