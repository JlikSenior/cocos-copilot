export interface CmcpConfig {
    host: string;
    port: number;
    authToken: string;
    readonlyMode: boolean;
    confirmDangerousOps: boolean;
    operationTimeoutMs: number;
}

const DEFAULT_CONFIG: CmcpConfig = {
    host: '127.0.0.1',
    port: 18888,
    authToken: 'cocos-copilot-dev-token',
    readonlyMode: false,
    confirmDangerousOps: true,
    operationTimeoutMs: 0,
};

export function loadConfig(): CmcpConfig {
    const portRaw = process.env.CMCP_PORT;
    const port = portRaw ? parseInt(portRaw, 10) : DEFAULT_CONFIG.port;
    return {
        host: process.env.CMCP_HOST ?? DEFAULT_CONFIG.host,
        port: Number.isNaN(port) ? DEFAULT_CONFIG.port : port,
        authToken: process.env.CMCP_AUTH_TOKEN ?? DEFAULT_CONFIG.authToken,
        readonlyMode: process.env.CMCP_READONLY_MODE === 'true',
        confirmDangerousOps: process.env.CMCP_CONFIRM_DANGEROUS_OPS !== 'false',
        operationTimeoutMs: DEFAULT_CONFIG.operationTimeoutMs,
    };
}
