'use client'

import Card from './Card'

/* Componente Board - Tablero
 
 * Renderiza la grilla responsiva que contiene las Cards del juego.
 * Administra el diseño visual del tablero según el tamaño seleccionado y controla la interacción global cuando el juego está evaluando dos tarjetas.

 * @param {Object[]} props.board - Lista de objetos con el estado de cada tarjeta ({ id, valor, dadaVuelta, encontrada }).
 * @param {number} props.gridSize - Tamaño del tablero (4 para grilla 4x4 o 6 para grilla 6x6).
 * @param {Function} props.onCardClick - Función callback que recibe el `id` de la tarjeta seleccionada.
 * @param {boolean} props.isEvaluando - Bandera que bloquea las interacciones durante la comparación de un par.
 */
function Board({ board, gridSize, onCardClick, isEvaluando }) {
  
  // MAPA DE CLASES PARA TAILWIND CSS
  // Tailwind analiza el código de forma estática y elimina clases generadas dinámicamente como `grid-cols-${gridSize}`.
  // Para evitar que los estilos se rompan, se definen explícitamente las cadenas completas.
  const gridColumns = {
    4: 'grid-cols-4',
    6: 'grid-cols-6',
  }

  // CONSTRUCCIÓN DE LA CLASE DE LA GRILLA
  // Selecciona la columna adecuada según el `gridSize` (por defecto 4x4) y aplica espaciado responsivo entre tarjetas.
  const gridClass = `grid ${gridColumns[gridSize] ?? 'grid-cols-4'} gap-2 sm:gap-3 md:gap-4`

  return (
    <div className="w-full max-w-[640px]">
      
      {/* GRILLA DE TARJETAS */}
      <div
        className={`${gridClass} transition-opacity duration-200 ${
          isEvaluando ? 'pointer-events-none cursor-wait select-none opacity-80' : ''
        }`}
        aria-busy={isEvaluando}
      >
        {/* Mapeo del array `board` para renderizar cada una de las fichas del tablero */}
        {board.map((card) => (
          <Card
            key={card.id}
            card={card}
            onCardAction={onCardClick}
            isEvaluando={isEvaluando}
          />
        ))}
      </div>

    </div>
  )
}

export default Board