<template>
  <v-list-item
    @click="onItemClick(application)"
    :style="selected?{backgroundColor: '#f3f4f9'}:{}"
    style="min-height: unset;
              padding-top: 18px;
              padding-bottom: 18px;
              border-bottom: 1px solid rgb(230, 228, 230);
              cursor: pointer;">
    <i
      v-if="application.icon"
      :class="application.icon"
      style="color: #83829a; font-size: 35px; margin-right: 18px"
    ></i>
    <v-icon v-else
            color="#83829a"
            size="35"
            style="margin-left: 4px;margin-right: 22px"
    >mdi-cube</v-icon>

    <v-list-item-content style="padding: 0">
      <div style="display: flex">
        <div style="flex: 10">
          <v-list-item-title
            style="font-weight: bold; font-size: 14px; color: #312651"
          >
            {{ application.name }}
          </v-list-item-title>
        </div>
        <div style="flex: 2; text-align: right">
                  <span v-show="application.count" class="badge">{{
                      application.count
                    }}</span>
        </div>
      </div>
      <div style="display: flex; margin-top: 4px">
        <div style="flex: 6">
          <v-list-item-subtitle style="font-size: 12px; color: #b1abb6"
          >{{ application.description }}
          </v-list-item-subtitle>
        </div>
      </div>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  name: "ApplicationListItem",
  props: {
    application: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      required: false
    }
  },
  methods: {
    onItemClick(item) {
      this.$emit("onItemClick", item);
    }
  }
};
</script>

<style scoped>

</style>
