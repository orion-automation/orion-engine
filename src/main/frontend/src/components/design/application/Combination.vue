<template>
  <div v-if="application.category === 'combination'">
    <v-tabs v-model="tab" style="width: 100%" background-color="#fafafa" color="#444262">
      <v-tabs-slider color="#FF7754" />

      <v-tab key="basic">{{ $t('basic') }}</v-tab>
      <v-tab key="authority">{{ $t('authority') }}</v-tab>
      <v-tab key="page">{{ $t('page') }}</v-tab>
      <v-tab key="data">{{ $t('data') }}</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" style="flex: 1; height: 100%">
      <v-tab-item key="basic">
        <v-row>
          <v-col :cols="3">
            <v-form style="margin: 20px" lazy-validation>
              <v-text-field
                aria-required=""
                required
                mandatory
                v-model="application.configJson.basic.name"
                :label="$t('appShortName')"
              />
              <v-text-field
                v-model="application.configJson.basic.icon"
                :label="$t('faIcon')"
              />

              <v-radio-group
                v-model="application.configJson.basic.iconType"
                mandatory
                :label="$t('property')"
              >
                <v-radio
                  v-for="option in iconTypes"
                  :key="option.name"
                  :label="option.name"
                  :value="option.id"
                />
              </v-radio-group>
              <v-text-field
                aria-required=""
                required
                mandatory
                v-model="application.configJson.basic.color"
                :label="$t('iconColor')"
              />
            </v-form>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item key="authority">
        <v-row>
          <v-col :cols="6">
            <v-form style="margin: 20px" lazy-validation>
              <v-autocomplete
                :label="$t('appMembers')"
                v-model="searchUser.value"
                :items="searchUser.items"
                :loading="searchUser.loading"
                @change="selectUser()"
                :search-input.sync="searchUser.searchValue"
                small-chips
                multiple
                deletable-chips
                :item-text="(item) => `${item.id} | ${item.firstName} ${item.lastName}`"
                :menu-props="{ zIndex: '1000 !important' }"
                :placeholder="$t('searchAndAddMember')"
                return-object
                hide-no-data
              ></v-autocomplete>

              <v-select
                :label="$t('appGroup')"
                v-model="searchGroup.value"
                :items="searchGroup.items"
                @change="selectGroup()"
                hide-no-data
                hide-details
                hide-selected
                small-chips
                multiple
                item-text="name"
                deletable-chips
                :menu-props="{ zIndex: '1000 !important' }"
                :placeholder="$t('searchAndAddGroup')"
                return-object
              ></v-select>
            </v-form>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item key="page">
        <v-row>
          <v-col :cols="12">
            <v-card color="#ffffff" style="margin: 20px">
              <v-card-title
                style="
                  padding: 0 0 0 16px;
                  border-bottom: 1px solid rgba(238, 238, 238, 100);
                "
              >
                <span style="font-size: 12px; color: #83829a"></span>

                <v-spacer />
                <v-btn
                  large
                  text
                  style="
                    border-left: 1px solid rgba(187, 187, 187, 1);
                    border-right: 0 solid rgba(187, 187, 187, 1);
                  "
                  @click="addPage()"
                >
                  <v-icon size="16" color="#FF7754" style="margin-right: 6px">
                    mdi-plus
                  </v-icon>
                  <span style="color: #444262; font-size: 14px">{{ $t('add') }}</span>
                </v-btn>
              </v-card-title>
              <el-table :data="application.configJson.page">
                <el-table-column prop="id" :label="$t('page')" width="100"></el-table-column>
                <el-table-column :label="$t('name')" width="250">
                  <template slot-scope="props">
                    {{ formatPage(props.row.id) }}
                  </template>
                </el-table-column>

                <el-table-column :label="$t('userAuth')">
                  <template slot-scope="props">
                    <v-badge
                      v-for="user in props.row.users"
                      :key="user.id"
                      inline
                      color="#009688"
                    >
                      <template #badge>
                        <div>
                          {{ user.firstName + " " + user.lastName }}
                        </div>
                      </template>
                    </v-badge>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('groupAuth')">
                  <template slot-scope="props">
                    <v-badge
                      v-for="group in props.row.groups"
                      :key="group.id"
                      inline
                      color="#009688"
                    >
                      <template #badge>
                        <div>
                          {{ group.name }}
                        </div>
                      </template>
                    </v-badge>
                  </template>
                </el-table-column>
                <el-table-column align="center" :label="$t('operate')" width="180">
                  <template slot-scope="props">
                    <v-btn
                      icon
                      @click="moveUpPage(props.row)"
                      style="border-right: unset"
                      :disabled="application.configJson.page.indexOf(props.row) === 0"
                    >
                      <v-icon size="20" color="#312651" style="margin: 0">
                        mdi-arrow-up
                      </v-icon>
                    </v-btn>

                    <v-btn
                      icon
                      @click="moveDownPage(props.row)"
                      style="border-right: unset"
                      :disabled="
                        application.configJson.page.indexOf(props.row) ===
                        application.configJson.page.length - 1
                      "
                    >
                      <v-icon size="20" color="#312651" style="margin: 0">
                        mdi-arrow-down
                      </v-icon>
                    </v-btn>
                    <v-btn icon @click="editPage(props.row)" style="border-right: unset">
                      <v-icon size="20" color="#3D5AFE" style="margin: 0">
                        mdi-pencil
                      </v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      @click="deletePage(props.row)"
                      style="border-right: unset"
                    >
                      <v-icon size="20" color="#FF7754" style="margin: 0">
                        mdi-delete-forever
                      </v-icon>
                    </v-btn>
                  </template>
                  <!-- <template slot-scope="props">
                    <v-menu>
                      <template #activator="{ on, attrs }">
                        <v-icon
                          size="20"
                          color="#444262"
                          v-bind="attrs"
                          v-on="on"
                          @click="application = props.row"
                        >
                          mdi-dots-vertical
                        </v-icon>
                      </template>
                      abc
                    </v-menu>
                  </template> -->
                </el-table-column>
              </el-table>
            </v-card>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item key="data">
        <v-row>
          <v-col :cols="12">
            <v-card color="#ffffff" style="margin: 20px">
              <v-card-title
                style="
                  padding: 0 0 0 16px;
                  border-bottom: 1px solid rgba(238, 238, 238, 100);
                "
              >
                <span style="font-size: 12px; color: #83829a"></span>

                <v-spacer />
                <v-btn
                  large
                  text
                  style="
                    border-left: 1px solid rgba(187, 187, 187, 1);
                    border-right: 0 solid rgba(187, 187, 187, 1);
                  "
                  @click="addData()"
                >
                  <v-icon size="16" color="#FF7754" style="margin-right: 6px">
                    mdi-plus
                  </v-icon>
                  <span style="color: #444262; font-size: 14px">{{ $t('add') }}</span>
                </v-btn>
              </v-card-title>
              <el-table :data="application.configJson.data">
                <el-table-column prop="id" label="URL"></el-table-column>
                <el-table-column :label="$t('name')" prop="name" width="200"> </el-table-column>

                <el-table-column :label="$t('userAuth')">
                  <template slot-scope="props">
                    <v-badge
                      v-for="user in props.row.users"
                      :key="user.id"
                      inline
                      color="#BBBBBB"
                    >
                      <template #badge>
                        <div>
                          {{ user.firstName + " " + user.lastName }}
                        </div>
                      </template>
                    </v-badge>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('groupAuth')">
                  <template slot-scope="props">
                    <v-badge
                      v-for="group in props.row.groups"
                      :key="group.id"
                      inline
                      color="#BBBBBB"
                    >
                      <template #badge>
                        <div>
                          {{ group.name }}
                        </div>
                      </template>
                    </v-badge>
                  </template>
                </el-table-column>
                <el-table-column align="center" :label="$t('operate')" width="180">
                  <template slot-scope="props">
                    <v-btn
                      icon
                      @click="moveUpData(props.row)"
                      style="border-right: unset"
                      :disabled="application.configJson.data.indexOf(props.row) === 0"
                    >
                      <v-icon size="20" color="#312651" style="margin: 0">
                        mdi-arrow-up
                      </v-icon>
                    </v-btn>

                    <v-btn
                      icon
                      @click="moveDownData(props.row)"
                      style="border-right: unset"
                      :disabled="
                        application.configJson.data.indexOf(props.row) ===
                        application.configJson.data.length - 1
                      "
                    >
                      <v-icon size="20" color="#312651" style="margin: 0">
                        mdi-arrow-down
                      </v-icon>
                    </v-btn>
                    <v-btn icon @click="editData(props.row)" style="border-right: unset">
                      <v-icon size="20" color="#3D5AFE" style="margin: 0">
                        mdi-pencil
                      </v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      @click="deleteData(props.row)"
                      style="border-right: unset"
                    >
                      <v-icon size="20" color="#FF7754" style="margin: 0">
                        mdi-delete-forever
                      </v-icon>
                    </v-btn>
                  </template>
                </el-table-column>
              </el-table>
            </v-card>
          </v-col>
        </v-row>
      </v-tab-item>
    </v-tabs-items>
    <page-item
      :item="page"
      :users="users"
      :groups="groups"
      :pages="pages"
      ref="pageItem"
      @save="savePage"
    />
    <data-item
      :item="data"
      :users="users"
      :groups="groups"
      ref="dataItem"
      @save="saveData"
    />
  </div>
</template>
<script>
import userRequest from "@/api/user";
import groupRequest from "@/api/group";
import camundaRequest from "@/api/camunda-service";
import DataItem from "./DataItem";
import PageItem from "./PageItem";
export default {
  components: { PageItem, DataItem },
  props: {
    application: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tab: 0,
      page: {
        id: "",
        promote: "",
        aiCallProcessKey: "",
        icon: "",
        processKeys: "",
        users: [],
        groups: [],
      },
      data: {
        id: "",
        name: "",
        users: [],
        groups: [],
      },
      pages: [],
      iconTypes: [
        {id: "fal", name: this.$t("iconTypeLight")},
        {id: "far", name: this.$t("iconTypeRegular")},
        {id: "fas", name: this.$t("iconTypeSolid")},
        {id: "fad", name: this.$t("iconTypeDuotone")},
        {id: "fab", name: this.$t("iconTypeBrand")},
      ],
      searchUser: {
        loading: false,
        items: [],
        value: [],
        searchValue: "",
      },
      searchGroup: {
        loading: false,
        items: [],
        value: [],
        searchValue: "",
      },
    };
  },
  watch: {
    "searchUser.searchValue": {
      async handler(val) {
        if (!val || val.length === 0) {
          return;
        }
        if (this.searchUser.loading) return;
        this.searchUser.loading = true;
        let users = await userRequest.getEnhancementUsers({
          nameLike: `%${val}%`,
        });
        users = users.filter(
          (user) => !this.searchUser.value.find((value) => value.id == user.id)
        );
        Array.prototype.push.apply(users, this.searchUser.value);
        this.searchUser.items = users;
        this.searchUser.loading = false;
      },
    },
    "$i18n.locale": {
      handler(val) {
        let self = this;
        self.iconTypes[0].name = self.$t("iconTypeLight");
        self.iconTypes[1].name = self.$t("iconTypeRegular");
        self.iconTypes[2].name = self.$t("iconTypeSolid");
        self.iconTypes[3].name = self.$t("iconTypeDuotone");
        self.iconTypes[4].name = self.$t("iconTypeBrand");
      }
    }
  },
  computed: {
    users() {
      let result = [];
      if (
        this.application.configJson.authority &&
        this.application.configJson.authority.users
      ) {
        result = JSON.parse(JSON.stringify(this.application.configJson.authority.users));
      }
      return result;
    },
    groups() {
      let result = [];
      if (
        this.application.configJson.authority &&
        this.application.configJson.authority.groups
      ) {
        result = JSON.parse(JSON.stringify(this.application.configJson.authority.groups));
      }
      return result;
    },
  },
  mounted() {},
  methods: {
    async init() {
      let users = [];
      if (
        this.application.configJson.authority &&
        this.application.configJson.authority.users
      ) {
        users = JSON.parse(JSON.stringify(this.application.configJson.authority.users));
      }
      this.pages = await camundaRequest.searchResources({
        typesIn: 5,
      });
      this.searchUser = {
        loading: false,
        items: users,
        value: users,
        searchValue: "",
      };
      let groups = await groupRequest.postGroups(
        {},
        {
          member: this.$store.state.user.profile.id,
        }
      );
      this.searchGroup = {
        loading: false,
        items: groups,
        value: [],
        searchValue: "",
      };

      if (
        this.application.configJson.authority &&
        this.application.configJson.authority.groups
      ) {
        let items = this.application.configJson.authority.groups.map((group) => {
          return this.searchGroup.items.find((item) => item.id == group.id);
        });
        this.searchGroup.value = items;
      }
    },

    selectUser() {
      this.application.configJson.authority.users = this.searchUser.value.map((user) => {
        return Object.assign({}, user);
      });

      this.application.accessUsers = this.searchUser.value
        .map((user) => user.id)
        .toString();
      this.application.configJson.page.forEach((page) => {
        let excludes = page.users.filter((user) => {
          return !this.application.configJson.authority.users.find(
            (item) => item.id == user.id
          );
        });
        excludes.forEach((exclude) => {
          let index = page.users.indexOf(exclude);
          page.users.splice(index, 1);
        });
      });
      this.application.configJson.data.forEach((data) => {
        let excludes = data.users.filter((user) => {
          return !this.application.configJson.authority.users.find(
            (item) => item.id == user.id
          );
        });
        excludes.forEach((exclude) => {
          let index = data.users.indexOf(exclude);
          data.users.splice(index, 1);
        });
      });
    },

    selectGroup() {
      this.application.configJson.authority.groups = this.searchGroup.value.map(
        (group) => {
          return Object.assign({}, group);
        }
      );

      this.application.userGroup = this.searchGroup.value
        .map((group) => group.id)
        .toString();

      this.application.configJson.page.forEach((page) => {
        let excludes = page.groups.filter((group) => {
          return !this.application.configJson.authority.groups.find(
            (item) => item.id == group.id
          );
        });
        excludes.forEach((exclude) => {
          let index = page.groups.indexOf(exclude);
          page.groups.splice(index, 1);
        });
      });
      this.application.configJson.data.forEach((data) => {
        let excludes = data.groups.filter((group) => {
          return !this.application.configJson.authority.groups.find(
            (item) => item.id == group.id
          );
        });
        excludes.forEach((exclude) => {
          let index = data.groups.indexOf(exclude);
          data.groups.splice(index, 1);
        });
      });
    },
    addPage() {
      Object.assign(this.page, {
        id: "",
        promote: "",
        aiCallProcessKey: "",
        icon: "",
        processKeys: "",
        users: [],
        groups: [],
      });
      this.$refs.pageItem.show(this.application.configJson.page.map((page) => page.id));
    },
    editPage(page) {
      Object.assign(this.page, page);
      let pages = this.application.configJson.page;

      this.$refs.pageItem.show(
        pages.filter((item) => item !== page).map((item) => item.id)
      );
    },
    savePage(id) {
      let pages = this.application.configJson.page;
      let page = pages.find((page) => page.id === id);
      let index = page ? pages.indexOf(page) : pages.length;
      pages.splice(index, 1, JSON.parse(JSON.stringify(this.page)));
    },
    deletePage(page) {
      let pages = this.application.configJson.page;
      let index = pages.indexOf(page);
      pages.splice(index, 1);
    },

    moveUpPage(page) {
      let pages = this.application.configJson.page;
      let index = pages.indexOf(page);
      pages.splice(index, 1);
      pages.splice(index - 1, 0, page);
    },
    moveDownPage(page) {
      let pages = this.application.configJson.page;
      let index = pages.indexOf(page);
      pages.splice(index, 1);
      pages.splice(index + 1, 0, page);
    },

    addData() {
      Object.assign(this.data, {
        id: "",
        name: "",
        users: [],
        groups: [],
      });
      this.$refs.dataItem.show(this.application.configJson.data.map((data) => data.id));
    },
    editData(data) {
      Object.assign(this.data, data);
      let datas = this.application.configJson.data;

      this.$refs.dataItem.show(
        datas.filter((item) => item !== data).map((item) => item.id)
      );
    },
    saveData(id) {
      let datas = this.application.configJson.data;
      let data = datas.find((data) => data.id === id);
      let index = data ? datas.indexOf(data) : datas.length;
      datas.splice(index, 1, JSON.parse(JSON.stringify(this.data)));
    },
    deleteData(data) {
      let datas = this.application.configJson.data;
      let index = datas.indexOf(data);
      datas.splice(index, 1);
    },

    moveUpData(data) {
      let datas = this.application.configJson.data;
      let index = datas.indexOf(data);
      datas.splice(index, 1);
      datas.splice(index - 1, 0, data);
    },
    moveDownData(data) {
      let datas = this.application.configJson.data;
      let index = datas.indexOf(data);
      datas.splice(index, 1);
      datas.splice(index + 1, 0, data);
    },
    formatPage(id) {
      let item = this.pages.find((page) => page.id === id);
      return (item && item.name) || "";
    },
  },
};
</script>

<style scoped></style>
