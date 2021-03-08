<template>
  <div class="bank-browser-component__wrapper">

    <!-- 主体部分 -->
    <v-card flat>
      <v-card-title v-if="msg !== ''">{{ msg }}</v-card-title>
      <v-card-subtitle v-if="subMsg !== ''">{{ subMsg }}</v-card-subtitle>

      <!-- 树形文件浏览器组件 -->
      <v-treeview
        :items="banks"
        activatable
        item-key="name"
        @update:active="setActive"
        return-object
      >
        <template v-slot:prepend="{ item, open }">
          <v-icon v-if="item.type === 'folder'">
            {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
          </v-icon>
          <v-icon v-else>mdi-file-document-outline</v-icon>
        </template>
      </v-treeview>

      <!-- 工具栏 -->
      <v-card-actions>
        <v-btn color="indigo darken-2" @click="showCreateDialog('folder')" text small>新建文件夹</v-btn>
        <v-btn color="green darken-1" @click="showCreateDialog('file')" text small>新建题库文件</v-btn>
        <v-btn color="warning" @click="showRenameDialog" text small>重命名</v-btn>
        <v-btn color="error" @click="showDeleteDialog" text small>删除</v-btn>
        <v-spacer></v-spacer>

        <!-- 用户扩展功能按钮插槽 -->
        <slot name="append"></slot>
      </v-card-actions>
    </v-card>

    <!-- 创建窗口 -->
    <v-dialog
      v-model="showCreate"
      persistent
      max-width="300px"
    >
      <v-card class="pa-4">
        <v-text-field
          v-model="createName"
          :placeholder="createPlaceHolder"
        ></v-text-field>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="showCreate = false" text>放弃</v-btn>
          <v-btn color="indigo darken-2" @click="create" text>新建</v-btn>
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
          <v-btn color="error" @click="delete_" text>删除</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 重命名窗口 -->
    <v-dialog
      v-model="showRename"
      persistent
      max-width="300px"
    >
      <v-card class="pa-4">
        <v-text-field
          v-model="newName"
          placeholder="请输入新名称"
        ></v-text-field>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="showRename = false" text>放弃</v-btn>
          <v-btn color="indigo darken-2" @click="rename" text>重命名</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync } from 'vue-property-decorator'

import BatchImportState from '@/interfaces/BatchImportState'
import BanksState from '@/interfaces/BanksState'
import Question from '@/interfaces/Question'
import Folder from '@/interfaces/Folder'
import File from '@/interfaces/File'

@Component
export default class BankBrowser extends Vue {
  // 创建窗口
  showCreate = false
  createType = 'folder'
  createName = ''
  // 删除窗口
  showDelete = false
  // 重命名窗口
  showRename = false
  newName = ''

  get banks (): Array<File | Folder> {
    const BanksModule: BanksState = this.$store.state.BanksModule
    return BanksModule.banks
  }

  get extracted (): Array<Question> {
    const BatchImportModule: BatchImportState = this.$store.state.BatchImportModule
    return BatchImportModule.extracted
  }

  get createPlaceHolder (): string {
    const mapping: Map<string, string> = new Map([
      ['folder', '请输入文件夹名称'],
      ['file', '请输入题库文件名称']
    ])
    return mapping.get(this.createType) as string
  }

  setActive (curActive: Array<File | Folder>): void {
    /* 用户选择新的对象(题库文件对象, 文件夹)后, 手动更新信息 */
    curActive = Array.from(curActive)
    this.syncedCurActive = curActive
  }

  showCreateDialog (type: string): void {
    this.createType = type
    this.showCreate = true
  }

  showDeleteDialog (): void {
    const syncedCurActive = this.syncedCurActive
    if (syncedCurActive.length === 0) {
      return this.$msg.error('请选择待删除对象')
    }

    this.showDelete = true
  }

  showRenameDialog (): void {
    const syncedCurActive = this.syncedCurActive
    if (syncedCurActive.length === 0) {
      return this.$msg.error('请选择待重命名对象')
    }

    this.showRename = true
  }

  create (): void {
    /* 创建新的题库文件 or 文件夹 */
    const type = this.createType
    const name = this.createName
    const syncedCurActive = this.syncedCurActive

    // 获取创建路径
    let path: Array<string>
    if (syncedCurActive.length === 0) {
      // 用户没有选中任何对象
      path = []
    } else if (syncedCurActive[0].type === 'file') {
      // 文件对象
      path = Array.from(syncedCurActive[0].path)
    } else {
      // 文件夹对象
      path = Array.from(syncedCurActive[0].path)
      path.push(syncedCurActive[0].name)
    }

    // 提交创建操作
    try {
      this.$store.commit('createIntoBanks', { type, name, path })
      this.$store.commit('writeBackBanks')
    } catch (err) {
      this.$msg.error('名称不能重复')
    }

    this.showCreate = false
    this.createName = ''
  }

  delete_ (): void {
    /* 删除已有的题库文件 or 文件夹 */
    const syncedCurActive = this.syncedCurActive[0]
    const name = syncedCurActive.name
    const path = Array.from(syncedCurActive.path)

    // 提交删除操作
    this.$store.commit('deleteFromBanks', { name, path })
    this.$store.commit('writeBackBanks')

    this.syncedCurActive = []
    this.showDelete = false
  }

  rename (): void {
    /* 重命名已有的题库文件 or 文件夹 */
    const syncedCurActive = this.syncedCurActive[0]
    const oldName = syncedCurActive.name
    const newName = this.newName
    const path = Array.from(syncedCurActive.path)

    // 提交重命名操作
    this.$store.commit('renameFromBanks', { oldName, newName, path })
    this.$store.commit('writeBackBanks')

    this.newName = ''
    this.showRename = false
  }

  @Prop(String) readonly msg!: string
  @Prop(String) readonly subMsg!: string
  @PropSync('curActive', { type: Array }) syncedCurActive!: Array<File | Folder>
}
</script>

<style lang="scss" scoped>
.bank-browser-component__wrapper {
  max-height: 500px;
}
</style>
