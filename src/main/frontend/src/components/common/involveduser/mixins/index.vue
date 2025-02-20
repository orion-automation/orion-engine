<template>
  <div />
</template>

<script>
import instanceRequest from "@/api/instance";
import userRequest from "@/api/user";

export default {
  name: "Index",
  props: {
    // 只读，查看模式，不可操作
    readOnly: {
      type: Boolean,
      default: true
    },
    offLine: {
      type: Boolean,
      default: true
    },
    resourceId: {
      type: String
    }
  },
  data() {
    return {
      addInvolvedUserDialog: {
        display: false,
        commitLoading: false,
        searchUser: {
          loading: false,
          items: [],
          value: null,
          searchValue: ""
        },
        involvedUsers: []
      }
    };
  },
  methods: {
    show(show) {
      this.addInvolvedUserDialog.display = show;
    },
    getInvolvedUsers() {
      let self = this;
      return self.addInvolvedUserDialog.involvedUsers || [];
    },
    // 设置已选协同人
    setInvolvedUsers(involvedUsers) {
      let self = this;
      self.addInvolvedUserDialog.involvedUsers = involvedUsers || [];
    },
    async onClickDelInvolvedUserSubmit(index, item) {
      let self = this;
      try {
        if (!self.offLine) {
          await instanceRequest.addVariable(self.resourceId, "eoaiInvolvedUser", {
            value: `${self.addInvolvedUserDialog.involvedUsers.filter(user => user.id !== item.id).map(user => user.id).join(",")}`,
            type: "String"
          });
        }
        self.$delete(self.addInvolvedUserDialog.involvedUsers, index);
        self.$emit("onInvolvedUsersChange", self.addInvolvedUserDialog.involvedUsers);
        self.$notify.success({ title: self.$t("success"), message: self.$t("deleteSuccess") });
      } catch (err) {
        self.$message.error(`${err.response.status}:${err.response.data.message}`);
      }
    },
    async onClickAddInvolvedUserSubmit() {
      // 提交添加
      let self = this;
      if (self.addInvolvedUserDialog.involvedUsers.findIndex(user => user.id === self.addInvolvedUserDialog.searchUser.value.id) > -1) {
        self.$notify.error(self.$t("userHasAdd"));
        return;
      }
      try {
        self.addInvolvedUserDialog.commitLoading = true;
        if (!self.offLine) {
          await instanceRequest.addVariable(self.resourceId, "eoaiInvolvedUser", {
            value: `${self.addInvolvedUserDialog.searchUser.value.id},${self.addInvolvedUserDialog.involvedUsers.map(user => user.id).join(",")}`,
            type: "String"
          });
        }
        self.addInvolvedUserDialog.involvedUsers.push(self.addInvolvedUserDialog.searchUser.value);
        self.addInvolvedUserDialog.searchUser.value = null;
        self.addInvolvedUserDialog.searchUser.searchValue = null;
        self.$emit("onInvolvedUsersChange", self.addInvolvedUserDialog.involvedUsers);
        self.$notify.success({ title: self.$t("success"), message: self.$t("addErr") });
      } catch (err) {
        self.$message.error(`${err.response.status}:${err.response.data.message}`);
      } finally {
        self.addInvolvedUserDialog.commitLoading = false;
      }
    },
    async refreshUsers() {
      let self = this;
      if (!self.offLine) {
        self.addInvolvedUserDialog.involvedUsers = await instanceRequest.getInvolvedUsersByInstanceId(self.resourceId);
      }
    }
  },
  watch: {
    resourceId: {
      async handler() {
        let self = this;
        await self.refreshUsers();
      }
    },
    "addInvolvedUserDialog.display": {
      handler(val) {
        let self = this;
        self.addInvolvedUserDialog.searchUser.value = null;
        self.addInvolvedUserDialog.searchUser.searchValue = null;
        if (val && !self.offLine) {
          self.refreshUsers();
        }
      }
    },
    "addInvolvedUserDialog.searchUser.searchValue": {
      async handler(val) {
        let self = this;
        if (!val || val.length === 0) {
          return;
        }
        if (self.addInvolvedUserDialog.searchUser.loading) return;
        self.addInvolvedUserDialog.searchUser.loading = true;

        let users = await userRequest.getEnhancementUsers(
          { nameLike: `%${val}%`, memberOfTenant: self.$store.getters["user/getTenant"].id });
        self.addInvolvedUserDialog.searchUser.items = users.map(user => {
          user.showName = `${user.id} | ${user.firstName} ${user.lastName}`;
          return user;
        });
        self.addInvolvedUserDialog.searchUser.loading = false;
      }
    }
  }
};
</script>

<style scoped>

</style>
