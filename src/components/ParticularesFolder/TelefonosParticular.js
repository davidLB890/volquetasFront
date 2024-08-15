import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import ModificarTelefono from "../TelefonosFolder/ModificarTelefonos";
import { modifyTelefonoSuccess, deleteTelefonoSuccess } from "../../features/particularSlice";
import { deleteTelefono } from "../../api";
import useAuth from "../../hooks/useAuth"; // Importa el hook de autenticación

const TelefonosParticular = () => {
  const telefonos = useSelector(
    (state) => state.particular.particular?.Telefonos || []
  );
  const dispatch = useDispatch();
  const getToken = useAuth(); // Usa el hook de autenticación para obtener el token
  const [showModal, setShowModal] = useState(false);
  const [telefonoActual, setTelefonoActual] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [telefonoIdToDelete, setTelefonoIdToDelete] = useState(null); // Para almacenar el teléfono a eliminar

  const handleShowModal = (telefono) => {
    setTelefonoActual(telefono);
    setShowModal(true);
  };

  const handleHideModal = () => {
    setShowModal(false);
    setTelefonoActual(null);
  };

  const handleTelefonoModificado = (telefonoModificado) => {
    dispatch(modifyTelefonoSuccess(telefonoModificado));
    handleHideModal(); // Cerrar el modal después de la modificación
  };

  const handleShowConfirmDelete = (telefonoId) => {
    setTelefonoIdToDelete(telefonoId);
    setShowConfirmDelete(true);
  };

  const handleConfirmEliminar = async () => {
    try {
      const token = getToken(); // Obtén el token de autenticación
      await deleteTelefono(telefonoIdToDelete, token); // Pasa el token a la función deleteTelefono
      dispatch(deleteTelefonoSuccess(telefonoIdToDelete));
      setShowConfirmDelete(false); // Cerrar el modal de confirmación después de eliminar
    } catch (error) {
      console.error("Error al eliminar el teléfono:", error);
    }
  };

  return (
    <div>
      <ul>
        {telefonos.length > 0 ? (
          telefonos.map((telefono) => (
            <li
              key={telefono.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>
                {telefono?.tipo && telefono?.telefono ? (
                  `${telefono.tipo}: ${telefono.telefono}${
                    telefono.extension ? ` (Ext: ${telefono.extension})` : ""
                  }`
                ) : (
                  "Información de teléfono no disponible"
                )}
              </span>
              <button
                className="btn btn-sm btn-warning"
                onClick={() => handleShowModal(telefono)}
              >
                Editar
              </button>
              {/* <button
                className="btn btn-sm btn-danger"
                onClick={() => handleShowConfirmDelete(telefono.id)}
              >
                Eliminar
              </button> */}
            </li>
          ))
        ) : (
          <li>No tiene teléfonos registrados</li>
        )}
      </ul>

      <ModificarTelefono
        show={showModal}
        onHide={handleHideModal}
        telefonoActual={telefonoActual}
        onTelefonoModificado={handleTelefonoModificado}
      />

      <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar este teléfono? Esta acción no se
          puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmEliminar}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TelefonosParticular;
