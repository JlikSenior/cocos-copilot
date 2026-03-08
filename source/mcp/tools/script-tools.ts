import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CreatorBridge } from '../../creator/bridge';
import { SecurityPolicy } from '../security';

export function registerScriptTools(server: McpServer, bridge: CreatorBridge, security: SecurityPolicy): void {
    const registerTool = (server as any).tool?.bind(server);
    registerTool(
        'script_generate_component',
        'Generate a Cocos component script at the given path',
        {
            authToken: z.string().optional(),
            confirmToken: z.string().optional(),
            targetPath: z.string(),
            className: z.string(),
        },
        async ({ authToken, confirmToken, targetPath, className }: { authToken?: string; confirmToken?: string; targetPath: string; className: string }) => {
            security.authorize({ authToken });
            security.guardWriteOperation('script_generate_component', { authToken, confirmToken });
            const data = await bridge.generateComponentScript(targetPath, className);
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        },
    );
}
