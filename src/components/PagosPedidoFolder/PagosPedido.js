import React, { useEffect, useState } from "react";
import { Card, Form, Button, Row, Col, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updatePago } from "../../features/pedidoSlice"; // Asegúrate de ajustar la ruta según sea necesario
import useAuth from "../../hooks/useAuth";
import AlertMessage from "../AlertMessage";
import ModificarPagoPedido from "./ModificarPagoPedido"; // Asegúrate de ajustar la ruta según sea necesario

const PagoPedido = () => {
  const dispatch = useDispatch();
  const getToken = useAuth();
  const pago = useSelector((state) => state.pedido.pedido.pagoPedido);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  if (!pago) return null; // Maneja el caso donde no hay pago disponible

  return (
    <Container>
      <Card className="mt-3" style={cardStyle}>
        <Card.Header className="header">
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
              <div>
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
              </div>
            </Col>
            <Col md={6}>
              <div>
                <p><strong>Tipo de Pago:</strong> {pago.tipoPago}</p>
                <p><strong>Factura:</strong> {pago.facturaId ? pago.facturaId : "No disponible"}</p>
              </div>
            </Col>
          </Row>
        </Card.Body>
        <ModificarPagoPedido
          show={showModal}
          onHide={() => setShowModal(false)}
          pago={pago}
        />
      </Card>
    </Container>
  );
};

export default PagoPedido;
