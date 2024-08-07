import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import { putFacturaEstado } from "../../api";
import useAuth from "../../hooks/useAuth";

const PagarFactura = ({ factura, show, handleClose, onPagoExitoso }) => {
  const [fechaPago, setFechaPago] = useState(factura.fechaPago ? factura.fechaPago.split("T")[0] : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showFechaPagoModal, setShowFechaPagoModal] = useState(false);
  const [showConfirmAnular, setShowConfirmAnular] = useState(false);

  const getToken = useAuth();

  const handlePagar = () => setShowFechaPagoModal(true);
  const handleCancelar = async () => {
    await handleEstadoUpdate("pendiente");
  };
  const handleAnular = () => setShowConfirmAnular(true);
  
  const handleEstadoUpdate = async (estado) => {
    setLoading(true);
    setError("");
    setSuccess("");

    const usuarioToken = getToken();
    const pagoUpdates = {
      fechaPago: estado === "pagada" ? fechaPago || null : null,
      estado,
    };

    try {
      await putFacturaEstado(factura.id, pagoUpdates, usuarioToken);
      setSuccess("Factura actualizada correctamente");
      onPagoExitoso(pagoUpdates);
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.error || "Error al actualizar la factura");
    }

    setLoading(false);
  };

  const handleFechaPagoSubmit = async (e) => {
    e.preventDefault();
    await handleEstadoUpdate("pagada");
    setShowFechaPagoModal(false);
  };

  useEffect(() => {
    if (error || success) {
      const timeout = setTimeout(() => {
        setError("");
        setSuccess("");
        if (success) handleClose();
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [error, success, handleClose]);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Estado de Factura</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading && <Spinner animation="border" />}
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <div className="d-flex justify-content-between">
            {factura.estado === "pendiente" && (
              <>
                <Button variant="primary" onClick={handlePagar} disabled={loading}>
                  Pagar
                </Button>
                <Button variant="warning" onClick={handleCancelar} disabled={loading}>
                  Cancelar
                </Button>
                <Button variant="danger" onClick={handleAnular} disabled={loading}>
                  Anular
                </Button>
              </>
            )}
            {factura.estado === "pagada" && (
              <Button variant="warning" onClick={handleCancelar} disabled={loading}>
                Cancelar
              </Button>
            )}
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showFechaPagoModal} onHide={() => setShowFechaPagoModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Seleccionar Fecha de Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading && <Spinner animation="border" />}
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleFechaPagoSubmit}>
            <Row>
              <Col md={12}>
                <Form.Group controlId="fechaPago">
                  <Form.Label>Fecha de Pago</Form.Label>
                  <Form.Control
                    type="date"
                    value={fechaPago}
                    onChange={(e) => setFechaPago(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit" disabled={loading}>
              Confirmar Pago
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showConfirmAnular} onHide={() => setShowConfirmAnular(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Anulación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Está seguro de que desea anular esta factura? Esta acción es irreversible.</p>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={() => setShowConfirmAnular(false)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                await handleEstadoUpdate("anulada");
                setShowConfirmAnular(false);
              }}
              disabled={loading}
              className="ml-2"
            >
              Anular
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PagarFactura;