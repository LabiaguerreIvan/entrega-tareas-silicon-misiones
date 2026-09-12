/** @jsxImportSource ./app/globals.css */
/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  crearTablero,
  checkVictoria,
  formatearTiempo,
  completarEvaluacion,
} from '../lib/gameLogic'

/* Este es el Hook central para la gestión del estado del juego.
 * Controla la generación del tablero, los turnos, el cronómetro, el bloqueo anti-cheat y las condiciones de victoria.
 */
export function useGame(initialSize = 4) {

  // ESTADOS DEL TABLERO Y MONTAJE
  const [board, setBoard] = useState([]) // Tablero de juego: [{ id, valor, dadaVuelta, encontrada }]
  const [isMounted, setIsMounted] = useState(false) // Inicia vacío para evitar errores de hidratación (SSR vs Cliente)
  const [evaluando, setEvaluando] = useState(false)   // Anti-cheat: bloquea nuevos clics mientras se evalúa una pareja
  const [selected, setSelected] = useState([])  // Arreglo con los IDs de las cartas seleccionadas en el turno actual (máx 2)
  const [moves, setMoves] = useState(0)// Contador global de jugadas intentadas

  // ESTADOS DEL TEMPORIZADOR Y VICTORIA
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerStarted, setTimerStarted] = useState(false)
  const timerRef = useRef(null)

  const [victory, setVictory] = useState(false)

  // REFS DE SEGUIMIENTO INTERNO
  const wasEvaluandoRef = useRef(false)
  const evaluandoRef = useRef(evaluando)
  evaluandoRef.current = evaluando

  const boardRef = useRef(board)
  boardRef.current = board

  
  // EFECTOS (LÓGICA REACTIVA)
  
  // (Efecto 1) Generación inicial del mazo tras la hidratación en el navegador
  useEffect(() => {
    setIsMounted(true)
    setBoard(crearTablero(initialSize))
  }, [initialSize])

  // (Efecto 2) Detección del primer clic para arrancar el cronómetro
  useEffect(() => {
    if (!timerStarted) {
      const hayTarjetaVolteada = boardRef.current.some(
        (c) => c.dadaVuelta && !c.encontrada
      )
      if (hayTarjetaVolteada) {
        setTimerStarted(true)
        setTimerRunning(true)
      }
    }
  }, [timerStarted, board])

  // (Efecto 3) Ciclo del temporizador
  useEffect(() => {
    if (!timerStarted || !timerRunning) return

    timerRef.current = setInterval(() => {
      setTimerSeconds((s) => s + 1)
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [timerStarted, timerRunning])

  // (Efecto 4) Detención automática del cronómetro al ganar
  useEffect(() => {
    if (victory && timerRunning) {
      setTimerRunning(false)
    }
  }, [victory, timerRunning])

  // (Efecto 5) Evaluación diferida de la pareja seleccionada
  useEffect(() => {
    if (evaluando && selected.length === 2) {
      const timeoutId = setTimeout(() => {
        setBoard((prevBoard) => {
          const result = completarEvaluacion(prevBoard, selected)
          return result.board
        })
        setEvaluando(false)
        setSelected([])
      }, 800)

      return () => clearTimeout(timeoutId)
    }
  }, [evaluando, selected.length])

  // (Efecto 6) Incremento de movimientos tras finalizar la evaluación
  useEffect(() => {
    const wasEvaluando = wasEvaluandoRef.current
    wasEvaluandoRef.current = evaluando

    if (wasEvaluando && !evaluando && selected.length === 0) {
      setMoves((m) => m + 1)
    }
  }, [evaluando, selected.length])

  // (Efecto 7) Verificación de la condición de victoria
  useEffect(() => {
    if (board.length > 0) {
      setVictory(checkVictoria(board))
    }
  }, [board])


  // ACCIONES Y MANEJADORES

  /* Procesa la selección de una carta. Aplica el filtro anti-cheat y registra la selección de la pareja */
  const handleCardClick = useCallback((cardId) => {
    if (evaluandoRef.current) return

    setBoard((prevBoard) =>
      prevBoard.map((card) => {
        if (card.id === cardId && !card.dadaVuelta && !card.encontrada) {
          return { ...card, dadaVuelta: true }
        }
        return card
      })
    )

    setSelected((prevSelected) => {
      if (evaluandoRef.current) return prevSelected

      const yaSeleccionado = prevSelected.includes(cardId)
      const nuevoSelected = yaSeleccionado
        ? prevSelected.filter((id) => id !== cardId)
        : [...prevSelected, cardId]

      if (nuevoSelected.length === 2) {
        setEvaluando(true)
      }

      return nuevoSelected
    })
  }, [])


  /* Fuerza el cierre manual de una evaluación en curso */
  const finishEvaluation = useCallback(() => {
    setBoard((prevBoard) => {
      const result = completarEvaluacion(prevBoard, selected)
      return result.board
    })
    setEvaluando(false)
    setSelected([])
  }, [selected])


  /* Resetea la partida al estado inicial (limpia marcadores, mazo y timer) */
  const resetGame = useCallback(() => {
    setBoard(crearTablero(initialSize))
    setEvaluando(false)
    setSelected([])
    setMoves(0)
    setTimerSeconds(0)
    setTimerRunning(false)
    setTimerStarted(false)
    if (timerRef.current) clearInterval(timerRef.current)
    setVictory(false)
    wasEvaluandoRef.current = false
  }, [initialSize])


  /* Cambia la dimensión de la grilla y reinicia la partida */
  const setGridSize = useCallback(
    (size) => {
      resetGame()
      setBoard(crearTablero(size))
    },
    [resetGame]
  )

  
  // RETORNO DE INTERFAZ DEL HOOK
  return {
    board,
    isMounted,
    evaluando,
    selected,
    moves,
    timerSeconds,
    timerRunning,
    timerStarted,
    formattedTimer: timerSeconds !== undefined ? formatearTiempo(timerSeconds) : '0:00',
    victory,
    isVictory: victory,
    
    handleCardClick,
    finishEvaluation,
    resetGame,
    setGridSize,
  }
}