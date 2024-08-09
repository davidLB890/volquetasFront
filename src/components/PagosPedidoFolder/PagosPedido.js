import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Modal, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updatePago } from "../../features/pedidoSlice";
import useAuth from "../../hooks/useAuth";
import AlertMessage from "../AlertMessage";
import ModificarPagoPedido from "./ModificarPagoPedido";
import { useMediaQuery } from "react-responsive";

const PagoPedido = () => {
  const dispatch = useDispatch();
  const getToken = useAuth();
  const pago = useSelector((state) => state.pedido.pedido.pagoPedido);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Media query para detectar si la pantalla es menor a md (768px)
  const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" });

  const handlePagadoChange = async () => {
    const usuarioToken = getToken();
    const nuevoEstadoPagado = !pago.pagado;

    try {
      await dispatch(
        updatePago({
          pago: { ...pago, pagado: nuevoEstadoPagado },
          usuarioToken,
        })
      ).unwrap();
      setSuccess("Estado de pago modificado correctamente");
      setError("");
      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (error) {
      console.error(
        "Error al modificar el estado de pago:",
        error.response?.data?.error || error.message
      );
      setError("Error al modificar el estado de pago");
      setSuccess("");
    }
  };

  const cardStyle = {
    backgroundColor: pago?.pagado ? "#d4edda" : "#f8d7da", // Verde claro o rojo claro
    borderColor: pago?.pagado ? "#c3e6cb" : "#f5c6cb", // Verde claro o rojo claro
  };

  const titleStyle = {
    color: pago?.pagado ? "#28a745" : "#dc3545", // Verde para pagado, rojo para no pagado
  };

  if (!pago) return null;

  return (
    <Container>
      {isSmallScreen ? (
        <div className="mt-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
            <h4 style={titleStyle}>Detalles de Pago</h4>
            <Button variant="secondary" onClick={() => setShowModal(true)}>
              Modificar
            </Button>
          </div>
          {error && <AlertMessage type="error" message={error} />}
          {success && <AlertMessage type="success" message={success} />}
          <Row>
            <Col xs={12} className="mb-3">
              <p><strong>Precio:</strong> ${pago.precio}</p>
              <Form.Check
                type="checkbox"
                label="Pagado"
                name="pagado"
                checked={pago.pagado}
                onChange={handlePagadoChange}
                inline
              />
              <p><strong>Remito:</strong> {pago.remito ? pago.remito : "No disponible"}</p>
            </Col>
            <Col xs={12}>
              <p><strong>Tipo de Pago:</strong> {pago.tipoPago}</p>
              <p><strong>Factura:</strong> {pago.facturaId ? pago.facturaId : "No disponible"}</p>
            </Col>
          </Row>
        </div>
      ) : (
        <Card className="mt-3" style={cardStyle}>
          <Card.Header className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
            <Card.Title>Detalles de Pago</Card.Title>
            <Button variant="secondary" onClick={() => setShowModal(true)}>
              Modificar
            </Button>
          </Card.Header>
          <Card.Body>
            {error && <AlertMessage type="error" message={error} />}
            {success && <AlertMessage type="success" message={success} />}
            <Row>
              <Col md={6}>
                <p><strong>Precio:</strong> ${pago.precio}</p>
                <Form.Check
                  type="checkbox"
                  label="Pagado"
                  name="pagado"
                  checked={pago.pagado}
                  onChange={handlePagadoChange}
                  inline
                />
                <p><strong>Remito:</strong> {pago.remito ? pago.remito : "No disponible"}</p>
              </Col>
              <Col md={6}>
                <p><strong>Tipo de Pago:</strong> {pago.tipoPago}</p>
                <p><strong>Factura:</strong> {pago.facturaId ? pago.facturaId : "No disponible"}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      <ModificarPagoPedido
        show={showModal}
        onHide={() => setShowModal(false)}
        pago={pago}
      />
    </Container>
  );
};

export default PagoPedido;

