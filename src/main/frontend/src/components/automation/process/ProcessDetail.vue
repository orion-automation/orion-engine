<template>
  <div style="border-top: 1px solid rgba(187, 187, 187, 1);height: 100%;" class="d-flex flex-column">
    <div class="d-flex flex-row" style="align-items: center;padding: 14px 15px">
      <v-breadcrumbs :items="breadcrumbs" style="background-color: #e8eff7;padding: 0;border: none" divider="|"/>
      <div style="background-color: #e8eff7;margin-left: 10px;font-size: 14px">
        <span class="badge badge-total"><v-icon size="14" color="white">mdi-source-branch</v-icon>{{
            breadcrumbSummary.version
          }}</span>
        <span class="badge badge-instance"><v-icon size="14" color="white">mdi-play</v-icon>{{
            breadcrumbSummary.instance
          }}</span>
        <span class="badge badge-incident"><v-icon size="14" color="white">mdi-alert-circle</v-icon>{{
            breadcrumbSummary.incident
          }}</span>
      </div>
    </div>

    <v-card v-show="!startDialog.display" class="detail-card"
            style="border-top: 1px solid rgba(187, 187, 187, 1);flex: 1;height: 0px;background-color: white"
    >
      <v-layout style="margin: 0;height: 100%" class="stretch">
        <re-size-drawer ref="resizeDrawer" @setLeftWidth="setLeftWidth">
          <v-icon class="navigation-icon" @click="switchLeft()">
            mdi-chevron-left
          </v-icon>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                <div class="d-flex flex-row" style="align-items: center;height: 23px">
                  {{ $t('processName') }}
                  <v-icon
                      v-show="process.suspended"
                      color="#444262"
                      size="12"
                      style="margin-right: 5px"
                  >mdi-pause-circle</v-icon>
                </div>
              </v-list-item-subtitle>
              <div class="value" style="margin-top: 5px">
                {{ process.name }}&nbsp;
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                {{ $t('version') }}
              </v-list-item-subtitle>
              <v-select
                  style="padding-top: 0; font-size: 14px"
                  @change="selectVersion()"
                  :items="versions"
                  :item-value="(item) => `${item.id}`"
                  :item-text="(item) => `${item.version}`"
                  v-model="version"
                  dense
              >
                <template #item="{item}">
                  <div class="d-flex flex-row" style="width: 100%">
                    {{ item.version }}
                    <v-spacer style="flex: 1"/>
                    <div style="display: block">
                      <span class="badge badge-instance" v-if="item.instances">
                        <v-icon size="10" color="white">mdi-play</v-icon>{{
                          item.instances
                        }}</span>
                      <span class="badge badge-incident" v-if="item.incidents">
                        <v-icon size="10" color="white">mdialert-circle</v-icon>{{
                          item.incidents
                        }}</span>
                    </div>
                  </div>
                </template>
              </v-select>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                {{ $t('versionTag') }}
              </v-list-item-subtitle>
              <div class="value">
                {{ process.versionTag }}
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                {{ $t('processDefId') }}
              </v-list-item-subtitle>
              <div class="value">
                {{ process.id }}
                <v-icon
                    class="copyIcon"
                    v-show="process.id"
                    style="cursor: pointer"
                    color="#FF7754"
                    :title="$t('clickCopy') + process.id"
                    size="12.8"
                    @click="copy(process.id)"
                >
                  mdi-file-move
                </v-icon>
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                {{ $t('processDefKey') }}
              </v-list-item-subtitle>
              <div class="value">
                {{ process.key }}
                <v-icon
                    class="copyIcon"
                    v-show="process.key"
                    style="cursor: pointer"
                    color="#FF7754"
                    :title="$t('clickCopy') + process.key"
                    size="12.8"
                    @click="copy(process.key)"
                >
                  mdi-file-move
                </v-icon>
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                {{ $t('processDeployId') }}
              </v-list-item-subtitle>

              <div class="value">
                <router-link
                    :to="{
                    name: 'deploy-index-detail',
                    query: { id:process.deploymentId },
                  }"
                >
                  {{ process.deploymentId }}
                </router-link>
                <v-icon
                    class="copyIcon"
                    v-show="process.deploymentId"
                    style="cursor: pointer"
                    color="#FF7754"
                    :title="$t('clickCopy') + process.deploymentId"
                    size="12.8"
                    @click="copy(process.deploymentId)"
                >
                  mdi-file-move
                </v-icon>
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                {{ $t('historyTimeToLive') }}
              </v-list-item-subtitle>
              <div class="value">
                {{ process.historyTimeToLive }}
                <v-icon
                    class="copyIcon"
                    v-show="process.historyTimeToLive"
                    style="cursor: pointer"
                    color="#FF7754"
                    :title="$t('clickCopy') + process.historyTimeToLive"
                    size="12.8"
                    @click="copy(process.historyTimeToLive)"
                >
                  mdi-file-move
                </v-icon>
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                {{ $t('tenantId') }}
              </v-list-item-subtitle>
              <div class="value">
                {{ process.tenantId }}
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                {{ $t('liveInstanceCount') }}
              </v-list-item-subtitle>
              <div style="margin-top: 5px">
                <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('currentVersionRunningProcess')"
                    placement="bottom-start"
                >
                  <span class="badge badge-instance"><v-icon size="10" color="white">mdi-play</v-icon>{{
                      process.instanceCount
                    }}</span>
                </el-tooltip>
                <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('allVersionRunningProcess')"
                    placement="bottom-start"
                >
                  <span class="badge badge-all-instance"><v-icon size="10" color="white">mdi-dots-vertical</v-icon>{{
                      process.allInstanceCount
                    }}</span>
                </el-tooltip>
              </div>
            </v-list-item-content>
          </v-list-item>
        </re-size-drawer>
        <div class="horizontal-collapsed" v-if="!left">
          <v-icon class="navigation-icon" @click="switchLeft()">
            mdi-chevron-right
          </v-icon>
        </div>
        <div style="display: flex; flex-direction: column; width: 100%">
          <el-row type="flex" justify="start">
            <v-btn
                large
                text
                class="process-menu"
                @click="toggleFullscreen(left)"
                :style="leftStyleMargin"
                style="border-right: 1px solid rgba(187, 187, 187, 1);"
            >
              <v-icon color="green">
                {{ left ? "mdi-fullscreen" : "mdi-fullscreen-exit" }}
              </v-icon>
              <span/>
            </v-btn>
            <v-spacer/>
            <v-btn
                large
                text
                class="process-menu"
                @click="designDialog.display=true"
                style="border-right: 1px solid rgba(187, 187, 187, 1);border-left: 1px solid rgba(187, 187, 187, 1)"
            >
              <v-icon size="16" color="#83829A" style="margin-right:6px;">
                mdi-code-block-tags
              </v-icon>
              <span style="color: #444262">{{ $t('designViewer') }}</span>
            </v-btn>
            <v-btn
                large
                text
                class="process-menu"
                :loading="startDialog.formLoading"
                @click="onStartProcess"
                style="border-right: 1px solid rgba(187, 187, 187, 1)"
            >
              <v-icon size="16" color="#83829A" style="margin-right:6px;">
                mdi-play-circle
              </v-icon>
              <span style="color: #444262">{{ $t('startProcess') }}</span>
            </v-btn>
            <v-btn
                large
                text
                class="process-menu"
                @click="deleteDialog.display = true"
                style="border-right: 1px solid rgba(187, 187, 187, 1);"
            >
              <v-icon size="16" color="#83829A" style="margin-right:6px;">
                mdi-delete-forever-outline
              </v-icon>
              <span style="color: #444262">{{ $t('deleteProcessDef') }}</span>
            </v-btn>
            <v-btn
                large
                text
                class="process-menu"
                v-show="!process.suspended"
                @click="suspendDialog.display = true"
                style="border-right: 1px solid rgba(187, 187, 187, 1);"
            >
              <v-icon size="16" color="#83829A" style="margin-right:6px;">
                mdi-motion-pause-outline
              </v-icon>
              <span style="color: #444262">{{ $t('suspend') }}</span>
            </v-btn>
            <v-btn
                large
                text
                class="process-menu"
                v-show="process.suspended"
                @click="suspendDialog.display = true"
                style="border-right: 1px solid rgba(187, 187, 187, 1);"
            >
              <v-icon size="16" color="#83829A" style="margin-right:6px;">mdi-restart</v-icon>
              <span style="color: #444262">{{ $t('active') }}</span>
            </v-btn>
            <v-btn
                large
                text
                class="process-menu"
                @click="onThrowSignal()"
                style="border-right: 1px solid rgba(187, 187, 187, 1);"
            >
              <v-icon size="16" color="#83829A" style="margin-right:6px;">
                mdi-broadcast
              </v-icon>
              <span style="color: #444262">{{ $t('sendSignal') }}</span>
            </v-btn>
            <v-btn
                large
                text
                class="process-menu"
                @click="deleteInstance()"
                style="border-right: 1px solid rgba(187, 187, 187, 1);"
            >
              <v-icon size="16" color="#83829A" style="margin-right:6px;">
                mdi-close-circle-multiple-outline
              </v-icon>
              <span style="color: #444262">{{ $t('deleteRunningInstance') }}</span>
            </v-btn>
          </el-row>
          <el-row
              class="diagram-container"
              v-show="bottom != 2"
              :style="leftStylePadding"
              style="border-top: 1px solid rgba(187, 187, 187, 1);"
          >
            <vue-bpmn
                ref="vueBpmnViwer"
                :node-properties="nodeProperties"
                :diagram-xml="xml"
                :node-actions="nodeActions"
                :instructions="instructions"
                :options="{ overlays: { defaults: { scale: true } } }"
                @onClickNode="onClickNode"
                @onGetCollaborations="onGetCollaborations"
            />
          </el-row>

          <re-size-layout
              class="bottom-border"
              ref="resizeLayoutBottom"
              @setTableHeight="setTableHeight"
              :min-height="50"
          >
            <v-tabs
                background-color="#fafafa"
                v-model="tab"
                color="#444262"
                class="bottom-container"
                style="flex: 0"
                :key="tabKeyComputed"
                :style="leftStylePadding"
            >
              <div class="vertical-collapsed">
                <v-icon class="navigation-icon" @click="switchBottom()">
                  {{ !bottom ? "mdi-chevron-down" : "mdi-chevron-up" }}
                </v-icon>
              </div>
              <v-tabs-slider color="#FF7754"/>
              <v-tab key="instance">{{ $t('processInstance') }}</v-tab>
              <v-tab key="incident">{{ $t('incident') }}</v-tab>
              <v-tab key="call">{{ $t('callProcessDef') }}</v-tab>
              <v-tab key="job">{{ $t('jobTaskDef') }}</v-tab>
              <v-tab key="edit">{{ $t('edit') }}</v-tab>
              <v-tab key="document"> {{ $t('document') }}</v-tab>
              <v-tab key="collaboration">{{ $t('collaborationProcess') }}</v-tab>
            </v-tabs>
            <v-tabs-items
                v-model="tab"
                :key="tabItemKey"
                class="bottom-container"
                :style="leftStylePadding"
                style="overflow-x:hidden;"
            >
              <v-tab-item key="instance" transition="false">
                <v-row style="margin: 0 20px">
                  <v-col style="padding: 0" cols="12" sm="4" md="2" lg="2">
                    <v-checkbox
                        style="padding-bottom: 10px"
                        v-model="instances.filter.withIncidents"
                        :label="$t('incident')"
                        color="#FF7754"
                        @change="getInstances()"
                        hide-details
                    >
                      <template #label>
                        <div
                            class="checkbox-label"
                            style="color: #444262; font-size: 14px"
                        >
                          {{ $t('incident') }}
                        </div>
                      </template>
                    </v-checkbox>
                  </v-col>

                  <v-col style="padding: 0" cols="12" sm="4" md="2" lg="2">
                    <v-checkbox
                        style="padding-bottom: 10px"
                        v-model="instances.filter.suspended"
                        :label="$t('suspend')"
                        color="#FF7754"
                        @change="getInstances()"
                        hide-details
                    >
                      <template #label>
                        <div
                            class="checkbox-label"
                            style="color: #444262; font-size: 14px"
                        >
                          {{ $t('suspend') }}
                        </div>
                      </template>
                    </v-checkbox>
                  </v-col>

                  <v-col style="padding: 0" cols="12" sm="4" md="4" lg="2">
                    <v-text-field
                        :label="$t('bussinessKey')"
                        v-model="instances.filter.businessKey"
                        @keydown.enter="getInstances()"
                        hide-details
                        style="font-size: 14px"
                    >
                      <template #label>
                        <div style="font-size: 14px">{{ $t('topic') }}Business Key</div>
                      </template>
                    </v-text-field>
                  </v-col>

                  <v-col style="padding: 0" cols="12" sm="4" md="4" lg="2">
                    <v-menu
                        ref="startedAfter"
                        v-model="instances.filter.dislayStartedAfter"
                        :close-on-content-click="false"
                        :nudge-left="80"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                      <template #activator="{ on, attrs }">
                        <v-text-field
                            v-model="instances.filter.startedAfter"
                            :label="$t('processStartAfterDate')"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            @change="getInstances()"
                            style="font-size: 14px"
                        >
                          <template #label>
                            <div style="font-size: 14px">
                              {{ $t('processStartAfterDate') }}
                            </div>
                          </template>
                        </v-text-field>
                      </template>
                      <v-date-picker
                          v-model="instances.filter.startedAfter"
                          @input="
                            instances.filter.dislayStartedAfter = false;
                            getInstances();
                          "
                      >
                        <v-spacer/>
                        <v-btn
                            text
                            color="primary"
                            @click="
                              instances.filter.startedAfter = '';
                              $refs.startedAfter.save(
                                instances.filter.startedAfter
                              );
                              getInstances();
                            "
                        >
                          {{ $t('reset') }}
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col style="padding: 0" cols="12" sm="4" md="4" lg="2">
                    <v-menu
                        v-model="instances.filter.dislayStartedBefore"
                        :close-on-content-click="false"
                        :nudge-left="80"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                      <template #activator="{ on, attrs }">
                        <v-text-field
                            v-model="instances.filter.startedBefore"
                            :label="$t('processStartBeforeDate')"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            @change="getInstances()"
                            style="font-size: 14px"
                        >
                          <template #label>
                            <div style="font-size: 14px">
                              {{ $t('processStartBeforeDate') }}
                            </div>
                          </template>
                        </v-text-field>
                      </template>
                      <v-date-picker
                          v-model="instances.filter.startedBefore"
                          @input="
                            instances.filter.dislayStartedBefore = false;
                            getInstances();
                          "
                      >
                        <v-spacer/>
                        <v-btn
                            text
                            color="primary"
                            @click="
                              instances.filter.startedBefore = '';
                              $refs.startedBefore.save(
                                instances.filter.startedBefore
                              );
                              getInstances();
                            "
                        >
                          {{ $t('reset') }}
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col
                      style="padding-right: 20px"
                      cols="12"
                      sm="4"
                      md="2"
                      lg="2"
                  >
                    <v-btn @click="setInstanceVariables()">
                      <template #default>
                        {{ $t('varSearch') }}
                        <span
                            v-show="instances.filter.variables.length"
                            class="badge badge-query"
                        >{{ instances.filter.variables.length }}</span>
                      </template>
                    </v-btn>
                  </v-col>
                </v-row>
                <el-table :data="instances.items"
                          v-loading="instances.loading"
                          border
                          ref="tableDemo"
                          :max-height="tableMaxHeight"
                          @sort-change="intanceSortChange"
                          :default-sort="{prop: instances.sortBy, order: instances.sortOrder == 'desc' ? 'descending' : 'ascending'}"
                >
                  <el-table-column :label="$t('status')" width="150">
                    <template slot-scope="props">
                      <template v-if="!props.row.withIncidents">
                        <v-icon
                            size="14"
                            color="#444262"
                            v-show="props.row.state==='COMPLETED'"
                        >
                          mdi-check-underline-circle
                        </v-icon>
                        <v-icon
                            size="14"
                            color="green"
                            v-show="props.row.state==='ACTIVE'"
                        >
                          mdi-play-box
                        </v-icon>
                        <v-icon
                            size="14"
                            color="orange"
                            v-show="props.row.state==='SUSPENDED'"
                        >
                          mdi-pause-octagon-outline
                        </v-icon>
                        <v-icon
                            size="14"
                            color="orange"
                            v-show="['EXTERNALLY_TERMINATED','INTERNALLY_TERMINATED'].includes(props.row.state)"
                        >
                          mdi-close-circle-outline
                        </v-icon>
                      </template>
                      <v-icon
                          size="14"
                          color="red"
                          v-show="props.row.withIncidents"
                      >
                        mdi-disc-alert
                      </v-icon>
                      {{ props.row.state }}
                    </template>
                  </el-table-column>


                  <el-table-column :label="$t('processInstanceId')" width="350">
                    <template slot-scope="props">
                      <div class="tabCopy">
                        <router-link
                            :to="{
                              name: 'instance-detail',
                              params: { id: props.row.id },
                              query: {},
                            }"
                        >
                          {{ props.row.id }}
                        </router-link>
                        <v-icon
                            class="copyIcon"
                            v-show="props.row.id"
                            style="cursor: pointer"
                            color="#FF7754"
                            :title="$t('clickCopy') + props.row.id"
                            size="14"
                            @click="copy(props.row.id)"
                        >
                          mdi-file-move
                        </v-icon>
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column prop="businessKey" :label="$t('topic')"/>

                  <el-table-column
                      prop="startTime"
                      :label="$t('startTime')"
                      width="180"
                      sortable="custom"
                  >
                    <template slot-scope="props">
                      {{ formatDateTime(props.row.startTime) }}
                    </template>
                  </el-table-column>

                  <el-table-column prop="endTime" :label="$t('endTime')" width="180">
                    <template slot-scope="props">
                      {{ formatDateTime(props.row.endTime) }}
                    </template>
                  </el-table-column>

                  <!-- <el-table-column :label="$t('operate')">
                    <template slot-scope="props">
                      <v-icon size="20" color="#0c29c8">mdi-dots-vertical</v-icon>
                    </template>
                  </el-table-column> -->
                </el-table>
                <div
                    class="text-center mb-2 my-2"
                    v-show="instances.pageCount > 1"
                >
                  <v-pagination
                      v-model="instances.page"
                      :length="instances.pageCount"
                      total-visible="20"
                      color="#FF7754"
                  />
                </div>
              </v-tab-item>
              <v-tab-item key="incident" transition="false">
                <v-row style="margin: 0 20px">
                  <v-col style="padding: 0" cols="12" sm="4" md="2" lg="2">
                    <v-checkbox
                        style="padding-bottom: 10px"
                        v-model="incidents.filter.failedJob"
                        :label="$t('errJob')"
                        color="#FF7754"
                        @change="getIncidents()"
                        hide-details
                    >
                      <template #label>
                        <div
                            class="checkbox-label"
                            style="color: #444262; font-size: 14px"
                        >
                          {{ $t('errJob') }}
                        </div>
                      </template>
                    </v-checkbox>
                  </v-col>

                  <v-col style="padding: 0" cols="12" sm="4" md="2" lg="2">
                    <v-checkbox
                        style="padding-bottom: 10px"
                        v-model="incidents.filter.failedExternalTask"
                        :label="$t('errExternalTask')"
                        color="#FF7754"
                        @change="getIncidents()"
                        hide-details
                    >
                      <template #label>
                        <div
                            class="checkbox-label"
                            style="color: #444262; font-size: 14px"
                        >
                          {{ $t('errExternalTask') }}
                        </div>
                      </template>
                    </v-checkbox>
                  </v-col>
                </v-row>
                <!-- <v-divider
                  style="margin: 0; border-color: rgba(0, 0, 0, 0.25)"
                /> -->
                <el-table :data="incidents.items"
                          v-loading="incidents.loading"
                          border
                          :max-height="tableMaxHeight"
                          @sort-change="incidentsSortChange"
                          :default-sort="{prop: incidents.sortBy, order: incidents.sortOrder == 'desc' ? 'descending' : 'ascending'}"
                >
                  <el-table-column type="expand">
                    <template slot-scope="props">
                      <p style="padding: 0 25px; margin-top: 10px">
                        <el-tooltip class="item" effect="dark" :content="$t('causeErrMsg')" placement="bottom-start">
                          <v-icon @click="loadMsgDetail('incident',props.row)" small color="#FF7754">
                            mdi-alert-box
                          </v-icon>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" :content="$t('rootCauseErrMsg')" placement="bottom-start">
                          <v-icon style="margin-left: 5px" @click="loadMsgDetail('root',props.row)" small
                                  color="#FF7754"
                          >
                            mdi-alert-box-outline
                          </v-icon>
                        </el-tooltip>
                        &nbsp;
                        {{ $t('message') }}: {{ props.row.incidentMessage }}
                      </p>
                    </template>
                  </el-table-column>

                  <el-table-column
                      align="center"
                      :label="$t('type')"
                      prop="incidentType"
                      width="100"
                  />

                  <el-table-column :label="$t('processInstanceId')" width="350">
                    <template slot-scope="props">
                      <div class="tabCopy">
                        <router-link
                            :to="{
                              name: 'instance-detail',
                              params: { id: props.row.processInstanceId },
                              query: {},
                            }"
                        >
                          {{ props.row.processInstanceId }}
                        </router-link>
                        <v-icon
                            class="copyIcon"
                            v-show="props.row.processInstanceId"
                            style="cursor: pointer"
                            color="#FF7754"
                            :title="$t('clickCopy') + props.row.processInstanceId"
                            size="14"
                            @click="copy(props.row.processInstanceId)"
                        >
                          mdi-file-move
                        </v-icon>
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column
                      prop="incidentTimestamp"
                      :label="$t('time')"
                      width="180"
                      sortable="custom"
                  >
                    <template slot-scope="props">
                      {{
                        formatDateTime(new Date(props.row.incidentTimestamp))
                      }}
                    </template>
                  </el-table-column>

                  <el-table-column :label="$t('activity')" width="150" prop="activityId">
                    <template slot-scope="props">
                      <router-link
                          :to="{}"
                          @click.native="selectOtherActivity(props.row.activityId)"
                      >
                        {{ props.row.activityId }}
                      </router-link>
                    </template>
                  </el-table-column>
                  <el-table-column
                      :label="$t('incidentActivity')"
                      width="150"
                      prop="failedActivityId"
                  >
                    <template slot-scope="props">
                      <router-link
                          :to="{}"
                          @click.native="selectOtherActivity(props.row.failedActivityId)"
                      >
                        {{ props.row.failedActivityId }}
                      </router-link>
                    </template>
                  </el-table-column>
                  <el-table-column
                      :label="$t('causeErrInstanceId')"
                      prop="causeIncidentId"
                      width="350"
                  >
                    <template slot-scope="props">
                      <div class="tabCopy">
                        <div @click="incidentSkip(props.row.causeIncidentId)"
                             style="cursor: pointer;color: #1976d2;display: inline;"
                        >
                          {{ props.row.causeIncidentId }}
                        </div>
                        <v-icon
                            class="copyIcon"
                            v-show="props.row.causeIncidentId"
                            style="cursor: pointer"
                            color="#FF7754"
                            :title="$t('clickCopy') + props.row.causeIncidentId"
                            size="14"
                            @click="copy(props.row.causeIncidentId)"
                        >
                          mdi-file-move
                        </v-icon>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                      :label="$t('rootCauseErrInstanceId')"
                      prop="rootCauseIncidentId"
                      width="350"
                  >
                    <template slot-scope="props">
                      <div class="tabCopy">
                        <div @click="incidentSkip(props.row.rootCauseIncidentId)"
                             style="cursor: pointer;color: #1976d2;display: inline;"
                        >
                          {{ props.row.rootCauseIncidentId }}
                        </div>
                        <v-icon
                            class="copyIcon"
                            v-show="props.row.rootCauseIncidentId"
                            style="cursor: pointer"
                            color="#FF7754"
                            :title="$t('clickCopy') + props.row.rootCauseIncidentId"
                            size="14"
                            @click="copy(props.row.rootCauseIncidentId)"
                        >
                          mdi-file-move
                        </v-icon>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                      :label="$t('remark')"
                      width="200"
                      :show-overflow-tooltip="true"
                  >
                    <template slot-scope="props">
                      <v-menu
                          v-show="!typeSwitch"
                          v-model="props.row.menu"
                          :close-on-content-click="false"
                          :nudge-width="200"
                          offset-x
                      >
                        <template #activator="{ on, attrs }">
                          <v-icon
                              @click="editAnnotation(props.row)"
                              v-bind="attrs"
                              v-on="on"
                          >mdi-pencil</v-icon>
                        </template>

                        <v-card>
                          <v-card-title class="small-headline">
                            编辑备注
                          </v-card-title>
                          <v-card-text>
                            <v-textarea
                                rows="2"
                                outlined
                                v-model="props.row.annotationEdit"
                                auto-grow
                                hide-details
                            />
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer/>
                            <v-btn text @click="props.row.menu = false">
                              {{ $t('back') }}
                            </v-btn>
                            <v-btn
                                color="primary"
                                text
                                @click="saveAnnotation(props.row)"
                            >
                              保存
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-menu>
                      &nbsp;{{ props.row.annotation }}
                    </template>
                  </el-table-column>

                  <el-table-column :label="$t('operate')" width="100">
                    <template slot-scope="props">
                        <span
                            v-show="
                            ['failedJob','failedExternalTask'].includes(props.row.incidentType) &&
                              props.row.configuration
                          "
                            class="badge badge-rotate badge-menu"
                            @click="startRetryJobDefinition(props.row)"
                        ><v-icon size="10" color="white">mdi-rotate-right</v-icon></span>
                    </template>
                  </el-table-column>
                </el-table>
                <div
                    class="text-center mb-2 my-2"
                    v-show="incidents.pageCount > 1"
                >
                  <v-pagination
                      v-model="incidents.page"
                      :length="incidents.pageCount"
                      total-visible="20"
                      color="#FF7754"
                  />
                </div>
              </v-tab-item>
              <v-tab-item key="call" transition="false">
                <el-table :data="callActivities" border v-loading="call.loading" :max-height="tableMaxHeight">
                  <el-table-column :label="$t('callProcessDef')" prop="name"/>

                  <el-table-column :label="$t('callProcessId')">
                    <template slot-scope="props">
                      <div class="tabCopy">
                        <router-link
                            :to="{
                              name: 'process-detail',
                              params: { id: props.row.id },
                            }"
                        >
                          {{ props.row.id }}
                        </router-link>
                        <v-icon
                            class="copyIcon"
                            v-show="props.row.id"
                            style="cursor: pointer"
                            color="#FF7754"
                            :title="$t('clickCopy') + props.row.id"
                            size="14"
                            @click="copy(props.row.id)"
                        >
                          mdi-file-move
                        </v-icon>
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column :label="$t('calledActivity')" prop="activityId">
                    <template slot-scope="props">
                      <router-link
                          :to="{}"
                          @click.native="selectOtherActivity(props.row.activityId)"
                      >
                        {{ props.row.activityId }}
                      </router-link>
                    </template>
                  </el-table-column>
                </el-table>
              </v-tab-item>
              <v-tab-item key="job" transition="false">
                <el-table :data="jobDefinitions.items" style="width: auto"
                          border
                          :max-height="tableMaxHeight"
                          v-loading="jobDefinitions.loading"
                >
                  <el-table-column align="start" :label="$t('status')" width="120">
                    <template slot-scope="props">
                      <v-icon
                          size="14"
                          color="green"
                          v-show="!props.row.suspended"
                      >
                        mdi-checkbox-marked-circle-outline
                      </v-icon>&nbsp;<span v-show="!props.row.suspended">Active</span>
                      <v-icon
                          size="14"
                          color="red"
                          v-show="props.row.suspended"
                      >
                        mdi-disc-alert
                      </v-icon>&nbsp;<span v-show="props.row.suspended">Suspended</span>
                    </template>
                  </el-table-column>

                  <!-- <el-table-column
                prop="instanceCount"
                label="进行中"
                align="center"
              /> -->
                  <!-- <el-table-column label="Job ID">
                    <template slot-scope="props">
                      {{ props.row.id }}
                    </template>
                  </el-table-column> -->

                  <el-table-column prop="activityId" :label="$t('activity')">
                    <template slot-scope="props">
                      <router-link
                          :to="{}"
                          @click.native="selectOtherActivity(props.row.activityId)"
                      >
                        {{ props.row.activityId }}
                      </router-link>
                    </template>
                  </el-table-column>
                  <el-table-column prop="jobType" :label="$t('type')"/>
                  <el-table-column prop="jobConfiguration" :label="$t('config')"/>
                  <el-table-column
                      prop="overridingJobPriority"
                      label="Override Job Priority"
                  />
                  <el-table-column :label="$t('operate')" width="150">
                    <template slot-scope="props">
                        <span
                            v-show="!props.row.suspended"
                            class="badge badge-pause badge-menu"
                            @click="startSuspendJob(props.row)"
                        ><v-icon size="10" color="white">mdi-pause</v-icon></span>
                      <span
                          v-show="props.row.suspended"
                          class="badge badge-play badge-menu"
                          @click="startSuspendJob(props.row)"
                      ><v-icon size="10" color="white">mdi-play</v-icon></span>
                      <span
                          class="badge badge-rotate badge-menu"
                          @click="startRetryJobDefinition(props.row)"
                      ><v-icon size="10" color="white">mdi-rotate-right</v-icon></span>
                      <span
                          class="badge badge-gear badge-menu"
                          @click="startSetJobPriority(props.row)"
                      ><v-icon size="10" color="white">mdi-cog</v-icon></span>
                    </template>
                  </el-table-column>
                </el-table>
              </v-tab-item>
              <v-tab-item key="edit" transition="false">
                <el-table :data="instructions"
                          style="width: auto"
                          :max-height="tableMaxHeight"
                >
                  <el-table-column :label="$t('type')" width="300">
                    <template slot-scope="props">
                      <v-select
                          style="padding-top: 0"
                          @change="selectInstructionType(props.row)"
                          :items="action.getActions(props.row, nodeProperties)"
                          :item-value="(item) => `${item.id}`"
                          :item-text="(item) => `${item.title}`"
                          v-model="props.row.type"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" :label="$t('activity')"/>
                  <el-table-column :label="$t('activityId')">
                    <template slot-scope="props">
                      <router-link
                          :to="{}"
                          @click.native="selectActivity(props.row)"
                      >
                        {{ props.row.activityId }}
                      </router-link>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('operate')" width="200">
                    <template slot-scope="props">
                        <span
                            class="badge badge-move badge-menu"
                            :style="{
                            visibility: props.$index === 0 ? 'hidden' : 'visible',
                          }"
                            @click="moveUpInstruction(props.row)"
                        ><v-icon size="10" color="white">mdi-arrow-up</v-icon></span>
                      <span
                          class="badge badge-move badge-menu"
                          :style="{
                            visibility:
                              props.$index === instructions.length - 1
                                ? 'hidden'
                                : 'visible',
                          }"
                          @click="moveDownInstruction(props.row)"
                      ><v-icon size="10" color="white">mdi-arrow-down</v-icon></span>
                      <span
                          class="badge badge-pause badge-menu"
                          @click="removeInstruction(props.row)"
                      ><v-icon size="10" color="white">mdi-close</v-icon></span>
                    </template>
                  </el-table-column>
                </el-table>

                <v-btn
                    class="start-instructions"
                    text
                    :disabled="instructions.length === 0"
                    @click="$refs.instanceModify.start()"
                >
                  {{ $t('selectProcessInstance') }}
                </v-btn>

                <v-card style="box-shadow: 0px 0px 0px 0px">
                  <v-card-title style="font-size: 16px">
                    Request Payload
                    <v-icon
                        style="margin-left: 10px; cursor: pointer"
                        color="#FF7754"
                        :title="$t('clickCopy') + 'Payload'"
                        size="16"
                        @click="copy(payload)"
                    >
                      mdi-file-move
                    </v-icon>
                    <!-- <v-btn
                      style="margin-left: 10px; border-right: 0px solid #000"
                      text
                      @click="showPayload = !showPayload"
                    >
                      {{ showPayload ? "隐藏" : "显示" }}
                    </v-btn> -->

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
                  </v-card-title>

                  <v-card-text v-show="showPayload">
                    <v-textarea
                        :disabled="true"
                        rows="4"
                        outlined
                        v-model="payload"
                        hide-details
                    />
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item key="document" transition="false">
                <element-document :current-element="currentElement"/>
              </v-tab-item>
              <v-tab-item key="collaboration" transition="false">
                <el-table :data="collaborations" style="width: auto" :max-height="tableMaxHeight">
                  <el-table-column prop="id" :label="$t('processDefKey')">
                    <template slot-scope="props">
                      <router-link
                          :to="{}"
                          @click.native="enterProcessDetailByKey(props.row.id)"
                      >
                        {{ props.row.id }}
                      </router-link>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" :label="$t('name')"/>
                </el-table>
              </v-tab-item>
            </v-tabs-items>
          </re-size-layout>
        </div>
      </v-layout>

      <v-dialog
          v-model="retryJobDefinitionDialog.display"
          max-width="350"
      >
        <v-card>
          <v-card-title class="headline">
            {{ retryJobDefinitionDialog.title }}
          </v-card-title>
          <v-card-text>
            {{ retryJobDefinitionDialog.description }}
          </v-card-text>
          <v-card-actions style="padding-bottom: 16px">
            <v-spacer/>
            <v-btn
                color="warning"
                text
                @click="retryJobDefinitionDialog.display = false"
            >
              {{ $t('cancel') }}
            </v-btn>
            <v-btn color="primary" text @click="retryJobDefinition()">
              {{ $t('confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="retryJobDialog.display" max-width="350">
        <v-card>
          <v-card-title class="headline">
            {{ retryJobDialog.title }}
          </v-card-title>
          <v-card-text>
            {{ retryJobDialog.description }}
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn color="warning" text @click="retryJobDialog.display = false">
              {{ $t('cancel') }}
            </v-btn>
            <v-btn color="primary" text @click="retryJob()">{{ $t('confirm') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="suspendDialog.display" max-width="500">
        <v-card>
          <v-card-title class="headline" style="color: #444262">
            {{ $t('processDefWithOpt',{opt:$t(process.suspended ? 'active' : 'suspend')}) }}
          </v-card-title>
          <v-card-text>
            <v-form lazy-validation>
              <v-checkbox
                  v-model="suspendDialog.includeProcessInstances"
                  color="#FF7754"
                  hide-details="auto"
              >
                <template #label>
                  <div class="checkbox-label">
                    {{ $t('processDefConfirmWithOpt',{opt:$t(process.suspended ? "active" : "suspend")}) }}
                  </div>
                </template>
              </v-checkbox>

              <div class="checkbox-tip">
                {{ $t('processDefTipsWithOpt',{opt:$t(process.suspended ? "active" : "suspend")}) }}
              </div>

              <v-radio-group v-model="suspendDialog.dateType">
                <v-radio key="1" value="1" color="#FF7754">
                  <template #label>
                    <span style="color: #444262">{{ $t('rightNow') }}</span>
                  </template>
                </v-radio>
                <v-radio key="2" value="2" color="#FF7754">
                  <template #label>
                    <span style="color: #444262">{{ $t('staticTime') }}</span>
                  </template>
                </v-radio>
              </v-radio-group>

              <v-menu
                  v-if="suspendDialog.dateType === '2'"
                  v-model="suspendDialog.dislayDate"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                      v-model="suspendDialog.executionDate"
                      :label="$t('plsSelectDate')"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                  />
                </template>
                <v-date-picker
                    v-model="suspendDialog.executionDate"
                    @input="suspendDialog.dislayDate = false"
                />
              </v-menu>

              <v-menu
                  v-if="suspendDialog.dateType === '2'"
                  ref="timeMenu"
                  v-model="suspendDialog.dislayTime"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="suspendDialog.executionTime"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                      v-model="suspendDialog.executionTime"
                      :label="$t('plsSelectTime')"
                      prepend-icon="mdi-clock-time-four-outline"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                  />
                </template>
                <v-time-picker
                    v-if="suspendDialog.dislayTime"
                    v-model="suspendDialog.executionTime"
                    full-width
                    @click:minute="
                    $refs.timeMenu.save(suspendDialog.executionTime)
                  "
                />
              </v-menu>
            </v-form>
          </v-card-text>
          <v-card-actions style="padding-bottom: 16px">
            <v-spacer/>
            <v-btn text @click="suspendDialog.display = false"> {{ $t('cancel') }}</v-btn>
            <v-btn style="color: #ffffff" color="#FF7754" @click="suspend()">
              <!-- <v-icon size="14" color="#ffffff" style="margin-right: 5px">
                mdi-delete
              </v-icon> -->
              {{ $t('confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
          v-model="setJobPriorityDialog.display"
          max-width="500"
      >
        <v-card>
          <v-card-title class="headline" style="color: #444262">
            {{ $t('varOverwriteJobPriority') }}
          </v-card-title>
          <v-card-text>
            <v-form lazy-validation>
              <v-checkbox
                  v-model="setJobPriorityDialog.includeJobs"
                  color="#FF7754"
                  hide-details="auto"
              >
                <template #label>
                  <div class="checkbox-label">
                    {{ $t('varOverwriteJobPriorityConfirm') }}
                  </div>
                </template>
              </v-checkbox>

              <div class="checkbox-tip">
                {{ $t('varOverwriteJobPriorityTips') }}
              </div>

              <v-text-field
                  type="number"
                  v-model="setJobPriorityDialog.priority"
                  :label="$t('plsInputPriority')"
              />
            </v-form>
          </v-card-text>
          <v-card-actions style="padding-bottom: 15px">
            <v-spacer/>
            <v-btn text @click="setJobPriorityDialog.display = false">
              {{ $t('cancel') }}
            </v-btn>
            <v-btn
                style="color: #ffffff"
                color="#FF7754"
                @click="setJobPriority()"
            >
              <!-- <v-icon size="14" color="#ffffff" style="margin-right: 5px">
                mdi-delete
              </v-icon> -->
              {{ $t('confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="suspendJobDialog.display" max-width="500">
        <v-card>
          <v-card-title class="headline" style="color: #444262">
            {{ $t('jobDefWithOpt',{opt:$t(suspendJobDialog.job.suspended ? 'active' : 'suspend')}) }}
          </v-card-title>
          <v-card-text>
            <v-form lazy-validation>
              <v-checkbox
                  v-model="suspendJobDialog.includeProcessInstances"
                  color="#FF7754"
                  hide-details="auto"
              >
                <template #label>
                  <div class="checkbox-label">
                    {{ $t('jobDefWithConfirmOpt',{opt:$t(suspendJobDialog.job.suspended ? 'active' : 'suspend')}) }}
                  </div>
                </template>
              </v-checkbox>
              <div class="checkbox-tip">
                {{ $t('jobDefWithTipsOpt',{opt:$t(suspendJobDialog.job.suspended ? 'active' : 'suspend')}) }}
              </div>
              <v-radio-group v-model="suspendJobDialog.dateType">
                <v-radio key="1" :label="$t('rightNow')" value="1" color="#FF7754">
                  <template #label>
                    <span style="color: #444262">{{ $t('rightNow') }}</span>
                  </template>
                </v-radio>
                <v-radio key="2" :label="$t('staticTime')" value="2" color="#FF7754">
                  <template #label>
                    <span style="color: #444262">{{ $t('staticTime') }}</span>
                  </template>
                </v-radio>
              </v-radio-group>

              <v-menu
                  v-if="suspendJobDialog.dateType === '2'"
                  v-model="suspendJobDialog.dislayDate"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                      v-model="suspendJobDialog.executionDate"
                      :label="$t('plsSelectDate')"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                  />
                </template>
                <v-date-picker
                    v-model="suspendJobDialog.executionDate"
                    @input="suspendJobDialog.dislayDate = false"
                />
              </v-menu>

              <v-menu
                  v-if="suspendJobDialog.dateType === '2'"
                  ref="timeMenu"
                  v-model="suspendJobDialog.dislayTime"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="suspendJobDialog.executionTime"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                      v-model="suspendJobDialog.executionTime"
                      :label="$t('plsSelectTime')"
                      prepend-icon="mdi-clock-time-four-outline"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                  />
                </template>
                <v-time-picker
                    v-if="suspendJobDialog.dislayTime"
                    v-model="suspendJobDialog.executionTime"
                    full-width
                    @click:minute="
                    $refs.timeMenu.save(suspendJobDialog.executionTime)
                  "
                />
              </v-menu>
            </v-form>
          </v-card-text>
          <v-card-actions style="padding-bottom: 16px">
            <v-spacer/>
            <v-btn text @click="suspendJobDialog.display = false"> {{ $t('cancel') }}</v-btn>
            <v-btn style="color: #ffffff" color="#FF7754" @click="suspendJob()">
              <!-- <v-icon size="14" color="#ffffff" style="margin-right: 5px">
                mdi-delete
              </v-icon> -->
              {{ $t('confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
          v-model="msgStackTraceDialog.display"
          max-width="600"
      >
        <v-card>
          <div class="tabCopy">
            <v-card-title class="headline" style="color: #444262">
              {{ msgStackTraceDialog.title }}&nbsp;
              <v-icon
                  class="copyIcon"
                  v-show="msgStackTraceDialog.msg"
                  style="cursor: pointer"
                  color="#FF7754"
                  :title="$t('clickCopy') + msgStackTraceDialog.msg"
                  size="14"
                  @click="copyMessage(msgStackTraceDialog.msg)"
              >
                mdi-file-move
              </v-icon>
            </v-card-title>
            <v-card-text>
              <pre style="max-height: 50vh;overflow-y: auto; ">
              <code class="lang-java">
              {{ msgStackTraceDialog.msg }}
            </code>
            </pre>
            </v-card-text>
          </div>
          <v-card-actions style="padding-bottom: 16px">
            <v-spacer/>
            <v-btn
                color="#FF7754"
                @click="msgStackTraceDialog.display = false"
                style="color: #fff"
            >
              {{ $t('close') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="deleteDialog.display" max-width="500">
        <v-card>
          <v-card-title class="headline" style="color: #444262">
            {{ deleteDialog.title }}
          </v-card-title>
          <v-card-subtitle style="color: #gray; margin-top: 0px">
            {{ $t('deleteProcessDefTipWithCount',{count:process.instanceCount}) }}
          </v-card-subtitle>
          <v-card-text>
            <v-form lazy-validation>
              <v-checkbox
                  v-model="deleteDialog.cascade"
                  color="#FF7754"
                  label="Cascade"
                  hide-details="auto"
              >
                <template #label>
                  <div class="checkbox-label">Cascade</div>
                </template>
              </v-checkbox>

              <div class="checkbox-tip">
                {{ $t('deleteProcessDefConfirm') }}
              </div>

              <v-checkbox
                  v-model="deleteDialog.skipCustomListeners"
                  :label="$t('skipCustomListeners')"
                  color="#FF7754"
                  hide-details="auto"
              >
                <template #label>
                  <div class="checkbox-label">{{ $t('skipCustomListeners') }}</div>
                </template>
              </v-checkbox>
              <div class="checkbox-tip">
                {{ $t('skipCustomListenersTips1') }}
              </div>
              <v-checkbox
                  v-model="deleteDialog.skipIoMappings"
                  :label="$t('skipIOMaps')"
                  color="#FF7754"
                  hide-details="auto"
              >
                <template #label>
                  <div class="checkbox-label">{{ $t('skipIOMaps') }}</div>
                </template>
              </v-checkbox>
              <div class="checkbox-tip">{{ $t('skipIOMapsTips1') }}</div>
            </v-form>
          </v-card-text>
          <v-card-actions style="padding-bottom: 16px">
            <v-spacer/>
            <v-btn text @click="deleteDialog.display = false"> {{ $t('cancel') }}</v-btn>
            <v-btn
                style="color: #ffffff"
                color="#FF7754"
                :disabled="!deleteDialog.cascade"
                @click="deleteProcess()"
            >
              <v-icon size="14" color="#ffffff" style="margin-right: 5px">
                mdi-delete
              </v-icon>
              {{ $t('confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
    <div v-if="startDialog.display" class="flex-column"
         style="display: flex;border-top: 1px solid rgba(187, 187, 187, 1);flex: 1;height: 0px;background-color: white"
    >
      <div style="padding: 15px">
        <v-text-field v-if="startDialog.startType==='throwSignal'" hide-details :placeholder="$t('signalName')" v-model="startDialog.throwSignalForm.name"/>
        <v-text-field v-else hide-details :placeholder="$t('plsInputBusinessKey')" v-model="startDialog.businessKey"/>
      </div>
      <div style="flex: 1;height: 0">
        <div v-if="startDialog.dataFrom==='variable'" style="height: 100%">
          <v-btn class="white--text" color="#444262" small @click="addVariable()" style="margin: 20px">
            增加{{ $t('variable') }}
          </v-btn>
          <el-table :data="startDialog.variables" stripe max-height="500" style="margin-left: 10px;margin-right: 10px"
                    height="100%"
          >
            <el-table-column prop="name" :label="$t('variable')" sortable>
              <template slot-scope="props">
                <div class="tabCopy">
                  {{ props.row.name }}
                  <v-icon
                      class="copyIcon"
                      v-show="props.row.name"
                      style="cursor: pointer"
                      color="#FF7754"
                      :title="$t('clickCopy') + props.row.name"
                      size="14"
                      @click="copy(props.row.name)"
                  >
                    mdi-file-move
                  </v-icon>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="type" :label="$t('type')"/>

            <el-table-column prop="value" :label="$t('value')">
              <template slot-scope="props">
                <div>{{ props.row.value }}</div>
              </template>
            </el-table-column>

            <el-table-column :label="$t('operate')" width="130">
              <template slot-scope="props">
                <v-btn icon x-small color="#444262" @click="editVariable(props.row)">
                  <v-icon>mdi-border-color</v-icon>
                </v-btn>
                <v-menu
                    v-model="props.row.deleteMenu"
                    :close-on-content-click="false"
                    :nudge-width="200"
                    offset-x
                >
                  <template #activator="{ on, attrs }">
                    <v-btn icon x-small color="red"
                           v-bind="attrs"
                           v-on="on"
                    >
                      <v-icon>mdi-delete-forever</v-icon>
                    </v-btn>
                  </template>

                  <v-card>
                    <v-card-title class="small-headline">
                      删除{{ $t('variable') }}
                    </v-card-title>
                    <v-card-text>
                      <div>确认删除{{ $t('variable') }}{{ props.row.name }}？</div>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer/>
                      <v-btn text @click="props.row.deleteMenu = false">
                        {{ $t('cancel') }}
                      </v-btn>
                      <v-btn
                          color="primary"
                          text
                          @click="deleteVariable(props)"
                      >
                        {{ $t('delete') }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <Form id="formData"
              ref="formioNew"
              :form="formBuilder.form"
              :options="formBuilder.options"
              :submission="formBuilder.formValue"
              style="overflow-y: scroll;padding-left: 10px;padding-right: 10px;height: 100%"
              v-else-if="startDialog.dataFrom==='formio'&&startDialog.formData"
        />
      </div>
      <div class="d-flex flex-row"
           style="border-top:1px solid rgba(187, 187, 187, 1);border-bottom:1px solid rgba(187, 187, 187, 1);width: 100%"
      >
        <v-spacer/>
        <v-btn text large @click="setDataFromVariable" v-show="startDialog.dataFrom==='formio'&&startDialog.startType!=='throwSignal'">
          <v-icon left>mdi-folder-open</v-icon>
          {{ $t('addVar') }}
        </v-btn>
        <v-btn text large @click="setDataFromFormio" v-show="startDialog.dataFrom==='variable' && startDialog.formData && startDialog.startType!=='throwSignal'">
          <v-icon left>mdi-folder-open</v-icon>
          {{ $t('loadForm') }}
        </v-btn>
        <v-btn large text
               style="border-left: 1px solid rgba(187, 187, 187, 1);;border-right: 1px solid rgba(187, 187, 187, 1);border-radius: unset"
               @click="startDialog.display=false"
        >
          <v-icon left>mdi-close</v-icon>
          {{ $t('cancel') }}
        </v-btn>
        <v-btn large text @click="commitStart" :loading="startDialog.commitLoading">
          <v-icon left color="#FF7754">mdi-play-circle</v-icon>
          {{ startDialog.startType==='throwSignal'?'发送':'启动' }}
        </v-btn>
      </div>
    </div>
    <v-bottom-sheet
        v-model="designDialog.display">
      <div style="height: calc(100vh - 100px)">
        <bpmn-modeler
            ref="bpmnModeler"
            :export-name="
                `${process.name}`
              "
            @closeDialog="onModelerClose"
            :show-close="true"
            :node-properties="{}"
            :diagram-xml="xml"
        />
      </div>
    </v-bottom-sheet>
    <instance-modify
        :instructions="instructions"
        :definition-id="process.id"
        :action="'modify'"
        ref="instanceModify"
    />
    <instance-delete
        :definition-id="process.id"
        :type="'runtime'"
        ref="instanceDelete"
    />
    <instance-variable
        :definition-id="process.id"
        :variables="instances.filter.variables"
        @confirm="getInstances()"
        ref="instanceVariable"
    />
    <add-variable :display="variableDialog.display"
                  :edit-variable="variableDialog.editValue"
                  @onCancelSaveVariable="variableDialog.display=false"
                  @onSaveVariable="saveVariable"
    />
    <v-snackbar
        v-model="startDialog.showError"
        :multi-line="true"
    >
      {{ startDialog.error }}

      <template #action="{ attrs }">
        <v-btn
            color="red"
            text
            v-bind="attrs"
            @click="startDialog.showError = false"
        >
          {{ $t('close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import request from "@/api/process";
import instanceRequest from "@/api/instance";
import utils from "@/utils/utils";
import action from "@/utils/action";
import VueBpmn from "@/components/common/BPMN";
import InstanceModify from "@/components/common/instance/InstanceModify";
import InstanceDelete from "@/components/common/instance/InstanceDelete";
import InstanceVariable from "@/components/common/instance/InstanceVariable";
import jobRequest from "@/api/job";
import processRequest from "@/api/process";
import ElementDocument from "@/components/common/ElementDocument";
import ReSizeLayout from "@/components/common/ReSizeLayout";
import ReSizeDrawer from "@/components/common/ReSizeDrawer";
import AddVariable from "@/components/common/AddVariable";
import {Form} from "vue-formio-eorion";
import formRequest from "@/api/form";
import i18n from "@/utils/i18n";
import {formatVariables} from "@/utils/common";
import BpmnModeler from "@/components/common/BPMNModeler";
import hljs from "highlight.js/lib/core";
import java from "highlight.js/lib/languages/java";
import signalRequest from "@/api/signal";

export default {
  components: {
    BpmnModeler,
    Form,
    VueBpmn,
    InstanceModify,
    InstanceDelete,
    InstanceVariable,
    ElementDocument,
    ReSizeLayout,
    ReSizeDrawer,
    AddVariable,
  },
  computed: {
    tabKeyComputed() {
      return `tab_${this.tabKey}`;
    },
    tabItemKey() {
      return `tab_item_${this.tabKey}`;
    },
    tabHistoryKey() {
      return `tab_history_${this.tabKey}`;
    },
    tabHistoryItemKey() {
      return `tab_history_item_${this.tabKey}`;
    },
    payload() {
      var item = {
        processDefinitionId: this.$route.params.id,
        skipCustomListeners: true,
        skipIoMappings: true,
        instructions: this.instructions.map((item) => {
          return {
            type: item.type.replace("MultiInstance", ""),
            activityId: item.activityId,
            cancelCurrentActiveActivityInstances:
            item.cancelCurrentActiveActivityInstances,
          };
        }),
      };

      return JSON.stringify(item);
    },
  },
  data() {
    return {
      formBuilder: {
        form: {components: []},
        options: {
          language: "zh",
          i18n: i18n,
          noAlerts: true
        },
        formValue: {data: {}}
      },
      variableDialog: {
        display: false,
        editValue: null
      },
      currentElement: null,
      action,
      utils,
      breadcrumbs: [
        {
          text: this.$t("processDef"),
          href: "#/automation/process/list",
        },
        {
          text: "",
          disabled: true,
          href: "#/automation/process/detail",
        },
      ],
      left: true,
      showPayload: false,
      bottom: 1,
      xml: "",
      nodeProperties: {},
      nodeActions: [],

      process: {
        id: "",
        key: "",
        category: "",
        description: "",
        name: "",
        version: null,
        resource: "",
        deploymentId: "",
        diagram: null,
        suspended: false,
        tenantId: null,
        versionTag: null,
        historyTimeToLive: null,
        startableInTasklist: false,
      },

      breadcrumbSummary: {
        version: null,
        instance: null,
        incident: null,
      },
      versions: [],
      version: "",
      tab: 0,
      tabKey: 0,
      instances: {
        page: 0,
        pageCount: 0,
        itemsPerPage: 50,
        totalCount: 0,
        sortBy: "startTime",
        sortOrder: "desc",
        items: [],
        loading: true,
        filter: {
          withIncidents: false,
          suspended: false,
          businessKey: "",
          displayStartedAfter: false,
          startedAfter: "",
          displayStartedBefore: false,
          startedBefore: "",
          variables: [],
        },
      },
      msgStackTraceDialog: {
        display: false,
        title: "StackTrace",
        msg: null,
      },
      jobDefinitions: {
        page: 0,
        pageCount: 0,
        itemsPerPage: 1000,
        totalCount: 0,
        loading: true,
        items: [],
      },
      jobLogs: {
        page: 0,
        pageCount: 0,
        itemsPerPage: 50,
        totalCount: 0,
        sortBy: "timestamp",
        sortOrder: "desc",
        loading: true,
        items: [],
      },
      externalTaskLogs: {
        page: 0,
        pageCount: 0,
        itemsPerPage: 1000,
        totalCount: 0,
        loading: true,
        items: [],
      },
      userOperations: {
        page: 0,
        pageCount: 0,
        itemsPerPage: 50,
        totalCount: 0,
        sortBy: "timestamp",
        sortOrder: "desc",
        loading: true,
        items: [],
      },
      incidents: {
        page: 0,
        pageCount: 0,
        itemsPerPage: 50,
        totalCount: 0,
        sortBy: "incidentTimestamp",
        sortOrder: "desc",
        loading: true,
        items: [],
        filter: {
          failedJob: false,
          failedExternalTask: false,
        },
      },
      call: {
        loading: true
      },
      callActivities: [],
      instructions: [],
      collaborations: [],
      imgUrl: require("@/assets/flow.png"),

      retryJobDefinitionDialog: {
        display: false,
        job: {},
        title: this.$t("addRetryCount"),
        description: this.$t("addRetryCountConfirm"),
        success: this.$t("addRetryCountSuccess"),
        error: this.$t("addRetryCountFailed"),
      },

      retryJobDialog: {
        display: false,
        job: {},
        title: this.$t("addRetryCount"),
        description: this.$t("addRetryCountConfirm"),
        success: this.$t("addRetryCountSuccess"),
        error: this.$t("addRetryCountFailed"),
      },
      deleteDialog: {
        display: false,
        cascade: false,
        skipCustomListeners: false,
        skipIoMappings: false,
        title:this.$t("deleteProcessDef"),
        description: this.$t("deleteProcessDefConfirm1"),
        success: this.$t("deleteProcessDefSuccess"),
        error: this.$t("deleteProcessDefFailed"),
      },
      startDialog: {
        display: false,
        title: this.$t("deleteProcessDef"),
        success: this.$t("deleteProcessDefSuccess"),
        error: "",
        showError: false,
        variables: [],
        businessKey: "",
        formLoading: false,
        formNull: false, //是否存在关联表单
        commitLoading: false,
        dataFrom: "variable",
        formData: null,
        formValue: {},
        form: null,
        startType: null,
        throwSignalForm: {
          name: null
        }
      },
      designDialog: {
        display: false,
      },
      suspendDialog: {
        display: false,
        dateType: "1",
        includeProcessInstances: false,
        executionDate: "",
        executionTime: "",
        dislayDate: false,
        dislayTime: false,
      },
      suspendJobDialog: {
        display: false,
        dateType: "1",
        job: {},
        includeProcessInstances: false,
        executionDate: "",
        executionTime: "",
        dislayDate: false,
        dislayTime: false,
      },
      setJobPriorityDialog: {
        display: false,
        includeJobs: false,
        priority: "",
        job: {},
      },
      tableMaxHeight: "10",
      leftStylePadding: {},
      leftStyleMargin: {},
    };
  },
  watch: {
    "$i18n.locale": {
      handler(val){
        let self=this;
        self.breadcrumbs[0].text = self.$t("processDef");
        self.retryJobDialog.title = self.$t("addRetryCount");
        self.retryJobDialog.description = self.$t("addRetryCountConfirm");
        self.retryJobDialog.success = self.$t("addRetryCountSuccess");
        self.retryJobDialog.error = self.$t("addRetryCountFailed");
        self.retryJobDefinitionDialog.title = self.$t("addRetryCount");
        self.retryJobDefinitionDialog.description = self.$t("addRetryCountConfirm");
        self.retryJobDefinitionDialog.success = self.$t("addRetryCountSuccess");
        self.retryJobDefinitionDialog.error = self.$t("addRetryCountFailed");
        self.deleteDialog.title = self.$t("deleteProcessDef");
        self.deleteDialog.description = self.$t("deleteProcessDefConfirm1");
        self.deleteDialog.success = self.$t("deleteProcessDefSuccess");
        self.deleteDialog.error = self.$t("deleteProcessDefFailed");
        self.startDialog.title=self.$t("deleteProcessDef");
        self.startDialog.success=self.$t("deleteProcessDefSuccess");
      },
    },
    xml: {
      handler() {
        this.loadBpm();
      },
    },
    tab: {
      handler() {
        this.getTab();
      },
    },
    "instances.page": {
      handler() {
        this.getInstancesPage();
      },
    },
    "instances.pageCount": {
      handler() {
        this.setTableHeight();
      },
    },
    "incidents.page": {
      handler() {
        this.getIncidentPage();
      },
    },
    "incidents.pageCount": {
      handler() {
        this.setTableHeight();
      },
    },
    "jobDefinitions.page": {
      handler() {
        this.getJobDefinitionPage();
      },
    },
    "jobLogs.page": {
      handler() {
        this.getJobLogPage();
      },
    },
    "jobLogs.pageCount": {
      handler() {
        this.setTableHeight();
      },
    },
    "userOperations.page": {
      handler() {
        this.getUserOperationPage();
      },
    },
    "userOperations.pageCount": {
      handler() {
        this.setTableHeight();
      },
    },
    $route: {
      handler() {
        this.tab = 0;
        this.getData();
      },
    },
  },
  mounted() {
    hljs.registerLanguage("java", java);
    this.getData();
  },
  methods: {
    onModelerClose() {
      this.designDialog.display = false;
    },
    onThrowSignal() {
      let self = this;
      self.startDialog.formData = null;
      self.startDialog.display = true;
      self.startDialog.throwSignalForm = {
        name: ""
      };
      self.startDialog.startType = "throwSignal";
      self.startDialog.dataFrom = "variable";
      self.startDialog.variables = [];
      self.startDialog.formValue = {};
      self.formBuilder.formValue = {data: {}};
    },
    async onStartProcess() {
      let self = this;
      self.startDialog.formData = null;
      self.startDialog.formLoading = true;
      try {
        if (process.env.VUE_APP_SEARCH_FORM_BY_API) {
          let formKey = await processRequest.getStartFormKey(self.process.id);
          if (formKey.key) {
            let responseFormData = await formRequest.getFormDetailByKey(formKey.key);
            self.startDialog.formData = responseFormData.formData;
            self.formBuilder.form = {components: responseFormData.formData || []};
          }
        }
      } catch (e) {
      }
      self.startDialog.formLoading = false;
      self.startDialog.display = true;
      self.startDialog.startType = null;
      self.startDialog.businessKey = `新实例-${self.process.name}-${new Date().toLocaleDateString()}`;
      self.startDialog.variables = [];
      self.startDialog.formValue = {};
      self.formBuilder.formValue = {data: {}};
    },
    async commitStart() {
      let self = this;
      if (self.startDialog.startType === "throwSignal") {
        if (!self.startDialog.throwSignalForm.name || self.startDialog.throwSignalForm.name.length === 0) {
          self.startDialog.error = self.$t("plsInputSignalName");
          self.startDialog.showError = true;
          return;
        }
      }else {
        if (!self.startDialog.businessKey || self.startDialog.businessKey.length === 0) {
          self.startDialog.error = self.$t("plsInputBusinessKey1");
          self.startDialog.showError = true;
          return;
        }
      }
      let variables = {};
      // 变量
      if (self.startDialog.dataFrom === "variable") {
        self.startDialog.variables.forEach(variable => {
          variables[`${variable.name}`] = variable;
        });
      }
      // 表单
      if (self.startDialog.dataFrom === "formio") {
        try {
          let formResponse = await self.$refs.formioNew.formio.submit();
          variables = formatVariables(formResponse.data);
        } catch (err) {
          self.$notify.error(err);
          variables = null;
        }
      }
      if (variables) {
        self.startDialog.commitLoading = true;
        let request;
        if (self.startDialog.startType === "throwSignal") {
          request = signalRequest.sendSignal({
            name: self.startDialog.throwSignalForm.name,
            variables: variables
          });
        } else {
          request = processRequest.submitForm(self.process.id, {
            variables: variables,
            businessKey: self.startDialog.businessKey
          });
        }
        request.then(response => {
          if (self.startDialog.startType === "throwSignal"){
            // 成功提示
            self.$notify.success(self.$t("sendSignalSuccess"));
          }
          self.startDialog.display = false;
          self.startDialog.commitLoading = false;
          self.getData();
        }).catch(err => {
          self.startDialog.error = `${err.response.status}:${err.response.data.message}`;
          self.startDialog.commitLoading = false;
          self.startDialog.showError = true;
        });
      }else {
        self.startDialog.error = self.$t("plsInputVars");
        self.startDialog.showError = true;
      }
    },
    setDataFromVariable() {
      this.startDialog.dataFrom = "variable";
    },
    async setDataFromFormio() {
      // 获取form
      let self = this;
      self.startDialog.dataFrom = "formio";
    },
    saveVariable(payloads) {
      //保存变量
      let self = this;
      if (!self.startDialog.variables) {
        self.startDialog.variables = [];
      }
      let index = self.startDialog.variables.findIndex(variable => variable.name === payloads.varName);
      if (index === -1) {
        // 添加
        self.startDialog.variables = [payloads.varData].concat(self.startDialog.variables);
      } else {
        // 编辑
        self.$set(self.startDialog.variables, index, payloads.varData);
      }
      self.variableDialog.display = false;
    },
    editVariable(variable) {
      this.variableDialog.display = true;
      this.variableDialog.editValue = variable;
    },
    deleteVariable(row) {
      this.$delete(this.startDialog.variables, row.$index);
    },
    addVariable() {
      this.variableDialog.display = true;
      this.variableDialog.editValue = null;
    },
    setLeftWidth(payload) {
      let self = this;
      self.left = payload.left;
      self.leftStylePadding = {paddingLeft: `${payload.left ? payload.width : 0}px`};
      self.leftStyleMargin = {marginLeft: `${payload.left ? payload.width : 0}px`};
    },
    setTableHeight() {
      let self = this;
      let height = self.$refs.resizeLayoutBottom.getCanShowHeight();
      let paginationHeight = 59.59;
      let preTabCount = 0;
      if (self.tab === (0 + preTabCount)) {
        // 流程实例
        if (this.instances.pageCount > 1) {
          // 59.59为底部分页栏的高度
          height = height - paginationHeight;
        }
      }
      if (self.tab === (1 + preTabCount)) {
        // 故障
        if (this.incidents.pageCount > 1) {
          // 59.59为底部分页栏的高度
          height = height - paginationHeight;
        }
      }

      this.$nextTick(() => {
        this.tableMaxHeight = height;
      });
    },
    async enterProcessDetailByKey(processDefKey) {
      let processDef = await processRequest.getProcessDefinitionByKey(processDefKey);
      this.$router.push({
        name: "process-detail",
        params: {id: processDef.id},
      });
    },
    async deploymentDownload(deploymentId) {
      let data = await processRequest.deploymentData(deploymentId, response[0].id);
      const blob = new Blob([data]);
      const fileName = response[0].name;
      const elink = document.createElement("a");
      elink.download = fileName;
      elink.style.display = "none";
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href);
    },
    userOperationsSortChange(value) {
      this.userOperations.sortBy = value.prop;
      this.userOperations.sortOrder =
          value.order == "descending" ? "desc" : "asc";
      // console.log(this.instances.sortBy,"==========",this.instances.sortOrder);
      this.getUserOperationPage();
    },
    jobLogSortChange(value) {
      this.jobLogs.sortBy = value.prop;
      this.jobLogs.sortOrder = value.order == "descending" ? "desc" : "asc";
      // console.log(this.instances.sortBy,"==========",this.instances.sortOrder);
      this.getJobLogPage();
    },
    incidentsSortChange(value) {
      this.incidents.sortBy = value.prop;
      this.incidents.sortOrder = value.order == "descending" ? "desc" : "asc";
      // console.log(this.instances.sortBy,"==========",this.instances.sortOrder);
      this.getIncidentPage();
    },
    intanceSortChange(value) {
      this.instances.sortBy = value.prop;
      this.instances.sortOrder = value.order == "descending" ? "desc" : "asc";
      // console.log(this.instances.sortBy,"==========",this.instances.sortOrder);
      this.getInstancesPage();
    },
    async incidentSkip(value) {
      let incident = await request.getIncident(value);
      if (incident && incident.processInstanceId != null) {
        this.$router.push({
          name: "instance-detail",
          params: {
            id: incident.processInstanceId,
            typeSwitch: this.typeSwitch,
          },
        });
      } else {
        this.$notify.error(this.$t("failNoInstance"));
      }
    },
    async loadMsgDetail(type, incident) {
      let msgResult;
      try {
        if (type === "root") {
          incident = await processRequest.getIncidentNoParams(
              incident.rootCauseIncidentId
          );
        }
        if (incident && incident.configuration) {
          msgResult = await jobRequest.getJobStacktrace(incident.configuration);
        }
      } catch (e) {
        console.log(e);
      }
      if (msgResult) {
        Object.assign(this.msgStackTraceDialog, {
          display: true,
          msg: msgResult,
        });
        this.$nextTick(() => {
          hljs.highlightAll();
        });
      } else {
        this.$notify({
          title: this.$t("noErrInfo"),
          type: "error",
          position: "bottom-right",
          offset: 100,
          showClose: false,
        });
      }
    },
    formatDateTime: utils.formatDateTime,
    async getTab() {
      this.nodeActions = [];
      let preTabCount = 0;
      switch (this.tab) {
        case 0 + preTabCount: // 流程实例，history或runtime
          this.getInstances();
          break;
        case 1 + preTabCount: // 故障，history或runtime
          this.getIncidents();
          break;
        case 2 + preTabCount: // 调用的流程定义，runtime
          this.getCallActivities();
          break;
        case 3 + preTabCount: // 工作定义，runtime
          this.getJobDefinitions();
          break;
        case 4 + preTabCount: // 编辑或重启，history或runtime
          this.nodeActions = action.defaultActions;
          break;
      }
    },
    async changeSwitch() {
      await this.getData();
      this.instructions = [];
      if (this.tab === 0) {
        this.getTab();
      } else {
        this.tab = 0;
      }
    },
    selectVersion() {
      this.$router.replace({
        name: "process-detail",
        params: {
          id: this.version,
        },
        query: this.$route.query,
      });
    },
    switchLeft() {
      this.$refs.resizeDrawer.setLeft(!this.left);
    },
    switchBottom() {
      this.bottom = this.$refs.resizeLayoutBottom.switchShow();
    },
    toggleFullscreen(full) {
      this.$refs.resizeDrawer.setLeft(!full);
      if (full) {
        //全屏
        this.bottom = true;
      } else {
        this.bottom = false;
      }
      this.$refs.resizeLayoutBottom.manageShow(this.bottom);
    },
    copyMessage(value) {
      navigator.clipboard.writeText(value);
      this.$notify.success(this.$t("copyTrackSuccess"));
    },
    copy(value) {
      navigator.clipboard.writeText(value);
      this.$message({
        message: this.$t("copySuccessWithTxt",{txt:value}),
        type: "success",
        showClose:true
      });
    },
    loadBpm() {
    },
    async getData() {
      let response = await request.getProcess(this.$route.params.id);
      this.process = response;
      this.tabKey++;

      this.breadcrumbs[1].text = response.name;
      response = await request.getInstanceCount("", {
        processDefinitionId: this.$route.params.id,
      });
      this.process.instanceCount = response.count;

      response = await request.getInstanceCount("", {
        processDefinitionKey: this.process.key,
      });
      this.process.allInstanceCount = response.count;

      response = await request.getProcessVersions(this.process.key);
      response.sort(function (a, b) {
        return b.version - a.version;
      });
      let versionsTmp = response;
      // 调用统计接口获取每个版本的数据情况
      this.versions = versionsTmp;

      this.version = this.process.id;
      response = await request.getProcessStatistics("", this.process.id);
      var instanceCount = 0;
      var incidentCount = 0;
      response.forEach((item) => {
        item.incidents.forEach((incident) => {
          incidentCount += incident.incidentCount;
        });
        instanceCount += item.instances;
      });
      this.breadcrumbSummary.version = this.process.version;
      this.breadcrumbSummary.incident = incidentCount;
      this.breadcrumbSummary.instance = instanceCount;

      await this.getStatistics();

      response = await request.getProcessXml(this.$route.params.id);
      this.xml = response.bpmn20Xml;
      this.getTab();
    },
    async getStatistics() {
      var statistics = await request.getProcessStatistics("",
          this.$route.params.id
      );
      var nodeProperties = {};

      statistics.forEach((item) => {
        var incidents = 0;
        if (item.incidents) {
          item.incidents.forEach((incident) => {
            incidents += incident.incidentCount;
          });
        } else {
          incidents = item.openIncidents;
        }
        nodeProperties[item.id] = {
          instances: item.instances,
          incidents,
          failedJobs: item.failedJobs,
          canceled: item.canceled,
          finished: item.finished,
        };
      });

      this.nodeProperties = nodeProperties;
    },
    setInstanceVariables() {
      this.$refs.instanceVariable.start();
    },
    async getInstances(filter = true) {
      this.instances.loading = true;
      var type = "history";
      this.instances.totalCount = 0;
      this.instances.page = 0;
      var param= {
        processDefinitionId: this.$route.params.id,
        unfinished: true,
      };
      if (filter) {
        if (this.instances.filter.withIncidents) {
          param.withIncidents = true;
        }
        if (this.instances.filter.suspended) {
          param.suspended = true;
        }
        if (this.instances.filter.businessKey) {
          param.processInstanceBusinessKeyLike =
              "%" + this.instances.filter.businessKey + "%";
        }

        if (this.instances.filter.variables.length) {
          var expressions = this.instances.filter.variables.map(
              (variable) =>
                  `${variable.name}_${variable.operator}_${variable.value}`
          );
          param.variables = expressions.join(",");
          param.variableNamesIgnoreCase = true;
          param.variableValuesIgnoreCase = true;
        }

        var formattedDate;
        if (this.instances.filter.startedBefore) {
          formattedDate =
              utils.formatDateTime(
                  this.instances.filter.startedBefore,
                  "yyyy-MM-DDTHH:mm:ss.SSS"
              ) +
              utils
                  .formatDateTime(this.instances.filter.startedBefore, "Z")
                  .replace(":", "");
          param.startedBefore = formattedDate;
        }
        if (this.instances.filter.startedAfter) {
          formattedDate =
              utils.formatDateTime(
                  this.instances.filter.startedAfter,
                  "yyyy-MM-DDTHH:mm:ss.SSS"
              ) +
              utils
                  .formatDateTime(this.instances.filter.startedAfter, "Z")
                  .replace(":", "");
          param.startedAfter = formattedDate;
        }
      }
      var response = await request.getInstanceCount(type, param);
      this.instances.totalCount = response.count;
      this.instances.pageCount =
          Math.floor((response.count - 1) / this.instances.itemsPerPage) + 1;
      this.instances.page = 1;
    },
    async getInstancesPage() {
      this.instances.loading = true;
      if (!this.instances.page) {
        this.instances.items = [];
        return;
      }
      var type = "history";
      var param = {
        processDefinitionId: this.$route.params.id,
        firstResult: (this.instances.page - 1) * this.instances.itemsPerPage,
        maxResults: this.instances.itemsPerPage,
        sortBy: this.instances.sortBy,
        sortOrder: this.instances.sortOrder,
        unfinished: true,
      };
      param.unfinished = true;
      if (this.instances.filter.withIncidents) {
        param.withIncidents = true;
      }
      if (this.instances.filter.suspended) {
        param.suspended = true;
      }
      if (this.instances.filter.businessKey) {
        param.processInstanceBusinessKeyLike =
            "%" + this.instances.filter.businessKey + "%";
      }

      if (this.instances.filter.variables.length) {
        var expressions = this.instances.filter.variables.map(
            (variable) =>
                `${variable.name}_${variable.operator}_${variable.value}`
        );
        param.variables = expressions.join(",");
        param.variableNamesIgnoreCase = true;
        param.variableValuesIgnoreCase = true;
      }

      var formattedDate;
      if (this.instances.filter.startedBefore) {
        formattedDate =
            utils.formatDateTime(
                this.instances.filter.startedBefore,
                "yyyy-MM-DDTHH:mm:ss.SSS"
            ) +
            utils
                .formatDateTime(this.instances.filter.startedBefore, "Z")
                .replace(":", "");
        param.startedBefore = formattedDate;
      }
      if (this.instances.filter.startedAfter) {
        formattedDate =
            utils.formatDateTime(
                this.instances.filter.startedAfter,
                "yyyy-MM-DDTHH:mm:ss.SSS"
            ) +
            utils
                .formatDateTime(this.instances.filter.startedAfter, "Z")
                .replace(":", "");
        param.startedAfter = formattedDate;
      }
      let instances = await request.getInstanceList(type, param);
      instances.forEach((instance) => (instance.withIncidents = false));
      this.instances.items = instances;
      param.withIncidents = true;
      instances = await instanceRequest.getHistoryInstances(param);

      this.instances.items.forEach((instance) => {
        var item = instances.find(
            (instanceItem) => instanceItem.id === instance.id
        );
        if (item) {
          instance.withIncidents = true;
        }
      });
      this.instances.loading = false;
    },
    onClick(message) {
      alert(message);
    },
    async getIncidents() {
      this.incidents.loading = true;
      this.incidents.totalCount = 0;
      this.incidents.page = 0;
      var data = {
        processDefinitionId: this.$route.params.id,
      };
      if (
          this.incidents.filter.failedJob &&
          !this.incidents.filter.failedExternalTask
      ) {
        data.incidentType = "failedJob";
      }

      if (
          this.incidents.filter.failedExternalTask &&
          !this.incidents.filter.failedJob
      ) {
        data.incidentType = "failedExternalTask";
      }
      var type = "";

      var response = await request.getIncidentCount(type, data);
      this.incidents.totalCount = response.count;
      this.incidents.pageCount =
          Math.floor((response.count - 1) / this.incidents.itemsPerPage) + 1;
      this.incidents.page = 1;
    },
    async getIncidentPage() {
      this.incidents.loading = true;
      if (!this.incidents.page) {
        this.incidents.items = [];
        return;
      }
      this.incidents.sortBy = "incidentTimestamp";
      var data = {
        processDefinitionId: this.$route.params.id,
        firstResult: (this.incidents.page - 1) * this.incidents.itemsPerPage,
        maxResults: this.incidents.itemsPerPage,
        sortBy: this.incidents.sortBy,
        sortOrder: this.incidents.sortOrder,
      };

      if (
          this.incidents.filter.failedJob &&
          !this.incidents.filter.failedExternalTask
      ) {
        data.incidentType = "failedJob";
      }

      if (
          this.incidents.filter.failedExternalTask &&
          !this.incidents.filter.failedJob
      ) {
        data.incidentType = "failedExternalTask";
      }
      var type = "";

      let incidents = await request.getIncidentList(type, data);

      this.incidents.items = incidents;
      this.incidents.loading = false;
    },
    formatIncidentStatus(item) {
      var status = [];
      if (item.open) {
        status.push(this.$t("running"));
      }
      if (item.deleted) {
        status.push(this.$t("deleted"));
      }
      if (item.resolved) {
        status.push(this.$t("resolved"));
      }
      return status.join(" | ");
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
    async getJobDefinitions() {
      this.jobDefinitions.loading = true;
      this.jobDefinitions.totalCount = 0;
      this.jobDefinitions.page = 0;
      var response = await request.getJobDefinitionCount(this.$route.params.id);
      this.jobDefinitions.totalCount = response.count;
      this.jobDefinitions.pageCount =
          Math.floor((response.count - 1) / this.jobDefinitions.itemsPerPage) + 1;
      this.jobDefinitions.page = 1;
    },
    async getJobDefinitionPage() {
      if (!this.jobDefinitions.page) {
        this.jobDefinitions.items = [];
        return;
      }
      let jobDefinitions = await request.getJobDefinitionList(
          this.$route.params.id,
          this.jobDefinitions.page,
          this.jobDefinitions.itemsPerPage
      );
      this.jobDefinitions.items = jobDefinitions;
      this.jobDefinitions.loading = false;
    },

    async getJobLogs() {
      this.jobLogs.loading = true;
      this.jobLogs.totalCount = 0;
      this.jobLogs.page = 0;
      var response = await request.getJobLogCount({
        processDefinitionId: this.$route.params.id,
      });
      this.jobLogs.totalCount = response.count;
      this.jobLogs.pageCount =
          Math.floor((response.count - 1) / this.jobLogs.itemsPerPage) + 1;
      this.jobLogs.page = 1;
    },
    async getJobLogPage() {
      this.jobLogs.loading = true;
      if (!this.jobLogs.page) {
        this.jobLogs.items = [];
        return;
      }
      let jobLogs = await request.getJobLogList({
        processDefinitionId: this.$route.params.id,
        firstResult: (this.jobLogs.page - 1) * this.jobLogs.itemsPerPage,
        maxResults: this.jobLogs.itemsPerPage,
        sortBy: this.jobLogs.sortBy,
        sortOrder: this.jobLogs.sortOrder,
      });
      this.jobLogs.items = jobLogs;
      this.jobLogs.loading = false;
    },

    async getExternalTaskLogs() {
      this.externalTaskLogs.loading = true;
      this.externalTaskLogs.items = await request.getHistoryExternalTaskLogs({
        processDefinitionId: this.$route.params.id,
        sortBy: "activityId",
        sortOrder: "asc",
      });
      this.externalTaskLogs.loading = false;
    },
    async getUserOperations() {
      this.userOperations.loading = true;
      this.userOperations.totalCount = 0;
      this.userOperations.page = 0;
      var response = await request.getUserOperationCount(this.$route.params.id);
      this.userOperations.totalCount = response.count;
      this.userOperations.pageCount =
          Math.floor((response.count - 1) / this.userOperations.itemsPerPage) + 1;
      this.userOperations.page = 1;
    },
    async getUserOperationPage() {
      this.userOperations.loading = true;
      if (!this.userOperations.page) {
        this.userOperations.items = [];
        return;
      }
      let userOperations = await request.getUserOperationList(
          this.$route.params.id,
          this.userOperations.page,
          this.userOperations.itemsPerPage,
          this.userOperations.sortBy,
          this.userOperations.sortOrder
      );
      this.userOperations.items = userOperations;
      this.userOperations.loading = false;
    },

    async getCallActivities() {
      this.call.loading = true;
      var activities = [];
      let result = await request.getCalledProcessDefinitions(this.process.id);

      result.forEach((process) => {
        process.calledFromActivityIds.forEach((id) => {
          let item = Object.assign({}, process);
          item.activityId = id;
          activities.push(item);
        });
      });
      this.callActivities = activities;
      this.call.loading = false;
    },

    async deleteProcess() {
      try {
        var data = {
          cascade: this.deleteDialog.cascade,
          skipCustomListeners: this.deleteDialog.skipCustomListeners,
          skipIoMappings: this.deleteDialog.skipIoMappings,
        };
        await request.deleteProcess(this.$route.params.id, data);
      } catch (error) {
        this.deleteDialog.display = false;
        this.$message({
          message: this.deleteDialog.error,
          type: "error",
          showClose:true
        });

        return;
      }

      this.deleteDialog.display = false;

      this.$message({
        message: this.deleteDialog.success,
        type: "success",
        showClose:true
      });
      this.$router.replace({
        name: "process",
      });
    },

    async suspend() {
      let targetType = this.$t(this.process.suspended ? "active" : "suspend");

      var data = {
        suspended: !this.process.suspended,
        includeProcessInstances: this.suspendDialog.includeProcessInstances,
      };
      if (this.suspendDialog.dateType === "2") {
        if (
            !this.suspendDialog.executionDate ||
            !this.suspendDialog.executionTime
        ) {
          this.$message({
            message: this.$t("plsInputDateAndTime"),
            type: "error",
            showClose:true
          });
          return;
        } else {
          data.executionDate = utils.formatDateTime(
              this.suspendDialog.executionDate +
              " " +
              this.suspendDialog.executionTime,
              "yyyy-MM-DDTHH:mm:ss.SSSZ"
          );
        }
      }

      await request.suspend(this.$route.params.id, data);
      this.suspendDialog.display = false;
      if (this.suspendDialog.dateType === "1") {
        this.$message({
          message: this.$t("processDefFailedWithOpt",{opt:targetType}),
          type: "success",
          showClose:true
        });
      } else if (this.suspendDialog.dateType === "2") {
        this.$message({
          message: this.$t("staticTimeSuccessWithOpt",{opt:targetType}),
          type: "success",
          showClose:true
        });
      }

      this.getData();
    },
    async startSetJobPriority(job) {
      this.setJobPriorityDialog.job = job;
      this.setJobPriorityDialog.includeJobs = false;
      this.setJobPriorityDialog.priority = "";
      this.setJobPriorityDialog.display = true;
    },
    async setJobPriority(job) {
      var priority = this.setJobPriorityDialog.priority
          ? parseInt(this.setJobPriorityDialog.priority)
          : 0;

      if (priority <= 0) {
        this.$message({
          message: this.$t("plsInputValidPriority"),
          type: "error",
          showClose:true
        });
        return;
      }

      await request.setJobPriority(this.setJobPriorityDialog.job.id, {
        priority,
        includeJobs: this.setJobPriorityDialog.includeJobs,
      });
      this.setJobPriorityDialog.display = false;

      this.$message({
        message: this.$t("setJobPrioritySuccess"),
        type: "success",
        showClose:true
      });
      this.getJobDefinitions();
    },

    async startSuspendJob(job) {
      this.suspendJobDialog.job = job;
      this.suspendJobDialog.display = true;
    },
    async suspendJob(job) {
      var targetType =  this.$t(this.suspendJobDialog.job.suspended ? "active" : "suspend");

      var data = {
        suspended: !this.suspendJobDialog.job.suspended,
        includeProcessInstances: this.suspendJobDialog.includeProcessInstances,
      };
      if (this.suspendJobDialog.dateType === "2") {
        if (
            !this.suspendJobDialog.executionDate ||
            !this.suspendJobDialog.executionTime
        ) {
          this.$message({
            message: this.$t("plsInputDateAndTime"),
            type: "error",
            showClose:true
          });
          return;
        } else {
          data.executionDate = utils.formatDateTime(
              this.suspendJobDialog.executionDate +
              " " +
              this.suspendJobDialog.executionTime,
              "yyyy-MM-DDTHH:mm:ss.SSSZ"
          );
        }
      }

      await request.suspendJob(this.suspendJobDialog.job.id, data);
      this.suspendJobDialog.display = false;
      if (this.suspendJobDialog.dateType === "1") {
        this.$message({
          message: this.$t("jobDefSuccessWithOpt",{opt:targetType}),
          type: "success",
          showClose:true
        });
      } else if (this.suspendJobDialog.dateType === "2") {
        this.$message({
          message: this.$t("staticTimeSuccessWithOpt",{opt:targetType}),
          type: "success",
          showClose:true
        });
      }

      this.getJobDefinitions();
    },
    startRetryJobDefinition(job) {
      this.retryJobDefinitionDialog.job = job;
      this.retryJobDefinitionDialog.display = true;
    },
    async retryJobDefinition() {
      try {
        switch (this.retryJobDefinitionDialog.job.incidentType) {
          case "failedJob":
            await instanceRequest.retryJob(this.retryJobDefinitionDialog.job.configuration, {
              retries: 1,
            });
            break;
          case "failedExternalTask":
            await processRequest.setExternalTaskRetries(this.retryJobDefinitionDialog.job.configuration, {
              retries: 1,
            });
            break;
        }
      } catch (error) {
        this.retryJobDefinitionDialog.display = false;
        this.$message({
          message: this.retryJobDefinitionDialog.error,
          type: "error",
          showClose:true
        });
        return;
      }

      this.retryJobDefinitionDialog.display = false;

      this.$message({
        message: this.retryJobDefinitionDialog.success,
        type: "success",
        showClose:true
      });
    },

    startRetryJob(job) {
      this.retryJobDialog.job = job;
      this.retryJobDialog.display = true;
    },
    async retryJob() {
      try {
        await instanceRequest.retryJob(this.retryJobDialog.job.configuration, {
          retries: 1,
        });
      } catch (error) {
        this.retryJobDialog.display = false;
        this.$message({
          message: this.retryJobDialog.error,
          type: "error",
          showClose:true
        });
        return;
      }

      this.retryJobDialog.display = false;

      this.$message({
        message: this.retryJobDialog.success,
        type: "success",
        showClose:true
      });
    },
    async deleteInstance() {
      this.$refs.instanceDelete.start();
    },
    editAnnotation(item) {
      item.annotationEdit = item.annotation || "";
    },
    async saveAnnotation(item) {
      try {
        await request.saveAnnotation(item.id, {
          annotation: item.annotationEdit,
        });
      } catch (error) {
        this.$message({
          message: this.$t("saveRemarkErr"),
          type: "error",
          showClose:true
        });
        return;
      }
      item.menu = false;

      this.$message({
        message: this.$t("saveRemarkSuccess"),
        type: "success",
        showClose:true
      });

      await this.getIncidents();
    },
    moveUpInstruction(instruction) {
      let index = this.instructions.indexOf(instruction);
      if (index > 0) {
        this.instructions.splice(index, 1);
        this.instructions.splice(index - 1, 0, instruction);
      }
    },
    moveDownInstruction(instruction) {
      let index = this.instructions.indexOf(instruction);
      if (index < this.instructions.length - 1) {
        this.instructions.splice(index, 1);
        this.instructions.splice(index + 1, 0, instruction);
      }
    },
    removeInstruction(instruction) {
      let index = this.instructions.indexOf(instruction);
      this.instructions.splice(index, 1);
    },

    selectInstructionType(instruction) {
    },
    onClickNode(element) {
      this.currentElement = element.businessObject;
      this.$refs.vueBpmnViwer.setNodeSelected(element);
    },
    onGetCollaborations(collaborations) {
      this.collaborations = collaborations.filter(collaboration => collaboration.id !== this.process.key);
    },
    selectActivity(activity) {
      this.onClickNode(activity.node);
      return false;
    },
    selectOtherActivity(activity) {
      let node = this.$refs.vueBpmnViwer.getNodeById(activity);
      if (node) {
        this.onClickNode(node);
        return false;
      } else {
        this.$notify({
          title: this.$t("noFindActivityNode"),
          type: "error",
          position: "bottom-right",
          offset: 100,
          showClose: false
        });
      }
    }
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
  /* height: calc(100% - 50px); */
  background-color: rgba(232, 239, 247, 16);
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
  margin: auto 0 auto 15px;
  padding: 0;
  height: 24px;
}

button.process-menu {
  padding: 0 10px;
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
