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

export function registerSceneTools(
    server: McpServer,
    bridge: CreatorBridge,
    security: SecurityPolicy,
): void {
    const registerTool = (server as any).tool?.bind(server) ?? ((name: string, _desc: string, schema: any, fn: any) => {
        (server as any)._toolHandlers = (server as any)._toolHandlers || {};
        (server as any)._toolHandlers[name] = { schema, fn };
    });

    registerTool('scene_get_tree', 'Get current scene tree', baseInputSchema, async ({ authToken }: { authToken?: string }) => {
        return runWithToolContext('scene_get_tree', async () => {
            log('debug', 'scene_get_tree invoked', getRequestContext());
            security.authorize({ authToken });
            const data = await bridge.getSceneTree();
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
        });
    });

    registerTool(
        'scene_find_node',
        'Find a scene node by path',
        { ...baseInputSchema, path: z.string() },
        async ({ authToken, path }: { authToken?: string; path: string }) => {
            return runWithToolContext('scene_find_node', async () => {
                log('debug', 'scene_find_node invoked', getRequestContext());
                security.authorize({ authToken });
                const data = await bridge.findNode(path);
                return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
            });
        },
    );

    registerTool(
        'scene_create_node',
        'Create a scene node under parent path',
        { ...baseInputSchema, parentPath: z.string(), nodeName: z.string() },
        async ({ authToken, parentPath, nodeName }: { authToken?: string; parentPath: string; nodeName: string }) => {
            return runWithToolContext('scene_create_node', async () => {
                log('debug', 'scene_create_node invoked', getRequestContext());
                security.authorize({ authToken });
                security.guardWriteOperation('scene_create_node', { authToken });
                const data = await bridge.createNode(parentPath, nodeName);
                return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
            });
        },
    );

    registerTool(
        'scene_update_node',
        'Update node properties by node path',
        { ...baseInputSchema, path: z.string(), patchJson: z.string() },
        async ({ authToken, path, patchJson }: { authToken?: string; path: string; patchJson: string }) => {
            return runWithToolContext('scene_update_node', async () => {
                log('debug', 'scene_update_node invoked', getRequestContext());
                security.authorize({ authToken });
                security.guardWriteOperation('scene_update_node', { authToken });
                const patch = JSON.parse(patchJson) as Record<string, unknown>;
                const data = await bridge.updateNode(path, patch);
                return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
            });
        },
    );

    registerTool(
        'scene_delete_node',
        'Delete node by path. Requires confirm token when dangerous op guard is enabled.',
        { ...baseInputSchema, path: z.string() },
        async ({ authToken, confirmToken, path }: { authToken?: string; confirmToken?: string; path: string }) => {
            return runWithToolContext('scene_delete_node', async () => {
                log('debug', 'scene_delete_node invoked', getRequestContext());
                security.authorize({ authToken });
                security.guardWriteOperation('scene_delete_node', { authToken, confirmToken });
                const data = await bridge.deleteNode(path);
                return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
            });
        },
    );
}
