<template>
  <div style="position: relative;height: 100%;width: 100vw">
    <div
        style="
      height: 100%;
      overflow-y: auto;
      width: 100vw;
      display: flex;
      flex-direction: column;
      border-top: 1px solid rgba(187, 187, 187, 1);
    "
        ref="scrollParent"
        id="scrollParent"
    >
      <div class="d-flex flex-row"
           style="padding: 14px 15px; font-size: 14px; color: rgba(131, 130, 154, 1);align-items: center">
        <v-breadcrumbs :items="breadcrumbs" style="background-color: #e8eff7;padding: 0;border: none" divider="|"/>
      </div>
      <div style="position: relative">
        <v-tabs
            v-model="tab"
            background-color="#fafafa"
            color="#444262"
        >
          <v-tabs-slider color="#FF7754"/>
          <v-tab key="expanel-list">{{ $t('deployProcessDef') }}</v-tab>
        </v-tabs>
      </div>
      <v-tabs-items
          v-model="tab"
      >
        <v-tab-item key="expanel-list">
          <div class="d-flex flex-column" style="height: 100%;width: 100vw" id="tableListParent">
            <el-table
                :data="allProcesses"
                style="width: 100vw;height: 0"
                v-loading="loading"
                :max-height="listMaxHeight"
                stripe
                @sort-change="historyBatchSort"
                :defaultSort="{prop: sortBy, order: sortOrder === 'desc' ? 'descending' : 'ascending'}"
            >
              <el-table-column align="center" :label="$t('status')" width="100">
                <template slot-scope="props">
                  <v-icon
                      size="20"
                      color="#6d6b82"
                      v-if="props.row.suspensionState===2"
                  >
                    mdi-pause-circle
                  </v-icon>
                  <template v-else>
                    <v-icon
                        size="20"
                        color="green"
                        v-show="props.row.incidents === 0"
                    >
                      mdi-check-underline-circle-outline
                    </v-icon>
                    <v-icon
                        size="20"
                        color="red"
                        v-show="props.row.incidents > 0"
                    >
                      mdi-alert-box
                    </v-icon>
                  </template>
                </template>
              </el-table-column>
              <el-table-column :label="$t('running')" prop="instances" align="center" sortable="custom" width="100">
                <template slot-scope="props">
                  <a
                      v-if="props.row.instances > 0"
                      href="javascript:void(0)"
                  >
                    {{ props.row.instances }}
                  </a>
                  <div v-else>{{ props.row.instances }}</div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('incident')" prop="incidents" align="center" sortable="custom" width="100">
                <template slot-scope="props">
                  <a
                      v-if="props.row.incidents > 0"
                      href="javascript:void(0)"
                  >
                    {{ props.row.incidents }}
                  </a>
                  <div v-else>{{ props.row.incidents }}</div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('processNameNew')" prop="name" sortable="custom" width="400">
                <template slot-scope="props">
                  <div class="d-flex flex-row" style="align-items: center;justify-items: center">
                    <v-icon size="14" style="margin-right: 3px" color="#83829A">mdi-filter-outline</v-icon>
                    <router-link
                        :to="{
                        name: 'process-detail',
                        params: {
                          id: props.row.id,
                        },
                        query: {},
                      }"
                        style="text-overflow: ellipsis;flex: 1;
    overflow: hidden;
    word-break: break-all;
    white-space: nowrap;"
                    >
                      {{
                        props.row.name
                            ? props.row.name
                            : props.row.key
                      }}
                    </router-link>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="$t('tenantId')" width="100">
                <template slot-scope="props">
                  {{ props.row.tenantId }}
                </template>
              </el-table-column>
              <el-table-column prop="name" :label="$t('operate')" width="100" header-align="center">
                <template slot-scope="props">
                  <div class="d-flex flex-row" style="justify-content: center">
                    <v-menu>
                      <template #activator="{ on, attrs }">
                        <v-icon
                            size="20"
                            color="#444262"
                            v-bind="attrs"
                            v-on="on"
                        >
                          mdi-dots-vertical
                        </v-icon>
                      </template>
                      <v-list style="cursor: pointer" dense>
                        <v-list-item>
                          <v-list-item-title @click="onClickDeleteDefDialog(props.row)">
                            <v-icon
                                size="16"
                                color="#83829A"
                                style="margin-right: 6px"
                            >
                              mdi-delete-alert-outline
                            </v-icon>
                            <span style="font-size: 14px">{{ $t('deleteAllProcessDef') }}</span>
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div
                class="text-center mb-2 my-2"
                v-show="pageCount > 1"
            >
              <v-pagination
                  v-model="page"
                  :length="pageCount"
                  total-visible="10"
                  color="#FF7754"
              />
            </div>
          </div>
        </v-tab-item>
      </v-tabs-items>

      <v-dialog v-model="deleteDialog.display" max-width="500">
        <v-card>
          <v-card-title class="headline" style="color: #444262">
            {{ deleteDialog.title }}
          </v-card-title>
          <v-card-subtitle style="color: #gray; margin-top: 0px">
            {{ $t('deleteProcessDefTipWithCount', {count: deleteDialog.processDef.instances}) }}
          </v-card-subtitle>
          <v-card-text>
            <v-form lazy-validation>
              <v-checkbox
                  v-model="deleteDialog.cascade"
                  color="#FF7754"
                  label="Cascade"
                  hide-details="auto"
              >
                <template #label>
                  <div class="checkbox-label">Cascade</div>
                </template>
              </v-checkbox>

              <div class="checkbox-tip">
                {{ $t('deleteProcessDefConfirm') }}
              </div>

              <v-checkbox
                  v-model="deleteDialog.skipCustomListeners"
                  :label="$t('skipCustomListeners')"
                  color="#FF7754"
                  hide-details="auto"
              >
                <template #label>
                  <div class="checkbox-label">{{ $t('skipCustomListeners') }}</div>
                </template>
              </v-checkbox>
              <div class="checkbox-tip">
                {{ $t('skipCustomListenersTips1') }}
              </div>
              <v-checkbox
                  v-model="deleteDialog.skipIoMappings"
                  :label="$t('skipIOMaps')"
                  color="#FF7754"
                  hide-details="auto"
              >
                <template #label>
                  <div class="checkbox-label">{{ $t('skipIOMaps') }}</div>
                </template>
              </v-checkbox>
              <div class="checkbox-tip">{{ $t('skipIOMapsTips1') }}</div>
            </v-form>
          </v-card-text>
          <v-card-actions style="padding-bottom: 16px">
            <v-spacer/>
            <v-btn text @click="deleteDialog.display = false"> {{ $t('cancel') }}</v-btn>
            <v-btn
                style="color: #ffffff"
                color="#FF7754"
                :loading="deleteDialog.commitLoading"
                :disabled="deleteDialog.processDef.instances>0&&!deleteDialog.cascade"
                @click="onSubmitDeleteDefDialog()"
            >
              <v-icon size="14" color="#ffffff" style="margin-right: 5px">
                mdi-delete
              </v-icon>
              {{ $t('confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>
<script>
import processRequest from "@/api/process";
import request from "@/api/process";
import userRequest from "@/api/user";

export default {
  data() {
    return {
      breadcrumbs: [
        {
          text: this.$t("processRuntimeDashboard"),
          href: "",
          disabled: true,
        }
      ],
      tab: 0,
      deleteDialog: {
        display: false,
        cascade: false,
        skipCustomListeners: false,
        skipIoMappings: false,
        title: this.$t("deleteProcessDef"),
        description: this.$t("deleteProcessDefConfirm1"),
        success: this.$t("deleteProcessDefSuccess"),
        error: this.$t("deleteProcessDefFailed"),
        processDef: {
          instances: 0
        },
        commitLoading: false
      },
      listMaxHeight: 0,
      loading: true,
      page: 0,
      pageCount: 0,
      itemsPerPage: 20,
      totalCount: 0,
      processes: [],
      allProcesses: [],
      sortBy: "name",
      sortOrder: "desc",
    };
  },
  watch: {
    "$i18n.locale": {
      handler(val) {
        let self = this;
        self.idBreadcrumbs[0].text = self.$t("processRuntimeDashboard");
        self.deleteDialog.title = self.$t("deleteProcessDef");
        self.deleteDialog.description = self.$t("deleteProcessDefConfirm1");
        self.deleteDialog.success = self.$t("deleteProcessDefSuccess");
        self.deleteDialog.error = self.$t("deleteProcessDefFailed");
      }
    },
    page: {
      handler() {
        this.getPage();
      },
    },
    pageCount: {
      handler() {
        this.setTableHeight();
      },
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    historyBatchSort(value) {
      this.sortBy = value.prop;
      if (value.order) {
        this.sortOrder = value.order == "descending" ? "desc" : "asc";
      } else {
        this.sortOrder = null;
      }
      if (this.page === 1) {
        this.getPage();
      } else {
        this.page = 1;
      }
    },
    async onSubmitDeleteDefDialog() {
      let self = this;
      try {
        self.deleteDialog.commitLoading = true;
        let data = {
          cascade: this.deleteDialog.cascade,
          skipCustomListeners: this.deleteDialog.skipCustomListeners,
          skipIoMappings: this.deleteDialog.skipIoMappings,
        };
        await request.deleteDefinitionsByKey(self.deleteDialog.processDef.key, data);
        self.$notify.success(self.$t("deleteProcessDefSuccess"));
        self.deleteDialog.display = false;
        await self.getData();
      } catch (error) {
        this.$message({
          message: this.deleteDialog.error,
          type: "error",
          showClose:true
        });
      } finally {
        self.deleteDialog.commitLoading = false;
      }
    },
    onClickDeleteDefDialog(def) {
      let self = this;
      self.deleteDialog.processDef = def;
      self.deleteDialog.skipCustomListeners = true;
      self.deleteDialog.skipIoMappings = true;
      self.deleteDialog.cascade = false;
      self.deleteDialog.display = true;
    },
    copy(value) {
      navigator.clipboard.writeText(value);
      this.$message({
        message: this.$t("copySuccessWithTxt", {txt: value}),
        type: "success",
        showClose:true
      });
    },
    setTableHeight() {
      let self = this;
      let height = $("#tableListParent").outerHeight();
      let paginationHeight = 59.59;
      // 46为顶部操作按钮的高度
      if (self.pageCount > 1) {
        height = height - paginationHeight;
      }
      this.$nextTick(() => {
        self.listMaxHeight = height;
      });
    },
    async getData() {
      this.loading = true;
      let result;
      try {
        result = await processRequest.getProcessDefinitionStatisticsCount();
        this.totalCount = result.count;
        this.pageCount =
            Math.floor((this.totalCount - 1) / this.itemsPerPage) + 1;
        this.page = 1;
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },
    async getPage() {
      let self = this;
      self.loading = true;
      if (!self.page) {
        self.allProcesses = [];
        return;
      }
      let params = {
        firstResult: (self.page - 1) * self.itemsPerPage,
        maxResults: self.itemsPerPage,
      };
      if (self.sortOrder){
        params.sortBy=self.sortBy;
        params.sortOrder=self.sortOrder;
      }
      try {
        self.allProcesses = await processRequest.getProcessDefinitionStatistics(params);
      } catch (e) {
        console.log(e);
      } finally {
        self.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.copyIcon {
  opacity: 0;
}

.tabCopy:hover .copyIcon {
  opacity: 1;
}

/deep/ .v-window__container {
  height: 100%;
  width: 100vw;
}

/deep/ .v-window-item {
  height: 100%;
  width: 100vw;
}

/deep/ .v-tabs-items {
  height: 100%;
  width: 100vw;
}

/deep/ .v-input--selection-controls {
  margin: 0;
}

/deep/ .v-expansion-panel-content__wrap {
  padding: 0;
}

/deep/ div.container.container--fluid.subpage {
  padding: 0;
  background-color: #e8eff7;
  height: calc(100vh - 48px);
}

div.container.container--fluid.subpage {
  padding: 0px 0 0 0px;
  background-color: #e8eff7;
  height: calc(100vh - 48px);
}

/deep/ .v-expansion-panel-header {
  padding: 0;
  border: 1px solid rgba(187, 187, 187, 1);
  min-height: fit-content !important;
  border-radius: unset;
}

.v-expansion-panel-header > *:not(.v-expansion-panel-header__icon) {
  flex-grow: 0;
}

.icon_expand {
  padding: 0px 10px;
}

.vertical_line_expand {
  height: 40px;
  width: 1px;
  color: #bbbbbb;
  border: 0.5px solid rgba(187, 187, 187, 1);
}

div.page-title {
  color: rgba(158, 158, 158, 100);
  font-size: 26px;
  text-align: left;
  vertical-align: middle;
}

/*div.el-table {*/
/*  margin: 30px 20px;*/
/*}*/

/deep/ .btn_only_border_left {
  border-bottom: none;
  border-right: none !important;
  border-top: none;
  border-left: none !important;
}

/*解决ie11下el-table出现空白问题*/
/deep/ .el-table__header {
  width: 100% !important;
}

/deep/ .el-table__body {
  width: 100% !important;
}

/*解决ie11下el-table出现空白问题 end*/


/deep/ .title_expand {
  font-weight: bolder;
  color: rgba(68, 66, 98, 1);
  font-size: 14px;
  padding: 10px;
}

div.v-sheet.v-card.detail-card:not(.v-sheet--outlined) {
  box-shadow: 0 0px 0px 0px;
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
</style>

<style>
a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}
</style>
