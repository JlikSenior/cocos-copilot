import { CmcpError, ErrorCode } from '../shared/errors';
import type { CmcpConfig } from './config';

export interface SecurityInput {
    authToken?: string;
    confirmToken?: string;
}

const DANGEROUS_CONFIRM_TOKEN = 'confirm-dangerous-op';

export class SecurityPolicy {
    private readonly config: CmcpConfig;

    constructor(config: CmcpConfig) {
        this.config = config;
    }

    authorize(input: SecurityInput): void {
        if (!this.config.authToken) {
            return;
        }
        if (input.authToken !== this.config.authToken) {
            throw new CmcpError(ErrorCode.Unauthorized, 'Invalid auth token');
        }
    }

    guardWriteOperation(toolName: string, input: SecurityInput): void {
        if (this.config.readonlyMode) {
            throw new CmcpError(ErrorCode.Forbidden, `Tool '${toolName}' is disabled by readonly mode`);
        }
        if (!this.config.confirmDangerousOps) {
            return;
        }
        const DANGEROUS_TOOLS = [
            'scene_delete_node',
            'asset_import',
            'asset_reimport',
            'script_generate_component',
        ] as const;
        if (DANGEROUS_TOOLS.includes(toolName as (typeof DANGEROUS_TOOLS)[number])) {
            if (input.confirmToken !== DANGEROUS_CONFIRM_TOKEN) {
                throw new CmcpError(
                    ErrorCode.Forbidden,
                    `Tool '${toolName}' requires confirmToken='${DANGEROUS_CONFIRM_TOKEN}'`,
                );
            }
        }
    }

    static getDangerousConfirmTokenHint(): string {
        return DANGEROUS_CONFIRM_TOKEN;
    }
}
