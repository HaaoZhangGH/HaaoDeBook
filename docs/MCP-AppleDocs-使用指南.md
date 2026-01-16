# MCP · Apple Docs（apple-docs）使用指南

本指南用于在 **VS Code 的 Codex 插件** 与 **Codex CLI** 中接入并使用 Apple Docs MCP（`@kimsungwhee/apple-docs-mcp`），通过自然语言检索 Apple Developer Documentation / WWDC 等内容。

本指南默认采用 **本地固定安装 + `node` 直接启动** 的方式（不使用 `npx` 拉包/缓存）。

---

## 1) 快速用法（对话示例）

直接在 VS Code 的 Codex 对话里提问即可。下面是一些“好用且常见”的问法（可直接复制）：

- `用 apple-docs 搜索 SwiftUI animations`
- `查 withAnimation 的官方文档，提炼 5 个要点，并附官方链接`
- `我该用哪个 API 做 iOS 的导航？给 3 个候选并解释差异（附官方链接）`
- `检查 SwiftData 在 iOS/macOS 的最低版本与弃用情况（给表格）`
- `搜索 macOS 26 release notes，并列出本次新增/变更点`
- `搜索 WWDC 2024 关于 SwiftUI animation 的 session，并给出 session id + 标题`
- `给我 WWDC 2024 某个 session 的全文 transcript，并提炼关键段落`

当你不确定应该用哪个工具时，直接用自然语言说“搜索/查文档/看兼容性/找 WWDC”，我会自动挑合适的工具。

---

## 2) 工具说明（放在一起）

下面是 apple-docs MCP 提供的工具说明（全部放在一起，便于查阅）。

`search_apple_docs`：搜索官方文档。适合：快速定位 API/类/方法；输出：链接列表。  
`get_apple_doc_content`：读取某条文档详情（JSON API）。适合：精读 + 相关/相似 API + 可用性分析；输出：完整内容。  
`list_technologies`：浏览 Apple 技术体系。适合：按分类/语言/Beta 了解全貌；输出：技术清单。  
`search_framework_symbols`：在框架内搜符号。适合：查类/协议/结构体（可通配符/类型过滤）；输出：符号列表。  
`get_related_apis`：找某 API 的关联 API。适合：理解继承/协议/See Also；输出：关联关系。  
`resolve_references_batch`：批量解析文档引用。适合：复杂页面“全引用”梳理；输出：引用展开结果。  
`get_platform_compatibility`：看跨平台/版本兼容性。适合：最低系统版本 + Beta/弃用判断；输出：兼容性信息。  
`find_similar_apis`：找相似/替代 API。适合：方案选型与替换；输出：推荐列表。  
`get_documentation_updates`：查官方更新。适合：WWDC/技术更新/Release Notes；输出：更新条目。  
`get_technology_overviews`：看技术概览/指南。适合：系统学习某方向；输出：概览结构与入口。  
`get_sample_code`：找官方示例项目。适合：按关键词/框架找可运行参考；输出：Sample 列表。  
`list_wwdc_videos`：浏览 WWDC sessions。适合：按主题/年份/是否含代码筛选；输出：Session 列表。  
`get_wwdc_video`：拿到某个 session 详情。适合：全文 transcript + code + 资源；输出：完整内容。  
`browse_wwdc_topics`：列出/浏览 WWDC 主题分类。适合：按方向逛内容；输出：主题与视频概览。  
`list_wwdc_years`：列出 WWDC 年份统计。适合：按年份回顾；输出：年份与数量。

---

## 3) 前置条件

- 已安装 Node.js（自带 `npm`）
- 已安装/可运行 `codex`（Codex CLI）

---

## 4) 安装（推荐：本地固定安装，不走 npx 缓存）

### 安装 npm 包到本地目录

```bash
mkdir -p /Users/zhanghao/.codex/mcp/apple-docs
npm install --prefix /Users/zhanghao/.codex/mcp/apple-docs @kimsungwhee/apple-docs-mcp@latest
```

入口文件：
`/Users/zhanghao/.codex/mcp/apple-docs/node_modules/@kimsungwhee/apple-docs-mcp/dist/index.js`

### 用 Codex CLI 添加 MCP server

```bash
codex mcp add apple-docs -- node /Users/zhanghao/.codex/mcp/apple-docs/node_modules/@kimsungwhee/apple-docs-mcp/dist/index.js
```

---

## 5) 安装（手动：编辑配置文件）

打开 `/Users/zhanghao/.codex/config.toml`，加入（或确认存在）：

```toml
[mcp_servers.apple-docs]
command = "node"
args = ["/Users/zhanghao/.codex/mcp/apple-docs/node_modules/@kimsungwhee/apple-docs-mcp/dist/index.js"]
```

---

## 6) 安装（可选：npx 启动方式，不推荐）

如果你不想在本地固定安装包，而是希望“用的时候再临时拉起”，可以用 `npx` 方式（会用到 npm/npx 缓存）：

```bash
codex mcp add apple-docs -- npx -y @kimsungwhee/apple-docs-mcp@latest
```

对应的 `config.toml` 形态通常是：

```toml
[mcp_servers.apple-docs]
command = "npx"
args = ["-y", "@kimsungwhee/apple-docs-mcp@latest"]
```

---

## 7) 验证（方式 A：只验证“配置已生效”）

```bash
codex mcp list
codex mcp get apple-docs
```

预期：
- `apple-docs` 出现在列表中
- `Status` 为 `enabled`

---

## 8) 验证（方式 B：验证“查询链路可用”）

1) **重启 VS Code** 或执行一次 **Reload Window**
2) 在 VS Code 的 Codex 对话里直接提问，例如：

- `用 apple-docs 搜索 SwiftUI animations`
- `用 apple-docs 搜索 macOS 26 release notes`
- `查 withAnimation 的官方文档，并给出链接和要点`
- `列出 SwiftUI 框架的技术概览入口`
- `搜索 WWDC 2024 的 SwiftUI 动画相关 session`

预期：
- 返回结果中出现 Apple 官方文档链接（`https://developer.apple.com/documentation/...`）
- 或出现结构化列表（如框架、API、URL 等）

---

## 9) 删除 / 禁用

### 删除 MCP 配置（推荐）

```bash
codex mcp remove apple-docs
```

### 删除本地安装文件（可选）

```bash
rm -rf /Users/zhanghao/.codex/mcp/apple-docs
```

### 手动删除配置（可选）

从 `/Users/zhanghao/.codex/config.toml` 移除整段：

```toml
[mcp_servers.apple-docs]
command = "node"
args = ["/Users/zhanghao/.codex/mcp/apple-docs/node_modules/@kimsungwhee/apple-docs-mcp/dist/index.js"]
```

---

## 10) 我怎么“用好”它（建议提问方式）

把你的问题拆成“目标 + 约束 + 输出格式”，效果最好：

- **找 API**：`搜索 SwiftUI 的动画相关 API，优先给最常用的 5 个，并附官方链接`
- **看一页文档**：`获取 withAnimation 的文档内容，顺便列出 related/similar APIs`
- **比兼容性**：`检查 SwiftUI xxx 在 iOS/macOS 的最低版本与废弃情况`
- **找 WWDC**：`搜索 WWDC 2024/2025 关于 SwiftUI animation 的 session，并给出 session id 与标题`

如果你希望“更像查资料”，可以明确要求：
- “只引用官方链接”
- “先给列表，再展开第 1 条”
- “只看 SwiftUI / 只看 UIKit / 只看 WWDC transcript”

---

## 11) 术语速查（npx / -y / @kimsungwhee）

- `npx`：npm 自带的“临时执行器”，可以直接运行某个 npm 包（可能会下载并使用缓存）。
- `-y`：`npx` 参数，表示自动同意/不再询问确认。
- `@kimsungwhee/apple-docs-mcp`：npm 的 scope 包名（`@kimsungwhee` 是发布者/组织命名空间）。

---

## 12) 配置写法为什么不一样（JSON vs TOML）

你在 README 里看到的通常是 **Claude Desktop** 的 JSON（字段叫 `mcpServers`），而我们这里是 **Codex** 的 TOML（字段叫 `[mcp_servers.xxx]`）。它们表达的本质相同：注册一个 MCP server，并告诉客户端“用什么命令 + 参数去启动它”。

---

## 13) 本地入口文件怎么确认？

```bash
ls -la /Users/zhanghao/.codex/mcp/apple-docs/node_modules/@kimsungwhee/apple-docs-mcp/dist
```
