export enum ErrorCode {
    Unauthorized = -32001,
    Forbidden = -32002,
    NotFound = -32003,
    Internal = -32099,
}

export class CmcpError extends Error {
    constructor(
        public readonly code: ErrorCode,
        message: string,
        public readonly cause?: unknown,
    ) {
        super(message);
        this.name = 'CmcpError';
    }
}

export function toSafeError(error: unknown): { code: number; message: string } {
    if (error instanceof CmcpError) {
        return { code: error.code, message: error.message };
    }
    if (error instanceof Error) {
        return { code: ErrorCode.Internal, message: error.message };
    }
    return { code: ErrorCode.Internal, message: String(error) };
}
