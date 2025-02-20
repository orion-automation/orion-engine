import request from "@/utils/request";

export default {
    async createDeployment(data){
        return request({
            url: "deployment/create",
            method: "post",
            headers: { "Content-Type": "multipart/form-data" },
            data:data
        });
    },

    async getDecisionRequirementsDefinitionByKey(key) {
        return request({
            url: `decision-requirements-definition/key/${key}`,
            method: "get",
        });
    },

    async getDecisionDefinitionByKey(key){
        return request({
            url: `decision-definition/key/${key}`,
            method: "get"
        });
    },

    async getDecisionDefinitionList(params){
        return request({
            url: "decision-definition",
            method: "get",
            params
          });
    },
    async getDecisionDefinitionCount(params){
        return request({
            url: "decision-definition/count",
            method: "get",
            params
          });
    },
    async getDecisionRequirementsDefinitionList(params) {
        return request({
            url: "decision-requirements-definition",
            method: "get",
            params
          });
    },
    async getDecisionRequirementsDefinitionCount(params) {
        return request({
            url: "decision-requirements-definition/count",
            method: "get",
            params
          });
    },
    async getDecisionDefinition(id) {
        return request({
            url: "decision-definition/" + id,
            method: "get",
        });
    },
    async getDecisionXml(id) {
        return request({
            url: "decision-definition/" + id + "/xml",
            method: "get"
        });
    },
    async getDecisionVersions(key) {
        return request({
            url: "decision-definition",
            method: "get",
            params: {
              key
            }
        });
    },
    async getDecisionInstanceList(params) {
        return request({
            url: "history/decision-instance",
            method: "get",
            params,
        });
    },
    async getDecisionInstanceCount(params) {
        return request({
            url: "history/decision-instance/count",
            method: "get",
            params,
        });
    },
    async getDecisionInstance(id, params) {
        return request({
            url: "history/decision-instance/" + id,
            method: "get",
            params,
        });
    },
    async getRequirementDefinition(id) {
        return request({
            url: "decision-requirements-definition/" + id,
            method: "get",
        });
    },
    async getRequirementDefinitionXML(id) {
        return request({
            url: `decision-requirements-definition/${id}/xml`,
            method: "get",
        });
    },
    async getRequirementVersions(key) {
        return request({
            url: "decision-requirements-definition",
            method: "get",
            params: {
              key
            }
        });
    },
    async getDeploymentResources(id){
        return request({
            url: "deployment/" + id + "/resources",
            method: "get",
        });
    },
    async deploymentData(id, resourceId) {
        return request({
            responseType: "blob",
            url: "deployment/" + id + "/resources/" + resourceId + "/data",
            method: "get",
        });
    }
};
