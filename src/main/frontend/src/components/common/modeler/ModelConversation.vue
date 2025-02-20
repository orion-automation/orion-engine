<template>
  <div class="box" style="flex: 1">
    <div class="box-header">
      <div class="box-icon">
        <v-icon>mdi-comment-quote-outline</v-icon>
      </div>
      <div class="box-title">
        <span>{{ $t('collaborativeMsg') }}</span>
      </div>
    </div>
    <div style="flex: 1; margin: 10px 0px">
      <div
        class="nav-item"
        :class="{
          current:
            conversation.createdAt === message.createdAt ||
            (deleteDialog.message &&
              deleteDialog.message.createdAt === conversation.createdAt),
        }"
        v-for="conversation in conversations"
        :key="conversation.id"
      >
        <div class="name">
          <span>{{
            conversation.createdBy
          }}</span>
        </div>
        <div class="content">
          <div class="main">{{ conversation.message }}</div>
          <div class="sub">{{ conversation.updatedBy }}</div>
          <div class="tip">
            {{ utils.formatDateTime(Number(conversation.updatedTs ?? conversation.createdTs)) }}
          </div>
        </div>
        <v-menu>
          <template #activator="{ on, attrs }">
            <v-icon
              class="more"
              v-show="conversation.createdBy === userId"
              size="15"
              color="#83829A"
              v-bind="attrs"
              v-on="on"
            >
              mdi-dots-vertical
            </v-icon>
          </template>

          <v-list style="cursor: pointer" dense>
            <v-list-item key="edit">
              <v-list-item-title @click="edit(conversation)">
                <span style="font-size:14px;">{{ $t('edit') }}</span>
              </v-list-item-title>
            </v-list-item>
            <v-list-item key="delete">
              <v-list-item-title @click="startRemove(conversation)">
                <span style="font-size:14px;">{{ $t('delete') }}</span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
    <div class="nav-input">
      <input
        :disabled="!node.id"
        :placeholder="$t('enterMsg')"
        v-model="message.message"
        @keydown.enter="save()"
      >
      <v-icon @click="save()"> mdi-send</v-icon>
    </div>
    <v-dialog v-model="deleteDialog.display" max-width="300">
      <v-card>
        <v-card-title class="headline" style="color: #444262">
          {{ $t('deleteMsg') }}
        </v-card-title>
        <v-card-text>{{ $t('deleteMsgConfirm') }}</v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer />
          <v-btn text @click="cancelRemove()"> {{ $t('cancel') }}</v-btn>
          <v-btn style="color: #ffffff" color="#FF7754" @click="remove()">
            <v-icon size="16" color="#ffffff" style="margin-right: 6px">
              mdi-delete-forever
            </v-icon>
            {{ $t('delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import utils from "@/utils/utils";
import collaborationRequest from "@/api/collaboration";

export default {
  name: "ModelConversation",
  components: {},
  props: {
    node: {
      type: Object,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      utils: utils,
      message: {
        message: "",
      },
      deleteDialog: {
        display: false,
        message: null,
      },
      conversations: []
    };
  },
  watch: {
    node: {
      handler() {
        this.refreshMsgList();
      },
    },
  },
  computed: {},

  mounted() {
  },
  methods: {
    save() {
      if (!this.message.message) {
        return;
      }
      let isNew = !this.message.id;

      if (isNew) {
        let message = {
          activityId: this.node.id,
          message: this.message.message
        };
        this.conversations.push(message);
        this.$emit("save", {
          type: "create",
          data: message
        });
      } else {
        let item = this.conversations.find(
            (conversation) => conversation.id === this.message.id
        );
        let index = this.conversations.indexOf(item);
        item.message = this.message.message;
        this.conversations.splice(index, 1, item);
        this.$emit("save", {
          type: "save",
          data: item
        });
      }
      this.message = {
        message: "",
      };
    },
    edit(item) {
      this.message = JSON.parse(JSON.stringify(item));
    },
    startRemove(item) {
      this.deleteDialog.message = item;
      this.deleteDialog.display = true;
    },
    cancelRemove() {
      this.deleteDialog.message = null;
      this.deleteDialog.display = false;
    },
    remove() {
      var index = this.conversations.indexOf(this.deleteDialog.message);
      this.conversations.splice(index, 1);
      this.$emit("save", {
        type: "delete",
        data: this.deleteDialog.message.id
      });
      this.deleteDialog.message = null;
      this.deleteDialog.display = false;
    },
    async refreshMsgList() {
      // 获取协同消息
      if (this.item && this.item.id) {
        this.conversations = await collaborationRequest.getVersionMessageList(this.item.id, {activityId: this.node.id});
      }
    }
  },
};
</script>

<style scoped>
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
  border: 1px solid #E6E4E6;
}

/deep/
.box
div.v-textarea.v-text-field--enclosed.v-text-field--outlined:not(
    .v-input--dense
  )
.v-text-field__slot
textarea {
  margin-top: 0;
}

.box .nav-item {
  display: flex;
  padding: 0 20px;
}

.box .nav-item:hover {
  background-color: rgba(243, 244, 249);
}

.box .nav-item.current {
  background-color: rgba(243, 244, 249);
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

.box
.nav-input
div.v-input.theme--light.v-text-field.v-text-field--placeholder {
  margin: 0;
  padding: 0;
}

.box .nav-input input {
  flex: 1;
  height: 30px;
  border: 1px solid #E6E4E6;
  padding: 5px;
}

/deep/
.box
.nav-input
div.v-input.theme--light.v-text-field.v-text-field--placeholder
input {
  padding: 0;
}

.box .nav-input button.v-icon {
  color: #312651;
  font-size: 20px;
  margin-left: 10px;
  cursor: pointer;
}
</style>
