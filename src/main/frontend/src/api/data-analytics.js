import request from "@/utils/request";

let baseUrl = process.env.VUE_APP_DATA_ANALYTICS_API;

export default {

    async postProcessInstanceMonthUsage(data) {
        return request({
            baseURL: baseUrl, url: "process-instance/month-usage", method: "post", data
        });
    },

    async postProcessInstanceDuration(data) {
        return request({
            baseURL: baseUrl, url: "process-instance/duration", method: "post", data
        });
    },

    async postProcessInstanceAutomationRate(data) {
        return request({
            baseURL: baseUrl, url: "process-instance/automation-rate", method: "post", data
        });
    },

    async postProcessInstanceNoIncidentRate(data) {
        return request({
            baseURL: baseUrl, url: "process-instance/no-incident-rate", method: "post", data
        });
    },

    async postProcessInstanceLongRunning(params,data) {
        return request({
            baseURL: baseUrl, url: "process-instance/long-running", method: "post", params,data
        });
    },

    async postProcessInstanceTimeKpi(data) {
        return request({
            baseURL: baseUrl, url: "process-instance/time-kpi", method: "post", data
        });
    },

    async postTaskInstanceActiveBottlenecks(params, data) {
        return request({
            baseURL: baseUrl, url: "task-instance/active-bottlenecks", method: "post", params, data
        });
    },

    async postProcessDefinitionActivityAvgDuration(params, data) {
        return request({
            baseURL: baseUrl, url: "process-definition/activity-avg-duration", method: "post", params, data
        });
    },

    async postActivityInstanceAvgDuration(params, data) {
        return request({
            baseURL: baseUrl, url: "activity-instance/average-duration", method: "post", params, data
        });
    },

    async postActivityInstanceBranchAnalysis(params, data) {
        return request({
            baseURL: baseUrl, url: "activity-instance/branch-analysis", method: "post", params, data
        });
    },

    async postActivityInstanceBranchStatistics(params, data) {
        return request({
            baseURL: baseUrl, url: "activity-instance/branch-statistics", method: "post", params, data
        });
    },

    // kpi
    async postProcessDefUserTaskDurationCountByUser(params, data) {
        return request({
            baseURL: baseUrl, url: "process-definition/user-task-duration-count-by-user", method: "post", params, data
        });
    },

    async postProcessDefUserTaskAvgDurationByTime(params, data) {
        return request({
            baseURL: baseUrl, url: "process-definition/user-task-avg-duration-by-time", method: "post", params, data
        });
    },

    async getFlowNodeOutliers(params) {
        return request({
            baseURL: baseUrl, url: "flowNodeOutliers", method: "get", params
        });
    },

    async getDurationChart(params) {
        return request({
            baseURL: baseUrl, url: "durationChart", method: "get", params
        });
    },

    async getSignificantOutlierVariableTerms(params) {
        return request({
            baseURL: baseUrl, url: "significantOutlierVariableTerms", method: "get", params
        });
    },
};
