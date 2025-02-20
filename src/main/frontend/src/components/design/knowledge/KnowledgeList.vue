<template>
  <div style="border-top: 1px solid rgba(187, 187, 187, 1)">
    <div style="padding: 14px 15px">
      <v-breadcrumbs
        :items="breadcrumbs"
        style="background-color: #e8eff7; padding: 0; border: none"
        divider="|"
      />
    </div>

    <v-card class="detail-card" style="border-top: 1px solid rgba(187, 187, 187, 1)">
      <v-layout style="margin: 0" class="stretch">
        <div style="display: flex; flex-direction: column; width: 100%">
          <el-row
            type="flex"
            justify="start"
            class="menu-border"
            style="border-bottom-width: 0px"
          >
            <span
              style="
                height: 100%;
                font-size: 14px;
                line-height: 44px;
                margin-left: 15px;
                color: #83829a;
              "
            >{{ $t('knowledgeTenant') }}</span>
            <v-select
              class="group-select ml-4"
              :full-width="true"
              :single-line="true"
              hide-details
              return-object
              @change="getProjects()"
              :items="groups"
              item-value="id"
              item-text="name"
              v-model="group"
              dense
              :no-data-text="$t('noGroupData')"
              style="height: 100%; margin: 0; margin-top: 1px; font-size: 14px"
            />
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

            <v-btn large text :disabled="!group" class="process-menu" @click="create()">
              <v-icon size="16" color="#83829A" style="margin-right: 6px">
                mdi-plus-box
              </v-icon>
              <span style="color: #444262; font-size: 14px">{{ $t('createKnowledge') }}</span>
            </v-btn>
          </el-row>

          <el-row style="height: 100%; border-top: 1px solid rgba(187, 187, 187, 1)">
            <el-table :data="projects" v-loading="false" stripe>
              <el-table-column label="" width="10" />
              <el-table-column>
                <template slot="header">{{ $t('name') }}</template>

                <template slot-scope="props">
                  <router-link
                      @click.native="onClickItem(props.row)"
                    :to="{}"
                  >
                    <v-icon size="16" color="#1976d2" style="margin-right: 6px">
                      mdi-folder-network
                    </v-icon>
                    {{ props.row.name }}
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column prop="tags">
                <template slot="header">{{ $t('usage') }}</template>
              </el-table-column>
              <el-table-column>
                <template slot="header"> {{ $t('lastUpdate') }} </template>

                <template slot-scope="props">
                  {{ utils.formatDateTime(props.row.createdTs) }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('collaborator')">
                <template slot-scope="props">
                  <v-chip
                    class="ma-2"
                    color="#444262"
                    label
                    x-small
                    text-color="white"
                    v-for="(member, index) in props.row.members.slice(0, 2)"
                    style="
                      border: 2px solid rgba(255, 255, 255, 1);
                      font-size: 12px;
                      padding: 8px 8px;
                      border-radius: 8px !important;
                    "
                    :style="
                      index > 0
                        ? { marginLeft: '-20px !important' }
                        : { marginLeft: '0 !important' }
                    "
                    :key="member.id"
                  >
                    {{ member.name }}
                  </v-chip>
                  <v-chip
                    v-if="props.row.members.length > 2"
                    class="ma-2"
                    color="#444262"
                    label
                    x-small
                    text-color="white"
                    style="
                      border: 2px solid rgba(255, 255, 255, 1);
                      font-size: 12px;
                      padding: 8px 8px;
                      border-radius: 8px !important;
                      margin-left: -20px !important;
                    "
                  >
                    {{ props.row.members.length }}
                  </v-chip>
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
                        @click="project = props.row"
                      >
                        mdi-dots-vertical
                      </v-icon>
                    </template>
                    <v-list style="cursor: pointer" dense>
                      <v-list-item key="rename">
                        <v-list-item-title @click="rename()">
                          <v-icon
                            size="16"
                            color="#83829a"
                            style="margin-right: 6px; margin-bottom: 3px"
                          >
                            mdi-rename-box
                          </v-icon>
                          <span style="font-size: 14px">{{ $t('rename') }}</span>
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item key="delete"
                                   @click="project.hasAuth?deleteDialog.display = true:$store.dispatch('common/setResourceDialog', {show: true, redirectUrl: $route.path})"
                      >
                        <v-list-item-title>
                          <v-icon
                            size="16"
                            color="#e91e63"
                            style="margin-right: 6px; margin-bottom: 3px"
                          >
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
    <v-dialog v-model="deleteDialog.display" max-width="300">
      <v-card>
        <v-card-title class="headline" style="color: #444262" />

        <v-card-text> 是否要删除知识“{{ project && project.name }}”？ </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer />
          <v-btn text @click="deleteDialog.display = false"> {{ $t('cancel') }}</v-btn>
          <v-btn
            style="color: #ffffff"
            color="#FF7754"
            box-shadow="none"
            @click="deleteProject()"
          >
            <v-icon size="14" color="#ffffff" style="margin-right: 5px">
              mdi-delete
            </v-icon>
            {{ $t('delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="createDialog.display" max-width="300">
      <v-card>
        <v-card-title class="headline" style="color: #444262" />
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row style="margin: 0">
              <v-col style="padding: 0" cols="12">
                <v-text-field
                  :label="$t('name')"
                  :placeholder="$t('plsEnterKnowledgeName')"
                  v-model="createDialog.name"
                  hide-details
                  @keydown.enter="createProject()"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer />
          <v-btn text @click="createDialog.display = false"> {{ $t('cancel') }}</v-btn>
          <v-btn
            style="color: #ffffff"
            color="#FF7754"
            box-shadow="none"
            @click="createProject()"
          >
            <v-icon size="16" color="#ffffff" style="margin-right: 6px">
              mdi-content-save
            </v-icon>
            {{ $t('save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="searchDialog.display" max-width="300">
      <v-card>
        <v-card-title class="headline" style="color: #444262" />

        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row style="margin: 0 0 20px 0">
              <v-col style="padding: 0" cols="12">
                <v-text-field
                  :label="$t('name')"
                  :placeholder="$t('plsEnterKnowledgeName')"
                  v-model="searchDialog.name"
                  hide-details
                  @keydown.enter="getProjects()"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer />
          <v-btn text @click="searchDialog.display = false"> {{ $t('cancel') }}</v-btn>
          <v-btn
            style="color: #ffffff"
            color="#ff7754"
            box-shadow="none"
            @click="getProjects()"
          >
            <v-icon size="16" color="#ffffff" style="margin-right: 6px">
              mdi-magnify
            </v-icon>
            <span>{{ $t('query') }}</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="updateDialog.display" max-width="300">
      <v-card>
        <v-card-title class="headline" style="color: #444262" />

        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row style="margin: 0 0 20px 0">
              <v-col style="padding: 0" cols="12">
                <v-text-field
                  :label="$t('name')"
                  :placeholder="$t('plsEnterKnowledgeName')"
                  v-model="updateDialog.name"
                  hide-details
                  @keydown.enter="updateProject()"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer />
          <v-btn text @click="updateDialog.display = false"> {{ $t('cancel') }}</v-btn>
          <v-btn
            style="color: #ffffff"
            color="#ff7754"
            box-shadow="none"
            @click="updateProject()"
          >
            <v-icon size="16" color="#ffffff" style="margin-right: 6px">
              mdi-content-save
            </v-icon>
            {{ $t('save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import userRequest from "@/api/user";
import camundaRequest from "@/api/camunda-service";
import utils from "@/utils/utils";
import {getDefaultGroup, setDefaultGroup} from "@/utils/auth";

export default {
  components: {},
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
  },
  data() {
    return {
      utils,
      breadcrumbs: [
        {
          text: this.$t("knowledge"),
          href: "#/design/knowledge/list",
        },
      ],
      breadcrumbSummary: {
        version: null,
        instance: null,
        incident: null,
      },
      groups: [],
      group: null,
      projects: [],
      project: null,
      tenant: {
        id: this.$store.state.user.tenant,
        name: this.$store.state.user.tenantName,
      },
      createDialog: {
        display: false,
        name: "",
      },
      deleteDialog: {
        display: false,
      },
      searchDialog: {
        display: false,
        name: "",
      },
      updateDialog: {
        display: false,
        name: "",
      },
    };
  },
  watch: {
    group: {
      handler(val) {
        if (val) {
          setDefaultGroup(val.id);
        }
      }
    },
    "$i18n.locale": {
      handler(val) {
        let self = this;
        self.idBreadcrumbs[0].text = self.$t("knowledge");
      }
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    async onClickItem(item) {
      let self = this;
      // 权限校验
      let route = {
        name: "knowledge-detail",
        params: {id: `${item.id}`},
        query: {groupId: self.group.id}
      };
      if (item.hasAuth) {
        await self.$router.push(route);
      } else {
        let path = self.$route.path;
        await self.$store.dispatch("common/setResourceDialog", {show: true, redirectUrl: path});
      }
    },
    async getData() {
      this.breadcrumbSummary.version = 9;
      this.breadcrumbSummary.incident = 3;
      this.breadcrumbSummary.instance = 8;
      if (!this.tenant.id){
        const tenants = await userRequest.getMemberTenants(this.userId);
        if (tenants.length) {
          this.tenant = tenants[0];
        }
      }
      this.groups = await userRequest.getMemberGroups(this.userId);
      if (this.groups.length) {
        let currentGroupIndex = 0;
        if (this.$route.query.defaultGroup) {
          currentGroupIndex = this.groups.findIndex(
            (group) => group.id == this.$route.query.defaultGroup
          );
        }
        let lastGroup=getDefaultGroup();
        if (lastGroup){
          currentGroupIndex = this.groups.findIndex(group => group.id == lastGroup);
        }
        if (currentGroupIndex===-1){
          currentGroupIndex=0;
        }
        this.group = this.groups[currentGroupIndex];
        await this.getProjects();
      }
    },
    async getProjects() {
      let self=this;
      let data = await camundaRequest.getProjects({
        tenant: this.tenant.id,
        coeCode: this.group.id,
        nameLike: this.searchDialog.name,
        type: 3,
      });
      data.forEach(project => {
        project.hasAuth = !!project.members.find((member) => member.userId == self.userId) || self.userId == project.owner;
      });
      this.projects = data;
      this.searchDialog.display = false;
    },
    async createProject() {
      await camundaRequest.createProject({
        tenant: this.tenant.id,
        name: this.createDialog.name,
        coeCode: this.group.id,
        type: 3,
      });
      this.$message({
        message: `知识${this.createDialog.name}${this.$t("successCreate")}`,
        type: "success",
        showClose:true
      });
      await this.getProjects();
      this.createDialog.display = false;
    },
    async updateProject() {
      let data = JSON.parse(JSON.stringify(this.project));
      data.name = this.updateDialog.name;
      await camundaRequest.updateProject(data);
      this.$message({
        message: `知识${this.updateDialog.name}${this.$t("saveSuccess")}`,
        type: "success",
        showClose:true
      });
      await this.getProjects();
      this.updateDialog.display = false;
      this.project = null;
    },
    async deleteProject() {
      await camundaRequest.deleteProject(this.project.id);
      this.$message({
        message: `知识${this.project.name}${this.$t("successDelete")}`,
        type: "success",
        showClose:true
      });
      await this.getProjects();
      this.deleteDialog.display = false;
      this.project = null;
    },

    create() {
      this.createDialog.name = "";
      this.createDialog.display = true;
    },
    rename() {
      if (this.project.hasAuth) {
        this.updateDialog.name = this.project.name;
        this.updateDialog.display = true;
      } else {
        let path = this.$route.path;
        this.$store.dispatch("common/setResourceDialog", {show: true, redirectUrl: path});
      }
    },
  },
};
</script>

<style scoped>
div.v-list-item__subtitle.subtitle {
  color: rgba(136, 136, 136, 100);
  font-size: 0.8em;
  text-align: left;
}

.id-breadcrumbs .v-breadcrumbs__item.v-breadcrumbs__item--disabled {
  color: #83829a;
}

button.process-menu {
  padding: 0 10px;
}

.title-menu {
  padding-left: 15px;
  font-size: 13px;
  color: #312651;
  margin-top: auto;
  margin-bottom: auto;
}

button.process-menu span {
  color: rgba(33, 33, 33, 100);
  font-size: 0.8em;
}

div.stretch {
  /* min-height: calc(100vh - 113px); */
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
  border-top: 1px solid #e6e4e6;
  border-bottom: 1px solid #e6e4e6;
  height: 42px;
}

.box-icon {
  width: 45px;
  height: 100%;
  border-right: 1px solid #e6e4e6;
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

.box-title span {
  color: #444262;
  font-size: 14px;
  margin-left: 10px;
}

.box-icon i.theme--light.v-icon {
  font-size: 18px;
}

.header-icon {
  margin-right: 12px;
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

.box .nav-item .name {
  width: 30px;
  height: 30px;
  background-color: #312651;
  color: #ffffff;
  margin-top: 10px;
  border-radius: 50%;
  text-align: center;
}

.box .nav-item .name span {
  vertical-align: middle;
  font-size: 14px;
}

.box .nav-item .content {
  flex: 1;
  margin: 10px 0 10px 15px;
}

.box .nav-item .main {
  color: #444262;
  font-size: 14px;
}

.box .nav-item.active .main {
  color: #312651;
  font-weight: bold;
  font-size: 14px;
}

.box .more {
  margin: auto;
  height: 25px;
  opacity: 0;
}

.box .nav-item:hover .more {
  opacity: 1;
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

.box .nav-input input {
  flex: 1;
  height: 30px;
  border: 1px solid #e6e4e6;
  padding: 5px;
}

/deep/ .group-select.v-text-field > .v-input__control > .v-input__slot {
  width: 300px;
}

/deep/ .group-select.v-text-field > .v-input__control > .v-input__slot::before,
/deep/ .group-select.v-text-field > .v-input__control > .v-input__slot::after {
  border-style: none;
}
</style>
