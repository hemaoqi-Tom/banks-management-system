<template>
  <div class="actions__wrapper">

    <!-- 右侧导航栏 -->
    <v-navigation-drawer color="indigo darken-2" mini-variant permanent right dark app>
      <v-list>
        <v-tooltip v-for="(action, index) in actions" :key="action.title" left>
          <!-- 导航栏按钮与操作 -->
          <template v-slot:activator="{ on, attrs }">
            <v-list-item v-bind="attrs" v-on="on" @click="handleAction(index)">
              <v-list-item-icon>
                <v-icon>{{ action.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ action.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <!-- 导航栏提示 -->
          <span>{{ action.title }}</span>
        </v-tooltip>
      </v-list>
    </v-navigation-drawer>

    <!-- 提交表单 -->
    <SubmitDialog :showSubmit.sync="showSubmit"/>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import SubmitDialog from './SubmitDialog.vue'
import Question from '@/interfaces/Question'

@Component({ components: { SubmitDialog } })
export default class Actions extends Vue {
  actions = [
    {
      title: '提取',
      icon: 'mdi-folder-upload-outline'
    },
    {
      title: '查看上一个',
      icon: 'mdi-arrow-left'
    },
    {
      title: '查看下一个',
      icon: 'mdi-arrow-right'
    },
    {
      title: '提交',
      icon: 'mdi-text-box-check-outline'
    }
  ]

  showSubmit = false

  get extracted (): Array<Question> {
    return this.$store.state.BatchImportModule.extracted
  }

  get curRender (): number {
    return this.$store.state.BatchImportModule.curRender
  }

  handleAction (index: number): void {
    const actions = [
      this.extract,
      this.checkPrev,
      this.checkNext,
      this.submit
    ]
    actions[index]()
  }

  extract (): void {
    /* 从粘贴的 Word 中提取信息 */
    const editorData = this.editorData

    // 按照 <p>&nbsp;</p> 划分段落
    const qSep = '<p>&nbsp;</p>'
    const qsElem = editorData
      .split(qSep)
      .filter(item => item !== '' && item !== qSep)
    // 删除万恶的空格符 &nbsp;
    for (let i = 0; i < qsElem.length; i++) {
      qsElem[i] = qsElem[i].replace(/&nbsp;\s?/g, '')
    }

    // 按照选项划分标题
    /* eslint-disable */
    const choiceMarker = /<p>[A-J][\.．、　,]?\s?/g
    /* eslint-enable */
    const qs = qsElem.map((q: string): Array<string> => q.split(choiceMarker))

    // 格式化
    const formatter = (str: string): string => str
      .replace(/<p>/g, '')
      .replace(/<\/p>/g, '')
    for (let row = 0; row < qs.length; row++) {
      /* eslint-disable */
      const titleMarker = /^\d{0,2}[\.．、　]?\s?/
      /* eslint-enable */
      qs[row][0] = formatter(qs[row][0]).replace(titleMarker, '')
      for (let col = 0; col < qs[row].length; col++) {
        qs[row][col] = formatter(qs[row][col])
          .replace('()', '(    )')
          .replace('（）', '（    ）')
      }
    }

    // 整理结果
    const extracted = qs.map(q => ({
      title: q[0],
      choices: q.slice(1),
      answers: [],
      score: 2,
      difficulty: '',
      category: ''
    }))

    this.$store.commit('initExtracted', extracted)
    this.$store.commit('setCurRender', extracted.length !== 0 ? 0 : -1)
  }

  checkPrev (): void {
    const curRender = this.curRender
    this.$store.commit('setCurRender', curRender - 1)
  }

  checkNext (): void {
    const curRender = this.curRender
    this.$store.commit('setCurRender', curRender + 1)
  }

  submit (): void {
    if (this.extracted.some(q => q.answers.length === 0)) {
      return this.$msg.error('存在未设置答案的题目，无法提交')
    }
    if (this.extracted.length === 0) {
      return this.$msg.error('提取结果为空，无法提交')
    }
    this.showSubmit = true
  }

  @Prop(String) readonly editorData!: string
}
</script>
