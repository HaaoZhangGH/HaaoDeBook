# UI 设计系统（UI Design System）

目标：让 UI 产出“少返工、少返稿”。做法是把设计决策固定为两类：

- **Token（可编辑）**：可被组件引用的“角色/规格”（颜色、间距、圆角、阴影、动效时长……）
- **Rule（不可随意改）**：使用口径与验收标准（哪些能用、哪些禁止用、暗黑模式规则、对比度底线……）

入口：`颜色` → `UI 设计系统`（Playground：左侧真实 UI 预览，右侧 Token 编辑与导出）

## 1）Foundation（基础规范）

### 1.1 布局（Layout）

**要解决的问题**：页面/卡片在不同尺寸下怎么对齐，避免“看起来差不多但总要改”的返工。

- **规则（先定口径）**
  - 内容区（Content Area）：页面真实可排版区域的左右边距与最大宽度
  - 网格（Grid）：列数、gutter、对齐方式（用于卡片列表/设置页等）
  - 安全区（Safe Area）：顶部/底部/刘海/手势区域的留白策略
- **Token（可落地到系统）**
  - `layout.*`（例如 maxWidth / padding / columns / gutter）

> 注：Layout 通常“规则优先”，Token 是为了让实现与验收更可控。

### 1.2 间距（Spacing）

**要解决的问题**：所有页面/组件的留白一致，减少“凭感觉调”。

- **规则**
  - 统一 spacing scale（例如 4/8/12/16…），并给出常用组合（卡片 padding、列表行间距、模块间距）
- **Token（现有）**
  - `space.canvas.*`：画布边距与模块间距
  - `space.grid.gap`：两列/多列卡片间距
  - `space.card.padding`：卡片内边距

### 1.3 排版（Typography）

**要解决的问题**：字号/行高/字重的层级清晰，避免“字看着不对但说不清哪里不对”。

- **规则**
  - 角色（Role）：title/body/caption/link 等怎么用（什么时候加粗、什么时候换行高、什么时候截断）
  - 可读性：正文在主要承载背景上应满足 AA（≈ 4.5:1）
- **Token（建议）**
  - `type.*`（例如 display/title/body/caption 的 size/lineHeight/weight）

### 1.4 颜色（Colors）

**要解决的问题**：组件引用“颜色角色”，而不是直接写色值；Light/Dark 下保持语义一致。

#### 主题色（Primary）

- `primary`（主题色本身）
- `primary.25 / primary.50 / primary.75`（热力图/强调强弱；不是透明度，是实体色）
- `primary.deep`（更深一档，用于深色强调块）

#### 文字色（Text）

采用“角色文字色”，减少维护成本（不维护 `text100–text900` 灰阶板）。

- 固定色：`text.black` / `text.white`
- 角色（Role）：`text.primary` / `text.secondary` / `text.tertiary` / `text.inverse` / `text.brand`
- 自定义补充：`text_new*`（当角色不够用时才加）

#### 功能色（Functional：语义状态）

功能色表达“状态含义”，必须在语义状态组件里看（Badge/Toast/Alert）。

- **Token（现行简化口径）**：只保留 4 个主色
  - `functional.success.default`
  - `functional.warning.default`
  - `functional.danger.default`
  - `functional.info.default`
- **规则（关键）**
  - 背景（Container）与文字（On-Container）由 `.default` 在组件内自动派生（避免出现“成功描边被改成红色”这类破坏语义的一致性问题）
  - 功能色不用于结构线/阴影/禁用态；禁用态优先走 `text.tertiary` 或结构色规则

#### 结构层级色（Structure）

背景三层（从低到高）：

- `background.base`：页面最底层背景
- `background.surface`：卡片/容器表面（主要承载内容）
- `background.elevated`：浮层/弹窗承载面

边界与分割：

- `border.default` / `border.muted`
- `divider.default`

交互叠层与遮罩：

- `overlay.hover` / `overlay.pressed`
- `overlay.scrim`

阴影层级：

- `shadow.sm` / `shadow.md` / `shadow.lg`

### 1.5 圆角 / 描边 / 阴影（Radius/Border/Shadow）

**要解决的问题**：层级与质感一致，避免“这个角怎么不一样”“这个浮层怎么不够浮”。

- **Token（现有）**
  - `radius.card` / `radius.control` / `radius.button`
  - `border.*` / `divider.*`
  - `shadow.sm` / `shadow.md` / `shadow.lg`
- **规则（建议补齐到文档）**
  - `surface` vs `elevated` 的判定（什么时候需要阴影）
  - `border.muted` vs `border.default` 的使用场景

### 1.6 动效（Motion）

**要解决的问题**：统一“感觉”，避免每个组件各写各的时长/曲线。

- **规则（先定口径）**
  - 弹窗/Toast/切换/hover 的默认时长与曲线
- **Token（现有）**
  - `motion.duration.enter` / `motion.duration.exit`（出现/消失）
  - `motion.easing.enter` / `motion.easing.exit`（缓入/缓出：CSS timing-function）

## 2）预览映射（Playground）

Token 勾选后应该在“真实组件场景”里看效果（而不是孤立色块）。

- 映射草案：`docs/UI-设计系统-Playground-预览映射.md`

## 3）导出（下载即用）

- **颜色（Light/Dark）**：导出为 Figma Variables JSON（用于变量导入）
- **非颜色（间距/圆角/阴影/排版/布局/动效）**：导出为 `haao-ui-design-system.json`（给开发/AI/规范阅读）

## 4）验收清单（减少返工）

- 间距是否落在 scale（不出现“随手 15px”）
- 文字是否使用 role（不出现“随手加深/加亮”）
- 功能色是否只用于语义状态组件（不被挪作结构色）
- 暗黑模式是否保持语义一致（不是简单反相）
- 正文/小字对比度是否达标（至少 AA）
- overlay/阴影是否只在规定场景出现（不泛滥）
