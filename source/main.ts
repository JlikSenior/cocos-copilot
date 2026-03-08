/**
 * Cocos Copilot extension entry: load/unload MCP host and menu message handlers.
 */
import { startMcpHost, stopMcpHost, getMcpHostStatus } from './mcp/host';
import { log } from './shared/logger';

export const methods: { [key: string]: (...args: any[]) => any } = {
    showLog() {
        const status = getMcpHostStatus();
        log('info', 'MCP status', status);
        console.log('[Cocos Copilot] MCP status', status);
    },

    async restartMcp() {
        stopMcpHost();
        const status = await startMcpHost();
        console.log('[Cocos Copilot] MCP restarted at ws://' + status.host + ':' + status.port + '/mcp');
    },

    showMcpStatus() {
        const status = getMcpHostStatus();
        console.log('[Cocos Copilot] MCP status', status);
    },
};

export function load() {
    startMcpHost().then((status) => {
        console.log('[Cocos Copilot] MCP started at ws://' + status.host + ':' + status.port + '/mcp');
    }).catch((err) => {
        console.error('[Cocos Copilot] MCP start failed', err);
    });
}

export function unload() {
    stopMcpHost();
}
