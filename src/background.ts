import { app, protocol, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

const isDevelopment: boolean = process.env.NODE_ENV !== 'production'

// app 准备(ready)完成之前需要注册模式(scheme)
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow () {
  // 创建浏览窗口
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: (process.env.ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      enableRemoteModule: true
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // 如果是开发模式, 加载开发服务器(dev server)的 url
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) { win.webContents.openDevTools() }
  } else {
    createProtocol('app')
    // 如果不是开发模式, 加载 index.html
    win.loadURL('app://./index.html')
  }
}

// 当窗口全部关闭的时候, 应用退出
app.on('window-all-closed', () => {
  // windows/linux 上, 窗口全部关闭意味着应用退出
  // macOS 上, 窗口全部关闭应用不会退出, 而是驻留在程序坞中
  // 只有当使用 cmd + Q 才会退出
  if (process.platform !== 'darwin') { app.quit() }
})

app.on('activate', () => {
  // macOS 上, 如果程序坞的程序图标被点击, 没有打开窗口的时候, 需要创建新窗口
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // 安装 Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
