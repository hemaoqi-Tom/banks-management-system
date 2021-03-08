<template>
  <div class="set-ques-attr__wrapper">

    <!-- 标题栏 -->
    <div class="set-ques-attr__title">
      <span>修改属性</span>
    </div>

    <!-- 属性设置窗口 -->
    <div class="set-ques-attr__form-wrapper pa-4">
      <v-form v-if="hasExtracted">
        <v-row>
          <v-col :cols="4">
            <v-text-field
              v-model="category"
              hint="例如“二次型”"
              label="类别"
              clearable
            ></v-text-field>
          </v-col>
          <v-col :cols="4">
            <v-text-field
              v-model="score"
              hint="例如 2"
              label="分值"
              clearable
            ></v-text-field>
          </v-col>
          <v-col :cols="4">
            <v-select
              v-model="difficulty"
              :items="['简单', '中等', '较难']"
              label="题目难度"
            ></v-select>
          </v-col>
        </v-row>
        <v-select
          v-model="answers"
          :items="extracted[curRender].choices"
          attach
          chips
          label="正确答案(必选)"
          multiple
        ></v-select>
      </v-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Question from '@/interfaces/Question'

@Component
export default class SetQuesAttr extends Vue {
  get extracted (): Array<Question> {
    return this.$store.state.BatchImportModule.extracted
  }

  get curRender (): number {
    return this.$store.state.BatchImportModule.curRender
  }

  get hasExtracted (): boolean {
    return this.extracted.length !== 0
  }

  get category (): string {
    return this.extracted[this.curRender].category
  }

  set category (value) {
    this.$store.commit('setExtracted', { key: 'category', value })
  }

  get score (): number {
    return this.extracted[this.curRender].score
  }

  set score (value) {
    this.$store.commit('setExtracted', { key: 'score', value })
  }

  get difficulty (): string {
    return this.extracted[this.curRender].difficulty
  }

  set difficulty (value) {
    this.$store.commit('setExtracted', { key: 'difficulty', value })
  }

  get answers (): Array<string> {
    return this.extracted[this.curRender].answers
  }

  set answers (value) {
    this.$store.commit('setExtracted', { key: 'answers', value })
  }
}
</script>

<style lang="scss" scoped>
.set-ques-attr__title {
  height: 39.672px;
  background-color: #fafafa;
  border-bottom: 1px solid rgb(196, 196, 196);
  padding-left: 10px;

  span {
    line-height: 39.672px;
    font-weight: 800;
  }
}

.set-ques-attr__form-wrapper {
  height: 100%;
  overflow: scroll;
}
</style>
