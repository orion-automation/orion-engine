<template>
  <div class="d-flex flex-column" style="width: 100%;height: 100%;border-top: 1px solid rgb(187, 187, 187)">
    <div class="d-flex flex-row"
         style="width: 100%;padding: 14px 15px;font-size: 13px;color: #312651;align-items: center;justify-items: center">
      <v-breadcrumbs :items="breadcrumbs" style="background-color: #e8eff7;padding: 0;border: none" divider="|"/>
      <v-chip color="#FF7754" x-small class="white--text">{{ users.totalCount }}</v-chip>
    </div>
    <div class="d-flex flex-row" style="width: 100%;height: 0;flex: 1">
      <v-navigation-drawer v-model="drawerOpen" :width="drawerOpen?256:0" mobile-breakpoint="0">
        <div class="d-flex flex-row custom-drawer-item">
          <v-icon class="custom-drawer-item-icon" size="18" color="#444262">mdi-account-group-outline</v-icon>
          {{ $t('userDetail') }}
        </div>
        <div class="d-flex flex-column" style="padding: 10px 20px">
          <div style="font-weight: bolder;color: #444262;font-size: 14px"
               v-if="currentItem.firstName||currentItem.lastName">
            {{ currentItem.firstName }} {{ currentItem.lastName }}
          </div>
          <div v-else style="font-weight: bolder;color: #444262;font-size: 14px">
            --
          </div>
          <div style="color: #444262;font-size: 14px">
            {{ currentItem.email ? currentItem.email : "--" }}
          </div>
        </div>
        <div class="d-flex flex-row custom-drawer-item" :style="currentItem.groups.length>0?{}:{ borderBottom: 'none'}">
          <v-icon class="custom-drawer-item-icon" size="18" color="#444262">mdi-select-group</v-icon>
          {{ $t('group') }}
          <v-spacer/>
          <v-chip color="#E6E4E6" x-small>{{ currentItem.groupCount }}</v-chip>
        </div>
        <div class="d-flex flex-column" style="padding: 10px 20px" v-if="currentItem.groups.length>0">
          <v-list dense style="padding: 0">
            <v-list-item v-for="group in currentItem.groups" :key="group.id" style="padding: 0;min-height: 10px">
              <v-list-item-content style="padding: 5px 0">
                <v-list-item-title style="color: #83829A">{{ group.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="currentItem.groupCount>30" style="padding: 0;min-height: 10px">
              <v-list-item-content style="padding: 5px 0">
                <v-list-item-title style="color: #83829A">{{ $t('moreWithDot') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
        <div class="d-flex flex-row custom-drawer-item">
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
          <v-btn text @click="searchUserDialog.display=true" style="border-right: none">
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
            v-loading="users.loading"
            :data="users.items"
            style="width: auto"
            border
            stripe
            :max-height="tableMaxHeight"
            @row-click="onRowClick"
            @sort-change="usersSortChange"
            :default-sort="{prop: users.sortBy, order: users.sortOrder === 'desc' ? 'descending' : 'ascending'}"
        >
          <el-table-column label="id" prop="id" sortable="custom">
            <template slot-scope="props">
              <router-link
                  :to="{
                  name: 'user-detail',
                  params: { id: props.row.id },
                  query: {},
                }"
              >
                {{ props.row.id }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tableUser.firstName')" prop="firstName" sortable="custom"/>
          <el-table-column :label="$t('tableUser.lastName')" prop="lastName" sortable="custom"/>
          <el-table-column :label="$t('tableUser.email')" prop="email" sortable="custom"/>
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
      </div>
    </div>
    <v-dialog v-model="searchUserDialog.display" width="431">
      <v-card>
        <v-card-title>
          {{ $t('searchUser') }}
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="searchUserDialog.form.id" label="ID"/>
          <v-text-field v-model="searchUserDialog.form.firstName" :label="$t('tableUser.firstName')"/>
          <v-text-field v-model="searchUserDialog.form.lastName" :label="$t('tableUser.lastName')"/>
          <v-text-field v-model="searchUserDialog.form.email" :label="$t('tableUser.email')"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="resetSearchDialog">
            <v-icon left>mdi-redo</v-icon>
            {{ $t('reset') }}
          </v-btn>
          <v-btn text :loading="searchUserDialog.commitLoading" @click="commitSearch">
            <v-icon left>mdi-magnify</v-icon>
            {{ $t('searchBtnTxt') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addUserDialog.display" width="431">
      <v-card>
        <v-card-title>
          {{ $t('createUser') }}
        </v-card-title>
        <v-card-text>
          <div class="subtitle-2">{{ $t('accountInfo') }}</div>
          <v-form>
            <v-text-field v-model="addUserDialog.form.id" label="userId" hide-details/>
            <v-text-field v-model="addUserDialog.form.password" :label="$t('password')" hide-details type="password"/>
            <v-text-field
                v-model="addUserDialog.form.passwordReInput" label="请再次输入密码" type="password"
                hide-details
            />
            <div
                v-if="addUserDialog.error.accountInfo.display" class="caption d-flex flex-row"
                style="align-items: center;padding: 15px 0"
            >
              <v-icon left color="#FF7754" x-small>mdi-alert-circle-outline</v-icon>
              {{ addUserDialog.error.accountInfo.msg }}
            </div>
          </v-form>
          <div class="subtitle-2" style="margin-top: 20px">{{ $t('userInfo') }}</div>
          <v-form>
            <v-text-field v-model="addUserDialog.form.firstName" :label="$t('tableUser.firstName')" hide-details/>
            <v-text-field v-model="addUserDialog.form.lastName" :label="$t('tableUser.lastName')" hide-details/>
            <v-text-field v-model="addUserDialog.form.email" :label="$t('tableUser.email')" hide-details/>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="resetAddDialog">
            <v-icon left>mdi-redo</v-icon>
            {{ $t('reset') }}
          </v-btn>
          <v-btn text :loading="addUserDialog.commitLoading" :disabled="!addUserCommitDisabled" @click="commitAddUser">
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

export default {
  name: "UserList",
  data() {
    return {
      breadcrumbs: [
        {
          text: this.$t("user"),
          disabled: true,
        },{
          text: "",
        }
      ],
      currentItem: {
        firstName: "--",
        lastName: "--",
        email: "--",
        groups: [],
        groupCount: 0,
        tenants: [],
        tenantCount: 0,
      },
      users: {
        page: 0,
        pageCount: 0,
        itemsPerPage: 50,
        totalCount: 0,
        sortBy: "userId",
        sortOrder: "asc",
        loading: true,
        items: [],
      },
      tableMaxHeight: "10",
      drawerOpen: true,
      searchUserDialog: {
        display: false,
        commitLoading: false,
        form: {
          id: "",
          firstName: "",
          lastName: "",
          email: ""
        }
      },
      addUserDialog: {
        display: false,
        commitLoading: false,
        form: {
          firstName: "",
          lastName: "",
          email: "",
          id: "",
          password: "",
          passwordReInput: "",
        },
        error: {
          userInfo: {display: false, msg: ""},
          accountInfo: {display: false, msg: ""},
        }
      },
      userFilter: {}
    };
  },
  computed: {
    addUserCommitDisabled() {
      let self = this;
      return self.addUserDialog.form.password && self.addUserDialog.form.password === self.addUserDialog.form.passwordReInput;
    }
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    async commitSearch() {
      let self = this;
      self.userFilter = {};
      if (self.searchUserDialog.form.id) {
        self.userFilter["id"] = self.searchUserDialog.form.id;
      }
      if (self.searchUserDialog.form.firstName) {
        self.userFilter["firstNameLike"] = `%${self.searchUserDialog.form.firstName}%`;
      }
      if (self.searchUserDialog.form.lastName) {
        self.userFilter["lastNameLike"] = `%${self.searchUserDialog.form.lastName}%`;
      }
      if (self.searchUserDialog.form.email) {
        self.userFilter["emailLike"] = `%${self.searchUserDialog.form.email}%`;
      }
      self.searchUserDialog.commitLoading = true;
      await self.getUsers();
      self.searchUserDialog.commitLoading = false;
      self.searchUserDialog.display = false;
    },
    async commitAddUser() {
      let self = this;
      self.addUserDialog.commitLoading = true;
      if (!self.addUserDialog.form.id) {
        self.addUserDialog.error.accountInfo.display = true;
        self.addUserDialog.error.accountInfo.msg = "请输入userId";
        return;
      } else {
        self.addUserDialog.error.accountInfo.display = false;
        self.addUserDialog.error.accountInfo.msg = "";
      }
      try {
        await userRequest.postCreateUser({
          profile: {
            id: self.addUserDialog.form.id,
            firstName: self.addUserDialog.form.firstName,
            lastName: self.addUserDialog.form.lastName,
            email: self.addUserDialog.form.email,
          },
          credentials: {
            password: self.addUserDialog.form.password,
          }
        });
        self.addUserDialog.display = false;
        self.$notify.success(self.$t("createUserSuccess"));
        self.addUserDialog.error.accountInfo.display = false;
        await self.getUsersPage();
      } catch (err) {
        self.addUserDialog.error.accountInfo.display = true;
        self.addUserDialog.error.accountInfo.msg = err.response.data.message;
      } finally {
        self.addUserDialog.commitLoading = false;
      }
    },
    resetSearchDialog() {
      let self = this;
      self.searchUserDialog.form = {
        firstName: "",
        lastName: "",
        email: "",
        id: "",
      };
    },
    resetAddDialog() {
      let self = this;
      self.addUserDialog.form = {
        firstName: "",
        lastName: "",
        email: "",
        id: "",
        password: "",
        passwordReInput: "",
      };
      self.addUserDialog.error.accountInfo.display = false;
      self.addUserDialog.error.accountInfo.msg = "";
    },
    async getUsers() {
      let self = this;
      self.users.loading = true;
      self.users.totalCount = 0;
      self.users.page = 0;
      let response = await userRequest.getUserCount(self.userFilter);
      self.users.totalCount = response.count;
      self.users.pageCount =
          Math.floor((response.count - 1) / self.users.itemsPerPage) + 1;
      self.users.page = 1;
    },
    async getUsersPage() {
      let self = this;
      self.users.loading = true;
      if (!self.users.page) {
        self.users.items = [];
        return;
      }
      let params = {
        firstResult: (self.users.page - 1) * this.users.itemsPerPage,
        maxResults: self.users.itemsPerPage,
        sortBy: self.users.sortBy,
        sortOrder: self.users.sortOrder
      };
      let users = await userRequest.getUsers(Object.assign(params, self.userFilter));
      if (!self.currentItem.id && users.length > 0) {
        await self.onRowClick(users[0]);
      }
      self.users.items = users;
      self.users.loading = false;
    },
    usersSortChange(value) {
      this.users.sortBy = value.prop;
      if (value.prop === "id") {
        this.users.sortBy = "userId";
      }
      this.users.sortOrder = value.order === "descending" ? "desc" : "asc";
      this.getUsersPage();
    },
    onAddUserClick() {
      let self = this;
      self.resetAddDialog();
      self.addUserDialog.display = true;
    },
    async onRowClick(row) {
      let self = this;
      let groups = await userRequest.getGroupList({member: row.id, firstResult: 0, maxResults: 30});
      let tenants = await userRequest.getTenantList({userMember: row.id, firstResult: 0, maxResults: 30});
      let groupCount = await userRequest.getGroupCount({member: row.id});
      groupCount = groupCount.count;
      let tenantCount = await userRequest.getTenantCount({userMember: row.id});
      tenantCount = tenantCount.count;
      self.currentItem = Object.assign(row, {
        groups, tenants, groupCount, tenantCount
      });
    },
    setTableHeight() {
      let self = this;
      let height = self.$refs.resizeLayoutBottom.offsetHeight;
      let paginationHeight = 59.59;
      // 46为顶部操作按钮的高度
      height = height - 46;
      if (self.users.pageCount > 1) {
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
        this.breadcrumbs[0].text=this.$t("user");
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
  }
};
</script>
