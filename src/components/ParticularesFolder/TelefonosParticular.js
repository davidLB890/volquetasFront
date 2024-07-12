import React, { useState, useEffect } from "react";
import { Card, ListGroup, Button, Collapse, Row, Col } from "react-bootstrap";
import AgregarTelefono from "../TelefonosFolder/AgregarTelefono";

const TelefonosParticular = ({ telefonos = [], particularId, nombre }) => {
  const [showAgregarTelefono, setShowAgregarTelefono] = useState(false);
  const [telefonosList, setTelefonosList] = useState(telefonos);

  useEffect(() => {
    setTelefonosList(telefonos);
  }, [telefonos]);

  const handleShowAgregarTelefono = () => {
    setShowAgregarTelefono(true);
  };

  const handleHideAgregarTelefono = () => {
    setShowAgregarTelefono(false);
  };

  const handleTelefonoAgregado = (nuevoTelefono) => {
    setTelefonosList((prevTelefonosList) => [...prevTelefonosList, nuevoTelefono.nuevoTelefono]);
    handleHideAgregarTelefono();
  };

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
      <Button variant="primary" onClick={handleShowAgregarTelefono}>
        Agregar Teléfono
      </Button>
      <AgregarTelefono
        show={showAgregarTelefono}
        onHide={handleHideAgregarTelefono}
        particularId={particularId}
        nombre={nombre}
        onTelefonoAgregado={handleTelefonoAgregado}
      />
    </div>
  );
};

export default TelefonosParticular;
