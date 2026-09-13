
const textarea = document.querySelector("#texto");
const botonLimpiar = document.querySelector("#limpiar");
const valorPalabras = document.querySelector("#palabras");
const valorCaracteres = document.querySelector("#caracteres");
const valorSinEspacios = document.querySelector("#sin-espacios");
const valorRestantes = document.querySelector("#restantes");
const barraProgreso = document.querySelector("#barra-progreso");
const pistaProgreso = document.querySelector(".progreso__pista");
const LIMITE_CARACTERES = 280;


// Funciones de cálculo //
function calcularLongitudTotal(texto) {
  return texto.length;
}

function calcularPalabras(texto) {
  const normalizado = texto.trim();

  // Con texto vacío, split devuelve [""] y contaría 1 palabra.
  if (normalizado === "") {
    return 0;
  }

  return normalizado.split(/\s+/).length;
}

function calcularSinEspacios(texto) {
  return texto.replaceAll(" ", "").length;
}


// Actualización de la interfaz //
function actualizarContadores() {
  const texto = textarea.value;

  const total = calcularLongitudTotal(texto);
  const palabras = calcularPalabras(texto);
  const sinEspacios = calcularSinEspacios(texto);
  const restantes = LIMITE_CARACTERES - total;
  const porcentaje = Math.min(100, (total / LIMITE_CARACTERES) * 100);
  const excedido = total > LIMITE_CARACTERES;

  valorPalabras.textContent = palabras;
  valorCaracteres.textContent = total;
  valorSinEspacios.textContent = sinEspacios;
  valorRestantes.textContent = restantes;
  barraProgreso.style.width = `${porcentaje}%`;
  pistaProgreso.setAttribute("aria-valuenow", String(Math.round(porcentaje)));

  textarea.classList.toggle("excedido", excedido);
  valorRestantes.classList.toggle("excedido", excedido);
  barraProgreso.classList.toggle("excedido", excedido);
}

function limpiarTexto() {
  textarea.value = "";
  actualizarContadores();
  textarea.focus();
}


// Eventos //
textarea.addEventListener("input", actualizarContadores);
botonLimpiar.addEventListener("click", limpiarTexto);

// Inicialización
actualizarContadores();