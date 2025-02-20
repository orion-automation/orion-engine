<template>
  <div style="border-top: 1px solid rgba(187, 187, 187, 1);height: 100%" class="d-flex flex-column">
    <div class="d-flex flex-row" style="align-items: center;padding: 14px 15px">
      <v-breadcrumbs :items="breadcrumbs" style="background-color: #e8eff7;padding: 0;border: none" divider="|"/>
      <div style="background-color: #e8eff7;font-size: 14px;margin-left: 10px">
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
      <v-breadcrumbs
          class="id-breadcrumbs"
          :items="idBreadcrumbs"
          style="background-color: #e8eff7;padding: 0;border: none"
          divider="|"
      />
      <div style="background-color: #e8eff7;font-size: 14px;margin-left: 10px">
        <span class="instance-status">
           <v-icon size="14" color="#000000" v-show="instance.state == 'ACTIVE'">mdi-play-circle</v-icon>
          <v-icon size="14" color="#000000" v-show="instance.state == 'SUSPENDED'">mdi-pause-circle</v-icon>
          <v-icon size="14" color="#000000" v-show="instance.state == 'COMPLETED'">mdi-stop-circle</v-icon>
          <v-icon size="14" color="#000000"
                  v-show="instance.state == 'EXTERNALLY_TERMINATED'">mdi-backspace-reverse</v-icon>
          <v-icon size="14" color="#000000" v-show="instance.state == 'INTERNALLY_TERMINATED'">mdi-backspace</v-icon>
        </span>
      </div>
    </div>

    <v-card v-show="!startUserTaskDialog.display" class="detail-card"
            style="border-top: 1px solid rgba(187, 187, 187, 1);flex: 1;height: 0px"
    >
      <v-layout style="margin: 0;height: 100%" class="stretch">
        <re-size-drawer ref="resizeDrawer" @setLeftWidth="setLeftWidth">
          <v-icon class="navigation-icon" @click="switchLeft()">
            mdi-chevron-left
          </v-icon>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                {{ $t('processName') }}
              </v-list-item-subtitle>
              <div class="value">
                {{ process.name }}
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                {{ $t('version') }}
              </v-list-item-subtitle>
              <div class="value">
                {{ instance.processDefinitionVersion }}
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                {{ $t('topic') }}
              </v-list-item-subtitle>
              <div class="value">
                {{ instance.businessKey }}
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                {{ $t('processInstanceId') }}
              </v-list-item-subtitle>
              <div class="value">
                {{ instance.id }}
                <v-icon
                    class="copyIcon"
                    v-show="instance.id"
                    style="cursor: pointer"
                    color="#FF7754"
                    :title="$t('clickCopy') + instance.id"
                    size="12.8"
                    @click="copy(instance.id)"
                >
                  mdi-file-move
                </v-icon>
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                {{ $t('parentProcessInstanceId') }}
              </v-list-item-subtitle>
              <div class="value">
                <router-link
                    v-if="instance.superProcessInstanceId"
                    :to="{
                    name: 'instance-detail',
                    params: {
                      id: instance.superProcessInstanceId,
                    },
                    query: {},
                  }"
                >
                  {{ instance.superProcessInstanceId }}
                </router-link>
                <span v-else>-</span>
                <v-icon
                    class="copyIcon"
                    v-show="instance.superProcessInstanceId"
                    style="cursor: pointer"
                    color="#FF7754"
                    :title="$t('clickCopy') + instance.superProcessInstanceId"
                    size="12.8"
                    @click="copy(instance.superProcessInstanceId)"
                >
                  mdi-file-move
                </v-icon>
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                {{ $t('processDefId') }}
              </v-list-item-subtitle>
              <div class="value">
                <router-link
                    :to="{
                    name: 'process-detail',
                    params: {
                      id: process.id,
                    },
                    query: {},
                  }"
                >
                  {{ process.id }}
                </router-link>
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
                {{ $t('tenantId') }}
              </v-list-item-subtitle>
              <div class="value">
                {{ instance.tenantId || "-" }}
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                {{ $t('startTime') }}
              </v-list-item-subtitle>

              <div class="value">
                {{
                  instance.startTime ? formatDateTime(instance.startTime) : "-"
                }}
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                {{ $t('endTime') }}
              </v-list-item-subtitle>

              <div class="value">
                {{ instance.endTime ? formatDateTime(instance.endTime) : "-" }}
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
          <el-row type="flex" justify="start" class="menu-border">
            <v-btn
                large
                text
                class="process-menu"
                @click="toggleFullscreen(left)"
                :style="leftStyleMargin"
                style="border-right: 1px solid rgba(187, 187, 187, 1);"
            >
              <v-icon color="green" size="20">
                {{ left ? "mdi-fullscreen" : "mdi-fullscreen-exit" }}
              </v-icon>
              <span/>
            </v-btn>
            <v-spacer/>
            <v-btn
                :disabled="instance.state == 'COMPLETED'"
                large
                text
                class="process-menu"
                @click="deleteDialog.display = true"
                style="border-right: 1px solid rgba(187, 187, 187, 1);border-left: 1px solid rgba(187, 187, 187, 1)"
            >
              <v-icon size="16" color="#83829A" style="margin-right:6px;">
                mdi-delete-forever-outline
              </v-icon>
              <span style="color: #444262">{{ $t('deleteProcessInstance') }}</span>
            </v-btn>

            <v-btn
                large
                text
                class="process-menu"
                v-show="instance.state == 'ACTIVE'"
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
                v-show="instance.state == 'SUSPENDED'"
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
                @click="addVariableByDialog"
                style="border-right: 1px solid rgba(187, 187, 187, 1);"
            >
              <v-icon size="20" color="#83829A" style="margin-right:6px;">mdi-redo</v-icon>
              <span style="color: #444262">{{ $t('addVars') }}</span>
            </v-btn>

            <v-btn
                large
                text
                class="process-menu"
                @click="addMessageByDialog"
                style="border-right: 1px solid rgba(187, 187, 187, 1);"
            >
              <v-icon size="20" color="#83829A" style="margin-right:6px;">mdi-message-plus-outline</v-icon>
              <span style="color: #444262">{{ $t('sendMsg') }}</span>
            </v-btn>

            <v-btn v-show="false" large text class="process-menu"
                   style="border-right: 1px solid rgba(187, 187, 187, 1);"
            >
              <v-icon size="20" color="#F50057" style="margin-right:6px;">mdi-swap-horizontal</v-icon>
              <span>{{ $t('migrate') }}</span>
            </v-btn>

            <v-btn v-show="false" large text class="process-menu"
                   style="border-right: 1px solid rgba(187, 187, 187, 1);"
            >
              <v-icon size="20" color="#F50057" style="margin-right:6px;">
                mdi-chart-areaspline-variant
              </v-icon>
              <span>{{ $t('heatMap') }}</span>
            </v-btn>

            <v-btn v-show="false" large text class="process-menu"
                   style="border-right: 1px solid rgba(187, 187, 187, 1);"
            >
              <v-icon size="20" color="#F50057" style="margin-right:6px;">mdi-chart-line-variant</v-icon>
              <span>{{ $t('report') }}</span>
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
                @onVariableHistory="onVariableHistory"
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
                style="flex: 0"
                :key="tabKeyComputed"
                class="bottom-container"
                :style="leftStylePadding"
            >
              <div class="vertical-collapsed">
                <v-icon class="navigation-icon" @click="switchBottom()">
                  {{ !bottom ? "mdi-chevron-down" : "mdi-chevron-up" }}
                </v-icon>
              </div>
              <v-tabs-slider color="#FF7754"/>
              <v-tab key="variable"> {{ $t('variable') }}</v-tab>
              <v-tab key="incident">{{ $t('incident') }}</v-tab>
              <v-tab key="call">{{ $t('callInstances') }}</v-tab>
              <v-tab key="job"> {{ $t('jobTask') }}</v-tab>
              <v-tab key="job2"> {{ $t('userTask') }}</v-tab>
              <v-tab key="edit"> {{ $t('edit') }}</v-tab>
              <v-tab key="externalTask">{{ $t('externalTask') }}</v-tab>
              <v-tab key="document"> {{ $t('document') }}</v-tab>
            </v-tabs>
            <v-tabs-items
                v-model="tab"
                style="overflow-x:hidden;"
                :key="tabItemKey"
                class="bottom-container"
                :style="leftStylePadding"
            >
              <v-tab-item key="variable" transition="false">
                <v-row style="margin: 0 20px; height: 54px">
                  <v-col style="padding: 0" cols="12" sm="4" md="4" lg="2">
                    <v-text-field
                        :label="$t('variableName')"
                        v-model="variables.filter.variableName"
                        @keydown.enter="getVariables()"
                        hide-details
                        style="font-size: 14px"
                    >
                      <template #label>
                        <div style="font-size: 14px">{{ $t('variableName') }}</div>
                      </template>
                    </v-text-field>
                  </v-col>
                </v-row>
                <el-table :data="variables.items"
                          v-loading="variables.loading"
                          border
                          :max-height="tableMaxHeight"
                          @sort-change="variablesSortChange"
                          :default-sort="{prop: variables.sortBy == 'variableName' ? 'name' : variables.sortBy, order: variables.sortOrder == 'desc' ? 'descending' : 'ascending'}"
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

                  <el-table-column prop="value" :label="$t('value')" min-width="250">
                    <template slot-scope="props">
                      <a @click="editVariableObjectByDialog(props.row)" href="javascript:void(0)"
                         v-if="props.row.type==='Object'"
                      >{{ props.row.valueInfo.objectTypeName }}</a>
                      <a @click="editVariableObjectByDialog(props.row)" href="javascript:void(0)"
                         v-else-if="props.row.type==='Json'"
                         style="text-overflow: ellipsis;overflow: hidden;word-break: break-all;white-space: nowrap"
                      >{{ props.row.value }}</a>
                      <a @click="fileDownload(props.row)" href="javascript:void(0)"
                         v-else-if="props.row.type==='File'"
                         style="text-overflow: ellipsis;overflow: hidden;word-break: break-all;white-space: nowrap"
                      >{{ props.row.valueInfo.filename }}</a>
                      <div v-else>{{ props.row.value }}</div>
                    </template>
                  </el-table-column>

                  <el-table-column prop="state" :label="$t('status')"/>

                  <el-table-column
                      prop="activityName"
                      :label="$t('scope')"
                      width="380"
                  />

                  <el-table-column :label="$t('operate')" width="130">
                    <template slot-scope="props">
                        <span
                            class="badge badge-edit badge-menu"
                            @click="editVariableByDialog(props.row)"
                        ><v-icon size="10" color="white">mdi-pencil</v-icon></span>
                      <v-menu
                          v-model="props.row.deleteMenu"
                          :close-on-content-click="false"
                          :nudge-width="200"
                          offset-x
                      >
                        <template #activator="{ on, attrs }">
                            <span
                                class="badge badge-trash badge-menu"
                                @click="editVariable(props.row)"
                                v-bind="attrs"
                                v-on="on"
                            ><v-icon size="10" color="white">mdi-delete</v-icon></span>
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
                                @click="deleteVariable(props.row)"
                            >
                              {{ $t('delete') }}
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-menu>
                    </template>
                  </el-table-column>
                </el-table>
                <div
                    class="text-center mb-2 my-2"
                    v-show="variables.pageCount > 1"
                >
                  <v-pagination
                      v-model="variables.page"
                      :length="variables.pageCount"
                      total-visible="20"
                      color="#FF7754"
                  />
                </div>
              </v-tab-item>
              <v-tab-item key="incident" transition="false">
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
                        <el-tooltip class="item" effect="dark" :content="$t('rootCauseErrMsg')"
                                    placement="bottom-start">
                          <v-icon style="margin-left: 5px" @click="loadMsgDetail('root',props.row)" small
                                  color="#FF7754"
                          >
                            mdi-alert-box-outline
                          </v-icon>
                        </el-tooltip>
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

                  <el-table-column :label="$t('time')" width="180" prop="incidentTimestamp"
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
                      min-width="340"
                  >
                    <template slot-scope="props">
                      <div class="tabCopy">
                        <div style="cursor: pointer;color: #1976d2;display: inline;"
                             @click="incidentSkip(props.row.causeIncidentId)"
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
                      min-width="340"
                  >
                    <template slot-scope="props">
                      <div class="tabCopy">
                        <div style="cursor: pointer;color: #1976d2;display: inline;"
                             @click="incidentSkip(props.row.rootCauseIncidentId)"
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
                          v-model="props.row.menu"
                          :close-on-content-click="false"
                          :nudge-width="200"
                          offset-x
                      >
                        <template #activator="{ on, attrs }">
                          <v-icon size="10"
                                  v-bind="attrs"
                                  v-on="on"
                                  @click="editAnnotation(props.row)"
                                  color="white">mdi-pencil</v-icon>
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
                            @click="startRetryJob(props.row)"
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
                <el-table :data="callInstances.items"
                          border
                          :max-height="tableMaxHeight"
                          v-loading="callInstances.loading"
                >
                  <el-table-column :label="$t('status')" width="100">
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

                  <el-table-column :label="$t('topic')" width="250">
                    <template slot-scope="props">
                      {{ props.row.businessKey }}
                    </template>
                  </el-table-column>

                  <el-table-column :label="$t('callInstances')" min-width="340">
                    <template slot-scope="props">
                      <div class="tabCopy">
                        <router-link
                            :to="{
                              name: 'instance-detail',
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

                  <el-table-column :label="$t('processDef')" width="300">
                    <template slot-scope="props">
                      <router-link
                          :to="{
                            name: 'process-detail',
                            params: { id: props.row.process.id },
                          }"
                      >
                        {{ props.row.process.name ? props.row.process.name : props.row.process.key }}
                      </router-link>
                    </template>
                  </el-table-column>
                </el-table>
                <div
                    class="text-center mb-2 my-2"
                    v-show="callInstances.pageCount > 1"
                >
                  <v-pagination
                      v-model="callInstances.page"
                      :length="callInstances.pageCount"
                      total-visible="20"
                      color="#FF7754"
                  />
                </div>
              </v-tab-item>
              <v-tab-item key="job" transition="false">
                <el-table :data="jobDefinitions.items"
                          v-loading="jobDefinitions.loading"
                          style="width: auto"
                          border
                          :max-height="tableMaxHeight"
                          @sort-change="jobDefinitionsSortChange"
                          :default-sort="{prop: jobDefinitions.sortBy == 'jobId' ? 'id' : jobDefinitions.sortBy, order: jobDefinitions.sortOrder == 'desc' ? 'descending' : 'ascending'}"
                >
                  <el-table-column label="Job ID" prop="id" min-width="340" sortable="custom">
                    <template slot-scope="props">
                      <div class="tabCopy">
                        {{ props.row.id }}
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

                  <el-table-column :label="$t('createTime')" width="180" prop="createTime">
                    <template slot-scope="props">
                      {{ formatDateTime(props.row.createTime) }}
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('dueTime')" width="180" prop="dueDate">
                    <template slot-scope="props">
                      {{ formatDateTime(props.row.dueDate) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                      :label="$t('retryCount')"
                      prop="retries"
                      width="80"
                      align="center"
                  />
                  <el-table-column :label="$t('activity')" prop="activityId">
                    <template slot-scope="props">
                      <router-link
                          :to="{}"
                          @click.native="selectOtherActivity(props.row.activityId)"
                      >
                        {{ props.row.activityId }}
                      </router-link>
                    </template>
                  </el-table-column>

                  <el-table-column :label="$t('failedActivity')" prop="failedActivityId">
                    <template slot-scope="props">
                      <router-link
                          :to="{}"
                          @click.native="selectOtherActivity(props.row.failedActivityId)"
                      >
                        {{ props.row.failedActivityId }}
                      </router-link>
                    </template>
                  </el-table-column>

                  <el-table-column :label="$t('operate')" width="100">
                    <template slot-scope="props">
                      <v-menu
                          v-model="props.row.suspendMenu"
                          :close-on-content-click="false"
                          :nudge-width="200"
                          offset-x
                      >
                        <template #activator="{ on, attrs }">
                            <span
                                class="badge badge-menu"
                                style="background-color: #fa4f07"
                                @click="confirmSuspendJob(props.row)"
                                v-bind="attrs"
                                v-on="on"
                            >
                              <v-icon size="10" color="white">{{ props.row.suspended ?'mdi-play':'mdi-pause' }}</v-icon>
                            </span>
                        </template>

                        <v-card>
                          <v-card-title class="small-headline">
                            {{ $t(props.row.suspended ? "active" : "suspend") }}Job
                          </v-card-title>
                          <v-card-text>
                            <div>
                              {{
                                $t('jobWithOptAndId', {
                                  opt: $t(props.row.suspended ? "active" : "suspend"),
                                  id: props.row.id
                                })
                              }}
                            </div>
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer/>
                            <v-btn text @click="props.row.suspendMenu = false">
                              {{ $t('cancel') }}
                            </v-btn>
                            <v-btn
                                color="primary"
                                text
                                @click="suspendJob(props.row)"
                            >
                              {{ $t('confirm') }}
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-menu>

                      <v-menu
                          v-model="props.row.dueMenu"
                          :close-on-content-click="false"
                          :nudge-width="200"
                          offset-x
                      >
                        <template #activator="{ on, attrs }">
                            <span
                                class="badge badge-menu"
                                style="background-color: #312651"
                                @click="startSetJobDueDate(props.row)"
                                v-bind="attrs"
                                v-on="on"
                            ><v-icon size="10" color="white">mdi-clock</v-icon></span>
                        </template>

                        <v-card>
                          <v-card-title class="small-headline">
                            {{ $t('setNextExecuteDate') }}
                          </v-card-title>
                          <v-card-text>
                            <v-form ref="form" lazy-validation>
                              <v-menu
                                  v-model="props.row.due.dislayDate"
                                  :close-on-content-click="false"
                                  :nudge-left="80"
                                  transition="scale-transition"
                                  offset-y
                                  min-width="auto"
                              >
                                <template #activator="{ on, attrs }">
                                  <v-text-field
                                      v-model="props.row.due.date"
                                      :label="$t('plsSelectDate')"
                                      prepend-icon="mdi-calendar"
                                      readonly
                                      v-bind="attrs"
                                      v-on="on"
                                  />
                                </template>
                                <v-date-picker
                                    v-model="props.row.due.date"
                                    @input="props.row.due.dislayDate = false"
                                />
                              </v-menu>

                              <v-menu
                                  ref="timeMenu"
                                  v-model="props.row.due.dislayTime"
                                  :close-on-content-click="false"
                                  :nudge-left="0"
                                  :return-value.sync="props.row.due.time"
                                  transition="scale-transition"
                                  offset-y
                                  max-width="290px"
                                  min-width="290px"
                              >
                                <template #activator="{ on, attrs }">
                                  <v-text-field
                                      v-model="props.row.due.time"
                                      :label="$t('plsSelectTime')"
                                      prepend-icon="mdi-clock-time-four-outline"
                                      readonly
                                      v-bind="attrs"
                                      v-on="on"
                                  />
                                </template>
                                <v-time-picker
                                    v-if="props.row.due.dislayTime"
                                    v-model="props.row.due.time"
                                    full-width
                                    @click:minute="
                                      $refs.timeMenu.save(props.row.due.time)
                                    "
                                />
                              </v-menu>

                              <v-checkbox
                                  v-model="props.row.due.cascade"
                                  :label="$t('cascade')"
                                  color="#FF7754"
                              >
                                <template #label>
                                  <div class="checkbox-label">Cascade</div>
                                </template>
                              </v-checkbox>
                            </v-form>
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer/>
                            <v-btn text @click="props.row.dueMenu = false">
                              {{ $t('cancel') }}
                            </v-btn>
                            <v-btn
                                color="primary"
                                text
                                @click="setJobDueDate(props.row)"
                            >
                              {{ $t('confirm') }}
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-menu>
                    </template>
                  </el-table-column>
                </el-table>
                <div
                    class="text-center mb-2 my-2"
                    v-show="jobDefinitions.pageCount > 1"
                >
                  <v-pagination
                      v-model="jobDefinitions.page"
                      :length="jobDefinitions.pageCount"
                      total-visible="20"
                      color="#FF7754"
                  />
                </div>
                <!-- <div class="text-center pb-5" v-show="jobs.pageCount > 1">
                  <v-pagination v-model="jobs.page" :length="jobs.pageCount" />
                </div> -->
              </v-tab-item>
              <v-tab-item key="job2" transition="false">
                <el-table :data="jobTasks.items"
                          border
                          :max-height="tableMaxHeight"
                          v-loading="jobTasks.loading"
                >
                  <el-table-column
                      prop="name"
                      :label="$t('activity')"
                      width="180"
                      :sortable="!typeSwitch"
                  >
                    <template slot-scope="props">
                      <router-link
                          :to="{}"
                          @click.native="selectOtherActivity(props.row.taskDefinitionKey)"
                      >
                        {{ props.row.name == null ? props.row.taskDefinitionKey : props.row.name }}
                      </router-link>
                    </template>
                  </el-table-column>
                  <el-table-column
                      prop="assignee"
                      label="Assignee"
                      width="180"
                      :sortable="typeSwitch"
                  >
                    <template slot-scope="props">
                      {{ props.row.assignee }}
                      <template v-if="!typeSwitch">
                        <v-menu
                            v-model="props.row.assigneeMenu"
                            :close-on-content-click="false"
                            :nudge-width="200"
                            offset-x
                        >
                          <template #activator="{ on, attrs }">
                              <span
                                  class="badge badge-edit badge-menu"
                                  v-bind="attrs"
                                  @click="setCurrentAssignee(props.row)"
                                  v-on="on"
                              ><v-icon size="10" color="white">mdi-pencil</v-icon></span>
                          </template>

                          <v-card>
                            <v-card-title class="small-headline">
                              设置Assignee
                            </v-card-title>

                            <v-card-text>
                              <v-form ref="formAddAssignee">
                                <v-text-field
                                    label="Assignee"
                                    :rules="addAssigneeMenu.formRules.userId"
                                    v-model="addAssigneeMenu.userId"
                                    style="font-size: 14px"
                                >
                                  <template #label>
                                    <div style="font-size: 14px">Assignee</div>
                                  </template>
                                </v-text-field>
                              </v-form>
                            </v-card-text>
                            <v-card-actions>
                              <v-spacer/>
                              <v-btn
                                  color="primary"
                                  text
                                  :loading="addAssigneeMenu.loading"
                                  @click="addAssignee(props.row)"
                              >
                                {{ $t('confirm') }}
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-menu>
                      </template>
                    </template>
                  </el-table-column>
                  <el-table-column
                      :prop="`${typeSwitch ? 'startTime' : 'created'}`"
                      :label="$t('createTime')"
                      width="180"
                      :sortable="typeSwitch"
                  >
                    <template slot-scope="props">
                      {{
                        formatDateTime(
                            typeSwitch ? props.row.startTime : props.row.created
                        )
                      }}
                    </template>
                  </el-table-column>
                  <el-table-column
                      prop="due"
                      :label="$t('dueTime')"
                      width="180"
                      :sortable="typeSwitch"
                  >
                    <template slot-scope="props">
                      {{ formatDateTime(props.row.due) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                      prop="followUp"
                      :label="$t('followTime')"
                      width="180"
                  >
                    <template slot-scope="props">
                      {{ formatDateTime(props.row.followUp) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                      prop="priority"
                      :label="$t('priority')"
                      width="180"
                      :sortable="typeSwitch"
                  />
                  <el-table-column
                      prop="delegationState"
                      :label="$t('delegateState')"
                      width="180"
                  />
                  <el-table-column prop="id" label="Task ID" min-width="340">
                    <template slot-scope="props">
                      <div class="tabCopy">
                        {{ props.row.id }}
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
                  <el-table-column :label="$t('operate')" width="200">
                    <template slot-scope="props">
                      <v-tooltip bottom>
                        <template #activator="tooltip">
                            <span
                                class="badge badge-start badge-menu"
                                v-on="tooltip.on"
                                @click="startUserTask(props.row)"
                            ><v-icon size="10" color="white">mdi-play</v-icon></span>
                        </template>
                        <span>{{ $t('execute') }}</span>
                      </v-tooltip>
                      <v-menu
                          v-model="props.row.userManageMenu"
                          :close-on-content-click="false"
                          :nudge-width="500"
                          offset-x
                      >
                        <template #activator="menu">
                          <v-tooltip bottom>
                            <template #activator="tooltip">
                                <span
                                    class="badge badge-edit badge-menu"
                                    v-bind="{ ...menu.value, ...tooltip.value }"
                                    v-on="{ ...menu.on, ...tooltip.on }"
                                    @click="getTaskGroups(props.row)"
                                ><v-icon size="10" color="white">mdi-account</v-icon></span>
                            </template>
                            <span>用户管理</span>
                          </v-tooltip>
                        </template>

                        <v-card>
                          <v-card-title class="small-headline">
                            {{ $t('manageUserGroup') }}
                          </v-card-title>

                          <v-card-text>
                            <div
                                style="
                                  display: flex;
                                  flex-direction: row;
                                  place-items: center;
                                "
                            >
                              <v-form ref="formEditTaskGroups">
                                <v-text-field
                                    v-model="editTaskGroups.userId"
                                    :rules="editTaskGroups.formRules.userId"
                                />
                              </v-form>
                              <v-btn
                                  style="margin-left: 10px; color: #fff"
                                  color="#FF7754"
                                  @click="addTaskUser(props.row, 'user')"
                                  :loading="editTaskGroups.loadingAdd"
                              >
                                {{ $t('add') }}
                              </v-btn>
                            </div>
                            <el-table
                                :data="editTaskGroups.itemsUser"
                                style="width: auto"
                                height="200"
                                stripe
                            >
                              <el-table-column
                                  prop="userId"
                                  label="User Id"
                              />
                              <el-table-column :label="$t('operate')" width="100">
                                <template slot-scope="propsGroup">
                                  <v-icon
                                      color="red"
                                      @click="
                                        delTaskUser(props.row, propsGroup.row)
                                      "
                                  >
                                    mdi-close-circle
                                  </v-icon>
                                </template>
                              </el-table-column>
                            </el-table>
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer/>
                            <v-btn
                                text
                                @click="props.row.userManageMenu = false"
                            >
                              {{ $t('close') }}
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-menu>
                      <v-menu
                          v-model="props.row.groupManageMenu"
                          :close-on-content-click="false"
                          :nudge-width="500"
                          offset-x
                      >
                        <template #activator="menu">
                          <v-tooltip bottom>
                            <template #activator="tooltip">
                                <span
                                    class="badge badge-trash badge-menu"
                                    v-bind="{ ...menu.value, ...tooltip.value }"
                                    v-on="{ ...menu.on, ...tooltip.on }"
                                    @click="getTaskGroups(props.row)"
                                ><v-icon size="10" color="white">mdi-account</v-icon></span>
                            </template>
                            <span>组管理</span>
                          </v-tooltip>
                        </template>
                        <v-card>
                          <v-card-title class="small-headline">
                            {{ $t('manageAuthGroup') }}
                          </v-card-title>

                          <v-card-text>
                            <div
                                style="
                                  display: flex;
                                  flex-direction: row;
                                  place-items: center;
                                "
                            >
                              <v-form ref="formEditTaskGroups">
                                <v-text-field
                                    v-model="editTaskGroups.userId"
                                    :rules="editTaskGroups.formRules.userId"
                                />
                              </v-form>
                              <v-btn
                                  style="margin-left: 10px; color: #fff"
                                  color="#FF7754"
                                  @click="addTaskUser(props.row, 'group')"
                                  :loading="editTaskGroups.loadingAdd"
                              >
                                {{ $t('add') }}
                              </v-btn>
                            </div>
                            <el-table
                                :data="editTaskGroups.itemsGroup"
                                style="width: auto"
                                height="200"
                                stripe
                            >
                              <el-table-column
                                  prop="groupId"
                                  label="Group Id"
                              />
                              <el-table-column :label="$t('operate')" width="100">
                                <template slot-scope="propsGroup">
                                  <v-icon
                                      color="red"
                                      @click="
                                        delTaskUser(props.row, propsGroup.row)
                                      "
                                  >
                                    mdi-close-circle
                                  </v-icon>
                                </template>
                              </el-table-column>
                            </el-table>
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer/>
                            <v-btn
                                text
                                @click="props.row.groupManageMenu = false"
                            >
                              {{ $t('close') }}
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-menu>
                    </template>
                  </el-table-column>
                </el-table>
              </v-tab-item>
              <v-tab-item key="edit" transition="false">
                <el-table :data="instructions"
                          :max-height="tableMaxHeight"
                          style="width: auto"
                >
                  <el-table-column :label="$t('type')" width="300">
                    <template slot-scope="props">
                      <v-select
                          style="padding-top: 0; font-size: 14px"
                          @change="selectInstructionType(props.row)"
                          :items="action.getActions(props.row, nodeProperties)"
                          :item-value="(item) => `${item.id}`"
                          :item-text="(item) => `${item.title}`"
                          v-model="props.row.type"
                          dense
                      />
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" :label="$t('activity')"/>

                  <el-table-column prop="activityId" :label="$t('activityId')">
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
                  {{ $t('setEditParams') }}
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
              <v-tab-item key="externalTask" transition="false">
                <el-table :data="externalTasks.items" style="width: auto"
                          border
                          :max-height="tableMaxHeight"
                          v-loading="externalTasks.loading"
                >
                  <el-table-column :label="$t('externalTaskId')" prop="id" min-width="350">
                    <template slot-scope="props">
                      <div class="tabCopy">
                        {{ props.row.id }}
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

                  <el-table-column label="Look Expiration Time" width="180">
                    <template slot-scope="props">
                      {{ formatDateTime(props.row.lockExpirationTime) }}
                    </template>
                  </el-table-column>

                  <el-table-column :label="$t('activity')" prop="activityId"/>

                  <el-table-column :label="$t('topic')" prop="topicName"/>

                  <el-table-column label="Worker ID" prop="workerId"/>

                  <el-table-column
                      :label="$t('retry')"
                      prop="retries"
                      width="100"
                      align="center"
                  />

                  <el-table-column :label="$t('priority')" prop="priority" width="100"/>
                </el-table>
              </v-tab-item>
              <v-tab-item key="document" transition="false">
                <element-document :current-element="currentElement"/>
              </v-tab-item>
            </v-tabs-items>
          </re-size-layout>
        </div>
      </v-layout>
    </v-card>
    <div v-if="startUserTaskDialog.display"
         style="flex:1;height: 0;display: flex;flex-direction: column;border-top: 1px solid rgba(187, 187, 187, 1);background-color: white"
    >
      <div style="padding: 15px" v-if="startUserTaskDialog.startType==='addMessage'">
        <v-text-field hide-details :placeholder="$t('msgName')" v-model="startUserTaskDialog.messageName"/>
      </div>
      <div style="flex: 1;height: 0">
        <div v-if="startUserTaskDialog.dataFrom==='variable'" style="height: 100%">
          <v-btn class="white--text" color="#444262" small @click="addVariableByDialog()" style="margin: 20px">
            {{ $t('addVar') }}
          </v-btn>
          <el-table :data="startUserTaskDialog.variables" stripe max-height="500"
                    style="margin-left: 10px;margin-right: 10px"
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
                <v-btn icon x-small color="#444262" @click="editVariableByDialog(props.row)">
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
              style="overflow-y: scroll;padding-top: 10px;padding-left: 10px;padding-right: 10px;height: 100%"
              v-else-if="startUserTaskDialog.dataFrom==='formio'&&startUserTaskDialog.formData"
        />
      </div>
      <div class="d-flex flex-row"
           style="border-top:1px solid rgba(187, 187, 187, 1);border-bottom:1px solid rgba(187, 187, 187, 1);width: 100%"
      >
        <v-spacer/>
        <v-btn text large @click="setDataFromVariable" v-show="startUserTaskDialog.dataFrom==='formio'">
          <v-icon left>mdi-folder-open</v-icon>
          {{ $t('addVar') }}
        </v-btn>
        <v-btn text large @click="setDataFromFormio"
               v-show="startUserTaskDialog.dataFrom==='variable' && startUserTaskDialog.formData && startUserTaskDialog.startType!=='addMessage'"
        >
          <v-icon left>mdi-folder-open</v-icon>
          {{ $t('loadForm') }}
        </v-btn>
        <v-btn large text
               style="border-left: 1px solid rgba(187, 187, 187, 1);;border-right: 1px solid rgba(187, 187, 187, 1);border-radius: unset"
               @click="getTaskToSelf"
               v-show="startUserTaskDialog.startType!=='addMessage'"
               :loading="startUserTaskDialog.claimTaskLoading"
               :disabled="startUserTaskDialog.isOwnerTask"
        >
          <v-icon left>mdi-playlist-check</v-icon>
          {{ $t('get') }}
        </v-btn>
        <v-btn large text
               style="border-left: 1px solid rgba(187, 187, 187, 1);;border-right: 1px solid rgba(187, 187, 187, 1);border-radius: unset"
               @click="startUserTaskDialog.display=false"
        >
          <v-icon left>mdi-close</v-icon>
          {{ $t('cancel') }}
        </v-btn>
        <v-btn large text
               @click="commitStart"
               :loading="startUserTaskDialog.commitLoading">
          <v-icon left color="#FF7754">mdi-play-circle</v-icon>
          {{ $t(startUserTaskDialog.startType !== "addMessage" ? "start" : "submit") }}
        </v-btn>
      </div>
    </div>
    <v-dialog v-model="retryJobDialog.display" max-width="350">
      <v-card>
        <v-card-title class="headline" style="color: #444262">
          {{ retryJobDialog.title }}
        </v-card-title>
        <v-card-text>
          {{ retryJobDialog.description }}
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer/>
          <v-btn color="warning" text @click="retryJobDialog.display = false">
            {{ $t('cancel') }}
          </v-btn>
          <v-btn color="primary" text @click="retryJob()">{{ $t('confirm') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
        v-model="deleteVariablesDialog.display"
        max-width="350"
    >
      <v-card>
        <v-card-title class="headline">
          {{ deleteVariablesDialog.title }}
        </v-card-title>
        <v-card-text>
          {{ deleteVariablesDialog.description }}
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer/>
          <v-btn
              color="warning"
              text
              @click="deleteVariablesDialog.display = false"
          >
            {{ $t('cancel') }}
          </v-btn>
          <v-btn color="primary" text @click="deleteVariables()"> {{ $t('confirm') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteDialog.display" max-width="600">
      <v-card>
        <v-card-title class="headline" style="color: #444262">
          {{ deleteDialog.title }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
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
            <div class="checkbox-tip">{{ $t('skipCustomListenersTipsNew') }}</div>
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
            <div class="checkbox-tip">
              {{ $t('skipCustomListenersTipsNew') }}
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer/>
          <v-btn text @click="deleteDialog.display = false"> {{ $t('cancel') }}</v-btn>
          <v-btn
              style="color: #ffffff"
              color="#FF7754"
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
    <v-dialog v-model="suspendDialog.display" max-width="600">
      <v-card>
        <v-card-title class="headline" style="color: #444262">
          {{ $t('processInstanceWithOpt', {opt: $t(instance.state == "SUSPENDED" ? "active" : "suspend")}) }}
        </v-card-title>
        <v-card-text>
          <template v-if="instance.state == 'SUSPENDED'">
            <span>
              {{ $t('activeInstanceTip1') }}<br>
              {{ $t('activeInstanceTip2') }}<br>
              {{ $t('activeInstanceTip3') }}<br>
              {{ $t('activeInstanceTip4') }}<br>
            </span>
          </template>
          <template v-else>
            <span>
              {{ $t('suspendInstanceTip1') }}
              <br>{{ $t('suspendInstanceTip2') }}
              <br>{{ $t('suspendInstanceTip3') }}
              <br>{{ $t('suspendInstanceTip4') }}
              <br>{{ $t('suspendInstanceTip5') }}<br>
            </span>
          </template>
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer/>
          <v-btn text @click="suspendDialog.display = false"> {{ $t('cancel') }}</v-btn>
          <v-btn style="color: #ffffff" color="#FF7754" @click="suspend()">
            {{ $t('confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="msgStackTraceDialog.display" max-width="600">
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
            <pre style="max-height: 50vh;overflow-y: auto;">
              <code class="lang-java">{{ msgStackTraceDialog.msg }}</code>
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
    <add-variable @onSaveVariable="addVariable"
                  :edit-variable="addVariableDialog.editValue"
                  @onCancelSaveVariable="addVariableDialog.display=false"
                  :display="addVariableDialog.display"
    />
    <edit-variable @onSaveVariable="editVariableCommit"
                   :history="false"
                   :edit-variable="editVariableDialog.editValue"
                   @onCancelSaveVariable="editVariableDialog.display=false"
                   :display="editVariableDialog.display"
    />
    <v-snackbar
        v-model="startUserTaskDialog.showError"
        :multi-line="true"
    >
      {{ startUserTaskDialog.error }}

      <template #action="{ attrs }">
        <v-btn
            color="red"
            text
            v-bind="attrs"
            @click="startUserTaskDialog.showError = false"
        >
          {{ $t('close') }}
        </v-btn>
      </template>
    </v-snackbar>
    <instance-modify
        :instructions="instructions"
        :definition-id="instance.processDefinitionId"
        :instance-id="instance.id"
        :action="'modify'"
        ref="instanceModify"
    />
    <activity-history
        :activity-id="activityId"
        :instance-id="instance.id"
        ref="activityHistory"
    />
  </div>
</template>
<script>
import messageRequest from "@/api/message";
import processRequest from "@/api/process";
import instanceRequest from "@/api/instance";
import jobRequest from "@/api/job";
import taskRequest from "@/api/task";
import utils from "@/utils/utils";
import action from "@/utils/action";
import VueBpmn from "@/components/common/BPMN";
import InstanceModify from "@/components/common/instance/InstanceModify";
import ActivityHistory from "@/components/common/ActivityHistory";
import ElementDocument from "@/components/common/ElementDocument";
import AddVariable from "@/components/common/AddVariable";
import EditVariable from "@/components/common/EditVariable";
import ReSizeLayout from "@/components/common/ReSizeLayout";
import ReSizeDrawer from "@/components/common/ReSizeDrawer";
import formRequest from "@/api/form";
import {formatVariables} from "@/utils/common";
import i18n from "@/utils/i18n";
import {Form} from "vue-formio-eorion";
import hljs from "highlight.js/lib/core";
import java from "highlight.js/lib/languages/java";

export default {
  components: {
    Form,
    VueBpmn,
    InstanceModify,
    ActivityHistory,
    ElementDocument,
    AddVariable,
    ReSizeLayout,
    EditVariable,
    ReSizeDrawer
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
      startUserTaskDialog: {
        display: false,
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
        isOwnerTask: false,
        claimTaskLoading: false,
        taskId: null,
        taskForm: null,
        startType: null,
        messageName: null
      },
      currentElement: null,
      action,
      utils,
      left: true,
      bottom: 1,
      showPayload: false,
      xml: "",
      activityId: "",
      nodeProperties: {},

      nodeActions: [],
      instructions: [],

      tab: 1,
      tabKey: 0,
      msgStackTraceDialog: {
        display: false,
        title: "StackTrace",
        msg: null,
      },
      breadcrumbs: [
        {
          text: this.$t("processDef"),
          href: "#/automation/process/list",
        },
        {
          text: "",
          href: "",
        },
      ],

      breadcrumbSummary: {
        version: null,
        instance: null,
        incident: null,
      },
      idBreadcrumbs: [
        {
          text: "",
          href: "",
          disabled: true,
        },
        {
          text: "",
          href: "",
          disabled: true,
        },
      ],
      deleteDialog: {
        display: false,
        cascade: false,
        skipCustomListeners: false,
        skipIoMappings: false,
        title: this.$t("deleteProcessInstance"),
        description: this.$t("deleteProcessInstanceConfirm"),
        success: this.$t("deleteProcessInstanceSuccess"),
        error: this.$t("deleteProcessInstanceFailed"),
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

      deleteVariablesDialog: {
        display: false,
        title: this.$t("deleteHistoryVars"),
        description: this.$t("deleteHistoryVarsConfirm"),
        success: this.$t("deleteHistoryVarsSuccess"),
        error: this.$t("deleteHistoryVarsFailed"),
      },
      addVariableDialog: {
        display: false,
        editValue: null
      },
      editVariableDialog: {
        display: false,
        editValue: null
      },
      retryJobDialog: {
        display: false,
        job: {},
        title: this.$t("addRetryCount"),
        description: this.$t("addRetryCountConfirm"),
        success: this.$t("addRetryCountSuccess"),
        error: this.$t("addRetryCountFailed"),
      },
      addAssigneeMenu: {
        userId: null,
        formRules: {
          userId: [
            (v) => {
              if (!v) {
                return this.$t("itemRequired");
              } else if (/^[A-Za-z0-9]+$/.test(v)) {
                return true;
              } else {
                return this.$t("errFormatOnlyChars");
              }
            },
          ],
        },
        loading: false,
      },
      editTaskGroups: {
        userId: null,
        formRules: {
          userId: [
            (v) => {
              if (!v) {
                return this.$t("itemRequired");
              } else if (/^[A-Za-z0-9]+$/.test(v)) {
                return true;
              } else {
                return this.$t("errFormatOnlyChars");
              }
            },
          ],
        },
        itemsUser: [],
        itemsGroup: [],
        loadingAdd: false,
        loadingDel: false,
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

      instance: {
        id: "",
        businessKey: null,
        processDefinitionId: "",
        processDefinitionKey: "",
        processDefinitionName: "",
        processDefinitionVersion: 0,
        startTime: "",
        endTime: null,
        removalTime: null,
        durationInMillis: null,
        startUserId: "",
        startActivityId: "",
        deleteReason: null,
        rootProcessInstanceId: "",
        superProcessInstanceId: null,
        superCaseInstanceId: null,
        caseInstanceId: null,
        tenantId: null,
        state: "",
      },
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
      activityInstance: {},
      version: 0,

      jobDefinitions: {
        page: 0,
        pageCount: 0,
        itemsPerPage: 50,
        totalCount: 0,
        sortBy: "jobId",
        sortOrder: "desc",
        loading: true,
        items: [],
      },
      externalTasks: {
        page: 0,
        pageCount: 0,
        itemsPerPage: 1000,
        totalCount: 0,
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
      incidents: {
        page: 0,
        pageCount: 0,
        itemsPerPage: 50,
        totalCount: 0,
        sortBy: "incidentTimestamp",
        sortOrder: "desc",
        loading: true,
        items: [],
      },
      callInstances: {
        page: 0,
        pageCount: 0,
        itemsPerPage: 10,
        totalCount: 0,
        loading: true,
        items: [],
      },
      jobTasks: {
        page: 0,
        pageCount: 0,
        itemsPerPage: 10,
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
      tableHeaders: [
        {text: this.$t("name"), value: "id", width: "400"},
        {text: this.$t("type"), value: "type", width: "100"},
        {text: this.$t("value"), value: "value"},
        {text: this.$t("operate"), value: "actions"},
      ],
      variables: {
        items: [],
        filter: {
          variableName: "",
          variableValue: "",
        },
        page: 0,
        pageCount: 0,
        itemsPerPage: 50,
        totalCount: 0,
        sortBy: "variableName",
        sortOrder: "asc",
        loading: true
      },
      dataTypes: [
        "Boolean",
        "Date",
        "Double",
        "Integer",
        "Long",
        "Short",
        "String", ,
      ].map((item) => {
        return {name: item, id: item};
      }),
      imgUrl: require("@/assets/flow.png"),
      tableMaxHeight: "10",
      leftStylePadding: {},
      leftStyleMargin: {},
    };
  },
  watch: {
    "$i18n.locale": {
      handler(val) {
        let self = this;
        self.breadcrumbs[0].text = self.$t("processDef");
        self.deleteDialog.title = self.$t("deleteProcessInstance");
        self.deleteDialog.description = self.$t("deleteProcessInstanceConfirm");
        self.deleteDialog.success = self.$t("deleteProcessInstanceSuccess");
        self.deleteDialog.error = self.$t("deleteProcessInstanceFailed");
        self.deleteVariablesDialog.title = self.$t("deleteHistoryVars");
        self.deleteVariablesDialog.description = self.$t("deleteHistoryVarsConfirm");
        self.deleteVariablesDialog.success = self.$t("deleteHistoryVarsSuccess");
        self.deleteVariablesDialog.error = self.$t("deleteHistoryVarsFailed");
        self.retryJobDialog.title = self.$t("addRetryCount");
        self.retryJobDialog.description = self.$t("addRetryCountConfirm");
        self.retryJobDialog.success = self.$t("addRetryCountSuccess");
        self.retryJobDialog.error = self.$t("addRetryCountFailed");
        self.addAssigneeMenu.formRules = {
          userId: [
            (v) => {
              if (!v) {
                return this.$t("itemRequired");
              } else if (/^[A-Za-z0-9]+$/.test(v)) {
                return true;
              } else {
                return this.$t("errFormatOnlyChars");
              }
            },
          ],
        };
        self.editTaskGroups.formRules = {
          userId: [
            (v) => {
              if (!v) {
                return this.$t("itemRequired");
              } else if (/^[A-Za-z0-9]+$/.test(v)) {
                return true;
              } else {
                return this.$t("errFormatOnlyChars");
              }
            },
          ],
        };
        self.tableHeaders = [
          {text: this.$t("name"), value: "id", width: "400"},
          {text: this.$t("type"), value: "type", width: "100"},
          {text: this.$t("value"), value: "value"},
          {text: this.$t("operate"), value: "actions"},
        ];
        self.archiveData.items = [
          {name: this.$t("dataBackupPer"), key: "copyStatus", value: null, details: [], expand: false},
          {name: this.$t("dataDelPer"), key: "deleteStatus", value: null, details: [], expand: false},
          {
            name: this.$t("archiveBeforeDataCount"),
            key: "beforeArchive",
            value: null,
            details: [],
            expand: true,
            expandObj: true
          },
          {
            name: this.$t("archiveDoingDataCount"),
            key: "current",
            value: null,
            details: [],
            expand: true,
            expandObj: true
          },
          {
            name: this.$t("archiveWaitData"),
            key: "archiveData",
            value: null,
            details: [],
            expand: true,
            expandObj: false
          },
          {
            name: this.$t("archiveDBBefore"),
            key: "archiveDBBefore",
            value: null,
            details: [],
            expand: true,
            expandObj: true
          },
          {
            name: this.$t("archiveDBAfter"),
            key: "archiveDBAfter",
            value: null,
            details: [],
            expand: true,
            expandObj: true
          },
        ];
      },
    },
    "jobDefinitions.page": {
      handler() {
        this.getJobDefinitionPage();
      },
    },
    "jobDefinitions.pageCount": {
      handler() {
        this.setTableHeight();
      },
    },
    "callInstances.page": {
      handler() {
        this.getCallInstancePage();
      },
    },
    "callInstances.pageCount": {
      handler() {
        this.setTableHeight();
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
    "variables.page": {
      handler() {
        this.getVariablesPage();
      }
    },
    "variables.pageCount": {
      handler() {
        this.setTableHeight();
      }
    },
    $route: {
      handler() {
        this.changeSwitch();
      },
    },
    tab: {
      handler() {
        this.getTab();
      },
    },
  },
  computed: {
    tabKeyComputed() {
      return `tab_${this.tabKey}`;
    },
    tabItemKey() {
      return `tab_item_${this.tabKey}`;
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
  mounted() {
    hljs.registerLanguage("java", java);
    if (this.$route.query.defaultIncident) {
      this.changeSwitch("incident");
    } else {
      this.changeSwitch();
    }
  },
  methods: {
    async startUserTask(task) {
      let self = this;
      self.startUserTaskDialog.formData = null;
      self.startUserTaskDialog.formLoading = true;
      try {
        if (process.env.VUE_APP_SEARCH_FORM_BY_API && task.formKey) {
          let responseFormData = await formRequest.getFormDetailByKey(task.formKey);
          self.startUserTaskDialog.formData = responseFormData.formData;
          self.formBuilder.form = {components: responseFormData.formData || []};
        }
      } catch (e) {
      }
      self.startUserTaskDialog.isOwnerTask = task.assign === self.$store.state.user.profile.id;
      self.startUserTaskDialog.formLoading = false;
      self.startUserTaskDialog.display = true;
      self.startUserTaskDialog.startType = null;
      self.startUserTaskDialog.taskId = task.id;
      self.startUserTaskDialog.taskForm = task.formKey;
      self.startUserTaskDialog.businessKey = "";
      self.startUserTaskDialog.variables = [];
      self.startUserTaskDialog.formValue = {};
      self.formBuilder.formValue = {data: {}};
    },
    async commitStart() {
      let self = this;
      let variables = {};
      // 任务归属人校验
      if (self.startUserTaskDialog.startType !== "addMessage" && !self.startUserTaskDialog.isOwnerTask) {
        self.$notify.error(self.$t("plsGetTask"));
        return;
      }
      // messageName校验
      if (self.startUserTaskDialog.startType === "addMessage" && !(self.startUserTaskDialog.messageName && self.startUserTaskDialog.messageName.length > 0)) {
        self.$notify.error(self.$t("plsInputMsgName"));
        return;
      }
      // 变量
      if (self.startUserTaskDialog.dataFrom === "variable") {
        self.startUserTaskDialog.variables.forEach(variable => {
          variables[`${variable.name}`] = variable;
        });
      }
      // 表单
      if (self.startUserTaskDialog.dataFrom === "formio") {
        try {
          let formResponse = await self.$refs.formioNew.formio.submit();
          let formData = formResponse.data;
          formData[`formKey-${self.startUserTaskDialog.taskId}`] = self.startUserTaskDialog.taskForm;
          delete formData.idCardImg;
          variables = formatVariables(formData);
        } catch (err) {
          self.$notify.error(err);
          variables = null;
        }
      }
      if (variables) {
        self.startUserTaskDialog.commitLoading = true;
        let request;
        if (self.startUserTaskDialog.startType === "addMessage") {
          request = messageRequest.correlateMessage({
            processInstanceId: self.instance.id,
            messageName: self.startUserTaskDialog.messageName,
            processVariables: variables
          });
        } else {
          request = taskRequest.completeTask(self.startUserTaskDialog.taskId, {
            variables: variables,
          });
        }
        request
            .then(response => {
              if (self.startUserTaskDialog.startType === "addMessage") {
                // 成功提示
                self.$notify.success(self.$t("sendMsgSuccess"));
              }
              self.startUserTaskDialog.display = false;
              self.startUserTaskDialog.commitLoading = false;
              self.getData();
            }).catch(err => {
          self.startUserTaskDialog.error = `${err.response.status}:${err.response.data.message}`;
          self.startUserTaskDialog.commitLoading = false;
          self.startUserTaskDialog.showError = true;
        });
      } else {
        self.startUserTaskDialog.error = self.$t("plsInputVars");
        self.startUserTaskDialog.showError = true;
      }
    },
    setDataFromVariable() {
      this.startUserTaskDialog.dataFrom = "variable";
    },
    async getTaskToSelf() {
      let self = this;
      self.startUserTaskDialog.claimTaskLoading = true;
      taskRequest.claimTask(self.startUserTaskDialog.taskId, self.$store.state.user.profile.id)
          .then(() => {
            self.startUserTaskDialog.isOwnerTask = true;
            self.$notify.success(self.$t("getTaskSuccess"));
          })
          .catch(err => {
            self.$notify.error(self.$t("getTaskFailedWithMsg", {msg: err.response.data.message ?? err}));
          })
          .finally(() => {
            self.startUserTaskDialog.claimTaskLoading = false;
          });
    },
    async setDataFromFormio() {
      // 获取form
      let self = this;
      self.startUserTaskDialog.dataFrom = "formio";
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
        // 变量
        if (this.variables.pageCount > 1) {
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
      if (self.tab === (2 + preTabCount)) {
        // 调用的流程,没有分页
        if (this.callInstances.pageCount > 1) {
          // 59.59为底部分页栏的高度
          height = height - paginationHeight;
        }
      }
      if (self.tab === (3 + preTabCount)) {
        // job工作定义
        if (this.jobDefinitions.pageCount > 1) {
          // 59.59为底部分页栏的高度
          height = height - paginationHeight;
        }
      }
      if (self.tab === (4 + preTabCount)) {
        // 人工任务，没有分页
      }
      if (self.tab === (5 + preTabCount)) {
        // 编辑
      }
      if (self.tab === (6 + preTabCount)) {
        // 外部任务,没有分页
      }
      if (self.tab === (7 + preTabCount)) {
        // 文档
      }
      if (self.tab === (8 + preTabCount)) {
        // 外部任务日志
      }
      if (self.tab === (9 + preTabCount)) {
        // 文档
      }

      this.$nextTick(() => {
        this.tableMaxHeight = height;
      });
    },
    jobLogSortChange(value) {
      this.jobLogs.sortBy = value.prop;
      this.jobLogs.sortOrder = value.order == "descending" ? "desc" : "asc";
      this.getJobLogPage();
    },
    incidentsSortChange(value) {
      this.incidents.sortBy = value.prop;
      this.incidents.sortOrder = value.order == "descending" ? "desc" : "asc";
      this.getIncidentPage();
    },
    jobDefinitionsSortChange(value) {
      this.jobDefinitions.sortBy = value.prop == "id" ? "jobId" : value.prop;
      this.jobDefinitions.sortOrder = value.order == "descending" ? "desc" : "asc";
      this.getJobDefinitionPage();
    },
    variablesSortChange(value) {
      if (value.prop == "name") {
        this.variables.sortBy = "variableName";
      } else {
        this.variables.sortBy = value.prop;
      }
      this.variables.sortOrder = value.order == "descending" ? "desc" : "asc";
      this.getVariablesPage();
    },
    async incidentSkip(value) {
      let incident = await processRequest.getIncident(value);
      if (incident && incident.processInstanceId != null) {
        this.$router.push({
          name: "instance-detail",
          params: {id: incident.processInstanceId, typeSwitch: this.typeSwitch}
        });
      } else {
        this.$notify.error(this.$t("failNoInstance"));
      }
    },
    setCurrentAssignee(item) {
      this.addAssigneeMenu.userId = item.assignee;
      if (this.$refs.formAddAssignee) {
        this.$refs.formAddAssignee.resetValidation();
      }
    },
    async getTaskGroups(item) {
      this.editTaskGroups.userId = null;
      this.editTaskGroups.itemsUser = [];
      this.editTaskGroups.itemsGroup = [];
      let groups = await taskRequest.getIdentityLinks(item.id);
      groups.forEach((group) => {
        if (group.type === "candidate") {
          if (group.userId) {
            this.editTaskGroups.itemsUser.push(group);
          }
          if (group.groupId) {
            this.editTaskGroups.itemsGroup.push(group);
          }
        }
      });
      if (this.$refs.formEditTaskGroups) {
        this.$refs.formEditTaskGroups.resetValidation();
      }
    },
    async addTaskUser(item, type) {
      if (!this.$refs.formEditTaskGroups.validate()) {
        return;
      }
      this.editTaskGroups.loadingAdd = true;
      let data = {type: "candidate"};
      if (type === "user") {
        data.userId = this.editTaskGroups.userId;
      }
      if (type === "group") {
        data.groupId = this.editTaskGroups.userId;
      }
      taskRequest
          .addIdentityLink(item.id, data)
          .then(() => {
            this.getTaskGroups(item);
            this.editTaskGroups.loadingAdd = false;
          })
          .catch((e) => {
            this.$notify.error(this.$t("addLinkFailed"));
            this.editTaskGroups.loadingAdd = false;
          });
    },
    async delTaskUser(item, user) {
      this.editTaskGroups.loadingDel = true;
      let data = {type: "candidate"};
      if (user.userId) {
        data.userId = user.userId;
      }
      if (user.groupId) {
        data.groupId = user.groupId;
      }
      taskRequest
          .delIdentityLink(item.id, data)
          .then(() => {
            this.getTaskGroups(item);
            this.editTaskGroups.loadingDel = false;
          })
          .catch((e) => {
            this.$notify.error(this.$t("delLinkFailed"));
            this.editTaskGroups.loading = false;
          });
    },
    async addAssignee(item) {
      if (!this.$refs.formAddAssignee.validate()) {
        return;
      }
      this.addAssigneeMenu.loading = true;
      taskRequest
          .addAssignee(item.id, {userId: this.addAssigneeMenu.userId})
          .then(() => {
            Object.assign(item, {
              assignee: this.addAssigneeMenu.userId,
              assigneeMenu: false,
            });
            this.$refs.formAddAssignee.reset();
            this.addAssigneeMenu.userId = null;
            this.addAssigneeMenu.loading = false;
          })
          .catch((e) => {
            this.$notify.error(this.$t("setAssigneeFailed"));
            this.addAssigneeMenu.loading = false;
          });
    },
    async addVariable(payload) {
      let self = this;
      if (this.startUserTaskDialog.display) {
        if (!self.startUserTaskDialog.variables) {
          self.startUserTaskDialog.variables = [];
        }
        // 添加至启动变量列表
        let index = self.startUserTaskDialog.variables.findIndex(variable => variable.name === payload.varName);
        if (index === -1) {
          // 添加
          self.startUserTaskDialog.variables = [payload.varData].concat(self.startUserTaskDialog.variables);
        } else {
          // 编辑
          self.$set(self.startUserTaskDialog.variables, index, payload.varData);
        }
        this.addVariableDialog.display = false;
      } else {
        if (this.addVariableDialog.editValue) {
          try {
            let modifications = {};
            delete payload.varData.name;
            modifications[`${payload.varName}`] = payload.varData;
            let response = await instanceRequest.updateLocalExecutionVariables(
                this.addVariableDialog.editValue.executionId, {
                  id: this.addVariableDialog.editValue.executionId,
                  modifications: modifications
                });
            this.addVariableDialog.display = false;
            this.$notify.success(this.$t("saveVarSuccess"));
            await this.getVariablesPage();
          } catch (error) {
            this.$notify.error(this.$t("saveVarFailedWithMsg", {msg: error.response.data.message}));
          }
        } else {
          instanceRequest
              .addVariable(this.$route.params.id, payload.varName, payload.varData)
              .then(() => {
                this.addVariableDialog.display = false;
                this.$notify.success(this.$t("addVarSuccess"));
                this.getVariables();
              })
              .catch((e) => {
                this.$notify.error(this.$t("addVarFailedWithMsg", {msg: e.response.data.message}));
              });
        }
      }
    },
    async editVariableCommit(payload) {
      // 编辑
      try {
        if (payload.varSerialized) {
          let modifications = {};
          delete payload.varData.name;
          modifications[`${payload.varName}`] = payload.varData;
          let response = await instanceRequest.updateLocalExecutionVariables(
              this.editVariableDialog.editValue.executionId,
              {id: this.editVariableDialog.editValue.executionId, modifications: modifications}
          );
        } else {
          let formData = new FormData();
          formData.append("data", new Blob([payload.varData.value], {type: "application/json"}), "blob");
          formData.append("type", payload.varData.valueInfo.objectTypeName);
          let response = await instanceRequest.setLocalExecutionVariables(
              this.instance.id,
              payload.varName,
              formData,
          );
        }
        this.editVariableDialog.display = false;
        this.$notify.success(this.$t("saveVarSuccess"));
        await this.getVariablesPage();
      } catch (error) {
        console.log(error);
        this.$notify.error(this.$t("saveVarFailedWithMsg", {msg: error.response.data.message}));
      }
    },
    async suspend() {
      let targetType = this.$t(this.instance.state ? "active" : "suspend");

      let data = {
        suspended: this.instance.state != "SUSPENDED",
      };

      await processRequest.suspendInstance(this.$route.params.id, data);
      this.suspendDialog.display = false;

      this.$notify.success(this.$t("processDefSuccessWithOpt", {opt: targetType}));
      await this.getData();
    },
    async deleteProcess() {
      try {
        var data = {
          skipCustomListeners: this.deleteDialog.skipCustomListeners,
          skipIoMappings: this.deleteDialog.skipIoMappings,
        };
        await processRequest.deleteProcessInstance(this.$route.params.id, data);
      } catch (error) {
        this.deleteDialog.display = false;
        this.$notify.error(this.deleteDialog.error);
        return;
      }

      this.deleteDialog.display = false;

      this.$notify.success(this.deleteDialog.success);
      this.$router.replace({
        name: "process-detail",
        params: {
          id: this.instance.processDefinitionId,
        },
        query: this.$route.query,
      });
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
    formatAuditLogStatus(item) {
      var status = [];
      if (item.canceled) {
        status.push("cancelled");
      }
      if (item.completedScope) {
        status.push("completed");
      }
      return status.join(" / ");
    },
    formatDateTime: utils.formatDateTime,
    switchLeft() {
      this.$refs.resizeDrawer.setLeft(!this.left);
    },
    async loadMsgDetail(type, incident) {
      let msgResult;
      try {
        if (type === "root") {
          incident = await processRequest.getIncidentNoParams(incident.rootCauseIncidentId);
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
          showClose: false
        });
      }
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
      this.$notify.success(this.$t("copySuccessWithTxt", {txt: value}));
    },
    async getTab() {
      this.nodeActions = [];
      let preTabCount = 0;
      switch (this.tab) {
        case 0 + preTabCount:
          // 变量，history/runtime
          await this.getVariables();
          break;
        case 1 + preTabCount:
          // 故障，runtime
          await this.getIncidents();
          break;
        case 2 + preTabCount:
          // callInstances，runtime/history
          await this.getCallInstances();
          break;
        case 3 + preTabCount:
          // job工作，runtime
          await this.getJobDefinitions();
          break;
        case 4 + preTabCount:
          // 人工任务，runtime/history
          await this.getJobTasks();
          break;
        case 5 + preTabCount:
          // 编辑，runtime
          this.nodeActions = action.defaultActions;
          break;
        case 6 + preTabCount:
          // 外部任务，runtime
          await this.getExternalTasks();
          break;
        case 7 + preTabCount:
          // 文档，runtime/history
          break;
        default:
          break;
      }
    },
    async changeSwitch(defaultTab) {
      await this.getData();
      switch (defaultTab) {
        case "incident":
          this.tab = 1;
          break;
        default:
          if (this.tab === 0) {
            await this.getTab();
          } else if (this.$route.params.tab) {
            this.tab = this.$route.params.tab;
            this.selectOtherActivity(this.$route.params.activityId);
          } else {
            this.tab = 0;
          }
          break;
      }
    },
    getData: async function () {
      let response = await instanceRequest.getInstance(this.$route.params.id);
      this.instance = response;
      this.breadcrumbs[1].text = response.processDefinitionName
          ? response.processDefinitionName
          : response.processDefinitionKey;
      this.idBreadcrumbs[1].text = response.id;
      var url = this.$router.resolve({
        name: "process-detail",
        params: {id: response.processDefinitionId},
        query: this.$route.query,
      });
      this.breadcrumbs[1].href = url.href;

      response = await processRequest.getProcess(response.processDefinitionId);

      this.process = response;

      this.tabKey++;

      try {
        response = await instanceRequest.getActivityInstances(
            this.$route.params.id
        );
        this.activityInstance = response;
      } catch (e) {
        console.log(e);
      }

      response = await processRequest.getProcessStatistics("", this.process.id);
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

      response = await processRequest.getProcessXml(this.process.id);
      this.xml = response.bpmn20Xml;
      await this.getTab();
    },
    async getVariables() {
      this.variables.loading = true;
      this.variables.totalCount = 0;
      this.variables.page = 0;
      let data = {
        processInstanceIdIn: [this.$route.params.id],
        variableNamesIgnoreCase: true
      };
      if (this.variables.filter.variableName) {
        data.variableNameLike = "%" + this.variables.filter.variableName + "%";
      }
      if (this.variables.filter.variableValue) {
        data.variableValue = this.variables.filter.variableValue;
      }
      let response = null;
      response = await instanceRequest.getVariablesCount(data);
      this.variables.totalCount = response.count;
      this.variables.pageCount =
          Math.floor(
              (response.count - 1) / this.variables.itemsPerPage
          ) + 1;
      this.variables.page = 1;
    },
    async getVariablesPage() {
      this.variables.loading = true;
      if (!this.variables.page) {
        this.variables.items = [];
        return;
      }
      let params = {
        firstResult:
            (this.variables.page - 1) *
            this.variables.itemsPerPage,
        maxResults: this.variables.itemsPerPage,
        deserializeValues: false,
      };
      let data = {
        processInstanceIdIn: [this.$route.params.id],
        variableNamesIgnoreCase: true,
        sorting: [
          {
            sortBy: this.variables.sortBy,
            sortOrder: this.variables.sortOrder
          }
        ]
      };
      if (this.variables.filter.variableName) {
        data.variableNameLike = "%" + this.variables.filter.variableName + "%";
      }
      if (this.variables.filter.variableValue) {
        data.variableValue = this.variables.filter.variableValue;
      }
      let response = null;
      response = await instanceRequest.getVariables(params, data);
      response.forEach((variable) => {
        if (
            this.activityInstance &&
            this.activityInstance.childActivityInstances
        ) {
          let activity = this.activityInstance.childActivityInstances.find(
              (item) => item.id === variable.activityInstanceId
          );
          if (activity) {
            variable.activityName = activity.name;
          }
        }
        if (this.activityInstance && variable.activityInstanceId === this.activityInstance.id) {
          variable.activityName = this.activityInstance.name;
        }
        variable.variableEdit = {
          value: variable.value,
          type: variable.type,
          valueInfo: variable.valueInfo,
        };
      });
      this.variables.items = response;
      this.variables.loading = false;
    },
    async getJobTasks() {
      this.jobTasks.loading = true;
      let data = {processInstanceIdIn: [this.$route.params.id]};
      let response = await instanceRequest.getJobTasks(data);
      this.jobTasks.items = response;
      this.jobTasks.loading = false;
    },

    async getExternalTaskLogs() {
      this.externalTaskLogs.loading = true;
      this.externalTaskLogs.items =
          await processRequest.getHistoryExternalTaskLogs({
            processInstanceId: this.$route.params.id,
            sortBy: "activityId",
            sortOrder: "asc",
          });
      this.externalTaskLogs.loading = false;
    },

    async getExternalTasks() {
      this.externalTasks.loading = true;
      this.externalTasks.items = await processRequest.getExternalTasks({
        processInstanceId: this.$route.params.id,
        sorting: [{sortBy: "taskPriority", sortOrder: "asc"}],
      });
      this.externalTasks.loading = false;
    },

    async getJobLogs() {
      this.jobLogs.loading = true;
      this.jobLogs.totalCount = 0;
      this.jobLogs.page = 0;
      var response = await processRequest.getJobLogCount({
        processInstanceId: this.$route.params.id,
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
      let params = {
        processInstanceId: this.$route.params.id,
        firstResult: (this.jobLogs.page - 1) * this.jobLogs.itemsPerPage,
        maxResults: this.jobLogs.itemsPerPage,
        sortBy: this.jobLogs.sortBy,
        sortOrder: this.jobLogs.sortOrder
      };
      let jobLogs = await processRequest.getJobLogList(params);
      this.jobLogs.items = jobLogs;
      this.jobLogs.loading = false;
    },

    async getIncidents() {
      this.incidents.loading = true;
      this.incidents.totalCount = 0;
      this.incidents.page = 0;
      var params = {
        processInstanceId: this.$route.params.id,
      };
      if (this.$route.query.defaultIncident && this.$route.query.defaultIncident !== "true") {
        params["incidentId"] = this.$route.query.defaultIncident;
      }
      var type = "";

      var response = await processRequest.getIncidentCount(type, params);
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

      var params = {
        processInstanceId: this.$route.params.id,
        firstResult: (this.incidents.page - 1) * this.incidents.itemsPerPage,
        maxResults: this.incidents.itemsPerPage,
        sortBy: this.incidents.sortBy,
        sortOrder: this.incidents.sortOrder
      };
      if (this.$route.query.defaultIncident && this.$route.query.defaultIncident !== "true") {
        params["incidentId"] = this.$route.query.defaultIncident;
      }
      var type = "";
      let incidents = await processRequest.getIncidentList(type, params);
      this.incidents.items = incidents;
      this.incidents.loading = false;
    },

    editAnnotation(item) {
      item.annotationEdit = item.annotation || "";
    },
    async saveAnnotation(item) {
      try {
        await processRequest.saveAnnotation(item.id, {
          annotation: item.annotationEdit,
        });
      } catch (error) {
        this.$notify.error(this.$t("saveRemarkErr"));
        return;
      }
      item.menu = false;

      this.$notify.success(this.$t("saveRemarkSuccess"));

      await this.getIncidents();
    },

    startSetJobDueDate(item) {
      var due = {
        cascade: false,
        dislayDate: false,
        dislayTime: false,
        date: "",
        time: "",
      };
      var date = item.dueDate;
      if (date) {
        due.date = utils.formatDateTime(date, "yyyy-MM-DD");
        due.time = utils.formatDateTime(date, "HH:mm");
      }
      item.due = due;
    },

    async setJobDueDate(item) {
      if (!item.due.date || !item.due.time) {
        this.$notify.error(this.$t("plsInputDateAndTime"));
        return;
      }
      try {
        var dueDate = item.due.date + " " + item.due.time;
        var formattedDate =
            utils.formatDateTime(dueDate, "yyyy-MM-DDTHH:mm:ss.SSS") +
            utils.formatDateTime(dueDate, "Z").replace(":", "");
        await processRequest.setJobDueDate(item.id, {
          duedate: formattedDate,
          cascade: item.due.cascade,
        });
      } catch (error) {
        this.$notify.error(this.$t("setDueDateFailed"));
        return;
      }
      item.dueMenu = false;

      this.$notify.success(this.$t("setDueDateSuccess"));

      await this.getJobDefinitionPage();
    },
    async getCallInstances() {
      this.callInstances.loading = true;
      this.callInstances.totalCount = 0;
      this.callInstances.page = 0;
      let response = await instanceRequest.queryInstancesNoParamsCount({
        superProcessInstance: this.$route.params.id,
      });;
      this.callInstances.totalCount = response.count;
      if (this.callInstances.pageCount === (Math.floor(
          (response.count - 1) / this.callInstances.itemsPerPage
      ) + 1)) {
        this.setTableHeight();
      }
      this.callInstances.pageCount =
          Math.floor(
              (response.count - 1) / this.callInstances.itemsPerPage
          ) + 1;
      this.callInstances.page = 1;
    },
    async getCallInstancePage() {
      this.callInstances.loading = true;
      if (!this.callInstances.page) {
        this.callInstances.items = [];
        return;
      }
      let params = {
        firstResult:
            (this.callInstances.page - 1) *
            this.callInstances.itemsPerPage,
        maxResults: this.callInstances.itemsPerPage,
      };
      let callInstances = await instanceRequest.queryInstancesWithParams(params, {
        superProcessInstance: this.$route.params.id,
      });

      let requests = callInstances.map((instance) =>
          processRequest.getProcess(instance.definitionId)
      );
      const results = await Promise.all(requests);
      callInstances.forEach((callInstance) => {
        let process = results.find(
            (result) => result.id === (callInstance.definitionId)
        );
        callInstance.process = process;
      });

      let callInstancesIncident = [];
      if (callInstances.length > 0) {
        // 获取是否存在故障
        callInstancesIncident = await instanceRequest.queryInstancesNoParams({
          withIncident: true,
          processInstanceIds: callInstances.map(
              (callInstance) => callInstance.id
          ),
        });
      }
      callInstances.forEach((instance) => {
        var item = callInstancesIncident.find(
            (instanceItem) => instanceItem.id === instance.id
        );
        if (item) {
          instance.withIncidents = true;
        }
      });
      let len = callInstances.length;
      for (let i = 0; i < len; i++) {
        let res = await instanceRequest.getInstance(callInstances[i].id);
        callInstances[i].state = res.state;
      }
      this.callInstances.items = callInstances;
      this.callInstances.loading = false;
    },

    async getJobDefinitions() {
      this.jobDefinitions.loading = true;
      this.jobDefinitions.totalCount = 0;
      this.jobDefinitions.page = 0;
      var data = {
        processInstanceId: this.$route.params.id,
      };
      let response = await processRequest.queryJobCount(data);
      this.jobDefinitions.totalCount = response.count;
      this.jobDefinitions.pageCount =
          Math.floor((response.count - 1) / this.jobDefinitions.itemsPerPage) + 1;
      this.jobDefinitions.page = 1;
    },
    async getJobDefinitionPage() {
      this.jobDefinitions.loading = true;
      var data = {
        processInstanceId: this.$route.params.id,
        sorting: [
          {
            sortBy: this.jobDefinitions.sortBy,
            sortOrder: this.jobDefinitions.sortOrder
          }
        ]
      };
      let jobDefinitions = await processRequest.queryJobs(
          this.jobDefinitions.page,
          this.jobDefinitions.itemsPerPage,
          data
      );
      jobDefinitions.forEach((job) => {
        job.due = {
          cascade: false,
          dislayDate: false,
          dislayTime: false,
          date: "",
          time: "",
        };
      });
      // console.log("jobDefinitions====>", jobDefinitions);
      this.jobDefinitions.items = jobDefinitions;
      this.jobDefinitions.loading = false;
    },

    async confirmSuspendJob(item) {
    },

    async suspendJob(item) {
      var operation = this.$t(item.suspended ? "active" : "suspend");
      try {
        var data = {
          suspended: !item.suspended,
        };
        await instanceRequest.suspendJob(item.id, data);
      } catch (error) {
        this.$notify.error(this.$t("jobFailedWithOpt", {opt: operation}));

        return;
      }
      item.suspendMenu = false;

      this.$notify.success(this.$t("jobSuccessWithOpt", {opt: operation}));

      await this.getJobDefinitionPage();
    },

    async deleteVariables() {
      try {
        await instanceRequest.deleteVariables(this.$route.params.id);
      } catch (error) {
        this.deleteVariablesDialog.display = false;
        this.$notify.error(this.deleteVariablesDialog.error);

        return;
      }
      this.deleteVariablesDialog.display = false;

      this.$notify.success(this.deleteVariablesDialog.success);
    },
    async editVariable(item) {
      item.variableEdit = {
        value: item.value,
        type: item.type,
        valueInfo: item.valueInfo,
      };
    },
    editVariableByDialog(item) {
      this.addVariableDialog.display = true;
      this.addVariableDialog.editValue = item;
    },
    async fileDownload(item) {
      let data = await instanceRequest.getVariableInstanceBinary(false, item.id);
      const blob = new Blob([data], {type: `${item.valueInfo.mimeType}`});
      const fileName = item.valueInfo.filename;
      const elink = document.createElement("a");
      elink.download = fileName;
      elink.style.display = "none";
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href);
    },
    async editVariableObjectByDialog(item) {
      if (item.type === "Object") {
        this.editVariableDialog.editValue = await instanceRequest.getVariableInstance(false,item.variableInstanceId ? item.variableInstanceId : item.id);
        this.editVariableDialog.editValue.serializedValue = item.value;
        this.editVariableDialog.editValue.valueInfo = item.valueInfo;
      } else {
        this.editVariableDialog.editValue = item;
      }
      this.editVariableDialog.display = true;
    },
    addVariableByDialog() {
      this.addVariableDialog.display = true;
      this.addVariableDialog.editValue = null;
    },
    addMessageByDialog() {
      let self = this;
      self.startUserTaskDialog.formData = null;
      self.startUserTaskDialog.display = true;
      self.startUserTaskDialog.startType = "addMessage";
      self.startUserTaskDialog.dataFrom === "variable";
      self.startUserTaskDialog.businessKey = "";
      self.startUserTaskDialog.messageName = "";
      self.startUserTaskDialog.variables = [];
      self.startUserTaskDialog.formValue = {};
      self.formBuilder.formValue = {data: {}};
    },
    async deleteVariable(item) {
      try {
        let response = await instanceRequest.deleteLocalExecutionVariables(
            this.instance.id,
            item.name
        );
      } catch (error) {
        this.$message({
          message: this.$t("saveDelFailed"),
          type: "error",
          showClose:true
        });
        return;
      }
      item.menu = false;

      this.$message({
        message: this.$t("saveDelSuccess"),
        type: "success",
        showClose:true
      });

      await this.getVariablesPage();
    },
    async getStatistics() {
      var statistics;
      let nodeProperties = {};
      statistics = await instanceRequest.getInstanceStatistics(
          this.instance.id
      );

      utils.calculateStatistics(statistics, nodeProperties);
      this.nodeProperties = nodeProperties;
    },
    selectInstructionType(instruction) {
    },
    onVariableHistory(element) {
      this.activityId = element.id;
      this.$refs.activityHistory.start();
    },

    startRetryJob(job) {
      this.retryJobDialog.job = job;
      this.retryJobDialog.display = true;
    },
    async retryJob() {
      try {
        switch (this.retryJobDialog.job.incidentType) {
          case "failedJob":
            await instanceRequest.retryJob(this.retryJobDialog.job.configuration, {
              retries: 1,
            });
            break;
          case "failedExternalTask":
            await processRequest.setExternalTaskRetries(this.retryJobDialog.job.configuration, {
              retries: 1,
            });
            break;
        }
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
    onClickNode(element) {
      this.currentElement = element.businessObject;
      this.$refs.vueBpmnViwer.setNodeSelected(element);
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

div.v-sheet.v-card.detail-card:not(.v-sheet--outlined) {
  box-shadow: 0 0px 0px 0px;
}

.badge {
  display: inline-block;
  min-width: 10px;
  padding: 3px 7px;
  font-size: 0.83 m;
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

.badge-menu {
  cursor: pointer;
}

.badge-menu i {
  text-align: center;
  margin: auto;
}

.badge-menu.badge-trash {
  background-color: #fa4f07;
}

.badge-menu.badge-edit {
  background-color: #444262;
}

.badge-menu.badge-start {
  background-color: #57928D;
}

.instance-status {
  display: inline-block;
  font-size: 0.83 m;
  font-weight: bold;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  border: 0;
  color: #fff;
}

.instance-status i {
  font-size: 1.2em;
  color: #000000;
}

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

.badge-all-instance {
  background-color: #444262;
}

.id-breadcrumbs .v-breadcrumbs__item.v-breadcrumbs__item--disabled {
  color: #83829a;
}

.badge-menu.badge-move {
  background-color: #312651;
}

.badge-menu.badge-pause {
  background-color: #ff7754;
}

div.popover-title {
  margin-bottom: 10px;
  font-weight: bold;
}

.small-headline {
  color: #444262;
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
