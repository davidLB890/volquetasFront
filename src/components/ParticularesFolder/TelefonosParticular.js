import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button, Dropdown } from "react-bootstrap";
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
<ul className="list-unstyled">
  {telefonos.length > 0 ? (
    telefonos.map((telefono) => (
      <li
        key={telefono.id}
        className="d-flex align-items-center mb-2"
      >
        <span className="me-3">
          {telefono?.tipo && telefono?.telefono ? (
            `${telefono.tipo}: ${telefono.telefono}${
              telefono.extension ? ` (Ext: ${telefono.extension})` : ""
            }`
          ) : (
            "Información de teléfono no disponible"
          )}
        </span>
        <div className="btn-group">
          <Dropdown>
            <Dropdown.Toggle variant="light" size="sm" className="mt-3">
              <i className="bi bi-three-dots-vertical"></i>  {/* Ícono de menú */}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleShowModal(telefono)}>
                <i className="bi bi-pencil me-2"></i> Editar
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleShowConfirmDelete(telefono.id)}>
                <i className="bi bi-trash me-2"></i> Eliminar
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
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
