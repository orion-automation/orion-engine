<template>
  <v-layout style="margin: 0; height: 100%" class="stretch">
    <div style="display: flex; flex-direction: column; width: 100%">
      <div class="d-flex flex-row menu-border" :style="leftStylePadding">
        <div style="flex: 1;text-overflow: ellipsis;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #444262;
    padding-left: 15px;
    word-break: break-all;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;"><template v-if="item && item.name">
          <v-icon color="#83829A" size="16">mdi-source-branch</v-icon>{{ item.name }}
        </template></div>

        <v-menu offset-y z-index="202" :close-on-content-click="false">
          <template #activator="{ on, attrs }">
            <v-btn
                large
                text
                class="process-menu"
                v-show="true"
                v-bind="attrs"
                v-on="on"
                style="border-left: 1px solid rgba(187, 187, 187, 1);border-right: 1px solid rgba(187, 187, 187, 1)"
            >
              <v-icon size="16" color="#83829A">
                mdi-toggle-switch-off-outline
              </v-icon>
              <span style="color: #444262; font-size: 14px;margin-left: 6px">{{ $t('devPanel') }}</span>
            </v-btn>
          </template>
          <div class="d-flex flex-column" style="background-color: white;padding-top: 10px;padding-bottom: 10px">
            <v-switch
                color="#312651"
                class="type-switch"
                v-model="showProperty"
                :label="$t('devPanel')"
                dense
                style="margin: 12px 20px"
                flat
                inset
                @change="setShowProperty()"
            >
              <template #label>
                <span style="color: rgb(68, 66, 98);font-size: 14px">{{ $t('devPanel') }}</span
                >
              </template>
            </v-switch>
            <v-switch
                color="#312651"
                class="type-switch"
                v-model="editXml"
                dense
                :label="$t('xmlViewer')"
                style="margin: 12px 20px"
                flat
                inset
                @change="changeXmlViewer()"
            >
              <template #label>
                <span style="color: rgb(68, 66, 98);font-size: 14px">{{ $t('xmlViewer') }}</span>
              </template>
            </v-switch>
          </div>
        </v-menu>

        <v-btn
            large
            text
            class="process-menu"
            style="border-right: 1px solid rgba(187, 187, 187, 1)"
            @click="onShowAssociations"
        >
          <v-icon
              size="16"
              :class="{
                  point: resource.associations && resource.associations.length,
                }"
              color="#83829A"
              style="margin-right: 6px"
          >
            mdi-link-box
          </v-icon>
          <span style="color: #444262; font-size: 14px">{{ $t('related') }}</span>
        </v-btn>

        <v-btn
            large
            text
            class="process-menu"
            @click="onImportClick"
            style="border-right: 1px solid rgba(187, 187, 187, 1)"
        >
          <v-icon size="16" color="#83829A" style="margin-right: 6px">
            mdi-import
          </v-icon>
          <span style="color: #444262; font-size: 14px">{{ $t('importFile') }}</span>
        </v-btn>

        <v-menu v-if="item.id" offset-y z-index="202">
          <template #activator="{ on, attrs }">
            <v-btn
                large
                text
                class="process-menu"
                v-show="true"
                v-bind="attrs"
                v-on="on"
                style="border-right: 1px solid rgba(187, 187, 187, 1)"
            >
              <v-badge
                  dot
                  bordered
                  overlap
                  :value="resourceUpdated"
                  offset-x="5"
                  offset-y="5"
                  color="#FF7754"
              >
                <v-icon size="16" color="#83829A">
                  mdi-content-save
                </v-icon>
              </v-badge>
              <span style="color: #444262; font-size: 14px;margin-left: 6px">{{ $t('save') }}</span>
            </v-btn>
          </template>
          <v-list style="cursor: pointer" dense>
            <v-list-item key="1">
              <v-list-item-title @click="save({ id: item.id })">
                <span style="font-size: 14px">{{ $t('save') }}</span>
              </v-list-item-title>
            </v-list-item>
            <v-list-item key="2" @click="$refs.modelSave.start()">
              <v-list-item-title>
                <span style="font-size: 14px">{{ $t('saveAs') }}</span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn
            v-if="!item.id"
            large
            text
            class="process-menu"
            v-show="true"
            @click="$refs.modelSave.start()"
            style="border-right: 1px solid rgba(187, 187, 187, 1)"
        >
          <v-icon size="16" color="#83829A" style="margin-right: 6px">
            mdi-content-save
          </v-icon>
          <span style="color: #444262; font-size: 14px">{{ $t('save') }}</span>
        </v-btn>

        <v-btn
            v-if="false"
            large
            text
            class="process-menu"
            v-show="true"
            style="border-right: 1px solid rgba(187, 187, 187, 1)"
        >
          <v-icon size="16" color="#83829A" style="margin-right: 6px">
            mdi-play
          </v-icon>
          <span style="color: #444262; font-size: 14px">{{ $t('simulation') }}</span>
        </v-btn>
        <v-btn
            large
            text
            class="process-menu"
            @click="switchRight(false)"
            style="border-right: 1px solid rgba(187, 187, 187, 1)"
        >
          <v-icon size="16" color="#83829A" style="margin-right: 6px">
            mdi-database-clock-outline
          </v-icon>
          <span style="color: #444262; font-size: 14px">{{ $t('history') }}</span>
        </v-btn>

        <v-btn
            large
            text
            class="process-menu"
            @click="deployDialog.display = true"
            style="border-right: 1px solid rgba(187, 187, 187, 1)"
        >
          <v-icon size="16" color="#83829A" style="margin-right: 6px">
            mdi-upload-network
          </v-icon>
          <span style="color: #444262; font-size: 14px">{{ $t('deploy') }}</span>
        </v-btn>

        <v-menu v-if="item.id&&!showEditXml" offset-y z-index="202">
          <template #activator="{ on, attrs }">
            <v-btn
                large
                text
                class="process-menu"
                v-bind="attrs"
                v-on="on"
                style="border-right: 1px solid rgba(187, 187, 187, 1)"
            >
              <v-icon size="16" color="#83829A" style="margin-right: 6px">
                mdi-download-box-outline
              </v-icon>
              <span style="color: #444262; font-size: 14px">{{ $t('download') }}</span>
            </v-btn>
          </template>
          <v-list style="cursor: pointer" dense>
            <v-list-item key="xml">
              <v-list-item-title @click="$refs.bpmnModeler.getXML(true)">
                <span style="font-size: 14px">BPMN</span>
              </v-list-item-title>
            </v-list-item>
            <v-list-item key="svg" @click="$refs.bpmnModeler.getSVG(true)">
              <v-list-item-title>
                <span style="font-size: 14px">SVG</span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-menu
            v-model="share.display"
            v-if="item.id"
            offset-y
            z-index="202"
            :close-on-content-click="false"
        >
          <template #activator="{ on, attrs }">
            <v-btn
                v-bind="attrs"
                v-on="on"
                large
                text
                class="process-menu"
                style="border-right: 1px solid rgba(187, 187, 187, 1)"
            >
              <v-icon size="16" color="#83829A" style="margin-right: 6px">
                mdi-share-outline
              </v-icon>
              <span style="color: #444262; font-size: 14px">{{ $t('share') }}</span>
            </v-btn>
          </template>
          <v-card width="500" class="share">
            <v-card-title class="small-headline">{{ $t('shareCurrentDesign') }}</v-card-title>
            <v-card-text>
              <v-form ref="form" lazy-validation>
                <v-row style="margin: 0">
                  <v-col style="padding: 0 20px 0 0" cols="10">
                    <input disabled="true" :value="url"/>
                  </v-col>
                  <v-col style="padding: 0 50px 0 0" cols="2">
                    <v-btn
                        color="#ffffff"
                        style="background-color: #ff7754"
                        text
                        outlined
                        @click="copy(url)"
                    >
                      {{ $t('copy') }}
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row v-if="share.displayPassword" style="margin: 10px 0 0 0">
                  <v-col style="padding: 0 20px 0 0" cols="10">
                    <input
                        type="password"
                        v-model="share.password"
                        :placeholder="$t('enterNewPwdSave')"
                    />
                  </v-col>
                  <v-col style="padding: 0 50px 0 0" cols="2">
                    <v-btn
                        color="#ffffff"
                        style="background-color: #ff7754"
                        text
                        outlined
                        @click="savePassword"
                    >
                      {{ $t('save') }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <div v-if="!item.password" class="password-setting">
                <v-icon size="16" color="#312651"> mdi-lock-open</v-icon>
                <span>{{ $t('noAuthShare') }}</span>
              </div>
              <div v-if="item.password" class="password-setting">
                <v-icon size="16" color="#312651"> mdi-lock</v-icon>
                <span>{{ $t('authShare') }}</span>
              </div>
              <span class="password-split">|</span>
              <v-btn @click="togglePassword" color="#FF7754" text>
                {{ $t(share.displayPassword ? "remove" : "add") }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </div>
      <el-row
          style="height: 100%; border-top: 1px solid rgba(187, 187, 187, 1)"
          :style="leftStyleMargin"
      >
        <div v-if="showEditXml" id="xmlContainer" style="width: 100%;height: calc(100% - 45px)">
          <codemirror
              style="height: 100%"
              v-model="item.xml"
              :options="options"
              @input="resourceUpdated=true"
          />
        </div>
        <bpmn-modeler
            v-else
            ref="bpmnModeler"
            :diagram-xml="item.xml"
            :parent-ref-suffix="refSuffix"
            :config-json="item.configJson"
            @onClickNode="selectElement"
            @saveByModelerKeyboard="saveByModelerKeyboard"
            @onCommandStackChanged="resourceUpdated = true"
            @onAiTaskCreated="onAiTaskCreated"
            :export-name="
                item.name ? `${resource.name}-${item.name}` : `${resource.name}`
              "
            :style="rightStyleMargin"
            @save="save"
        />
        <v-navigation-drawer
            :width="500"
            absolute
            mobile-breakpoint="0"
            v-model="right"
            style="z-index: 201"
            right
        >
          <v-icon class="navigation-icon" @click="switchRight()">
            mdi-chevron-right
          </v-icon>

          <div style="display: flex; flex-direction: column; height: 100%" v-if="!ai">
            <div style="flex: 0">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-subtitle class="subtitle">
                    {{ $t('milestone') }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </div>
            <div class="box history">
              <div style="flex: 1; margin: 0">
                <div
                    class="nav-item"
                    @click="selectVersion(versionItem)"
                    :class="{ active: versionItem.id == item.id }"
                    v-for="versionItem in items"
                    :key="versionItem.id"
                >
                  <div class="content">
                    <div class="main">{{ versionItem.name }}</div>
                    <div class="tip">
                      {{
                        utils.formatDateTime(
                            Number(versionItem.updatedTs ?? versionItem.createdTs)
                        )
                      }}&nbsp;{{ versionItem.updatedBy ?? versionItem.createdBy }}
                    </div>
                  </div>

                  <v-menu>
                    <template #activator="{ on, attrs }">
                      <v-icon
                          class="more"
                          size="15"
                          color="#83829A"
                          v-bind="attrs"
                          v-on="on"
                          @click="historyItem = versionItem"
                      >
                        mdi-dots-vertical
                      </v-icon>
                    </template>
                    <v-list style="cursor: pointer">
                      <v-list-item key="rename">
                        <v-list-item-title @click="$refs.modelRename.start()">
                          {{ $t('editName') }}
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                          key="save"
                          v-if="
                              historyItem.version &&
                              historyItem.version !== items[0].version
                            "
                      >
                        <v-list-item-title @click="saveVersion()">
                          {{ $t('saveAsNewest') }}
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item key="delete" @click="deleteDialog.display = true">
                        <v-list-item-title>{{ $t('delete') }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </div>
            </div>
          </div>
        </v-navigation-drawer>
        <ReSizeDrawerRight :init-width="500" ref="resizeDrawerRight" @setLeftWidth="setRightWidth">
          <v-expansion-panels flat tile accordion multiple v-model="defaultPanel">
            <v-expansion-panel>
              <v-expansion-panel-header style="padding: 15px 13px;" color="#f3f4f9">
                <template #default>
                  <span style="line-height: 1.3">{{ $t('directSetting') }}</span>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div style="display: flex; flex-direction: column; height: 100%">
                  <div style="border-bottom: 1px solid rgba(187, 187, 187, 1)"></div>
                  <div style="flex: 0">
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-subtitle class="subtitle">
                          {{ (element.type || "").replace("bpmn:", "") }}
                        </v-list-item-subtitle>
                        <div class="main-value" style="margin-top: 5px">
                          {{
                            element.businessObject &&
                            (element.businessObject.name || element.businessObject.id)
                          }}
                        </div>
                      </v-list-item-content>
                    </v-list-item>
                  </div>
                  <template v-if="isEditNodeProps">
                    <v-menu offset-x offset-y :close-on-content-click="false" z-index="299">
                      <template #activator="{ on, attrs }">
                        <div
                            class="d-flex flex-row"
                            style="border-top: 1px solid rgba(230, 228, 230, 1)"
                            v-bind="attrs"
                            v-on="on"
                            @click="getNodePropsItems()"
                        >
                          <v-icon
                              style="
                        padding: 10px;
                        min-width: 44px;
                        font-size: 16px;
                        color: rgba(131, 130, 154, 1);
                      "
                          >
                            far fa-fw fa-{{ setNodeProps.selectItem.icon }}
                          </v-icon>
                          <span
                              style="
                        padding: 10px;
                        flex: 1;
                        border-left: 1px solid rgba(230, 228, 230, 1);
                        font-size: 14px;
                        color: rgba(131, 130, 154, 1);
                      "
                          >{{
                              setNodeProps.selectItem.name ? setNodeProps.selectItem.name : "--"
                            }}</span
                          >
                          <v-icon color="#FF7754" style="padding: 10px">mdi-search-web</v-icon>
                        </div>
                      </template>
                      <div
                          class="d-flex flex-column"
                          style="
                    border: 1px solid rgba(131, 130, 154, 1);
                    border-radius: 5px;
                    background: white;
                    height: 400px;
                  "
                      >
                        <div class="d-flex flex-row">
                          <v-radio-group v-model="setNodeProps.searchScope" hide-details dense row
                                         @change="getNodePropsItems()"
                                         style="padding-left: 12px;padding-right: 12px">
                            <v-radio color="rgb(255, 119, 84)" :label="$t('currentTeam')" value="only_project" hide-details dense
                                     style="margin-right: 20px"></v-radio>
                            <v-radio color="rgb(255, 119, 84)" :label="$t('global')" value="all" hide-details dense></v-radio>
                          </v-radio-group>
                        </div>
                        <v-text-field
                            outlined
                            hide-details
                            dense
                            style="flex: unset; padding: 0px 12px 18px; margin-top: 10px"
                            @input="getNodePropsItems()"
                            :placeholder="$t('inputKeywordSearchServiceWithDot')"
                            v-model="setNodeProps.searchString"
                            clearable
                        />
                        <v-tabs
                            v-model="setNodeProps.selectTab"
                            @change="getNodePropsItems()"
                            style="flex: 0"
                        >
                          <v-tab key="connector">
                            {{ element.businessObject.$type !== 'bpmn:UserTask' ? '连接器' : 'Form' }}
                          </v-tab>
                          <v-tab key="external" v-if="element.businessObject.$type !== 'bpmn:UserTask'">{{ $t('externalService') }}
                          </v-tab>
                        </v-tabs>
                        <v-tabs-items
                            v-model="setNodeProps.selectTab"
                            style="flex: 1; height: 0"
                        >
                          <v-tab-item key="connector" style="height: 100%; overflow-y: auto">
                            <v-list two-line subheader>
                              <v-list-item
                                  v-for="item in setNodeProps.items"
                                  :key="item.id"
                                  @click="onNodeSetPropsSelectItemClick(item)"
                              >
                                <v-list-item-avatar>
                                  <i
                                      :class="'fa-' + item.icon"
                                      class="far fa-fw"
                                      style="font-size: 14px; margin-right: 5px; color: #444262"
                                  />
                                </v-list-item-avatar>
                                <v-list-item-content>
                                  <v-list-item-title v-text="item.name"/>
                                  <v-list-item-subtitle>
                                    {{ item.configJson ? item.configJson.decisionRef : "--" }}
                                  </v-list-item-subtitle>
                                </v-list-item-content>

                                <v-list-item-action>
                                  <v-btn icon>
                                    <v-icon color="#FF7754" dense>mdi-chevron-right</v-icon>
                                  </v-btn>
                                </v-list-item-action>
                              </v-list-item>
                            </v-list>
                          </v-tab-item>
                          <v-tab-item key="external" style="height: 100%; overflow-y: auto"
                                      v-if="element.businessObject.$type !== 'bpmn:UserTask'">
                            <v-list two-line subheader>
                              <v-list-item
                                  v-for="item in setNodeProps.items"
                                  :key="item.id"
                                  @click="onNodeSetPropsSelectItemClick(item)"
                              >
                                <v-list-item-avatar>
                                  <i
                                      :class="'fa-' + item.icon"
                                      class="far fa-fw"
                                      style="font-size: 14px; margin-right: 5px; color: #444262"
                                  />
                                </v-list-item-avatar>
                                <v-list-item-content>
                                  <v-list-item-title v-text="item.name"/>
                                  <v-list-item-subtitle>
                                    {{ item.configJson ? item.configJson.decisionRef : "--" }}
                                  </v-list-item-subtitle>
                                </v-list-item-content>

                                <v-list-item-action>
                                  <v-btn icon>
                                    <v-icon color="#FF7754" dense>mdi-chevron-right</v-icon>
                                  </v-btn>
                                </v-list-item-action>
                              </v-list-item>
                            </v-list>
                          </v-tab-item>
                        </v-tabs-items>
                        <div
                            class="d-flex flex-row"
                            style="
                      border-bottom-left-radius: 5px;
                      border-bottom-right-radius: 5px;
                      border-top: 1px solid rgba(131, 130, 154, 1);
                    "
                        >
                    <span
                        style="
                        flex: 1;
                        line-height: 3;
                        border-right: 1px solid rgba(131, 130, 154, 1);
                        font-size: 12px;
                        padding-left: 15px;
                      "
                    >{{ $t('notFindApplyApp') }}</span
                    >
                          <v-btn text @click="createApp">
                            <v-icon left color="#FF7754">mdi-plus</v-icon>
                            {{ $t('createNewApp') }}
                          </v-btn>
                        </div>
                      </div>
                    </v-menu>
                    <div
                        class="d-flex flex-row"
                        v-if="
                  element &&
                  element.businessObject &&
                  element.businessObject.$type === 'bpmn:ServiceTask' &&
                  setNodeProps.selectItem.category === 'connector'
                "
                        style="border-top: 1px solid rgba(230, 228, 230, 1); align-items: center"
                        @click="getNodePropsItems()"
                    >
                      <v-icon
                          size="16"
                          color="rgb(131, 130, 154, 1)"
                          style="
                    padding: 10px;
                    min-width: 44px;
                  "
                      >
                        mdi-source-branch
                      </v-icon>
                      <span
                          style="
                    padding: 10px;
                    flex: 1;
                    border-left: 1px solid rgba(230, 228, 230, 1);
                    font-size: 14px;
                    color: rgba(131, 130, 154, 1);
                  "
                      >版本
                  {{
                          setNodeProps.selectItem.oldVersionTag ||
                          setNodeProps.selectItem.versionTag
                        }}</span
                      >
                      <v-menu
                          v-if="
                    setNodeProps.selectItem.oldVersionTag &&
                    setNodeProps.selectItem.versionTag !==
                      setNodeProps.selectItem.oldVersionTag
                  "
                          offset-y
                          z-index="201"
                      >
                        <template #activator="{ on, attrs }">
                          <v-btn
                              small
                              color="#312651"
                              class="white--text"
                              v-bind="attrs"
                              v-on="on"
                          >
                            {{ setNodeProps.selectItem.versionTag }} 更新
                            <v-icon right color="#FF7754">mdi-sync</v-icon>
                          </v-btn>
                        </template>
                        <v-card>
                          <v-card-title>版本更新</v-card-title>
                          <v-card-text
                          >更新连接器版本将覆盖现有XML设置，是否继续？
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer/>
                            <v-btn text>{{ $t('cancel') }}</v-btn>
                            <v-btn text color="#FF7754" @click="updateConnectorVersion">
                              更新
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-menu>
                      <v-icon color="#FF7754" style="padding: 10px">mdi-chevron-down</v-icon>
                    </div>
                    <v-expansion-panels flat tile accordion multiple>
                      <v-expansion-panel>
                        <v-expansion-panel-header
                            hide-actions
                            style="padding: 0; min-height: 0px"
                        >
                          <template #default="{ open }">
                            <div
                                class="d-flex flex-row"
                                style="
                          background: white;
                          border-top: 1px solid rgba(230, 228, 230, 1);
                        "
                                :style="
                          open
                            ? {
                                borderBottom: '1px solid rgba(230, 228, 230, 1)',
                              }
                            : {}
                        "
                            >
                              <v-icon
                                  size="16"
                                  color="rgba(131, 130, 154, 1)"
                                  style="
                            padding: 10px;
                            min-width: 44px;
                          "
                              >
                                mdi-tune-variant
                              </v-icon>
                              <span
                                  style="
                            padding: 10px;
                            line-height: 1.5;
                            flex: 1;
                            border-left: 1px solid rgba(230, 228, 230, 1);
                            font-size: 14px;
                            color: rgba(131, 130, 154, 1);
                          "
                              >自定义配置</span
                              >
                              <v-icon class="icon_expand" color="#FF7754" style="padding: 10px">
                                {{ open ? "mdi-chevron-up" : "mdi-chevron-down" }}
                              </v-icon>
                            </div>
                          </template>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-subtitle class="subtitle">
                                {{ parseQuickSetSelectSubTitle() }}
                              </v-list-item-subtitle>
                              <div style="margin-top: 5px; font-size: 14px; font-weight: bold">
                                {{ setNodeProps.selectItem.name }}
                              </div>
                            </v-list-item-content>
                          </v-list-item>
                          <template
                              v-if="
                        element &&
                        element.businessObject &&
                        element.businessObject.$type === 'bpmn:BusinessRuleTask'
                      "
                          >
                            <v-text-field
                                style="padding: 15px"
                                :label="$t('dmnResultVar')"
                                dense
                                hide-details
                                @input="submitSetProps"
                                v-model="setNodeProps.selectItem.configJson.resultVariable"
                            />
                            <v-select
                                :items="setNodeProps.dmnMapDecisionResults"
                                dense
                                hide-details
                                :menu-props="{ zIndex: '1000 !important' }"
                                @change="submitSetProps"
                                style="padding: 15px"
                                :label="$t('resultList')"
                                v-model="setNodeProps.selectItem.configJson.mapDecisionResult"
                            />
                          </template>
                          <template
                              v-if="
                        element &&
                        element.businessObject &&
                        element.businessObject.$type === 'bpmn:UserTask'
                      "
                          >
                            <v-autocomplete
                                v-model="setNodeProps.userTask.assignee"
                                :menu-props="{ zIndex: 1000 }"
                                :items="setNodeProps.userTask.assigneeItems"
                                :loading="setNodeProps.userTask.assigneeLoading"
                                :search-input.sync="setNodeProps.userTask.assigneeSearchStr"
                                item-text="firstName"
                                @input="submitSetProps"
                                item-value="id"
                                dense
                                style="padding: 15px"
                                :label="$t('leader')"
                                hide-details
                            />
                            <v-autocomplete
                                v-model="setNodeProps.userTask.candidateGroups"
                                :menu-props="{ zIndex: 1000 }"
                                :items="setNodeProps.userTask.candidateGroupsItems"
                                :loading="setNodeProps.userTask.candidateGroupsLoading"
                                :search-input.sync="
                          setNodeProps.userTask.candidateGroupsSearchStr
                        "
                                item-text="name"
                                item-value="id"
                                @input="submitSetProps"
                                multiple
                                dense
                                style="padding: 15px"
                                :label="$t('candidateGroup')"
                                hide-details
                            />
                            <v-autocomplete
                                v-model="setNodeProps.userTask.candidateUsers"
                                :menu-props="{ zIndex: 1000 }"
                                :items="setNodeProps.userTask.candidateUsersItems"
                                :loading="setNodeProps.userTask.candidateUsersLoading"
                                :search-input.sync="setNodeProps.userTask.candidateUsersSearchStr"
                                item-text="firstName"
                                @input="submitSetProps"
                                item-value="id"
                                multiple
                                dense
                                style="padding: 15px"
                                :label="$t('candidateUser')"
                                hide-details
                            />
                          </template>
                          <template
                              v-if="
                        element &&
                        element.businessObject &&
                        element.businessObject.$type === 'bpmn:ServiceTask'
                      "
                          >
                            <template v-if="setNodeProps.selectItem.category === 'connector'">
                              <template
                                  v-if="
                            setNodeProps.selectItem.configJson.headerTemplateEdit.length >
                            0
                          "
                              >
                                <div class="div-connector-label">{{ $t('reqHeader') }}</div>
                                <div
                                    class="d-flex flex-column div-connector-content-parent"
                                    v-for="header in setNodeProps.selectItem.configJson
                              .headerTemplateEdit"
                                    :key="`header-set-${header.key}`"
                                >
                                  <div class="div-connector-content-label">
                                    {{ header.label }}
                                  </div>
                                  <div class="d-flex flex-row div-connector-content-item">
                                    <div
                                        class="div-connector-content-item-icon d-flex flex-row"
                                        @click="
                                  header.type === 'variable'
                                    ? (header.type = 'value')
                                    : (header.type = 'variable')
                                "
                                    >
                                      <v-icon size="18" color="#312651">
                                        {{
                                          header.type === "variable"
                                              ? "mdi-function-variant"
                                              : "mdi-format-text"
                                        }}
                                      </v-icon>
                                      <v-icon color="#FF7754">mdi-menu-down</v-icon>
                                    </div>
                                    <v-text-field
                                        v-model="header.value"
                                        hide-details
                                        dense
                                        outlined
                                    />
                                  </div>
                                  <div v-if="header.hint" class="div-connector-content-label">
                                    {{ header.hint }}
                                  </div>
                                </div>
                              </template>
                              <template
                                  v-if="
                            setNodeProps.selectItem.configJson.queryTemplateEdit.length >
                            0
                          "
                              >
                                <div class="div-connector-label">{{ $t('reqParams') }}</div>
                                <div
                                    class="d-flex flex-column div-connector-content-parent"
                                    v-for="header in setNodeProps.selectItem.configJson
                              .queryTemplateEdit"
                                    :key="`header-set-${header.key}`"
                                >
                                  <div class="div-connector-content-label">
                                    {{ header.label }}
                                  </div>
                                  <div class="d-flex flex-row div-connector-content-item">
                                    <div
                                        class="div-connector-content-item-icon d-flex flex-row"
                                        @click="
                                  header.type === 'variable'
                                    ? (header.type = 'value')
                                    : (header.type = 'variable')
                                "
                                    >
                                      <v-icon size="18" color="#312651">
                                        {{
                                          header.type === "variable"
                                              ? "mdi-function-variant"
                                              : "mdi-format-text"
                                        }}
                                      </v-icon>
                                      <v-icon color="#FF7754">mdi-menu-down</v-icon>
                                    </div>
                                    <v-text-field
                                        v-model="header.value"
                                        hide-details
                                        dense
                                        outlined
                                    />
                                  </div>
                                  <div v-if="header.hint" class="div-connector-content-label">
                                    {{ header.hint }}
                                  </div>
                                </div>
                              </template>
                              <template
                                  v-if="
                            setNodeProps.selectItem.configJson.requestBodyTemplateEdit
                              .length > 0
                          "
                              >
                                <div class="div-connector-label">{{ $t('reqBody') }}</div>
                                <div
                                    class="d-flex flex-column div-connector-content-parent"
                                    v-for="header in setNodeProps.selectItem.configJson
                              .requestBodyTemplateEdit"
                                    :key="`header-set-${header.key}`"
                                >
                                  <div class="div-connector-content-label">
                                    {{ header.label }}
                                  </div>
                                  <div class="d-flex flex-row div-connector-content-item">
                                    <div
                                        class="div-connector-content-item-icon d-flex flex-row"
                                        @click="
                                  header.type === 'variable'
                                    ? (header.type = 'value')
                                    : (header.type = 'variable')
                                "
                                    >
                                      <v-icon size="18" color="#312651">
                                        {{
                                          header.type === "variable"
                                              ? "mdi-function-variant"
                                              : "mdi-format-text"
                                        }}
                                      </v-icon>
                                      <v-icon color="#FF7754">mdi-menu-down</v-icon>
                                    </div>
                                    <v-text-field
                                        v-model="header.value"
                                        hide-details
                                        dense
                                        outlined
                                    />
                                  </div>
                                  <div v-if="header.hint" class="div-connector-content-label">
                                    {{ header.hint }}
                                  </div>
                                </div>
                              </template>
                              <template
                                  v-if="
                            setNodeProps.selectItem.configJson.responseBodyTemplateEdit
                              .length > 0
                          "
                              >
                                <div class="div-connector-label">{{ $t('response') }}</div>
                                <div
                                    class="d-flex flex-column div-connector-content-parent"
                                    v-for="header in setNodeProps.selectItem.configJson
                              .responseBodyTemplateEdit"
                                    :key="`header-set-${header.key}`"
                                >
                                  <div class="div-connector-content-label">
                                    {{ header.label }}
                                  </div>
                                  <div class="d-flex flex-row div-connector-content-item">
                                    <div
                                        class="div-connector-content-item-icon d-flex flex-row"
                                    >
                                      <v-icon size="18" color="#312651"> mdi-variable</v-icon>
                                      <v-icon color="#FF7754" style="visibility: hidden">
                                        mdi-menu-down
                                      </v-icon>
                                    </div>
                                    <v-text-field
                                        v-model="header.value"
                                        hide-details
                                        dense
                                        outlined
                                    />
                                  </div>
                                  <div v-if="header.hint" class="div-connector-content-label">
                                    {{ header.hint }}
                                  </div>
                                </div>
                              </template>
                            </template>
                            <v-text-field
                                style="padding: 15px"
                                :label="$t('topic')"
                                dense
                                v-else
                                hide-details
                                @input="submitSetProps"
                                v-model="setNodeProps.selectItem.configJson.topic"
                            />
                          </template>
                          <template
                              v-if="
                        element &&
                        element.businessObject &&
                        element.businessObject.$type === 'bpmn:CallActivity'
                      "
                          >
                            <v-text-field
                                style="padding: 15px"
                                :label="$t('enterProcessKey')"
                                dense
                                hide-details
                                @input="submitSetProps"
                                v-model="setNodeProps.selectItem.configJson.businessKey"
                            />
                          </template>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                      <v-expansion-panel>
                        <v-expansion-panel-header
                            hide-actions
                            style="padding: 0; min-height: 0px"
                        >
                          <template #default="{ open }">
                            <div
                                class="d-flex flex-row"
                                style="
                          background: white;
                          border-top: 1px solid rgba(230, 228, 230, 1);
                        "
                                :style="
                          open ||
                          (element &&
                            element.businessObject &&
                            element.businessObject.$type === 'bpmn:BusinessRuleTask')
                            ? {
                                borderBottom: '1px solid rgba(230, 228, 230, 1)',
                              }
                            : {}
                        "
                            >
                              <v-icon
                                  size="16"
                                  color="rgba(131, 130, 154, 1)"
                                  style="
                            padding: 10px;
                            min-width: 44px;
                          "
                              >
                                mdi-cursor-default-click-outline
                              </v-icon>
                              <span
                                  style="
                            padding: 10px;
                            line-height: 1.7;
                            flex: 1;
                            border-left: 1px solid rgba(230, 228, 230, 1);
                            font-size: 14px;
                            color: rgba(131, 130, 154, 1);
                          "
                              >前后触发</span
                              >
                              <v-icon color="#FF7754" style="padding: 10px">
                                {{ open ? "mdi-chevron-up" : "mdi-chevron-down" }}
                              </v-icon>
                            </div>
                          </template>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content
                            style="padding: 0"
                            :style="
                      element &&
                      element.businessObject &&
                      element.businessObject.$type === 'bpmn:BusinessRuleTask'
                        ? { borderBottom: '1px solid rgba(230, 228, 230, 1)' }
                        : {}
                    "
                        >
                          <v-menu offset-y :close-on-content-click="false" z-index="201">
                            <template #activator="{ on, attrs }">
                              <div
                                  class="d-flex flex-row"
                                  style=""
                                  v-bind="attrs"
                                  v-on="on"
                                  @click="getNodePropsItems('listener')"
                              >
                                <v-icon
                                    style="
                              padding: 10px;
                              border-right: 1px solid rgba(230, 228, 230, 1);
                            "
                                    color="#FF7754"
                                >
                                  mdi-plus
                                </v-icon>
                              </div>
                            </template>
                            <div
                                class="d-flex flex-column"
                                style="
                          border: 1px solid rgba(131, 130, 154, 1);
                          border-radius: 5px;
                          background: white;
                          height: 400px;
                        "
                            >
                              <v-text-field
                                  outlined
                                  hide-details
                                  dense
                                  style="flex: unset; padding: 0px 12px 18px; margin-top: 10px"
                                  @input="getNodePropsItems('listener')"
                                  :placeholder="$t('inputKeywordSearchServiceWithDot')"
                                  v-model="setNodeProps.searchString"
                                  clearable
                              />
                              <v-list
                                  style="flex: 1; height: 0; overflow-y: auto"
                                  two-line
                                  subheader
                              >
                                <v-list-item
                                    v-for="item in setNodeProps.items"
                                    :key="item.id"
                                    @click="onAddListener(item)"
                                >
                                  <v-list-item-avatar>
                                    <i
                                        :class="'fa-' + item.icon"
                                        class="fad fa-fw"
                                        style="font-size: 14px; margin-right: 5px; color: #444262"
                                    />
                                  </v-list-item-avatar>
                                  <v-list-item-content>
                                    <v-list-item-title v-text="item.name"/>
                                    <v-list-item-subtitle>
                                      {{ item.configJson ? item.configJson.decisionRef : "--" }}
                                    </v-list-item-subtitle>
                                  </v-list-item-content>

                                  <v-list-item-action>
                                    <v-btn icon>
                                      <v-icon color="#FF7754" dense>mdi-chevron-right</v-icon>
                                    </v-btn>
                                  </v-list-item-action>
                                </v-list-item>
                              </v-list>
                              <div
                                  class="d-flex flex-row"
                                  style="
                            border-bottom-left-radius: 5px;
                            border-bottom-right-radius: 5px;
                            border-top: 1px solid rgba(131, 130, 154, 1);
                          "
                              >
                          <span
                              style="
                              flex: 1;
                              line-height: 3;
                              border-right: 1px solid rgba(131, 130, 154, 1);
                              font-size: 12px;
                              padding-left: 15px;
                            "
                          >{{ $t('notFindApplyApp') }}</span
                          >
                                <v-btn text @click="createApp">
                                  <v-icon left color="#FF7754">mdi-plus</v-icon>
                                  {{ $t('createNewApp') }}
                                </v-btn>
                              </div>
                            </div>
                          </v-menu>
                          <div class="d-flex flex-column">
                            <div
                                v-for="(listener, index) in setNodeProps.listeners"
                                :key="listener.id"
                                class="d-flex flex-row"
                                style="
                          border-top: 1px solid rgba(230, 228, 230, 1);
                          justify-content: center;
                          align-content: center;
                          align-items: center;
                          justify-items: center;
                        "
                            >
                              <i
                                  :class="'fa-' + listener.icon"
                                  class="far fa-fw"
                                  style="font-size: inherit; margin: 12px; color: #444262"
                              />
                              <span
                                  style="
                            flex: 1;
                            height: 39px;
                            padding: 10px;
                            margin-right: 10px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            border-right: 1px solid rgba(230, 228, 230, 1);
                            border-left: 1px solid rgba(230, 228, 230, 1);
                          "
                              >{{ listener.name }}</span
                              >
                              <v-select
                                  dense
                                  hide-details
                                  :menu-props="{ zIndex: 1000 }"
                                  @change="submitSetProps"
                                  v-model="listener.event"
                                  style="flex: unset; width: 80px"
                                  :items="[
                            { text: '开始', value: 'start' },
                            { text: '结束', value: 'end' },
                          ]"
                              />
                              <v-divider
                                  vertical
                                  style="
                            border-right: 1px solid rgba(230, 228, 230, 1);
                            margin-left: 10px;
                            opacity: 1;
                          "
                              />
                              <v-btn
                                  icon
                                  @click="onRemoveListener(index)"
                                  style="padding: 10px; border-right: none"
                              >
                                <v-icon color="#FF7754" small>mdi-close-circle</v-icon>
                              </v-btn>
                            </div>
                          </div>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                      <v-expansion-panel
                          v-if="
                    element &&
                    element.businessObject &&
                    element.businessObject.$type === 'bpmn:UserTask'
                  "
                      >
                        <v-expansion-panel-header
                            hide-actions
                            style="padding: 0; min-height: 0px"
                        >
                          <template #default="{ open }">
                            <div
                                class="d-flex flex-row"
                                style="
                          background: white;
                          border-top: 1px solid rgba(230, 228, 230, 1);
                          border-bottom: 1px solid rgba(230, 228, 230, 1);
                        "
                            >
                              <v-icon
                                  size="16"
                                  color="rgb(131, 130, 154)"
                                  style="
                            padding: 10px;
                            min-width: 44px;
                          "
                              >
                                mdi-account-edit
                              </v-icon>
                              <span
                                  style="
                            padding: 10px;
                            line-height: 1.7;
                            flex: 1;
                            border-left: 1px solid rgba(230, 228, 230, 1);
                            font-size: 14px;
                            color: rgba(131, 130, 154, 1);
                          "
                              >提交选项</span
                              >
                              <v-icon color="#FF7754" style="padding: 10px">
                                {{ open ? "mdi-chevron-up" : "mdi-chevron-down" }}
                              </v-icon>
                            </div>
                          </template>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content style="padding: 0">
                          <div
                              class="d-flex align-content-center flex-wrap"
                              style="padding-left: 20px; padding-right: 20px"
                          >
                            <v-checkbox
                                style="margin-right: 10px; margin-left: 10px"
                                v-model="setNodeProps.userTask.input"
                                :label="$t('delegate')"
                                color="#FA4F07"
                                @change="submitSetProps"
                                value="delegate"
                                hide-details
                            />
                            <v-checkbox
                                style="margin-right: 10px; margin-left: 10px"
                                v-model="setNodeProps.userTask.input"
                                :label="$t('reject')"
                                @change="submitSetProps"
                                color="#FA4F07"
                                value="reject"
                                hide-details
                            />
                            <v-checkbox
                                style="margin-right: 10px; margin-left: 10px"
                                v-model="setNodeProps.userTask.input"
                                :label="$t('deprecate')"
                                color="#FA4F07"
                                @change="submitSetProps"
                                value="delete"
                                hide-details
                            />
                            <v-checkbox
                                style="margin-right: 10px; margin-left: 10px"
                                v-model="setNodeProps.userTask.input"
                                :label="$t('redo')"
                                color="#FA4F07"
                                @change="submitSetProps"
                                value="redo"
                                hide-details
                            />
                          </div>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                    <div class="d-flex flex-row-reverse" style="padding: 10px">
                      <v-btn
                          class="text-white"
                          color="#FF7754"
                          :loading="setNodeProps.commitLoading"
                          @click="submitSetProps(true)"
                          style="border-radius: 4px"
                      >
                        {{ $t('save') }}
                      </v-btn>
                    </div>
                  </template>
                  <template v-else>
                    <div
                        class="box"
                        style="flex: 0"
                        v-if="
                  element &&
                  element.businessObject &&
                  ['bpmn:Process', 'bpmn:Participant'].includes(
                    element.businessObject.$type
                  )
                "
                    >
                      <div class="box-header" style="border-bottom: none">
                        <div class="box-icon">
                          <v-icon>mdi-cloud-key-outline</v-icon>
                        </div>
                        <div class="box-title">
                          <span>外部启动</span>
                          <v-icon color="#FF7754" v-if="showLink" right @click="copy(`${parseUrl()}/index.html#/task/${
                              element.businessObject.$type === 'bpmn:Process'
                                ? element.businessObject.id
                                : element.businessObject.get('processRef').id
                            }/start`)">mdi-link
                          </v-icon>
                          <v-spacer/>
                          <div
                              class="d-flex flex-row"
                              style="align-items: center; height: 100%; justify-content: center"
                          >
                            <v-switch
                                hide-details
                                style="margin: 0"
                                @change="setGuestStart"
                                flat
                                inset
                                dense
                                class="type-switch"
                                color="#312651"
                                v-model="
                          setNodeProps.publicProcess[
                            `${
                              element.businessObject.$type === 'bpmn:Process'
                                ? element.businessObject.id
                                : element.businessObject.get('processRef').id
                            }`
                          ]
                        "
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="box" style="flex: 0">
                      <div class="box-header">
                        <div class="box-icon">
                          <v-icon>mdi-text-box</v-icon>
                        </div>
                        <div class="box-title">
                          <span>说明</span>
                        </div>
                      </div>
                      <textarea
                          rows="3"
                          :placeholder="$t('addElementDoc')"
                          v-model="documentation"
                          @change="$refs.bpmnModeler.setDocumentation(documentation)"
                      />
                    </div>
                    <v-expansion-panels flat tile accordion multiple>
                      <v-expansion-panel>
                        <v-expansion-panel-header
                            hide-actions
                            style="padding: 0; min-height: 0px"
                        >
                          <template #default="{ open }">
                            <div
                                class="d-flex flex-row"
                                style="
                          background: white;
                          border-top: 1px solid rgba(187, 187, 187, 1);
                        "
                                :style="
                          open
                            ? {
                                borderBottom: '1px solid rgba(187, 187, 187, 1)',
                              }
                            : {}
                        "
                            >
                              <div style="width: 45px;
  height: 44.63px;
  border-right: 1px solid rgba(187, 187, 187, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  float: left;">
                                <v-icon
                                    style="
                            font-size: 18px;
                          "
                                >
                                  mdi-memory
                                </v-icon>
                              </div>
                              <span
                                  style="
                            padding: 10px;
                            line-height: 1.5;
                            flex: 1;
                            font-size: 14px;
                            color: #444262;
                          "
                              >AI连接器</span
                              >
                              <v-icon class="icon_expand" color="#FF7754" style="padding: 10px">
                                {{ open ? "mdi-chevron-up" : "mdi-chevron-down" }}
                              </v-icon>
                            </div>
                          </template>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <div
                              v-for="aiNode in aiNodes.items"
                              :key="`aiNode-${aiNode.id}`"
                              draggable="true"
                              @dragstart="onStart($event, aiNode)"
                              class="d-flex flex-row"
                              style="
                        padding: 16px;
                        gap: 16px;
                        align-items: center;
                        border-bottom: 1px solid #e6e4e6;
                      "
                          >
                            <div
                                style="
                          padding: 10px;
                          background-color: #f3f4f9;
                          border-radius: 6px;
                        "
                            >
                              <i
                                  :class="'fa-' + aiNode.icon"
                                  class="far fa-fw"
                                  style="font-size: 20px; color: #444262"
                              />
                            </div>
                            <div class="d-flex flex-column" style="flex: 1; gap: 2px">
                        <span style="font-size: 16px; color: #101010">{{
                            aiNode.name
                          }}</span>
                              <div
                                  v-show="aiNode.tags && aiNode.tags.length > 0"
                                  style="color: rgba(0, 0, 0, 0.38); font-size: 10px"
                              >
                                {{ aiNode.tags }}
                              </div>
                            </div>
                          </div>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                    <model-conversation
                        :node="node"
                        :item="item"
                        :user-id="userId"
                        @save="saveConversation"
                        ref="modelConversation"
                    />
                  </template>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel readonly>
              <v-expansion-panel-header hide-actions style="padding: 0">
                <template #default>
                  <div class="d-flex flex-row"
                       style="padding: 15px 13px;background-color: #F3F4F9;border-top: 1px solid rgba(187, 187, 187, 1);border-bottom: 1px solid rgba(187, 187, 187, 1)">
                    <span style="line-height: 1.3">{{ $t('propertyPanel') }}</span>
                    <v-spacer/>
                    <v-switch
                        color="#312651"
                        class="type-switch"
                        v-model="language"
                        v-if="!editXml"
                        flat
                        dense
                        inset
                        @change="changeLanguage()"
                    >
                      <template #label>
                <span v-if="language" style="font-size: 14px"
                ><span style="font-weight: bold; color: #444262">中文</span
                ><span style="color: #83829a">/EN</span></span
                >
                        <span v-else style="font-size: 14px"
                        ><span style="font-weight: bold; color: #444262">EN</span
                        ><span style="color: #83829a">/中文</span></span
                        >
                      </template>
                    </v-switch>
                  </div>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div :id="`properties-panel-${refSuffix}`"></div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </ReSizeDrawerRight>
      </el-row>
    </div>
    <v-dialog v-model="deleteDialog.display" max-width="300">
      <v-card>
        <v-card-title class="headline" style="color: #444262">
          {{ $t('deleteMilestone') }}
        </v-card-title>
        <v-card-text> {{ $t('deleteMilestoneConfirmWithName',{name:historyItem.name}) }}</v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer/>
          <v-btn text @click="deleteDialog.display = false"> {{ $t('cancel') }}</v-btn>
          <v-btn style="color: #ffffff" color="#FF7754" @click="deleteVersion()">
            <v-icon size="16" color="#ffffff" style="margin-right: 6px">
              mdi-comment-quote-outline
            </v-icon>
            {{ $t('delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <model-save :items="items" ref="modelSave" @save="save"/>
    <model-save :items="items" ref="modelSaveHistory" @save="saveHistory"/>
    <model-rename :item="historyItem" ref="modelRename" @save="rename"/>
    <model-association
        :role="role"
        :associations="resource.associations"
        ref="modelAssociation"
        @save="saveAssociation"
    />
    <v-dialog v-model="importBPMNDialog.display" max-width="450">
      <v-card>
        <v-card-title class="headline" style="color: #444262">{{ $t('importFile') }}</v-card-title>
        <v-card-text>
          <v-row style="margin: 0">
            <v-col style="padding: 0" cols="12">
              <v-file-input
                  :placeholder="$t('selectFile')"
                  hide-details
                  accept=".bpmn"
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
    <v-dialog v-model="deployDialog.display" width="450">
      <v-card>
        <v-card-title>{{ $t('deploy') }}</v-card-title>
        <v-card-text>
          {{ $t('deployAlert') }}
          <v-file-input
              :label="$t('addAttachFile')"
              append-icon="mdi-paperclip"
              prepend-icon=""
              small-chips
              multiple
              accept="*"
              ref="deployInputFile"
              v-model="deployDialog.fileModel"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="deployDialog.display = false">{{ $t('cancel') }}</v-btn>
          <v-btn
              class="text-white"
              color="#EB4F2E"
              :loading="deployDialog.commitLoading"
              @click="onDeployCommit"
          >
            {{ $t('deploy') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deployErrorDialog.display" width="600">
      <v-card>
        <v-card-title style="color: #ff7754">{{ $t('deployFail') }}</v-card-title>
        <v-card-text>
          <div class="d-flex flex-column">
            <span
            >{{ $t('plsViewErrorInfoWithInfo',{info:deployErrorDialog.result &&
              deployErrorDialog.result.response &&
              deployErrorDialog.result.response.status
                  ? deployErrorDialog.result.response.status
                  : deployErrorDialog.result}) }}</span
            >
            <span
                v-if="
                deployErrorDialog.result.response &&
                deployErrorDialog.result.response.data &&
                deployErrorDialog.result.response.data.message
              "
                style="
                border: 1px solid grey;
                border-radius: 5px;
                background-color: #f3f4f9;
                padding: 10px;
                margin-top: 20px;
                max-height: 300px;
                overflow-y: auto;
              "
            >{{ deployErrorDialog.result.response.data.message }}</span
            >
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="deployErrorDialog.display = false" text>{{ $t('back') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deploySuccessDialog.display" width="450">
      <v-card>
        <v-card-title style="color: #57928d">{{ $t('deploySuccess') }}</v-card-title>
        <v-card-text>{{ $t('deployProcessSuccess') }}</v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="deploySuccessDialog.display = false">{{ $t('back') }}</v-btn>
          <v-btn text @click="goDeployCenter" color="#0F40F5">{{ $t('goToDeployProcess') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="saveResult.display" width="450">
      <v-card>
        <v-card-title style="color: #444262">
          <v-icon color="#FF7754" left>mdi-folder-alert</v-icon>
          {{ $t('versionConflicts') }}
        </v-card-title>
        <v-card-text>{{ $t('versionConflictsWithUserAndTime',{user:saveResult.data.updatedBy,time:utils.formatDateTime(saveResult.data.updatedTs)}) }}
        </v-card-text>
        <v-card-actions style="padding: 24px 16px">
          <v-spacer/>
          <v-btn
              @click="saveResult.type==='rename'?rename($refs.modelRename.getCurrentName(),true):save({ id: item.id,forceSave:true })"
              color="#FF7754" class="white--text">
            <v-icon color="white" left>mdi-alert-circle</v-icon>
            {{ $t('stillSave') }}
          </v-btn>
          <v-btn text @click="saveResult.type==='rename'?$refs.modelSaveHistory.start():$refs.modelSave.start()"
                 color="#312651">
            <v-icon color="#B1ABB6" left>mdi-source-branch</v-icon>
            {{ $t('saveAs') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import BpmnModeler from "@/components/common/modeler/BPMNModeler";
import ModelSave from "@/components/common/modeler/ModelSave";
import ModelRename from "@/components/common/modeler/ModelRename";
import ModelConversation from "@/components/common/modeler/ModelConversation";
import ModelAssociation from "@/components/common/modeler/ModelAssociation";
import utils from "@/utils/utils";
import modelerUtils from "@/utils/modeler/modeler";
import camundaRequest from "@/api/camunda-service";
import collaborationRequest from "@/api/collaboration";
import ReSizeDrawerRight from "@/components/common/ReSizeDrawerRight";
import {isAny} from "bpmn-js/lib/features/modeling/util/ModelingUtil";
import {getExtensionElementsList} from "camunda-bpmn-js/lib/util/ExtensionElementsUtil";
import userRequest from "@/api/user";
import modelerCommon from "./mixins/index";
import decisionRequest from "@/api/decision";
import BpmnModdle from "bpmn-moddle/resources/bpmn/json/bpmn.json";
import BpmnModdleDi from "bpmn-moddle/resources/bpmn/json/bpmndi.json";
import DiJSON from "bpmn-moddle/resources/bpmn/json/di.json";
import DcJson from "bpmn-moddle/resources/bpmn/json/dc";
import {Moddle} from "moddle";
import {
  Reader
} from "moddle-xml";
import processRequest from "@/api/process";

const model = new Moddle([BpmnModdle, BpmnModdleDi, DiJSON, DcJson]);

export default {
  mixins: [modelerCommon],
  components: {
    BpmnModeler,
    ModelSave,
    ModelRename,
    ModelConversation,
    ModelAssociation,
    ReSizeDrawerRight,
  },
  computed: {
    isEditNodeProps() {
      let self = this;
      return (
          self.element &&
          self.element.businessObject &&
          isAny(self.element.businessObject, [
            "bpmn:UserTask",
            "bpmn:ServiceTask",
            "bpmn:BusinessRuleTask",
            "bpmn:CallActivity",
          ])
      );
    },
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
    url() {
      let url=this.parseUrl();
      return `${url}/viewer.html#/automation/bpmn/index/${this.item.id}`;
    },
  },
  data() {
    return {
      refSuffix: new Date().getTime(),
      showLink: false,
      options: {
        line: true,
        theme: "material-ocean", // 主题
        tabSize: 4, // 制表符的宽度
        indentUnit: 2, // 一个块应该缩进多少个空格（无论这在编辑语言中意味着什么）。默认值为 2。
        firstLineNumber: 1, // 从哪个数字开始计算行数。默认值为 1。
        readOnly: false, // 只读
        autorefresh: true,
        smartIndent: true, // 上下文缩进
        lineNumbers: true, // 是否显示行号
        styleActiveLine: true, // 高亮选中行
        viewportMargin: Infinity, //处理高度自适应时搭配使用
        showCursorWhenSelecting: true, // 当选择处于活动状态时是否应绘制游标
        mode: "application/xml",
        gutters: [
          "CodeMirror-lint-markers",
          "CodeMirror-linenumbers",
          "CodeMirror-foldgutter"
        ],
        foldGutter: true, // 启用行槽中的代码折叠
      },
      deploySuccessDialog: {
        display: false,
        commitLoading: false,
      },
      deployDialog: {
        display: false,
        commitLoading: false,
        fileModel:null
      },
      deployErrorDialog: {
        display: false,
        result: {},
      },
      importBPMNDialog: {
        display: false,
        file: null,
      },
      utils,
      collectionName: "test1",
      language: false,
      showProperty: true,
      editXml: false,
      left: false,
      defaultPanel: [0, 1],
      leftStylePadding: {},
      leftStyleMargin: {},
      rightStyleMargin: {},
      right: false,
      ai: false,
      modeler: null,
      element: {},
      businessObject: {},
      documentation: "",
      node: {
        id: "",
        conversation: [],
      },
      historyItem: {},
      items: [],
      deleteDialog: {
        display: false,
      },
      role: "",
      resource: {
        associations: [],
      },
      project: {},
      setNodeProps: {
        selectItem: {
          configJson: {},
        },
        publicProcess: {},
        selectTab: 0,
        listeners: [],
        commitLoading: false,
        dataLoading: false,
        searchString: "",
        searchScope: "only_project",
        items: [],
        dmnMapDecisionResults: [
          {text: "collectEntries (List<Object>)", value: "collectEntries"},
          {
            text: "resultList (List<Map<String, Object>>)",
            value: "resultList",
          },
          {text: "singleEntry (TypedValue)", value: "singleEntry"},
          {text: "singleResult (Map<String, Object>)", value: "singleResult"},
        ],
        userTask: {
          input: [],
          assignee: "",
          candidateUsers: [],
          candidateGroups: [],
          assigneeItems: [],
          assigneeLoading: false,
          candidateUsersItems: [],
          candidateUsersLoading: false,
          candidateGroupsItems: [],
          candidateGroupsLoading: false,
          assigneeSearchStr: null,
          candidateUsersSearchStr: null,
          candidateGroupsSearchStr: null,
        },
      },
      assist: {
        tab: 0,
        tasks: {
          infiniteId: +new Date(),
          page: 0,
          pageCount: 0,
          itemsPerPage: 3,
          totalCount: 0,
          sortBy: "startTime",
          sortOrder: "desc",
          items: [],
        },
        search: {
          searchType: "knowledge",
          searchRestriction: "current",
          isElement: false,
          isProcess: false,
          keyword: "",
          items: [],
        },
        question: {
          value: "",
          loading: false,
        },
        support: {
          name: "",
          email: "",
          comment: "",
        },
      },
    };
  },
  watch: {
    "setNodeProps.userTask.assigneeSearchStr": {
      async handler(val) {
        let self = this;
        if (!val || val.length === 0) {
          return;
        }

        // Items have already been requested
        if (self.setNodeProps.userTask.assigneeLoading) return;

        self.setNodeProps.userTask.assigneeLoading = true;
        let users = await userRequest.getUsers({firstNameLike: `%${val}%`});
        self.setNodeProps.userTask.assigneeItems = users;
        self.setNodeProps.userTask.assigneeLoading = false;
      },
    },
    "setNodeProps.userTask.candidateUsersSearchStr": {
      async handler(val) {
        let self = this;
        if (!val || val.length === 0) {
          return;
        }
        // 保留已选项目
        let selectItems = self.setNodeProps.userTask.candidateUsersItems.filter(
            (item) => {
              return self.setNodeProps.userTask.candidateUsers.includes(item.id);
            }
        );

        // Items have already been requested
        if (self.setNodeProps.userTask.candidateUsersLoading) return;

        self.setNodeProps.userTask.candidateUsersLoading = true;
        let users = await userRequest.getUsers({firstNameLike: `%${val}%`});
        selectItems.forEach((selectItem) => {
          if (!users.includes(selectItem)) {
            users.push(selectItem);
          }
        });
        self.setNodeProps.userTask.candidateUsersItems = users;
        self.setNodeProps.userTask.candidateUsersLoading = false;
      },
    },
    "setNodeProps.userTask.candidateGroupsSearchStr": {
      async handler(val) {
        let self = this;
        if (!val || val.length === 0) {
          return;
        }
        // 保留已选项目
        let selectItems = self.setNodeProps.userTask.candidateGroupsItems.filter(
            (item) => {
              return self.setNodeProps.userTask.candidateGroups.includes(item.id);
            }
        );

        // Items have already been requested
        if (self.setNodeProps.userTask.candidateGroupsLoading) return;

        self.setNodeProps.userTask.candidateGroupsLoading = true;
        let users = await userRequest.getGroupsWithParams({nameLike: `%${val}%`});
        selectItems.forEach((selectItem) => {
          if (!users.includes(selectItem)) {
            users.push(selectItem);
          }
        });
        self.setNodeProps.userTask.candidateGroupsItems = users;
        self.setNodeProps.userTask.candidateGroupsLoading = false;
      },
    },
    $route: {
      handler() {
        this.getData();
      },
    },
    resourceUpdated: {
      handler(val) {
        this.$emit("onResourceUpdated", val);
      }
    },
    "deployDialog.display": {
      handler(val) {
        if (val) {
          let self = this;
          self.deployDialog.fileModel = null;
        }
      },
    },
  },
  methods: {
    saveByModelerKeyboard(){
      let self=this;
      if (!!self.item.id){
        // 更新
        self.save({ id: self.item.id });
      }else {
        // 新建
        self.$refs.modelSave.start();
      }
    },
    bindKeyboard(){
      this.$refs.bpmnModeler.bindKeyboard();
    },
    unbindKeyboard(){
      this.$refs.bpmnModeler.unbindKeyboard();
    },
    parseUrl() {
      let url = window.location.href;
      if (url.indexOf("/index.html")>-1){
        url = url.split("/index.html")[0];
      }else {
        url = url.split("/#")[0];
      }
      return url;
    },
    async onShowAssociations() {
      await this.getAssociations();
      this.$refs.modelAssociation.contentDialog.display = true;
    },
    async getAssociations() {
      // 根据processDefKey获取关联流程定义
      let self = this;
      const reader = new Reader(model);
      const rootHandler = reader.handler("bpmn:Definitions");
      try {
        const {
          rootElement: cars,
          warnings
        } = await reader.fromXML(self.item.xml, rootHandler);

        if (warnings.length) {
          console.log("import warnings", warnings);
        }
        let process = cars.rootElements
            .filter(element => element.$type === "bpmn:Process")
            .map(element => {
              return {
                id: element.id, name: element.name
              };
            });
        if (process && process.length > 0) {
          let copilotCalls = await processRequest.getProcessByDeployment({
            latestVersion: true,
            keysIn: process.map(item => item.id).join(",")
          });
          let url = self.parseUrl();
          self.resource.associations.push(...copilotCalls.map(item => {
            return {
              id: item.id,
              name: `${item.name}/${item.key}`,
              type: {
                value: "1",
                desc: this.$t("runtime1")
              },
              url: `${url}/index.html#/automation/process/detail/${item.id}`,
              readOnly: true
            };
          }).filter(item => {
            return self.resource.associations.findIndex(association => association.id === item.id) === -1;
          }));
        }
      } catch (err) {
        console.log("import error", err, err.warnings);
      }
    },
    async getResourceCountByType(type, typeName) {
      let self = this;
      let result = await collaborationRequest.getResourceStatistics({projectId: self.project.id, type});
      if (result.length) {
        self.resourceList[`${typeName}`].count = result[0].count;
      }
    },
    async getResourceByType(type, typeName) {
      let self = this;
      if (self.resourceList.expandModel.includes(self.resourceList[`${typeName}`].expandIndex)) {
        let result = await collaborationRequest.getResourceList({projectId: self.project.id, type});
        self.resourceList[`${typeName}`].items = result;
      }
    },
    setRightWidth(payload) {
      let self = this;
      self.showProperty = payload.left;
      self.rightStyleMargin = {
        marginRight: `${payload.left ? payload.width : 0}px`,
      };
    },
    onStart(event, aiNode) {
      let self = this;
      self.aiNodes.current = aiNode;
      self.$refs.bpmnModeler.createAiTask(event);
    },
    onAiTaskCreated() {
      let self = this;
      self.onNodeSetPropsSelectItemClick(self.aiNodes.current);
      if (!self.element.name || self.element.name.length === 0) {
        // 更新name
        self.$refs.bpmnModeler.setElementProps(self.element, {
          name: self.aiNodes.current.name,
        });
      }
    },
    updateConnectorVersion() {
      let self = this;
      self.onNodeSetPropsSelectItemClick(
          Object.assign(self.setNodeProps.selectItem, {
            configJson: self.setNodeProps.selectItem.newConfigJson,
            oldVersionTag: self.setNodeProps.selectItem.versionTag,
          })
      );
    },
    goDeployCenter() {
      this.$router.replace("/automation/deploy/index");
    },
    async onDeployCommit() {
      let self = this;
      if (self.$refs.bpmnModeler) {
        self.deployDialog.commitLoading = true;

        let xml = self.showEditXml ? self.item.xml : await self.$refs.bpmnModeler.getXML(false);
        try {
          let formData = new FormData();
          let blob = new Blob([xml], {type: "text/xml"});
          let timestamp = new Date().getTime();
          formData.append(
              "data0",
              new File([blob], `${self.resource.name}-${timestamp}.bpmn`, {
                type: "text/xml",
              })
          );
          if (self.deployDialog.fileModel){
            self.deployDialog.fileModel.forEach((file,index)=>{
              formData.append(`data-${index+1}`, file);
            });
          }
          formData.append("deployment-name", `${self.resource.name}`);
          formData.append("deployment-source", "bpez");
          formData.append("deploy-changed-only", "true");
          let response = await decisionRequest.createDeployment(formData);
          await self.save({id: self.item.id});
          self.deployDialog.commitLoading = false;
          self.deployDialog.display = false;
          self.deploySuccessDialog.display = true;
        } catch (e) {
          console.log(e);
          self.deployErrorDialog.result = e;
          self.deployErrorDialog.display = true;
          self.deployDialog.display = false;
          self.deployDialog.commitLoading = false;
        }
      }
    },
    onNodeSetPropsSelectItemClick(item) {
      let self = this;
      self.setNodeProps.selectItem = self.parseConnectorItems(item);
      // 自动保存
      self.submitSetProps();
    },
    parseConnectorItems(application) {
      if (application.category === "connector") {
        application.configJson.headerTemplateEdit = application.configJson.headerTemplate.filter(
            (header) => header.editable
        );
        application.configJson.queryTemplateEdit = application.configJson.queryTemplate.filter(
            (header) => header.editable
        );
        application.configJson.requestBodyTemplateEdit = application.configJson.requestBodyTemplate.filter(
            (header) => header.editable || true
        );
        application.configJson.responseBodyTemplateEdit = application.configJson.responseBodyTemplate.filter(
            (header) => header.editable || true
        );
      }
      return application;
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
    onAddListener(item) {
      this.setNodeProps.listeners.push(Object.assign(item, {event: "start"}));
      this.submitSetProps();
    },
    onRemoveListener(index) {
      this.$delete(this.setNodeProps.listeners, index);
      this.submitSetProps();
    },
    parseQuickSetSelectSubTitle() {
      let self = this;
      let subTitle = "--";
      if (self.setNodeProps.selectItem.configJson) {
        switch (self.element.businessObject.$type) {
          case "bpmn:BusinessRuleTask":
            subTitle = self.setNodeProps.selectItem.configJson.decisionRef;
            break;
          case "bpmn:ServiceTask":
            subTitle = self.setNodeProps.selectItem.configJson.type;
            break;
          case "bpmn:CallActivity":
            subTitle = self.setNodeProps.selectItem.configJson.calledElement;
            break;
          case "bpmn:UserTask":
            subTitle = self.setNodeProps.selectItem.configJson.formKey;
            break;
        }
      }
      return subTitle;
    },
    async setGuestStart(val) {
      let self = this;
      self.showLink = val;
      if (
          ["bpmn:Process", "bpmn:Participant"].includes(self.element.businessObject.$type)
      ) {
        switch (self.element.businessObject.$type) {
          case "bpmn:Process":
            self.$refs.bpmnModeler.updateExtensionProperty(
                "publicAccessEnabled",
                `${val}`
            );
            break;
          case "bpmn:Participant":
            self.$refs.bpmnModeler.updateExtensionPropertyById(
                "publicAccessEnabled",
                `${val}`
            );
            break;
          default:
            break;
        }
      }
    },
    async submitSetProps(isManal) {
      let self = this;
      let updateId = null;
      let connectorListenerCode = "";
      if (self.element.businessObject.$type === "bpmn:BusinessRuleTask") {
        // dmn
        // 保存属性
        self.$refs.bpmnModeler.setElementProps(
            self.element,
            self.setNodeProps.selectItem.configJson
        );
        // 对比数据并更新id
        if (self.setNodeProps.selectItem.id) {
          updateId = self.setNodeProps.selectItem.id;
        }
      }
      if (self.element.businessObject.$type === "bpmn:ServiceTask") {
        // 更新name
        if (!self.element.businessObject.name||self.element.businessObject.name.length===0){
          self.$refs.bpmnModeler.setElementProps(self.element, {
            name: self.setNodeProps.selectItem.name,
          });
        }
        // 保存属性
        if (self.setNodeProps.selectItem.category === "connector") {
          let configJson = {
            method: self.setNodeProps.selectItem.configJson.method,
            requestBody: self.setNodeProps.selectItem.configJson.requestBody,
            response: self.setNodeProps.selectItem.configJson.response,
            statusCode: self.setNodeProps.selectItem.configJson.statusCode,
            url: self.setNodeProps.selectItem.configJson.url,
            inputs: self.setNodeProps.selectItem.configJson.inputs,
            outputs: self.setNodeProps.selectItem.configJson.outputs,
            headerTemplate: self.setNodeProps.selectItem.configJson.headerTemplate.map(
                (header) => {
                  if (header.editable) {
                    return self.setNodeProps.selectItem.configJson.headerTemplateEdit.filter(
                        (headerEdit) => headerEdit.key === header.key
                    )[0];
                  } else {
                    return header;
                  }
                }
            ),
            queryTemplate: self.setNodeProps.selectItem.configJson.queryTemplate.map(
                (header) => {
                  if (header.editable) {
                    return self.setNodeProps.selectItem.configJson.queryTemplateEdit.filter(
                        (headerEdit) => headerEdit.key === header.key
                    )[0];
                  } else {
                    return header;
                  }
                }
            ),
            requestBodyTemplate: self.setNodeProps.selectItem.configJson.requestBodyTemplate.map(
                (header) => {
                  if (header.editable || true) {
                    return self.setNodeProps.selectItem.configJson.requestBodyTemplateEdit.filter(
                        (headerEdit) => headerEdit.key === header.key
                    )[0];
                  } else {
                    return header;
                  }
                }
            ),
            responseBodyTemplate: self.setNodeProps.selectItem.configJson.responseBodyTemplate.map(
                (header) => {
                  if (header.editable || true) {
                    return self.setNodeProps.selectItem.configJson.responseBodyTemplateEdit.filter(
                        (headerEdit) => headerEdit.key === header.key
                    )[0];
                  } else {
                    return header;
                  }
                }
            ),
          };
          if (!self.item.configJson) {
            self.item.configJson = {};
          }
          self.item.configJson[`${self.element.businessObject.id}`] = {
            id: self.setNodeProps.selectItem.id,
            versionTag:
                self.setNodeProps.selectItem.oldVersionTag ||
                self.setNodeProps.selectItem.versionTag,
            icon: self.setNodeProps.selectItem.icon,
            configJson: configJson,
          };
          if (configJson.response && configJson.response.length>0){
            configJson.responseBodyTemplate.forEach((responseBody) => {
              // 考虑嵌套
              connectorListenerCode =
                  connectorListenerCode +
                  `const ${responseBody.value} = responseBody.prop("${responseBody.key}").value();
execution.setVariable("${responseBody.value}", ${responseBody.value});`;
            });
          }
          self.$refs.bpmnModeler.setConnectorIcons(self.item.configJson);
          self.$refs.bpmnModeler.setTypeConnector(self.element, configJson);
        } else {
          // 删除connector相关的configJson
          if (!self.item.configJson) {
            self.item.configJson = {};
          }
          delete self.item.configJson[`${self.element.businessObject.id}`];
          self.$refs.bpmnModeler.setElementProps(
              self.element,
              Object.assign(self.setNodeProps.selectItem.configJson, {
                type: "external",
              })
          );
        }
        // 对比数据并更新id
        if (self.setNodeProps.selectItem.id) {
          updateId = self.setNodeProps.selectItem.id;
        }
      }
      if (self.element.businessObject.$type === "bpmn:CallActivity") {
        // dmn
        // 更新name
        if (!self.element.businessObject.name||self.element.businessObject.name.length===0){
          self.$refs.bpmnModeler.setElementProps(self.element, {
            name: self.setNodeProps.selectItem.name,
          });
        }
        // 保存属性
        self.$refs.bpmnModeler.setElementProps(
            self.element,
            self.setNodeProps.selectItem.configJson
        );
        // 对比数据并更新id
        if (self.setNodeProps.selectItem.id) {
          updateId = self.setNodeProps.selectItem.id;
        }
        // 保存taskDelegateOption(Inputs)
        self.$refs.bpmnModeler.updateCamundaIn({
          value: self.setNodeProps.selectItem.configJson.businessKey,
          binding: {
            type: "camunda:in:businessKey",
          },
        });
      }
      if (self.element.businessObject.$type === "bpmn:UserTask") {
        // userTask
        // 保存属性
        self.$refs.bpmnModeler.setElementProps(
            self.element,
            self.setNodeProps.selectItem.configJson
        );
        self.$refs.bpmnModeler.setElementProps(self.element, {
          assignee: self.setNodeProps.userTask.assignee,
          candidateUsers: self.setNodeProps.userTask.candidateUsers.join(","),
          candidateGroups: self.setNodeProps.userTask.candidateGroups.join(","),
        });

        // 对比数据并更新id
        if (self.setNodeProps.selectItem.id) {
          updateId = self.setNodeProps.selectItem.id;
        }
        // 保存taskDelegateOption(Inputs)
        self.$refs.bpmnModeler.updateInputOutputParameterProperty({
          value: self.setNodeProps.userTask.input.join(","),
          binding: {
            type: "camunda:inputParameter",
            name: "taskDelegateOption",
            scriptFormat: null,
          },
        });
      }
      self.$refs.bpmnModeler.updateExtensionProperty(
          "duoApplicationId",
          updateId === null ? "" : `${updateId}`
      );
      let listeners = [...self.setNodeProps.listeners];
      if (self.setNodeProps.selectItem.category === "connector") {
        if (connectorListenerCode&&connectorListenerCode.length>0){
          listeners.push({
            event: "end",
            configJson: {
              listenerType: "Script",
              scriptFormat: "JavaScript",
              scriptCode: connectorListenerCode,
            },
          });
        }
      }
      // 保存listeners
      self.$refs.bpmnModeler.updateListeners(listeners);
      if (isManal) {
        // 手动保存做提示
        self.$notify.success(self.$t("saveSuccess"));
      }
    },
    async getNodePropsItems(category) {
      let self = this;
      if (!category) {
        switch (self.element.businessObject.$type) {
          case "bpmn:BusinessRuleTask":
            category = "dmn";
            break;
          case "bpmn:ServiceTask":
            category = self.setNodeProps.selectTab === 0 ? "connector" : "externalTask";
            break;
          case "bpmn:CallActivity":
            category = "call";
            break;
          case "bpmn:UserTask":
            category = "form";
            break;
        }
      }
      let data = {
        type: "duo",
        category: category,
      };
      if (self.setNodeProps.searchString && self.setNodeProps.searchString.length > 0) {
        data.nameLike = self.setNodeProps.searchString;
      }
      if (self.setNodeProps.searchScope === "only_project") {
        data.coeCode = self.project.coeCode;
      }
      self.setNodeProps.items = await camundaRequest.getApplications({},data);
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
    async selectElement(element) {
      let self = this;
      this.element = element;
      this.setNodeProps.selectItem = {
        configJson: {},
      };
      this.setNodeProps.listeners = [];
      this.setNodeProps.userTask.input = [];
      this.setNodeProps.userTask.candidateUsers = [];
      this.setNodeProps.userTask.candidateGroups = [];
      this.setNodeProps.userTask.assignee = "";
      let props = getExtensionElementsList(
          element.businessObject,
          "camunda:Properties"
      )[0];
      if (element.businessObject.$type === "bpmn:Participant") {
        props = getExtensionElementsList(
            element.businessObject.get("processRef"),
            "camunda:Properties"
        )[0];
      }
      if (props) {
        for (const value of props.get("values")) {
          if (
              value.name === "publicAccessEnabled" &&
              value.get("value") &&
              value.get("value").length > 0 &&
              ["bpmn:Participant", "bpmn:Process"].includes(element.businessObject.$type)
          ) {
            if (element.businessObject.$type !== "bpmn:Participant") {
              this.setNodeProps.publicProcess[
                  `${element.businessObject.id}`
                  ] = value.get("value") === "true";
              self.showLink = this.setNodeProps.publicProcess[
                  `${element.businessObject.id}`
                  ] = value.get("value") === "true";
            } else if (element.businessObject.get("processRef") && element.businessObject.get("processRef").id) {
              // Participant required processRef
              this.setNodeProps.publicProcess[
                  `${element.businessObject.get("processRef").id}`
                  ] = value.get("value") === "true";
              self.showLink = this.setNodeProps.publicProcess[
                  `${element.businessObject.id}`
                  ] = value.get("value") === "true";
            }
          }
          if (
              value.name === "duoApplicationId" &&
              value.get("value") &&
              value.get("value").length > 0
          ) {
            await camundaRequest.getApplication(value.get("value")).then((res) => {
              if (this.item.configJson && this.item.configJson[`${element.businessObject.id}`]) {
                // 保存的connector的configJson
                res.oldVersionTag = this.item.configJson[
                    `${element.businessObject.id}`
                    ].versionTag;
                res.newConfigJson = JSON.parse(JSON.stringify(res.configJson));
                res.configJson = this.item.configJson[
                    `${element.businessObject.id}`
                    ].configJson;
              }
              this.setNodeProps.selectItem = self.parseConnectorItems(res);
            });
          }
          if (
              value.name === "duoListenerApplicationId" &&
              value.get("value") &&
              value.get("value").length > 0
          ) {
            // 暂时认为ids.length和listeners.length一定相等
            let ids = value.get("value").split(",");
            let listeners = getExtensionElementsList(
                element.businessObject,
                "camunda:ExecutionListener"
            );
            // if (listeners){
            //   listeners.forEach(listener=>{
            //     // 获取icon/name
            //     let index=listener.get("fields").findIndex(field=>field.name==="duoAppId" && field.string);
            //     if (index>-1){
            //     }
            //   });
            // }
            ids.forEach((id, index) => {
              camundaRequest.getApplication(id).then((res) => {
                this.setNodeProps.listeners.push(
                    Object.assign(res, {event: listeners[index].get("event")})
                );
              });
            });
          }
        }
      }
      const inputOutputs = getExtensionElementsList(
          element.businessObject,
          "camunda:InputOutput"
      )[0];
      if (inputOutputs) {
        inputOutputs.get("inputParameters").forEach((inputParameter) => {
          if (inputParameter.name === "taskDelegateOption") {
            if (inputParameter.value) {
              this.setNodeProps.userTask.input = inputParameter.value.split(",");
            }
          }
        });
      }
      if (element.businessObject.$type === "bpmn:UserTask") {
        if (element.businessObject.assignee) {
          this.setNodeProps.userTask.assignee = element.businessObject.assignee;
        }
        if (element.businessObject.candidateUsers) {
          this.setNodeProps.userTask.candidateUsers = element.businessObject.candidateUsers.split(
              ","
          );
        }
        if (element.businessObject.candidateGroups) {
          this.setNodeProps.userTask.candidateGroups = element.businessObject.candidateGroups.split(
              ","
          );
        }
      }
      Object.assign(
          this.setNodeProps.selectItem.configJson,
          modelerUtils.getDMNProps(element)
      );
      this.documentation = modelerUtils.getDocumentation(element);
      this.node = {
        id: element.id,
      };
    },
    async changeLanguage() {
      if (this.item.id) {
        await this.save({isAuto: true});
      }
      this.item.xml = await this.$refs.bpmnModeler.getXML();
      await this.$refs.bpmnModeler.initModeler(this.language);
      await this.$refs.bpmnModeler.setConnectorIcons(this.item.configJson);
    },
    async search() {
      let param = {
        // projectId: this.resource.projectId,
        status: undefined,
        projectTypesIn: "3",
        typesIn: "2,3",
      };
      if (this.assist.search.keyword) {
        // param.nameLike = this.assist.search.keyword;
        param.tags = this.assist.search.keyword;
      }

      this.assist.search.items = await camundaRequest.searchResources(param);
    },
    setShowProperty() {
      this.$refs.resizeDrawerRight.setLeft(this.showProperty);
    },
    async changeXmlViewer() {
      let self = this;
      if (self.editXml) {
        self.item.xml = await this.$refs.bpmnModeler.getXML();
        self.showProperty = false;
        this.$refs.resizeDrawerRight.setLeft(false);
      }
      self.showEditXml = self.editXml;
    }
  },
};
</script>

<style scoped>
/deep/ .v-expansion-panel-header {
  min-height: unset;
}

/deep/ .v-expansion-panel--active > .v-expansion-panel-header {
  min-height: unset;
}

/deep/ #xmlContainer .vue-codemirror .CodeMirror {
  overscroll-y: scroll !important;
  height: 100% !important;
}

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
</style>
