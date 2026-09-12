import React from 'react';

const History = ({ passwords }) => {
  return (
    <div className="history">
      <h3>Historial</h3>
      
      {/* Muestra un mensaje si no hay contraseñas en la lista */}
      {passwords.length === 0 ? (
        <p>No hay contraseñas generadas</p>
      ) : (
        /* Renderiza la lista de contraseñas si el arreglo contiene elementos */
        <ul>
          {passwords.map((pwd, index) => (
            <li key={index}>{pwd}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History;