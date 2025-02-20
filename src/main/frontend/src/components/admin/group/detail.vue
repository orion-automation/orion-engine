<template>
  <div class="d-flex flex-column" style="width: 100%;height: 100%;border-top: 1px solid rgb(187, 187, 187)">
    <div class="d-flex flex-row"
         style="width: 100%;padding: 14px 15px;font-size: 13px;color: #312651;align-items: center;justify-items: center">
      <v-breadcrumbs :items="breadcrumbs" style="background-color: #e8eff7;padding: 0;border: none" divider="|"/>
    </div>
    <div class="d-flex flex-row" style="width: 100%;height: 0;flex: 1">
      <v-navigation-drawer v-model="drawerOpen" :width="drawerOpen?256:0" mobile-breakpoint="0">
        <div class="d-flex flex-row custom-drawer-item"
             style="border-bottom: none"
             :class="tabSelect==='group'?'custom-drawer-item-selected':''"
             @click="tabSelect='group'">
          <v-icon class="custom-drawer-item-icon" size="18" color="#444262">mdi-select-group</v-icon>
          {{ $t('group') }}
          <v-spacer/>
        </div>
        <div class="d-flex flex-row custom-drawer-item"
             style="border-bottom: none"
             :class="tabSelect==='tenant'?'custom-drawer-item-selected':''"
             @click="onTenantTabClick">
          <v-icon class="custom-drawer-item-icon" size="18" color="#444262">mdi-cube-scan</v-icon>
          {{ $t('tenant') }}
          <v-spacer/>
          <v-chip color="#E6E4E6" x-small>{{ currentItem.tenantCount }}</v-chip>
        </div>
        <div class="d-flex flex-row custom-drawer-item" style="border-bottom: none"
             @click="onUserTabClick"
             :class="tabSelect==='user'?'custom-drawer-item-selected':''">
          <v-icon class="custom-drawer-item-icon" size="18" color="#444262">mdi-account-group-outline</v-icon>
          {{ $t('user') }}
          <v-spacer/>
          <v-chip color="#E6E4E6" x-small>{{ currentItem.userCount }}</v-chip>
        </div>
        <div class="d-flex flex-row custom-drawer-item"
             :class="tabSelect==='auth'?'custom-drawer-item-selected':''"
             @click="onAuthTabClick">
          <v-icon class="custom-drawer-item-icon" size="18" color="#444262">mdi-cloud-lock-outline</v-icon>
          {{ $t('permission') }}
          <v-spacer/>
          <v-chip color="#E6E4E6" x-small>{{ currentItem.authCount }}</v-chip>
        </div>
      </v-navigation-drawer>
      <div
          class="d-flex flex-column" style="width: 0;flex: 1;height: 100%;background-color: white"
          ref="resizeLayoutBottom"
      >
        <template v-if="tabSelect==='group'">
          <div class="d-flex flex-row custom-drawer-item"
               style="padding-top: 0;padding-bottom: 0;padding-right: 0;height: 43px">
            <div>{{ $t('groupSetting') }}</div>
            <v-spacer/>
            <div style="width: 1px;height: 100%;background-color: rgb(187, 187, 187)"></div>
            <v-menu offset-y bottom left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn text
                       v-bind="attrs"
                       style="border-right: none"
                       v-on="on">
                  <v-icon left size="16" color="#83829A">mdi-delete-alert</v-icon>
                  {{ $t('deleteGroup') }}
                </v-btn>
              </template>
              <v-card dense>
                <v-card-text>
                  {{ $t('confirmDeleteGroup') }}
                </v-card-text>
                <v-card-actions>
                  <v-spacer/>
                  <v-btn text @click="onDeleteUserClick" :loading="deleteGroupLoading" color="warning">{{
                      $t('confirm')
                    }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
            <div style="width: 1px;height: 100%;background-color: rgb(187, 187, 187)"></div>
            <v-btn text @click="onSaveUserClick">
              <v-icon left size="16" color="#83829A">mdi-content-save-all-outline</v-icon>
              {{ $t('save') }}
            </v-btn>
          </div>
          <div class="d-flex flex-row" style="flex-wrap: wrap;row-gap: 20px;column-gap: 20px;padding: 20px">
            <v-text-field v-model="showGroupInfo.name" :label="$t('groupName')" required/>
            <v-text-field v-model="showGroupInfo.type" :label="$t('type')"/>
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
            <div style="width: 1px;height: 100%;background-color: rgb(187, 187, 187)"></div>
            <v-menu
                v-model="deleteUserDialog.display"
                :close-on-content-click="false"
                :nudge-width="200"
                offset-x
            >
              <template #activator="{ on, attrs }">
                <v-btn text
                       v-bind="attrs"
                       v-on="on"
                       style="border-right: none">
                  <v-icon left size="16" color="#83829A">mdi-sticker-remove-outline</v-icon>
                  {{ $t('delete') }}
                </v-btn>
              </template>

              <v-card>
                <v-card-title class="small-headline">
                  {{ $t('deleteUser') }}
                </v-card-title>
                <v-card-text>
                  <div>{{ $t('confirmDeleteUser') }}</div>
                </v-card-text>
                <v-card-actions>
                  <v-spacer/>
                  <v-btn text @click="deleteUserDialog.display = false">
                    {{ $t('cancel') }}
                  </v-btn>
                  <v-btn
                      color="primary"
                      text
                      :loading="deleteUserDialog.commitLoading"
                      @click="onUsersDelete"
                  >
                    {{ $t('delete') }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
            <div style="width: 1px;height: 100%;background-color: rgb(187, 187, 187)"></div>
            <v-btn text @click="onAddGroupClick"
                   style="border-right: none">
              <v-icon left size="16" color="#83829A">mdi-plus</v-icon>
              {{ $t('add') }}
            </v-btn>
          </div>
          <el-table
              v-loading="users.loading"
              :data="users.items"
              style="width: auto"
              border
              stripe
              :max-height="tableMaxHeight"
              @selection-change="handleUserSelectionChange"
          >
            <el-table-column
                type="selection"
                width="55"/>
            <el-table-column label="id" prop="id"/>
            <el-table-column :label="$t('tableUser.firstName')" prop="firstName"/>
            <el-table-column :label="$t('tableUser.lastName')" prop="lastName"/>
            <el-table-column :label="$t('tableUser.email')" prop="email"/>
            <el-table-column :label="$t('tableUser.operate')">
              <template slot-scope="props">
                <v-menu
                    v-model="props.row.deleteMenu"
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
                      {{ $t('deleteUser') }}
                    </v-card-title>
                    <v-card-text>
                      <div>{{ $t('confirmDeleteUserWithName', {userName: props.row.name}) }}</div>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer/>
                      <v-btn text @click="props.row.deleteMenu = false">
                        {{ $t('cancel') }}
                      </v-btn>
                      <v-btn
                          color="primary"
                          text
                          @click="deleteUser(props.row)"
                      >
                        {{ $t('delete') }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </template>
            </el-table-column>
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
        <template v-if="tabSelect==='tenant'">
          <div class="d-flex flex-row custom-drawer-item"
               style="padding-top: 0;padding-bottom: 0;padding-right: 0;height: 43px">
            <div>{{ $t('belongTenant') }}</div>
            <v-spacer/>
            <div style="width: 1px;height: 100%;background-color: rgb(187, 187, 187)"></div>
            <v-btn text @click="searchTenantDialog.display=true" style="border-right: none">
              <v-icon left size="16" color="#83829A">mdi-filter</v-icon>
              {{ $t('filter') }}
            </v-btn>
            <div style="width: 1px;height: 100%;background-color: rgb(187, 187, 187)"></div>
            <v-menu
                v-model="deleteTenantDialog.display"
                :close-on-content-click="false"
                :nudge-width="200"
                offset-x
            >
              <template #activator="{ on, attrs }">
                <v-btn text
                       v-bind="attrs"
                       v-on="on"
                       style="border-right: none">
                  <v-icon left size="16" color="#83829A">mdi-sticker-remove-outline</v-icon>
                  {{ $t('delete') }}
                </v-btn>
              </template>

              <v-card>
                <v-card-title class="small-headline">
                  {{ $t('deleteTenant') }}
                </v-card-title>
                <v-card-text>
                  <div>{{ $t('confirmDeleteTenant') }}</div>
                </v-card-text>
                <v-card-actions>
                  <v-spacer/>
                  <v-btn text @click="deleteTenantDialog.display = false">
                    {{ $t('cancel') }}
                  </v-btn>
                  <v-btn
                      color="primary"
                      text
                      :loading="deleteTenantDialog.commitLoading"
                      @click="onTenantsDelete"
                  >
                    {{ $t('delete') }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
            <div style="width: 1px;height: 100%;background-color: rgb(187, 187, 187)"></div>
            <v-btn text @click="onAddTenantClick"
                   style="border-right: none">
              <v-icon left size="16" color="#83829A">mdi-plus</v-icon>
              {{ $t('add') }}
            </v-btn>
          </div>
          <el-table
              v-loading="tenants.loading"
              :data="tenants.items"
              style="width: auto"
              border
              stripe
              :max-height="tableMaxHeight"
              @selection-change="handleTenantSelectionChange"
          >
            <el-table-column
                type="selection"
                width="55"/>
            <el-table-column label="id" prop="id"/>
            <el-table-column :label="$t('name')" prop="name"/>
            <el-table-column :label="$t('tableAuth.operate')">
              <template slot-scope="props">
                <v-menu
                    v-model="props.row.deleteMenu"
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
                      {{ $t('deleteTenant') }}
                    </v-card-title>
                    <v-card-text>
                      <div>{{ $t('confirmDeleteTenantWithName',{tenantName:props.row.name}) }}</div>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer/>
                      <v-btn text @click="props.row.deleteMenu = false">
                        {{ $t('cancel') }}
                      </v-btn>
                      <v-btn
                          color="primary"
                          text
                          @click="deleteTenant(props.row)"
                      >
                        {{ $t('delete') }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </template>
            </el-table-column>
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
        </template>
        <template v-if="tabSelect==='auth'">
          <div class="d-flex flex-row custom-drawer-item"
               style="padding-top: 0;padding-bottom: 0;padding-right: 0;height: 43px">
            <div>{{ $t('authSet') }}</div>
            <v-spacer/>
            <div style="width: 1px;height: 100%;background-color: rgb(187, 187, 187)"></div>
            <v-menu bottom offset-y z-index="100">
              <template #activator="{ on, attrs }">
                <v-btn text
                       v-bind="attrs"
                       v-on="on"
                       style="border-right: none">
                  <v-icon left size="16" color="#83829A">mdi-filter</v-icon>
                  {{ $t('filter') }}
                </v-btn>
              </template>

              <v-list
                  style="cursor: pointer; padding: 0px 0px"
                  class="menu-list"
                  dense
              >
                <v-list-item
                    @click="setAuthFilter(resource.id)"
                    v-for="resource in addAuthDialog.types"
                    :key="`auth-filter-${resource.id}`"
                    style="min-height: 36px"
                >
                  <v-list-item-title
                      :class="{
                  current:
                    authFilter.resourceType === resource.id
                }"
                  >
                    {{ resource.name }}
                  </v-list-item-title
                  >
                </v-list-item>
                <v-list-item
                    @click="setAuthFilter(null)"
                    style="min-height: 36px"
                >
                  <v-list-item-title
                      :class="{
                  current:
                    !authFilter.resourceType&&authFilter.resourceType!==0
                }"
                  >
                    {{ $t('all') }}
                  </v-list-item-title
                  >
                </v-list-item>
              </v-list>
            </v-menu>
            <div style="width: 1px;height: 100%;background-color: rgb(187, 187, 187)"></div>
            <v-menu
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
                  <v-icon left size="16" color="#83829A">mdi-sticker-remove-outline</v-icon>
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
              <v-icon left size="16" color="#83829A">mdi-plus</v-icon>
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
            <el-table-column
                type="selection"
                width="55"/>
            <el-table-column :label="$t('authObject')" prop="resourceType">
              <template slot-scope="props">
                {{ parseResourceType(props.row) }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('tableAuth.authType')" prop="type"/>
            <el-table-column :label="$t('tableAuth.authScope')" prop="permissions"/>
            <el-table-column :label="$t('tableAuth.resource')" prop="resourceId"/>
            <el-table-column :label="$t('tableAuth.operate')">
              <template slot-scope="props">
                <v-icon color="#FF7754"
                        size="15"
                        @click="onAuthItemEditClick(props.row)"
                >mdi-note-edit-outline</v-icon>
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
            {{ $t('search') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="searchTenantDialog.display" width="431">
      <v-card>
        <v-card-title>
          {{ $t('filterTenant') }}
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="searchTenantDialog.form.name" :label="$t('name')" @keydown.enter="commitTenantSearch"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="resetSearchTenantDialog">
            <v-icon left>mdi-redo</v-icon>
            {{ $t('reset') }}
          </v-btn>
          <v-btn text :loading="searchTenantDialog.commitLoading" @click="commitTenantSearch">
            <v-icon left>mdi-magnify</v-icon>
            {{ $t('searchBtnTxt') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addUserDialog.display" width="700">
      <v-card>
        <v-card-title class="small-headline">
          {{ $t('user') }}
        </v-card-title>
        <v-card-text style="padding-bottom: 0;padding-top: 30px">
          <div class="d-flex flex-row" style="column-gap: 20px;margin-bottom: 10px">
            <v-text-field v-model="addUserDialog.form.id" label="id" hide-details
                          append-icon="mdi-magnify"
                          style="font-size: 14px"
                          dense
                          @click:append="commitAddUserSearch"/>
            <v-text-field v-model="addUserDialog.form.firstName" :label="$t('tableUser.firstName')" hide-details
                          append-icon="mdi-magnify"
                          style="font-size: 14px"
                          dense
                          @click:append="commitAddUserSearch"/>
            <v-text-field v-model="addUserDialog.form.lastName" :label="$t('tableUser.lastName')" hide-details
                          append-icon="mdi-magnify"
                          style="font-size: 14px"
                          dense
                          @click:append="commitAddUserSearch"/>
            <v-text-field v-model="addUserDialog.form.email" :label="$t('tableUser.email')" hide-details
                          append-icon="mdi-magnify"
                          style="font-size: 14px"
                          dense
                          @click:append="commitAddUserSearch"/>
          </div>
          <el-table
              v-loading="addUserDialog.loading"
              :data="addUserDialog.items"
              style="width: auto"
              :height="dialogTableMaxHeight"
              :max-height="dialogTableMaxHeight"
              stripe
              @selection-change="handleAddUserSelectionChange"
          >
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column label="id" prop="id"/>
            <el-table-column :label="$t('tableUser.firstName')" prop="firstName"/>
            <el-table-column :label="$t('tableUser.lastName')" prop="lastName"/>
            <el-table-column :label="$t('tableUser.email')" prop="email"/>
          </el-table>
          <div
              class="text-center mb-2 my-2"
              v-show="addUserDialog.pageCount > 1"
          >
            <v-pagination
                v-model="addUserDialog.page"
                :length="addUserDialog.pageCount"
                total-visible="10"
                color="#FF7754"
            />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text :loading="addUserDialog.commitLoading" @click="onUsersAdd">
            <v-icon left>mdi-plus</v-icon>
            {{ $t('add') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addTenantDialog.display" width="700">
      <v-card>
        <v-card-title class="small-headline">
          {{ $t('tenant') }}
        </v-card-title>
        <v-card-text style="padding-bottom: 0;padding-top: 30px">
          <div class="d-flex flex-row" style="column-gap: 20px;margin-bottom: 10px">
            <v-text-field v-model="addTenantDialog.form.name" :label="$t('tenantName')" hide-details
                          append-icon="mdi-magnify"
                          style="font-size: 14px"
                          dense
                          @click:append="commitAddTenantSearch"/>
            <v-spacer/>
            <v-spacer/>
            <v-spacer/>
          </div>
          <el-table
              v-loading="addTenantDialog.loading"
              :data="addTenantDialog.items"
              style="width: auto"
              :height="dialogTableMaxHeight"
              :max-height="dialogTableMaxHeight"
              stripe
              @selection-change="handleAddTenantSelectionChange"
          >
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column label="id" prop="id"/>
            <el-table-column :label="$t('tenantName')" prop="name"/>
          </el-table>
          <div
              class="text-center mb-2 my-2"
              v-show="addTenantDialog.pageCount > 1"
          >
            <v-pagination
                v-model="addTenantDialog.page"
                :length="addTenantDialog.pageCount"
                total-visible="10"
                color="#FF7754"
            />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text :loading="addTenantDialog.commitLoading" @click="onTenantsAdd">
            <v-icon left>mdi-plus</v-icon>
            {{ $t('add') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addAuthDialog.display" max-width="431">
      <v-card>
        <v-card-title>{{ $t('createAuth') }}</v-card-title>
        <v-card-text>
          <v-select
              v-model="addAuthDialog.form.resourceType"
              item-text="name"
              :label="$t('authObject')"
              item-value="id"
              hide-details
              :items="addAuthDialog.types"/>
          <v-text-field :label="$t('tableAuth.authType')" hide-details v-model="addAuthDialog.form.type" type="number"/>
          <v-text-field :label="$t('tableAuth.authScope')" hide-details v-model="addAuthDialog.form.permissions"/>
          <v-text-field :label="$t('tableAuth.resource')" hide-details v-model="addAuthDialog.form.resourceId"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="onResetAddAuth">
            <v-icon left>mdi-redo</v-icon>
            {{ $t('reset') }}
          </v-btn>
          <v-btn text :loading="addAuthDialog.commitLoading" @click="onAuthAddCommit">
            <v-icon left>mdi-plus</v-icon>
            {{ $t('create') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editAuthDialog.display" max-width="431">
      <v-card>
        <v-card-title>{{ $t('updateAuth') }}</v-card-title>
        <v-card-text>
          <v-text-field :label="$t('tableAuth.authScope')" hide-details v-model="editAuthDialog.form.permissions"/>
          <v-text-field :label="$t('tableAuth.resource')" hide-details v-model="editAuthDialog.form.resourceId"/>
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
  name: "GroupDetail",
  computed: {
    dialogTableMaxHeight() {
      let self = this;
      let showHeight = window.innerHeight * 0.9 - 70 - 58 - 52 - 30;
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
    this.breadcrumbs[0].text = this.$t("group");
    this.getData();
  },
  data() {
    return {
      breadcrumbs: [
        {
          text: "组",
          href: "#/admin/group/list",
        },
        {
          text: "",
          disabled: true,
        }
      ],
      currentItem: {
        name: "--",
        type: "--",
        userCount: 0,
        tenantCount: 0,
      },
      showGroupInfo: {
        name: "",
        type: "",
        commitLoading: false,
      },
      deleteGroupLoading: false,
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
      addUserDialog: {
        display: false,
        commitLoading: false,
        form: {
          id: "",
          firstName: "",
          lastName: "",
          email: "",
        },
        items: [],
        selection: [],
        filter: {},
        page: 0,
        pageCount: 0,
        itemsPerPage: 50,
        totalCount: 0,
        loading: true,
      },
      addTenantDialog: {
        display: false,
        commitLoading: false,
        form: {
          name: "",
        },
        items: [],
        selection: [],
        filter: {},
        page: 0,
        pageCount: 0,
        itemsPerPage: 50,
        totalCount: 0,
        loading: true,
      },
      userFilter: {},
      searchTenantDialog: {
        display: false,
        commitLoading: false,
        form: {
          name: "",
        }
      },
      addAuthDialog: {
        display: false,
        commitLoading: false,
        form: {
          type: null,
          permissions: "",
          resourceType: 0,
          resourceId: "",
        },
        types: [
          {id: 0, name: this.$t("app")},
          {id: 13, name: this.$t("batch")},
        ]
      },
      editAuthDialog: {
        display: false,
        commitLoading: false,
        form: {
          type: null,
          permissions: "",
          resourceType: 0,
          resourceId: "",
        },
      },
      deleteTenantDialog: {
        display: false,
        commitLoading: false,
      },
      deleteUserDialog: {
        display: false,
        commitLoading: false,
      },
      deleteAuthDialog: {
        display: false,
        commitLoading: false,
      },
      tenantFilter: {},
      tabSelect: "group",
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
      tenants: {
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
      authFilter: {
        resourceType: 0
      },
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
      let self = this;
      if (!item.resourceType && item.resourceType !== 0) {
        return "--";
      }
      let type = self.addAuthDialog.types.find(type => type.id === item.resourceType);
      if (type) {
        return type.name;
      } else {
        return item.resourceType;
      }
    },
    onResetAddAuth() {
      this.addAuthDialog.form = {
        type: null,
        permissions: "",
        resourceType: 0,
        resourceId: "",
      };
    },
    async onAuthAddCommit() {
      let self = this;
      if ((!self.addAuthDialog.form.type && self.addAuthDialog.form.type !== 0) ||
          !self.addAuthDialog.form.permissions || !self.addAuthDialog.form.resourceId) {
        self.$notify.error(self.$t("plsCompleteInfo"));
        return;
      }
      try {
        self.addAuthDialog.commitLoading = true;
        self.addAuthDialog.form.type = Number.parseInt(self.addAuthDialog.form.type);
        self.addAuthDialog.form.permissions = self.addAuthDialog.form.permissions.split(",");
        await userRequest.postCreateAuthorization(Object.assign(self.addAuthDialog.form, {
          groupId: self.currentItem.id
        }));
        self.$notify.success({title: self.$t("success"), message: self.$t("addAuthSuccessInfo")});
        self.addAuthDialog.display = false;
        await self.getAuths();
        let authCount = await userRequest.getAuthorizationCount(Object.assign({groupIdIn: self.currentItem.id}, self.authFilter));
        self.currentItem.authCount = authCount.count;
      } catch (err) {
        self.$notify.error(self.$t("addAuthSuccessErrorWithInfo",{msg:err.response.data.message}));
      } finally {
        self.addAuthDialog.commitLoading = false;
      }
    },
    onResetEditAuth() {
      this.editAuthDialog.form.permissions = "";
      this.editAuthDialog.form.resourceId = "";
    },
    async onAuthEditCommit() {
      let self = this;
      if ((!self.editAuthDialog.form.type && self.editAuthDialog.form.type !== 0) ||
          !self.editAuthDialog.form.permissions || !self.editAuthDialog.form.resourceId) {
        self.$notify.error(self.$t("plsCompleteInfo"));
        return;
      }
      try {
        self.editAuthDialog.commitLoading = true;
        self.editAuthDialog.form.permissions = self.editAuthDialog.form.permissions.split(",");
        await userRequest.putUpdateAuthorization(self.editAuthDialog.form.id, Object.assign(self.editAuthDialog.form, {
          groupId: self.currentItem.id
        }));
        self.$notify.success({title: self.$t("success"), message: self.$t("editAuthSuccessInfo")});
        self.editAuthDialog.display = false;
        self.getAuths();
      } catch (err) {
        console.log(err);
        self.$notify.error(self.$t("addAuthSuccessErrorWithInfo",{msg:err.response.data.message}));
      } finally {
        self.editAuthDialog.commitLoading = false;
      }
    },
    handleAddUserSelectionChange(val) {
      this.addUserDialog.selection = val;
    },
    handleAddTenantSelectionChange(val) {
      this.addTenantDialog.selection = val;
    },
    handleUserSelectionChange(val) {
      this.users.selection = val;
    },
    handleTenantSelectionChange(val) {
      this.tenants.selection = val;
    },
    handleAuthSelectionChange(val) {
      this.auths.selection = val;
    },
    async deleteUser(item) {
      let self = this;
      try {
        let response = await groupRequest.deleteGroupMember(
            self.currentItem.id, item.id
        );
        await self.getUsers();
        let userCount = await userRequest.getUserCount({memberOfGroup: self.currentItem.id});
        self.currentItem.userCount = userCount.count;
      } catch (error) {
        this.$message({
          message: this.$t("saveDeleteError"),
          type: "error",
          showClose:true
        });
        return;
      }
      item.deleteMenu = false;

      this.$message({
        message: this.$t("saveDeleteSuccess"),
        type: "success",
        showClose:true
      });
      await this.getUsers();
    },
    async deleteTenant(item) {
      let self = this;
      try {
        let response = await tenantRequest.deleteTenantGroupMembership(
            item.id, self.currentItem.id
        );
      } catch (error) {
        this.$message({
          message: this.$t("saveDeleteError"),
          type: "error",
          showClose:true
        });
        return;
      }
      item.deleteMenu = false;

      this.$message({
        message: this.$t("saveDeleteSuccess"),
        type: "success",
        showClose:true
      });
      await this.getTenants();
      let tenantCount = await tenantRequest.getTenantCount({groupMember: self.currentItem.id});
      self.currentItem.tenantCount = tenantCount.count;
    },
    setTableHeight() {
      let self = this;
      let height = self.$refs.resizeLayoutBottom.offsetHeight;
      let paginationHeight = 59.59;
      // 46为顶部操作按钮的高度
      height = height - 46;
      switch (self.tabSelect) {
        case "group":
          if (self.users.pageCount > 1) {
            height = height - paginationHeight;
          }
          break;
        case "tenant":
          if (self.tenants.pageCount > 1) {
            height = height - paginationHeight;
          }
          break;
        case "auth":
          if (self.auths.pageCount > 1) {
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
    resetSearchTenantDialog() {
      let self = this;
      self.searchTenantDialog.form = {
        name: "",
      };
    },
    async getUsers() {
      let self = this;
      self.users.loading = true;
      self.users.totalCount = 0;
      self.users.page = 0;
      let response = await userRequest.getUserCount(Object.assign({memberOfGroup: self.currentItem.id}, self.userFilter));
      self.users.totalCount = response.count;
      self.currentItem.userCount = response.count;
      self.currentItem.groupCount = response.count;
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
        memberOfGroup: self.currentItem.id
      };
      let users = await userRequest.getUsers(Object.assign(params, self.userFilter));
      self.users.items = users;
      self.users.loading = false;
    },
    async getAddUsers() {
      let self = this;
      self.addUserDialog.loading = true;
      self.addUserDialog.totalCount = 0;
      self.addUserDialog.page = 0;
      let response = await userRequest.getUserCount(self.addUserDialog.filter);
      self.addUserDialog.totalCount = response.count;
      self.addUserDialog.pageCount =
          Math.floor((response.count - 1) / self.addUserDialog.itemsPerPage) + 1;
      self.addUserDialog.page = 1;
    },
    async getAddUsersPage() {
      let self = this;
      self.addUserDialog.selection = [];
      self.addUserDialog.loading = true;
      if (!self.addUserDialog.page) {
        self.addUserDialog.items = [];
        return;
      }
      let params = {
        firstResult: (self.addUserDialog.page - 1) * this.addUserDialog.itemsPerPage,
        maxResults: self.addUserDialog.itemsPerPage,
      };
      let users = await userRequest.getUsers(Object.assign(params, self.addUserDialog.filter));
      self.addUserDialog.items = users;
      self.addUserDialog.loading = false;
    },
    async getAddTenants() {
      let self = this;
      self.addTenantDialog.loading = true;
      self.addTenantDialog.totalCount = 0;
      self.addTenantDialog.page = 0;
      let response = await tenantRequest.getTenantCount(self.addTenantDialog.filter);
      self.addTenantDialog.totalCount = response.count;
      self.addTenantDialog.pageCount =
          Math.floor((response.count - 1) / self.addTenantDialog.itemsPerPage) + 1;
      self.addTenantDialog.page = 1;
    },
    async getAddTenantsPage() {
      let self = this;
      self.addTenantDialog.selection = [];
      self.addTenantDialog.loading = true;
      if (!self.addTenantDialog.page) {
        self.addTenantDialog.items = [];
        return;
      }
      let params = {
        firstResult: (self.addTenantDialog.page - 1) * this.addTenantDialog.itemsPerPage,
        maxResults: self.addTenantDialog.itemsPerPage,
      };
      let users = await tenantRequest.getTenantList(Object.assign(params, self.addTenantDialog.filter));
      self.addTenantDialog.items = users;
      self.addTenantDialog.loading = false;
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
    async commitAddUserSearch() {
      let self = this;
      self.addUserDialog.filter = {};
      if (self.addUserDialog.form.firstName) {
        self.addUserDialog.filter["firstNameLike"] = `%${self.addUserDialog.form.firstName}%`;
      }
      if (self.addUserDialog.form.lastName) {
        self.addUserDialog.filter["lastNameLike"] = `%${self.addUserDialog.form.lastName}%`;
      }
      if (self.addUserDialog.form.email) {
        self.addUserDialog.filter["emailLike"] = `%${self.addUserDialog.form.email}%`;
      }
      if (self.addUserDialog.form.id) {
        self.addUserDialog.filter["id"] = self.addUserDialog.form.id;
      }
      await self.getAddUsers();
    },
    async commitAddTenantSearch() {
      let self = this;
      self.addTenantDialog.filter = {};
      if (self.addTenantDialog.form.name) {
        self.addTenantDialog.filter["nameLike"] = `%${self.addTenantDialog.form.name}%`;
      }
      await self.getAddTenants();
    },
    async getAuths() {
      let self = this;
      let authCount = await userRequest.getAuthorizationCount(Object.assign({groupIdIn: self.currentItem.id}, self.authFilter));
      self.currentItem.authCount = authCount.count;
      self.auths.loading = true;
      self.auths.totalCount = 0;
      self.auths.page = 0;
      let response = await userRequest.getAuthorizationCount(Object.assign({groupIdIn: self.currentItem.id}, self.authFilter));
      self.auths.totalCount = response.count;
      self.auths.pageCount =
          Math.floor((response.count - 1) / self.tenants.itemsPerPage) + 1;
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
        groupIdIn: self.currentItem.id
      };
      let users = await userRequest.getAuthorization(Object.assign(params, self.authFilter));
      self.auths.items = users;
      self.auths.loading = false;
    },
    async getTenants() {
      let self = this;
      self.tenants.loading = true;
      self.tenants.totalCount = 0;
      self.tenants.page = 0;
      let response = await tenantRequest.getTenantCount(Object.assign({groupMember: self.currentItem.id}, self.tenantFilter));
      self.tenants.totalCount = response.count;
      self.currentItem.tenantCount = response.count;
      self.tenants.pageCount =
          Math.floor((response.count - 1) / self.tenants.itemsPerPage) + 1;
      self.tenants.page = 1;
    },
    async getTenantsPage() {
      let self = this;
      self.tenants.selection = [];
      self.tenants.loading = true;
      if (!self.tenants.page) {
        self.tenants.items = [];
        return;
      }
      let params = {
        firstResult: (self.tenants.page - 1) * this.tenants.itemsPerPage,
        maxResults: self.tenants.itemsPerPage,
        groupMember: self.currentItem.id
      };
      let users = await tenantRequest.getTenantList(Object.assign(params, self.tenantFilter));
      self.tenants.items = users;
      self.tenants.loading = false;
    },
    async commitTenantSearch() {
      let self = this;
      self.tenantFilter = {};
      if (self.searchTenantDialog.form.name) {
        self.tenantFilter["nameLike"] = `%${self.searchTenantDialog.form.name}%`;
      }
      self.searchTenantDialog.commitLoading = true;
      await self.getTenants();
      self.searchTenantDialog.commitLoading = false;
      self.searchTenantDialog.display = false;
    },
    async getData() {
      let self = this;
      let row = await groupRequest.getGroup(this.$route.params.id);
      let userCount = await userRequest.getUserCount({memberOfGroup: row.id});
      userCount = userCount.count;
      let tenantCount = await tenantRequest.getTenantCount({groupMember: row.id});
      tenantCount = tenantCount.count;
      let authCount = await userRequest.getAuthorizationCount(Object.assign({groupIdIn: row.id}, self.authFilter));
      authCount = authCount.count;
      self.currentItem = Object.assign(row, {
        userCount: userCount, tenantCount, authCount
      });
      self.breadcrumbs[1].text = `${self.currentItem.id} ${self.currentItem.name ?? ""}`;
      self.showGroupInfo = {
        name: self.currentItem.name,
        type: self.currentItem.type,
      };
    },
    async onDeleteUserClick() {
      let self = this;
      self.deleteUserLoading = true;
      try {
        await groupRequest.DeleteGroup(self.currentItem.id);
        self.$message.success({message:self.$t("deleteSuccess"),showClose:true});
        self.$router.back();
      } catch (e) {
        self.$message.error({message:self.$t("deleteError"),showClose:true});
      } finally {
        self.deleteUserLoading = false;
      }
    },
    async onSaveUserClick() {
      let self = this;
      self.showGroupInfo.commitLoading = true;
      try {
        await groupRequest.putUpdateGroup(self.currentItem.id, {
          id: self.currentItem.id,
          name: self.showGroupInfo.name,
          type: self.showGroupInfo.type,
        });
        self.$message.success({message:self.$t("saveSuccess"),showClose:true});
        self.currentItem.name = self.showGroupInfo.name;
        self.currentItem.type = self.showGroupInfo.type;
      } catch (e) {
        self.$message.error({message:self.$t("saveError"),showClose:true});
      } finally {
        self.showGroupInfo.commitLoading = false;
      }
    },
    async onUsersDelete() {
      let self = this;
      if (self.users.selection.length === 0) {
        self.$message.error({message:self.$t("plsSelectUser"),showClosetrue});
        return;
      }
      self.deleteUserDialog.commitLoading = true;
      try {
        let result = await Promise.all(self.users.selection.map(group => {
          return groupRequest.deleteGroupMember(self.currentItem.id, group.id);
        }));
        self.deleteUserDialog.display = false;
        await self.getUsers();
        let userCount = await userRequest.getUserCount({memberOfGroup: self.currentItem.id});
        self.currentItem.userCount = userCount.count;
      } catch (e) {
        self.$notify.error(self.$t("deleteUserError"));
      } finally {
        self.deleteUserDialog.commitLoading = false;
      }
    },
    async onTenantsDelete() {
      let self = this;
      if (self.tenants.selection.length === 0) {
        self.$notify.error(self.$t("plsSelectTenant"));
        return;
      }
      self.deleteTenantDialog.commitLoading = true;
      try {
        let result = await Promise.all(self.tenants.selection.map(group => {
          return tenantRequest.deleteTenantGroupMembership(group.id, self.currentItem.id);
        }));
        self.deleteTenantDialog.display = false;
        await self.getTenants();
        let tenantCount = await tenantRequest.getTenantCount({groupMember: self.currentItem.id});
        self.currentItem.tenantCount = tenantCount.count;
      } catch (e) {
        self.$notify.error(self.$t("deleteTenantError"));
      } finally {
        self.deleteTenantDialog.commitLoading = false;
      }
    },
    async onAuthsDelete() {
      let self = this;
      if (self.auths.selection.length === 0) {
        self.$notify.error(self.$t("plsSelectAuth"));
        return;
      }
      self.deleteAuthDialog.commitLoading = true;
      try {
        let result = await Promise.all(self.auths.selection.map(group => {
          return userRequest.delAuthorization(group.id);
        }));
        self.deleteAuthDialog.display = false;
        await self.getAuths();
        let authCount = await userRequest.getAuthorizationCount(Object.assign({groupIdIn: self.currentItem.id}, self.authFilter));
        self.currentItem.authCount = authCount.count;
      } catch (e) {
        self.$notify.error(self.$t("deleteAuthError"));
      } finally {
        self.deleteAuthDialog.commitLoading = false;
      }
    },
    async onUsersAdd() {
      let self = this;
      if (self.addUserDialog.selection.length === 0) {
        self.$notify.error(self.$t("plsSelectUser"));
        return;
      }
      self.addUserDialog.commitLoading = true;
      Promise.all(self.addUserDialog.selection.map(group => {
        return groupRequest.putCreateGroupMember(self.currentItem.id, group.id);
      }))
          .then(() => {
            self.addUserDialog.display = false;
          })
          .catch((e) => {
            self.$notify.error(self.$t("addPartOfUserErrorWithMsg",{msg:e.response.data.message}));
          })
          .finally(async () => {
            await self.getUsers();
            let userCount = await userRequest.getUserCount({memberOfGroup: self.currentItem.id});
            self.currentItem.userCount = userCount.count;
            self.addUserDialog.commitLoading = false;
          });
    },
    async onTenantsAdd() {
      let self = this;
      if (self.addTenantDialog.selection.length === 0) {
        self.$notify.error(self.$t("plsSelectTenant"));
        return;
      }
      self.addTenantDialog.commitLoading = true;
      Promise.all(self.addTenantDialog.selection.map(group => {
        return tenantRequest.createTenantGroupMembership(group.id, self.currentItem.id);
      }))
          .then(() => {
            self.addTenantDialog.display = false;
          })
          .catch((e) => {
            self.$notify.error(self.$t("addPartOfTenantErrorWithMsg",{msg:e.response.data.message}));
          })
          .finally(async () => {
            await self.getTenants();
            let tenantCount = await tenantRequest.getTenantCount({groupMember: self.currentItem.id});
            self.currentItem.tenantCount = tenantCount.count;
            self.addTenantDialog.commitLoading = false;
          });
    },
    onAddGroupClick() {
      let self = this;
      self.addUserDialog.display = true;
      self.getAddUsers();
    },
    onAddTenantClick() {
      let self = this;
      self.addTenantDialog.display = true;
      self.getAddTenants();
    },
    onAddAuthClick() {
      let self = this;
      self.addAuthDialog.display = true;
      self.onResetAddAuth();
    },
    onUserTabClick() {
      let self = this;
      self.tabSelect = "user";
      self.getUsers();
      self.$nextTick(() => {
        self.setTableHeight();
      });
    },
    onTenantTabClick() {
      let self = this;
      self.tabSelect = "tenant";
      self.getTenants();
      self.$nextTick(() => {
        self.setTableHeight();
      });
    },
    onAuthTabClick() {
      let self = this;
      self.tabSelect = "auth";
      self.getAuths();
      self.$nextTick(() => {
        self.setTableHeight();
      });
    },
    onAuthItemEditClick(item) {
      let self = this;
      self.editAuthDialog.form = {
        id: item.id,
        permissions: item.permissions.join(","),
        resourceId: item.resourceId,
        resourceType: item.resourceType,
        type: item.type,
        groupId: item.groupId,
        userId: item.userId,
        removalTime: item.removalTime,
        rootProcessInstanceId: item.rootProcessInstanceId
      };
      self.editAuthDialog.display = true;
    },
  },
  watch: {
    "$i18n.locale": {
      handler(val){
        this.breadcrumbs[0].text=this.$t("group");
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
    "addUserDialog.page": {
      handler() {
        this.getAddUsersPage();
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
    "addTenantDialog.page": {
      handler() {
        this.getAddTenantsPage();
      },
    },
  }
};
</script>
<style scoped>
.v-list--dense.menu-list .v-list-item .v-list-item__title.current {
  font-weight: bold;
  color: #B1ABB6;
}

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
