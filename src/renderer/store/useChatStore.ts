import { defineStore } from 'pinia';
import { Ref, ref } from 'vue';
import { ModelChat } from '../model/ModelChat';
import { useMessageStore } from './useMessageStore';

// 初始化模拟数据
const initChatData = () => {
    const chatList: Array<ModelChat> = [];
    for (let i = 0; i < 10; i++) {
        const modelChat = new ModelChat();
        modelChat.fromName = '聊天对象' + i;
        modelChat.sendTime = new Date().getTime();
        modelChat.lastMessage = '最后一条消息' + i;
        modelChat.avatar = 'https://pic3.zhimg.com/v2-306cd8f07a20cba46873209739c6395d_im.jpg?source=32738c0c';
        chatList.push(modelChat);
    }
    return chatList;
};

// 定义一个 Store
export const useChatStore = defineStore('chat', () => {
    const data: Ref<ModelChat[]> = ref(initChatData());
    const selectItem = (item: ModelChat) => {
        if (item.isSelected) {
            return;
        }
        data.value.forEach((chat) => {
            chat.isSelected = false;
        });
        item.isSelected = true;
        // 初始化消息数据
        useMessageStore().initData(item);
    };
    return {
        data,
        selectItem
    };
});
