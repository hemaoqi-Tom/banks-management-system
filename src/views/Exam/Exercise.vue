<template>
  <v-app class="exercise__wrapper">

    <v-stepper
      class="exercise__stepper"
      v-model="curStep"
      vertical
    >
      <v-breadcrumbs :items="[{ text: '题库管理系统' }, { text: '在线刷题' }]">
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
        请设置生成相关设置
        <small>Set generation-related attributes</small>
      </v-stepper-step>

      <v-stepper-content step="2">
        <v-card class="ma-4">
          <v-form class="pa-4">
            <v-row>
              <v-col :cols="3">
                <v-select
                  v-model="filters.category"
                  :items="categories"
                  label="按分类筛选"
                ></v-select>
              </v-col>
              <v-col :cols="3">
                <v-select
                  v-model="filters.difficulty"
                  :items="['全部', '简单', '中等', '较难']"
                  label="按难度筛选"
                ></v-select>
              </v-col>
              <v-col :cols="6">
                <v-slider
                  class="align-center"
                  v-model="generateAmount"
                  label="生成数量"
                  :max="maxAmount"
                  min="0"
                  hide-details
                >
                  <template v-slot:append>
                    <v-text-field
                      disabled
                      v-model="generateAmount"
                      class="mt-0 pt-0 exercise__form-number-input"
                      type="number"
                    ></v-text-field>
                  </template>
                </v-slider>
              </v-col>
            </v-row>
          </v-form>
        </v-card>

        <div class="ma-4">
          <v-btn color="indigo darken-2" @click="showExerciseDialog" dark>开始做题</v-btn>
          <v-btn @click="curStep = 1" text>重新选择题库</v-btn>
        </div>
      </v-stepper-content>
    </v-stepper>

    <ExerciseDialog
      v-if="generatedQuestions.length !== 0"
      :showExercise.sync="showExercise"
      :generatedQuestions.sync="generatedQuestions"
    />

  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { cloneDeep } from 'lodash'

import randomPick from '@/utils/randomPick'

import BankBrowser from '@/components/BankBrowser.vue'
import ExerciseDialog from './ExerciseDialog.vue'

import Question from '@/interfaces/Question'
import Folder from '@/interfaces/Folder'
import File from '@/interfaces/File'

@Component({ components: { BankBrowser, ExerciseDialog } })
export default class Exercise extends Vue {
  curActive: Array<File | Folder> = []
  categories: Array<string> = []
  filters = {
    category: '全部',
    difficulty: '全部'
  }

  generateAmount = 0
  curStep = 1
  showExercise = false
  generatedQuestions: Array<Question> = []

  get maxAmount (): number {
    return this.filteredContents.length
  }

  get filteredContents (): Array<Question> {
    if (
      this.curActive.length === 0 ||
      this.curActive[0].type === 'folder'
    ) { return [] }

    let contents = cloneDeep((this.curActive[0] as File).contents)

    if (!(this.filters.category === '全部')) {
      contents = contents.filter(ques => ques.category === this.filters.category)
    }
    if (!(this.filters.difficulty === '全部')) {
      contents = contents.filter(ques => ques.difficulty === this.filters.difficulty)
    }

    return contents
  }

  selectBank (): void {
    const curActive = this.curActive

    if (curActive.length === 0) {
      return this.$msg.error('请选择题库')
    }
    if (curActive[0].type === 'folder') {
      return this.$msg.error('请选择题库')
    }

    const contents = (curActive[0] as File).contents
    const categories = ['全部']
    for (let i = 0; i < contents.length; i++) {
      const category = contents[i].category
      if (
        !categories.includes(category) &&
        category !== ''
      ) {
        categories.push(category)
      }
    }

    this.categories = categories
    this.curStep = 2
  }

  showExerciseDialog (): void {
    if (this.generateAmount === 0) {
      return this.$msg.error('没有可以生成的题目')
    }

    const contents = this.filteredContents

    // 随机抽取
    const generatedQuestions = randomPick<Question>(contents, this.generateAmount)

    this.generatedQuestions = generatedQuestions
    this.showExercise = true
  }
}
</script>

<style lang="scss" scoped>
.exercise__stepper {
  height: 100vh;
}

.exercise__form-number-input {
  position: relative;
  top: 10px;
  width: 60px;
}
</style>
