# Cocos Copilot 使用与验证说明

本文档供开发者与进阶用户参考。普通用户只需在 Cursor/VS Code 中配置 MCP 地址即可使用。

---

## 1. 构建（从源码安装时）

在扩展目录执行：

```bash
cd extensions/cocos-copilot
npm install
npm run build
```

确认无 TypeScript 报错。

---

## 2. 启动与连接

1. 打开 Cocos Creator（>= 3.8.8），打开任意项目。
2. 在 **扩展管理器** 中启用 Cocos Copilot 扩展。
3. 查看 **控制台**，应出现：`[Cocos Copilot][info] MCP host started at ws://127.0.0.1:18888/mcp and http://127.0.0.1:18888/sse`。
4. 若端口被占用，可设置环境变量 `CMCP_PORT=18889` 后重启 Creator。

---

## 3. Cursor 接入

1. **Cursor 设置 → MCP** 添加服务器，URL 填写：**`http://127.0.0.1:18888/sse`**（必须为 HTTP，不能填 `ws://`）。
2. 保存后 Cursor 会连接 Cocos Copilot。
3. 在对话中可让 AI 调用 Cocos Copilot 工具，例如：
   - 「用 Cocos Copilot 获取当前场景树」
   - 「用 Cocos Copilot 按路径查询资源，路径为 assets/xxx」
   - 「用 Cocos Copilot 在根节点下创建一个名为 XXX 的节点」（危险操作需按提示传 `confirmToken: "confirm-dangerous-op"`）

---

## 4. 可用工具概览

- **场景**：`scene_get_tree`、`scene_find_node`、`scene_create_node`、`scene_update_node`、`scene_delete_node`
- **资源**：`asset_query`、`asset_import`、`asset_reimport`、`asset_open`
- **脚本**：`script_generate_component`

每次调用需传 `authToken`（默认 `cocos-copilot-dev-token`）；部分写操作还需 `confirmToken: "confirm-dangerous-op"`。

---

## 5. 配置项

| 环境变量 | 说明 |
|----------|------|
| `CMCP_PORT` | 端口，默认 18888 |
| `CMCP_AUTH_TOKEN` | 鉴权令牌，默认 `cocos-copilot-dev-token` |
| `CMCP_READONLY_MODE` | 设为 `true` 时禁止所有写操作 |

---

## 6. 安全说明

- 未传 `authToken` 的请求会被拒绝。
- 删除节点、导入/重新导入资源、生成脚本等危险操作在开启确认时需传正确的 `confirmToken` 才会执行。
