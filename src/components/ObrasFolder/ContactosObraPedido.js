import React, { useEffect, useState } from "react";
import { Spinner, Alert, Container, Dropdown, DropdownButton, Col, Row, Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import AgregarTelefono from "../TelefonosFolder/AgregarTelefono";
import useAuth from "../../hooks/useAuth";
import { getContactoEmpresa } from "../../api";
import { addTelefonoToObra, addContactoSuccess } from "../../features/pedidoSlice";
import SeleccionarOAgregarContacto from "../EmpresasFolder/SeleccionarOAgregarContacto";
import AgregarContactoEmpresa from "../EmpresasFolder/AgregarContactoEmpresa";
import { getEmpresaId } from "../../api";

const ContactosObraPedido = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contactosEmpresa, setContactosEmpresa] = useState([]);

  const [showAgregarTelefonoModal, setShowAgregarTelefonoModal] = useState(false);
  const [showSeleccionModal, setShowSeleccionModal] = useState(false);
  const [showAgregarContactoModal, setShowAgregarContactoModal] = useState(false);
  const [showSeleccionarContactoModal, setShowSeleccionarContactoModal] = useState(false);
  const [isNuevoContacto, setIsNuevoContacto] = useState(false);

  const navigate = useNavigate();
  const { obra, pedido } = useSelector((state) => state.pedido);
  const dispatch = useDispatch();
  const getToken = useAuth();

  useEffect(() => {
    setLoading(false);
  }, []);

  const fetchContactosEmpresa = async () => {
    try {
      const usuarioToken = getToken();
      const response = await getEmpresaId(obra.empresaId, usuarioToken); // Obtén los contactos
      setContactosEmpresa(response.data.contactos); // Guarda los contactos en el estado
    } catch (error) {
      setError("Error al obtener los contactos de la empresa.");
    }
  };

  const handleNavigateToEmpresa = (empresaId) => {
    navigate("/empresas/datos", { state: { empresaId, fromPedido: true } });
  };

  const handleNavigateToParticular = (particularId) => {
    navigate("/particulares/datos", { state: { particularId, fromPedido: true } });
  };

  const handleContactoSeleccionado = (contacto) => {
    dispatch(addContactoSuccess(contacto));  // Despacha la acción para agregar el contacto a la lista de contactosDesignados
    setShowSeleccionarContactoModal(false);
  };

  const handleSeleccion = (esNuevo) => {
    setIsNuevoContacto(esNuevo);
    setShowSeleccionModal(false);
    if (esNuevo) {
      setShowAgregarContactoModal(true);
    } else {
      setShowSeleccionarContactoModal(true);
      fetchContactosEmpresa();
    }
  };

  const handleAgregarContacto = (nuevoContacto) => {
    setShowAgregarContactoModal(false);
    // Lógica adicional para manejar el contacto agregado
  };

  const handleTelefonoAgregado = (nuevoTelefono) => {
    dispatch(addTelefonoToObra(nuevoTelefono.nuevoTelefono));  // Despacha la acción para agregar el teléfono a la obra
    setShowAgregarTelefonoModal(false);  // Cierra el modal después de agregar el teléfono
  };

  const renderParticularInfo = () => {
    return (
      <>
        <DropdownButton id="dropdown-particular" title="Contactos" variant="light">
          {obra?.particular?.Telefonos?.length > 0 ? (
            obra.particular.Telefonos.map((tel, index) => (
              <Dropdown.Item key={index}>
                {tel.tipo}: {tel.telefono} {tel.extension ? `Ext: ${tel.extension}` : ""}
              </Dropdown.Item>
            ))
          ) : (
            <Dropdown.Item disabled>No hay contactos disponibles</Dropdown.Item>
          )}
          <Dropdown.Item onClick={() => setShowAgregarTelefonoModal(true)}>Agregar Nuevo Teléfono</Dropdown.Item>
        </DropdownButton>

        <AgregarTelefono
          show={showAgregarTelefonoModal}
          onHide={() => setShowAgregarTelefonoModal(false)}
          particularId={obra?.particularId}  // Pasar el ID del particular
          nombre={obra?.particular?.nombre || ""}
          onTelefonoAgregado={handleTelefonoAgregado}
        />
      </>
    );
  };

  const renderContactosDesignados = () => {
    return (
      <>
        <DropdownButton id="dropdown-contactos-designados" title="Contactos de obra" variant="light">
        {Array.isArray(obra?.contactosDesignados) && obra.contactosDesignados.length > 0 ? (
  obra.contactosDesignados.map((contacto) => (
    <Dropdown.Item key={contacto.id}>
      {contacto?.nombre} - {contacto?.Telefonos?.[0]?.telefono || 'Sin teléfono'}
    </Dropdown.Item>
  ))
) : (
  <Dropdown.Item disabled>No hay contactos disponibles</Dropdown.Item>
)}

          <Dropdown.Item onClick={() => setShowSeleccionModal(true)}>Agregar Nuevo Contacto</Dropdown.Item>
        </DropdownButton>

        {/* Modal para elegir entre agregar nuevo contacto o seleccionar existente */}
        <Modal show={showSeleccionModal} onHide={() => setShowSeleccionModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Seleccionar Tipo de Contacto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>¿Desea agregar un contacto nuevo o seleccionar uno existente?</p>
            <Button variant="primary" onClick={() => handleSeleccion(false)}>
              Seleccionar Contacto Existente
            </Button>
            <Button variant="success" onClick={() => handleSeleccion(true)} className="ml-2">
              Agregar Contacto Nuevo
            </Button>
          </Modal.Body>
        </Modal>

        {/* Modal para Agregar Contacto Nuevo */}
        <AgregarContactoEmpresa
          show={showAgregarContactoModal}
          onHide={() => setShowAgregarContactoModal(false)}
          empresaId={obra?.empresaId}
          obras={obra ? [obra] : []}
          obraId={obra?.id}
          onContactoAgregado={handleAgregarContacto}
        />

        {/* Modal para Seleccionar Contacto Existente */}
        <Modal show={showSeleccionarContactoModal} onHide={() => setShowSeleccionarContactoModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Seleccionar Contacto Existente</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <SeleccionarOAgregarContacto
              empresa={{ contactos: contactosEmpresa }}
              obraId={obra?.id}
              onContactoSeleccionado={handleContactoSeleccionado}
            />
          </Modal.Body>
        </Modal>
      </>
    );
  };

  const cliente = pedido.Obra.particular ? { particular: pedido.Obra.particular } : { empresa: pedido.Obra.empresa };

  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Cargando...</span>
      </Spinner>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container>
      <Row className="align-items-center">
        <Col md={6}>
          <p className="mb-0">
            <strong>Cliente:</strong>{" "}
            {cliente.particular ? (
              <span className="link-primary" onClick={() => handleNavigateToParticular(cliente.particular.id)} style={{ cursor: "pointer" }}>
                {cliente.particular?.nombre}
              </span>
            ) : (
              <span className="link-primary" onClick={() => handleNavigateToEmpresa(cliente.empresa.id)} style={{ cursor: "pointer" }}>
                {cliente.empresa?.nombre}
              </span>
            )}
          </p>
        </Col>
        <Col md={6} className="d-flex justify-content-end">
          {obra?.particular ? (
            renderParticularInfo()
          ) : cliente.empresa ? (
            renderContactosDesignados()
          ) : (
            <Alert variant="info" className="mb-0">
              No hay información de contacto disponible.
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ContactosObraPedido;
