import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import ModificarTelefono from "../TelefonosFolder/ModificarTelefonos"; // Adjust the path as necessary
import AgregarTelefono from "../TelefonosFolder/AgregarTelefono";

const TelefonosContactoEmpresa = ({ telefonos = [], contactoEmpresaId, nombre }) => {
  const [showModificarModal, setShowModificarModal] = useState(false);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [telefonoActual, setTelefonoActual] = useState(null);
  const [telefonosList, setTelefonosList] = useState(telefonos);

  useEffect(() => {
    setTelefonosList(telefonos);
  }, [telefonos]);

  const handleShowModificarModal = (telefono) => {
    setTelefonoActual(telefono);
    setShowModificarModal(true);
  };

  const handleHideModificarModal = () => {
    setShowModificarModal(false);
    setTelefonoActual(null);
  };

  const handleShowAgregarModal = () => {
    setShowAgregarModal(true);
  };

  const handleHideAgregarModal = () => {
    setShowAgregarModal(false);
  };

  const handleTelefonoModificado = (telefonoModificado) => {
    setTelefonosList((prevTelefonosList) =>
      prevTelefonosList.map((telefono) =>
        telefono.id === telefonoModificado.id ? telefonoModificado : telefono
      )
    );
    handleHideModificarModal();
  };

  const handleTelefonoAgregado = (nuevoTelefono) => {
    setTelefonosList((prevTelefonosList) => [...prevTelefonosList, nuevoTelefono.nuevoTelefono]);
    handleHideAgregarModal();
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
              <Button
                variant="secondary"
                onClick={() => handleShowModificarModal(telefono)}
              >
                Modificar
              </Button>
            </li>
          ))
        ) : (
          <li>No tiene teléfonos registrados</li>
        )}
      </ul>
      <Button variant="primary" onClick={handleShowAgregarModal}>
        Agregar Teléfono
      </Button>
      {telefonoActual && (
        <ModificarTelefono
          show={showModificarModal}
          onHide={handleHideModificarModal}
          telefonoActual={telefonoActual}
          onTelefonoModificado={handleTelefonoModificado}
        />
      )}
      <AgregarTelefono
        show={showAgregarModal}
        onHide={handleHideAgregarModal}
        contactoEmpresaId={contactoEmpresaId}
        nombre={nombre}
        onTelefonoAgregado={handleTelefonoAgregado}
      />
    </div>
  );
};

export default TelefonosContactoEmpresa;
