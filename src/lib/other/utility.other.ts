import { SidInfo } from "../models/account.models.js";
import { Constants } from "./const.other.js";

export class Utility {
    /**
     * Get path from NDC ID:
     * <pre>
     *     NDC ID == 0 -> /g/s
     *     NDC ID  > 0 -> /x{@link ndcId}/s
     *     NDC ID  < 0 -> /s-x{@link ndcId}
     * </pre>
     * @param ndcId NDC ID from which to get the path
     * @returns Path from the NDC ID
     */
    static getPathFromNdc(ndcId: number) {
        if (ndcId == Constants.GLOBAL_NDC)
            return Constants.API_URL + "/g/s";
        else if (ndcId > Constants.GLOBAL_NDC)
            return Constants.API_URL + "/x" + ndcId.toString() + "/s";

        return Constants.API_URL + `/s-x${Math.abs(ndcId)}`;
    }

    /**
     * Get session information from {@link sid}
     * @param sid Session ID from which to get the session info
     * @returns Session info
     */
    static decodeSessionId(sid: string): SidInfo {
        let decodedSid = Buffer
            .from(sid + "=".repeat(4 - sid.length % 4), "base64url")
            .toString("utf-8");
        decodedSid = decodedSid.slice(1, decodedSid.indexOf("0}") + 2);

        const sessionData: {
            "1": any;
            "0": number;
            "3": number;
            /** UID */
            "2": string;
            /** Timestamp */
            "5": number;
            /** IP */
            "4": string;
            /** Client type */
            "6": number;
        } = JSON.parse(decodedSid);

        return {
            userId: sessionData["2"],
            loginTimestamp: sessionData["5"],
            loginIp: sessionData["4"],
            clientType: sessionData["6"]
        }
    }
}
