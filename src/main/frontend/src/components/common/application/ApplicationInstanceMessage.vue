<template>
  <div style="height: 100%">
    <div class="d-flex flex-column" style="height: 100%">
      <template v-if="comments.length===0">
        <div class="d-flex flex-row infinite-more-container">
          <div class="infinite-more-container-pre" />
          <div class="infinite-more-container-content">{{ $t('noMessage') }}</div>
          <div class="infinite-more-container-pre" />
        </div>
      </template>
      <div
        v-else
        style="flex: 1;height: 0px;overflow-y: auto"
        :style="mobileMode?{}:{paddingLeft:'15px',paddingRight:'15px'}">
        <div
          class="comment"
          v-for="item in comments"
          :key="item.id"
          :class="{ current: item.userId === userId }"
        >
          <div class="d-flex flex-row">
            <v-icon color="#444262" size="18" style="margin-right: 11px"
            >mdi-face-man
            </v-icon
            >
            <div class="name">
              {{ item.userName }}
            </div>
            <div class="date">
              {{ utils.formatDateTime(item.time, "YYYY-MM-DD HH:mm") }}
            </div>
          </div>
          <div class="comment-text">
            <span class="tag" v-if="item.taskId" @click="selectComment(item)"
            >#{{ item.taskName }}</span
            >
            {{ item.message }}
          </div>
        </div>
      </div>
      <v-sheet v-if="!mobileMode" style="margin-left: 15px;margin-right: 15px;padding-bottom: 5px">
        <div class="send-topic" v-show="comment.item.taskId" style="font-size: 14px">
          #{{ comment.item.taskName }}
        </div>
        <v-textarea
          outlined
          required
          hide-details
          dense
          style="font-size: 14px;background-color: white"
          :placeholder="$t('plsInputMessage')"
          rows="3"
          v-model="comment.item.message"
        />
        <div
          class="d-flex"
          style="flex-direction: row-reverse; margin: 10px;font-size: 14px"
        >
          <v-btn
            :disabled="!comment.item.taskId || !comment.item.message"
            text
            @click="send()"
          >
            <v-icon size="14" color="#0F40F5" style="margin-right:6px">mdi-send</v-icon>
            {{ $t('send') }}
          </v-btn>
        </div>
      </v-sheet>
    </div>
    <v-bottom-sheet v-model="comment.display" inset>
      <v-sheet style="padding: 18px; background-color: #f3f4f9">
        <div class="send-title">{{ $t('sendNewMessage') }}</div>
        <div class="send-topic" v-show="comment.item.taskId">
          #{{ comment.item.taskName }}
        </div>
        <v-textarea
          outlined
          required
          hide-details
          :placeholder="$t('plsInputMessage')"
          rows="3"
          v-model="comment.item.message"
        />
        <div
          class="d-flex"
          style="flex-direction: row-reverse; margin-top: 20px"
        >
          <v-btn
            :disabled="!comment.item.taskId || !comment.item.message"
            color="#0F40F5"
            text
            style="font-size: 14px; font-weight:normal"
            @click="send()"
          >
            <v-icon style="margin-right:6px">mdi-send</v-icon>
            {{ $t('send') }}
          </v-btn>
        </div>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<script>
import utils from "@/utils/utils";
import instanceRequest from "@/api/instance";
import groupRequest from "@/api/group";

export default {
  name: "ApplicationInstanceMessage",
  props: {
    instanceId: {
      type: String,
      required: true
    },
    mobileMode: {
      type: Boolean,
      default: true
    },
    task: {
      type: Object
    }
  },
  data() {
    return {
      utils,
      comments: [],
      comment: {
        item: {},
        display: false
      },
      userId: this.$store.state.user.profile.id
    };
  },
  mounted() {
    this.getComments();
  },
  methods: {
    selectComment(item) {
      this.comment.item.taskId = item.taskId;
      this.comment.item.taskName = item.taskName;
      this.$forceUpdate();
      if (this.mobileMode) {
        this.comment.display = true;
      }
    },
    startSend() {
      this.comment.display = true;
    },
    async send() {
      await instanceRequest.postComment(this.comment.item.taskId, {
        message: this.comment.item.message,
        processInstanceId: this.instanceId
      });
      await this.getComments();
      this.comment.display = false;
      if (this.task) {
        this.comment.item = {
          message: "",
          taskId: this.task.id,
          taskName: this.task.name
        };
      } else {
        this.comment.item = {
          message: ""
        };
      }
    },
    async getComments() {
      if (this.task) {
        this.comment.item.taskId = this.task.id;
        this.comment.item.taskName = this.task.name;
      }
      await this.$store.dispatch("common/setPageLoading", true);
      let comments = await instanceRequest.getComments(this.instanceId);
      let tasks = await instanceRequest.getHistoryJobTasksWithParams(
        {
          maxResults: 1000
        },
        {
          processInstanceId: this.instanceId
        }
      );

      let idIn = comments.map((item) => item.userId).toString();
      const users = idIn.length
        ? await groupRequest.getUser({
          idIn
        })
        : [];
      comments.forEach((item) => {
        let task = tasks.find((task) => task.id === item.taskId);
        if (task) {
          item.taskName = task.name;
        }
        let user = users.find((user) => item.userId === user.id);
        if (user) {
          item.userName = `${user.lastName} ${user.firstName}`;
        }
      });

      this.comments = comments;
      let navigations = this.$store.state.common.navigations;
      if (navigations && navigations.length > 2) {
        navigations[2].count = comments.length;
        await this.$store.dispatch("common/setNavigations", navigations);
      }
      await this.$store.dispatch("common/setPageLoading", false);
    }
  },
  watch: {
    task: {
      async handler() {
        if (this.task) {
          this.comment.item.taskId = this.task.id;
          this.comment.item.taskName = this.task.name;
        }
      },
      immediate: true
    }
  }
};
</script>

<style scoped>
.v-list--dense.menu-list .v-list-item .v-list-item__title.current {
  font-weight: bold;
}

.v-list--dense.menu-list .v-list-item {
  height: 50px;
}

.v-list--dense.menu-list .v-list-item:not(:last-child) {
  border-bottom: 1px solid #e6e4e6;
}

.v-list--dense.menu-list .v-list-item .v-list-item__title {
  color: #444262;
  font-size: 14px;
}

.v-list--dense.menu-list .v-list-item .v-list-item__title .v-icon {
  margin-right: 5px;
}

.send-title {
  color: rgba(68, 66, 98, 1);
  font-size: 18px;
}

.send-topic {
  margin: 8px 0 0 0;
  color: rgb(15, 64, 245);
  font-size: 14px;
}

div.theme--light.v-input.v-textarea.v-textarea.v-text-field--enclosed.v-text-field--outlined {
  /* border: 1px solid#E6E4E6; */
  background-color: #f3f4f9;
  margin: 14px 0 0 0;
  padding: 0;
}

.comment .name {
  font-size: 14px;
  color: #312651;
  margin-right: 17px;
}

.comment .date {
  color: #83829a;
  font-size: 14px;
}

.comment .comment-text {
  margin: 8px 28px 17px 28px;
  color: #312651;
  font-size: 14px;
  background-color: #f3f4f9;
  border-radius: 6px;
  background-color: rgba(243, 244, 249, 1);
  padding: 10px 15px;
}

/deep/ .comment .comment-text .tag {
  color: #0f40f5;
  font-size: 14px;
  cursor: pointer;
}

.comment.current .comment-text {
  color: #ffffff;
  background-color: #101010;
}

/deep/ .comment.current .comment-text .tag {
  color: #fcca00;
}

/deep/
div.v-textarea.v-text-field--enclosed.v-text-field--outlined:not(
    .v-input--dense
  )
.v-text-field__slot
textarea {
  margin-top: 0;
}

/deep/ .v-text-field--outlined fieldset {
  border-color: #e6e4e6;
}
</style>
