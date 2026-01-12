# UI 规范（Tokens）

本项目是纯前端静态站点，主题会各自注入 CSS。为了避免后续新增主题时 UI 走样，统一用 `src/styles.css` 里的 tokens 作为“基础设计规范”。

## 1) 基础 Tokens（全站统一）

定义位置：`src/styles.css`

### 颜色（Neutral）
用于全站暗色 UI 的基础灰阶系统（建议优先使用这些 token，而不是主题内写死颜色）：

- `--neutral-950: #0A0A0A`（应用底色）
- `--neutral-900: #1C1C1C`（侧边栏/面板底色）
- `--neutral-875: #181818`（内容模块/表单控件底色）
- `--neutral-800: #2D2D2D`（选中/hover）
- `--neutral-700: #393939`（active）
- `--neutral-600: #4D4D4D`（强调描边/分割）
- `--neutral-400: #777777`（次要文字）
- `--neutral-0: #FFFFFF`（主要文字）

约定：
- 大模块尽量用“背景块 + 间距 + 标题层级”建立层次，少用描边。
- 通用别名：`--bg / --text / --muted / --glass / --glass-2` 仍可用（会映射到上面的 neutral 系统）。

### 品牌色（Brand）
- `--brand-500: #3377FF`（主题色）
- `--brand-600: #2B67E6`（hover）
- `--brand-700: #2358CC`（active）
- `--brand-200: rgba(51,119,255,0.22)`（弱强调/高亮背景）

约定：仅在“需要强调的主动作”使用（例如：自己上传），其它按钮保持中性灰阶。

### 按钮层级（Button）
- 主按钮：使用 `--brand-500/600/700`（例如“自己上传”）
- 弱按钮：用品牌色的低透明度背景（例如 `rgba(51,119,255,.10)`）+ 更低对比文字（`--text-2`），用于“取消/清除/应用”这类次要动作

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
- `--fs-h1: 22px`（大标题）
- `--fs-h2: 16px`（小标题）
- `--fs-title: 18px`（标题）
- `--fs-body: 13px`（正文）
- `--fs-note: 12px`（注释/说明）

颜色：
- `--text-strong`（最强调）
- `--text`（主要文字）
- `--text-2`（中等强调：如“暗度/短调”等标签）
- `--text-3`（次要说明）
- `--text-4`（更弱的注释）
- `--muted`（别名：当前映射为 `--text-3`）

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
