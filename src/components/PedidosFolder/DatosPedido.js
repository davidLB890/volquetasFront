import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Spinner, Alert, Form, Container, Row, Col, Card, Button } from "react-bootstrap";
import DatosObra from "../ObrasFolder/DatosObra";

const DatosPedido = () => {
  const location = useLocation();
  const pedido = location.state?.pedido;
  const [error, setError] = useState("");
  const [mostrarObra, setMostrarObra] = useState(false); // Estado para controlar el despliegue de DatosObra
  const navigate = useNavigate();

  const handleNavigateToEmpresa = (empresaId) => {
    navigate("/empresas/datos", { state: { empresaId, fromPedido: true } });
  };

  const handleNavigateToParticular = (particularId) => {
    navigate("/particulares/datos", { state: { particularId, fromPedido: true } });
  };

  const handleToggleObra = () => {
    setMostrarObra(!mostrarObra);
  };

  if (!pedido) {
    return (
      <Alert variant="danger">No se encontraron detalles del pedido.</Alert>
    );
  }

  return (
    <Container>
      <Card className="mt-3">
        <Card.Header>
          <h1>Detalles del Pedido</h1>
        </Card.Header>

        <Card.Body>
          <Row>
            <Col>
              <p>
                <strong>Estado:</strong> {pedido.estado}
              </p>
              <p>
                <strong>Descripción:</strong> {pedido.descripcion}
              </p>
              <p>
                <strong>Creado Como:</strong> {pedido.creadoComo}
              </p>
              <p>
                <strong>Cliente:</strong>{" "}
                {pedido.Obra.particular ? (
                  <span
                    className="link-primary"
                    onClick={() => handleNavigateToParticular(pedido.Obra.particular.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {pedido.Obra.particular.nombre}
                  </span>
                ) : (
                  <span
                    className="link-primary"
                    onClick={() => handleNavigateToEmpresa(pedido.Obra.empresa.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {pedido.Obra.empresa.nombre}
                  </span>
                )}
              </p>
              <p>
                <strong>Obra:</strong>{" "}
                <span
                  className="link-primary"
                  onClick={handleToggleObra}
                  style={{ cursor: 'pointer' }}
                >
                  {pedido.Obra.calle}
                </span>
              </p>
              <p>
                <strong>Horario Sugerido:</strong>{" "}
                {new Date(pedido.Sugerencias[0].horarioSugerido).toLocaleString()}
              </p>
              <Form.Group controlId="formPago">
                <Form.Check
                  type="checkbox"
                  label="Pago"
                  checked={pedido.pagoPedido.pagado}
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      {mostrarObra && <DatosObra obraId={pedido.Obra.id} />}
    </Container>
  );
};

export default DatosPedido;
