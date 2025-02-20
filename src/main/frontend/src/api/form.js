import axios from "axios";
import request from "@/utils/request";

export default {

  async postForm(data) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API, url: "/form", data, method: "post"
    });
  },

  async putForm(id, data) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API, url: `/form/${id}`, data, method: "put"
    });
  },

  async deleteForm(id) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API, url: `/form/${id}`, method: "delete"
    });
  },

  async getFormDetail(id) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API, url: `/form/${id}`, method: "get"
    });
  },

  async getItem(type, id) {
    var url = process.env.VUE_APP_MONGO_API + type;
    return axios.get(url + "/" + id);
  },

  async getCount(type, data) {
    var url = process.env.VUE_APP_MONGO_API + type + "/_size";
    return new Promise((resolve, reject) => {
      data = data || {};
      data.filter = data.filter || {};
      data.filter.type = type;
      data.filter = JSON.stringify(data.filter);

      var settings = {
        dataType: "json",
        url: url,
        method: "get",
        params: data
      };
      return axios(settings).then(response => {
        resolve(response.data._size);
      });
    });
  },

  async getList(table, data) {
    var url = process.env.VUE_APP_MONGO_API + table;
    return new Promise((resolve, reject) => {
      data = data || {};
      data.filter = data.filter || {};
      data.filter = JSON.stringify(data.filter);

      if (data.sort) {
        data.sort = JSON.stringify(data.sort);
      }

      var settings = {
        dataType: "json",
        url: url,
        method: "get",
        params: data
      };
      return axios(settings).then(response => {
        resolve(response.data);
      });
    });
  },
};
