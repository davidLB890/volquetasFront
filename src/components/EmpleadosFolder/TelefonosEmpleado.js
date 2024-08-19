import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import ModificarTelefono from "../TelefonosFolder/ModificarTelefonos"; // Ajusta la ruta según sea necesario
import AgregarTelefono from "../TelefonosFolder/AgregarTelefono";
import { deleteTelefono } from "../../api"; // Ajusta la ruta según sea necesario
import useAuth from "../../hooks/useAuth";

const TelefonosEmpleado = ({ telefonos = [], empleadoId, nombre }) => {
  const [showModificarModal, setShowModificarModal] = useState(false);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [telefonoActual, setTelefonoActual] = useState(null);
  const [telefonosList, setTelefonosList] = useState(telefonos);
  const [telefonoIdToDelete, setTelefonoIdToDelete] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const getToken = useAuth();

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
    setTelefonosList((prevTelefonosList) => [
      ...prevTelefonosList,
      nuevoTelefono.nuevoTelefono,
    ]);
    handleHideAgregarModal();
  };

  const handleConfirmEliminarTelefono = (telefonoId) => {
    setTelefonoIdToDelete(telefonoId);
    setShowConfirmDelete(true);
  };

  const handleHideConfirmDelete = () => {
    setShowConfirmDelete(false);
    setTelefonoIdToDelete(null);
  };

  const handleEliminarTelefono = async () => {
    const usuarioToken = getToken();
    try {
      await deleteTelefono(telefonoIdToDelete, usuarioToken);
      setTelefonosList((prevTelefonosList) =>
        prevTelefonosList.filter((telefono) => telefono.id !== telefonoIdToDelete)
      );
      handleHideConfirmDelete();
    } catch (error) {
      console.error("Error al eliminar el teléfono:", error);
    }
  };

  return (
    <div>
      <ul>
        {telefonosList.length > 0 ? (
          telefonosList.map((telefono) => (
            <li
              key={telefono.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px", // Añadir espacio entre elementos
              }}
            >
              <Button
                variant="secondary"
                onClick={() => handleShowModificarModal(telefono)}
                style={{ marginRight: "8px" }} // Añadir espacio entre el botón y el texto
              >
                Modificar número
              </Button>
              <Button
                variant="danger"
                onClick={() => handleConfirmEliminarTelefono(telefono.id)}
                style={{ marginRight: "8px" }} // Añadir espacio entre los botones
              >
                Eliminar
              </Button>
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
        empleadoId={empleadoId}
        nombre={nombre}
        onTelefonoAgregado={handleTelefonoAgregado}
      />
            <Modal show={showConfirmDelete} onHide={handleHideConfirmDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar este teléfono? Esta acción no se
          puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleHideConfirmDelete}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleEliminarTelefono}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TelefonosEmpleado;
