<template>
  <div
    class="d-flex flex-column"
    style="border-top: 1px solid rgba(187, 187, 187, 1); height: 100%"
  >
    <v-card class="detail-card" style="flex: 1; height: 0; overflow-y: hidden">
      <v-layout
        style="margin: 0; height: 100%; overflow-y: auto"
        class="stretch"
        :style="{ display: xml ? 'block' : 'none' }"
      >
        <DMNConfig v-if="item.configJson" :xml="xml" :item="item" />
        <vue-dmn
          v-if="!item.configJson"
          :node-properties="{}"
          :diagram-xml="xml"
          :node-actions="[]"
          :instructions="[]"
          :options="{ overlays: { defaults: { scale: true } } }"
          @onClickNode="onClickNode"
        />
      </v-layout>
      <v-dialog v-model="passwordDialog.display" max-width="300">
        <v-card>
          <v-card-title class="headline" style="color: #444262">
            输入密码
          </v-card-title>
          <v-card-text>
            <v-form ref="form" lazy-validation>
              <v-row style="margin: 0">
                <v-col style="padding: 0" cols="12">
                  <v-text-field
                    :placeholder="$t('inputPwd')"
                    v-model="passwordDialog.password"
                    type="password"
                    hide-details
                    @keydown.enter="confirm()"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions style="padding-bottom: 16px">
            <v-spacer />
            <v-btn text @click="passwordDialog.display = false"> {{ $t('cancel') }}</v-btn>
            <v-btn style="color: #ffffff" color="#FF7754" @click="confirm()">
              <v-icon size="14" color="#ffffff" style="margin-right: 5px">
                mdi-check-bold
              </v-icon>
              {{ $t('confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>

<script>
import VueDmn from "@/components/common/DMN";
import collaborationRequest from "@/api/collaboration";

import ReSizeDrawer from "@/components/common/ReSizeDrawer";

import DMNConfig from "./DMNConfig";
export default {
  name: "Viewer",
  props: {},
  computed: {},
  components: {
    VueDmn,
    ReSizeDrawer,
    DMNConfig,
  },
  data: function () {
    return {
      xml: "",
      item: {},
      collectionName: "test1",
      passwordDialog: {
        display: false,
        password: "",
      },
      resource: {},
    };
  },
  mounted: function () {
    this.getData();
  },
  beforeDestroy: function () {},
  watch: {},
  methods: {
    async getData(password) {
      let data;
      if (password) {
        data = {
          password: password,
        };
      }
      collaborationRequest
        .getNoAuthVersionDetail(this.$route.params.id, data)
        .then(async (result) => {
          this.item = result;
          this.resource = await collaborationRequest.getNoAuthResourceDetail(
            this.item.resourceId
          );
          this.xml = this.item.xml;
          $("#viewer-name").text(this.resource.name);
          this.passwordDialog.display = false;
        })
        .catch((err) => {
          if (err.response.status === 403) {
            this.passwordDialog.display = true;
            this.$message({
              message: this.$t("errPwd"),
              type: "error",
              showClose:true
            });
          } else {
            this.$notify.error(this.$t("failedToGetResourceDetail"));
          }
        });
    },
    confirm() {
      this.getData(btoa(this.passwordDialog.password));
    },
    onClickNode() {},
  },
};
</script>

<style scoped>
.v-navigation-drawer.v-navigation-drawer--absolute {
  border-right: unset !important;
}
div.diagram-container {
  /* height: calc(100% - 50px); */
  background-color: rgba(232, 239, 247, 16);
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  display: -webkit-flex;
  height: 100%;
}
div.stretch {
  min-height: calc(100vh - 48px);
}
</style>
