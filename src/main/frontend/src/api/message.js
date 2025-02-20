import request from "@/utils/request";

export default {
  async correlateMessage(data) {
    return request({
      url: "message",
      method: "post",
      data
    });
  }
};
