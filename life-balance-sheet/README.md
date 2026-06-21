# 人生资产负债表 (Life Balance Sheet)

一款基于 React + Vite 的极客暗黑金融风 Web 应用，将人生资产抽象为「财务 / 健康 / 认知」三大维度，通过底部输入框描述日常行为，系统模拟 AI 分析并实时更新资产数值、推进历史趋势图、弹出评价 Toast。

## 目录

- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [如何使用](#如何使用)
- [如何修改](#如何修改)
- [如何测试](#如何测试)
- [技术栈](#技术栈)

---

## 快速开始

### 环境要求

- Node.js ≥ 18
- npm ≥ 9

### 安装与启动

```bash
cd life-balance-sheet
npm install
npm run dev
```

启动后访问 http://localhost:5173/

### 生产构建

```bash
npm run build      # 构建到 dist/
npm run preview    # 本地预览构建产物
```

---

## 项目结构

```
life-balance-sheet/
├── src/
│   ├── lib/
│   │   └── logic.js              # 业务逻辑纯函数（关键词匹配、资产计算、历史推进）
│   ├── components/
│   │   ├── TotalPanel.jsx        # 顶部 LVC 总资产面板
│   │   ├── AssetCard.jsx         # 资产卡片（玻璃拟态 + 高亮闪烁）
│   │   ├── RadarChartCard.jsx    # 五维雷达图
│   │   ├── AreaChartCard.jsx     # 历史趋势面积图
│   │   ├── InputBar.jsx          # 底部输入栏（Send 图标 + loading 态）
│   │   └── Toast.jsx             # 顶部 Toast 评价提示
│   ├── test/
│   │   ├── setup.js              # 测试环境初始化
│   │   ├── logic.test.js         # 业务逻辑单元测试
│   │   ├── AssetCard.test.jsx    # 组件单元测试
│   │   ├── TotalPanel.test.jsx
│   │   ├── InputBar.test.jsx
│   │   ├── Toast.test.jsx
│   │   ├── App.integration.test.jsx  # 集成测试
│   │   └── App.boundary.test.jsx     # 边界异常测试
│   ├── App.jsx                   # 主组件（状态管理 + 交互编排）
│   ├── main.jsx                  # 应用入口
│   └── index.css                 # Tailwind 入口
├── vite.config.js                # Vite + Vitest 配置
├── tailwind.config.js            # Tailwind 主题配置
├── postcss.config.js
├── package.json
└── TEST_REPORT.md                # 测试报告
```

---

## 如何使用

### 基本交互

1. 页面加载后显示初始资产：财务 3000、健康 4000、认知 3000，LVC 总值 10000
2. 在底部输入框描述行为，点击「提交测算」或按 Enter
3. 按钮变为「AI 分析中...」(1.2 秒模拟延迟)
4. 系统根据关键词匹配规则更新资产：
   - 含「熬夜/加班/通宵」→ 健康 -800，财务 +500
   - 含「健身/跑步/运动」→ 健康 +400
   - 含「读书/学习/上课」→ 认知 +500
5. 资产变动时：
   - 顶部弹出 Toast 评价（3 秒自动消失）
   - 对应卡片背景高亮闪烁（800ms）
   - 右侧面积图推进一个数据点

### 示例输入

```
熬夜加班赶项目      → 触发内卷警告
今天跑了五公里      → 健康资产提升
读了一本好书        → 认知资产提升
今天吃了一顿大餐    → 未识别（默认 Toast）
```

---

## 如何修改

### 1. 修改初始资产

编辑 [src/lib/logic.js](src/lib/logic.js)：

```js
export const INITIAL_ASSETS = { financial: 3000, health: 4000, cognitive: 3000 }
export const INITIAL_HISTORY = [{ day: '1', total: 10000 }]
```

### 2. 新增/修改关键词规则

编辑 [src/lib/logic.js](src/lib/logic.js) 的 `RULES` 数组，按格式追加一条即可，无需改动其他代码：

```js
const RULES = [
  // ...existing rules
  {
    id: 'travel',
    regex: /旅行|旅游|出游/,
    delta: { financial: -1000, health: +200, cognitive: +300 },
    toast: '🌍 开阔眼界：体验资产提升，财务小幅消耗',
    highlight: { keys: ['financial', 'health', 'cognitive'], color: 'bg-amber-500/20' },
  },
]
```

规则按数组顺序匹配，第一条命中即返回（优先级从上到下）。

### 3. 修改延迟时长

编辑 [src/lib/logic.js](src/lib/logic.js) 的常量：

```js
export const ANALYZE_DELAY = 1200      // AI 分析延迟
export const TOAST_DURATION = 3000     // Toast 显示时长
export const HIGHLIGHT_DURATION = 800  // 高亮持续时长
```

### 4. 修改雷达图维度映射

编辑 [src/lib/logic.js](src/lib/logic.js) 的 `buildRadarData` 函数：

```js
export function buildRadarData(assets) {
  return [
    { dimension: '财务', value: assets.financial },
    { dimension: '身体', value: assets.health },
    { dimension: '心理', value: Math.round(assets.health * 0.6) },  // 修改系数
    { dimension: '技能', value: assets.cognitive },
    { dimension: '体验', value: Math.round(assets.cognitive * 0.6) },
  ]
}
```

### 5. 修改视觉主题

- **配色**：编辑 [src/App.jsx](src/App.jsx) 中各 `AssetCard` 的 `color` prop（如 `bg-emerald-500/20 text-emerald-400`）
- **背景**：编辑根容器 `className="bg-slate-950 text-slate-200"`
- **Tailwind 主题**：编辑 [tailwind.config.js](tailwind.config.js)

### 6. 修改图表样式

- 雷达图：[src/components/RadarChartCard.jsx](src/components/RadarChartCard.jsx)（网格线颜色 `stroke="#334155"`、填充色 `fill="#3b82f6"`）
- 面积图：[src/components/AreaChartCard.jsx](src/components/AreaChartCard.jsx)（渐变定义 `<defs>`、平滑类型 `type="monotone"`）

### 7. 新增组件

1. 在 `src/components/` 下新建 `MyComponent.jsx`
2. 在 [src/App.jsx](src/App.jsx) 中 import 并使用
3. 在 `src/test/` 下新建 `MyComponent.test.jsx` 编写测试

---

## 如何测试

### 测试命令

```bash
npm run test              # 单次运行所有测试
npm run test:watch        # 监听模式（开发时使用）
npm run test:coverage     # 生成覆盖率报告
```

### 测试结构

项目采用三层测试金字塔：

| 层级 | 文件 | 用例数 | 说明 |
|------|------|--------|------|
| 单元测试 | `logic.test.js` | 44 | 业务逻辑纯函数 |
| 单元测试 | `*.test.jsx`（组件） | 32 | 组件渲染与交互 |
| 集成测试 | `App.integration.test.jsx` | 10 | 完整交互流程 |
| 边界测试 | `App.boundary.test.jsx` | 12 | 异常与边界场景 |

### 覆盖率要求

配置在 [vite.config.js](vite.config.js) 中，阈值均为 80%：

```js
coverage: {
  thresholds: {
    lines: 80,
    functions: 80,
    branches: 80,
    statements: 80,
  },
}
```

当前实际覆盖率：**96.15%**（详见 [TEST_REPORT.md](TEST_REPORT.md)）

### 编写新测试

**单元测试示例**（测试纯函数）：

```js
import { describe, it, expect } from 'vitest'
import { computeTotal } from '../lib/logic'

describe('computeTotal', () => {
  it('正确计算三项资产总和', () => {
    expect(computeTotal({ financial: 1000, health: 2000, cognitive: 3000 })).toBe(6000)
  })
})
```

**组件测试示例**：

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MyComponent from '../components/MyComponent'

describe('MyComponent', () => {
  it('渲染标题', () => {
    render(<MyComponent title="测试" />)
    expect(screen.getByText('测试')).toBeInTheDocument()
  })
})
```

**集成测试示例**（含异步交互）：

```jsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

it('完整流程', async () => {
  const user = userEvent.setup()
  render(<App />)

  await user.type(screen.getByPlaceholderText(/描述你今天的行为/), '熬夜')
  await user.click(screen.getByRole('button', { name: /提交测算/ }))

  // 分析延迟 1200ms，waitFor 默认 1000ms 会超时，需设 timeout
  await waitFor(() => {
    expect(screen.getByText('9,700')).toBeInTheDocument()
  }, { timeout: 3000 })
})
```

### 测试注意事项

1. **异步等待**：分析延迟 1200ms，`waitFor` 需设置 `{ timeout: 3000 }`
2. **循环提交**：连续多次提交时，等待资产数值变化比等待按钮状态更稳定
3. **定时器**：Toast 3 秒定时器会干扰后续断言，循环测试需设置足够长的 `testTimeout`
4. **fake timers**：本项目不使用 fake timers（与 userEvent + React 18 兼容性差），统一用真实 timers + `waitFor`

### 查看覆盖率报告

```bash
npm run test:coverage
```

HTML 报告生成在 `coverage/index.html`，可在浏览器打开查看逐行覆盖详情。

---

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | React | 18.3 |
| 构建 | Vite | 5.4 |
| 样式 | Tailwind CSS | 3.4 |
| 图表 | Recharts | 3.8 |
| 图标 | lucide-react | 0.427 |
| 测试 | Vitest | 4.1 |
| 测试工具 | @testing-library/react | 16.3 |
| 覆盖率 | @vitest/coverage-v8 | 4.1 |
| 测试环境 | jsdom | 29.1 |

---

## 常见问题

**Q: 启动后图表不显示？**
A: 确保使用 `<ResponsiveContainer width="100%" height={300}>` 包裹图表，且父容器有明确宽度。

**Q: 测试报 `Unable to find role="button"`？**
A: 可能是 loading 态下按钮文字变为「AI 分析中...」，用 `waitFor` 等待状态恢复。

**Q: 如何添加新的资产维度？**
A: 需同步修改：`INITIAL_ASSETS`、`RULES` 的 `delta`、`applyDelta`、`computeTotal`、`buildRadarData`、`App.jsx` 的 `highlights` 状态与卡片渲染。

**Q: 构建产物过大？**
A: recharts 占主要体积，可通过 `React.lazy` 动态加载图表组件优化。
