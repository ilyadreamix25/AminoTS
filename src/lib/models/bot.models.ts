export interface BotParameters {
    sessionId?: string;
    ndcId?: number;
    deviceId?: string;
    userAgent?: string;
    libraryConfig?: LibraryConfig;
}

export interface LibraryConfig {
    debug: boolean;
    throwErrors: boolean;
}
