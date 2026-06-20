# AI 模拟记账与实时反馈交互 Spec

## Why
人生资产负债表已完成骨架与图表展示，现需实现核心交互闭环：用户通过底部输入框描述行为，系统模拟 AI 分析并实时更新资产数值、推进历史趋势图、弹出 Toast 评价，使应用成为可顺畅演示的完整 MVP。

## What Changes
- 新建 `src/components/InputBar.jsx`：底部固定输入框组件，含 `Send` 图标与"提交测算"按钮，支持 loading 态
- 新建 `src/components/Toast.jsx`：顶部中央自定义 Toast 提示组件，3 秒自动消失
- 修改 `src/components/AssetCard.jsx`：新增 `highlight` prop，支持背景高亮闪烁过渡
- 修改 `src/App.jsx`：集成输入框与 Toast，实现正则关键词匹配逻辑、资产更新、history 推进、Toast 显示与卡片高亮

## Impact
- Affected specs: `scaffold-life-balance-sheet-ui`、`add-recharts-dynamic-charts`（在其基础上扩展交互层）
- Affected code:
  - `src/App.jsx`（新增交互状态与处理逻辑）
  - `src/components/InputBar.jsx`（新增）
  - `src/components/Toast.jsx`（新增）
  - `src/components/AssetCard.jsx`（新增 highlight prop）

## ADDED Requirements

### Requirement: 底部固定输入框组件
应用 SHALL 在页面底部固定一个输入框组件（`fixed bottom-0 left-0 right-0`），包含一个文本输入框与一个带 `lucide-react` `Send` 图标的"提交测算"按钮。

#### Scenario: 输入框渲染
- **WHEN** 应用加载
- **THEN** 页面底部固定显示输入框，含文本输入区域与带 Send 图标的提交按钮，按钮文字为"提交测算"

### Requirement: 提交流程与 Loading 态
用户点击提交后，系统 SHALL 清空输入框，将按钮变为 `animate-pulse` 状态的"AI 分析中..."，持续 1.2 秒后恢复并执行关键词匹配。

#### Scenario: 提交后 loading
- **WHEN** 用户输入文本并点击提交
- **THEN** 输入框清空，按钮文字变为"AI 分析中..."并添加 `animate-pulse` 类
- **WHEN** 1.2 秒过去
- **THEN** 按钮恢复为"提交测算"，执行关键词匹配逻辑

### Requirement: 关键词正则匹配与资产更新
系统 SHALL 通过正则逻辑匹配用户输入的关键词，并相应更新 `assets` 状态：
- 包含"熬夜/加班/通宵"：健康 -800，财务 +500
- 包含"健身/跑步/运动"：健康 +400
- 包含"读书/学习/上课"：认知 +500

#### Scenario: 熬夜类关键词
- **GIVEN** 用户输入"昨晚熬夜加班"
- **WHEN** 1.2 秒 loading 结束后执行匹配
- **THEN** assets.health 减少 800，assets.financial 增加 500

#### Scenario: 健身类关键词
- **GIVEN** 用户输入"今天去跑步运动"
- **WHEN** 1.2 秒 loading 结束后执行匹配
- **THEN** assets.health 增加 400

#### Scenario: 学习类关键词
- **GIVEN** 用户输入"读书学习上课"
- **WHEN** 1.2 秒 loading 结束后执行匹配
- **THEN** assets.cognitive 增加 500

### Requirement: 历史趋势推进
每次资产更新后，系统 SHALL 将新的总分 push 到 `history` 数组，`day` 字段递增，触发右侧面积图向前推进。

#### Scenario: history 推进
- **GIVEN** history = [{ day: '1', total: 10000 }]
- **WHEN** 资产更新后总分为 9700
- **THEN** history 追加 { day: '2', total: 9700 }，面积图显示新数据点

### Requirement: Toast 评价提示
资产更新时，系统 SHALL 在页面顶部中央弹出一个自定义 Toast，展示 AI 评价文字，3 秒后自动消失。

#### 评价文案规则
- 熬夜类："⚠️ 内卷警告：消耗健康换取微薄财务，不值得"
- 健身类："✨ 优质定投：健康资产稳步提升"
- 学习类："✨ 优质定投：认知资产稳步提升"
- 无匹配："🤔 未识别到有效行为，试试描述你的日常"

#### Scenario: Toast 显示与消失
- **WHEN** 资产被更新
- **THEN** 页面顶部中央弹出 Toast 显示对应评价
- **WHEN** 3 秒过去
- **THEN** Toast 自动消失

### Requirement: 卡片高亮闪烁
被改变数值的资产卡片 SHALL 有一瞬间的背景高亮色闪烁过渡，使用 Tailwind `transition-colors duration-500`。

#### Scenario: 卡片高亮
- **WHEN** assets.health 被更新
- **THEN** 健康卡片背景短暂高亮（如 `bg-rose-500/20`），500ms 后过渡回原样

### Requirement: 输入框防抖与空值处理
用户提交空输入时，系统 SHALL 不触发分析流程。

#### Scenario: 空输入
- **WHEN** 用户点击提交但输入框为空
- **THEN** 不触发 loading、不执行匹配、不更新资产
