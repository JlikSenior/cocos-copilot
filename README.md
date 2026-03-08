# Cocos Copilot

**MCP (Model Context Protocol) server for Cocos Creator.** Use Cursor, VS Code, or any MCP client to control scene, assets, and scripts from the editor via AI or automation.

---

## Features

- **Scene**: Get scene tree, find node by path, create / update / delete nodes
- **Assets**: Query by path, import / reimport, open in editor
- **Scripts**: Generate component script stubs
- **Dual transport**: WebSocket and Streamable HTTP (SSE) for Cursor and other clients
- **Auth & safety**: Token-based auth; optional confirm token for destructive operations

---

## Requirements

- **Cocos Creator** >= 3.8.8
- **MCP client**: e.g. Cursor (built-in MCP), or VS Code with an MCP extension

---

## Install

### From Cocos Store (recommended)

1. Open your project in Cocos Creator.
2. **Extension Manager** → find **Cocos Copilot** → Install / Enable.
3. Check the **Console**: you should see `[Cocos Copilot][info] MCP host started at ws://127.0.0.1:18888/mcp and http://127.0.0.1:18888/sse`.

### From source / clone

```bash
cd cocos-copilot
npm install
npm run build
```

Then load the extension in Creator (Extension Manager → Add extension → select this folder).

---

## Cursor setup

1. In Cocos Creator, enable Cocos Copilot and confirm the MCP server is running (see Console).
2. In **Cursor**: open **Settings → MCP**.
3. Add a new server with:
   - **URL**: `http://127.0.0.1:18888/sse` (use HTTP, not `ws://`)
   - **Auth** (if required): `cocos-copilot-dev-token` (or the value of `CMCP_AUTH_TOKEN`)
4. Save; Cursor will connect to Cocos Copilot.
5. In chat, you can ask the AI to use Cocos Copilot, e.g. “Get the current scene tree” or “Create a node named X under the root.”

---

## Available tools

| Category | Tools |
|----------|--------|
| **Scene** | `scene_get_tree`, `scene_find_node`, `scene_create_node`, `scene_update_node`, `scene_delete_node` |
| **Assets** | `asset_query`, `asset_import`, `asset_reimport`, `asset_open` |
| **Script** | `script_generate_component` |

Every request must include `authToken` (default: `cocos-copilot-dev-token`). Destructive actions (delete node, import/reimport, generate script) may require `confirmToken: "confirm-dangerous-op"` when confirmation is enabled.

---

## Configuration

Set these **before** starting Cocos Creator (e.g. in system env or a launcher script):

| Variable | Description |
|----------|-------------|
| `CMCP_PORT` | Port (default: `18888`) |
| `CMCP_AUTH_TOKEN` | Auth token (default: `cocos-copilot-dev-token`) |
| `CMCP_READONLY_MODE` | Set to `true` to disable all write operations |
| `CMCP_HOST` | Bind address (default: `127.0.0.1`) |

---

## Menu

After enabling the extension:

- **Output log** — print MCP status to Console
- **Restart MCP** — restart the MCP server
- **Show MCP Status** — show connection info

---

## Security

- Requests without a valid `authToken` are rejected.
- When “confirm dangerous operations” is on, delete / import / reimport / script generation require the correct `confirmToken` to run.

---

## Docs

- [Usage & verification (TESTING.md)](docs/TESTING.md) — build, connect, tool overview, config
- [Publish to Cocos Store (STORE.md)](docs/STORE.md) — packaging and store submission

---

## Author

**Jlik**

---

## License

Use and modify as needed. See Cocos Creator extension terms for distribution.
