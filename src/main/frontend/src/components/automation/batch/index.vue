<template>
  <div style="overflow:hidden;border-top: 1px solid rgba(187, 187, 187, 1);height: 100%" class="d-flex flex-column">
    <div class="d-flex flex-row" style="align-items: center;padding: 14px 15px">
      <v-breadcrumbs :items="breadcrumbs" style="background-color: #e8eff7;padding: 0;border: none" divider="|" />
      <div style="background-color: #e8eff7;margin-left: 10px">
        <span class="badge badge-instance" style="background-color: #57928d;margin-right:0;">
          <v-icon size="15" left color="white">mdi-play</v-icon>{{
            runtimeBatch.count
          }}</span>
      </div>
      <v-breadcrumbs
        :items="idBreadcrumbs"
        style="background-color: #e8eff7;padding: 0;border: none"
        divider="|"
      />
    </div>

    <v-card class="detail-card" style="border-top: 1px solid rgba(187, 187, 187, 1);flex: 1;height: 0">
      <div class="d-flex flex-column" style="height: 100%">
        <el-row type="flex" justify="start" class="menu-border" style="border-bottom:1px solid rgba(187, 187, 187, 1);">
          <el-col :span="2.5">
            <v-btn
              large
              text
              class="process-menu"
              width="110px"
              v-if="!typeSwitch && !batchDetail.suspended"
              :disabled="runtimeShow"
              @click="suspenedChange()"
              style="border-right:1px solid rgba(187, 187, 187, 1)"
            >
              <v-icon size="16" color="#83829A" style="margin-right:6px;">
                mdi-motion-pause-outline
              </v-icon>
              <span style="color: #444262" v-if="!runtimeShow">{{ $t('pause') }}</span>
              <span style="color: #bdbdbd" v-if="runtimeShow">{{ $t('pause') }}</span>
            </v-btn>
          </el-col>
          <el-col :span="2.5">
            <v-btn
              large
              text
              class="process-menu"
              width="110px"
              v-if="!typeSwitch && batchDetail.suspended"
              :disabled="runtimeShow"
              @click="suspenedChange()"
              style="border-right:1px solid rgba(187, 187, 187, 1);"
            >
              <v-icon size="16" color="#83829A" style="margin-right:6px;">
                mdi-restart
              </v-icon>
              <span style="color: #444262" v-if="!runtimeShow">{{ $t('active') }}</span>
              <span style="color: #bdbdbd" v-if="runtimeShow">{{ $t('active') }}</span>
            </v-btn>
          </el-col>
          <el-col :span="2.5">
            <v-btn
              large
              text
              class="process-menu"
              width="110px"
              v-if="!typeSwitch"
              :disabled="runtimeShow"
              @click="retrieJob()"
              style="border-right:1px solid rgba(187, 187, 187, 1);"
            >
              <v-icon size="16" color="#83829A" style="margin-right:6px;">
                mdi-redo
              </v-icon>
              <span style="color: #444262" v-if="!runtimeShow">{{ $t('addRetry') }}</span>
              <span style="color: #bdbdbd" v-if="runtimeShow">{{ $t('addRetry') }}</span>
            </v-btn>
          </el-col>
          <el-col :span="2.5">
            <v-btn
              large
              text
              class="process-menu"
              width="110px"
              v-if="!typeSwitch"
              :disabled="runtimeShow"
              @click="showDelete = true"
              style="border-right:1px solid rgba(187, 187, 187, 1);"
            >
              <v-icon size="16" color="#83829A" style="margin-right:6px;">
                mdi-delete-forever-outline
              </v-icon>
              <span style="color: #444262" v-if="!runtimeShow">{{ $t('delete') }}</span>
              <span style="color: #bdbdbd" v-if="runtimeShow">{{ $t('delete') }}</span>
            </v-btn>
          </el-col>
          <el-col :span="2.5">
            <v-btn
              large
              text
              class="process-menu"
              width="330px"
              v-if="typeSwitch"
              :disabled="runtimeShow"
              @click="deleteHistoryBatch.display = true"
              style="border-right:1px solid rgba(187, 187, 187, 1);"
            >
              <v-icon size="16" color="#83829A" style="margin-right:6px;">
                mdi-delete-forever-outline
              </v-icon>
              <span style="color: #444262" v-if="!runtimeShow">{{ $t('delete') }}</span>
              <span style="color: #bdbdbd" v-if="runtimeShow">{{ $t('delete') }}</span>
            </v-btn>
          </el-col>
          <el-col :span="2.5">
            <v-switch
              color="#312651"
              class="type-switch"
              v-model="typeSwitch"
              flat
              inset
              @change="changeSwitch()"
            >
              <template #label>
                <span v-if="typeSwitch"><span style="color: #83829a;font-size: 14px">{{ $t('runtime') }}/</span>
                  <span style="font-weight: bold; color: #444262;font-size: 14px">{{ $t('finished') }}</span></span>
                <span v-else><span style="font-weight: bold; color: #444262;font-size: 14px">{{ $t('runtime') }}</span>
                  <span style="color: #83829a;font-size: 14px">/{{ $t('finished') }}</span></span>
              </template>
            </v-switch>
          </el-col>
          <v-spacer />
          <el-col :span="2.5">
            <v-btn
              large
              text
              class="process-menu"
              @click="createBatch()"
              style="border-right:1px solid rgba(187, 187, 187, 1);border-left: 1px solid rgba(187, 187, 187, 1)"
            >
              <v-icon size="16" color="#83829A" style="margin-right:6px;">
                mdi-plus
              </v-icon>
              <span style="color: #444262;font-size:14px;">{{ $t('create') }}</span>
            </v-btn>
          </el-col>
          <el-col :span="2.5" v-show="!typeSwitch">
            <v-btn
              large
              text
              class="process-menu"
              @click="seachDialog.display = true"
              style="border-right:1px solid rgba(187, 187, 187, 1);"
            >
              <v-icon size="16" color="#83829A" style="margin-right:6px;">
                mdi-magnify
              </v-icon>
              <span style="color: #444262">{{ $t('query') }}</span>
            </v-btn>
          </el-col>
          <el-col :span="2.5">
            <v-btn
              large
              text
              class="process-menu"
              disabled
            >
              <v-icon size="20" color="#83829A">
                mdi-dots-horizontal
              </v-icon>
            </v-btn>
          </el-col>
        </el-row>
        <div class="d-flex flex-row" style="flex: 1;height: 0">
          <div style="z-index:199;width:330px;border-right: 1px solid rgba(187, 187, 187, 1);height:100%;overflow-x:hidden;overflow-y:auto;padding-bottom:50px;">
            <!-- <el-skeleton :rows="13" animated v-show="!showBatchDetail" style="padding:10px 10px 10px 10px;" /> -->
            <div v-show="!showBatchDetail" style="text-align: center;height:100%;padding-top:20px;">
              <v-icon size="16" color="#FF7754">mdi-cursor-default-click</v-icon>&nbsp;
              <span style="color: #83829A;font-size: 16px;">{{ $t('plsSelectRecordRight') }}</span>
            </div>
            <v-list-item v-show="showBatchDetail">
              <v-list-item-content>
                <v-list-item-subtitle class="subtitle">
                  ID
                </v-list-item-subtitle>
                <div class="value" style="margin-top: 5px">
                  {{ batchDetail.id == "" ? "-" : batchDetail.id }}
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-show="showBatchDetail">
              <v-list-item-content>
                <v-list-item-subtitle class="subtitle">
                  {{ $t('startTime') }}
                </v-list-item-subtitle>
                <div class="value" style="margin-top: 5px">
                  {{ batchDetail.startTime == null ? "-" : formatDateTime(batchDetail.startTime) }}
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-show="showBatchDetail">
              <v-list-item-content>
                <v-list-item-subtitle class="subtitle">
                  {{ $t('executeTime') }}
                </v-list-item-subtitle>
                <div class="value" style="margin-top: 5px">
                  {{ batchDetail.executionStartTime == null ? "-" : formatDateTime(batchDetail.executionStartTime) }}
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="typeSwitch" v-show="showBatchDetail">
              <v-list-item-content>
                <v-list-item-subtitle class="subtitle">
                  {{ $t('endTime') }}
                </v-list-item-subtitle>
                <div class="value" style="margin-top: 5px">
                  {{ batchDetail.endTime == null ? "-" : formatDateTime(batchDetail.endTime) }}
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-show="showBatchDetail">
              <v-list-item-content>
                <v-list-item-subtitle class="subtitle">
                  {{ $t('type') }}
                </v-list-item-subtitle>
                <div class="value" style="margin-top: 5px">
                  {{ batchDetail.type == null ? "-" : batchDetail.type }}
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-show="showBatchDetail">
              <v-list-item-content>
                <v-list-item-subtitle class="subtitle">
                  {{ $t('user') }}
                </v-list-item-subtitle>
                <div class="value" style="margin-top: 5px">
                  {{ batchDetail.createUserId == null ? "-" : batchDetail.createUserId }}
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-show="showBatchDetail">
              <v-list-item-content>
                <v-list-item-subtitle class="subtitle">
                  总Job数
                </v-list-item-subtitle>
                <div class="value" style="margin-top: 5px">
                  {{ batchDetail.totalJobs == null ? "-" : batchDetail.totalJobs }}
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="!typeSwitch" v-show="showBatchDetail">
              <v-list-item-content>
                <v-list-item-subtitle class="subtitle">
                  剩余Job
                </v-list-item-subtitle>
                <div class="value" style="margin-top: 5px">
                  {{ batchDetail.remainingJobs == null ? "-" : batchDetail.remainingJobs }}
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-show="showBatchDetail">
              <v-list-item-content>
                <v-list-item-subtitle class="subtitle">
                  每种子批处理Job
                </v-list-item-subtitle>
                <div class="value" style="margin-top: 5px">
                  {{ batchDetail.batchJobsPerSeed == null ? "-" : batchDetail.batchJobsPerSeed }}
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-show="showBatchDetail">
              <v-list-item-content>
                <v-list-item-subtitle class="subtitle">
                  每批Job调度次数
                </v-list-item-subtitle>
                <div class="value" style="margin-top: 5px">
                  {{ batchDetail.invocationsPerBatchJob == null ? "-" : batchDetail.invocationsPerBatchJob }}
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-show="showBatchDetail">
              <v-list-item-content>
                <v-list-item-subtitle class="subtitle">
                  {{ $t('batchJobDefKey') }}
                </v-list-item-subtitle>
                <div class="value" style="margin-top: 5px">
                  {{ batchDetail.batchJobDefinitionId == null ? "-" : batchDetail.batchJobDefinitionId }}
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-show="showBatchDetail">
              <v-list-item-content>
                <v-list-item-subtitle class="subtitle">
                  {{ $t('watchJobDefKey') }}
                </v-list-item-subtitle>
                <div class="value" style="margin-top: 5px">
                  {{ batchDetail.monitorJobDefinitionId == null ? "-" : batchDetail.monitorJobDefinitionId }}
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-show="showBatchDetail">
              <v-list-item-content>
                <v-list-item-subtitle class="subtitle">
                  {{ $t('childJobDefId') }}
                </v-list-item-subtitle>
                <div class="value" style="margin-top: 5px">
                  {{ batchDetail.seedJobDefinitionId == null ? "-" : batchDetail.seedJobDefinitionId }}
                </div>
              </v-list-item-content>
            </v-list-item>
          </div>
          <div style="display: flex; flex-direction: column; flex: 1;width: 0">
            <!-- 进行中的 -->
            <el-row
              v-if="!typeSwitch"
              class="diagram-container"
              style="padding:0;flex: 1;height: 0"
            >
              <el-table
                :data="runtimeBatch.items"
                border
                width="100%"
                height="100%"
              >
                <el-table-column :label="$t('progress')" prop="progress">
                  <template slot-scope="props">
                    <el-progress :text-inside="true" :stroke-width="16" color="#444262" :percentage="props.row.progress" />
                  </template>
                </el-table-column>
                <el-table-column label="ID" prop="id" width="330">
                  <template slot-scope="props">
                    <span
                      @click="getBatchStatistics(props.row.id)"
                      style="color: #1976d2;cursor:pointer;"
                    >{{ props.row.id }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('type')" prop="type" min-width="200">
                  <template slot-scope="props">
                    {{ props.row.type }}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('user')" prop="createUserId" />
                <el-table-column :label="$t('startTime')" prop="startTime" min-width="200">
                  <template slot-scope="props">
                    {{ formatDateTime(props.row.startTime) }}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('failJobCount')" prop="failedJobs" min-width="150">
                  <template slot-scope="props">
                    {{ props.row.failedJobs }}
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
            <!-- 已完成的 -->
            <el-row
              v-if="typeSwitch"
              class="diagram-container"
              style="padding:0;height:90%;"
            >
              <el-table
                :data="historyBatch.items"
                border
                width="100%"
                height="100%"
                v-loading="historyBatch.loading"
                @sort-change="historyBatchSort"
                :default-sort="{prop: historyBatch.sortBy, order: historyBatch.sortOrder == 'desc' ? 'descending' : 'ascending'}"
              >
                <el-table-column label="ID" prop="id" width="330">
                  <template slot-scope="props">
                    <span
                      @click="getHistoryBatchById(props.row.id)"
                      style="color: #1976d2;cursor:pointer;"
                    >{{ props.row.id }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('type')" prop="type" min-width="200">
                  <template slot-scope="props">
                    {{ props.row.type }}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('user')" prop="createUserId" />
                <el-table-column :label="$t('startTime')" prop="startTime" sortable="custom" min-width="200">
                  <template slot-scope="props">
                    {{ formatDateTime(props.row.startTime) }}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('endTime')" prop="endTime" sortable="custom" min-width="200">
                  <template slot-scope="props">
                    {{ formatDateTime(props.row.endTime) }}
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
            <!-- 分页 -->
            <el-row style="padding:0;height:10%;" v-if="typeSwitch">
              <el-col :span="12" :offset="6">
                <div
                  class="text-center mb-2 my-2"
                  v-show="historyBatch.pageCount > 1"
                >
                  <v-pagination
                    v-model="historyBatch.page"
                    :length="historyBatch.pageCount"
                    total-visible="20"
                    color="#FF7754"
                  />
                </div>
              </el-col>
            </el-row>
            <re-size-layout
              class="bottom-border"
              ref="resizeLayoutBottom"
              @setTableHeight="setTableHeight"
              :min-height="50"
              v-if="!typeSwitch"
            >
              <v-tabs
                background-color="#fafafa"
                v-model="tab"
                color="#444262"
                class="bottom-container"
              >
                <v-tabs-slider color="#FF7754" />
                <v-tab key="failJob">{{ $t('failedJob') }}</v-tab>
              </v-tabs>
              <v-tabs-items
                v-model="tab"
                class="bottom-container"
                style="overflow-x:hidden;overflow-y: auto;height: 100%;"
              >
                <v-tab-item key="failJob" transition="false" style="height: 100%;">
                  <el-table
                    :data="failJob"
                    border
                    :max-height="tableMaxHeight"
                  >
                    <el-table-column label="ID" prop="id" width="330px">
                      <template slot-scope="props">
                        {{ props.row.id }}
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('errMsg')" prop="exceptionMessage">
                      <template slot-scope="props">
                        {{ props.row.exceptionMessage }}
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('operate')" width="150px">
                      <template slot-scope="props">
                        <span
                          class="badge badge-rotate badge-menu"
                          @click="retryJob(props.row)"
                        ><v-icon size="10" color="white">mdi-rotate-right</v-icon></span>
                        <span
                          class="badge badge-menu"
                          style="background-color: #312651"
                          @click="detail(props.row)"
                        ><v-icon size="10" color="white">mdi-clock</v-icon></span>
                        <span
                          class="badge badge-trash badge-menu"
                          @click="deleteJob(props.row)"
                          style="background-color: #FF7754"
                        ><v-icon size="10" color="white">mdi-delete</v-icon></span>
                      </template>
                    </el-table-column>
                  </el-table>
                </v-tab-item>
              </v-tabs-items>
            </re-size-layout>
          </div>
        </div>
      </div>
    </v-card>
    <v-dialog v-model="showDelete" max-width="500">
      <v-card>
        <v-card-title class="headline" style="color: #444262">
          {{ $t('deleteBatch') }}
        </v-card-title>
        <v-card-text>
          {{ $t('deleteBatchTips') }}
          <v-radio-group v-model="cascade">
            <v-radio :label="$t('keepHistoryLogs')" color="#FF7754" value="false" />
            <v-radio :label="$t('dropHistoryLogs')" color="#FF7754" value="true" />
          </v-radio-group>
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer />
          <v-btn text @click="showDelete = false"> {{ $t('cancel') }} </v-btn>
          <v-btn style="color: #ffffff" color="#FF7754" @click="deleteBatch()">
            {{ $t('confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="jobLogs.display" max-width="1800">
      <v-card>
        <v-card-title class="headline" style="color: #444262">
          {{ $t('jobLog') }}
        </v-card-title>
        <v-card-text>
          <el-table
            v-loading="jobLogs.loading"
            :data="jobLogs.items"
            style="width: auto"
            height="500"
            border
            @sort-change="jobLogSortChange"
            :default-sort="{prop: jobLogs.sortBy, order: jobLogs.sortOrder == 'desc' ? 'descending' : 'ascending'}"
          >
            <el-table-column
              align="start"
              :label="$t('status')"
              width="80"
            >
              <template slot-scope="props">
                {{ formatJobLogStatus(props.row) }}
              </template>
            </el-table-column>

            <el-table-column
              prop="jobDefinitionType"
              :label="$t('type')"
              width="200"
            />

            <el-table-column type="expand">
              <template slot-scope="props">
                <p style="padding: 0 25px; margin-top: 10px">
                  {{ $t('message') }}: {{ props.row.jobExceptionMessage }}
                </p>
              </template>
            </el-table-column>
            <el-table-column :label="$t('time')" width="180" sortable="custom" prop="timestamp">
              <template slot-scope="props">
                {{ formatDateTime(props.row.timestamp) }}
              </template>
            </el-table-column>
            <el-table-column prop="jobId" label="Job ID" width="300">
              <template slot-scope="props">
                <div class="tabCopy">
                  {{ props.row.jobId }}
                  <v-icon
                    class="copyIcon"
                    v-show="props.row.jobId"
                    style="cursor: pointer"
                    color="#FF7754"
                    :title="$t('clickCopy') + props.row.jobId"
                    size="14"
                    @click="copy(props.row.jobId)"
                  >
                    mdi-file-move
                  </v-icon>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              prop="jobDefinitionConfiguration"
              :label="$t('config')"
              width="180"
            />

            <el-table-column
              prop="hostname"
              label="Host Name"
              width="180"
            />
            <el-table-column
              prop="jobPriority"
              :label="$t('priority')"
              width="80"
            />

            <el-table-column label="Hostname" prop="hostname" />

            <el-table-column prop="jobRetries"
                             :label="$t('retry')"
                             width="80" />
          </el-table>
          <div
            class="text-center mb-2 my-2"
            v-show="jobLogs.pageCount > 1"
          >
            <v-pagination
              v-model="jobLogs.page"
              :length="jobLogs.pageCount"
              total-visible="20"
              color="#FF7754"
            />
          </div>
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer />
          <v-btn style="color: #ffffff" color="#FF7754" @click="jobLogs.display = false">
            {{ $t('close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="jobDeleteShow.display" max-width="350">
      <v-card>
        <v-card-title class="headline" style="color: #444262">
          {{ $t('deleteJob') }}
        </v-card-title>
        <v-card-text>
          {{ $t('deleteJobTipsWithId',{id:jobItem.id}) }}
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer />
          <v-btn text @click="jobDeleteShow.display = false"> {{ $t('cancel') }} </v-btn>
          <v-btn style="color: #ffffff" color="#FF7754" @click="jobDelete()">
            {{ $t('confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteHistoryBatch.display" max-width="350">
      <v-card>
        <v-card-title class="headline" style="color: #444262">
          {{ $t('deleteBatch') }}
        </v-card-title>
        <v-card-text>
          {{ $t('deleteBatchTips') }}
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer />
          <v-btn text @click="deleteHistoryBatch.display = false"> {{ $t('cancel') }} </v-btn>
          <v-btn style="color: #ffffff" color="#FF7754" @click="goDeleteHistoryBatch()">
            {{ $t('confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="seachDialog.display" max-width="500">
      <v-card>
        <v-card-title class="headline" style="color: #444262">
          {{ $t('searchBatch') }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col style="padding-top: 0;padding-bottom: 0;">
              <v-radio-group v-model="seachDialog.seachFormAfter.radioGroup" row>
                <v-radio :label="$t('all')" color="#FF7754" value="all" />
                <v-radio :label="$t('includeIncident')" color="#FF7754" value="withFailures" />
                <v-radio :label="$t('excludeIncident')" color="#FF7754" value="withoutFailures" />
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row>
            <v-col style="padding-top: 0;padding-bottom: 0;">
              <v-text-field :label="$t('starterUserId')" v-model="seachDialog.seachFormAfter.userID" />
            </v-col>
          </v-row>
          <v-row>
            <v-col style="padding-top: 0;padding-bottom: 0;">
              <v-menu
                ref="startedAfter"
                v-model="seachDialog.seachFormAfter.displayStartedAfter"
                :close-on-content-click="false"
                :nudge-left="80"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="seachDialog.seachFormAfter.startedAfter"
                    :label="$t('startTimeAfter')"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    style="font-size: 14px"
                  >
                    <template #label>
                      <div style="font-size: 14px">
                        {{ $t('startTimeAfter') }}
                      </div>
                    </template>
                  </v-text-field>
                </template>
                <v-date-picker
                  v-model="seachDialog.seachFormAfter.startedAfter"
                  @input="
                    seachDialog.seachFormAfter.displayStartedAfter = false;
                  "
                >
                  <v-spacer />
                  <v-btn
                    text
                    color="primary"
                    @click="
                      seachDialog.seachFormAfter.startedAfter = '';
                      $refs.startedAfter.save(
                        seachDialog.seachFormAfter.startedAfter
                      );
                    "
                  >
                    {{ $t('reset') }}
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col style="padding-top: 0;padding-bottom: 0;">
              <v-menu
                ref="startedBefore"
                v-model="seachDialog.seachFormAfter.displayStartedBefore"
                :close-on-content-click="false"
                :nudge-left="80"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="seachDialog.seachFormAfter.startedBefore"
                    :label="$t('startTimeBefore')"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    style="font-size: 14px"
                  >
                    <template #label>
                      <div style="font-size: 14px">
                        {{ $t('startTimeBefore') }}
                      </div>
                    </template>
                  </v-text-field>
                </template>
                <v-date-picker
                  v-model="seachDialog.seachFormAfter.startedBefore"
                  @input="
                    seachDialog.seachFormAfter.displayStartedBefore = false;
                  "
                >
                  <v-spacer />
                  <v-btn
                    text
                    color="primary"
                    @click="
                      seachDialog.seachFormAfter.startedBefore = '';
                      $refs.startedBefore.save(
                        seachDialog.seachFormAfter.startedBefore
                      );
                    "
                  >
                    {{ $t('reset') }}
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer />
          <v-btn text @click="seachDialog.display = false"> {{ $t('cancel') }} </v-btn>
          <v-btn style="color: #ffffff" color="#FF7754" @click="seachData()">
            {{ $t('confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import batchRequest from "@/api/batch";
import utils from "@/utils/utils";
import ReSizeLayout from "@/components/common/ReSizeLayout";

export default {
  components: {
    ReSizeLayout,
  },
  data() {
    return {
      deleteHistoryBatch: {
        display: false,
      },
      jobLogs: {
        page: 0,
        pageCount: 0,
        itemsPerPage: 50,
        totalCount: 0,
        loading: true,
        display: false,
        sortBy: "timestamp",
        sortOrder: "desc",
        items:[],
      },
      cascade: false,
      showDelete: false,
      expandTabs: [0],
      bottom: 1,
      showBatchDetail: false,
      seachDialog: {
        display: false,
        seachForm: {
          radioGroup: "all",
          userID: null,
          startedAfter: null,
          startedBefore: null,
        },
        seachFormAfter: {
          radioGroup: "all",
          userID: null,
          startedAfter: null,
          startedBefore: null,
        },
      },
      runtimeShow: true,
      tab: 0,
      typeSwitch: false,
      left: true,
      breadcrumbs: [
        {
          text: this.$t("mainMenus.batch"),
          disabled: true,
          href: "",
        },
      ],
      idBreadcrumbs: [
        {
          text: "",
          disabled: true,
          href: "",
        },
        {
          text: "",
          disabled: true,
          href: "",
        },
      ],
      runtimeBatch: {
        sortBy: "id",
        sortOrder: "desc",
        loading: true,
        count: 0,
        items:[],
      },
      jobDeleteShow: {
        display: false,
      },
      batchDetail: {
        id: null,
        type: null,
        endTime: null,
        totalJobs: null,
        batchJobsPerSeed: null,
        jobsCreated: null,
        invocationsPerBatchJob: null,
        seedJobDefinitionId: null,
        monitorJobDefinitionId: null,
        batchJobDefinitionId: null,
        suspended: null,
        tenantId: null,
        createUserId: null,
        startTime:null,
        executionStartTime:null,
        remainingJobs: null,
        completedJobs: null,
        failedJobs: null,
        firstName: null,
        lastName: null,
      },
      failJob: [],
      timer: null,
      jobItem: {},
      historyBatch: {
        items: [],
        page: 0,
        pageCount: 0,
        itemsPerPage: 50,
        totalCount: 0,
        loading: true,
        sortBy: "startTime",
        sortOrder: "desc",
      },
      tableMaxHeight: "10",
    };
  },
  watch: {
    "$i18n.locale": {
      handler(val){
        let self=this;
        self.breadcrumbs[0].text = self.$t("mainMenus.batch");
      },
    },
    "historyBatch.page": {
      handler() {
        this.getHistoryDataPage();
      }
    },
    "jobLogs.page": {
      handler(){
        this.detailPage();
      }
    }
  },
  mounted() {
    this.changeSwitch();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    setTableHeight() {
      let self = this;
      let height = self.$refs.resizeLayoutBottom.getCanShowHeight();
      let paginationHeight = 59.59;
      if (self.tab === 0) {
        // 失败的job,没有分页
      }

      this.$nextTick(() => {
        this.tableMaxHeight = height;
      });
    },
    createBatch() {
      this.$router.push({name: "batch-operation-detail"});
    },
    async seachData(){
      if(this.seachDialog.seachFormAfter.radioGroup == "all") {
        this.seachDialog.seachForm.radioGroup = this.seachDialog.seachFormAfter.radioGroup;
      }
      if(this.seachDialog.seachFormAfter.radioGroup == "withFailures" ){
          this.seachDialog.seachForm.radioGroup = this.seachDialog.seachFormAfter.radioGroup;
        }
        if(this.seachDialog.seachFormAfter.radioGroup == "withoutFailures" ){
          this.seachDialog.seachForm.radioGroup = this.seachDialog.seachFormAfter.radioGroup;
        }
        if(this.seachDialog.seachFormAfter.userID){
          this.seachDialog.seachForm.userID = this.seachDialog.seachFormAfter.userID;
        }
        if (this.seachDialog.seachFormAfter.startedBefore !== null ) {
          this.seachDialog.seachForm.startedBefore = this.seachDialog.seachFormAfter.startedBefore;
        }
        if (this.seachDialog.seachFormAfter.startedAfter !== null) {
          this.seachDialog.seachForm.startedAfter = this.seachDialog.seachFormAfter.startedAfter;
        }
        await this.getData();
      this.seachDialog.display = false;
    },
    async goDeleteHistoryBatch(){
      await batchRequest.deleteHistoryBatch(this.batchDetail.id);
      Object.keys(this.batchDetail).forEach((key) => (this.batchDetail[key] = null));
      this.$notify.success(this.$t("delBatchSuccess"));
      this.showBatchDetail = false;
      await this.getHistoryData();
      this.deleteHistoryBatch.display = false;
    },
    copy(value) {
      navigator.clipboard.writeText(value);
      this.$notify.success(this.$t("copySuccessWithTxt",{txt:value}));
    },
    jobLogSortChange(value) {
      this.jobLogs.sortBy = value.prop;
      this.jobLogs.sortOrder = value.order == "descending" ? "desc" : "asc";
      this.detailPage();
    },
    formatJobLogStatus(item) {
      var status = [];
      if (item.creationLog) {
        status.push("creation");
      }
      if (item.failureLog) {
        status.push("failure");
      }
      if (item.successLog) {
        status.push("success");
      }
      if (item.deletionLog) {
        status.push("deletion");
      }
      return status.join(" | ");
    },
    async detail(item) {
      this.jobItem = {};
      this.jobLogs.loading = true;
      this.jobLogs.totalCount = 0;
      this.jobLogs.page = 0;
      this.jobLogs.display = true;
      let params = {
        jobId: item.id,
      };
      let response = await batchRequest.getJobLogCount(params);
      this.jobLogs.totalCount = response.count;
      this.jobLogs.pageCount =
        Math.floor((response.count - 1) / this.jobLogs.itemsPerPage) + 1;
      this.jobLogs.page = 1;
      this.jobItem = item;
      console.log(this.jobItem);
    },
    async detailPage() {
      this.jobLogs.loading = true;
      if (!this.jobLogs.page) {
        this.jobLogs.items = [];
        return;
      }
      let params = {
        jobId: this.jobItem.id,
        firstResult: (this.jobLogs.page - 1) * this.jobLogs.itemsPerPage,
        maxResults: this.jobLogs.itemsPerPage,
        sortBy: this.jobLogs.sortBy,
        sortOrder: this.jobLogs.sortOrder
      };
      let response = await batchRequest.getJobLog(params);
      this.jobLogs.items = response;
      this.jobLogs.loading = false;
    },
    async retryJob(item){
      await batchRequest.jobRetries(item.id);
      this.$notify.success(this.$t("addRetrySuccessWithId",{id:item.id}));
    },
    async deleteJob(item) {
      this.jobItem = {};
      this.jobItem = item;
      this.jobDeleteShow.display = true;
    },
    async jobDelete() {
      await batchRequest.jobDelete(this.jobItem.id);
      this.$notify.success(this.$t("delJobSuccessWithId",{id:this.jobItem.id}));
      this.jobDeleteShow.display = false;
    },
    async deleteBatch() {
      let params = {
        cascade: this.cascade,
      };
      await batchRequest.deleteBatch(this.batchDetail.id, params);
      this.showDelete = false;
      this.getData();
      this.$notify.success(this.$t("delBatchSuccess"));
    },
    async retrieJob() {
      await batchRequest.retrieJob(this.batchDetail.batchJobDefinitionId);
      this.$notify.success(this.$t("addRetrySuccess"));
    },
    historyBatchSort(value){
      this.historyBatch.sortBy = value.prop;
      this.historyBatch.sortOrder = value.order == "descending" ? "desc" : "asc";
      this.getHistoryDataPage();
    },
    async suspenedChange() {
      let data = {};
      if(this.batchDetail.suspended){
        data.suspended = false;
      }else{
        data.suspended = true;
      }
      await batchRequest.suspenedChange(this.batchDetail.id, data);
      this.$notify.success(this.$t("batchSuccessWithOptAndId",{opt:this.$t(this.batchDetail.suspended?"active":"suspend"),id:this.batchDetail.id}));
      await this.getBatchStatistics(this.batchDetail.id);
    },
    async getBatchStatistics(value){
      Object.keys(this.batchDetail).forEach((key) => (this.batchDetail[key] = null));
      let params = {
        batchId: value
      };
      let response = await batchRequest.getBatchStatistics(params);
      this.idBreadcrumbs[1].text = response[0].id;
      let val = {
        jobDefinitionId: response[0].batchJobDefinitionId,
        noRetriesLeft: true,
        withException: true,
      };
      let res = await batchRequest.getJob(val);
      let user = await batchRequest.getProfile(response[0].createUserId);
      response[0].lastName = user.lastName;
      response[0].firstName = user.firstName;
      this.failJob = res;
      this.batchDetail = response[0];
      this.runtimeShow = false;
      this.showBatchDetail = true;
    },
    async getHistoryBatchById(id) {
      let response = await batchRequest.getHistoryBatchById(id);
      this.idBreadcrumbs[1].text = response.id;
      this.batchDetail = response;
      this.showBatchDetail = true;
      this.runtimeShow = false;
    },
    formatDateTime: utils.formatDateTime,
    async changeSwitch() {
      if(!this.typeSwitch){
        this.runtimeShow = true;
        this.showBatchDetail = false;
        Object.keys(this.batchDetail).forEach((key) => (this.batchDetail[key] = null));
        this.failJob=[];
        this.idBreadcrumbs[1].text = "";
        await this.getData();
        this.timer = setInterval(()=>{
	      this.getData();
        }, 3000);
      }else {
        this.runtimeShow = true;
        this.showBatchDetail = false;
        Object.keys(this.batchDetail).forEach((key) => (this.batchDetail[key] = null));
        this.idBreadcrumbs[1].text = "";
        clearInterval(this.timer);
        await this.getHistoryData();
      }
    },
    async getData() {
        let params = {};
        if(this.seachDialog.seachForm.radioGroup == "withFailures" ){
          params.withFailures = true;
        }
        if(this.seachDialog.seachForm.radioGroup == "withoutFailures" ){
          params.withoutFailures = true;
        }
        if(this.seachDialog.seachForm.userID){
          params.createdBy = this.seachDialog.seachForm.userID;
        }
        var formattedDate;
        if (this.seachDialog.seachForm.startedBefore !== null ) {
          formattedDate =
            utils.formatDateTime(
              this.seachDialog.seachForm.startedBefore,
              "yyyy-MM-DDTHH:mm:ss.SSS"
            ) +
            utils
              .formatDateTime(this.seachDialog.seachForm.startedBefore, "Z")
              .replace(":", "");
          params.startedBefore = formattedDate;
        }
        if (this.seachDialog.seachForm.startedAfter !== null) {
          formattedDate =
            utils.formatDateTime(
              this.seachDialog.seachForm.startedAfter,
              "yyyy-MM-DDTHH:mm:ss.SSS"
            ) +
            utils
              .formatDateTime(this.seachDialog.seachForm.startedAfter, "Z")
              .replace(":", "");
          params.startedAfter = formattedDate;
        }
        let response = await batchRequest.getBatchRuntimeList(params);
        let len = response.length;
        for(let i = 0; i < len; i++){
          response[i].progress = Math.round((response[i].completedJobs / response[i].totalJobs) * 100);
        }
        this.runtimeBatch.count = len;
        this.runtimeBatch.items = response;
    },
    async getHistoryData() {
      this.historyBatch.loading = true;
      this.historyBatch.totalCount = 0;
      this.historyBatch.page = 0;
      let params = {
        completed: true,
      };
      let response = await batchRequest.getHistoryBatchCount(params);
      this.historyBatch.totalCount = response.count;
      this.historyBatch.pageCount =
        Math.floor((response.count - 1) / this.historyBatch.itemsPerPage) + 1;
      this.historyBatch.page = 1;
    },
    async getHistoryDataPage() {
      this.historyBatch.loading = true;
      if (!this.historyBatch.page) {
        this.historyBatch.items = [];
        return;
      }
      let params = {
        completed: true,
        firstResult: (this.historyBatch.page - 1) * this.historyBatch.itemsPerPage,
        maxResults: this.historyBatch.itemsPerPage,
        sortBy: this.historyBatch.sortBy,
        sortOrder: this.historyBatch.sortOrder
      };
      let response = await batchRequest.getHistoryBatch(params);
      this.historyBatch.items = response;
      this.historyBatch.loading = false;
    },
    switchBottom(up) {
      if (up) {
        this.bottom = this.bottom + 1;
      } else {
        this.bottom = this.bottom - 1;
      }
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
  background-color: #FFF;
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
  font-size: 14px;
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
  border-bottom: 1px solid rgba(238, 238, 238, 100);
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
