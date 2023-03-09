import { EventEmitter } from "stream";
import { WebSocket } from "ws";
import { Bot } from "./bot.lib.js";
import { Request } from "./request.lib.js";
import {
    EventChatMessageCallback,
    EventChatMessageO,
    EventMessage,
    EventO
} from "./models/event.models.js";
import { AminoError } from "./other/errors.other.js";
import { SignatureUtility } from "./other/signature.other.js";
import { Constants } from "./other/const.other.js";

export type EventType = "chatMessage" | "wsMessage";
export type EventCallbackType<T extends EventO> = (message: EventMessage<T>) => void;

export class Event extends EventEmitter {
    private bot: Bot;
    private ws: WebSocket;

    commands: EventChatMessageCallback[];

    constructor(bot: Bot) {
        super();
        this.bot = bot;
    }

    start() {
        const wsOptions = this.getWsOptions();

        this.ws = new WebSocket(wsOptions.url, {
            headers: wsOptions.headers
        });
        this.commands = [];

        this.setCallbacks();
    }

    stop = () => this.ws.removeAllListeners();

    send = (message: Buffer) => this.ws.send(message);

    private getWsOptions() {
        if (!this.bot.sessionId)
            throw AminoError.Unauthorized;

        const body = this.bot.deviceId + "|" + new Date().getTime().toString();
        const headers = {
            [Request.DefaultHeaderKeys.NDC_AUTH]: "sid=" + this.bot.sessionId,
            [Request.DefaultHeaderKeys.NDC_DEVICE_ID]: this.bot.deviceId,
            [Request.DefaultHeaderKeys.NDC_MSG_SIG]: SignatureUtility.generateSignature(Buffer.from(body))
        }

        return {
            headers: headers,
            url: `${Constants.WS_URL}/?signbody=${body.replace("|", "%7C")}`
        }
    }

    private setCallbacks() {
        const that = this;

        this.ws.on("open", () => {
            setInterval(() => that.reconnect(), 120000);
        });

        this.ws.on("close", () => {
            setTimeout(() => that.reconnect(), 1000);
        });

        this.ws.on("error", (error) => {
            console.error(error);
        });

        this.ws.on("message", bufferMessage => {
            const textMessage = bufferMessage.toString("utf-8");
            const wsMessage: EventMessage<EventChatMessageO> = JSON.parse(textMessage);

            switch (wsMessage.t) {
                case Constants.SocketMessageTypes.CHAT:
                    wsMessage.o.replyText = async (text, parameters) => {
                        const newNdcBot = this.bot;
                        newNdcBot.ndcId = wsMessage.o.ndcId;

                        parameters = parameters ? parameters : {};
                        parameters.replyTo = wsMessage.o.chatMessage.messageId;

                        const message = await newNdcBot.sendTextMessage(
                            text,
                            wsMessage.o.chatMessage.threadId,
                            parameters
                        );

                        return message;
                    }

                    if (wsMessage.o.chatMessage.type == Constants.MessageTypes.TEXT) {
                        this.emit("textMessage", wsMessage.o);
                        this.commands.forEach(commandValue => {
                            if (wsMessage.o.chatMessage.content?.startsWith(commandValue.command))
                                this.emit(commandValue.command, wsMessage.o);
                        });
                    }

                    this.emit("chatMessage", wsMessage.o);
                    break;
            }

            this.emit("wsMessage", wsMessage);
        });
    }

    private reconnect() {
        this.ws.removeAllListeners();
        this.start();
    }
}
