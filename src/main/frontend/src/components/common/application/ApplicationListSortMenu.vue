<template>
  <v-menu bottom offset-y z-index="100">
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

    <v-list
      style="cursor: pointer; padding: 0px 0px"
      class="menu-list"
      dense
    >
      <v-list-item
        @click="setSort('deployTime', 'desc')"
        style="min-height: 36px"
      >
        <v-list-item-title
          :class="{
                  current:
                    currentOrder.sortBy === 'deployTime' &&
                    currentOrder.sortOrder === 'desc',
                }"
        >
          {{ $t('deployTimeDesc') }}
        </v-list-item-title
        >
      </v-list-item>
      <v-list-item
        @click="setSort('deployTime', 'asc')"
        style="min-height: 36px"
      >
        <v-list-item-title
          :class="{
                  current:
                    currentOrder.sortBy === 'deployTime' &&
                    currentOrder.sortOrder === 'asc',
                }"
        >
          {{ $t('deployTimeAsc') }}
        </v-list-item-title
        >
      </v-list-item>

      <v-list-item
        @click="setSort('versionTag', 'desc')"
        style="min-height: 36px"
      >
        <v-list-item-title
          :class="{
                  current:
                    currentOrder.sortBy === 'versionTag' &&
                    currentOrder.sortOrder === 'asc',
                }"
        >
          {{ $t('typeAsc') }}
        </v-list-item-title
        >
      </v-list-item>

      <v-list-item
        @click="setSort('versionTag', 'asc')"
        style="min-height: 36px"
      >
        <v-list-item-title
          :class="{
                  current:
                    currentOrder.sortBy === 'versionTag' &&
                    currentOrder.sortOrder === 'desc',
                }"
        >
          {{ $t('typeDesc') }}
        </v-list-item-title
        >
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: "ApplicationListSortMenu",
  props: {
    currentOrder: {
      type: Object,
      required: true
    }
  },
  methods: {
    setSort(sortBy, sortOrder) {
      this.$emit("onSetSort", {
        sortBy: sortBy,
        sortOrder: sortOrder
      });
    }
  }
};
</script>

<style scoped>
.v-list--dense.menu-list .v-list-item .v-list-item__title.current {
  font-weight: bold;
}
</style>
