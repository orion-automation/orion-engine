<template>
  <v-navigation-drawer
    absolute
    v-model="setting.display"
    :width="editDrawer.width"
    temporary
    :stateless="!!action.lockDrawer"
    right>
    <div class="d-flex flex-column"
         style="height: 100%;padding-top:10px;gap: 10px;background-color: #fafafa;border-top: 1px solid #e6e4e6;">

      <v-app-bar
        class="toolbar"
        dense
        color="#FFFFFF"
        style="border-bottom: 1px solid #b1abb6; z-index: 3;padding: 0"
        absolute
        elevation="2"
      >
        <div class="d-flex flex-row" style="width: 100%;height: 100%">
          <v-btn icon @click="setExpand">
            <v-icon size="18" color="#1976d2">
              {{ editDrawer.expand ? "mdi-arrow-collapse" : "mdi-arrow-expand"
              }}
            </v-icon>
          </v-btn>
          <v-spacer />
          <v-divider vertical />
          <v-btn text
                 style="border-right: none; font-weight:normal; color:#444262"
                 height="48"
                 color="#FA4F07"
                 @click="setting.display = false">
            <v-icon left small
                    color="#444262">
              mdi-window-close
            </v-icon>{{ $t("close") }}</v-btn>
          <v-divider vertical />
          <v-btn
            text
            height="48"
            style="border-right: none; font-weight:normal; color:#444262"
            @click="save()"
            color="#444262"
          >
            <v-icon left small
                    color="#444262">
              mdi-send
            </v-icon>
            {{ $t("commit") }}
          </v-btn>
        </div>
      </v-app-bar>
      <div style="flex: 1;height: 0;overflow-y: auto;padding-left: 15px;padding-right: 15px;">
        <v-main>
          <div class="d-flex flex-column" style="height: 100%">
            <v-banner v-model="topBanner.display" single-line transition="slide-y-transition">
              <div class="d-flex flex-row" style="align-items: center">
                <v-icon left color="#5a928d">mdi-check-circle</v-icon>
                {{ $t(topBanner.multi ? "taskCompleteNextTasks" : "taskCompleteNext") }}
              </div>
              <template v-slot:actions="{ dismiss }">
                <v-btn
                  text
                  color="primary"
                  @click="dismiss"
                >
                  {{ $t("cancel") }}
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="onTaskNextClick"
                >
                  <v-icon>mdi-arrow-right</v-icon>
                  {{ $t("goRightNow") }}
                </v-btn>
              </template>
            </v-banner>
            <div class="formioClass" style="flex: 1;height: 0;overflow-y: auto;padding-left: 15px;padding-right: 15px;">
              <formio
                v-if="formData"
                ref="formioNew"
                :form="formData"
                :options="{ language: 'zh', noAlerts: true }"
                :submission="formValue"
              ></formio>
            </div>
          </div>
        </v-main>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script>
import FormActionCommon from "./mixins";
import taskRequest from "@/api/task";

export default {
  name: "FormActionDrawer",
  mixins: [FormActionCommon],
  data() {
    return {
      editDrawer: {
        width: "500",
        expand: false
      }
    };
  },
  mounted() {
    let self = this;
    // 最小宽度800
    let height = window.outerWidth;
    self.editDrawer.width = self.editDrawer.expand ? height * 0.67 : height * 0.5;
  },
  methods: {
    setExpand() {
      let self = this;
      self.editDrawer.expand = !self.editDrawer.expand;
      let height = window.outerWidth;
      self.editDrawer.width = self.editDrawer.expand ? height * 0.67 : height * 0.5;
    }
  }
};
</script>

<style scoped></style>
