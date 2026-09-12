/* Visualiza la seguridad de la contraseña generada mediante un indicador dinámico de barra de progreso y una etiqueta descriptiva según el puntaje.
 *
 * Principios visuales y de estado:
 * - Evalúa un score recibido por propiedades.
 * - Mapea el puntaje contra umbrales predefinidos usando variables CSS globales.
 * - Renderiza la barra con un porcentaje de ancho proporcional e interactivo.
 */

import React from 'react';


const StrengthMeter = ({ score }) => {
  
  // CONFIGURACIÓN DE NIVELES Y VARIABLES VISUALES
  
  const ratings = [
    { label: "Muy Débil", color: "var(--color-very-weak)", threshold: 0 },
    { label: "Débil",     color: "var(--color-weak)",      threshold: 1 },
    { label: "Media",     color: "var(--color-medium)",    threshold: 2 },
    { label: "Fuerte",    color: "var(--color-strong)",    threshold: 3 },
  ];

  
  // LÓGICA DE CLASIFICACIÓN Y SELECCIÓN DE NIVEL
  
  // Se inicializa con el nivel por defecto más bajo ("Muy Débil")
  let rating = ratings[0];

  // Se recorren las clasificaciones de mayor a menor umbral para asignar la categoría MÁS ALTA que el puntaje del usuario satisface.
  for (let i = ratings.length - 1; i >= 0; i--) {
    if (score >= ratings[i].threshold) {
      rating = ratings[i];
      break; 
    }
  }


  return (
    <div className="strength-meter">
      <span className="strength-label">{rating.label}</span>

      {/* Barra de nivel dinámica:
        - Ancho: Se multiplica el puntaje por 20% para escalar la longitud (ej: score 4 = 80%).
        - Color: Aplica la variable cromática correspondiente a la categoría activa.
      */}
      <div 
        className="strength-bar" 
        style={{ 
          width: `${score * 20}%`, 
          backgroundColor: rating.color 
        }} 
      />
    </div>
  );
};

export default StrengthMeter;