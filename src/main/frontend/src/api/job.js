import request from "@/utils/request";

export default {

  async getJobStacktrace(id) {
    return request({
      url: `job/${id}/stacktrace`,
      method: "get",
    });
  },

  async getHistoryJobStacktrace(id) {
    return request({
      url: `history/job-log/${id}/stacktrace`,
      method: "get",
    });
  },

};
