<template>
  <div>
    <v-dialog v-model="deleteDialog.display" max-width="1070">
      <v-card>
        <v-card-title class="headline" style="color: #444262">
          {{ $t('selectDeleteProcessInstance') }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row style="margin: 0 20px">
              <v-col style="padding: 0" cols="4">
                <v-checkbox
                  style="padding-bottom: 10px"
                  v-model="deleteDialog.skipCustomListeners"
                  :label="$t('skipCustomListeners')"
                  color="#FF7754"
                  hide-details
                >
                  <template #label>
                    <div class="checkbox-label">{{ $t('skipCustomListeners') }}</div>
                  </template>
                </v-checkbox>
              </v-col>
              <v-col style="padding: 0" cols="8">
                <v-text-field
                  :label="$t('deleteReason')"
                  v-model="deleteDialog.deleteReason"
                  hide-details
                />
              </v-col>
            </v-row>
            <hr>
            <v-row style="margin: 0 20px">
              <v-col style="padding: 0" cols="4">
                <v-checkbox
                  style="padding-bottom: 10px"
                  v-model="deleteDialog.filter.withIncidents"
                  :label="$t('incident')"
                  color="#FF7754"
                  v-if="type == 'runtime'"
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
                  v-model="deleteDialog.filter.active"
                  :label="$t('active')"
                  color="#FF7754"
                  v-if="type == 'runtime'"
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
                  v-model="deleteDialog.filter.suspended"
                  :label="$t('suspend')"
                  color="#FF7754"
                  v-if="type == 'runtime'"
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
                  v-model="deleteDialog.filter.businessKey"
                  @keydown.enter="getInstances()"
                  hide-details
                />
              </v-col>

              <v-col style="padding: 0" cols="4">
                <v-menu
                  ref="startedAfter"
                  v-model="deleteDialog.filter.dislayStartedAfter"
                  :close-on-content-click="false"
                  :nudge-left="80"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="deleteDialog.filter.startedAfter"
                      :label="$t('processStartAfterDate')"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      @change="getInstances()"
                    />
                  </template>
                  <v-date-picker
                    v-model="deleteDialog.filter.startedAfter"
                    @input="
                      deleteDialog.filter.dislayStartedAfter = false;
                      getInstances();
                    "
                  >
                    <v-spacer />
                    <v-btn
                      text
                      color="primary"
                      @click="
                        deleteDialog.filter.startedAfter = '';
                        $refs.startedAfter.save(
                          deleteDialog.filter.startedAfter
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
                  v-model="deleteDialog.filter.dislayStartedBefore"
                  :close-on-content-click="false"
                  :nudge-left="80"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="deleteDialog.filter.startedBefore"
                      :label="$t('processStartBeforeDate')"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      @change="getInstances()"
                    />
                  </template>
                  <v-date-picker
                    v-model="deleteDialog.filter.startedBefore"
                    @input="
                      deleteDialog.filter.dislayStartedBefore = false;
                      getInstances();
                    "
                  >
                    <v-spacer />
                    <v-btn
                      text
                      color="primary"
                      @click="
                        deleteDialog.filter.startedBefore = '';
                        $refs.startedBefore.save(
                          deleteDialog.filter.startedBefore
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
              :data="deleteDialog.instances"
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
              <el-table-column width="200" :label="$t('startTime')">
                <template slot-scope="props">
                  {{
                    props.row.startTime
                      ? utils.formatDateTime(props.row.startTime)
                      : "-"
                  }}
                </template>
              </el-table-column>
              <el-table-column width="200" :label="$t('endTime')">
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
          <v-btn text @click="resetDeleteInstance()">{{ $t('cancel') }}</v-btn>
          <v-btn
            :disabled="selectedInstances.length === 0"
            style="color: #ffffff"
            color="#FF7754"
            @click="deleteInstance()"
          >
            <v-icon size="14" color="#ffffff" style="margin-right: 5px">
              mdi-cursor-default-click
            </v-icon>
            {{ $t('deleteSelectProcessInstance') }}（{{ selectedInstances.length }}）
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
  name: "InstanceDelete",
  components: {},
  props: {
    definitionId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      utils: utils,
      deleteDialog: {
        display: false,
        deleteReason: "",
        skipCustomListeners: true,
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
    };
  },
  watch: {},
  computed: {
    selectedInstances() {
      return this.deleteDialog.instances.filter(
        (instance) => instance.selected
      );
    },
  },

  mounted() {},
  methods: {
    changeSuspended() {
      if (this.deleteDialog.filter.suspended) {
        this.deleteDialog.filter.active = false;
      }
      this.getInstances();
    },
    changeActive() {
      if (this.deleteDialog.filter.active) {
        this.deleteDialog.filter.suspended = false;
      }
      this.getInstances();
    },

    async getInstances() {
      var instances;
      var param = {
        processDefinitionId: this.definitionId,
      };

      if(this.type === "history"){
        param.finished = true;
      }

      if (this.deleteDialog.filter.withIncidents) {
        param.withIncidents = true;
      }
      if (this.deleteDialog.filter.active) {
        param.active = true;
      }
      if (this.deleteDialog.filter.suspended) {
        param.suspended = true;
      }

      if (this.deleteDialog.filter.businessKey) {
        param.processInstanceBusinessKeyLike =
          "%" + this.deleteDialog.filter.businessKey + "%";
      }

      var formattedDate;
      if (this.deleteDialog.filter.startedBefore) {
        formattedDate =
          utils.formatDateTime(
            this.deleteDialog.filter.startedBefore,
            "yyyy-MM-DDTHH:mm:ss.SSS"
          ) +
          utils
            .formatDateTime(this.deleteDialog.filter.startedBefore, "Z")
            .replace(":", "");
        param.startedBefore = formattedDate;
      }
      if (this.deleteDialog.filter.startedAfter) {
        formattedDate =
          utils.formatDateTime(
            this.deleteDialog.filter.startedAfter,
            "yyyy-MM-DDTHH:mm:ss.SSS"
          ) +
          utils
            .formatDateTime(this.deleteDialog.filter.startedAfter, "Z")
            .replace(":", "");
        param.startedAfter = formattedDate;
      }
      if (this.action == "restart") {
        instances = await processRequest.postInstanceList("history", param);
      } else {
        instances = await processRequest.getInstanceList("history", param);
      }
      instances.forEach((instance) => (instance.selected = false));

      this.deleteDialog.instances = instances;
    },
    async start() {
      this.deleteDialog.instances = [];

      this.deleteDialog.display = true;
      this.deleteDialog.deleteReason = "";
      this.deleteDialog.skipCustomListeners = true;
      this.deleteDialog.filter = {
        withIncidents: false,
        active: false,
        suspended: false,
        businessKey: "",
        displayStartedAfter: false,
        startedAfter: "",
        displayStartedBefore: false,
        startedBefore: "",
      };
      await this.getInstances();
    },
    async deleteInstance() {
      var ids = this.selectedInstances.map((instance) => instance.id);
      var data = {
        deleteReason: this.deleteDialog.deleteReason,
      };

      if (this.type === "history") {
        data.historicProcessInstanceIds = ids;
      } else {
        data.skipCustomListeners = this.deleteDialog.skipCustomListeners;
        data.processInstanceIds = ids;
      }

      var result;
      try {
        result = await instanceRequest.deleteProcessInstance(
          this.type === "history" ? this.type : "",
          data
        );
      } catch (error) {
        this.$message({
          message: this.$t("delProcessFailed"),
          type: "error",
          showClose:true
        });
        return;
      }

      this.$message({
        message: this.$t("delProcessSuccessWithIdAndType",{id:result.id,type:result.type}),
        type: "success",
        showClose:true
      });

      this.deleteDialog.display = false;
    },
    resetDeleteInstance() {
      this.deleteDialog.display = false;
    },
    selectionChange(selection) {
      this.deleteDialog.instances.forEach((instance) => {
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
