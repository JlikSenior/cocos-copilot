# Cocos Copilot — 商店上传文案

## 关键字 / Keywords

**中文（逗号分隔）：**  
MCP, Cursor, VS Code, AI, 场景编辑, 资源管理, 脚本生成, Cocos Creator, 扩展

**English (comma-separated):**  
MCP, Cursor, VS Code, AI, scene editor, asset management, script generation, Cocos Creator, extension

---

## 资源描述（支持 Markdown）

### 中文

```markdown
**Cocos Copilot** 是 Cocos Creator 的 MCP（Model Context Protocol）服务扩展。在编辑器中启动 MCP 服务后，可在 Cursor、VS Code 等 IDE 中通过 AI 或脚本调用 Creator 的场景、资源与脚本能力。

**主要功能**
- **场景**：获取场景树、按路径查找节点、创建/更新/删除节点
- **资源**：按路径查询资源、导入/重新导入、在编辑器中打开
- **脚本**：生成组件脚本空壳

**连接方式**
- 支持 **WebSocket** 与 **Streamable HTTP (SSE)**，便于与 Cursor 等客户端对接
- 默认地址：`http://127.0.0.1:18888/sse`，鉴权令牌可在扩展中配置

适用于希望用 AI 或自动化脚本操作 Cocos Creator 场景与资源的开发者。
```

### English

```markdown
**Cocos Copilot** is an MCP (Model Context Protocol) server extension for Cocos Creator. Once the MCP server is started in the editor, you can use Cursor, VS Code, or other IDEs to control Creator via AI or scripts.

**Features**
- **Scene**: Get scene tree, find node by path, create / update / delete nodes
- **Assets**: Query assets by path, import / reimport, open in editor
- **Scripts**: Generate component script stubs

**Connection**
- Supports **WebSocket** and **Streamable HTTP (SSE)** for clients like Cursor
- Default endpoint: `http://127.0.0.1:18888/sse`; auth token is configurable in the extension

For developers who want to drive Cocos Creator scenes and assets from AI or automation scripts.
```

---

## 纯文本版（若商店不支持 Markdown 可贴此）

### 中文

Cocos Copilot 是 Cocos Creator 的 MCP（Model Context Protocol）服务扩展。在编辑器中启动 MCP 服务后，可在 Cursor、VS Code 等 IDE 中通过 AI 或脚本调用 Creator 的场景、资源与脚本能力（如获取场景树、按路径查询资源、创建/更新/删除节点、生成组件脚本等）。支持 WebSocket 与 Streamable HTTP(SSE)，便于与 Cursor 等客户端对接。

### English

Cocos Copilot is an MCP (Model Context Protocol) server extension for Cocos Creator. Once the MCP server is started in the editor, you can use Cursor, VS Code, or other IDEs to control Creator via AI or scripts: get scene tree, query assets by path, create/update/delete nodes, generate component scripts, etc. It supports WebSocket and Streamable HTTP (SSE) for clients like Cursor.
