import { Send } from 'lucide-react'

function InputBar({ value, onChange, onSubmit, loading }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) {
      onSubmit()
    }
  }

  const buttonClass = loading
    ? 'flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-xl transition-colors animate-pulse'
    : 'flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-xl transition-colors'

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-lg border-t border-white/10 p-4">
      <div className="max-w-6xl mx-auto flex gap-3">
        <input
          type="text"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
          placeholder="描述你今天的行为...（如：熬夜加班、跑步运动、读书学习）"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
        />
        <button type="button" className={buttonClass} onClick={onSubmit} disabled={loading}>
          <Send size={18} />
          {loading ? 'AI 分析中...' : '提交测算'}
        </button>
      </div>
    </div>
  )
}

export default InputBar
