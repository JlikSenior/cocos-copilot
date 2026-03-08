import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CreatorBridge } from '../../creator/bridge';
import { SecurityPolicy } from '../security';

export function registerHealthTools(server: McpServer, bridge: CreatorBridge, security: SecurityPolicy): void {
    const registerTool = (server as any).tool?.bind(server);
    registerTool(
        'mcp_health',
        'Health and capability check',
        { authToken: z.string().optional() },
        async ({ authToken }: { authToken?: string }) => {
            security.authorize({ authToken });
            const health = await bridge.health();
            const hint = SecurityPolicy.getDangerousConfirmTokenHint();
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({ status: 'ok', editorApiReady: health.editorApiReady, dangerousConfirmTokenHint: hint }, null, 2),
                    },
                ],
            };
        },
    );
}
