# UI 系统配色 Playground：预览组件 & Token 映射（草案）

目标：右侧勾选某个 Token 后，左侧出现“真实 UI 场景里的使用效果”，而不是一个孤立色块/色点；同时用尽量少的组件覆盖所有 Token。

## 设计原则

- **真实**：所有颜色都落在真实组件里（文字、按钮、列表、表格、弹窗、阴影、分割线、遮罩、热力图……）。
- **少组件**：优先复用同一张卡片承载多个 Token；只有无法承载时才新增卡片。
- **可读**：每个 Token 在对应组件里“足够显眼”，用户一眼能看出它在 UI 中的职责。
- **可扩展**：新增 Token 时，优先补到已有组件的某个子元素；避免无限加卡片。

## Token 类型（用于决定“放在哪里”）

按 ID 规则把 Token 归类，后续所有映射/展示逻辑都以“类型”驱动：

- **主题色**：`primary` / `primary.*`
- **文字**：`text.*`（Role）+ `text.black` / `text.white` + 自定义补充（如 `text_new1`）
- **功能色**：`functional.{success|warning|danger|info}.default`（`bg/text` 在预览组件内由 `default` 自动派生）
- **结构色**
  - 背景：`background.{base|surface|elevated}`
  - 描边：`border.{default|muted|...}`
  - 分割线：`divider.{default|...}`
  - 叠加：`overlay.{hover|pressed|scrim}`
  - 阴影：`shadow.{sm|md|lg}`
- **其他（预留）**：`domain.*` / `dataViz.*` / `icon.*`

## 组件最小集（建议 6 张卡片）

下面 6 张卡片基本可以覆盖当前所有 Token（主题/文字/功能/结构）。每张卡片内部再用“子元素”覆盖更多 Token。

### 1）App Header + CTA（基础内容页片段）

**用途**：快速看“主内容 + 主按钮 + 次按钮”的整体效果（最接近真实产品页面）。

- 覆盖 Token
  - `text.primary` / `text.secondary`
  - `primary`（主按钮）
  - `border.default`（次按钮/控件边界）
  - `background.surface`（承载容器）
- 适合观察
  - 正文/标题对比是否够
  - 主按钮与页面整体是否协调
  - 次按钮边界是否太抢/太弱

### 2）Buttons / State（唯一 hover/pressed 展示区）

**用途**：只在这里展示交互叠加层，避免全页面到处“hover”造成混乱。

- 覆盖 Token
  - `overlay.hover` / `overlay.pressed`
  - `primary`（按钮底）+ `text.inverse` / `text.white`（按钮字）
  - `text.secondary`（Disabled 文案）
- 规则
  - 只要勾选任一 `overlay.*`，出现本卡片
  - 卡片内用文字说明：hover/pressed 的统一叠层口径

### 3）Typography（真实排版 + 文本角色）

**用途**：文字 Token 必须落在真实排版里（标题、正文、说明、占位、链接、反色）。

- 覆盖 Token
  - Role：`text.primary` / `text.secondary` / `text.tertiary` / `text.brand` / `text.inverse`
  - Fixed：`text.black` / `text.white`
  - Custom：`text_new*`（当角色不够用时的补充）
- 展示方式建议（避免“色点”）
  - Role：真实排版段落（H1/Body/Caption/Link/Inverse）
  - Fixed/Custom：用“文本行列表”的方式展示（每个勾选的 token 出现一行：名称 + 示例句子；并根据亮度自动选择承载背景与排序）

### 4）Data（列表 + 表格 + 选中态）

**用途**：把结构线、分割线、选中高亮、信息层级放到数据组件里呈现（非常真实）。

- 覆盖 Token
  - `divider.default`（行分割）
  - `border.muted` / `border.default`（表格容器/控件）
  - `primary.25`（选中行/聚焦底）
  - `text.primary` / `text.secondary` / `text.tertiary`（三层信息）
  - 功能色（状态 Badge）：`functional.*.default`
- 关键点
  - “选中/聚焦底”用 `primary.25` 最容易看出它是否干净
  - 表格是观察 divider/border 最敏感的组件之一

### 5）Status（功能色：Badge + Toast/Alert）

**用途**：功能色必须在“语义状态组件”里看（成功/警告/错误/信息）。

- 覆盖 Token
  - `functional.success.default` / `functional.warning.default` / `functional.danger.default` / `functional.info.default`
- 推荐结构（每个状态一条，组件内自动派生）
  - 强调/边界/图标：使用 `.default`
  - 背景（Container）：由 `.default` 叠加在 `background.surface` 上自动生成
  - 文案（On-Container）：由 `.default` 自动求得可读的文字色（必要时向黑/白靠拢以满足对比度）
- 勾选逻辑
  - 勾选 `functional.*.default` 即展示对应状态，并同时看到其派生的背景与文字效果

### 6）Structure（层级 + 阴影 + 弹窗遮罩）

**用途**：结构 Token 决定“层级关系”，必须用“层级组件”来检验。

- 覆盖 Token
  - 背景：`background.base` / `background.surface` / `background.elevated`
  - 描边/分割：`border.*` / `divider.*`
  - 阴影：`shadow.sm` / `shadow.md` / `shadow.lg`
  - 遮罩：`overlay.scrim`
- 展示方式
  - 三层背景（Base/Surface/Elevated）并排展示
  - 三档阴影的“抬升卡片”并排展示
  - 勾选 `overlay.scrim` 时出现 Modal（带 scrim + elevated 容器），用于看遮罩强度与对比

## 勾选 → 组件出现 的关系（建议规则）

### 1）组件显示规则（Card-level）

每张卡片定义一个 `triggers`（触发集合）：

- 当“已勾选 Token”与 `triggers` 有交集 → 卡片出现
- 无交集 → 卡片隐藏

这样用户勾选少量 Token 时，左侧也能保持干净。

### 2）子元素显示规则（Element-level）

每个子元素绑定一个“焦点 Token”（或一个小组 Token）：

- 单 Token：只勾选这个 Token 才出现这个子元素
- 组合 Token（例如功能色一组、热力图一组）：勾选组内任意一个 → 子元素出现

### 3）“单 token 也能看到完整组件”的组装策略

对必须成组才能好看的 Token（典型：功能色、主题色衍生）：

- **展示触发**：组内任意一个被勾选，就展示整组组件
- **使用值**：组件内部仍使用组内所有 Token（保证 UI 完整）
- **视觉强调**：只强调用户勾选到的那部分（让用户知道自己在看哪个 Token）

## Token → 放在哪里（覆盖清单）

按类型给出“最推荐放置点”，后续实现时优先按照这套映射落位：

- `primary`：Primary Button / Active Tab / 进度环 / 图表强调
- `primary.25`：选中行底 / Tab 选中底 / 轻提示底 / 热力图低等级
- `primary.50 / primary.75`：热力图中高等级 / 图表渐变
- `primary.deep`：深色强调块（例如 inverse label）/ 热力图最高等级

- `text.primary`：标题/正文
- `text.secondary`：说明/副标题/表格次信息
- `text.tertiary`：占位/弱提示/表头（更弱层级）
- `text.brand`：链接/强调文本
- `text.inverse`：深色底上的文字（按钮/强调块）
- `text_new*`：文本行列表（自动按亮度排序；偏亮的自动放到深色承载背景上）

- `functional.*.default`：Status 卡片（Badge + Toast/Alert，bg/text 在组件内派生）

- `background.base`：整个预览画布底
- `background.surface`：卡片承载面
- `background.elevated`：弹窗/浮层承载面
- `border.*`：输入框/表格容器/按钮描边
- `divider.*`：列表/表格分割线
- `shadow.*`：抬升卡片（SM/MD/LG）
- `overlay.scrim`：Modal scrim
- `overlay.hover / overlay.pressed`：唯一按钮状态演示区

## 兜底（保证每个勾选都“有地方看”）

如果未来新增 Token 一时还没放进上述 6 张卡片：

- 放入一个“**Token Spec**”组件（仍然是 UI 形态，不是色点）
  - text 类：一行示例文字
  - bg 类：一个小容器块 + 一行文字（展示承载感）
  - border/divider：一条线/一个边框样例
  - shadow：一个抬升块
  - overlay：一个按钮状态样例
  - functional：一个小提示条样例

这能保证系统始终完整，但不会逼着我们无限加新卡片。

## 定位使用地方（Locate）

右侧每个 Token 都应有“定位使用地方”：

- 点击后自动勾选该 Token（若未勾选）
- 左侧滚动到该 Token 的“最佳演示点”（优先选：最具体、最聚焦的子元素）
- 给予短暂高亮（outline/pulse），让用户立刻知道“这就是它的使用位置”
