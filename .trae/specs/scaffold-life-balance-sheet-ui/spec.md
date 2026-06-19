# 人生资产负债表 UI 骨架 Spec

## Why
项目需要从零搭建「人生资产负债表」Web 应用的基础 UI 骨架，确立极客暗黑金融风的视觉基调，并定义可扩展的数据状态结构（资产、历史记录），为后续折线图、资产编辑、生命周期模拟等功能提供承载基础。

## What Changes
- 新建 Vite + React 项目脚手架（若工作区不存在）
- 安装并接入 `lucide-react` 图标库
- 配置 Tailwind CSS（确保 `bg-slate-950`、`bg-white/5`、`backdrop-blur-lg` 等类名可用）
- 在 `App.jsx` 内声明确定的数据状态结构：`assets`（financial/health/cognitive）与 `history`
- 实现顶部「Life Net Worth (LVC)」总计面板，动态计算三项资产之和
- 实现三大资产卡片（财务 / 健康 / 认知）横排布局，采用玻璃拟态设计
- 为每个卡片配置发光颜色 Icon（财务=绿色 Wallet，健康=红色 Heart，认知=蓝色 Brain）
- 主容器使用 `max-w-6xl mx-auto p-6`，整体背景 `bg-slate-950`，文字 `text-slate-200`

## Impact
- Affected specs: 无（首个 spec，作为后续资产编辑、折线图、历史回放等能力的基线）
- Affected code:
  - `package.json`（新增 react、vite、tailwindcss、lucide-react 依赖）
  - `vite.config.js`
  - `tailwind.config.js` / `postcss.config.js`
  - `src/App.jsx`（主组件，含状态与布局）
  - `src/components/TotalPanel.jsx`（顶部总计面板，可选拆分）
  - `src/components/AssetCard.jsx`（资产卡片，可选拆分）
  - `src/index.css`（Tailwind 指令入口）
  - `index.html`

## ADDED Requirements

### Requirement: 极客暗黑金融风视觉基调
应用整体 SHALL 采用极客暗黑金融风：根背景为 `bg-slate-950`，默认文字颜色为 `text-slate-200`。

#### Scenario: 进入应用首页
- **WHEN** 用户打开应用
- **THEN** 页面整体背景呈深色（slate-950），所有默认文字为浅色（slate-200），无亮色背景干扰

### Requirement: 主容器布局规范
应用 SHALL 使用统一的主容器布局：`max-w-6xl mx-auto p-6`，内部纵向分为顶栏（总分面板）与中间区（三大资产卡片横排）。

#### Scenario: 桌面端布局
- **WHEN** 在桌面宽度下渲染
- **THEN** 内容居中且最大宽度不超过 6xl，外边距 p-6，顶栏在上、资产卡片横排在下

### Requirement: 资产数据状态结构
App 组件 SHALL 在内部声明以下确定的数据状态结构，便于后续扩展：
- `const [assets, setAssets] = useState({ financial: 3000, health: 4000, cognitive: 3000 })`
- `const [history, setHistory] = useState([{ day: '1', total: 10000 }])`（用于折线图历史）

#### Scenario: 初始状态
- **WHEN** 应用首次挂载
- **THEN** `assets` 包含 financial=3000、health=4000、cognitive=3000；`history` 包含一条 `{ day: '1', total: 10000 }` 记录

### Requirement: 顶部 Life Net Worth (LVC) 总计面板
应用 SHALL 在顶部渲染总计面板，标题为「Life Net Worth (LVC)」，数值为 `assets.financial + assets.health + assets.cognitive` 之和。

#### Scenario: 总分计算
- **GIVEN** assets = { financial: 3000, health: 4000, cognitive: 3000 }
- **WHEN** 渲染总计面板
- **THEN** 显示 LVC 总值为 10000

### Requirement: 三大资产卡片（玻璃拟态）
应用 SHALL 横排渲染三张资产卡片：财务、健康、认知。每张卡片 SHALL 使用玻璃拟态设计：`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6`。

#### Scenario: 卡片样式
- **WHEN** 渲染任一资产卡片
- **THEN** 卡片呈现半透明、模糊背景、圆角 2xl、白色细边框的玻璃拟态外观

### Requirement: 资产卡片发光 Icon
每张资产卡片 SHALL 配置一个带发光颜色圆形背景的 `lucide-react` 图标：
- 财务：绿色背景 + `Wallet`
- 健康：红色背景 + `Heart`
- 认知：蓝色背景 + `Brain`

#### Scenario: 图标配色
- **WHEN** 渲染财务卡片
- **THEN** 显示绿色圆形背景内的 Wallet 图标
- **WHEN** 渲染健康卡片
- **THEN** 显示红色圆形背景内的 Heart 图标
- **WHEN** 渲染认知卡片
- **THEN** 显示蓝色圆形背景内的 Brain 图标

### Requirement: 资产数值排版
资产卡片内的数字展示部分 SHALL 使用 `font-mono text-4xl font-bold tracking-tight` 排版。

#### Scenario: 数值渲染
- **WHEN** 渲染资产数值
- **THEN** 数字使用等宽字体、4xl 字号、加粗、紧凑字距

### Requirement: 可直接运行
生成的代码 SHALL 能在 Vite 中直接运行无报错（依赖已安装、Tailwind 已配置、入口文件正确）。

#### Scenario: 启动开发服务器
- **WHEN** 执行 `npm install` 后运行 `npm run dev`
- **THEN** Vite 开发服务器启动，浏览器访问可见完整 UI 骨架，控制台无报错
