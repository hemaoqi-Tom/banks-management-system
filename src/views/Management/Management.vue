<template>
  <v-app class="management__wrapper">

    <v-breadcrumbs :items="[{ text: '题库管理系统' }, { text: '题库管理' }]">
      <template v-slot:divider>
        <v-icon>mdi-forward</v-icon>
      </template>
    </v-breadcrumbs>

    <!-- 题库信息总览 -->
    <v-card class="mx-4 mb-4 pb-4">
      <v-card-title>题库信息总览</v-card-title>
      <v-card-subtitle>Banks information overview</v-card-subtitle>
      <v-card-text class="py-0">题库文件总数：{{ $store.getters.banksCount }}</v-card-text>
      <v-card-text class="pt-2 pb-0">题目总数：{{ $store.getters.quesCount }}</v-card-text>
    </v-card>

    <!-- 题库查看 -->
    <v-card class="mx-4">
      <BankBrowser
        msg="题库列表"
        subMsg="Banks list"
        :curActive.sync="curActive"
      >
        <template v-slot:append>
          <v-btn color="success" @click="bankImport" text small>导入题库</v-btn>
          <v-btn color="indigo darken-2" @click="viewDetails" text small>查看</v-btn>
        </template>
      </BankBrowser>
    </v-card>

    <FileView
      :showFileView.sync="showFileView"
      :curActive="curActive"
      v-if="curType === 'file'"
    />

    <FolderView
      :showFolderView.sync="showFolderView"
      :curActive="curActive"
      v-if="curType === 'folder'"
    />
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { remote } from 'electron'
import fse from 'fs-extra'

import BankBrowser from '@/components/BankBrowser.vue'
import FolderView from './folderView.vue'
import FileView from './fileView.vue'

import Folder from '@/interfaces/Folder'
import File from '@/interfaces/File'

const { dialog } = remote

@Component({ components: { BankBrowser, FileView, FolderView } })
export default class Management extends Vue {
  curActive: Array<File | Folder> = []
  showFolderView = false
  showFileView = false

  get curType (): string {
    const curActive = this.curActive
    if (curActive.length === 0) { return '' }
    return curActive[0].type
  }

  viewDetails (): void {
    const curActive = this.curActive
    if (curActive.length === 0) {
      return this.$msg.error('请选择对象查看信息')
    }

    if (curActive[0].type === 'file') {
      this.showFileView = true
    } else {
      this.showFolderView = true
    }
  }

  async bankImport (): Promise<any> {
    const curActive = this.curActive
    // 获取创建路径
    let path: Array<string>
    if (curActive.length === 0) {
      // 用户没有选中任何对象
      path = []
    } else if (curActive[0].type === 'file') {
      // 文件对象
      path = Array.from(curActive[0].path)
    } else {
      // 文件夹对象
      path = Array.from(curActive[0].path)
      path.push(curActive[0].name)
    }

    // 导入题库
    const { filePaths } = await dialog.showOpenDialog({
      title: '导入题库文件',
      filters: [
        { name: 'Banks file', extensions: ['json'] }
      ],
      properties: [
        'openFile',
        'multiSelections'
      ]
    })

    for (const filePath of filePaths) {
      if (!filePath.endsWith('.json')) { continue }
      const bankData = JSON.parse(await fse.readFile(filePath) as any)
      const type = 'file'
      const name = bankData.name

      this.$store.commit('createIntoBanks', { type, name, path })
      this.$store.commit('insertIntoBanks', { name, path, extracted: bankData.contents })
      this.$store.commit('writeBackBanks')
    }
  }
}
</script>
