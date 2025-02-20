<template>
  <div
      class="d-flex flex-column"
      style="border-top: 1px solid rgba(187, 187, 187, 1); height: 100%"
  >
    <div class="d-flex flex-row" style="padding-left: 14px;background-color: white">
      <v-breadcrumbs
          :items="idBreadcrumbs"
          style="background-color: white; padding: 0px; border: none;width: 300px;font-weight: 400;color: #1976d2 !important"
          divider="|"
      />
      <v-tabs v-model="tab.currentItem" ref="refTabs">
        <v-tabs-slider color="#444262"/>
        <v-tab v-for="(item,index) in tab.items" :key="`tab-header-${item.id}`">
          <v-hover v-slot="{ hover }">
            <div class="d-flex flex-row" style="align-items: center">
              <v-icon v-if="item.type.value==resourceList.dmn.type" color="#57928D" size="16" left>mdi-alpha-d-circle
              </v-icon>
              <v-icon v-if="item.type.value==resourceList.bpmn.type" color="#00B0FF" size="16" left>mdi-alpha-b-box
              </v-icon>
              <v-icon v-if="item.type.value==resourceList.form.type" color="#D500F9" size="16" left>mdi-alpha-f-circle
              </v-icon>
              <v-icon v-if="item.type.value==resourceList.page.type" color="#F50057" size="16" left>mdi-alpha-p-circle
              </v-icon>
              <v-badge
                  dot
                  bordered
                  overlap
                  :value="!!item.resourceUpdated"
                  offset-x="5"
                  offset-y="5"
                  color="#FF7754"
              >
            <span :style="index===tab.currentItem?{}:{color: 'rgb(68,66,98)'}" style="font-weight: 400">{{
                item.name
              }}</span>
              </v-badge>
              <v-btn icon small
                     @click="closeTab(index)"
                     v-if="tab.items.length>1"
                     style="border-right: none">
                <v-icon size="16" :color="hover?'#FF7754':'#d0c9c9'">
                  mdi-close
                </v-icon>
              </v-btn>
            </div>
          </v-hover>
        </v-tab>
      </v-tabs>
    </div>
    <v-card
        class="detail-card"
        style="border-top: 1px solid rgba(187, 187, 187, 1); flex: 1; height: 0"
    >
      <v-layout style="margin: 0; height: 100%" class="stretch">
        <re-size-drawer ref="resizeDrawer"
                        @setLeftWidth="setLeftWidth"
                        :default-show="false">
          <div class="d-flex flex-column" style="height: 100%;width: 100%">
            <div class="d-flex flex-row" style="height: 44px;align-items: center">
              <v-btn icon large @click="switchLeft()" style="border-right: none" :ripple="false">
                <v-icon size="16" color="#FF7754">
                  mdi-page-first
                </v-icon>
              </v-btn>
              <v-text-field :placeholder="$t('searchBtnTxt')"
                            v-model="resourceList.searchStr" dense hide-details/>
              <v-menu offset-y>
                <template #activator="{ on, attrs }">
                  <v-btn icon
                         large
                         :ripple="false"
                         v-bind="attrs" v-on="on"
                         style="border-right: none">
                    <v-icon size="16" color="#444262">
                      mdi-plus-box
                    </v-icon>
                  </v-btn>
                </template>
                <v-list style="cursor: pointer" dense>
                  <v-list-item key="bpmn" @click="startCreateResource(2,'bpmn')">
                    <v-list-item-title>
                      <v-icon size="16" color="#312651" style="margin-right: 6px">
                        mdi-alpha-b-box
                      </v-icon>
                      <span style="font-size: 14px">{{ $t('bsProcess') }}</span>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item key="bpmn2" @click="startCreateResource(3,'dmn')">
                    <v-list-item-title>
                      <v-icon size="16" color="#312651" style="margin-right: 6px">
                        mdi-alpha-d-circle
                      </v-icon>
                      <span style="font-size: 14px">{{ $t('dmn') }}</span>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item key="form" @click="startCreateResource(4,'form')">
                    <v-list-item-title>
                      <v-icon size="16" color="#312651" style="margin-right: 6px">
                        mdi-alpha-f-box
                      </v-icon>
                      <span style="font-size: 14px">{{ $t('form') }}</span>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item key="page" @click="startCreateResource(5,'page')">
                    <v-list-item-title>
                      <v-icon size="16" color="#312651" style="margin-right: 6px">
                        mdi-alpha-p-circle
                      </v-icon>
                      <span style="font-size: 14px">{{ $t('page') }}</span>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item key="upload" @click="startUploadResource()">
                    <v-list-item-title>
                      <v-icon size="16" color="#83829A" style="margin-right: 6px">
                        mdi-upload
                      </v-icon>
                      <span style="font-size: 14px">{{ $t('uploadFile') }}</span>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-menu offset-y z-index="202">
                <template #activator="{ on, attrs }">
                  <v-btn icon
                         large
                         :ripple="false"
                         v-bind="attrs" v-on="on"
                         @click="resourceList.lastResourceList=$store.getters['local/getLastResourceList'](project.id)"
                         style="border-right: none">
                    <v-icon size="16" color="#444262">
                      mdi-clipboard-text-clock-outline
                    </v-icon>
                  </v-btn>
                </template>
                <div class="d-flex flex-column"
                     style="background-color: white;gap: 15px;padding-bottom: 10px;max-height: 500px">
                  <div style="color: #83829A;font-size: 12px;padding: 10px 10px 2px;">{{ $t('resourceViewHistory') }}</div>
                  <div class="d-flex flex-column" style="flex: 1;height: 0;overflow-y: auto;gap: 10px">
                    <div v-for="item in resourceList.lastResourceList"
                         class="d-flex flex-row"
                         @click="goEdit(Object.assign(item,{type:{value:item.type}}))"
                         style="color: #312651;font-size: 14px;padding-left: 10px;padding-right: 10px;gap: 5px;cursor: pointer"
                         :key="`${item.id}-last-resource`">
                      <v-icon v-if="item.type==resourceList.dmn.type" color="#312651" size="16">mdi-alpha-d-circle
                      </v-icon>
                      <v-icon v-if="item.type==resourceList.bpmn.type" color="#312651" size="16">mdi-alpha-b-box
                      </v-icon>
                      <v-icon v-if="item.type==resourceList.form.type" color="#312651" size="16">mdi-alpha-f-box
                      </v-icon>
                      <v-icon v-if="item.type==resourceList.page.type" color="#312651" size="16">mdi-alpha-p-circle
                      </v-icon>
                      {{ item.name }}
                    </div>
                  </div>
                </div>
              </v-menu>
            </div>
            <div style="flex: 1;overflow-y: auto">
              <v-expansion-panels
                  flat tile accordion multiple v-model="resourceList.expandModel">
                <v-expansion-panel @change="getResourceByType(resourceList.bpmn.type,'bpmn')">
                  <v-expansion-panel-header hide-actions style="padding: 0">
                    <template #default="{ open }">
                      <div
                          class="d-flex flex-row"
                          style="
                          background: white;
                          border-top: 1px solid rgba(187, 187, 187, 1);
                          align-items: center;
                        "
                          :style="
                          open
                            ? {
                                borderBottom: '1px solid rgba(187, 187, 187, 1)',
                              }
                            : {}
                        "
                      >
                        <v-icon
                            style="
                            padding: 10px;
                            min-width: 44px;
                            font-size: 16px;
                          "
                            color="#312651">
                          mdi-alpha-b-box
                        </v-icon>
                        <span
                            style="
                            padding: 10px;
                            line-height: 1.5;
                            flex: 1;
                            border-left: 1px solid rgba(187, 187, 187, 1);
                            font-size: 14px;
                            color: #444262;
                          "
                        >{{ $t('bsProcess') }}</span>
                        <div
                            style="font-size: 12px;margin-right: 18px;width: fit-content;height: fit-content;padding: 5px;border-radius: 6px;background-color: #E6E4E6;color: #444262;font-weight: 700">
                          {{ resourceList.bpmn.count }}
                        </div>
                      </div>
                    </template>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div class="d-flex flex-column" style="gap: 20px;padding: 20px 12px 20px 20px;">
                      <div v-for="item in resourceList.bpmn.items"
                           class="d-flex flex-row resource-item"
                           style="align-items: center"
                           :key="item.id">
                        <div class="single-line"
                             @dblclick="onDbClick(item)"
                             style="height: fit-content;flex: 1;color: #312651;padding-left: 34px;font-size: 14px">
                          <span v-if="!item.editName">{{ item.name }}</span>
                          <v-text-field v-else hide-details dense v-model="editNameVal" :autofocus="true"
                                        @blur="onDbClickEditBlur(item)"/>
                        </div>
                        <v-icon color="#FF7754"
                                size="14"
                                class="copyIcon"
                                @click="getResourceDetail(item,'bpmn')"
                                style="padding: 8px">mdi-eye
                        </v-icon>
                        <v-icon class="copyIcon" color="#0F40F5" size="14" style="padding: 8px" @click="goEdit(item)">
                          mdi-cog-box
                        </v-icon>
                      </div>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel @change="getResourceByType(resourceList.dmn.type,'dmn')">
                  <v-expansion-panel-header hide-actions style="padding: 0">
                    <template #default="{ open }">
                      <div
                          class="d-flex flex-row"
                          style="
                          background: white;
                          border-top: 1px solid rgba(187, 187, 187, 1);
                          align-items: center;
                        "
                          :style="
                          open
                            ? {
                                borderBottom: '1px solid rgba(187, 187, 187, 1)',
                              }
                            : {}
                        "
                      >
                        <v-icon
                            style="
                            padding: 10px;
                            min-width: 44px;
                            font-size: 16px;
                          "
                            color="#312651">
                          mdi-alpha-d-circle
                        </v-icon>
                        <span
                            style="
                            padding: 10px;
                            line-height: 1.5;
                            flex: 1;
                            border-left: 1px solid rgba(187, 187, 187, 1);
                            font-size: 14px;
                            color: #444262;
                          "
                        >{{ $t('dmn') }}</span>
                        <div
                            style="font-size: 12px;margin-right: 18px;width: fit-content;height: fit-content;padding: 5px;border-radius: 6px;background-color: #E6E4E6;color: #444262;font-weight: 700">
                          {{ resourceList.dmn.count }}
                        </div>
                      </div>
                    </template>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div class="d-flex flex-column" style="gap: 20px;padding: 20px 12px 20px 20px;">
                      <div v-for="item in resourceList.dmn.items"
                           class="d-flex flex-row resource-item"
                           style="align-items: center"
                           :key="item.id">
                        <div class="single-line"
                             @dblclick="onDbClick(item)"
                             style="height: fit-content;flex: 1;color: #312651;padding-left: 34px;font-size: 14px">
                          <span v-if="!item.editName">{{ item.name }}</span>
                          <v-text-field v-else hide-details dense v-model="editNameVal" :autofocus="true"
                                        @blur="onDbClickEditBlur(item)"/>
                        </div>
                        <v-icon color="#FF7754"
                                size="14"
                                class="copyIcon"
                                @click="getResourceDetail(item,'dmn')"
                                style="padding: 8px">mdi-eye
                        </v-icon>
                        <v-icon class="copyIcon" color="#0F40F5" size="14" style="padding: 8px" @click="goEdit(item)">
                          mdi-cog-box
                        </v-icon>
                      </div>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel @change="getResourceByType(resourceList.form.type,'form')">
                  <v-expansion-panel-header hide-actions style="padding: 0">
                    <template #default="{ open }">
                      <div
                          class="d-flex flex-row"
                          style="
                          background: white;
                          border-top: 1px solid rgba(187, 187, 187, 1);
                          align-items: center;
                        "
                          :style="
                          open
                            ? {
                                borderBottom: '1px solid rgba(187, 187, 187, 1)',
                              }
                            : {}
                        "
                      >
                        <v-icon
                            style="
                            padding: 10px;
                            min-width: 44px;
                            font-size: 16px;
                          "
                            color="#312651">
                          mdi-alpha-f-box
                        </v-icon>
                        <span
                            style="
                            padding: 10px;
                            line-height: 1.5;
                            flex: 1;
                            border-left: 1px solid rgba(187, 187, 187, 1);
                            font-size: 14px;
                            color: #444262;
                          "
                        >{{ $t('form') }}</span>
                        <div
                            style="font-size: 12px;margin-right: 18px;width: fit-content;height: fit-content;padding: 5px;border-radius: 6px;background-color: #E6E4E6;color: #444262;font-weight: 700">
                          {{ resourceList.form.count }}
                        </div>
                      </div>
                    </template>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div class="d-flex flex-column" style="gap: 20px;padding: 20px 12px 20px 20px;">
                      <div v-for="item in resourceList.form.items"
                           class="d-flex flex-row resource-item"
                           style="align-items: center"
                           :key="item.id">
                        <div class="single-line"
                             @dblclick="onDbClick(item)"
                             style="height: fit-content;flex: 1;color: #312651;padding-left: 34px;font-size: 14px">
                          <span v-if="!item.editName">{{ item.name }}</span>
                          <v-text-field v-else hide-details dense v-model="editNameVal" :autofocus="true"
                                        @blur="onDbClickEditBlur(item)"/>
                        </div>
                        <v-icon color="#FF7754"
                                size="14"
                                class="copyIcon"
                                @click="getResourceDetail(item,'form')"
                                style="padding: 8px">mdi-eye
                        </v-icon>
                        <v-icon class="copyIcon" color="#0F40F5" size="14" style="padding: 8px" @click="goEdit(item)">
                          mdi-cog-box
                        </v-icon>
                      </div>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel @change="getResourceByType(resourceList.page.type,'page')">
                  <v-expansion-panel-header hide-actions style="padding: 0">
                    <template #default>
                      <div
                          class="d-flex flex-row"
                          style="
                          background: white;
                          border-top: 1px solid rgba(187, 187, 187, 1);
                          align-items: center;
                          border-bottom: 1px solid rgba(187, 187, 187, 1)
                        ">
                        <v-icon
                            style="
                            padding: 10px;
                            min-width: 44px;
                            font-size: 16px;
                          "
                            color="#312651">
                          mdi-alpha-p-circle
                        </v-icon>
                        <span
                            style="
                            padding: 10px;
                            line-height: 1.5;
                            flex: 1;
                            border-left: 1px solid rgba(187, 187, 187, 1);
                            font-size: 14px;
                            color: #444262;
                          "
                        >{{ $t('page') }}</span>
                        <div
                            style="font-size: 12px;margin-right: 18px;width: fit-content;height: fit-content;padding: 5px;border-radius: 6px;background-color: #E6E4E6;color: #444262;font-weight: 700">
                          {{ resourceList.page.count }}
                        </div>
                      </div>
                    </template>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div class="d-flex flex-column" style="gap: 20px;padding: 20px 12px 20px 20px;">
                      <div v-for="item in resourceList.page.items"
                           class="d-flex flex-row resource-item"
                           style="align-items: center"
                           :key="item.id">
                        <div class="single-line"
                             @dblclick="onDbClick(item)"
                             style="height: fit-content;flex: 1;color: #312651;padding-left: 34px;font-size: 14px">
                          <span v-if="!item.editName">{{ item.name }}</span>
                          <v-text-field v-else hide-details dense v-model="editNameVal" :autofocus="true"
                                        @blur="onDbClickEditBlur(item)"/>
                        </div>
                        <v-icon color="#FF7754"
                                size="14"
                                class="copyIcon"
                                @click="getResourceDetail(item,'page')"
                                style="padding: 8px">mdi-eye
                        </v-icon>
                        <v-icon class="copyIcon" color="#0F40F5" size="14" style="padding: 8px" @click="goEdit(item)">
                          mdi-cog-box
                        </v-icon>
                      </div>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </div>
        </re-size-drawer>
        <div class="horizontal-collapsed" style="z-index: 50" v-if="!left">
          <v-icon class="navigation-icon" @click="switchLeft()">
            mdi-chevron-right
          </v-icon>
        </div>
        <div :style="leftStylePadding" style="width: 100%;height: 100%">
          <v-tabs-items v-model="tab.currentItem">
            <v-tab-item v-for="(item,index) in tab.items" :key="`tab-header-${item.id}`">
              <template v-if="item&&item.type&&item.type.value==resourceList.bpmn.type">
                <Modeler :resource-id="item.id"
                         :project-id="project.id"
                         :ref="`refBpmnModelerTab${index}`"
                         @switchLeft="switchLeft"
                         @onResourceUpdated="onResourceUpdated"/>
              </template>
              <template v-if="item&&item.type&&item.type.value==resourceList.dmn.type">
                <DmnModeler :resource-id="item.id" :project-id="project.id" @switchLeft="switchLeft"
                            @onResourceUpdated="onResourceUpdated"/>
              </template>
              <template v-if="item&&item.type&&item.type.value==resourceList.form.type">
                <FormDetail
                    :resource-id="item.id"
                    :project-id="project.id"
                    @onCreated="onResourceCreated"
                />
              </template>
              <template v-if="item&&item.type&&item.type.value==resourceList.page.type">
                <PageModelerDetail
                    :resource-id="item.id"
                    :project-id="project.id"
                    @onCreated="onResourceCreated"
                />
              </template>
            </v-tab-item>
          </v-tabs-items>
        </div>
      </v-layout>
    </v-card>
    <v-dialog v-model="createResourceDialog.display" max-width="300">
      <v-card>
        <v-card-title class="headline" style="color: #444262"/>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row style="margin: 0 0 20px 0">
              <v-col style="padding: 0" cols="12">
                <v-text-field
                    :placeholder="$t('enterNameWithType',{type:createResourceDialog.typeNameShow})"
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
    <v-dialog v-model="uploadResourceDialog.display" max-width="300">
      <v-card>
        <v-card-title class="headline" style="color: #444262"/>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row style="margin: 0 0 20px 0">
              <v-col style="padding: 0" cols="12">
                <v-text-field
                    :placeholder="$t('enterNameWithDot')"
                    v-model="uploadResourceDialog.name"
                    hide-details
                    @keydown.enter="()=>{}"
                />
              </v-col>
            </v-row>
            <v-row style="margin: 0 0 20px 0">
              <v-col style="padding: 0" cols="12">
                <!--  accept="text/xml, text/bpmn"-->
                <v-file-input
                    :placeholder="$t('selectFile')"
                    accept=".bpmn,.dmn"
                    hide-details
                    v-model="uploadResourceDialog.xml"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions style="padding-bottom: 16px">
          <v-spacer/>
          <v-btn text @click="uploadResourceDialog.display = false"> {{ $t('cancel') }}</v-btn>
          <v-btn style="color: #ffffff" color="#FF7754" @click="uploadResource()">
            <v-icon size="16" color="#ffffff" style="margin-right: 6px">
              mdi-upload
            </v-icon>
            上传
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="resourceList.previewDialog.display" width="800">
      <v-card width="800">
        <v-card-title v-if="resourceList.previewDialog.currentResource">
          <v-icon color="#312651">mdi-alpha-b-box</v-icon>
          {{ resourceList.previewDialog.currentResource.name }}
        </v-card-title>
        <v-card-text style="height: 500px;overflow-y: auto">
          <template
              v-if="resourceList.previewDialog.currentResource&&resourceList.previewDialog.currentResource.type.value==resourceList.bpmn.type">
            <vue-bpmn :diagram-xml="resourceList.bpmn.currentItem.xml"
                      v-if="resourceList.bpmn.currentItem">
            </vue-bpmn>
          </template>
          <template
              v-else-if="resourceList.previewDialog.currentResource&&resourceList.previewDialog.currentResource.type.value==resourceList.dmn.type">
            <VueDMN :diagram-xml="resourceList.dmn.currentItem.xml"
                    v-if="resourceList.dmn.currentItem">
            </VueDMN>
          </template>
          <template
              v-else-if="resourceList.previewDialog.currentResource&&resourceList.previewDialog.currentResource.type.value==resourceList.form.type">
            <vue-formio
                style="overflow-y: auto"
                :form="resourceList.form.currentItem"
                v-if="resourceList.form.currentItem"
                language="zh"
            />
          </template>
          <template
              v-else-if="resourceList.previewDialog.currentResource&&resourceList.previewDialog.currentResource.type.value==resourceList.page.type">
            <vue-formio
                style="overflow-y: auto"
                :form="resourceList.page.currentItem"
                v-if="resourceList.page.currentItem"
                language="zh"
            />
          </template>
        </v-card-text>
        <v-card-actions style="padding: 16px;">
          <v-spacer></v-spacer>
          <v-btn text color="#444262" small @click="resourceList.previewDialog.display=false">
            <span style="font-size: 14px">{{ $t('back') }}</span>
          </v-btn>
          <v-btn class="white--text"
                 v-if="resourceList.previewDialog.currentResource&&(resourceList.previewDialog.currentResource.type.value==resourceList.page.type||resourceList.previewDialog.currentResource.type.value==resourceList.form.type)"
                 color="#FF7754" depressed small @click="copyFormId()">
            <v-icon left>mdi-content-copy</v-icon>
            <span style="font-size: 14px">{{ $t('copyUxId') }}</span>
          </v-btn>
          <v-btn class="white--text" color="#FF7754" depressed small
                 @click="goEdit(resourceList.previewDialog.currentResource)">
            <v-icon left>mdi-cog-box</v-icon>
            <span style="font-size: 14px">{{ $t('edit') }}</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <EditCode
        ref="refEditCode"/>
  </div>
</template>
<script>
import collaborationRequest from "@/api/collaboration";
import ReSizeDrawer from "@/components/common/ReSizeDrawer";
import EditCode from "@/components/common/EditCode";
import Modeler from "@/components/design/collaboration/Modeler";
import DmnModeler from "@/components/design/collaboration/DmnModeler";
import FormDetail from "@/components/design/collaboration/FormDetail";
import PageModelerDetail from "@/components/design/collaboration/PageModelerDetail";
import camundaRequest from "@/api/camunda-service";
import VueBpmn from "@/components/common/BPMN";
import VueDMN from "@/components/common/DMN";
import formRequest from "@/api/form";
import i18n from "@/utils/i18n";
import {Form} from "vue-formio-eorion";

export default {
  components: {
    ReSizeDrawer, Modeler, DmnModeler, VueBpmn, VueDMN, FormDetail, PageModelerDetail, vueFormio: Form, EditCode
  },
  data() {
    return {
      editNameVal: "",
      tab: {
        currentItem: 0,
        items: [],
      },
      resourceList: {
        bpmn: {
          items: [],
          count: 0,
          type: 2,
          currentItem: null,
          expandIndex: 0,
        },
        dmn: {
          items: [],
          count: 0,
          type: 3,
          currentItem: null,
          expandIndex: 1,
        },
        form: {
          items: [],
          count: 0,
          type: 4,
          currentItem: null,
          expandIndex: 2,
          options: {
            language: this.$i18n.locale, noDefaultSubmitButton: true, i18n: i18n,
          },
        },
        page: {
          items: [],
          count: 0,
          type: 5,
          currentItem: null,
          expandIndex: 3,
        },
        expandModel: [],
        lastResourceList: [],
        searchStr: "",
        searchItems: [],
        previewDialog: {
          display: false,
          currentResource: null
        }
      },
      project: {},
      resourceUpdated: false,
      resource: {
        associations: [],
      },
      idBreadcrumbs: [
        {
          text: this.$t("uiDesign"),
          href: "#/design/collaboration/list",
        },
        {
          text: "",
          href: "",
        }
      ],
      left: false,
      leftStylePadding: {},
      leftStyleMargin: {},
      createResourceDialog: {
        name: "",
        type: "",
        display: false,
      },
      uploadResourceDialog: {
        name: "",
        xml: null,
        display: false,
      },
    };
  },
  beforeRouteLeave(to, from, next) {
    let self = this;
    if (self.resourceUpdated) {
      if (window.confirm(self.$t("unSavedNotify"))) {
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  },
  async mounted() {
    let self = this;
    window.openCode = function (payload) {
      self.$refs.refEditCode.setLeft(true, payload);
    };
    window.addEventListener("beforeunload", this.onbeforeunload);
    var key = Number(this.$route.params.id);
    let resourceResult = await camundaRequest.getResource(key);
    this.project = await camundaRequest.getProject(resourceResult.projectId);
    this.resource = resourceResult;
    this.tab.items.push(resourceResult);
    let backUrlRoot = "#/design/collaboration/list";
    if (this.$route.query.groupId) {
      backUrlRoot = `${backUrlRoot}?defaultGroup=${this.$route.query.groupId}`;
    }
    this.idBreadcrumbs[0].href = backUrlRoot;
    this.idBreadcrumbs[1].text = this.project.name;
    let backUrl = `#/design/collaboration/detail/${this.project.id}`;
    if (this.$route.query.folderResource) {
      backUrl = `${backUrl}?defaultResource=${this.$route.query.folderResource}`;
    }
    this.idBreadcrumbs[1].href = backUrl;
    await this.getResourceCountByType(this.resourceList.bpmn.type, "bpmn");
    await this.getResourceCountByType(this.resourceList.dmn.type, "dmn");
    await this.getResourceCountByType(this.resourceList.form.type, "form");
    await this.getResourceCountByType(this.resourceList.page.type, "page");
  },
  computed: {
    userId() {
      return this.$store.state.user.profile.id;
    },
  },
  methods: {
    onDbClick(item) {
      item.editName = true;
      // 自动获取焦点
      this.editNameVal = item.name;
      this.$forceUpdate();
    },
    async onDbClickEditBlur(item) {
      let self = this;
      item.editName = false;
      // 保存资源name
      if (self.editNameVal && self.editNameVal.length > 0 && self.editNameVal !== item.name) {
        let newItem = Object.assign(item, {name: self.editNameVal});
        try {
          await camundaRequest.updateResource(newItem);
          // 更新tab名称
          item.name = newItem.name;
          let index = self.tab.items.findIndex(tab => tab.id === item.id);
          if (index !== -1) {
            self.$set(self.tab.items, index, Object.assign(self.tab.items[index], {name: newItem.name}));
            self.$refs.refTabs.callSlider();
          }
        } catch (e) {
        }
      }
      this.$forceUpdate();
    },
    closeTab(index) {
      // 判断资源是否发生改变
      let self = this;
      if (self.tab.items[self.tab.currentItem].resourceUpdated) {
        if (window.confirm(self.$t("unSavedNotify"))) {
          self.tab.items.splice(index, 1);
        }
      } else {
        self.tab.items.splice(index, 1);
      }
      self.resourceUpdated = self.tab.items.findIndex(item => item.resourceUpdated) > -1;
    },
    copyFormId() {
      let value = this.resourceList.previewDialog.currentResource.externalResourceId;
      navigator.clipboard.writeText(value);
      this.$message({
        message: this.$t("copySuccessWithValue",{value:value}),
        type: "success",
        showClose:true
      });
    },
    onResourceCreated(item) {
      this.getResourceCountByType(item.type.value, item.type.value == "4" ? "form" : "page");
      this.goEdit(item);
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
        parentNode: 0,
        projectId: this.project.id,
      };
      if (this.createResourceDialog.type == 4 || this.createResourceDialog.type == 5) {
        // 表单
        let formCreateResult = await formRequest.postForm({
          name: self.createResourceDialog.name,
          type: "form",
          createdBy: self.userId,
          formData: [],
        });
        data.externalResourceId = formCreateResult.id;
      }
      let result = await camundaRequest.createResource(data);
      let typeName = this.$t("folder");
      switch (self.createResourceDialog.type) {
        case 1:
          typeName = this.$t("folder");
          break;
        case 2:
          typeName = this.$t("bsProcess");
          break;
        case 3:
          typeName = this.$t("dmn");
          break;
        case 4:
          typeName = this.$t("form");
          break;
        case 5:
          typeName = this.$t("page");
          break;
      }
      this.$message({
        message: `${typeName}${this.createResourceDialog.name}${this.$t("successCreate")}。`,
        type: "success",
        showClose:true
      });
      this.goEdit({
        id: result.id,
        name: this.createResourceDialog.name,
        type: {value: this.createResourceDialog.type},
        projectId: this.project.id
      });
      // 刷新数量/列表
      await this.getResourceCountByType(this.createResourceDialog.type, this.createResourceDialog.typeName);
      this.createResourceDialog.display = false;
    },
    async uploadResource() {
      if (!this.uploadResourceDialog.name || !this.uploadResourceDialog.xml) {
        this.$message({
          message: this.$t("inputInfoMiss"),
          type: "error",
          showClose:true
        });
        return;
      }
      let type = this.uploadResourceDialog.xml.name.endsWith(".bpmn") ? 2 : 3;
      let typeName = this.uploadResourceDialog.xml.name.endsWith(".bpmn") ? "bpmn" : "dmn";
      let data = {
        type: type,
        name: this.uploadResourceDialog.name,
        parentNode: 0,
        projectId: this.project.id,
      };
      var reader = new FileReader();
      reader.readAsText(this.uploadResourceDialog.xml);
      reader.onloadend = async () => {
        let response = await camundaRequest.createResource(data);
        let key = response.id;
        let xml = reader.result;

        await collaborationRequest.postVersionDetail(key, {
          name: this.$t("originVersion"),
          xml: xml,
          nodes: [],
        });
        this.$message({
          message: this.$t("uploadFileSuccessWithName",{name:data.name}),
          type: "success",
          showClose:true
        });
        this.goEdit({
          id: response.id, name: this.uploadResourceDialog.name, type: {value: type}, projectId: this.project.id
        });
        // 刷新数量/列表
        await this.getResourceCountByType(type, typeName);
        this.uploadResourceDialog.display = false;
      };
    },
    startCreateResource(type, typeName) {
      this.createResourceDialog.name = "";
      this.createResourceDialog.type = type;
      this.createResourceDialog.typeName = typeName;
      let typeNameShow = this.$t("folder");
      switch (type) {
        case 1:
          typeNameShow = this.$t("folder");
          break;
        case 2:
          typeNameShow = this.$t("bpmnResource");
          break;
        case 3:
          typeNameShow = this.$t("dmnResource");
          break;
        case 4:
          typeNameShow = this.$t("form");
          break;
        case 5:
          typeNameShow = this.$t("page");
      }
      this.createResourceDialog.typeNameShow = typeNameShow;
      this.createResourceDialog.display = true;
    },
    startUploadResource() {
      this.uploadResourceDialog.name = "";
      this.uploadResourceDialog.display = true;
    },
    onResourceUpdated(payload) {
      let self = this;
      self.$set(self.tab.items, this.tab.currentItem,
          Object.assign(self.tab.items[this.tab.currentItem], {resourceUpdated: payload}));
      self.resourceUpdated = self.tab.items.findIndex(item => item.resourceUpdated) > -1;
    },
    goEdit(item) {
      let self = this;
      let saveResource = {
        id: item.id, name: item.name, projectId: item.projectId, type: item.type.value
      };
      self.$store.dispatch("local/addLastResourceList", saveResource);
      self.resourceList.previewDialog.display = false;
      this.resource = item;
      let index = self.tab.items.findIndex(child => child.id === item.id);
      if (index === -1) {
        self.tab.items.push(item);
        self.tab.currentItem = self.tab.items.length - 1;
      } else {
        self.tab.currentItem = index;
      }
    },
    async getResourceDetail(resource, type) {
      let self = this;
      self.resourceList[`${type}`].currentItem = null;
      self.resourceList.previewDialog.currentResource = Object.assign({}, resource);
      if (type == "form" || type == "page") {
        formRequest.getFormDetail(resource.externalResourceId).then((form) => {
          self.resourceList[`${type}`].currentItem = form;
          self.resourceList[`${type}`].currentItem.components = form.formData;
          self.resourceList.previewDialog.display = true;
        });
      } else {
        let items = await collaborationRequest.getAllVersionDetail(resource.id);
        if (items.length) {
          self.resourceList[`${type}`].currentItem = items[0];
        }
        self.resourceList.previewDialog.display = true;
      }
    },
    async getResourceCountByType(type, typeName) {
      let self = this;
      let params = {projectId: self.project.id, type};
      if (self.resourceList.searchStr && self.resourceList.searchStr.length > 0) {
        params.nameLike = self.resourceList.searchStr;
      }
      let result = await collaborationRequest.getResourceStatistics(params);
      if (result.length) {
        self.resourceList[`${typeName}`].count = result[0].count;
        // 刷新列表
        if (self.resourceList.expandModel.includes(self.resourceList[`${typeName}`].expandIndex)) {
          await self.getResourceByType(type, typeName);
        }
      } else {
        self.resourceList[`${typeName}`].count = 0;
      }
    },
    async getResourceByType(type, typeName) {
      let self = this;
      self.$nextTick(async () => {
        if (self.resourceList.expandModel.includes(self.resourceList[`${typeName}`].expandIndex)) {
          let params = {projectId: self.project.id, type};
          if (self.resourceList.searchStr && self.resourceList.searchStr.length > 0) {
            params.nameLike = self.resourceList.searchStr;
          }
          let result = await collaborationRequest.getResourceList(params);
          self.resourceList[`${typeName}`].items = result;
        }
      });
    },
    onbeforeunload(e) {
      let self = this;
      if (self.resourceUpdated) {
        // Cancel the event
        e.preventDefault();
        // Chrome requires returnValue to be set
        e.returnValue = this.$t("unSavedNotify");
      }
    },
    switchLeft() {
      this.$refs.resizeDrawer.setLeft(!this.left);
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
  },
  beforeDestroy() {
    // 移除监听器
    window.removeEventListener("beforeunload", this.onbeforeunload);
  },
  watch: {
    "tab.currentItem": {
      handler(newVal, oldVal) {
        let self = this;
        if (self.$refs[`refBpmnModelerTab${oldVal}`] && self.$refs[`refBpmnModelerTab${oldVal}`].length > 0) {
          self.$refs[`refBpmnModelerTab${oldVal}`][0].unbindKeyboard();
        }
        self.$nextTick(() => {
          if (self.$refs[`refBpmnModelerTab${newVal}`] && self.$refs[`refBpmnModelerTab${newVal}`].length > 0) {
            self.$refs[`refBpmnModelerTab${newVal}`][0].bindKeyboard();
          }
        });
      }
    },
    resource: {
      handler(val) {
      },
      deep: true
    },
    "resourceList.searchStr": {
      async handler(val) {
        let self = this;
        await this.getResourceCountByType(this.resourceList.bpmn.type, "bpmn");
        await this.getResourceCountByType(this.resourceList.dmn.type, "dmn");
        await this.getResourceCountByType(this.resourceList.form.type, "form");
        await this.getResourceCountByType(this.resourceList.page.type, "page");
      }
    },
    "$i18n.locale": {
      handler(val) {
        let self = this;
        self.idBreadcrumbs[0].text = self.$t("uiDesign");
      }
    }
  }
};
</script>

<style scoped>
.copyIcon {
  opacity: 0;
}

.resource-item:hover .copyIcon {
  opacity: 1;
}

/deep/ .bio-properties-panel-label[for*="scriptValue"] {
  display: flex !important;
}

/deep/ .single-line {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}

/deep/ .btn-edit-code {
  color: #1976d2;
}

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
  border-bottom: 1px solid rgba(187, 187, 187, 1);
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

.theme--light.v-tabs-items {
  height: 100% !important;
}

.v-window-item {
  height: 100% !important;
}
</style>
