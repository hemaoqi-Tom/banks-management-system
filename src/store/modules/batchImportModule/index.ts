import Vue from 'vue'

import BatchImportState from '@/interfaces/BatchImportState'
import Question from '@/interfaces/Question'

const BatchImportModule = {
  state: (): BatchImportState => ({
    extracted: [],
    curRender: -1
  }),
  mutations: {

    initExtracted (
      state: BatchImportState,
      extracted: Array<Question>
    ): void {
      state.extracted = extracted
    },

    setExtracted (
      state: BatchImportState,
      { key, value }: { key: string; value: Question }
    ): void {
      // 更改 extracted[curRender] 的某一个记录
      Vue.set(state.extracted[state.curRender], key, value)
    },

    setCurRender (
      state: BatchImportState,
      curRender: number
    ): void {
      if (
        curRender > state.extracted.length - 1 ||
        curRender < 0
      ) { return }
      state.curRender = curRender
    }

  }
}

export default BatchImportModule
