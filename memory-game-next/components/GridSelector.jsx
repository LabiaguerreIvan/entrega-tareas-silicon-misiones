'use client'

/* GridSelector — Selector de tamaño de grilla
 * Props:
 *  size: number — tamaño actual de la grilla (4 o 6)
 *  onChange: function(size) — se invoca cuando el usuario elige un nuevo tamaño
 *  className: string — clases CSS
 */
function GridSelector({ size, onChange, className: extraClass }) {
  const sizes = [4, 6]

  return (
    <div
      className={`flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1.5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.07)] ${extraClass ?? ''}`}
    >
      {sizes.map((s) => {
        const active = size === s
        return (
          <button
            key={s}
            type="button"
            aria-pressed={active}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              active
                ? 'bg-indigo-600 text-white shadow-[0_4px_12px_rgba(79,70,229,0.35)]'
                : 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-[#1A1D20]'
            }`}
            onClick={() => onChange(s)}
          >
            {s}×{s}
          </button>
        )
      })}
    </div>
  )
}

export default GridSelector