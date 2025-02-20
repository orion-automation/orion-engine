<template>
  <div>
    <v-dialog v-model="contentDialog.display" max-width="650">
      <v-card>
        <v-card-title class="headline" style="color: #444262">
          {{ $t('relatedOnProcessRuntime') }}
        </v-card-title>
        <v-card-text>
          <el-table :data="associations">
            <el-table-column :label="$t('processKey')">
              <template slot-scope="props">
                <a :href="props.row.url" target="_blank">
                  {{ props.row.name }}
                </a>
              </template>
            </el-table-column>
            <el-table-column :label="$t('type')" width="120">
              <template slot-scope="props">
                <v-icon size="20" color="#444262">
                  {{
                    props.row.type.value == 1 ? "mdi-play-circle" : "mdi-folder"
                  }}
                </v-icon>
                {{ types.find((type) => type.id == props.row.type.value).name }}
              </template>
            </el-table-column>
            <el-table-column width="80" :label="$t('operate')">
              <template slot-scope="props">
                <template v-if="!props.row.readOnly">
                  <v-icon
                      style="margin-right: 8px"
                      size="20"
                      color="#FF7754"
                      @click="edit(props.row)"
                  >
                    mdi-pencil
                  </v-icon>
                  <v-menu v-model="props.row.menu">
                    <template #activator="{ on, attrs }">
                      <v-icon size="20" color="#FF7754" v-bind="attrs" v-on="on">
                        mdi-close
                      </v-icon>
                    </template>

                    <v-card>
                      <v-card-title class="small-headline" />
                      <v-card-text>
                        {{ $t('deleteRelatedConfirmWithName',{name:props.row.name}) }}
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer />
                        <v-btn text @click="props.row.menu = false"> {{ $t('back') }}</v-btn>

                        <v-btn
                            style="color: #ffffff"
                            color="#FF7754"
                            @click="remove(props.row)"
                        >
                          <v-icon
                              size="16"
                              color="#ffffff"
                              style="margin-right: 6px"
                          >
                            mdi-delete
                          </v-icon>
                          {{ $t('delete') }}
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-menu>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer />
          <v-btn text @click="contentDialog.display = false">{{ $t('close') }}</v-btn>
          <v-btn style="color: #ffffff" color="#FF7754" @click="add()">
            <v-icon size="14" color="#ffffff" style="margin-right: 5px">
              mdi-plus-box
            </v-icon>
            {{ $t('add') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editDialog.display" max-width="650">
      <v-card>
        <v-card-title class="headline" style="color: #444262">
          {{ $t(editDialog.id ? "edit" : "add") }}{{ $t('relatedRecord') }}
        </v-card-title>
        <v-card-text>
          <v-row style="margin: 0 0 10px 0">
            <v-col style="padding: 0 10px 0 0" cols="6">
              <v-select
                hide-details
                :items="types"
                item-value="id"
                item-text="name"
                v-model="editDialog.type"
                :placeholder="$t('type')"
              />
            </v-col>
            <v-col style="padding: 0" cols="6">
              <v-text-field
                :placeholder="$t('nameOrRuntimeKey')"
                v-model="editDialog.name"
                hide-details
              />
            </v-col>
          </v-row>
          <v-row style="margin: 0 0 0 0">
            <v-col style="padding: 0" cols="12">
              <v-textarea
                required
                hide-details
                placeholder="URL"
                rows="3"
                v-model="editDialog.url"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer />
          <v-btn text @click="cancelEdit()"> {{ $t('cancel') }}</v-btn>
          <v-btn
            style="color: #ffffff"
            color="#FF7754"
            :disabled="!editDialog.name || !editDialog.type || !editDialog.url"
            @click="save()"
          >
            <v-icon size="16" color="#ffffff" style="margin-right: 6px">
              mdi-content-save
            </v-icon>
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import utils from "@/utils/utils";
import moment from "moment";
import {saveAs} from "file-saver";
import camundaRequest from "@/api/camunda-service";

export default {
  name: "ModelAssociation",
  components: {},
  props: {
    role: {
      type: String,
      required: true,
    },
    associations: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      utils: utils,
      types: [
        {id: "1", name: this.$t("runtime")},
        {id: "2", name: this.$t("knowledge")},
      ],
      deleteDialog: {
        display: false,
      },
      editDialog: {
        id: "",
        name: "",
        type: "",
        url: "",
        display: false,
      },
      contentDialog: {
        display: false,
      },
    };
  },
  watch: {
    "$i18n.locale": {
      handler(val) {
        let self = this;
        self.types[0].name = self.$t("runtime");
        self.types[1].name = self.$t("knowledge");
      }
    }
  },
  computed: {},
  mounted() {
  },
  methods: {
    add() {
      this.contentDialog.display = false;
      this.editDialog.id = "";
      this.editDialog.name = "";
      this.editDialog.type = "";
      this.editDialog.url = "";
      this.editDialog.display = true;
    },
    cancelRemove() {
      this.deleteDialog.display = false;
      this.contentDialog.display = true;
    },
    cancelEdit() {
      this.editDialog.id = "";
      this.editDialog.name = "";
      this.editDialog.type = "";
      this.editDialog.url = "";
      this.editDialog.display = false;
      this.contentDialog.display = true;
    },
    edit(item) {
      this.editDialog.id = item.id;
      this.editDialog.name = item.name;
      this.editDialog.type = item.type.value;
      this.editDialog.url = item.url;
      this.contentDialog.display = false;
      this.editDialog.display = true;
    },

    async save() {
      let data = {
        id: this.editDialog.id,
        name: this.editDialog.name,
        url: this.editDialog.url,
        type: {
          value:this.editDialog.type
        },
      };
      let isAdd = !data.id;
      if (isAdd) {
        data.id = moment().format("x");
        this.associations.push(data);
        this.$emit("save", {
          type: "add",
          index: this.associations.length - 1
        });
      } else {
        let item = this.associations.find(
            (association) => association.id == data.id
        );
        let index = this.associations.indexOf(item);
        this.associations.splice(index, 1, data);
        this.$emit("save", {
          type: "save",
          index: index
        });
      }
      this.cancelEdit();
    },
    async remove(item) {
      let index = this.associations.indexOf(item);
      this.associations.splice(index, 1);
      this.$emit("save", {
        type: "delete",
        id: item.id
      });
    },
  },
};
</script>

<style scoped></style>
