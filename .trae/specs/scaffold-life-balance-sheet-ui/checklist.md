# Checklist

- [x] 工作区存在可运行的 Vite + React 项目（package.json、vite.config.js、index.html、src/main.jsx、src/index.css 齐全）
- [x] Tailwind CSS 已正确配置（tailwind.config.js、postcss.config.js，index.css 含 @tailwind 指令）
- [x] `lucide-react` 已安装并可在组件中正常导入
- [x] App 组件内声明了 `assets` 状态：`useState({ financial: 3000, health: 4000, cognitive: 3000 })`
- [x] App 组件内声明了 `history` 状态：`useState([{ day: '1', total: 10000 }])`
- [x] 根容器使用 `bg-slate-950` 背景，默认文字 `text-slate-200`
- [x] 主容器使用 `max-w-6xl mx-auto p-6`
- [x] 顶部面板标题为「Life Net Worth (LVC)」
- [x] 顶部面板显示的 LVC 总值为 assets 三项之和（初始 10000）
- [x] 三大资产卡片横排展示（财务、健康、认知）
- [x] 每张卡片使用 `bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6` 玻璃拟态样式
- [x] 财务卡片：绿色圆形背景 + Wallet 图标
- [x] 健康卡片：红色圆形背景 + Heart 图标
- [x] 认知卡片：蓝色圆形背景 + Brain 图标
- [x] 资产数值使用 `font-mono text-4xl font-bold tracking-tight` 排版
- [x] `npm run dev` 可成功启动 Vite 开发服务器且控制台无报错
- [x] 浏览器访问可见完整 UI 骨架（顶栏总分 + 三张资产卡片）
