export interface RequestContext {
    requestId?: string;
    sessionId?: string;
    toolName?: string;
    [key: string]: unknown;
}

let currentContext: RequestContext = {};

export function getRequestContext(): RequestContext {
    return { ...currentContext };
}

export function setRequestContext(ctx: RequestContext): void {
    currentContext = { ...ctx };
}

export async function runWithToolContext<T>(
    toolName: string,
    fn: () => Promise<T>,
    requestId?: string,
    sessionId?: string,
): Promise<T> {
    const prev = { ...currentContext };
    currentContext = {
        ...prev,
        toolName,
        ...(requestId !== undefined && { requestId }),
        ...(sessionId !== undefined && { sessionId }),
    };
    try {
        return await fn();
    } finally {
        currentContext = prev;
    }
}
