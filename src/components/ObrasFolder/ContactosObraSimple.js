/* import React, { useEffect, useState } from "react";
import { Card, Spinner, Alert, Table, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ContactosObraSimple = ({ obra, cliente }) => {
  console.log(obra);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Simulamos una llamada a la API
    setLoading(false);
  }, []);

  const handleNavigateToEmpresa = (empresaId) => {
    navigate("/empresas/datos", { state: { empresaId, fromPedido: true } });
  };

  const handleNavigateToParticular = (particularId) => {
    navigate("/particulares/datos", {
      state: { particularId, fromPedido: true },
    });
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
      <Table striped bordered hover responsive size="sm">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Teléfono</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{obra.particular.nombre}</td>
            <td>
              {obra.particular.Telefonos.map((tel, index) => (
                <div key={index}>
                  {tel.tipo}: {tel.telefono}{" "}
                  {tel.extension ? `Ext: ${tel.extension}` : ""}
                </div>
              ))}
            </td>
          </tr>
        </tbody>
      </Table>
    );
  };

  const renderContactosDesignados = () => {
    return (
      <Table striped bordered hover responsive size="sm">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Teléfono</th>
          </tr>
        </thead>
        <tbody>
          {obra.contactosDesignados.map((contacto) => (
            <tr key={contacto.id}>
              <td>{contacto.nombre}</td>
              <td>
                {contacto.Telefonos.map((tel, index) => (
                  <div key={index}>
                    {tel.tipo}: {tel.telefono}{" "}
                    {tel.extension ? `Ext: ${tel.extension}` : ""}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <Container>
      <Card className="mt-3">
        <Card.Header>
          <Card.Title>Contactos</Card.Title>
          <p>(Para modificar u obtener más detalles diríjase a la empresa)</p>
        </Card.Header>
        <Card.Body>
          <p>
            <strong>Cliente:</strong>{" "}
            {cliente.particular ? (
              <span
                className="link-primary"
                onClick={() =>
                  handleNavigateToParticular(cliente.particular.id)
                }
                style={{ cursor: "pointer" }}
              >
                {cliente.particular.nombre}
              </span>
            ) : (
              <span
                className="link-primary"
                onClick={() => handleNavigateToEmpresa(cliente.empresa.id)}
                style={{ cursor: "pointer" }}
              >
                {cliente.empresa.nombre}
              </span>
            )}
          </p>
          {obra.particular ? (
            renderParticularInfo()
          ) : obra.empresa ? (
            obra.contactosDesignados.length > 0 ? (
              renderContactosDesignados()
            ) : (
              <Alert variant="info">
                No hay contactos designados para esta obra.
              </Alert>
            )
          ) : (
            <Alert variant="info">
              No hay información de contacto disponible.
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ContactosObraSimple;
 */