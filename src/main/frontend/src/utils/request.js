import axios from "axios";
import store from "@/store";
import router from "@/router/index";
import {getToken, getBasicToken, getExtraToken} from "@/utils/auth";
import qs from "qs";
import mobileRouter from "@/router/mobile";
import i18n from "@/i18n/index";

// create an axios instance
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    paramsSerializer: (params) => qs.stringify(params, {arrayFormat: "brackets"}), // withCredentials: true, // send cookies when cross-domain requests
    timeout: 50000 // request timeout
});

// request interceptor
service.interceptors.request.use(config => {
    if (store.getters.token) {
        config.headers["X-Token"] = getToken();
    }
    config.headers["Authorization"] = process.env.VUE_APP_AUTH_TYPE === "JWT" ? "Bearer" + getExtraToken() : getBasicToken();
    return config;
}, error => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
});

// response interceptor
service.interceptors.response.use(/**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */response => {
        const res = response.data;
        // if the custom code is not 20000, it is judged as an error.
        if (response.status !== 200 && response.status !== 204 && res.code !== 20000) {
            // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
            if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
                store.dispatch("user/resetToken").then(() => {
                    // location.reload();
                    // 重新登录

                });
            }
            return Promise.reject(new Error(res.message || "Error"));
        } else {
            return res;
        }
    }, error => {
        if (error && error.response && error.response.status === 401) {
            if (error.response.config.url !== "identity/verify") {
                store.dispatch("user/resetToken").then(() => {
                    // 重新登录
                    let currentRouter = location.pathname.indexOf("/mobile.html") >= 0 ? mobileRouter : router;
                    currentRouter.replace("/login");
                });
            }
        }
        return Promise.reject(error);
    });

export default service;
