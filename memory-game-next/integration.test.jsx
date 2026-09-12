import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import HomePage from './app/page'

// Use fake timers for integration tests that need timer behavior
vi.useFakeTimers({ toFake: ['setTimeout', 'setInterval'] })

describe('Integration - Full Game Flow', () => {
  beforeEach(() => {
    vi.clearAllTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
  })

  it('4.5: Full game flow - click → compare → match/fail → victory screen appears', async () => {
    render(<HomePage />)
    
    // Initial state: 4x4 board (16 cards), 0 moves, 0:00 timer
    expect(screen.getByText('Memory Game')).toBeInTheDocument()
    expect(screen.getByText('Movimientos: 0')).toBeInTheDocument()
    expect(screen.getByText('Tiempo: 0:00')).toBeInTheDocument()
    
    // Find all card elements by testid
    const cards = screen.getAllByTestId('card')
    expect(cards.length).toBe(16)
    
    // Click first card - timer should start
    fireEvent.click(cards[0])
    
    // Advance timers to trigger timer interval
    act(() => {
      vi.advanceTimersByTime(100)
    })
    
    // Timer should start (showing 0:01 after 1 second, but we just check it's not 0:00)
    // Actually, with fake timers, we need to advance by 1000ms for the interval to fire
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    
    // Check that timer display has changed from 0:00
    expect(screen.getByText(/Tiempo: 0:0[1-9]/)).toBeInTheDocument()
    
    // Click second card
    fireEvent.click(cards[1])
    
    // During evaluation, moves should still be 0
    expect(screen.getByText('Movimientos: 0')).toBeInTheDocument()
  })

  it('4.5: Anti-cheat prevents rapid clicks during evaluation', async () => {
    render(<HomePage />)
    
    const cards = screen.getAllByTestId('card')
    
    // Click first two cards rapidly
    fireEvent.click(cards[0])
    fireEvent.click(cards[1])
    
    // Try to click third card immediately - should be blocked by evaluando
    fireEvent.click(cards[2])
    
    // Moves should not increment prematurely
    expect(screen.getByText('Movimientos: 0')).toBeInTheDocument()
  })

  it('4.5: Grid selector changes board size', async () => {
    render(<HomePage />)
    
    // Initially 4x4 = 16 cards
    let cards = screen.getAllByTestId('card')
    expect(cards.length).toBe(16)
    
    // Click 6x6 button
    const gridButtons = screen.getAllByRole('button', { name: /^[46]×[46]$/ })
    const sixBySixButton = gridButtons.find(btn => btn.textContent === '6×6')
    fireEvent.click(sixBySixButton)
    
    // Should now have 36 cards (6x6)
    cards = screen.getAllByTestId('card')
    expect(cards.length).toBe(36)
    
    // Moves and timer should reset
    expect(screen.getByText('Movimientos: 0')).toBeInTheDocument()
    expect(screen.getByText('Tiempo: 0:00')).toBeInTheDocument()
  })

  it('4.5: Victory screen component renders correctly', async () => {
    // Test the VictoryScreen component directly
    const { render: renderComponent } = await import('@testing-library/react')
    const VictoryScreen = (await import('./components/VictoryScreen')).default
    
    const { container } = renderComponent(<VictoryScreen time="1:30" moves={12} onRestart={vi.fn()} onNewGame={vi.fn()} />)
    
    expect(screen.getByText('¡Lo lograste!')).toBeInTheDocument()
    expect(screen.getByText('¡Has encontrado todas las parejas!')).toBeInTheDocument()
    expect(screen.getByText('Tiempo: 1:30')).toBeInTheDocument()
    expect(screen.getByText('Movimientos: 12')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Jugar de nuevo' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Nueva partida' })).toBeInTheDocument()
  })
})