<template>
  <v-stepper :alt-labels="component['step_label_position']==='bottom'"
             flat tile :width="component.width"
             :vertical="component['orientation']==='vertical'">
    <v-stepper-header v-if="component['orientation']==='horizontal'">
      <template v-for="(item,index) in items">
        <v-stepper-step
          :complete-icon="component['finished_icon']"
          :key="`step-${item.value}`"
          :complete="stepValue-Number(item.value)>=0"
          :color="stepValue-Number(item.value)>=0?component['finished_color']||'#FF7754':component['undo_color']||'#B1ABB6'"
          :step="item.value"
        >
          {{ item.title }}
        </v-stepper-step>
        <v-divider v-if="index!==items.length-1"
                   :key="`step-${item.value}-diver`"/>
      </template>
    </v-stepper-header>
    <template v-else>
      <template v-for="(item) in items">
        <v-stepper-step
          :complete-icon="component['finished_icon']"
          :key="`step-${item.value}`"
          :complete="stepValue-Number(item.value)>=0"
          :color="stepValue-Number(item.value)>=0?component['finished_color']||'#FF7754':component['undo_color']||'#B1ABB6'"
          :step="item.value"
        >
          {{ item.title }}
        </v-stepper-step>
        <v-stepper-content :key="`step-${item.value}-content`" :step="item.value"/>
      </template>
    </template>
  </v-stepper>
</template>

<script>

import _ from "lodash";

export default {
  name: "Stepper",
  props: {
    component: {
      type: Object,
      default: () => {
      }
    },
    rootValue: {
      type: Object,
      default: () => {
      }
    },
    instance: null,
  },
  data() {
    return {
      infiniteId: +new Date(),
      items: [],
      stepValue: -1,
    };
  },
  mounted() {
    let self = this;
    self.items = self.component["items"];
    // 排序
    self.items.sort((a, b) => {
      return Number.parseInt(a.value) - Number.parseInt(b.value);
    });
    let index = self.items.findIndex(item => item.link_value == _.get(self.rootValue, self.component["data_key"]));
    if (index != -1) {
      self.stepValue = Number.parseInt(`${self.items[index].value}`);
    }
  },
  methods: {
    get(path, obj, fb = `$\{${path}}`) {
      return path.split(".").reduce((res, key) => {
        return res[key] || fb;
      }, obj);
    },
    parseTpl(template, map, fallback) {
      if (template && template.length > 0) {
        try {
          return template.replace(/\$\{.+?}/g, (match) => {
            const path = match.substr(2, match.length - 3).trim();
            return this.get(path, map, fallback);
          });
        } catch (e) {
          console.log(e);
        }
      }
      return "{}";
    },
    setValue(value) {
      let self = this;
      let index = self.items.findIndex(item => item.link_value == value);
      if (index != -1) {
        self.stepValue = Number.parseInt(`${self.items[index].value}`);
      }
    }
  },
};
</script>

<style scoped>
.infinite-more-container {
  font-size: 12px;
  color: #B1ABB6;
  align-items: center;
  justify-content: center;
}

.infinite-more-container-pre {
  width: 15px;
  height: 1px;
  border: 1px dashed rgba(177, 171, 182, 1);
}

.infinite-more-container-content {
  padding: 10px;
}
</style>
