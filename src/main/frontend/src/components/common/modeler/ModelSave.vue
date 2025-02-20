<template>
  <v-dialog v-model="display" max-width="500">
    <v-card>
      <v-card-title class="headline" style="color: #444262">
        {{ $t(items.length ? "saveAsNewMilestone" : "saveAsNowVersion") }}
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-row style="margin: 0 0 20px 0">
            <v-col style="padding: 0" cols="12">
              <v-text-field
                :label="$t('name')"
                :placeholder="
                  items.length ? '给里程碑起个名称' : '初始版本名称'
                "
                v-model="name"
                @change="setCurrent(null)"
                @keydown.enter="()=>{}"
                hide-details
              />
            </v-col>
          </v-row>

          <el-table
            ref="table"
            v-show="items.length"
            highlight-current-row
            :data="items"
            @current-change="selectVersion"
          >
            <el-table-column :label="$t('versionNumber')" prop="version" width="80" />
            <el-table-column :label="$t('versionName')" prop="name" />
            <el-table-column width="180" :label="$t('versionTime')">
              <template slot-scope="props">
                {{ utils.formatDateTime(Number(props.row.updatedAt)) }}
              </template>
            </el-table-column>
          </el-table>
        </v-form>
      </v-card-text>
      <v-card-actions style="padding-bottom: 16px">
        <v-spacer />
        <v-btn text @click="display = false"> {{ $t('cancel') }} </v-btn>
        <v-btn
          :disabled="!name && !selectedItem"
          style="color: #ffffff"
          color="#FF7754"
          @click="save()"
        >
          <v-icon size="14" color="#ffffff" style="margin-right: 5px">
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
import instanceRequest from "@/api/instance";
import utils from "@/utils/utils";

export default {
  name: "ModelSave",
  components: {},
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      utils: utils,
      name: "",
      selectedItem: null,
      display: false,
    };
  },
  watch: {},
  computed: {},

  mounted() {},
  methods: {
    async start() {
      this.display = true;
      this.name = this.items.length ? "" : this.$t("originVersion");
      this.setCurrent(null);
    },

    setCurrent(row) {
      if (this.$refs.table) {
        this.$refs.table.setCurrentRow(row);
      }
    },
    selectVersion(item) {
      this.selectedItem = item;
      if (item) {
        this.name = "";
      }
    },
    save() {
      let setting = this.selectedItem
        ? {
            id: this.selectedItem.id,
          }
        : {
            name: this.name,
          };
      this.$emit("save", setting);
      this.display = false;
    },
  },
};
</script>

<style scoped>
.checkbox-label {
  color: #444262;
}
</style>
