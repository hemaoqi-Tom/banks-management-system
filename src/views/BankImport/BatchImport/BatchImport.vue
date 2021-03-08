<template>
  <v-app class="batch-import__wrapper">
    <v-row no-gutters>

      <!-- word 粘贴处 -->
      <v-col cols="7">
        <div class="batch-import__ckeditor-wrapper">
          <ckeditor ref="ckeditor" :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
        </div>
      </v-col>

      <v-col cols="5">
        <!-- 提取结果预览 -->
        <ExtractResult class="batch-import__extract-result" />
        <!-- 题目属性设置 -->
        <SetQuesAttr class="batch-import__set-ques-attr" />
      </v-col>
    </v-row>

    <!-- 右侧工具栏 -->
    <Actions :editorData="editorData" />
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'
import CKEditorConfig from '@/plugins/ckeditorConfig'

import ExtractResult from './ExtractResult.vue'
import SetQuesAttr from './SetQuesAttr.vue'
import Actions from './Actions.vue'

@Component({ components: { ExtractResult, SetQuesAttr, Actions } })
export default class BatchImport extends Vue {
  editor = ClassicEditor
  editorData = '<p>1.&nbsp;计算机网络可被理解为(&nbsp; &nbsp; )</p><p>A.&nbsp;执行计算机数据处理的软件模块</p><p>B.&nbsp;由自治的计算机互联起来的集合体</p><p>C.&nbsp;多个处理器通过共享内存实现的紧耦合系统</p><p>D.&nbsp;用于共同完成一项任务的分布式系统</p><p>&nbsp;</p><p>2.&nbsp;计算机网络最基本的功能是(&nbsp; &nbsp; )</p><p>A.&nbsp;数据通信</p><p>B.&nbsp;资源共享</p><p>C.&nbsp;分布式处理</p><p>D.&nbsp;信息综合处理</p><p>&nbsp;</p>'
  editorConfig = CKEditorConfig
}
</script>

<style lang="scss">
.batch-import__ckeditor-wrapper .ck-editor {
  height: 100vh !important;

  .ck-editor__editable_inline {
    height: calc(100vh - 38.67px) !important;
  }
}

code {
  background-color: transparent !important;
}

.batch-import__extract-result {
  height: 54vh;
}

.batch-import__set-ques-attr {
  height: 46vh;
}
</style>
