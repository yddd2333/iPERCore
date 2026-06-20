# 引入 Recharts 动态图表 Spec

## Why
人生资产负债表 UI 骨架已完成，现需在三大资产卡片下方引入动态数据可视化图表（雷达图 + 面积折线图），让用户直观感知资产维度分布与历史趋势变化，增强数据可读性与极客暗黑金融风的视觉表现力。

## What Changes
- 新增 `recharts` 依赖
- 新建 `src/components/RadarChartCard.jsx`：五维雷达图组件，数据源由 `assets` 映射而来
- 新建 `src/components/AreaChartCard.jsx`：历史趋势面积图组件，数据源绑定 `history` 状态
- 修改 `src/App.jsx`：在三大资产卡片下方新增左右等宽两栏布局，分别承载雷达图与面积图
- 所有图表 SHALL 使用 `<ResponsiveContainer width="100%" height={300}>` 包裹，防止渲染失败或高度坍塌
- 所有图表的 Tooltip SHALL 自定义 `contentStyle` 为深色背景（`#1e293b`）与浅色边框，去除默认白底

## Impact
- Affected specs: `scaffold-life-balance-sheet-ui`（在其骨架基础上扩展图表区域）
- Affected code:
  - `package.json`（新增 `recharts` 依赖）
  - `src/App.jsx`（新增两栏图表布局）
  - `src/components/RadarChartCard.jsx`（新增）
  - `src/components/AreaChartCard.jsx`（新增）

## ADDED Requirements

### Requirement: Recharts 依赖接入
项目 SHALL 安装并引入 `recharts` 库，作为图表渲染的基础依赖。

#### Scenario: 依赖安装
- **WHEN** 执行 `npm install`
- **THEN** `recharts` 被安装并可在组件中通过 `import { ... } from 'recharts'` 正常导入

### Requirement: 图表两栏布局
App 组件 SHALL 在三大资产卡片下方渲染一个左右等宽的两栏布局（`grid grid-cols-1 md:grid-cols-2 gap-6`），左栏放置雷达图，右栏放置面积折线图。

#### Scenario: 桌面端两栏
- **WHEN** 在桌面宽度下渲染
- **THEN** 雷达图与面积图左右等宽并排展示
- **WHEN** 在移动端宽度下渲染
- **THEN** 两栏降级为单列纵向堆叠

### Requirement: ResponsiveContainer 包裹
所有图表 SHALL 使用 `<ResponsiveContainer width="100%" height={300}>` 包裹，确保图表自适应容器宽度且高度固定为 300px。

#### Scenario: 图表容器
- **WHEN** 渲染任一图表
- **THEN** 图表被 ResponsiveContainer 包裹，宽度 100%、高度 300px，无高度坍塌

### Requirement: 自定义 Tooltip 深色样式
所有图表的 Tooltip SHALL 通过 `contentStyle` 自定义为深色背景（`#1e293b`）、浅色边框（`border` 颜色为浅色如 `#475569`）、圆角，去除默认刺眼白底。

#### Scenario: Tooltip 样式
- **WHEN** 用户悬停图表数据点
- **THEN** 弹出的 Tooltip 背景为深色 `#1e293b`，边框为浅色，文字可读，无白底闪烁

### Requirement: 五维雷达图
应用 SHALL 渲染一个雷达图（RadarChart），将 `assets` 状态映射为五个维度的数据数组：财务、身体、心理、技能、体验。

#### 数据映射规则
- 财务 ← `assets.financial`
- 身体 ← `assets.health`
- 心理 ← `assets.health * 0.6`（按比例映射）
- 技能 ← `assets.cognitive`
- 体验 ← `assets.cognitive * 0.6`（按比例映射）

#### 样式要求
- `<PolarGrid />` 使用 `stroke="#334155"`
- 填充区域使用半透明荧光色：`fill="#3b82f6" fillOpacity={0.4}`
- `<PolarAngleAxis dataKey="dimension" tick={{ fill: '#94a3b8' }} />` 维度标签为浅色

#### Scenario: 雷达图响应资产变化
- **GIVEN** assets = { financial: 3000, health: 4000, cognitive: 3000 }
- **WHEN** 渲染雷达图
- **THEN** 五个维度分别为 财务=3000、身体=4000、心理=2400、技能=3000、体验=1800
- **WHEN** `assets` 状态发生变化
- **THEN** 雷达图各维度数值随之更新

### Requirement: 历史趋势面积图
应用 SHALL 渲染一个面积图（AreaChart），数据源绑定 `history` 状态，展示 LVC 总值随时间的变化趋势。

#### 样式要求
- 使用 `<defs>` 定义线性渐变，从荧光色（如 `#3b82f6`）渐变至透明
- `<Area type="monotone" dataKey="total" />` 折线平滑
- `<XAxis dataKey="day" tickLine={false} />` 底部不显示刻度线段
- `<YAxis tickLine={false} />` 左侧不显示刻度线段
- `<CartesianGrid stroke="#334155" strokeDasharray="3 3" />` 虚线网格

#### Scenario: 面积图响应历史变化
- **GIVEN** history = [{ day: '1', total: 10000 }]
- **WHEN** 渲染面积图
- **THEN** 图表展示 day=1、total=10000 的数据点及渐变填充区域
- **WHEN** `history` 状态新增记录
- **THEN** 面积图随之扩展显示新数据点

### Requirement: 图表卡片玻璃拟态容器
雷达图与面积图 SHALL 各自包裹在玻璃拟态卡片容器中（`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6`），与既有资产卡片视觉风格统一。

#### Scenario: 图表卡片样式
- **WHEN** 渲染任一图表卡片
- **THEN** 卡片呈现半透明、模糊背景、圆角 2xl、白色细边框，内部含标题与 ResponsiveContainer 图表

### Requirement: 图表响应 assets 状态变化
雷达图 SHALL 响应 `assets` 状态的变化，当资产数值更新时，雷达图各维度自动重新计算并重渲染。

#### Scenario: 资产更新触发图表更新
- **WHEN** `assets` 状态通过 `setAssets` 更新
- **THEN** 雷达图在下一渲染周期反映新的维度数值，无需手动刷新
