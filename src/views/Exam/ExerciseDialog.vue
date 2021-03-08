<template>
  <div class="exercise-dialog__wrapper">
    <v-dialog
      v-model="syncedShowExercise"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar color="indigo darken-2" dark>
          <v-btn @click="closeDialog" icon dark>
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>在线刷题</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn @click="exportPDF" dark text>
            <v-icon>mdi-file-pdf-outline</v-icon>
          </v-btn>
        </v-toolbar>

        <div v-if="!finished" class="exercise-dialog__display">
          <v-card class="ma-8 pa-4">

            <!-- 题目进度条 -->
            <v-row>
              <v-col class="d-flex align-center" :cols="11">
                <v-progress-linear
                  :value="curProgress"
                  color="indigo darken-2"
                  height="10"
                  striped
                ></v-progress-linear>
              </v-col>
              <v-col class="d-flex align-center justify-center" :cols="1">
                {{ curQues + 1 }} / {{ syncedGeneratedQuestions.length }}
              </v-col>
            </v-row>

            <!-- 题目与选项 -->
            <div class="exercise-dialog__question-wrapper mt-4">
              <p
                v-html="`${curQues + 1}. ${syncedGeneratedQuestions[curQues].title}`"
              ></p>
              <v-row
                class="px-4"
                v-for="(choice, index) in syncedGeneratedQuestions[curQues].choices"
                :key="index"
              >
                <v-checkbox
                  v-model="allChoices[curQues]"
                  :label="`${String.fromCharCode(index + 65)}. ${choice}`"
                  :value="choice"
                ></v-checkbox>
              </v-row>
            </div>

            <!-- 操作按钮 -->
            <div class="pa-4 d-flex justify-center">
              <v-btn :disabled="curQues === 0" class="mr-4" color="success" @click="changeQues(curQues - 1)" dark>上一题</v-btn>
              <v-btn v-if="curQues !== syncedGeneratedQuestions.length - 1" color="indigo darken-2" @click="changeQues(curQues + 1)" dark>下一题</v-btn>
              <v-btn v-else color="indigo darken-2" @click="checkAnswer" dark>交卷</v-btn>
            </div>
          </v-card>
        </div>

        <div v-else class="exercise-dialog__display pa-8">
          <div>
            <p>本次做题：{{ syncedGeneratedQuestions.length }}</p>
            <p>本次错误：{{ curWrong }}</p>
            <p>本次得分：{{ curScore }} / {{ totalScore }}</p>
          </div>

          <v-divider></v-divider>

          <div v-for="(ques, index) in syncedGeneratedQuestions" :key="index">
            <v-card class="mt-4 pa-4" v-if="!correctness[index]">
              <p v-html="`${index + 1}. ${ques.title}`"></p>
              <p
                v-for="(choice, index) in ques.choices"
                :key="index"
                v-html="`${String.fromCharCode(index + 65)}. ${choice}`"
              >
              </p>
              <p>正确选项：{{ getAnswersMark(ques.choices, ques.answers) }}</p>
              <p class="mb-0">我的选项：{{ getAnswersMark(ques.choices, allChoices[index]) }}</p>
            </v-card>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, PropSync } from 'vue-property-decorator'
import { remote } from 'electron'
import { isEqual } from 'lodash'
import { join } from 'path'
import fse from 'fs-extra'

import '@/assets/q-display.scss'
import Question from '@/interfaces/Question'

const { BrowserWindow, dialog } = remote

@Component
export default class ExerciseDialog extends Vue {
  curQues = 0
  allChoices: Array<Array<string>> = []
  correctness: Array<boolean> = []
  finished = false
  curWrong = 0
  curScore = 0
  totalScore = 0

  get curProgress (): number {
    return (this.curQues + 1) / this.syncedGeneratedQuestions.length * 100
  }

  closeDialog (): void {
    this.syncedGeneratedQuestions = []
    this.syncedShowExercise = false
  }

  changeQues (ques: number): void {
    this.curQues = ques
  }

  checkAnswer (): void {
    for (let i = 0; i < this.allChoices.length; i++) {
      if (this.allChoices[i].length === 0) { return this.$msg.warning('还有题目未进行选择') }
    }

    // 检查答案是否正确
    for (let i = 0; i < this.syncedGeneratedQuestions.length; i++) {
      const answers = this.syncedGeneratedQuestions[i].answers
      const score = this.syncedGeneratedQuestions[i].score
      const curChoices = this.allChoices[i]

      if (isEqual(answers, curChoices)) {
        this.correctness[i] = true
        this.curScore += score
      } else {
        this.correctness[i] = false
        this.curWrong++
      }

      this.totalScore += score
    }

    this.finished = true
  }

  getAnswersMark (choices: Array<string>, answers: Array<string>): string {
    let result = ''
    for (let i = 0; i < answers.length; i++) {
      const index = choices.indexOf(answers[i])
      result += String.fromCharCode(index + 65)
    }
    return result
  }

  async exportPDF (): Promise<any> {
    const contents = this.syncedGeneratedQuestions
    const name = (this.$parent.$parent as any).curActive[0].name
    const userDataPath = remote.app.getPath('userData')
    const path = join(userDataPath, 'print.html')

    // 创建 html template
    let quesHtml = ''
    for (let i = 0; i < contents.length; i++) {
      const content = contents[i]
      let html = `${i + 1}. ${content.title}`

      if (i !== 0) {
        html = '<br>' + html
      }

      // 添加选项
      for (let j = 0; j < content.choices.length; j++) {
        const choice = content.choices[j]
        html += `<br>${String.fromCharCode(j + 65)}. ${choice}`
      }

      html += '<br>'
      quesHtml += html
    }
    const template = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${name}</title><style>table {margin-top: 12px;margin: 12px auto;padding: 0;border-collapse: collapse;word-break: initial;}table tr {border-top: 1px solid #dfe2e5;margin: 0;padding: 0;}table tr:nth-child(2n), thead {background-color: #f8f8f8;}table tr th {font-weight: bold;border: 1px solid #dfe2e5;border-bottom: 0;margin: 0;padding: 6px 13px;}table tr td {border: 1px solid #dfe2e5;margin: 0;padding: 6px 13px;}table tr th:first-child, table tr td:first-child {margin-top: 0;}table tr th:last-child, table tr td:last-child {margin-bottom: 0;}ul {margin: 16px;}ul li {margin: 8px 0;}ul.todo-list {list-style-type: none;margin: 16px 0px;padding: 0;}ul.todo-list li {margin: 8px 0;}ul.todo-list li label {display: flex;align-items: center;}ul.todo-list li label input {margin-right: 4px;}code:not([class]) {background-color: #ddd;}code[class^="language"] {background-color: transparent !important;} .image_resized{max-width:100%;box-sizing:border-box;display:flex;justify-content:center;align-items:center;margin-top:16px}.image_resized img{display:block;width:100%}</style></head><body>${quesHtml}</body></html>`
    await fse.outputFile(path, template)

    // 导出 pdf
    let pdfWin: Electron.BrowserWindow | null = new BrowserWindow({
      frame: true,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        nativeWindowOpen: true
      }
    })
    pdfWin.webContents.once('did-finish-load', async () => {
      const data = await (pdfWin as Electron.BrowserWindow).webContents.printToPDF({ pageSize: 'A4' })

      const { filePath } = await dialog.showSaveDialog({
        title: '导出生成题目',
        defaultPath: name,
        filters: [
          { name: 'questions', extensions: ['pdf'] }
        ],
        message: `${name}.pdf`
      })

      if (filePath) {
        await fse.outputFile(filePath, data)
      }
      (pdfWin as Electron.BrowserWindow).close()
      pdfWin = null
    })
    pdfWin.loadURL(`file://${path}`)
  }

  created (): void {
    this.allChoices = new Array(this.syncedGeneratedQuestions.length)
    for (let i = 0; i < this.allChoices.length; i++) {
      this.allChoices[i] = []
    }

    this.correctness = new Array(this.syncedGeneratedQuestions.length)
  }

  @PropSync('generatedQuestions', { type: Array }) syncedGeneratedQuestions!: Array<Question>
  @PropSync('showExercise', { type: Boolean }) syncedShowExercise!: boolean
}
</script>

<style lang="scss" scoped>
.exercise-dialog__display {
  height: calc(100vh - 64px);
  overflow: scroll;
}
</style>
