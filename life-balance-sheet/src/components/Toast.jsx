function Toast({ message, visible }) {
  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
    >
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-6 py-4 shadow-xl shadow-black/40">
        <p className="text-sm text-slate-100 font-medium">{message}</p>
      </div>
    </div>
  )
}

export default Toast
