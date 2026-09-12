'use client'

/* VictoryScreen — Modal de victoria con el resultado final y las acciones para volver a jugar.

 * Props:
 *  - time: string — tiempo formateado (m:ss)
 *  - moves: number — movimientos totales
 *  - onRestart: function — reinicia la misma partida (nuevo mazo mezclado)
 *  - onNewGame: function — inicia una partida nueva (vuelve a 4x4)
 */
function VictoryScreen({ time, moves, onRestart, onNewGame }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="¡Lo lograste!"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md"
    >
      <div
        className="victory-card w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-[0_24px_48px_-15px_rgba(0,0,0,0.12)] sm:p-8"
      >
        <h2 className="mb-2 text-3xl font-extrabold text-[#1A1D20]">
          ¡Lo lograste!
        </h2>
        <p className="mb-6 text-slate-500">¡Has encontrado todas las parejas!</p>

        <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
          <span className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 font-medium text-[#1A1D20]">
            Tiempo: {time}
          </span>
          <span className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 font-medium text-[#1A1D20]">
            Movimientos: {moves}
          </span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onRestart}
            className="flex-1 rounded-2xl bg-indigo-600 px-4 py-2.5 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-[0_8px_20px_-6px_rgba(79,70,229,0.45)] active:scale-[0.98]"
          >
            Jugar de nuevo
          </button>
          <button
            type="button"
            onClick={onNewGame}
            className="flex-1 rounded-2xl border border-indigo-200 bg-white px-4 py-2.5 font-semibold text-indigo-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-50 active:scale-[0.98]"
          >
            Nueva partida
          </button>
        </div>
      </div>
    </div>
  )
}

export default VictoryScreen