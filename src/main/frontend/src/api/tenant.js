import request from "@/utils/request";

export default {
    async deleteTenantUserMembership(tenantId, userId) {
        return request({
            url: `tenant/${tenantId}/user-members/${userId}`, method: "DELETE"
        });
    },
    async createTenantGroupMembership(tenantId, groupId) {
        return request({
            url: `tenant/${tenantId}/group-members/${groupId}`, method: "PUT"
        });
    },
    async postCreateTenant(data) {
        return request({
            url: "tenant/create", method: "POST", data
        });
    },
    async getTenant(id) {
        return request({
            url: `tenant/${id}`, method: "GET"
        });
    },
    async DeleteTenant(id) {
        return request({
            url: `tenant/${id}`, method: "DELETE"
        });
    },
    async putUpdateTenant(id, data) {
        return request({
            url: `tenant/${id}`, method: "PUT", data
        });
    },
    async deleteTenantGroupMembership(tenantId, groupId) {
        return request({
            url: `tenant/${tenantId}/group-members/${groupId}`, method: "DELETE"
        });
    },
    async putCreateTenantUserMembership(tenantId, userId) {
        return request({
            url: `tenant/${tenantId}/user-members/${userId}`, method: "PUT"
        });
    },
    async getTenantCount(params) {
        return request({
            url: "tenant/count", method: "get", params
        });
    },
    async getTenantList(params) {
        return request({
            url: "/tenant", method: "get", params
        });
    },
};


