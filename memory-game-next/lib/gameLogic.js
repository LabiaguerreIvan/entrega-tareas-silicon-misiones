
/* MÓDULO DE LÓGICA

 * Contiene todas las funciones matemáticas y de transformación del estado.

 * Principios de diseño:
 * - Determinismo: Mismas entradas generan exactamente las mismas salidas.
 * - Inmutabilidad: Ninguna función muta los arreglos u objetos originales.
 * - Cero efectos secundarios: No interactúa con el DOM, localStorage ni timers.


 * Reglas del Negocio y Anti-Cheat:
 * 1. Control Anti-Cheat (`evaluando`): Se activa en `true` inmediatamente tras voltear la segunda tarjeta. Bloquea nuevos clics mientras corre la animación o la pausa de comparación (~800ms).
 * 2. Conteo de Movimientos: 1 movimiento = 2 tarjetas elegidas + evaluación completada. No aumenta por clic individual, sino tras cerrar el ciclo de comparación.
 */


// INICIALIZACIÓN Y MEZCLA DE TABLERO

/* Genera una nueva estructura de tablero con parejas aleatorias de tarjetas

 * @param {number} size - Dimensión de la grilla cuadrada (4 para 4x4, 6 para 6x6).
 * @returns {Array<Tarjeta>} Arreglo con la lista completa de tarjetas inicializadas.
 * @example
 * const tablero = crearTablero(4); // Genera 16 tarjetas (8 parejas del 1 al 8)
 */
export function crearTablero(size) {
  // Cantidad total de pares requeridos segun el tamaño de la grilla
  const pairs = (size * size) / 2;
  const numbers = [];

  // 1. Generar la secuencia duplicada de números (ej: [1, 1, 2, 2, ...])
  for (let i = 1; i <= pairs; i++) {
    numbers.push(i, i);
  }

  // 2. Desordenar aleatoriamente los elementos
  const shuffled = shuffle([...numbers]);

  // 3. Mapear cada valor a la entidad completa de Tarjeta (boca abajo y no encontradas)
  return shuffled.map((valor, index) => ({
    id: index,
    valor,
    dadaVuelta: false,
    encontrada: false,
  }));
}


/* Mezcla un array utilizando el algoritmo estándar de Fisher-Yates (Knuth Shuffle).

 * Garantiza una distribución uniforme de las tarjetas.
 * @param {Array<any>} arr - Arreglo original que se desea mezclar.
 * @returns {Array<any>} Una nueva copia del arreglo desordenada al azar.
 */
export function shuffle(arr) {
  const result = [...arr];

  // Recorrido inverso intercambiando el elemento actual por uno aleatorio previo
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}


// PROCESAMIENTO DE TURNOS INTERACTIVOS

/* Modifica el estado del tablero ante el clic en una tarjeta específica.

 * @param {Tarjeta} card - La tarjeta objetivo sobre la que se hizo clic.
 * @param {boolean} evaluando - Estado de bloqueo global (pausa de comparación).
 * @param {Array<number>} selected - Arreglo de IDs actualmente descubiertos en el turno.
 * @param {number} moves - Cantidad actual de movimientos acumulados.
 * @returns {{ card: Tarjeta, evaluando: boolean, selected: Array<number>, moves: number }}
 */
export function procesarClic(card, evaluando, selected, moves) {
  // ANTI-CHEAT: Se ignoran clics si la tarjeta ya está descubierta o si hay una evaluación en curso
  if (card.dadaVuelta || card.encontrada || evaluando) {
    return { card, evaluando, selected, moves };
  }

  // 1. Marcar la tarjeta como revelada (boca arriba)
  const nuevaCard = { ...card, dadaVuelta: true };

  // 2. Registrar la tarjeta revelada en la lista de selecciones del turno
  const nuevoSelected = [...selected, card.id];

  // 3. Evaluar si con esta tarjeta se completa la pareja del turno (máximo 2)
  if (nuevoSelected.length === 2) {
    return {
      card: nuevaCard,
      evaluando: true,       // Bloquea temporalmente nuevas interacciones en el tablero
      selected: nuevoSelected,
      moves,                 // El contador de movimientos se incrementará al resolver
    };
  }

  // Si es la primera tarjeta del turno, simplemente actualizamos el estado parcial
  return { 
    card: nuevaCard, 
    evaluando, 
    selected: nuevoSelected, 
    moves 
  };
}


/* Resuelve la comparación de las dos tarjetas seleccionadas al finalizar el tiempo de espera.

 * Oculta las tarjetas si fallan o las fija como encontradas si sus valores coinciden.
 * @param {Array<Tarjeta>} board - Estado actual de todas las tarjetas del tablero.
 * @param {Array<number>} selected - Par de IDs [id1, id2] a evaluar.
 * @returns {{ board: Array<Tarjeta>, evaluando: boolean, matches: number }}
 *          Nuevo estado del tablero y resultado del match (1 o 0).
 */
export function completarEvaluacion(board, selected) {
  const [id1, id2] = selected;

  // 1. Crear copia del tablero reseteando el flag temporal de 'dadaVuelta'
  const nuevaBoard = board.map((card) => ({
    ...card,
    dadaVuelta: false,
  }));

  // 2. Obtener las instancias de las tarjetas en evaluación
  const card1 = board.find((c) => c.id === id1);
  const card2 = board.find((c) => c.id === id2);

  // 3. Evaluar coincidencia de valores
  if (card1 && card2 && card1.valor === card2.valor) {
    // CASO ACIERTO: Ambos elementos se consolidan como permanentemente visibles
    nuevaBoard[id1].encontrada = true;
    nuevaBoard[id2].encontrada = true;
    return { board: nuevaBoard, evaluando: false, matches: 1 };
  }

  // CASO FALLO: Ambas se ocultan (conservan dadaVuelta: false y encontrada: false)
  return { board: nuevaBoard, evaluando: false, matches: 0 };
}


// VERIFICACIONES Y FORMATOS AUXILIARES

/* Comprueba si la partida fue finalizada con éxito.

 * @param {Array<Tarjeta>} board - Estado actual del tablero.
 * @returns {boolean} `true` si todas las tarjetas tienen `encontrada: true`.
 */
export function checkVictoria(board) {
  if (!board || board.length === 0) return false;
  return board.every((card) => card.encontrada);
}

/* Convierte un total de segundos transcurridos en una cadena formateada `minutos:segundos`.

 * @param {number} seconds - Segundos transcurridos en el temporizador.
 * @returns {string} Cadena de texto formateada para mostrar en la interfaz.
 */
export function formatearTiempo(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  // Agrega un cero a la izquierda si los segundos son menores a 10
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}