import request from "@/utils/request";

export default {
  async sendSignal(data) {
    return request({
      url: "signal",
      method: "post",
      data
    });
  }
};
