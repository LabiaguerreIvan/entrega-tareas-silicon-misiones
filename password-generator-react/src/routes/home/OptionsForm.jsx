import { useCallback } from "react"

const OptionsForm = ({
  length,
  onLengthChange,
  options,
  onOptionChange,
}) => {
  const handleSliderInput = useCallback((e) => {
    const value = Number(e.target.value)
    const percent = (value / 20) * 100
    e.target.style.setProperty("--slider-fill", percent + "%")
    onLengthChange(e)
  }, [onLengthChange])

  return (
    <form className="options-form">
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

      <div className="checkbox-row">
        <label className="form-label">
          <input
            type="checkbox"
            name="uppercase"
            checked={options.uppercase}
            onChange={onOptionChange}
          />
          Mayúsculas
        </label>
        <label className="form-label">
          <input
            type="checkbox"
            name="lowercase"
            checked={options.lowercase}
            onChange={onOptionChange}
          />
          Minúsculas
        </label>
        <label className="form-label">
          <input
            type="checkbox"
            name="numbers"
            checked={options.numbers}
            onChange={onOptionChange}
          />
          Números
        </label>
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