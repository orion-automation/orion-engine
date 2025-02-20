<template>
  <div class="d-flex flex-row" style="align-items: center">
    <v-menu
      :close-on-content-click="false"
      :nudge-left="80"
      offset-y
      min-width="auto"
    >
      <template #activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on" class="d-flex flex-row" style="align-items: center;gap: 10px;font-size: 14px">
          <v-icon color="#FF7754" size="18">mdi-calendar-today</v-icon>
          {{ $t('toWithDate',{from:rangeDate[0] || "--",to:rangeDate[1] || "--"}) }}
          <v-icon color="#FF7754">mdi-menu-down</v-icon>
        </div>
      </template>
      <v-date-picker
        range
        locale="zh-cn"
        :max="maxDate"
        @change="onDateChange"
        v-model="rangeDate"
      />
    </v-menu>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "ReportDatePicker",
  data() {
    return {
      rangeDate: [],
      maxDate: "",
      dateFormat: "YYYY-MM-DD",
    };
  },
  methods: {
    getParsedTime() {
      let self = this;
      if (self.rangeDate.length === 2) {
        let startTime = moment(self.rangeDate[0]).startOf("day").format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        let endTime = moment(self.rangeDate[1]).endOf("day").format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        return {startTime, endTime};
      } else {
        return {};
      }
    },
    onDateChange() {
      let self = this;
      self.$emit("onDateChange", self.getParsedTime());
    },
  },
  mounted() {
    let self = this;
    let today = new Date();
    self.maxDate = moment(today).format(self.dateFormat);
    // 90天前
    self.rangeDate.push(moment(today).add(-90, "d").startOf("day").format(self.dateFormat));
    self.rangeDate.push(moment(today).format(self.dateFormat));
    self.onDateChange();
  },
};
</script>

<style scoped>

</style>
