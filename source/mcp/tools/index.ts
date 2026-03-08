import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CreatorBridge } from '../../creator/bridge';
import type { SecurityPolicy } from '../security';
import { registerSceneTools } from './scene-tools';
import { registerAssetTools } from './asset-tools';
import { registerHealthTools } from './health-tools';
import { registerScriptTools } from './script-tools';

export function registerAllTools(server: McpServer, bridge: CreatorBridge, security: SecurityPolicy): void {
    registerHealthTools(server, bridge, security);
    registerSceneTools(server, bridge, security);
    registerAssetTools(server, bridge, security);
    registerScriptTools(server, bridge, security);
}
