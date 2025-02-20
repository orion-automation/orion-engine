<template>
  <v-menu
    v-model="priorityMenu.display"
    :position-x="position.x"
    :position-y="position.y"
    absolute
    offset-y>
    <v-list
      style="cursor: pointer; padding: 0px 0px"
      class="menu-list"
      dense
    >
      <v-list-item>
        <v-list-item-title
          @click="onSetPriority(99)"
        >
          <v-icon size="14" color="#0F40F5" style="margin-right: 12px">mdi-ticket</v-icon>
          <span>{{ $t('topCard') }}</span>
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title
          @click="onSetPriority(90)"
        >
          <v-icon size="14" color="#FA4F07" style="margin-right: 12px">mdi-flag</v-icon>
          <span>{{ $t("top") }}</span>
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title
          @click="onSetPriority(60)"
        >
          <v-icon size="14" color="#FA4F07" style="margin-right: 12px">mdi-flag-outline</v-icon>
          <span>{{ $t('medium') }}</span>
        </v-list-item-title>
      </v-list-item>
      <v-list-item

      >
        <v-list-item-title
          @click="onSetPriority(30)"
        >
          <v-icon size="14" color="#0F40F5" style="margin-right: 12px">mdi-flag-outline</v-icon>
          <span>{{ $t('low') }}</span>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import taskRequest from "@/api/task";

export default {
  name: "TaskPrioritySetMenu",
  props: {
    taskId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      priorityMenu: {
        display: false
      },
      position: {
        x: 0,
        y: 0
      }
    };
  },
  methods: {
    show(show, position) {
      this.position = position;
      this.priorityMenu.display = show;
    },
    async onSetPriority(priority) {
      // 设置优先级
      let self = this;
      let task = await taskRequest.getTaskById(self.taskId);
      taskRequest.putUpdateTask(task.id, Object.assign(task, { priority: priority }))
        .then(async () => {
          self.$emit("onSetPrioritySuccess", priority);
        })
        .catch(err => {
          this.$notify.error(this.$t("cardSettingErr"));
        });
    }
  },
};
</script>

<style scoped>

</style>
