'use client'

/**
 * Card — Tarjeta individual del juego de memoria con volteo 3D suave.
 *
 * El estado visual se deriva de los props de la tarjeta (única fuente de verdad):
 *  - la cara queda hacia arriba mientras dadaVuelta o encontrada sea true
 *  - las parejas encontradas reciben un anillo verde suave (sin brillo neón)
 * Props:
 *  - card: { id, valor, dadaVuelta, encontrada }
 *  - onCardAction: function(cardId) — se invoca al hacer clic en la tarjeta
 *  - isEvaluando: boolean — bloquea los clics durante la comparación de parejas
 */
function Card({ card, onCardAction, isEvaluando }) {
  const isFaceUp = card.dadaVuelta || card.encontrada

  const handleClick = () => {
    // Anti-cheat: se bloquean los clics durante la comparación de parejas
    if (isEvaluando) return
    // Las tarjetas ya encontradas permanecen bloqueadas
    if (card.encontrada) return
    onCardAction(card.id)
  }

  return (
    <div
      className={
        'card-3d aspect-square w-full cursor-pointer select-none transition-all duration-200 ' +
        'hover:-translate-y-0.5 hover:shadow-[0_24px_48px_-15px_rgba(0,0,0,0.12)] active:scale-[0.97]'
      }
      onClick={handleClick}
      data-testid="card"
    >
      <div className={`card-3d-inner ${isFaceUp ? 'is-flipped' : ''}`}>
        {/* Cara trasera (visible mientras la tarjeta está boca abajo) */}
        <div
          className={
            'card-face flex items-center justify-center rounded-3xl border ' +
            'border-slate-200 bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.07)]'
          }
        >
          <span className="text-2xl font-extrabold text-slate-300 sm:text-3xl">M</span>
        </div>

        {/* Cara frontal (visible al voltear la tarjeta) */}
        <div
          className={
            'card-face card-face-front flex items-center justify-center rounded-3xl border ' +
            (card.encontrada
              ? 'card-matched border-emerald-400 bg-emerald-50'
              : 'border-indigo-200 bg-gradient-to-br from-white to-indigo-50 shadow-[0_8px_16px_-8px_rgba(79,70,229,0.2)]')
          }
        >
          <span
            className={`text-xl font-extrabold sm:text-2xl md:text-3xl ${
              card.encontrada ? 'text-emerald-600' : 'text-indigo-600'
            }`}
          >
            {card.valor}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Card