import { dialog } from 'electron';
import { autoUpdater } from 'electron-updater';

export default class Updater {
    static check() {
        autoUpdater.checkForUpdates();
        autoUpdater.on('update-downloaded', async() => {
            await dialog.showMessageBox({
                message: 'Update available, do you want to install it now?'
            });
        });
        autoUpdater.quitAndInstall();
    }
}
