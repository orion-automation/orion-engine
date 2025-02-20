<template>
  <v-layout style="margin: 0; height: 100%" class="stretch">
    <div style="display: flex; flex-direction: column; width: 100%">
      <div
          class="d-flex flex-row menu-border"
          style="align-items: center; padding-left: 15px"
      >
        <v-icon size="16" color="#F50057" style="margin-right: 10px">
          mdi-alpha-p-circle
        </v-icon>
        <span style="font-size: 14px">{{ form.id ?? "--" }}</span>
        <v-spacer/>
        <v-btn
            large
            text
            class="process-menu"
            @click="copyFormId"
            style="border-left: 1px solid rgba(187, 187, 187, 1); border-right: none"
        >
          <v-icon size="16" color="#83829A" style="margin-right: 6px">
            mdi-content-copy
          </v-icon>
          <span style="color: #444262; font-size: 14px">{{ $t('copyUxId') }}</span>
        </v-btn>
        <v-menu offset-y>
          <template #activator="{ on, attrs }">
            <v-btn
                large
                text
                class="process-menu"
                v-show="true"
                v-bind="attrs"
                v-on="on"
                style="
                    border-left: 1px solid rgba(187, 187, 187, 1);
                    border-right: none;
                  "
            >
              <v-icon size="16" color="#83829A" style="margin-right: 6px">
                mdi-import
              </v-icon>
              <span style="color: #444262; font-size: 14px">{{ $t('importFile') }}</span>
            </v-btn>
          </template>
          <v-list style="cursor: pointer" dense>
            <v-list-item key="1">
              <v-list-item-title @click="onImportClick">
                <v-icon
                    size="14"
                    color="#101010"
                    style="margin-right: 6px; margin-bottom: 3px"
                >
                  mdi-code-block-braces
                </v-icon>
                <span style="font-size: 14px">JSON</span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu offset-y>
          <template #activator="{ on, attrs }">
            <v-btn
                large
                text
                class="process-menu"
                v-show="true"
                v-bind="attrs"
                v-on="on"
                style="
                    border-left: 1px solid rgba(187, 187, 187, 1);
                    border-right: none;
                  "
            >
              <v-icon size="16" color="#83829A" style="margin-right: 6px">
                mdi-content-save
              </v-icon>
              <span style="color: #444262; font-size: 14px">{{ $t('save') }}</span>
            </v-btn>
          </template>
          <v-list style="cursor: pointer" dense>
            <v-list-item key="1">
              <v-list-item-title @click="saveData">
                <span style="font-size: 14px">{{ $t('save') }}</span>
              </v-list-item-title>
            </v-list-item>
            <v-list-item key="2" @click="copyData">
              <v-list-item-title>
                <span style="font-size: 14px">{{ $t('saveAs') }}</span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn
            large
            text
            class="process-menu"
            @click="exportFile"
            style="border-left: 1px solid rgba(187, 187, 187, 1); border-right: none"
        >
          <v-icon size="16" color="#83829A" style="margin-right: 6px">
            mdi-download-box-outline
          </v-icon>
          <span style="color: #444262; font-size: 14px">{{ $t('download') }}</span>
        </v-btn>
        <v-btn
            large
            text
            class="process-menu"
            @click="$refs.refFormPreview.show()"
            style="border-left: 1px solid rgba(187, 187, 187, 1); border-right: none"
        >
          <v-icon size="16" color="#83829A" style="margin-right: 6px">
            mdi-card-search-outline
          </v-icon>
          <span style="color: #444262; font-size: 14px">{{ $t('preview') }}</span>
        </v-btn>
      </div>
      <el-row
          style="
              height: 0px;
              border-top: 1px solid rgba(187, 187, 187, 1);
              flex: 1;
              overflow-y: auto;
              background-color: white;
            "
      >
        <form-builder
            v-if="formBuilder.show"
            style="margin-top: 1rem; margin-left: 1rem; margin-right: 1rem"
            :form="formBuilder.form"
            :options="formBuilder.options"
        />
      </el-row>
    </div>

    <v-dialog v-model="deleteDialog.display" max-width="500">
      <v-card>
        <v-card-title class="headline" style="color: #444262">
          {{ deleteDialog.title }}
        </v-card-title>
        <v-card-text>
          {{ deleteDialog.description }}
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="deleteDialog.display = false"> {{ $t('cancel') }}</v-btn>
          <v-btn style="color: #ffffff" color="#FF7754" @click="deleteData()">
            <v-icon size="16" color="#ffffff" style="margin-right: 6px">
              mdi-delete
            </v-icon>
            确认
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="importBPMNDialog.display" max-width="450">
      <v-card>
        <v-card-title class="headline" style="color: #444262"> {{ $t('importFile') }}</v-card-title>
        <v-card-text>
          <v-row style="margin: 0">
            <v-col style="padding: 0" cols="12">
              <v-file-input
                  :placeholder="$t('selectFile')"
                  hide-details
                  accept=".json"
                  v-model="importBPMNDialog.file"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer/>
          <v-btn text @click="onImportCancel()"> {{ $t('cancel') }}</v-btn>
          <v-btn
              style="color: #ffffff"
              color="#FF7754"
              :disabled="!importBPMNDialog.file"
              @click="onImportSubmit()"
          >
            <v-icon size="16" color="#ffffff" style="margin-right: 6px">
              mdi-content-save
            </v-icon>
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="createResourceDialog.display" max-width="300">
      <v-card>
        <v-card-title class="headline" style="color: #444262"/>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row style="margin: 0 0 20px 0">
              <v-col style="padding: 0" cols="12">
                <v-text-field
                    :placeholder="
                    createResourceDialog.type === 1
                      ? $t('enterFolderName')
                      : $t('enterUxName')
                  "
                    v-model="createResourceDialog.name"
                    hide-details
                    @keydown.enter="createResource()"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer/>
          <v-btn text @click="createResourceDialog.display = false"> {{ $t('cancel') }}</v-btn>
          <v-btn style="color: #ffffff" color="#FF7754" @click="createResource()">
            <v-icon size="16" color="#ffffff" style="margin-right: 6px">
              mdi-content-save
            </v-icon>
            {{ $t('save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="objectDialog.display" max-width="700">
      <v-card>
        <v-card-title class="headline" style="color: #444262">
          {{ $t('businessObjCenterResource') }}
        </v-card-title>
        <v-card-text>
          <div class="d-flex flex-column" style="max-height: calc(90vh - 150px);width: 100%;height: 100%">
            <div class="d-flex flex-row" style="width: 100%;gap: 15px">
              <div class="object-title" style="flex: 1">{{ $t('project') }}</div>
              <div class="object-title" style="flex: 1">{{ $t('dataTable') }}</div>
            </div>
            <div class="d-flex flex-row" style="flex: 1;height: 0;overflow-y: auto;width: 100%;gap: 15px">
              <div style="flex: 1;width: 0">
                <v-list v-show="objectDialog.projects.length">
                  <v-list-item
                      :class="{
                    current: objectDialog.project.id === item.id,
                  }"
                      v-for="item in objectDialog.projects"
                      :key="item.id"
                      @click="selectProject(item)"
                      style="
                    cursor: pointer;
                    padding-top: 0em;
                    padding-bottom: 0em;
                    border: 1px solid #e6e4e6;
                  "
                  >
                    <v-list-item-content>
                      <v-list-item-title
                          style="
                        font-size: 14px;
                        color: #444262；
                        white-space: unset;
                        text-overflow: unset;
                      "
                      >
                        <v-icon size="18" color="#83829A" style="margin-right: 6px">
                          mdi-database-settings-outline
                        </v-icon>
                        <span style="vertical-align: middle">{{ item.title }}</span>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </div>
              <div style="flex: 1;width: 0">
                <v-list v-show="objectDialog.tables.length">
                  <v-list-item
                      :class="{
                    current: objectDialog.table.id === item.id,
                  }"
                      v-for="item in objectDialog.tables"
                      :key="item.id"
                      @click="selectTable(item)"
                      style="
                    cursor: pointer;
                    padding-top: 0em;
                    padding-bottom: 0em;
                    border: 1px solid #e6e4e6;
                  "
                  >
                    <v-list-item-content>
                      <v-list-item-title
                          style="
                        font-size: 14px;
                        color: #444262；
                        white-space: unset;
                        text-overflow: unset;
                      "
                      >
                        <v-icon size="18" color="#83829A" style="margin-right: 6px">
                          mdi-table
                        </v-icon>
                        <span style="vertical-align: middle">{{ item.title }}</span>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </div>
            </div>
          </div>
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer/>
          <v-btn text @click="objectDialog.display = false"> {{ $t('cancel') }}</v-btn>
          <v-btn
              :disabled="!(objectDialog.project.id && objectDialog.table.id)"
              style="color: #ffffff"
              color="#FF7754"
              @click="importObject()"
          >
            <v-icon size="16" color="#ffffff" style="margin-right: 6px">
              mdi-import
            </v-icon>
            {{ $t('importFile') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <form-preview :form-builder="formBuilder" ref="refFormPreview" :form-id="form.id"/>
  </v-layout>
</template>
<script>
import formRequest from "@/api/form";
import utils from "@/utils/utils";
import i18n from "@/utils/i18n";
import {FormBuilder} from "vue-formio-eorion";
import camundaRequest from "@/api/camunda-service";
import {saveAs} from "file-saver";
import FormPreview from "@/components/design/page/FormPreview";
import nocodbRequest from "@/api/nocodb";

const commonIgnore = [
  {key: "persistent", ignore: true},
  {key: "protected", ignore: true},
  {key: "dbIndex", ignore: true},
  {key: "encrypted", ignore: true},
  {key: "calculateServer", ignore: true},
];

export default {
  components: {FormBuilder, FormPreview},
  data() {
    return {
      formBuilder: {
        form: {components: []},
        options: {
          language: this.$i18n.locale,
          noDefaultSubmitButton: true,
          i18n: i18n,
          builder: {
            design: {
              title: this.$t("widget"),
              weight: 10,
              default: true,
              components: {
                actionButton: true,
                htmlelement: true,
                content: true,
                columns: true,
                fieldset: true,
                panel: true,
                table: true,
                tabs: true,
                well: true,
                data: true,
                chart: true,
                processTable: true,
                gallery: true,
                flex: true,
                newsData: true,
                list: true,
                timeline: true,
                datatable: true,
                billboard: true,
                dataSourceGroup: true,
                taskCalendar: true,
                stepper: true,
                dataSource: true,
                map: true
              },
            },
            basic: false,
            advanced: false,
            layout: false,
            data: false,
            premium: false,
          },
          editForm: {
            customCheckBox: [
              {
                key: "layout",
                ignore: true,
              },
              {
                key: "data",
                components: [...commonIgnore],
              },
            ],
            customTextField: [
              {
                key: "layout",
                ignore: true,
              },
              {
                key: "data",
                components: [...commonIgnore],
              },
            ],
            customTextArea: [
              {
                key: "layout",
                ignore: true,
              },
              {
                key: "data",
                components: [...commonIgnore],
              },
            ],
            customRadio: [
              {
                key: "layout",
                ignore: true,
              },
              {
                key: "data",
                components: [...commonIgnore],
              },
            ],
            customUrl: [
              {
                key: "layout",
                ignore: true,
              },
              {
                key: "data",
                components: [...commonIgnore],
              },
            ],
            customSelect: [
              {
                key: "layout",
                ignore: true,
              },
              {
                key: "data",
                components: [...commonIgnore],
              },
            ],
            customDateTime: [
              {
                key: "layout",
                ignore: true,
              },
              {
                key: "data",
                components: [...commonIgnore],
              },
            ],
            customFile: [
              {
                key: "layout",
                ignore: true,
              },
              {
                key: "data",
                components: [...commonIgnore],
              },
            ],
            flex: [
              {
                key: "layout",
                ignore: true,
              },
            ],
          },
        },
        show: false,
      },
      form: {
        createdTs: "",
        createdBy: "",
        formData: [],
        name: "",
        type: "form",
        updatedTs: "",
        updatedBy: "",
      },
      invalidName: false,
      deleteDialog: {
        display: false,
        title: this.$t("deleteForm"),
        description: this.$t("deleteFormConfirm"),
        success: this.$t("deleteFormSuccess"),
        error: this.$t("deleteFormFail"),
      },
      importBPMNDialog: {
        display: false,
        file: null,
      },
      createResourceDialog: {
        name: "",
        type: 5,
        display: false,
      },
      objectDialog: {
        display: false,
        projects: [],
        tables: [],
        project: {},
        table: {},
        ignoreFieldTypes: [
          "Attachment",
          "AutoNumber",
          "Barcode",
          "Button",
          "Count",
          "CreateTime",
          "Formula",
          "ForeignKey",
          "GeoData",
          "Geometry",
          "ID",
          "LastModifiedTime",
          "Rollup",
          "SpecificDBType",
          "QrCode",
          "Links",
        ],
      },
    };
  },
  props: {
    resourceId: {
      type: Number,
      required: true,
    },
    projectId: {
      type: Number,
    },
  },
  computed: {
    userName() {
      return (
          this.$store.state.user.profile.firstName +
          " " +
          this.$store.state.user.profile.lastName
      );
    },
    userId() {
      return this.$store.state.user.profile.id;
    },
  },
  watch: {
    $route: {
      handler() {
        this.getData();
      },
    },
    resourceId: {
      handler() {
        this.getData();
      },
    },
    "$i18n.locale": {
      handler(val) {
        let self = this;
        self.formBuilder.options.builder.design.title = self.$t("widget");
        self.deleteDialog.title=self.$t("deleteForm");
        self.deleteDialog.description=self.$t("deleteFormConfirm");
        self.deleteDialog.success=self.$t("deleteFormSuccess");
        self.deleteDialog.error=self.$t("deleteFormFail");
      }
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    formatDateTime: utils.formatDateTime,
    onImportClick() {
      this.importBPMNDialog.file = null;
      this.importBPMNDialog.display = true;
    },
    onImportCancel() {
      this.importBPMNDialog.file = null;
      this.importBPMNDialog.display = false;
    },
    onImportSubmit() {
      let self = this;
      this.formBuilder.show = false;
      let reader = new FileReader();
      reader.readAsText(self.importBPMNDialog.file);
      reader.onloadend = async () => {
        let xml = reader.result;
        this.formBuilder.form.components = JSON.parse(xml).formData || [];
        this.formBuilder.show = true;
        self.onImportCancel();
      };
    },
    startDelete() {
      this.deleteDialog.display = true;
    },
    onFormChange(val) {
      this.$forceUpdate();
    },
    async getData() {
      var key = Number(this.resourceId);
      let resourceResult = await camundaRequest.getResource(key, false);
      resourceResult.associations = [];
      this.resource = resourceResult;
      this.project = await camundaRequest.getProject(this.projectId);
      this.form.id = resourceResult.externalResourceId;
      this.invalidName = false;
      this.formBuilder.show = false;
      return new Promise((resolve, reject) => {
        if (this.form.id) {
          formRequest.getFormDetail(this.form.id).then((form) => {
            resolve(form);
          });
        } else {
          resolve({});
        }
      }).then((data) => {
        Object.assign(this.form, data);
        this.formBuilder.form = {components: this.form.formData || []};
        this.formBuilder.show = true;
      });
    },
    async exportFile() {
      let name = `${this.project.name}-${this.resource.name}-form.json`;
      let content = JSON.stringify(this.form);
      let blob = new Blob([content], {type: "text/xml"});
      saveAs(blob, name);
    },
    async saveData() {
      var form = JSON.parse(JSON.stringify(this.form));
      delete form._etag;

      form.formData = this.formBuilder.form.components;
      let id = form.id;
      try {
        if (this.form.id) {
          // 保存
          form.updatedBy = this.userId;
          await formRequest.putForm(form.id, form);
        } else {
          // 新建
          form.type = "form";
          form.createdBy = this.userId;
          form.createdName = this.userName;
          let result = await formRequest.postForm(form);
          id = result.id;
          this.$router.push({name: "form-detail", params: {id: id}});
        }

        this.$message({
          message: this.$t("saveSuccess"),
          type: "success",
          showClose:true
        });
        // this.getData();
      }  catch (err) {
        this.invalidName = true;
        let msg = this.$t("saveFailSameName");
        if (err.response.status === 413) {
          msg = this.$t("saveFailLargeContent");
        } else if (err.response.status === 500){
          msg = this.$t("saveFailErrServer");
        }
        this.$message({
          message: msg,
          type: "error",
          showClose:true
        });
      }
    },
    copyFormId() {
      let value = this.resource.externalResourceId;
      navigator.clipboard.writeText(value);
      this.$message({
        message: this.$t("copySuccessWithValue",{value:value}),
        type: "success",
        showClose:true
      });
    },
    copyData() {
      this.createResourceDialog.name = "";
      this.createResourceDialog.display = true;
    },
    async createResource() {
      let self = this;
      if (!this.createResourceDialog.name) {
        this.$message({
          message: this.$t("inputInfoMiss"),
          type: "error",
          showClose:true
        });
        return;
      }

      let data = {
        type: this.createResourceDialog.type,
        name: this.createResourceDialog.name,
        parentNode: this.resource.parentNode || 0,
        projectId: this.project.id,
      };
      if (this.createResourceDialog.type === 5) {
        // 表单
        try {
          let formCreateResult = await formRequest.postForm({
            name: self.createResourceDialog.name,
            type: "form",
            createdBy: self.userId,
            formData: self.formBuilder.form.components,
            createdName: self.userName,
          });
          data.externalResourceId = formCreateResult.id;
        } catch (e) {
          this.$message({
            message: this.$t("createFormFail"),
            type: "error",
            showClose:true
          });
          return;
        }
      }
      let resourceResult = await camundaRequest.createResource(data);
      this.$message({
        message: `${
            this.createResourceDialog.type === 1
                ? this.$t("folder")
                : this.createResourceDialog.type === 4
                    ? this.$t("form")
                    : this.$t("page")
        }${this.createResourceDialog.name}${this.$t("successCreate")}。`,
        type: "success",
        showClose:true
      });
      this.createResourceDialog.display = false;
      this.$emit("onCreated", {
        id: resourceResult.id, type: {value: 5}, name: self.createResourceDialog.name, projectId: self.project.id
      });
    },
    async startImportObject() {
      await this.selectProject({});
      let {list} = await nocodbRequest.getProjects();
      this.objectDialog.projects = list;
      this.objectDialog.display = true;
    },
    async selectProject(project) {
      this.objectDialog.project = project;
      this.objectDialog.table = {};
      if (!project.id) {
        this.objectDialog.tables = [];
        return;
      }
      try {
        let {list} = await nocodbRequest.getTables(project.id);
        this.objectDialog.tables = list;
      } catch (e) {
      }
    },
    async selectTable(table) {
      this.objectDialog.table = table;
    },

    async importObject() {
      this.formBuilder.show = false;
      let table = await nocodbRequest.getTable(this.objectDialog.table.id);
      let columns = table.columns.filter(
          (column) =>
              !column.au &&
              !column.ai &&
              !column.system &&
              column.column_name !== "created_at" &&
              this.objectDialog.ignoreFieldTypes.indexOf(column.uidt) < 0
      );
      let fields = columns.map(utils.mapFormField);

      this.formBuilder.form = {components: fields};
      this.objectDialog.display = false;
      this.formBuilder.show = true;
      this.$message({
        message: this.$t("importApiSuccessMsgWithName",{name:this.objectDialog.table.title}),
        type: "success",
        showClose:true
      });

      //JSON  Percent Rating
    },
  },
};
</script>

<style scoped>
div.v-list-item__subtitle.subtitle {
  color: rgba(136, 136, 136, 100);
  font-size: 12px;
  text-align: left;
}

div.value {
  color: rgba(16, 16, 16, 100);
  font-size: 16px;
  text-align: left;
}

div.diagram-container {
  height: 420px;
  background-color: rgba(232, 239, 247, 16);
}

div.el-table {
  margin: 30px 20px;
}

div.type-switch {
  margin: auto 0 auto 15px;
  padding: 0;
  height: 24px;
}

.form-menu {
  border-right: 1px solid rgba(187, 187, 187, 1);
}

button.form-menu span {
  color: #444262;
  font-size: 14px;
}

div.stretch {
  min-height: calc(100vh - 113px);
}
</style>

<style scoped>
/deep/ .v-window__container {
  height: 100% !important;
  overflow-y: auto;
}

.copyIcon {
  opacity: 0;
}

.tabCopy:hover .copyIcon {
  opacity: 1;
}

.value:hover .copyIcon,
.main-value:hover .copyIcon {
  opacity: 1;
}

.small-headline {
  color: #444262;
  font-size: 16px;
  font-weight: bold;
}

.checkbox-tip {
  margin: 0;
}

div.v-list-item__subtitle.subtitle {
  color: rgba(136, 136, 136, 100);
  font-size: 0.8em;
  text-align: left;
}

.id-breadcrumbs .v-breadcrumbs__item.v-breadcrumbs__item--disabled {
  color: #83829a;
}

div.value {
  color: rgba(16, 16, 16, 100);
  font-size: 0.8em;
  text-align: left;
}

div.main-value {
  color: #444262;
  font-size: 18px;
  text-align: left;
}

button.process-menu {
  padding: 0 10px;
}

.title-menu {
  padding-left: 15px;
  font-size: 13px;
  color: #312651;
  margin-top: auto;
  margin-bottom: auto;
}

button.process-menu span {
  color: rgba(33, 33, 33, 100);
  font-size: 0.8em;
}

div.stretch {
  min-height: calc(100vh - 113px);
}

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
  background-color: #70b8db;
  border: 0;
  margin-right: 10px;
  color: #fff;
}

.closed-incidents,
.activity-instance-canceled,
.activity-instance-completed,
.instance-count,
.instance-incidents {
  cursor: pointer;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 120px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  padding: 0px 16px;
  z-index: 1;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.menu-border {
  border-bottom: none;
  height: 45px;
}

div.v-sheet.v-card.detail-card:not(.v-sheet--outlined) {
  box-shadow: 0 0px 0px 0px;
}

.badge-total {
  background-color: #b1abb6;
}

.badge-instance {
  background-color: #57928d;
}

.badge-incident {
  background-color: #fa4f07;
}

.badge-total i,
.badge-instance i,
.badge-incident i {
  margin-right: 2px;
}

i.v-icon.point::after {
  font-size: 14px;
  content: "";
  display: block;
  width: 6px;
  height: 6px;
  background-color: #ff7754;
  border-radius: 50%;
  position: relative;
  right: 5px;
  top: -5px;
  opacity: 1;
}

.box {
  display: flex;
  flex-direction: column;
}

.box-header {
  border-top: 1px solid rgba(187, 187, 187, 1);
  border-bottom: 1px solid rgba(187, 187, 187, 1);
  height: 42px;
}

.box-icon {
  width: 45px;
  height: 100%;
  border-right: 1px solid rgba(187, 187, 187, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  float: left;
}

.box-title {
  display: flex;
  align-items: center;
  height: 100%;
}

.box-title span {
  color: #444262;
  font-size: 14px;
  margin-left: 10px;
}

.box-icon i.theme--light.v-icon {
  font-size: 18px;
}

.box
div.theme--light.v-input.v-textarea.v-textarea.v-text-field--enclosed.v-text-field--outlined {
  /* border: 1px solid#E6E4E6; */
  background-color: #f3f4f9;
  margin: 10px;
  padding: 0;
}

.box textarea {
  background-color: #f3f4f9;
  margin: 10px;
  padding: 5px;
  border: 1px solid #e6e4e6;
}

/deep/
.box
div.v-textarea.v-text-field--enclosed.v-text-field--outlined:not(.v-input--dense)
.v-text-field__slot
textarea {
  margin-top: 0;
}

.box .nav-item {
  display: flex;
}

.box .nav-item .name {
  width: 30px;
  height: 30px;
  background-color: #312651;
  color: #ffffff;
  margin-top: 10px;
  border-radius: 50%;
  text-align: center;
}

.box .nav-item .name span {
  vertical-align: middle;
  font-size: 14px;
}

.box .nav-item .content {
  flex: 1;
  margin: 10px 0 10px 15px;
}

.box.history .nav-item {
  flex: 1;
  margin: 0;
  padding: 20px 16px;
}

.box.history .nav-item .content {
  flex: 1;
  margin: 0;
}

.box.history .nav-item:hover {
  background-color: rgba(243, 244, 249);
}

.box.history .nav-item:not(:last-child) {
  border-bottom: 1px solid #bbbbbb;
}

.box .nav-item .main {
  color: #444262;
  font-size: 14px;
}

.box .nav-item.active .main {
  color: #312651;
  font-weight: bold;
  font-size: 14px;
}

.box .more {
  margin: auto;
  height: 25px;
  opacity: 0;
}

.box .nav-item:hover .more {
  opacity: 1;
}

.box.history .nav-item .main {
  color: #312651;
  font-size: 14px;
}

.box.history .nav-item .tip {
  color: #83829a;
  font-size: 12px;
  margin-top: 10px;
}

.box .nav-item .sub {
  color: #83829a;
  font-size: 12px;
  margin-top: 8px;
}

.box .nav-item .tip {
  color: #83829a;
  font-size: 12px;
  margin-top: 0px;
}

.box .nav-input {
  margin: 15px 20px;
  display: flex;
}

.box .nav-input div.v-input.theme--light.v-text-field.v-text-field--placeholder {
  margin: 0;
  padding: 0;
}

.box .nav-input input {
  flex: 1;
  height: 30px;
  border: 1px solid #e6e4e6;
  padding: 5px;
}

/deep/
.box
.nav-input
div.v-input.theme--light.v-text-field.v-text-field--placeholder
input {
  padding: 0;
}

/deep/ .v-expansion-panel-content__wrap {
  padding: 0;
}

/deep/ .v-expansion-panel--active > .v-expansion-panel-header {
  min-height: unset;
}

.share input {
  flex: 1;
  height: 36px;
  border: 1px solid #e6e4e6;
  padding: 5px;
  width: 100%;
}

div.password-setting span {
  color: #83829a;
  font-size: 14px;
  margin-left: 8px;
}

span.password-split {
  color: #83829a;
  font-size: 20px;
  margin: 0 8px;
}

div.type-switch {
  margin: auto 0 auto 15px;
  padding: 0;
  height: 24px;
}

.div-connector-label {
  border-top: 1px solid #bbbbbb;
  border-bottom: 1px solid #bbbbbb;
  background-color: #f3f4f9;
  font-size: 12px;
  padding: 15px;
}

.v-text-field--outlined:deep(fieldset) {
  top: 0;
}

.div-connector-content-parent {
  gap: 5px;
  padding: 10px 15px;
}

.div-connector-content-label {
  font-size: 12px;
  color: #83829a;
}

.div-connector-content-item {
  align-items: center;
  gap: 5px;
}

.div-connector-content-item-icon {
  height: 40px;
  gap: 5px;
  cursor: pointer;
  padding: 5px 10px;
  align-items: center;
  border: 1px solid #bbbbbb;
  border-radius: 6px;
  background-color: #e6e4e6;
}
</style>

<style>
.activity-bottom-left-position {
  position: absolute;
  left: -0.7em;
  bottom: -0.25em;
}

.badge {
  display: inline-block;
  min-width: 10px;
  padding: 3px 7px;
  font-size: 12px;
  font-weight: bold;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  border-radius: 10px;
  background-color: #70b8db;
  border: 1px solid #143d52;
  color: #143d52;

  /*
      color: #fff;
      background-color: #777;
     */
}

.closed-incidents,
.activity-instance-canceled,
.activity-instance-completed,
.instance-count,
.instance-incidents {
  cursor: pointer;
}

div.form-header {
  border-bottom: 1px solid rgba(187, 187, 187, 1);
}
</style>

<style>
.el-message .el-icon-success {
  color: #444262;
}

.el-message--success .el-message__content {
  color: #444262;
}

.el-notification {
  min-width: 380px;
  border-radius: 4px;
  border-width: 1px;
  border-style: solid;
  overflow: hidden;
  background-color: #fef0f0;
  border-color: #fde2e2;
}

.el-notification__title {
  color: #f56c6c;
  font-size: 14px;
  font-weight: 400;
}

.el-icon-error {
  font-size: 16px;
}

.el-notification__icon {
  height: auto;
  width: auto;
}

.current {
  background-color: #f3f4f9;
}

.object-title {
  font-size: 14px;
  color: #101010;
}
</style>
