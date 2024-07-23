import React, { useState } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { putPagoPedidos } from "../../api"; // Ajusta la ruta según sea necesario
import useAuth from "../../hooks/useAuth";
import AlertMessage from "../AlertMessage";
import ModificarPagoPedido from "./ModificarPegoPedido"; // Asegúrate de ajustar la ruta según sea necesario

const PagoPedido = ({ pago }) => {
  const [editablePago, setEditablePago] = useState({ ...pago });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const getToken = useAuth();

  const handlePagadoChange = async () => {
    const usuarioToken = getToken();
    const nuevoEstadoPagado = !editablePago.pagado;
    setEditablePago({ ...editablePago, pagado: nuevoEstadoPagado });

    try {
      await putPagoPedidos(
        editablePago.id,
        { pagado: nuevoEstadoPagado },
        usuarioToken
      );
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
    backgroundColor: editablePago.pagado ? "#d4edda" : "#f8d7da", // Verde claro o rojo claro
    borderColor: editablePago.pagado ? "#c3e6cb" : "#f5c6cb", // Verde claro o rojo claro
  };

  return (
    <Card style={cardStyle}>
      <Card.Header>
        <div className="header">
          <Card.Title>Detalles de Pago</Card.Title>
          <Button variant="secondary" onClick={() => setShowModal(true)}>
            Modificar
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {error && <AlertMessage type="error" message={error} />}
        {success && <AlertMessage type="success" message={success} />}
        <Row>
          <Col md={6}>
            <p>
              <strong>Precio:</strong> ${editablePago.precio}
            </p>
            <p>
              <Form.Check
                type="checkbox"
                label="Pagado"
                name="pagado"
                checked={editablePago.pagado}
                onChange={handlePagadoChange}
                inline
              />
            </p>
            <p>
              <strong>Remito:</strong>{" "}
              {editablePago.remito ? editablePago.remito : "No disponible"}
            </p>
          </Col>
          <Col md={6}>
            <p>
              <strong>Tipo de Pago:</strong> {editablePago.tipoPago}
            </p>
            <p>
              <strong>Factura:</strong>{" "}
              {editablePago.facturaId ? editablePago.facturaId : "No disponible"}
            </p>
          </Col>
        </Row>
      </Card.Body>
      <ModificarPagoPedido
        show={showModal}
        onHide={() => setShowModal(false)}
        pago={editablePago}
      />
    </Card>
  );
};

export default PagoPedido;
