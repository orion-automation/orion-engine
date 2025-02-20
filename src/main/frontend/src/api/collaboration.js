import request from "@/utils/request";

export default {

    async getResourceList(params) {
        return request({
            baseURL: process.env.VUE_APP_ENHANCEMENT_API,
            url: "/collaboration/resource/list",
            params
        });
    },

    async getResourceStatistics(params) {
        return request({
            baseURL: process.env.VUE_APP_ENHANCEMENT_API,
            url: "/collaboration/resource/statistics",
            params
        });
    },

    async getAllVersionDetail(resourceId) {
        return request({
            baseURL: process.env.VUE_APP_ENHANCEMENT_API,
            url: `/collaboration/resource/${resourceId}/detail`,
        });
    },

    // 更新某一版本xml信息
    async putVersionDetail(id,data) {
        return request({
            baseURL: process.env.VUE_APP_ENHANCEMENT_API,
            url: `/collaboration/resource/detail/${id}`,
            method: "put",data
        });
    },

    // 添加版本xml
    async postVersionDetail(resourceId,data) {
        return request({
            baseURL: process.env.VUE_APP_ENHANCEMENT_API,
            url: `/collaboration/resource/${resourceId}/detail`,
            method: "post",data
        });
    },

    // 获取某一版本详情
    async getVersionDetail(resourceDetailId) {
        return request({
            baseURL: process.env.VUE_APP_ENHANCEMENT_API,
            url: `/collaboration/resource/detail/${resourceDetailId}`,
            method: "get"
        });
    },

    // 获取resource详情
    async getNoAuthResourceDetail(resourceId) {
        return request({
            baseURL: process.env.VUE_APP_PUBLIC_ENHANCEMENT_API,
            url: `/collaboration/resource/${resourceId}`,
            method: "get"
        });
    },

    // 获取某一版本详情
    async getNoAuthVersionDetail(resourceDetailId,data) {
        return request({
            baseURL: process.env.VUE_APP_PUBLIC_ENHANCEMENT_API,
            url: `/collaboration/resource/detail/${resourceDetailId}`,
            method: "post",data
        });
    },

    async postVersionDetailPassword(resourceDetailId,data) {
        return request({
            baseURL: process.env.VUE_APP_ENHANCEMENT_API,
            url: `/collaboration/resource/detail/${resourceDetailId}`,
            method: "POST",data
        });
    },

    async delVersionDetail(resourceDetailId) {
        return request({
            baseURL: process.env.VUE_APP_ENHANCEMENT_API,
            url: `/collaboration/resource/detail/${resourceDetailId}`,
            method: "DELETE"
        });
    },

    // 添加关联/附件
    async postResourceAssociation(resourceId,data) {
        return request({
            baseURL: process.env.VUE_APP_ENHANCEMENT_API,
            url: `/collaboration/resource/${resourceId}/association`,
            method: "POST",data
        });
    },

    // 更新关联/附件
    async putResourceAssociation(associationId,data) {
        return request({
            baseURL: process.env.VUE_APP_ENHANCEMENT_API,
            url: `/collaboration/resource/association/${associationId}`,
            method: "PUT",data
        });
    },

    // 获取关联/附件列表
    async getResourceAssociationList(resourceId,params) {
        return request({
            baseURL: process.env.VUE_APP_ENHANCEMENT_API,
            url: `/collaboration/resource/${resourceId}/association`,
            method: "GET",params
        });
    },

    // 删除关联/附件
    async deleteResourceAssociation(associationId) {
        return request({
            baseURL: process.env.VUE_APP_ENHANCEMENT_API,
            url: `/collaboration/resource/association/${associationId}`,
            method: "DELETE"
        });
    },

    // 添加消息
    async postVersionMessage(versionId,data) {
        return request({
            baseURL: process.env.VUE_APP_ENHANCEMENT_API,
            url: `/collaboration/resource/detail/${versionId}/message`,
            method: "POST",data
        });
    },

    // 更新消息
    async putVersionMessage(messageId,data) {
        return request({
            baseURL: process.env.VUE_APP_ENHANCEMENT_API,
            url: `/collaboration/resource/detail/message/${messageId}`,
            method: "PUT",data
        });
    },

    // 获取关联/附件列表
    async getVersionMessageList(versionId,params) {
        return request({
            baseURL: process.env.VUE_APP_ENHANCEMENT_API,
            url: `/collaboration/resource/detail/${versionId}/message`,
            method: "GET",params
        });
    },

    // 删除关联/附件
    async deleteVersionMessage(messageId) {
        return request({
            baseURL: process.env.VUE_APP_ENHANCEMENT_API,
            url: `/collaboration/resource/detail/message/${messageId}`,
            method: "DELETE"
        });
    },
};
