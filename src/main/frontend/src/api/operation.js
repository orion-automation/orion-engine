import request from "@/utils/request";

export default {
  async getInstance(params, data){
    return request({
      url: "history/process-instance",
      method: "post",
      params,
      data
    });
  },
  async getInstanceCount(data){
    return request({
      url: "history/process-instance/count",
      method: "post",
      data
    });
  },
  async deleteInstance(data){
    return request({
      url: "history/process-instance/delete",
      method: "post",
      data
    });
  },
  async deleteInstanceAsync(data){
    return request({
      url: "process-instance/delete",
      method: "post",
      data
    });
  },
  async getDecisionInstanceCount(params) {
    return request({
      url: "/history/decision-instance/count",
      method: "get",
      params
    });
  },
  async getDecisionInstance(params) {
    return request({
      url: "/history/decision-instance",
      method: "get",
      params
    });
  },
  async deleteDecision(data) {
    return request({
      url: "/history/decision-instance/delete",
      method: "post",
      data
    });
  },
  async suspendedAsync(data){
    return request({
      url: "/process-instance/suspended-async",
      method: "post",
      data
    });
  }
};