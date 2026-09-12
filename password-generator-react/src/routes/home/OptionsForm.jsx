import { useCallback } from "react"

/* Formulario de configuración para la generación de la contraseña.
 * Permite ajustar la longitud mediante un slider y seleccionar los conjuntos de caracteres (mayúsculas, minúsculas, números y símbolos) mediante checkboxes.
*/
const OptionsForm = ({
  length,
  onLengthChange,
  options,
  onOptionChange,
}) => {
  /**
   * Manejador del evento de entrada del slider.
   * Calcula el porcentaje de llenado dinámico para actualizar la variable CSS `--slider-fill` y luego notifica al componente padre sobre el cambio de longitud.
   */
  const handleSliderInput = useCallback((e) => {
    const value = Number(e.target.value)
    // Calcula el porcentaje de avance respecto al valor máximo (20)
    const percent = (value / 20) * 100
    // Asigna la propiedad CSS personalizada para el relleno visual del track
    e.target.style.setProperty("--slider-fill", percent + "%")
    onLengthChange(e)
  }, [onLengthChange])

  return (
    <form className="options-form">
      {/* Slider */}
      <div className="form-row">
        <label className="form-label">Longitud de la contraseña</label>
        <span className="length-value">{length}</span>
        <input
          type="range"
          min="0"
          max="20"
          value={length}
          onInput={handleSliderInput}
          className="length-slider"
          style={{ "--slider-fill": `${(length / 20) * 100}%` }}
        />
      </div>

      {/* Checkboxes */}
      <div className="checkbox-row">
        {/* Incluir mayúsculas (A-Z) */}
        <label className="form-label">
          <input
            type="checkbox"
            name="uppercase"
            checked={options.uppercase}
            onChange={onOptionChange}
          />
          Mayúsculas
        </label>

        {/* Incluir minúsculas (a-z) */}
        <label className="form-label">
          <input
            type="checkbox"
            name="lowercase"
            checked={options.lowercase}
            onChange={onOptionChange}
          />
          Minúsculas
        </label>

        {/* Incluir dígitos (0-9) */}
        <label className="form-label">
          <input
            type="checkbox"
            name="numbers"
            checked={options.numbers}
            onChange={onOptionChange}
          />
          Números
        </label>

        {/* Incluir símbolos especiales (!@#$%...) */}
        <label className="form-label">
          <input
            type="checkbox"
            name="symbols"
            checked={options.symbols}
            onChange={onOptionChange}
          />
          Símbolos
        </label>
      </div>
    </form>
  )
}

export default OptionsForm