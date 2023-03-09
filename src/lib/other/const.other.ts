export class Constants {
    static readonly PREFIX = Buffer.from("19", "hex");
    static readonly SIG_KEY = Buffer.from("DFA5ED192DDA6E88A12FE12130DC6206B1251E44", "hex");
    static readonly DEVICE_KEY = Buffer.from("E7309ECC0953C6FA60005B2765F99DBBC965C8E9", "hex");

    static readonly API_URL = "https://service.narvii.com/api/v1";
    static readonly WS_URL = "wss://ws1.narvii.com";
    static readonly GLOBAL_NDC = 0;

    static SocketMessageTypes = class {
        static readonly CHAT = 1000;
    }

    static MessageTypes = class {
        static readonly TEXT = 0;
    }
}
