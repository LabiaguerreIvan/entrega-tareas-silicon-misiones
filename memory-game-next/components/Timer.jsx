'use client'

/* Timer — Muestra el tiempo transcurrido.
 * La cadena formateada proviene directamente del hook useGame (formattedTimer), de modo que la pantalla y el estado del hook comparten una única fuente de verdad.

 * Props:
 *  formatted: string — tiempo formateado en m:ss
 */
function Timer({ formatted }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-base font-medium text-[#1A1D20] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.07)] sm:text-lg">
      <span>Tiempo: {formatted ?? '0:00'}</span>
    </div>
  )
}

export default Timer