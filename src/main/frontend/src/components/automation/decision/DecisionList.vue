<template>

  <div style="position: relative;height: 100%;width: 100vw">
    <div
        style="
      height: 100%;
      overflow-y: auto;
      width: 100vw;
      display: flex;
      flex-direction: column;
      border-top: 1px solid rgba(187, 187, 187, 1);
    "
        ref="scrollParent"
    >
      <div class="d-flex flex-row"
           style="align-items: center;padding: 14px 15px; font-size: 14px; color: rgba(131, 130, 154, 1)">
        <v-breadcrumbs :items="breadcrumbs" style="background-color: #e8eff7;padding: 0;border: none" divider="|"/>
        <span
            style="text-decoration: underline; font-weight: bolder; color: black;margin-left: 5px;margin-right: 10px"
        >{{ decisionDefinition.totalCount }}</span>{{ $t('unitPiece') }} {{ $t('dmnReqDefKey') }}
        <span
            style="text-decoration: underline; font-weight: bolder; color: #fa4f07;margin-left: 5px;margin-right: 5px"
        >{{ decisionRequirementsDefinition.totalCount }}</span>{{ $t('unitPiece') }}
      </div>
      <v-expansion-panels accordion multiple v-model="expandTabs" flat tile>
        <v-expansion-panel>
          <v-expansion-panel-header hide-actions>
            <template #default="{ open }">
              <v-icon class="icon_expand">
                {{ open ? "mdi-chevron-up" : "mdi-chevron-down" }}
              </v-icon>
              <div class="vertical_line_expand"/>
              <span class="title_expand">{{ $t('dmnInstanceQuery') }}</span>
              <v-spacer style="flex: 1"/>
              <div class="vertical_line_expand"/>
              <v-btn
                  @click.stop="filterShow = true"
                  tile
                  outlined
                  color="#444262"
                  class="btn_only_border_left"
              >
                <v-icon left size="16" style="margin-right:6px;">mdi-magnify</v-icon>
                <span>{{ $t('searchBtnTxt') }}</span>
              </v-btn>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div
                v-if="decisionInstances.items.length === 0"
                style="
              padding: 10px;
            "
            >
              <div
                  style="
              display: flex !important;
              align-content: center;
              justify-content: center;
            "
              >
                <v-icon left size="16" style="margin-right:6px;">mdi-google-downasaur</v-icon>
                <span style="margin-top: 10px;margin-bottom: 10px;color: #83829a">{{ $t('noData') }}</span>
              </div>
            </div>
            <div v-if="decisionInstances.items.length > 0"
                 style="display: flex !important;flex-direction: column">
              <el-table
                  :data="decisionInstances.items"
                  id="instancesTable"
                  ref="instancesTable"
                  max-height="700"
                  stripe
              >
                <el-table-column :label="$t('dmnInstanceId')" prop="id" width="330">
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
                <el-table-column :label="$t('dmnEvaluationTime1')" prop="evaluationTime" sortable="custom" width="170">
                  <template slot-scope="props">
                    {{ formatDateTime(props.row.evaluationTime) }}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('dmnDefId')" prop="id" width="330">
                  <template slot-scope="props">
                    <div class="tabCopy">
                      <router-link
                          :to="{
                    name: 'decision-definition-detail',
                    params: { id: props.row.decisionDefinitionId },
                    query: {},
                  }"
                      >
                        {{ props.row.decisionDefinitionId }}
                      </router-link>
                      <v-icon
                          class="copyIcon"
                          v-show="props.row.decisionDefinitionId"
                          style="cursor: pointer"
                          color="#FF7754"
                          :title="$t('clickCopy') + props.row.decisionDefinitionId"
                          size="14"
                          @click="copy(props.row.decisionDefinitionId)"
                      >
                        mdi-file-move
                      </v-icon>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('dmnDefKey')" prop="decisionDefinitionKey" width="200">
                  <template slot-scope="props">
                    <router-link
                        :to="{}"
                        @click.native="enterDecisionDetailByKey(props.row.decisionDefinitionKey)"
                    >
                      {{ props.row.decisionDefinitionKey }}
                    </router-link>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('dmnDefName')" prop="decisionDefinitionName" width="200"/>
                <el-table-column :label="$t('activityId')" prop="activityId" width="330"/>
                <el-table-column :label="$t('activityInstanceId')" prop="activityInstanceId" width="330"/>
                <el-table-column :label="$t('processDefId')" prop="processDefinitionId" width="330">
                  <template slot-scope="props">
                    <div class="tabCopy">
                      <router-link
                          :to="{
                                  name: 'process-detail',
                                  params: { id: props.row.processDefinitionId, typeSwitch: true },
                                  query: {},
                                }"
                      >
                        {{ props.row.processDefinitionId }}
                      </router-link>
                      <v-icon
                          class="copyIcon"
                          v-show="props.row.processDefinitionId"
                          style="cursor: pointer"
                          color="#FF7754"
                          :title="$t('clickCopy') + props.row.processDefinitionId"
                          size="14"
                          @click="copy(props.row.processDefinitionId)"
                      >
                        mdi-file-move
                      </v-icon>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('processDefKey')" prop="processDefinitionKey" width="215">
                  <template slot-scope="props">
                    <router-link
                        :to="{}"
                        @click.native="enterProcessDetailByKey(props.row.processDefinitionKey)"
                    >
                      {{ props.row.processDefinitionKey }}
                    </router-link>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('processInstanceId')" prop="processInstanceId" width="330">
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
                <el-table-column :label="$t('rootProcessInstanceId')" prop="rootProcessInstanceId" width="330">
                  <template slot-scope="props">
                    <div class="tabCopy">
                      <router-link
                          :to="{
                                  name: 'instance-detail',
                                  params: { id: props.row.rootProcessInstanceId, tab: 3, activityId: props.row.activityId, typeSwitch: true },
                                  query: {},
                                }"
                      >
                        {{ props.row.rootProcessInstanceId }}
                      </router-link>
                      <v-icon
                          class="copyIcon"
                          v-show="props.row.rootProcessInstanceId"
                          style="cursor: pointer"
                          color="#FF7754"
                          :title="$t('clickCopy') + props.row.rootProcessInstanceId"
                          size="14"
                          @click="copy(props.row.rootProcessInstanceId)"
                      >
                        mdi-file-move
                      </v-icon>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('userIdProps')" prop="userId" width="200"/>
                <el-table-column :label="$t('dmnReqDefId')" prop="decisionRequirementsDefinitionId" width="330">
                  <template slot-scope="props">
                    <div class="tabCopy">
                      <router-link
                          :to="{
                                  name: 'requirement-definition-detail',
                                  params: { id: props.row.decisionRequirementsDefinitionId},
                                  query: {},
                                }"
                      >
                        {{ props.row.decisionRequirementsDefinitionId }}
                      </router-link>
                      <v-icon
                          class="copyIcon"
                          v-show="props.row.decisionRequirementsDefinitionId"
                          style="cursor: pointer"
                          color="#FF7754"
                          :title="$t('clickCopy') + props.row.decisionRequirementsDefinitionId"
                          size="14"
                          @click="copy(props.row.decisionRequirementsDefinitionId)"
                      >
                        mdi-file-move
                      </v-icon>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('dmnReqDefKey1')" prop="decisionRequirementsDefinitionKey" width="330">
                  <template slot-scope="props">
                    <router-link
                        :to="{}"
                        @click.native="enterDecisionRequirementDetailByKey(props.row.decisionRequirementsDefinitionKey)"
                    >
                      {{ props.row.decisionRequirementsDefinitionKey }}
                    </router-link>
                  </template>
                </el-table-column>
              </el-table>
              <div
                  class="text-center mb-2 my-2"
                  v-show="decisionInstances.pageCount > 1"
              >
                <v-pagination
                    v-model="decisionInstances.page"
                    :length="decisionInstances.pageCount"
                    total-visible="20"
                    color="#FF7754"
                />
              </div>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header hide-actions>
            <template #default="{ open }">
              <v-icon class="icon_expand">
                {{ open ? "mdi-chevron-up" : "mdi-chevron-down" }}
              </v-icon>
              <div class="vertical_line_expand"/>
              <span class="title_expand">{{ $t('deployDmnDef') }}</span>
              <v-spacer style="flex: 1"/>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <el-table
                :header-cell-style="{padding:'0px',height:'42px'}"
                :cell-style="{padding:'0px',height:'42px'}"
                :data="decisionDefinition.items"
                style="width: auto;"
                v-loading="decisionDefinition.loading"
                @sort-change="changeDecisionDefinitionSort"
                :default-sort="{
              prop: decisionDefinition.sortBy,
              order:
                decisionDefinition.sortOrder == 'desc'
                  ? 'descending'
                  : 'ascending',
            }"
            >
              <el-table-column label="" width="50px"/>
              <el-table-column :label="$t('name')" prop="name" sortable="custom">
                <template slot-scope="props">
                  <router-link
                      :to="{
                    name: 'decision-definition-detail',
                    params: { id: props.row.id },
                    query: {},
                  }"
                  >
                    {{ props.row.name }}
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column :label="$t('tenant')" prop="tenantId"/>
              <el-table-column
                  :label="$t('dmnReqDrd')"
                  prop="decisionRequirementsDefinitionKey"
              >
                <template slot-scope="props">
                  <router-link
                      :to="{
                    name: 'requirement-definition-detail',
                    params: { id: props.row.decisionRequirementsDefinitionId },
                    query: {},
                  }"
                  >
                    {{ props.row.decisionRequirementsDefinitionKey }}
                  </router-link>
                </template>
              </el-table-column>
            </el-table>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header hide-actions>
            <template #default="{ open }">
              <v-icon class="icon_expand">
                {{ open ? "mdi-chevron-up" : "mdi-chevron-down" }}
              </v-icon>
              <div class="vertical_line_expand"/>
              <span class="title_expand">{{ $t('deployDmnReqDrd') }}</span>
              <v-spacer style="flex: 1"/>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <el-table
                :header-cell-style="{padding:'0px',height:'42px'}"
                :cell-style="{padding:'0px',height:'42px'}"
                :data="decisionRequirementsDefinition.items"
                @sort-change="changeDecisionRequirementsDefinitionSort"
                :default-sort="{
              prop: decisionRequirementsDefinition.sortBy,
              order:
                decisionRequirementsDefinition.sortOrder == 'desc'
                  ? 'descending'
                  : 'ascending',
            }"
            >
              <el-table-column label="" width="50px"/>
              <el-table-column :label="$t('name')" prop="name" sortable="custom">
                <template slot-scope="props">
                  <router-link
                      :to="{
                    name: 'requirement-definition-detail',
                    params: { id: props.row.id },
                    query: {},
                  }"
                  >
                    {{ props.row.name }}
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column :label="$t('tenant')" prop="tenantId"/>
            </el-table>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <search-instance-form v-show="filterShow"
                          style="position: absolute;top: 0;left: 0;width: calc(100vw - 24px)"
                          @onFilterCancel="onFilterCancel"
                          @onFilterClear="onFilterClear"
                          @onFilterOk="onFilterOk"
    />
  </div>
</template>

<script>
import decisionRequest from "@/api/decision";
import SearchInstanceForm from "@/components/common/SearchInstanceForm";
import common from "@/components/automation/mixins";
import utils from "@/utils/utils";
import processRequest from "@/api/process";

export default {
  components: {SearchInstanceForm},
  mixins: [common],
  data() {
    return {
      breadcrumbs: [
        {
          text: this.$t("dmnDashboard"),
          disabled: true,
          href: "",
        },
        {
          text: this.$t("dmnDef"),
          disabled: true,
          href: "",
        },
      ],
      expandTabs: [0, 1, 2],
      decisionInstances: {
        sortBy: "evaluationTime",
        sortOrder: "desc",
        defaultSort: {prop: "startTime", order: "descending"},
        page: 0,
        pageCount: 0,
        itemsPerPage: 50,
        totalCount: 0,
        items: [],
      },
      decisionDefinition: {
        items: [],
        latestVersion: true,
        loading: true,
        sortBy: "name",
        sortOrder: "asc",
        totalCount: 0,
      },
      decisionRequirementsDefinition: {
        items: [],
        latestVersion: true,
        loading: true,
        sortBy: "name",
        sortOrder: "asc",
        totalCount: 0,
      },
    };
  },
  mounted() {
    this.filterType = "dmn";
    this.getDecisionDefinitionCount();
    this.getDecisionRequirementsDefinitionCount();
  },
  methods: {
    async enterProcessDetailByKey(processDefKey) {
      let versions = await processRequest.getEnhancementProcessStatistics(processDefKey);
      versions.sort(function (a, b) {
        return b.version - a.version;
      });
      this.$router.push({
        name: "process-detail",
        params: {id: versions[0].id},
      });
    },
    async enterDecisionDetailByKey(dmnDefKey) {
      let versions = await decisionRequest.getDecisionDefinitionByKey(dmnDefKey);
      this.$router.push({
        name: "decision-definition-detail",
        params: {id: versions.id},
      });
    },
    async enterDecisionRequirementDetailByKey(dmnDefKey) {
      let versions = await decisionRequest.getDecisionRequirementsDefinitionByKey(dmnDefKey);
      this.$router.push({
        name: "requirement-definition-detail",
        params: {id: versions.id},
      });
    },
    copy(value) {
      navigator.clipboard.writeText(value);
      this.$notify.success(this.$t("copySuccessWithTxt",{txt:value}));
    },
    formatDateTime: utils.formatDateTime,
    async getInstances() {
      this.decisionInstances.totalCount = 0;
      this.decisionInstances.page = 0;
      let data = this.generateFilters();
      if (Object.keys(data).length === 0) {
        this.decisionInstances.totalCount = 0;
        this.decisionInstances.pageCount = 0;
        this.decisionInstances.page = 1;
        this.decisionInstances.items = [];
      } else {
        var response = await decisionRequest.getDecisionInstanceCount(data);
        this.decisionInstances.totalCount = response.count;
        this.decisionInstances.pageCount =
            Math.floor(
                (response.count - 1) / this.decisionInstances.itemsPerPage
            ) + 1;
        this.decisionInstances.page = 1;
      }
    },
    async getInstancesPage() {
      if (!this.decisionInstances.page) {
        this.decisionInstances.items = [];
        return;
      }
      let params = this.generateFilters();
      if (Object.keys(params).length > 0) {
        params["sortBy"] = this.decisionInstances.sortBy;
        params["sortOrder"] = this.decisionInstances.sortOrder;
        this.decisionInstances.items = await decisionRequest.getDecisionInstanceList(Object.assign({
          firstResult:
              (this.decisionInstances.page - 1) *
              this.decisionInstances.itemsPerPage,
          maxResults: this.decisionInstances.itemsPerPage,
        }, params));
      }
    },
    onFilterOk() {
      let self = this;
      self.form
          .submit()
          .then((res) => {
            self.filterShow = false;
            self.formValue = res.data;
            self.getInstances();
          })
          .catch((err) => {
            console.log(err);
          });
    },
    goSearchInstance() {
      let self = this;
      self.filterShow = true;
    },
    changeDecisionRequirementsDefinitionSort(value) {
      this.decisionRequirementsDefinition.sortBy = value.prop;
      this.decisionRequirementsDefinition.sortOrder =
          value.order == "descending" ? "desc" : "asc";
      this.getDecisionRequirementsDefinitionList();
    },
    changeDecisionDefinitionSort(value) {
      this.decisionDefinition.sortBy = value.prop;
      this.decisionDefinition.sortOrder =
          value.order == "descending" ? "desc" : "asc";
      this.getDecisionDefinitionList();
    },
    async getDecisionDefinitionList() {
      this.decisionDefinition.loading = true;
      let params = {
        sortBy: this.decisionDefinition.sortBy,
        sortOrder: this.decisionDefinition.sortOrder,
        latestVersion: this.decisionDefinition.latestVersion,
      };
      let decisionDefinitionList =
          await decisionRequest.getDecisionDefinitionList(params);
      this.decisionDefinition.items = decisionDefinitionList;
      this.decisionDefinition.loading = false;
    },
    async getDecisionDefinitionCount() {
      let params = {
        latestVersion: this.decisionDefinition.latestVersion,
      };
      let response = await decisionRequest.getDecisionDefinitionCount(params);
      this.decisionDefinition.totalCount = response.count;
      if (this.decisionDefinition.totalCount > 0) {
        this.getDecisionDefinitionList();
      }
    },
    async getDecisionRequirementsDefinitionList() {
      this.decisionRequirementsDefinition.loading = true;
      let params = {
        sortBy: this.decisionRequirementsDefinition.sortBy,
        sortOrder: this.decisionRequirementsDefinition.sortOrder,
        latestVersion: this.decisionRequirementsDefinition.latestVersion,
      };
      let decisionRequirementsDefinitionList =
          await decisionRequest.getDecisionRequirementsDefinitionList(params);
      this.decisionRequirementsDefinition.items =
          decisionRequirementsDefinitionList;
      this.decisionRequirementsDefinition.loading = false;
    },
    async getDecisionRequirementsDefinitionCount() {
      let params = {
        latestVersion: this.decisionRequirementsDefinition.latestVersion,
      };
      let response =
          await decisionRequest.getDecisionRequirementsDefinitionCount(params);
      this.decisionRequirementsDefinition.totalCount = response.count;
      if (this.decisionRequirementsDefinition.totalCount > 0) {
        this.getDecisionRequirementsDefinitionList();
      }
    },
  },
  watch: {
    "$i18n.locale": {
      handler(val){
        let self=this;
        self.breadcrumbs[0].text = self.$t("dmnDashboard");
        self.breadcrumbs[1].text = self.$t("dmnDef");
      },
    },
    "decisionInstances.page": {
      handler() {
        this.getInstancesPage();
      },
    }
  },
};
</script>

<style scoped>
/deep/ .v-input--selection-controls {
  margin: 0;
}

/deep/ .v-expansion-panel-content__wrap {
  padding: 0;
}

/deep/ div.container.container--fluid.subpage {
  padding: 0;
  background-color: #e8eff7;
  height: calc(100vh - 48px);
}

div.container.container--fluid.subpage {
  padding: 0px 0 0 0px;
  background-color: #e8eff7;
  height: calc(100vh - 48px);
}

/deep/ .v-expansion-panel-header {
  padding: 0;
  border: 1px solid rgba(187, 187, 187, 1);
  min-height: fit-content !important;
  border-radius: unset;
}

.v-expansion-panel-header > *:not(.v-expansion-panel-header__icon) {
  flex-grow: 0;
}

.icon_expand {
  padding: 0px 10px;
}

.vertical_line_expand {
  height: 40px;
  width: 1px;
  color: #bbbbbb;
  border: 0.5px solid rgba(187, 187, 187, 1);
}

div.page-title {
  color: rgba(158, 158, 158, 100);
  font-size: 26px;
  text-align: left;
  vertical-align: middle;
}

/*div.el-table {*/
/*  margin: 30px 20px;*/
/*}*/

/deep/ .btn_only_border_left {
  border-bottom: none;
  border-right: none !important;
  border-top: none;
  border-left: none !important;
}

/deep/ .title_expand {
  font-weight: bolder;
  color: rgba(68, 66, 98, 1);
  font-size: 14px;
  padding: 10px;
}

div.v-sheet.v-card.detail-card:not(.v-sheet--outlined) {
  box-shadow: 0 0px 0px 0px;
}
</style>

<style>
a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}

.copyIcon {
  opacity: 0;
}

.tabCopy:hover .copyIcon {
  opacity: 1;
}
</style>
