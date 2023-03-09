export class AminoError extends Error {
    constructor(message: string) {
        super(message);
    }

    static readonly Unauthorized = new AminoError("Please login to your account");
}
