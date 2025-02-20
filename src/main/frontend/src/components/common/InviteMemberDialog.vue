<template>
  <v-dialog v-model="inviteMemberDialog.display" max-width="700">
    <v-card>
      <v-card-title class="headline" style="color: #444262">{{ $t('inviteMember') }}</v-card-title>

      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-row style="margin: 10px 0 20px 0">
            <v-col style="padding: 0 20px 0 0" cols="9">
              <v-autocomplete
                  v-model="member.name"
                  :menu-props="{ zIndex: 1000 }"
                  :items="member.nameItems"
                  :loading="member.nameSearchLoading"
                  :search-input.sync="member.nameSearchStr"
                  autofocus
                  small-chips
                  item-text="showName"
                  item-value="id"
                  dense
                  deletable-chips
                  outlined
                  :placeholder="$t('searchAndAddUser')"
                  hide-details
                  hide-no-data
              />
            </v-col>
            <v-col style="padding: 0" cols="3">
              <v-select
                  hide-details
                  :items="roles"
                  item-value="id"
                  item-text="name"
                  v-model="member.role"
                  :placeholder="$t('role')"
                  dense
                  outlined
              />
            </v-col>
          </v-row>

          <v-row style="margin: 0">
            <v-col style="padding: 0" cols="12">
              <v-textarea rows="3" outlined :placeholder="$t('inviteInfo')" hide-details/>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions style="padding-bottom: 16px">
        <v-spacer/>
        <v-btn text @click="inviteMemberDialog.display = false">{{ $t('cancel') }}</v-btn>
        <v-btn style="color: #ffffff" color="#FF7754" @click="createMember()">
          <v-icon size="16" color="#ffffff" style="margin-right: 6px">
            mdi-content-save
          </v-icon>
          {{ $t('save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

import userRequest from "@/api/user";
import camundaRequest from "@/api/camunda-service";

export default {
  name: "InviteMemberDialog",
  props: {
    projectId: {
      type: String,
      required: true,
    },
    members: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      inviteMemberDialog: {
        display: false,
      },
      member: {
        id: "",
        role: "",
        name: "",
        nameSearchStr: "",
        nameItems: [],
        nameSearchLoading: false,
      },
      roles: [
        {id: 1, name: this.$t("roleTypeOwner")},
        {id: 2, name: this.$t("roleTypeAdmin")},
        {id: 3, name: this.$t("roleTypeEditor")},
        {id: 4, name: this.$t("roleTypeCommentator")},
      ],
    };
  },
  methods: {
    start() {
      this.inviteMemberDialog.display = true;
    },
    async createMember() {
      if (!this.member.name || !this.member.role) {
        this.$message({
          message: this.$t("inputInfoMiss"),
          type: "error",
          showClose:true
        });
        return;
      }
      if (this.members.find((item) => item.name === this.member.name)) {
        this.$message({
          message: this.$t("memberHasJoin"),
          type: "error",
          showClose:true
        });
        return;
      }
      let data = {
        userId: this.member.name,
        name: this.member.name,
        role: this.member.role,
        projectId: this.projectId,
      };
      await camundaRequest.saveMember(data);
      this.$message({
        message: `${this.$t("inviteMember")}${this.member.name}${this.$t("success")}`,
        type: "success",
        showClose:true
      });
      this.$emit("onCreateMember");
      this.inviteMemberDialog.display = false;
    },
  },
  watch: {
    "member.nameSearchStr": {
      async handler(val) {
        let self = this;
        if (!val || val.length === 0) {
          return;
        }

        // Items have already been requested
        if (self.member.nameSearchLoading) return;

        self.member.nameSearchLoading = true;
        let users = await userRequest.getEnhancementUsers({
          nameLike: `%${val}%`,
        });
        users.forEach(item => {
          item.showName = `${item.id} | ${item.firstName} ${item.lastName}`;
        });
        self.member.nameItems = users;
        self.member.nameSearchLoading = false;
      },
    },
    "inviteMemberDialog.display": {
      handler(val) {
        if (val) {
          this.member.id = "";
          this.member.role = "";
          this.member.name = null;
          this.member.nameSearchStr = "";
          this.member.nameSearchLoading = false;
        }
      }
    },
    "$i18n.locale": {
      handler(val) {
        let self = this;
        self.roles[0].name=self.$t("roleTypeOwner");
        self.roles[1].name=self.$t("roleTypeAdmin");
        self.roles[2].name=self.$t("roleTypeEditor");
        self.roles[1].name=self.$t("roleTypeCommentator");
      }
    }
  },
};
</script>

<style scoped>

</style>
