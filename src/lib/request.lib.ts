import { Bot } from "./bot.lib.js"
import { RequestParameters } from "./models/request.models.js"
import { SignatureUtility } from "./other/signature.other.js"
import { Utility } from "./other/utility.other.js"

export class Request {
    private bot: Bot;

    constructor(bot: Bot) {
        this.bot = bot;
    }

    /**
     * Make an asynchronous HTTP request to the AminoApps server
     * @param path Service path
     * @param parameters Request parameters (see {@link RequestParameters})
     * @returns Fetch {@link Response}
     */
    async call(path: string, parameters: RequestParameters) {
        const requestInit: RequestInit = {
            method: "get"
        }

        const headersInit: HeadersInit = {}
        headersInit[Request.DefaultHeaderKeys.NDC_DEVICE_ID] = this.bot.deviceId;
        headersInit[Request.DefaultHeaderKeys.USER_AGENT] = this.bot.userAgent;

        if (parameters.method)
            requestInit.method = parameters.method;

        if (parameters.contentType)
            headersInit[Request.DefaultHeaderKeys.CONTENT_TYPE] = parameters.contentType;

        if (parameters.body)
            switch (parameters.contentType) {
                case Request.DefaultHeaderValues.CONTENT_TYPE_APPLICATION_JSON:
                    parameters.body["timestamp"] = Date.now();
                    const body = JSON.stringify(parameters.body);

                    headersInit[Request.DefaultHeaderKeys.NDC_MSG_SIG] = SignatureUtility.generateSignature(
                        Buffer.from(body)
                    );
                    requestInit.body = body;

                    break;
                default:
                    headersInit[Request.DefaultHeaderKeys.NDC_MSG_SIG] = SignatureUtility.generateSignature(
                        parameters.body
                    );
                    requestInit.body = parameters.body;
            }
        
        if (this.bot.sessionId)
            headersInit[Request.DefaultHeaderKeys.NDC_AUTH] = "sid=" + this.bot.sessionId;

        requestInit.headers = headersInit;

        const response = await fetch(
            Utility.getPathFromNdc(parameters.ndcId) + path,
            requestInit
        );

        return response;
    }

    /**
     * Default HTTP and AminoApps header keys
     */
    static DefaultHeaderKeys = class {
        static readonly NDC_AUTH = "NdcAuth";
        static readonly NDC_DEVICE_ID = "NdcDeviceId";
        static readonly NDC_MSG_SIG = "Ndc-Msg-Sig";

        static readonly CONTENT_TYPE = "Content-Type";
        static readonly USER_AGENT = "User-Agent";
    }

    /**
     * Default HTTP and AminoApps header values
     */
    static DefaultHeaderValues = class {
        static readonly CONTENT_TYPE_APPLICATION_JSON = "application/json";
        static readonly USER_AGENT = "AminoTS 0.0.1";
    }
}
