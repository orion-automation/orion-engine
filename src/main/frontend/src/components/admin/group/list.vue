<template>
  <div class="d-flex flex-column" style="width: 100%;height: 100%;border-top: 1px solid rgb(187, 187, 187)">
    <div class="d-flex flex-row"
         style="width: 100%;padding: 14px 15px;font-size: 13px;color: #312651;align-items: center;justify-items: center">
      <v-breadcrumbs :items="breadcrumbs" style="background-color: #e8eff7;padding: 0;border: none" divider="|"/>
      <v-chip color="#FF7754" x-small class="white--text">{{ groups.totalCount }}</v-chip>
    </div>
    <div class="d-flex flex-row" style="width: 100%;height: 0;flex: 1">
      <v-navigation-drawer v-model="drawerOpen" :width="drawerOpen?256:0" mobile-breakpoint="0">
        <div class="d-flex flex-row custom-drawer-item">
          <v-icon class="custom-drawer-item-icon" size="18" color="#444262">mdi-select-group</v-icon>
          {{ $t('group') }}
        </div>
        <div class="d-flex flex-column" style="padding: 10px 20px">
          <div style="font-weight: bolder;color: #444262;font-size: 14px">
            {{ currentItem.name }}
          </div>
          <div style="color: #444262;font-size: 14px">
            {{ currentItem.type }}
          </div>
        </div>
        <div class="d-flex flex-row custom-drawer-item" :style="currentItem.tenants.length>0?{}:{ borderBottom: 'none'}">
          <v-icon class="custom-drawer-item-icon" size="18" color="#444262">mdi-cube-scan</v-icon>
          {{ $t('tenant') }}
          <v-spacer/>
          <v-chip color="#E6E4E6" x-small>{{ currentItem.tenantCount }}</v-chip>
        </div>
        <div class="d-flex flex-column" style="padding: 10px 20px" v-if="currentItem.tenants.length>0">
          <v-list dense style="padding: 0">
            <v-list-item v-for="group in currentItem.tenants" :key="group.id" style="padding: 0;min-height: 10px">
              <v-list-item-content style="padding: 5px 0">
                <v-list-item-title style="color: #83829A">{{ group.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="currentItem.tenantCount>30" style="padding: 0;min-height: 10px">
              <v-list-item-content style="padding: 5px 0">
                <v-list-item-title style="color: #83829A">{{ $t('moreWithDot') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
        <div class="d-flex flex-row custom-drawer-item">
          <v-icon class="custom-drawer-item-icon" size="18" color="#444262">mdi-account-group-outline</v-icon>
          {{ $t('user') }}
          <v-spacer/>
          <v-chip color="#E6E4E6" x-small>{{ currentItem.userCount }}</v-chip>
        </div>
        <div class="d-flex flex-column" style="padding: 10px 20px" v-if="currentItem.users.length>0">
          <v-list dense style="padding: 0">
            <v-list-item v-for="group in currentItem.users" :key="group.id" style="padding: 0;min-height: 10px">
              <v-list-item-content style="padding: 5px 0">
                <v-list-item-title style="color: #83829A">{{ group.firstName }} {{ group.lastName }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="currentItem.userCount>30" style="padding: 0;min-height: 10px">
              <v-list-item-content style="padding: 5px 0">
                <v-list-item-title style="color: #83829A">{{ $t('moreWithDot') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
      </v-navigation-drawer>
      <div
          class="d-flex flex-column" style="width: 0;flex: 1;height: 100%;background-color: white"
          ref="resizeLayoutBottom"
      >
        <div class="d-flex flex-row custom-drawer-item"
             style="padding-top: 0;padding-bottom: 0;padding-right: 0;height: 43px">
          <v-icon color="#FF7754" @click="drawerOpen=!drawerOpen">mdi-chevron-left</v-icon>
          <v-spacer/>
          <div style="width: 1px;height: 100%;background-color: rgb(187, 187, 187)"></div>
          <v-btn text @click="searchGroupDialog.display=true" style="border-right: none">
            <v-icon left size="16" color="#83829A">mdi-magnify</v-icon>
            {{ $t('searchBtnTxt') }}
          </v-btn>
          <div style="width: 1px;height: 100%;background-color: rgb(187, 187, 187)"></div>
          <v-btn text @click="onAddUserClick" style="border-right: none">
            <v-icon left size="16" color="#83829A">mdi-playlist-plus</v-icon>
            {{ $t('create') }}
          </v-btn>
        </div>
        <el-table
            v-loading="groups.loading"
            :data="groups.items"
            style="width: auto"
            border
            stripe
            :max-height="tableMaxHeight"
            @row-click="onRowClick"
            @sort-change="usersSortChange"
            :default-sort="{prop: groups.sortBy, order: groups.sortOrder === 'desc' ? 'descending' : 'ascending'}"
        >
          <el-table-column label="id" prop="id" sortable="custom">
            <template slot-scope="props">
              <router-link
                  :to="{
                  name: 'group-detail',
                  params: { id: props.row.id },
                  query: {},
                }"
              >
                {{ props.row.id }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column :label="$t('name')" prop="name" sortable="custom"/>
          <el-table-column label="类型" prop="type" sortable="custom"/>
        </el-table>
        <div
            class="text-center mb-2 my-2"
            v-show="groups.pageCount > 1"
        >
          <v-pagination
              v-model="groups.page"
              :length="groups.pageCount"
              total-visible="10"
              color="#FF7754"
          />
        </div>
      </div>
    </div>
    <v-dialog v-model="searchGroupDialog.display" width="431">
      <v-card>
        <v-card-title>
          {{ $t('searchGroup') }}
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="searchGroupDialog.form.id" label="id"/>
          <v-text-field v-model="searchGroupDialog.form.name" :label="$t('groupName')"/>
          <v-text-field v-model="searchGroupDialog.form.type" :label="$t('type')"/>
          <v-text-field v-model="searchGroupDialog.form.member" :label="$t('memberOfUserId')"/>
          <v-text-field v-model="searchGroupDialog.form.memberOfTenant" :label="$t('tenantId')"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="resetSearchDialog">
            <v-icon left>mdi-redo</v-icon>
            {{ $t('reset') }}
          </v-btn>
          <v-btn text :loading="searchGroupDialog.commitLoading" @click="commitSearch">
            <v-icon left>mdi-magnify</v-icon>
            {{ $t('searchBtnTxt') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addGroupDialog.display" width="431">
      <v-card>
        <v-card-title>
          {{ $t('createGroup') }}
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field v-model="addGroupDialog.form.id" label="id" hide-details required/>
            <v-text-field v-model="addGroupDialog.form.name" :label="$t('name')" hide-details required/>
            <v-text-field v-model="addGroupDialog.form.type" :label="$t('type')" hide-details/>
            <v-checkbox v-model="addGroupDialog.form.createCollaborationGroup"
                        @change="onAddGroupRadioChange"
                        :label="$t('createCollaborationGroup')" hide-details style="margin-top: 12px"/>
          </v-form>
          <div
              v-if="addGroupDialog.error.accountInfo.display" class="caption d-flex flex-row"
              style="align-items: center;padding: 15px 0"
          >
            <v-icon left color="#FF7754" x-small>mdi-alert-circle-outline</v-icon>
            {{ addGroupDialog.error.accountInfo.msg }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="resetAddDialog">
            <v-icon left>mdi-redo</v-icon>
            {{ $t('reset') }}
          </v-btn>
          <v-btn text :loading="addGroupDialog.commitLoading" :disabled="!addGroupCommitDisabled"
                 @click="commitAddGroup">
            <v-icon left color="#FF7754">mdi-plus</v-icon>
            {{ $t('create') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import userRequest from "@/api/user";
import groupRequest from "@/api/group";
import tenantRequest from "@/api/tenant";

export default {
  name: "GroupList",
  data() {
    return {
      breadcrumbs: [
        {
          text: this.$t("group"),
          disabled: true,
        },{
          text: "",
        }
      ],
      currentItem: {
        name: "--",
        type: "--",
        users: [],
        userCount: 0,
        tenants: [],
        tenantCount: 0,
      },
      groups: {
        page: 0,
        pageCount: 0,
        itemsPerPage: 50,
        totalCount: 0,
        sortBy: "id",
        sortOrder: "asc",
        loading: true,
        items: [],
      },
      tableMaxHeight: "10",
      drawerOpen: true,
      searchGroupDialog: {
        display: false,
        commitLoading: false,
        form: {
          id: "",
          name: "",
          type: "",
          member: "",
          memberOfTenant: ""
        }
      },
      addGroupDialog: {
        display: false,
        commitLoading: false,
        form: {
          id: "",
          name: "",
          type: "",
          createCollaborationGroup: false
        },
        error: {
          userInfo: {display: false, msg: ""},
          accountInfo: {display: false, msg: ""},
        }
      },
      groupFilter: {}
    };
  },
  computed: {
    addGroupCommitDisabled() {
      let self = this;
      return self.addGroupDialog.form.id && self.addGroupDialog.form.name;
    }
  },
  mounted() {
    this.getGroups();
  },
  methods: {
    onAddGroupRadioChange(){
      let self=this;
      if (self.addGroupDialog.form.createCollaborationGroup){
        self.addGroupDialog.form.type = "dpacoe";
      }
    },
    async commitSearch() {
      let self = this;
      self.groupFilter = {};
      if (self.searchGroupDialog.form.name) {
        self.groupFilter["nameLike"] = `%${self.searchGroupDialog.form.name}%`;
      }
      if (self.searchGroupDialog.form.type) {
        self.groupFilter["type"] = self.searchGroupDialog.form.type;
      }
      if (self.searchGroupDialog.form.id) {
        self.groupFilter["id"] = self.searchGroupDialog.form.id;
      }
      if (self.searchGroupDialog.form.member) {
        self.groupFilter["member"] = self.searchGroupDialog.form.member;
      }
      if (self.searchGroupDialog.form.memberOfTenant) {
        self.groupFilter["memberOfTenant"] = self.searchGroupDialog.form.memberOfTenant;
      }
      self.searchGroupDialog.commitLoading = true;
      await self.getGroups();
      self.searchGroupDialog.commitLoading = false;
      self.searchGroupDialog.display = false;
    },
    async commitAddGroup() {
      let self = this;
      self.addGroupDialog.commitLoading = true;
      if (!self.addGroupDialog.form.id) {
        self.addGroupDialog.error.accountInfo.display = true;
        self.addGroupDialog.error.accountInfo.msg = self.$t("plsInputId");
        return;
      } else if (!self.addGroupDialog.form.name) {
        self.addGroupDialog.error.accountInfo.display = true;
        self.addGroupDialog.error.accountInfo.msg = self.$t("plsInputName");
        return;
      } else {
        self.addGroupDialog.error.accountInfo.display = false;
        self.addGroupDialog.error.accountInfo.msg = "";
      }
      try {
        await groupRequest.postCreateGroup({
          id: self.addGroupDialog.form.id,
          name: self.addGroupDialog.form.name,
          type: self.addGroupDialog.form.type,
        });
        self.addGroupDialog.display = false;
        self.$notify.success(self.$t("createGroupSuccess"));
        self.addGroupDialog.error.accountInfo.display = false;
        await self.getGroupsPage();
      } catch (err) {
        self.addGroupDialog.error.accountInfo.display = true;
        self.addGroupDialog.error.accountInfo.msg = err.response.data.message;
      } finally {
        self.addGroupDialog.commitLoading = false;
      }
    },
    resetSearchDialog() {
      let self = this;
      self.searchGroupDialog.form = {
        id: "",
        name: "",
        type: "",
        member: "",
        memberOfTenant: "",
      };
    },
    resetAddDialog() {
      let self = this;
      self.addGroupDialog.form = {
        name: "",
        type: "",
        id: "",
        createCollaborationGroup: false
      };
      self.addGroupDialog.error.accountInfo.display = false;
      self.addGroupDialog.error.accountInfo.msg = "";
    },
    async getGroups() {
      let self = this;
      self.groups.loading = true;
      self.groups.totalCount = 0;
      self.groups.page = 0;
      let response = await groupRequest.getGroupCount(self.groupFilter);
      self.groups.totalCount = response.count;
      self.groups.pageCount =
          Math.floor((response.count - 1) / self.groups.itemsPerPage) + 1;
      self.groups.page = 1;
    },
    async getGroupsPage() {
      let self = this;
      self.groups.loading = true;
      if (!self.groups.page) {
        self.groups.items = [];
        return;
      }
      let params = {
        firstResult: (self.groups.page - 1) * this.groups.itemsPerPage,
        maxResults: self.groups.itemsPerPage,
        sortBy: self.groups.sortBy,
        sortOrder: self.groups.sortOrder
      };
      let users = await groupRequest.getGroupList(Object.assign(params, self.groupFilter));
      self.groups.items = users;
      if (!self.currentItem.id && users.length > 0) {
        await self.onRowClick(users[0]);
      }
      self.groups.loading = false;
    },
    usersSortChange(value) {
      this.groups.sortBy = value.prop;
      if (value.prop === "id") {
        this.groups.sortBy = "id";
      }
      this.groups.sortOrder = value.order === "descending" ? "desc" : "asc";
      this.getGroupsPage();
    },
    onAddUserClick() {
      let self = this;
      self.resetAddDialog();
      self.addGroupDialog.display = true;
    },
    async onRowClick(row) {
      let self = this;
      let users = await userRequest.getUsers({memberOfGroup: row.id, firstResult: 0, maxResults: 30});
      let tenants = await tenantRequest.getTenantList({groupMember: row.id, firstResult: 0, maxResults: 30});
      let userCount = await userRequest.getUserCount({memberOfGroup: row.id});
      userCount = userCount.count;
      let tenantCount = await tenantRequest.getTenantCount({groupMember: row.id});
      tenantCount = tenantCount.count;
      self.currentItem = Object.assign(row, {
        users, tenants, userCount, tenantCount
      });
    },
    setTableHeight() {
      let self = this;
      let height = self.$refs.resizeLayoutBottom.offsetHeight;
      let paginationHeight = 59.59;
      // 46为顶部操作按钮的高度
      height = height - 46;
      if (self.groups.pageCount > 1) {
        height = height - paginationHeight;
      }
      this.$nextTick(() => {
        this.tableMaxHeight = height;
      });
    },
  },
  watch: {
    "$i18n.locale": {
      handler(val){
        this.breadcrumbs[0].text=this.$t("group");
      },
    },
    "groups.page": {
      handler() {
        this.getGroupsPage();
      },
    },
    "groups.pageCount": {
      handler() {
        this.setTableHeight();
      },
    },
  }
};
</script>
