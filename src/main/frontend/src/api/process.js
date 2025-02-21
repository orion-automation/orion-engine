import request from "@/utils/request";
import taskRequest from "@/api/task";
import instanceRequest from "@/api/instance";
import camundaServiceRequest from "@/api/camunda-service";

export default {

  async getFilter(params) {
    return request({
      url: "filter",
      method: "get",
      params
    });
  },

  async postFilter(data) {
    return request({
      url: "filter/create",
      method: "post",
      data
    });
  },

  async getEnhancementProcessMilestoneByDefId(processDefId) {
    return await request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: `process-definition-id/${processDefId}/process-milestone`,
      method: "get"
    });
  },

  async getTaskCountByProcessKey(key, userId) {
    let taskCount = await taskRequest.postTaskCount("", null,
        { processDefinitionKey: key, assignee: userId }
    );
    let historyInstancesCount = await instanceRequest.postHistoryInstancesCount({
      processDefinitionKey: key, unfinished: true, startedBy: userId
    });
    taskCount = taskCount.count || 0;
    historyInstancesCount = historyInstancesCount.count || 0;
    return taskCount + historyInstancesCount;
  },

  async getEnhancementProcessDefinitionByKey(key) {
    return await request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: `open/process-definition/key/${key}`,
      method: "get"
    });
  },

  async getEnhancementProcessDefinitionById(processDefId) {
    return await request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: `open/process-definition/${processDefId}`,
      method: "get"
    });
  },

  async postEnhancementOpenProcessDefinitionByIdSubmitForm(processDefId, data) {
    return await request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: `open/process-definition/${processDefId}/submit-form`,
      method: "post", data
    });
  },

  async getProcessDefinitionByKey(key) {
    return request({
      url: "process-definition/key/" + key,
      method: "get"
    });
  },

  async startProcess(key, data) {
    return request({
      url: "/process-definition/key/" + key + "/start",
      method: "post",
      data
    });
  },

  async getProcessIconByKeys(tenantId, appKeysIn) {
    let filterIcons = await camundaServiceRequest.getApplications({}, {
      tenant: tenantId,
      type: "ux",
      category: "bpezAppIcons",
      appKeysIn: appKeysIn
    });
    return filterIcons;
  },
  async getProcessShowVariablesByKeys(tenantId, appKeysIn) {
    let filterIcons = await camundaServiceRequest.getApplications({}, {
      tenant: tenantId,
      type: "ux",
      category: "bpezAppVarsInList",
      appKeysIn: appKeysIn
    });
    return filterIcons;
  },

  async getAllTaskItemInfo(tasks, tenantId) {
    let self = this;
    if (tasks.length === 0) {
      return tasks;
    }
    let processDefKeyIn = [];
    // 获取task对应的流程实例
    let processInstanceIdIn = [];
    tasks.forEach(task => {
      task.variables = [];
      if (task.processInstanceId) {
        if (processInstanceIdIn.indexOf(task.processInstanceId) < 0) {
          processInstanceIdIn.push(task.processInstanceId);
        }
      }
    });
    let instances = processInstanceIdIn.length
        ? await instanceRequest.postHistoryInstances(
            {},
            {
              processInstanceIds: processInstanceIdIn
            }
        )
        : [];
    tasks.forEach(task => {
      let instance = instances.find(instance => instance.id === task.processInstanceId);
      if (instance) {
        task.instance = instance;
        task.businessKey = instance.businessKey;
        if (!processDefKeyIn.includes(instance.processDefinitionKey)) {
          processDefKeyIn.push(instance.processDefinitionKey);
        }
      }
    });
    // 获取需要显示的变量
    let variableNameIn = [];
    let showVariableInstances = await self.getProcessShowVariablesByKeys(tenantId, processDefKeyIn);
    showVariableInstances.forEach(instance => {
      instance.configJson.variables.forEach(variable => {
        variableNameIn.push(variable.name);
      });
    });
    tasks.forEach(task => {
      if (task.processInstanceId) {
        let instance = showVariableInstances.find(instance => instance.appKey === task.instance.processDefinitionKey);
        if (instance) {
          task.showVariables = instance.configJson.variables;
        }
      }
    });
    let values = processInstanceIdIn.length
        ? await instanceRequest.getHistoryVariables(
            {},
            {
              variableNameIn,
              processInstanceIdIn
            }
        )
        : [];
    tasks.forEach(task => {
      if (task.showVariables) {
        task.showVariables.forEach((variable) => {
          let value = values.find(
              (value) =>
                  value.name === variable.name &&
                  value.processInstanceId === task.processInstanceId
          );
          if (value) {
            value.label = variable.label;
            value.dataType = variable.type;
            task.variables.push(value);
          }
        });
      }
    });
    return tasks;
  },
  async getAllInstanceItemInfo(instances, tenantId) {
    let self = this;
    if (instances.length === 0) {
      return instances;
    }
    let processDefKeyIn = [];
    let processInstanceIdIn = instances.map(instance => instance.id);
    instances.forEach(task => {
      task.variables = [];
      if (task.processDefinitionKey) {
        if (processDefKeyIn.indexOf(task.processDefinitionKey) < 0) {
          processDefKeyIn.push(task.processDefinitionKey);
        }
      }
    });
    // 获取需要显示的变量
    let variableNameIn = [];
    let showVariableInstances = await self.getProcessShowVariablesByKeys(tenantId, processDefKeyIn);
    showVariableInstances.forEach(instance => {
      instance.configJson.variables.forEach(variable => {
        variableNameIn.push(variable.name);
      });
    });
    instances.forEach(task => {
      if (task.processDefinitionKey) {
        let instance = showVariableInstances.find(instance => instance.appKey === task.processDefinitionKey);
        if (instance) {
          task.showVariables = instance.configJson.variables;
        }
      }
    });
    let values = processInstanceIdIn.length
        ? await instanceRequest.getHistoryVariables(
            {},
            {
              variableNameIn,
              processInstanceIdIn
            }
        )
        : [];
    instances.forEach(task => {
      if (task.showVariables) {
        task.showVariables.forEach((variable) => {
          let value = values.find(
              (value) =>
                  value.name === variable.name &&
                  value.processInstanceId === task.id
          );
          if (value) {
            value.label = variable.label;
            value.dataType = variable.type;
            task.variables.push(value);
          }
        });
      }
    });
    return instances;
  },
  async validateCanUserStart(processDefinitionKey, userId) {
    let self = this;
    let processDefs = await self.getProcessByDeployment({
      key: processDefinitionKey,
      startableBy: userId
    });
    return processDefs && processDefs.length > 0;
  },
  async validateInstanceIsUserStart(processInstanceId, userId) {
    let self = this;
    let processDefs = await self.postInstanceCount("history", {}, {
      processInstanceId: processInstanceId,
      startedBy: userId
    });
    return processDefs.count > 0;
  },

  async getEnhancementProcessEngineInfo() {
    var definitions = await request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: "process-engine/info",
      method: "get"
    });
    return definitions;
  },

  async SetJobRetriesAsyncHistoricQueryBased(data) {
    return request({
      url: "process-instance/job-retries-historic-query-based",
      method: "post",
      data
    });
  },

  async setRetriesForMultipleExternalTasksAsync(data) {
    return request({
      url: "external-task/retries-async",
      method: "post",
      data
    });
  },

  async submitForm(id,data) {
    return request({
      url: `process-definition/${id}/submit-form`,
      method: "post",
      data
    });
  },

  async getExternalTasks(data) {
    return request({
      url: "external-task",
      method: "post",
      data
    });
  },

  async setExternalTaskRetries(id,data) {
    return request({
      url: `external-task/${id}/retries`,
      method: "put",
      data
    });
  },

  async getHistoryExternalTaskLogs(params) {
    return request({
      url: "history/external-task-log",
      method: "get",
      params: params
    });
  },

  async getStartFormKey(id) {
    return request({
      url: `process-definition/${id}/startForm`,
      method: "get",
    });
  },

  async getProcessStatistics(type, id, instanceId) {
    var url = `${type ? type + "/" : ""}process-definition/${id ? id + "/" : ""}statistics`;
    var params = {
      canceled: true,
      finished: true,
      completeScope: true,
      incidents: true
    };
    if (instanceId) {
      params.processInstanceIdIn = instanceId;
    }
    var definitions = await request({
      url,
      method: "get",
      params
    });
    return definitions;
  },


  async getEnhancementProcessOverview() {
    var definitions = await request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: "process-definition/overview",
      method: "get"
    });
    return definitions;
  },

  async getProcessDefinitionStatisticsCount() {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: "base/process-definition/statistics-count",
      method: "get",
    });
  },

  async getProcessDefinitionStatistics(params) {
    return request({
      baseURL: process.env.VUE_APP_ENHANCEMENT_API,
      url: "base/process-definition/statistics",
      method: "get",
      params
    });
  },

  async getProcessCount(filter) {
    return request({
      url: "process-definition/count",
      method: "get",
      params: filter
    });
  },
  async getProcessList(filters, page, pageSize) {
    filters = filters || {};
    filters.firstResult = (page - 1) * pageSize;
    filters.maxResults = pageSize;
    var definitions = await request({
      url: "process-definition",
      method: "get",
      params: filters
    });

    var requests = definitions.map(definition => {
      return request({
        url: "process-instance/count",
        method: "get",
        params: {
          processDefinitionId: definition.id
        }
      });
    });
    const instanceCounts = await Promise.all(requests);
    requests = definitions.map(definition => {
      return request({
        url: "incident/count",
        method: "get",
        params: {
          processDefinitionId: definition.id
        }
      });
    });
    const incidentCounts = await Promise.all(requests);
    definitions.forEach((definition, index) => {
      definition.instanceCount = instanceCounts[index].count;
      definition.incidentCount = incidentCounts[index].count;
    });
    return definitions;
  },
  async getProcess(id) {
    return request({
      url: "process-definition/" + id,
      method: "get"
    });
  },
  async getProcessXml(id) {
    return request({
      url: "process-definition/" + id + "/xml",
      method: "get"
    });
  },
  async deleteProcess(id, params) {
    return request({
      url: "process-definition/" + id,
      method: "delete",
      params
    });
  },
  async deleteDefinitionsByKey(key,params) {
    return request({
      url: `process-definition/key/${key}/delete`,
      method: "delete",params
    });
  },
  async deleteProcessInstance(id, params) {
    return request({
      url: "process-instance/" + id,
      method: "delete",
      params
    });
  },

  async getProcessVersions(key) {
    return request({
      url: "process-definition",
      method: "get",
      params: {
        key
      }
    });
  },

  async getInstanceCount(type, params) {
    return request({
      url: (type ? type + "/" : "") + "process-instance/count",
      method: "get",
      params
    });
  },
  async postInstanceCount(type, params, data) {
    return request({
      url: (type ? type + "/" : "") + "process-instance/count",
      method: "post",
      params: params,
      data
    });
  },
  async postInstanceListWithParams(type, params, data) {
    return request({
      url: (type ? type + "/" : "") + "process-instance",
      method: "post",
      params: params,
      data
    });
  },
  async getInstanceList(type, params) {
    return request({
      url: (type ? type + "/" : "") + "process-instance",
      method: "get",
      params
    });
  },
  async postInstanceList(type, data) {
    return request({
      url: (type ? type + "/" : "") + "process-instance",
      method: "post",
      data
    });
  },
  async getJobCount(processInstanceId) {
    return request({
      url: "job/count",
      method: "get",
      params: {
        processInstanceId,
        sorting: {
          sortBy: "jobId",
          sortOrder: "desc"
        }
      }
    });
  },
  async getJobList(processInstanceId, page, pageSize) {
    return request({
      url: "job",
      method: "get",
      params: {
        processInstanceId,
        firstResult: (page - 1) * pageSize,
        maxResults: pageSize,
        sorting: {
          sortBy: "jobId",
          sortOrder: "desc"
        }
      }
    });
  },

  async queryJobs(page, pageSize, data) {
    return request({
      url: "job",
      method: "post",
      params: {
        firstResult: (page - 1) * pageSize,
        maxResults: pageSize
      },
      data
    });
  },

  async queryJobCount(data) {
    return request({
      url: "job/count",
      method: "post",
      data
    });
  },

  async getJobDefinitionCount(processDefinitionId) {
    return request({
      url: "job-definition/count",
      method: "get",
      params: {
        processDefinitionId
      }
    });
  },
  async getJobDefinitionList(processDefinitionId, page, pageSize) {
    return request({
      url: "job-definition",
      method: "get",
      params: {
        processDefinitionId,
        firstResult: (page - 1) * pageSize,
        maxResults: pageSize
      }
    });
  },

  async getJobLogCount(params) {
    return request({
      url: "history/job-log/count",
      method: "get",
      params,
    });
  },
  async getJobLogList(params) {
    return request({
      url: "history/job-log",
      method: "get",
      params,
    });
  },

  async getUserOperationCount(processDefinitionId) {
    return request({
      url: "/history/user-operation/count",
      method: "get",
      params: {
        processDefinitionId
      }
    });
  },
  async getUserOperationList(processDefinitionId, page, pageSize, sortBy, sortOrder) {
    return request({
      url: "/history/user-operation",
      method: "get",
      params: {
        processDefinitionId,
        firstResult: (page - 1) * pageSize,
        maxResults: pageSize,
        sortBy: sortBy,
        sortOrder: sortOrder
      }
    });
  },

  async getIncidentCount(type, params) {
    return request({
      url: type ? (type + "/incident/count") : "incident/count",
      method: "get",
      params
    });
  },

  async getIncidentList(type, params) {
    return request({
      url: type ? (type + "/incident") : "incident",
      method: "get",
      params
    });
  },

  async getIncident(value) {
    return request({
      url: "incident/" + value,
      method: "get"
    });
  },

  async getIncidentHistory(params) {
    return request({
      url: "history/incident",
      method: "get",
      params
    });
  },

  async suspend(processDefinitionId, data) {
    return request({
      url: "/process-definition/" + processDefinitionId + "/suspended",
      method: "put",
      data
    });
  },

  async suspendInstance(id, data) {
    return request({
      url: "/process-instance/" + id + "/suspended",
      method: "put",
      data
    });
  },

  async setJobPriority(jobId, data) {
    return request({
      url: "/job-definition/" + jobId + "/jobPriority",
      method: "put",
      data
    });
  },
  async suspendJob(jobId, data) {
    return request({
      url: "/job-definition/" + jobId + "/suspended",
      method: "put",
      data
    });
  },
  async retryJobDefinition(jobId, data) {
    return request({
      url: "/job-definition/" + jobId + "/retries",
      method: "put",
      data
    });
  },

  async getDeploymentCount(filter) {
    return request({
      url: "deployment/count",
      method: "get",
      params: filter
    });
  },
  async deleteDeployment(id, params) {
    return request({
      url: "deployment/" + id,
      method: "delete",
      params
    });
  },
  async getDeploymentList(filter, page, pageSize) {
    filter = filter || {};
    filter.firstResult = (page - 1) * pageSize;
    filter.maxResults = pageSize;
    return request({
      url: "deployment",
      method: "get",
      params: filter
    });
  },
  async getDeployment(deploymentId) {
    return request({
      url: "deployment/" + deploymentId,
      method: "get"
    });
  },

  async getResources(deploymentId) {
    return request({
      url: "deployment/" + deploymentId + "/resources",
      method: "get"
    });
  },

  async getDecisionDefinitionsCount(deploymentId) {
    return request({
      url: "decision-definition/count",
      method: "get",
      params: {
        deploymentId
      }
    });
  },
  async getDecisionDefinitions(deploymentId, page, pageSize) {
    var definitions = await request({
      url: "decision-definition",
      method: "get",
      params: {
        deploymentId,
        firstResult: (page - 1) * pageSize,
        maxResults: pageSize
      }
    });
    return definitions;
  },

  async getDecisionRequirementsCount(deploymentId) {
    return request({
      url: "decision-requirements-definition/count",
      method: "get",
      params: {
        deploymentId
      }
    });
  },
  async getDecisionRequirements(deploymentId, page, pageSize) {
    var requirements = await request({
      url: "decision-requirements-definition",
      method: "get",
      params: {
        deploymentId,
        firstResult: (page - 1) * pageSize,
        maxResults: pageSize
      }
    });
    return requirements;
  },

  async saveAnnotation(id, data) {
    return request({
      url: "incident/" + id + "/annotation",
      method: "put",
      data
    });
  },

  async getIncidentNoParams(id) {
    return request({
      url: `incident/${id}`,
      method: "get",
    });
  },

  async setJobDueDate(id, data) {
    return request({
      url: "job/" + id + "/duedate",
      method: "put",
      data
    });
  },
  async executeModification(isAsync, data) {
    return request({
      url: isAsync ? "/modification/executeAsync" : "/modification/execute",
      method: "post",
      data
    });
  },
  async executeRestart(isAsync, id, data) {
    return request({
      url: `/process-definition/${id}/${isAsync ? "restart-async" : "restart"}`,
      method: "post",
      data
    });
  },
  async getCalledProcessDefinitions(id) {
    return request({
      url: `/process-definition/${id}/static-called-process-definitions`,
      method: "get",

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
  },
  async deploymentDataShow(id, resourceId) {
    return request({
      url: "deployment/" + id + "/resources/" + resourceId + "/data",
      method: "get",
    });
  },
  async redeploy(id, data){
    return request({
      url: "deployment/" + id + "/redeploy",
      method: "post",
      data
    });
  },
  async getProcessByDeployment(params){
    return request({
      url: "process-definition",
      method: "get",
      params
    });
  },
};
