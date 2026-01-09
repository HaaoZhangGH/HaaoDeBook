# UI 规范（Tokens）

本项目是纯前端静态站点，主题会各自注入 CSS。为了避免后续新增主题时 UI 走样，统一用 `src/styles.css` 里的 tokens 作为“基础设计规范”。

## 1) 基础 Tokens（全站统一）

定义位置：`src/styles.css`

### 间距（Spacing）
- `--space-8: 8px`
- `--space-12: 12px`
- `--space-16: 16px`

约定：布局层面的 `padding / margin / gap` 优先使用这 3 个值；需要 24 等组合时用 `calc(var(--space-16) + var(--space-8))`。

### 圆角（Radius）
- `--radius-12: 12px`
- `--radius-16: 16px`

约定：按钮/输入类优先用 `12`，卡片/容器优先用 `16`。

### 描边（Stroke）
- `--stroke-1: rgba(255,255,255,0.10)`（最弱）
- `--stroke-2: rgba(255,255,255,0.14)`（默认）
- `--stroke-3: rgba(255,255,255,0.18)`（更强调）

约定：分割线/容器边框用 `--stroke-1/2`，需要更强调（如 icon 按钮）用 `--stroke-3`。

### 文字层级（Typography）
- `--fs-title: 16px`（标题）
- `--fs-body: 13px`（正文）
- `--fs-note: 12px`（注释/说明）

颜色：
- `--text`（主要文字）
- `--muted`（说明/次要文字）

## 2) 基础组件（全站已提供）

这些组件在 `src/styles.css` 已做过基础样式，主题内尽量复用：
- `select`、`input[type="search"]`：统一边框/背景/右侧箭头留白
- `.icon-btn`：统一 icon 按钮外观（用于顶栏、卡片内的小按钮等）

## 3) 主题内样式约定（建议）

1. 每个主题注入的 CSS 只做“主题私有类”，不要全局覆盖通用元素（除非非常确定）。
2. 面板/内容区的布局间距、圆角、字号尽量引用 tokens：
   - `gap: var(--space-12)`、`padding: var(--space-16)`、`border-radius: var(--radius-16)`、`font-size: var(--fs-note)` 等。
3. 主题如果需要自己的局部变量，建议“基于 tokens 再派生”，例如：
   - `--border: var(--stroke-2)`、`--muted: var(--muted)`、`--fg: var(--text)`

