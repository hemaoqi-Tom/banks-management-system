<template>
  <div class="submit-dialog__wrapper">
    <v-dialog v-model="syncedShowSubmit" persistent max-width="600px">
      <BankBrowser
        msg="请选择题库进行提交"
        subMsg="Select bank to submit"
        :curActive.sync="curActive"
      >
        <template v-slot:append>
          <v-btn color="grey" @click="syncedShowSubmit = false" text small>取消</v-btn>
          <v-btn color="green darken-1" @click="submit" text small>提交</v-btn>
        </template>
      </BankBrowser>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, PropSync } from 'vue-property-decorator'

import BankBrowser from '@/components/BankBrowser.vue'
import Question from '@/interfaces/Question'
import Folder from '@/interfaces/Folder'
import File from '@/interfaces/File'

@Component({ components: { BankBrowser } })
export default class SubmitDialog extends Vue {
  curActive: Array<File | Folder> = []

  get extracted (): Array<Question> {
    return this.$store.state.BatchImportModule.extracted
  }

  submit (): void {
    const curActive = Array.from(this.curActive)
    const extracted = this.extracted
    if (curActive.length === 0 || curActive[0].type === 'folder') {
      return this.$msg.error('请选择题库文件进行提交')
    }
    const { name, path } = curActive[0]
    this.$store.commit('insertIntoBanks', { name, path, extracted })
    this.$store.commit('writeBackBanks')

    this.$msg.success('提交成功')
    this.$store.commit('initExtracted', [])
    this.syncedShowSubmit = false
  }

  @PropSync('showSubmit', { type: Boolean }) syncedShowSubmit!: boolean
}
</script>
