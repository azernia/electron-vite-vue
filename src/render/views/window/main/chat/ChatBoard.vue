<template>
    <div class="chat-list">
        <ChatSearch/>
        <div class="list-box"></div>
    </div>
</template>

<script lang="ts" setup>
import ChatSearch from './ChatSearch.vue';
</script>

<style lang="scss" scoped>
.chat-list {
  width: 250px;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
}

.list-box {
  background: rgb(230, 229, 229);
  background-image: linear-gradient(to bottom right, rgb(235, 234, 233), rgb(240, 240, 240));
  flex: 1;
  overflow-y: auto;
  box-sizing: border-box;

  border-right: 1px solid rgb(214, 214, 214);
}
</style>
