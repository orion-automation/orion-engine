<template>
  <div class="d-flex flex-column" style="width: 100%;height: 100%;border-top: 1px solid rgb(187, 187, 187)">
    <div class="d-flex flex-row"
         style="width: 100%;padding: 14px 15px;font-size: 13px;color: #312651;align-items: center;justify-items: center">
      <v-breadcrumbs :items="breadcrumbs" style="background-color: #e8eff7;padding: 0;border: none" divider="|"/>
    </div>
    <div class="d-flex flex-row" style="width: 100%;height: 0;flex: 1">
      <v-navigation-drawer v-model="drawerOpen" :width="drawerOpen?336:0" mobile-breakpoint="0">
        <div class="d-flex flex-column" style="height: 100%">
          <div class="d-flex flex-row custom-drawer-item"
               style="border-bottom: none;color: #312651;height: 42.3px">
            {{ $t('authList') }}
            <v-spacer/>
          </div>
          <div class="d-flex flex-column" style="flex: 1;height: 0;overflow-y: auto">
            <div class="d-flex flex-row custom-drawer-item"
                 style="border-bottom: none"
                 v-for="auth in authorizations"
                 :key="auth.integerRepresentation"
                 :class="tabSelect&&tabSelect.integerRepresentation===auth.integerRepresentation?'custom-drawer-item-selected':''"
                 @click="onTabClick(auth)">
              <div style="flex: 1;text-overflow: ellipsis;overflow: hidden;
  white-space: nowrap;">{{ auth.resourceName }} {{ auth.permissions.length === 0 ? "*" : "" }}</div>
              <v-chip color="#E6E4E6" x-small>{{
                  auth.count === null || auth.count === undefined ? '--' : auth.count
                }}
              </v-chip>
            </div>
          </div>
        </div>
      </v-navigation-drawer>
      <div
          class="d-flex flex-column" style="width: 0;flex: 1;height: 100%;background-color: white"
          ref="resizeLayoutBottom"
      >
        <div class="d-flex flex-row custom-drawer-item"
             style="padding-top: 0;padding-bottom: 0;padding-right: 0;height: 43px">
          <v-icon color="#FF7754" @click="drawerOpen=!drawerOpen" style="margin-right: 15px">mdi-chevron-left</v-icon>
          <div>{{ tabSelect ? tabSelect.resourceName : '--' }} {{ $t('authSet') }}</div>
          <v-spacer/>
          <div style="width: 1px;height: 100%;background-color: rgb(187, 187, 187)"></div>
          <v-btn text
                 @click="searchAuthDialog.display=true"
                 style="border-right: none">
            <v-icon left size="16"  color="#83829A">mdi-filter</v-icon>
            {{ $t('search') }}
          </v-btn>
          <v-divider vertical v-if="false"/>
          <v-menu
              v-if="false"
              v-model="deleteAuthDialog.display"
              :close-on-content-click="false"
              :nudge-width="200"
              offset-x
          >
            <template #activator="{ on, attrs }">
              <v-btn text
                     v-bind="attrs"
                     v-on="on"
                     style="border-right: none">
                <v-icon left size="16"  color="#83829A">mdi-sticker-remove-outline</v-icon>
                {{ $t('delete') }}
              </v-btn>
            </template>

            <v-card>
              <v-card-title class="small-headline">
                {{ $t('deleteAuth') }}
              </v-card-title>
              <v-card-text>
                <div>{{ $t('confirmDeleteAuth') }}</div>
              </v-card-text>
              <v-card-actions>
                <v-spacer/>
                <v-btn text @click="deleteAuthDialog.display = false">
                  {{ $t('cancel') }}
                </v-btn>
                <v-btn
                    color="primary"
                    text
                    :loading="deleteAuthDialog.commitLoading"
                    @click="onAuthsDelete"
                >
                  {{ $t('delete') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
          <div style="width: 1px;height: 100%;background-color: rgb(187, 187, 187)"></div>
          <v-btn text @click="onAddAuthClick"
                 style="border-right: none">
            <v-icon left size="16"  color="#83829A">mdi-plus</v-icon>
            {{ $t('add') }}
          </v-btn>
        </div>
        <el-table
            v-loading="auths.loading"
            :data="auths.items"
            style="width: auto"
            border
            stripe
            :max-height="tableMaxHeight"
            @selection-change="handleAuthSelectionChange"
        >
          <!--          <el-table-column-->
          <!--              type="selection"-->
          <!--              width="55"/>-->
          <el-table-column :label="$t('tableAuth.authToUserOrGroup')" prop="resourceType">
            <template slot-scope="props">
              {{ parseResourceType(props.row) }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('tableAuth.authType')" prop="type">
            <template slot-scope="props">
              {{ parseAuthType(props.row) }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('tableAuth.authScope')">
            <template slot-scope="props">
              <div>{{
                  !props.row.permissions || (props.row.permissions && props.row.permissions.length === 0) ? 'NONE' : props.row.permissions.join(",")
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('tableAuth.resource')" prop="resourceId"/>
          <el-table-column :label="$t('tableAuth.operate')" width="200">
            <template slot-scope="props">
              <div class="d-flex flex-row" style="align-items: center;gap: 10px">
                <v-icon color="#FF7754"
                        size="15"
                        @click="onAuthItemEditClick(props.$index,props.row)"
                >mdi-note-edit-outline</v-icon>
                <v-menu
                    v-model="props.row.delete"
                    :close-on-content-click="false"
                    :nudge-width="200"
                    offset-x
                >
                  <template #activator="{ on, attrs }">
                    <v-icon color="#606266"
                            size="15"
                            v-bind="attrs"
                            v-on="on"
                    >mdi-delete-forever</v-icon>
                  </template>

                  <v-card>
                    <v-card-title class="small-headline">
                      {{ $t('deleteAuth') }}
                    </v-card-title>
                    <v-card-text>
                      <div>是否删除选中权限对象?</div>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer/>
                      <v-btn text @click="props.row.delete = false">
                        {{ $t('cancel') }}
                      </v-btn>
                      <v-btn
                          color="primary"
                          text
                          :loading="deleteAuthDialog.commitLoading"
                          @click="onAuthDelete(props.row)"
                      >
                        {{ $t('delete') }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div
            class="text-center mb-2 my-2"
            v-show="auths.pageCount > 1"
        >
          <v-pagination
              v-model="auths.page"
              :length="auths.pageCount"
              total-visible="10"
              color="#FF7754"
          />
        </div>
      </div>
    </div>
    <v-dialog v-model="searchAuthDialog.display" max-width="431">
      <v-card>
        <v-card-title>{{ $t('search') }}</v-card-title>
        <v-card-text>
          <div class="d-flex flex-column" style="gap: 20px">
            <v-radio-group :label="$t('authTo')" hide-details dense
                           @change="onSearchAuthTypeChange"
                           v-model="searchAuthDialog.form.authToType" row>
              <v-radio :label="$t('user')" value="user" color="#F85021"/>
              <v-radio :label="$t('group')" value="group" color="#F85021"/>
            </v-radio-group>
            <v-combobox
                required
                v-model="searchAuthDialog.form.idIn"
                :items="searchAuthDialog.search.items"
                :search-input.sync="searchAuthDialog.search.searchVal"
                hide-no-data
                persistent-placeholder
                hide-details
                hide-selected
                clearable
                dense
                item-value="id"
                item-text="id"
                :menu-props="{zIndex:'1000 !important'}"
                :placeholder="$t('placeHolder.inputKeyToSearchUserOrGroup')"
            />
            <v-select :label="$t('tableAuth.authType')"
                      hide-details
                      clearable
                      item-text="name"
                      item-value="id"
                      :items="authorizationTypes"
                      v-model="searchAuthDialog.form.type"/>
            <v-text-field :label="$t('tableAuth.resource')" hide-details v-model="searchAuthDialog.form.resourceId"/>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="onResetSearchAuth">
            <v-icon left>mdi-redo</v-icon>
            {{ $t('reset') }}
          </v-btn>
          <v-btn text :loading="editAuthDialog.commitLoading" @click="onAuthSearchCommit">
            <v-icon left>mdi-check</v-icon>
            {{ $t('search') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addAuthDialog.display" max-width="431">
      <v-card>
        <v-card-title>{{ $t('createAuth') }}</v-card-title>
        <v-card-text>
          <div class="d-flex flex-column" style="gap: 20px">
            <v-radio-group :label="$t('authTo')" hide-details dense
                           @change="onSearchAuthTypeChange"
                           :disabled="addAuthDialog.form.type=='0'"
                           v-model="addAuthDialog.form.authToType" row>
              <v-radio :label="$t('user')" value="user" color="#F85021"/>
              <v-radio :label="$t('group')" value="group" color="#F85021"/>
            </v-radio-group>
            <v-combobox
                required
                :disabled="addAuthDialog.form.type=='0'"
                v-model="addAuthDialog.form.idIn"
                :items="addAuthDialog.search.items"
                :search-input.sync="addAuthDialog.search.searchVal"
                hide-no-data
                persistent-placeholder
                hide-details
                hide-selected
                clearable
                dense
                item-value="id"
                item-text="id"
                :menu-props="{zIndex:'1000 !important'}"
                :placeholder="$t('placeHolder.inputKeyToSearchUserOrGroup')"
            >
            </v-combobox>
            <v-select :label="$t('tableAuth.authType')"
                      hide-details
                      clearable
                      required
                      item-text="name"
                      item-value="id"
                      :items="authorizationTypes"
                      v-model="addAuthDialog.form.type"/>
            <v-select :label="$t('permission')"
                      hide-details
                      clearable
                      multiple
                      v-if="tabSelect"
                      :items="tabSelect.permissions??[]"
                      v-model="addAuthDialog.form.permissions"/>
            <v-text-field :label="$t('tableAuth.resource')" hide-details v-model="addAuthDialog.form.resourceId" required/>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="onResetAddAuth">
            <v-icon left>mdi-redo</v-icon>
            {{ $t('reset') }}
          </v-btn>
          <v-btn text :loading="editAuthDialog.commitLoading" @click="onAuthAddCommit">
            <v-icon left>mdi-check</v-icon>
            {{ $t('create') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editAuthDialog.display" max-width="431">
      <v-card>
        <v-card-title>{{ $t('updateAuth') }}</v-card-title>
        <v-card-text>
          <div class="d-flex flex-column" style="gap: 20px">
            <v-radio-group :label="$t('authTo')" hide-details dense
                           @change="onSearchAuthTypeChange"
                           :disabled="editAuthDialog.form.type=='0'"
                           v-model="editAuthDialog.form.authToType" row>
              <v-radio :label="$t('user')" value="user" color="#F85021"/>
              <v-radio :label="$t('group')" value="group" color="#F85021"/>
            </v-radio-group>
            <v-combobox
                required
                :disabled="editAuthDialog.form.type=='0'"
                v-model="editAuthDialog.form.idIn"
                :items="editAuthDialog.search.items"
                :search-input.sync="editAuthDialog.search.searchVal"
                hide-no-data
                persistent-placeholder
                hide-details
                hide-selected
                clearable
                dense
                item-value="id"
                item-text="id"
                :menu-props="{zIndex:'1000 !important'}"
                :placeholder="$t('placeHolder.inputKeyToSearchUserOrGroup')"
            >
            </v-combobox>
            <v-select :label="$t('permission')"
                      hide-details
                      clearable
                      multiple
                      v-if="tabSelect"
                      :items="tabSelect.permissions??[]"
                      v-model="editAuthDialog.form.permissions"/>
            <v-text-field :label="$t('tableAuth.resource')" hide-details v-model="editAuthDialog.form.resourceId" required/>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="onResetEditAuth">
            <v-icon left>mdi-redo</v-icon>
            {{ $t('reset') }}
          </v-btn>
          <v-btn text :loading="editAuthDialog.commitLoading" @click="onAuthEditCommit">
            <v-icon left>mdi-check</v-icon>
            {{ $t('save') }}
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
  name: "AuthDetail",
  mounted() {
    this.breadcrumbs[0].text = this.$t("authSet");
    this.getData();
  },
  data() {
    return {
      breadcrumbs: [
        {
          text: "",
          href: "#/admin/authorization/detail",
          disabled: true,
        },
        {
          text: "",
          disabled: true,
        }
      ],
      authorizations: [],
      authorizationTypes: [
        {id: 0, name: "GLOBAL"},
        {id: 1, name: "ALLOW"},
        {id: 2, name: "DENY"},
      ],
      tableMaxHeight: "10",
      drawerOpen: true,
      searchAuthDialog: {
        display: false,
        commitLoading: false,
        form: {
          authToType: "user",
          idIn: null,
          type: null,
          resourceId: "",
        },
        search: {
          items: [],
          loading: false,
          searchVal: "",
        }
      },
      addAuthDialog: {
        display: false,
        commitLoading: false,
        form: {
          authToType: "user",
          idIn: null,
          type: null,
          resourceId: "*",
          permissions: null,
        },
        search: {
          items: [],
          loading: false,
          searchVal: "",
        }
      },
      editAuthDialog: {
        display: false,
        commitLoading: false,
        currentAuthIndex: null,
        form: {
          authToType: "user",
          idIn: null,
          type: null,
          resourceId: "*",
          permissions: null,
        },
        search: {
          items: [],
          loading: false,
          searchVal: "",
        }
      },
      deleteAuthDialog: {
        display: false,
        commitLoading: false,
      },
      tabSelect: null,
      auths: {
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
      authFilter: {},
    };
  },
  methods: {
    setAuthFilter(resourceType) {
      if (resourceType || resourceType === 0) {
        this.authFilter = {
          resourceType: resourceType
        };
      } else {
        this.authFilter = {};
      }
      this.getAuths();
    },
    parseResourceType(item) {
      return item.groupId ?? item.userId;
    },
    parseAuthType(item) {
      let self = this;
      let currentIndex = self.authorizationTypes.findIndex(type => type.id === item.type);
      return currentIndex > -1 ? self.authorizationTypes[currentIndex].name : "--";
    },
    onResetAddAuth() {
      this.addAuthDialog.form = {
        authToType: "user",
        idIn: null,
        type: null,
        resourceId: "*",
        permissions: null,
      };
      this.addAuthDialog.search = {
        items: [],
        loading: false,
        searchVal: "",
      };
    },
    async onAuthAddCommit() {
      let self = this;
      if ((!self.addAuthDialog.form.type && self.addAuthDialog.form.type !== 0) ||
          !self.addAuthDialog.form.idIn ||
          !self.addAuthDialog.form.resourceId) {
        self.$notify.error(self.$t("plsCompleteInfo"));
        return;
      }
      try {
        self.addAuthDialog.commitLoading = true;
        let idKey = self.addAuthDialog.form.authToType === "user" ? "userId" : "groupId";
        if (self.addAuthDialog.form.permissions && self.addAuthDialog.form.permissions.length > 0) {
          if (self.addAuthDialog.form.permissions.length === self.tabSelect.permissions.length) {
            self.addAuthDialog.form.permissions = ["ALL"];
          }
        } else {
          self.addAuthDialog.form.permissions = [];
        }
        let data = {
          type: `${self.addAuthDialog.form.type}`,
          permissions: self.addAuthDialog.form.permissions,
          resourceId: self.addAuthDialog.form.resourceId,
          resourceType: self.tabSelect.integerRepresentation
        };
        data[`${idKey}`] = `${self.addAuthDialog.search.searchVal}`;
        await userRequest.postCreateAuthorization(data);
        self.$notify.success({title: self.$t("success"), message: self.$t("addAuthSuccessInfo")});
        self.addAuthDialog.display = false;
        self.getAuths();
      } catch (err) {
        self.$notify.error(self.$t("addAuthSuccessErrorWithInfo",{msg:err.response.data.message}));
      } finally {
        self.addAuthDialog.commitLoading = false;
      }
    },
    async onResetEditAuth() {
      let self = this;
      let item = self.auths.items[self.editAuthDialog.currentAuthIndex];
      self.editAuthDialog.form = {
        id: item.id,
        permissions: item.permissions.length > 0 ? "ACCESS" : null,
        resourceId: item.resourceId,
        type: item.type,
      };
      if (item.groupId) {
        self.editAuthDialog.form.authToType = "group";
        let user = await groupRequest.getGroup(item.groupId);
        user.showName = `${user.id} | ${user.name}`;
        self.editAuthDialog.form.idIn = user;
        self.editAuthDialog.search.items = [user];
      }
      if (item.userId) {
        self.editAuthDialog.form.authToType = "user";
        if (item.type != "0") {
          let user = await userRequest.getProfile(item.userId);
          user.showName = `${user.id} | ${user.firstName} ${user.lastName}`;
          self.editAuthDialog.form.idIn = user;
          self.editAuthDialog.search.items = [user];
        }
      }
    },
    onSearchAuthTypeChange() {
      this.searchAuthDialog.form.idIn = null;
      this.searchAuthDialog.search.items = [];
      this.searchAuthDialog.search.searchVal = "";
      this.addAuthDialog.form.idIn = null;
      this.addAuthDialog.search.items = [];
      this.addAuthDialog.search.searchVal = "";
      this.editAuthDialog.form.idIn = null;
      this.editAuthDialog.search.items = [];
      this.editAuthDialog.search.searchVal = "";
    },
    onResetSearchAuth() {
      this.searchAuthDialog.form.authToType = "user";
      this.searchAuthDialog.form.idIn = null;
      this.searchAuthDialog.form.type = null;
      this.searchAuthDialog.form.resourceId = "";
      this.searchAuthDialog.search.items = [];
      this.searchAuthDialog.search.searchVal = "";
    },
    async onAuthEditCommit() {
      let self = this;
      if ((!self.editAuthDialog.form.type && self.editAuthDialog.form.type !== 0) ||
          !self.editAuthDialog.form.idIn ||
          !self.editAuthDialog.form.resourceId) {
        self.$notify.error(self.$t("plsCompleteInfo"));
        return;
      }
      try {
        self.editAuthDialog.commitLoading = true;
        let idKey = self.editAuthDialog.form.authToType === "user" ? "userId" : "groupId";
        if (self.editAuthDialog.form.permissions && self.editAuthDialog.form.permissions.length > 0) {
          if (self.editAuthDialog.form.permissions.length === self.tabSelect.permissions.length) {
            self.editAuthDialog.form.permissions = ["ALL"];
          }
        } else {
          self.editAuthDialog.form.permissions = [];
        }
        let data = {
          id: self.editAuthDialog.form.id,
          type: `${self.editAuthDialog.form.type}`,
          permissions: self.editAuthDialog.form.permissions,
          resourceId: self.editAuthDialog.form.resourceId,
          resourceType: self.tabSelect.integerRepresentation
        };
        data[`${idKey}`] = `${self.editAuthDialog.search.searchVal}`;
        await userRequest.putUpdateAuthorization(self.editAuthDialog.form.id, data);
        self.$notify.success({title: self.$t("success"), message: self.$t("editAuthSuccessInfo")});
        self.editAuthDialog.display = false;
        self.getAuths();
      } catch (err) {
        console.log(err);
        self.$notify.error(self.$t("editAuthSuccessErrorWithInfo",{msg:err.response.data.message}));
      } finally {
        self.editAuthDialog.commitLoading = false;
      }
    },
    onAuthSearchCommit() {
      let self = this;
      self.searchAuthDialog.commitLoading = true;
      if (self.searchAuthDialog.form.type != null) {
        self.authFilter.type = self.searchAuthDialog.form.type;
      } else {
        delete self.authFilter.type;
      }
      if (self.searchAuthDialog.form.idIn) {
        self.authFilter[self.searchAuthDialog.form.authToType === "user" ? "userIdIn" : "groupIdIn"] = `${self.searchAuthDialog.search.searchVal}`;
      } else {
        delete self.authFilter.userIdIn;
        delete self.authFilter.groupIdIn;
      }
      if (self.searchAuthDialog.form.resourceId && self.searchAuthDialog.form.resourceId.length > 0) {
        self.authFilter.resourceId = self.searchAuthDialog.form.resourceId;
      } else {
        delete self.authFilter.resourceId;
      }
      self.searchAuthDialog.commitLoading = false;
      self.searchAuthDialog.display = false;
      self.getAuths();
    },
    handleAuthSelectionChange(val) {
      this.auths.selection = val;
    },
    setTableHeight() {
      let self = this;
      let height = self.$refs.resizeLayoutBottom.offsetHeight;
      let paginationHeight = 59.59;
      // 46为顶部操作按钮的高度
      height = height - 46;
      if (self.auths.pageCount > 1) {
        height = height - paginationHeight;
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
    resetSearchTenantDialog() {
      let self = this;
      self.searchTenantDialog.form = {
        name: "",
      };
    },
    async getAuths() {
      let self = this;
      let countResult = await userRequest.getAuthorizationCount({resourceType: self.tabSelect.integerRepresentation});
      self.tabSelect.count = countResult.count;
      self.$set(self.authorizations, self.authorizations.findIndex(item => item.integerRepresentation === self.tabSelect.integerRepresentation), self.tabSelect);
      self.auths.loading = true;
      self.auths.totalCount = 0;
      self.auths.page = 0;
      let response = await userRequest.getAuthorizationCount(Object.assign({resourceType: self.tabSelect.integerRepresentation}, self.authFilter));
      self.auths.totalCount = response.count;
      self.auths.pageCount =
          Math.floor((response.count - 1) / self.auths.itemsPerPage) + 1;
      self.auths.page = 1;
    },
    async getAuthsPage() {
      let self = this;
      self.auths.selection = [];
      self.auths.loading = true;
      if (!self.auths.page) {
        self.auths.items = [];
        return;
      }
      let params = {
        firstResult: (self.auths.page - 1) * this.auths.itemsPerPage,
        maxResults: self.auths.itemsPerPage,
        resourceType: self.tabSelect.integerRepresentation
      };
      let users = await userRequest.getAuthorization(Object.assign(params, self.authFilter));
      self.auths.items = users;
      self.auths.loading = false;
    },
    async getData() {
      let self = this;
      let promiseAll = [];
      let auths = [
        {
          resourceName: "Application",
          integerRepresentation: 0,
          resourceId: "admin/cockpit/tasklist/*",
          permissions: ["ACCESS"]
        },
        {
          resourceName: "Authorization", integerRepresentation: 4, resourceId: "Authorization Id",
          permissions: ["READ", "UPDATE", "CREATE", "DELETE"]
        },
        {
          resourceName: "Batch", integerRepresentation: 13, resourceId: "Batch Id",
          permissions: ["READ", "UPDATE", "CREATE", "DELETE", "READ_HISTORY", "DELETE_HISTORY", "CREATE_BATCH_MIGRATE_PROCESS_INSTANCES",
            "CREATE_BATCH_MODIFY_PROCESS_INSTANCES", "CREATE_BATCH_RESTART_PROCESS_INSTANCES", "CREATE_BATCH_DELETE_RUNNING_PROCESS_INSTANCES",
            "CREATE_BATCH_DELETE_FINISHED_PROCESS_INSTANCES", "CREATE_BATCH_DELETE_DECISION_INSTANCES", "CREATE_BATCH_SET_JOB_RETRIES",
            "CREATE_BATCH_SET_REMOVAL_TIME", "CREATE_BATCH_SET_EXTERNAL_TASK_RETRIES", "CREATE_BATCH_UPDATE_PROCESS_INSTANCES_SUSPEND",
            "CREATE_BATCH_SET_VARIABLES"]
        },
        {
          resourceName: "Decision Definition", integerRepresentation: 10, resourceId: "Decision Definition Key",
          permissions: ["READ", "UPDATE", "CREATE_INSTANCE", "READ_HISTORY", "DELETE_HISTORY"]
        },
        {
          resourceName: "Decision Requirements Definition",
          integerRepresentation: 14,
          resourceId: "Decision Requirements Definition Key",
          permissions: ["READ"]
        },
        {
          resourceName: "Deployment", integerRepresentation: 9, resourceId: "Deployment Id",
          permissions: ["READ", "CREATE", "DELETE"]
        },
        {
          resourceName: "Filter", integerRepresentation: 5, resourceId: "Filter Id",
          permissions: ["READ", "UPDATE", "CREATE", "DELETE"]
        },
        {
          resourceName: "Group", integerRepresentation: 2, resourceId: "Group Id",
          permissions: ["READ", "UPDATE", "CREATE", "DELETE"]
        },
        {
          resourceName: "Group Membership", integerRepresentation: 3, resourceId: "Group Id",
          permissions: ["CREATE", "DELETE"]
        },
        {
          resourceName: "Process Definition", integerRepresentation: 6, resourceId: "Process Definition Key",
          permissions: ["READ", "UPDATE", "DELETE", "SUSPEND", "CREATE_INSTANCE", "READ_INSTANCE", "UPDATE_INSTANCE",
            "RETRY_JOB", "SUSPEND_INSTANCE", "DELETE_INSTANCE", "MIGRATE_INSTANCE", "READ_TASK", "UPDATE_TASK",
            "TASK_ASSIGN", "TASK_WORK", "READ_TASK_VARIABLE", "READ_HISTORY", "READ_HISTORY_VARIABLE", "DELETE_HISTORY",
            "READ_INSTANCE_VARIABLE", "UPDATE_INSTANCE_VARIABLE", "UPDATE_TASK_VARIABLE", "UPDATE_HISTORY"]
        },
        {
          resourceName: "Process Instance", integerRepresentation: 8, resourceId: "Process Instance Id",
          permissions: ["READ", "UPDATE", "CREATE", "DELETE", "RETRY_JOB", "SUSPEND", "UPDATE_VARIABLE"]
        },
        {
          resourceName: "Task", integerRepresentation: 7, resourceId: "Task Id",
          permissions: ["READ", "UPDATE", "CREATE", "DELETE", "TASK_ASSIGN", "TASK_WORK", "UPDATE_VARIABLE", "READ_VARIABLE"]
        },
        {
          resourceName: "Historic Task", integerRepresentation: 19, resourceId: "Historic Task Id",
          permissions: ["READ", "READ_VARIABLE"]
        },
        {
          resourceName: "Historic Process Instance",
          integerRepresentation: 20,
          resourceId: "Historic Process Instance Id",
          permissions: ["READ"]
        },
        {
          resourceName: "Tenant", integerRepresentation: 11, resourceId: "Tenant Id",
          permissions: ["READ", "UPDATE", "CREATE", "DELETE"]
        },
        {
          resourceName: "Tenant Membership", integerRepresentation: 12, resourceId: "Tenant Id",
          permissions: ["CREATE", "DELETE"]
        },
        {
          resourceName: "User", integerRepresentation: 1, resourceId: "User Id",
          permissions: ["READ", "UPDATE", "CREATE", "DELETE"]
        },
        {resourceName: "Report", integerRepresentation: 15, resourceId: "Report Id", permissions: []},
        {resourceName: "Dashboard", integerRepresentation: 16, resourceId: "Dashboard Id", permissions: []},
        {
          resourceName: "User Operation Log Category",
          integerRepresentation: 17,
          resourceId: "User Operation Log Entry Category",
          permissions: ["READ", "UPDATE", "DELETE"]
        },
        {resourceName: "System", integerRepresentation: 21, resourceId: "*", permissions: ["READ", "SET", "DELETE"]},
      ];
      auths.forEach(auth => {
        promiseAll.push(userRequest.getAuthorizationCount({resourceType: auth.integerRepresentation}));
      });
      Promise.all(promiseAll)
          .then(results => {
            for (let i = 0; i < auths.length; i++) {
              auths[i].count = results[i].count;
            }
            self.authorizations = auths;
            if (auths.length > 0) {
              self.onTabClick(auths[0]);
            }
          });
    },
    async onAuthDelete(auth) {
      let self = this;
      self.auths.selection = [auth];
      await self.onAuthsDelete();
      auth.delete = false;
    },
    async onAuthsDelete() {
      let self = this;
      if (self.auths.selection.length === 0) {
        self.$message.error({message:self.$t("plsSelectAuth"),showClose:true});
        return;
      }
      self.deleteAuthDialog.commitLoading = true;
      try {
        let result = await Promise.all(self.auths.selection.map(group => {
          return userRequest.delAuthorization(group.id);
        }));
        self.deleteAuthDialog.display = false;
        await self.getAuths();
      } catch (e) {
        self.$message.error({message:self.$t("deleteAuthError"),showClose:true});
      } finally {
        self.deleteAuthDialog.commitLoading = false;
      }
    },
    onAddAuthClick() {
      let self = this;
      self.addAuthDialog.display = true;
      self.onResetAddAuth();
    },
    onTabClick(auth) {
      let self = this;
      self.tabSelect = auth;
      self.breadcrumbs[1].text = `${auth.resourceName ?? ""}`;
      self.getAuths();
      self.$nextTick(() => {
        self.setTableHeight();
      });
    },
    async onAuthItemEditClick(index, item) {
      let self = this;
      self.editAuthDialog.currentAuthIndex = index;
      let permissions = [];
      if (item.permissions.length > 0) {
        if (item.permissions[0] === "ALL") {
          permissions = self.tabSelect.permissions;
        } else {
          permissions = item.permissions;
        }
      }
      self.editAuthDialog.form = {
        id: item.id,
        permissions: permissions,
        resourceId: item.resourceId,
        type: item.type,
      };
      if (item.groupId) {
        self.editAuthDialog.form.authToType = "group";
        self.editAuthDialog.form.idIn = item.groupId;
      }
      if (item.userId) {
        self.editAuthDialog.form.authToType = "user";
        self.editAuthDialog.form.idIn = item.userId;
      }
      self.editAuthDialog.display = true;
    },
  },
  watch: {
    "$i18n.locale": {
      handler(val){
        this.breadcrumbs[0].text=this.$t("authSet");
      },
    },
    "auths.page": {
      handler() {
        this.getAuthsPage();
      },
    },
    "auths.pageCount": {
      handler() {
        this.setTableHeight();
      },
    },
    "searchAuthDialog.search.searchVal": {
      async handler(val) {
        let self = this;
        if (!val || val.length === 0) {
          return;
        }
        if (self.searchAuthDialog.search.loading) return;
        self.searchAuthDialog.search.loading = true;
        if (self.searchAuthDialog.form.authToType === "user") {
          userRequest.getEnhancementUsers(
              {nameLike: `%${val}%`})
              .then(users => {
                self.searchAuthDialog.search.items = users.map(user => {
                  user.showName = `${user.id} | ${user.firstName} ${user.lastName}`;
                  return user;
                });
              });
        }
        if (self.searchAuthDialog.form.authToType === "group") {
          groupRequest.getGroupList(
              {nameLike: `%${val}%`})
              .then(users => {
                self.searchAuthDialog.search.items = users.map(user => {
                  user.showName = `${user.id} | ${user.name}`;
                  return user;
                });
              });
        }
        self.searchAuthDialog.search.loading = false;
      }
    },
    "addAuthDialog.search.searchVal": {
      async handler(val) {
        let self = this;
        if (!val || val.length === 0) {
          return;
        }
        if (self.addAuthDialog.search.loading) return;
        self.addAuthDialog.search.loading = true;
        if (self.addAuthDialog.form.authToType === "user") {
          userRequest.getEnhancementUsers(
              {nameLike: `%${val}%`})
              .then(users => {
                self.addAuthDialog.search.items = users.map(user => {
                  user.showName = `${user.id} | ${user.firstName} ${user.lastName}`;
                  return user;
                });
              });
        }
        if (self.addAuthDialog.form.authToType === "group") {
          groupRequest.getGroupList(
              {nameLike: `%${val}%`})
              .then(users => {
                self.addAuthDialog.search.items = users.map(user => {
                  user.showName = `${user.id} | ${user.name}`;
                  return user;
                });
              });
        }
        self.addAuthDialog.search.loading = false;
      }
    },
    "addAuthDialog.form.type": {
      handler(val) {
        if (val == "0") {
          this.addAuthDialog.form.authToType = "user";
          this.addAuthDialog.form.idIn = "*";
        }
      }
    },
    "editAuthDialog.search.searchVal": {
      async handler(val) {
        let self = this;
        if (!val || val.length === 0) {
          return;
        }
        if (self.editAuthDialog.search.loading) return;
        self.editAuthDialog.search.loading = true;
        if (self.editAuthDialog.form.authToType === "user") {
          userRequest.getEnhancementUsers(
              {nameLike: `%${val}%`})
              .then(users => {
                self.editAuthDialog.search.items = users.map(user => {
                  user.showName = `${user.id} | ${user.firstName} ${user.lastName}`;
                  return user;
                });
              });
        }
        if (self.editAuthDialog.form.authToType === "group") {
          groupRequest.getGroupList(
              {nameLike: `%${val}%`})
              .then(users => {
                self.editAuthDialog.search.items = users.map(user => {
                  user.showName = `${user.id} | ${user.name}`;
                  return user;
                });
              });
        }
        self.editAuthDialog.search.loading = false;
      }
    },
    "editAuthDialog.form.type": {
      handler(val) {
        if (val == "0") {
          this.editAuthDialog.form.authToType = "user";
          this.editAuthDialog.form.idIn = "*";
        }
      }
    }
  }
};
</script>
<style scoped>
.v-list--dense.menu-list .v-list-item .v-list-item__title.current {
  font-weight: bold;
  color: #B1ABB6;
}
</style>
