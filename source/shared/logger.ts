export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
    requestId?: string;
    sessionId?: string;
    toolName?: string;
    [key: string]: unknown;
}

const PREFIX = '[Cocos Copilot]';

export function log(level: LogLevel, message: string, context?: LogContext): void {
    const parts = [`${PREFIX}[${level}]`, message];
    if (context && Object.keys(context).length > 0) {
        parts.push(JSON.stringify(context));
    }
    const line = parts.join(' ');
    if (level === 'error') {
        console.error(line);
    } else {
        console.log(line);
    }
}
