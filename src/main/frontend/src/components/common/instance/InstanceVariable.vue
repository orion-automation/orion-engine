<template>
  <div>
    <v-dialog v-model="display" max-width="900">
      <v-card>
        <v-card-title class="headline" style="color: #444262">
          {{ $t('varSearch') }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row style="margin: 0 20px">
              <v-col style="padding: 0 20px 0 0" cols="4">
                <v-text-field
                  :label="$t('variableName')"
                  v-model="criteria.name"
                  :rules="rules"
                  hide-details
                  required
                />
              </v-col>

              <v-col style="padding: 0 20px 0 0" cols="2">
                <v-select
                  :label="$t('opt')"
                  :items="operators"
                  :rules="rules"
                  :item-value="(item) => `${item.id}`"
                  :item-text="(item) => `${item.name}`"
                  v-model="criteria.operator"
                  required
                />
              </v-col>

              <v-col style="padding: 0 20px 0 0" cols="4">
                <v-text-field
                  :label="$t('value')"
                  v-model="criteria.value"
                  :rules="rules"
                  hide-details
                  required
                />
              </v-col>
              <v-col style="padding: 0 0 20px 0" cols="2">
                <v-btn style="margin-top: 12px" @click="add()">{{ $t('add') }}</v-btn>
              </v-col>
            </v-row>

            <el-table :data="editingVariables">
              <el-table-column prop="name" :label="$t('variable')" />
              <el-table-column width="80" :label="$t('opt')">
                <template slot-scope="props">
                  {{ formatOperator(props.row.operator) }}
                </template>
              </el-table-column>
              <el-table-column prop="value" :label="$t('value')" />

              <el-table-column :label="$t('operate')" width="100">
                <template slot-scope="props">
                  <span class="badge badge-menu" @click="remove(props.row)">
                     <v-icon size="10" color="white">mdi-close</v-icon>
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </v-form>
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer />
          <v-btn text @click="display = false"> {{ $t('cancel') }} </v-btn>
          <v-btn style="color: #ffffff" color="#FF7754" @click="confirm()">
            查询
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import instanceRequest from "@/api/instance";
import utils from "@/utils/utils";

export default {
  name: "InstanceVariable",
  components: {},
  props: {
    variables: {
      type: Array,
      required: true,
    },
    definitionId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      utils: utils,
      display: false,
      rules: [(v) => !!v],
      criteria: {
        name: "",
        operator: "",
        value: "",
      },
      editingVariables: [],
      operators: [
        { id: "eq", name: "=" },
        { id: "neq", name: "!=" },
        { id: "gt", name: ">" },
        { id: "gteq", name: ">=" },
        { id: "lt", name: "<" },
        { id: "lteq", name: "<=" },
        { id: "like", name: "like" },
      ],
    };
  },
  watch: {},
  computed: {},

  mounted() {},
  methods: {
    start() {
      utils.copyArray(this.variables, this.editingVariables);
      this.display = true;
      //  setTimeout(() => this.$refs.form.resetValidation());
    },
    confirm() {
      utils.copyArray(this.editingVariables, this.variables);
      this.$emit("confirm");
      this.display = false;
    },
    formatOperator(id) {
      return this.operators.filter((operator) => operator.id == id)[0].name;
    },
    add() {
      if (!this.$refs.form.validate()) {
        return;
      }
      var variable = {
        name: this.criteria.name,
        operator: this.criteria.operator,
      };

      var value = this.criteria.value;
      var numberValue = Number(value);
      if (this.criteria.operator != "like") {
        if (!isNaN(numberValue)) {
          value = numberValue;
        } else if (value == "true" || value == "false") {
          value = value === "true";
        }
      }

      variable.value = value;
      this.editingVariables.push(variable);
      this.$refs.form.reset();
    },
    remove(variable) {
      var index = this.editingVariables.indexOf(variable);
      this.editingVariables.splice(index, 1);
    },
  },
};
</script>

<style scoped>
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
  border: 0;
  margin-right: 10px;
  color: #fff;
  cursor: pointer;
}
.badge-menu {
  background-color: #ff7754;
}
</style>
