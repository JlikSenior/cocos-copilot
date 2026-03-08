import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CreatorBridge } from '../../creator/bridge';
import { log } from '../../shared/logger';
import { getRequestContext, runWithToolContext } from '../../shared/request-context';
import { SecurityPolicy } from '../security';

const baseInputSchema = {
    authToken: z.string().optional(),
    confirmToken: z.string().optional(),
};

export function registerAssetTools(
    server: McpServer,
    bridge: CreatorBridge,
    security: SecurityPolicy,
): void {
    const registerTool = (server as any).tool?.bind(server);

    registerTool('asset_query', 'Query an asset by uuid or path', { ...baseInputSchema, uuid: z.string().optional(), path: z.string().optional() }, async ({ authToken, uuid, path }: { authToken?: string; uuid?: string; path?: string }) => {
        return runWithToolContext('asset_query', async () => {
            log('debug', 'asset_query invoked', getRequestContext());
            security.authorize({ authToken });
            const data = await bridge.queryAsset({ uuid, path });
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        });
    });

    registerTool('asset_import', 'Import asset from file system path (dangerous operation)', { ...baseInputSchema, path: z.string() }, async ({ authToken, confirmToken, path }: { authToken?: string; confirmToken?: string; path: string }) => {
        return runWithToolContext('asset_import', async () => {
            security.authorize({ authToken });
            security.guardWriteOperation('asset_import', { authToken, confirmToken });
            const data = await bridge.importAsset(path);
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        });
    });

    registerTool('asset_reimport', 'Reimport asset by uuid (dangerous operation)', { ...baseInputSchema, uuid: z.string() }, async ({ authToken, confirmToken, uuid }: { authToken?: string; confirmToken?: string; uuid: string }) => {
        return runWithToolContext('asset_reimport', async () => {
            security.authorize({ authToken });
            security.guardWriteOperation('asset_reimport', { authToken, confirmToken });
            const data = await bridge.reimportAsset(uuid);
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        });
    });

    registerTool('asset_open', 'Open an asset by uuid', { ...baseInputSchema, uuid: z.string() }, async ({ authToken, uuid }: { authToken?: string; uuid: string }) => {
        return runWithToolContext('asset_open', async () => {
            security.authorize({ authToken });
            const data = await bridge.openAsset(uuid);
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        });
    });
}
