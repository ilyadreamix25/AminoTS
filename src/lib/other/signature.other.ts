import { createHmac } from "crypto";
import { Constants } from "./const.other.js";

export class SignatureUtility {
    /**
     * Generate signature from given `data`
     * @param data Data from which to generate a signature
     * @returns Signature
     */
    static generateSignature(data: Buffer) {
        const mac = createHmac("sha1", Constants.SIG_KEY)
            .update(data)
            .digest("hex");

        return Buffer.from(Constants.PREFIX.toString("hex") + mac, "hex").toString("base64");
    }
}
