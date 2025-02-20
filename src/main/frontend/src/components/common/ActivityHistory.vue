<template>
  <div>
    <v-dialog v-model="display" max-width="900">
      <v-card>
        <v-card-title class="headline" style="color: #444262">
          {{ $t('currentActivity') }}:{{ activityId }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <div class="section-title">{{ $t('activityInstance') }}</div>
            <v-radio-group v-model="selectedInstanceId" column>
              <el-table :data="instances">
                <el-table-column :label="$t('select')" width="50">
                  <template slot-scope="props">
                    <v-radio
                      style="margin: auto"
                      :value="props.row.id"
                      label=""
                      color="#FF7754"
                      hide-details
                    />
                  </template>
                </el-table-column>

                <el-table-column prop="id" :label="$t('activityInstanceId')" />
                <el-table-column width="180" :label="$t('startTime')">
                  <template slot-scope="props">
                    {{
                      props.row.startTime
                        ? utils.formatDateTime(props.row.startTime)
                        : "-"
                    }}
                  </template>
                </el-table-column>
                <el-table-column width="180" :label="$t('endTime')">
                  <template slot-scope="props">
                    {{
                      props.row.endTime
                        ? utils.formatDateTime(props.row.endTime)
                        : "-"
                    }}
                  </template>
                </el-table-column>
              </el-table>
            </v-radio-group>

            <div class="section-title">{{ $t('varLogs') }}</div>
            <el-table :data="history">
              <el-table-column prop="variableName" :label="$t('variable')" />
              <el-table-column prop="variableType" width="80" :label="$t('type')" />
              <el-table-column width="180" :label="$t('time')">
                <template slot-scope="props">
                  {{
                    props.row.time ? utils.formatDateTime(props.row.time) : "-"
                  }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('value')">
                <template slot-scope="props">
                  {{ props.row.value }}
                </template>
              </el-table-column>
              <el-table-column width="80" :label="$t('origin')">
                <template slot-scope="props">
                  {{ $t(props.row.initial ?"yes":"no") }}
                </template>
              </el-table-column>
            </el-table>
          </v-form>
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer />
          <v-btn text @click="display = false">{{ $t('cancel') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import instanceRequest from "@/api/instance";
import utils from "@/utils/utils";

export default {
  name: "ActivityHistory",
  components: {},
  props: {
    instanceId: {
      type: String,
      required: true,
    },
    activityId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      utils: utils,
      display: false,
      selectedInstanceId: "",
      instances: [],
      history: [],
    };
  },
  watch: {
    activityId: {
      handler() {
        this.getInstances();
      },
    },
    selectedInstanceId: {
      handler() {
        this.getHistory();
      },
    },
  },
  computed: {},

  mounted() {},
  methods: {
    async getInstances() {
      let data = {
        activityId: this.activityId,
        processInstanceId: this.instanceId,
      };
      var instances = await instanceRequest.getHistoryActivityInstances(data);
      this.instances = instances;
      this.selectedInstanceId = "";
    },

    start() {
      this.display = true;
    },

    async getHistory() {
      if (!this.selectedInstanceId) {
        this.history = [];
        return;
      }
      var history = await instanceRequest.postHistoryDetail({
        activityInstanceId: this.selectedInstanceId,
        variableUpdates: true,
        sorting: [
          {
            sortBy: "time",
            sortOrder: "desc",
          },
        ],
      });
      this.history = history;
    },
  },
};
</script>

<style scoped>
.checkbox-label {
  color: #444262;
}
</style>
