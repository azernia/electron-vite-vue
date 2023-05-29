<script setup lang="ts">
import { ref } from 'vue';
import { ModelChat } from '../../../model/ModelChat';
import { useChatStore } from '../../../store/useChatStore';
import { useMessageStore } from '../../../store/useMessageStore';
import BarTop from '../../../Component/BarTop.vue';
import MessageItem from './MessageItem.vue';

const chatStore = useChatStore();
const messageStore = useMessageStore();
// const logInfo = ref('');
let curId = '';
// 订阅 store 内数据变化
chatStore.$subscribe((mutation, state) => {
    const item = state.data.find((item) => item.isSelected) as ModelChat;
    const id = item?.id as string;
    if (id !== curId) {
    // logInfo.value = `现在应该加载的 ID 为 ${item?.id} 的聊天记录`;
        messageStore.initData(item);
        curId = id;
    }
});
</script>
<template>
  <div class="MessageBord">
    <BarTop/>
    <div class="MessageList">
      <MessageItem :data="item" v-for="item in messageStore.data" :key="item.id"/>
    </div>
  </div>
</template>
<style scoped lang="scss">
.MessageBord {
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
}

.MessageList {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: rgb(245, 245, 245);
}
</style>
