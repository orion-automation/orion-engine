import request from "@/utils/request";
import userRequest from "@/api/user";

export default {

  async getVariableInstanceBinary(history,id) {
    return request({
      responseType: "blob",
      url: `${history?"history/":""}variable-instance/${id}/data`,
      method: "get",
    });
  },

  async queryInstancesNoParamsCount(data) {
    return request({
      url: "process-instance/count",
      method: "post",
      data
    });
  },

  async postExecuteModification(data) {
    return request({
      url: "/modification/execute",
      method: "post",
      data
    });
  },

  async postGetInstanceCount(data) {
    return request({
      url: "process-instance/count",
      method: "post",
      data
    });
  },

  async postGetInstances(params, data) {
    return request({
      url: "process-instance",
      method: "post",
      params,
      data
    });
  },

  async getHistoricDetail(params) {
    return request({
      url: "/history/detail",
      method: "get",
      params
    });
  },

  async addVariable(id, varName, data) {
    return request({
      url: `process-instance/${id}/variables/${varName}`,
      method: "put",
      data
    });
  },
  async deleteVariables(id) {
    return request({
      url: "history/process-instance/" + id + "/variable-instances",
      method: "delete"
    });
  },
  async getVariables(params, data) {
    return request({
      url: "variable-instance",
      method: "post",
      params,
      data
    });
  },
  async getInvolvedUsersByInstanceId(instanceId) {
    let self = this;
    let involvedUsers = [];
    let involvedUserResults = await self.getVariables({ firstResult: 0, maxResults: 1 },
      { processInstanceIdIn: [instanceId], variableName: "eoaiInvolvedUser" });
    if (involvedUserResults && involvedUserResults.length > 0) {
      involvedUsers = await userRequest.getUsers({ idIn: involvedUserResults[0].value });
    }
    return involvedUsers;
  },
  async getVariablesCount(data) {
    return request({
      url: "variable-instance/count",
      method: "post",
      data
    });
  },
  async getHistoryVariables(params, data) {
    return request({
      url: "history/variable-instance",
      method: "post",
      params,
      data
    });
  },
  async getHistoryVariablesCount(data) {
    return request({
      url: "history/variable-instance/count",
      method: "post",
      data
    });
  },
  async getVariableHistories(params) {
    return request({
      url: "history/detail",
      method: "get",
      params: params
    });
  },
  async getUserOperateHistories(params) {
    return request({
      url: "history/user-operation",
      method: "get",
      params: params
    });
  },
  async updateLocalExecutionVariables(id, data) {
    return request({
      url: "execution/" + id + "/localVariables",
      method: "post",
      data
    });
  },
  async putLocalExecutionVariables(id, name, varData) {
    return request({
        url: "execution/" + id + "/localVariables/" + name,
        method: "put",
        data: varData
      }
    );
  },
  async setLocalExecutionVariables(id, name, varData) {
    return request({
        url: `execution/${id}/localVariables/${name}/data`,
        method: "post",
        headers: { "Content-Type": "multipart/form-data" },
        data: varData
      }
    );
  },
  async deleteLocalExecutionVariables(id, name) {
    return request({
      url: "execution/" + id + "/localVariables/" + name,
      method: "delete",
      data: {}
    });
  },
  async deleteHistoryVariableInstance(id) {
    return request({
      url: `history/variable-instance/${id}`,
      method: "delete"
    });
  },
  async getVariableInstance(history, id) {
    return request({
      url: `${history ? "history/" : ""}variable-instance/${id}`,
      method: "get"
    });
  },
  async getInstance(id) {
    return request({
      url: "history/process-instance/" + id,
      method: "get"
    });
  },
  async getActivityInstances(id) {
    return request({
      url: "process-instance/" + id + "/activity-instances",
      method: "get"
    });
  },
  async getHistoryActivityInstances(data, params) {
    return request({
      url: "history/activity-instance",
      method: "post",
      data,
      params
    });
  },
  async getHistoryActivityInstanceById(activityInstanceId) {
    return request({
      url: `history/activity-instance/${activityInstanceId}`,
      method: "get"
    });
  },
  async getHistoryActivityInstanceCount(data) {
    return request({
      url: "history/activity-instance/count",
      method: "post",
      data
    });
  },
  async getHistoryDecisionInstances(id) {
    return request({
      url: "history/decision-instance",
      method: "get",
      params: {
        processInstanceId: id
      }
    });
  },
  async getJobTasks(data) {
    return request({
      url: "task",
      method: "post",
      data: data
    });
  },
  async getHistoryJobTasksWithParams(params, data) {
    return request({
      url: "history/task",
      method: "post",
      params, data
    });
  },
  async getHistoryJobTaskCount(data) {
    return request({
      url: "history/task/count",
      method: "post",
      data
    });
  },
  async getHistoryJobTasks(data) {
    return request({
      url: "history/task",
      method: "post",
      data: data
    });
  },

  async getHistoryTasks(params) {
    return request({
      url: "history/task",
      method: "get",
      params
    });
  },

  async queryInstances(page, pageSize, data) {
    let params = {};
    if (pageSize) {
      params.firstResult = (page - 1) * pageSize;
      params.maxResults = pageSize;
    }
    return request({
      url: "process-instance",
      method: "post",
      params,
      data
    });
  },

  async getHistoryInstances(params) {
    return request({
      url: "history/process-instance",
      method: "get",
      params
    });
  },

  async suspendJob(jobId, data) {
    return request({
      url: "/job/" + jobId + "/suspended",
      method: "put",
      data
    });
  },
  async getInstanceStatistics(id) {
    return request({
      url: `/process-instance/${id}/activity-instances`,
      method: "get"
    });
  },
  async retryJob(jobId, data) {
    return request({
      url: "/job/" + jobId + "/retries",
      method: "put",
      data
    });
  },
  async deleteProcessInstance(type, data) {
    return request({
      url: `/${type ? type + "/" : ""}process-instance/delete`,
      method: "post",
      data
    });
  },
  async postHistoryDetail(data) {
    return request({
      url: "/history/detail",
      method: "post",
      data
    });
  },

  async getHistoryDetail(params) {
    return request({
      url: "/history/detail",
      method: "get",
      params
    });
  },

  async getHistoryDetailFile(id) {
    return request({
      url: `/history/detail/${id}/data`,
      method: "get",
      responseType: "blob"
    });
  },


  async deleteProcessInstanceById(id, params) {
    return request({
      url: `/process-instance/${id}`,
      method: "delete", params
    });
  },
  async deleteHistoryProcessInstanceById(id) {
    return request({
      url: `/history/process-instance/${id}`,
      method: "delete"
    });
  },
  async getHistoryInstancesCount(params) {
    //params = {};
    return request({
      url: "history/process-instance/count",
      method: "get",
      params
    });
  },
  async postHistoryInstancesCount(data) {
    return request({
      url: "history/process-instance/count",
      method: "post",
      data
    });
  },
  async postHistoryInstances(params, data) {
    //data = {};
    return request({
      url: "history/process-instance",
      method: "post",
      params,
      data
    });
  },

  async getVariableInstanceList(params) {
    return request({
      url: "variable-instance",
      method: "get",
      params
    });
  },


  async getComments(id) {
    return request({
      url: `process-instance/${id}/comment`,
      method: "get"
    });
  },
  async postComment(id, data) {
    return request({
      url: `task/${id}/comment/create`,
      method: "post",
      data
    });
  }

};

