<template>
  <div class="file-view__wrapper">
    <!-- 详细信息展示界面 -->
    <v-dialog
      transition="dialog-bottom-transition"
      v-model="syncedShowFileView"
      fullscreen
      hide-overlay
    >
      <v-card>

        <!-- 工具栏 -->
        <v-toolbar color="indigo darken-2" dark>
          <v-btn @click="syncedShowFileView = false" icon dark>
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>详细信息</v-toolbar-title>

          <v-spacer></v-spacer>

          <!-- 搜索框 -->
          <v-text-field
            v-model="quesSearch"
            label="搜索题目"
            class="mx-2"
            single-line
            hide-details
          ></v-text-field>

          <!-- 题库导出 -->
          <v-btn @click="bankExport" text>题库导出</v-btn>
        </v-toolbar>

        <v-breadcrumbs :items="[{ text: '题库管理系统' }, { text: '题库管理' }, { text: '详细信息' }]">
          <template v-slot:divider>
            <v-icon>mdi-forward</v-icon>
          </template>
        </v-breadcrumbs>

        <!-- 题库文件全览 -->
        <div class="mx-4">
          <!-- 题目全览 -->
          <v-data-table
            :headers="quesHeaders"
            :items="quesItems"
            :search="quesSearch"
            item-key="title"
            show-expand
          >
            <!-- 题目栏 -->
            <!-- eslint-disable -->
            <template v-slot:item.title="{ item: ques }">
              <div class="my-4" v-html="ques.title"></div>
            </template>
            <!-- eslint-enable -->
            <!-- 下拉栏 -->
            <template v-slot:expanded-item="{ headers, item: ques }">
              <td :colspan="headers.length">
                <p class="my-4" v-html="`题目：${ques.title}`"></p>
                <p class="my-4"
                  v-for="(choice, index) in ques.choices"
                  :key="index"
                  :class="ques.answers.includes(choice) ? 'file-view__correct-answer' : ''"
                  v-html="`${String.fromCharCode(index + 65)}. ${choice}`"
                ></p>
              </td>
            </template>
            <!-- 操作栏 -->
            <!-- eslint-disable -->
            <template v-slot:item.action="{ item: ques }">
              <v-btn class="mx-2" color="indigo darken-2" @click="showEditDialog(ques.title)" dark small>编辑</v-btn>
              <v-btn class="mx-2" color="error" @click="showDeleteDialog(ques.title)" dark small>删除</v-btn>
            </template>
            <!-- eslint-enable -->
          </v-data-table>
        </div>
      </v-card>
    </v-dialog>

    <!-- 编辑窗口 -->
    <v-dialog
      v-model="showEdit"
      persistent
      max-width="800px"
    >
      <v-card>
        <v-card-title>编辑当前题目</v-card-title>
        <v-card-subtitle>Edit current question</v-card-subtitle>

        <v-data-table
          v-model="curEditRow"
          :headers="editHeaders"
          :items="editItems"
          class="elevation-0 mx-4"
          item-key="title"
          single-select
          show-select
          hide-default-footer
        >
          <!-- eslint-disable -->
          <template v-slot:item.value="{ item }">
            <p class="mt-4" v-html="item.value"></p>
          </template>
          <!-- eslint-enable -->
        </v-data-table>

        <div class="mx-4 file-view__ckeditor_wrapper">
          <ckeditor
            ref="ckeditor"
            :editor="editor"
            v-model="editorData"
            :config="editorConfig"
          ></ckeditor>
        </div>

        <v-form class="px-4">
          <v-select
            v-model="curQues.answers"
            :items="curQues.choices"
            label="正确答案"
            attach
            chips
            multiple
          ></v-select>
          <v-row>
            <v-col :cols="4">
              <v-text-field
                v-model="curQues.category"
                label="类别"
              ></v-text-field>
            </v-col>
            <v-col :cols="4">
              <v-text-field
                v-model="curQues.score"
                label="分值"
              ></v-text-field>
            </v-col>
            <v-col :cols="4">
              <v-select
                v-model="curQues.difficulty"
                :items="['简单', '中等', '较难']"
                label="题目难度"
              ></v-select>
            </v-col>
          </v-row>
        </v-form>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="showEdit = false" text>放弃</v-btn>
          <v-btn color="success" @click="addChoice" text>添加选项</v-btn>
          <v-btn color="error" @click="deleteChoice" text>删除选项</v-btn>
          <v-btn color="indigo darken-2" @click="handleEdit" text>保存编辑</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 删除确认窗口 -->
    <v-dialog v-model="showDelete" persistent max-width="300px">
      <v-card>
        <v-card-title class="headline">
          用户确认
        </v-card-title>
        <v-card-text>确定要删除吗？</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="showDelete = false" text>放弃</v-btn>
          <v-btn color="error" @click="handleDelete" text>删除</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, PropSync, Prop, Watch } from 'vue-property-decorator'
import { cloneDeep } from 'lodash'
import { remote } from 'electron'
import fse from 'fs-extra'

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'
import CKEditorConfig from '@/plugins/ckeditorConfig'

import '@/assets/q-display.scss'

import Question from '@/interfaces/Question'
import Folder from '@/interfaces/Folder'
import File from '@/interfaces/File'

const { dialog } = remote

interface CurrentQuestion {
  oldTitle: string;
  newTitle: string;
  choices: Array<string>;
  answers: Array<string>;
  category: string;
  score: number;
  difficulty: string;
}

@Component
export default class FileView extends Vue {
  quesHeaders = [
    { text: '题目', value: 'title', width: document.body.clientWidth - 485 },
    { text: '分类', value: 'category' },
    { text: '难度', value: 'difficulty' },
    { text: '分值', value: 'score' },
    { text: '操作', value: 'action' }
  ]

  quesSearch = ''
  // 修改 or 删除
  showEdit = false
  showDelete = false
  curQues: CurrentQuestion = {
    oldTitle: '',
    newTitle: '',
    choices: [],
    answers: [],
    category: '',
    score: 0,
    difficulty: ''
  }

  // 编辑窗口表格
  curEditRow: Array<{ title: string; value: string }> = []
  editHeaders = [
    { text: '项目', value: 'title', width: '80px' },
    { text: '值', value: 'value' }
  ]

  // 编辑器
  editor = ClassicEditor
  editorConfig = CKEditorConfig
  editorData = ''

  get quesItems (): Array<Question> {
    return (this.curActive[0] as File).contents
  }

  get editItems (): Array<{ title: string; value: string }> {
    const curQues = this.curQues

    if (JSON.stringify(curQues) === '{}') {
      return []
    } else {
      const choices = curQues.choices
      return [
        { title: '题目', value: curQues.newTitle },
        ...choices.map((choice, index) => {
          const mark = String.fromCharCode(index + 65)
          return { title: `选项 ${mark}`, value: choice }
        })
      ]
    }
  }

  getCurQues (title: string): void {
    const curQues: any = cloneDeep(
      this.quesItems.filter(ques => ques.title === title)[0]
    )
    delete curQues.title
    curQues.oldTitle = curQues.newTitle = title
    this.curQues = curQues
  }

  deleteChoice (): void {
    if (this.curEditRow.length === 0) {
      return this.$msg.error('请选择待删除的选项')
    }

    const { title, value } = this.curEditRow[0]
    if (title === '题目') {
      return this.$msg.error('不能删除题目')
    }

    const choice = value
    const { choices, answers } = this.curQues

    if (choices.length <= 2) {
      return this.$msg.error('选项不能小于两个')
    }

    choices.splice(choices.indexOf(choice), 1)

    if (answers.includes(choice)) {
      answers.splice(answers.indexOf(choice), 1)
    }
  }

  addChoice (): void {
    this.curQues.choices.push('')
  }

  showEditDialog (title: string): void {
    this.getCurQues(title)
    this.showEdit = true
  }

  showDeleteDialog (title: string): void {
    this.getCurQues(title)
    this.showDelete = true
  }

  handleEdit (): void {
    const { oldTitle: title } = cloneDeep(this.curQues)
    const { name, path } = this.curActive[0]
    const newQues: any = cloneDeep(this.curQues)
    newQues.title = newQues.newTitle
    delete newQues.oldTitle
    delete newQues.newTitle

    this.$store.commit('mutateQues', { name, path, title, newQues })
    this.$store.commit('writeBackBanks')
    this.showEdit = false
  }

  handleDelete (): void {
    const { oldTitle: title } = cloneDeep(this.curQues)
    const { name, path } = this.curActive[0]

    this.$store.commit('deleteQues', { name, path, title })
    this.$store.commit('writeBackBanks')
    this.showDelete = false
  }

  async bankExport (): Promise<any> {
    const name = this.curActive[0].name
    const curActiveCopy: any = cloneDeep(this.curActive[0])
    delete curActiveCopy.path
    const content = JSON.stringify(curActiveCopy)

    const { filePath } = await dialog.showSaveDialog({
      title: '导出题库文件',
      defaultPath: name,
      filters: [
        { name: 'Banks file', extensions: ['json'] }
      ],
      message: `${name}.json`
    })

    if (filePath) {
      await fse.outputFile(filePath, content)
    }
  }

  @PropSync('showFileView', { type: Boolean }) syncedShowFileView!: string
  @Prop(Array) readonly curActive!: Array<File | Folder>

  @Watch('curEditRow')
  onCurEditRowChanged (newRow: any) {
    if (newRow.length === 0) { return false }
    this.editorData = newRow[0].value
  }

  @Watch('editorData')
  onEditorDataChanged (newVal: string) {
    const curEditRow = this.curEditRow

    // 如果未选择编辑对象
    if (curEditRow.length === 0) {
      return false
    }

    // 选择了编辑对象
    const title = (curEditRow[0] as any).title
    const value = newVal
      .replace(/&nbsp;\s?/g, '')
      .replace(/<p>/g, '')
      .replace(/<\/p>/g, '')
    if (title === '题目') {
      this.curQues.newTitle = value
    } else {
      const index = title[3].charCodeAt() - 65
      this.$set(this.curQues.choices, index, value)
    }
  }
}
</script>

<style lang="scss">
.file-view__correct-answer {
  background-color: #A5D6A7;
}

.file-view__ckeditor_wrapper .ck-editor__editable_inline {
  height: 150px !important;
}
</style>
