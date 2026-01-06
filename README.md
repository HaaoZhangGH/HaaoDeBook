# 设计书（DesignBook）

一个用于**学习设计、理解设计**的动态/交互式“书”。内容会持续迭代：每个主题（3D、图文、练习等）都是一个可独立开发、可随时新增的模块；左侧是目录导航，中间是内容区，右侧是该主题的控制面板。

## 如何运行

两种方式任选其一：

1. 直接打开根目录的 `index.html`。
2. 如果浏览器在 `file://` 下限制脚本加载，在仓库根目录运行：
   - `python3 -m http.server 8000`
   - 打开 `http://localhost:8000/`

说明：当前使用 `index.html` 中的 `importmap` 从 CDN 加载 `three`（需要网络）。

## 目录结构与约定

- `index.html`
  - 应用壳（布局、importmap、加载入口脚本）。
- `src/styles.css`
  - 壳层 UI（侧边栏、面板、顶部工具栏、目录样式）。
- `src/registry.js`
  - **注册表**：所有“项目/主题”都在这里声明（新增入口最集中，避免散落导致混用）。
- `src/app.js`
  - 壳层逻辑：hash 路由、项目/主题目录渲染、主题挂载/卸载、面板/目录折叠状态持久化。
- `src/projects/<projectId>/topics/<topicId>/topic.js`
  - **主题模块**：只负责渲染内容区与面板区，以及自身交互与资源管理。

## 路由约定

- URL Hash：`#/<projectId>/<topicId>`
- 示例：`#/color-models/rgb-cube`

## 新增内容（推荐流程）

### A. 新增一个主题（左侧目录多一项）

1. 新建主题文件：
   - `src/projects/<projectId>/topics/<topicId>/topic.js`
   - 可直接复制模板：`src/projects/_template/topics/_template/topic.js`
2. 在 `src/registry.js` 对应项目下追加 topic：
   - `id`: `<topicId>`
   - `title`: 显示名
   - `key`: `"<projectId>/<topicId>"`（必须与主题注册一致）
   - `entry`: `"./src/projects/<projectId>/topics/<topicId>/topic.js"`
3. 刷新页面，目录会自动出现新条目。

### B. 新增一个项目（项目下拉多一项）

1. 在 `src/registry.js` 的 `DesignBook.projects` 里新增一个项目对象：
   - `id`: `<projectId>`
   - `title`: 显示名
   - `topics`: 该项目下的主题列表（同上）
2. 切换项目时，壳层会默认进入该项目的第一个主题。

## 主题模块约定（必须）

主题文件加载后需要注册自己（`key` 必须匹配 `registry.js` 里的 `key`）：

```js
window.DesignBook?.registerModule?.("<projectId>/<topicId>", { mount });
```

`mount(api)` 会收到壳层提供的能力（只在这三块区域内渲染，避免不同主题互相污染）：

- `api.contentEl`：中间内容容器
- `api.panelEl`：右侧面板内容容器
- `api.actionsEl`：顶部工具栏中间区域（可放“重置视角”等按钮）
- `api.setPanelTitle(title)`：设置面板标题
- `api.setPanelCollapsed(bool)` / `api.setSidebarCollapsed(bool)`：控制壳层折叠

`mount()` 建议返回 `unmount()` 用于清理资源（事件监听、`requestAnimationFrame`、WebGL 资源等）。切换主题时壳层会调用它。

## 新增主题自检清单（避免串台/混用）

- 注册表：`src/registry.js` 里新增了 topic，并且 `key === "<projectId>/<topicId>"`
- 文件结构：主题代码只放在 `src/projects/<projectId>/topics/<topicId>/topic.js`（不要把多个主题塞进同一个文件）
- 注册一致：主题文件里 `registerModule("<projectId>/<topicId>")` 与注册表 `key` 完全一致
- 清理完备：实现并返回 `unmount()`（清理事件监听、计时器、RAF、WebGL 资源等）

## 常见踩坑（建议遵守）

- `key` 与 `entry` 路径不一致：会导致“目录有了但加载失败”。
- 主题写了全局状态/全局事件但不清理：切换主题后会串台或性能下降（务必在 `unmount()` 清理）。
- 主题不要直接改壳层 DOM 结构（`#sidebar/#main/#panel`）：只用 `contentEl/panelEl/actionsEl` 三个入口渲染。

更详细的实现说明见：`docs/设计书-架构与实现.md`。
