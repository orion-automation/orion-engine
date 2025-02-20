<template>
  <div class="d-flex flex-column" style="width: 100%;height: 100%;border-top: 1px solid rgb(187, 187, 187)">
    <div class="d-flex flex-row"
         style="width: 100%;padding: 10px 15px;font-size: 13px;color: #312651;align-items: center;justify-items: center">
      <v-breadcrumbs :items="breadcrumbs" style="background-color: #e8eff7;padding: 0;border: none" divider="|"/>
    </div>
    <div class="d-flex flex-row" style="width: 100%;height: 0;flex: 1">
      <v-navigation-drawer v-model="drawerOpen" :width="drawerOpen?256:0" mobile-breakpoint="0">
        <div class="d-flex flex-row custom-drawer-item"
             style="border-bottom: none"
             :class="tabSelect==='tenant'?'custom-drawer-item-selected':''"
             @click="tabSelect='tenant'">
          <v-icon class="custom-drawer-item-icon" size="18" color="#444262">mdi-cube-scan</v-icon>
          {{ $t('tenant') }}
          <v-spacer/>
        </div>
        <div class="d-flex flex-row custom-drawer-item"
             style="border-bottom: none"
             :class="tabSelect==='group'?'custom-drawer-item-selected':''"
             @click="onGroupTabClick">
          <v-icon class="custom-drawer-item-icon" size="18" color="#444262">mdi-select-group</v-icon>
          {{ $t('group') }}
          <v-spacer/>
          <v-chip color="#E6E4E6" x-small>{{ currentItem.groupCount }}</v-chip>
        </div>
        <div class="d-flex flex-row custom-drawer-item"
             @click="onUserTabClick"
             :class="tabSelect==='user'?'custom-drawer-item-selected':''">
          <v-icon class="custom-drawer-item-icon" size="18" color="#444262">mdi-account-group-outline</v-icon>
          {{ $t('user') }}
          <v-spacer/>
          <v-chip color="#E6E4E6" x-small>{{ currentItem.userCount }}</v-chip>
        </div>
      </v-navigation-drawer>
      <div
          class="d-flex flex-column" style="width: 0;flex: 1;height: 100%;background-color: white"
          ref="resizeLayoutBottom"
      >
        <template v-if="tabSelect==='tenant'">
          <div class="d-flex flex-row custom-drawer-item"
               style="padding-top: 0;padding-bottom: 0;padding-right: 0;height: 43px">
            <div>{{ $t('tenantSetting') }}</div>
            <v-spacer/>
            <div style="width: 0.5px;height: 100%;background-color: rgb(187, 187, 187)"></div>
            <v-menu offset-y bottom left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn text
                       v-bind="attrs"
                       style="border-right: none"
                       v-on="on">
                  <v-icon left size="16" color="#83829A">mdi-delete-alert</v-icon>
                  {{ $t('deleteTenant') }}
                </v-btn>
              </template>
              <v-card dense>
                <v-card-text>
                  {{ $t('confirmDeleteTenantInfo') }}
                </v-card-text>
                <v-card-actions>
                  <v-spacer/>
                  <v-btn text @click="onDeleteTenantClick" :loading="deleteTenantLoading" color="warning">{{ $t('confirm') }}</v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
            <div style="width: 1px;height: 100%;background-color: rgb(187, 187, 187)"></div>
            <v-btn text @click="onSaveTenantClick">
              <v-icon left size="16" color="#83829A">mdi-content-save-all-outline</v-icon>
              {{ $t('save') }}
            </v-btn>
          </div>
          <div class="d-flex flex-row" style="flex-wrap: wrap;row-gap: 20px;column-gap: 20px;padding: 20px">
            <v-text-field v-model="showTenantInfo.name" :label="$t('name')" required/>
          </div>
        </template>
        <template v-if="tabSelect==='user'">
          <div class="d-flex flex-row custom-drawer-item"
               style="padding-top: 0;padding-bottom: 0;padding-right: 0;height: 43px">
            <div>{{ $t('memberUser') }}</div>
            <v-spacer/>
            <div style="width: 1px;height: 100%;background-color: rgb(187, 187, 187)"></div>
            <v-btn text @click="searchUserDialog.display=true" style="border-right: none">
              <v-icon left size="16" color="#83829A">mdi-filter</v-icon>
              {{ $t('filter') }}
            </v-btn>
          </div>
          <el-table
              v-loading="users.loading"
              :data="users.items"
              style="width: auto"
              border
              stripe
              :max-height="tableMaxHeight"
          >
            <el-table-column label="id" prop="id"/>
            <el-table-column :label="$t('tableUser.firstName')" prop="firstName"/>
            <el-table-column :label="$t('tableUser.lastName')" prop="lastName"/>
            <el-table-column :label="$t('tableUser.email')" prop="email"/>
          </el-table>
          <div
              class="text-center mb-2 my-2"
              v-show="users.pageCount > 1"
          >
            <v-pagination
                v-model="users.page"
                :length="users.pageCount"
                total-visible="10"
                color="#FF7754"
            />
          </div>
        </template>
        <template v-if="tabSelect==='group'">
          <div class="d-flex flex-row custom-drawer-item"
               style="padding-top: 0;padding-bottom: 0;padding-right: 0;height: 43px">
            <div>{{ $t('memberOfGroup') }}</div>
            <v-spacer/>
            <div style="width: 1px;height: 100%;background-color: rgb(187, 187, 187)"></div>
            <v-btn text @click="searchGroupDialog.display=true" style="border-right: none">
              <v-icon left size="16" color="#83829A">mdi-filter</v-icon>
              {{ $t('filter') }}
            </v-btn>
          </div>
          <el-table
              v-loading="groups.loading"
              :data="groups.items"
              style="width: auto"
              border
              stripe
              :max-height="tableMaxHeight"
          >
            <el-table-column label="id" prop="id"/>
            <el-table-column :label="$t('name')" prop="name"/>
            <el-table-column label="类型" prop="type"/>
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
        </template>
      </div>
    </div>
    <v-dialog v-model="searchUserDialog.display" width="431">
      <v-card>
        <v-card-title>
          {{ $t('filterUser') }}
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="searchUserDialog.form.id" label="id"/>
          <v-text-field v-model="searchUserDialog.form.firstName" :label="$t('tableUser.firstName')"/>
          <v-text-field v-model="searchUserDialog.form.lastName" :label="$t('tableUser.lastName')"/>
          <v-text-field v-model="searchUserDialog.form.email" :label="$t('tableUser.email')"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="resetSearchUserDialog">
            <v-icon left>mdi-redo</v-icon>
            {{ $t('reset') }}
          </v-btn>
          <v-btn text :loading="searchUserDialog.commitLoading" @click="commitUserSearch">
            <v-icon left>mdi-magnify</v-icon>
            {{ $t('searchBtnTxt') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="searchGroupDialog.display" width="431">
      <v-card>
        <v-card-title>
          {{ $t('filterGroup') }}
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="searchGroupDialog.form.id" label="id"/>
          <v-text-field v-model="searchGroupDialog.form.name" :label="$t('name')"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="resetSearchGroupDialog">
            <v-icon left>mdi-redo</v-icon>
            {{ $t('reset') }}
          </v-btn>
          <v-btn text :loading="searchGroupDialog.commitLoading" @click="commitGroupSearch">
            <v-icon left>mdi-magnify</v-icon>
            {{ $t('searchBtnTxt') }}
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
  name: "TenantDetail",
  computed: {
    dialogTableMaxHeight() {
      let self = this;
      let showHeight = window.innerHeight * 0.9 - 70 - 58 - 52;
      switch (self.tabSelect) {
        case "user":
          if (self.addUserDialog.pageCount > 1) {
            showHeight = showHeight - 44;
          }
          break;
        case "tenant":
          if (self.addTenantDialog.pageCount > 1) {
            showHeight = showHeight - 44;
          }
          break;
      }
      return showHeight;
    }
  },
  mounted() {
    this.getData();
  },
  data() {
    return {
      breadcrumbs: [
        {
          text: this.$t("tenant"),
          href: "#/admin/tenant/list",
        },
        {
          text: "",
          disabled: true,
        }
      ],
      currentItem: {
        name: "--",
        userCount: 0,
        groupCount: 0,
      },
      showTenantInfo: {
        name: "",
        commitLoading: false,
      },
      deleteTenantLoading: false,
      tableMaxHeight: "10",
      drawerOpen: true,
      searchUserDialog: {
        display: false,
        commitLoading: false,
        form: {
          id: "",
          firstName: "",
          lastName: "",
          email: "",
        }
      },
      userFilter: {},
      searchGroupDialog: {
        display: false,
        commitLoading: false,
        form: {
          name: "",
        }
      },
      groupFilter: {},
      tabSelect: "tenant",
      users: {
        page: 0,
        pageCount: 0,
        itemsPerPage: 50,
        totalCount: 0,
        sortBy: "id",
        sortOrder: "asc",
        loading: true,
        items: [],
        selection: [],
      },
      groups: {
        page: 0,
        pageCount: 0,
        itemsPerPage: 50,
        totalCount: 0,
        sortBy: "groupId",
        sortOrder: "asc",
        loading: true,
        items: [],
        selection: [],
      },
    };
  },
  methods: {
    setTableHeight() {
      let self = this;
      let height = self.$refs.resizeLayoutBottom.offsetHeight;
      let paginationHeight = 59.59;
      // 46为顶部操作按钮的高度
      height = height - 46;
      switch (self.tabSelect) {
        case "group":
          if (self.groups.pageCount > 1) {
            height = height - paginationHeight;
          }
          break;
        case "user":
          if (self.users.pageCount > 1) {
            height = height - paginationHeight;
          }
          break;
      }
      this.$nextTick(() => {
        this.tableMaxHeight = height;
      });
    },
    resetSearchUserDialog() {
      let self = this;
      self.searchUserDialog.form = {
        id: "",
        firstName: "",
        lastName: "",
        email: "",
      };
    },
    resetSearchGroupDialog() {
      let self = this;
      self.searchGroupDialog.form = {
        id:"",
        name: "",
        type: "",
      };
    },
    async getUsers() {
      let self = this;
      self.users.loading = true;
      self.users.totalCount = 0;
      self.users.page = 0;
      let response = await userRequest.getUserCount(Object.assign({memberOfTenant: self.currentItem.id}, self.userFilter));
      self.users.totalCount = response.count;
      self.currentItem.userCount = response.count;
      ;
      self.users.pageCount =
          Math.floor((response.count - 1) / self.users.itemsPerPage) + 1;
      self.users.page = 1;
    },
    async getUsersPage() {
      let self = this;
      self.users.selection = [];
      self.users.loading = true;
      if (!self.users.page) {
        self.users.items = [];
        return;
      }
      let params = {
        firstResult: (self.users.page - 1) * this.users.itemsPerPage,
        maxResults: self.users.itemsPerPage,
        memberOfTenant: self.currentItem.id
      };
      let users = await userRequest.getUsers(Object.assign(params, self.userFilter));
      self.users.items = users;
      self.users.loading = false;
    },
    async commitUserSearch() {
      let self = this;
      self.userFilter = {};
      if (self.searchUserDialog.form.firstName) {
        self.userFilter["firstNameLike"] = `%${self.searchUserDialog.form.firstName}%`;
      }
      if (self.searchUserDialog.form.lastName) {
        self.userFilter["lastNameLike"] = `%${self.searchUserDialog.form.lastName}%`;
      }
      if (self.searchUserDialog.form.email) {
        self.userFilter["emailLike"] = `%${self.searchUserDialog.form.email}%`;
      }
      if (self.searchUserDialog.form.id) {
        self.userFilter["id"] = self.searchUserDialog.form.id;
      }
      self.searchUserDialog.commitLoading = true;
      await self.getUsers();
      self.searchUserDialog.commitLoading = false;
      self.searchUserDialog.display = false;
    },
    async getGroups() {
      let self = this;
      self.groups.loading = true;
      self.groups.totalCount = 0;
      self.groups.page = 0;
      let response = await groupRequest.getGroupCount(Object.assign({memberOfTenant: self.currentItem.id}, self.groupFilter));
      self.groups.totalCount = response.count;
      self.currentItem.tenantCount = response.count;
      self.groups.pageCount =
          Math.floor((response.count - 1) / self.groups.itemsPerPage) + 1;
      self.groups.page = 1;
    },
    async getGroupsPage() {
      let self = this;
      self.groups.selection = [];
      self.groups.loading = true;
      if (!self.groups.page) {
        self.groups.items = [];
        return;
      }
      let params = {
        firstResult: (self.groups.page - 1) * this.groups.itemsPerPage,
        maxResults: self.groups.itemsPerPage,
        memberOfTenant: self.currentItem.id
      };
      let users = await groupRequest.getGroupList(Object.assign(params, self.groupFilter));
      self.groups.items = users;
      self.groups.loading = false;
    },
    async commitGroupSearch() {
      let self = this;
      self.groupFilter = {};
      if (self.searchGroupDialog.form.name) {
        self.groupFilter["nameLike"] = `%${self.searchGroupDialog.form.name}%`;
      }
      if (self.searchGroupDialog.form.id) {
        self.groupFilter["id"] = self.searchGroupDialog.form.id;
      }
      self.searchGroupDialog.commitLoading = true;
      await self.getGroups();
      self.searchGroupDialog.commitLoading = false;
      self.searchGroupDialog.display = false;
    },
    async getData() {
      let self = this;
      let row = await tenantRequest.getTenant(this.$route.params.id);
      let userCount = await userRequest.getUserCount({memberOfTenant: row.id});
      userCount = userCount.count;
      let groupCount = await groupRequest.getGroupCount({memberOfTenant: row.id});
      groupCount = groupCount.count;
      self.currentItem = Object.assign(row, {
        userCount: userCount, groupCount
      });
      self.breadcrumbs[1].text=`${self.currentItem.id} ${self.currentItem.name??""}`;
      self.showTenantInfo = {
        name: self.currentItem.name,
      };
    },
    async onDeleteTenantClick() {
      let self = this;
      self.deleteTenantLoading = true;
      try {
        await tenantRequest.DeleteTenant(self.currentItem.id);
        self.$notify.success(self.$t("deleteSuccess"));
        self.$router.back();
      } catch (e) {
        self.$notify.error(self.$t("deleteError"));
      } finally {
        self.deleteTenantLoading = false;
      }
    },
    async onSaveTenantClick() {
      let self = this;
      self.showTenantInfo.commitLoading = true;
      try {
        await tenantRequest.putUpdateTenant(self.currentItem.id, {
          id: self.currentItem.id,
          name: self.showTenantInfo.name,
        });
        self.$notify.success(self.$t("saveSuccess"));
        self.currentItem.name = self.showTenantInfo.name;
      } catch (e) {
        self.$notify.error(self.$t("saveError"));
      } finally {
        self.showTenantInfo.commitLoading = false;
      }
    },
    onUserTabClick() {
      let self = this;
      self.tabSelect = "user";
      self.getUsers();
      self.$nextTick(() => {
        self.setTableHeight();
      });
    },
    onGroupTabClick() {
      let self = this;
      self.tabSelect = "group";
      self.getGroups();
      self.$nextTick(() => {
        self.setTableHeight();
      });
    },
  },
  watch: {
    "$i18n.locale": {
      handler(val){
        this.breadcrumbs[0].text=this.$t("tenant");
      },
    },
    "users.page": {
      handler() {
        this.getUsersPage();
      },
    },
    "users.pageCount": {
      handler() {
        this.setTableHeight();
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
<style scoped>
.custom-drawer-item {
  border-top: 1px solid rgba(177, 171, 182, 1);
  border-bottom: 1px solid rgba(177, 171, 182, 1);
  padding: 10px 15px;
  font-size: 14px;
  color: #83829A;
  align-items: center;
  height: 42.3px;
}

.custom-drawer-item-selected {
  background-color: #F3F4F9;
  font-weight: bold;
  color: #444262;
  height: 42.3px;
}
</style>
