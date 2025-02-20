<template>
  <div />
</template>

<script>
import moment from "moment/moment";
import formRequest from "@/api/form";
import axios from "axios";
import i18n from "@/utils/i18n";

export default {
  name: "Index",
  data() {
    return {
      filterType: "history",
      filterItems: [
        {
          key: "ID",
          operatorKey: "op_id",
          valueKey: "value_id",
          reqKeys: {
            "=": "processInstanceId",
            in: "processInstanceIds"
          }
        },
        {
          key: "Business Key",
          operatorKey: "op_business_key",
          valueKey: "value_business_key",
          reqKeys: {
            "=": "processInstanceBusinessKey",
            like: "processInstanceBusinessKeyLike",
            in: "processInstanceBusinessKeyIn"
          }
        },
        {
          key: "Active Activity ID",
          operatorKey: "op_active_activity_id",
          valueKey: "value_active_activity_id",
          ignoreOperator: true,
          reqKeys: "activeActivityIdIn"
        },
        {
          key: "Parent ID",
          operatorKey: "op_parent_id",
          valueKey: "value_parent_id",
          ignoreOperator: true,
          reqKeys: "superProcessInstanceId"
        },
        {
          key: "Sub ID",
          operatorKey: "op_sub_id",
          valueKey: "value_sub_id",
          reqKeys: {
            "=": "subProcessInstanceId"
          }
        },
        {
          key: "Case Instance ID",
          operatorKey: "op_case_instance_id",
          valueKey: "value_case_instance_id",
          reqKeys: {
            "=": "caseInstanceId"
          }
        },
        {
          key: "Definition ID",
          operatorKey: "op_definition_id",
          valueKey: "value_definition_id",
          ignoreOperator: true,
          reqKeys: "processDefinitionId"
        },
        {
          key: "Definition Key",
          operatorKey: "op_definition_key",
          valueKey: "value_definition_key",
          reqKeys: {
            "=": "processDefinitionKey",
            "!=": "processDefinitionKeyNotIn",
            in: "processDefinitionKeyIn"
          }
        },
        {
          key: "Definition Name",
          operatorKey: "op_definition_name",
          valueKey: "value_definition_name",
          reqKeys: {
            "=": "processDefinitionName",
            like: "processDefinitionNameLike"
          }
        },
        {
          key: "Executed Activity ID",
          operatorKey: "op_executed_activity_id",
          valueKey: "value_executed_activity_id",
          ignoreOperator: true,
          reqKeys: "executedActivityIdIn"
        },
        {
          key: "Started By User",
          operatorKey: "op_started_by_user",
          valueKey: "value_started_by_user",
          ignoreOperator: true,
          reqKeys: "startedBy"
        },
        {
          key: "Start Date After",
          operatorKey: "op_start_date_after",
          valueKey: "value_start_date_after",
          valueType: "date",
          ignoreOperator: true,
          reqKeys: "startedAfter"
        },
        {
          key: "Start Date Before",
          operatorKey: "op_start_date_before",
          valueKey: "value_start_date_before",
          valueType: "date",
          ignoreOperator: true,
          reqKeys: "startedBefore"
        },
        {
          key: "Finish Date Before",
          operatorKey: "op_finish_date_before",
          valueKey: "value_finish_date_before",
          valueType: "date",
          ignoreOperator: true,
          reqKeys: "finishedBefore"
        },
        {
          key: "Finish Date After",
          operatorKey: "op_finish_date_after",
          valueKey: "value_finish_date_after",
          valueType: "date",
          ignoreOperator: true,
          reqKeys: "finishedAfter"
        },
        {
          key: "Finished Only",
          operatorKey: "op_finished_only",
          valueKey: "value_finished_only",
          valueType: "bool",
          reqKeys: "finished"
        },
        {
          key: "Unfinished Only",
          operatorKey: "op_unfinished_only",
          valueKey: "value_unfinished_only",
          valueType: "bool",
          reqKeys: "unfinished"
        },
        {
          key: "With Incidents Only",
          operatorKey: "op_with_incidents_only",
          valueKey: "value_with_incidents_only",
          valueType: "bool",
          reqKeys: "withIncidents"
        },
        {
          key: "With Root Incidents Only",
          operatorKey: "op_with_root_incidents_only",
          valueKey: "value_with_root_incidents_only",
          valueType: "bool",
          reqKeys: "withRootIncidents"
        },
        {
          key: "Incident Message",
          operatorKey: "op_incident_message",
          valueKey: "value_incident_message",
          reqKeys: {
            "=": "incidentMessage",
            like: "incidentMessageLike"
          }
        },
        {
          key: "Variable",
          valueKey: "variable_editGrid",
          valueType: "array",
          reqKeys: "variables"
        },
        {
          key: "Incident Status",
          operatorKey: "op_incident_status",
          valueKey: "value_incident_status",
          ignoreOperator: true,
          reqKeys: "incidentStatus"
        },
        {
          key: "Incident Type",
          operatorKey: "op_incident_type",
          valueKey: "value_incident_type",
          ignoreOperator: true,
          reqKeys: "incidentType"
        },
        {
          key: "Job Execution Date Before",
          operatorKey: "op_job_execution_date_before",
          valueKey: "value_job_execution_date_before",
          valueType: "date",
          ignoreOperator: true,
          reqKeys: "executedJobBefore"
        },
        {
          key: "Job Execution Date After",
          operatorKey: "op_job_execution_date_after",
          valueKey: "value_job_execution_date_after",
          valueType: "date",
          ignoreOperator: true,
          reqKeys: "executedJobAfter"
        },
        {
          key: "Activity Execution Date Before",
          operatorKey: "op_activity_execution_date_before",
          valueKey: "value_activity_execution_date_before",
          valueType: "date",
          ignoreOperator: true,
          reqKeys: "executedActivityBefore"
        },
        {
          key: "Activity Execution Date After",
          operatorKey: "op_activity_execution_date_after",
          valueKey: "value_activity_execution_date_after",
          valueType: "date",
          ignoreOperator: true,
          reqKeys: "executedActivityAfter"
        },
        {
          key: "Tenant Id",
          operatorKey: "op_tenant_id",
          valueKey: "value_tenant_id",
          ignoreOperator: true,
          reqKeys: "tenantIdIn"
        },
        {
          key: "without Tenant Id",
          operatorKey: "op_without_tenant_id",
          valueKey: "value_without_tenant_id",
          valueType: "bool",
          reqKeys: "withoutTenantId"
        }
      ],
      filterItemsRuntime: [
        {
          key: "ID",
          operatorKey: "op_id",
          valueKey: "value_id",
          reqKeys: {
            "=": "processInstanceId",
            in: "processInstanceIds"
          }
        },
        {
          key: "Business Key",
          operatorKey: "op_business_key",
          valueKey: "value_business_key",
          reqKeys: {
            "=": "businessKey",
            like: "businessKeyLike",
            in: "processInstanceBusinessKeyIn"
          }
        },
        {
          key: "Active Activity ID",
          operatorKey: "op_active_activity_id",
          valueKey: "value_active_activity_id",
          ignoreOperator: true,
          reqKeys: "activeActivityIdIn"
        },
        {
          key: "Parent ID",
          operatorKey: "op_parent_id",
          valueKey: "value_parent_id",
          ignoreOperator: true,
          reqKeys: "superProcessInstance"
        },
        {
          key: "Sub ID",
          operatorKey: "op_sub_id",
          valueKey: "value_sub_id",
          reqKeys: {
            "=": "subProcessInstanceId"
          }
        },
        {
          key: "Case Instance ID",
          operatorKey: "op_case_instance_id",
          valueKey: "value_case_instance_id",
          reqKeys: {
            "=": "caseInstanceId"
          }
        },
        {
          key: "Definition ID",
          operatorKey: "op_definition_id",
          valueKey: "value_definition_id",
          ignoreOperator: true,
          reqKeys: "processDefinitionId"
        },
        {
          key: "Definition Key",
          operatorKey: "op_definition_key",
          valueKey: "value_definition_key",
          reqKeys: {
            "=": "processDefinitionKey",
            "!=": "processDefinitionKeyNotIn",
            in: "processDefinitionKeyIn"
          }
        },
        {
          key: "Definition Name",
          operatorKey: "op_definition_name",
          valueKey: "value_definition_name",
          reqKeys: {
            "=": "processDefinitionName",
            like: "processDefinitionNameLike"
          }
        },
        {
          key: "Executed Activity ID",
          operatorKey: "op_executed_activity_id",
          valueKey: "value_executed_activity_id",
          ignoreOperator: true,
          reqKeys: "executedActivityIdIn"
        },
        {
          key: "Started By User",
          operatorKey: "op_started_by_user",
          valueKey: "value_started_by_user",
          ignoreOperator: true,
          reqKeys: "startedBy"
        },
        {
          key: "Start Date After",
          operatorKey: "op_start_date_after",
          valueKey: "value_start_date_after",
          valueType: "date",
          ignoreOperator: true,
          reqKeys: "startedAfter"
        },
        {
          key: "Start Date Before",
          operatorKey: "op_start_date_before",
          valueKey: "value_start_date_before",
          valueType: "date",
          ignoreOperator: true,
          reqKeys: "startedBefore"
        },
        {
          key: "Finish Date Before",
          operatorKey: "op_finish_date_before",
          valueKey: "value_finish_date_before",
          valueType: "date",
          ignoreOperator: true,
          reqKeys: "finishedBefore"
        },
        {
          key: "Finish Date After",
          operatorKey: "op_finish_date_after",
          valueKey: "value_finish_date_after",
          valueType: "date",
          ignoreOperator: true,
          reqKeys: "finishedAfter"
        },
        {
          key: "Finished Only",
          operatorKey: "op_finished_only",
          valueKey: "value_finished_only",
          valueType: "bool",
          reqKeys: "finished"
        },
        {
          key: "Unfinished Only",
          operatorKey: "op_unfinished_only",
          valueKey: "value_unfinished_only",
          valueType: "bool",
          reqKeys: "unfinished"
        },
        {
          key: "With Incidents Only",
          operatorKey: "op_with_incidents_only",
          valueKey: "value_with_incidents_only",
          valueType: "bool",
          reqKeys: "withIncident"
        },
        {
          key: "With Root Incidents Only",
          operatorKey: "op_with_root_incidents_only",
          valueKey: "value_with_root_incidents_only",
          valueType: "bool",
          reqKeys: "withRootIncidents"
        },
        {
          key: "Incident Message",
          operatorKey: "op_incident_message",
          valueKey: "value_incident_message",
          reqKeys: {
            "=": "incidentMessage",
            like: "incidentMessageLike"
          }
        },
        {
          key: "Variable",
          valueKey: "variable_editGrid",
          valueType: "array",
          reqKeys: "variables"
        },
        {
          key: "Incident Status",
          operatorKey: "op_incident_status",
          valueKey: "value_incident_status",
          ignoreOperator: true,
          reqKeys: "incidentStatus"
        },
        {
          key: "Incident Type",
          operatorKey: "op_incident_type",
          valueKey: "value_incident_type",
          ignoreOperator: true,
          reqKeys: "incidentType"
        },
        {
          key: "Job Execution Date Before",
          operatorKey: "op_job_execution_date_before",
          valueKey: "value_job_execution_date_before",
          valueType: "date",
          ignoreOperator: true,
          reqKeys: "executedJobBefore"
        },
        {
          key: "Job Execution Date After",
          operatorKey: "op_job_execution_date_after",
          valueKey: "value_job_execution_date_after",
          valueType: "date",
          ignoreOperator: true,
          reqKeys: "executedJobAfter"
        },
        {
          key: "Activity Execution Date Before",
          operatorKey: "op_activity_execution_date_before",
          valueKey: "value_activity_execution_date_before",
          valueType: "date",
          ignoreOperator: true,
          reqKeys: "executedActivityBefore"
        },
        {
          key: "Activity Execution Date After",
          operatorKey: "op_activity_execution_date_after",
          valueKey: "value_activity_execution_date_after",
          valueType: "date",
          ignoreOperator: true,
          reqKeys: "executedActivityAfter"
        },
        {
          key: "Tenant Id",
          operatorKey: "op_tenant_id",
          valueKey: "value_tenant_id",
          ignoreOperator: true,
          reqKeys: "tenantIdIn"
        },
        {
          key: "without Tenant Id",
          operatorKey: "op_without_tenant_id",
          valueKey: "value_without_tenant_id",
          valueType: "bool",
          reqKeys: "withoutTenantId"
        }
      ],
      formValue: {},
      form: {},
      formData: {},
      filterShow: false
    };
  },
  watch: {
    filterShow(val) {
      if (val) {
        this.getForm();
      }
    }
  },
  computed: {
    parseFormValue() {
      let self = this;
      let filters = {};
      Object.keys(self.formValue).forEach((key) => {
        let value = self.formValue[key];
        if (key.startsWith("op_")) {
          switch (value) {
            case "equal":
              value = "=";
              break;
            case "unequal":
              value = "!=";
              break;
          }
        }
        filters[`${key}`] = value;
      });
      return filters;
    }
  },
  methods: {
    onFilterClear() {
      let self = this;
      self.form.resetValue();
      self.formValue = {};
    },
    onFilterCancel() {
      let self = this;
      self.filterShow = false;
    },
    async getForm() {
      let self = this;
      self.formData = null;
      let response;
      let rootPath=process.env.VUE_APP_ROOT_BASE_API;
      if (process.env.VUE_APP_SEARCH_FORM_BY_API === "true") {
        response = await formRequest.getItem("form", self.filterType === "history" ? "1669982666244" : "1672715821936");
      } else {
        response = await axios
          .create({
            baseURL: process.env.VUE_APP_ROUTER_BASE
          })
          .get(self.filterType === "history" ? `${rootPath}data/process_instance_search_form_v6.json` : `${rootPath}data/process_instance_runtime_search_form_v4.json`);
      }
      self.formData = response.data.formData;
    },
    parseFormSearchValue(value) {
      //variable中的值需要适配规则:true/false/纯数字不带双引号
      if (value === "true" || value === "false") {
        return Boolean(value);
      } else if (
        (typeof value === "number" ||
          (typeof value === "string" && value.trim() !== "")) &&
        !isNaN(value)
      ) {
        return +value;
      }
      return value;
    },
    generateFilters() {
      let self = this;
      let params = {};
      let filterItems = self.filterType === "history" ? self.filterItems : self.filterItemsRuntime;
      filterItems.forEach((filterItem) => {
        if (filterItem.valueType === "bool") {
          // bool类型
          if (self.parseFormValue[filterItem.valueKey]) {
            // 选中状态
            params[filterItem.reqKeys] = true;
          }
        } else if (filterItem.valueType === "array") {
          if (
            self.parseFormValue[filterItem.valueKey] &&
            self.parseFormValue[filterItem.valueKey].length > 0
          ) {
            // variables
            let variables = [];
            self.parseFormValue[filterItem.valueKey].forEach((variable) => {
              if (
                variable["op_variable"] &&
                variable["value_variable"] &&
                variable["variable_name"]
              ) {
                if (variable["op_variable"] === "in") {
                  // in 特殊处理
                  let inValues = variable["value_variable"].split(",");
                  inValues.forEach((inValue) => {
                    variables.push({
                      name: variable["variable_name"],
                      operator: "eq",
                      value: self.parseFormSearchValue(inValue)
                    });
                  });
                } else {
                  variables.push({
                    name: variable["variable_name"],
                    operator: variable["op_variable"],
                    value: self.parseFormSearchValue(
                      variable["value_variable"]
                    )
                  });
                }
              }
            });
            if (variables.length > 0) {
              params[filterItem.reqKeys] = variables;
            }
          }
        } else {
          if (
            (self.parseFormValue[filterItem.operatorKey] ||
              filterItem.ignoreOperator) &&
            self.parseFormValue[filterItem.valueKey] &&
            self.parseFormValue[filterItem.valueKey].trim().length > 0
          ) {
            // 生成filter条件
            let filterValue = self.parseFormValue[filterItem.valueKey];
            switch (self.parseFormValue[filterItem.operatorKey]) {
              case "like":
                filterValue = `%${filterValue}%`;
                break;
              case "!=":
                filterValue = [filterValue];
                break;
            }
            if (
              (typeof filterItem.reqKeys == "string" &&
                filterItem.reqKeys.endsWith("In")) ||
              self.parseFormValue[filterItem.operatorKey] === "in"
            ) {
              filterValue = filterValue
                .split(",")
                .filter((inKey) => inKey.trim().length > 0);
              if (filterValue.length === 0) {
                filterValue = [self.parseFormValue[filterItem.valueKey]];
              }
            }
            let key;
            if (filterItem.valueType === "date") {
              // 日期格式转换
              filterValue = moment(filterValue, "YYYY-MM-DDTHH:mm:ssZ").format(
                "YYYY-MM-DDTHH:mm:ss.SSSZZ"
              );
              key = filterItem.reqKeys;
            } else {
              if (filterItem.ignoreOperator) {
                key = filterItem.reqKeys;
              } else {
                key =
                  filterItem.reqKeys[
                    self.parseFormValue[filterItem.operatorKey]
                    ];
              }
            }
            params[key] = filterValue;
          }
        }
      });
      return params;
    }
  }
};
</script>

<style scoped>

</style>
