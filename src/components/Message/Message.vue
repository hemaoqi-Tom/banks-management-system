<template>
  <transition name="message-component__message-fade" @after-leave="handleAfterLeave">
    <div
      class="message-component__wrapper"
      :style="[typeStyle]"
      v-show="showMessage"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
      <i :class="[iconClass, 'message-component__type-icon']"></i>
      <span>{{ msg }}</span>

      <!-- 分隔 -->
      <div class="message-component__spacer"></div>

      <i class="mdi mdi-close message-component__close-icon" @click="close"></i>
    </div>
  </transition>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

import '@mdi/font/css/materialdesignicons.min.css'
import 'typeface-roboto/index.css'

interface TypeInfo {
  color: string;
  icon: string;
}

const typeMapping: Map<string, TypeInfo> = new Map([
  ['info', { color: '#303F9F', icon: 'mdi mdi-information-outline' }],
  ['success', { color: '#4CAF50', icon: 'mdi mdi-check-circle-outline' }],
  ['warning', { color: '#FB8C00', icon: 'mdi mdi-alert-circle-outline' }],
  ['error', { color: '#FF5252', icon: 'mdi mdi-close-circle-outline' }]
])

@Component
export default class Message extends Vue {
  type = 'info'
  msg = ''
  timeout = 2000
  showMessage = false
  isClosed = false
  // Message.js 中的 Message.close 方法
  onClose = () => { /* 用于初始化的函数 */ }
  timer = 0
  // 垂直偏移量, 用于控制多个 message
  verticalOffset = 15

  get typeStyle (): { top: string; 'background-color': string } {
    const verticalOffset: number = this.verticalOffset
    const color = (typeMapping.get(this.type) as TypeInfo).color

    return {
      top: `${verticalOffset}px`,
      'background-color': color
    }
  }

  get iconClass (): string {
    return (typeMapping.get(this.type) as TypeInfo).icon
  }

  handleAfterLeave (): void {
    // 组件的自我销毁
    this.$destroy()
    const parentNode = this.$el.parentNode as ParentNode & Node
    parentNode.removeChild(this.$el)
  }

  close (): void {
    // 组件的关闭
    this.isClosed = true
    if (typeof this.onClose === 'function') {
      // 执行 Message.close 方法
      this.onClose()
    }
  }

  startTimer (): void {
    // 启动计时器
    const cb = () => {
      if (!this.isClosed) { this.close() }
    }
    // 必须要使用 window.setTimeout, 否则 ts 类型检查无法通过
    this.timer = window.setTimeout(cb, this.timeout)
  }

  clearTimer (): void {
    // 清理计时器
    clearTimeout(this.timer)
  }

  @Watch('isClosed')
  onIsClosedChanged (newVal: boolean): void {
    if (newVal) { this.showMessage = false }
  }
}
</script>

<style lang="scss" scoped>
.message-component__wrapper {
  position: fixed;
  left : 50%;
  transform : translateX(-50%);
  z-index: 10000;

  min-width: 200px;
  height: 40px;
  padding: 8px 16px;

  display: flex;
  align-items: center;

  border-radius: 4px;
  font-family: 'roboto', monospace;
  font-size: 14px;
  color: #f1f1f1;

  .message-component__type-icon {
    display: inline-block;
    margin-right: 16px;

    font-size: 18px;
    line-height: 24px;
  }

  span {
    line-height: 24px;
    font-family: 'Noto Sans', 'Microsoft YaHei', sans-serif;
  }

  .message-component__spacer {
    // 模拟 v-spacer 的功能，用于撑满容器
    flex-grow: 1;
  }

  .message-component__close-icon {
    display: inline-block;
    margin-left: 16px;

    font-size: 18px;
    line-height: 24px;
    &:hover {
      cursor: pointer;
    }
  }
}

.message-component__message-fade-enter-active, .message-component__message-fade-leave-active {
  transition: all .3s ease;
}

.message-component__message-fade-enter, .message-component__message-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
