<template>
  <div>
    <template v-if="currentElement">
      <div style="padding: 15px">
        <div style="display: flex; flex-direction: row">
          <span
            :class="parseTypeToIcon()"
            style="font-size: 56px"
          />
          <div style="margin: 0 50px 0 50px">
            <v-subheader>{{ $t('name') }}</v-subheader>
            <div style="padding: 0 16px 0 16px">
              {{ currentElement.name }}
            </div>
          </div>
          <div>
            <v-subheader>{{ $t('activityId') }}</v-subheader>
            <div style="padding: 0 16px 0 16px">
              {{ currentElement.id }}
            </div>
          </div>
        </div>
        <v-card outlined style="margin-top: 20px">
          <v-card-text
            v-if="
              currentElement.documentation &&
                currentElement.documentation.length > 0
            "
          >
            {{ currentElement.documentation[0].text }}
          </v-card-text>
          <v-card-text v-else />
        </v-card>
      </div>
    </template>
    <template v-else>
      <div style="padding: 15px;color: #444262;">
        <v-icon color="#FF7754" size="15">
          mdi-cursor-default-click
        </v-icon>&nbsp;
        {{ $t('plsClickElement') }}
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "ElementDocument",
  props:{
    currentElement: {
      type: Object,
    },
  },
  methods:{
    parseTypeToIcon() {
      let icon = this.currentElement.$type
          .replace(/([A-Z])/g, "-$1")
          .replace("bpmn:", "bpmn-icon")
          .toLowerCase();
      if (icon.endsWith("start-event") || icon.endsWith("end-event")) {
        // 添加后缀属性 start/end event
        icon = icon + "-none";
      } else if (icon.endsWith("event")) {
        // 计算后缀 intermediate event
        let eventType = "none";
        icon = `bpmn-icon-intermediate-event-${eventType}`;
      }
      if (icon.endsWith("flow")) {
        // 添加后缀属性
        let flowType = "default";
        icon = `bpmn-icon-${flowType}-flow`;
      }
      if (icon.endsWith("gateway")) {
        // 添加后缀属性
        let gatewayType = icon.split("-")[2];
        if (gatewayType && gatewayType !== "gateway") {
          switch (gatewayType) {
            case "exclusive":
              gatewayType = "xor";
              break;
            case "inclusive":
              gatewayType = "or";
              break;
          }
        } else {
          gatewayType = "none";
        }
        icon = `bpmn-icon-gateway-${gatewayType}`;
      }
      return icon;
    },
  }
};
</script>

<style scoped>

</style>
