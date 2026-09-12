'use client'
import { useGame } from '../hooks/useGame'
import GridSelector from '../components/GridSelector'
import Timer from '../components/Timer'
import Score from '../components/Score'
import Board from '../components/Board'
import VictoryScreen from '../components/VictoryScreen'

/**
 * Componente principal de la app. Coordina la interfaz de usuario, el estado global del juego mediante el hook `useGame` y la renderización condicional.
 */
export default function HomePage() {
  const { 
    board,            // Array de cartas que componen el tablero actual
    isMounted,        // Flag para confirmar que el componente se montó en el cliente
    moves,            // Contador de movimientos realizados por el jugador
    evaluando,        // Estado que bloquea el tablero mientras se comparan 2 cartas
    formattedTimer,   // Tiempo transcurrido formateado en texto (mm:ss)
    victory,          // Estado booleano que indica si el jugador encontró todos los pares
    handleCardClick,  // Función handler para voltear/seleccionar una carta
    resetGame,        // Función para reiniciar la partida actual
    setGridSize: useSetGridSize // Función para cambiar el tamaño del tablero (4x4 o 6x6)
  } = useGame(4)


  // La dimensión de la grilla se calcula automáticamente según el tamaño del mazo.
  // Ejemplo: 16 cards -> raíz cuadrada de 16 = dimensión 4 (Grilla de 4x4)
  const gridSize = Math.sqrt(board.length)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#EFEFEF] px-4 py-8 sm:gap-8">
      
      {/* ENCABEZADO Y PRESENTACIÓN */}
      <header className="text-center">
        <h1 className="text-3xl font-extrabold text-[#1A1D20] sm:text-4xl italic">
          "Memory"
        </h1>
        <p className="mt-1 text-sm text-slate-500 italic">
          Éste es un juego de memoria, <br />
          para ganar necesitas encontrar todos los pares de números. ¡Buena suerte!
        </p>
      </header>


      {/* CONTENEDOR PRINCIPAL DEL JUEGO */}
      <div className="flex w-full flex-col items-center gap-6">
        
        <GridSelector size={gridSize} onChange={useSetGridSize} />

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Score moves={moves} />
          <Timer formatted={formattedTimer} />
        </div>


        {/* RENDERIZADO CONDICIONAL DE PANTALLAS */}
        
        {/* Con este estado de carga evito errores de hidratación en SSR (Server Side Rendering) esperando a que el mazo aleatorio se genere en el navegador */}
        {!isMounted ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-8 text-slate-500 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.10)]">
            Cargando tablero...
          </div>
        ) : 

        /* La pantalla de victoria se muestra cuando el jugador completó todos los pares */
        victory ? (
          <VictoryScreen
            time={formattedTimer}
            moves={moves}
            onRestart={resetGame}
            onNewGame={() => useSetGridSize(4)}
          />
        ) : 

        /* Tablero del juego */
        (
          <Board
            board={board}
            gridSize={gridSize}
            onCardClick={handleCardClick}
            isEvaluando={evaluando}
          />
        )}
      </div>

    </main>
  )
}