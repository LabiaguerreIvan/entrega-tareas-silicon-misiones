const StrengthMeter = ({ score }) => {
  const ratings = [
    { label: "Muy Débil", color: "var(--color-very-weak)", threshold: 0 },
    { label: "Débil", color: "var(--color-weak)", threshold: 1 },
    { label: "Media", color: "var(--color-medium)", threshold: 2 },
    { label: "Fuerte", color: "var(--color-strong)", threshold: 3 },
  ]

  // Recorre las clasificaciones de mayor a menor umbral para asignar la
  // categoría MÁS ALTA que el puntaje satisface (find() tomaba la primera).
  let rating = ratings[0]
  for (let i = ratings.length - 1; i >= 0; i--) {
    if (score >= ratings[i].threshold) {
      rating = ratings[i]
      break
    }
  }

  return (
    <div className="strength-meter">
      <span className="strength-label">{rating.label}</span>
      <div className="strength-bar" style={{ width: `${score * 20}%`, backgroundColor: rating.color }} />
    </div>
  )
}

export default StrengthMeter