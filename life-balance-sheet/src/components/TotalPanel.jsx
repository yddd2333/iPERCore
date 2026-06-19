function TotalPanel({ value }) {
  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-slate-400">Life Net Worth (LVC)</p>
          <p className="text-xs text-slate-500 mt-1">人生总资产 · Life Value Capital</p>
        </div>
        <span className="text-xs font-mono text-emerald-400/80 border border-emerald-400/30 rounded-full px-3 py-1">
          LIVE
        </span>
      </div>
      <div className="mt-4 font-mono text-4xl font-bold tracking-tight text-slate-100">
        {value.toLocaleString()}
      </div>
    </div>
  )
}

export default TotalPanel
