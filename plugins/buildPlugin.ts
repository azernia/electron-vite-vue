// Vite 打包 Electron 插件
import path from 'path';
import fs from 'fs';

interface PackageJson {
    name: string
    version: string
    main: string
    dependencies: Record<string, string>
    devDependencies: Record<string, string>
    scripts: Record<string, string>
}

class AppBuilder {
    // 编译主进程代码
    buildMainProcessCode() {
        require('esbuild').buildSync({
            entryPoints: ['./src/main/mainEntry.ts'],
            bundle: true,
            platform: 'node',
            minify: true,
            outfile: './dist/mainEntry.js',
            external: ['electron']
        });
    }

    // 为生产环境准备 package.json
    preparePackageJson() {
        const pkgJsonPath = path.join(process.cwd(), 'package.json');
        const localPkgJson: PackageJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
        const electronConfig = localPkgJson.devDependencies.electron.replace('^', '');
        localPkgJson.main = 'mainEntry.js';
        delete localPkgJson.scripts;
        delete localPkgJson.devDependencies;
        localPkgJson.devDependencies = { electron: electronConfig };
        const tarJsonPath = path.join(process.cwd(), 'dist', 'package.json');
        fs.writeFileSync(tarJsonPath, JSON.stringify(localPkgJson));
        fs.mkdirSync(path.join(process.cwd(), 'dist/node_modules'));
    }

    // 使用 electron-builder 打包
    buildInstaller() {
        const options = {
            config: {
                directories: {
                    output: path.join(process.cwd(), 'release'), // 输出文件路径
                    app: path.join(process.cwd(), 'dist') // electron 打包的文件路径
                },
                files: ['**'], // 需要打包的文件
                extends: null, // 配置文件继承
                productName: 'Electron Desktop App', // 项目名，也是生成的安装文件名，即 aDemo.exe
                appId: 'com.rui.desktop', // 包名，可用于自动更新
                asar: true, // 是否生成 asar 包，打包后的文件将被压缩成一个 asar. 包，它将所有的应用文件放在一个文件中，包括 node_modules
                nsis: { // 安装配置
                    oneClick: true, // 是否一键安装
                    perMachine: true, // 是否开启安装时权限限制（此电脑或当前用户）
                    allowToChangeInstallationDirectory: true, // 允许修改安装目录
                    createDesktopShortcut: true, // 创建桌面图标
                    createStartMenuShortcut: true, // 创建开始菜单图标
                    shortcutName: 'ElectronDesktop' // 图标名称
                },
                publish: [{ provider: 'generic', url: 'http://localhost:5500/' }] // 更新地址
            },
            project: process.cwd() // 项目路径
        };
        return require('electron-builder').build(options); // 打包
    }
}

export const buildPlugin = () => {
    return {
        name: 'build-plugin',
        closeBundle() {
            const appBuilder = new AppBuilder();
            appBuilder.buildMainProcessCode();
            appBuilder.preparePackageJson();
            appBuilder.buildInstaller();
        }
    };
};
