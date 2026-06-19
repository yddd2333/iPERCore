function AssetCard({ title, value, Icon, color }) {
  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-black/20 ${color}`}>
        <Icon />
      </div>
      <h3 className="mt-4 text-sm uppercase tracking-widest text-slate-400">{title}</h3>
      <div className="mt-2 font-mono text-4xl font-bold tracking-tight text-slate-100">
        {value.toLocaleString()}
      </div>
    </div>
  )
}

export default AssetCard
