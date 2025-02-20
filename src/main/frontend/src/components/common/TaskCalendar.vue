<template>
  <div>
    <vc-date-picker
      locale="zh-CN"
      color="red"
      is-range
      is-expanded
      title-position="left"
      v-model="range"
      :attributes="attributes"
      :from-page.sync="fromPage"
    />
  </div>
</template>
<script>
import utils from "@/utils/utils";
import moment from "moment";

export default {
  components: {},
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      fromPage: null,
      range: null,
      attributes: [],
      utils: utils,
      month: null
    };
  },
  watch: {
    range: {
      handler(value) {
        this.$emit("setRange", value, this.month);
      }
    },
    fromPage: {
      handler(value) {
        let month = null;
        if (value) {
          month = new Date(value.year, value.month - 1);
        }
        this.month = month;
        this.$emit("setRange", this.range, month);
      }
    },
    items: {
      handler(value) {
        let attributes = value
          .filter((item) => item.due)
          .map((item) => {
            let tomorrow = new moment().startOf("date").add(1, "day").format();
            let due = moment(item.due);
            let isDue = due.isBefore(tomorrow);
            let highlight = "green";
            if (isDue) {
              highlight = "orange";
            }
            if (item.priority > 80) {
              highlight = "purple";
            }
            return {
              key: item.id,
              highlight,
              dates: new Date(item.due)
            };
          });
        this.attributes = attributes;
        this.range = null;
        this.$emit("setRange", this.range, this.month);
      }
    }
  },
  computed: {},

  async mounted() {
  },
  methods: {
    setRange(range) {
      this.range = range;
    }
  }
};
</script>

<style scoped>

</style>
