// Tests de funciones puras para generación de contraseñas

import { buildCharPool, generatePassword, calculateStrength } from "./generator.js"

describe("buildCharPool", () => {
  test("incluye letras mayúsculas cuando mayúsculas está seleccionado", () => {
    const result = buildCharPool({ uppercase: true, lowercase: false, numbers: false, symbols: false })
    expect(result).toContain("A")
    expect(result).toContain("Z")
    expect(result.length).toBe(26)
  })

  test("incluye letras minúsculas cuando minúsculas está seleccionado", () => {
    const result = buildCharPool({ uppercase: false, lowercase: true, numbers: false, symbols: false })
    expect(result).toContain("a")
    expect(result).toContain("z")
    expect(result.length).toBe(26)
  })

  test("incluye números cuando números está seleccionado", () => {
    const result = buildCharPool({ uppercase: false, lowercase: false, numbers: true, symbols: false })
    expect(result).toContain("0")
    expect(result).toContain("9")
    expect(result.length).toBe(10)
  })

  test("incluye símbolos cuando símbolos está seleccionado", () => {
    const result = buildCharPool({ uppercase: false, lowercase: false, numbers: false, symbols: true })
    expect(result).toContain("!")
    expect(result).toContain("~")
  })

  test("incluye todos los tipos de caracteres seleccionados", () => {
    const result = buildCharPool({ uppercase: true, lowercase: true, numbers: true, symbols: true })
    // 26 mayúsculas + 26 minúsculas + 10 números + 29 símbolos = 91
    expect(result.length).toBe(26 + 26 + 10 + 29)
    expect(result).toContain("A")
    expect(result).toContain("a")
    expect(result).toContain("0")
    expect(result).toContain("!")
  })

  test("predetermina minúsculas cuando no hay opciones seleccionadas", () => {
    const result = buildCharPool({ uppercase: false, lowercase: false, numbers: false, symbols: false })
    expect(result).toBe("abcdefghijklmnopqrstuvwxyz")
  })
})

describe("generatePassword", () => {
  test("genera contraseña de longitud correcta desde el pool", () => {
    const pool = "abcdefghijklmnopqrstuvwxyz"
    const result = generatePassword(pool, 10)
    expect(result.length).toBe(10)
    // Todos los caracteres deben ser del pool
    for (const char of result) {
      expect(pool).toContain(char)
    }
  })

  test("genera contraseña con longitud 1", () => {
    const pool = "abcdef"
    const result = generatePassword(pool, 1)
    expect(result.length).toBe(1)
    expect("abcdef").toContain(result)
  })

  test("retorna cadena vacía para pool inválido", () => {
    expect(generatePassword("", 10)).toBe("")
    expect(generatePassword(null, 10)).toBe("")
  })

  test("retorna cadena vacía para longitud 0", () => {
    const pool = "abcdef"
    expect(generatePassword(pool, 0)).toBe("")
  })
})

describe("calculateStrength", () => {
  test("Muy Débil: longitud menor a 7 con todos los tipos seleccionados", () => {
    const result = calculateStrength({ uppercase: true, lowercase: true, numbers: true, symbols: true }, 6)
    expect(result.score).toBe(0)
    expect(result.rating).toBe("Muy Débil")
  })

  test("Muy Débil: longitud menor a 7 con un solo tipo", () => {
    const result = calculateStrength({ uppercase: false, lowercase: true, numbers: false, symbols: false }, 4)
    expect(result.score).toBe(0)
    expect(result.rating).toBe("Muy Débil")
  })

  test("Muy Débil: ningún tipo de carácter seleccionado", () => {
    const result = calculateStrength({ uppercase: false, lowercase: false, numbers: false, symbols: false }, 16)
    expect(result.score).toBe(0)
    expect(result.rating).toBe("Muy Débil")
  })

  test("Débil: 7-10 caracteres con combinación básica (dos tipos)", () => {
    const result = calculateStrength({ uppercase: true, lowercase: true, numbers: false, symbols: false }, 8)
    expect(result.score).toBe(2)
    expect(result.rating).toBe("Débil")
  })

  test("Débil: 7-10 caracteres con un solo tipo", () => {
    const result = calculateStrength({ uppercase: false, lowercase: true, numbers: false, symbols: false }, 9)
    expect(result.score).toBe(1)
    expect(result.rating).toBe("Débil")
  })

  test("Débil: 11-14 caracteres con un solo tipo (sin diversidad)", () => {
    const result = calculateStrength({ uppercase: false, lowercase: true, numbers: false, symbols: false }, 14)
    expect(result.score).toBe(2)
    expect(result.rating).toBe("Débil")
  })

  test("Media: 11-12 caracteres con diversidad media (dos tipos)", () => {
    const result = calculateStrength({ uppercase: true, lowercase: false, numbers: true, symbols: false }, 12)
    expect(result.score).toBe(3)
    expect(result.rating).toBe("Media")
  })

  test("Media: 15 o más caracteres con un solo tipo", () => {
    const result = calculateStrength({ uppercase: false, lowercase: true, numbers: false, symbols: false }, 15)
    expect(result.score).toBe(3)
    expect(result.rating).toBe("Media")
  })

  test("Fuerte: 11-14 caracteres con los cuatro tipos", () => {
    const result = calculateStrength({ uppercase: true, lowercase: true, numbers: true, symbols: true }, 12)
    expect(result.score).toBe(4)
    expect(result.rating).toBe("Fuerte")
  })

  test("Fuerte: longitud larga con los cuatro tipos", () => {
    const result = calculateStrength({ uppercase: true, lowercase: true, numbers: true, symbols: true }, 20)
    expect(result.score).toBe(5)
    expect(result.rating).toBe("Fuerte")
  })

  test("límite: 6 caracteres es Muy Débil y 7 ya no lo es", () => {
    const corta = calculateStrength({ uppercase: true, lowercase: true, numbers: true, symbols: true }, 6)
    const borde = calculateStrength({ uppercase: true, lowercase: true, numbers: true, symbols: true }, 7)
    expect(corta.rating).toBe("Muy Débil")
    expect(borde.rating).not.toBe("Muy Débil")
    expect(borde.score).toBe(3) // base 1 (7-10) + bonus 2 (4 tipos)
  })

  test("límite: 10 es Débil y 11 asciende a Media con dos tipos", () => {
    const corta = calculateStrength({ uppercase: true, lowercase: false, numbers: true, symbols: false }, 10)
    const larga = calculateStrength({ uppercase: true, lowercase: false, numbers: true, symbols: false }, 11)
    expect(corta.rating).toBe("Débil")
    expect(corta.score).toBe(2)
    expect(larga.rating).toBe("Media")
    expect(larga.score).toBe(3)
  })

  test("el puntaje siempre es numérico y la barra entra en 0-100%", () => {
    const cases = [
      [{ uppercase: true, lowercase: true, numbers: true, symbols: true }, 5],
      [{ uppercase: false, lowercase: true, numbers: false, symbols: false }, 8],
      [{ uppercase: true, lowercase: true, numbers: false, symbols: false }, 12],
      [{ uppercase: true, lowercase: true, numbers: true, symbols: true }, 18],
      [{ uppercase: false, lowercase: false, numbers: false, symbols: false }, 10],
    ]
    for (const [options, length] of cases) {
      const { score } = calculateStrength(options, length)
      expect(typeof score).toBe("number")
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(5)
      expect(score * 20).toBeGreaterThanOrEqual(0)
      expect(score * 20).toBeLessThanOrEqual(100)
    }
  })
})
