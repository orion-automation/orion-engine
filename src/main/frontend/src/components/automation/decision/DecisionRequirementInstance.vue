<template>
  <div class="decision-container" style="border-top: 1px solid rgba(187, 187, 187, 1);">
    <div class="d-flex flex-row" style="align-items: center;padding: 14px 15px">
      <v-breadcrumbs :items="breadcrumbs" style="background-color: #e8eff7;padding: 0;border: none" divider="|" />
      <v-breadcrumbs
        :items="idBreadcrumbs"
        style="background-color: #e8eff7;padding: 0;border: none"
        divider="|"
      />
    </div>
    <v-card class="detail-card  decision-detail-card" style="border-top: 1px solid rgba(187, 187, 187, 1);">
      <v-layout style="margin: 0;height: 100%" class="stretch">
        <re-size-drawer ref="resizeDrawer" @setLeftWidth="setLeftWidth">
          <v-icon class="navigation-icon" @click="switchLeft()">
            mdi-chevron-left
          </v-icon>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                {{ $t('dmnDefName') }}
              </v-list-item-subtitle>
              <div class="value">
                {{ requirementDefinition.name }}
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                {{ $t('instanceId') }}
              </v-list-item-subtitle>
              <div class="value">
                {{ requirementInstance.id }}
                <v-icon
                  class="copyIcon"
                  v-show="requirementInstance.id"
                  style="cursor: pointer"
                  color="#FF7754"
                  :title="$t('clickCopy') + requirementInstance.id"
                  size="12.8"
                  @click="copy(requirementInstance.id)"
                >
                  mdi-file-move
                </v-icon>
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                {{ $t('version') }}
              </v-list-item-subtitle>
              <div class="value">
                {{ requirementDefinition.version == null ? "-" : requirementDefinition.version }}
              </div>
            </v-list-item-content>
          </v-list-item>

          <!-- <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                版本标签
              </v-list-item-subtitle>
              <div class="value">
                -
              </div>
            </v-list-item-content>
          </v-list-item> -->

          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                {{ $t('mainMenus.decision') }}{{ $t('executeTime') }}
              </v-list-item-subtitle>
              <div class="value">
                {{ formatDateTime(requirementInstance.evaluationTime) }}
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                {{ $t('dmnDefId') }}
              </v-list-item-subtitle>
              <div class="value">
                <router-link
                  :to="{
                    name: 'decision-definition-detail',
                    params: { id: requirementInstance.decisionDefinitionId },
                    query: {},
                  }"
                >
                  {{ requirementInstance.decisionDefinitionId }}
                </router-link>
                <v-icon
                  class="copyIcon"
                  v-show="requirementInstance.decisionDefinitionId"
                  style="cursor: pointer"
                  color="#FF7754"
                  :title="$t('clickCopy') + requirementInstance.decisionDefinitionId"
                  size="12.8"
                  @click="copy(requirementInstance.decisionDefinitionId)"
                >
                  mdi-file-move
                </v-icon>
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                {{ $t('dmnDefKey') }}
              </v-list-item-subtitle>
              <div class="value">
                {{ requirementInstance.decisionDefinitionKey }}
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                决策要求ID
              </v-list-item-subtitle>
              <div class="value">
                <router-link
                  :to="{
                    name: 'requirement-definition-detail',
                    params: { id: requirementInstance.decisionRequirementsDefinitionId },
                    query: {},
                  }"
                >
                  {{ requirementInstance.decisionRequirementsDefinitionId }}
                </router-link>
                <v-icon
                  class="copyIcon"
                  v-show="requirementInstance.decisionRequirementsDefinitionId"
                  style="cursor: pointer"
                  color="#FF7754"
                  :title="$t('clickCopy') + requirementInstance.decisionRequirementsDefinitionId"
                  size="12.8"
                  @click="copy(requirementInstance.decisionRequirementsDefinitionId)"
                >
                  mdi-file-move
                </v-icon>
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                {{ $t('instanceHistoryActiveTime') }}
              </v-list-item-subtitle>
              <div class="value">
                {{ requirementInstance.removalTime == null ? "-" : formatDateTime(requirementInstance.evaluationTime) }}
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                {{ $t('processInstanceId') }}
              </v-list-item-subtitle>
              <div class="value">
                <router-link
                  :to="{
                    name: 'instance-detail',
                    params: { id: requirementInstance.processInstanceId, typeSwitch: true, },
                    query: {},
                  }"
                >
                  {{ requirementInstance.processInstanceId }}
                </router-link>
                <v-icon
                  class="copyIcon"
                  v-show="requirementInstance.processInstanceId"
                  style="cursor: pointer"
                  color="#FF7754"
                  :title="$t('clickCopy') + requirementInstance.processInstanceId"
                  size="12.8"
                  @click="copy(requirementInstance.processInstanceId)"
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
                  v-if="requirementInstance.processDefinitionId"
                  :to="{
                    name: 'process-detail',
                    params: {
                      id: requirementInstance.processDefinitionId,
                      typeSwitch: true,
                    },
                    query: {},
                  }"
                >
                  {{ requirementInstance.processDefinitionId }}
                </router-link>
                <span v-else>-</span>
                <v-icon
                  class="copyIcon"
                  v-show="requirementInstance.processDefinitionId"
                  style="cursor: pointer"
                  color="#FF7754"
                  :title="$t('clickCopy') + requirementInstance.processDefinitionId"
                  size="12.8"
                  @click="copy(requirementInstance.processDefinitionId)"
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
                {{ requirementInstance.tenantId || "-" }}
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
              <span />
            </v-btn>
            <v-spacer />
            <v-btn
              large
              text
              class="process-menu"
              style="border-left: 1px solid rgba(187, 187, 187, 1);"
              disabled
            >
              <v-icon size="20" color="#83829A">
                mdi-dots-vertical
              </v-icon>
            </v-btn>
          </el-row>
          <el-row
            class="diagram-container"
            v-show="bottom != 2"
            :style="leftStylePadding"
            style="border-top:1px solid rgba(187, 187, 187, 1);"
          >
            <vue-dmn ref="vueDmnViewer"
                     :diagram-xml="xml"
                     :can-view-table="false"
                     :options="{ overlays: { defaults: { scale: true } } }"
            />
          </el-row>
          <re-size-layout class="bottom-border"
                          ref="resizeLayoutBottom"
                          :min-height="48"
          >
            <template>
              <v-tabs
                background-color="#fafafa"
                v-model="tab"
                style="flex: 0"
                color="#444262"
                class="bottom-container"
                :style="leftStylePadding"
              >
                <div class="vertical-collapsed">
                  <v-icon class="navigation-icon" @click="switchBottom()">
                    {{ !bottom ? "mdi-chevron-down" : "mdi-chevron-up" }}
                  </v-icon>
                </div>
                <v-tabs-slider color="#FF7754" />
                <v-tab key="decisionInstance">{{ $t('dmnInstance') }}</v-tab>
              </v-tabs>
              <v-tabs-items
                v-model="tab"
                style="overflow-x:hidden;"
                class="bottom-container"
                :style="leftStylePadding"
              >
                <v-tab-item key="decisionInstance" transition="false">
                  <v-row style="margin: 0 20px">
                    <v-col style="padding: 0;margin-right:20px;" cols="12" sm="4" md="4" lg="2">
                      <v-text-field
                        :label="$t('processDefId')"
                        v-model="decisionInstance.filter.processDefinitionId"
                        @keydown.enter="getDecisionInstance()"
                        hide-details
                        style="font-size: 14px"
                      >
                        <template #label>
                          <div style="font-size: 14px">{{ $t('processDefId') }}</div>
                        </template>
                      </v-text-field>
                    </v-col>
                    <v-col style="padding: 0;margin-right:20px;" cols="12" sm="4" md="4" lg="2">
                      <v-text-field
                        :label="$t('processDefKey')"
                        v-model="decisionInstance.filter.processDefinitionKey"
                        @keydown.enter="getDecisionInstance()"
                        hide-details
                        style="font-size: 14px"
                      >
                        <template #label>
                          <div style="font-size: 14px">{{ $t('processDefKey') }}</div>
                        </template>
                      </v-text-field>
                    </v-col>
                    <v-col style="padding: 0;margin-right:20px;" cols="12" sm="4" md="4" lg="2">
                      <v-text-field
                        :label="$t('activityId')"
                        v-model="decisionInstance.filter.activityIdIn"
                        @keydown.enter="getDecisionInstance()"
                        hide-details
                        style="font-size: 14px"
                      >
                        <template #label>
                          <div style="font-size: 14px">{{ $t('activityId') }}</div>
                        </template>
                      </v-text-field>
                    </v-col>
                    <v-col style="padding: 0" cols="12" sm="4" md="4" lg="2">
                      <v-menu
                        ref="evaluatedAfter"
                        v-model="decisionInstance.filter.displayEvaluatedAfter"
                        :close-on-content-click="false"
                        :nudge-left="80"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template #activator="{ on, attrs }">
                          <v-text-field
                            v-model="decisionInstance.filter.evaluatedAfter"
                            :label="$t('evaluatedAfter')"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            @change="getDecisionInstance()"
                            style="font-size: 14px"
                          >
                            <template #label>
                              <div style="font-size: 14px">
                                {{ $t('evaluatedAfter') }}
                              </div>
                            </template>
                          </v-text-field>
                        </template>
                        <v-date-picker
                          v-model="decisionInstance.filter.evaluatedAfter"
                          @input="
                            decisionInstance.filter.displayEvaluatedAfter = false;
                            getDecisionInstance();
                          "
                        >
                          <v-spacer />
                          <v-btn
                            text
                            color="primary"
                            @click="
                              decisionInstance.filter.evaluatedAfter = '';
                              $refs.evaluatedAfter.save(
                                decisionInstance.filter.evaluatedAfter
                              );
                              getDecisionInstance();
                            "
                          >
                            {{ $t('reset') }}
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col style="padding: 0" cols="12" sm="4" md="4" lg="2">
                      <v-menu
                        ref="evaluatedBefore"
                        v-model="decisionInstance.filter.displayEvaluatedBefore"
                        :close-on-content-click="false"
                        :nudge-left="80"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template #activator="{ on, attrs }">
                          <v-text-field
                            v-model="decisionInstance.filter.evaluatedBefore"
                            :label="$t('evaluatedBefore')"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            @change="getDecisionInstance()"
                            style="font-size: 14px"
                          >
                            <template #label>
                              <div style="font-size: 14px">
                                {{ $t('evaluatedBefore') }}
                              </div>
                            </template>
                          </v-text-field>
                        </template>
                        <v-date-picker
                          v-model="decisionInstance.filter.evaluatedBefore"
                          @input="
                            decisionInstance.filter.displayEvaluatedBefore = false;
                            getDecisionInstance();
                          "
                        >
                          <v-spacer />
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
                    </v-col>
                  </v-row>
                  <el-table
                    v-loading="decisionInstance.loading"
                    border
                    :data="decisionInstance.items"
                    @sort-change="decisionInstanceSortChange"
                    :default-sort="{prop: decisionInstance.sortBy, order: decisionInstance.sortOrder == 'desc' ? 'descending' : 'ascending'}"
                  >
                    <el-table-column :label="$t('dmnReqInstanceId')" prop="id" width="330">
                      <template slot-scope="props">
                        <div class="tabCopy">
                          <router-link
                            :to="{
                              name: 'decision-instance-detail',
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
                    <el-table-column :label="$t('dmnDefName')"
                                     prop="id" width="210">
                      <template slot-scope="props">
                        <div class="tabCopy">
                          <router-link
                            :to="{
                              name: 'decision-definition-detail',
                              params: { id: props.row.decisionDefinitionId },
                              query: {},
                            }"
                          >
                            {{ props.row.decisionDefinitionName }}
                          </router-link>
                          <v-icon
                            class="copyIcon"
                            v-show="props.row.decisionDefinitionName"
                            style="cursor: pointer"
                            color="#FF7754"
                            :title="$t('clickCopy') + props.row.decisionDefinitionName"
                            size="14"
                            @click="copy(props.row.decisionDefinitionName)"
                          >
                            mdi-file-move
                          </v-icon>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('dmnEvaluationTime')"
                                     prop="evaluationTime" sortable="custom" width="170">
                      <template slot-scope="props">
                        {{ formatDateTime(props.row.evaluationTime) }}
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('callProcessDef')"
                                     prop="processDefinitionKey" width="150">
                      <template slot-scope="props">
                        <div class="tabCopy">
                          <router-link
                            :to="{
                              name: 'process-detail',
                              params: { id: props.row.processDefinitionId, typeSwitch: true },
                              query: {},
                            }"
                          >
                            {{ props.row.processDefinitionKey }}
                          </router-link>
                          <v-icon
                            class="copyIcon"
                            v-show="props.row.processDefinitionKey"
                            style="cursor: pointer"
                            color="#FF7754"
                            :title="$t('clickCopy') + props.row.processDefinitionKey"
                            size="14"
                            @click="copy(props.row.processDefinitionKey)"
                          >
                            mdi-file-move
                          </v-icon>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('callInstances')" prop="processInstanceId" width="330">
                      <template slot-scope="props">
                        <div class="tabCopy">
                          <router-link
                            :to="{
                              name: 'instance-detail',
                              params: { id: props.row.processInstanceId, tab: 3, activityId: props.row.activityId, typeSwitch: true },
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
                </v-tab-item>
              </v-tabs-items>
            </template>
          </re-size-layout>
        </div>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
import decisionRequest from "@/api/decision";
import utils from "@/utils/utils";
import VueDmn from "@/components/common/DMN";
import ReSizeLayout from "@/components/common/ReSizeLayout";
import ReSizeDrawer from "@/components/common/ReSizeDrawer";

export default {
  components: {
    VueDmn,ReSizeLayout,ReSizeDrawer
  },
  data() {
    return {
      xml: "",
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
      breadcrumbs: [
        {
          text: this.$t("dmnReqDefKey"),
          href: "#/automation/decision/list",
        },
        {
          text: "",
          href: "",
        },
      ],
      tab: 0,
      left: true,
      leftStylePadding:{},
      leftStyleMargin:{},
      bottom: 1,
      requirementInstance: {
        activityId: "",
        activityInstanceId: "",
        collectResultValue: null,
        decisionDefinitionId: "",
        decisionDefinitionKey: "",
        decisionDefinitionName: "",
        evaluationTime: "",
        removalTime: null,
        id: "",
        processDefinitionId: "",
        processDefinitionKey: "",
        processInstanceId: "",
        rootProcessInstanceId: "",
        caseDefinitionId: null,
        caseDefinitionKey: null,
        caseInstanceId: null,
        tenantId: null,
        userId: null,
        rootDecisionInstanceId: null,
        decisionRequirementsDefinitionId: null,
        decisionRequirementsDefinitionKey: null,
      },
      requirementDefinition: {
        category: "",
        deploymentId:  "",
        id: "",
        key: "",
        name: "",
        resource: "",
        tenantId: null,
        version: null,
      },
      decisionInstance: {
          sortBy: "evaluationTime",
          sortOrder: "desc",
          page: 0,
          pageCount: 0,
          itemsPerPage: 50,
          totalCount: 0,
          loading: true,
          items:[],
          filter: {
            processDefinitionId: "",
            processDefinitionKey: "",
            activityIdIn: "",
            evaluatedBefore: "",
            evaluatedAfter: "",
          },
      },
    };
  },
  mounted() {
    this.getData();
  },
  watch: {
    "$i18n.locale": {
      handler(val){
        let self=this;
        self.breadcrumbs[0].text = self.$t("dmnReqDefKey");
      },
    },
    tab: {
      handler() {
        this.getTab();
      }
    },
    $route: {
      handler() {
        this.tab = 0;
        this.getData();
      },
    },
    "decisionInstance.page": {
      handler() {
        this.getDecisionInstancePage();
      }
    },
  },
  methods: {
    setLeftWidth(payload){
      let self=this;
      self.left=payload.left;
      self.leftStylePadding={paddingLeft:`${payload.left?payload.width:0}px`};
      self.leftStyleMargin={marginLeft:`${payload.left?payload.width:0}px`};
    },
    decisionInstanceSortChange(value) {
      this.decisionInstance.sortBy = value.prop;
      this.decisionInstance.sortOrder = value.order == "descending" ? "desc" : "asc";
      this.getDecisionInstancePage();
    },
    copy(value) {
      navigator.clipboard.writeText(value);
      this.$notify.success(this.$t("copySuccessWithTxt",{txt:value}));
    },
    formatDateTime: utils.formatDateTime,
    switchLeft() {
      this.$refs.resizeDrawer.setLeft(!this.left);
    },
    switchBottom() {
      this.bottom = this.$refs.resizeLayoutBottom.switchShow();
    },
    toggleFullscreen(full) {
      this.$refs.resizeDrawer.setLeft(!full);
      if (full){
        //全屏
        this.bottom = true;
      } else {
        this.bottom = false;
      }
      this.$refs.resizeLayoutBottom.manageShow(this.bottom);
    },
    async getTab() {
      switch (this.tab) {
        case 0:
          this.getDecisionInstance();
      }
    },
    async getData() {
      let response = await decisionRequest.getDecisionInstance(this.$route.params.id);
      this.requirementInstance = response;
      this.idBreadcrumbs[1].text = response.id;
      var url = this.$router.resolve({
        name: "requirement-definition-detail",
        params: { id: response.decisionRequirementsDefinitionId },
        query: this.$route.query,
      });
      this.breadcrumbs[1].href = url.href;
      response = await decisionRequest.getRequirementDefinition(
        response.decisionRequirementsDefinitionId
      );
      this.breadcrumbs[1].text = response.name;
      this.requirementDefinition = response;
      response = await decisionRequest.getRequirementDefinitionXML(response.id);
      this.xml = response.dmnXml;
      this.getTab();
    },
    async getDecisionInstance() {
      this.decisionInstance.loading = true;
      this.decisionInstance.totalCount = 0;
      this.decisionInstance.page = 0;
      var params = {
        decisionRequirementsDefinitionId: this.requirementInstance.decisionRequirementsDefinitionId,
      };
      if(this.decisionInstance.filter.processDefinitionId) {
        params.processDefinitionId = this.decisionInstance.filter.processDefinitionId;
      }
      if(this.decisionInstance.filter.processDefinitionKey) {
        params.processDefinitionKey = this.decisionInstance.filter.processDefinitionKey;
      }
      if(this.decisionInstance.filter.activityIdIn) {
        params.activityIdIn = this.decisionInstance.filter.activityIdIn;
      }
      var formattedDate;
      if(this.decisionInstance.filter.evaluatedBefore) {
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
      let response = await decisionRequest.getDecisionInstanceCount(params);
      this.decisionInstance.totalCount = response.count;
      this.decisionInstance.pageCount =
        Math.floor((response.count - 1) / this.decisionInstance.itemsPerPage) + 1;
      this.decisionInstance.page = 1;
      if(response.count === 0){
        this.decisionInstance.loading = false;
      }
    },
    async getDecisionInstancePage() {
      this.decisionInstance.loading = true;
      if (!this.decisionInstance.page) {
        this.decisionInstance.items = [];
        return;
      }
      var params = {
        decisionRequirementsDefinitionId: this.requirementInstance.decisionRequirementsDefinitionId,
        firstResult: (this.decisionInstance.page - 1) * this.decisionInstance.itemsPerPage,
        maxResults: this.decisionInstance.itemsPerPage,
        sortBy: this.decisionInstance.sortBy,
        sortOrder: this.decisionInstance.sortOrder,
      };
      if(this.decisionInstance.filter.processDefinitionId) {
        params.processDefinitionId = this.decisionInstance.filter.processDefinitionId;
      }
      if(this.decisionInstance.filter.processDefinitionKey) {
        params.processDefinitionKey = this.decisionInstance.filter.processDefinitionKey;
      }
      if(this.decisionInstance.filter.activityIdIn) {
        params.activityIdIn = this.decisionInstance.filter.activityIdIn;
      }
      var formattedDate;
      if(this.decisionInstance.filter.evaluatedBefore) {
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
      let response = await decisionRequest.getDecisionInstanceList(params);
      this.decisionInstance.items = response;
      this.decisionInstance.loading = false;
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
  font-size: 0.8em;
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
