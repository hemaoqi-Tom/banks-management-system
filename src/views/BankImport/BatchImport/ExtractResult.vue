<template>
  <div class="extract-result__wrapper">

    <!-- 标题栏 -->
    <div class="extract-result__title">
      <span>提取结果</span>
      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            class="extract-result__title-alert"
            v-bind="attrs"
            v-on="on"
          >mdi-alert-circle-outline</v-icon>
        </template>
        <span>如果提取的结果有问题，请于左边修改</span>
      </v-tooltip>
    </div>

    <!-- 结果预览栏目 -->
    <div class="extract-result__result-wrapper pa-4">
      <div class="extract-result__result-display" v-if="hasExtracted">
        <p v-html="extractResultTitle"></p>
        <p
          v-for="(choice, index) in extractResultChoices"
          :key="choice"
          v-html="`${String.fromCharCode(index + 65)}. ${choice}`"
        ></p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Question from '@/interfaces/Question'
import '@/assets/q-display.scss'

@Component
export default class ExtractResult extends Vue {
  get extracted (): Array<Question> {
    return this.$store.state.BatchImportModule.extracted
  }

  get curRender (): number {
    return this.$store.state.BatchImportModule.curRender
  }

  get hasExtracted (): boolean {
    return this.extracted.length !== 0
  }

  get extractResultTitle (): string {
    return `${this.curRender + 1}. ${this.extracted[this.curRender].title}`
  }

  get extractResultChoices (): Array<string> {
    return this.extracted[this.curRender].choices
  }
}
</script>

<style lang="scss" scoped>
.extract-result__title {
  height: 39.672px;
  background-color: #fafafa;
  border-bottom: 1px solid rgb(196, 196, 196);
  padding-left: 10px;

  span {
    line-height: 39.672px;
    font-weight: 800;
  }

  .extract-result__title-alert {
    display: inline-block;
    position: relative;
    top: -2.5px;
    margin-left: 2px;
    font-size: 19px;
    color: black;
  }
}

.extract-result__result-wrapper {
  height: 100%;
  width: 100%;
  overflow: scroll;
  border-bottom: 1px solid #bbb;
}
</style>
