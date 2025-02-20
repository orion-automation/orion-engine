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
              <v-text-field v-model="item.id" label="URL" />
            </v-col>
            <v-col style="padding: 4px 0" cols="12">
              <v-text-field v-model="item.name" :label="$t('name')" />
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
import utils from "@/utils/utils";
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
  watch: {},
  mounted() {},
  methods: {
    async show(ids) {
      this.editingId = this.item.id;
      this.excludes = ids;

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
