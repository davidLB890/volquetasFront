import React, { useEffect, useState } from "react";
import { Card, Spinner, Alert, Container, Dropdown, DropdownButton, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ContactosObraPedido = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { obra, pedido } = useSelector((state) => state.pedido);

  useEffect(() => {
    // Simulamos una llamada a la API
    setLoading(false);
  }, []);

  const handleNavigateToEmpresa = (empresaId) => {
    navigate("/empresas/datos", { state: { empresaId, fromPedido: true } });
  };

  const handleNavigateToParticular = (particularId) => {
    navigate("/particulares/datos", { state: { particularId, fromPedido: true } });
  };

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

  const renderParticularInfo = () => {
    return (
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
      </DropdownButton>
    );
  };

  const renderContactosDesignados = () => {
    return (
      <DropdownButton id="dropdown-contactos-designados" title="Contactos de obra" variant="light">
        {obra?.contactosDesignados?.length > 0 ? (
          obra.contactosDesignados.map((contacto) => (
            <Dropdown.Item key={contacto.id}>
              {contacto?.nombre} - {contacto.Telefonos[0]?.telefono}
            </Dropdown.Item>
          ))
        ) : (
          <Dropdown.Item disabled>No hay contactos disponibles</Dropdown.Item>
        )}
      </DropdownButton>
    );
  };

  const cliente = pedido.Obra.particular ? { particular: pedido.Obra.particular } : { empresa: pedido.Obra.empresa };

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
