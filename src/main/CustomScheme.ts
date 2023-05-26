import { protocol } from 'electron';
import path from 'path';
import fs from 'fs';

// 为自定义的协议注册一个处理函数
const schemeConfig = {
    standard: true, // 是否是标准协议
    supportFetchAPI: true, // 是否支持 fetch API
    bypassCSP: true, // 是否绕过 CSP
    corsEnabled: true, // 是否支持跨域
    stream: true // 是否支持流
};
protocol.registerSchemesAsPrivileged([{
    scheme: 'app',
    privileges: schemeConfig
}]);

export class CustomScheme {
    // 根据文件扩展名获取 mime-type
    private static getMimeType(extension: string) {
        let mimeType = '';
        if (extension === '.js') {
            mimeType = 'text/javascript';
        } else if (extension === '.html') {
            mimeType = 'text/html';
        } else if (extension === '.css') {
            mimeType = 'text/css';
        } else if (extension === '.svg') {
            mimeType = 'image/svg+xml';
        } else if (extension === '.json') {
            mimeType = 'application/json';
        }
        return mimeType;
    }

    // 注册自定义 App 协议
    static registerScheme() {
        protocol.registerStreamProtocol('app', (request, callback) => {
            let pathName = new URL(request.url).pathname;
            let extension = path.extname(pathName).toLowerCase();
            if (extension === '') {
                pathName = 'index.html';
                extension = '.html';
            }
            const tarFile = path.join(__dirname, pathName);
            callback({
                statusCode: 200,
                headers: { 'content-type': this.getMimeType(extension) },
                data: fs.createReadStream(tarFile)
            });
        });
    }
}
