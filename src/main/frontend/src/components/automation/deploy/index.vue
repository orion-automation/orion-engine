<template>
  <div style="overflow:hidden;height: 100%;border-top: 1px solid rgba(187, 187, 187, 1);">
    <div class="d-flex flex-row" style="align-items: center;padding: 14px 15px">
      <v-breadcrumbs :items="breadcrumbs" style="background-color: #e8eff7;padding: 0;border: none" divider="|" />
      <div style="background-color: #e8eff7;margin-left: 10px">
        <span class="badge badge-instance">
          <v-icon size="14" color="white">mdi-play</v-icon>{{
            deployments.totalCount
          }}</span>
      </div>
    </div>

    <v-card style="height:100%;border-top: 1px solid rgba(187, 187, 187, 1);">
      <div class="d-flex flex-row" style="height: 100%;width: 100%">
        <v-navigation-drawer
          permanent
          width="380"
          style="height: 100%;border-right: 1px solid rgba(187, 187, 187, 1);"
          class="left-drawer"
          mobile-breakpoint="0"
        >
          <div class="d-fex flex-column" style="width: 100%;height: 100%;display: flex">
            <div class="d-flex flex-row" style="width:100%;border-bottom: 1px solid rgba(187, 187, 187, 1);">
              <v-btn
                text
                large
                class="page-sub-menu"
                @click="searchDialog.display = true"
                color="#444262"
                style="border-right: 1px solid rgba(187, 187, 187, 1);flex: 1"
              >
                <v-icon size="20" color="#83829A">mdi-magnify</v-icon>
                <span style="color: #444262">{{ $t('searchBtnTxt') }}</span>
              </v-btn>
              <v-btn
                text
                large
                class="page-sub-menu"
                @click="deployDialog.display = true"
                style="flex: 1;border-right: none"
              >
                <v-icon size="20" color="#83829A">mdi-upload-network-outline</v-icon>
                <span style="color: #444262">{{ $t('deploy') }}</span>
              </v-btn>
            </div>
            <div style="flex: 1;overflow-y: auto">
              <v-list
                three-line
              >
                <v-list-item-group
                  v-model="selectedItem"
                  color="primary"
                >
                  <v-list-item
                    class="deploy-border"
                    @click="selectDeployment(item)"
                    v-for="item in deployments.items"
                    :key="item.id"
                  >
                    <v-layout justify-end>
                      <v-flex>
                        <v-list-item-content>
                          <div class="deploy-name">
                            {{ item.name }}
                          </div>

                          <v-layout>
                            <v-flex class="deploy-title" style="color: #83829a;">Tenant ID</v-flex>
                            <v-flex class="deploy-value" style="color: #83829a;">
                              {{ item.tenantId }}
                            </v-flex>
                          </v-layout>
                          <v-layout>
                            <v-flex class="deploy-title" style="color: #83829a;">{{ $t('deployTime') }}</v-flex>
                            <v-flex class="deploy-value" style="color: #83829a;">
                              {{ formatDateTime(item.deploymentTime) }}
                            </v-flex>
                          </v-layout>
                          <v-layout>
                            <v-flex class="deploy-title" style="color: #83829a;">{{ $t('deployFrom') }}</v-flex>
                            <v-flex class="deploy-value" style="color: #83829a;">
                              {{ item.source }}
                            </v-flex>
                          </v-layout>
                        </v-list-item-content>
                      </v-flex>
                      <v-icon size="24" color="#E0E0E0" class="ml-2 mr-2">
                        mdi-chevron-right
                      </v-icon>
                    </v-layout>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
              <infinite-loading @infinite="infiniteHandler" :identifier="infiniteId">
                <div slot="no-more">{{ $t('noMoreData') }}</div>
              </infinite-loading>
            </div>
          </div>
        </v-navigation-drawer>
        <div style="flex: 1;width: 0px">
          <el-row type="flex" justify="start" style="border-bottom: 1px solid rgba(187, 187, 187, 1);">
            <v-menu
              offset-y
            >
              <template
                #activator="{ on, attrs }"
              >
                <v-btn
                  text
                  large
                  class="page-sub-menu"
                  v-bind="attrs"
                  v-on="on"
                  style="border-right: 1px solid rgba(187, 187, 187, 1)"
                  v-show="resourcesShow"
                >
                  <span style="color: #444262">{{ resource.name }}</span>
                  <v-badge color="#444262" :content="resources.length" inline />&nbsp;
                  <v-icon right size="20" color="#FF7754">mdi-menu-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, index) in resources"
                  :key="index"
                  @click="selectResource(item)"
                >
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-spacer />
            <v-btn
              text
              class="deploy-menu"
              large
              @click="deploymentDownload()"
              :disabled="selectDeploymentDisplay"
              style="border-right: 1px solid rgba(187, 187, 187, 1);;border-left:1px solid rgba(187, 187, 187, 1);"
            >
              <v-icon size="20" color="#83829A">mdi-download-box-outline</v-icon>
              <span style="color: #444262" v-if="!selectDeploymentDisplay">{{ $t('download') }}</span>
              <span style="color: #bdbdbd" v-if="selectDeploymentDisplay">{{ $t('download') }}</span>
            </v-btn>
            <v-btn
              text
              class="deploy-menu"
              large
              :disabled="selectDeploymentDisplay"
              @click="reDeploymentDialog.display = true"
              style="border-right: 1px solid rgba(187, 187, 187, 1);"
            >
              <v-icon size="20" color="#83829A">mdi-upload-network-outline</v-icon>
              <span style="color: #444262" v-if="!selectDeploymentDisplay">{{ $t('reDeploy') }}</span>
              <span style="color: #bdbdbd" v-if="selectDeploymentDisplay">{{ $t('reDeploy') }}</span>
            </v-btn>
            <v-btn
              text
              class="deploy-menu"
              large @click="startDelete()"
              :disabled="selectDeploymentDisplay"
              style="border-right: 1px solid rgba(187, 187, 187, 1);"
            >
              <v-icon size="20" color="#83829A">mdi-delete-forever-outline</v-icon>
              <span style="color: #444262" v-if="!selectDeploymentDisplay">{{ $t('delete') }}</span>
              <span style="color: #bdbdbd" v-if="selectDeploymentDisplay">{{ $t('delete') }}</span>
            </v-btn>
            <v-btn text class="deploy-menu" large disabled>
              <v-icon size="20" color="#83829A">mdi-dots-horizontal</v-icon>
            </v-btn>
          </el-row>
          <el-row class="diagram-container" style="width:100%;height:60%;" v-if="proccessShow">
            <vue-bpmn
              :diagram-xml="xml"
              :options="{ overlays: { defaults: { scale: true } } }"
            />
          </el-row>
          <el-row class="diagram-container" style="width:100%;height:60%;" v-if="decisionShow">
            <vue-dmn
              :diagram-xml="xml"
              :can-view-drd="false"
              :options="{ overlays: { defaults: { scale: true } } }"
            />
          </el-row>
          <el-row style="width:100%;height:30%;border-top: 1px solid rgba(187, 187, 187, 1);"
                  v-if="proccessShow || decisionShow"
          >
            <div style="height:100%;" v-if="proccessShow">
              <v-tabs
                background-color="#fafafa"
                v-model="tab"
                color="#444262"
                class="bottom-container"
              >
                <v-tabs-slider color="#FF7754" />
                <v-tab key="definition">{{ $t('definition') }}</v-tab>
              </v-tabs>
              <v-tabs-items
                v-model="tab"
                class="bottom-container"
                style="overflow-x:hidden;overflow-y: auto;height: 100%;padding-bottom:100px;"
              >
                <v-tab-item key="definition" transition="false" style="height: 100%;">
                  <el-table
                    :data="processDefinition.items"
                    height="100%"
                    border
                    style="margin:0;"
                    v-loading="processDefinition.loading"
                  >
                    <el-table-column label="ID" prop="id">
                      <template slot-scope="props">
                        <router-link
                          :to="{
                            name: 'process-detail',
                            params: { id: props.row.id },
                            query: {},
                          }"
                        >
                          {{ props.row.id }}
                        </router-link>
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('name')" prop="name" width="250px">
                      <template slot-scope="props">
                        {{ props.row.name }}
                      </template>
                    </el-table-column>
                    <el-table-column label="KEY" prop="key" width="250px">
                      <template slot-scope="props">
                        {{ props.row.key }}
                      </template>
                    </el-table-column>
                  </el-table>
                </v-tab-item>
              </v-tabs-items>
            </div>
            <div style="height:100%;" v-if="decisionShow">
              <v-tabs
                background-color="#fafafa"
                v-model="tabDecision"
                color="#444262"
                class="bottom-container"
              >
                <v-tabs-slider color="#FF7754" />
                <v-tab key="decisionDefinition">{{ $t('definition') }}</v-tab>
                <v-tab key="decisionRequirement" v-if="decisionRequirements.items.length != 0">{{ $t('dmnReqDrd1') }}</v-tab>
              </v-tabs>
              <v-tabs-items
                v-model="tabDecision"
                class="bottom-container"
                style="overflow-x:hidden;overflow-y: auto;height: 100%;padding-bottom:50px;"
              >
                <v-tab-item key="decisionDefinition" transition="false" style="height: 100%;">
                  <el-table
                    :data="decisionDefinitions.items"
                    height="100%"
                    style="margin:0;"
                    v-loading="decisionDefinitions.loading"
                    border
                  >
                    <el-table-column label="ID" prop="id">
                      <template slot-scope="props">
                        <router-link
                          :to="{
                            name: 'decision-definition-detail',
                            params: { id: props.row.id },
                            query: {},
                          }"
                        >
                          {{ props.row.id }}
                        </router-link>
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('name')" prop="name" width="250px">
                      <template slot-scope="props">
                        {{ props.row.name }}
                      </template>
                    </el-table-column>
                    <el-table-column label="KEY" prop="key" width="250px">
                      <template slot-scope="props">
                        {{ props.row.key }}
                      </template>
                    </el-table-column>
                  </el-table>
                </v-tab-item>
                <v-tab-item key="decisionRequirement" transition="false" style="height: 100%;"
                            v-if="decisionRequirements.items.length != 0"
                >
                  <el-table
                    :data="decisionRequirements.items"
                    height="100%"
                    style="margin:0;"
                    v-loading="decisionRequirements.loading"
                    border
                  >
                    <el-table-column label="ID" prop="id">
                      <template slot-scope="props">
                        <router-link
                          :to="{
                            name: 'requirement-definition-detail',
                            params: { id: props.row.id },
                            query: {},
                          }"
                        >
                          {{ props.row.id }}
                        </router-link>
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('name')" prop="name" width="250px">
                      <template slot-scope="props">
                        {{ props.row.name }}
                      </template>
                    </el-table-column>
                    <el-table-column label="KEY" prop="key" width="250px">
                      <template slot-scope="props">
                        {{ props.row.key }}
                      </template>
                    </el-table-column>
                  </el-table>
                </v-tab-item>
              </v-tabs-items>
            </div>
          </el-row>
        </div>
      </div>
      <v-dialog v-model="reDeploymentDialog.display" max-width="500">
        <v-card>
          <v-card-title class="headline" style="color: #444262">
            {{ $t('reDeployWithName',{name:resource.name}) }}
          </v-card-title>
          <v-card-text>
            <p>
              {{ $t('reDeployTips') }}
            </p>
            <p>{{ $t('reDeployConfirm') }}</p>
          </v-card-text>
          <v-card-actions style="padding-bottom: 16px">
            <v-spacer />
            <v-btn text @click="reDeploymentDialog.display = false"> {{ $t('cancel') }}</v-btn>
            <v-btn style="color: #ffffff" color="#FF7754" @click="redeploy()">
              {{ $t('confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="searchDialog.display" width="530">
        <v-card>
          <v-card-title class="headline" style="color:#444262;">{{ $t('searchBtnTxt') }}</v-card-title>
          <v-card-text>
            <v-form ref="form" lazy-validation>
              <v-text-field v-model="searchDialog.id" :label="$t('deployId')"/>
              <v-text-field v-model="searchDialog.name" :label="$t('deployName')"/>

              <v-text-field v-model="searchDialog.tenantId" :label="$t('tenantId')"/>

              <v-menu
                ref="menu"
                v-model="searchDialog.dateMenu"
                :close-on-content-click="false"
                :return-value.sync="searchDialog.date"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="searchDialog.date"
                    :label="$t('deployBefore')"
                    append-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-date-picker v-model="searchDialog.date" no-title scrollable>
                  <v-spacer />
                  <v-btn text @click="searchDialog.dateMenu = false"> {{ $t('cancel') }}</v-btn>
                  <v-btn text @click="$refs.menu.save('')"> {{ $t('clear') }}</v-btn>
                  <v-btn text color="primary" @click="$refs.menu.save(searchDialog.date)">
                    {{ $t('confirm') }}
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="cancelSearch()"> {{ $t('cancel') }}</v-btn>
            <v-btn style="color: #ffffff" color="#FF7754" @click="search()">
              <span class="ml-2">{{ $t('query') }}</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="deployDialog.display" width="530">
        <v-card>
          <v-card-title class="headline" style="color:#444262;">{{ $t('deployProcess') }}</v-card-title>
          <v-card-text>
            <v-form ref="form" lazy-validation>
              <v-text-field v-model="deployDialog.name" :label="$t('deployName')" />

              <v-text-field v-model="deployDialog.tenantId" label="Tenant ID" />

              <v-file-input
                :label="$t('selectFile')"
                append-icon="mdi-paperclip"
                prepend-icon=""
                small-chips
                multiple
                ref="deployInputFile"
                v-model="deployDialog.fileModel"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="cancelDeploy()" :disabled="deployDialog.commitLoading"> {{ $t('cancel') }}</v-btn>
            <v-btn style="color: #ffffff" color="#FF7754" @click="deploy()" :loading="deployDialog.commitLoading">
              <span class="ml-2">{{ $t('deploy') }}</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="deleteDialog.display" max-width="500">
        <v-card>
          <v-card-title class="headline" style="color: #444262">
            {{ deleteDialog.title }}
          </v-card-title>
          <v-card-text>
            <v-form ref="form" lazy-validation>
              <v-checkbox v-model="deleteDialog.cascade" label="Cascade" color="#FF7754">
                <template #label>
                  <div class="checkbox-label" style="color:#444262;">Cascade</div>
                </template>
              </v-checkbox>

              <div class="checkbox-tip">
                {{ deleteDialog.cascade }}, if all process instances, historic process
                instances and jobs for this deployment should be deleted.
              </div>

              <v-checkbox
                v-model="deleteDialog.skipCustomListeners"
                label="Skip Custom Listeners"
                color="#FF7754"
              >
                <template #label>
                  <div class="checkbox-label" style="color:#444262;">Skip Custom Listeners</div>
                </template>
              </v-checkbox>
              <div class="checkbox-tip">
                {{ deleteDialog.skipCustomListeners }}, if only the built-in
                ExecutionListeners should be notified with the end event.
              </div>
              <v-checkbox
                v-model="deleteDialog.skipIoMappings"
                label="Skip IO Mappings"
                color="#FF7754"
              >
                <template #label>
                  <div class="checkbox-label" style="color:#444262;">Skip IO Mappings</div>
                </template>
              </v-checkbox>
              <div class="checkbox-tip">
                {{ deleteDialog.skipIoMappings }}, if all input/output mappings should not
                be invoked.
              </div>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="deleteDialog.display = false"> {{ $t('cancel') }}</v-btn>
            <v-btn style="color: #ffffff" color="#FF7754" @click="deleteDeployment()">
              <v-icon size="16" color="#ffffff" style="margin-right: 5px">
                mdi-delete
              </v-icon>
              {{ $t('confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>
<script>
import request from "@/api/process";
import camundaRequest from "@/api/camunda-service";
import utils from "@/utils/utils";
import moment from "moment";
import InfiniteLoading from "vue-infinite-loading";
import axios from "axios";
import VueDmn from "@/components/common/DMN";
import VueBpmn from "@/components/common/BPMN";
import decisionRequest from "@/api/decision";

export default {
  components: {
    InfiniteLoading,
    VueDmn,
    VueBpmn
  },
  data() {
    return {
      infiniteId: +new Date(),
      xml: "",
      breadcrumbs: [
        {
          text: this.$t("deploy"),
          disabled: true,
          href: "",
        },
      ],
      tab: 0,
      tabDecision: 0,
      proccessShow: false,
      decisionShow: false,
      selectedItem: null,
      resourcesShow: false,
      loadingList: false,
      loadingResources: false,
      loadingDetail: false,
      processTab: "process",
      decisionTab: "decisionDefinition",
      selectDeploymentDisplay: true,
      reDeploymentDialog: {
        display: false,
      },
      deployments: {
        page: 1,
        pageCount: 0,
        itemsPerPage: 20,
        totalCount: 0,
        loading: false,
        count: null,
        items: [],
      },
      processDefinition: {
        loading: true,
        page: 0,
        pageCount: 0,
        itemsPerPage: 5,
        totalCount: 0,
        items: [],
      },
      processes: {
        page: 0,
        pageCount: 0,
        itemsPerPage: 5,
        totalCount: 0,
        items: [],
      },
      decisionRequirements: {
        loading: true,
        page: 0,
        pageCount: 0,
        itemsPerPage: 50,
        totalCount: 0,
        items: [],
      },
      decisionDefinition: {
        category: null,
        decisionRequirementsDefinitionId: null,
        decisionRequirementsDefinitionKey: null,
        deploymentId: null,
        historyTimeToLive: null,
        id: null,
        key: null,
        name: null,
        resource: null,
        tenantId: null,
        version: null,
        versionTag: null,
      },
      decisionDefinitions: {
        loading: true,
        page: 0,
        pageCount: 0,
        itemsPerPage: 50,
        totalCount: 0,
        items: [],
      },
      imgUrl: require("@/assets/flow.png"),
      deployment: {
        id: "",
        name: "",
        source: "",
        deploymentTime: null,
        tenantId: null,
        links: [],
      },
      resource: {
        id: "",
        name: "",
        deploymentId: "",
      },
      resources: [],
      searchDialog: {
        display: false,
        id: "",
        name: "",
        tenantId: "",
        date: "", // moment().format('YYYY-MM-DD'),
        dateMenu: false,
      },
      deployDialog: {
        display: false,
        name: "",
        tenantId: "",
        file: "",
        fileModel: null,
        commitLoading: false,
      },
      deleteDialog: {
        display: false,
        cascade: false,
        skipCustomListeners: false,
        skipIoMappings: false,
        title: this.$t("delDeploy"),
        description: this.$t("delDeployConfirm"),
        success: this.$t("delDeploySuccess"),
        error: this.$t("delDeployFailed"),
      },
    };
  },
  computed: {
    resourceType: {
      get: function () {
        if (this.resource.name.match(/\.dmn$/gi)) {
          this.getDecisionRequirements();
          this.getDecisionDefinitions();
          return "dmn";
        } else if (this.resource.name.match(/\.bpmn$/gi)) {
          this.getProcesses();
          return "bpmn";
        } else {
          return "";
        }
      },
    },
  },
  watch: {
    // "deployments.page": {
    //   handler() {
    //     this.getDeploymentsPage();
    //   },
    // },
    "$i18n.locale": {
      handler(val){
        let self=this;
        self.breadcrumbs[0].text = self.$t("deploy");
        self.deleteDialog.title=self.$t("delDeploy");
        self.deleteDialog.description=self.$t("delDeployConfirm");
        self.deleteDialog.success=self.$t("delDeploySuccess");
        self.deleteDialog.error=self.$t("delDeployFailed");
      },
    },
    "deployDialog.display": {
      handler(val) {
        if (val) {
          let self = this;
          self.deployDialog.name = "";
          self.deployDialog.tenantId = "";
          self.deployDialog.file = null;
          self.deployDialog.fileModel = null;
        }
      },
    },
    "processes.page": {
      handler() {
        this.getProcessesPage();
      },
    },
    tabDecision: {
      handler() {
        this.getTab();
      }
    },
    "decisionDefinitions.page": {
      handler() {
        this.getDecisionDefinitionsPage();
      },
    },

    "decisionRequirements.page": {
      handler() {
        this.getDecisionRequirementsPage();
      },
    },

    // "deployment.id": {
    //   handler() {
    //     this.getResources();
    //   },
    // },
    "resource.id": {
      handler() {
        this.proccessShow = false;
        this.decisionShow = false;
        this.tab = 0;
        this.tabDecision = 0;
        this.decisionDefinitions.items = [];
        this.decisionRequirements.items = [];
        this.processDefinition.items = [];
        if (this.resource.name.match(/\.dmn$/gi)) {
          this.getDecisionDefinitions();
          this.getDecisionRequirements();
          this.decisionShow = true;
        } else if (this.resource.name.match(/\.bpmn$/gi)) {
          this.getProcessByDeployment();
          this.proccessShow = true;
        }
        this.showImage(this.resource.deploymentId, this.resource.id);
      },
    },
  },
  mounted() {
    if (this.$route.query.id) {
      this.searchDialog.id = this.$route.query.id;
    }
    this.getDeployments();
  },
  methods: {
    refreshDeployList() {
      let self = this;
      self.deployments.page = 1;
      self.deployments.items = [];
      self.infiniteId += 1;
    },
    async getProcessByDeployment() {
      this.processDefinition.loading = true;
      let params = {
        deploymentId: this.resource.deploymentId,
        resourceName: this.resource.name,
      };
      let res = await request.getProcessByDeployment(params);
      this.processDefinition.items = res;
      this.processDefinition.loading = false;
    },
    async redeploy() {
      let data = {
        resourceIds: []
      };
      for (var i = 0; i < this.resources.length; i++) {
        data.resourceIds.push(this.resources[i].id);
      }
      data.source = this.deployment.source;
      let res = await request.redeploy(this.resource.deploymentId, data);
      if (res.id) {
        this.$notify.success(this.$t("reDeploySuccess"));
        this.deployment.id = "";
        this.refreshDeployList();
        this.reDeploymentDialog.display = false;
      } else {
        this.$notify.error(this.$t("reDeployFailed"));
        this.reDeploymentDialog.display = false;
      }
    },
    async deploymentDownload() {
      let data = await request.deploymentData(this.resource.deploymentId, this.resource.id);
      const blob = new Blob([data]);
      const fileName = this.resource.name;
      const elink = document.createElement("a");
      elink.download = fileName;
      elink.style.display = "none";
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href);
    },
    infiniteHandler($state) {
      var filter = {sortBy: "deploymentTime", sortOrder: "desc"};
      if (this.searchDialog.id) {
        filter.id = this.searchDialog.id;
      }
      if (this.searchDialog.name) {
        filter.nameLike = "%" + this.searchDialog.name + "%";
      }

      if (this.searchDialog.tenantId) {
        filter.tenantIdIn = this.searchDialog.tenantId;
      }

      if (this.searchDialog.date) {
        filter.before = this.searchDialog.date;
      }
      request.getDeploymentList(filter, this.deployments.page, this.deployments.itemsPerPage).then((res) => {
        if (res.length) {
          this.deployments.page += 1;
          for (var i = 0; i < res.length; i++) {
            let result = this.deployments.items.some(item => item.id === res[i].id);
            if (!result) {
              this.deployments.items.push(res[i]);
            }
          }
          if (this.deployments.items.length > 0 && !this.deployment.id) {
            this.selectDeployment(this.deployments.items[0]);
          }
          $state.loaded();
        } else {
          $state.complete();
        }
      });
    },
    formatDateTime: utils.formatDateTime,
    startDelete() {
      this.deleteDialog.display = true;
    },
    async deleteDeployment() {
      var config = this.deleteDialog;
      // await request.deleteProcess(this.$route.params.id)
      var data = {
        cascade: this.deleteDialog.cascade,
        skipCustomListeners: this.deleteDialog.skipCustomListeners,
        skipIoMappings: this.deleteDialog.skipIoMappings,
      };
      try {
        await request.deleteDeployment(this.deployment.id, data);
      } catch (error) {
        this.deleteDialog.display = false;
        this.$notify.error(config.error);
        return;
      }
      this.deleteDialog.display = false;

      this.$notify.success(config.success);
      this.getDeployments();
      this.deployment.id = "";
      this.refreshDeployList();
    },
    async getDeployments() {
      this.deployments.totalCount = 0;
      var filter = {};
      if (this.searchDialog.id) {
        filter.id = this.searchDialog.id;
      }
      if (this.searchDialog.name) {
        filter.nameLike = "%" + this.searchDialog.name + "%";
      }

      if (this.searchDialog.tenantId) {
        filter.tenantIdIn = this.searchDialog.tenantId;
      }

      if (this.searchDialog.date) {
        filter.before = this.searchDialog.date;
      }

      var response = await request.getDeploymentCount(filter);
      this.deployments.totalCount = response.count;
      // this.deployments.count = response.count;
      // this.deployments.pageCount =
      //   Math.floor((response.count - 1) / this.deployments.itemsPerPage) + 1;
      // this.deployments.page = 1;
    },
    async getDeploymentsPage() {
      this.deployments.totalCount = 0;
      this.deployments.page = 1;
      if (!this.deployments.page) {
        this.deployments.items = [];
        return;
      }
      this.loadingList = true;
      var filter = {};
      if (this.searchDialog.name) {
        filter.nameLike = "%" + this.searchDialog.name + "%";
      }

      if (this.searchDialog.tenantId) {
        filter.tenantIdIn = this.searchDialog.tenantId;
      }

      if (this.searchDialog.date) {
        filter.before = this.searchDialog.date;
      }
      let deployments = await request.getDeploymentList(
          filter,
          this.deployments.page,
          this.deployments.itemsPerPage
      );
      this.deployments.items = deployments;
      if (!this.deployment.id) {
        this.deployment.id = deployments.length ? deployments[0].id : "";
      }
      this.loadingList = false;
    },
    async getProcesses() {
      this.processes.totalCount = 0;
      this.processes.page = 0;
      var response = await request.getProcessCount({
        deploymentId: this.resource.deploymentId,
        resourceName: this.resource.name,
      });
      this.processes.totalCount = response.count;
      this.processes.pageCount =
          Math.floor((response.count - 1) / this.processes.itemsPerPage) + 1;
      this.processes.page = 1;
    },
    async getProcessesPage() {
      if (!this.processes.page) {
        this.processes.items = [];
        return;
      }
      this.loadingDetail = true;
      let processes = await request.getProcessList(
          {
            deploymentId: this.resource.deploymentId,
            resourceName: this.resource.name,
          },
          this.processes.page,
          this.processes.itemsPerPage
      );
      this.processes.items = processes;
      this.loadingDetail = false;
    },

    async getDecisionDefinitions() {
      this.decisionDefinitions.loading = true;
      this.decisionDefinitions.totalCount = 0;
      this.decisionDefinitions.page = 0;
      var response = await request.getDecisionDefinitionsCount(
          this.resource.deploymentId
      );
      this.decisionDefinitions.totalCount = response.count;
      this.decisionDefinitions.pageCount =
          Math.floor((response.count - 1) / this.decisionDefinitions.itemsPerPage) + 1;
      this.decisionDefinitions.page = 1;
    },
    async getDecisionDefinitionsPage() {
      this.decisionDefinitions.loading = true;
      if (!this.decisionDefinitions.page) {
        this.decisionDefinitions.items = [];
        return;
      }
      this.loadingDetail = true;
      let decisionDefinitions = await request.getDecisionDefinitions(
          this.resource.deploymentId,
          this.decisionDefinitions.page,
          this.decisionDefinitions.itemsPerPage
      );
      this.decisionDefinition = decisionDefinitions[0];
      this.decisionDefinitions.items = decisionDefinitions;
      this.loadingDetail = false;
      this.decisionDefinitions.loading = false;
    },

    async getDecisionRequirements() {
      this.decisionRequirements.loading = true;
      this.decisionRequirements.totalCount = 0;
      this.decisionRequirements.page = 0;
      var response = await request.getDecisionRequirementsCount(
          this.resource.deploymentId
      );
      this.decisionRequirements.totalCount = response.count;
      this.decisionRequirements.pageCount =
          Math.floor((response.count - 1) / this.decisionRequirements.itemsPerPage) + 1;
      this.decisionRequirements.page = 1;
    },
    async getDecisionRequirementsPage() {
      this.decisionRequirements.loading = true;
      if (!this.decisionRequirements.page) {
        this.decisionRequirements.items = [];
        return;
      }
      this.loadingDetail = true;
      let decisionRequirements = await request.getDecisionRequirements(
          this.resource.deploymentId,
          this.decisionRequirements.page,
          this.decisionRequirements.itemsPerPage
      );
      this.decisionRequirements.items = decisionRequirements;
      this.loadingDetail = false;
      this.decisionRequirements.loading = false;
    },

    cancelSearch() {
      this.searchDialog.dateMenu = false;
      this.searchDialog.display = false;
    },
    search() {
      this.proccessShow = false;
      this.decisionShow = false;
      this.tab = 0;
      this.tabDecision = 0;
      this.decisionDefinitions.items = [];
      this.decisionRequirements.items = [];
      this.processDefinition.items = [];
      this.deployments.items = [];
      this.resources = [];
      this.selectDeploymentDisplay = true;
      this.resourcesShow = false;
      this.refreshDeployList();
      this.searchDialog.display = false;
    },
    cancelDeploy() {
      this.deployDialog.name = "";
      this.deployDialog.tenantId = "";
      this.deployDialog.file = null;
      this.deployDialog.fileModel = null;
      this.deployDialog.display = false;
    },
    async deploy() {
      try {
        this.deployDialog.commitLoading = true;
        let formData = new FormData();
        this.deployDialog.fileModel.forEach((file,index)=>{
          formData.append(`data-${index}`, file);
        });
        formData.append("deployment-name", this.deployDialog.name);
        if (this.deployDialog.tenantId && this.deployDialog.tenantId.length > 0) {
          formData.append("tenant-id", this.deployDialog.tenantId);
        }
        formData.append("deployment-source", "cockpit");
        let response = await decisionRequest.createDeployment(formData);
        this.deployment.id = "";
        this.refreshDeployList();
        this.deployDialog.display = false;
        this.deployDialog.commitLoading = false;
      } catch (e) {
        this.$notify.error(`部署错误:${e}`);
        this.deployDialog.commitLoading = false;
      }
      ;
    },

    selectResource(resource) {
      this.resource = resource;
    },

    async selectDeployment(deployment) {
      this.resources = [];
      this.selectDeploymentDisplay = false;
      this.resourcesShow = true;
      let res = await request.getResources(deployment.id);
      this.tab = 0;
      this.tabDecision = 0;
      this.resource = res[0];
      this.resources = res;
      this.deployment = deployment;
      this.selectedItem = this.deployments.items.findIndex(item=>item.id===deployment.id);
    },
    async showImage(deploymentId, resourceId) {
      this.xml = "";
      let response = await request.deploymentDataShow(deploymentId, resourceId);
      this.xml = response;
    },
  },
};
</script>

<style scoped>
/deep/ .v-navigation-drawer__border {
  display: none;
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
  color: #fff;
}

.badge-instance {
  background-color: #57928d;
}

div.page-title {
  color: rgba(158, 158, 158, 100);
  font-size: 26px;
  text-align: left;
  vertical-align: middle;
}

div.v-list-item__subtitle.subtitle {
  color: rgba(136, 136, 136, 100);
  font-size: 12px;
  text-align: left;
}

div.value {
  color: rgba(16, 16, 16, 100);
  font-size: 16px;
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

div.el-table {
  margin: 30px 20px;
}

button.deploy-menu span {
  color: rgba(33, 33, 33, 100);
  font-size: 14px;
  margin-left: 9px;
}

button.page-menu {
  margin-left: 20px;
  color: #ffffff;
  background-color: #2979ff;
}

.deploy-name {
  color: rgba(16, 16, 16, 100);
  font-size: 16px;
  margin-bottom: 12px;
  font-weight: 500;
}

.deploy-title {
  color: rgba(16, 16, 16, 100);
  font-size: 14px;
  text-align: left;
}

.deploy-value {
  color: rgba(16, 16, 16, 100);
  font-size: 14px;
  text-align: right;
  font-weight: 500;
}

.deploy-border {
  border-bottom: 1px solid rgba(238, 238, 238, 100);
}

.v-list-item.deploy-border {
  padding: 0 0 0 14px;
  cursor: pointer;
}

div.checkbox-tip {
  margin: -25px 0 0 35px;

  font-size: 14px;
  text-align: left;
}

div.checkbox-label {
  font-size: 16px;
  text-align: left;
  font-weight: 600;
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
