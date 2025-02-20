<template>
  <div style="border-top: 1px solid rgba(187, 187, 187, 1);height: 100%" class="d-flex flex-column">
    <div style="padding: 14px 15px">
      <v-breadcrumbs
          class="id-breadcrumbs"
          :items="idBreadcrumbs"
          style="background-color: #e8eff7; padding: 0px; border: none"
          divider="|"
      />
    </div>
    <v-card class="detail-card" style="border-top: 1px solid rgba(187, 187, 187, 1);flex: 1;height: 0">
      <div class="d-flex flex-row" style="width: 100%;height: 100%">
        <div class="d-flex flex-column" style="width: 400px;border-right: 1px solid rgb(187, 187, 187)">
          <div
              class="d-flex flex-row"
              @click="currentTab='resource'"
              :class="{currentTab:currentTab==='resource'}"
              style="background: white;
                          align-items: center;
                          height: 44px;
                          cursor: pointer;
                        ">
            <v-icon
                style="
                            padding: 10px;
                            min-width: 44px;
                            font-size: 16px;
                          "
                color="#312651">
              mdi-cube-outline
            </v-icon>
            <span
                style="padding: 10px;
                            line-height: 1.5;
                            flex: 1;
                            height: 44px;
                            border-left: 1px solid rgba(187, 187, 187, 1);
                            font-size: 14px;
                            color: #444262;
                          "
            >{{ $t('resource') }}</span>
            <div
                style="font-size: 12px;margin-right: 18px;width: fit-content;height: fit-content;padding: 5px;border-radius: 6px;background-color: #E6E4E6;color: #444262;font-weight: 700">
              {{ resources.length }}
            </div>
          </div>
          <v-expansion-panels
              flat tile accordion multiple v-model="expandModel">
            <v-expansion-panel @change="getMembers()">
              <v-expansion-panel-header hide-actions style="padding: 0">
                <template #default="{ open }">
                  <div
                      class="d-flex flex-row"
                      style="
                          background: white;
                          border-top: 1px solid rgba(187, 187, 187, 1);
                          align-items: center;
                          height: 44px;
                        "
                      :style="
                          open
                            ? {
                                borderBottom: '1px solid rgba(187, 187, 187, 1)',
                              }
                            : {}
                        "
                  >
                    <v-icon
                        style="
                            padding: 10px;
                            min-width: 44px;
                            font-size: 16px;
                          "
                        color="#312651">
                      mdi-folder-account-outline
                    </v-icon>
                    <span
                        style="
                            padding: 10px;
                            line-height: 1.5;
                            flex: 1;
                            height: 44px;
                            border-left: 1px solid rgba(187, 187, 187, 1);
                            font-size: 14px;
                            color: #444262;
                          "
                    >{{ $t('teamMembers') }}</span>
                    <v-icon
                        color="#FF7754"
                        size="20"
                        style="margin-right: 20px; cursor: pointer"
                        @click.stop="$refs.inviteMemberDialog.start()"
                    >
                      mdi-account-multiple-plus
                    </v-icon>
                    <div
                        style="font-size: 12px;margin-right: 18px;width: fit-content;height: fit-content;padding: 5px;border-radius: 6px;background-color: #E6E4E6;color: #444262;font-weight: 700">
                      {{ members.length }}
                    </div>
                  </div>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div class="d-flex flex-column box">
                  <div
                      class="nav-item"
                      :class="{
                      current: member && member.id == item.id,
                    }"
                      v-for="item in members"
                      :key="item.id"
                  >
                    <div
                        class="box-icon"
                        v-if="item.role.desc === 'OWNER'"
                    >
                      <v-icon style="font-size: 16px;padding: 10px"> mdi-account-key-outline</v-icon>
                    </div>
                    <div
                        class="box-icon"
                        v-if="item.role.desc === '管理员'"
                    >
                      <v-icon style="font-size: 16px;padding: 10px"> mdi-account-cog</v-icon>
                    </div>
                    <div
                        class="box-icon"
                        v-if="item.role.desc === '编辑者'"
                    >
                      <v-icon style="font-size: 16px;padding: 10px"> mdi-account-edit</v-icon>
                    </div>
                    <div
                        class="box-icon"
                        v-if="item.role.desc === '评论员'"
                    >
                      <v-icon style="font-size: 16px;padding: 10px"> mdi-message-processing-outline</v-icon>
                    </div>
                    <div class="name">
                      {{ item.name }}
                    </div>
                    <div class="content">
                      <div class="main">
                        {{ $t(item.role.desc) }}
                      </div>
                    </div>
                    <v-menu>
                      <template #activator="{ on, attrs }">
                        <v-icon
                            class="more"
                            v-show="true"
                            size="15"
                            color="#83829A"
                            v-bind="attrs"
                            v-on="on"
                            @click="selectMember(item)"
                        >
                          mdi-dots-vertical
                        </v-icon>
                      </template>

                      <v-list style="cursor: pointer; font-size: 14px">
                        <v-menu right offset-x>
                          <template #activator="{ on, attrs }">
                            <v-list-item key="edit" v-bind="attrs" v-on="on">
                              <v-list-item-title @click="selectMember(item)">
                                <div
                                    class="d-flex flex-row"
                                    style="align-content: center"
                                >
                                  <span
                                      style="
                                      font-size: 14px;
                                      color: #444262;
                                      margin-right: 50px;
                                    "
                                  >{{ $t('changeRole') }}</span
                                  >
                                  <v-spacer/>
                                  <v-icon
                                      color="#FF7754"
                                      size="16"
                                      style="margin-right: 6px"
                                  >
                                    mdi-chevron-right
                                  </v-icon>
                                </div>
                              </v-list-item-title>
                            </v-list-item>
                          </template>
                          <v-list dense>
                            <template v-for="role in roles">
                              <v-list-item
                                  :key="role.id"
                                  style="font-size: 14px; color: #312651"
                              >
                                <v-list-item-title @click="updateMember(role)">
                                  <div
                                      class="d-flex flex-row"
                                      style="align-content: center"
                                  >
                                    <span style="margin-right: 50px">{{
                                        role.name
                                      }}</span>
                                    <v-spacer/>
                                    <v-icon v-if="role.id === 2" small
                                    >mdi-cog-outline
                                    </v-icon
                                    >
                                    <v-icon v-if="role.id === 3" small
                                    >mdi-square-edit-outline
                                    </v-icon
                                    >
                                    <v-icon v-if="role.id === 4" small>mdi-eye-outline</v-icon>
                                  </div>
                                </v-list-item-title>
                              </v-list-item>
                              <v-divider style="margin: 0" :key="`${role.id}-diver`"/>
                            </template>
                          </v-list>
                        </v-menu>
                        <v-divider style="margin: 0"/>
                        <v-list-item
                            key="delete"
                            v-if="isOwner"
                            @click="selectMember(item)"
                        >
                          <v-list-item-title @click="deleteMemberDialog.display = true">
                            <span style="font-size: 14px; color: #ff7754">{{ $t('delete') }}</span>
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <div style="height: 1px;width: 100%;background-color: rgb(187, 187, 187)"></div>
        </div>
        <div style="display: flex; flex-direction: column; width: 0;flex: 1;">
          <template v-if="currentTab==='resource'">
            <el-row type="flex" justify="start" class="menu-border">
              <div
                  class="title-menu"
                  v-if="resource.id"
                  :style="leftStyleMargin"
                  style="
                border-right: 1px solid rgba(187, 187, 187, 1);
                height: 100%;
                display: flex;
                flex-direction: row;
                align-items: center;
              "
              >
                <v-icon size="16" color="#83829A" style="margin-right: 6px">
                  {{
                    resource.type && resource.type.value == 1
                        ? "mdi-folder"
                        : "mdi-file-document-outline"
                  }}
                </v-icon>
                <div
                    style="
                  color: #83829a;
                  font-size: 14px;
                  text-align: center;
                  display: flex !important;
                  flex-direction: row;
                  align-items: center;
                "
                >
                  {{ resource.name }}
                </div>
              </div>
              <v-btn
                  v-show="resource.id"
                  large
                  text
                  class="process-menu"
                  style="border-right: 1px solid rgba(187, 187, 187, 1)"
                  @click="enterResource(resource.parentNode)"
              >
                <v-icon size="16" color="#312651" style="margin-right: 6px">
                  mdi-arrow-up-thick
                </v-icon>
                <span style="color: #83829a; font-size: 14px">{{ $t('previousFolder') }}</span>
              </v-btn>
              <v-spacer/>
              <v-btn
                  large
                  text
                  class="process-menu"
                  @click="searchDialog.display = true"
                  style="
                border-right: 1px solid rgba(187, 187, 187, 1);
                border-left: 1px solid rgba(187, 187, 187, 1);
              "
              >
                <v-icon size="16" color="#312651" style="margin-right: 6px">
                  mdi-magnify
                </v-icon>
                <span style="color: #444262; font-size: 14px">{{ $t('query') }}</span>
              </v-btn>

              <v-menu>
                <template #activator="{ on, attrs }">
                  <v-btn large text class="process-menu" v-bind="attrs" v-on="on">
                    <v-icon size="16" color="#312651" style="margin-right: 6px">
                      mdi-plus-circle-outline
                    </v-icon>
                    <span style="color: #444262; font-size: 14px">{{ $t('add') }}</span>
                  </v-btn>
                </template>
                <v-list style="cursor: pointer" dense>
                  <v-list-item key="folder" @click="startCreateResource(1)">
                    <v-list-item-title>
                      <v-icon size="16" color="#83829A" style="margin-right: 6px">
                        mdi-folder
                      </v-icon>
                      <span style="font-size: 14px">{{ $t('folder') }}</span>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item key="bpmn" @click="startCreateResource(2)">
                    <v-list-item-title>
                      <v-icon size="16" color="#00B0FF" style="margin-right: 6px">
                        mdi-alpha-b-box
                      </v-icon>
                      <span style="font-size: 14px">{{ $t('bsProcess') }}</span>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item key="bpmn2" @click="startCreateResource(3)">
                    <v-list-item-title>
                      <v-icon size="16" color="#57928D" style="margin-right: 6px">
                        mdi-alpha-d-circle
                      </v-icon>
                      <span style="font-size: 14px">{{ $t('dmn') }}</span>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item key="form" @click="startCreateResource(4)">
                    <v-list-item-title>
                      <v-icon size="16" color="#D500F9" style="margin-right: 6px">
                        mdi-alpha-f-circle
                      </v-icon>
                      <span style="font-size: 14px">{{ $t('form') }}</span>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item key="page" @click="startCreateResource(5)">
                    <v-list-item-title>
                      <v-icon size="16" color="#F50057" style="margin-right: 6px">
                        mdi-alpha-p-circle
                      </v-icon>
                      <span style="font-size: 14px">{{ $t('page') }}</span>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item key="upload" @click="startUploadResource()">
                    <v-list-item-title>
                      <v-icon size="16" color="#83829A" style="margin-right: 6px">
                        mdi-upload
                      </v-icon>
                      <span style="font-size: 14px">{{ $t('uploadFile') }}</span>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </el-row>

            <el-row
                style="height: 0;;flex: 1; border-top: 1px solid rgba(187, 187, 187, 1)"
                :style="leftStylePadding"
                ref="tableContainer"
            >
              <div class="d-flex flex-row" style="gap: 15px;padding:16px;overflow-y: auto">
                <div class="filter-item-parent d-flex flex-column"
                     :style="searchDialog.filterValue=='2'?{border:'#0F40F5 1px solid'}:{}"
                     @click="filterByBtnType('2')">
                  <div class="filter-item-top-parent d-flex flex-row">
                    <v-icon size="24" color="#0F40F5">mdi-progress-star-four-points</v-icon>
                    <div class="d-flex flex-column" style="flex: 1;width: 0">
                      <div class="filter-item-top-title">{{ $t('bsProcess') }}</div>
                      <div class="filter-item-top-sub-title">Process</div>
                    </div>
                  </div>
                  <div class="d-flex flex-row-reverse">
                    <div class="filter-item-count">{{ processResourceCount }}</div>
                  </div>
                </div>
                <div class="filter-item-parent d-flex flex-column"
                     :style="searchDialog.filterValue=='3'?{border:'#57928D 1px solid'}:{}"
                     @click="filterByBtnType('3')">
                  <div class="filter-item-top-parent d-flex flex-row">
                    <v-icon size="24" color="#57928D">mdi-file-table-box-outline</v-icon>
                    <div class="d-flex flex-column" style="flex: 1;width: 0">
                      <div class="filter-item-top-title">{{ $t('businessRules') }}</div>
                      <div class="filter-item-top-sub-title">Decision</div>
                    </div>
                  </div>
                  <div class="d-flex flex-row-reverse">
                    <div class="filter-item-count">{{ dmnResourceCount }}</div>
                  </div>
                </div>
                <div class="filter-item-parent d-flex flex-column"
                     :style="searchDialog.filterValue=='5'?{border:'#F50057 1px solid'}:{}"
                     @click="filterByBtnType('5')">
                  <div class="filter-item-top-parent d-flex flex-row">
                    <v-icon size="24" color="#F50057">mdi-card-bulleted</v-icon>
                    <div class="d-flex flex-column" style="flex: 1;width: 0">
                      <div class="filter-item-top-title">{{ $t('userPage') }}</div>
                      <div class="filter-item-top-sub-title">Page</div>
                    </div>
                  </div>
                  <div class="d-flex flex-row-reverse">
                    <div class="filter-item-count">{{ pageResourceCount }}</div>
                  </div>
                </div>
                <div class="filter-item-parent d-flex flex-column"
                     :style="searchDialog.filterValue=='4'?{border:'#D500F9 1px solid'}:{}"
                     @click="filterByBtnType('4')">
                  <div class="filter-item-top-parent d-flex flex-row">
                    <v-icon size="24" color="#D500F9">mdi-file-edit-outline</v-icon>
                    <div class="d-flex flex-column" style="flex: 1;width: 0">
                      <div class="filter-item-top-title">{{ $t('userForm') }}</div>
                      <div class="filter-item-top-sub-title">Form</div>
                    </div>
                  </div>
                  <div class="d-flex flex-row-reverse">
                    <div class="filter-item-count">{{ formResourceCount }}</div>
                  </div>
                </div>
              </div>

              <el-table :data="showResourceList"
                        :header-cell-style="{ backgroundColor: '#F5F6F7' }"
                        v-loading="false"
                        :max-height="tableMaxHeight">
                <el-table-column :label="$t('name')">
                  <template slot-scope="props">
                    <router-link
                        v-if="props.row.type.value == 1"
                        :to="{}"
                        @click.native="enterResource(props.row.id)"
                    >
                      <v-icon size="16" color="#1976d2" style="margin-right: 6px">
                        mdi-folder
                      </v-icon>
                      {{ props.row.name }}
                    </router-link>

                    <router-link
                        v-else
                        :to="{
                      name: 'collaboration-resource-detail',
                      params: { id: props.row.id },
                      query: {
                        folderResource: resource.id,
                        groupId: $route.query.groupId,
                      },
                    }"
                    >
                      <v-icon size="16" :color="`#${parseType(props.row).color}`" style="margin-right: 6px">
                        <template v-if="props.row.type.value == 2">
                          mdi-alpha-b-box
                        </template>
                        <template v-else-if="props.row.type.value == 3">
                          mdi-alpha-d-circle
                        </template>
                        <template v-else-if="props.row.type.value == 4">
                          mdi-alpha-f-circle
                        </template>
                        <template v-else-if="props.row.type.value == 5">
                          mdi-alpha-p-circle
                        </template>
                        <template v-else-if="props.row.type.value == 6">
                          mdi-alpha-u-box
                        </template>
                      </v-icon>
                      {{ props.row.name }}
                    </router-link>
                  </template>
                </el-table-column>

                <el-table-column :label="$t('resourceType')"
                                 :filter-multiple="true"
                                 :filters="[{text:$t('bsFlow'),value:'2'},{text:$t('dmn'),value:'3'},{text:$t('form'),value:'4'},{text:$t('page'),value:'5'},{text:$t('uxFlow'),value:'6'}]"
                                 sortable
                                 :filter-method="filterByType"
                                 :sort-method="sortByType">
                  <template slot-scope="props">
                    {{ props.row.type.desc }}
                  </template>
                </el-table-column>

                <el-table-column :label="$t('createdBy')" prop="createdBy"/>

                <el-table-column :label="$t('lastUpdate')">
                  <template slot-scope="props">
                    {{ utils.formatDateTime(props.row.createdTs) }}
                  </template>
                </el-table-column>
                <el-table-column align="center" :label="$t('operate')" width="80">
                  <template slot-scope="props">
                    <v-menu>
                      <template #activator="{ on, attrs }">
                        <v-icon
                            size="20"
                            color="#444262"
                            v-bind="attrs"
                            v-on="on"
                            @click="selectResource(props.row)"
                        >
                          mdi-dots-vertical
                        </v-icon>
                      </template>
                      <v-list style="cursor: pointer" dense>
                        <v-list-item key="rename">
                          <v-list-item-title @click="startUpdateResource()">
                            <v-icon size="16" color="#83829A" style="margin-right: 6px">
                              mdi-rename-box
                            </v-icon>
                            <span style="font-size: 14px">{{ $t('rename') }}</span>
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                            v-if="['2', '3'].includes(props.row.type.value)"
                            key="move"
                        >
                          <v-list-item-title @click="startMoveResource()">
                            <v-icon size="16" color="#83829A" style="margin-right: 6px">
                              mdi-file-move
                            </v-icon>
                            <span style="font-size: 14px">{{ $t('moveTo') }}</span>
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                            key="delete"
                            @click="deleteResourceDialog.display = true"
                        >
                          <v-list-item-title>
                            <v-icon size="16" color="#83829A" style="margin-right: 6px">
                              mdi-delete-forever
                            </v-icon>
                            <span style="font-size: 14px">{{ $t('delete') }}</span>
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </template>
        </div>
      </div>
    </v-card>
    <v-dialog v-model="searchDialog.display" max-width="300">
      <v-card>
        <v-card-title class="headline" style="color: #444262"/>

        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row style="margin: 0 0 20px 0">
              <v-col style="padding: 0" cols="12">
                <v-text-field
                    :placeholder="$t('inputKeywordSearchWithDot')"
                    v-model="searchDialog.name"
                    hide-details
                    @keydown.enter="getResources()"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer/>
          <v-btn text @click="searchDialog.display = false"> {{ $t('cancel') }}</v-btn>
          <v-btn style="color: #ffffff" color="#FF7754" @click="getResources()">
            <v-icon size="16" color="#ffffff" style="margin-right: 6px">
              mdi-magnify
            </v-icon>
            {{ $t('query') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="createResourceDialog.display" max-width="300">
      <v-card>
        <v-card-title class="headline" style="color: #444262"/>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row style="margin: 0 0 20px 0">
              <v-col style="padding: 0" cols="12">
                <v-text-field
                    :placeholder="$t('enterNameWithType',{type:createResourceDialog.typeName})"
                    v-model="createResourceDialog.name"
                    hide-details
                    @keydown.enter="createResource()"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer/>
          <v-btn text @click="createResourceDialog.display = false"> {{ $t('cancel') }}</v-btn>
          <v-btn style="color: #ffffff" color="#FF7754" @click="createResource()">
            <v-icon size="16" color="#ffffff" style="margin-right: 6px">
              mdi-content-save
            </v-icon>
            {{ $t('save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="uploadResourceDialog.display" max-width="300">
      <v-card>
        <v-card-title class="headline" style="color: #444262"/>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row style="margin: 0 0 20px 0">
              <v-col style="padding: 0" cols="12">
                <v-text-field
                    :placeholder="$t('enterNameWithDot')"
                    v-model="uploadResourceDialog.name"
                    hide-details
                    @keydown.enter="()=>{}"
                />
              </v-col>
            </v-row>
            <v-row style="margin: 0 0 20px 0">
              <v-col style="padding: 0" cols="12">
                <!--  accept="text/xml, text/bpmn"-->
                <v-file-input
                    :placeholder="$t('selectFile')"
                    accept=".bpmn,.dmn"
                    hide-details
                    v-model="uploadResourceDialog.xml"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer/>
          <v-btn text @click="uploadResourceDialog.display = false"> {{ $t('cancel') }}</v-btn>
          <v-btn style="color: #ffffff" color="#FF7754" @click="uploadResource()">
            <v-icon size="16" color="#ffffff" style="margin-right: 6px">
              mdi-upload
            </v-icon>
            上传
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="updateResourceDialog.display" max-width="300">
      <v-card>
        <v-card-title class="headline" style="color: #444262"/>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row style="margin: 0 0 20px 0">
              <v-col style="padding: 0" cols="12">
                <v-text-field
                    :label="$t('name')"
                    :placeholder="
                    selectedResource.type && selectedResource.type.value == 1
                      ? $t('enterFolderName')
                      : '输入BPMN流程名称...'
                  "
                    v-model="selectedResource.name"
                    hide-details
                    @keydown.enter="updateResource()"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer/>
          <v-btn text @click="updateResourceDialog.display = false"> {{ $t('cancel') }}</v-btn>
          <v-btn style="color: #ffffff" color="#FF7754" @click="updateResource()">
            <v-icon size="16" color="#ffffff" style="margin-right: 6px">
              mdi-content-save
            </v-icon>
            {{ $t('save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteResourceDialog.display" max-width="300">
      <v-card>
        <v-card-title class="headline" style="color: #444262"/>
        <v-card-text>
          {{
            $t('deleteResourceConfirmWithTypeAndName', {
              type: $t(selectedResource.type && selectedResource.type.value == 1
                  ? 'folder' : 'bpmnResource'), name: selectedResource.name
            })
          }}
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer/>
          <v-btn text @click="deleteResourceDialog.display = false">{{ $t('cancel') }}</v-btn>
          <v-btn style="color: #ffffff" color="#FF7754" @click="deleteResource()">
            <v-icon size="16" color="#ffffff" style="margin-right: 6px">
              mdi-delete
            </v-icon>
            {{ $t('delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <invite-member-dialog
        ref="inviteMemberDialog"
        @onCreateMember="onCreateMember"
        :members="members"
        :project-id="$route.params.id"/>
    <v-dialog v-model="updateMemberDialog.display" max-width="300">
      <v-card>
        <v-card-title class="headline" style="color: #444262">{{ $t('changeRole') }}</v-card-title>

        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row style="margin: 10px 0 0 0">
              <v-col style="padding: 0" cols="12">
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
          </v-form>
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer/>
          <v-btn text @click="cancelUpdate"> {{ $t('cancel') }}</v-btn>
          <v-btn style="color: #ffffff" color="#FF7754" @click="updateMember()">
            <v-icon size="16" color="#ffffff" style="margin-right: 6px">
              mdi-content-save
            </v-icon>
            {{ $t('save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteMemberDialog.display" max-width="300">
      <v-card>
        <v-card-title class="headline" style="color: #444262"> {{ $t('deleteMember') }}</v-card-title>
        <v-card-text>{{ $t('deleteMemberConfirmWithName',{name:member && member.name}) }}</v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer/>
          <v-btn text @click="cancelDelete"> {{ $t('cancel') }}</v-btn>
          <v-btn style="color: #ffffff" color="#FF7754" @click="deleteMember()">
            <v-icon size="16" color="#ffffff" style="margin-right: 6px">
              mdi-delete
            </v-icon>
            {{ $t('delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <folder-navigate
        :resource="selectedResource"
        ref="folderNavigate"
        @save="moveResource"
    />
  </div>
</template>
<script>
import camundaRequest from "@/api/camunda-service";
import {Form} from "vue-formio-eorion";
import utils from "@/utils/utils";
import FolderNavigate from "@/components/common/modeler/FolderNavigate";
import ReSizeDrawer from "@/components/common/ReSizeDrawer";
import InviteMemberDialog from "@/components/common/InviteMemberDialog";
import collaborationRequest from "@/api/collaboration";
import formRequest from "@/api/form";
import BpmnModdle from "bpmn-moddle/resources/bpmn/json/bpmn.json";
import BpmnModdleDi from "bpmn-moddle/resources/bpmn/json/bpmndi.json";
import DiJSON from "bpmn-moddle/resources/bpmn/json/di.json";
import DcJson from "bpmn-moddle/resources/bpmn/json/dc";
import {Moddle} from "moddle";
import {
  Reader
} from "moddle-xml";
import VueBpmn from "@/components/common/BPMN";

const model = new Moddle([BpmnModdle, BpmnModdleDi, DiJSON, DcJson]);

export default {
  components: {FolderNavigate, ReSizeDrawer, InviteMemberDialog, VueBpmn, vueFormio: Form},
  computed: {
    userName() {
      return (
          this.$store.state.user.profile.firstName +
          " " +
          this.$store.state.user.profile.lastName
      );
    },
    userId() {
      return this.$store.state.user.profile.id;
    },
    isOwner() {
      return (
          !!this.members.find((member) => member.userId == this.userId) ||
          this.userId == this.project.owner
      );
    },
    showResourceList(){
      if (this.searchDialog.filterValue){
        return this.resources.filter(item => item.type.value == this.searchDialog.filterValue);
      }else {
        return this.resources;
      }
    },
    processResourceCount() {
      return this.resources.filter(item => item.type.value == "2").length;
    },
    uxResourceCount() {
      return this.resources.filter(item => item.type.value == "6").length;
    },
    dmnResourceCount() {
      return this.resources.filter(item => item.type.value == "3").length;
    },
    pageResourceCount() {
      return this.resources.filter(item => item.type.value == "5").length;
    },
    formResourceCount() {
      return this.resources.filter(item => item.type.value == "4").length;
    }
  },
  data() {
    return {
      tableMaxHeight: "10",
      expandModel: [],
      currentTab: "resource",
      searchUser: {
        loading: false,
        items: [],
        value: [],
        searchValue: "",
      },
      leftStylePadding: {},
      leftStyleMargin: {},
      utils,
      collectionName: "test1",
      idBreadcrumbs: [
        {
          text: this.$t("uiDesign"),
          href: "#/design/collaboration/list",
        },
        {
          text: "",
          href: "",
          disabled: true,
        },
      ],
      project: null,
      members: [],
      member: {
        id: "",
        role: "",
        name: "",
      },
      resources: [],
      resource: {},
      selectedResource: {},
      left: true,
      createResourceDialog: {
        name: "",
        type: "",
        display: false,
      },
      uploadResourceDialog: {
        name: "",
        xml: null,
        display: false,
      },
      updateResourceDialog: {
        display: false,
      },
      deleteResourceDialog: {
        display: false,
      },
      deleteMemberDialog: {
        display: false,
      },
      updateMemberDialog: {
        display: false,
      },
      searchDialog: {
        display: false,
        name: "",
        filterValue: null,
      },
      roles: [
        {id: 1, name: this.$t("roleTypeOwner")},
        {id: 2, name: this.$t("roleTypeAdmin")},
        {id: 3, name: this.$t("roleTypeEditor")},
        {id: 4, name: this.$t("roleTypeCommentator")},
      ],
    };
  },
  watch: {
    $route: {
      handler() {
        this.getData();
      },
    },
    "$i18n.locale": {
      handler(val) {
        let self = this;
        self.roles[0].name=self.$t("roleTypeOwner");
        self.roles[1].name=self.$t("roleTypeAdmin");
        self.roles[2].name=self.$t("roleTypeEditor");
        self.roles[1].name=self.$t("roleTypeCommentator");
        self.idBreadcrumbs[0].text = self.$t("uiDesign");
      }
    }
  },
  mounted() {
    this.$nextTick(() => { //使用nextTick为了保证dom元素都已经渲染完毕
      this.tableMaxHeight = this.$refs.tableContainer.$el.offsetHeight - 153;
    });
    this.getData();
  },
  methods: {
    filterByBtnType(type) {
      if (type===this.searchDialog.filterValue){
        this.searchDialog.filterValue = null;
      }else {
        this.searchDialog.filterValue = type;
      }
    },
    filterByType(value, row, column) {
      let values = column.filteredValue;
      return values.includes(row.type.value);
    },
    sortByType(a, b) {
      return a.type.value - b.type.value;
    },
    parseType(item) {
      let parsedItem = {};
      if (item.type.value == "2") {
        parsedItem.color = "00B0FF";
      } else if (item.type.value == "3") {
        parsedItem.color = "57928D";
      } else if (item.type.value == "4") {
        parsedItem.color = "D500F9";
      } else if (item.type.value == "5") {
        parsedItem.color = "F50057";
      } else if (item.type.value == "6") {
        parsedItem.color = "312651";
      }
      return parsedItem;
    },
    setLeftWidth(payload) {
      let self = this;
      self.left = payload.left;
      self.leftStylePadding = {paddingLeft: `${payload.left ? payload.width : 0}px`};
      self.leftStyleMargin = {marginLeft: `${payload.left ? payload.width : 0}px`};
    },
    switchLeft() {
      this.$refs.resizeDrawer.setLeft(!this.left);
    },

    copy(value) {
      navigator.clipboard.writeText(value);
      this.$message({
        message: this.$t("copySuccessWithValue",{value:value}),
        type: "success",
        showClose:true
      });
      this.share.display = false;
    },

    async getData() {
      const id = this.$route.params.id;
      let data = await camundaRequest.getProject(id);
      this.project = data;
      let backUrl = "#/design/collaboration/list";
      if (this.$route.query.groupId) {
        backUrl = `${backUrl}?defaultGroup=${this.$route.query.groupId}`;
      }
      this.idBreadcrumbs[0].href = backUrl;
      this.idBreadcrumbs[1].text = this.project.name;
      await this.getMembers();
      await this.getResources();
      if (this.$route.query.defaultResource) {
        await this.enterResource(this.$route.query.defaultResource);
      }
      if (!this.isOwner) {
        // 弹窗提示
        this.$store.dispatch("common/setAuthorizedDialog", true);
      }
    },
    async getMembers() {
      this.member.id = "";
      this.member.role = "";
      this.member.name = "";
      let data = await camundaRequest.getMembers(this.project.id);
      this.members = data;
    },
    async getResources() {
      let data = await camundaRequest.getResources({
        projectId: this.project.id,
        parentNode: this.resource.id || 0,
        nameLike: this.searchDialog.name,
      });
      this.resources = data;
      this.searchDialog.display = false;
    },
    onCreateMember() {
      this.getMembers();
    },
    selectMember(member) {
      this.member = JSON.parse(JSON.stringify(member));
    },
    cancelDelete() {
      this.member.id = "";
      this.member.role = "";
      this.member.name = "";
      this.deleteMemberDialog.display = false;
    },
    async deleteMember() {
      await camundaRequest.deleteMember({
        projectId: this.project.id,
        userId: this.member.userId,
      });
      this.$message({
        message: this.$t("deleteMemberSuccessWithName",{name:this.member.name}),
        type: "success",
        showClose:true
      });

      await this.getMembers();
      this.deleteMemberDialog.display = false;
    },

    cancelUpdate() {
      this.member.id = "";
      this.member.role = "";
      this.member.name = "";
      this.updateMemberDialog.display = false;
    },
    async updateMember(role) {
      if (role) {
        this.member.role = role.id;
      }
      await camundaRequest.saveMember(this.member);
      this.$message({
        message: this.$t("modifyMemberRoleSuccessWithName",{name:this.member.name}),
        type: "success",
        showClose:true
      });
      await this.getMembers();
      this.updateMemberDialog.display = false;
    },

    async createResource() {
      let self = this;
      if (!this.createResourceDialog.name) {
        this.$message({
          message: this.$t("inputInfoMiss"),
          type: "error",
          showClose:true
        });
        return;
      }

      let data = {
        type: this.createResourceDialog.type,
        name: this.createResourceDialog.name,
        parentNode: this.resource.id || 0,
        projectId: this.project.id,
      };
      if (this.createResourceDialog.type == 4 || this.createResourceDialog.type == 5) {
        let type = this.createResourceDialog.type == 4 ? "form" : "page";
        // 表单
        let formCreateResult = await formRequest.postForm({
          name: self.createResourceDialog.name,
          type: type,
          createdBy: self.userId,
          formData: [],
        });
        data.externalResourceId = formCreateResult.id;
      }
      await camundaRequest.createResource(data);
      this.$message({
        message: `${this.createResourceDialog.typeName}${this.createResourceDialog.name}${this.$t("successCreate")}`,
        type: "success",
        showClose:true
      });
      await this.getResources();

      this.createResourceDialog.display = false;
    },
    async uploadResource() {
      if (!this.uploadResourceDialog.name || !this.uploadResourceDialog.xml) {
        this.$message({
          message: this.$t("inputInfoMiss"),
          type: "error",
          showClose:true
        });
        return;
      }

      let type = 3;
      if (this.uploadResourceDialog.xml.name.endsWith(".bpmn")) {
        type = 2;
      } else if (this.uploadResourceDialog.xml.name.endsWith(".dmn")) {
        type = 3;
      } else if (this.uploadResourceDialog.xml.name.endsWith(".form")) {
        type = 4;
      } else if (this.uploadResourceDialog.xml.name.endsWith(".page")) {
        type = 5;
      } else if (this.uploadResourceDialog.xml.name.endsWith(".ux")) {
        type = 6;
      }

      let data = {
        type: this.uploadResourceDialog.xml.name.endsWith(".bpmn") ? 2 : 3,
        name: this.uploadResourceDialog.name,
        parentNode: this.resource.id || 0,
        projectId: this.project.id,
      };
      var reader = new FileReader();
      reader.readAsText(this.uploadResourceDialog.xml);
      reader.onloadend = async () => {
        let response = await camundaRequest.createResource(data);
        let key = response.id;
        let xml = reader.result;

        await collaborationRequest.postVersionDetail(key, {
          name: this.$t("originVersion"),
          xml: xml,
          nodes: [],
        });
        this.$message({
          message: this.$t("uploadFileSuccessWithName",{name:data.name}),
          type: "success",
          showClose:true
        });
        await this.getResources();
        this.uploadResourceDialog.display = false;
      };
    },
    startCreateResource(type) {
      this.createResourceDialog.name = "";
      this.createResourceDialog.type = type;
      switch (type) {
        case 1:
          this.createResourceDialog.typeName = this.$t("folder");
          break;
        case 2:
          this.createResourceDialog.typeName = this.$t("bsProcess");
          break;
        case 3:
          this.createResourceDialog.typeName = this.$t("dmn");
          break;
        case 4:
          this.createResourceDialog.typeName = this.$t("form");
          break;
        case 5:
          this.createResourceDialog.typeName = this.$t("page");
          break;
        case 6:
          this.createResourceDialog.typeName = this.$t("uxFlow");
          break;
      }
      this.createResourceDialog.display = true;
    },
    startUploadResource() {
      this.uploadResourceDialog.name = "";
      this.uploadResourceDialog.display = true;
    },
    startUpdateResource() {
      this.updateResourceDialog.name = this.selectedResource.name;
      this.updateResourceDialog.display = true;
    },

    startMoveResource() {
      this.$refs.folderNavigate.start();
    },
    async updateResource() {
      if (!this.selectedResource.name) {
        this.$message({
          message: this.$t("inputInfoMiss"),
          type: "error",
          showClose:true
        });
        return;
      }

      await camundaRequest.updateResource(this.selectedResource);
      this.$message({
        message: `${this.selectedResource.type == 1 ? this.$t("folder") : this.$t("bpmnResource")}${
            this.selectedResource.name
        }${this.$t("successCreate")}`,
        type: "success",
        showClose:true
      });
      await this.getResources();

      this.updateResourceDialog.display = false;
    },
    async deleteResource() {
      await camundaRequest.deleteResource(this.selectedResource.id);
      this.$message({
        message: `${this.selectedResource.type.value == 1 ? this.$t("folder") : this.$t("bpmnResource")}${
            this.selectedResource.name
        }${this.$t("successDelete")}`,
        type: "success",
        showClose:true
      });

      await this.getResources();
      this.deleteResourceDialog.display = false;
    },
    async moveResource(folder) {
      let item = this.selectedResource;
      item.parentNode = folder.id;
      item.projectId = folder.projectId;

      await camundaRequest.updateResource(item);

      this.$message({
        message: this.$t("moveToSuccessWithNameAndPath",{name:this.selectedResource.name,path:folder.name ? `${this.$t("folder")}"${folder.name}"` : this.$t("rootFolder")}),
        type: "success",
        showClose:true
      });

      await this.getResources();
      this.$refs.moveResource.display = false;
    },
    async enterResource(id) {
      if (id) {
        let data = await camundaRequest.getResource(id);
        this.resource = data;
      } else {
        this.resource = {};
      }

      await this.getResources();
    },
    selectResource(resource) {
      this.selectedResource = JSON.parse(JSON.stringify(resource));
    },
  },
};
</script>

<style scoped>
/deep/ .v-skeleton-loader__list-item-three-line {
  padding: 0;
}

/deep/ .v-expansion-panel-content__wrap {
  padding: 0;
}

/deep/ .v-expansion-panel-header {
  min-height: unset;
}

/deep/ .v-expansion-panel--active > .v-expansion-panel-header {
  min-height: unset;
}

.copyIcon {
  opacity: 0;
}

.tabCopy:hover .copyIcon {
  opacity: 1;
}

.value:hover .copyIcon,
.main-value:hover .copyIcon {
  opacity: 1;
}

.small-headline {
  color: #444262;
  font-size: 16px;
  font-weight: bold;
}

.checkbox-tip {
  margin: 0;
}

div.v-list-item__subtitle.subtitle {
  color: rgba(136, 136, 136, 100);
  font-size: 0.8em;
  text-align: left;
}

div.value {
  color: rgba(16, 16, 16, 100);
  font-size: 0.8em;
  text-align: left;
}

div.main-value {
  color: #444262;
  font-size: 18px;
  text-align: left;
}

button.process-menu {
  padding: 0 10px;
}

.title-menu {
  padding: 0 15px;
  font-size: 14px;
  color: #312651;
  margin-top: auto;
  margin-bottom: auto;
}

button.process-menu span {
  color: rgba(33, 33, 33, 100);
  font-size: 0.8em;
}

div.stretch {
  min-height: calc(100vh - 113px);
}

.badge {
  display: inline-block;
  min-width: 10px;
  padding: 3px 7px;
  font-weight: bold;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  border-radius: 6px;
  background-color: #70b8db;
  border: 0;
  margin-right: 10px;
  color: #fff;
}

.closed-incidents,
.activity-instance-canceled,
.activity-instance-completed,
.instance-count,
.instance-incidents {
  cursor: pointer;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 120px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  padding: 0px 16px;
  z-index: 1;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.menu-border {
  border-bottom: none;
  height: 44px;
}

div.v-sheet.v-card.detail-card:not(.v-sheet--outlined) {
  box-shadow: 0 0px 0px 0px;
}

.badge-total {
  background-color: #444262;
}

.badge-instance {
  background-color: #57928d;
}

.badge-incident {
  background-color: #fa4f07;
}

.badge-total i,
.badge-instance i,
.badge-incident i {
  margin-right: 2px;
}

.box {
  display: flex;
  flex-direction: column;
}

.box-header {
  border-top: 1px solid rgba(187, 187, 187, 1);
  border-bottom: 1px solid rgba(187, 187, 187, 1);
  height: 42px;
}

.box-icon {
  border-right: 1px solid rgba(187, 187, 187, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  float: left;
}

.box-title {
  display: flex;
  align-items: center;
  height: 100%;
}

.box-title .box-title-left {
  color: #444262;
  font-size: 14px;
  margin: auto 10px;
}

.box-title .box-title-left span.badge {
  color: #ffffff;
  background-color: #444262;
  font-size: 12px;
}

.box-icon i.theme--light.v-icon {
  font-size: 16px;
  min-width: 44px;
}

.box
div.theme--light.v-input.v-textarea.v-textarea.v-text-field--enclosed.v-text-field--outlined {
  /* border: 1px solid#E6E4E6; */
  background-color: #f3f4f9;
  margin: 10px;
  padding: 0;
}

.box textarea {
  background-color: #f3f4f9;
  margin: 10px;
  padding: 5px;
  border: 1px solid #e6e4e6;
}

/deep/
.box
div.v-textarea.v-text-field--enclosed.v-text-field--outlined:not(.v-input--dense)
.v-text-field__slot
textarea {
  margin-top: 0;
}

.box .nav-item {
  display: flex;
}

.box .nav-item:hover {
  background-color: rgba(243, 244, 249);
}

.box .nav-item.current {
  background-color: rgba(243, 244, 249);
}

/deep/ .currentTab {
  background-color: #F3F4F9 !important;
}

.box .nav-item .name {
  color: #444262;
  vertical-align: middle;
  flex: 1;
  margin: auto 0 auto 20px;
  font-size: 16px;
}

.box .nav-item .content {
  flex: 0;

  margin: 10px 0;
}

.box .nav-item .main {
  color: #444262;
  width: 60px;
  font-size: 14px;
}

.box .nav-item.active .main {
  color: #312651;
  font-weight: bold;
  font-size: 14px;
}

.box .more {
  margin: auto 10px;
  height: 20px;
  opacity: 0;
}

.box .nav-item:hover .more {
  opacity: 1;
}

.box.history .nav-item .main {
  color: #312651;
  font-size: 14px;
}

.box.history .nav-item .tip {
  color: #83829a;
  font-size: 12px;
  margin-top: 10px;
}

.box .nav-item .sub {
  color: #83829a;
  font-size: 12px;
  margin-top: 8px;
}

.box .nav-item .tip {
  color: #83829a;
  font-size: 12px;
  margin-top: 0px;
}

.box .nav-input {
  margin: 15px 20px;
  display: flex;
}

.box .nav-input div.v-input.theme--light.v-text-field.v-text-field--placeholder {
  margin: 0;
  padding: 0;
}

.box .nav-input input {
  flex: 1;
  height: 30px;
  border: 1px solid #e6e4e6;
  padding: 5px;
}

/deep/
.box
.nav-input
div.v-input.theme--light.v-text-field.v-text-field--placeholder
input {
  padding: 0;
}

.share input {
  flex: 1;
  height: 36px;
  border: 1px solid #e6e4e6;
  padding: 5px;
  width: 100%;
}

div.password-setting span {
  color: #83829a;
  font-size: 14px;
  margin-left: 8px;
}

span.password-split {
  color: #83829a;
  font-size: 20px;
  margin: 0 8px;
}

.setting-title {
  color: #312651;
  font-size: 20px;
  margin-bottom: 5px;
}

.setting-sub-title {
  color: #83829A;
  font-size: 12px;
  margin-bottom: 30px;
}

.set-tab-item {
  padding: 30px 47px;
}

.filter-item-parent {
  background-color: #F3F4F9;
  border-radius: 6px;
  padding: 10px 15px 6px;
  gap: 12px;
  width: 160px;
  cursor: pointer;
}

.filter-item-parent-selected{
  border: rgb(255, 119, 84) 1px solid;
}

.filter-item-top-parent {
  align-items: center;
  gap: 21px;
}

.filter-item-top-icon {
  font-size: 24px;
  color: #0F40F5;
}

.filter-item-top-title {
  color: #312651;
  font-size: 14px;
  overflow: hidden;
  width: 100%;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.filter-item-top-sub-title {
  color: #B1ABB6;
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}

.filter-item-count {
  color: #444262;
  font-weight: bold;
  font-size: 36px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}
</style>
