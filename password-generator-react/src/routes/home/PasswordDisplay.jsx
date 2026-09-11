import Button from "../../lib/shared-components/Button.jsx"

const PasswordDisplay = ({ password, onCopy, copyFeedback }) => {
  return (
    <div className="password-display">
      <div className="password-display-row">
        <input
          type="text"
          value={password}
          readOnly
          placeholder="P4$5W0rD!"
          className="password-input"
          disabled={!password}
        />
        <Button
          variant="secondary"
          onClick={onCopy}
          disabled={!password}
          type="button"
        >
          Copiar
        </Button>
      </div>
      {copyFeedback && <span className="copied-feedback">¡Copiado!</span>}
    </div>
  )
}

export default PasswordDisplay