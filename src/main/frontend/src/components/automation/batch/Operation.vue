<template>
  <div style="border-top: 1px solid rgba(187, 187, 187, 1);height: 100%">
    <div :style="filterShow?{display:'none !important' }:{display:'flex !important'}"
         style="height: 100%" class="d-flex flex-column"
    >
      <div class="d-flex flex-row" style="align-items: center;padding: 14px 15px">
        <v-breadcrumbs :items="breadcrumbs" style="background-color: #e8eff7;padding: 0;border: none" divider="|"/>
        <v-breadcrumbs
            :items="idBreadcrumbs"
            style="background-color: #e8eff7;padding: 0;border: none"
            divider="|"
        />
      </div>
      <v-card class="detail-card" style="border-top: 1px solid rgba(187, 187, 187, 1);flex: 1;height: 0px">
        <v-layout style="margin: 0" class="stretch">
          <div
              style="
            display: flex;
            position: absolute;
            flex-direction: column;
            width: 100%;
            height: 100%;
          "
          >
            <el-row type="flex" justify="start" class="menu-border">
              <el-col :span="24">
                <div
                    style="
                  height: 44px;
                  line-height: 44px;
                  color: #444262;
                "
                >
                  <v-menu
                      bottom
                      left
                  >
                    <template #activator="{ on, attrs }">
                      <v-btn
                          large
                          text
                          x-small
                          v-bind="attrs"
                          v-on="on"
                          style="border:none;"
                      >
                        <span style="font-size: 14px;color: #444262;">{{ operationName }}</span>
                        <v-icon size="20" color="#FF7754">
                          mdi-menu-down
                        </v-icon>
                      </v-btn>
                    </template>
                    <v-list style="font-size: 14px">
                      <v-list-item
                          key="deleteCompletedInstance"
                          @click="deleteCompletedInstance()"
                      >
                        <v-list-item-title>删除已完成流程实例</v-list-item-title>
                      </v-list-item>
                      <v-list-item
                          key="deleteRuntimeInstance"
                          @click="deleteRuntimeInstance()"
                      >
                        <v-list-item-title>删除进行中流程实例</v-list-item-title>
                      </v-list-item>
                      <v-list-item
                          key="deleteDecisionInstance"
                          @click="deleteDecisionInstance()"
                      >
                        <v-list-item-title>{{ $t('deleteDmnInstance') }}</v-list-item-title>
                      </v-list-item>
                      <v-list-item
                          key="deleteSuspendedInstance"
                          @click="deleteSuspendedInstance()"
                      >
                        <v-list-item-title>挂起流程实例</v-list-item-title>
                      </v-list-item>
                      <v-list-item
                          key="deleteActivationInstance"
                          @click="deleteActivationInstance"
                      >
                        <v-list-item-title>激活流程实例</v-list-item-title>
                      </v-list-item>
                      <v-list-item
                          key="jobsRetry"
                          @click="jobsRetry"
                      >
                        <v-list-item-title>流程实例Job重试</v-list-item-title>
                      </v-list-item>
                      <v-list-item
                          key="externalTasksRetry"
                          @click="externalTasksRetry"
                      >
                        <v-list-item-title>流程实例External Task重试</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </el-col>
            </el-row>
            <el-row
                style="
              border-bottom: 1px solid rgba(187, 187, 187, 1);
              height: 60px;
            "
                v-if="['deleteCompletedInstance','deleteRuntimeInstance','deleteDecisionInstance','deleteSuspendedInstance','deleteActivationInstance','jobsRetry','externalTasksRetry'].includes(batchOperation) && step == 1"
            >
              <el-col
                  :span="2.5"
                  style="
                border-right: 1px solid rgba(187, 187, 187, 1);
                padding-left: 10px;
                padding-right: 20px;
                height: 60px;
              "
              >
                <v-switch
                    color="#312651"
                    class="type-switch"
                    v-model="typeSwitch"
                    flat
                    inset
                    @change="changeSwitch()"
                    style="
                  margin-top: 8px;
                "
                >
                  <template #label>
                    <span v-if="typeSwitch"><span style="color: #83829a">Query/</span><span
                        style="font-weight: bold; color: #444262"
                    >Instance</span></span>
                    <span v-else><span style="font-weight: bold; color: #444262">Query</span><span
                        style="color: #83829a"
                    >/Instance</span></span>
                  </template>
                </v-switch>
              </el-col>
              <el-col :span="2.5"
                      style="
                height:60px;
                border-right: 1px solid rgba(187, 187, 187, 1);
              "
                      v-if="['deleteCompletedInstance','deleteRuntimeInstance'].includes(batchOperation)"
              >
                <v-checkbox
                    v-model="ignoreRecord"
                    :label="$t('ignoreRecord')"
                    dense
                    hide-details
                    color="#FF7754"
                    style="
                  margin-top: 8px;
                  padding-top: 10px;
                  padding-bottom: 10px;
                  padding-left: 10px;
                  padding-right: 10px;
                  height: 44px;
                "
                />
              </el-col>
              <el-col :span="6">
                <v-text-field
                    hide-details
                    dense
                    :label="$t('deleteReasonRemark')"
                    style="margin-top: 10px;margin-left: 20px; padding-top: 5px"
                    v-model="deleteReason"
                    v-if="['deleteCompletedInstance','deleteRuntimeInstance','deleteDecisionInstance'].includes(batchOperation)"
                />
              </el-col>
              <el-col :span="8">
                <v-text-field
                    hide-details
                    dense
                    :label="$t('plsInputRetryCountWithValidate')"
                    style="margin-top: 10px;margin-left: 20px; padding-top: 5px"
                    v-model="retryTimes"
                    v-if="['jobsRetry','externalTasksRetry'].includes(batchOperation)"
                />
              </el-col>
            </el-row>
            <el-row
                style="margin: 0 20px;border-bottom: none"
                type="flex"
                justify="start"
                class="menu-border"
                v-if="batchOperation==='deleteDecisionInstance' && step == 1"
            >
              <el-col style="padding: 0;margin-right: 20px;" :span="4">
                <v-text-field
                    :label="$t('dmnDefName')"
                    v-model="decisionInstance.filter.decisionDefinitionNameLike"
                    @keydown.enter="getDecisionInstance()"
                    hide-details
                    :disabled="!typeSwitch"
                >
                  <template #label>
                    <div>{{ $t('dmnDefName') }}</div>
                  </template>
                </v-text-field>
              </el-col>
              <el-col style="padding: 0;margin-right: 20px;" :span="4">
                <v-menu
                    ref="evaluatedAfter"
                    v-model="instanceCompleted.filter.dislayEvaluatedAfter"
                    :close-on-content-click="false"
                    :nudge-left="80"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                        v-model="decisionInstance.filter.evaluatedAfter"
                        :label="$t('processStartAfterDate')"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        @change="getDecisionInstance()"
                        :disabled="!typeSwitch"
                    >
                      <template #label>
                        <div>{{ $t('processStartAfterDate') }}</div>
                      </template>
                    </v-text-field>
                  </template>
                  <v-date-picker
                      v-model="decisionInstance.filter.evaluatedAfter"
                      @input="
                      decisionInstance.filter.dislayEvaluatedAfter = false;
                      getDecisionInstance();
                    "
                  >
                    <v-spacer/>
                    <v-btn
                        text
                        color="primary"
                        @click="
                        decisionInstance.filter.evaluatedAfter = '';
                        $refs.evaluatedAfter.save(decisionInstance.filter.evaluatedAfter);
                        getDecisionInstance();
                      "
                    >
                      {{ $t('reset') }}
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </el-col>
              <el-col style="padding: 0;margin-right: 20px;" :span="4">
                <v-menu
                    ref="evaluatedBefore"
                    v-model="decisionInstance.filter.dislayEvaluatedBefore"
                    :close-on-content-click="false"
                    :nudge-left="80"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                        v-model="decisionInstance.filter.evaluatedBefore"
                        :label="$t('processStartBeforeDate')"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        @change="getDecisionInstance()"
                        :disabled="!typeSwitch"
                    >
                      <template #label>
                        <div>
                          {{ $t('processStartBeforeDate') }}
                        </div>
                      </template>
                    </v-text-field>
                  </template>
                  <v-date-picker
                      v-model="decisionInstance.filter.evaluatedBefore"
                      @input="
                      decisionInstance.filter.dislayEvaluatedBefore = false;
                      getDecisionInstance();
                    "
                  >
                    <v-spacer/>
                    <v-btn
                        text
                        color="primary"
                        @click="
                        decisionInstance.filter.evaluatedBefore = '';
                        $refs.evaluatedBefore.save(
                          decisionInstance.filter.evaluatedBefore
                        );
                        getDecisionInstance();
                      "
                    >
                      {{ $t('reset') }}
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </el-col>
              <v-spacer/>
              <el-col
                  style="padding-right: 20px;"
                  :span="3"
                  v-if="batchOperation =='deleteCompletedInstance' || batchOperation == 'deleteRuntimeInstance'"
              >
                <v-btn style="margin-left: 20px;margin-top: 16px;" @click="filterShow = true">
                  {{ $t('queryAndSearchSet') }}
                </v-btn>
              </el-col>
              <el-col
                  style="padding-right: 20px;"
                  :span="3"
                  v-if="batchOperation=='deleteDecisionInstance'"
              >
                <v-btn color="#444262" :disabled="typeSwitch" style="margin-left: 20px;margin-top: 16px;color: #fff;">
                  {{ $t('advanceSearch') }}
                </v-btn>
              </el-col>
            </el-row>
            <el-row
                style="margin: 0 20px;border-bottom: none"
                type="flex"
                justify="start"
                class="menu-border"
                v-if="['deleteCompletedInstance','deleteRuntimeInstance','deleteActivationInstance','deleteSuspendedInstance','jobsRetry','externalTasksRetry'].includes(batchOperation)&& step == 1"
            >
              <el-col
                  :span="2.5"
                  style="padding: 0;margin-right: 20px;"
                  v-if="['deleteActivationInstance','deleteSuspendedInstance','jobsRetry','externalTasksRetry'].includes(batchOperation)"
              >
                <v-checkbox
                    style="padding-bottom: 10px"
                    v-model="instanceCompleted.filter.withIncidents"
                    :label="$t('incident')"
                    color="#FF7754"
                    @change="seachSet()"
                    hide-details
                >
                  <template #label>
                    <div
                        class="checkbox-label"
                        style="color: #444262;"
                    >
                      {{ $t('incident') }}
                    </div>
                  </template>
                </v-checkbox>
              </el-col>
              <el-col
                  :span="2.5"
                  style="padding: 0;margin-right: 20px;"
                  v-if="['deleteActivationInstance','deleteSuspendedInstance','jobsRetry','externalTasksRetry'].includes(batchOperation)"
              >
                <v-checkbox
                    style="padding-bottom: 10px"
                    v-model="instanceCompleted.filter.suspended"
                    :label="$t('suspend')"
                    color="#FF7754"
                    @change="getInstance()"
                    hide-details
                >
                  <template #label>
                    <div
                        class="checkbox-label"
                        style="color: #444262;"
                    >
                      {{ $t('suspend') }}
                    </div>
                  </template>
                </v-checkbox>
              </el-col>
              <el-col style="padding: 0;margin-right: 20px;" :span="4">
                <v-text-field
                    :label="$t('bussinessKey')"
                    v-model="instanceCompleted.filter.processInstanceBusinessKey"
                    @keydown.enter="seachSet()"
                    hide-details
                >
                  <template #label>
                    <div>{{ $t('bussinessKey') }}</div>
                  </template>
                </v-text-field>
              </el-col>
              <el-col style="padding: 0;margin-right: 20px;" :span="4">
                <v-menu
                    ref="startedAfter"
                    v-model="instanceCompleted.filter.dislayStartedAfter"
                    :close-on-content-click="false"
                    :nudge-left="80"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                        v-model="instanceCompleted.filter.startedAfter"
                        :label="$t('processStartAfterDate')"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        @change="seachSet()"
                    >
                      <template #label>
                        <div>{{ $t('processStartAfterDate') }}</div>
                      </template>
                    </v-text-field>
                  </template>
                  <v-date-picker
                      v-model="instanceCompleted.filter.startedAfter"
                      @input="
                      instanceCompleted.filter.dislayStartedAfter = false;
                      seachSet();
                    "
                  >
                    <v-spacer/>
                    <v-btn
                        text
                        color="primary"
                        @click="
                        instanceCompleted.filter.startedAfter = '';
                        $refs.startedAfter.save(instanceCompleted.filter.startedAfter);
                        seachSet();
                      "
                    >
                      {{ $t('reset') }}
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </el-col>
              <el-col style="padding: 0;margin-right: 20px;" :span="4">
                <v-menu
                    ref="startedBefore"
                    v-model="instanceCompleted.filter.dislayStartedBefore"
                    :close-on-content-click="false"
                    :nudge-left="80"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                        v-model="instanceCompleted.filter.startedBefore"
                        :label="$t('processStartBeforeDate')"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        @change="seachSet()"
                    >
                      <template #label>
                        <div>
                          {{ $t('processStartBeforeDate') }}
                        </div>
                      </template>
                    </v-text-field>
                  </template>
                  <v-date-picker
                      v-model="instanceCompleted.filter.startedBefore"
                      @input="
                      instanceCompleted.filter.dislayStartedBefore = false;
                      seachSet();
                    "
                  >
                    <v-spacer/>
                    <v-btn
                        text
                        color="primary"
                        @click="
                        instanceCompleted.filter.startedBefore = '';
                        $refs.startedBefore.save(
                          instanceCompleted.filter.startedBefore
                        );
                        seachSet();
                      "
                    >
                      {{ $t('reset') }}
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </el-col>
              <el-col
                  style="padding-right: 20px;"
                  :span="3"
              >
                <v-btn color="#444262" @click="instanceCompleted.display = true"
                       style="margin-left: 20px;margin-top: 16px;color: #fff;"
                >
                  <template #default>
                    {{ $t('varSearch') }}
                    <span
                        v-show="instanceCompleted.filter.variables.length"
                        class="badge badge-query"
                    >{{ instanceCompleted.filter.variables.length }}</span>
                  </template>
                </v-btn>
              </el-col>
              <v-spacer/>
              <el-col
                  style="padding-right: 20px;"
                  :span="3"
              >
                <v-btn color="#444262" style="margin-left: 20px;margin-top: 16px;color: #fff;"
                       @click="filterShow = true"
                >
                  {{ $t('queryAndSearchSet') }}
                </v-btn>
              </el-col>
            </el-row>
            <el-row
                style="border-top: 1px solid rgba(187, 187, 187, 1);"
                type="flex"
                justify="start"
                class="menu-border"
                v-if="['deleteCompletedInstance','deleteRuntimeInstance','deleteDecisionInstance','deleteSuspendedInstance','deleteActivationInstance','jobsRetry','externalTasksRetry'].includes(batchOperation) && step == 1"
            >
              <el-col :span="2.5">
                <div style="color: #444262;height: 44px;line-height: 44px;margin-left: 20px;">
                  <span v-if="batchOperation==='deleteDecisionInstance'">{{ $t('selectDmnInstance') }}</span>&nbsp;
                  <span
                      v-if="['deleteCompletedInstance','deleteRuntimeInstance','deleteSuspendedInstance','deleteActivationInstance','jobsRetry','externalTasksRetry'].includes(batchOperation)"
                  >{{ $t('selectProcessInstance') }}</span>
                  <span style="color: #83829a;" v-if="excelData.length != 0">{{
                      $t('uploadByPersonWithCount', {count: excelData.length})
                    }}</span>
                </div>
              </el-col>
              <v-spacer/>
              <el-col :span="2.5" style="border-left: 1px solid rgba(187, 187, 187, 1);">
                <v-btn
                    large
                    text
                    class="process-menu"
                    width="100px"
                    @click="uploadShow = true"
                    :disabled="!typeSwitch"
                >
                  <v-icon size="20" color="#444262">
                    mdi-upload
                  </v-icon>
                  <el-badge is-dot :hidden="excelData.length == 0">
                    <span style="font-size:16px;" v-if="typeSwitch">{{ $t('upload') }}</span>
                    <span style="font-size:16px;color: #bdbdbd;" v-if="!typeSwitch">{{ $t('upload') }}</span>
                  </el-badge>
                </v-btn>
              </el-col>
            </el-row>
            <div
                v-if="batchOperation==='deleteDecisionInstance' && step == 1"
                style="background-color: #fff;overflow-x: hidden;overflow-y:auto;"
            >
              <el-table
                  v-loading="decisionInstance.loading"
                  :data="decisionInstance.items"
                  @sort-change="decisionInstanceSortChange"
                  :default-sort="{prop: decisionInstance.sortBy, order: decisionInstance.sortOrder == 'desc' ? 'descending' : 'ascending'}"
                  @selection-change="handleSelectionChange"
                  ref="multipleTable"
              >
                <el-table-column type="selection" width="55" v-if="typeSwitch" key="decisionSelection"/>
                <el-table-column width="55" v-if="!typeSwitch" key="decisionSpace"/>
                <el-table-column :label="$t('dmnInstanceId')"
                                 prop="id">
                  <template slot-scope="props">
                    <router-link
                        :to="{
                        name: 'decision-instance-detail',
                        params: { id: props.row.id },
                        query: {},
                      }"
                    >
                      {{ props.row.id }}
                    </router-link>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('dmnEvaluationTime')" prop="evaluationTime" sortable="custom">
                  <template slot-scope="props">
                    {{ formatDateTime(props.row.evaluationTime) }}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('callProcessDef')" prop="processDefinitionKey">
                  <template slot-scope="props">
                    <router-link
                        :to="{
                        name: 'process-detail',
                        params: { id: props.row.processDefinitionId, typeSwitch: true },
                        query: {},
                      }"
                    >
                      {{ props.row.processDefinitionKey }}
                    </router-link>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('callInstances')" prop="processInstanceId">
                  <template slot-scope="props">
                    <router-link
                        :to="{
                        name: 'instance-detail',
                        params: { id: props.row.processInstanceId, tab: 3, activityId: props.row.activityId, typeSwitch: true },
                        query: {},
                      }"
                    >
                      {{ props.row.processInstanceId }}
                    </router-link>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('activityId')" prop="activityId">
                  <template slot-scope="props">
                    {{ props.row.activityId }}
                  </template>
                </el-table-column>
              </el-table>
              <div
                  class="text-center mb-2 my-2"
                  v-show="decisionInstance.pageCount > 1"
              >
                <v-pagination
                    v-model="decisionInstance.page"
                    :length="decisionInstance.pageCount"
                    total-visible="20"
                    color="#FF7754"
                />
              </div>
            </div>
            <div
                v-if="['deleteCompletedInstance','deleteRuntimeInstance','deleteSuspendedInstance','deleteActivationInstance','jobsRetry','externalTasksRetry'].includes(batchOperation) && step == 1 && excelData.length != 0"
                style="background-color: #fff;overflow-x: hidden;overflow-y:auto;"
            >
              <el-table :data="excelData" ref="multipleTable">
                <el-table-column width="55" v-if="excelData.length != 0" key="space"/>
                <el-table-column :label="$t('processInstanceId')">
                  <template slot-scope="props">
                    {{ props.row }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div
                v-if="['deleteCompletedInstance','deleteRuntimeInstance','deleteSuspendedInstance','deleteActivationInstance','jobsRetry','externalTasksRetry'].includes(batchOperation) && step == 1 && excelData.length == 0"
                style="background-color: #fff;overflow-x: hidden;overflow-y:auto;"
            >
              <el-table
                  v-loading="instanceCompleted.loading"
                  :data="instanceCompleted.items"
                  @sort-change="intanceSortChange"
                  :default-sort="{prop: instanceCompleted.sortBy, order: instanceCompleted.sortOrder == 'desc' ? 'descending' : 'ascending'}"
                  @selection-change="handleSelectionChange"
                  ref="multipleTable"
              >
                <el-table-column type="selection" width="55" v-if="typeSwitch" key="selection"/>
                <el-table-column width="55" v-if="!typeSwitch" key="space"/>
                <el-table-column :label="$t('processInstanceId')" prop="id">
                  <template slot-scope="props">
                    <router-link
                        :to="{
                        name: 'instance-detail',
                        params: { id: props.row.id },
                        query: {},
                      }"
                    >
                      {{ props.row.id }}
                    </router-link>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('topic')" prop="businessKey"/>
                <el-table-column :label="$t('startTime')" prop="startTime" sortable="custom">
                  <template slot-scope="props">
                    {{ formatDateTime(props.row.startTime) }}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('endTime')" prop="endTime" sortable="custom">
                  <template slot-scope="props">
                    {{ formatDateTime(props.row.endTime) }}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('processDef')">
                  <template slot-scope="props">
                    <router-link
                        :to="{
                        name: 'process-detail',
                        params: { id: props.row.processDefinitionId },
                        query: {},
                      }"
                    >
                      {{
                        props.row.processDefinitionName == null ? props.row.processDefinitionKey : props.row.processDefinitionName
                      }}
                    </router-link>
                  </template>
                </el-table-column>
              </el-table>
              <div
                  class="text-center mb-2 my-2"
                  v-show="instanceCompleted.pageCount > 1"
              >
                <v-pagination
                    v-model="instanceCompleted.page"
                    :length="instanceCompleted.pageCount"
                    total-visible="20"
                    color="#FF7754"
                />
              </div>
            </div>
            <el-container>
              <el-main style="background-color: #fff;">
                <div v-if="step == 2">
                  <div style="font-size:24px;margin-top:100px;margin-left:100px;">{{ $t('batchOverview') }}</div>
                  <div style="color: #83829a;margin-left:100px;">
                    {{ $t('currentBatchLinkInstancesCount') }}
                    <template v-if="typeSwitch">
                      <span
                          style="color: #444262;font-width:bold;"
                          v-if="['deleteCompletedInstance','deleteRuntimeInstance'].includes(batchOperation)"
                      >
                        {{ historicProcessInstanceIds.length }}
                      </span>
                      <span
                          style="color: #444262;font-width:bold;"
                          v-if="['deleteSuspendedInstance','deleteActivationInstance','jobsRetry','externalTasksRetry'].includes(batchOperation)"
                      >
                        {{ processInstanceIds.length }}
                      </span>
                    </template>
                    <span
                        style="color: #444262;font-width:bold;"
                        v-if="!typeSwitch"
                    >
                      {{ instanceCompleted.count }}
                    </span>
                    个
                  </div>
                  <div style="margin-top:20px;margin-left:90px;width:600px;">
                    <v-icon
                        v-show="!showPayload"
                        style="margin-left: 10px; cursor: pointer"
                        color="#FF7754"
                        size="16"
                        @click="showPayload = !showPayload"
                    >
                      mdi-eye
                    </v-icon>

                    <v-icon
                        v-show="showPayload"
                        style="margin-left: 10px; cursor: pointer"
                        color="#555555"
                        size="16"
                        @click="showPayload = !showPayload"
                    >
                      mdi-eye-off
                    </v-icon>
                    Payload
                    <v-textarea
                        disabled
                        rows="4"
                        outlined
                        v-model="payload"
                        hide-details
                        style="margin-top:10px;"
                        v-show="showPayload"
                    />
                  </div>
                </div>
                <div v-if="step == 3">
                  <template v-if="['jobsRetry','externalTasksRetry'].includes(batchOperation)">
                    <div class="d-flex flex-column"
                         style="width: 100%;height: 100%;align-items: center;justify-content: center"
                    >
                      <v-btn :color="!retrySubmitResult.success?'error':'success'" fab x-large dark
                             style="margin-bottom: 20px;border-radius: 50%"
                      >
                        <v-icon dark v-if="!retrySubmitResult.success" x-large style="border-radius: 50%">
                          mdi-alert-circle
                        </v-icon>
                        <v-icon dark v-else x-large>mdi-check</v-icon>
                      </v-btn>
                      <template v-if="!retrySubmitResult.success">
                        <span>{{ $t('hasError') }}({{
                            retrySubmitResult.result.response.status ? retrySubmitResult.result.response.status : retrySubmitResult.result
                          }})</span>
                        <span
                            v-if="retrySubmitResult.result.response&&retrySubmitResult.result.response.data&&retrySubmitResult.result.response.data.message"
                            style="border: 1px solid grey;border-radius: 5px;padding: 10px;width: 50%;margin-top: 20px"
                        >{{
                            retrySubmitResult.result.response.data.message
                          }}</span>
                      </template>
                      <template v-else>
                        <div>
                          {{ $t('goto') }}
                          <router-link
                              :to="{
                              name: 'batch-index-detail'
                            }"
                          >
                            {{ $t('mainMenus.batch') }}
                          </router-link>
                          {{ $t('viewResult') }}
                        </div>
                      </template>
                    </div>
                  </template>
                  <el-result v-else :icon="deleteSuccess" :title="tip">
                    <template slot="extra">
                      <div v-if="deleteSuccess == 'success'">
                        {{ $t('goto') }}
                        <router-link
                            :to="{
                            name: 'batch-index-detail'
                          }"
                        >
                          {{ $t('mainMenus.batch') }}
                        </router-link>
                        {{ $t('viewResult') }}
                      </div>
                      <div v-if="deleteSuccess == 'error'">
                        <v-textarea
                            disabled
                            rows="4"
                            outlined
                            v-model="errorMessage"
                            hide-details
                            style="margin-top:10px;"
                        />
                      </div>
                    </template>
                  </el-result>
                </div>
              </el-main>
              <el-footer style="background-color: #fff;">
                <el-row
                    v-if="['deleteCompletedInstance','deleteRuntimeInstance','deleteSuspendedInstance','deleteActivationInstance','jobsRetry','externalTasksRetry'].includes(batchOperation)"
                    style="margin-top:10px;margin-bottom:10px;"
                >
                  <el-col :span="2" :offset="21" v-if="step == 1 && typeSwitch">
                    <v-btn
                        block
                        color="#FF7754"
                        style="color:#ffffff;"
                        :disabled="historicProcessInstanceIds.length == 0"
                        @click="nextStep()"
                        v-if="batchOperation==='deleteCompletedInstance' || batchOperation === 'deleteRuntimeInstance'"
                    >
                      {{ $t('nextStep') }}
                      <span>({{ historicProcessInstanceIds.length }})</span>
                    </v-btn>
                  </el-col>
                  <el-col :span="2" :offset="21" v-if="step == 1 && typeSwitch">
                    <v-btn
                        block
                        color="#FF7754"
                        style="color:#ffffff;"
                        :disabled="processInstanceIds.length == 0"
                        @click="nextStep()"
                        v-if="['deleteSuspendedInstance','deleteActivationInstance','jobsRetry','externalTasksRetry'].includes(batchOperation)"
                    >
                      {{ $t('nextStep') }}
                      <span>({{ processInstanceIds.length }})</span>
                    </v-btn>
                  </el-col>
                  <el-col :span="2" :offset="21" v-if="step == 1 && !typeSwitch">
                    <v-btn
                        block
                        color="#FF7754"
                        style="color:#ffffff;"
                        :disabled="instanceCompleted.count == 0"
                        @click="nextStep()"
                    >
                      {{ $t('nextStep') }}
                      <span>({{ instanceCompleted.count }})</span>
                    </v-btn>
                  </el-col>
                  <el-col :span="2" :offset="1" v-if="step == 2">
                    <v-btn
                        block
                        color="#444262"
                        style="color:#ffffff;"
                        @click="back()"
                    >
                      {{ $t('preStep') }}
                    </v-btn>
                  </el-col>
                  <el-col :span="2" :offset="18"
                          v-if="step == 2 && typeSwitch && (batchOperation==='deleteCompletedInstance' || batchOperation === 'deleteRuntimeInstance')"
                  >
                    <v-btn
                        block
                        color="#FF7754"
                        style="color:#ffffff;"
                        @click="instanceDeleteBatch()"
                    >
                      {{ $t('execute') }}
                    </v-btn>
                  </el-col>
                  <el-col :span="2" :offset="18"
                          v-if="step == 2 && !typeSwitch && (batchOperation==='deleteCompletedInstance' || batchOperation === 'deleteRuntimeInstance')"
                  >
                    <v-btn
                        block
                        color="#FF7754"
                        style="color:#ffffff;"
                        @click="instanceQueryDelete()"
                    >
                      {{ $t('execute') }}
                    </v-btn>
                  </el-col>
                  <el-col :span="2" :offset="18"
                          v-if="step == 2 && ['jobsRetry','externalTasksRetry'].includes(batchOperation)"
                  >
                    <v-btn
                        block
                        color="#FF7754"
                        style="color:#ffffff;"
                        @click="retrySubmit()"
                    >
                      {{ $t('execute') }}
                    </v-btn>
                  </el-col>
                  <el-col :span="2" :offset="18"
                          v-if="step == 2 && typeSwitch && (batchOperation === 'deleteSuspendedInstance' || batchOperation === 'deleteActivationInstance')"
                  >
                    <v-btn
                        block
                        color="#FF7754"
                        style="color:#ffffff;"
                        @click="suspendedBatch()"
                    >
                      {{ $t('execute') }}
                    </v-btn>
                  </el-col>
                  <el-col :span="2" :offset="18"
                          v-if="step == 2 && !typeSwitch && (batchOperation === 'deleteSuspendedInstance' || batchOperation === 'deleteActivationInstance')"
                  >
                    <v-btn
                        block
                        color="#FF7754"
                        style="color:#ffffff;"
                        @click="suspendedQuery()"
                    >
                      {{ $t('execute') }}
                    </v-btn>
                  </el-col>
                </el-row>
                <el-row v-if="batchOperation=='deleteDecisionInstance'" style="margin-top:10px;margin-bottom:10px;">
                  <el-col :span="2" :offset="21" v-if="step == 1 && typeSwitch">
                    <v-btn
                        block
                        color="#FF7754"
                        style="color:#ffffff;"
                        :disabled="historicDecisionInstanceIds.length == 0"
                        @click="nextStep()"
                    >
                      {{ $t('nextStep') }}
                      <span>({{ historicDecisionInstanceIds.length }})</span>
                    </v-btn>
                  </el-col>
                  <el-col :span="2" :offset="21" v-if="step == 1 && !typeSwitch">
                    <v-btn
                        block
                        color="#FF7754"
                        style="color:#ffffff;"
                        :disabled="decisionInstance.count == 0"
                        @click="nextStep()"
                    >
                      {{ $t('nextStep') }}
                      <span>({{ decisionInstance.count }})</span>
                    </v-btn>
                  </el-col>
                  <el-col :span="2" :offset="1" v-if="step == 2">
                    <v-btn
                        block
                        color="#444262"
                        style="color:#ffffff;"
                        @click="back()"
                    >
                      {{ $t('preStep') }}
                    </v-btn>
                  </el-col>
                  <el-col :span="2" :offset="18" v-if="step == 2 && typeSwitch">
                    <v-btn
                        block
                        color="#FF7754"
                        style="color:#ffffff;"
                        @click="decisionDeleteBatch()"
                    >
                      {{ $t('execute') }}
                    </v-btn>
                  </el-col>
                  <el-col :span="2" :offset="18" v-if="step == 2 && !typeSwitch">
                    <v-btn
                        block
                        color="#FF7754"
                        style="color:#ffffff;"
                        @click="decisionQueryDelete()"
                    >
                      {{ $t('execute') }}
                    </v-btn>
                  </el-col>
                </el-row>
              </el-footer>
            </el-container>
          </div>
        </v-layout>
        <v-dialog
            v-model="instanceCompleted.display"
            width="900"
        >
          <v-card>
            <v-card-title class="headline">
              {{ $t('varSearch') }}
            </v-card-title>
            <v-card-text>
              <v-form ref="form" lazy-validation>
                <v-row style="margin: 0 20px">
                  <v-col style="padding: 0 20px 0 0" cols="4">
                    <v-text-field
                        :label="$t('variableName')"
                        v-model="criteria.name"
                        :rules="rules"
                        hide-details
                        required
                    />
                  </v-col>

                  <v-col style="padding: 0 20px 0 0" cols="2">
                    <v-select
                        :label="$t('opt')"
                        :items="operators"
                        :rules="rules"
                        :item-value="(item) => `${item.id}`"
                        :item-text="(item) => `${item.name}`"
                        v-model="criteria.operator"
                        required
                    />
                  </v-col>

                  <v-col style="padding: 0 20px 0 0" cols="4">
                    <v-text-field
                        :label="$t('value')"
                        v-model="criteria.value"
                        :rules="rules"
                        hide-details
                        required
                    />
                  </v-col>
                  <v-col style="padding: 0 0 20px 0" cols="2">
                    <v-btn style="margin-top: 12px" @click="add()">{{ $t('add') }}</v-btn>
                  </v-col>
                </v-row>
                <el-table :data="editingVariables">
                  <el-table-column :label="$t('variable')" prop="name"/>
                  <el-table-column width="80" :label="$t('opt')">
                    <template slot-scope="props">
                      {{ formatOperator(props.row.operator) }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="value" :label="$t('value')"/>
                  <el-table-column :label="$t('operate')" width="100">
                    <template slot-scope="props">
                      <span class="badge badge-menu" @click="remove(props.row)" style="background-color: #FF7754;">
                         <v-icon size="10" color="white">mdi-close</v-icon>
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </v-form>
            </v-card-text>
            <v-card-actions style="padding-bottom: 16px">
              <v-spacer/>
              <v-btn text @click="instanceCompleted.display = false"> {{ $t('cancel') }}</v-btn>
              <v-btn style="color: #ffffff" color="#FF7754" @click="confirm()">
                查询
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="uploadShow" max-width="410">
          <v-card>
            <v-card-title class="headline" style="color: #444262">
              上传Excel
            </v-card-title>
            <v-card-text>
              <el-upload
                  class="upload-demo"
                  drag
                  action=""
                  multiple
                  :limit="1"
                  :on-exceed="handleExceed"
                  :file-list="fileList"
                  :on-change="handleChange"
                  accept=".xls,.xlsx"
              >
                <i class="el-icon-upload"/>
                <div class="el-upload__text">{{ $t('dragFileOr') }}<em>{{ $t('clickToUpload') }}</em></div>
                <div class="el-upload__tip" slot="tip">
                  {{ $t('elUploadTips') }}
                </div>
              </el-upload>
            </v-card-text>
            <v-card-actions style="padding-bottom: 16px">
              <v-spacer/>
              <v-btn
                  color="primary"
                  text
                  @click="uploadClear"
              >
                {{ $t('clear') }}
              </v-btn>
              <v-btn
                  style="color: #ffffff"
                  color="#FF7754"
                  @click="uploadShow = false"
              >
                {{ $t('close') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
    </div>
    <search-instance-form v-show="filterShow"
                          @onFilterCancel="onFilterCancel"
                          @onFilterClear="onFilterClear"
                          @onFilterOk="onFilterOk"
    />
  </div>
</template>

<script>
import operationRequest from "@/api/operation";
import processRequest from "@/api/process";
import utils from "@/utils/utils";
import XLSX from "xlsx";
import common from "@/components/automation/mixins";
import SearchInstanceForm from "@/components/common/SearchInstanceForm";

export default {
  components: {SearchInstanceForm},
  mixins: [common],
  data() {
    return {
      errorMessage: null,
      excelData: [],
      uploadShow: false,
      fileList: [],
      uploadFile: "",
      rules: [(v) => !!v],
      criteria: {
        name: "",
        operator: "",
        value: "",
      },
      operators: [
        {id: "eq", name: "="},
        {id: "neq", name: "!="},
        {id: "gt", name: ">"},
        {id: "gteq", name: ">="},
        {id: "lt", name: "<"},
        {id: "lteq", name: "<="},
        {id: "like", name: "like"},
      ],
      editingVariables: [],
      deleteSuccess: null,
      tip: null,
      deleteReason: null,
      retryTimes: 1,
      showPayload: false,
      step: 1,
      ignoreRecord: true,
      typeSwitch: true,
      batchOperation: null,
      operationName: this.$t("selectBatchType"),
      breadcrumbs: [
        {
          text: this.$t("mainMenus.batch"),
          href: "#/automation/batch/index",
        },
      ],
      idBreadcrumbs: [
        {
          text: "",
          disabled: true,
          href: "",
        },
        {
          text: this.$t("executeBatch"),
          disabled: true,
          href: "",
        },
      ],
      instanceCompleted: {
        display: false,
        sortBy: "startTime",
        sortOrder: "desc",
        page: 0,
        pageCount: 0,
        itemsPerPage: 20,
        totalCount: 0,
        loading: true,
        items: [],
        condition: {},
        count: null,
        filter: {
          processInstanceBusinessKey: null,
          startedAfter: null,
          startedBefore: null,
          variables: [],
          displayStartedAfter: false,
          displayStartedBefore: false,
          withIncidents: false,
          suspended: false,
        },
      },
      multipleSelection: [],
      historicProcessInstanceIds: [],
      historicProcessInstanceQuery: {},
      historicDecisionInstanceIds: [],
      historicDecisionInstanceQuery: {},
      processInstanceIds: [],
      deleteBatchDetail: {
        id: null,
        type: null,
        totalJobs: null,
        batchJobsPerSeed: null,
        jobsCreated: null,
        invocationsPerBatchJob: null,
        seedJobDefinitionId: null,
        monitorJobDefinitionId: null,
        batchJobDefinitionId: null,
        suspened: null,
        tenantId: null,
      },
      retrySubmitResult: null,
      decisionInstance: {
        sortBy: "evaluationTime",
        sortOrder: "desc",
        page: 0,
        pageCount: 0,
        itemsPerPage: 20,
        totalCount: 0,
        loading: true,
        items: [],
        count: null,
        filter: {
          dislayEvaluatedAfter: false,
          dislayEvaluatedbefore: false,
          decisionDefinitionNameLike: null,
          evaluatedBefore: null,
          evaluatedAfter: null,
        },
      }
    };
  },
  computed: {
    payload() {
      var item;
      if (this.batchOperation === "deleteRuntimeInstance" || this.batchOperation === "deleteCompletedInstance") {
        if (this.typeSwitch) {
          item = {
            historicProcessInstanceIds: this.historicProcessInstanceIds
          };
        } else {
          item = {
            historicProcessInstanceQuery: this.instanceCompleted.condition
          };
        }
      } else if (this.batchOperation === "deleteDecisionInstance") {
        if (this.typeSwitch) {
          item = {
            historicDecisionInstanceIds: this.historicDecisionInstanceIds,
          };
        } else {
          item = {
            historicDecisionInstanceQuery: {},
          };
        }
      } else if (this.batchOperation === "deleteSuspendedInstance" || this.batchOperation === "deleteActivationInstance") {
        if (this.typeSwitch) {
          item = {
            processInstanceIds: this.processInstanceIds,
            suspended: this.batchOperation === "deleteSuspendedInstance" ? true : false
          };
        } else {
          item = {
            historicProcessInstanceQuery: this.instanceCompleted.condition,
            suspended: this.batchOperation === "deleteSuspendedInstance" ? true : false
          };
        }
      } else if (["jobsRetry", "externalTasksRetry"].includes(this.batchOperation)) {
        if (this.typeSwitch) {
          if (this.batchOperation === "jobsRetry") {
            item = {
              processInstances: this.processInstanceIds
            };
          } else {
            item = {
              processInstanceIds: this.processInstanceIds
            };
          }
        } else {
          item = {
            historicProcessInstanceQuery: this.instanceCompleted.condition
          };
        }
      }

      return JSON.stringify(item);
    },
  },
  watch: {
    "$i18n.locale": {
      handler(val) {
        let self = this;
        self.breadcrumbs[0].text = self.$t("mainMenus.batch");
      },
    },
    batchOperation: {
      handler() {
        this.instanceCompleted.filter.processInstanceBusinessKey = null;
        this.instanceCompleted.filter.startedAfter = null;
        this.instanceCompleted.filter.startedBefore = null;
        this.instanceCompleted.filter.variables = [];
        this.instanceCompleted.filter.withIncidents = false;
        this.instanceCompleted.filter.suspended = false;
        this.instanceCompleted.condition = {};
        this.typeSwitch = true;
        this.operationMatchName();
      }
    },
    "instanceCompleted.page": {
      handler() {
        this.getInstancePage();
      }
    },
    "decisionInstance.page": {
      handler() {
        this.getDecisionInstancePage();
      }
    },
  },
  mounted() {
  },
  methods: {
    async seachSet() {
      let self = this;
      let filterItem = null;
      self.formValue = {};
      if (self.instanceCompleted.filter.processInstanceBusinessKey) {
        filterItem = self.filterItems.filter(
            (filterItem) => filterItem.key === "Business Key"
        )[0];
        self.formValue[filterItem.valueKey] = "%" + self.instanceCompleted.filter.processInstanceBusinessKey + "%";
        self.formValue[filterItem.operatorKey] = "like";
      }
      if (self.batchOperation === "deleteCompletedInstance") {
        filterItem = self.filterItems.filter(
            (filterItem) => filterItem.key === "Finished Only"
        )[0];
        self.formValue[filterItem.valueKey] = filterItem.key;
      }
      if (self.batchOperation === "deleteRuntimeInstance") {
        filterItem = self.filterItems.filter(
            (filterItem) => filterItem.key === "Unfinished Only"
        )[0];
        self.formValue[filterItem.valueKey] = filterItem.key;
      }
      if (self.instanceCompleted.filter.startedAfter) {
        filterItem = self.filterItems.filter(
            (filterItem) => filterItem.key === "Start Date After"
        )[0];
        self.formValue[filterItem.valueKey] = self.instanceCompleted.filter.startedAfter;
      }
      if (self.instanceCompleted.filter.startedBefore) {
        filterItem = self.filterItems.filter(
            (filterItem) => filterItem.key === "Start Date Before"
        )[0];
        self.formValue[filterItem.valueKey] = self.instanceCompleted.filter.startedBefore;
      }
      if (self.instanceCompleted.filter.variables.length > 0) {
        filterItem = self.filterItems.filter(
            (filterItem) => filterItem.key === "Variable"
        )[0];
        var arr = [];
        self.instanceCompleted.filter.variables.map(item => {
          let obj = {
            variable_name: item.name,
            op_variable: item.operator,
            value_variable: item.value
          };
          arr.push(obj);
        });
        self.formValue[filterItem.valueKey] = arr;
      }
      if (["deleteActivationInstance", "deleteSuspendedInstance", "jobsRetry", "externalTasksRetry"].includes(self.batchOperation) && self.instanceCompleted.filter.withIncidents) {
        filterItem = self.filterItems.filter(
            (filterItem) => filterItem.key === "With Incidents Only"
        )[0];
        self.formValue[filterItem.valueKey] = "With Incidents Only";
      }
      this.instanceCompleted.condition = self.generateFilters();
      await self.getInstance();
    },
    onFilterOk() {
      let self = this;
      self.form
          .submit()
          .then((res) => {
            self.filterShow = false;
            self.formValue = res.data;
            self.instanceCompleted.filter.processInstanceBusinessKey = null;
            self.instanceCompleted.filter.startedAfter = null;
            self.instanceCompleted.filter.startedBefore = null;
            self.instanceCompleted.filter.variables = [];
            self.instanceCompleted.filter.withIncidents = false;
            if (self.formValue["value_with_incidents_only"] != "") {
              self.instanceCompleted.filter.withIncidents = true;
            }
            if (self.formValue["value_business_key"] != "" && self.formValue["op_business_key"] === "like") {
              self.instanceCompleted.filter.processInstanceBusinessKey = self.formValue["value_business_key"];
            }
            if (self.formValue["value_start_date_after"] != "") {
              self.instanceCompleted.filter.startedAfter = this.formatDateTime(self.formValue["value_start_date_after"]);
            }
            if (self.formValue["value_start_date_before"] != "") {
              self.instanceCompleted.filter.startedBefore = this.formatDateTime(self.formValue["value_start_date_before"]);
            }
            if (self.formValue["variable_editGrid"].length > 0) {
              var arr = [];
              self.formValue["variable_editGrid"].map(item => {
                let obj = {
                  name: item.variable_name,
                  operator: item.op_variable,
                  value: item.value_variable
                };
                arr.push(obj);
              });
              self.instanceCompleted.filter.variables = arr;
              utils.copyArray(self.instanceCompleted.filter.variables, self.editingVariables);
            }
            this.instanceCompleted.condition = self.generateFilters();
            self.getInstance();
          })
          .catch((err) => {
            console.log(err);
          });
    },
    uploadClear() {
      this.excelData = [];
      this.historicProcessInstanceIds = [];
      this.historicDecisionInstanceIds = [];
      this.processInstanceIds = [];
      this.uploadShow = false;
    },
    handleExceed() {
      this.$notify.error(this.$t("onlyUpload1File"));
    },
    handleChange(file, fileList) {
      this.historicProcessInstanceIds = [];
      this.historicDecisionInstanceIds = [];
      this.uploadFile = file.raw;
      const reader = new FileReader();
      reader.readAsBinaryString(this.uploadFile);
      reader.onload = ev => {
        try {
          const f = ev.target.result;
          const workbook = XLSX.read(f, {type: "binary"});
          const wsname = workbook.SheetNames[0];
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname], {header: 1, defval: "#"});
          var arr2 = ws.reduce((a, b) => {
            return a.concat(b);
          });
          arr2.splice(0, 1);
          if (this.batchOperation === "deleteRuntimeInstance" || this.batchOperation === "deleteCompletedInstance") {
            this.historicProcessInstanceIds = arr2;
          } else if (this.batchOperation === "deleteDecisionInstance") {
            this.historicDecisionInstanceIds = arr2;
          } else if (["deleteSuspendedInstance", "deleteActivationInstance", "jobsRetry", "externalTasksRetry"].includes(this.batchOperation)) {
            this.processInstanceIds = arr2;
          }
          this.excelData = arr2;
          this.uploadShow = false;
          this.multipleSelection = [];
          this.$refs.multipleTable.clearSelection();
        } catch (e) {
          return false;
        }
      };
    },
    changeSwitch() {
      this.historicProcessInstanceIds = [];
      this.historicProcessInstanceQuery = {};
      this.historicDecisionInstanceIds = [];
      this.historicDecisionInstanceQuery = {};
      this.processInstanceIds = [];
      if (["deleteRuntimeInstance", "deleteCompletedInstance", "deleteSuspendedInstance", "deleteActivationInstance", "jobsRetry", "externalTasksRetry"].includes(this.batchOperation)) {
        this.getInstance();
        if (!this.typeSwitch) {
          this.excelData = [];
          this.historicProcessInstanceQuery = this.instanceCompleted.condition;
        }
      } else if (this.batchOperation === "deleteDecisionInstance") {
        this.getDecisionInstance();
        if (!this.typeSwitch) {
          this.excelData = [];
          this.historicDecisionInstanceQuery = {};
        }
      }

    },
    confirm() {
      utils.copyArray(this.editingVariables, this.instanceCompleted.filter.variables);
      this.seachSet();
      this.instanceCompleted.display = false;
    },
    formatOperator(id) {
      return this.operators.filter((operator) => operator.id == id)[0].name;
    },
    add() {
      if (!this.$refs.form.validate()) {
        return;
      }
      var variable = {
        name: this.criteria.name,
        operator: this.criteria.operator,
      };

      var value = this.criteria.value;
      var numberValue = Number(value);
      if (this.criteria.operator != "like") {
        if (!isNaN(numberValue)) {
          value = numberValue;
        } else if (value == "true" || value == "false") {
          value = value === "true";
        }
      }

      variable.value = value;
      this.editingVariables.push(variable);
      this.$refs.form.reset();
    },
    remove(variable) {
      var index = this.editingVariables.indexOf(variable);
      this.editingVariables.splice(index, 1);
    },
    back() {
      this.multipleSelection = [];
      this.historicProcessInstanceIds = [];
      this.historicDecisionInstanceIds = [];
      this.processInstanceIds = [];
      this.excelData = [];
      this.showPayload = false;
      this.step = 1;
    },
    nextStep() {
      if (["jobsRetry", "externalTasksRetry"].includes(this.batchOperation)) {
        // 校验重试次数
        if (!(/(^[1-9]\d*$)/.test(`${this.retryTimes}`))) {
          this.$notify.error(this.$t("retryCountCannotNegative"));
          return;
        }
      }
      this.step = 2;
    },
    handleSelectionChange(val) {
      this.historicProcessInstanceIds = [];
      this.historicDecisionInstanceIds = [];
      this.processInstanceIds = [];
      this.excelData = [];
      if (this.batchOperation === "deleteRuntimeInstance" || this.batchOperation === "deleteCompletedInstance") {
        val.forEach((item) => {
          this.historicProcessInstanceIds.push(item.id);
        });
      } else if (this.batchOperation === "deleteDecisionInstance") {
        val.forEach((item) => {
          this.historicDecisionInstanceIds.push(item.id);
        });
      } else if (["deleteSuspendedInstance", "deleteActivationInstance", "jobsRetry", "externalTasksRetry"].includes(this.batchOperation)) {
        val.forEach((item) => {
          this.processInstanceIds.push(item.id);
        });
      }
      this.multipleSelection = val;
    },
    intanceSortChange(value) {
      this.instanceCompleted.sortBy = value.prop;
      this.instanceCompleted.sortOrder = value.order == "descending" ? "desc" : "asc";
      this.getInstancePage();
    },
    decisionInstanceSortChange(value) {
      this.decisionInstance.sortBy = value.prop;
      this.decisionInstance.sortOrder = value.order == "descending" ? "desc" : "asc";
      this.getDecisionInstancePage();
    },
    formatDateTime: utils.formatDateTime,
    operationMatchName() {
      this.idBreadcrumbs[1].text = this.$t("createBatch");
      this.step = 1;
      this.processInstanceIds = [];
      this.historicDecisionInstanceIds = [];
      this.instanceCompleted.filter = {
        processInstanceBusinessKey: null,
        startedAfter: null,
        startedBefore: null,
        variables: [],
        displayStartedAfter: false,
        displayStartedBefore: false,
        withIncidents: false,
        suspended: false,
      };
      this.instanceCompleted.condition = {};
      this.decisionInstance.filter = {
        dislayEvaluatedAfter: false,
        dislayEvaluatedbefore: false,
        decisionDefinitionNameLike: null,
        evaluatedBefore: null,
        evaluatedAfter: null,
      };
      this.retryTimes = 1;
      this.deleteReason = "";
      switch (this.batchOperation) {
        case "deleteCompletedInstance":
          this.operationName = this.$t("delDoneProcessInstance");
          this.formValue = {};
          this.seachSet();
          break;
        case "deleteRuntimeInstance":
          this.operationName = this.$t("delRunningProcessInstance");
          this.formValue = {};
          this.seachSet();
          break;
        case "deleteDecisionInstance":
          this.operationName = this.$t("delDmnInstances");
          this.getDecisionInstance();
          break;
        case "deleteSuspendedInstance":
          this.operationName = this.$t("suspendProcessInstances");
          this.formValue = {};
          this.seachSet();
          break;
        case "deleteActivationInstance":
          this.operationName = this.$t("activeProcessInstances");
          this.formValue = {};
          this.seachSet();
          break;
        case "jobsRetry":
          this.operationName = this.$t("jobRetryProcessInstance");
          this.formValue = {};
          this.retryTimes = 1;
          this.instanceCompleted.filter.withIncidents = true;
          this.seachSet();
          break;
        case "externalTasksRetry":
          this.operationName = this.$t("externalTaskRetryProcessInstance");
          this.formValue = {};
          this.retryTimes = 1;
          this.instanceCompleted.filter.withIncidents = true;
          this.seachSet();
          break;
        default:
          this.operationName = this.$t("selectBatchType");
          break;
      }
    },
    deleteCompletedInstance() {
      this.batchOperation = "deleteCompletedInstance";
    },
    deleteRuntimeInstance() {
      this.batchOperation = "deleteRuntimeInstance";
    },
    deleteDecisionInstance() {
      this.batchOperation = "deleteDecisionInstance";
    },
    deleteSuspendedInstance() {
      if (this.excelData.length != 0) {
        this.processInstanceIds = this.excelData;
      }
      this.batchOperation = "deleteSuspendedInstance";
    },
    deleteActivationInstance() {
      if (this.excelData.length != 0) {
        this.processInstanceIds = this.excelData;
      }
      this.batchOperation = "deleteActivationInstance";
    },
    jobsRetry() {
      if (this.excelData.length != 0) {
        this.processInstanceIds = this.excelData;
      }
      this.batchOperation = "jobsRetry";
    },
    externalTasksRetry() {
      if (this.excelData.length != 0) {
        this.processInstanceIds = this.excelData;
      }
      this.batchOperation = "externalTasksRetry";
    },
    async getInstance() {
      this.instanceCompleted.loading = true;
      this.instanceCompleted.totalCount = 0;
      this.instanceCompleted.page = 0;
      let data = {};
      if (this.instanceCompleted.condition) {
        data = this.instanceCompleted.condition;
      }
      if (["deleteSuspendedInstance", "deleteActivationInstance", "jobsRetry", "externalTasksRetry"].includes(this.batchOperation) && this.instanceCompleted.filter.withIncidents) {
        data.withIncidents = true;
      }
      if (["deleteSuspendedInstance", "deleteActivationInstance", "jobsRetry", "externalTasksRetry"].includes(this.batchOperation) && this.instanceCompleted.filter.suspended) {
        data.suspended = true;
      }
      if (this.instanceCompleted.filter.processInstanceBusinessKey) {
        data.processInstanceBusinessKeyLike = "%" + this.instanceCompleted.filter.processInstanceBusinessKey + "%";
      }
      if (this.batchOperation === "deleteCompletedInstance") {
        data.finished = true;
      }
      if (this.batchOperation === "deleteRuntimeInstance") {
        data.unfinished = true;
      }
      if (this.instanceCompleted.filter.variables.length) {
        data.variableNamesIgnoreCase = true;
        data.variableValuesIgnoreCase = true;
        data.variables = this.instanceCompleted.filter.variables;
      }
      var formattedDate;
      if (this.instanceCompleted.filter.startedAfter) {
        formattedDate =
            utils
                .formatDateTime(this.instanceCompleted.filter.startedAfter, "yyyy-MM-DDTHH:mm:ss.SSS") +
            utils
                .formatDateTime(this.instanceCompleted.filter.startedAfter, "Z")
                .replace(":", "");
        data.startedAfter = formattedDate;
      }
      if (this.instanceCompleted.filter.startedBefore) {
        formattedDate =
            utils
                .formatDateTime(this.instanceCompleted.filter.startedBefore, "yyyy-MM-DDTHH:mm:ss.SSS") +
            utils
                .formatDateTime(this.instanceCompleted.filter.startedBefore, "Z")
                .replace(":", "");
        data.startedBefore = formattedDate;
      }
      let response = await operationRequest.getInstanceCount(data);
      this.instanceCompleted.totalCount = response.count;
      this.instanceCompleted.pageCount =
          Math.floor((response.count - 1) / this.instanceCompleted.itemsPerPage) + 1;
      this.instanceCompleted.count = response.count;
      this.instanceCompleted.page = 1;
    },
    async getInstancePage() {
      this.instanceCompleted.loading = true;
      if (!this.instanceCompleted.page) {
        this.instanceCompleted.items = [];
        return;
      }
      let data = {
        sorting: [
          {
            sortBy: this.instanceCompleted.sortBy,
            sortOrder: this.instanceCompleted.sortOrder,
          }
        ]
      };
      let params = {
        firstResult: (this.instanceCompleted.page - 1) * this.instanceCompleted.itemsPerPage,
        maxResults: this.instanceCompleted.itemsPerPage,
      };
      let filterItem = null;
      if (this.instanceCompleted.condition) {
        data = this.instanceCompleted.condition;
      }
      if (this.instanceCompleted.filter.processInstanceBusinessKey) {
        data.processInstanceBusinessKeyLike = "%" + this.instanceCompleted.filter.processInstanceBusinessKey + "%";
      }
      if (["deleteSuspendedInstance", "deleteActivationInstance", "jobsRetry", "externalTasksRetry"].includes(this.batchOperation) && this.instanceCompleted.filter.withIncidents) {
        data.withIncidents = true;
      }
      if (["deleteSuspendedInstance", "deleteActivationInstance", "jobsRetry", "externalTasksRetry"].includes(this.batchOperation) && this.instanceCompleted.filter.suspended) {
        data.suspended = true;
      }
      if (this.batchOperation === "deleteCompletedInstance") {
        filterItem = this.filterItems.filter(
            (filterItem) => filterItem.key === "Finished Only"
        )[0];
        this.formValue[filterItem.valueKey] = filterItem.key;
        data.finished = true;
      }
      if (this.batchOperation === "deleteRuntimeInstance") {
        filterItem = this.filterItems.filter(
            (filterItem) => filterItem.key === "Unfinished Only"
        )[0];
        this.formValue[filterItem.valueKey] = filterItem.key;
        data.unfinished = true;
      }
      if (this.instanceCompleted.filter.variables.length) {
        data.variableNamesIgnoreCase = true;
        data.variableValuesIgnoreCase = true;
        data.variables = this.instanceCompleted.filter.variables;
      }
      var formattedDate;
      if (this.instanceCompleted.filter.startedAfter) {
        formattedDate =
            utils
                .formatDateTime(this.instanceCompleted.filter.startedAfter, "yyyy-MM-DDTHH:mm:ss.SSS") +
            utils
                .formatDateTime(this.instanceCompleted.filter.startedAfter, "Z")
                .replace(":", "");
        data.startedAfter = formattedDate;
      }
      if (this.instanceCompleted.filter.startedBefore) {
        formattedDate =
            utils
                .formatDateTime(this.instanceCompleted.filter.startedBefore, "yyyy-MM-DDTHH:mm:ss.SSS") +
            utils
                .formatDateTime(this.instanceCompleted.filter.startedBefore, "Z")
                .replace(":", "");
        data.startedBefore = formattedDate;
      }
      let response = await operationRequest.getInstance(params, data);
      this.instanceCompleted.items = response;
      this.instanceCompleted.loading = false;
    },
    async instanceDelete(historicProcessInstanceIds) {
      let data = {
        deleteReason: this.deleteReason,
        failIfNotExists: this.ignoreRecord ? false : true,
      };
      try {
        let response;
        if (this.batchOperation === "deleteCompletedInstance") {
          data.historicProcessInstanceIds = historicProcessInstanceIds;
          response = await operationRequest.deleteInstance(data);
        }
        if (this.batchOperation === "deleteRuntimeInstance") {
          data.processInstanceIds = historicProcessInstanceIds;
          response = await operationRequest.deleteInstanceAsync(data);
        }
        if (response.id) {
          this.tip = this.$t("delSuccess");
          this.deleteSuccess = "success";
        }
      } catch (e) {
        this.tip = this.$t("delFailed");
        this.deleteSuccess = "error";
        this.errorMessage = e;
      }
      this.step = 3;
      this.deleteBatchDetail = response;
    },
    async instanceDeleteBatch() {
      if (this.historicProcessInstanceIds.length > 1000) {
        const res = [];
        const len = this.historicProcessInstanceIds.length;
        for (let i = 0; i < len; i += 999) {
          const chunk = this.historicProcessInstanceIds.slice(i, i + 999);
          res.push(chunk);
        }
        for (let i = 0; i < res.length; i++) {
          await this.instanceDelete(res[i]);
        }
      } else {
        await this.instanceDelete(this.historicProcessInstanceIds);
      }
    },
    async retrySubmit() {
      let self = this;
      let data = {
        retries: self.retryTimes,
      };
      switch (self.batchOperation) {
        case "jobsRetry":
          if (self.typeSwitch) {
            data.processInstances = self.processInstanceIds;
          } else {
            data.historicProcessInstanceQuery = self.instanceCompleted.condition;
          }
          processRequest.SetJobRetriesAsyncHistoricQueryBased(data)
              .then(result => {
                self.retrySubmitResult = {
                  success: true,
                  result: result
                };
              })
              .catch(e => {
                self.retrySubmitResult = {
                  success: false,
                  result: e
                };
              });
          break;
        case "externalTasksRetry":
          if (self.typeSwitch) {
            data.processInstanceIds = self.processInstanceIds;
          } else {
            data.historicProcessInstanceQuery = self.instanceCompleted.condition;
          }
          processRequest.setRetriesForMultipleExternalTasksAsync(data)
              .then(result => {
                self.retrySubmitResult = {
                  success: true,
                  result: result
                };
              })
              .catch(e => {
                self.retrySubmitResult = {
                  success: false,
                  result: e
                };
              });
          break;
      }
      this.step = 3;
    },
    async instanceQueryDelete() {
      let data = {
        deleteReason: this.deleteReason,
        failIfNotExists: this.ignoreRecord ? false : true,
      };
      let response;
      if (this.batchOperation === "deleteCompletedInstance") {
        data.historicProcessInstanceQuery = this.instanceCompleted.condition;
        response = await operationRequest.deleteInstance(data);
      }
      if (this.batchOperation === "deleteRuntimeInstance") {
        data.processInstanceQuery = this.instanceCompleted.condition;
        response = await operationRequest.deleteInstanceAsync(data);
      }
      if (response.id) {
        this.tip = this.$t("delSuccess");
        this.deleteSuccess = "success";
      } else {
        this.tip = this.$t("delFailed");
        this.deleteSuccess = "error";
      }
      this.step = 3;
      this.deleteBatchDetail = response;
    },
    async getDecisionInstance() {
      this.decisionInstance.loading = true;
      this.decisionInstance.totalCount = 0;
      this.decisionInstance.page = 0;
      var params = {};
      if (this.decisionInstance.filter.decisionDefinitionNameLike) {
        params.decisionDefinitionNameLike = "%" + this.decisionInstance.filter.decisionDefinitionNameLike + "%";
      }
      var formattedDate;
      if (this.decisionInstance.filter.evaluatedBefore) {
        formattedDate =
            utils
                .formatDateTime(this.decisionInstance.filter.evaluatedBefore, "yyyy-MM-DDTHH:mm:ss.SSS") +
            utils
                .formatDateTime(this.decisionInstance.filter.evaluatedBefore, "Z")
                .replace(":", "");
        params.evaluatedBefore = formattedDate;
      }
      if (this.decisionInstance.filter.evaluatedAfter) {
        formattedDate =
            utils.formatDateTime(
                this.decisionInstance.filter.evaluatedAfter,
                "yyyy-MM-DDTHH:mm:ss.SSS"
            ) +
            utils
                .formatDateTime(this.decisionInstance.filter.evaluatedAfter, "Z")
                .replace(":", "");
        params.evaluatedAfter = formattedDate;
      }
      let response = await operationRequest.getDecisionInstanceCount(params);
      this.decisionInstance.count = response.count;
      this.decisionInstance.totalCount = response.count;
      this.decisionInstance.pageCount =
          Math.floor((response.count - 1) / this.decisionInstance.itemsPerPage) + 1;
      this.decisionInstance.page = 1;
    },
    async getDecisionInstancePage() {
      this.decisionInstance.loading = true;
      if (!this.decisionInstance.page) {
        this.decisionInstance.items = [];
        return;
      }
      var params = {
        firstResult: (this.decisionInstance.page - 1) * this.decisionInstance.itemsPerPage,
        maxResults: this.decisionInstance.itemsPerPage,
        sortBy: this.decisionInstance.sortBy,
        sortOrder: this.decisionInstance.sortOrder,
      };
      if (this.decisionInstance.filter.decisionDefinitionNameLike) {
        params.decisionDefinitionNameLike = "%" + this.decisionInstance.filter.decisionDefinitionNameLike + "%";
      }
      var formattedDate;
      if (this.decisionInstance.filter.evaluatedBefore) {
        formattedDate =
            utils
                .formatDateTime(this.decisionInstance.filter.evaluatedBefore, "yyyy-MM-DDTHH:mm:ss.SSS") +
            utils
                .formatDateTime(this.decisionInstance.filter.evaluatedBefore, "Z")
                .replace(":", "");
        params.evaluatedBefore = formattedDate;
      }
      if (this.decisionInstance.filter.evaluatedAfter) {
        formattedDate =
            utils.formatDateTime(
                this.decisionInstance.filter.evaluatedAfter,
                "yyyy-MM-DDTHH:mm:ss.SSS"
            ) +
            utils
                .formatDateTime(this.decisionInstance.filter.evaluatedAfter, "Z")
                .replace(":", "");
        params.evaluatedAfter = formattedDate;
      }
      let response = await operationRequest.getDecisionInstance(params);
      this.decisionInstance.items = response;
      this.decisionInstance.loading = false;
    },
    async decisionDeleteBatch() {
      if (this.historicDecisionInstanceIds.length > 1000) {
        const res = [];
        const len = this.historicDecisionInstanceIds.length;
        for (let i = 0; i < len; i += 999) {
          const chunk = this.historicDecisionInstanceIds.slice(i, i + 999);
          res.push(chunk);
        }
        for (let i = 0; i < res.length; i++) {
          await this.decisionDelete(res[i]);
        }
      } else {
        await this.decisionDelete(this.historicDecisionInstanceIds);
      }
    },
    async decisionDelete(historicDecisionInstanceIds) {
      let data = {
        deleteReason: this.deleteReason,
        historicDecisionInstanceIds: historicDecisionInstanceIds,
      };
      try {
        let response = await operationRequest.deleteDecision(data);
        if (response.id) {
          this.tip = this.$t("delSuccess");
          this.deleteSuccess = "success";
        }
      } catch (e) {
        this.tip = this.$t("delFailed");
        this.deleteSuccess = "error";
        this.errorMessage = e;
      }
      this.step = 3;
      this.deleteBatchDetail = response;
    },
    async suspendedBatch() {
      if (this.processInstanceIds.length > 1000) {
        const res = [];
        const len = this.processInstanceIds.length;
        for (let i = 0; i < len; i += 999) {
          const chunk = this.processInstanceIds.slice(i, i + 999);
          res.push(chunk);
        }
        for (let i = 0; i < res.length; i++) {
          await this.suspended(res[i]);
        }
      } else {
        await this.suspended(this.processInstanceIds);
      }
    },
    async suspended(processInstanceIds) {
      let data = {
        processInstanceIds: processInstanceIds,
      };
      if (this.batchOperation === "deleteSuspendedInstance") {
        data.suspended = true;
      }
      if (this.batchOperation === "deleteActivationInstance") {
        data.suspended = false;
      }
      try {
        let response = await operationRequest.suspendedAsync(data);
        if (response.id) {
          if (this.batchOperation === "deleteSuspendedInstance") {
            this.tip = this.$t("suspendSuccess");
            this.deleteSuccess = "success";
          } else if (this.batchOperation === "deleteActivationInstance") {
            this.tip = this.$t("activeSuccess");
            this.deleteSuccess = "success";
          }
        } else {
          if (this.batchOperation === "deleteSuspendedInstance") {
            this.tip = this.$t("suspendFailed");
            this.deleteSuccess = "error";
          } else if (this.batchOperation === "deleteActivationInstance") {
            this.tip = this.$t("activeFailed");
            this.deleteSuccess = "error";
          }
        }
      } catch (error) {
        if (this.batchOperation === "deleteSuspendedInstance") {
          this.tip = this.$t("suspendFailed");
          this.deleteSuccess = "error";
          this.errorMessage = error;
        } else if (this.batchOperation === "deleteActivationInstance") {
          this.tip = this.$t("activeFailed");
          this.deleteSuccess = "error";
          this.errorMessage = error;
        }
      }
      this.step = 3;
      this.deleteBatchDetail = response;
    },
    async suspendedQuery() {
      let data = {
        historicProcessInstanceQuery: this.instanceCompleted.condition,
      };
      if (this.batchOperation === "deleteSuspendedInstance") {
        data.suspended = true;
      }
      if (this.batchOperation === "deleteActivationInstance") {
        data.suspended = false;
      }
      let response = await operationRequest.suspendedAsync(data);
      if (response.id) {
        if (this.batchOperation === "deleteSuspendedInstance") {
          this.tip = this.$t("suspendSuccess");
          this.deleteSuccess = "success";
        } else if (this.batchOperation === "deleteActivationInstance") {
          this.tip = this.$t("activeSuccess");
          this.deleteSuccess = "success";
        }
      } else {
        if (this.batchOperation === "deleteSuspendedInstance") {
          this.tip = this.$t("suspendFailed");
          this.deleteSuccess = "error";
        } else if (this.batchOperation === "deleteActivationInstance") {
          this.tip = this.$t("activeFailed");
          this.deleteSuccess = "error";
        }
      }
      this.step = 3;
      this.deleteBatchDetail = response;
    },
  },
};
</script>

<style scoped>
.copyIcon {
  opacity: 0;
}

.tabCopy:hover .copyIcon {
  opacity: 1;
}

.value:hover .copyIcon {
  opacity: 1;
}

.small-headline {
  color: #444262;
}

.checkbox-tip {
  margin: 0;
}

div.v-list-item__subtitle.subtitle {
  color: rgba(136, 136, 136, 100);
  font-size: 0.8em;
  text-align: left;
}

div.value {
  color: rgba(16, 16, 16, 100);
  font-size: 0.8em;
  text-align: left;
}

div.diagram-container {
  height: calc(100% - 50px);
  background-color: #fff;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  display: -webkit-flex;
}

div.bottom-border {
  border-top: 1px solid #6c757d;
}

div.bottom-container {
  z-index: 100;
  width: 100%;
}

div.space-left {
  padding-left: 330px;
}

div.bottom-container.bottom-full {
}

div.bottom-container.bottom-half {
  height: 400px;
  overflow-y: scroll;
  overflow-x: scroll;
}

div.bottom-container.bottom-zero {
  height: 0;
}

div.v-tabs.bottom-container {
  border-bottom: 1px solid #e6e4e6;
  border-top: 1px solid #e6e4e6;
  background-color: #f3f4f9;
}

/* div.bottom-container div.el-table .el-table__body .el-table__cell {
  padding: 0;
} */

div.type-switch {
  /* border: 1px solid red; */
  margin: auto 0 auto 15px;
  /* margin: auto; */
  padding: auto;
  padding-top: 10px;
  height: 44px;
  /* margin-top: 15px; */
  /* margin-left: 335px; */
}

button.process-menu {
  padding: 0 10px;
}

button.span-left.process-menu {
  margin: 0 0 0 330px;
}

button.process-menu span {
  color: rgba(33, 33, 33, 100);
  font-size: 0.8em;
}

div.stretch {
  min-height: calc(100vh - 113px);
}

.activity-bottom-left-position {
  position: absolute;
  left: -0.7em;
  bottom: -0.25em;
}

.badge {
  display: inline-block;
  min-width: 10px;
  padding: 3px 7px;
  font-weight: bold;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  border-radius: 6px;
  background-color: #70b8db;
  border: 0;
  margin-right: 10px;
  color: #fff;
}

.closed-incidents,
.activity-instance-canceled,
.activity-instance-completed,
.instance-count,
.instance-incidents {
  cursor: pointer;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 120px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  padding: 0px 16px;
  z-index: 1;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.menu-border {
  border-bottom: 1px solid rgba(187, 187, 187, 1);
}

div.v-sheet.v-card.detail-card:not(.v-sheet--outlined) {
  box-shadow: 0 0px 0px 0px;
}

/*
.badge i {
  margin-right: 5px;
} */

.badge-total {
  background-color: #b1abb6;
}

.badge-instance {
  background-color: #57928d;
}

.badge-incident {
  background-color: #fa4f07;
}

.badge-total i,
.badge-instance i,
.badge-incident i {
  margin-right: 2px;
}

.badge.badge-query {
  margin-left: 10px;
  background-color: #83829a;
}

.badge-all-instance {
  background-color: #444262;
}

.badge-menu.badge-pause {
  background-color: #ff7754;
}

.badge-menu.badge-move {
  background-color: #312651;
}

.badge-menu.badge-rotate,
.badge-menu.badge-play {
  background-color: #57928d;
}

.badge-menu.badge-gear {
  background-color: #312651;
}

.badge-menu {
  cursor: pointer;
}

.badge-menu i {
  text-align: center;
  margin: auto;
}

div.popover-title {
  margin-bottom: 10px;
  font-weight: bold;
}

button.v-btn.start-instructions:not(.v-btn--disabled) {
  background-color: #312651;
}

/deep/
button.v-btn.start-instructions:not(.v-btn--disabled)
span.v-btn__content {
  color: #ffffff;
}

button.v-btn.start-instructions {
  border-right: 0px;
  margin: 16px 0 0 16px;
}

.checkbox-label {
  color: #444262;
}
</style>

<style>
.el-message .el-icon-success {
  color: #444262;
}

.el-message--success .el-message__content {
  color: #444262;
}

.el-notification {
  min-width: 380px;
  border-radius: 4px;
  border-width: 1px;
  border-style: solid;
  overflow: hidden;
  background-color: #fef0f0;
  border-color: #fde2e2;
}

.el-notification__title {
  color: #f56c6c;
  font-size: 14px;
  font-weight: 400;
}

.el-icon-error {
  font-size: 16px;
}

.el-notification__icon {
  height: auto;
  width: auto;
}
</style>
