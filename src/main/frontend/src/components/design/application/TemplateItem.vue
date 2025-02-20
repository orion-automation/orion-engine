<template>
  <v-dialog v-model="display" max-width="500">
    <v-card>
      <v-card-title class="headline" style="color: #444262">
        {{ $t("editValueWithOperateAndKey",{opt:$t(row.index === items.length ? "newCreate" : "edit"),key:templateTypes[row.type]}) }}
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-row style="margin: 0">
            <v-col style="padding: 4px 0" cols="12">
              <v-text-field
                v-show="row.type !== 'requestBody'"
                label="Key"
                :placeholder="$t('plsEnterKey')"
                v-model="row.data.key"
                hide-details
              />
              <v-select
                v-show="row.type === 'requestBody'"
                hide-details
                :placeholder="$t('plsSelectKey')"
                @change="changeKey()"
                :items="options"
                item-value="key"
                item-text="key"
                v-model="row.data.key"
                :no-data-text="$t('noAddableVar')"
              />
            </v-col>

            <template v-if="['input','output'].includes(row.type)">
              <v-col style="padding: 4px 0" cols="12">
                <v-select
                    hide-details
                    :label="$t('enterType')"
                    :placeholder="$t('plsSelectInputType')"
                    :items="inputTypes"
                    item-value="id"
                    item-text="name"
                    v-model="row.data.type"
                    :no-data-text="$t('noSelectableVar')"
                />
              </v-col>
            </template>
            <template v-else>
              <v-col style="padding: 4px 0" cols="4">
                <v-select
                    hide-details
                    :placeholder="$t('plsSelectVarType')"
                    :items="fieldTypes"
                    item-value="id"
                    item-text="name"
                    v-model="row.data.type"
                    :no-data-text="$t('noSelectableVar')"
                />
              </v-col>
              <v-col style="padding: 4px 0" cols="8">
                <v-text-field
                    :label="$t(row.data.type === 'variable' ?'varName':'defaultValue')"
                    :placeholder="$t('plsEnterWithName',{name:$t(row.data.type === 'variable' ?'varName':'defaultValue')})"
                    v-model="row.data.value"
                    hide-details
                />
              </v-col>
            </template>
            <v-col style="padding: 4px 0" cols="12">
              <v-text-field
                :label="$t('tag')"
                :placeholder="$t('plsEnterLabel')"
                v-model="row.data.label"
                hide-details
              />
            </v-col>
            <v-col style="padding: 4px 0" cols="12">
              <v-text-field
                :label="$t('notify')"
                :placeholder="$t('plsEnterNotify')"
                v-model="row.data.hint"
                hide-details
              />
            </v-col>
            <v-col style="padding: 4px 0" cols="12" v-show="['input','output'].includes(row.type)">
              <v-textarea
                  :label="$t('defaultValue')"
                  v-if="row.data.type==='textarea'"
                  :placeholder="$t('plsEnterDefaultValue')"
                  v-model="row.data.defaultValue"
                  hide-details
              />
              <v-text-field
                  v-else
                  :label="$t('defaultValue')"
                  :placeholder="$t('plsEnterDefaultValue')"
                  :type="row.data.type==='number'?'number':'text'"
                  v-model="row.data.defaultValue"
                  hide-details
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions style="padding-bottom: 16px">
        <v-spacer />
        <v-btn text @click="display = false"> {{ $t('cancel') }}</v-btn>
        <v-btn
          style="color: #ffffff"
          color="#FF7754"
          @click="saveRow()"
          :disabled="!row.data.key"
        >
          <v-icon size="16" color="#ffffff" style="margin-right: 6px">
            mdi-content-save
          </v-icon>
          {{ $t(row.index === items.length ? "add" : "save") }}
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
    row: {
      type: Object,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
  },
  computed: {},
  data() {
    return {
      display: false,
      templateTypes: {
        header: "Header",
        query: "Parameter",
        requestBody: "Request Body",
        input: "input",
        output: "output",
      },
      defaultRow: {
        key: "",
        value: "",
        label: "",
        type: "variable",
        editable: false,
        hint: "",
      },
      items: [],
      fieldTypes: [
        {
          id: "variable",
          name: this.$t("variable"),
        },
        {
          id: "value",
          name: this.$t("value"),
        },
      ],
      inputTypes: [
        {
          id: "text",
          name: "text",
        },
        {
          id: "textarea",
          name: "textarea",
        },
        {
          id: "number",
          name: "number",
        },
      ],
    };
  },
  watch: {
    "$i18n.locale": {
      handler(val) {
        let self = this;
        self.fieldTypes[0].name = self.$t("variable");
        self.fieldTypes[1].name = self.$t("value");
      }
    }
  },
  mounted() {},
  methods: {
    changeKey() {
      let value = this.options.find((option) => option.key === this.row.data.key).value;
      if (Array.isArray(value)) {
        // value = JSON.stringify(value);
      }
      this.row.data.value = value;
    },
    editRow(items, item, type) {
      this.items = items;
      let index = items.indexOf(item);
      let data = Object.assign({}, item);
      Object.assign(this.row, {
        data,
        type,
        index,
      });
      this.display = true;
    },
    removeRow() {},
    saveRow() {
      let sameItem = this.items.find((item, index) => {
        return item.key === this.row.data.key && index !== this.row.index;
      });
      if (sameItem) {
        this.$message({
          message: this.$t("currentKeyHasExist"),
          type: "error",
          showClose:true
        });
        return;
      }
      this.items.splice(this.row.index, 1, Object.assign({}, this.row.data));
      let data = Object.assign({}, this.defaultRow);
      Object.assign(this.row, {
        data,
        type: "",
        index: -1,
      });
      this.display = false;
    },
    addRow(items, type) {
      this.items = items;
      let index = items.length;
      let data = Object.assign({}, this.defaultRow);
      Object.assign(this.row, {
        data,
        type,
        index,
      });
      this.display = true;
    },
  },
};
</script>

<style scoped></style>
