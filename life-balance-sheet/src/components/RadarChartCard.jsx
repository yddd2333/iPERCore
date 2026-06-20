import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { buildRadarData } from '../lib/logic'

function RadarChartCard({ assets }) {
  const data = buildRadarData(assets)

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
      <h3 className="text-sm uppercase tracking-widest text-slate-400">资产维度雷达 Asset Radar</h3>
      <div className="mt-2">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={data}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="dimension" tick={{ fill: '#94a3b8' }} />
            <PolarRadiusAxis tick={{ fill: '#64748b' }} axisLine={false} />
            <Radar dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#e2e8f0',
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default RadarChartCard
