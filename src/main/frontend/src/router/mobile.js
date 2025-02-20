import Vue from "vue";
import Router from "vue-router";
import Layout from "@/layout/mobile";

const vuePush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return vuePush.call(this, location).catch(err => err);
};
Vue.use(Router);

const routes = [{
    path: "/login", component: () => import("@/components/login/mobile"), name: "login",
}, {
    path: "/", component: Layout, redirect: "/index", name: "index", children: [{
        path: "index", component: () => import("@/components/task/mobile/index/Index"), name: "index-list"
    }]
},  {
    path: "/search", component: Layout, redirect: "/search/index", name: "search", children: [{
        path: "index", component: () => import("@/components/task/mobile/search/index"), name: "search-index", meta: {
            keepAlive: true
        }
    }]
}, {
    path: "/data", component: Layout, redirect: "/data/index", name: "data", children: [{
        path: "index", component: () => import("@/components/task/mobile/data/index"), name: "data-index"
    }]
}, {
    path: "/delegate", component: Layout, redirect: "/delegate/index", name: "delegate", children: [{
        path: "index", component: () => import("@/components/task/mobile/delegate/index"), name: "delegate-index"
    }, {
        path: "execute", component: () => import("@/components/task/mobile/delegate/execute"), name: "delegate-execute"
    }]
}, {
    path: "/task", component: Layout, redirect: "/task/list", name: "task", children: [{
        path: "list", component: () => import("@/components/task/mobile/task/List"), name: "task-list"
    }, {
        path: "detail/:id", component: () => import("@/components/task/mobile/task/Detail"), name: "task-detail"
    }]
}, {
    path: "/application", component: Layout, redirect: "/application/list", name: "application", children: [{
        path: "list", component: () => import("@/components/task/mobile/application/List"), name: "application-list"
    }, {
        path: "detail/:key",
        component: () => import("@/components/task/mobile/application/Detail"),
        name: "application-detail"
    }, {
        path: "report",
        component: () => import("@/components/task/mobile/application/Report"),
        name: "application-report"
    }, {
        path: "instance/:id",
        component: () => import("@/components/task/mobile/application/InstanceDetail"),
        name: "application-instance"
    }, {
        path: "create/:key",
        component: () => import("@/components/task/mobile/application/InstanceCreate"),
        name: "application-create"
    }]
}];

export default new Router({
    // mode: "history",
    scrollBehavior: () => ({y: 0}), routes
});
