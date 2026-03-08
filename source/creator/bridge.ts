import { CmcpError, ErrorCode } from '../shared/errors';

interface CreatorMessageApi {
    request(channel: string, method: string, ...args: unknown[]): Promise<unknown>;
}

interface EditorLike {
    Message?: CreatorMessageApi;
}

declare const Editor: EditorLike;

export interface NodePatch {
    [key: string]: unknown;
}

export interface CreatorBridgeOptions {
    operationTimeoutMs?: number;
}

export class CreatorBridge {
    private readonly operationTimeoutMs: number;

    constructor(options: CreatorBridgeOptions = {}) {
        this.operationTimeoutMs = options.operationTimeoutMs ?? 0;
    }

    async health(): Promise<{ editorApiReady: boolean }> {
        return {
            editorApiReady: typeof Editor !== 'undefined' && !!Editor.Message,
        };
    }

    async getSceneTree(): Promise<unknown> {
        return this.request('scene', 'query-node-tree');
    }

    async findNode(path: string): Promise<unknown> {
        return this.request('scene', 'query-node-by-path', path);
    }

    async createNode(parentPath: string, nodeName: string): Promise<unknown> {
        return this.request('scene', 'create-node', { parent: parentPath, name: nodeName });
    }

    async updateNode(path: string, patch: NodePatch): Promise<unknown> {
        return this.request('scene', 'update-node', { path, patch });
    }

    async deleteNode(path: string): Promise<unknown> {
        return this.request('scene', 'delete-node', path);
    }

    async queryAsset(query: { uuid?: string; path?: string }): Promise<unknown> {
        return this.request('asset-db', 'query-asset', query);
    }

    async importAsset(path: string): Promise<unknown> {
        return this.request('asset-db', 'import-asset', path);
    }

    async reimportAsset(uuid: string): Promise<unknown> {
        return this.request('asset-db', 'reimport-asset', uuid);
    }

    async openAsset(uuid: string): Promise<unknown> {
        return this.request('asset-db', 'open-asset', uuid);
    }

    async generateComponentScript(targetPath: string, className: string): Promise<unknown> {
        const script = [
            "import { _decorator, Component } from 'cc';",
            'const { ccclass } = _decorator;',
            '',
            `@ccclass('${className}')`,
            `export class ${className} extends Component {`,
            '    start() {}',
            '    update(_deltaTime: number) {}',
            '}',
            '',
        ].join('\n');
        return this.request('asset-db', 'create-script', { targetPath, script });
    }

    private async request(channel: string, method: string, ...args: unknown[]): Promise<unknown> {
        if (typeof Editor === 'undefined' || !Editor.Message) {
            throw new CmcpError(ErrorCode.Internal, 'Cocos Editor API is unavailable');
        }
        const { withTimeout } = await import('../shared/timeout');
        const promise = Editor.Message.request(channel, method, ...args);
        const wrapped =
            this.operationTimeoutMs > 0
                ? withTimeout(Promise.resolve(promise), this.operationTimeoutMs)
                : Promise.resolve(promise);
        try {
            return await wrapped;
        } catch (error) {
            if (error instanceof CmcpError) {
                throw error;
            }
            throw new CmcpError(ErrorCode.Internal, `Creator API call failed: ${channel}.${method}`, error);
        }
    }
}
