<template>
  <div class="d-flex flex-column" style="width: 100%; height: 100%;border-top: 1px solid rgb(187, 187, 187)">
    <div
      class="d-flex flex-row"
      style="
        width: 100%;
        padding: 14px 15px;
        font-size: 13px;
        color: #312651;
        align-items: center;
        justify-items: center;
      "
    >
      <v-breadcrumbs
        class="id-breadcrumbs" :items="idBreadcrumbs"
        style="background-color: #e8eff7;padding: 0;border: none" divider="|" />
      <span class="badge badge-instance"> <v-icon size="15" left color="white">mdi-check-network-outline</v-icon>{{
          badge.playCount
        }}</span>
      <span class="badge badge-incident"> <v-icon size="15" left color="white">mdi-bell-alert-outline</v-icon>{{
          badge.afterCount
        }}</span>
      <span class="badge badge-group"> <v-icon size="15" left color="white">mdi-account-multiple-outline</v-icon>{{
          badge.groupCount
        }}</span>
    </div>
    <div class="d-flex flex-row" style="width: 100%; height: 0; flex: 1">
      <v-navigation-drawer v-model="drawerOpen" :width="drawerOpen ? 350 : 0" mobile-breakpoint="0">
        <div class="d-flex flex-column" style="height: 100%;width: 100%">
          <div
            class="d-flex flex-row custom-drawer-item"
            style="justify-content: space-between;padding: 0 25px;height: 43px">
            <v-btn
              icon
              @click="searchDialog.display=true"
              style="border-right: none"
            >
              <v-badge bordered dot overlap color="#FF7754"
                       :value="tasks.nameLike||searchDialog.taskId||searchDialog.processDefinitionKeyIn">
                <v-icon size="20">mdi-card-search-outline</v-icon>
              </v-badge>
            </v-btn>
            <v-menu bottom offset-y>
              <template #activator="{ on, attrs }">
                <v-badge bordered dot
                         :value="taskOwnerFilter!=='mine'"
                         overlap color="#FF7754">
                  <v-icon size="20"
                          v-bind="attrs"
                          v-on="on">mdi-account-multiple-outline
                  </v-icon>
                </v-badge>
              </template>

              <v-list
                style="cursor: pointer; padding: 0px 0px"
                class="menu-list"
                dense
              >
                <v-list-item
                  v-for="item in taskOwnerFilters"
                  :key="item.id">
                  <v-list-item-title
                    :class="{ current: taskOwnerFilter===item.id,disabled:item.disable}"
                    @click="onOwnerFilterItemClick(item)"
                  >
                    <v-icon size="14" style="margin-right: 6px">{{ item.icon }}</v-icon>
                    <span>{{ item.name }}</span>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-menu bottom offset-y>
              <template #activator="{ on, attrs }">
                <v-badge bordered dot
                         :value="taskPriorityFilter!=='all'"
                         overlap color="#FF7754">
                  <v-icon size="20"
                          v-bind="attrs"
                          v-on="on">mdi-flag-outline
                  </v-icon>
                </v-badge>
              </template>

              <v-list
                style="cursor: pointer; padding: 0px 0px"
                class="menu-list"
                dense
              >
                <v-list-item
                  v-for="item in taskPriorityFilters"
                  :key="item.id">
                  <v-list-item-title
                    :class="{ current: taskPriorityFilter===item.id,disabled:item.disable}"
                    @click="taskPriorityFilter=item.id"
                  >
                    <v-icon size="14" style="margin-right: 6px" :color="item.color">{{ item.icon }}</v-icon>
                    <span>{{ item.name }}</span>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-menu bottom offset-y>
              <template #activator="{ on, attrs }">
                <v-badge bordered dot
                         :value="taskDueFilter!=='all'"
                         overlap color="#FF7754">
                  <v-icon size="20"
                          v-bind="attrs"
                          v-on="on">mdi-alarm-multiple
                  </v-icon>
                </v-badge>
              </template>

              <v-list
                style="cursor: pointer; padding: 0px 0px"
                class="menu-list"
                dense
              >
                <v-list-item
                  v-for="item in taskDueFilters"
                  :key="item.id">
                  <v-list-item-title
                    :class="{ current: taskDueFilter===item.id,disabled:item.disable}"
                    @click="taskDueFilter=item.id"
                  >
                    <v-icon size="14" style="margin-right: 6px" :color="item.color">{{ item.icon }}</v-icon>
                    <span>{{ item.name }}</span>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <task-sort-menu
              :quick-filter="quickFilter"
              :tasks-active="tasks.active"
              :tasks-sort-order="tasks.sortOrder"
              :mobile-mode="false"
              @setSort="setSort"
              @setActive="setActive"
            />
          </div>
          <div style="flex:1;height: 0;overflow-y: auto">
            <template v-if="!calendar.display">
              <v-list
                three-line
                style="padding: 0 0; border-radius: 6px"
                v-if="!calendar.display"
              >
                <task-item
                  v-for="item in tasks.items"
                  :key="item.id"
                  :selected="task&&task.id===item.id"
                  @onItemClick="onTaskItemClick"
                  :task="item" />
              </v-list>
              <infinite-loading
                v-if="!calendar.display"
                @infinite="getTasksPage"
                :identifier="tasks.infiniteId"
              >
                <template #no-more>
                  <div class="d-flex flex-row infinite-more-container">
                    <div class="infinite-more-container-pre" />
                    <div class="infinite-more-container-content">{{ $t("noMoreTask") }}</div>
                    <div class="infinite-more-container-pre" />
                  </div>
                </template>
              </infinite-loading>
            </template>
            <template v-else>
              <v-list
                three-line
                style="padding: 0 0; border-radius: 6px"
                v-if="calendar.display"
              >
                <task-item
                  v-for="item in calendar.rangeItems"
                  :key="item.id"
                  :selected="task&&task.id===item.id"
                  @onItemClick="onTaskItemClick"
                  :task="item" />
                <v-list-item
                  v-show="!calendar.rangeItems.length"
                  style="min-height: unset; padding: 10px 18px"
                >
                  {{ $t("noData") }}
                </v-list-item>
              </v-list>
            </template>
          </div>
          <div class="d-flex flex-column" style="padding: 0">
            <task-calendar
              v-show="calendar.display"
              :items="calendar.items"
              @setRange="setRange"
            />
            <div
              style="border-top: 1px solid rgba(187, 187, 187, 1);
              width: 100%;
              height: 43px;
              align-items: center;justify-content: center"
              @click="calendar.display=!calendar.display"
              class="d-flex flex-row">
              <v-btn text style="font-weight:normal; color:#444262">

                <v-icon left>mdi-calendar-multiselect</v-icon>
                {{ $t("calendar") }}
                <v-icon right color="#FF7754">{{ calendar.display ? "mdi-menu-down" : "mdi-menu-up" }}
                </v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </v-navigation-drawer>
      <div
        class="d-flex flex-column"
        style="width: 0; flex: 1; height: 100%; background-color: white"
        ref="resizeLayoutBottom"
      >
        <div
          class="d-flex flex-row custom-drawer-item"
          style="
            padding-top: 0;
            padding-bottom: 0;
            padding-right: 0;
            padding-left: 9px;
            height: 43px;
          "
        >
          <v-icon color="#FF7754" @click="drawerOpen = !drawerOpen" style="margin-right:6px"
          >{{ drawerOpen ? "mdi-chevron-left" : "mdi-chevron-right" }}
          </v-icon>
          <div v-if="task.id" class="detail-name">
            {{ task.name || $t("noTopic") }}
          </div>
          <v-spacer />
          <v-divider vertical />
          <v-btn
            text
            style="border-right: none; font-weight:normal; color:#444262"
            :disabled="!formData"
            v-print="printObj"
            color="#444262"
          >
            <v-icon left small color="#FA4F07">mdi-printer-outline</v-icon>
            打印
          </v-btn>
          <v-divider vertical />
          <v-btn
            text
            style="border-right: none; font-weight:normal; color:#444262"
            :disabled="this.task.endTime || this.computedIsDelegatedTask"
            @click="setFollowUp"
            color="#444262"
          >
            <v-icon left small color="#FA4F07">mdi-alarm-plus</v-icon>
            {{ $t("setNotify") }}
          </v-btn>
          <v-divider vertical />
          <template v-if="!task.endTime">
            <v-btn
              text
              style="border-right: none; font-weight:normal; color:#444262"
              @click="onSetPriorityClick"
              color="#444262"
            >
              <v-icon left small :color="judgePriority(task.priority).iconColor">{{ judgePriority(task.priority).icon }}
              </v-icon>
              {{ $t("priority") }}
            </v-btn>
            <v-divider vertical />
          </template>
          <v-btn
            text
            v-if="!task.endTime &&
        !(computedIsDelegatedTask && task.assignee!==userId) &&
        task.assignee === userId"
            style="border-right: none; font-weight:normal; color:#444262"
            color="#444262"
            @click="onCommitTask"
          >
            <v-icon left small color="#0F40F5">mdi-send</v-icon>
            {{ $t("execute") }}
          </v-btn>
          <v-btn
            text
            v-if="!task.endTime && !task.assignee"
            @click="onClaimClick"
            style="border-right: none; font-weight:normal; color:#444262"
            color="#444262"
          >
            <v-icon left small color="#0F40F5">mdi-tray-arrow-down</v-icon>
            {{ $t("claim") }}
          </v-btn>
          <v-divider vertical />
          <v-btn
            text
            style="border-right: none; font-weight:normal; color:#444262"
            :disabled="this.task.endTime || this.computedIsDelegatedTask"
            @click="onTaskDelegtateClick"
            color="#444262"
          >
            <v-icon left small color="#0F40F5">mdi-share-all</v-icon>
            {{ $t("delegate1") }}
          </v-btn>
          <v-divider vertical />
          <v-menu bottom offset-y z-index="100">
            <template #activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                icon
                style="border-right: none"
                color="#83829A"
              >
                <v-icon small>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>

            <v-list
              style="cursor: pointer; padding: 0px 0px"
              class="menu-list"
              dense
            >
              <v-list-item
                style="min-height: 36px"
              >
                <v-list-item-title>
                  {{ $t("noMoreTools") }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <div
          class="d-flex flex-column"
          style="flex: 1;height: 0;background-color: white;padding: 15px;overflow-y: auto">
          <instance-milestone :instance="instance" style="margin-bottom: 10px" />
          <div
            @click="onClickProcessInstance(instance.processDefinitionId,instance.processDefinitionKey,instance.id)"
            class="d-flex flex-row" style="align-items: center;font-size: 14px;cursor:pointer;">
            <i
              :class="instance.icon"
              style="size: 1em; color: #e6e4e6;font-size: 15px;margin-right: 3px"
              :style="{color:instance.iconColor}"
            ></i>
            <div style="color: #444262">#{{ instance.businessKey }}</div>
            <div
              @click.stop="onClickProcessDefKey(instance.processDefinitionKey)"
              style="color: #B1ABB6;padding-left: 5px;overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;">
              {{ instance.processDefinitionName }}
            </div>
          </div>
          <div
            class="d-flex"
            style="padding: 5px 0; border-bottom: 1px solid #e6e4e6;font-size: 14px"
          >
            <div style="flex: 1">
              <v-icon size="15" style="margin-right: 3px">mdi-plus</v-icon>
              <span style="color: #444262">
              {{ utils.formatDateTime(instance.startTime, "YYYY-MM-DD HH:mm") }}
            </span>
            </div>
            <div style="flex: 1">
              <v-icon style="margin-right: 3px" size="15">mdi-account-check</v-icon>
              <span
                style="color: #444262"> {{ instance.startUserId && instance.startUser ? `${instance.startUser.firstName} ${instance.startUser.lastName}` : "--"
                }}</span>
            </div>
          </div>
          <div class="d-flex flex-column" v-if="computedIsDelegatedTask" style="margin-top: 10px">
            <div class="d-flex flex-row" style="align-items: center;color: #444262;font-size: 12px">
              <v-icon small style="margin-right: 10px">mdi-account-arrow-right</v-icon>
              <template v-if="task.owner === userId">
              <span>
                {{
                  $t("hasDelegateToWithType", { delegateType: $t(localVariables["bpezDelegateType"] === "0" ? "normal" : "auth") })
                }}
                <b style="font-weight: bold">{{ `${task.assigneeName || task.assignee}` }}</b>
              </span>
              </template>
              <template v-else>
              <span>
                {{ $t("by") }}<b style="font-weight: bold">{{ `${task.ownerName || task.owner}`
                }}</b>{{
                  $t("delegateToMeWithType", { delegateType: $t(localVariables["bpezDelegateType"] === "0" ? "normal" : "auth") })
                }}
              </span>
              </template>
              <v-spacer />
              <v-menu bottom offset-y v-if="task.owner === userId" left>
                <template #activator="{ on, attrs }">
                  <v-icon
                    v-bind="attrs"
                    v-on="on"
                    size="18"
                    color="#444262"
                    style="flex: 0; margin-right:6px"
                  >
                    mdi-dots-vertical
                  </v-icon>
                </template>

                <v-list
                  style="cursor: pointer; padding: 0px 0px"
                  class="menu-list"
                  dense
                >
                  <v-list-item>
                    <v-list-item-title
                      @click="onTaskResolveDelegtateClick"
                    >
                      <span>{{ $t("backAuth") }}</span>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
            <v-textarea
              hide-details auto-grow dense
              rows="1"
              style="margin-top: 14px; margin-bottom:8px;font-size: 14px"
              outlined
              v-model="localVariables['bpezDelegateComments']"
              readonly />
          </div>
          <div class="d-flex flex-row" style="padding: 5px 0;;font-size: 14px">
            <div style="flex: 1;align-items: center" class="d-flex flex-row">
              <div style="flex:1">
                <v-icon color="#0F40F5" style="margin-right: 3px" size="15"
                >mdi-tray-arrow-down
                </v-icon
                >
                <span style="color: #444262">
              {{
                    utils.formatDateTime(
                      task.created || task.startTime,
                      "YYYY-MM-DD HH:mm"
                    ) || "--:--"
                  }}</span
                ></div>
              <div style="flex: 1">
                <v-icon color="#312651" style="margin-right: 3px" size="15"
                >mdi-stop
                </v-icon
                >
                <span style="color: #444262">
              {{
                    utils.formatDateTime(task.endTime, "YYYY-MM-DD HH:mm") || "--:--"
                  }}</span></div>
            </div>

            <div style="flex: 1;align-items: center" class="d-flex flex-row">
              <div style="flex:1">
                <v-icon color="#FF7754" style="margin-right: 3px" size="15"
                >mdi-alarm
                </v-icon
                >
                <span style="color: #444262">
              {{ utils.formatDateTime(task.due, "YYYY-MM-DD HH:mm") || "--:--" }}
            </span>
              </div>
              <div style="flex:1">
                <v-icon color="#57928D" style="margin-right: 3px" size="15"
                >mdi-calendar-multiselect
                </v-icon
                >
                <span style="color: #444262">
              {{
                    utils.formatDateTime(task.followUp, "YYYY-MM-DD HH:mm") || "--:--"
                  }}</span>
              </div>
            </div>
          </div>
          <div class="formioClass"
               style="flex: 1;height: 0;background-color: white;border-radius: 6px;margin-top: 12px">
            <formio
              v-if="formData"
              style="height: 100%"
              ref="formTask"
              class="formioClass"
              id="formTaskDetail"
              :form="formData"
              :options="{readOnly:!!task.endTime || (!task.endTime && !task.assignee), language: 'zh',noAlerts:true}"
              :submission="formValue"></formio>
            <div
              v-else
              class="d-flex flex-row"
              style="height: 100%;align-items: center;justify-content: center;color: #101010;font-size: 14px;min-height: 50px">
              {{ $t("noFormConfig") }}
              <v-icon color="#83829A" right size="14">mdi-google-downasaur</v-icon>
            </div>
          </div>
        </div>
        <div
          class="d-flex flex-row custom-drawer-item"
          style="
            padding-top: 0;
            padding-bottom: 0;
            padding-right: 0;
            height: 43px;
          "
        >
          <v-spacer />
          <v-divider vertical />
          <v-btn
            text
            style="border-right: none;  font-weight:normal; color:#444262"
            color="#444262"
            @click="onStartAssociationsClick"
          >
            <v-icon left small color="#FA4F07">mdi-all-inclusive-box</v-icon>
            {{ $t("linkApp") }}
          </v-btn>
          <v-divider vertical />
          <v-btn
            text
            style="border-right: none;  font-weight:normal; color:#444262"
            color="#444262"
            @click="bpmnDialog.display=true"
          >
            <v-icon left small color="#57928D">mdi-map-legend</v-icon>
            {{ $t("bpmnView") }}
          </v-btn>
        </div>
      </div>
      <task-detail-sider
        v-if="task && task.id"
        :instance="instance"
        @onRejectTask="onRejectTask"
        @selectTask="onSimilarTaskItemClick"
        :task="task" />
    </div>
    <task-priority-set-menu
      ref="taskPrioritySetMenuRef"
      @onSetPrioritySuccess="onSetPrioritySuccess"
      v-if="task && task.id"
      :task-id="task.id" />
    <application-associations
      v-if="process.id"
      ref="associationsDialogRef"
      :title="$t('startLinKApp')"
      :current-app="process"
      @onItemClick="onAssociationItemClick"
      :process-deployment-id="process.deploymentId"
      :process-def-key="process.key" />
    <task-delegtate-dialog
      ref="taskDelegtateDialogRef"
      @onTaskDelegtateSuccess="onTaskDelegtateSuccess"
      :task-id="task.id"
      v-if="task && task.id" />
    <task-resolve-delegtate-dialog
      ref="taskResolveDelegtateDialogRef"
      @onResolveDelegtateTaskSuccess="onTaskDelegtateSuccess"
      :task-id="task.id"
      v-if="task && task.id" />
    <task-claim-dialog
      ref="taskClaimDialogDialogRef"
      @onClaimSuccess="onTaskClaimSuccess"
      :task-id="task.id"
      v-if="task && task.id" />
    <flow-calendar-dialog ref="flowCalendarDialogRef" @onFollowSuccess="onFollowSuccess" />
    <v-dialog v-model="searchDialog.display" width="431">
      <v-card>
        <v-card-title style="color:#312651">{{ $t("search") }}</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="tasks.nameLike"
            label=""
            :placeholder="$t('inputKeySearchTask')"
          />
          <v-text-field
            v-model="searchDialog.taskId"
            label=""
            :placeholder="$t('taskId')"
          />
          <v-text-field
            v-model="searchDialog.processDefinitionKeyIn"
            label=""
            :placeholder="$t('processDefinitionKeyIn')"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="resetSearch" style="font-weight:normal; color:#312651">
            <v-icon left style="color:#83829A">mdi-redo</v-icon>
            {{ $t("reset") }}
          </v-btn>
          <v-btn text @click="refreshTasks" style="font-weight:normal; color:#312651">
            <v-icon left style="color:#83829A">mdi-magnify</v-icon>
            {{ $t("search") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="bpmnDialog.display">
      <v-card>
        <v-card-text style="padding: 0">
          <vue-bpmn
            ref="vueBpmnViwer"
            :node-properties="bpmnDialog.nodeProperties"
            :diagram-xml="bpmnDialog.xml"
            style="height: 70vh"
            background-color="#FFFFFF"
            :options="{ overlays: { defaults: { scale: true } } }" />
        </v-card-text>
        <v-card-actions style="padding: 0">
          <v-spacer />
          <v-btn text @click="bpmnDialog.display=false">{{ $t("close") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="noTaskDialog.display" width="431" persistent>
      <v-card>
        <v-card-text style="padding-top: 15px">
          {{ $t('noTaskNotify') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="goIndex" style="font-weight:normal; color:#312651">
            {{ $t("backToHome") }}
          </v-btn>
          <v-btn text @click="goTaskList"
                 v-if="hasSearch"
                 style="font-weight:normal; color:#312651">
            {{ $t("backToTaskList") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import TaskListCommon from "@/components/common/task/mixins/list";
import TaskDetailCommon from "@/components/common/task/mixins/detail";
import TaskDetailSider from "@/components/task/task/DetailSider";
import FlowCalendarDialog from "@/components/common/task/FlowCalendarDialog";
import utils from "@/utils/utils";
import taskRequest from "@/api/task";
import VueBpmn from "@/components/common/BPMN";
import processRequest from "@/api/process";
import InstanceMilestone from "@/components/common/InstanceMilestone";

export default {
  mixins: [TaskListCommon, TaskDetailCommon],
  name: "UserList",
  data() {
    return {
      printObj: {
        id: "formTaskDetail",
        popTitle: "",
        extraCss: `${process.env.VUE_APP_ROOT_BASE_API}css/print.css`,
        preview: true,
        extraHead: "<meta http-equiv=\"Content-Language\" content=\"zh-cn\"/>"
      },
      searchDialog: {
        display: false,
        taskId: "",
        processDefinitionKeyIn: ""
      },
      idBreadcrumbs: [
        {
          text: this.$t("task"),
          disabled: true,
          href: "#/task/application/list"
        },
        {
          text: "",
          disabled: true
        }
      ],
      drawerOpen: true,
      taskOwnerFilter: "mine",
      taskOwnerFilters: [
        { id: "mine", name: this.$t("mine"), icon: "mdi-playlist-check", disable: false },
        { id: "group", name: this.$t("groupTasks"), icon: "mdi-account-multiple-outline", disable: false },
        { id: "out", name: this.$t("delegateToOthers"), icon: "mdi-account-arrow-right", disable: false },
        { id: "in", name: this.$t("delegateFromOthers"), icon: "mdi-account-arrow-left-outline", disable: false }
      ],
      taskPriorityFilter: "all",
      taskPriorityFilters: [
        { id: "high", name: this.$t("top"), icon: "mdi-flag", color: "#e91e63", disable: false },
        { id: "medium", name: this.$t("medium"), icon: "mdi-flag-outline", color: "#ff9800", disable: false },
        { id: "low", name: this.$t("low"), icon: "mdi-flag-outline", color: "#009688", disable: false },
        { id: "top", name: this.$t("makeTop"), icon: "mdi-folder-heart-outline", color: "#673ab7", disable: false },
        { id: "all", name: this.$t("all"), icon: "mdi-notification-clear-all", color: "#83829A", disable: false }
      ],
      taskDueFilter: "all",
      taskDueFilters: [
        { id: "before", name: this.$t("dueTasks"), icon: "mdi-clock-alert", color: "#FA4F07", disable: false },
        { id: "after", name: this.$t("notDueTasks"), icon: "mdi-alarm", color: "#57928D", disable: false },
        { id: "all", name: this.$t("allItems"), icon: "mdi-notification-clear-all", color: "#83829A", disable: false }
      ],
      badge: {
        playCount: 0,
        afterCount: 0,
        groupCount: 0
      },
      bpmnDialog: {
        display: false,
        nodeProperties: {},
        xml: ""
      },
      pcCommitSuccess: false, // 记录是否是pc端成功提交任务，列表刷新后判断是否弹窗提醒空列表
      noTaskDialog:{
        display: false,
      }
    };
  },
  async mounted() {
    let self = this;
    if (self.$route.query.defaultSearchTaskId) {
      self.searchDialog.taskId = self.$route.query.defaultSearchTaskId;
    }
    if (self.$route.query.defaultPriorityFilter) {
      self.taskPriorityFilter = self.$route.query.defaultPriorityFilter;
    }
    if (self.$route.query.defaultDueFilter) {
      self.taskDueFilter = self.$route.query.defaultDueFilter;
    }
    if (this.$route.query.defaultSearchProcessDefinitionKeyIn) {
      this.searchDialog.processDefinitionKeyIn = this.$route.query.defaultSearchProcessDefinitionKeyIn;
    }
    self.autoSelect = true;
    let countResult;
    countResult = await taskRequest.postTaskCount("", null, { assignee: self.userId });
    self.badge.playCount = countResult.count;
    countResult = await taskRequest.postTaskCount("", null,
      {
        assignee: self.userId, dueBefore: utils.formatDateTime(
          new Date(),
          "YYYY-MM-DDT24:00:00.SSS+0800"
        )
      });
    self.badge.afterCount = countResult.count;
    countResult = await taskRequest.postTaskCount("", null, {
      candidateUser: self.userId
    });
    self.badge.groupCount = countResult.count;
  },
  methods: {
    goTaskList(){
      this.resetSearch();
      this.noTaskDialog.display=false;
      this.task = {};
      this.refreshTasks();
    },
    goIndex() {
      this.noTaskDialog.display=false;
      this.$router.replace("/home/index");
    },
    onRejectTask() {
      let self = this;
      self.task = {};
      self.refreshTasks();
    },
    onFollowSuccess() {
      let self = this;
      self.onTaskItemClick(self.task);
    },
    onSimilarTaskItemClick(task) {
      let self = this;
      // 根据id搜索
      self.searchDialog.taskId = task.id;
      self.task = {};
      self.refreshTasks();
    },
    onClickProcessDefKey(key) {
      if (this.instance.currentUserStart) {
        this.$router.push({
          name: "task-application-list",
          query: { defaultSearchKey: key }
        });
      } else {
        this.$notify.error(this.$t("noAuthViewProcessApp"));
      }
    },
    onClickProcessInstance(processDefId, processDefKey, instanceId) {
      if (this.instance.currentUserCreate) {
        this.$router.push({
          name: "task-application-detail",
          params: { id: processDefId },
          query: { defaultSearchInstanceId: instanceId, key: processDefKey }
        });
      } else {
        this.$notify.error(this.$t("noAuthViewProcess"));
      }
    },
    onOwnerFilterItemClick(item) {
      let self = this;
      // 查询已完成任务时，只有我的能点击
      if (item.id !== "mine" && !self.tasks.active) {
        return;
      }
      self.taskOwnerFilter = item.id;
    },
    getFilter() {
      // pc端filter
      let self = this;
      let data = {};
      if (self.taskOwnerFilter) {
        switch (self.taskOwnerFilter) {
          case "mine":
            if (self.tasks.active) {
              data.assignee = self.userId;
            } else {
              data.taskAssignee = self.userId;
            }
            break;
          case "group":
            if (self.tasks.active) {
              data.candidateUser = self.userId;
            }
            break;
          case "in":
            if (self.tasks.active) {
              data.delegationState = "PENDING";
              data.assignee = self.userId;
            } else {
              data.taskAssignee = self.userId;
              // 手动筛选owner不是自己的任务
            }
            break;
          case "out":
            if (self.tasks.active) {
              data.delegationState = "PENDING";
              data.owner = self.userId;
              data.assigneeNotIn = [self.userId];
            } else {
              data.taskOwner = self.userId;
            }
            break;
        }
      }
      if (self.taskPriorityFilter) {
        switch (self.taskPriorityFilter) {
          case "high":
            if (self.tasks.active) {
              // data.maxPriority = 98;
              // data.minPriority = 61;
              data.priority = 90;
            } else {
              data.taskPriority = 90;
            }
            break;
          case "medium":
            if (self.tasks.active) {
              // data.maxPriority = 60;
              // data.minPriority = 31;
              data.priority = 60;
            } else {
              data.taskPriority = 60;
            }
            break;
          case "low":
            if (self.tasks.active) {
              // data.maxPriority = 30;
              data.priority = 30;
            } else {
              data.taskPriority = 30;
            }
            break;
          case "top":
            if (self.tasks.active) {
              data.priority = 99;
            } else {
              data.taskPriority = 99;
            }
            break;
          case "all":
            break;
        }
      }
      if (self.taskDueFilter) {
        let currentTime = utils.formatDateTime(
          new Date(),
          "YYYY-MM-DDT24:00:00.SSS+0800"
        );
        switch (self.taskDueFilter) {
          case "before":
            if (self.tasks.active) {
              data.dueBefore = currentTime;
            } else {
              data.taskDueDateBefore = currentTime;
            }
            break;
          case "after":
            if (self.tasks.active) {
              data.dueAfter = currentTime;
            } else {
              data.taskDueDateAfter = currentTime;
            }
            break;
          case "all":
            break;
        }
      }
      if (self.tasks.nameLike) {
        if (self.tasks.active) {
          data.nameLike = `%${self.tasks.nameLike}%`;
        } else {
          data.taskNameLike = `%${self.tasks.nameLike}%`;
        }
      }
      if (self.searchDialog.taskId) {
        data = {
          taskId: self.searchDialog.taskId
        };
        // data.taskId = self.searchDialog.taskId;
      }
      if (!this.tasks.active) {
        data.finished = true;
      } else {
        data.nameNotLike = "Complete a Question";
      }
      if (self.searchDialog.taskId) {
        data = {
          taskId: self.searchDialog.taskId
        };
        // data.taskId = self.searchDialog.taskId;
      }
      if (self.searchDialog.processDefinitionKeyIn) {
        data.processDefinitionKeyIn = self.searchDialog.processDefinitionKeyIn.split(",");
      }
      return data;
    },
    resetSearch() {
      this.tasks.nameLike = "";
      this.searchDialog.taskId = "";
      this.searchDialog.processDefinitionKeyIn = "";
    },
    async onSetPrioritySuccess(priority) {
      let self = this;
      self.task.priority = priority;
    },
    async setFollowUp() {
      // 设置提醒
      let self = this;
      let flowCalendarDialogRef = self.$refs.flowCalendarDialogRef;
      if (flowCalendarDialogRef) {
        flowCalendarDialogRef.show(true, "userTask", {
          originalTaskId: self.task.id,
          originalProcessInstanceId: self.instance.id
        });
      }
    },
    async onTaskItemClick(item) {
      let self = this;
      self.task = item;
      await self.getTask();
      self.printObj.popTitle = this.instance.businessKey;
      await self.getForm();
    },
    async onTaskClaimSuccess() {
      let self = this;
      await self.getTask();
      await self.getForm();
    },
    async onTaskDelegtateSuccess() {
      let self = this;
      if (self.drawerOpen) {
        self.task = {};
        self.pcCommitSuccess = true;
        await self.refreshTasks();
      } else {
        await self.getTask();
        await self.getForm();
      }
    }
  },
  watch: {
    "$i18n.locale": {
      handler(val) {
        let self = this;
        self.idBreadcrumbs[0].text = this.$t("task");
        self.taskPriorityFilters = [
          { id: "high", name: this.$t("top"), icon: "mdi-flag", color: "#e91e63", disable: false },
          { id: "medium", name: this.$t("medium"), icon: "mdi-flag-outline", color: "#ff9800", disable: false },
          { id: "low", name: this.$t("low"), icon: "mdi-flag-outline", color: "#009688", disable: false },
          { id: "top", name: this.$t("makeTop"), icon: "mdi-folder-heart-outline", color: "#673ab7", disable: false },
          { id: "all", name: this.$t("all"), icon: "mdi-notification-clear-all", color: "#83829A", disable: false }
        ];
        self.taskOwnerFilters = [
          { id: "mine", name: this.$t("mine"), icon: "mdi-playlist-check", disable: false },
          { id: "group", name: this.$t("groupTasks"), icon: "mdi-account-multiple-outline", disable: false },
          { id: "out", name: this.$t("delegateToOthers"), icon: "mdi-account-arrow-right", disable: false },
          { id: "in", name: this.$t("delegateFromOthers"), icon: "mdi-account-arrow-left-outline", disable: false }
        ];
        self.taskDueFilters = [
          { id: "before", name: this.$t("dueTasks"), icon: "mdi-clock-alert", color: "#FA4F07", disable: false },
          { id: "after", name: this.$t("notDueTasks"), icon: "mdi-alarm", color: "#57928D", disable: false },
          { id: "all", name: this.$t("allItems"), icon: "mdi-notification-clear-all", color: "#83829A", disable: false }
        ];
      }
    },
    taskOwnerFilter: {
      handler() {
        // 刷新列表
        this.refreshTasks();
      }
    },
    taskPriorityFilter: {
      handler() {
        // 刷新列表
        this.refreshTasks();
      }
    },
    taskDueFilter: {
      handler() {
        // 刷新列表
        this.refreshTasks();
      }
    },
    "bpmnDialog.display": {
      async handler(val) {
        let self = this;
        if (val) {
          let response = await processRequest.getProcessXml(self.task.processDefinitionId);
          let statistics = await processRequest.getProcessStatistics(
            "history",
            self.task.processDefinitionId,
            self.task.processInstanceId
          );
          let nodeProperties = {};

          statistics.forEach((item) => {
            let incidents = 0;
            if (item.incidents) {
              item.incidents.forEach((incident) => {
                incidents += incident.incidentCount;
              });
            } else {
              incidents = item.openIncidents;
            }
            nodeProperties[item.id] = {
              instances: item.instances,
              incidents,
              failedJobs: item.failedJobs,
              canceled: item.canceled,
              finished: item.finished
            };
          });

          self.bpmnDialog.xml = response.bpmn20Xml;
          this.bpmnDialog.nodeProperties = nodeProperties;
        }
      }
    },
    "tasks.active": {
      handler(val) {
        let self = this;
        self.taskOwnerFilters = [
          { id: "mine", name: this.$t("mine"), icon: "mdi-playlist-check", disable: false },
          { id: "group", name: this.$t("groupTasks"), icon: "mdi-account-multiple-outline", disable: !val },
          { id: "out", name: this.$t("delegateToOthers"), icon: "mdi-account-arrow-right", disable: !val },
          { id: "in", name: this.$t("delegateFromOthers"), icon: "mdi-account-arrow-left-outline", disable: !val }
        ];
        if (!val) {
          if (["group", "out", "in"].includes(self.taskOwnerFilter)) {
            self.taskOwnerFilter = "mine";
          }
        }
      }
    }
  },
  computed:{
    hasSearch() {
      let self=this;
      return (self.tasks.nameLike&&self.tasks.nameLike.length>0)||
        (self.searchDialog.taskId&&self.searchDialog.taskId.length>0)||
        (self.searchDialog.processDefinitionKeyIn&&self.searchDialog.processDefinitionKeyIn.length>0);
    },
  },
  components: { TaskDetailSider, FlowCalendarDialog, VueBpmn, InstanceMilestone }
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
  background-color: #70b8db;
  border: 0;
  color: #fff;
}

.badge-instance {
  background-color: #2AD194;
}

.badge-incident {
  background-color: #FF7754;
}

.badge-group {
  background-color: #312651;
}

.badge-total i,
.badge-instance i,
.badge-group i,
.badge-incident i {
  margin-right: 4px;
}

.v-list--dense.menu-list .v-list-item .v-list-item__title.current {
  font-weight: bold;
  color: #FF7754;
}

.v-list--dense.menu-list .v-list-item .v-list-item__title.disabled {
  font-weight: bold;
  color: grey;
}

.detail-name {
  font-weight: bold;
  color: rgba(49, 38, 81, 1);
  font-size: 14px;
  margin-right: 12px;
}
</style>
