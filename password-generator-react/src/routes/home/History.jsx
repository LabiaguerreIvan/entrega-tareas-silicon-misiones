const History = ({ passwords }) => {
  return (
    <div className="history">
      <h3>Historial</h3>
      {passwords.length === 0 ? (
        <p>No hay contraseñas generadas</p>
      ) : (
        <ul>
          {passwords.map((pwd, index) => (
            <li key={index}>{pwd}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default History