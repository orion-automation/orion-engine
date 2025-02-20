import request from "@/utils/request";

export default {
    async deleteGroupMember(groupId, userId) {
        return request({
            url: `group/${groupId}/members/${userId}`, method: "DELETE"
        });
    }, async putCreateGroupMember(groupId, userId) {
        return request({
            url: `group/${groupId}/members/${userId}`, method: "PUT"
        });
    }, async getGroupCount(params) {
        return request({
            url: "group/count", method: "get", params
        });
    }, async getGroupList(params) {
        return request({
            url: "group", method: "get", params
        });
    }, async postCreateGroup(data) {
        return request({
            url: "group/create", method: "POST", data
        });
    },
    async putUpdateGroup(id, data) {
        return request({
            url: `group/${id}`, method: "PUT", data
        });
    },
    async DeleteGroup(id) {
        return request({
            url: `group/${id}`, method: "DELETE"
        });
    },
    async getGroup(id) {
        return request({
            url: `group/${id}`, method: "GET"
        });
    },
    async getUser(params) {
        return request({
            url: "user",
            method: "get",
            params
        });
    },
    async postGroups(params, data) {
        return request({
            url: "group", method: "post", data, params
        });
    }
};


