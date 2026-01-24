# UI 系统配色（Color System）

UI 配色不是“某一个页面配得好看”，而是一套可复用、可扩展、可维护的规则系统：组件引用的是“颜色角色（Token）”，而不是直接写色值。

## 颜色层级（你提出的四大类）

- 主题色：品牌强调色（Primary）
- 文字色：主文字 / 次文字（Text Primary / Secondary）
- 功能色：Success / Warning / Danger / Info
- 系统结构层级色：Background / Surface / Border / On Primary

每个 Token 都有亮色 / 暗色两套值，用于 Light / Dark 两种主题。

## 主色（Primary）

主题色只有一个：`primary`，但需要 5 档（主色本身 + 变体，热力图/强调强弱等）：

- `primary`（主题色本身）
- `primary.25`
- `primary.50`
- `primary.75`
- `primary.deep`（比主题色更深一档，往更黑方向）

`primary.25 / .50 / .75` 不是透明度，而是“看起来像覆盖强度”的实体色；生成口径以 `background.surface` 为基底进行混合（卡片区域）。

为了避免把“主文字色”和“主题色”混淆：

- `text.primary`：主文字色（灰阶/中性色优先，可读性优先）
- `text.brand`：品牌/强调文字色（等同 `primary`，用于链接/高亮文案等）

固定色（跨模式不变）：有些颜色在 Light/Dark 下是同一个值（例如纯白用于按钮文字、纯黑用于某些图标）。

- 规则：不需要“多做一个白色”，同一个 Token 允许 `light == dark`（两套值相同即可）
- 好处：命名保持单一来源，组件引用不分叉

## 文字色（Text）

我们采用「**角色文字色**」的方式，让规范更少、更清晰（不再维护 `text100–text900` 的全量灰阶色板）。

固定色：

- `text.black` = `#000000`
- `text.white` = `#FFFFFF`

语义（Role）：组件尽量用 Role，不直接写色值

- text.primary：主文字（正文/标题）
- text.secondary：次文字（说明/注释）
- text.tertiary：弱文字（占位/弱提示）
- text.inverse：反色文字（深色底上的文字）
- text.brand：品牌/强调文字（= primary，用于链接/高亮文案）

默认映射（第一版口径，可后续微调）：

- background.surface（主要承载背景）：`text.primary / text.secondary / text.tertiary` 分层使用  
- 禁用态（不可点击）：不单独创建 `text.disabled`，优先用 `text.tertiary`（必要时再补一个自定义文字色）  
- 深色底（按钮/强调块/深色卡片）：`text.inverse`（通常接近白）

### 自定义文字色（补充方案）

当 `text.primary/secondary/tertiary/inverse` 不够用时，可以新增自定义文字色，例如：

- `text_new1`
- `text_new2`

Playground 会根据颜色亮度自动排序，并把它们以“真实文本行”的方式放进 Typography 预览里，方便你直接看在 UI 中的效果。

可读性底线：正文（text.primary）在主要承载背景（通常是 background.surface）上建议至少满足 AA（≈ 4.5:1）。

## 功能色（Functional）

功能色表达“状态含义”，不是交互禁用，也不是结构阴影：

- Success：成功/完成/可用
- Warning：提示/注意/潜在风险
- Danger：错误/危险/破坏性操作
- Info：中性信息提示/说明

每个功能色 3 档：`.default`（主色）/ `.bg`（浅底）/ `.text`（在 bg 上的文字）

`.bg` 的“浅底感”建议沿用主题色口径：以 `background.surface` 为基底做混合（实体色）。

## 结构层级色（Structure）

结构层不仅是背景层级，还包含边界线/分割线/阴影/叠加层（决定层级关系与可读性）。

背景（Background）三层（从低到高）：

- `background.base`：地面（页面最底部背景）
- `background.surface`：地摊/卡片（容器表面，主要承载内容）
- `background.elevated`：悬浮（弹窗/浮窗等抬升层）

- Border：`border.default` / `border.muted` /（可选）`border.strong`
- Divider：`divider.default` /（可选）`divider.muted`
- Shadow：`shadow.sm` / `shadow.md` / `shadow.lg`
- Overlay（hover 统一叠层）：`overlay.hover`（Light `rgba(0,0,0,0.10)` / Dark `rgba(255,255,255,0.10)`）/（可选）`overlay.pressed`
- Scrim（弹窗遮罩）：`overlay.scrim`（Light `rgba(0,0,0,0.45)` / Dark `rgba(0,0,0,0.55)`）

## 其他

放 3 个“更灵活的桶”，避免一开始就把系统绑死：

- 业务语义色（`domain.*`）：例如交易涨/跌红绿（避免和功能色冲突）
- 数据可视化色（`dataViz.*`）：图表/热力图/分段颜色
- 图标/插画色（`icon.*`）：图标强调/多色图标的统一管理

## 在 HaaoDeBook 里调色（交互页面）

目录：`颜色` → `UI 系统配色`

你可以：

- 直接在左侧编辑每个 Token 的亮/暗色
- 右侧实时预览 Light / Dark 的界面效果
- 导出 JSON，导入到 Figma（按你当前使用的导入方式/插件）

## 导出到 Figma（Tokens Studio）

1. 在 `UI 系统配色` 页面点 `导出 Figma Variables JSON（亮色）` 与 `导出 Figma Variables JSON（暗色）`
2. 在你当前使用的“可识别该 JSON 的导入方式/插件”中分别导入两份文件
3. 亮/暗两套值会对应两个 Mode（`Light` / `Dark`）

> 后续如果你希望“直接生成 Figma Variables（官方变量）”的导入格式，我们也可以在导出里加一个选项，按你当前的变量命名规则输出。

## 命名说明

本文档中的 `background.base / background.surface / background.elevated`、`primary.25 / .50 / .75 / .deep` 是“规则层面的建议命名”。如果你在 Figma 里更偏好中文变量名（例如“主字体/备注字体”），我们也可以在导出时同时输出“中文名 + 稳定 id”的映射，保证命名可读且不丢一致性。
