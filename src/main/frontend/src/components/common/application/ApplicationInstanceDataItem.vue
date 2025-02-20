<template>
  <v-list-item
    @click="onItemClick(item)"
    :style="selected ? { backgroundColor: '#f3f4f9' } : {}"
    style="
      min-height: unset;
      padding-top: 18px;
      padding-bottom: 18px;
      border-bottom: 1px solid rgb(230, 228, 230);
      cursor: pointer;
    "
  >
    <i
      v-if="item.configJson"
      :class="
        'fa-fw ' +
        item.configJson.icon +
        ' ' +
        item.configJson.iconType
      "
      style="color: #ff7754; font-size: 32px; margin-right: 18px"
    ></i>

    <v-list-item-content style="padding: 0">
      <div style="display: flex">
        <div style="flex: 10">
          <v-list-item-title style="font-weight: bold; font-size: 1rem; color: #312651">
            {{ (item.configJson && item.configJson.name) || item.name }}
          </v-list-item-title>
        </div>
      </div>
      <div style="display: flex; margin-top: 4px">
        <div style="flex: 6">
          <v-list-item-subtitle style="font-size: 12px; color: #b1abb6"
            >{{ item.configJson && item.configJson.desc }}
          </v-list-item-subtitle>
        </div>
      </div>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import utils from "@/utils/utils";

export default {
  name: "ApplicationInstanceDataItem",
  props: {
    item: {
      type: Object,
      required: true,
    },
    selected: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      utils,
    };
  },
  methods: {
    onItemClick(item) {
      this.$emit("onItemClick", item);
    },
  },
};
</script>

<style scoped></style>
