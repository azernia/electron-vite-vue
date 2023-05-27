<template>
    <div class="top-bar">
        <div class="win-title">{{ title }}</div>
        <div class="win-tool">
            <div @click="minimizeMainWindow">
                <i class="icon icon-minimize"/>
            </div>
            <div v-if="isMaximized" @click="unmaximizeMainWindow">
                <i class="icon icon-restore"/>
            </div>
            <div v-else @click="maxmizeMainWin">
                <i class="icon icon-maximize"/>
            </div>
            <div @click="closeWindow">
                <i class="icon icon-close"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, onUnmounted } from 'vue';
import { ipcRenderer } from 'electron';

defineProps<{ title?: string }>();
const isMaximized = ref(false);
const closeWindow = () => {
    ipcRenderer.invoke('closeWindow');
};
const maxmizeMainWin = () => {
    ipcRenderer.invoke('maxmizeWindow');
};
const minimizeMainWindow = () => {
    ipcRenderer.invoke('minimizeWindow');
};
const unmaximizeMainWindow = () => {
    ipcRenderer.invoke('unmaximizeWindow');
};
const winMaximizeEvent = () => {
    isMaximized.value = true;
};
const winUnMaximizeEvent = () => {
    isMaximized.value = false;
};
onMounted(() => {
    ipcRenderer.on('windowMaximized', winMaximizeEvent);
    ipcRenderer.on('windowUnMaximized', winUnMaximizeEvent);
});
onUnmounted(() => {
    ipcRenderer.off('windowMaximized', winMaximizeEvent);
    ipcRenderer.off('windowUnMaximized', winUnMaximizeEvent);
});
</script>

<style lang="scss" scoped>
.top-bar {
  display: flex;
  height: 25px;
  line-height: 25px;
  -webkit-app-region: drag;
  width: 100%;
}

.win-title {
  flex: 1;
  padding-left: 12px;
  font-size: 14px;
  color: #888;
}

.win-tool {
  height: 100%;
  display: flex;
  -webkit-app-region: no-drag;
}

.win-tool div {
  height: 100%;
  width: 34px;
  text-align: center;
  color: #999;
  cursor: pointer;
  line-height: 25px;
}

.win-tool .icon {
  font-size: 10px;
  color: #666666;
  font-weight: bold;
}

.win-tool div:hover {
  background: #efefef;
}

.win-tool div:last-child:hover {
  background: #ff7875;
}

.win-tool div:last-child:hover i {
  color: #fff !important;
}
</style>
