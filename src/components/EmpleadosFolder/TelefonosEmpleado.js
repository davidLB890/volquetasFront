const TelefonosEmpleado = ({ telefonos }) => {
    return (
      <div>
        <ul>
          {telefonos.length > 0 ? (
            telefonos.map((telefono) => (
              <li key={telefono.id}>
                {`${telefono.tipo}: ${telefono.telefono} (Ext: ${telefono.extension})`}
              </li>
            ))
          ) : (
            <li>No tiene teléfonos registrados</li>
          )}
        </ul>
      </div>
    );
  };
  
  export default TelefonosEmpleado;
  