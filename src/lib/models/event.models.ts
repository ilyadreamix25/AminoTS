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
    /**
     * Reply to message with text
     * @param text Text to send
     * @param parameters Message parameters
     * @see {@link SendTextMessageParameters}
     * @returns Chat message
     */
    replyText: (text: string, parameters?: SendTextMessageParameters) => Promise<MessageResponse>;
}

export interface EventChatMessageCallback {
    command: string;
    callback: (message: EventChatMessageO) => void;
}
