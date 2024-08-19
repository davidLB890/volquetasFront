import React, { useState } from "react";
import { Card, Collapse, Button, Row, Col, ListGroup, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createTelefonoSuccess, modifyTelefonoSuccess, deleteContactoSuccess, modifyContactoSuccess, deleteTelefonoSuccess } from "../../features/empresaSlice";
import AgregarTelefono from "../TelefonosFolder/AgregarTelefono"; // Ajusta la ruta según sea necesario
import ModificarTelefono from "../TelefonosFolder/ModificarTelefonos"; // Ajusta la ruta según sea necesario
import ModificarContactoEmpresa from "./ModificarContactoEmpresa"; // Ajusta la ruta según sea necesario
import { deleteContactoEmpresa, deleteTelefono } from "../../api"; // Importa tu función para eliminar contactos
import useAuth from "../../hooks/useAuth"; // Importa tu hook para obtener el token

const ContactosEmpresa = () => {
  const [expandedContactId, setExpandedContactId] = useState(null);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showModificarModal, setShowModificarModal] = useState(false);
  const [showModificarContactoModal, setShowModificarContactoModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentContactId, setCurrentContactId] = useState(null);
  const [telefonoActual, setTelefonoActual] = useState(null);
  const [contactoActual, setContactoActual] = useState(null);
  const [telefonoIdToDelete, setTelefonoIdToDelete] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const dispatch = useDispatch();
  const contactos = useSelector((state) => state.empresa.contactos); // Obtén los contactos del estado de Redux
  const getToken = useAuth();
  console.log(contactos);

  const toggleExpandContact = (contactId) => {
    setExpandedContactId(expandedContactId === contactId ? null : contactId);
  };

  const handleShowAgregarModal = (contactId) => {
    setCurrentContactId(contactId);
    setShowAgregarModal(true);
  };

  const handleHideAgregarModal = () => {
    setShowAgregarModal(false);
    setCurrentContactId(null);
  };

  const handleShowModificarModal = (telefono) => {
    setTelefonoActual(telefono);
    setShowModificarModal(true);
  };

  const handleHideModificarModal = () => {
    setShowModificarModal(false);
    setTelefonoActual(null);
  };

  const handleShowConfirmModal = (contactId) => {
    setCurrentContactId(contactId);
    setShowConfirmModal(true);
  };

  const handleHideConfirmModal = () => {
    setShowConfirmModal(false);
    setCurrentContactId(null);
  };

  const handleShowModificarContactoModal = (contacto) => {
    setContactoActual(contacto);
    setShowModificarContactoModal(true);
  };

  const handleHideModificarContactoModal = () => {
    setShowModificarContactoModal(false);
    setContactoActual(null);
  };

  const handleConfirmEliminar = async () => {
    const usuarioToken = getToken();
    try {
      await deleteContactoEmpresa(currentContactId, usuarioToken);
      dispatch(deleteContactoSuccess(currentContactId));
      handleHideConfirmModal();
    } catch (error) {
      console.error("Error al eliminar el contacto:", error);
    }
  };

  const handleTelefonoAgregado = (contactoEmpresa) => {
    const tel = {
      id: contactoEmpresa.nuevoTelefono.id,
      tipo: contactoEmpresa.nuevoTelefono.tipo,
      telefono: contactoEmpresa.nuevoTelefono.telefono,
      extension: contactoEmpresa.nuevoTelefono.extension,
    };
    const telefonoPayload = {
      contactId: contactoEmpresa.nuevoTelefono.contactoEmpresaId,
      telefono: tel,
    };
    dispatch(createTelefonoSuccess(telefonoPayload));
  };

  const handleTelefonoModificado = (telefonoModificado) => {
    const tel = {
      id: telefonoModificado.id,
      tipo: telefonoModificado.tipo,
      telefono: telefonoModificado.telefono,
      extension: telefonoModificado.extension,
    };
    const telPayload = {
      contactId: telefonoModificado.contactoEmpresaId,
      telefono: tel,
    };
    dispatch(modifyTelefonoSuccess(telPayload));
  };

  //Delete telefono

  const handleContactoModificado = (contactoModificado) => {
    dispatch(modifyContactoSuccess(contactoModificado));
    handleHideModificarContactoModal();
  };

  const handleShowConfirmDelete = (telefonoId, contactId) => {
    setTelefonoIdToDelete(telefonoId);
    setCurrentContactId(contactId);
    setShowConfirmDelete(true);
  };

  const handleHideConfirmDelete = () => {
    setShowConfirmDelete(false);
    setTelefonoIdToDelete(null);
  };

  const handleConfirmEliminarTelefono = async () => {
    try {
      const usuarioToken = getToken();
      await deleteTelefono(telefonoIdToDelete, usuarioToken);
      dispatch(deleteTelefonoSuccess({ 
        telefonoId: telefonoIdToDelete, 
        contactId: currentContactId 
      }));
      handleHideConfirmDelete();
    } catch (error) {
      console.error("Error al eliminar el teléfono:", error);
    }
  };

  return (
    <div>
      {contactos.map((contacto) => (
        <Card key={contacto.id} className="mb-3">
          <Card.Header
            onClick={() => toggleExpandContact(contacto.id)}
            style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            {contacto.nombre}
          </Card.Header>
          <Collapse in={expandedContactId === contacto.id}>
            <Card.Body>
              <Row>
                <Col>
                  <Card.Text>
                    <strong>Email:</strong> {contacto.email}
                  </Card.Text>
                  <Card.Text>
                    <strong>Descripción:</strong> {contacto.descripcion}
                  </Card.Text>
                  <Button
                    variant="danger"
                    onClick={() => handleShowConfirmModal(contacto.id)}
                    className="mb-2 mb-md-0 me-md-2"
                    style={{
                      padding: "0.5rem 1rem",
                    }}
                  >
                    Eliminar Contacto
                  </Button>
                  <Button
                    className="mb-2 mb-md-0 me-md-2"
                    style={{
                      padding: "0.5rem 1rem",
                    }}
                    variant="warning"
                    onClick={(e) => {
                      e.stopPropagation(); // Evitar que se colapse el card al hacer click en el botón
                      handleShowModificarContactoModal(contacto);
                    }}
                  >
                    Modificar Contacto
                  </Button>
                </Col>
                <Col>
                  <Card.Text>
                    <strong>Teléfonos:</strong>
                  </Card.Text>
                  <ListGroup>
                    {contacto?.Telefonos && contacto?.Telefonos.length > 0 ? (
                      contacto.Telefonos.map((telefono) => (
                        <ListGroup.Item key={telefono.id}>
                          {telefono.tipo}: {telefono.telefono}
                          {telefono.extension
                            ? ` (Ext: ${telefono.extension})`
                            : ""}
                          <Button
                            variant="secondary"
                            onClick={() => handleShowModificarModal(telefono)}
                            className="ml-2"
                          >
                            Modificar
                          </Button>
                          <Button
                              variant="danger"
                              onClick={() =>
                                handleShowConfirmDelete(telefono.id, contacto.id)
                              }
                            >
                              Eliminar
                            </Button>
                        </ListGroup.Item>
                      ))
                    ) : (
                      <ListGroup.Item>
                        No tiene teléfonos registrados
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                  <Button
                    variant="primary"
                    onClick={() => handleShowAgregarModal(contacto.id)}
                  >
                    Agregar Teléfono
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Collapse>
        </Card>
      ))}
      <AgregarTelefono
        show={showAgregarModal}
        onHide={handleHideAgregarModal}
        contactoEmpresaId={currentContactId}
        onTelefonoAgregado={handleTelefonoAgregado}
      />
      {telefonoActual && (
        <ModificarTelefono
          show={showModificarModal}
          onHide={handleHideModificarModal}
          telefonoActual={telefonoActual}
          onTelefonoModificado={handleTelefonoModificado}
        />
      )}
      {contactoActual && (
        <ModificarContactoEmpresa
          show={showModificarContactoModal}
          onHide={handleHideModificarContactoModal}
          contactoId={contactoActual.id}
          onSuccess={handleContactoModificado}
        />
      )}
      <Modal show={showConfirmModal} onHide={handleHideConfirmModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar este contacto?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleHideConfirmModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmEliminar}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

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
          <Button variant="danger" onClick={handleConfirmEliminarTelefono}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ContactosEmpresa;