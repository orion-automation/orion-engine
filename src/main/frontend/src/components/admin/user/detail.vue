<template>
  <div class="d-flex flex-column" style="width: 100%;height: 100%;border-top: 1px solid rgb(187, 187, 187)">
    <div class="d-flex flex-row"
         style="width: 100%;padding: 14px 15px;font-size: 13px;color: #312651;align-items: center;justify-items: center">
      <v-breadcrumbs :items="breadcrumbs" style="background-color: #e8eff7;padding: 0;border: none" divider="|"/>
    </div>
    <div class="d-flex flex-row" style="width: 100%;height: 0;flex: 1">
      <v-navigation-drawer v-model="drawerOpen" :width="drawerOpen?256:0" mobile-breakpoint="0">
        <div class="d-flex flex-row custom-drawer-item" @click="tabSelect='user'"
             :class="tabSelect==='user'?'custom-drawer-item-selected':''">
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
        <div class="d-flex flex-row custom-drawer-item" style="border-bottom: none"
             :class="tabSelect==='group'?'custom-drawer-item-selected':''"
             @click="onGroupTabClick">
          <v-icon class="custom-drawer-item-icon" size="18" color="#444262">mdi-select-group</v-icon>
          {{ $t('group') }}
          <v-spacer/>
          <v-chip color="#E6E4E6" x-small>{{ currentItem.groupCount }}</v-chip>
        </div>
        <div class="d-flex flex-row custom-drawer-item" style="border-bottom: none"
             :class="tabSelect==='tenant'?'custom-drawer-item-selected':''"
             @click="onTenantTabClick">
          <v-icon class="custom-drawer-item-icon" size="18" color="#444262">mdi-cube-scan</v-icon>
          {{ $t('tenant') }}
          <v-spacer/>
          <v-chip color="#E6E4E6" x-small>{{ currentItem.tenantCount }}</v-chip>
        </div>
        <div class="d-flex flex-row custom-drawer-item"
             :class="tabSelect==='auth'?'custom-drawer-item-selected':''"
             @click="onAuthTabClick">
          <v-icon class="custom-drawer-item-icon" size="18" color="#444262">mdi-cloud-lock-outline</v-icon>
          {{ $t('hasAuth') }}
          <v-spacer/>
          <v-chip color="#E6E4E6" x-small>{{ currentItem.authCount }}</v-chip>
        </div>
      </v-navigation-drawer>
      <div
          class="d-flex flex-column" style="width: 0;flex: 1;height: 100%;background-color: white"
          ref="resizeLayoutBottom"
      >
        <template v-if="tabSelect==='user'">
          <div class="d-flex flex-row custom-drawer-item"
               style="padding-top: 0;padding-bottom: 0;padding-right: 0;height: 43px">
            <div>{{ $t('userAccountSetting') }}</div>
            <v-spacer/>
            <div style="width: 0.5px;height: 100%;background-color: rgb(187, 187, 187);border: none"></div>
            <v-btn text @click="onResetPasswordClick" style="border-right: none">
              <v-icon left size="16" color="#83829A">mdi-form-textbox-password</v-icon>
              {{ $t('resetPassword') }}
            </v-btn>
            <div style="width: 1px;height: 100%;background-color: rgb(187, 187, 187)"></div>
            <v-menu offset-y bottom left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn text
                       v-bind="attrs"
                       style="border-right: none"
                       v-on="on">
                  <v-icon left size="16" color="#83829A">mdi-delete-alert</v-icon>
                  {{ $t('deleteUser') }}
                </v-btn>
              </template>
              <v-card dense>
                <v-card-text>
                  {{ $t('confirmDeleteCurrentUser') }}
                </v-card-text>
                <v-card-actions>
                  <v-spacer/>
                  <v-btn text @click="onDeleteUserClick" :loading="deleteUserLoading" color="warning">{{ $t('confirm') }}</v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
            <div style="width: 1px;height: 100%;background-color: rgb(187, 187, 187)"></div>
            <v-menu offset-y bottom left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn text
                       v-bind="attrs"
                       style="border-right: none"
                       v-on="on">
                  <v-icon left size="16" color="#83829A">mdi-lock-alert-outline</v-icon>
                  {{ $t('unLock') }}
                </v-btn>
              </template>
              <v-card dense>
                <v-card-text>
                  {{ $t('confirmUnLockUser') }}
                </v-card-text>
                <v-card-actions>
                  <v-spacer/>
                  <v-btn text @click="onUnlockUserClick" :loading="unlockUserLoading" color="warning">{{ $t('confirm') }}</v-btn>
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
            <v-text-field v-model="showUserInfo.firstName" :label="$t('tableUser.firstName')"/>
            <v-text-field v-model="showUserInfo.lastName" :label="$t('tableUser.lastName')"/>
            <v-text-field v-model="showUserInfo.email" :label="$t('tableUser.email')"/>
          </div>
        </template>
        <template v-if="tabSelect==='group'">
          <div class="d-flex flex-row custom-drawer-item"
               style="padding-top: 0;padding-bottom: 0;padding-right: 0;height: 43px">
            <div>{{ $t('groupSetting') }}</div>
            <v-spacer/>
            <div style="width: 1px;height: 100%;background-color: rgb(187, 187, 187)"></div>
            <v-btn text @click="searchGroupDialog.display=true" style="border-right: none">
              <v-icon left size="16" color="#83829A">mdi-filter</v-icon>
              {{ $t('filter') }}
            </v-btn>
            <div style="width: 1px;height: 100%;background-color: rgb(187, 187, 187)"></div>
            <v-menu
                v-model="deleteGroupDialog.display"
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
                  {{ $t('deleteGroup') }}
                </v-card-title>
                <v-card-text>
                  <div>{{ $t('confirmDeleteSelectGroup') }}</div>
                </v-card-text>
                <v-card-actions>
                  <v-spacer/>
                  <v-btn text @click="deleteGroupDialog.display = false">
                    {{ $t('cancel') }}
                  </v-btn>
                  <v-btn
                      color="primary"
                      text
                      :loading="deleteGroupDialog.commitLoading"
                      @click="onGroupsDelete"
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
              v-loading="groups.loading"
              :data="groups.items"
              style="width: auto"
              border
              stripe
              :max-height="tableMaxHeight"
              @selection-change="handleGroupSelectionChange"
          >
            <el-table-column
                type="selection"
                width="55"/>
            <el-table-column label="id" prop="id"/>
            <el-table-column :label="$t('groupName')" prop="name"/>
            <el-table-column :label="$t('type')" prop="type"/>
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
                      {{ $t('deleteGroup') }}
                    </v-card-title>
                    <v-card-text>
                      <div>{{ $t('confirmDeleteGroupWithName',{groupName:props.row.name}) }}</div>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer/>
                      <v-btn text @click="props.row.deleteMenu = false">
                        {{ $t('cancel') }}
                      </v-btn>
                      <v-btn
                          color="primary"
                          text
                          @click="deleteGroup(props.row)"
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
        <template v-if="tabSelect==='tenant'">
          <div class="d-flex flex-row custom-drawer-item"
               style="padding-top: 0;padding-bottom: 0;padding-right: 0;height: 43px">
            <div>{{ $t('tenantSetting') }}</div>
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
    <v-dialog v-model="resetPasswordDialog.display" width="431">
      <v-card>
        <v-card-title>
          {{ $t('resetPassword') }}
        </v-card-title>
        <v-card-text>
          <div class="subtitle-2">{{ $t('accountInfo') }}</div>
          <v-form>
            <v-text-field v-model="resetPasswordDialog.form.ownerPassword" :label="$t('plsInputYourPassword')" hide-details
                          type="password"/>
            <v-text-field v-model="resetPasswordDialog.form.password" :label="$t('plsInputCurrentUserNewPassword')" hide-details
                          type="password"/>
            <v-text-field
                v-model="resetPasswordDialog.form.passwordReInput" :label="$t('plsInputNewPasswordAgain')" type="password"
                hide-details
            />
            <div
                v-if="resetPasswordDialog.error.accountInfo.display" class="caption d-flex flex-row"
                style="align-items: center;padding: 15px 0"
            >
              <v-icon left color="#FF7754" x-small>mdi-alert-circle-outline</v-icon>
              {{ resetPasswordDialog.error.accountInfo.msg }}
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text :loading="resetPasswordDialog.commitLoading" :disabled="!resetPasswordCommitDisabled"
                 @click="commitResetPassword">
            <v-icon left color="#FF7754">mdi-check</v-icon>
            更新
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
          <v-text-field v-model="searchGroupDialog.form.name" :label="$t('name')"/>
          <v-text-field v-model="searchGroupDialog.form.type" label="类型"/>
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
    <v-dialog v-model="addGroupDialog.display" width="700">
      <v-card>
        <v-card-title class="small-headline">
          {{ $t('group') }}
        </v-card-title>
        <v-card-text style="padding-bottom: 0;padding-top: 30px">
          <div class="d-flex flex-row" style="column-gap: 20px;margin-bottom: 10px">
            <v-text-field v-model="addGroupDialog.form.name" :label="$t('groupName')" hide-details
                          append-icon="mdi-magnify"
                          style="font-size: 14px"
                          dense
                          @click:append="commitAddGroupSearch"/>
            <v-text-field v-model="addGroupDialog.form.type" :label="$t('groupType')" hide-details
                          append-icon="mdi-magnify"
                          style="font-size: 14px"
                          dense
                          @click:append="commitAddGroupSearch"/>
            <v-spacer/>
            <v-spacer/>
          </div>
          <el-table
              v-loading="addGroupDialog.loading"
              :data="addGroupDialog.items"
              style="width: auto"
              :height="dialogTableMaxHeight"
              :max-height="dialogTableMaxHeight"
              stripe
              @selection-change="handleAddGroupSelectionChange"
          >
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column label="id" prop="id"/>
            <el-table-column :label="$t('groupName')" prop="name"/>
            <el-table-column :label="$t('type')" prop="type"/>
          </el-table>
          <div
              class="text-center mb-2 my-2"
              v-show="addGroupDialog.pageCount > 1"
          >
            <v-pagination
                v-model="addGroupDialog.page"
                :length="addGroupDialog.pageCount"
                total-visible="10"
                color="#FF7754"
            />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text :loading="addGroupDialog.commitLoading" @click="onGroupsAdd">
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
                          dense
                          style="font-size: 14px"
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
  name: "UserDetail",
  computed: {
    resetPasswordCommitDisabled() {
      let self = this;
      return self.resetPasswordDialog.form.ownerPassword && self.resetPasswordDialog.form.password && self.resetPasswordDialog.form.password === self.resetPasswordDialog.form.passwordReInput;
    },
    dialogTableMaxHeight() {
      let self = this;
      let showHeight = window.innerHeight * 0.9 - 70 - 58 - 52 - 30;
      switch (self.tabSelect) {
        case "group":
          if (self.addGroupDialog.pageCount > 1) {
            showHeight = showHeight - 44;
          }
          break;
        case "tenant":
          if (self.addGroupDialog.pageCount > 1) {
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
          text: this.$t("user"),
          href: "#/admin/user/list",
        },
        {
          text: "",
          disabled: true,
        }
      ],
      currentItem: {
        firstName: "--",
        lastName: "--",
        email: "--",
        groupCount: 0,
        tenantCount: 0,
      },
      showUserInfo: {
        firstName: "",
        lastName: "",
        email: "",
        commitLoading: false,
      },
      deleteUserLoading: false,
      unlockUserLoading: false,
      tableMaxHeight: "10",
      drawerOpen: true,
      searchGroupDialog: {
        display: false,
        commitLoading: false,
        form: {
          name: "",
          type: "",
        }
      },
      addGroupDialog: {
        display: false,
        commitLoading: false,
        form: {
          name: "",
          type: "",
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
      groupFilter: {},
      searchTenantDialog: {
        display: false,
        commitLoading: false,
        form: {
          name: "",
        }
      },
      deleteTenantDialog: {
        display: false,
        commitLoading: false,
      },
      deleteGroupDialog: {
        display: false,
        commitLoading: false,
      },
      deleteAuthDialog: {
        display: false,
        commitLoading: false,
      },
      tenantFilter: {},
      resetPasswordDialog: {
        display: false,
        commitLoading: false,
        form: {
          ownerPassword: "",
          password: "",
          passwordReInput: "",
        },
        error: {
          userInfo: {display: false, msg: ""},
          accountInfo: {display: false, msg: ""},
        }
      },
      tabSelect: "user",
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
          userId: self.currentItem.id
        }));
        self.$notify.success({title: self.$t("success"), message: self.$t("addAuthSuccessInfo")});
        self.addAuthDialog.display = false;
        await self.getAuths();
        let authCount = await userRequest.getAuthorizationCount(Object.assign({userIdIn: self.currentItem.id},self.authFilter));
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
          userId: self.currentItem.id
        }));
        self.$notify.success({title: self.$t("success"), message: self.$t("editAuthSuccessInfo")});
        self.editAuthDialog.display = false;
        await self.getAuths();
      } catch (err) {
        console.log(err);
        self.$notify.error(self.$t("addAuthSuccessErrorWithInfo",{msg:err.response.data.message}));
      } finally {
        self.editAuthDialog.commitLoading = false;
      }
    },
    handleAddGroupSelectionChange(val) {
      this.addGroupDialog.selection = val;
    },
    handleAddTenantSelectionChange(val) {
      this.addTenantDialog.selection = val;
    },
    handleGroupSelectionChange(val) {
      this.groups.selection = val;
    },
    handleTenantSelectionChange(val) {
      this.tenants.selection = val;
    },
    handleAuthSelectionChange(val) {
      this.auths.selection = val;
    },
    async deleteGroup(item) {
      let self = this;
      try {
        let response = await groupRequest.deleteGroupMember(
            item.id, self.currentItem.id
        );
        await self.getGroups();
        let groupCount = await userRequest.getGroupCount({member: self.currentItem.id});
        self.currentItem.groupCount = groupCount.count;
      } catch (error) {
        this.$notify.error(this.$t("saveDeleteError"));
        return;
      }
      item.deleteMenu = false;

      this.$notify.success(this.$t("saveDeleteSuccess"));
      await this.getGroups();
    },
    async deleteTenant(item) {
      let self = this;
      try {
        let response = await tenantRequest.deleteTenantUserMembership(
            item.id, self.currentItem.id
        );
      } catch (error) {
        this.$message({
          showClose: true,
          message: this.$t("saveDeleteError"),
          type: "error",
        });
        return;
      }
      item.deleteMenu = false;

      this.$message({
        showClose: true,
        message: this.$t("saveDeleteSuccess"),
        type: "success",
      });
      await this.getTenants();
      let { count } = await userRequest.getTenantCount({userMember: self.currentItem.id});
      self.currentItem.tenantCount = count;
    },
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
    resetSearchGroupDialog() {
      let self = this;
      self.searchGroupDialog.form = {
        name: "",
        type: ""
      };
    },
    resetSearchTenantDialog() {
      let self = this;
      self.searchTenantDialog.form = {
        name: "",
      };
    },
    async getGroups() {
      let self = this;
      self.groups.loading = true;
      self.groups.totalCount = 0;
      self.groups.page = 0;
      let response = await groupRequest.getGroupCount(Object.assign({member: self.currentItem.id}, self.groupFilter));
      self.groups.totalCount = response.count;
      self.currentItem.groupCount = response.count;
      ;
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
        member: self.currentItem.id
      };
      let users = await userRequest.getGroupList(Object.assign(params, self.groupFilter));
      self.groups.items = users;
      self.groups.loading = false;
    },
    async getAddGroups() {
      let self = this;
      self.addGroupDialog.loading = true;
      self.addGroupDialog.totalCount = 0;
      self.addGroupDialog.page = 0;
      let response = await groupRequest.getGroupCount(self.addGroupDialog.filter);
      self.addGroupDialog.totalCount = response.count;
      self.addGroupDialog.pageCount =
          Math.floor((response.count - 1) / self.addGroupDialog.itemsPerPage) + 1;
      self.addGroupDialog.page = 1;
    },
    async getAddGroupsPage() {
      let self = this;
      self.addGroupDialog.selection = [];
      self.addGroupDialog.loading = true;
      if (!self.addGroupDialog.page) {
        self.addGroupDialog.items = [];
        return;
      }
      let params = {
        firstResult: (self.addGroupDialog.page - 1) * this.addGroupDialog.itemsPerPage,
        maxResults: self.addGroupDialog.itemsPerPage,
      };
      let users = await groupRequest.getGroupList(Object.assign(params, self.addGroupDialog.filter));
      self.addGroupDialog.items = users;
      self.addGroupDialog.loading = false;
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
    async commitGroupSearch() {
      let self = this;
      self.groupFilter = {};
      if (self.searchGroupDialog.form.name) {
        self.groupFilter["nameLike"] = `%${self.searchGroupDialog.form.name}%`;
      }
      if (self.searchGroupDialog.form.type) {
        self.groupFilter["type"] = self.searchGroupDialog.form.type;
      }
      self.searchGroupDialog.commitLoading = true;
      await self.getGroups();
      self.searchGroupDialog.commitLoading = false;
      self.searchGroupDialog.display = false;
    },
    async commitAddGroupSearch() {
      let self = this;
      self.addGroupDialog.filter = {};
      if (self.addGroupDialog.form.name) {
        self.addGroupDialog.filter["nameLike"] = `%${self.addGroupDialog.form.name}%`;
      }
      if (self.addGroupDialog.form.type) {
        self.addGroupDialog.filter["type"] = self.addGroupDialog.form.type;
      }
      await self.getAddGroups();
    },
    async commitAddTenantSearch() {
      let self = this;
      self.addTenantDialog.filter = {};
      if (self.addTenantDialog.form.name) {
        self.addTenantDialog.filter["nameLike"] = `%${self.addTenantDialog.form.name}%`;
      }
      await self.getAddTenants();
    },
    async getTenants() {
      let self = this;
      self.tenants.loading = true;
      self.tenants.totalCount = 0;
      self.tenants.page = 0;
      let response = await tenantRequest.getTenantCount(Object.assign({userMember: self.currentItem.id}, self.tenantFilter));
      self.tenants.totalCount = response.count;
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
        userMember: self.currentItem.id
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
    async getAuths() {
      let self = this;
      let authCount = await userRequest.getAuthorizationCount(Object.assign({userIdIn: self.currentItem.id},self.authFilter));
      self.currentItem.authCount = authCount.count;
      self.auths.loading = true;
      self.auths.totalCount = 0;
      self.auths.page = 0;
      let response = await userRequest.getAuthorizationCount(Object.assign({userIdIn: self.currentItem.id}, self.authFilter));
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
        userIdIn: self.currentItem.id
      };
      let users = await userRequest.getAuthorization(Object.assign(params, self.authFilter));
      self.auths.items = users;
      self.auths.loading = false;
    },
    onResetPasswordClick() {
      let self = this;
      self.resetPasswordDialog.form = {
        ownerPassword: "",
        password: "",
        passwordReInput: "",
      };
      self.resetPasswordDialog.error.accountInfo.display = false;
      self.resetPasswordDialog.error.accountInfo.msg = "";
      self.resetPasswordDialog.display = true;
    },
    async commitResetPassword() {
      let self = this;
      self.resetPasswordDialog.commitLoading = true;
      try {
        await userRequest.putUpdateUserCredentials(self.currentItem.id, {
          password: self.resetPasswordDialog.form.password,
          authenticatedUserPassword: self.resetPasswordDialog.form.ownerPassword,
        });
        self.resetPasswordDialog.display = false;
        self.$notify.success(self.$t("resetPasswordSuccess"));
        self.resetPasswordDialog.error.accountInfo.display = false;
      } catch (err) {
        self.resetPasswordDialog.error.accountInfo.display = true;
        self.resetPasswordDialog.error.accountInfo.msg = err.response.data.message;
      } finally {
        self.resetPasswordDialog.commitLoading = false;
      }
    },
    async getData() {
      let self = this;
      let row = await userRequest.getProfile(this.$route.params.id);
      let groupCount = await userRequest.getGroupCount({member: row.id});
      groupCount = groupCount.count;
      let tenantCount = await userRequest.getTenantCount({userMember: row.id});
      tenantCount = tenantCount.count;
      let authCount = await userRequest.getAuthorizationCount(Object.assign({userIdIn: row.id},self.authFilter));
      authCount = authCount.count;
      self.currentItem = Object.assign(row, {
        groupCount, tenantCount, authCount
      });
      self.breadcrumbs[1].text = `${self.currentItem.id} ${self.currentItem.firstName ?? ""} ${self.currentItem.lastName ?? ""}`;
      self.showUserInfo = {
        firstName: self.currentItem.firstName,
        lastName: self.currentItem.lastName,
        email: self.currentItem.email,
      };
    },
    async onDeleteUserClick() {
      let self = this;
      self.deleteUserLoading = true;
      try {
        await userRequest.deleteUser(self.currentItem.id);
        self.$message.success({message:self.$t("deleteSuccess"),showClose:true});
        self.$router.back();
      } catch (e) {
        self.$message.error({message:self.$t("deleteError"),showClose:true});
      } finally {
        self.deleteUserLoading = false;
      }
    },
    async onUnlockUserClick() {
      let self = this;
      self.unlockUserLoading = true;
      try {
        await userRequest.postUnlockUser(self.currentItem.id);
        self.$message.success({message:self.$t("unLockSuccess"),showClose:true});
        await self.getData();
      } catch (e) {
        self.$message.error({message:self.$t("unLockError"),showClose:true});
      } finally {
        self.unlockUserLoading = false;
      }
    },
    async onSaveUserClick() {
      let self = this;
      self.showUserInfo.commitLoading = true;
      try {
        await userRequest.putProfile(self.currentItem.id, {
          id: self.currentItem.id,
          firstName: self.showUserInfo.firstName,
          lastName: self.showUserInfo.lastName,
          email: self.showUserInfo.email,
        });
        self.$notify.success(self.$t("saveSuccess"));
        self.currentItem.firstName = self.showUserInfo.firstName;
        self.currentItem.lastName = self.showUserInfo.lastName;
        self.currentItem.email = self.showUserInfo.email;
      } catch (e) {
        self.$notify.error(self.$t("saveError"));
      } finally {
        self.showUserInfo.commitLoading = false;
      }
    },
    async onGroupsDelete() {
      let self = this;
      if (self.groups.selection.length === 0) {
        self.$notify.error(self.$t("plsSelectGroup"));
        return;
      }
      self.deleteGroupDialog.commitLoading = true;
      try {
        let result = await Promise.all(self.groups.selection.map(group => {
          return groupRequest.deleteGroupMember(group.id, self.currentItem.id);
        }));
        console.log(result);
        self.deleteGroupDialog.display = false;
        await self.getGroups();
        let groupCount = await userRequest.getGroupCount({member: self.currentItem.id});
        self.currentItem.groupCount = groupCount.count;
      } catch (e) {
        self.$notify.error(self.$t("deleteGroupError"));
      } finally {
        self.deleteGroupDialog.commitLoading = false;
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
          return tenantRequest.deleteTenantUserMembership(group.id, self.currentItem.id);
        }));
        console.log(result);
        self.deleteTenantDialog.display = false;
        await self.getTenants();
        let { count } = await userRequest.getTenantCount({userMember: self.currentItem.id});
        self.currentItem.tenantCount = count;
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
        let authCount = await userRequest.getAuthorizationCount(Object.assign({userIdIn: self.currentItem.id},self.authFilter));
        self.currentItem.authCount = authCount.count;
      } catch (e) {
        self.$notify.error(self.$t("deleteAuthError"));
      } finally {
        self.deleteAuthDialog.commitLoading = false;
      }
    },
    async onGroupsAdd() {
      let self = this;
      if (self.addGroupDialog.selection.length === 0) {
        self.$notify.error(self.$t("plsSelectGroup"));
        return;
      }
      self.addGroupDialog.commitLoading = true;
      Promise.all(self.addGroupDialog.selection.map(group => {
        return groupRequest.putCreateGroupMember(group.id, self.currentItem.id);
      }))
          .then(() => {
            self.addGroupDialog.display = false;
          })
          .catch((e) => {
            self.$notify.error(self.$t("addPartOfGroupErrorWithMsg",{msg:e.response.data.message}));
          })
          .finally(async () => {
            self.getGroups();
            self.addGroupDialog.commitLoading = false;
            let groupCount = await userRequest.getGroupCount({member: self.currentItem.id});
            self.currentItem.groupCount = groupCount.count;
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
        return tenantRequest.putCreateTenantUserMembership(group.id, self.currentItem.id);
      }))
          .then(() => {
            self.addTenantDialog.display = false;
          })
          .catch((e) => {
            self.$notify.error(self.$t("addPartOfTenantErrorWithMsg",{msg:e.response.data.message}));
          })
          .finally(async () => {
            self.getTenants();
            self.addTenantDialog.commitLoading = false;
            let { count } = await userRequest.getTenantCount({userMember: self.currentItem.id});
            self.currentItem.tenantCount = count;
          });
    },
    onAddGroupClick() {
      let self = this;
      self.addGroupDialog.display = true;
      self.getAddGroups();
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
    onGroupTabClick() {
      let self = this;
      self.tabSelect = "group";
      self.getGroups();
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
        this.breadcrumbs[0].text=this.$t("user");
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
    "addGroupDialog.page": {
      handler() {
        this.getAddGroupsPage();
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
</style>
