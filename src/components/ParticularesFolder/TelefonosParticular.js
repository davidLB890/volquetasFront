import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const TelefonosParticular = ({ telefonos = [] }) => {
  const [telefonosList, setTelefonosList] = useState(telefonos);

  useEffect(() => {
    setTelefonosList(telefonos);
  }, [telefonos]);

  return (
    <div>
      <ul>
        {telefonosList.length > 0 ? (
          telefonosList.map((telefono) => (
            <li key={telefono.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>
                {telefono?.tipo && telefono?.telefono ? (
                  `${telefono.tipo}: ${telefono.telefono}${
                    telefono.extension ? ` (Ext: ${telefono.extension})` : ""
                  }`
                ) : (
                  "Información de teléfono no disponible"
                )}
              </span>
            </li>
          ))
        ) : (
          <li>No tiene teléfonos registrados</li>
        )}
      </ul>
    </div>
  );
};

export default TelefonosParticular;
