import router from "./router";
import mobileRouter from "./router/mobile";
import store from "./store";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import {getToken, getTenant} from "@/utils/auth";
import i18n from "@/i18n";

let isMobile = location.pathname.indexOf("/mobile.html") >= 0;
let currentRouter = isMobile ? mobileRouter : router;

NProgress.configure({showSpinner: false}); // NProgress Configuration

const whiteList = ["/login", "/license", "/license/index", "/auth-redirect", "/login", "/:processDefId/start/:processDefKey"]; // no redirect whitelist
const whiteListName = ["guest-start-process", "guest-complete-task", "guest-start-process-by-key"]; // no redirect whitelist
currentRouter.beforeEach(async (to, from, next) => {
    // start progress bar
    NProgress.start();

    if (getToken()) {
        if ((isMobile || to.path.includes("/task/") || to.path.includes("/design/")) && !getTenant()){
            // 移动端/任务中心/设计中心，没有tenant的，返回首页
            alert(i18n.tc("linkMenu.noTenant"));
            next({path: "/"});
            NProgress.done();
            return;
        }
        if (to.path === "/login") {
            next({path: "/"});
            NProgress.done();
            return;
        }
        // determine whether the user has obtained his permission roles through getProfile
        const id = store.state.user.profile.id;
        if (id) {
            next();
        } else {
            try {
                // get user info
                // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
                var info = await store.dispatch("user/getProfile");
                var groups = await store.dispatch("user/getGroups");
                let authorization = await store.dispatch("user/getAuthorization");

                // generate accessible routes map based on roles
                // hack method to ensure that addRoutes is complete
                // set the replace: true, so the navigation will not leave a history record
                next({...to, replace: true});
            } catch (error) {
                console.log(error);
                // remove token and go to login page to re-login
                await store.dispatch("user/resetToken");
                next("/login");
                NProgress.done();
            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1 || whiteListName.indexOf(to.name) !== -1) {
            // in the free login whitelist, go directly
            next();
        } else {
            next("/login");
            NProgress.done();
        }
    }
});

currentRouter.afterEach(() => {
    // finish progress bar
    NProgress.done();
});
