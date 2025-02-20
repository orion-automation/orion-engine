<template>
  <v-bottom-sheet v-model="display" inset>
    <v-sheet>
      <div class="drawer-title">{{ $t('selectAuthObj') }}</div>
      <div class="drawer-title-line"></div>
      <v-list three-line style="padding: 0; border-radius: 6px">
        <v-list-item
          :class="{ current: delegate.id === item.id }"
          v-for="item in delegates"
          @click="select(item)"
          :key="item.id"
          style="
            padding-top: 0em;
            padding-bottom: 0em;
            border-bottom: 1px solid rgb(230, 228, 230);
            cursor: pointer;
          "
        >
          <v-list-item-content>
            <v-list-item-title
              style="font-weight: bold; font-size: 14px; color: #312651"
            >
              {{ item.delegateName }}
            </v-list-item-title>

            <div style="display: flex; align-items: center">
              <div style="flex: 10">
                <v-list-item-subtitle
                  style="font-size: 14px; color: #83829a; margin-top: 2px"
                >
                  <v-icon size="14" style="margin-right: 5px">mdi-key</v-icon>
                  {{ item.displayGroups.map((group) => group.name).join(", ") }}
                </v-list-item-subtitle>
              </div>
              <div style="flex: 2; text-align: right">
                <span class="badge">{{ item.displayGroups.length }}</span>
              </div>
            </div>

            <div style="display: flex; margin-top: 6px">
              <div style="flex: 6">
                <v-list-item-subtitle
                  style="font-size: 14px; color: #83829a; margin-top: 2px"
                >
                  <v-icon size="14" style="margin-right: 5px"
                    >mdi-calendar-expand-horizontal-outline</v-icon
                  >
                  {{
                    utils.formatDateTime(item.startDateTime, "YYYY-MM-DD HH:mm")
                  }}
                  {{ $t('to') }}
                  {{
                    utils.formatDateTime(item.endDateTime, "YYYY-MM-DD HH:mm")
                  }}
                </v-list-item-subtitle>
              </div>
            </div>
            <div style="display: flex; margin-top: 10px">
              <div style="flex: 6">
                <v-list-item-subtitle
                  style="font-size: 14px; color: #83829a; margin-top: 2px"
                >
                  <v-icon size="14" style="margin-right: 5px"
                    >mdi-account-arrow-right</v-icon
                  >
                  {{ item.ownerUserName }}
                </v-list-item-subtitle>
              </div>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
import moment from "moment";

import userRequest from "@/api/user";
import utils from "@/utils/utils";
import groupRequest from "@/api/group";
export default {
  props: {
    delegates: {
      type: Array,
      required: true,
    },
    delegate: {
      type: Object,
      required: true,
    },
  },
  name: "DelegateSelect",
  data() {
    return {
      utils,
      display: false,
    };
  },
  methods: {
    show() {
      this.display = true;
    },
    hide() {
      this.display = false;
    },
    select(item) {
      this.$emit("select", item);
      this.hide();
    },
  },
};
</script>

<style scoped>
.drawer-icon {
  cursor: pointer;
  color: #83829a;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.drawer-title {
  text-align: center;
  padding: 10px 0 7px 0;
  color: #ff7754;
  font-size: 14px;
}

.drawer-title-line {
  width: 34px;
  height: 3px;
  background-color: #e6e4e6;
  margin: auto;
}

.v-list-item.current {
  background-color: #f3f4f9;
}
.v-list-item.current i.mdi-key {
  color: #ff7754;
}

.v-list-item.current i.mdi-account-arrow-right {
  color: #0f40f5;
}
.v-list-item.current i.mdi-calendar-expand-horizontal-outline {
  color: #ff7754;
}
</style>
