<template>
  <div>
    <v-dialog
      v-model="selectInstanceDialog.display"
      max-width="700"
      height="500"
    >
      <v-card>
        <v-card-title class="headline" style="color: #444262">
          {{ $t('selectProcessInstanceWithOpt',{opt:$t(action == "restart" ?'retry':'edit')}) }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row style="margin: 0 20px">
              <v-col style="padding: 0" cols="4">
                <v-checkbox
                  style="padding-bottom: 10px"
                  v-model="selectInstanceDialog.filter.withIncidents"
                  v-if="action == 'modify'"
                  :label="$t('incident')"
                  color="#FF7754"
                  @change="getInstances()"
                  hide-details
                >
                  <template #label>
                    <div class="checkbox-label">{{ $t('incident') }}</div>
                  </template>
                </v-checkbox>
              </v-col>

              <v-col style="padding: 0" cols="4">
                <v-checkbox
                  style="padding-bottom: 10px"
                  v-model="selectInstanceDialog.filter.active"
                  v-if="action == 'modify'"
                  :label="$t('active')"
                  color="#FF7754"
                  @change="changeActive()"
                  hide-details
                >
                  <template #label>
                    <div class="checkbox-label">{{ $t('active') }}</div>
                  </template>
                </v-checkbox>
              </v-col>

              <v-col style="padding: 0" cols="4">
                <v-checkbox
                  style="padding-bottom: 10px"
                  v-model="selectInstanceDialog.filter.suspended"
                  v-if="action == 'modify'"
                  :label="$t('suspend')"
                  color="#FF7754"
                  @change="changeSuspended()"
                  hide-details
                >
                  <template #label>
                    <div class="checkbox-label">{{ $t('suspend') }}</div>
                  </template>
                </v-checkbox>
              </v-col>

              <v-col style="padding: 0" cols="4">
                <v-text-field
                  :label="$t('bussinessKey')"
                  v-model="selectInstanceDialog.filter.businessKey"
                  @keydown.enter="getInstances()"
                  hide-details
                />
              </v-col>

              <v-col style="padding: 0" cols="4">
                <v-menu
                  ref="startedAfter"
                  v-model="selectInstanceDialog.filter.dislayStartedAfter"
                  :close-on-content-click="false"
                  :nudge-left="80"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="selectInstanceDialog.filter.startedAfter"
                      :label="$t('processStartAfterDate')"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      @change="getInstances()"
                    />
                  </template>
                  <v-date-picker
                    v-model="selectInstanceDialog.filter.startedAfter"
                    @input="
                      selectInstanceDialog.filter.dislayStartedAfter = false;
                      getInstances();
                    "
                  >
                    <v-spacer />
                    <v-btn
                      text
                      color="primary"
                      @click="
                        selectInstanceDialog.filter.startedAfter = '';
                        $refs.startedAfter.save(
                          selectInstanceDialog.filter.startedAfter
                        );
                        getInstances();
                      "
                    >
                      {{ $t('reset') }}
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>

              <v-col style="padding: 0" cols="4">
                <v-menu
                  ref="startedBefore"
                  v-model="selectInstanceDialog.filter.dislayStartedBefore"
                  :close-on-content-click="false"
                  :nudge-left="80"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="selectInstanceDialog.filter.startedBefore"
                      :label="$t('processStartBeforeDate')"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      @change="getInstances()"
                    />
                  </template>
                  <v-date-picker
                    v-model="selectInstanceDialog.filter.startedBefore"
                    @input="
                      selectInstanceDialog.filter.dislayStartedBefore = false;
                      getInstances();
                    "
                  >
                    <v-spacer />
                    <v-btn
                      text
                      color="primary"
                      @click="
                        selectInstanceDialog.filter.startedBefore = '';
                        $refs.startedBefore.save(
                          selectInstanceDialog.filter.startedBefore
                        );
                        getInstances();
                      "
                    >
                      {{ $t('reset') }}
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <el-table
              :data="selectInstanceDialog.instances"
              @selection-change="selectionChange"
            >
              <el-table-column type="selection" width="60" />

              <el-table-column :label="$t('processInstanceId')" width="350">
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
              <el-table-column prop="businessKey" width="200" :label="$t('topic')" />
              <el-table-column
                v-if="action == 'restart'"
                width="200"
                :label="$t('startTime')"
              >
                <template slot-scope="props">
                  {{
                    props.row.startTime
                      ? utils.formatDateTime(props.row.startTime)
                      : "-"
                  }}
                </template>
              </el-table-column>

              <el-table-column
                v-if="action == 'restart'"
                width="200"
                :label="$t('endTime')"
              >
                <template slot-scope="props">
                  {{
                    props.row.endTime
                      ? utils.formatDateTime(props.row.endTime)
                      : "-"
                  }}
                </template>
              </el-table-column>
            </el-table>
          </v-form>
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer />
          <v-btn text @click="resetModifyInstance()">{{ $t("cancel") }}</v-btn>
          <v-btn
            :disabled="selectedInstances.length === 0"
            style="color: #ffffff"
            color="#FF7754"
            @click="startModifyInstance()"
          >
            <v-icon size="14" color="#ffffff" style="margin-right: 5px">
              mdi-cursor-default-click
            </v-icon>
            {{ $t("selectInstanceWithOpt",{opt:$t(action == "restart" ?"retry":"modify"),size:selectedInstances.length}) }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="modifyInstanceDialog.display" max-width="750">
      <v-card>
        <v-card-title class="headline" style="color: #444262">
          {{ $t('confirmAndExecute') }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row>
              <v-col cols="4">
                <v-checkbox
                  v-model="modifyInstanceDialog.executeAsync"
                  :label="$t('asyncExecute')"
                  color="#FF7754"
                >
                  <template #label>
                    <div class="checkbox-label" style="color: #444262">
                      {{ $t('asyncExecute') }}
                    </div>
                  </template>
                </v-checkbox>

                <div class="checkbox-tip">
                  {{ $t('asyncExecuteTips') }}
                </div>
              </v-col>
              <v-col cols="4">
                <v-checkbox
                  v-model="modifyInstanceDialog.skipCustomListeners"
                  :label="$t('skipCustomListeners')"
                  color="#FF7754"
                >
                  <template #label>
                    <div class="checkbox-label" style="color: #444262">
                      {{ $t('skipCustomListeners') }}
                    </div>
                  </template>
                </v-checkbox>
                <div class="checkbox-tip">{{ $t('skipCustomListenersTips') }}</div>
              </v-col>

              <v-col cols="4">
                <v-checkbox
                  v-model="modifyInstanceDialog.skipIoMappings"
                  :label="$t('skipIOMaps')"
                  color="#FF7754"
                >
                  <template #label>
                    <div class="checkbox-label" style="color: #444262">
                      {{ $t('skipIOMaps') }}
                    </div>
                  </template>
                </v-checkbox>
                <div class="checkbox-tip">
                  {{ $t('skipIOMapsTips') }}
                </div>
              </v-col>

              <v-col cols="4" v-if="action == 'restart'">
                <v-checkbox
                  v-model="modifyInstanceDialog.initialVariables"
                  :label="$t('skipIOMaps')"
                  color="primary"
                >
                  <template #label>
                    <div class="checkbox-label">Initial Variables</div>
                  </template>
                </v-checkbox>
                <div class="checkbox-tip">
                  Set the initial set of variables during restart. By default,
                  the last set of variables is used.
                </div>
              </v-col>

              <v-col cols="4" v-if="action == 'restart'">
                <v-checkbox
                  v-model="modifyInstanceDialog.withoutBusinessKey"
                  :label="$t('skipIOMaps')"
                  color="primary"
                >
                  <template #label>
                    <div class="checkbox-label">Without Business Key</div>
                  </template>
                </v-checkbox>
                <div class="checkbox-tip">
                  Do not take over the business key of the historic process
                  instance.
                </div>
              </v-col>
            </v-row>

            <v-row v-show="action !== 'restart'">
              <v-col cols="12">
                <div
                  style="font-size: 14px; color: #101010; margin-bottom: 12px"
                >
                  {{ $t('remarkInfo') }}
                </div>
                <v-textarea
                  rows="3"
                  outlined
                  v-model="modifyInstanceDialog.annotation"
                  auto-grow
                  hide-details
                />
              </v-col>
            </v-row>

            <el-table :data="instructions" style="width: auto">
              <el-table-column :label="$t('type')" width="200" prop="type" />
              <el-table-column prop="name" :label="$t('activity')" />
              <el-table-column prop="activityId" width="200" :label="$t('activityId')" />
            </el-table>
            <v-row>
              <v-col cols="12">
                <div style="margin-top: 12px">
                  <span style="font-size: 14px; color: #101010">{{ $t('viewPayload') }}</span>
                  <v-icon
                    v-show="!modifyInstanceDialog.showPayload"
                    style="margin-left: 10px; cursor: pointer"
                    color="#FF7754"
                    size="14"
                    @click="
                      modifyInstanceDialog.showPayload =
                        !modifyInstanceDialog.showPayload
                    "
                  >
                    mdi-eye
                  </v-icon>

                  <v-icon
                    v-show="modifyInstanceDialog.showPayload"
                    style="margin-left: 10px; cursor: pointer"
                    color="#555555"
                    size="14"
                    @click="
                      modifyInstanceDialog.showPayload =
                        !modifyInstanceDialog.showPayload
                    "
                  >
                    mdi-eye-off
                  </v-icon>
                </div>
              </v-col>
            </v-row>

            <v-row v-show="modifyInstanceDialog.showPayload">
              <v-col cols="12">
                <v-textarea
                  :disabled="true"
                  rows="4"
                  outlined
                  v-model="payload"
                  hide-details
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer />
          <v-btn text @click="resetModifyInstance()">{{ $t('cancel') }}</v-btn>
          <v-btn
            style="color: #ffffff"
            color="#FF7754"
            @click="modifyInstance()"
          >
            <v-icon size="14" color="#ffffff" style="margin-right: 5px">
              mdi-lightning-bolt
            </v-icon>
            {{ $t('execute') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import processRequest from "@/api/process";
import instanceRequest from "@/api/instance";
import utils from "@/utils/utils";

export default {
  name: "InstanceModify",
  components: {},
  props: {
    instanceId: {
      type: String,
    },
    definitionId: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    instructions: {
      type: Array,
      default: [],
      required: true,
    },
  },
  data() {
    return {
      utils: utils,
      selectInstanceDialog: {
        display: false,
        instances: [],
        filter: {
          withIncidents: false,
          active: false,
          suspended: false,
          businessKey: "",
          displayStartedAfter: false,
          startedAfter: "",
          displayStartedBefore: false,
          startedBefore: "",
        },
      },

      modifyInstanceDialog: {
        display: false,
        executeAsync: true,
        skipCustomListeners: true,
        skipIoMappings: true,
        initialVariables: false,
        withoutBusinessKey: false,
        showPayload: true,
        annotation: "",
      },
    };
  },
  watch: {},
  computed: {
    selectedInstances() {
      return this.selectInstanceDialog.instances.filter(
        (instance) => instance.selected
      );
    },
    payload() {
      var processInstanceIds = this.instanceId
        ? [this.instanceId]
        : this.selectInstanceDialog.instances
            .filter((instance) => instance.selected)
            .map((instance) => instance.id);
      var item = {
        processDefinitionId: this.definitionId,
        skipCustomListeners: this.modifyInstanceDialog.skipCustomListeners,
        skipIoMappings: this.modifyInstanceDialog.skipIoMappings,
        instructions: this.instructions.map((item) => {
          return {
            type: item.type.replace("MultiInstance", ""),
            activityId: item.activityId,
            cancelCurrentActiveActivityInstances:
              item.cancelCurrentActiveActivityInstances,
          };
        }),
        processInstanceIds,
      };

      if (this.modifyInstanceDialog.annotation.length) {
        item.annotation = this.modifyInstanceDialog.annotation;
      }

      if (this.action === "restart") {
        item.initialVariables = this.modifyInstanceDialog.initialVariables;
        item.withoutBusinessKey = this.modifyInstanceDialog.withoutBusinessKey;
      }

      return JSON.stringify(item);
    },
  },

  mounted() {},
  methods: {
    changeSuspended() {
      if (this.selectInstanceDialog.filter.suspended) {
        this.selectInstanceDialog.filter.active = false;
      }
      this.getInstances();
    },
    changeActive() {
      if (this.selectInstanceDialog.filter.active) {
        this.selectInstanceDialog.filter.suspended = false;
      }
      this.getInstances();
    },
    start() {
      if (this.instanceId) {
        this.startModifyInstance();
      } else {
        this.startSelectInstance();
      }
    },
    async getInstances() {
      var instances;
      var param = {
        processDefinitionId: this.definitionId,
      };
      if (this.action == "modify") {
        if (this.selectInstanceDialog.filter.withIncidents) {
          param.withIncidents = true;
        }
        if (this.selectInstanceDialog.filter.active) {
          param.active = true;
        }
        if (this.selectInstanceDialog.filter.suspended) {
          param.suspended = true;
        }
        param.unfinished = true;
      } else {
        param.finished = true;
      }

      if (this.selectInstanceDialog.filter.businessKey) {
        param.processInstanceBusinessKeyLike =
          "%" + this.selectInstanceDialog.filter.businessKey + "%";
      }

      var formattedDate;
      if (this.selectInstanceDialog.filter.startedBefore) {
        formattedDate =
          utils.formatDateTime(
            this.selectInstanceDialog.filter.startedBefore,
            "yyyy-MM-DDTHH:mm:ss.SSS"
          ) +
          utils
            .formatDateTime(this.selectInstanceDialog.filter.startedBefore, "Z")
            .replace(":", "");
        param.startedBefore = formattedDate;
      }
      if (this.selectInstanceDialog.filter.startedAfter) {
        formattedDate =
          utils.formatDateTime(
            this.selectInstanceDialog.filter.startedAfter,
            "yyyy-MM-DDTHH:mm:ss.SSS"
          ) +
          utils
            .formatDateTime(this.selectInstanceDialog.filter.startedAfter, "Z")
            .replace(":", "");
        param.startedAfter = formattedDate;
      }
      if (this.action == "restart") {
        instances = await processRequest.postInstanceList("history", param);
      } else {
        instances = await processRequest.getInstanceList("history", param);
      }
      instances.forEach((instance) => (instance.selected = false));
      this.selectInstanceDialog.instances = instances;
    },
    async startSelectInstance() {
      await this.getInstances();
      this.selectInstanceDialog.display = true;
      this.selectInstanceDialog.filter = {
        withIncidents: false,
        active: false,
        suspended: false,
        businessKey: "",
        displayStartedAfter: false,
        startedAfter: "",
        displayStartedBefore: false,
        startedBefore: "",
      };
    },
    async startModifyInstance() {
      this.selectInstanceDialog.display = false;
      this.modifyInstanceDialog.display = true;
    },
    async modifyInstance() {
      var data = JSON.parse(this.payload);
      try {
        var result;
        if (this.action == "restart") {
          result = await processRequest.executeRestart(
            this.modifyInstanceDialog.executeAsync,
            this.definitionId,
            data
          );
        } else {
          result = await processRequest.executeModification(
            this.modifyInstanceDialog.executeAsync,
            data
          );
        }
      } catch (error) {
        this.$message({
          message: this.$t("processFailedWithOpt",{opt:this.$t(this.action === "restart" ? "restart" : "modify")}),
          type: "error",
          showClose:true
        });

        return;
      }

      this.$message({
        message: this.$t("processSuccessWithOpt",{opt:this.$t(this.action === "restart" ? "restart" : "modify")}),
        type: "success",
        showClose:true
      });

      this.resetModifyInstance();
      this.instructions.splice(0, this.instructions.length);
    },
    resetModifyInstance() {
      this.selectInstanceDialog.instances = [];
      this.selectInstanceDialog.display = false;
      this.modifyInstanceDialog.executeAsync = true;
      this.modifyInstanceDialog.skipCustomListeners = true;
      this.modifyInstanceDialog.skipIoMappings = true;
      this.modifyInstanceDialog.initialVariables = false;
      this.modifyInstanceDialog.withoutBusinessKey = false;
      this.modifyInstanceDialog.annotation = "";
      this.modifyInstanceDialog.display = false;
    },
    selectionChange(selection) {
      this.selectInstanceDialog.instances.forEach((instance) => {
        instance.selected = selection.indexOf(instance) >= 0;
      });
    },
  },
};
</script>

<style scoped>
.checkbox-label {
  color: #444262;
}
</style>
