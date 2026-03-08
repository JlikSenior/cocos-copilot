# Cocos Copilot 扩展上架 Cocos 插件商城指南

## 一、打包前准备

### 1. 修改作者与版本（可选）

在 `package.json` 中确认：

- `author`：改为你的名字或团队名（当前为 "Cocos Creator"）
- `version`：按 [semver](https://semver.org/lang/zh-CN/) 填写，上架后更新扩展时需递增

### 2. 构建

在扩展根目录执行：

```bash
npm install
npm run build
```

确认无报错，且生成 `dist/` 目录。

### 3. 准备商店素材

| 素材 | 要求 |
|------|------|
| **图标** | 256×256 像素，PNG，≤500KB |
| **截图** | 最多 5 张，JPG/PNG，单边 640～2048px，单张 ≤1MB |
| **介绍** | 中英文说明，格式参考 [资源介绍模板](https://store.cocos.com/document/zh/cocos-store-template-extension.html) |

图标可放在扩展目录下 `store/icon.png`，截图放在 `store/screenshots/`，便于打包时一起带上（上传时在网页里选文件即可）。

---

## 二、打包为 zip

商城要求 zip 内包含以下内容（在 **扩展根目录** 下选这些再打包，保证 zip 内第一层就是这些项）：

- `package.json`
- `dist/`（构建产物）
- `i18n/`
- `node_modules/`
- `scripts/`（含 `preinstall.js`、`pack-for-store.js`）

可选：`README.md`、`README.zh-CN.md`、`docs/`、`store/`（图标、截图）。

**不要**把整个 `extensions` 或项目根打进去，zip 解压后应直接得到名为 `cocos-copilot` 的扩展文件夹内容。

### 方式 A：手动打包

1. 进入 `extensions/cocos-copilot`。
2. 选中：`package.json`、`dist`、`i18n`、`node_modules`、`scripts`（以及需要的 `docs`、`README` 等）。
3. 右键 → 压缩为 zip（或使用 7-Zip/WinRAR）。
4. 将 zip 命名为 `cocos-copilot.zip`（或与扩展包名一致）。

### 方式 B：用脚本打包（Node）

在 `extensions/cocos-copilot` 下执行：

```bash
node scripts/pack-for-store.js
```

会在上一级目录生成 `cocos-copilot-1.0.0.zip`（版本号来自 package.json）。

---

## 三、提交到 Cocos 商店

1. **登录**  
   打开 [Cocos 开发者中心](https://auth.cocos.com/#/) 并登录。

2. **进入卖家资源**  
   进入 [商店 - 我的资源](https://store-my.cocos.com/#/seller/resources/)，点击 **发布新资源**。

3. **资源类别**  
   - 类别：**Creator 扩展 → 扩展**  
   - 名称：扩展在商城的显示名称（**提交后不可修改**，请谨慎填写，如「Cocos Copilot - AI 助手」）  
   - 勾选已阅读协议 → **下一步**

4. **资源介绍**  
   - 资源介绍：中、英文说明（可贴 README 或 STORE 中的说明）  
   - 截图：上传最多 5 张  
   - 图标：上传 256×256 的 PNG  
   - 支持平台：按需勾选（如 Android、iOS、HTML5）  
   - 关键字：如 `MCP`、`Cursor`、`VS Code`、`AI`、`场景编辑` 等  
   → **下一步**

5. **定价**  
   - 免费扩展：CNY 和 USD 均填 **0**  
   → **下一步**

6. **上传资源**  
   - Creator 版本要求：如 `>=3.8.8`（与 package.json 中 `editor` 一致）  
   - 版本号：与 package.json 中 `version` 一致（如 `1.0.0`）  
   - 扩展包名：与 package.json 中 `name` 一致（如 `cocos-copilot`）  
   - 资源包：上传前面打好的 **zip 文件**（≤100MB）  
   → **下一步**

7. **提交审核**  
   检查信息无误后点击 **提交审核**。商店会在约 **3 个工作日** 内审核。

---

## 四、注意事项

- Creator **2.x 与 3.x** 扩展不兼容，当前 Cocos Copilot 仅支持 3.8+，若需 2.x 需单独维护并提交另一份扩展。
- 版本号须符合 semver，后续更新扩展时需增大版本号并重新打包、上传新 zip。
- 名称一旦提交无法修改，其余介绍、截图、定价可在「我的资源」中编辑后再次提交审核。

---

## 五、资源介绍示例（可粘贴到商店）

**中文简介：**  
Cocos Copilot 是 Cocos Creator 的 MCP（Model Context Protocol）服务扩展。在编辑器中启动 MCP 服务后，可在 Cursor、VS Code 等 IDE 中通过 AI 或脚本调用 Creator 的场景、资源与脚本能力（如获取场景树、按路径查询资源、创建/更新/删除节点、生成组件脚本等）。支持 WebSocket 与 Streamable HTTP(SSE)，便于与 Cursor 等客户端对接。

**英文简介：**  
Cocos Copilot is an MCP (Model Context Protocol) server extension for Cocos Creator. Once the MCP server is started in the editor, you can use Cursor, VS Code, or other IDEs to control Creator via AI or scripts: get scene tree, query assets by path, create/update/delete nodes, generate component scripts, etc. It supports WebSocket and Streamable HTTP (SSE) for clients like Cursor.
