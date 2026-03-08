import type { WebSocket } from 'ws';
import type { JSONRPCMessage } from '@modelcontextprotocol/sdk/types.js';

/**
 * WebSocket transport implementing the MCP Transport interface.
 * Server sets onmessage when connect() is called; we invoke it when we receive a message.
 */
export function createWsTransport(ws: WebSocket): {
    start(): Promise<void>;
    send(message: JSONRPCMessage): Promise<void>;
    close(): Promise<void>;
    onclose?: () => void;
    onerror?: (error: Error) => void;
    onmessage?: (message: JSONRPCMessage) => void;
    sessionId?: string;
} {
    const transport = {
        sessionId: `ws-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        onclose: undefined as (() => void) | undefined,
        onerror: undefined as ((error: Error) => void) | undefined,
        onmessage: undefined as ((message: JSONRPCMessage) => void) | undefined,

        async start(): Promise<void> {
            ws.on('message', (data) => {
                try {
                    const text = data.toString();
                    const message = JSON.parse(text) as JSONRPCMessage;
                    transport.onmessage?.(message);
                } catch (e) {
                    transport.onerror?.(e instanceof Error ? e : new Error(String(e)));
                }
            });
            ws.on('close', () => {
                transport.onclose?.();
            });
            ws.on('error', (err) => {
                transport.onerror?.(err);
            });
        },

        async send(message: JSONRPCMessage): Promise<void> {
            if (ws.readyState !== 1) return;
            const text = JSON.stringify(message);
            ws.send(text);
        },

        async close(): Promise<void> {
            ws.close();
            transport.onclose?.();
        },
    };

    return transport;
}
