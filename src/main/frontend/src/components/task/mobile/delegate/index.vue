<template>
  <div class="d-flex flex-column" style="height: 100%">
    <div class="criteria">
      <v-text-field
        outlined
        v-model="searchVal"
        :placeholder="$t('inputKeyToSearch')"
        hide-details
        solo
        clearable
        @input="onSearch"
        dense
        style="flex: 0; background-color: white"
      />
    </div>
    <v-list three-line style="padding: 0; border-radius: 6px">
      <v-list-item
        v-for="item in delegateList.items"
        @click="edit(item)"
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
            style="font-weight: bold; font-size: 14px; color: #312651; margin-bottom:6px"
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
                {{ utils.formatDateTime(item.endDateTime, "YYYY-MM-DD HH:mm") }}
              </v-list-item-subtitle>
            </div>
          </div>
          <div style="display: flex; margin-top: 6px">
            <div style="flex: 6">
              <v-list-item-subtitle
                style="font-size: 14px; color: #83829a; margin-top: 2px"
              >
                <v-icon size="14" style="margin-right: 5px"
                  >mdi-account-arrow-right</v-icon
                >
                {{ item.delegateToUserName }}
              </v-list-item-subtitle>
            </div>
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <infinite-loading
      @infinite="getDelegateList"
      :identifier="delegateList.infiniteId"
    >
      <template #no-more>
        <div class="d-flex flex-row infinite-more-container">
          <div class="infinite-more-container-pre" />
          <div class="infinite-more-container-content">{{ $t('noMoreData') }}</div>
          <div class="infinite-more-container-pre" />
        </div>
      </template>
    </infinite-loading>
    <v-btn
      @click="add"
      style="background-color: #0F40F5; width: 50px; height: 50px; bottom: 80px"
      color="#FFFFFF"
      raised
      rounded
      fab
      text
      elevation="6"
      large
      fixed
      right
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <delegate-edit
      ref="delegateEditRef"
      :delegate="delegate"
      @save="save"
      @remove="remove"
    />
    <v-menu
      :position-y="55"
      :position-x="2000"
      absolute
      offset-y
      v-model="displayMenu"
    >
      <v-list style="cursor: pointer; padding: 0px 0px" class="menu-list" dense>
        <v-list-item>
          <v-list-item-title
            :class="{ current: delegateList.status === null }"
            @click="delegateList.status = null"
          >
            <v-icon size="14">mdi-view-list</v-icon>
            <span>{{ $t('all') }}</span>
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title
            :class="{ current: delegateList.status === 1 }"
            @click="delegateList.status = 1"
          >
            <v-icon size="14">mdi-check</v-icon>
            <span>{{ $t('valid') }}</span>
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title
            :class="{ current: delegateList.status === 0 }"
            @click="delegateList.status = 0"
            style="display: flex"
          >
            <v-icon size="14">mdi-close</v-icon>
            <span>{{ $t('hasExp') }}</span>
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title
            :class="{ current: delegateList.sort === 'asc' }"
            @click="delegateList.sort = 'asc'"
            style="display: flex"
          >
            <v-icon size="14">mdi-sort-ascending</v-icon>
            <span>{{ $t('startTimeAsc') }}</span>
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title
            :class="{ current: delegateList.sort === 'desc' }"
            @click="delegateList.sort = 'desc'"
            style="display: flex"
          >
            <v-icon size="14">mdi-sort-descending</v-icon>

            <span>{{ $t('startTimeDesc') }}</span>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import debounce from "lodash/debounce";
import userRequest from "@/api/user";
import camundaRequest from "@/api/camunda-service";
import InfiniteLoading from "vue-infinite-loading";
import utils from "@/utils/utils";
import { myDestroyed } from "@/components/task/mobile/mixins";
import DelegateEdit from "@/components/common/delegate/DelegateEdit";

export default {
  name: "Delegate",
  components: {
    InfiniteLoading,
    DelegateEdit,
  },
  mixins: [myDestroyed],
  data() {
    this.onSearch = debounce(this.refresh, 800);
    return {
      utils,
      displayMenu: false,
      searchVal: "",
      delegateList: {
        status: null,
        sort: "asc",
        items: [],
        infiniteId: +new Date(),
        count: 0,
        pageSize: 10,
      },
      delegate: {},
      defaultDelegate: {
        id: "",
        delegateName: "",
        delegateToUserId: "",
        delegateToUserName: "",
        groups: "",
        startDateTime: null,
        endDateTime: null,
      },
      userId: "",
      groups: [],
    };
  },
  async mounted() {
    await this.$store.dispatch("common/setAppBarIcons", [
      {
        id: "menu",
        icon: "mdi-sort-variant",
      },
    ]);
    await this.$store.dispatch("common/setAppBarTitle", this.$t("authManage"));
    await this.$store.dispatch("common/setNavigations", []);
    this.userId = this.$store.state.user.profile.id;
    let groups = await userRequest.getGroupList({
      member: this.userId,
    });
    this.groups = groups;
    await this.refresh();
  },
  computed: {
    filter() {
      let filter = {
        tenant: this.$store.state.user.tenant,
        //groups: this.groups.map((group) => group.id).toString(),
        delegateNameLike: this.searchVal,
        ownerUserId: this.userId,
        orderBy: "startDateTime",
        sort: this.delegateList.sort,
      };
      if (this.delegateList.status !== null) {
        filter.status = this.delegateList.status;
      }
      return filter;
    },
  },
  methods: {
    async refresh() {
      let { total } = await camundaRequest.getDelegations(this.filter);
      this.delegateList.count = total;

      this.delegateList.items = [];
      this.delegateList.infiniteId += 1;
    },
    async getDelegateList($state) {
      let filter = Object.assign(
        {
          firstResult: this.delegateList.items.length,
          maxResults: this.delegateList.pageSize,
        },
        this.filter
      );
      let { data } = await camundaRequest.getDelegations(filter);
      //idIn
      let ids = [];
      data.forEach((item) => {
        let groupIds = item.groups.split(",");
        groupIds.forEach((groupId) => {
          if (ids.indexOf(groupId) < 0) {
            ids.push(groupId);
          }
        });
      });

      let groups = await userRequest.getGroupList({
        idIn: ids.toString(),
      });

      data.forEach((item) => {
        item.displayGroups = [];
        let groupIds = item.groups.split(",");
        groupIds.forEach((groupId) => {
          let group = groups.find((group) => group.id === groupId);
          item.displayGroups.push(group);
        });
      });

      this.delegateList.items = this.delegateList.items.concat(data);
      $state.loaded();
      if (this.delegateList.items.length >= this.delegateList.count) {
        $state.complete();
      }
    },
    add() {
      Object.assign(this.delegate, this.defaultDelegate);
      this.$refs.delegateEditRef.show();
    },
    edit(item) {
      Object.keys(this.defaultDelegate).forEach((key) => {
        this.delegate[key] = item[key];
      });
      this.$refs.delegateEditRef.show();
    },
    async save(item) {
      let isUpdate = !!item.id;
      if (isUpdate) {
        await camundaRequest.putDelegation(item);
      } else {
        await camundaRequest.postDelegation(item);
      }
      this.$message({
        message: this.$t("authSuccessWithOperate",{operate:this.$t(isUpdate ? "save":"create")}),
        type: "success",
        showClose:true
      });
      await this.refresh();
      this.$refs.delegateEditRef.hide();
    },
    async remove(id) {
      await camundaRequest.deleteDelegation(id);
      await this.refresh();
      this.$message({
        message: this.$t("authDeleteSuccess"),
        type: "success",
        showClose:true
      });
      this.$refs.delegateEditRef.hide();
    },
  },
  watch: {
    "delegateList.sort": {
      async handler() {
        await this.refresh();
      },
    },
    "delegateList.status": {
      async handler() {
        await this.refresh();
      },
    },
    "$store.state.common.currentAppBarIcon": {
      async handler(value) {
        if (value === "menu") {
          this.displayMenu = true;
        }
        await this.$store.dispatch("common/setCurrentAppBarIcon", "");
      },
    },
  },
};
</script>

<style scoped>
.v-text-field--outlined:deep(fieldset) {
  top: 0;
}

.criteria {
  padding: 20px 13px;
  background: linear-gradient(
    90deg,
    rgba(255, 242, 243, 1) 0%,
    rgba(253, 243, 246, 1) 52%,
    rgba(215, 224, 236, 1) 99%
  );
}

.sheet-title {
  color: rgba(68, 66, 98, 1);
  font-size: 18px;
}

.sheet-topic {
  margin: 8px 0 0 0;
  color: rgb(15, 64, 245);
  font-size: 14px;
}

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
</style>
