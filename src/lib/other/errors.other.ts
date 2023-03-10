export class AminoError extends Error {
    statusCode?: number;

    constructor(message: string, statusCode?: number) {
        super(message);
        this.statusCode = statusCode;
    }

    static readonly Unauthorized = new AminoError("Please login to your account");
    static readonly Unknown = new AminoError("Unknown error");
}
