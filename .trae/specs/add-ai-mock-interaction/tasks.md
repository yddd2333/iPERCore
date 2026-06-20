# Tasks

- [x] Task 1: 创建 Toast 组件
  - [x] SubTask 1.1: 新建 `src/components/Toast.jsx`，接收 `message` 与 `visible` props
  - [x] SubTask 1.2: 使用 `fixed top-6 left-1/2 -translate-x-1/2 z-50` 定位顶部中央
  - [x] SubTask 1.3: 玻璃拟态卡片样式，含过渡动画，visible 控制显示/隐藏

- [x] Task 2: 创建 InputBar 组件
  - [x] SubTask 2.1: 新建 `src/components/InputBar.jsx`，接收 `onSubmit` 与 `loading` props
  - [x] SubTask 2.2: 底部固定布局 `fixed bottom-0 left-0 right-0`，含玻璃拟态背景
  - [x] SubTask 2.3: 文本输入框 + 带 `Send` 图标的"提交测算"按钮
  - [x] SubTask 2.4: loading 为 true 时按钮文字变"AI 分析中..."并添加 `animate-pulse`

- [x] Task 3: 修改 AssetCard 支持高亮
  - [x] SubTask 3.1: 新增 `highlight` prop（布尔值或颜色字符串）
  - [x] SubTask 3.2: highlight 触发时背景添加高亮色，使用 `transition-colors duration-500`

- [x] Task 4: 在 App.jsx 集成交互逻辑
  - [x] SubTask 4.1: 新增 `input`、`loading`、`toast`、`highlights` 状态
  - [x] SubTask 4.2: 实现 handleSubmit：清空输入、设 loading、1.2s 后正则匹配并更新 assets
  - [x] SubTask 4.3: 正则匹配规则：熬夜类(健康-800/财务+500)、健身类(健康+400)、学习类(认知+500)
  - [x] SubTask 4.4: 资产更新后 push 新总分到 history，day 递增
  - [x] SubTask 4.5: 资产更新后显示 Toast 评价，3 秒后自动隐藏
  - [x] SubTask 4.6: 资产更新后触发对应卡片高亮，短暂后恢复
  - [x] SubTask 4.7: 空输入不触发流程
  - [x] SubTask 4.8: 主容器底部添加 padding 防止输入框遮挡内容

- [x] Task 5: 验证可运行性与交互
  - [x] SubTask 5.1: 执行 `npm run dev` 启动，确认无报错
  - [x] SubTask 5.2: 输入"熬夜加班"验证健康-800/财务+500、Toast 显示、卡片高亮、history 推进
  - [x] SubTask 5.3: 输入"跑步运动"验证健康+400
  - [x] SubTask 5.4: 输入"读书学习"验证认知+500
  - [x] SubTask 5.5: 空输入验证不触发流程
  - [x] SubTask 5.6: 验证 loading 态 1.2 秒后恢复

# Task Dependencies
- [Task 1] 与 [Task 2] 与 [Task 3] 可并行
- [Task 4] 依赖 [Task 1]、[Task 2]、[Task 3]
- [Task 5] 依赖 [Task 4]
