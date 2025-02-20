<template>
  <v-bottom-sheet v-model="display" inset>
    <v-sheet>
      <div class="drawer-title">{{ $t('editAuth') }}</div>
      <div class="drawer-title-line"></div>
      <div class="d-flex flex-column" style="padding: 20px 10px 10px 10px">
        <v-row style="margin: 0">
          <v-col cols="12">
            <v-text-field
              v-model="item.delegateName"
              :placeholder="$t('authNameWithDot')"
              hide-details
              dense
            />
          </v-col>

          <v-col cols="12">
            <v-autocomplete
              :label="$t('authUser')"
              v-model="searchUser.value"
              :items="searchUser.items"
              :loading="searchUser.loading"
              @change="selectUser()"
              :search-input.sync="searchUser.searchValue"
              hide-no-data
              hide-details
              hide-selected
              small-chips
              deletable-chips
              dense
              item-text="fullName"
              :menu-props="{ zIndex: '1000 !important' }"
              :placeholder="$t('searchAndAddAuthUser')"
              return-object
            ></v-autocomplete>
          </v-col>

          <v-col cols="12">
            <v-select
              :label="$t('authGroup')"
              v-model="searchGroup.value"
              :items="searchGroup.items"
              @change="selectGroup()"
              hide-no-data
              hide-details
              hide-selected
              small-chips
              dense
              multiple
              item-text="name"
              deletable-chips
              :menu-props="{ zIndex: '1000 !important' }"
              :placeholder="$t('searchAndAddAuthGroup')"
              return-object
            ></v-select>
          </v-col>

          <v-col cols="6">
            <v-menu
              ref="start"
              v-model="start.displayDate"
              :close-on-content-click="true"
              :nudge-left="90"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  hide-details
                  dense
                  v-model="start.date"
                  :label="$t('validDateFrom')"
                  append-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker
                locale="zh-cn"
                v-model="start.date"
                @input="start.displayDate = false"
              >
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="6">
            <v-menu
              v-model="start.displayTime"
              :close-on-content-click="false"
              :nudge-left="110"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  hide-details
                  dense
                  v-model="start.time"
                  :label="$t('plsSelectDate')"
                  required
                  append-icon="mdi-clock"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-time-picker
                locale="zh-cn"
                format="24hr"
                v-model="start.time"
                @input="start.displayTime = false"
              />
            </v-menu>
          </v-col>
          <v-col cols="6">
            <v-menu
              ref="end"
              v-model="end.displayDate"
              :close-on-content-click="false"
              :nudge-left="90"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  hide-details
                  dense
                  v-model="end.date"
                  :label="$t('validDateTo')"
                  append-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker
                locale="zh-cn"
                v-model="end.date"
                @input="end.displayDate = false"
              >
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="6">
            <v-menu
              v-model="end.displayTime"
              :close-on-content-click="false"
              :nudge-left="110"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  hide-details
                  dense
                  v-model="end.time"
                  :label="$t('plsSelectDate')"
                  required
                  append-icon="mdi-clock"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-time-picker
                locale="zh-cn"
                format="24hr"
                v-model="end.time"
                @input="end.displayTime = false"
              />
            </v-menu>
          </v-col>
        </v-row>

        <div
          class="d-flex flex-row"
          style="margin-top: 30px; align-items: center"
        >
          <v-spacer />
          <v-btn @click="display = false" text>
            <span style="color: #83829a; font-size: 14px">{{ $t('back') }}</span>
          </v-btn>
          <v-btn @click="remove" v-show="item.id" :loading="commitLoading" text>
            <span style="color: #fa4f07; font-size: 14px">{{ $t('delete') }}</span>
          </v-btn>
          <v-btn @click="save" :loading="commitLoading" text>
            <span style="color: #0f40f5; font-size: 14px">{{
              $t(item.id ?'save':'create')
            }}</span>
          </v-btn>
        </div>
      </div>
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
    delegate: {
      type: Object,
      required: true,
    },
  },
  name: "DelegateEdit",
  data() {
    return {
      display: false,
      groups: [],
      item: {},
      searchUser: {
        loading: false,
        items: [],
        value: null,
        searchValue: "",
      },
      searchGroup: {
        loading: false,
        items: [],
        value: null,
        searchValue: "",
      },
      start: {
        displayDate: false,
        date: "",
        displayTime: false,
        time: "",
      },
      end: {
        displayDate: false,
        date: "",
        displayTime: false,
        time: "",
      },
      commitLoading: false,
    };
  },
  async mounted() {
    this.groups = await groupRequest.postGroups(
      {},
      {
        memberOfTenant: this.$store.state.user.tenant,
        member: this.$store.state.user.profile.id,
      }
    );
  },
  methods: {
    show() {
      Object.assign(this.item, this.delegate);
      this.item.tenant = this.$store.state.user.tenant;
      this.item.ownerUserName = `${this.$store.state.user.profile.firstName} ${this.$store.state.user.profile.lastName}`;
      this.item.ownerUserId = this.$store.state.user.profile.id;
      this.commitLoading = false;
      this.searchUser = {
        loading: false,
        items: [],
        value: null,
        searchValue: "",
      };
      this.searchGroup = {
        loading: false,
        items: this.groups,
        value: [],
        searchValue: "",
      };
      this.start = {
        displayDate: false,
        date: "",
        displayTime: false,
        time: "",
      };
      this.end = {
        displayDate: false,
        date: "",
        displayTime: false,
        time: "",
      };
      if (this.item.delegateToUserId) {
        let item = {
          id: this.item.delegateToUserId,
          fullName: this.item.delegateToUserName,
        };
        this.searchUser.value = item;
        this.searchUser.items.push(item);
      }
      if (this.item.groups) {
        let items = this.item.groups.split(",").map((group) => {
          return this.searchGroup.items.find((item) => item.id == group);
        });
        this.searchGroup.value = items;
      }

      if (this.item.startDateTime) {
        this.start.date = moment(this.item.startDateTime).format("YYYY-MM-DD");
        this.start.time = moment(this.item.startDateTime).format("HH:mm");
      }
      if (this.item.endDateTime) {
        this.end.date = moment(this.item.endDateTime).format("YYYY-MM-DD");
        this.end.time = moment(this.item.endDateTime).format("HH:mm");
      }
      this.display = true;
    },
    hide() {
      this.item = {};
      this.display = false;
    },
    selectUser() {
      this.item.delegateToUserId = this.searchUser.value
        ? this.searchUser.value.id
        : "";
      this.item.delegateToUserName = this.searchUser.value
        ? `${this.searchUser.value.firstName} ${this.searchUser.value.lastName}`
        : "";
    },

    selectGroup() {
      this.item.groups = this.searchGroup.value
        .map((group) => group.id)
        .toString();
    },
    setStart() {
      if (this.start.date && this.start.time) {
        let date = utils.formatDateTime(
          `${this.start.date} ${this.start.time}`,
          "x"
        );
        this.item.startDateTime = Number(date);
      } else {
        this.item.startDateTime = null;
      }
    },

    setEnd() {
      if (this.end.date && this.end.time) {
        let date = utils.formatDateTime(
          `${this.end.date} ${this.end.time}`,
          "x"
        );
        this.item.endDateTime = Number(date);
      } else {
        this.item.endDateTime = null;
      }
    },

    save() {
      for (var i in this.item) {
        if (i !== "id" && (!this.item[i] || this.item[i].length === 0)) {
          this.$message({
            message: this.$t("inputNotComplete"),
            type: "error",
            showClose:true
          });
          return;
        }
      }

      if (this.item.startDateTime >= this.item.endDateTime) {
        this.$message({
          message: this.$t("endDateMustAfterStartDate"),
          type: "error",
          showClose:true
        });
        return;
      }
      this.$emit("save", Object.assign({}, this.item));
    },
    remove() {
      this.$emit("remove", this.item.id);
    },
  },
  watch: {
    "searchUser.searchValue": {
      async handler(val) {
        if (!val || val.length === 0) {
          return;
        }
        if (this.searchUser.loading) return;
        this.searchUser.loading = true;

        let users = await userRequest.getEnhancementUsers({
          nameLike: `%${val}%`,
          memberOfTenant: this.item.tenant,
        });
        users.forEach(
          (user) => (user.fullName = `${user.firstName} ${user.lastName}`)
        );
        this.searchUser.items = users;
        this.searchUser.loading = false;
      },
    },
    "start.date": {
      async handler() {
        this.setStart();
      },
    },
    "start.time": {
      async handler() {
        this.setStart();
      },
    },
    "end.date": {
      async handler() {
        this.setEnd();
      },
    },
    "end.time": {
      async handler() {
        this.setEnd();
      },
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

.dashed {
  border-bottom: 1px #bbbbbb dashed;
  margin: 14px 0;
}
</style>
