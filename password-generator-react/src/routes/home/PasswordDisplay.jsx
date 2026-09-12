import Button from "../../lib/shared-components/Button.jsx"

/* Muestra el campo de texto con la contraseña generada y el botón para copiarla.
 * Incluye visualización de estado de copia y accesibilidad.
 */
const PasswordDisplay = ({ password, onCopy, copyFeedback }) => {
  return (
    <div className="password-display">
      <div className="password-display-row">
        {/* Campo para ver la contraseña */}
        <input
          type="text"
          value={password}
          readOnly 
          placeholder="P4$5W0rD!" 
          className="password-input"
          disabled={!password} // Se deshabilita si no hay una contraseña activa
        />
        
        {/* Botón secundario para activar el copiado al portapapeles */}
        <Button
          variant="secondary"
          onClick={onCopy}
          disabled={!password} // Deshabilitado hasta que se genere una contraseña
          type="button"
        >
          Copiar
        </Button>
      </div>

      {/* Mensaje de confirmación al copiar exitosamente */}
      {copyFeedback && <span className="copied-feedback">¡Copiado!</span>}
    </div>
  )
}

export default PasswordDisplay