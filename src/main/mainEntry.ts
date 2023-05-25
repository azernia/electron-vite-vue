// 创建主进程入口程序
import { app, BrowserWindow } from 'electron';
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'; // 关闭安全警告
let mainWindow: BrowserWindow;

app.whenReady().then(() => {
   const config = {
      webPreferences: {
         nodeIntegration: true,  // 是否集成 Nodejs
         webSecurity: false,  // 是否开启 Web 安全防范
         allowRunningInsecureContent: true,  // 是否允许开启不安全资源
         contextIsolation: false,   // 是否开启渲染进程沙箱
         webviewTag: true, // 是否开启 <webview> 标签
         spellcheck: false,   // 是否开启拼写检查
         disableHtmlFullscreenWindowResize: true,  // 禁用窗口大小调整
      }
   }
   mainWindow = new BrowserWindow(config);
   mainWindow.webContents.openDevTools({mode: 'undocked'})
   mainWindow.loadURL(process.argv[2]); // 通过命令行参数传递的url，且为第三个参数
});