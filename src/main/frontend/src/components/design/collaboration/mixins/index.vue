<template>
  <div/>
</template>

<script>
import collaborationRequest from "@/api/collaboration";
import camundaRequest from "@/api/camunda-service";
import axios from "axios";

export default {
  name: "Index",
  computed: {
    isDmn() {
      return this.resource.type.value === "3";
    },
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
  data() {
    return {
      showEditXml: false,
      saveResult: {
        display: false,
        data: {},
        type: "save",
      },
      resourceUpdated: false,
      aiNodes: {
        items: [],
        loading: false,
        current: null
      },
      item: {
        id: "",
        key: "",
        name: "",
        version: 0,
        nodes: [],
        xml: "",
        configJson: {},
      },
      share: {
        display: false,
        displayPassword: false,
        password: "",
      },
    };
  },
  async mounted() {
    let self = this;
    this.getAiNodes();
    this.project = await camundaRequest.getProject(this.projectId);
    let members = await camundaRequest.getMembers(this.project.id);
    let member = members.find((member) => member.userId === this.userId);
    this.role = member ? member.role.value : "";
    await this.getData();
  },
  methods: {
    async getAiNodes() {
      this.aiNodes.items = await camundaRequest.getApplications({},
          {
            category: "connector",
            coeCode: "aibot",
            status: 1
          }
      );
    },
    async refreshAssociations() {
      this.resource.associations = await collaborationRequest.getResourceAssociationList(
          this.resource.id
      );
    },
    createApp() {
      this.$router.push({name: "application"});
    },
    setLeftWidth(payload) {
      let self = this;
      self.left = payload.left;
      self.leftStylePadding = {
        paddingLeft: `${payload.left ? payload.width : 0}px`,
      };
      self.leftStyleMargin = {
        marginLeft: `${payload.left ? payload.width : 0}px`,
      };
    },
    switchLeft() {
      this.$emit("switchLeft");
    },
    switchRight(isAI) {
      if (typeof isAI !== "undefined") {
        if (this.ai != isAI) {
          this.ai = isAI;
          this.right = true;
          return;
        }
      }
      this.right = !this.right;
    },
    toggleFullscreen(full) {
      this.$refs.resizeDrawer.setLeft(!full);
    },
    async getData() {
      var key = Number(this.resourceId);
      let resourceResult = await camundaRequest.getResource(key);
      resourceResult.associations = [];
      this.resource = resourceResult;
      await this.refreshAssociations();
      this.resourceUpdated = false;
      var version = this.item.version || Number(this.$route.query.version);
      this.items = await collaborationRequest.getAllVersionDetail(key);
      this.share.password = "";
      if (this.items.length) {
        this.item =
            this.items.filter((item) => item.version == version)[0] || this.items[0];
        if (this.isDmn) {
          // node
          this.node = {id: this.item.id};
        } else {
          this.refreshPasswordStatus();
        }
      } else {
        let initFiletype = !this.isDmn ? "bpmn" : "dmn";
        this.item.key = key;
        let {data} = await axios
            .create({
              baseURL: process.env.VUE_APP_ROUTER_BASE,
            })
            .get(`/data/diagram.${initFiletype}`);
        this.item.xml = data;
      }
    },
    async selectVersion(item) {
      this.item.version = item.version;
      await this.getData();
    },
    async save(setting) {
      this.saveResult.display = false;
      var isUpdate = !setting.name;
      if (setting.isAuto) {
        // 自动保存,有id视作更新
        isUpdate = !!this.item.id;
      }
      var item;
      if (isUpdate) {
        let _id = setting.id || this.item.id;
        item = this.items.find((item) => item.id === _id);
        if (!item) {
          isUpdate = false;
        }
      }
      if (!isUpdate) {
        item = this.item;
        item.name = setting.isAuto || !setting.name ? this.$t("originVersion") : setting.name;
        item.createdBy = this.userId;
      }
      item.updatedBy = this.userId;

      let modeler = this.isDmn ? this.$refs.vueDmnModeler : this.$refs.bpmnModeler;
      let xml;
      if (this.isDmn) {
        xml = this.showEditXml ? this.item.xml : await modeler.getXml();
      } else {
        xml = this.showEditXml ? this.item.xml : await modeler.getXML();
      }
      item.xml = xml;
      item.configJson = this.item.configJson;

      if (!item.associations) {
        item.associations = [];
      }
      try {
        if (isUpdate) {
          // 更新
          await collaborationRequest.putVersionDetail(item.id, {
            name: item.name,
            xml: item.xml,
            nodes: [],
            currentVersionTimestamp: item.updatedTs || item.createdTs,
            configJson: item.configJson,
            forceSave: setting.forceSave
          });
        } else {
          // 创建
          let {id} = await collaborationRequest.postVersionDetail(
              this.resourceId,
              {
                name: item.name,
                xml: item.xml,
                nodes: [],
                configJson: item.configJson,
              }
          );
          this.item.id = id;
        }
        if (!setting.isAuto) {
          this.$message({
            message: `${item.name}${this.$t(isUpdate ? "save" : "create")}${this.$t("success")}`,
            type: "success",
            showClose:true
          });
        }
        await this.getData();
      } catch (message) {
        try {
          let result = message.response;
          if (result.status === 409) {
            this.saveResult.data = result.data;
            this.saveResult.display = true;
            this.saveResult.type = "save";
          } else {
            message.type = "error";
            this.$message(message);
          }
        } catch (e) {
          message.type = "error";
          this.$message(message);
        }
      }
    },
    async saveHistory(setting) {
      this.saveResult.display = false;
      var isUpdate = !setting.name;
      var item;
      if (isUpdate) {
        let _id = setting.id || this.historyItem.id;
        item = this.items.find((item) => item.id === _id);
        if (!item) {
          isUpdate = false;
        }
      }
      if (!isUpdate) {
        item = this.historyItem;
        item.name = setting.isAuto || !setting.name ? this.$t("originVersion") : setting.name;
        item.createdBy = this.userId;
      }
      item.updatedBy = this.userId;
      item.xml = this.historyItem.xml;
      item.configJson = this.historyItem.configJson;

      if (!item.associations) {
        item.associations = [];
      }
      try {
        if (isUpdate) {
          // 更新
          await collaborationRequest.putVersionDetail(item.id, {
            name: item.name,
            xml: item.xml,
            nodes: [],
            currentVersionTimestamp: item.updatedTs || item.createdTs,
            configJson: item.configJson,
            forceSave: setting.forceSave
          });
        } else {
          // 创建
          let {id} = await collaborationRequest.postVersionDetail(
              this.resourceId,
              {
                name: item.name,
                xml: item.xml,
                nodes: [],
                configJson: item.configJson,
              }
          );
          this.item.id = id;
        }
        if (!setting.isAuto) {
          this.$message({
            message: `${item.name}${this.$t(isUpdate ? "save" : "create")}${this.$t("success")}`,
            type: "success",
            showClose:true
          });
        }
        await this.getData();
      } catch (message) {
        try {
          let result = message.response;
          if (result.status === 409) {
            this.saveResult.data = result.data;
            this.saveResult.display = true;
            this.saveResult.type = "save";
          } else {
            message.type = "error";
            this.$message(message);
          }
        } catch (e) {
          message.type = "error";
          this.$message(message);
        }
      }
    },
    async saveVersion() {
      try {
        await collaborationRequest.delVersionDetail(this.historyItem.id);
        await collaborationRequest.postVersionDetail(this.historyItem.resourceId, {
          name: this.historyItem.name,
          xml: this.historyItem.xml,
          nodes: [],
          configJson: this.historyItem.configJson,
        });
        this.$message({
          message: `${this.historyItem.name}${this.$t("saveSuccess")}`,
          type: "success",
          showClose:true
        });
        await this.getData();
      } catch (message) {
        message.type = "error";
        this.$message(message);
      }
    },
    async deleteVersion() {
      await collaborationRequest.delVersionDetail(this.historyItem.id);
      this.$message({
        message: `${this.historyItem.name}${this.$t("successDelete")}`,
        type: "success",
        showClose:true
      });
      this.deleteDialog.display = false;

      if (this.historyItem.version === this.item.version) {
        this.item.version = null;
      }
      await this.getData();
    },
    async rename(name, forceSave) {
      try {
        await collaborationRequest.putVersionDetail(this.historyItem.id, {
          name: name,
          xml: this.historyItem.xml,
          nodes: this.historyItem.nodes,
          configJson: this.historyItem.configJson,
          currentVersionTimestamp: this.historyItem.updatedTs || this.historyItem.createdTs,
          forceSave: forceSave
        });
        await this.getData();
        this.$message({
          message: this.$t("successRename"),
          type: "success",
          showClose:true
        });
      } catch (message) {
        try {
          let result = message.response;
          if (result.status === 409) {
            this.saveResult.data = result.data;
            this.saveResult.display = true;
            this.saveResult.type = "rename";
          } else {
            message.type = "error";
            this.$message(message);
          }
        } catch (e) {
          message.type = "error";
          this.$message(message);
        }
      }
    },
    async saveAssociation(payload) {
      let description = this.$t("modify");
      switch (payload.type) {
        case "add":
          description = this.$t("add");
          let {id} = await collaborationRequest.postResourceAssociation(
              this.resource.id,
              {
                type: this.resource.associations[payload.index].type.value,
                name: this.resource.associations[payload.index].name,
                url: this.resource.associations[payload.index].url,
              }
          );
          // 需要更新id
          this.resource.associations[payload.index].id = id;
          break;
        case "save":
          description = this.$t("modify");
          await collaborationRequest.putResourceAssociation(
              this.resource.associations[payload.index].id,
              {
                type: this.resource.associations[payload.index].type.value,
                name: this.resource.associations[payload.index].name,
                url: this.resource.associations[payload.index].url,
              }
          );
          break;
        case "delete":
          description = this.$t("delete");
          await collaborationRequest.deleteResourceAssociation(payload.id);
          break;
      }
      this.$message({
        message: this.$t("successRelatedWithOpt",{opt:description}),
        type: "success",
        showClose:true
      });
    },
    async saveConversation(payload) {
      if (!this.item.id) {
        this.$notify.error(this.$t("saveToSendMsg"));
        return;
      }
      let description;
      try {
        // 更新nodes
        let nodes = [];
        if (this.isDmn) {
          nodes = [`${this.item.id}`];
        } else {
          nodes = this.$refs.bpmnModeler
              .getAllNodes()
              .map((element) => element.businessObject.id);
        }
        await collaborationRequest.putVersionDetail(this.item.id, {
          nodes: nodes,
          name: this.item.name,
          xml: this.item.xml,
          configJson: this.item.configJson,
          currentVersionTimestamp: this.item.updatedTs || this.item.createdTs,
        });
        switch (payload.type) {
          case "create":
            description = this.$t("send");
            await collaborationRequest.postVersionMessage(this.item.id, payload.data);
            // 需要更新id
            break;
          case "save":
            description = this.$t("save");
            await collaborationRequest.putVersionMessage(payload.data.id, payload.data);
            break;
          case "delete":
            description = this.$t("delete");
            await collaborationRequest.deleteVersionMessage(payload.data);
            break;
        }
        this.$message({
          message: this.$t("successMsgWithOpt",{opt:description}),
          type: "success",
          showClose:true
        });
      } catch (message) {
        try {
          let result = message.response;
          if (result.status === 409) {
            this.saveResult.data = result.data;
            this.saveResult.display = true;
            this.saveResult.type = "saveMsg";
          } else {
            this.$notify.error(this.$t("saveMsgFail"));
          }
        } catch (e) {
          this.$notify.error(this.$t("saveMsgFail"));
        }
      } finally {
        this.$refs.modelConversation.refreshMsgList();
      }
    },
  },
  watch: {
    resourceId:{
      handler(val){
        this.getData();
      }
    },
  }
};
</script>

<style scoped></style>
