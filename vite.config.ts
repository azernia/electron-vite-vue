import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { devPlugin, getReplacer } from './plugins/devPlugin';
import { buildPlugin } from './plugins/buildPlugin';
import optimizer from 'vite-plugin-optimizer';

export default defineConfig({
    plugins: [
        vue(),
        devPlugin(),
        buildPlugin(),
        optimizer(getReplacer())
    ],
    build: {
        assetsInlineLimit: 0 // 为了方便调试，不对图片等资源进行 base64 编码
    }
});
