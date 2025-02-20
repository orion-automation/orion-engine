import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import element from "./plugins/element-ui";
import router from "./router/viewer";
import "@/assets/bpmn.css";
import "@/assets/fontawesome-free-6.6.0-web/css/all.css";
Vue.config.productionTip = false;
import CKEditor from "@ckeditor/ckeditor5-vue2";
import i18n from "@/i18n";
import "@/assets/bpmn.css";
import "@/assets/fontawesome-free-6.6.0-web/css/all.css";

import {Formio} from "vue-formio-eorion";
if (process.env.VUE_APP_ENV === "production"){
  Formio.cdn.setBaseUrl("static");
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

Vue.use(CKEditor);
new Vue({
  i18n,
  vuetify,
  router,
  render: h => h(App)
}).$mount("#app");

