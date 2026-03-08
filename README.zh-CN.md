# Cocos Copilot

**Cocos Creator 的 MCP（Model Context Protocol）服务扩展。** 在 Cursor、VS Code 等 MCP 客户端中通过 AI 或脚本调用编辑器的场景、资源与脚本能力。

---

## 功能概览

- **场景**：获取场景树、按路径查找节点、创建/更新/删除节点
- **资源**：按路径查询、导入/重新导入、在编辑器中打开
- **脚本**：生成组件脚本空壳
- **双传输**：支持 WebSocket 与 Streamable HTTP (SSE)，便于对接 Cursor 等客户端
- **安全**：鉴权令牌；危险操作可要求二次确认（confirmToken）

---

## 环境要求

- **Cocos Creator** >= 3.8.8
- **MCP 客户端**：如 Cursor（内置 MCP）、或安装 MCP 扩展的 VS Code

---

## 安装

### 从 Cocos 商城安装（推荐）

1. 在 Cocos Creator 中打开你的项目。
2. **扩展管理器** → 找到 **Cocos Copilot** → 安装 / 启用。
3. 查看 **控制台**，应出现：`[Cocos Copilot][info] MCP host started at ws://127.0.0.1:18888/mcp and http://127.0.0.1:18888/sse`。

### 从源码 / 克隆安装

```bash
cd cocos-copilot
npm install
npm run build
```

然后在 Creator 的扩展管理器中添加本地扩展（选择本目录）。

---

## Cursor 配置

1. 在 Cocos Creator 中启用 Cocos Copilot，确认控制台中有 MCP 启动日志。
2. 在 **Cursor** 中打开 **设置 → MCP**。
3. 添加新服务器：
   - **URL**：`http://127.0.0.1:18888/sse`（必须填 HTTP，不要填 `ws://`）
   - **鉴权**（如需）：`cocos-copilot-dev-token`（或你设置的 `CMCP_AUTH_TOKEN`）
4. 保存后 Cursor 会连接 Cocos Copilot。
5. 在对话中可让 AI 使用 Cocos Copilot，例如「获取当前场景树」或「在根节点下创建一个名为 X 的节点」。

---

## 可用工具

| 类别 | 工具 |
|------|------|
| **场景** | `scene_get_tree`、`scene_find_node`、`scene_create_node`、`scene_update_node`、`scene_delete_node` |
| **资源** | `asset_query`、`asset_import`、`asset_reimport`、`asset_open` |
| **脚本** | `script_generate_component` |

每次请求需传 `authToken`（默认 `cocos-copilot-dev-token`）。删除节点、导入/重新导入、生成脚本等危险操作在开启确认时需传 `confirmToken: "confirm-dangerous-op"`。

---

## 配置

在**启动 Cocos Creator 之前**设置（如系统环境变量或启动脚本）：

| 变量 | 说明 |
|------|------|
| `CMCP_PORT` | 端口（默认 `18888`） |
| `CMCP_AUTH_TOKEN` | 鉴权令牌（默认 `cocos-copilot-dev-token`） |
| `CMCP_READONLY_MODE` | 设为 `true` 时禁止所有写操作 |
| `CMCP_HOST` | 监听地址（默认 `127.0.0.1`） |

---

## 菜单

启用扩展后，扩展菜单中提供：

- **输出日志** — 在控制台输出 MCP 状态
- **Restart MCP** — 重启 MCP 服务
- **Show MCP Status** — 查看连接信息

---

## 安全说明

- 未提供有效 `authToken` 的请求会被拒绝。
- 开启「危险操作需确认」时，删除节点、导入/重新导入、生成脚本等需传正确的 `confirmToken` 才会执行。

---

## 文档

- [使用与验证说明 (TESTING.md)](docs/TESTING.md) — 构建、连接、工具概览、配置
- [上架 Cocos 商城 (STORE.md)](docs/STORE.md) — 打包与提交商店

---

## 作者

**Jlik**

---

## 许可证

可自由使用与修改。分发请遵循 Cocos Creator 扩展相关条款。
