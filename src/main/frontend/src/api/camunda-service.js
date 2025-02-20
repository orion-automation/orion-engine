import request from "@/utils/request";

export default {

  async getDrafts(params, data) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: "/draft/list",
      method: "post",
      data,
      params
    });
  },

  async postDraft(data) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: "draft",
      method: "post",
      data
    });
  },

  async putDraft(data) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: `draft/${data.id}`,
      method: "put",
      data
    });
  },

  async deleteDraft(id) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: `draft/${id}`,
      method: "delete",
    });
  },

  async getApplicationCount(data) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: "application/count",
      method: "post",
      data
    });
  },

  async getDelegations(params) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: "delegation",
      params
    });
  },

  async getGranted(params) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: "delegation/granted",
      params
    });
  },

  async postDelegation(data) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: "delegation",
      method: "post",
      data
    });
  },


  async putDelegation(data) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: `delegation/${data.id}`,
      method: "put",
      data
    });
  },

  async deleteDelegation(id) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: `delegation/${id}`,
      method: "delete",
    });
  },

  async getPda(params) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: "pda-application",
      params
    });
  },

  async getReportFormKey(params) {
    return request({
      baseURL: process.env.VUE_APP_CAMUNDA_SERVICE_API,
      url: "reportFormKey/list",
      method: "get",
      params: params
    });
  },

  async deploy(data) {
    const param = new FormData();
    param.append("deploymentName", data.deploymentName);
    param.append("bpmn", data.bpmn);
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: "process/deploy",
      headers: {
        "Content-Type": "multipart/form-data"
      },
      method: "post",
      data: param
    });
  },
  async getProjects(params) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: "collaboration/project/list",
      params
    });
  },
  async getProject(id) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: `collaboration/project/${id}`,
    });
  },
  async createProject(data) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: "collaboration/project",
      method: "post",
      data
    });
  },

  async updateProject(data) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: `collaboration/project/${data.id}`,
      method: "put",
      data
    });
  },

  async deleteProject(id) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: `collaboration/project/${id}`,
      method: "delete"
    });
  },

  async getMembers(id) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: `collaboration/member/list/${id}`,
    });
  },

  async saveMember(data) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: "collaboration/member",
      method: "post",
      data
    });
  },


  async deleteMember(data) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: "collaboration/member",
      method: "delete",
      data
    });
  },

  async getResources(params) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: "collaboration/resource/list",
      params
    });
  },

  async searchResources(params) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: "collaboration/resource",
      params
    });
  },


  async getResource(id, isPublic) {
    return request({
      baseURL: isPublic?process.env.VUE_APP_PUBLIC_ENHANCEMENT_API:process.env.VUE_APP_ENHANCEMENT_API,
      url: `collaboration/resource/${id}`,
    });
  },

  async createResource(data) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: "collaboration/resource",
      method: "post",
      data
    });
  },


  async updateResource(data) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: `collaboration/resource/${data.id}`,
      method: "put",
      data
    });
  },


  async deleteResource(id) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: `collaboration/resource/${id}`,
      method: "delete"
    });
  },


  async upload(file) {
    let data = new FormData();
    data.append("file", file);
    data.append("name", file.name);
    return request({
      url: `${process.env.VUE_APP_UPLOAD_API}upload`,
      data,
      headers: { "Content-Type": "multipart/form-data", },
      method: "post"
    });
  },

  async download(path) {
    return request.get(`${process.env.VUE_APP_UPLOAD_API}download${path}`, { responseType: "blob" });
  },

  async getApplications(params, data) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: "application/list",
      method: "post",
      data,
      params
    });
  },

  async getApplication(id) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: `application/${id}`,
    });
  },
  async createApplication(data) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: "application",
      method: "post",
      data
    });
  },

  async updateApplication(data) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: `application/${data.id}`,
      method: "put",
      data
    });
  },

  async deleteApplication(id) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: `application/${id}`,
      method: "delete"
    });
  },

  async updateApplicationStatus(id, status) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: `application/${id}/${status ? "publish" : "off"}`,
      method: "post",
    });
  },

};
