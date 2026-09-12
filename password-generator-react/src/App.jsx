/**
 * ============================================================================
 * COMPONENTE PRINCIPAL — GENERADOR DE CONTRASEÑAS (PASSWORD GENERATOR)
 * ============================================================================
 * Este archivo actúa como el contenedor principal (Smart Component/Container) 
 * de la aplicación. Maneja el estado global de la clave, la configuración de
 * opciones, el historial reciente de contraseñas y la interacción con el portapapeles.
 * ============================================================================
 */

import "./styles/main.css"
import { useState } from "react"
import PasswordDisplay from "./routes/home/PasswordDisplay.jsx"
import OptionsForm from "./routes/home/OptionsForm.jsx"
import StrengthMeter from "./routes/home/StrengthMeter.jsx"
import History from "./routes/home/History.jsx"
import { generatePassword, buildCharPool, calculateStrength } from "./lib/utils/generator.js"


/** Opciones por defecto para la inclusión de caracteres al iniciar la app */
const DEFAULT_OPTIONS = {
  uppercase: true,
  lowercase: true,
  numbers: false,
  symbols: false,
}

/** Longitud predeterminada de la contraseña generada */
const DEFAULT_LENGTH = 12

/* Contraseña inicial compartida. 
 * Se calcula al cargar la pantalla para sincronizar la primera renderización del componente de visualización (Display) con el historial inicial.
 */
const INITIAL_PASSWORD = generatePassword(
  buildCharPool(DEFAULT_OPTIONS),
  DEFAULT_LENGTH
)

/**
 * Componente raíz de la interfaz del Generador de Contraseñas.
 * 
 * @returns {JSX.Element} La estructura completa de la interfaz de usuario.
 */
const App = () => {
    const [length, setLength] = useState(DEFAULT_LENGTH)  /** Longitud seleccionada para la contraseña actual */
    const [options, setOptions] = useState(DEFAULT_OPTIONS)  /** Objeto de configuración con los check-state (mayúsculas, números, etc.) */
    const [password, setPassword] = useState(INITIAL_PASSWORD)  /** Contraseña actualmente generada y visible en pantalla */
    const [history, setHistory] = useState([INITIAL_PASSWORD])  /** Lista con el historial de las últimas contraseñas creadas  */
    const [copyFeedback, setCopyFeedback] = useState(false) /** Estado del aviso visual al copiar al portapapeles  */


  // MANEJADORES DE LÓGICA Y EVENTOS

  /* Genera una nueva contraseña según los parámetros dados y actualiza el historial.
   *
   * @param {number} nextLength - Nueva longitud objetivo.
   * @param {Object} nextOptions - Nuevas opciones de caracteres seleccionados.
   */
  const regenerate = (nextLength, nextOptions) => {
    // Validación de seguridad: Si no hay tipos seleccionados o la longitud es 0, vaciar la clave
    const selectedTypes = Object.values(nextOptions).filter((o) => o).length
    if (selectedTypes === 0 || nextLength <= 0) {
      setPassword("")
      return
    }

    // Construir la bolsa de caracteres permitidos segun los checkboxes activos
    const charPool = buildCharPool(nextOptions)
    
    // Generar la clave aleatoria
    const generated = generatePassword(charPool, nextLength)
    setPassword(generated)

    // Insertar la nueva clave al inicio del historial y limitar a los últimos 5 elementos
    setHistory((prev) => [generated, ...prev].slice(0, 5))
  }

  /**
   * Copia la contraseña actual al portapapeles.
   * Utiliza la API nativa navigator.clipboard o un fallback ejecutable para navegadores antiguos.
   */
  const handleCopy = async () => {
    /** Se muestra el mensajito de exito */
    const copy = () => {
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    }

    // Caso A: El navegador soporta la API moderna navigator.clipboard
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(password)
        copy()
      } catch {
        // Fallback en caso de que la API síncrona falle o no tenga permisos
        const textarea = document.createElement("textarea")
        textarea.value = password
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand("copy")
        document.body.removeChild(textarea)
        copy()
      }
    } else {
      // Caso B: Fallback para navegadores antiguos sin soporte de Clipboard API
      const textarea = document.createElement("textarea")
      textarea.value = password
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      copy()
    }
  }

  /* Procesa el cambio en el slider/input de longitud y regenera la clave al instante.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento del input.
   */
  const handleLengthChange = (e) => {
    const nextLength = Number(e.target.value)
    setLength(nextLength)
    regenerate(nextLength, options)
  }

  /* Procesa el cambio en los checkboxes de opciones (mayúsculas, números, etc.) y regenera.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento del checkbox.
   */
  const handleOptionChange = (e) => {
    const { name, checked } = e.target
    const nextOptions = { ...options, [name]: checked }
    setOptions(nextOptions)
    regenerate(length, nextOptions)
  }

  return (
    <div className="password-generator">
      <h1>Generador de Contraseñas</h1>
      <h4>
        Cree su propia contraseña de manera dinámica. <br />
        "No es necesario escribirla, solo elija los parametros y estará lista"
      </h4>

      {/* Muestra la contraseña generada y el botón de copiado */}
      <section className="display-section">
        <PasswordDisplay
          password={password}
          onCopy={handleCopy}
          copyFeedback={copyFeedback}
        />
      </section>

      {/* Formulario de configuración (longitud y tipos de caracteres) */}
      <section className="form-section">
        <OptionsForm
          length={length}
          onLengthChange={handleLengthChange}
          options={options}
          onOptionChange={handleOptionChange}
        />
      </section>

      {/* Indicador de fortaleza (calculado en tiempo real) */}
      <section className="strength-section">
        <StrengthMeter
          score={calculateStrength(options, length).score}
        />
      </section>

      {/* Historial con las últimas contraseñas generadas */}
      <section className="history-section">
        <History passwords={history} />
      </section>
    </div>
  )
}

export default App