import "./styles/main.css"
import { useState } from "react"
import PasswordDisplay from "./routes/home/PasswordDisplay.jsx"
import OptionsForm from "./routes/home/OptionsForm.jsx"
import StrengthMeter from "./routes/home/StrengthMeter.jsx"
import History from "./routes/home/History.jsx"
import { generatePassword, buildCharPool, calculateStrength } from "./lib/utils/generator.js"

const DEFAULT_OPTIONS = {
  uppercase: true,
  lowercase: true,
  numbers: false,
  symbols: false,
}

const DEFAULT_LENGTH = 12

// Contraseña inicial compartida para que display e history coincidan al montar
const INITIAL_PASSWORD = generatePassword(
  buildCharPool(DEFAULT_OPTIONS),
  DEFAULT_LENGTH
)

const App = () => {
  // Estado: todos los inputs controlados y el estado de la contraseña generada
  const [length, setLength] = useState(DEFAULT_LENGTH)
  const [options, setOptions] = useState(DEFAULT_OPTIONS)
  // Genera lazy una contraseña inicial al montar (sin botón)
  const [password, setPassword] = useState(INITIAL_PASSWORD)
  const [history, setHistory] = useState([INITIAL_PASSWORD])
  const [copyFeedback, setCopyFeedback] = useState(false)

  // Regenera la contraseña para una longitud y opciones dadas, actualizando el historial
  const regenerate = (nextLength, nextOptions) => {
    const selectedTypes = Object.values(nextOptions).filter((o) => o).length
    if (selectedTypes === 0 || nextLength <= 0) {
      setPassword("")
      return
    }

    const charPool = buildCharPool(nextOptions)
    const generated = generatePassword(charPool, nextLength)
    setPassword(generated)

    // Actualizar historial (agregar arriba, limitar a 5)
    setHistory((prev) => [generated, ...prev].slice(0, 5))
  }

  // Manejar copiar al portapapeles
  const handleCopy = async () => {
    const copy = () => {
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    }
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(password)
        copy()
      } catch {
        const textarea = document.createElement("textarea")
        textarea.value = password
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand("copy")
        document.body.removeChild(textarea)
        copy()
      }
    } else {
      const textarea = document.createElement("textarea")
      textarea.value = password
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      copy()
    }
  }

  // Manejar cambio de longitud — regenera instantáneamente
  const handleLengthChange = (e) => {
    const nextLength = Number(e.target.value)
    setLength(nextLength)
    regenerate(nextLength, options)
  }

  // Manejar cambio de opción — regenera instantáneamente
  const handleOptionChange = (e) => {
    const { name, checked } = e.target
    const nextOptions = { ...options, [name]: checked }
    setOptions(nextOptions)
    regenerate(length, nextOptions)
  }

  return (
    <div className="password-generator">
      <h1>Generador de Contraseñas</h1>

      {/* Mostrar contraseña — posición superior */}
      <section className="display-section">
        <PasswordDisplay
          password={password}
          onCopy={handleCopy}
          copyFeedback={copyFeedback}
        />
      </section>

      {/* Formulario de opciones — centrado, debajo del display */}
      <section className="form-section">
        <OptionsForm
          length={length}
          onLengthChange={handleLengthChange}
          options={options}
          onOptionChange={handleOptionChange}
        />
      </section>

      {/* Medidor de fortaleza — debajo de opciones */}
      <section className="strength-section">
        <StrengthMeter
          score={calculateStrength(options, length).score}
        />
      </section>

      {/* Historial */}
      <section className="history-section">
        <History passwords={history} />
      </section>
    </div>
  )
}

export default App