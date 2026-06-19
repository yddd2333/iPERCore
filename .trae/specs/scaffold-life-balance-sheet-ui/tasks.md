# Tasks

- [x] Task 1: 初始化 Vite + React 项目脚手架
  - [x] SubTask 1.1: 在工作区创建 Vite React 项目（package.json、vite.config.js、index.html、src/main.jsx、src/index.css）
  - [x] SubTask 1.2: 配置 Tailwind CSS（tailwind.config.js、postcss.config.js，并在 index.css 注入 @tailwind 指令）
  - [x] SubTask 1.3: 安装依赖 react、react-dom、vite、@vitejs/plugin-react、tailwindcss、postcss、autoprefixer、lucide-react

- [x] Task 2: 实现 App.jsx 状态结构与布局骨架
  - [x] SubTask 2.1: 在 App 组件内声明 `assets` 与 `history` 两个 useState 状态（按 spec 指定初始值）
  - [x] SubTask 2.2: 设置根容器 `bg-slate-950 text-slate-200 min-h-screen`，主容器 `max-w-6xl mx-auto p-6`
  - [x] SubTask 2.3: 计算三项资产总和 `totalLVC`，供顶部面板使用

- [x] Task 3: 实现顶部 Life Net Worth (LVC) 总计面板
  - [x] SubTask 3.1: 渲染标题「Life Net Worth (LVC)」
  - [x] SubTask 3.2: 渲染 totalLVC 数值，使用 `font-mono text-4xl font-bold tracking-tight` 排版
  - [x] SubTask 3.3: 面板采用玻璃拟态或与卡片协调的暗色卡片样式

- [x] Task 4: 实现三大资产卡片（财务 / 健康 / 认知）
  - [x] SubTask 4.1: 创建 AssetCard 组件（或内联），接收 title、value、icon、color 等 props
  - [x] SubTask 4.2: 卡片根元素使用 `bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6`
  - [x] SubTask 4.3: 为每张卡片配置发光颜色圆形背景 Icon（财务=绿+Wallet，健康=红+Heart，认知=蓝+Brain）
  - [x] SubTask 4.4: 数值展示使用 `font-mono text-4xl font-bold tracking-tight`
  - [x] SubTask 4.5: 三张卡片横排（grid grid-cols-3 或 flex），响应式可降级为单列

- [x] Task 5: 验证可运行性
  - [x] SubTask 5.1: 执行 `npm install` 安装依赖
  - [x] SubTask 5.2: 执行 `npm run dev` 启动 Vite，确认无报错
  - [x] SubTask 5.3: 浏览器访问确认 UI 骨架完整渲染（顶栏 + 三卡片）

# Task Dependencies
- [Task 2] 依赖 [Task 1]
- [Task 3] 依赖 [Task 2]
- [Task 4] 依赖 [Task 2]
- [Task 3] 与 [Task 4] 可并行
- [Task 5] 依赖 [Task 3] 与 [Task 4]
