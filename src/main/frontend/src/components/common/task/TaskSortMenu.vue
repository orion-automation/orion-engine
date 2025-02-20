<template>
  <v-menu bottom offset-y>
    <template #activator="{ on, attrs }">
      <v-icon
        v-bind="attrs"
        v-on="on"
        size="20"
        color="#444262"
        style="flex: 0"
      >
        mdi-sort-variant
      </v-icon>
    </template>

    <v-list style="cursor: pointer; padding: 0px 0px" class="menu-list" dense>
      <v-list-item v-if="!delegateMode">
        <v-list-item-title
          :class="{ current: !quickFilter && tasksActive }"
          @click="setActive(true)"
        >
          <v-icon
            size="14"
            :color="
              mobileMode
                ? !quickFilter && tasksActive
                  ? '#2AD194'
                  : ''
                : tasksActive
                ? '#2AD194'
                : ''
            "
            style="margin-right: 6px"
            >mdi-play-circle</v-icon
          >
          <span>{{ $t('doing') }}</span>
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="!delegateMode">
        <v-list-item-title
          :class="{ current: !quickFilter && !tasksActive }"
          @click="setActive(false)"
          style="display: flex"
        >
          <v-icon
            size="14"
            :color="
              mobileMode
                ? !quickFilter && !tasksActive
                  ? '#2AD194'
                  : ''
                : !tasksActive
                ? '#2AD194'
                : ''
            "
            style="margin-right: 6px"
            >mdi-stop</v-icon
          >
          <span>{{ $t('done') }}</span>
        </v-list-item-title>
      </v-list-item>
      <v-list-item
        @click="
          setSort(tasksActive || quickFilter ? 'created' : 'startTime', 'asc')
        "
        style="min-height: 36px"
      >
        <v-list-item-title
          :class="{
            current: tasksSortOrder === 'asc',
          }"
        >
          <v-icon
            size="14"
            :color="tasksSortOrder === 'asc' ? '#2AD194' : ''"
            style="margin-right: 6px"
            >mdi-sort-ascending</v-icon
          >

          <span>{{ $t('createTimeAsc') }}</span></v-list-item-title
        >
      </v-list-item>
      <v-list-item
        @click="
          setSort(tasksActive || quickFilter ? 'created' : 'startTime', 'desc')
        "
        style="min-height: 36px"
      >
        <v-list-item-title
          :class="{
            current: tasksSortOrder === 'desc',
          }"
        >
          <v-icon
            size="14"
            :color="tasksSortOrder === 'desc' ? '#2AD194' : ''"
            style="margin-right: 6px"
            >mdi-sort-descending</v-icon
          >
          <span>{{ $t('createTimeDesc') }}</span></v-list-item-title
        >
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: "TaskSortMenu",
  props: {
    tasksActive: {
      type: Boolean,
      required: true,
    },
    quickFilter: {
      type: String,
    },
    tasksSortOrder: {
      type: String,
      required: true,
    },
    mobileMode: {
      type: Boolean,
      default: true,
    },
    delegateMode: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    setSort(sortBy, sortOrder) {
      this.$emit("setSort", { sortBy: sortBy, sortOrder: sortOrder });
    },
    setActive(active) {
      this.$emit("setActive", active);
    },
  },
};
</script>

<style scoped></style>
