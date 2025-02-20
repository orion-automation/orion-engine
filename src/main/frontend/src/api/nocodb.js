import request from "@/utils/request";

export default {
  async getProjects(token) {
    return request({
      baseURL: process.env.VUE_APP_NOCODB_API,
      url: "api/v1/db/meta/projects",
      headers: { "xc-token": token || process.env.VUE_APP_NOCODB_TOKEN },
      method: "get",
    });

  },
  async getTables(id, token) {
    return request({
      baseURL: process.env.VUE_APP_NOCODB_API,
      url: `api/v1/db/meta/projects/${id}/tables?includeM2M=false`,
      headers: { "xc-token": token || process.env.VUE_APP_NOCODB_TOKEN },
      method: "get",
    });

  },

  async getTable(id, token) {
    return request({
      baseURL: process.env.VUE_APP_NOCODB_API,
      url: `api/v1/db/meta/tables/${id}`,
      headers: { "xc-token": token || process.env.VUE_APP_NOCODB_TOKEN },
      method: "get",
    });
  },

  async getAPIs(id, token) {
    return request({
      baseURL: process.env.VUE_APP_NOCODB_API,
      url: `api/v1/db/meta/projects/${id}/swagger.json`,
      headers: { "xc-token": token || process.env.VUE_APP_NOCODB_TOKEN },
      method: "get",
    });

  },

};