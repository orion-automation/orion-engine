<template>
  <v-dialog v-model="display" max-width="500">
    <v-card>
      <v-card-title class="headline" style="color: #444262">
        {{ $t('moveToWithDot') }}
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <el-table
            ref="table"
            highlight-current-row
            :data="items"
            @current-change="selectFolder"
          >
            <el-table-column label="type" width="30">
              <!--   :class="{ 'active-navigate': typeof parentId === 'number' }"-->
              <template slot="header">
                <v-icon
                  class="active-navigate"
                  @click="navigateOut()"
                  size="25"
                >
                  mdi-menu-left
                </v-icon>
              </template>
            </el-table-column>
            <el-table-column :label="$t('previousFolder')" prop="name">
              <template slot="header">
                <span class="active-navigate" @click="navigateOut()">{{ $t('previousFolder') }}</span>
              </template>
            </el-table-column>
            <el-table-column width="50" label="">
              <template slot-scope="props">
                <v-icon
                  class="active-navigate"
                  @click="navigateIn(props.row)"
                  size="25"
                >
                  mdi-chevron-right
                </v-icon>
              </template>
            </el-table-column>
          </el-table>
        </v-form>
      </v-card-text>
      <v-card-actions style="padding-bottom: 16px">
        <v-spacer />
        <v-btn text @click="display = false"> {{ $t('cancel') }} </v-btn>
        <v-btn
          :disabled="
            !selectedItem ||
              (selectedItem.type && selectedItem.id == resource.parentNode)
          "
          style="color: #ffffff"
          color="#FF7754"
          @click="save()"
        >
          <v-icon size="14" color="#ffffff" style="margin-right: 5px">
            mdi-content-save
          </v-icon>
          确定
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import camundaRequest from "@/api/camunda-service";
import utils from "@/utils/utils";

export default {
  name: "FolderNavigate",
  components: {},
  props: {
    resource: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      utils: utils,
      selectedItem: null,
      display: false,
      items: [],
      projects: [],
      project: {},
      resources: [],
      parentId: null,
    };
  },
  watch: {
    resource: async function (value) {
      if (value && value.id) {
        this.project = await camundaRequest.getProject(value.projectId);
        this.projects = await camundaRequest.getProjects({
          tenant: this.project.tenant,
          coeCode: this.project.coeCode,
          type: 1,
        });
      }
    },
  },
  computed: {},

  mounted() {},
  methods: {
    async start() {
      this.display = true;
      this.items = this.projects;
      this.setCurrent(null);
    },

    setCurrent(row) {
      if (this.$refs.table) {
        this.$refs.table.setCurrentRow(row);
      }
    },

    selectFolder(item) {
      this.selectedItem = item;
    },
    save() {
      const item = this.selectedItem.type
        ? this.selectedItem
        : {
            projectId: this.selectedItem.id,
            id: 0,
          };
      this.$emit("save", item);
      this.display = false;
    },
    async navigateIn(item) {
      let isFolder = item.type && item.type.value == "1";
      let currentId = isFolder ? item.id : 0;
      if (!isFolder) {
        this.resources = await camundaRequest.getResources({
          projectId: item.id,
        });
      }

      this.items = this.resources.filter(
        (resource) =>
          resource.parentNode == currentId && resource.type.value == "1"
      );
      this.parentId = isFolder ? item.parentNode : null;
    },
    async navigateOut() {
      if (this.parentId == null) {
        this.items = this.projects;
      } else {
        this.items = this.resources.filter(
          (resource) =>
            resource.parentNode == this.parentId && resource.type.value == "1"
        );
      }

      let item = this.resources.find(
        (resource) => resource.id == this.parentId
      );
      this.parentId = item ? item.parentNode : null;
    },
  },
};
</script>

<style scoped>
i.v-icon.active-navigate,
button.v-icon.active-navigate,
span.active-navigate {
  cursor: pointer;
  color: #ff7754;
}
</style>
