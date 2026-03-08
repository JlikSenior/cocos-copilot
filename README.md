# Cocos Copilot

MCP (Model Context Protocol) server for Cocos Creator. Connect Cursor, VS Code, or other MCP clients to control scene, assets, and scripts from the editor.

## Requirements

- Cocos Creator >= 3.8.8
- MCP client (e.g. Cursor with MCP, or VS Code with an MCP extension)

## Install

1. Install the extension in your project (via Extension Manager or store).
2. Enable the extension; the MCP server starts automatically (default: `ws://127.0.0.1:18888/mcp` and `http://127.0.0.1:18888/sse`).
3. In your MCP client, add server URL: **`http://127.0.0.1:18888/sse`** for Cursor; use `authToken: "cocos-copilot-dev-token"` (configurable via `CMCP_AUTH_TOKEN`).

## Usage

- **Menu**: Extension menu → "Output log" / "Restart MCP" / "Show MCP Status".
- **Tools**: Use your AI/client to call tools such as `scene_get_tree`, `asset_query`, `scene_create_node`, etc. See [docs/TESTING.md](docs/TESTING.md) for a quick reference.

## Build from source

```bash
cd cocos-copilot
npm install
npm run build
```

## Configuration

Environment variables (set before starting Creator):

- `CMCP_PORT` — default 18888
- `CMCP_AUTH_TOKEN` — default `cocos-copilot-dev-token`
- `CMCP_READONLY_MODE` — set to `true` to disable write operations
