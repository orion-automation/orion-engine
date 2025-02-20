import request from "@/utils/request";

export default {

    async getGroupsWithParams(params) {
        return request({
            url: "group",
            method: "get",
            params
        });
    },

    async getUserSetting(params) {
        return request({
            baseURL: process.env.VUE_APP_ENHANCEMENT_API, url: "user-setting", method: "get", params
        });
    },
    async postUserSetting(data) {
        return request({
            baseURL: process.env.VUE_APP_ENHANCEMENT_API, url: "user-setting", method: "post", data
        });
    },

    async getMemberGroups(member) {
        return request({
            url: "group",
            method: "get",
            params: {
                member,
                type: "dpacoe"
            }
        });
    },

    async getMemberTenants(member) {
        return request({
            url: "tenant",
            method: "get",
            params: {
                userMember: member
            }
        });
    },

    async getUserPreference(userId) {
        return request({
            baseURL: process.env.VUE_APP_ENHANCEMENT_API,
            url: "user/settings", method: "get", params: {
                userId
            }
        });
    },

    async getTenantListByUser(params) {
        return request({
            url: "tenant", method: "get", params
        });
    },

    async getAuthorizationCheck(params) {
        return request({
            url: "authorization/check", method: "get", params
        });
    },

    async getEnhancementUsers(params) {
        return request({
            baseURL: process.env.VUE_APP_ENHANCEMENT_API, url: "user", method: "get", params
        });
    },
    async getAuthorizationCount(params) {
        return request({
            url: "authorization/count", method: "get", params: params,
        });
    },
    async postCreateAuthorization(data) {
        return request({
            url: "authorization/create", method: "post", data
        });
    },
    async putUpdateAuthorization(id, data) {
        return request({
            url: `authorization/${id}`, method: "put", data
        });
    },
    async delAuthorization(id) {
        return request({
            url: `authorization/${id}`, method: "DELETE"
        });
    },
    async postUnlockUser(userId) {
        return request({
            url: `user/${userId}/unlock`, method: "POST"
        });
    }, async deleteUser(userId) {
        return request({
            url: `user/${userId}`, method: "DELETE"
        });
    }, async putUpdateUserCredentials(userId, data) {
        return request({
            url: `user/${userId}/credentials`, method: "PUT", data
        });
    }, async postCreateUser(data) {
        return request({
            url: "user/create", method: "post", data
        });
    }, async getUsers(params) {
        return request({
            url: "user", method: "get", params
        });
    }, async getUserCount(params) {
        return request({
            url: "user/count", method: "get", params
        });
    }, async getAuthorization(params) {
        return request({
            url: "authorization", method: "get", params: params,
        });
    }, async logout() {
        return new Promise((resolve, reject) => {
            resolve();
        });
    },

    async getTenantList(params) {
        return request({
            url: "tenant", method: "get", params
        });
    },

    async getTenantCount(params) {
        return request({
            url: "tenant/count", method: "get", params
        });
    },

    async setUserPreference(data) {
        return request({
            baseURL: process.env.VUE_APP_ENHANCEMENT_API, url: "user/settings", method: "post", data: data,
        });
    },

    async login(data) {
        return request({
            url: "identity/verify", /// identity/verify
            method: "post", data
        });
    },

    async loginJWT(data) {
        return request({
            baseURL: process.env.VUE_APP_ROOT_BASE_API, url: "auth", /// identity/verify
            method: "post", data
        });
    },

    async license() {
        return request({
            baseURL: process.env.VUE_APP_ROOT_BASE_API, url: "license", /// identity/verify
            method: "get"
        });
    },

    async postLicense(data) {
        return request({
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            }, baseURL: process.env.VUE_APP_ROOT_BASE_API, url: "license", /// identity/verify
            method: "post", data
        });
    },

    async getProfile(userId) {
        return request({
            url: `user/${userId}/profile`, /// identity/verify
            method: "get"
        });
    },
    async putProfile(userId, data) {
        return request({
            url: `user/${userId}/profile`, /// identity/verify
            method: "put", data
        });
    },

    async getGroups(userId) {
        return request({
            url: "identity/groups", method: "get", params: {
                userId
            }
        });
    }, async getGroupList(params) {
        return request({
            url: "/group", method: "get", params
        });
    }, async getGroupCount(params) {
        return request({
            url: "/group/count", method: "get", params
        });
    },
};


