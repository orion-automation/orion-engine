<template>
  <v-dialog v-model="display" max-width="600" @click:outside="cancelSaveVariable">
    <v-card>
      <v-card-title class="headline" style="color: #444262">
        {{ $t(history ? "view" : "edit") }}{{ $t('variableValue') }}({{ editVariable ? editVariable.name : "" }})
      </v-card-title>
      <v-card-text>
        <v-form ref="formAddVariable">
          <template v-if="addVariableDialog.type==='Json'">
            <v-textarea
                label="Value"
                :readonly="history"
                v-model="addVariableDialog.value"
            />
          </template>
          <template v-if="addVariableDialog.type==='Object'">
            <v-text-field
                required
                readonly
                label="Object type name"
                :rules="
              addVariableDialog.formRules[
                `value${addVariableDialog.type}`
              ]
            "
                v-model="addVariableDialog.valueInfo.objectTypeName"
            />
            <v-text-field
                required
                readonly
                label="Serialization data format"
                :rules="
              addVariableDialog.formRules[
                `value${addVariableDialog.type}`
              ]
            "
                v-model="addVariableDialog.valueInfo.serializationDataFormat"
            />
            <v-tabs v-model="tab" @change="onTabChange">
              <v-tab key="serialized">
                Serialized
              </v-tab>
              <v-tab key="deserialized">
                Deserialized
              </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <v-tab-item key="serialized">
                <v-textarea
                    label="Serialized value"
                    :readonly="history"
                    v-model="addVariableDialog.serializedValue"
                />
              </v-tab-item>
              <v-tab-item key="deserialized">
                <v-sheet color="error"
                         min-height="148"
                         rounded
                         style="padding: 10px;margin-top: 10px;margin-bottom: 20px"
                         v-if="editVariable && editVariable.errorMessage"
                >
                  Deserialization Error:{{ editVariable.errorMessage }}
                </v-sheet>
                <v-textarea
                    v-else
                    label="Deserialized value"
                    :readonly="history"
                    v-model="addVariableDialog.value"
                />
              </v-tab-item>
            </v-tabs-items>
          </template>
        </v-form>
      </v-card-text>
      <v-card-actions style="padding-bottom: 16px">
        <v-spacer/>
        <v-btn text @click="cancelSaveVariable()" v-show="!history">{{ $t('cancel') }}</v-btn>
        <v-btn style="color: #ffffff" color="#FF7754" @click="addVariable()" :disabled="saveDisable">
          {{ $t('confirm') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import utils from "@/utils/utils";

export default {
  name: "EditVariable",
  props: {
    display: {
      type: Boolean,
      required: true,
    },
    editVariable: {
      type: Object,
      required: false,
      default: () => null,
    },
    history: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      utils,
      tab: 0,
      addVariableDialog: {
        displayDate: false,
        displayTime: false,
        title: this.$t("addVar"),
        success: this.$t("addVarSuccess"),
        error: this.$t("addVarErr"),
        name: "",
        type: "",
        value: "",
        serializedValue: "",
        valueDate: null,
        valueTime: null,
        valueInfo: {},
        formRules: {
          name: [(v) => !!v || this.$t("varNameRequired")],
          type: [(v) => !!v || this.$t("varTypeRequired")],
          valueBoolean: [(v) => typeof v === "boolean" || this.$t("varNameRequired")],
          valueDate: [
            (v) =>
                (v && typeof v === "string" && v.length > 0) ||
                this.$t("varNameRequired"),
          ],
          valueString: [
            (v) =>
                (v && typeof v === "string" && v.length > 0) ||
                this.$t("varNameRequired"),
          ],
          valueLong: [
            (v) => {
              if (!v && v !== 0) {
                return this.$t("varNameRequired");
              } else if (!v.match(/^-?\d+$/)) {
                return this.$t("varValueFormatErr");
              } else if (
                  BigInt(v) > BigInt(9223372036854775807) ||
                  BigInt(v) < BigInt(-9223372036854775808)
              ) {
                return this.$t("varValueMaxErr");
              }
              return true;
            },
          ],
          valueShort: [
            (v) => {
              if (!v && v !== 0) {
                return this.$t("varNameRequired");
              } else if (!v.match(/^-?\d+$/)) {
                return this.$t("varValueFormatErr");
              } else if (v > 32767 || v < -32768) {
                return this.$t("varValueMaxErr");
              }
              return true;
            },
          ],
          valueDouble: [
            (v) => /^-?\d{0,2}(\.\d{0,2}){0,1}$/.test(v) || this.$t("varTypeErr"),
          ],
          valueInteger: [
            (v) => {
              if (!v && v !== 0) {
                return this.$t("varValueRequired");
              } else if (!v.match(/^-?\d+$/)) {
                return this.$t("varValueFormatErr");
              } else if (v > 2147483647 || v < -2147483648) {
                return this.$t("varValueMaxErr");
              }
              return true;
            },
          ],
          valueJson: [
            (v) => {
              if (!v || v.length === 0) {
                return this.$t("varNameRequired");
              } else {
                try {
                  JSON.parse(v);
                } catch (e) {
                  return `${e}`;
                }
              }
              return true;
            },
          ],
          valueObject: [
            (v) => {
              if (!v || v.length === 0) {
                return this.$t("itemRequired");
              }
              return true;
            },
          ],
        },
      },
      dataTypesAdd: [
        "Boolean",
        "Date",
        "Double",
        "Integer",
        "Long",
        "Short",
        "String",
        "Json",
        "Object",
      ].map((item) => {
        return {name: item, id: item};
      }),
    };
  },
  computed: {
    saveDisable() {
      let self = this;
      let changed;
      if (self.editVariable){
        changed = self.addVariableDialog.serializedValue == self.editVariable.serializedValue && self.addVariableDialog.value === JSON.stringify(self.editVariable.value);
      }
      if (self.history) {
        return false || !changed;
      } else {
        return (self.tab === 1 && (self.editVariable.errorMessage !== null || self.addVariableDialog.value === self.editVariable.value || self.addVariableDialog.value === "null" || self.addVariableDialog.value === ""))
            || (self.tab === 0 && ((self.editVariable && self.addVariableDialog.serializedValue === self.editVariable.serializedValue) || self.addVariableDialog.serializedValue === "null" || self.addVariableDialog.serializedValue === ""))
            || !changed;
      }
    },
  },
  watch: {
    "$i18n.locale": {
      handler(val){
        let self=this;
        self.addVariableDialog.title=self.$t("addVar");
        self.addVariableDialog.success=self.$t("addVarSuccess");
        self.addVariableDialog.error=self.$t("addVarErr");
        self.addVariableDialog.formRules={
          name: [(v) => !!v || this.$t("varNameRequired")],
          type: [(v) => !!v || this.$t("varTypeRequired")],
          valueBoolean: [(v) => typeof v === "boolean" || this.$t("varValueRequired")],
          valueDate: [
            (v) =>
                (v && typeof v === "string" && v.length > 0) ||
                this.$t("varValueRequired"),
          ],
          valueString: [
            (v) =>
                (v && typeof v === "string" && v.length > 0) ||
                this.$t("varValueRequired"),
          ],
          valueLong: [
            (v) => {
              if (!v && v !== 0) {
                return this.$t("varValueRequired");
              } else if (!v.match(/^-?\d+$/)) {
                return this.$t("varValueFormatErr");
              } else if (
                  BigInt(v) > BigInt(9223372036854775807) ||
                  BigInt(v) < BigInt(-9223372036854775808)
              ) {
                return this.$t("varValueMaxErr");
              }
              return true;
            },
          ],
          valueShort: [
            (v) => {
              if (!v && v !== 0) {
                return this.$t("varValueRequired");
              } else if (!v.match(/^-?\d+$/)) {
                return this.$t("varValueFormatErr");
              } else if (v > 32767 || v < -32768) {
                return this.$t("varValueMaxErr");
              }
              return true;
            },
          ],
          valueDouble: [
            (v) => /^-?\d{0,2}(\.\d{0,2}){0,1}$/.test(v) || this.$t("varTypeErr"),
          ],
          valueInteger: [
            (v) => {
              if (!v && v !== 0) {
                return this.$t("varValueRequired");
              } else if (!v.match(/^-?\d+$/)) {
                return this.$t("varValueFormatErr");
              } else if (v > 2147483647 || v < -2147483648) {
                return this.$t("varValueMaxErr");
              }
              return true;
            },
          ],
          valueJson: [
            (v) => {
              if (!v || v.length === 0) {
                return this.$t("varValueRequired");
              } else {
                try {
                  JSON.parse(v);
                }catch (e) {
                  return `${e}`;
                }
              }
              return true;
            },
          ],
          valueObject: [
            (v) => {
              if (!v || v.length === 0) {
                return this.$t("itemRequired");
              }
              return true;
            },
          ],
        };
      },
    },
    "display": {
      handler(value) {
        // 添加变量弹窗显示时,初始化表单值
        if (value) {
          this.tab = 0;
          Object.assign(this.addVariableDialog, {
            name: this.editVariable.name,
            type: this.editVariable.type,
            value: this.editVariable.value,
            serializedValue: this.editVariable.serializedValue,
            valueInfo: this.editVariable.valueInfo,
          });
          if (this.addVariableDialog.type==="Object"){
            try {
              this.addVariableDialog.value = JSON.stringify(this.editVariable.value);
            } catch (e) {
              this.addVariableDialog.value = this.editVariable.value;
            }
          }
          if (this.$refs.formAddVariable) {
            this.$refs.formAddVariable.resetValidation();
          }
        }
      },
    },
  },
  methods: {
    onTabChange() {
      Object.assign(this.addVariableDialog, {
        serializedValue: this.editVariable.serializedValue,
      });
      try {
        this.addVariableDialog.value = JSON.stringify(this.editVariable.value);
      } catch (e) {
        this.addVariableDialog.value = this.editVariable.value;
      }
    },
    cancelSaveVariable() {
      this.$emit("onCancelSaveVariable");
    },
    async addVariable() {
      if (this.history) {
        this.$emit("onCancelSaveVariable");
        return;
      }
      if (!this.$refs.formAddVariable.validate()) {
        return;
      }
      let data = {
        name: this.addVariableDialog.name,
        value: this.tab === 0 ? this.addVariableDialog.serializedValue : this.addVariableDialog.value,
        type: this.addVariableDialog.type,
        valueInfo: this.addVariableDialog.valueInfo,
      };
      if (this.addVariableDialog.type === "Json") {
        data.value = this.addVariableDialog.value;
      }
      this.$emit("onSaveVariable", {
        varName: this.addVariableDialog.name,
        varSerialized: this.tab === 0,
        varData: data,
      });
    },
  }
};
</script>

<style scoped>

</style>
