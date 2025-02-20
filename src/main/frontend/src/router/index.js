import Vue from "vue";
import Router from "vue-router";
import Layout from "@/layout";

const vuePush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return vuePush.call(this, location).catch(err => err);
};
Vue.use(Router);

const routes = [{
    path: "/login", component: () => import("@/components/login/index"), name: "login",
}, {
    path: "/", component: () => import("@/components/home/index"), name: "home",
}, {
    path: "/admin/user", component: Layout, redirect: "admin/user/list", name: "user", children: [{
        path: "list", component: () => import("@/components/admin/user/list"), name: "user-list-detail"
    }, {
        path: "detail/:id", component: () => import("@/components/admin/user/detail"), name: "user-detail"
    },]
}, {
    path: "/admin/authorization",
    component: Layout,
    redirect: "/admin/authorization/detail",
    name: "authorization",
    children: [{
        path: "detail", component: () => import("@/components/admin/authorization/detail"), name: "authorization-detail"
    },]
}, {
    path: "/admin/group", component: Layout, redirect: "/admin/group/list", name: "group", children: [{
        path: "list", component: () => import("@/components/admin/group/list"), name: "group-list-detail"
    }, {
        path: "detail/:id", component: () => import("@/components/admin/group/detail"), name: "group-detail"
    },]
}, {
    path: "/admin/tenant", component: Layout, redirect: "/admin/tenant/list", name: "tenant", children: [{
        path: "list", component: () => import("@/components/admin/tenant/list"), name: "tenant-list-detail"
    }, {
        path: "detail/:id", component: () => import("@/components/admin/tenant/detail"), name: "tenant-detail"
    },]
}, {
    path: "/admin/setting", component: Layout, redirect: "/admin/setting/index", name: "setting", children: [{
        path: "index", component: () => import("@/components/admin/setting/index"), name: "setting-index-detail"
    }]
}, {
    path: "/admin/license", component: Layout, redirect: "/admin/license/index", name: "license", children: [{
        path: "index", component: () => import("@/components/admin/license/index"), name: "license-detail"
    }]
}, {
    path: "/automation/process", component: Layout, redirect: "/automation/process/list", name: "process", children: [{
        path: "list",
        component: () => import("@/components/automation/process/ProcessList"),
        name: "process-list-detail"
    }, {
        path: "detail/:id",
        component: () => import("@/components/automation/process/ProcessDetail"),
        name: "process-detail"
    }, {
        path: "instance/:id",
        component: () => import("@/components/automation/process/InstanceDetail"),
        name: "instance-detail"
    }, {
        path: "incident/:id",
        component: () => import("@/components/automation/process/IncidentDetail"),
        name: "incident-detail"
    }]
}, {
    path: "/automation/decision",
    component: Layout,
    redirect: "/automation/decision/list",
    name: "decision",
    children: [{
        path: "list",
        component: () => import("@/components/automation/decision/DecisionList"),
        name: "decision-list-detail"
    }, {
        path: "detail/:id",
        component: () => import("@/components/automation/decision/DecisionDefinitionDetail"),
        name: "decision-definition-detail"
    }, {
        path: "instance/:id",
        component: () => import("@/components/automation/decision/DecisionInstanceDetail"),
        name: "decision-instance-detail"
    }, {
        path: "definition/:id",
        component: () => import("@/components/automation/decision/DecisionRequirementDefinition"),
        name: "requirement-definition-detail"
    }, {
        path: "requirement/:id",
        component: () => import("@/components/automation/decision/DecisionRequirementInstance"),
        name: "requirement-instance-detail"
    }],
}, {
    path: "/automation/batch", component: Layout, redirect: "/automation/batch/index", name: "batch", children: [{
        path: "index", component: () => import("@/components/automation/batch/index"), name: "batch-index-detail"
    }, {
        path: "operation",
        component: () => import("@/components/automation/batch/Operation"),
        name: "batch-operation-detail"
    }],
}, {
    path: "/automation/deploy", component: Layout, redirect: "/automation/deploy/index", name: "deploy", children: [{
        path: "index", component: () => import("@/components/automation/deploy/index"), name: "deploy-index-detail"
    }]
}, {
    path: "/automation/process-instance/:id", redirect: "/automation/process/instance/:id"
}, {
    path: "/automation/", component: Layout, redirect: "/automation/process"
},
    {
        path: "/design/", component: Layout, redirect: "/design/collaboration"
    },
    {
        path: "/design/collaboration",
        component: Layout,
        redirect: "/design/collaboration/list",
        name: "collaboration",
        children: [
            {
                path: "list",
                component: () => import("@/components/design/collaboration/CollaborationList"),
                name: "collaboration-list"
            },
            {
                path: "detail/:id",
                component: () => import("@/components/design/collaboration/CollaborationDetail"),
                name: "collaboration-detail"
            },
            {
                path: "resource/detail/:id",
                component: () => import("@/components/design/collaboration/CommonModeler"),
                name: "collaboration-resource-detail"
            },
            {
                path: "modeler/:id",
                component: () => import("@/components/design/collaboration/Modeler"),
                name: "modeler-detail"
            },
            {
                path: "dmn-modeler/:id",
                component: () => import("@/components/design/collaboration/DmnModeler"),
                name: "dmn-modeler-detail"
            }]
    },
    {
        path: "/design/application",
        component: Layout,
        redirect: "/design/application/list",
        name: "application",
        children: [
            {
                path: "list",
                component: () => import("@/components/design/application/ApplicationProjectList"),
                name: "application-list"
            },
            {
                path: "detail/:id",
                component: () => import("@/components/design/application/ApplicationProjectDetail"),
                name: "application-detail"
            },
            {
                path: "resource/detail/:id",
                component: () => import("@/components/design/application/ApplicationDetail"),
                name: "application-resource-detail"
            }]
    },
    {
        path: "/design/knowledge",
        component: Layout,
        redirect: "/design/knowledge/list",
        name: "knowledge",
        children: [
            {
                path: "list",
                component: () => import("@/components/design/knowledge/KnowledgeList"),
                name: "knowledge-list"
            },
            {
                path: "detail/:id",
                component: () => import("@/components/design/knowledge/KnowledgeDetail"),
                name: "knowledge-detail"
            },
            {
                path: "modeler/:id",
                component: () => import("@/components/design/knowledge/Modeler"),
                name: "knowledge-modeler-detail"
            },
            {
                path: "dmn-modeler/:id",
                component: () => import("@/components/design/knowledge/DmnModeler"),
                name: "knowledge-dmn-modeler-detail"
            }]
    },
    {
        path: "/design/form-preview/:id",
        component: () => import("@/components/design/page/FormRender"),
        name: "form-preview"
    }, {
        path: "/task/", component: Layout, redirect: "/task/home"
    }, {
        path: "/task/home", component: Layout, redirect: "/task/home/index", name: "task-home", children: [{
            path: "index", component: () => import("@/components/task/home/index"), name: "home-detail"
        }]
    }, {
        path: "/task/x", component: Layout, redirect: "/task/x/index", name: "x", children: [{
            path: "index", component: () => import("@/components/task/x/index"), name: "x-detail"
        }, {
            path: "app/:id", component: () => import("@/components/task/x/Detail"), name: "x-app-detail"
        },]
    }, {
        path: "/task/task", component: Layout, redirect: "/task/task/list", name: "task", children: [{
            path: "list", component: () => import("@/components/task/task/list"), name: "task-list"
        }]
    }, {
        path: "/task/application",
        component: Layout,
        redirect: "/task/application/list",
        name: "task-application",
        children: [{
            path: "list", component: () => import("@/components/task/application/List"), name: "task-application-list"
        }, {
            path: "detail/:id",
            component: () => import("@/components/task/application/Detail"),
            name: "task-application-detail"
        }, {
            path: "create/:key",
            component: () => import("@/components/task/application/InstanceCreate"),
            name: "application-create"
        }]
    }, {
        path: "/task/data", component: Layout, redirect: "/task/data/list", name: "data", children: [{
            path: "list", component: () => import("@/components/task/data/list"), name: "data-list"
        }, {
            path: "resource", component: () => import("@/components/task/data/resource"), name: "data-resource-list"
        }]
    }, {
        path: "/task/:processDefId/start/:processDefKey",
        name: "guest-start-process",
        component: () => import("@/components/task/guest/index")
    }, {
        path: "/task/:processDefKey/start",
        name: "guest-start-process-by-key",
        component: () => import("@/components/task/guest/processByKey")
    }, {
        path: "/task/:taskId/complete",
        name: "guest-complete-task",
        component: () => import("@/components/task/guest/task")
    }];

export default new Router({
    // mode: "history",
    scrollBehavior: () => ({y: 0}), routes
});
