import { BrowserWindow, BrowserWindowConstructorOptions, WebPreferences, ipcMain, app } from 'electron';

// 主进程公共消息处理逻辑
export class CommonWindowEvent {
    private static getWin(event: any) {
        return BrowserWindow.fromWebContents(event.sender);
    }

    public static listen() {
        ipcMain.handle('minimizeWindow', (e) => {
            this.getWin(e)?.minimize();
        });

        ipcMain.handle('maxmizeWindow', (e) => {
            this.getWin(e)?.maximize();
        });

        ipcMain.handle('unmaximizeWindow', (e) => {
            this.getWin(e)?.unmaximize();
        });

        ipcMain.handle('hideWindow', (e) => {
            this.getWin(e)?.hide();
        });

        ipcMain.handle('showWindow', (e) => {
            this.getWin(e)?.show();
        });

        ipcMain.handle('closeWindow', (e) => {
            this.getWin(e)?.close();
        });
        ipcMain.handle('resizable', (e) => {
            return this.getWin(e)?.isResizable();
        });
        ipcMain.handle('getPath', (e, name: any) => {
            console.log(e);
            return app.getPath(name);
        });
    }

    // 主进程公共事件处理逻辑
    public static regWinEvent(win: BrowserWindow) {
        win.on('maximize', () => {
            win.webContents.send('windowMaximized');
        });
        win.on('unmaximize', () => {
            win.webContents.send('windowUnmaximized');
        });
        win.webContents.setWindowOpenHandler((param) => {
            interface CustomWebPreferences extends WebPreferences {
                nodeIntegration: boolean
                webSecurity: boolean
                allowRunningInsecureContent: boolean
                contextIsolation: boolean
                webviewTag: boolean
                spellcheck: boolean
                disableHtmlFullscreenWindowResize: boolean

                [key: string]: any // 添加索引签名
            }

            interface Config extends BrowserWindowConstructorOptions {
                frame: boolean
                show: boolean
                parent: any // 根据实际类型进行调整
                webPreferences: CustomWebPreferences

                [key: string]: any // 添加索引签名
            }

            const config: Config = {
                frame: false,
                show: true,
                parent: null,
                webPreferences: {
                    nodeIntegration: true,
                    webSecurity: false,
                    allowRunningInsecureContent: true,
                    contextIsolation: false,
                    webviewTag: true,
                    spellcheck: false,
                    disableHtmlFullscreenWindowResize: true
                }
            };
            const features: Partial<Config> = JSON.parse(param.features);
            for (const p in features) {
                if (p === 'webPreferences') {
                    for (const p2 in features.webPreferences) {
                        config.webPreferences[p2] = features.webPreferences[p2];
                    }
                } else {
                    config[p] = features[p];
                }
            }
            if (features?.modal === true) config.parent = win;
            console.log(config);
            return { action: 'allow', overrideBrowserWindowOptions: config };
        });
    }
}
