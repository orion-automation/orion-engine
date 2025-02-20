<template>
  <v-bottom-sheet
    v-model="moreSheet.display" inset
    :fullscreen="moreSheet.type==='reject'||moreSheet.type==='needRedo'">
    <v-sheet color="white" style="height: 100%">
      <div class="drawer-title">{{ $t("taskDelegate") }}</div>
      <div class="drawer-title-line"></div>
      <template v-if="moreSheet.type==='delegtate'">
        <div class="d-flex flex-column" style="padding: 20px">
          <v-autocomplete
            :label="$t('delegateToUserWithDot')"
            style="margin-bottom: 15px"
            v-model="moreSheet.delegtate.user"
            :items="moreSheet.delegtate.searchUser.items"
            :loading="moreSheet.delegtate.searchUser.loading"
            :search-input.sync="moreSheet.delegtate.searchUser.searchValue"
            hide-no-data
            hide-details
            hide-selected
            small-chips
            dense
            item-text="showName"
            item-value="id"
            :menu-props="{zIndex:'1000 !important'}"
            :placeholder="$t('inputKeyToSearchUser')"
            return-object></v-autocomplete>
          <div style="font-size:14px">{{ $t("delegateType") }}</div>
          <v-radio-group row v-model="moreSheet.delegtate.type" style="margin-top:6px">
            <v-radio :label="$t('normalDelegate')" value="0"></v-radio>
            <v-radio :label="$t('authDelegate')" value="1"></v-radio>
          </v-radio-group>
          <v-textarea v-model="moreSheet.delegtate.comment" :placeholder="$t('descComment')" outlined hide-details />
          <div style="color: #B1ABB6;font-size: 12px">
            {{ $t("delegateTypeInfo") }}
          </div>
          <div class="d-flex flex-row" style="align-items: center">
            <v-spacer />
            <v-btn @click="moreSheet.display=false" text>
              <span style="color: #83829A;font-size: 14px">{{ $t("back") }}</span>
            </v-btn>
            <v-btn @click="onSubmitTaskDelegtate" :loading="moreSheet.commitLoading" text>
              <span style="color: #0F40F5;font-size: 14px">{{ $t("commit") }}</span>
            </v-btn>
          </div>
        </div>
      </template>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
import taskRequest from "@/api/task";
import userRequest from "@/api/user";

export default {
  props: {
    taskId: {
      type: String,
      required: true
    }
  },
  name: "TaskDelegatedDialog",
  data() {
    return {
      moreSheet: {
        display: false,
        type: "delegtate",
        delegtate: {
          type: "0",
          user: null,
          comment: "",
          searchUser: {
            loading: false,
            items: [],
            value: null,
            searchValue: ""
          }
        },
        reject: {
          tasks: [],
          currentTask: {},
          comment: ""
        },
        needRedo: {
          tasks: [],
          currentTask: {},
          comment: "",
          dueDate: null,
          menuDate: false,
          menuTime: false
        },
        commitLoading: false
      }
    };
  },
  methods: {
    show(show) {
      Object.assign(this.moreSheet,
        {
          display: show,
          type: "delegtate",
          delegtate: {
            type: "0",
            user: null,
            comment: "",
            searchUser: {
              loading: false,
              items: [],
              value: null,
              searchValue: ""
            }
          }
        });
    },
    async onSubmitTaskDelegtate() {
      let self = this;
      if (self.moreSheet.type === "delegtate") {
        // 校验
        if (!self.moreSheet.delegtate.user) {
          await self.$notify.error(self.$t("plsSelectDelegateUser"));
          return;
        }
        self.moreSheet.commitLoading = true;
        try {
          // 存变量
          await taskRequest.putLocalTaskVariable(self.taskId, "bpezDelegateType", {
            value: self.moreSheet.delegtate.type, type: "String"
          });
          await taskRequest.putLocalTaskVariable(self.taskId, "bpezDelegateComments", {
            value: self.moreSheet.delegtate.comment, type: "String"
          });
          // 提交
          await taskRequest.postDelegateTask(self.taskId, { userId: self.moreSheet.delegtate.user.id });
          self.$emit("onTaskDelegtateSuccess");
          self.moreSheet.display = false;
          self.moreSheet.commitLoading = false;
        } catch (err) {
          self.moreSheet.commitLoading = false;
          self.$notify.error(self.$t("delegateErrWithMsg", { msg: err }));
        }
      }
    }
  },
  watch: {
    "moreSheet.delegtate.searchUser.searchValue": {
      async handler(val) {
        let self = this;
        if (!val || val.length === 0) {
          return;
        }
        if (self.moreSheet.delegtate.searchUser.loading) return;
        self.moreSheet.delegtate.searchUser.loading = true;

        let users = await userRequest.getEnhancementUsers({
          nameLike: `%${val}%`,
          memberOfTenant: self.$store.getters["user/getTenant"].id
        });
        self.moreSheet.delegtate.searchUser.items = users.map(user => {
          user.showName = `${user.id} | ${user.firstName} ${user.lastName}`;
          return user;
        });
        self.moreSheet.delegtate.searchUser.loading = false;
      }
    }
  }
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
