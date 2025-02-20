<template>
  <v-stepper v-model="step" height="100" style="overflow-x: auto;box-shadow: none;background-color: #eceff145" tile flat
  v-if="milestones&&milestones.length>0">
    <v-stepper-header
      style="height: 100px;justify-content: flex-start;flex-wrap: nowrap;width: fit-content;box-shadow: none">
      <template v-for="(milestone,index) in milestones">
        <v-stepper-step
          :editable="milestone.status.startTime&&!milestone.status.endTime"
          edit-icon="mdi-play"
          complete-icon="mdi-check"
          style="flex-basis: auto;width: fit-content;min-width: 220px"
          :complete="milestone.status.startTime&&true"
          :color="(milestone.status.startTime&&!milestone.status.endTime)?'#FF7754':(milestone.status.startTime?'#312651':'#B1ABB6')"
          :key="`milestone-${instance.id}-${milestone.activityId}-step`"
          :step="milestone.milestoneSeq"
        >
          <div class="d-flex flex-column" style="gap: 7px;justify-items: left;font-size: 16px;color: #312651">
            <span>{{ milestone.milestoneName || milestone.activityName }}</span>
            <span
              style="font-size: 12px;color: #83829A"
              v-if="milestone.status.startTime">{{ $t('start') }}:{{ utils.formatDateTime(milestone.status.startTime, "YYYY-MM-DD HH:mm")
              }}</span>
            <span
              style="font-size: 12px;color: #83829A"
              v-if="milestone.status.endTime">{{ $t('end') }}:{{ utils.formatDateTime(milestone.status.endTime, "YYYY-MM-DD HH:mm")
              }}</span>
          </div>
        </v-stepper-step>
        <v-divider v-if="index!==milestones.length-1"
                   style="color: #000000;flex: 0;flex-basis: auto;width: 100px;border-color: #000000"
                   :key="`milestone-${instance.id}-${milestone.activityId}-diver`" />
      </template>
    </v-stepper-header>
  </v-stepper>
</template>

<script>
import processRequest from "@/api/process";
import instanceRequest from "@/api/instance";
import utils from "@/utils/utils";

export default {
  name: "InstanceMilestone",
  props: {
    instance: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      utils,
      milestones: [],
      step: null
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      let self = this;
      if (!self.instance.id||!self.instance.processDefinitionId){
        return;
      }
      let milestones = await processRequest.getEnhancementProcessMilestoneByDefId(self.instance.processDefinitionId);
      let statistics = await instanceRequest.getHistoryActivityInstances(
        {
          processInstanceId: self.instance.id,
          sorting: [{ "sortBy": "startTime", "sortOrder": "desc" }]
        }
      );
      milestones.forEach(milestone => {
        let current = statistics.findIndex(item => item.activityId === milestone.activityId);
        if (current !== -1) {
          current = statistics[current];
          milestone.status = {
            startTime: current.startTime,
            endTime: current.endTime
          };
          if (current.startTime && !current.endTime) {
            self.step = milestone.milestoneSeq;
          }
        } else {
          milestone.status = {
            startTime: null,
            endTime: null
          };
        }
      });
      self.milestones = milestones;
      self.$forceUpdate();
    }
  },
  watch: {
    "instance.id": {
      handler(value) {
        this.getData();
      }
    }
  }
};
</script>

<style scoped>

/deep/ .v-stepper__step--editable {
  cursor: none;
}

/deep/ .v-stepper__step--editable:hover {
  background: none;
}
</style>
