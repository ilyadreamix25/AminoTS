import * as models from "./models/models.js";
import { DeviceUtility } from "./other/device.other.js"
import { Utility } from "./other/utility.other.js";
import { Event } from "./event.lib.js";
import { Request } from "./request.lib.js";
import { EventChatMessageO, EventMessage, EventO } from "./models/event.models.js";

export class Bot {
    deviceId: string;
    sessionId?: string;
    userAgent: string;
    ndcId = 0;

    profile?: models.account.UserProfile;
    account?: models.account.Account;

    cfg: models.bot.LibraryConfig;

    private event: Event;
    private request: Request;

    constructor(parameters?: models.bot.BotParameters) {
        this.deviceId = parameters?.deviceId ?? DeviceUtility.generateDeviceId();
        this.ndcId = parameters?.ndcId ?? 0;
        this.sessionId = parameters?.sessionId;
        this.userAgent = parameters?.userAgent ?? Request.DefaultHeaderValues.USER_AGENT;

        this.cfg = parameters?.libraryConfig ?? {
            debug: false,
            throwErrors: true
        }

        this.request = new Request(this);
    }

    /**
     * Login to the account with email and password
     * @param email Account email
     * @param password Account password
     * @returns Login account info
     */
    async loginByEmail(email: string, password: string) {
        const body = {
            email: email,
            secret: `0 ${password}`,
            clientType: 100,
            deviceID: this.deviceId,
            action: "normal",
            v: 2
        }

        const response = await this.request.call("/auth/login", {
            method: "post",
            body: body,
            contentType: Request.DefaultHeaderValues.CONTENT_TYPE_APPLICATION_JSON,
            ndcId: this.ndcId
        });
        const loginAccountInfo: models.account.LoginResponse = await response.json();

        this.sessionId = loginAccountInfo.sid;
        this.account = loginAccountInfo.account;
        this.profile = loginAccountInfo.userProfile;

        return loginAccountInfo;
    }

    /**
     * Login to the account with only session ID
     * @param sid Session ID
     */
    async loginBySessionId(sid: string) {
        this.sessionId = sid;
        this.request = new Request(this);

        const sessionInfo = Utility.decodeSessionId(sid);
        const profileResponse = await this.getUserProfile(sessionInfo.userId);
        const accountResponse = await this.getAccount();

        this.profile = profileResponse.userProfile;
        this.account = accountResponse.account;
    }

    /**
     * Get account info
     * @returns Account info
     */
    async getAccount(): Promise<models.account.AccountResponse> {
        const response = await this.request.call(`/account`, {
            method: "get",
            ndcId: this.ndcId
        });

        return await response.json();
    }

    /**
     * Send text message to the chat
     * @param text Text to send
     * @param threadId Chat to send a message to
     * @param parameters Message parameters
     * @see {@link models.chat.SendTextMessageParameters}
     * @returns Chat message
     */
    async sendTextMessage(
        text: string,
        threadId: string,
        parameters?: models.chat.SendTextMessageParameters
    ): Promise<models.chat.MessageResponse> {
        const body = {
            type: 0,
            replyMessageId: parameters?.replyTo,
            content: text
                .replace("<$", "‎‏")
                .replace("$>", "‬‭"),
            extensions: null,
            attachedObject: parameters?.attachedObject
        }
        
        if (parameters?.replyTo)
            body.replyMessageId = parameters.replyTo;
        
        if (parameters?.mentionedArray)
            body.extensions = {
                mentionedArray: parameters.mentionedArray
            }
        
        const response = await this.request.call(`/chat/thread/${threadId}/message`, {
            method: "post",
            ndcId: this.ndcId,
            body: body,
            contentType: Request.DefaultHeaderValues.CONTENT_TYPE_APPLICATION_JSON
        });

        return await response.json();
    }

    /**
     * Get user profile information
     * @param uid User ID from which to get the profile info
     * @returns User profile
     */
    async getUserProfile(uid: string): Promise<models.account.UserProfileResponse> {
        const response = await this.request.call(`/user-profile/${uid}`, {
            method: "get",
            ndcId: this.ndcId
        });

        return await response.json();
    }

    /**
     * Register bot command.
     *
     * Bot will react on the message if it starts with {@link command}
     * @param command Command name
     * @param callback Command callback
     */
    onCommand(command: string, callback: (message: EventChatMessageO) => void) {
        this.event.commands.push({
            command: command,
            callback: callback
        });
        this.event.on(command, callback);
    }

    /**
     * Register WebSocket event listener
     * @param event Event name
     * @param callback Event callback
     */
    onEvent<T extends EventO>(event: string, callback: (message: EventMessage<T>) => void) {
        this.event.on(event, callback);
    }

    /** Start listening messages from websocket */
    startListening() {
        this.event = new Event(this);
        this.event.start();
    }

    /** Stop listening messages from websocket */
    stopListening = () => this.event.stop();
}
