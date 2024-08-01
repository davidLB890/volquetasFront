import React from "react";
import { useSelector } from "react-redux";

const TelefonosParticular = () => {
  const telefonos = useSelector((state) => state.particular.particular?.Telefonos || []);

  return (
    <div>
      <ul>
        {telefonos.length > 0 ? (
          telefonos.map((telefono) => (
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
