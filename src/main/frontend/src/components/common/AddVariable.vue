<template>
  <v-dialog v-model="display" max-width="600" @click:outside="cancelSaveVariable">
    <v-card>
      <v-card-title class="headline" style="color: #444262">
        {{ $t(editVariable ?'editVar':'addVar') }}
      </v-card-title>
      <v-card-text>
        <v-form ref="formAddVariable">
          <v-text-field
            :label="$t('variableName')"
            required
            :readonly="!(editVariable===undefined||editVariable===null)"
            v-model="addVariableDialog.name"
            :rules="addVariableDialog.formRules.name"
          />
          <v-select
            :label="$t('type')"
            :items="dataTypesAdd"
            :rules="addVariableDialog.formRules.type"
            required
            :item-value="(item) => `${item.id}`"
            :item-text="(item) => `${item.name}`"
            v-model="addVariableDialog.type"
          />
          <template>
            <v-radio-group
              v-if="addVariableDialog.type === 'Boolean'"
              v-model="addVariableDialog.value"
              mandatory
              required
              :rules="
                addVariableDialog.formRules[`value${addVariableDialog.type}`]
              "
            >
              <v-radio
                v-for="option in utils.options.required"
                :key="option.name"
                :label="option.name"
                :value="option.id"
              />
            </v-radio-group>
            <div
              v-else-if="addVariableDialog.type === 'Date'"
              style="display: flex; flex-direction: row"
            >
              <v-menu
                v-model="addVariableDialog.displayDate"
                :close-on-content-click="false"
                :nudge-left="80"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="addVariableDialog.valueDate"
                    :label="$t('plsSelectDate')"
                    :rules="
                      addVariableDialog.formRules[
                        `value${addVariableDialog.type}`
                      ]
                    "
                    required
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-date-picker v-model="addVariableDialog.valueDate" />
              </v-menu>
              <v-menu
                v-model="addVariableDialog.displayTime"
                :close-on-content-click="false"
                :nudge-left="80"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="addVariableDialog.valueTime"
                    :label="$t('plsSelectDate')"
                    :rules="
                      addVariableDialog.formRules[
                        `value${addVariableDialog.type}`
                      ]
                    "
                    required
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-time-picker
                  use-seconds
                  format="24hr"
                  v-model="addVariableDialog.valueTime"
                />
              </v-menu>
            </div>
            <div
              v-else-if="addVariableDialog.type === 'Object'"
              class="d-flex flex-column"
            >
              <v-text-field
                required
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
                label="Serialization data format"
                :rules="
                  addVariableDialog.formRules[
                    `value${addVariableDialog.type}`
                  ]
                "
                v-model="addVariableDialog.valueInfo.serializationDataFormat"
              />
              <v-textarea
                required
                :readonly="!(editVariable===undefined||editVariable===null)"
                label="Serialized value"
                :rules="
                  addVariableDialog.formRules[
                    `value${addVariableDialog.type}`
                  ]
                "
                v-model="addVariableDialog.value"
              />
            </div>
            <v-textarea
              v-else-if="addVariableDialog.type === 'Json'"
              required
              :rules="
                addVariableDialog.formRules[`value${addVariableDialog.type}`]
              "
              :label="$t('value')"
              v-model="addVariableDialog.value"
            />
            <v-text-field
              v-else
              required
              :rules="
                addVariableDialog.formRules[`value${addVariableDialog.type}`]
              "
              :label="$t('value')"
              v-model="addVariableDialog.value"
            />
          </template>
        </v-form>
      </v-card-text>
      <v-card-actions style="padding-bottom: 16px">
        <v-spacer />
        <v-btn text @click="cancelSaveVariable()">{{ $t('cancel') }}</v-btn>
        <v-btn style="color: #ffffff" color="#FF7754" @click="addVariable()" :disabled="saveDisable">
          {{ $t('confirm') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from "moment/moment";
import utils from "@/utils/utils";

export default {
  name: "AddVariable",
  props: {
    display: {
      type: Boolean,
      required: true,
    },
    editVariable: {
      type: Object,
      required: false,
      default: () => null,
    }
  },
  data() {
    return {
      utils,
      addVariableDialog: {
        displayDate: false,
        displayTime: false,
        title: this.$t("addVar"),
        success: this.$t("addVarSuccess"),
        error: this.$t("addVarErr"),
        name: "",
        type: "",
        value: "",
        valueDate: null,
        valueTime: null,
        valueInfo: {},
        formRules: {
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
      return self.editVariable && ((self.editVariable.type === "Object" && self.addVariableDialog.type === "Object") || (self.editVariable.value == self.addVariableDialog.value));
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
          if (this.editVariable) {
            Object.assign(this.addVariableDialog, {
              name: this.editVariable.name,
              type: this.editVariable.type,
              value: this.editVariable.value,
              valueInfo: this.editVariable.valueInfo,
            });
            if (this.editVariable.type === "Date") {
              this.editVariable.valueDate = moment(
                  this.editVariable.value,
                  "YYYY-MM-DDTHH:mm:ss.SSSZZ"
              ).format("YYYY-MM-DD");
              this.editVariable.valueTime = moment(
                  this.editVariable.value,
                  "YYYY-MM-DDTHH:mm:ss.SSSZZ"
              ).format("HH:mm:ss");
            }
            // if (this.editVariable.type === "Json") {
            //   try {
            //     this.addVariableDialog.value = JSON.stringify(this.editVariable.value);
            //   }catch (e){}
            // }
          } else {
            Object.assign(this.addVariableDialog, {
              name: "",
              type: "",
              value: "",
              valueInfo: {},
              valueDate: null,
              valueTime: "00:00:00",
            });
          }
          if (this.$refs.formAddVariable) {
            this.$refs.formAddVariable.resetValidation();
          }
        }
      },
    },
  },
  methods: {
    cancelSaveVariable() {
      this.$emit("onCancelSaveVariable");
    },
    async addVariable() {
      if (!this.$refs.formAddVariable.validate()) {
        return;
      }
      let data = {
        name: this.addVariableDialog.name,
        value: this.addVariableDialog.value,
        type: this.addVariableDialog.type,
        valueInfo: this.addVariableDialog.valueInfo,
      };
      if (data.type === "Date") {
        data.value = moment(
            `${this.addVariableDialog.valueDate} ${this.addVariableDialog.valueTime}`,
            "YYYY-MM-DD HH:mm:ss"
        ).format("YYYY-MM-DDTHH:mm:ss.SSSZZ");
      }
      if (data.type !== "Object") {
        delete data.valueInfo;
      }
      switch (data.type){
        case "Integer":
          data.value=Number.parseInt(data.value);
          break;
        case "Double":
          data.value=Number(data.value);
          break;
        case "Long":
          data.value=Number(data.value);
          break;
        case "Short":
          data.value=Number(data.value);
          break;
      }
      this.$emit("onSaveVariable", {
        varName: this.addVariableDialog.name,
        varData: data,
      });
    },
  }
};
</script>

<style scoped>

</style>
