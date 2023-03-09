import { ChatMessage, MessageResponse, SendTextMessageParameters } from "./chat.models.js";

export interface EventMessage<T extends EventO> {
    t: number;
    o: T;
}

export interface EventO {
    ndcId: number;
}

export interface EventChatMessageO extends EventO {
    alertOption: number;
    chatMessage: ChatMessage;
    membershipStatus: number;
    replyText: (text: string, parameters?: SendTextMessageParameters) => Promise<MessageResponse>;
}

export interface EventChatMessageCallback {
    command: string;
    callback: (message: EventChatMessageO) => void;
}
