<template>
  <v-form
      ref="connector"
      v-if="application.category === 'connector'"
      style="margin: 20px"
      lazy-validation
  >
    <v-row>
      <v-col :cols="6">
        <v-file-input
            :placeholder="$t('selectFile')"
            accept=".json"
            v-model="file"
            @change="upload"
        />
        <v-text-field v-model="application.configJson.url" label="URL"/>
        <v-select
            label="Method"
            :items="methods"
            item-value="id"
            item-text="name"
            v-model="application.configJson.method"
        />
      </v-col>
      <v-col :cols="12">
        <v-card color="#ffffff">
          <v-card-title
              style="padding: 0 0 0 16px; border-bottom: 1px solid rgba(238, 238, 238, 100)"
          >
            <span style="font-size: 12px; color: #83829a">{{ $t('headersTemplate') }}</span>

            <v-spacer/>
            <v-btn
                large
                text
                :disabled="multiSelectHeadersVal.length===0"
                style="
                border-left: 1px solid rgba(187, 187, 187, 1);
                border-right: 0 solid rgba(187, 187, 187, 1);
              "
                @click="removeRows(application.configJson.headerTemplate,multiSelectHeadersVal)"
            >
              <v-icon size="16" color="#FF7754" style="margin-right: 6px">
                mdi-delete-sweep
              </v-icon>
              <span style="color: #444262; font-size: 14px">{{ $t('deleteSelectedRecord') }}</span>
            </v-btn>
            <v-btn
                large
                text
                style="
                border-left: 1px solid rgba(187, 187, 187, 1);
                border-right: 0 solid rgba(187, 187, 187, 1);
              "
                @click="addRow(application.configJson.headerTemplate, 'header')"
            >
              <v-icon size="16" color="#FF7754" style="margin-right: 6px">
                mdi-plus
              </v-icon>
              <span style="color: #444262; font-size: 14px">{{ $t('add') }}</span>
            </v-btn>
          </v-card-title>

          <el-table :data="application.configJson.headerTemplate"
                    @selection-change="handleSelectionHeadersChange">
            <el-table-column
                type="selection"
                align="center"
                width="55">
            </el-table-column>
            <el-table-column prop="key" label="Key"/>
            <el-table-column :label="$t('value')">
              <template slot-scope="props">
                <span
                    class="badge"
                    style="margin-right: 5px"
                    :class="
                    props.row.type === 'variable' ? 'badge-variable' : 'badge-value'
                  "
                >
                  {{ $t(props.row.type === "variable" ? "variable" : "value") }} </span
                >{{ props.row.value }}
              </template>
            </el-table-column>
            <el-table-column prop="label" :label="$t('tag')"/>
            <el-table-column :label="$t('editable')" align="left" width="80">
              <template slot-scope="props">
                <v-checkbox
                    style="margin-top: 0; padding-top: 0"
                    v-model="props.row.editable"
                    label=""
                    hide-details
                />
              </template>
            </el-table-column>
            <el-table-column prop="hint" :label="$t('notify')"/>
            <el-table-column :label="$t('operate')" align="center" width="80">
              <template slot-scope="props">
                <v-icon
                    style="margin-right: 8px"
                    size="20"
                    color="#FF7754"
                    @click="
                    editRow(application.configJson.headerTemplate, props.row, 'header')
                  "
                >
                  mdi-pencil
                </v-icon>
                <v-menu v-model="props.row.menu">
                  <template #activator="{ on, attrs }">
                    <v-icon size="20" color="#FF7754" v-bind="attrs" v-on="on">
                      mdi-close
                    </v-icon>
                  </template>

                  <v-card>
                    <v-card-title class="small-headline"/>
                    <v-card-text> {{ $t('deleteHeadersWithKey',{key:props.row.key}) }}</v-card-text>
                    <v-card-actions>
                      <v-spacer/>
                      <v-btn text @click="props.row.menu = false"> {{ $t('back') }}</v-btn>

                      <v-btn
                          style="color: #ffffff"
                          color="#FF7754"
                          @click="
                          removeRow(application.configJson.headerTemplate, props.row)
                        "
                      >
                        <v-icon size="16" color="#ffffff" style="margin-right: 6px">
                          mdi-delete
                        </v-icon>
                        {{ $t('delete') }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </template>
            </el-table-column>
          </el-table>
        </v-card>
      </v-col>
      <v-col :cols="12">
        <v-card color="#ffffff">
          <v-card-title
              style="padding: 0 0 0 16px; border-bottom: 1px solid rgba(238, 238, 238, 100)"
          >
            <span style="font-size: 12px; color: #83829a">{{ $t('paramsTemplate') }}</span>

            <v-spacer/>
            <v-btn
                large
                text
                :disabled="multiSelectQueriesVal.length===0"
                style="
                border-left: 1px solid rgba(187, 187, 187, 1);
                border-right: 0 solid rgba(187, 187, 187, 1);
              "
                @click="removeRows(application.configJson.queryTemplate,multiSelectQueriesVal)"
            >
              <v-icon size="16" color="#FF7754" style="margin-right: 6px">
                mdi-delete-sweep
              </v-icon>
              <span style="color: #444262; font-size: 14px">{{ $t('deleteSelectedRecord') }}</span>
            </v-btn>
            <v-btn
                large
                text
                style="
                border-left: 1px solid rgba(187, 187, 187, 1);
                border-right: 0 solid rgba(187, 187, 187, 1);
              "
                @click="addRow(application.configJson.queryTemplate, 'query')"
            >
              <v-icon size="16" color="#FF7754" style="margin-right: 6px">
                mdi-plus
              </v-icon>
              <span style="color: #444262; font-size: 14px">{{ $t('add') }}</span>
            </v-btn>
          </v-card-title>

          <el-table :data="application.configJson.queryTemplate"
                    @selection-change="handleSelectionQueriesChange">
            <el-table-column
                type="selection"
                align="center"
                width="55">
            </el-table-column>
            <el-table-column prop="key" label="Key"/>
            <el-table-column :label="$t('value')">
              <template slot-scope="props">
                <span
                    class="badge"
                    style="margin-right: 5px"
                    :class="
                    props.row.type === 'variable' ? 'badge-variable' : 'badge-value'
                  "
                >
                  {{ $t(props.row.type === "variable" ? "variable" : "value") }} </span
                >{{ props.row.value }}
              </template>
            </el-table-column>
            <el-table-column prop="label" :label="$t('tag')"/>
            <el-table-column :label="$t('editable')" align="left" width="80">
              <template slot-scope="props">
                <v-checkbox
                    style="margin-top: 0; padding-top: 0"
                    v-model="props.row.editable"
                    label=""
                    hide-details
                />
              </template>
            </el-table-column>
            <el-table-column prop="hint" :label="$t('notify')"/>
            <el-table-column :label="$t('operate')" align="center" width="80">
              <template slot-scope="props">
                <v-icon
                    style="margin-right: 8px"
                    size="20"
                    color="#FF7754"
                    @click="
                    editRow(application.configJson.queryTemplate, props.row, 'query')
                  "
                >
                  mdi-pencil
                </v-icon>
                <v-menu v-model="props.row.menu">
                  <template #activator="{ on, attrs }">
                    <v-icon size="20" color="#FF7754" v-bind="attrs" v-on="on">
                      mdi-close
                    </v-icon>
                  </template>

                  <v-card>
                    <v-card-title class="small-headline"/>
                    <v-card-text>{{ $t('deleteParamsWithKey',{key:props.row.key}) }}</v-card-text>
                    <v-card-actions>
                      <v-spacer/>
                      <v-btn text @click="props.row.menu = false"> {{ $t('back') }}</v-btn>

                      <v-btn
                          style="color: #ffffff"
                          color="#FF7754"
                          @click="
                          removeRow(application.configJson.queryTemplate, props.row)
                        "
                      >
                        <v-icon size="16" color="#ffffff" style="margin-right: 6px">
                          mdi-delete
                        </v-icon>
                        {{ $t('delete') }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </template>
            </el-table-column>
          </el-table>
        </v-card>
      </v-col>
      <v-col :cols="12">
        <v-card color="#ffffff">
          <v-card-title
              style="padding: 0 0 0 16px; border-bottom: 1px solid rgba(238, 238, 238, 100)"
          >
            <span style="font-size: 12px; color: #83829a">{{ $t('reqBodyTemplate') }}</span>

            <v-spacer/>
            <v-btn
                large
                text
                :disabled="multiSelectRequestBodiesVal.length===0"
                style="
                border-left: 1px solid rgba(187, 187, 187, 1);
                border-right: 0 solid rgba(187, 187, 187, 1);
              "
                @click="removeRows(application.configJson.requestBodyTemplate,multiSelectRequestBodiesVal)"
            >
              <v-icon size="16" color="#FF7754" style="margin-right: 6px">
                mdi-delete-sweep
              </v-icon>
              <span style="color: #444262; font-size: 14px">{{ $t('deleteSelectedRecord') }}</span>
            </v-btn>
            <v-btn
                large
                text
                style="
                border-left: 1px solid rgba(187, 187, 187, 1);
                border-right: 1px solid rgba(187, 187, 187, 1);
              "
                @click="addRow(application.configJson.requestBodyTemplate, 'requestBody')"
            >
              <v-icon size="16" color="#FF7754" style="margin-right: 6px">
                mdi-plus
              </v-icon>
              <span style="color: #444262; font-size: 14px">{{ $t('addEditableValue') }}</span>
            </v-btn>
            <v-btn large text @click="application.configJson.requestBody=JSON.stringify(JSON.parse(application.configJson.requestBody),null,2)">
              <v-icon size="16" color="#FF7754" style="margin-right: 6px">
                mdi-format-align-left
              </v-icon>
              <span style="color: #444262; font-size: 14px">{{ $t('format') }}</span>
            </v-btn>
          </v-card-title>
          <codemirror
              rows="4"
              v-model="application.configJson.requestBody"
              :options="options"
              @blur="changeRequestBody()"
          />

          <el-table :data="application.configJson.requestBodyTemplate"
                    @selection-change="handleSelectionRequestBodiesChange">
            <el-table-column
                type="selection"
                align="center"
                width="55">
            </el-table-column>
            <el-table-column prop="key" label="Key"/>
            <el-table-column :label="$t('value')">
              <template slot-scope="props">
                <span
                    class="badge"
                    style="margin-right: 5px"
                    :class="
                    props.row.type === 'variable' ? 'badge-variable' : 'badge-value'
                  "
                >
                  {{ $t(props.row.type === "variable" ? "variable" : "value") }} </span
                >{{ props.row.value }}
              </template>
            </el-table-column>
            <el-table-column prop="label" :label="$t('tag')"/>
            <el-table-column prop="hint" :label="$t('notify')"/>
            <el-table-column :label="$t('operate')" align="center" width="80">
              <template slot-scope="props">
                <v-icon
                    style="margin-right: 8px"
                    size="20"
                    color="#FF7754"
                    @click="
                    editRow(
                      application.configJson.requestBodyTemplate,
                      props.row,
                      'requestBody'
                    )
                  "
                >
                  mdi-pencil
                </v-icon>
                <v-menu v-model="props.row.menu">
                  <template #activator="{ on, attrs }">
                    <v-icon size="20" color="#FF7754" v-bind="attrs" v-on="on">
                      mdi-close
                    </v-icon>
                  </template>

                  <v-card>
                    <v-card-title class="small-headline"/>
                    <v-card-text>
                      {{ $t('deleteReqBodyWithKey',{key:props.row.key}) }}
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer/>
                      <v-btn text @click="props.row.menu = false"> {{ $t('back') }}</v-btn>

                      <v-btn
                          style="color: #ffffff"
                          color="#FF7754"
                          @click="
                          removeRow(application.configJson.requestBodyTemplate, props.row)
                        "
                      >
                        <v-icon size="16" color="#ffffff" style="margin-right: 6px">
                          mdi-delete
                        </v-icon>
                        {{ $t('delete') }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </template>
            </el-table-column>
          </el-table>
        </v-card>
      </v-col>
      <v-col :cols="6">
        <v-text-field v-model="application.configJson.statusCode" label="Status Code"/>
        <v-text-field v-model="application.configJson.response" label="Response"/>
      </v-col>

      <v-col :cols="12">
        <v-card color="#ffffff">
          <v-card-title
              style="padding: 0 0 0 16px; border-bottom: 1px solid rgba(238, 238, 238, 100)"
          >
            <span style="font-size: 12px; color: #83829a">{{ $t('responseBodyTemplate') }}</span>

            <v-spacer/>
            <v-btn
                large
                text
                :disabled="multiSelectResponseBodiesVal.length===0"
                style="
                border-left: 1px solid rgba(187, 187, 187, 1);
                border-right: 0 solid rgba(187, 187, 187, 1);
              "
                @click="removeRows(application.configJson.responseBodyTemplate,multiSelectResponseBodiesVal)"
            >
              <v-icon size="16" color="#FF7754" style="margin-right: 6px">
                mdi-delete-sweep
              </v-icon>
              <span style="color: #444262; font-size: 14px">{{ $t('deleteSelectedRecord') }}</span>
            </v-btn>
            <v-btn
                large
                text
                style="
                border-left: 1px solid rgba(187, 187, 187, 1);
                border-right: 0 solid rgba(187, 187, 187, 1);
              "
                @click="addRow(application.configJson.responseBodyTemplate, 'responseBody')"
            >
              <v-icon size="16" color="#FF7754" style="margin-right: 6px">
                mdi-plus
              </v-icon>
              <span style="color: #444262; font-size: 14px">{{ $t('add') }}</span>
            </v-btn>
          </v-card-title>

          <el-table :data="application.configJson.responseBodyTemplate"
                    @selection-change="handleSelectionResponseBodiesChange">
            <el-table-column
                type="selection"
                align="center"
                width="55">
            </el-table-column>
            <el-table-column prop="key" label="Key"/>
            <el-table-column :label="$t('value')">
              <template slot-scope="props">
                <span
                    class="badge"
                    style="margin-right: 5px"
                    :class="
                    props.row.type === 'variable' ? 'badge-variable' : 'badge-value'
                  "
                >
                  {{ $t(props.row.type === "variable" ? "variable" : "value") }} </span
                >{{ props.row.value }}
              </template>
            </el-table-column>
            <el-table-column prop="label" :label="$t('tag')"/>
            <el-table-column prop="hint" :label="$t('notify')"/>
            <el-table-column :label="$t('operate')" align="center" width="80">
              <template slot-scope="props">
                <v-icon
                    style="margin-right: 8px"
                    size="20"
                    color="#FF7754"
                    @click="
                    editRow(
                      application.configJson.responseBodyTemplate,
                      props.row,
                      'responseBody'
                    )
                  "
                >
                  mdi-pencil
                </v-icon>
                <v-menu v-model="props.row.menu">
                  <template #activator="{ on, attrs }">
                    <v-icon size="20" color="#FF7754" v-bind="attrs" v-on="on">
                      mdi-close
                    </v-icon>
                  </template>

                  <v-card>
                    <v-card-title class="small-headline"/>
                    <v-card-text> {{ $t('deleteParamsWithKey',{key:props.row.key}) }}</v-card-text>
                    <v-card-actions>
                      <v-spacer/>
                      <v-btn text @click="props.row.menu = false"> {{ $t('back') }}</v-btn>

                      <v-btn
                          style="color: #ffffff"
                          color="#FF7754"
                          @click="
                          removeRow(
                            application.configJson.responseBodyTemplate,
                            props.row
                          )
                        "
                      >
                        <v-icon size="16" color="#ffffff" style="margin-right: 6px">
                          mdi-delete
                        </v-icon>
                        {{ $t('delete') }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </template>
            </el-table-column>
          </el-table>
        </v-card>
      </v-col>
      <v-col :cols="12">
        <v-card color="#ffffff">
          <v-card-title
              style="padding: 0 0 0 16px; border-bottom: 1px solid rgba(238, 238, 238, 100)"
          >
            <span style="font-size: 12px; color: #83829a">{{ $t('inputSetting') }}</span>

            <v-spacer/>
            <v-btn
                large
                text
                :disabled="multiSelectInputsVal.length===0"
                style="
                border-left: 1px solid rgba(187, 187, 187, 1);
                border-right: 0 solid rgba(187, 187, 187, 1);
              "
                @click="removeRows(application.configJson.inputs,multiSelectInputsVal)"
            >
              <v-icon size="16" color="#FF7754" style="margin-right: 6px">
                mdi-delete-sweep
              </v-icon>
              <span style="color: #444262; font-size: 14px">{{ $t('deleteSelectedRecord') }}</span>
            </v-btn>
            <v-btn
                large
                text
                style="
                border-left: 1px solid rgba(187, 187, 187, 1);
                border-right: 0 solid rgba(187, 187, 187, 1);
              "
                @click="addRow(application.configJson.inputs, 'input')"
            >
              <v-icon size="16" color="#FF7754" style="margin-right: 6px">
                mdi-plus
              </v-icon>
              <span style="color: #444262; font-size: 14px">{{ $t('add') }}</span>
            </v-btn>
          </v-card-title>

          <el-table :data="application.configJson.inputs"
                    @selection-change="handleSelectionInputsChange">
            <el-table-column
                type="selection"
                align="center"
                width="55">
            </el-table-column>
            <el-table-column prop="key" label="local Variables"/>
            <el-table-column prop="type" label="type"/>
            <el-table-column prop="label" :label="$t('tag')"/>
            <el-table-column prop="hint" :label="$t('notify')"/>
            <el-table-column prop="defaultValue" :label="$t('defaultValue')"/>
            <el-table-column :label="$t('operate')" align="center" width="80">
              <template slot-scope="props">
                <v-icon
                    style="margin-right: 8px"
                    size="20"
                    color="#FF7754"
                    @click="
                    editRow(
                      application.configJson.inputs,
                      props.row,
                      'input'
                    )
                  "
                >
                  mdi-pencil
                </v-icon>
                <v-menu v-model="props.row.menu">
                  <template #activator="{ on, attrs }">
                    <v-icon size="20" color="#FF7754" v-bind="attrs" v-on="on">
                      mdi-close
                    </v-icon>
                  </template>

                  <v-card>
                    <v-card-title class="small-headline"/>
                    <v-card-text> {{ $t('deleteParamsWithKey',{key:props.row.key}) }}</v-card-text>
                    <v-card-actions>
                      <v-spacer/>
                      <v-btn text @click="props.row.menu = false"> {{ $t('back') }}</v-btn>

                      <v-btn
                          style="color: #ffffff"
                          color="#FF7754"
                          @click="
                          removeRow(
                            application.configJson.inputs,
                            props.row
                          )
                        "
                      >
                        <v-icon size="16" color="#ffffff" style="margin-right: 6px">
                          mdi-delete
                        </v-icon>
                        {{ $t('delete') }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </template>
            </el-table-column>
          </el-table>
        </v-card>
      </v-col>
      <v-col :cols="12">
        <v-card color="#ffffff">
          <v-card-title
              style="padding: 0 0 0 16px; border-bottom: 1px solid rgba(238, 238, 238, 100)"
          >
            <span style="font-size: 12px; color: #83829a">{{ $t('outputSetting') }}</span>

            <v-spacer/>
            <v-btn
                large
                text
                :disabled="multiSelectOutputsVal.length===0"
                style="
                border-left: 1px solid rgba(187, 187, 187, 1);
                border-right: 0 solid rgba(187, 187, 187, 1);
              "
                @click="removeRows(application.configJson.outputs,multiSelectOutputsVal)"
            >
              <v-icon size="16" color="#FF7754" style="margin-right: 6px">
                mdi-delete-sweep
              </v-icon>
              <span style="color: #444262; font-size: 14px">{{ $t('deleteSelectedRecord') }}</span>
            </v-btn>
            <v-btn
                large
                text
                style="
                border-left: 1px solid rgba(187, 187, 187, 1);
                border-right: 0 solid rgba(187, 187, 187, 1);
              "
                @click="addRow(application.configJson.outputs, 'output')"
            >
              <v-icon size="16" color="#FF7754" style="margin-right: 6px">
                mdi-plus
              </v-icon>
              <span style="color: #444262; font-size: 14px">{{ $t('add') }}</span>
            </v-btn>
          </v-card-title>

          <el-table :data="application.configJson.outputs"
                    @selection-change="handleSelectionOutputsChange">
            <el-table-column
                type="selection"
                align="center"
                width="55">
            </el-table-column>
            <el-table-column prop="key" label="local Variables"/>
            <el-table-column prop="type" label="type"/>
            <el-table-column prop="label" :label="$t('tag')"/>
            <el-table-column prop="hint" :label="$t('notify')"/>
            <el-table-column prop="defaultValue" :label="$t('defaultValue')"/>
            <el-table-column :label="$t('operate')" align="center" width="80">
              <template slot-scope="props">
                <v-icon
                    style="margin-right: 8px"
                    size="20"
                    color="#FF7754"
                    @click="
                    editRow(
                      application.configJson.outputs,
                      props.row,
                      'output'
                    )
                  "
                >
                  mdi-pencil
                </v-icon>
                <v-menu v-model="props.row.menu">
                  <template #activator="{ on, attrs }">
                    <v-icon size="20" color="#FF7754" v-bind="attrs" v-on="on">
                      mdi-close
                    </v-icon>
                  </template>

                  <v-card>
                    <v-card-title class="small-headline"/>
                    <v-card-text> {{ $t('deleteParamsWithKey',{key:props.row.key}) }}</v-card-text>
                    <v-card-actions>
                      <v-spacer/>
                      <v-btn text @click="props.row.menu = false"> {{ $t('back') }}</v-btn>

                      <v-btn
                          style="color: #ffffff"
                          color="#FF7754"
                          @click="
                          removeRow(
                            application.configJson.outputs,
                            props.row
                          )
                        "
                      >
                        <v-icon size="16" color="#ffffff" style="margin-right: 6px">
                          mdi-delete
                        </v-icon>
                        {{ $t('delete') }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </template>
            </el-table-column>
          </el-table>
        </v-card>
      </v-col>
    </v-row>
    <template-item :row="row" :options="flatBodyFields" ref="templateItem"/>
  </v-form>
</template>
<script>
import utils from "@/utils/utils";
import TemplateItem from "./TemplateItem";

export default {
  components: {TemplateItem},
  props: {
    application: {
      type: Object,
      required: true,
    },
    types: {
      type: Object,
      required: true,
    },
  },
  computed: {},
  data() {
    return {
      file: null,
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
        mode: "application/json",
        gutters: [
          "CodeMirror-lint-markers",
          "CodeMirror-linenumbers",
          "CodeMirror-foldgutter"
        ],
        foldGutter: true, // 启用行槽中的代码折叠
        lintOnChange: true,
        lint: true
      },
      defaultRow: {
        key: "",
        value: "",
        label: "",
        editable: false,
        hint: "",
      },
      row: {
        data: {},
        type: "",
        index: -1,
      },
      flatBodyFields: [],
      methods: [
        {id: "GET", name: "GET"},
        {id: "POST", name: "POST"},
        {id: "PUT", name: "PUT"},
        {id: "DELETE", name: "DELETE"},
        {id: "PATCH", name: "PATCH"},
      ],
      multiSelectHeadersVal: [],
      multiSelectQueriesVal: [],
      multiSelectRequestBodiesVal: [],
      multiSelectResponseBodiesVal: [],
      multiSelectInputsVal: [],
      multiSelectOutputsVal: [],
    };
  },
  watch: {
    "application.configJson.requestBody": {
      handler() {
        let body = {};
        try {
          body = JSON.parse(this.application.configJson.requestBody || "{}");
        } catch (e) {
        }
        let flatBody = utils.flattenObj(body);
        let fields = Object.keys(flatBody).map((key) => {
          return {
            key,
            value: flatBody[key],
          };
        });
        this.flatBodyFields = fields;
      },
    },
  },
  mounted() {
  },
  methods: {

    handleSelectionHeadersChange(val) {
      this.multiSelectHeadersVal = val;
    },
    handleSelectionQueriesChange(val) {
      this.multiSelectQueriesVal = val;
    },
    handleSelectionRequestBodiesChange(val) {
      this.multiSelectRequestBodiesVal = val;
    },
    handleSelectionResponseBodiesChange(val) {
      this.multiSelectResponseBodiesVal = val;
    },
    handleSelectionInputsChange(val) {
      this.multiSelectInputsVal = val;
    },
    handleSelectionOutputsChange(val) {
      this.multiSelectOutputsVal = val;
    },
    removeRows(items, itemDels) {
      itemDels.forEach(itemDel => {
        let index = items.indexOf(itemDel);
        items.splice(index, 1);
      });
    },
    removeRow(items, item) {
      let index = items.indexOf(item);
      items.splice(index, 1);
    },
    editRow(items, item, type) {
      this.$refs.templateItem.editRow(items, item, type);
    },
    addRow(items, type) {
      this.$refs.templateItem.addRow(items, type);
    },
    changeRequestBody() {
      let body = {};
      try {
        body = JSON.parse(this.application.configJson.requestBody || "{}");
      } catch (e) {
        this.$message({
          message: this.$t("invalidJson"),
          type: "error",
          showClose:true
        });
      }
      let flatBody = utils.flattenObj(body);
      let fields = Object.keys(flatBody).map((key) => {
        return {
          key,
          value: flatBody[key],
        };
      });
      this.flatBodyFields = fields;
      this.application.configJson.requestBodyTemplate = this.application.configJson.requestBodyTemplate.filter(
          (item) => fields.find((field) => field.key === item.key)
      );

      // this.application.configJson.requestBodyTemplate.splice(
      //   0,
      //   this.application.configJson.requestBodyTemplate.length
      // );
    },

    reset() {
      let item = utils.application.categories[this.application.type].find(
          (category) => category.id === "connector"
      ).item;

      this.application.configJson = JSON.parse(JSON.stringify(item));
    },

    async upload() {
      if (!this.file || !this.file.name) {
        return;
      }

      var reader = new FileReader();
      reader.readAsText(this.file);
      reader.onloadend = async () => {
        let config = JSON.parse(reader.result);
        this.reset();
        let path = Object.keys(config.paths)[0];
        config = config.paths[path];
        let type = Object.keys(config)[0];
        config = config[type];
        config.type = type;
        config.path = path;
        this.mapRequest(config);
        this.$message({
          message: this.$t("templateImportSuccess"),
          type: "success",
          showClose:true
        });
      };
    },

    importAPI(config) {
      this.reset();
      this.mapRequest(config, true);
    },
    mapRequest(config, isNocodb) {
      let defaultFields = {
        string: "",
        integer: 0,
        number: 0,
        boolean: false,
        array: [],
        object: null,
      };
      // let path = Object.keys(config.paths)[0];
      // config = config.paths[path];
      // let type = Object.keys(config)[0];
      // config = config[type];
      if (isNocodb) {
        this.application.configJson.url =
            process.env.VUE_APP_NOCODB_API.replace(/\/$/, "") + config.path;
      } else {
        this.application.configJson.url = config.path;
      }
      this.application.configJson.method = config.type.toUpperCase();
      let mapParameter = (parameter) => {
        return {
          key: parameter.name,
          value: parameter.example,
          label: parameter.description,
          type: "value",
          editable: true,
          hint: "",
        };
      };

      let mapField = (field) => {
        let value = defaultFields[field.type];
        let result = {
          key: field.key,
          value,
          label: "",
          type: "value",
          editable: true,
          hint: "",
        };

        if (isNocodb) {
          result.type = "variable";
          result.value = result.key;
        }

        return result;
      };

      let parameters = config.parameters || [];
      let headers = parameters
          .filter((parameter) => parameter.in === "header")
          .map(mapParameter);
      this.application.configJson.headerTemplate = headers;
      if (isNocodb) {
        this.application.configJson.headerTemplate.push(
            {
              key: "xc-token",
              value: "xc-token",
              label: "",
              type: "variable",
              editable: false,
              hint: "",
            },
            {
              key: "accept",
              value: "application/json",
              label: "",
              type: "value",
              editable: false,
              hint: "",
            },
            {
              key: "Content-Type",
              value: "application/json",
              label: "",
              type: "value",
              editable: false,
              hint: "",
            }
        );
      }

      let queries = parameters
          .filter(
              (parameter) =>
                  parameter.in === "query" && parameter.name.indexOf("nested") !== 0
          )
          .map(mapParameter);
      this.application.configJson.queryTemplate = queries;

      let schema = config.responses[200] || config.responses[201];
      if (schema.content) {
        schema = schema.content["application/json"].schema;
      }

      if (schema["$ref"]) {
        schema = this.findReference(schema["$ref"]);
      }
      let response = schema.properties || {};
      let fields = Object.keys(response).map((key) => {
        let value = response[key];
        value.key = key;
        return value;
      });
      let responses = fields
          .map(mapField)
          .filter((field) => field.key.indexOf("nc_") != 0);

      this.application.configJson.responseBodyTemplate = responses;

      let request = {};
      if (config.requestBody && config.requestBody.content) {
        schema = config.requestBody.content["application/json"].schema;
        if (schema["$ref"]) {
          schema = this.findReference(schema["$ref"]);
        }
        request = schema.properties || {};
      }

      fields = Object.keys(request).map((key) => {
        let value = request[key];
        value.key = key;
        return value;
      });

      if (isNocodb) {
        fields = fields.filter(
            (field) => ["Id", "CreatedAt", "UpdatedAt"].indexOf(field.key) < 0
        );
      }
      let requests = fields.map(mapField);

      this.application.configJson.requestBodyTemplate = requests;

      let data = {};
      fields.forEach((field) => {
        let value = defaultFields[field.type];
        data[field.key] = value;
      });
      this.application.configJson.requestBody = JSON.stringify(data);
      this.application.configJson.statusCode = "statusCode";
      this.application.configJson.response = "response";
    },
    findReference(path) {
      let paths = path.split("/").filter((item) => item !== "#");
      let result = this.types;
      paths.forEach((item) => {
        result = result[item];
      });
      return result;
    },
  },
};
</script>

<style scoped>
/deep/ .el-table .el-table__cell:first-child .cell {
  padding: 0;
}

/deep/ .el-table .el-table__cell:first-child .cell .el-checkbox {
  margin-bottom: 0;
}

/deep/ .el-table .el-table__cell:first-child .cell .el-checkbox .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #FF7754;
  border-color: #FF7754;
}

/deep/ .el-table .el-table__cell:first-child .cell .el-checkbox .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #FF7754;
  border-color: #FF7754;
}

.v-input.json-area {
  margin-top: 0;
  margin-bottom: 2px;
  padding: 0;
}

.v-input.json-area:deep(.v-text-field__slot) {
  margin: 4px;
}

.badge.badge-variable {
  background-color: #57928d;
  border: none;
  color: #ffffff;
}

.badge.badge-value {
  background-color: #444262;
  border: none;
  color: #ffffff;
}
</style>
