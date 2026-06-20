# Tasks

- [x] Task 1: 安装 Recharts 依赖
  - [x] SubTask 1.1: 在 `life-balance-sheet` 目录执行 `npm install recharts`
  - [x] SubTask 1.2: 确认 `package.json` 中 `dependencies` 出现 `recharts` 条目

- [x] Task 2: 创建雷达图组件 RadarChartCard.jsx
  - [x] SubTask 2.1: 新建 `src/components/RadarChartCard.jsx`，接收 `assets` prop
  - [x] SubTask 2.2: 将 assets 映射为五维数组（财务/身体/心理/技能/体验），心理=health*0.6、体验=cognitive*0.6
  - [x] SubTask 2.3: 使用 `ResponsiveContainer width="100%" height={300}` 包裹 `RadarChart`
  - [x] SubTask 2.4: 配置 `PolarGrid stroke="#334155"`、`PolarAngleAxis dataKey="dimension" tick={{ fill: '#94a3b8' }}`、`Radar fill="#3b82f6" fillOpacity={0.4}`
  - [x] SubTask 2.5: 配置 `Tooltip contentStyle` 为深色背景 `#1e293b`、浅色边框
  - [x] SubTask 2.6: 外层包裹玻璃拟态卡片容器与标题

- [x] Task 3: 创建面积图组件 AreaChartCard.jsx
  - [x] SubTask 3.1: 新建 `src/components/AreaChartCard.jsx`，接收 `history` prop
  - [x] SubTask 3.2: 使用 `ResponsiveContainer width="100%" height={300}` 包裹 `AreaChart`
  - [x] SubTask 3.3: 定义 `<defs>` 线性渐变（`#3b82f6` → 透明）
  - [x] SubTask 3.4: 配置 `Area type="monotone" dataKey="total"`，填充引用渐变 id
  - [x] SubTask 3.5: 配置 `XAxis dataKey="day" tickLine={false}`、`YAxis tickLine={false}`、`CartesianGrid stroke="#334155" strokeDasharray="3 3"`
  - [x] SubTask 3.6: 配置 `Tooltip contentStyle` 为深色背景 `#1e293b`、浅色边框
  - [x] SubTask 3.7: 外层包裹玻璃拟态卡片容器与标题

- [x] Task 4: 在 App.jsx 集成两栏图表布局
  - [x] SubTask 4.1: 导入 `RadarChartCard` 与 `AreaChartCard`
  - [x] SubTask 4.2: 在三大资产卡片 grid 下方新增 `grid grid-cols-1 md:grid-cols-2 gap-6` 容器
  - [x] SubTask 4.3: 左栏渲染 `<RadarChartCard assets={assets} />`，右栏渲染 `<AreaChartCard history={history} />`

- [x] Task 5: 验证可运行性与响应性
  - [x] SubTask 5.1: 执行 `npm run dev` 启动 Vite，确认无报错
  - [x] SubTask 5.2: 浏览器访问确认雷达图五维数据与 assets 初始值匹配
  - [x] SubTask 5.3: 浏览器访问确认面积图展示 history 初始数据
  - [x] SubTask 5.4: 确认 Tooltip 为深色背景、无白底
  - [x] SubTask 5.5: 确认图表高度为 300px 无坍塌

# Task Dependencies
- [Task 2] 依赖 [Task 1]
- [Task 3] 依赖 [Task 1]
- [Task 2] 与 [Task 3] 可并行
- [Task 4] 依赖 [Task 2] 与 [Task 3]
- [Task 5] 依赖 [Task 4]
