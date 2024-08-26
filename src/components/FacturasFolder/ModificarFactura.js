import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import { putFactura } from "../../api";
import useAuth from "../../hooks/useAuth";

const ModificarFactura = ({ factura, show, handleClose, onFacturaActualizada }) => {
  const [tipo, setTipo] = useState(factura.tipo);
  const [numeracion, setNumeracion] = useState(factura.numeracion);
  const [fechaPago, setFechaPago] = useState(
    factura.fechaPago ? factura.fechaPago.split("T")[0] : ""
  );
  const [estado, setEstado] = useState(factura.estado);
  const [descripcion, setDescripcion] = useState(factura.descripcion);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getToken = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const usuarioToken = getToken();
    const fechaPagoValue = fechaPago ? fechaPago : null;

    const facturaUpdates = {
      tipo,
      numeracion,
      descripcion,
      fechaPago: fechaPagoValue
    };
    console.log(factura.id)
    console.log(facturaUpdates);

    try {
      await putFactura(factura.id, facturaUpdates, usuarioToken);
      setSuccess("Factura actualizada correctamente");
      onFacturaActualizada({ ...factura, ...facturaUpdates });
    } catch (error) {
      console.log(error.response.data?.error);
      setError(error.response.data?.error || "Error al actualizar la factura");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (error || success) {
      const timeout = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [error, success]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar Factura</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="tipo">
                <Form.Label>Tipo</Form.Label>
                <Form.Control
                  as="select"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option value="contado">Contado</option>
                  <option value="credito">Crédito</option>
                  <option value="recibo">Recibo</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="numeracion">
                <Form.Label>Numeración</Form.Label>
                <Form.Control
                  type="text"
                  value={numeracion}
                  onChange={(e) => setNumeracion(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="fechaPago">
                <Form.Label>Fecha de Pago</Form.Label>
                <Form.Control
                  type="date"
                  value={fechaPago}
                  onChange={(e) => setFechaPago(e.target.value)}
                  disabled={estado !== "pagada"}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Form.Group controlId="descripcion">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button variant="secondary" 
          className="mt-3"
            style={{
              padding: "0.5rem 1rem",
              marginRight: "0.5rem",
            }}
            onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={loading}
          className="mt-3"
          style={{
            padding: "0.5rem 1rem",
            marginRight: "0.5rem",
          }}>
            Guardar Cambios
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModificarFactura;