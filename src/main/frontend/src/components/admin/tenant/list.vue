<template>
  <div class="d-flex flex-column" style="width: 100%;height: 100%;border-top: 1px solid rgb(187, 187, 187)">
    <div class="d-flex flex-row"
         style="width: 100%;padding: 14px 15px;font-size: 13px;color: #312651;align-items: center;justify-items: center">
      <v-breadcrumbs :items="breadcrumbs" style="background-color: #e8eff7;padding: 0;border: none" divider="|"/>
      <v-chip color="#FF7754" x-small class="white--text">{{ tenants.totalCount }}</v-chip>
    </div>
    <div class="d-flex flex-row" style="width: 100%;height: 0;flex: 1">
      <v-navigation-drawer v-model="drawerOpen" :width="drawerOpen?256:0" mobile-breakpoint="0">
        <div class="d-flex flex-row custom-drawer-item">
          <v-icon class="custom-drawer-item-icon" size="18" color="#444262">mdi-cube-scan</v-icon>
          {{ $t('tenant') }}
        </div>
        <div class="d-flex flex-column" style="padding: 10px 20px">
          <div style="font-weight: bolder;color: #444262;font-size: 14px">
            {{ currentItem.name }}
          </div>
          <div style="color: #444262;font-size: 14px">
            {{ currentItem.type }}
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
          <v-btn text @click="searchTenantDialog.display=true" style="border-right: none">
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
            v-loading="tenants.loading"
            :data="tenants.items"
            style="width: auto"
            border
            stripe
            :max-height="tableMaxHeight"
            @row-click="onRowClick"
            @sort-change="usersSortChange"
            :default-sort="{prop: tenants.sortBy, order: tenants.sortOrder === 'desc' ? 'descending' : 'ascending'}"
        >
          <el-table-column label="id" prop="id" sortable="custom">
            <template slot-scope="props">
              <router-link
                  :to="{
                  name: 'tenant-detail',
                  params: { id: props.row.id },
                  query: {},
                }"
              >
                {{ props.row.id }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column :label="$t('name')" prop="name" sortable="custom"/>
        </el-table>
        <div
            class="text-center mb-2 my-2"
            v-show="tenants.pageCount > 1"
        >
          <v-pagination
              v-model="tenants.page"
              :length="tenants.pageCount"
              total-visible="10"
              color="#FF7754"
          />
        </div>
      </div>
    </div>
    <v-dialog v-model="searchTenantDialog.display" width="431">
      <v-card>
        <v-card-title>
          {{ $t('searchGroup') }}
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="searchTenantDialog.form.id" label="id"/>
          <v-text-field v-model="searchTenantDialog.form.name" :label="$t('name')"/>
          <v-text-field v-model="searchTenantDialog.form.userMember" :label="$t('memberUser')"/>
          <v-text-field v-model="searchTenantDialog.form.groupMember" :label="$t('memberGroup')"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="resetSearchDialog">
            <v-icon left>mdi-redo</v-icon>
            {{ $t('reset') }}
          </v-btn>
          <v-btn text :loading="searchTenantDialog.commitLoading" @click="commitSearch">
            <v-icon left>mdi-magnify</v-icon>
            {{ $t('searchBtnTxt') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addTenantDialog.display" width="431">
      <v-card>
        <v-card-title>
          {{ $t('createTenant') }}
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field v-model="addTenantDialog.form.id" label="id" hide-details required/>
            <v-text-field v-model="addTenantDialog.form.name" :label="$t('name')" hide-details required/>
          </v-form>
          <div
              v-if="addTenantDialog.error.accountInfo.display" class="caption d-flex flex-row"
              style="align-items: center;padding: 15px 0"
          >
            <v-icon left color="#FF7754" x-small>mdi-alert-circle-outline</v-icon>
            {{ addTenantDialog.error.accountInfo.msg }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="resetAddDialog">
            <v-icon left>mdi-redo</v-icon>
            {{ $t('reset') }}
          </v-btn>
          <v-btn text :loading="addTenantDialog.commitLoading" :disabled="!addGroupCommitDisabled"
                 @click="commitAddTenant">
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
  name: "TenantList",
  data() {
    return {
      breadcrumbs: [
        {
          text: this.$t("tenant"),
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
        groups: [],
        groupCount: 0,
      },
      tenants: {
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
      searchTenantDialog: {
        display: false,
        commitLoading: false,
        form: {
          id: "",
          name: "",
          userMember: "",
          groupMember: "",
        }
      },
      addTenantDialog: {
        display: false,
        commitLoading: false,
        form: {
          id: "",
          name: "",
        },
        error: {
          userInfo: {display: false, msg: ""},
          accountInfo: {display: false, msg: ""},
        }
      },
      tenantFilter: {}
    };
  },
  computed: {
    addGroupCommitDisabled() {
      let self = this;
      return self.addTenantDialog.form.id && self.addTenantDialog.form.name;
    }
  },
  mounted() {
    this.getTenants();
  },
  methods: {
    async commitSearch() {
      let self = this;
      self.tenantFilter = {};
      if (self.searchTenantDialog.form.name) {
        self.tenantFilter["nameLike"] = `%${self.searchTenantDialog.form.name}%`;
      }
      if (self.searchTenantDialog.form.id) {
        self.tenantFilter["id"] = self.searchTenantDialog.form.id;
      }
      if (self.searchTenantDialog.form.userMember) {
        self.tenantFilter["userMember"] = self.searchTenantDialog.form.userMember;
      }
      if (self.searchTenantDialog.form.groupMember) {
        self.tenantFilter["groupMember"] = self.searchTenantDialog.form.groupMember;
      }
      self.searchTenantDialog.commitLoading = true;
      await self.getTenants();
      self.searchTenantDialog.commitLoading = false;
      self.searchTenantDialog.display = false;
    },
    async commitAddTenant() {
      let self = this;
      self.addTenantDialog.commitLoading = true;
      if (!self.addTenantDialog.form.id) {
        self.addTenantDialog.error.accountInfo.display = true;
        self.addTenantDialog.error.accountInfo.msg = self.$t("plsInputId");
        return;
      } else if (!self.addTenantDialog.form.name) {
        self.addTenantDialog.error.accountInfo.display = true;
        self.addTenantDialog.error.accountInfo.msg = self.$t("plsInputName");
        return;
      } else {
        self.addTenantDialog.error.accountInfo.display = false;
        self.addTenantDialog.error.accountInfo.msg = "";
      }
      try {
        await tenantRequest.postCreateTenant({
          id: self.addTenantDialog.form.id,
          name: self.addTenantDialog.form.name,
        });
        self.addTenantDialog.display = false;
        self.$notify.success(self.$t("createTenantSuccess"));
        self.addTenantDialog.error.accountInfo.display = false;
        await self.getTenantsPage();
      } catch (err) {
        self.addTenantDialog.error.accountInfo.display = true;
        self.addTenantDialog.error.accountInfo.msg = err.response.data.message;
      } finally {
        self.addTenantDialog.commitLoading = false;
      }
    },
    resetSearchDialog() {
      let self = this;
      self.searchTenantDialog.form = {
        id: "",
        name: "",
        userMember: "",
        groupMember: "",
      };
    },
    resetAddDialog() {
      let self = this;
      self.addTenantDialog.form = {
        name: "",
        id: "",
      };
      self.addTenantDialog.error.accountInfo.display = false;
      self.addTenantDialog.error.accountInfo.msg = "";
    },
    async getTenants() {
      let self = this;
      self.tenants.loading = true;
      self.tenants.totalCount = 0;
      self.tenants.page = 0;
      let response = await tenantRequest.getTenantCount(self.tenantFilter);
      self.tenants.totalCount = response.count;
      self.tenants.pageCount =
          Math.floor((response.count - 1) / self.tenants.itemsPerPage) + 1;
      self.tenants.page = 1;
    },
    async getTenantsPage() {
      let self = this;
      self.tenants.loading = true;
      if (!self.tenants.page) {
        self.tenants.items = [];
        return;
      }
      let params = {
        firstResult: (self.tenants.page - 1) * this.tenants.itemsPerPage,
        maxResults: self.tenants.itemsPerPage,
        sortBy: self.tenants.sortBy,
        sortOrder: self.tenants.sortOrder
      };
      let users = await tenantRequest.getTenantList(Object.assign(params, self.tenantFilter));
      self.tenants.items = users;
      if (!self.currentItem.id && users.length > 0) {
        await self.onRowClick(users[0]);
      }
      self.tenants.loading = false;
    },
    usersSortChange(value) {
      this.tenants.sortBy = value.prop;
      if (value.prop === "id") {
        this.tenants.sortBy = "id";
      }
      this.tenants.sortOrder = value.order === "descending" ? "desc" : "asc";
      this.getTenantsPage();
    },
    onAddUserClick() {
      let self = this;
      self.resetAddDialog();
      self.addTenantDialog.display = true;
    },
    async onRowClick(row) {
      let self = this;
      let users = await userRequest.getUsers({memberOfTenant: row.id, firstResult: 0, maxResults: 30});
      let groups = await groupRequest.getGroupList({memberOfTenant: row.id, firstResult: 0, maxResults: 30});
      let userCount = await userRequest.getUserCount({memberOfTenant: row.id});
      userCount = userCount.count;
      let groupCount = await groupRequest.getGroupCount({memberOfTenant: row.id});
      groupCount = groupCount.count;
      self.currentItem = Object.assign(row, {
        users, groups, userCount, groupCount
      });
    },
    setTableHeight() {
      let self = this;
      let height = self.$refs.resizeLayoutBottom.offsetHeight;
      let paginationHeight = 59.59;
      // 46为顶部操作按钮的高度
      height = height - 46;
      if (self.tenants.pageCount > 1) {
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
        this.breadcrumbs[0].text=this.$t("tenant");
      },
    },
    "tenants.page": {
      handler() {
        this.getTenantsPage();
      },
    },
    "tenants.pageCount": {
      handler() {
        this.setTableHeight();
      },
    },
  }
};
</script>
