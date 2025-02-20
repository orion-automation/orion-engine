import request from "@/utils/request";
import camundaServiceRequest from "@/api/camunda-service";

export default {

  async getEnhancementOpenVariableInstance(params) {
    return await request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: "open/variable-instance",
      method: "get",
      params
    });
  },

  async getEnhancementOpenTaskById(taskId) {
    return await request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: `open/task/${taskId}`,
      method: "get"
    });
  },

  async postEnhancementOpenSubmitTask(taskId,data) {
    return await request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: `open/task/${taskId}/submit-form`,
      method: "post",
      data
    });
  },

  async getTaskShowVariablesByKeys(tenantId, appKeysIn) {
    let filterIcons = await camundaServiceRequest.getApplications({}, {
      tenant: tenantId,
      type: "ux",
      category: "bpezTaskVarsInList",
      appKeysIn: appKeysIn
    });
    return filterIcons;
  },

  async postResolveTask(id,data) {
    return request({
      url: `task/${id}/resolve`,
      method: "post",
      data
    });
  },

  async putLocalTaskVariable(id,varName,data) {
    return request({
      url: `task/${id}/localVariables/${varName}`,
      method: "put",
      data
    });
  },

  async getLocalTaskVariables(id) {
    return request({
      url: `task/${id}/localVariables`,
      method: "get",
    });
  },

  async putUpdateTask(id, data) {
    return request({
      url: `task/${id}`,
      method: "put",
      data
    });
  },

  async postDelegateTask(id, data) {
    return request({
      url: `task/${id}/delegate`,
      method: "post",
      data
    });
  },

  async postGetTasks(params, data) {
    return request({
      url: "task",
      method: "post",
      params,
      data
    });
  },

  async completeTask(id, data) {
    return request({
      url: `task/${id}/complete`,
      method: "post",
      data: data
    });
  },

  async claimTask(id, userId) {
    return request({
      url: `task/${id}/claim`,
      method: "post",
      data: {
        userId: userId
      }
    });
  },

  async getTaskById(id) {
    return request({
      url: `task/${id}`,
      method: "get",
    });
  },

  async addAssignee(id, data) {
    return request({
      url: `task/${id}/assignee`,
      method: "post",
      data
    });
  },
  async getIdentityLinks(id) {
    return request({
      url: `task/${id}/identity-links`,
      method: "get",
    });
  },
  async addIdentityLink(id, data) {
    return request({
      url: `task/${id}/identity-links`,
      method: "post",
      data
    });
  },
  async delIdentityLink(id, data) {
    return request({
      url: `task/${id}/identity-links/delete`,
      method: "post",
      data
    });
  },


  async postTaskCount(type, params, data) {
    return request({
      url: `${type || ""}/task/count`,
      method: "post",
      params,
      data
    });
  },


  async postTaskList(type, params, data) {
    return request({
      url: `${type || ""}/task`,
      method: "post",
      params,
      data
    });
  },

  async getTasks(type, params) {
    return request({
      url: `${type || ""}/task`,
      method: "get",
      params,
    });
  },



};
