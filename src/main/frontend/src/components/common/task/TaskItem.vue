<template>
  <v-list-item
    @click="onItemClick(task)"
    :style="selected?{backgroundColor: '#f3f4f9'}:{}"
    style="
              padding-top: 0em;
              padding-bottom: 0em;
              border-bottom: 1px solid rgb(230, 228, 230);
              cursor: pointer;
            "
  >
    <div
      style="position: absolute; left: 0em; width: 4px; height: 100%"
      :style="'background-' + judgePriority(task.priority).color"
    ></div>
    <v-list-item-content>
      <div style="display: flex">
        <div style="flex: 10">
          <v-list-item-title
            style="font-weight: bold; font-size: 14px; color: #312651"
          >
            {{ task.name || $t('noTaskName') }}
          </v-list-item-title>
        </div>
        <div style="flex: 2; text-align: right">
          <v-icon
            color="#101010"
            size="16"
            v-show="task.assignee !== userId"
          >mdi-account-arrow-right
          </v-icon
          >
        </div>
      </div>
      <div style="display: flex" v-if="isSubTask(task)">
        <div
          class="d-flex flex-row"
          style="align-items: center; justify-items: center"
        >
          <v-icon
            x-small
            color="orange darken-2"
            style="max-height: 5px"
          >mdi-subdirectory-arrow-right
          </v-icon
          >
          <v-list-item-subtitle style="font-size: 14px; color: #B1ABB6;margin-top:2px"
          >{{ task.name.split("重处理")[0] }}
          </v-list-item-subtitle>
        </div>
      </div>
      <div style="display: flex">
        <div style="flex: 6">
          <v-list-item-subtitle style="font-size: 14px; color: #B1ABB6;margin-top:2px"
          >{{ task.businessKey || $t('noTopic') }}
          </v-list-item-subtitle>
        </div>
      </div>
      <div style="display: flex; margin-top: 6px" class="d-flex flex-column">
        <v-list-item-subtitle
          style="color: #83829a;font-size: 14px">
          <div class="d-flex flex-row" style="align-items: center;gap: 6px">
            <v-icon color="#FF7754" size="14">
              mdi-plus
            </v-icon>
            {{ task.created || task.startTime != null ? utils.formatDateTime(task.created || task.startTime, "YYYY-MM-DD HH:mm") : "--:--"
            }}
          </div>
        </v-list-item-subtitle>
        <v-list-item-subtitle
          style="color: #83829a;font-size: 14px"
          :style="task.due && new Date(task.due) <= new Date()?{color:'#FF7754'}:{}">
          <div class="d-flex flex-row" style="align-items: center;gap: 6px">
            <v-icon v-if="!task.due" color="#83829a" size="14">
              mdi-alarm-off
            </v-icon>
            <v-icon v-else-if="new Date(task.due) <= new Date()" color="#FF7754" size="14">
              mdi-clock-alert
            </v-icon>
            <v-icon v-else color="#83829a" size="14">
              mdi-alarm
            </v-icon>
            {{ task.due != null ? utils.formatDateTime(task.due, "YYYY-MM-DD HH:mm") : "--:--" }}
          </div>
        </v-list-item-subtitle>
        <v-list-item-subtitle
          v-if="task.endTime"
          style="color: #83829a;font-size: 14px">
          <div class="d-flex flex-row" style="align-items: center;gap: 6px">
            <v-icon color="#444262" size="14">
              mdi-stop
            </v-icon>
            {{ task.endTime != null ? utils.formatDateTime(task.endTime, "YYYY-MM-DD HH:mm") : "--:--" }}
          </div>
        </v-list-item-subtitle>
      </div>
      <div v-show="task.variables.length">
        <v-row no-gutters>
          <div class="dashed" />
          <v-col
            cols="6"
            v-for="variable in task.variables"
            :key="variable.id"
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
  name: "TaskItem",
  props: {
    task: {
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
      utils,
      userId: this.$store.state.user.profile.id
    };
  },
  methods: {
    isSubTask(task) {
      return task.parentTaskId && !task.processInstanceId;
    },
    judgePriority(priority) {
      if (priority === 99) {
        return { text: this.$t("topCard"), color: "color: #673ab7" };
      } else if (priority > 60) {
        return { text: this.$t("top"), color: "color: #e91e63" };
      } else if (priority > 30) {
        return { text: this.$t("medium"), color: "color: #ff9800" };
      } else {
        return { text: this.$t("low"), color: "color: #009688" };
      }
    },
    onItemClick(item) {
      this.$emit("onItemClick", item);
    }
  }
};
</script>

<style scoped>

.v-list--dense.menu-list .v-list-item {
  height: 50px;
}

.v-list--dense.menu-list .v-list-item:not(:last-child) {
  border-bottom: 1px solid #e6e4e6;
}

.v-list--dense.menu-list .v-list-item .v-list-item__title {
  color: #444262;
  font-size: 14px;
}

.v-list--dense.menu-list .v-list-item .v-list-item__title .v-icon {
  margin-right: 5px;
}

.v-list--dense.menu-list .v-list-item .v-list-item__title.current {
  font-weight: bold;
}

.dashed {
  border-bottom: 1px #bbbbbb dashed;
  margin: 14px 0;
}

.subtitle {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
