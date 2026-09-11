// Funciones puras para generación de contraseñas

// Construye el pool de caracteres según las opciones seleccionadas
// opciones: { uppercase: boolean, lowercase: boolean, numbers: boolean, symbols: boolean }
// Retorna: string (pool de caracteres concatenado)
export function buildCharPool(options) {
  let pool = ""

  if (options.uppercase) {
    pool += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  }
  if (options.lowercase) {
    pool += "abcdefghijklmnopqrstuvwxyz"
  }
  if (options.numbers) {
    pool += "0123456789"
  }
  if (options.symbols) {
    pool += "!@#$%^&*()_+-=[]{}|;:,.<>?/`~"
  }

  // If no options selected, default to lowercase letters
  if (!pool) {
    pool = "abcdefghijklmnopqrstuvwxyz"
  }

  return pool
}

// Genera contraseña aleatoria desde el pool
// pool: string, length: number
// Retorna: string
export function generatePassword(pool, length) {
  if (length <= 0 || !pool) {
    return ""
  }

  let result = ""
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * pool.length)
    result += pool[randomIndex]
  }
  return result
}

// Calcula el puntaje y la clasificación de fortaleza
// opciones: { uppercase, lowercase, numbers, symbols }, length: number
// Retorna: { score: 0-5, rating: 'Muy Débil' | 'Débil' | 'Media' | 'Fuerte' }
//
// Modelo de puntaje por bandas: score = basePorLongitud + bonusPorDiversidad
//
//   basePorLongitud (bandas de longitud):
//     length < 7            → 0   (demasiado corta)
//     7  <= length <= 10    → 1
//     11 <= length <= 14    → 2
//     length >= 15          → 3
//
//   bonusPorDiversidad (tipos de carácter seleccionados, 0-2):
//     0-1 tipos → 0   (un solo tipo no aporta diversidad real)
//     2-3 tipos → 1
//     4 tipos   → 2
//     Equivale a: (tipos >= 2 ? 1 : 0) + (tipos >= 4 ? 1 : 0)
//
//   Reglas duras de seguridad:
//     - length < 7  → siempre "Muy Débil" (puntaje 0)
//     - ningún tipo seleccionado → siempre "Muy Débil" (puntaje 0)
//
//   Mapeo puntaje → rating (la barra del medidor usa score * 20% → 0-100%):
//     0   → "Muy Débil" (rojo)
//     1-2 → "Débil"     (amarillo/naranja)
//     3   → "Media"     (amarillo)
//     4-5 → "Fuerte"    (verde)
export function calculateStrength(options, length) {
  const selectedTypes = [
    options.uppercase,
    options.lowercase,
    options.numbers,
    options.symbols,
  ].filter((t) => t).length

  // Reglas duras: contraseña corta o sin tipos → no supera "Muy Débil"
  if (length < 7 || selectedTypes === 0) {
    return { score: 0, rating: "Muy Débil" }
  }

  // Base por bandas de longitud
  let lengthBase = 0
  if (length >= 15) {
    lengthBase = 3
  } else if (length >= 11) {
    lengthBase = 2
  } else if (length >= 7) {
    lengthBase = 1
  }

  // Bonus por diversidad de tipos (0-2)
  const diversityBonus = (selectedTypes >= 2 ? 1 : 0) + (selectedTypes >= 4 ? 1 : 0)

  const score = lengthBase + diversityBonus

  // Mapea el puntaje a la clasificación
  let rating
  if (score <= 0) {
    rating = "Muy Débil"
  } else if (score <= 2) {
    rating = "Débil"
  } else if (score === 3) {
    rating = "Media"
  } else {
    rating = "Fuerte"
  }

  return { score, rating }
}