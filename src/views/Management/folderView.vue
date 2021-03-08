<template>
  <div class="folder-view__wrapper">
    <!-- 详细信息展示界面 -->
    <v-dialog
      transition="dialog-bottom-transition"
      v-model="syncedShowFolderView"
      fullscreen
      hide-overlay
    >
      <v-card>

        <!-- 工具栏 -->
        <v-toolbar color="indigo darken-2" dark>
          <v-btn @click="syncedShowFolderView = false" icon dark>
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>详细信息</v-toolbar-title>
        </v-toolbar>

        <v-breadcrumbs :items="[{ text: '题库管理系统' }, { text: '题库管理' }, { text: '详细信息' }]">
          <template v-slot:divider>
            <v-icon>mdi-forward</v-icon>
          </template>
        </v-breadcrumbs>

        <!-- 信息展示主体 -->
        <!-- 文件夹内容展示 -->
        <div class="mx-4">
          <div
            class="d-flex align-center justify-center folder-view__unfound"
            v-if="curActive[0].children.length === 0"
          >
            <Unfound />
          </div>
          <div v-else>
            <v-card class="mb-4 pa-4" v-for="e in curActive[0].children" :key="e.name">
              <v-row>
                <v-col class="d-flex justify-center align-center" :cols="1">
                  <v-icon class="" x-large>
                    {{ e.type === 'folder' ? 'mdi-folder' : 'mdi-file-document-outline' }}
                  </v-icon>
                </v-col>
                <v-col :cols="11">
                  <v-card-text class="pa-0">{{ e.name }}</v-card-text>
                  <v-card-text class="pa-0">
                    类型：{{ e.type === 'file' ? '题库文件' : '文件夹' }}
                  </v-card-text>
                  <v-card-text class="pa-0">
                    {{
                      e.type === 'file' ?
                      `题目数量：${e.contents.length}` :
                      `对象数量：${e.children.length }`
                    }}
                  </v-card-text>
                </v-col>
              </v-row>
            </v-card>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, PropSync, Prop } from 'vue-property-decorator'
import Unfound from '@/components/Unfound.vue'

import Folder from '@/interfaces/Folder'
import File from '@/interfaces/File'

@Component({ components: { Unfound } })
export default class FolderView extends Vue {
  @PropSync('showFolderView', { type: Boolean }) syncedShowFolderView!: string
  @Prop(Array) readonly curActive!: Array<File | Folder>
}
</script>

<style lang="scss" scoped>
.folder-view__unfound {
  height: calc(100vh - 121px);
}
</style>
