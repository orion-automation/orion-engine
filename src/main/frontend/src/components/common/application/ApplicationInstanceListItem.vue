<template>
  <v-list-item
    @click="onItemClick(instance)"
    :style="selected?{backgroundColor: '#f3f4f9'}:{}"
    style="
              padding-top: 0.5em;
              padding-bottom: 0.5em;
              border-bottom: 1px solid #e6e4e6;
              background-image: linear-gradient(
                to bottom,
                #f4f4f4,
                #f7f7f7,
                #f9f9f9,
                #fcfcfc,
                #ffffff
              );
            "
  >
    <v-list-item-content>
      <div style="display: flex">
        <div style="flex: 12">
          <v-list-item-title
            style="
                      font-size: 14px;
                      font-weight: bold;
                      color: RGB(49, 38, 81);
                      line-height: 22px;
                    "
          >
            {{ instance.businessKey || $t('noTopic') }}
          </v-list-item-title>
        </div>
        <div style="flex: 1">
          <v-icon dense v-if="instance.state == 'COMPLETED'" color="#e6e4e6">mdi-stop-circle</v-icon>
          <v-icon dense v-if="instance.state == 'ACTIVE'" color="#e6e4e6">mdi-play-outline</v-icon>
        </div>
      </div>
      <div style="display: flex">
        <div style="flex: 6">
          <v-list-item-subtitle
            style="margin-top: 2px; width: 15em; color: #9e9e9e"
          >
            <div class="subtitle">{{ instance.id }}</div>
          </v-list-item-subtitle>
        </div>
      </div>
      <div style="display: flex; margin-top: 6px" class="flex-column">
          <v-list-item-subtitle
            style="display: flex; color: #83829a; font-size: 14px"
          >
            <v-icon color="#FF7754" size="14" style="margin-right: 6px"
            >mdi-plus
            </v-icon
            >

            <span>
                      {{
                utils.formatDateTime(instance.startTime, "YYYY-MM-DD HH:mm") || "--:--"
              }}</span
            >
          </v-list-item-subtitle>
          <v-list-item-subtitle
            style="display: flex; color: #83829a; font-size: 14px"
            v-if="instance.endTime"
          >
            <v-icon color="#312651" size="14" style="margin-right: 6px"
            >mdi-stop
            </v-icon
            >

            <span>
                      {{
                utils.formatDateTime(instance.endTime, "YYYY-MM-DD HH:mm") || "--:--"
              }}</span
            >
          </v-list-item-subtitle>
      </div>
      <div v-show="instance.variables.length">
        <v-row no-gutters>
          <div class="dashed" />
          <v-col
            cols="6"
            v-for="variable in instance.variables"
            :key="`${instance.id}-${variable.id}`"
          >
            <div style="color: #162b4d; font-size: 14px;margin-bottom: 9px">
              <div
                style="
                          color: #90a4ae;
                          padding-top: 0.5em;
                          padding-bottom: 0.5em;
                        "
              >
                {{ variable.label }}
              </div>
              <span>
                        {{ utils.formatVariable(variable) }}
                      </span>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import utils from "@/utils/utils";

export default {
  name: "ApplicationInstanceListItem",
  props: {
    instance: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      utils
    };
  },
  methods: {
    onItemClick(item) {
      this.$emit("onItemClick", item);
    }
  }
};
</script>

<style scoped>
.subtitle {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.dashed {
  border-bottom: 1px #bbbbbb dashed;
  margin: 14px 0;
}
</style>
