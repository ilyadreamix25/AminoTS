import { createHmac, randomBytes } from "crypto";
import { Constants } from "./const.other.js";

export class DeviceUtility {
    /**
     * Generate device identifier from given {@link data}
     * @param data Data from which to generate an ID
     * @returns Device identifier
     */
    static generateDeviceId(data = randomBytes(20)) {
        const identifier = data.toString("hex");
        const mac = createHmac("sha1", Constants.DEVICE_KEY)
            .update(Buffer.from(Constants.PREFIX + identifier, "binary"))
            .digest("hex");

        return (Constants.PREFIX.toString("hex") + Buffer.from(identifier, "binary").toString("hex") + mac).toUpperCase();
    }
}
