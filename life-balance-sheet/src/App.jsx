import { useState, useRef } from 'react'
import { Wallet, Heart, Brain } from 'lucide-react'
import TotalPanel from './components/TotalPanel'
import AssetCard from './components/AssetCard'
import RadarChartCard from './components/RadarChartCard'
import AreaChartCard from './components/AreaChartCard'
import Toast from './components/Toast'
import InputBar from './components/InputBar'
import {
  INITIAL_ASSETS,
  INITIAL_HISTORY,
  ANALYZE_DELAY,
  TOAST_DURATION,
  HIGHLIGHT_DURATION,
  analyzeInput,
  computeTotal,
} from './lib/logic'

function App() {
  const [assets, setAssets] = useState(INITIAL_ASSETS)
  const [history, setHistory] = useState(INITIAL_HISTORY)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ message: '', visible: false })
  const [highlights, setHighlights] = useState({ financial: '', health: '', cognitive: '' })

  // 用 ref 保存所有定时器，组件卸载时统一清理，避免内存泄漏
  const timersRef = useRef([])

  const totalLVC = computeTotal(assets)

  // 清理所有定时器
  const clearAllTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t))
    timersRef.current = []
  }

  const showToast = (message) => {
    setToast({ message, visible: true })
    timersRef.current.push(
      setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }))
      }, TOAST_DURATION)
    )
  }

  const triggerHighlight = (keys, color) => {
    const newHighlights = { financial: '', health: '', cognitive: '' }
    keys.forEach((k) => {
      newHighlights[k] = color
    })
    setHighlights(newHighlights)
    timersRef.current.push(
      setTimeout(() => {
        setHighlights({ financial: '', health: '', cognitive: '' })
      }, HIGHLIGHT_DURATION)
    )
  }

  const handleSubmit = () => {
    if (!input.trim() || loading) return

    // 提前捕获输入文本，避免清空后丢失
    const text = input.trim()
    setInput('')
    setLoading(true)

    timersRef.current.push(
      setTimeout(() => {
        // 使用最新 assets/history 进行一次性原子计算，修复原实现中 history 与 assets 不同步的 bug
        const result = analyzeInput(text, assets, history)
        if (result.matched) {
          setAssets(result.assets)
          setHistory(result.history)
        }
        showToast(result.toast)
        if (result.highlight.keys.length > 0) {
          triggerHighlight(result.highlight.keys, result.highlight.color)
        }
        setLoading(false)
      }, ANALYZE_DELAY)
    )
  }

  return (
    <div className="bg-slate-950 text-slate-200 min-h-screen">
      <Toast message={toast.message} visible={toast.visible} />
      <div className="max-w-6xl mx-auto p-6 flex flex-col gap-6 pb-32">
        <TotalPanel value={totalLVC} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AssetCard
            title="财务 Financial"
            value={assets.financial}
            Icon={Wallet}
            color="bg-emerald-500/20 text-emerald-400"
            highlight={highlights.financial}
          />
          <AssetCard
            title="健康 Health"
            value={assets.health}
            Icon={Heart}
            color="bg-rose-500/20 text-rose-400"
            highlight={highlights.health}
          />
          <AssetCard
            title="认知 Cognitive"
            value={assets.cognitive}
            Icon={Brain}
            color="bg-blue-500/20 text-blue-400"
            highlight={highlights.cognitive}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RadarChartCard assets={assets} />
          <AreaChartCard history={history} />
        </div>
      </div>
      <InputBar
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  )
}

export default App
