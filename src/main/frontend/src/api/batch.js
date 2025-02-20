import request from "@/utils/request";

export default {
  async getBatchRuntimeList(params) {
    return request({
      url: "batch/statistics",
      method: "get",
      params,
    });
  },
  async getBatchStatistics(params) {
    return request({
      url: "batch/statistics",
      method: "get",
      params,
    });
  },
  async getProfile(id) {
    return request({
      url: "user/" + id + "/profile",
      method: "get"
    });
  },
  async getJob(params) {
    return request({
      url: "job",
      method: "get",
      params
    });
  },
  async suspenedChange(id, data) {
    return request({
      url: "/batch/"+ id +"/suspended",
      method: "put",
      data
    });
  },
  async getHistoryBatch(params){
    return request({
      url: "history/batch",
      method: "get",
      params
    });
  },
  async getHistoryBatchCount(params){
    return request({
      url: "history/batch/count",
      method: "get",
      params
    });
  },
  async getHistoryBatchById(id){
    return request({
      url: "history/batch/" + id,
      method: "get"
    });
  },
  async retrieJob(id) {
    return request({
      url: "job-definition/" + id + "/retries",
      method: "put",
      data: {
        retries: 1,
      },
    });
  },
  async deleteBatch(id, params){
    return request({
      url: "batch/" + id,
      method: "delete",
      params
    });
  },
  async jobRetries(id) {
    return request({
      url: "job/" + id + "/retries",
      method: "put",
      data: {
        retries: 1,
      },
    });
  },
  async getJobLog(params) {
    return request({
      url: "history/job-log",
      method: "get",
      params,
    });
  },
  async getJobLogCount(params) {
    return request({
      url: "history/job-log/count",
      method: "get",
      params,
    });
  },
  async jobDelete(id) {
    return request({
      url: "job/" + id,
      method: "delete",
    });
  },
  async deleteHistoryBatch(id) {
    return request({
      url: "history/batch/" + id,
      method: "delete",
    });
  }
};
