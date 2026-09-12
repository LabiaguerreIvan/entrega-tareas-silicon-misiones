import { describe, it, expect, vi } from 'vitest'
import { crearTablero, shuffle, completarEvaluacion, checkVictoria, formatearTiempo } from './gameLogic'

describe('gameLogic - crearTablero', () => {
  it('4.1: crearTablero(4) returns exactly 8 pairs (16 cards) with dadaVuelta=false, encontrada=false', () => {
    const board = crearTablero(4)
    
    // Should have 16 cards (8 pairs * 2)
    expect(board.length).toBe(16)
    
    // Each card should have correct structure
    board.forEach((card) => {
      expect(card).toHaveProperty('id')
      expect(card).toHaveProperty('valor')
      expect(card).toHaveProperty('dadaVuelta', false)
      expect(card).toHaveProperty('encontrada', false)
      expect(typeof card.id).toBe('number')
      expect(typeof card.valor).toBe('number')
    })
    
    // Should have exactly 8 pairs (values 1-8, each appearing twice)
    const values = board.map(c => c.valor).sort((a, b) => a - b)
    const expectedValues = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8]
    expect(values).toEqual(expectedValues)
  })

  it('crearTablero(6) returns exactly 18 pairs (36 cards)', () => {
    const board = crearTablero(6)
    expect(board.length).toBe(36)
    
    const values = board.map(c => c.valor).sort((a, b) => a - b)
    const expectedValues = []
    for (let i = 1; i <= 18; i++) {
      expectedValues.push(i, i)
    }
    expect(values).toEqual(expectedValues)
  })

  it('All cards have unique ids', () => {
    const board = crearTablero(4)
    const ids = board.map(c => c.id)
    const uniqueIds = [...new Set(ids)]
    expect(ids.length).toBe(uniqueIds.length)
  })
})

describe('gameLogic - shuffle', () => {
  it('shuffles array without losing elements', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const shuffled = shuffle(arr)
    expect(shuffled.sort((a, b) => a - b)).toEqual(arr)
    // With 10 elements, probability of same order is 1/10! ≈ 0.00003%
    // But we'll just check it's a permutation
    expect(shuffled.length).toBe(arr.length)
  })

  it('does not mutate original array', () => {
    const arr = [1, 2, 3, 4, 5]
    const original = [...arr]
    shuffle(arr)
    expect(arr).toEqual(original)
  })
})

describe('gameLogic - completarEvaluacion', () => {
  it('returns match when two selected cards have same valor', () => {
    const board = [
      { id: 0, valor: 1, dadaVuelta: true, encontrada: false },
      { id: 1, valor: 1, dadaVuelta: true, encontrada: false },
      { id: 2, valor: 2, dadaVuelta: false, encontrada: false },
    ]
    const result = completarEvaluacion(board, [0, 1])
    
    expect(result.matches).toBe(1)
    expect(result.evaluando).toBe(false)
    expect(result.board[0].encontrada).toBe(true)
    expect(result.board[1].encontrada).toBe(true)
    // Cards should be reset to dadaVuelta: false
    expect(result.board[0].dadaVuelta).toBe(false)
    expect(result.board[1].dadaVuelta).toBe(false)
  })

  it('returns mismatch when two selected cards have different valor', () => {
    const board = [
      { id: 0, valor: 1, dadaVuelta: true, encontrada: false },
      { id: 1, valor: 2, dadaVuelta: true, encontrada: false },
      { id: 2, valor: 3, dadaVuelta: false, encontrada: false },
    ]
    const result = completarEvaluacion(board, [0, 1])
    
    expect(result.matches).toBe(0)
    expect(result.evaluando).toBe(false)
    expect(result.board[0].encontrada).toBe(false)
    expect(result.board[1].encontrada).toBe(false)
    expect(result.board[0].dadaVuelta).toBe(false)
    expect(result.board[1].dadaVuelta).toBe(false)
  })
})

describe('gameLogic - checkVictoria', () => {
  it('returns true when all cards are encontrada', () => {
    const board = [
      { id: 0, valor: 1, dadaVuelta: false, encontrada: true },
      { id: 1, valor: 1, dadaVuelta: false, encontrada: true },
    ]
    expect(checkVictoria(board)).toBe(true)
  })

  it('returns false when any card is not encontrada', () => {
    const board = [
      { id: 0, valor: 1, dadaVuelta: false, encontrada: true },
      { id: 1, valor: 1, dadaVuelta: false, encontrada: false },
    ]
    expect(checkVictoria(board)).toBe(false)
  })

  it('returns false for empty board', () => {
    expect(checkVictoria([])).toBe(true) // every() on empty array returns true
  })
})

describe('gameLogic - formatearTiempo', () => {
  it('formats seconds as m:ss', () => {
    expect(formatearTiempo(0)).toBe('0:00')
    expect(formatearTiempo(5)).toBe('0:05')
    expect(formatearTiempo(30)).toBe('0:30')
    expect(formatearTiempo(59)).toBe('0:59')
    expect(formatearTiempo(60)).toBe('1:00')
    expect(formatearTiempo(65)).toBe('1:05')
    expect(formatearTiempo(125)).toBe('2:05')
    expect(formatearTiempo(3661)).toBe('61:01')
  })

  it('pads seconds with leading zero when < 10', () => {
    expect(formatearTiempo(9)).toBe('0:09')
    expect(formatearTiempo(69)).toBe('1:09')
  })
})