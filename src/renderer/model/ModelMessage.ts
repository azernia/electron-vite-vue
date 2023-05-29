import { ModelBase } from './ModelBase';

export class ModelMessage extends ModelBase {
    createTime?: number | string;
    receiveTime?: number | string;
    messageContent?: string;
    chatId?: string;
    fromName?: string;
    avatar?: string;
    /**
     * 是否为传入消息
     */
    isInMessage?: boolean;
}
