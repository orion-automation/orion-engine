<template>
  <div style="border-top: 1px solid rgba(187, 187, 187, 1)">
    <div style="padding: 14px 15px">
      <v-breadcrumbs
        class="id-breadcrumbs"
        :items="idBreadcrumbs"
        style="background-color: #e8eff7; padding: 0px; border: none"
        divider="|"
      />
    </div>
    <v-card class="detail-card" style="border-top: 1px solid rgba(187, 187, 187, 1)">
      <v-layout style="margin: 0" class="stretch">
        <re-size-drawer ref="resizeDrawer" @setLeftWidth="setLeftWidth">
          <v-icon class="navigation-icon" @click="switchLeft()">
            mdi-chevron-left
          </v-icon>

          <div style="display: flex; flex-direction: column; height: 100%">
            <div
              class="d-flex flex-row"
              style="
                display: flex !important;
                font-size: 14px;
                height: 45px;
                align-items: center;
                padding-left: 15px;
              "
            >
              {{ $t('knowledgeMember') }}
            </div>
            <div class="box" style="flex: 0">
              <div class="box-header">
                <div class="box-icon">
                  <v-icon> mdi-account-multiple</v-icon>
                </div>
                <div class="box-title">
                  <div class="box-title-left">
                    {{ $t('member') }}
                    <span class="badge">{{ members.length }}</span>
                  </div>

                  <v-spacer />
                  <v-icon
                    color="#FF7754"
                    size="20"
                    style="margin-right: 20px; cursor: pointer"
                    @click="$refs.inviteMemberDialog.start()"
                  >
                    mdi-account-multiple-plus
                  </v-icon>
                </div>
                <div style="flex: 1; margin: 0px 0px">
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
                      style="height: 41px"
                      v-if="item.role.desc === 'OWNER'"
                    >
                      <v-icon> mdi-account-key-outline</v-icon>
                    </div>
                    <div
                      class="box-icon"
                      style="height: 41px"
                      v-if="item.role.desc === '管理员'"
                    >
                      <v-icon> mdi-account-cog</v-icon>
                    </div>
                    <div
                      class="box-icon"
                      style="height: 41px"
                      v-if="item.role.desc === '编辑者'"
                    >
                      <v-icon> mdi-account-edit</v-icon>
                    </div>
                    <div
                      class="box-icon"
                      style="height: 41px"
                      v-if="item.role.desc === '评论员'"
                    >
                      <v-icon> mdi-message-processing-outline</v-icon>
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
                                  >{{ $t('changeRole') }}</span>
                                  <v-spacer />
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
                                    <v-spacer />
                                    <v-icon v-if="role.id === 2" small>
                                      fal fa-gear
                                    </v-icon>
                                    <v-icon v-if="role.id === 3" small>
                                      fal fa-pen-to-square
                                    </v-icon>
                                    <v-icon v-if="role.id === 4" small>fal fa-eye</v-icon>
                                  </div>
                                </v-list-item-title>
                              </v-list-item>
                              <v-divider style="margin: 0" :key="`${role.id}-diver`" />
                            </template>
                          </v-list>
                        </v-menu>
                        <v-divider style="margin: 0" />
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
              </div>
            </div>
          </div>
        </re-size-drawer>
        <div class="horizontal-collapsed" v-if="!left">
          <v-icon class="navigation-icon" @click="switchLeft()">
            mdi-chevron-right
          </v-icon>
        </div>
        <div style="display: flex; flex-direction: column; width: 100%">
          <el-row type="flex" justify="start" class="menu-border">
            <div
              class="title-menu"
              v-show="resource.id"
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
              <v-icon size="16" color="#83829A" style="margin-right: 6px">
                mdi-arrow-up-thick
              </v-icon>
              <span style="color: #83829a; font-size: 14px">{{ $t('previousFolder') }}</span>
            </v-btn>
            <v-spacer />
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
              <v-icon size="16" color="#83829A" style="margin-right: 6px">
                mdi-magnify
              </v-icon>
              <span style="color: #444262; font-size: 14px">{{ $t('query') }}</span>
            </v-btn>

            <v-menu>
              <template #activator="{ on, attrs }">
                <v-btn large text class="process-menu" v-bind="attrs" v-on="on">
                  <v-icon size="16" color="#83829A" style="margin-right: 6px">
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
                    <v-icon size="16" color="#0F40F5" style="margin-right: 6px">
                      mdi-alpha-b-box
                    </v-icon>
                    <span style="font-size: 14px">{{ $t('processKnowledge') }}</span>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item key="dmn" @click="startCreateResource(3)">
                  <v-list-item-title>
                    <v-icon size="16" color="#57928D" style="margin-right: 6px">
                      mdi-alpha-d-circle
                    </v-icon>
                    <span style="font-size: 14px">{{ $t('dmnKnowledge') }}</span>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item key="ux" @click="startCreateResource(4)" disabled>
                  <v-list-item-title>
                    <v-icon size="16" color="#FF7754" style="margin-right: 6px">
                      mdi-border-all
                    </v-icon>
                    <span style="font-size: 14px">{{ $t('uxKnowledge') }}</span>
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
            style="height: 100%; border-top: 1px solid rgba(187, 187, 187, 1)"
            :style="leftStylePadding"
          >
            <el-table :data="resources" v-loading="false">
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
                    v-if="props.row.type.value == 2"
                    :to="{
                      name: 'knowledge-modeler-detail',
                      params: { id: props.row.id },
                      query: {
                        folderResource: resource.id,
                        groupId: $route.query.groupId,
                      },
                    }"
                  >
                    <v-icon size="16" color="#0F40F5" style="margin-right: 6px">
                      mdi-alpha-b-box
                    </v-icon>

                    {{ props.row.name }}
                  </router-link>
                  <router-link
                    v-if="props.row.type.value == 3"
                    :to="{
                      name: 'knowledge-dmn-modeler-detail',
                      params: { id: props.row.id },
                      query: {
                        folderResource: resource.id,
                        groupId: $route.query.groupId,
                      },
                    }"
                  >
                    <v-icon size="16" color="#57928D" style="margin-right: 6px">
                      mdi-alpha-d-circle
                    </v-icon>
                    {{ props.row.name }}
                  </router-link>

                  <router-link
                    v-if="props.row.type.value == 4"
                    :to="{
                      name: 'dmn-modeler-detail',
                      params: { id: props.row.id },
                    }"
                  >
                    <v-icon size="16" color="#FF7754" style="margin-right: 6px">
                      mdi-border-all
                    </v-icon>
                    {{ props.row.name }}
                  </router-link>
                </template>
              </el-table-column>

              <el-table-column :label="$t('createdBy')" prop="createdBy" />

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
        </div>
      </v-layout>
    </v-card>
    <v-dialog v-model="searchDialog.display" max-width="300">
      <v-card>
        <v-card-title class="headline" style="color: #444262" />

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
          <v-spacer />
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
        <v-card-title class="headline" style="color: #444262" />
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row style="margin: 0 0 20px 0">
              <v-col style="padding: 0" cols="12">
                <v-text-field
                  :placeholder="$t('enterNameWithType',{type:types[createResourceDialog.type]})"
                  v-model="createResourceDialog.name"
                  hide-details
                  @keydown.enter="createResource()"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer />
          <v-btn text @click="createResourceDialog.display = false"> {{ $t('cancel') }} </v-btn>
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
        <v-card-title class="headline" style="color: #444262" />
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row style="margin: 0 0 20px 0">
              <v-col style="padding: 0" cols="12">
                <v-text-field
                  :placeholder="$t('enterNameWithDot')"
                  v-model="uploadResourceDialog.name"
                  hide-details
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
          <v-spacer />
          <v-btn text @click="uploadResourceDialog.display = false"> {{ $t('cancel') }} </v-btn>
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
        <v-card-title class="headline" style="color: #444262" />
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row style="margin: 0 0 20px 0">
              <v-col style="padding: 0" cols="12">
                <v-text-field
                  :placeholder="$t('enterNameWithType',{type:types[selectedResource.type && selectedResource.type.value]})"
                  :label="$t('name')"
                  v-model="selectedResource.name"
                  hide-details
                  @keydown.enter="updateResource()"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer />
          <v-btn text @click="updateResourceDialog.display = false"> {{ $t('cancel') }} </v-btn>
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
        <v-card-title class="headline" style="color: #444262" />
        <v-card-text>
          是否要删除{{
            `${types[selectedResource.type && selectedResource.type.value]}${
              this.selectedResource.name
            }`
          }}？
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer />
          <v-btn text @click="deleteResourceDialog.display = false"> {{ $t('cancel') }} </v-btn>
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
        <v-card-title class="headline" style="color: #444262"> {{ $t('changeRole') }} </v-card-title>

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
          <v-spacer />
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
        <v-card-title class="headline" style="color: #444262"> {{ $t('deleteMember') }} </v-card-title>
        <v-card-text>{{ $t('deleteMemberConfirmWithName',{name:member && member.name}) }}</v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer />
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
import utils from "@/utils/utils";
import FolderNavigate from "@/components/common/modeler/FolderNavigate";
import ReSizeDrawer from "@/components/common/ReSizeDrawer";
import collaborationRequest from "@/api/collaboration";
import InviteMemberDialog from "@/components/common/InviteMemberDialog";

export default {
  components: { FolderNavigate, ReSizeDrawer, InviteMemberDialog },
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
  },
  data() {
    return {
      leftStylePadding: {},
      leftStyleMargin: {},
      utils,
      collectionName: "test1",
      idBreadcrumbs: [
        {
          text: this.$t("knowledge"),
          href: "#/design/knowledge/list",
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
      },

      roles: [
        {id: 1, name: this.$t("roleTypeOwner")},
        {id: 2, name: this.$t("roleTypeAdmin")},
        {id: 3, name: this.$t("roleTypeEditor")},
        {id: 4, name: this.$t("roleTypeCommentator")},
      ],
      types: {
        1: this.$t("folder"),
        2: this.$t("processKnowledge"),
        3: this.$t("dmnKnowledge"),
        4: this.$t("uxKnowledge"),
      },
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
        self.types["1"]=self.$t("folder");
        self.types["2"]=self.$t("processKnowledge");
        self.types["3"]=self.$t("dmnKnowledge");
        self.types["4"]=self.$t("uxKnowledge");
        self.idBreadcrumbs[0].text = self.$t("knowledge");
      }
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    setLeftWidth(payload) {
      let self = this;
      self.left = payload.left;
      self.leftStylePadding = {
        paddingLeft: `${payload.left ? payload.width : 0}px`,
      };
      self.leftStyleMargin = {
        marginLeft: `${payload.left ? payload.width : 0}px`,
      };
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
      let backUrl = "#/design/knowledge/list";
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
      await camundaRequest.createResource(data);
      this.$message({
        message: `${this.types[this.createResourceDialog.type]}${
          this.createResourceDialog.name
        }${this.$t("successCreate")}。`,
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
        message: `${this.types[this.selectedResource.type.value]}${
          this.selectedResource.name
        }${this.$t("successUpdate")}`,
        type: "success",
        showClose:true
      });
      await this.getResources();

      this.updateResourceDialog.display = false;
    },
    async deleteResource() {
      await camundaRequest.deleteResource(this.selectedResource.id);
      this.$message({
        message: `${this.types[this.selectedResource.type.value]}${
          this.selectedResource.name
        }${this.$t("successDelete")}。`,
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
  border-bottom: 1px solid rgba(238, 238, 238, 100);
  height: 45px;
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
  width: 45px;
  height: 100%;
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
  font-size: 18px;
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
</style>
