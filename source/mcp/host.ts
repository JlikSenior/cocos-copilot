import http from 'http';
import { WebSocketServer } from 'ws';
import { loadConfig } from './config';
import { SecurityPolicy } from './security';
import { CreatorBridge } from '../creator/bridge';
import { registerAllTools } from './tools';
import { log } from '../shared/logger';

let httpServer: http.Server | null = null;
let wsServer: WebSocketServer | null = null;

export interface McpHostStatus {
    running: boolean;
    host: string;
    port: number;
    activeConnections: number;
    [key: string]: unknown;
}

let activeConnections = 0;

export async function startMcpHost(): Promise<McpHostStatus> {
    if (httpServer) {
        log('info', 'MCP start skipped because it is already running');
        return { running: true, host: loadConfig().host, port: loadConfig().port, activeConnections };
    }

    const config = loadConfig();
    const bridge = new CreatorBridge({ operationTimeoutMs: config.operationTimeoutMs });
    const security = new SecurityPolicy(config);

    const { McpServer } = await import('@modelcontextprotocol/sdk/server/mcp.js');
    const { StreamableHTTPServerTransport } = await import('@modelcontextprotocol/sdk/server/streamableHttp.js');

    const server = new McpServer({ name: 'cocos-copilot', version: '0.1.0' });
    registerAllTools(server, bridge, security);
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => `sse-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    });
    await server.connect(transport);

    httpServer = http.createServer(async (req, res) => {
        if ((req.url === '/sse' || req.url?.startsWith('/sse?')) && (req.method === 'GET' || req.method === 'POST')) {
            const sessionId = transport.sessionId ?? `sse-${Date.now()}`;
            if (req.method === 'GET') log('info', 'Streamable HTTP session initialized', { sessionId });
            try {
                await transport.handleRequest(req as any, res);
            } catch (e) {
                log('error', 'Failed to handle MCP request: ' + (e instanceof Error ? e.message : String(e)));
                res.writeHead(500);
                res.end();
            }
            return;
        }
        res.writeHead(404);
        res.end();
    });

    wsServer = new WebSocketServer({ noServer: true });
    httpServer.on('upgrade', (req, socket, head) => {
        const url = new URL(req.url ?? '', `http://${req.headers.host}`);
        if (url.pathname === '/mcp') {
            wsServer!.handleUpgrade(req, socket, head, (ws) => {
                wsServer!.emit('connection', ws, req);
            });
        } else {
            socket.destroy();
        }
    });

    wsServer.on('connection', async (ws, req) => {
        const sessionId = `ws-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        activeConnections++;
        log('info', 'MCP client connected', { sessionId });
        ws.on('close', () => {
            activeConnections--;
            log('info', 'MCP client disconnected', { sessionId });
        });
        try {
            const serverInstance = new McpServer({ name: 'cocos-copilot', version: '0.1.0' });
            registerAllTools(serverInstance, bridge, security);
            const { createWsTransport } = await import('./ws-transport.js');
            const transport = createWsTransport(ws);
            await serverInstance.connect(transport);
        } catch (e) {
            log('error', 'Failed to connect MCP client: ' + (e instanceof Error ? e.message : String(e)));
            ws.close();
        }
    });

    await new Promise<void>((resolve, reject) => {
        httpServer!.listen(config.port, config.host, () => resolve());
        httpServer!.on('error', reject);
    });

    let sseHint = '';
    try {
        const { StreamableHTTPServerTransport } = await import('@modelcontextprotocol/sdk/server/streamableHttp.js');
        if (StreamableHTTPServerTransport) sseHint = ' and http://' + config.host + ':' + config.port + '/sse';
    } catch (_) {}
    log('info', `MCP host started at ws://${config.host}:${config.port}/mcp${sseHint}`);

    try {
        const health = await bridge.health();
        if (health.editorApiReady) log('info', 'Startup check: Editor API is ready');
    } catch (_) {}

    return { running: true, host: config.host, port: config.port, activeConnections };
}

export function stopMcpHost(): void {
    if (wsServer) {
        wsServer.close();
        wsServer = null;
    }
    if (httpServer) {
        httpServer.close();
        httpServer = null;
    }
    log('info', 'MCP host stopped');
}

export function getMcpHostStatus(): McpHostStatus {
    const config = loadConfig();
    return {
        running: !!httpServer,
        host: config.host,
        port: config.port,
        activeConnections,
    };
}
