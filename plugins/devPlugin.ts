/*
    通过 Vite 的插件来实现编译和加载
    只有在编译之后才会被 Electron 加载
    编译平台 platform 设置为 node，排除的模块 external 设置为 electron，
    正是这两个设置使我们在主进程代码中可以通过 import 的方式导入 electron 内置的模块。
    非但如此，Node 的内置模块也可以通过 import 的方式引入。
 */
import { ViteDevServer } from "vite";

export const devPlugin = () => {
    return {
        name: "dev-plugin",
        configureServer(server: ViteDevServer) {
            require("esbuild").buildSync({
                entryPoints: ["./src/main/mainEntry.ts"],
                bundle: true,
                platform: "node",
                outfile: "./dist/mainEntry.js",
                external: ["electron"]
            });
            server.httpServer?.once("listening", () => {
                const {spawn} = require("child_process");
                const addressInfo = server.httpServer?.address();
                let httpAddress = "";
                if(addressInfo && typeof addressInfo !== "string") {
                     httpAddress = `http://${addressInfo.address}:${addressInfo.port}`;
                }
                const electronProcess = spawn(require("electron").toString(), ["./dist/mainEntry.js", httpAddress], {
                    cwd: process.cwd(),
                    stdio: "inherit"
                });
                electronProcess.on("close", () => {
                    server.close();
                    process.exit();
                });
            })
        }
    }
}

/*
    getReplacer 方法是我们为 vite-plugin-optimizer 插件提供的内置模块列表
    使 Vite 加载 Electron 的内置模块和 Node.js 的内置模块。
    通过这个方法，我们可以在渲染进程中通过 import 的方式导入 Electron 的内置模块和 Node.js 的内置模块。
    vite-plugin-optimizer 插件会为你创建一个临时目录：node_modules.vite-plugin-optimizer
    然后把类似 const fs = require('fs'); export { fs as default } 这样的代码写入这个目录下的 fs.js 文件中
    渲染进程执行到：import fs from "fs" 时，就会请求这个目录下的 fs.js 文件，这样就达到了在渲染进程中引入 Node 内置模块的目的
 */
export const getReplacer = () => {
    const externalModels = ["os", "fs", "path", "events", "child_process", "crypto", "http", "buffer", "url", "better-sqlite3", "knex"];
    const result = {};
    for (let item of externalModels) {
        result[item] = () => ({
            find: new RegExp(`^${item}$`),
            code: `const ${item} = require('${item}');export { ${item} as default }`,
        });
    }
    result["electron"] = () => {
        let electronModules = ["clipboard", "ipcRenderer", "nativeImage", "shell", "webFrame"].join(",");
        return {
            find: new RegExp(`^electron$`),
            code: `const {${electronModules}} = require('electron');export {${electronModules}}`,
        };
    };
    return result;
}