<template>
  <v-app class="single-import__wrapper">

    <v-stepper
      class="single-import__stepper"
      v-model="curStep"
      vertical
    >
      <v-breadcrumbs :items="[{ text: '题库管理系统' }, { text: '导入题库' }, { text: '单独导入' }]">
        <template v-slot:divider>
          <v-icon>mdi-forward</v-icon>
        </template>
      </v-breadcrumbs>

      <!-- 第一步 选择题库 -->
      <v-stepper-step
        :complete="curStep > 1"
        step="1"
      >
        请选择题库
        <small>Select bank</small>
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-card class="ma-4">
          <BankBrowser
            msg=""
            subMsg=""
            :curActive.sync="curActive"
          />
        </v-card>

        <div class="ma-4">
          <v-btn color="indigo darken-2" @click="selectBank" dark>选择题库</v-btn>
        </div>
      </v-stepper-content>

      <!-- 第二步 生成相关设置 -->
      <v-stepper-step
        :complete="curStep > 2"
        step="2"
      >
        请输入题目内容
        <small>Input question-related contents</small>
      </v-stepper-step>

      <v-stepper-content step="2">
        <v-card class="ma-4 pa-4">

          <v-form ref="importForm" v-model="formValid">
            <v-text-field
              v-model="curQues.title"
              label="题目"
              :rules="[ value => !!value || '题目不能为空' ]"
            ></v-text-field>
            <v-text-field
              v-for="(choice, index) in curQues.choices"
              :key="index"
              :rules="[ value => !!value || '选项不能为空' ]"
              v-model="curQues.choices[index]"
              :label="`选项 ${String.fromCharCode(index + 65)}`"
              append-icon="mdi-delete-outline"
              @click:append="deleteChoice(choice)"
            ></v-text-field>
            <v-btn class="mb-4" width="100%" @click="addChoice">添加选项</v-btn>
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

          <div class="ma-4">
            <v-btn color="indigo darken-2" @click="submit" dark>提交</v-btn>
            <v-btn @click="curStep = 1" text>重新选择题库</v-btn>
          </div>
        </v-card>
      </v-stepper-content>
    </v-stepper>

  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import BankBrowser from '@/components/BankBrowser.vue'

import Question from '@/interfaces/Question'
import Folder from '@/interfaces/Folder'
import File from '@/interfaces/File'

type VForm = Vue & { validate: () => boolean; resetValidation: () => void }

@Component({ components: { BankBrowser } })
export default class SingleImport extends Vue {
  curStep = 1
  curActive: Array<File | Folder> = []
  curQues: Question = {
    title: '',
    choices: ['', '', '', ''],
    answers: [],
    category: '',
    difficulty: '',
    score: 2
  }

  formValid = false

  get importForm (): VForm {
    return this.$refs.importForm as VForm
  }

  selectBank (): void {
    const curActive = this.curActive

    if (curActive.length === 0) {
      return this.$msg.error('请选择题库')
    }
    if (curActive[0].type === 'folder') {
      return this.$msg.error('请选择题库')
    }

    this.curStep = 2
  }

  addChoice (): void {
    this.curQues.choices.push('')
  }

  deleteChoice (choice: string): void {
    const { choices, answers } = this.curQues

    if (choices.length <= 2) {
      return this.$msg.error('选项不能小于两个')
    }

    choices.splice(choices.indexOf(choice), 1)

    if (answers.includes(choice)) {
      answers.splice(answers.indexOf(choice), 1)
    }
  }

  submit (): void {
    // 表单验证
    const importForm = this.importForm
    if (!importForm.validate()) {
      return this.$msg.error('题目相关信息不完整')
    }

    const choices = this.curQues.choices
    if (
      Array.from(new Set(choices)).length !== choices.length
    ) {
      return this.$msg.error('存在重复的选项')
    }

    if (this.curQues.answers.length === 0) {
      return this.$msg.error('未选择题目答案')
    }

    // 提交
    const { name, path } = this.curActive[0]
    this.$store.commit('insertIntoBanks', { name, path, extracted: [this.curQues] })

    // 清空当前的数据绑定
    this.$msg.success('提交成功')
    this.curQues = {
      title: '',
      choices: ['', '', '', ''],
      answers: [],
      category: '',
      difficulty: '',
      score: 2
    }
    importForm.resetValidation()
  }
}
</script>

<style lang="scss" scoped>
.single-import__stepper {
  height: 100vh;
  overflow: scroll;
}
</style>
