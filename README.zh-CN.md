# Cocos Copilot

Cocos Creator 的 MCP（Model Context Protocol）服务扩展。可在 Cursor、VS Code 等 MCP 客户端中通过 AI 或脚本调用编辑器的场景、资源与脚本能力。

## 环境要求

- Cocos Creator >= 3.8.8
- 支持 MCP 的客户端（如 Cursor、或带 MCP 扩展的 VS Code）

## 安装与启用

1. 在项目中安装本扩展（通过扩展管理器或商城）。
2. 在扩展管理器中启用扩展，MCP 服务将自动启动（默认 `ws://127.0.0.1:18888/mcp` 与 `http://127.0.0.1:18888/sse`）。
3. 在 MCP 客户端中添加服务器地址：Cursor 请使用 **`http://127.0.0.1:18888/sse`**；工具调用时传入 `authToken: "cocos-copilot-dev-token"`（可通过环境变量 `CMCP_AUTH_TOKEN` 修改）。

## 使用

- **菜单**：扩展菜单 →「输出日志」/「Restart MCP」/「Show MCP Status」。
- **工具**：在 AI 或客户端中调用 `scene_get_tree`、`asset_query`、`scene_create_node` 等工具，详见 [docs/TESTING.md](docs/TESTING.md)。

## 从源码构建

```bash
cd cocos-copilot
npm install
npm run build
```

## 配置

在启动 Creator 前可设置环境变量：

- `CMCP_PORT` — 端口，默认 18888
- `CMCP_AUTH_TOKEN` — 鉴权令牌，默认 `cocos-copilot-dev-token`
- `CMCP_READONLY_MODE` — 设为 `true` 时禁止所有写操作
