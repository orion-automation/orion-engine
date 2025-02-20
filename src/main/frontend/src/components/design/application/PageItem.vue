<template>
  <v-dialog v-model="display" max-width="500">
    <v-card>
      <v-card-title class="headline" style="color: #444262"
        >{{ $t("editPageConfigWithOperate",{opt:$t(editingId ? "modify" : "add")}) }}
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-row style="margin: 0">
            <v-col style="padding: 4px 0" cols="12">
              <!-- <v-autocomplete
                :label="$t('page')"
                v-model="searchPage.value"
                :items="searchPage.items"
                :loading="searchPage.loading"
                @change="selectPage()"
                :search-input.sync="searchPage.searchValue"
                small-chips
                deletable-chips
                item-text="name"
                :menu-props="{ zIndex: '1000 !important' }"
                placeholder="搜索页面..."
                return-object
                hide-no-data
                hide-details
                hide-selected
              ></v-autocomplete> -->
            </v-col>

            <v-col style="padding: 4px 0" cols="12">
              <v-select
                :label="$t('page')"
                v-model="searchPage.value"
                :items="pages"
                @change="selectPage()"
                hide-no-data
                hide-details
                hide-selected
                :item-text="(item) => `${item.name}`"
                deletable-chips
                :menu-props="{ zIndex: '1000 !important' }"
                :placeholder="$t('selectPage')"
                return-object
              ></v-select>
            </v-col>

            <v-col style="padding: 4px 0" cols="12">
              <v-text-field v-model="item.icon" :label="$t('faIcon')" />
            </v-col>

            <v-col style="padding: 4px 0" cols="12">
              <v-select
                :label="$t('userAuth')"
                v-model="searchUser.value"
                :items="searchUser.items"
                @change="selectUser()"
                hide-no-data
                hide-details
                hide-selected
                small-chips
                multiple
                :item-text="(item) => `${item.id} | ${item.firstName} ${item.lastName}`"
                deletable-chips
                :menu-props="{ zIndex: '1000 !important' }"
                :placeholder="$t('searchAndAddUserAuth')"
                return-object
              ></v-select>
            </v-col>

            <v-col style="padding: 4px 0" cols="12">
              <v-select
                :label="$t('groupAuth')"
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
                :placeholder="$t('searchAndAddGroupAuth')"
                return-object
              ></v-select>
            </v-col>
            <v-col style="padding: 4px 0; margin-top: 10px" cols="12">
              <v-textarea
                rows="3"
                outlined
                hide-details
                v-model="item.processKeys"
                :placeholder="$t('undoProcessDef')"
              />
            </v-col>
            <v-col style="padding: 4px 0; margin-top: 10px" cols="12">
              <v-select
                :label="$t('defaultAiModel')"
                v-model="item.aiCallProcessKey"
                :items="copilotCalls"
                hide-no-data
                hide-details
                hide-selected
                :item-value="(item) => `${item.key}`"
                :item-text="(item) => `${item.name}`"
                deletable-chips
                :menu-props="{ zIndex: '1000 !important' }"
                :placeholder="$t('selectAiModel')"
              ></v-select>
            </v-col>
            <v-col style="padding: 4px 0; margin-top: 10px" cols="12">
              <v-textarea
                rows="3"
                outlined
                hide-details
                v-model="item.promote"
                :placeholder="$t('defaultPromote')"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions style="padding-bottom: 16px">
        <v-spacer />
        <v-btn text @click="display = false"> {{ $t('cancel') }}</v-btn>
        <v-btn
          :disabled="!item.id"
          style="color: #ffffff"
          color="#FF7754"
          @click="save()"
        >
          <v-icon size="16" color="#ffffff" style="margin-right: 6px">
            mdi-content-save
          </v-icon>
          {{ $t('save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import processRequest from "@/api/process";

export default {
  components: {},
  props: {
    users: {
      type: Array,
      required: true,
    },
    groups: {
      type: Array,
      required: true,
    },
    pages: {
      type: Array,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {},

  data() {
    return {
      display: false,
      editingId: "",
      excludes: [],
      searchPage: {
        loading: false,
        items: [],
        value: null,
        searchValue: "",
      },
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

      copilotCalls: [],
    };
  },
  watch: {
    "searchPage.searchValue": {
      async handler(val) {
        if (!val || val.length === 0) {
          return;
        }
        let pages = this.pages.filter((page) => page.name.indexOf(val) >= 0);
        this.searchPage.items = pages;
      },
    },
  },
  mounted() {},
  methods: {
    async show(ids) {
      let copilotCalls = await processRequest.getProcessByDeployment({
        latestVersion: true,
        active: true,
        keyLike: "%bpezAICopilotCall%",
      });
      this.copilotCalls = copilotCalls;
      this.editingId = this.item.id;
      this.excludes = ids;
      this.searchPage = {
        loading: false,
        items: [],
        value: null,
        searchValue: "",
      };

      let item = this.pages.find((page) => page.id === this.item.id);
      if (item) {
        this.searchPage.value = item;
        this.searchPage.items.push(item);
      }

      this.searchUser = {
        loading: false,
        items: this.users,
        value: [],
        searchValue: "",
      };

      let items = JSON.parse(JSON.stringify(this.item.users));
      this.searchUser.value = items;
      Array.prototype.push.apply(this.searchUser.items, items);

      this.searchGroup = {
        loading: false,
        items: this.groups,
        value: [],
        searchValue: "",
      };
      items = JSON.parse(JSON.stringify(this.item.groups));
      this.searchGroup.value = items;
      Array.prototype.push.apply(this.searchGroup.items, items);

      this.display = true;
    },
    selectPage() {
      this.item.id = this.searchPage.value && this.searchPage.value.id;
    },
    selectUser() {
      this.item.users = this.searchUser.value.map((user) => {
        return Object.assign({}, user);
      });
    },

    selectGroup() {
      this.item.groups = this.searchGroup.value.map((group) => {
        return Object.assign({}, group);
      });
    },

    save() {
      if (this.excludes.indexOf(this.item.id) >= 0) {
        this.$message({
          message: this.$t("pageConfigCommon"),
          type: "error",
          showClose:true
        });
        return;
      }
      this.$emit("save", this.editingId);
      this.display = false;
    },
  },
};
</script>

<style scoped></style>
