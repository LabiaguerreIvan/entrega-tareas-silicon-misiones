/* MÓDULO DE GENERACIÓN Y EVALUACIÓN DE CONTRASEÑAS */

/*
 * Construye el repertorio (pool) de caracteres disponibles según los filtros elegidos.
 * 
 * @typedef {Object} OpcionesGeneracion
 * @property {boolean} uppercase - Incluir letras mayúsculas (A-Z).
 * @property {boolean} lowercase - Incluir letras minúsculas (a-z).
 * @property {boolean} numbers - Incluir dígitos numéricos (0-9).
 * @property {boolean} symbols - Incluir caracteres especiales y símbolos.
 * 
 * @param {OpcionesGeneracion} options - Selección de tipos de caracteres activos.
 * @returns {string} Cadena de texto concatenada con todos los caracteres elegidos.
 */
export function buildCharPool(options) {
  let pool = "";

  // Agregar conjuntos según las casillas de verificación seleccionadas
  if (options.uppercase) {
    pool += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }
  if (options.lowercase) {
    pool += "abcdefghijklmnopqrstuvwxyz";
  }
  if (options.numbers) {
    pool += "0123456789";
  }
  if (options.symbols) {
    pool += "!@#$%^&*()_+-=[]{}|;:,.<>?/`~";
  }

  // Regla de respaldo: si no se seleccionó ninguna opción, se usan minúsculas por defecto
  if (!pool) {
    pool = "abcdefghijklmnopqrstuvwxyz";
  }

  return pool;
}

/*
 * Genera una contraseña aleatoria de una longitud determinada usando el pool de caracteres.
 * 
 * @param {string} pool - Cadena que contiene todos los caracteres autorizados.
 * @param {number} length - Cantidad deseada de caracteres para la contraseña final.
 * @returns {string} La contraseña generada o una cadena vacía si los parámetros son inválidos.
 */
export function generatePassword(pool, length) {
  // Validación de seguridad de entrada
  if (length <= 0 || !pool) {
    return "";
  }

  let result = "";

  // Selección aleatoria posición por posición
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    result += pool[randomIndex];
  }

  return result;
}

/*
 * Calcula el nivel de seguridad y la categoría de fortaleza de la contraseña.
 * 
 * Modelo de puntuación (Score de 0 a 5):
 * - Base por longitud: <7 (0 ptos), 7-10 (1 pto), 11-14 (2 ptos), >=15 (3 ptos).
 * - Bonus por diversidad: 2-3 tipos de caracteres (+1 pto), 4 tipos (+2 ptos).
 * 
 * @param {OpcionesGeneracion} options - Tipos de caracteres seleccionados.
 * @param {number} length - Longitud total configurada para la contraseña.
 * @returns {{ score: number, rating: ('Muy Débil'|'Débil'|'Media'|'Fuerte') }} 
 * Objeto con el puntaje numérico (0 a 5) y la etiqueta descriptiva.
 */
export function calculateStrength(options, length) {
  // Contar la cantidad de conjuntos de caracteres activos
  const selectedTypes = [
    options.uppercase,
    options.lowercase,
    options.numbers,
    options.symbols,
  ].filter((t) => t).length;

  // Aplicar reglas duras de seguridad
  if (length < 7 || selectedTypes === 0) {
    return { score: 0, rating: "Muy Débil" };
  }

  // Asignar puntuación base según las bandas de longitud
  let lengthBase = 0;
  if (length >= 15) {
    lengthBase = 3;
  } else if (length >= 11) {
    lengthBase = 2;
  } else if (length >= 7) {
    lengthBase = 1;
  }

  // Calcular el bono adicional según la diversidad de caracteres (0 a 2 puntos)
  const diversityBonus = (selectedTypes >= 2 ? 1 : 0) + (selectedTypes >= 4 ? 1 : 0);

  // Consolidar la puntuación final
  const score = lengthBase + diversityBonus;

  // Mapear la puntuación a la escala cualitativa de fortaleza
  let rating;
  if (score <= 0) {
    rating = "Muy Débil";
  } else if (score <= 2) {
    rating = "Débil";
  } else if (score === 3) {
    rating = "Media";
  } else {
    rating = "Fuerte";
  }

  return { score, rating };
}