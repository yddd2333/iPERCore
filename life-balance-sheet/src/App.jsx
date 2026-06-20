import { useState } from 'react'
import { Wallet, Heart, Brain } from 'lucide-react'
import TotalPanel from './components/TotalPanel'
import AssetCard from './components/AssetCard'
import RadarChartCard from './components/RadarChartCard'
import AreaChartCard from './components/AreaChartCard'
import Toast from './components/Toast'
import InputBar from './components/InputBar'

function App() {
  const [assets, setAssets] = useState({ financial: 3000, health: 4000, cognitive: 3000 })
  const [history, setHistory] = useState([{ day: '1', total: 10000 }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ message: '', visible: false })
  const [highlights, setHighlights] = useState({ financial: '', health: '', cognitive: '' })

  const totalLVC = assets.financial + assets.health + assets.cognitive

  const showToast = (message) => {
    setToast({ message, visible: true })
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }))
    }, 3000)
  }

  const triggerHighlight = (keys, color) => {
    const newHighlights = { financial: '', health: '', cognitive: '' }
    keys.forEach((k) => { newHighlights[k] = color })
    setHighlights(newHighlights)
    setTimeout(() => {
      setHighlights({ financial: '', health: '', cognitive: '' })
    }, 800)
  }

  const handleSubmit = () => {
    if (!input.trim() || loading) return

    setInput('')
    setLoading(true)

    setTimeout(() => {
      const text = input.trim()

      if (/熬夜|加班|通宵/.test(text)) {
        setAssets((prev) => ({
          ...prev,
          health: prev.health - 800,
          financial: prev.financial + 500,
        }))
        setHistory((prev) => [
          ...prev,
          { day: String(prev.length + 1), total: totalLVC - 800 + 500 },
        ])
        showToast('⚠️ 内卷警告：消耗健康换取微薄财务，不值得')
        triggerHighlight(['health', 'financial'], 'bg-rose-500/20')
      } else if (/健身|跑步|运动/.test(text)) {
        setAssets((prev) => ({ ...prev, health: prev.health + 400 }))
        setHistory((prev) => [
          ...prev,
          { day: String(prev.length + 1), total: totalLVC + 400 },
        ])
        showToast('✨ 优质定投：健康资产稳步提升')
        triggerHighlight(['health'], 'bg-emerald-500/20')
      } else if (/读书|学习|上课/.test(text)) {
        setAssets((prev) => ({ ...prev, cognitive: prev.cognitive + 500 }))
        setHistory((prev) => [
          ...prev,
          { day: String(prev.length + 1), total: totalLVC + 500 },
        ])
        showToast('✨ 优质定投：认知资产稳步提升')
        triggerHighlight(['cognitive'], 'bg-blue-500/20')
      } else {
        showToast('🤔 未识别到有效行为，试试描述你的日常')
      }

      setLoading(false)
    }, 1200)
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
