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
    <v-card class="detail-card decision-detail-card" style="border-top: 1px solid rgba(187, 187, 187, 1);">
      <v-layout style="margin: 0;height: 100%" class="stretch">
        <re-size-drawer ref="resizeDrawer" @setLeftWidth="setLeftWidth">
          <v-icon class="navigation-icon" @click="switchLeft()">
            mdi-chevron-left
          </v-icon>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                {{ $t('dmnName') }}
              </v-list-item-subtitle>
              <div class="value">
                {{ decisionInstance.decisionDefinitionName }}
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                {{ $t('version') }}
              </v-list-item-subtitle>
              <div class="value">
                {{ decisionDefinition.version }}
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                决策实例ID
              </v-list-item-subtitle>
              <div class="value">
                {{ decisionInstance.id }}
                <v-icon
                  class="copyIcon"
                  v-show="decisionInstance.id"
                  style="cursor: pointer"
                  color="#FF7754"
                  :title="$t('clickCopy') + decisionInstance.id"
                  size="12.8"
                  @click="copy(decisionInstance.id)"
                >
                  mdi-file-move
                </v-icon>
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                决策实例时间
              </v-list-item-subtitle>
              <div class="value">
                {{ formatDateTime(decisionInstance.evaluationTime) }}
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
                    params: { id: decisionInstance.decisionDefinitionId },
                    query: {},
                  }"
                >
                  {{ decisionInstance.decisionDefinitionId }}
                </router-link>
                <v-icon
                  class="copyIcon"
                  v-show="decisionInstance.decisionDefinitionId"
                  style="cursor: pointer"
                  color="#FF7754"
                  :title="$t('clickCopy') + decisionInstance.decisionDefinitionId"
                  size="12.8"
                  @click="copy(decisionInstance.decisionDefinitionId)"
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
                {{ decisionInstance.decisionDefinitionKey }}
                <v-icon
                  class="copyIcon"
                  v-show="decisionInstance.decisionDefinitionKey"
                  style="cursor: pointer"
                  color="#FF7754"
                  :title="$t('clickCopy') + decisionInstance.decisionDefinitionKey"
                  size="12.8"
                  @click="copy(decisionInstance.decisionDefinitionKey)"
                >
                  mdi-file-move
                </v-icon>
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                {{ $t('dmnDeployId') }}
              </v-list-item-subtitle>
              <div class="value">
                {{
                  decisionDefinition.deploymentId == null
                    ? "-"
                    : decisionDefinition.deploymentId
                }}
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="subtitle">
                {{ $t('instanceHistoryActiveTime') }}
              </v-list-item-subtitle>
              <div class="value">
                {{
                  decisionInstance.removalTime == null
                    ? "-"
                    : decisionInstance.removalTime
                }}
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
                    params: { id: decisionInstance.processDefinitionId, typeSwitch: true },
                    query: {},
                  }"
                >
                  {{ decisionInstance.processDefinitionId }}
                </router-link>
                <v-icon
                  class="copyIcon"
                  v-show="decisionInstance.processDefinitionId"
                  style="cursor: pointer"
                  color="#FF7754"
                  :title="$t('clickCopy') + decisionInstance.processDefinitionId"
                  size="12.8"
                  @click="copy(decisionInstance.processDefinitionId)"
                >
                  mdi-file-move
                </v-icon>
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
                    params: { id: decisionInstance.processInstanceId },
                    query: {},
                  }"
                >
                  {{ decisionInstance.processInstanceId }}
                </router-link>
                <v-icon
                  class="copyIcon"
                  v-show="decisionInstance.processInstanceId"
                  style="cursor: pointer"
                  color="#FF7754"
                  :title="$t('clickCopy') + decisionInstance.processInstanceId"
                  size="12.8"
                  @click="copy(decisionInstance.processInstanceId)"
                >
                  mdi-file-move
                </v-icon>
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
                    params: { id: decisionDefinition.decisionRequirementsDefinitionId },
                    query: {},
                  }"
                  v-if="decisionInstance.decisionRequirementsDefinitionId"
                >
                  {{ decisionInstance.decisionRequirementsDefinitionId }}
                </router-link>
                <span v-else>-</span>
                <v-icon
                  class="copyIcon"
                  v-show="decisionInstance.decisionRequirementsDefinitionId"
                  style="cursor: pointer"
                  color="#FF7754"
                  :title="$t('clickCopy') + decisionInstance.decisionRequirementsDefinitionId"
                  size="12.8"
                  @click="copy(decisionInstance.decisionRequirementsDefinitionId)"
                >
                  mdi-file-move
                </v-icon>
              </div>
            </v-list-item-content>
          </v-list-item>
        </re-size-drawer>
        <div class="horizontal-collapsed" v-if="!left">
          <v-icon class="navigation-icon" @click="switchLeft()">
            mdi-chevron-right
          </v-icon>
        </div>
        <div style="display: flex;flex-direction: column;width: 100%">
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
              <v-icon size="16" color="#83829A">
                mdi-dots-vertical
              </v-icon>
            </v-btn>
          </el-row>
          <el-row
            class="diagram-container"
            v-show="bottom != 2"
            :style="leftStylePadding"
            style="border-top: 1px solid rgba(187, 187, 187, 1);"
          >
            <vue-dmn ref="vueDmnViewer"
                     :diagram-xml="xml"
                     :default-show-table="decisionDefinition.key"
                     :out-put-rules="outPutRules"
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
                color="#444262"
                style="flex: 0"
                class="bottom-container"
                :style="leftStylePadding"
              >
                <div class="vertical-collapsed">
                  <v-icon class="navigation-icon" @click="switchBottom()">
                    {{ !bottom ? "mdi-chevron-down" : "mdi-chevron-up" }}
                  </v-icon>
                </div>
                <v-tabs-slider color="#FF7754" />
                <v-tab key="input">{{ $t('input') }}</v-tab>
                <v-tab key="output">{{ $t('output') }}</v-tab>
              </v-tabs>
              <v-tabs-items
                v-model="tab"
                style="overflow-x:hidden;"
                class="bottom-container"
                :style="leftStylePadding"
              >
                <v-tab-item key="input" transition="false">
                  <el-table :data="decisionInstance.inputs">
                    <el-table-column :label="$t('name')" prop="clauseName" sortable>
                      <template slot-scope="props">
                        {{ props.row.clauseName == null ? props.row.clauseId : props.row.clauseName }}
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('type')" prop="type" sortable>
                      <template slot-scope="props">
                        {{ props.row.type }}
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('value')" prop="value">
                      <template slot-scope="props">
                        {{ props.row.value }}
                      </template>
                    </el-table-column>
                  </el-table>
                </v-tab-item>
                <v-tab-item key="output" transition="false">
                  <el-table :data="decisionInstance.outputs">
                    <el-table-column :label="$t('name')" prop="clauseName" sortable>
                      <template slot-scope="props">
                        {{ props.row.clauseName == null ? props.row.clauseId : props.row.clauseName }}
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('type')" prop="type" sortable>
                      <template slot-scope="props">
                        {{ props.row.type }}
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('value')" prop="value">
                      <template slot-scope="props">
                        {{ props.row.value }}
                      </template>
                    </el-table-column>
                  </el-table>
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
    VueDmn,ReSizeLayout,ReSizeDrawer,
  },
  computed:{
    outPutRules(){
      let self=this;
      let highlight=[];
      if (self.decisionInstance && self.decisionInstance.outputs){
        highlight = self.decisionInstance.outputs.map(output=>output["ruleId"]);
      }
      return highlight;
    },
  },
  data() {
    return {
      xml: "",
      tab: 0,
      bottom: 1,
      left: true,
      leftStylePadding:{},
      leftStyleMargin:{},
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
          text: this.$t("dmnDef"),
          href: "#/automation/decision/list",
        },
        {
          text: "",
          href: "",
        },
      ],
      decisionDefinition: {
        id: "",
        key: "",
        category: "",
        name: "",
        resource: "",
        version: null,
        deploymentId: "",
        decisionRequirementsDefinitionId: "",
        decisionRequirementsDefinitionKey: "",
        tenantId: null,
        versionTag: null,
        historyTimeToLive: null,
      },
      decisionInstance: {
        activityId: "",
        activityInstanceId: "",
        collectResultValue: null,
        decisionDefinitionId: "",
        decisionDefinitionKey: "",
        decisionDefinitionName: "",
        evaluationTime: "",
        removalTime: null,
        id: "",
        inputs: [],
        outputs: [],
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
    };
  },
  watch: {
    "$i18n.locale": {
      handler(val){
        let self=this;
        self.breadcrumbs[0].text = self.$t("dmnDef");
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
    this.getData();
  },
  methods: {
    setLeftWidth(payload){
      let self=this;
      self.left=payload.left;
      self.leftStylePadding={paddingLeft:`${payload.left?payload.width:0}px`};
      self.leftStyleMargin={marginLeft:`${payload.left?payload.width:0}px`};
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
    async getData() {
      let params = {
        includeInputs: true,
        includeOutputs: true,
        disableBinaryFetching: true,
        disableCustomObjectDeserialization: true,
      };
      let response = await decisionRequest.getDecisionInstance(
        this.$route.params.id,
        params
      );
      this.decisionInstance = response;
      this.breadcrumbs[1].text = response.decisionDefinitionName;
      this.idBreadcrumbs[1].text = response.id;
      var url = this.$router.resolve({
        name: "decision-definition-detail",
        params: { id: response.decisionDefinitionId },
        query: this.$route.query,
      });
      this.breadcrumbs[1].href = url.href;
      response = await decisionRequest.getDecisionDefinition(
        response.decisionDefinitionId
      );
      this.decisionDefinition = response;
      let responseXML = await decisionRequest.getDecisionXml(response.id);
      this.xml = responseXML.dmnXml;
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
