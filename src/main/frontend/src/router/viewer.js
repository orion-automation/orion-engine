import Vue from "vue";
import Router from "vue-router";
import Layout from "@/layout/index.viewer";


Vue.use(Router);

const routes = [{
    path: "/automation/bpmn", component: Layout, name: "bpmn", children: [{
        path: "index/:id", component: () => import("@/components/automation/viewer/Viewer"), name: "bpmn-index"
    }]
}, {
    path: "/automation/dmn", component: Layout, name: "dmn", children: [{
        path: "index/:id", component: () => import("@/components/automation/viewer/dmn/DmnViewer"), name: "dmn-index"
    }]
}];

export default new Router({
    scrollBehavior: () => ({y: 0}), routes
});
