import { ModelBase } from './ModelBase';

enum ChatType {
    Single = 1,
    Group = 2,
    PUBLIC = 3,
    FILE_TRANSFER_ASIST = 4,
}

export class ModelChat extends ModelBase {
    fromName?: string;
    sendTime?: number | string;
    isSelected = false;
    lastMessage?: string;
    avatar?: string;
    chatType?: ChatType;
}
