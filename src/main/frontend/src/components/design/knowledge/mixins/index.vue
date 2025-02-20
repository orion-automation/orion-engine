<template>
  <div />
</template>

<script>
import collaborationRequest from "@/api/collaboration";
import camundaRequest from "@/api/camunda-service";

import userRequest from "@/api/user";
import axios from "axios";
import utils from "@/utils/utils";

export default {
  name: "Index",
  watch: {
    "resource.tags": {
      async handler(val) {
        let names = (val || "").split(",").filter((name) => name.length);
        utils.copyArray(names, this.tag.names);
        this.tag.name = "";
      },
    },
  },
  computed: {
    isDmn() {
      return this.resource.type.value === "3";
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
      item: {
        id: "",
        key: "",
        name: "",
        version: 0,
        nodes: [],
        xml: "",
        configJson: {
          root: "",
          items: [],
        },
      },
      tenant: {
        id: this.$store.state.user.tenant,
        name: this.$store.state.user.tenantName,
      },
      share: {
        display: false,
        displayPassword: false,
        password: "",
      },
      generate: {
        display: false,
        groupId: null,
        projectId: null,
        name: "",
      },
      tag: {
        display: false,
        name: "",
        names: [],
      },
      groups: [],
      projects: [],
      idBreadcrumbs: [
        {
          text: this.$t("knowledge"),
          href: "#/design/knowledge/list",
        },
        {
          text: "",
          href: "",
        },
        {
          text: "",
          href: "",
          disabled: true,
        },
      ],
    };
  },
  async mounted() {
    var key = Number(this.$route.params.id);
    let resourceResult = await camundaRequest.getResource(key);
    resourceResult.associations = [];
    this.resource = resourceResult;
    this.refreshAssociations();
    this.project = await camundaRequest.getProject(this.resource.projectId);
    let members = await camundaRequest.getMembers(this.project.id);
    let member = members.find((member) => member.userId === this.userId);
    this.role = member ? member.role.value : "";
    let backUrlRoot = "#/design/knowledge/list";
    if (this.$route.query.groupId) {
      backUrlRoot = `${backUrlRoot}?defaultGroup=${this.$route.query.groupId}`;
    }
    this.idBreadcrumbs[0].href = backUrlRoot;
    this.idBreadcrumbs[1].text = this.project.name;
    let backUrl = `#/design/knowledge/detail/${this.project.id}`;
    if (this.$route.query.folderResource) {
      backUrl = `${backUrl}?defaultResource=${this.$route.query.folderResource}`;
    }
    this.idBreadcrumbs[1].href = backUrl;
    this.idBreadcrumbs[2].text = this.resource.name;
    if (!this.tenant.id){
      const tenants = await userRequest.getMemberTenants(this.userId);
      if (tenants.length) {
        this.tenant = tenants[0];
      }
    }
    this.groups = await userRequest.getMemberGroups(this.userId);
    if (this.groups.length) {
      let currentGroupIndex = 0;
      if (this.$route.query.defaultGroup) {
        currentGroupIndex = this.groups.findIndex(
          (group) => group.id == this.$route.query.defaultGroup
        );
      }
      let group = this.groups[currentGroupIndex];
      this.generate.groupId = group && group.id;
      await this.getProjects();
    }
    await this.getData();
  },
  methods: {
    goToList(event) {
      const routeData = this.$router.resolve({ name: "collaboration-list" });
      window.open(routeData.href, "_blank");
      event.stopPropagation();
      event.preventDefault();
    },
    async refreshAssociations() {
      this.resource.associations = await collaborationRequest.getResourceAssociationList(
        this.resource.id
      );
    },
    async getProjects() {
      if (!this.generate.groupId) {
        this.projects = [];
        return;
      }
      let data = await camundaRequest.getProjects({
        tenant: this.tenant.id,
        coeCode: this.generate.groupId,
        type: 1,
      });
      this.projects = data;
    },
    createApp() {
      this.$router.push({ name: "application" });
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
      this.$refs.resizeDrawer.setLeft(!this.left);
    },
    switchRight() {
      this.right = !this.right;
    },
    toggleFullscreen(full) {
      this.$refs.resizeDrawer.setLeft(!full);
    },

    async getData() {
      let key = Number(this.$route.params.id);

      var version = this.item.version || Number(this.$route.query.version);
      this.items = await collaborationRequest.getAllVersionDetail(key);
      this.share.password = "";
      if (this.items.length) {
        let currentItem =
          this.items.filter((item) => item.version == version)[0] || this.items[0];
        if (!currentItem.configJson) {
          currentItem.configJson = {
            root: "",
            items: [],
          };
        }
        this.item = currentItem;

        if (this.isDmn) {
          // node
          this.node = { id: this.item.id };
        } else {
          this.refreshPasswordStatus();
        }
      } else {
        let initFiletype = !this.isDmn ? "bpmn" : "dmn";
        this.item.key = key;
        let { data } = await axios
          .create({
            baseURL: process.env.VUE_APP_ROUTER_BASE,
          })
          .get(`/data/diagram.${initFiletype}`);
        this.item.xml = data;
        this.item.configJson = {
          root: "",
          items: [],
        };
      }
    },
    async selectVersion(item) {
      this.item.version = item.version;
      await this.getData();
    },
    async save(setting) {
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
        xml = await modeler.getXml();
      } else {
        xml = this.showEditXml?this.item.xml:await modeler.getXML();
      }
      item.xml = xml;
      item.configJson = this.item.configJson;

      if (!item.associations) {
        item.associations = [];
      }
      try {
        if (isUpdate) {
          // 更新
          item.configJson.items.forEach((item) => {
            delete item.confirm;
            item.fold = false;
          });
          await collaborationRequest.putVersionDetail(item.id, {
            name: item.name,
            xml: item.xml,
            nodes: [],
            configJson: item.configJson,
            currentVersionTimestamp: item.updatedTs||item.createdTs,
            forceSave: setting.forceSave
          });
        } else {
          // 创建
          let { id } = await collaborationRequest.postVersionDetail(
            this.$route.params.id,
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
        }catch (e) {
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
              this.$route.params.id,
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
    async rename(name,forceSave) {
      try {
        await collaborationRequest.putVersionDetail(this.historyItem.id, {
          name: name,
          xml: this.historyItem.xml,
          nodes: this.historyItem.nodes,
          configJson: this.historyItem.configJson,
          currentVersionTimestamp: this.historyItem.updatedTs||this.historyItem.createdTs,
          forceSave: forceSave
        });
        await this.getData();
        this.$message({
          message: `${data.name}${this.$t("successRename")}`,
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
      let description =  this.$t("modify");
      switch (payload.type) {
        case "add":
          description = this.$t("add");
          let { id } = await collaborationRequest.postResourceAssociation(
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
          description =  this.$t("modify");
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

    async generateResource() {
      let data = {
        type: this.resource.type.value,
        name: this.generate.name,
        parentNode: 0,
        projectId: this.generate.projectId,
      };
      let modeler = this.isDmn ? this.$refs.vueDmnModeler : this.$refs.bpmnModeler;

      let response = await camundaRequest.createResource(data);
      let xml;
      if (this.isDmn) {
        xml = await modeler.getXml();
      } else {
        xml = this.showEditXml?this.item.xml:await modeler.getXML();
      }
      let key = response.id;
      // let configJson = Object.assign({}, this.item.configJson);

      // configJson.items.forEach((item) => {
      //   delete item.confirm;
      //   item.fold = false;
      // });
      await collaborationRequest.postVersionDetail(key, {
        name: this.$t("originVersion"),
        xml,
        nodes: [],
      });
      this.$message({
        message: `设计文件${this.generate.name}${this.$t("successCreate")}。`,
        type: "success",
        showClose:true
      });
      this.generate.display = false;
      this.generate.name = "";
      this.generate.projectId = "";
    },
    async saveTags() {
      let tag = this.tag.name.trim();
      if (!tag) {
        return;
      }
      if (this.tag.names.find((item) => item === tag)) {
        this.$message.error(`标签“${this.tag.name}“已经存在。`);
        return;
      }

      let tags = this.tag.names.concat(tag).join(",");
      await collaborationRequest.putResourceTags(this.resource.id, tags);
      this.tag.names.push(tag);
      this.tag.name = "";
      this.$message({
        message: `${this.$t("tag")}“${tag}“${this.$t("saveSuccess")}`,
        type: "success",
        showClose:true
      });
    },
    async removeTag(index) {
      let tags = JSON.parse(JSON.stringify(this.tag.names));
      tags.splice(index, 1);

      await collaborationRequest.putResourceTags(this.resource.id, tags.join(","));
      this.$message({
        message: `${this.$t("tag")}“${this.tag.names[index]}“${this.$t("successDelete")}`,
        type: "success",
        showClose:true
      });
      this.tag.names.splice(index, 1);
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
          currentVersionTimestamp: this.item.updatedTs||this.item.createdTs,
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
          }else {
            this.$notify.error(this.$t("saveMsgFail"));
          }
        }catch (e) {
          this.$notify.error(this.$t("saveMsgFail"));
        }
      } finally {
        this.$refs.modelConversation.refreshMsgList();
      }
    },
    copy(value) {
      navigator.clipboard.writeText(value);
      this.$message({
        message: this.$t("copySuccessWithValue",{value:value}),
        type: "success",
        showClose:true
      });
      this.share.display = false;
    },
    togglePassword() {
      this.share.displayPassword = !this.share.displayPassword;
      if (!this.share.displayPassword) {
        this.share.password = "";
        this.savePassword();
      }
    },
    async savePassword() {
      if (!this.share.password) {
        // 移除
        await collaborationRequest.postVersionDetailPasswordRemove(this.item.id);
      } else {
        const hash = btoa(this.share.password);
        this.item.password = hash;
        await collaborationRequest.postVersionDetailPassword(this.item.id, {
          password: hash,
        });
      }
      this.$message({
        message: this.$t("savePwdSuccessWithOpt",{opt:this.$t(this.share.password ? "save" : "remove")}),
        type: "success",
        showClose:true
      });
      this.refreshPasswordStatus();
    },
    refreshPasswordStatus() {
      collaborationRequest
          .getNoAuthVersionDetail(this.item.id)
          .then((result) => {
            this.item.password = false;
          })
          .catch((err) => {
            if (err.response.status === 403) {
              this.item.password = true;
            }
          })
          .finally(() => {
            this.share.password = "";
            this.share.displayPassword = this.item.password;
          });
    },
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
      let reader = new FileReader();
      reader.readAsText(self.importBPMNDialog.file);
      reader.onloadend = async () => {
        let xml = reader.result;
        self.item.xml = xml;
        self.onImportCancel();
      };
    },
  },
};
</script>

<style scoped></style>
