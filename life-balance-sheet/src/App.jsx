import { useState } from 'react'
import { Wallet, Heart, Brain } from 'lucide-react'
import TotalPanel from './components/TotalPanel'
import AssetCard from './components/AssetCard'
import RadarChartCard from './components/RadarChartCard'
import AreaChartCard from './components/AreaChartCard'

function App() {
  const [assets, setAssets] = useState({ financial: 3000, health: 4000, cognitive: 3000 })
  const [history, setHistory] = useState([{ day: '1', total: 10000 }])

  const totalLVC = assets.financial + assets.health + assets.cognitive

  return (
    <div className="bg-slate-950 text-slate-200 min-h-screen">
      <div className="max-w-6xl mx-auto p-6 flex flex-col gap-6">
        <TotalPanel value={totalLVC} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AssetCard
            title="财务 Financial"
            value={assets.financial}
            Icon={Wallet}
            color="bg-emerald-500/20 text-emerald-400"
          />
          <AssetCard
            title="健康 Health"
            value={assets.health}
            Icon={Heart}
            color="bg-rose-500/20 text-rose-400"
          />
          <AssetCard
            title="认知 Cognitive"
            value={assets.cognitive}
            Icon={Brain}
            color="bg-blue-500/20 text-blue-400"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RadarChartCard assets={assets} />
          <AreaChartCard history={history} />
        </div>
      </div>
    </div>
  )
}

export default App
