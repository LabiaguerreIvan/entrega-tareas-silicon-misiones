'use client'

/* Score — Muestra el contador de movimientos

 * Props:
 *  moves: number — cantidad actual de movimientos desde el hook useGame
 */
function Score({ moves }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-base font-medium text-[#1A1D20] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.07)] sm:text-lg">
      <span>Movimientos: {moves}</span>
    </div>
  )
}

export default Score