/**
 * @description Message 编程式组件封装
 * @author 何茂旗
 * @date 2021-3-8
 */

import Vue from 'vue'
import MessageComponent from './Message.vue'

const types: Array<string> = ['success', 'warning', 'info', 'error']
// 当前所有的消息列表
const messages: Array<any> = []
// 实例 id
let seed = 1

function Message (options: any /* 传递的 options 不确定, 因此使用 any */) {
  // 生成实例 ID, 方便销毁
  const id: string = 'message_' + seed++
  // 传递 Message.close 方法
  options.onClose = function () {
    Message.close(id)
  }

  // 创建组件实例, 传递初始数据, 绑定 id
  const MessageConstructor = Vue.extend(MessageComponent)
  const messageInstance = new MessageConstructor({ data: options })
  messageInstance.id = id

  // 挂载实例
  messageInstance.$mount()
  document.body.appendChild(messageInstance.$el)

  // 垂直距离
  const baseOffset = 15 /* 基本高度 */
  const messageOffset = 40 /* 组件高度 */ + 16 /* 上下间隔 */
  messageInstance.verticalOffset = baseOffset + messages.length * messageOffset

  // 显示与收尾
  messageInstance.showMessage = true
  messages.push(messageInstance)
  return messageInstance
}

// 绑定偏函数
for (let i = 0; i < types.length; i++) {
  (Message as any)[types[i]] = (msg: string) => {
    // 传递的 options 不确定, 因此使用 any
    const options: any = {}
    options.type = types[i]
    options.msg = msg
    return Message(options)
  }
}

// 关闭对话框
Message.close = function (id: string) {
  let toCloseIndex = -1

  for (let i = 0; i < messages.length; i++) {
    if (messages[i].id === id) {
      toCloseIndex = i
    }
  }

  messages.splice(toCloseIndex, 1)
  if (messages.length <= 0 || toCloseIndex === -1 || toCloseIndex > messages.length) { return }

  for (let i = toCloseIndex; i < messages.length; i++) {
    messages[i].verticalOffset -= 56
  }
}

export default Message
