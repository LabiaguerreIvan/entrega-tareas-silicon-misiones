// Test de componente React para App
import { render, screen, fireEvent } from "@testing-library/react"
import App from "./App.jsx"

describe("App", () => {
  test("muestra el placeholder de contraseña", () => {
    const { container } = render(<App />)
    const input = container.querySelector('input[placeholder="P4$5W0rD!"]')
    expect(input).toBeDefined()
  })

  test("auto-genera una contraseña al cargar", () => {
    const { container } = render(<App />)
    const passwordInput = container.querySelector(".password-input")
    expect(passwordInput.value).not.toBe("")
  })

  test("regenera la contraseña cuando cambia la longitud", () => {
    const { container } = render(<App />)

    const slider = container.querySelector(".length-slider")
    fireEvent.input(slider, { target: { value: "16" } })

    const updated = container.querySelector(".password-input").value
    expect(updated).not.toBe("")
    expect(updated.length).toBe(16)
  })

  test("regenera la contraseña cuando cambian las opciones", () => {
    const { container } = render(<App />)

    const numbersCheckbox = container.querySelector('input[name="numbers"]')
    fireEvent.click(numbersCheckbox)

    const updated = container.querySelector(".password-input").value
    expect(updated).not.toBe("")
  })

  test("muestra el botón Copiar", () => {
    render(<App />)
    const copyBtn = screen.getByText("Copiar")
    expect(copyBtn).toBeDefined()
  })
})