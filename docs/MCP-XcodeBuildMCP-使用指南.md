# MCP · XcodeBuildMCP（xcodebuild）使用指南

本指南用于在 **VS Code 的 Codex 插件** 与 **Codex CLI** 中接入并使用 XcodeBuildMCP（npm 包：`xcodebuildmcp`），通过自然语言调用 Xcode / Simulator / xcodebuild 相关能力。

本文默认采用 **本地固定安装 + `node` 直接启动** 的方式（不依赖 `npx` 启动）。

---

## 1) 快速用法（对话示例）

直接在 VS Code 的 Codex 对话里提问（把“你要做的事 + 工程位置/项目名”说清楚即可）。一般情况下你不需要写“用 xcodebuild”，我会自动判断是否调用该 MCP；只有你想强制指定时再加上“用 xcodebuild …”。

- `扫描当前目录有哪些 Xcode 项目`
- `列出这个工程的 schemes`
- `运行 doctor 检查 Xcode 环境`
- `列出 iOS simulators`
- `boot 一个 iPhone 15 的模拟器，然后 build & run`
- `对某个 scheme 在模拟器上跑测试，并把失败用例整理出来`

需要强制指定时：

- `用 xcodebuild 列出 iOS simulators`

---

## 2) 它能做什么（概览）

XcodeBuildMCP 提供一组工具用于：

- **工程发现**：扫描 `.xcodeproj/.xcworkspace`、列 schemes、查看 build settings、读取 bundle id
- **构建/运行/测试**：iOS Simulator / 真机 / macOS target 的 build & test & run
- **模拟器管理**：列/boot/open/erase、定位、外观、状态栏、录屏
- **日志抓取**：sim/device log capture
- **调试**：LLDB attach、断点、变量、栈
- **UI 自动化（模拟器）**：describe UI、tap/swipe/type、截图等（部分功能可能需要 AXe）

工具的完整列表（官方）见：`https://raw.githubusercontent.com/cameroncooke/xcodebuildmcp/main/docs/TOOLS.md`

---

## 3) 前置条件

- macOS 14.5+
- Xcode 16+（你当前机器已安装 Xcode）
- Node.js 18+（你当前机器已满足）

---

## 4) 安装（推荐：本地固定安装，不走 npx）

### 4.1 安装 npm 包到本地目录

```bash
mkdir -p /Users/zhanghao/.codex/mcp/xcodebuildmcp
npm install --cache /Users/zhanghao/.codex/npm-cache --prefix /Users/zhanghao/.codex/mcp/xcodebuildmcp xcodebuildmcp@latest
```

入口文件通常在：

`/Users/zhanghao/.codex/mcp/xcodebuildmcp/node_modules/xcodebuildmcp/build/index.js`

### 4.2 用 Codex CLI 添加 MCP server

```bash
codex mcp add xcodebuild -- node /Users/zhanghao/.codex/mcp/xcodebuildmcp/node_modules/xcodebuildmcp/build/index.js
```

---

## 5) 安装（手动：编辑配置文件）

打开 `/Users/zhanghao/.codex/config.toml`，加入（或确认存在）：

```toml
[mcp_servers.xcodebuild]
command = "node"
args = ["/Users/zhanghao/.codex/mcp/xcodebuildmcp/node_modules/xcodebuildmcp/build/index.js"]
```

---

## 6) 安装（可选：npx 启动方式）

如果你希望用 `npx` 启动（更省事，但会依赖 npm/npx 缓存）：

```bash
codex mcp add xcodebuild -- npx -y xcodebuildmcp@latest
```

---

## 7) 验证

### 7.1 验证“配置已生效”

```bash
codex mcp list
codex mcp get xcodebuild
```

预期：`xcodebuild` 为 `enabled`，`command` 为 `node`（或你选择的 `npx`）。

### 7.2 验证“实际可用”

在对话里执行：

- `用 xcodebuild 运行 doctor`

---

## 8) 删除 / 禁用

### 8.1 删除 MCP 配置（推荐）

```bash
codex mcp remove xcodebuild
```

### 8.2 删除本地安装文件（可选）

```bash
rm -rf /Users/zhanghao/.codex/mcp/xcodebuildmcp
```

---

## 9) 关于空间与“缓存”

你会看到的“占用增长”，主要来自 Xcode 的正常构建产物，并非 MCP 自己在疯狂写缓存：

- Xcode 构建缓存：`~/Library/Developer/Xcode/DerivedData`
- 模拟器数据：`~/Library/Developer/CoreSimulator`
- SwiftPM 构建（如有）：项目目录下的 `.build`

XcodeBuildMCP 自身主要占用：

- 本地安装：`/Users/zhanghao/.codex/mcp/xcodebuildmcp/node_modules`
- npm 安装缓存（本指南用）：`/Users/zhanghao/.codex/npm-cache`

---

## 10) 隐私与遥测（Sentry）

XcodeBuildMCP 默认使用 Sentry 做错误遥测。要关闭，请在 `/Users/zhanghao/.codex/config.toml` 给 `xcodebuild` 增加环境变量：

```toml
[mcp_servers.xcodebuild]
command = "node"
args = ["/Users/zhanghao/.codex/mcp/xcodebuildmcp/node_modules/xcodebuildmcp/build/index.js"]
env = { XCODEBUILDMCP_SENTRY_DISABLED = "true" }
```

---

## 11) 常用工作流建议（最省时间的问法）

- **先发现入口**：`扫描工程 → 列 schemes → 选 scheme`
- **再跑最小闭环**：`列 simulators → boot → build_run_sim`
- **遇到报错**：让模型把 `xcodebuild` 输出按“错误/警告/建议修复点”结构化整理，再逐条修
