import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Row,
  Col,
  Spinner,
  Alert,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import {
  getFacturaId,
  getEmpresaId,
  getParticularId,
  putFacturaEstado,
} from "../../api";
import useAuth from "../../hooks/useAuth";
import ModificarFactura from "./ModificarFactura";
import PagarFactura from "./PagarFactura";

const DatosFactura = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const facturaId = location.state?.facturaId;
  const getToken = useAuth();

  const [factura, setFactura] = useState(null);
  const [nombreCliente, setNombreCliente] = useState("");
  const [clienteId, setClienteId] = useState(null);
  const [clienteTipo, setClienteTipo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModificarModal, setShowModificarModal] = useState(false);
  const [showFechaPagoModal, setShowFechaPagoModal] = useState(false);
  const [showConfirmAnular, setShowConfirmAnular] = useState(false);
  const [fechaPago, setFechaPago] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchFactura = async () => {
      const usuarioToken = getToken();
      try {
        const response = await getFacturaId(facturaId, usuarioToken);
        setFactura(response.data);

        if (response.data.empresaId) {
          const empresaResponse = await getEmpresaId(response.data.empresaId, usuarioToken);
          setNombreCliente(empresaResponse.data.nombre);
          setClienteId(response.data.empresaId);
          setClienteTipo("empresa");
        } else if (response.data.particularId) {
          const particularResponse = await getParticularId(response.data.particularId, usuarioToken);
          setNombreCliente(particularResponse.data.nombre);
          setClienteId(response.data.particularId);
          setClienteTipo("particular");
        }
        setLoading(false);
      } catch (error) {
        setError("Error al obtener los datos de la factura");
        setLoading(false);
      }
    };

    if (facturaId) {
      fetchFactura();
    } else {
      setError("No se proporcionó un ID de factura");
      setLoading(false);
    }
  }, [facturaId, getToken]);

  const handlePedidoClick = (pedidoId) => {
    navigate(`/pedidos/datos`, { state: { pedidoId, fromFactura: true } });
  };

  const handleClienteClick = () => {
    if (clienteTipo === "empresa") {
      navigate(`/empresas/datos`, {
        state: { empresaId: clienteId, fromFactura: true },
      });
    } else if (clienteTipo === "particular") {
      navigate(`/particulares/datos`, {
        state: { particularId: clienteId, fromFactura: true },
      });
    }
  };

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
      setFactura((prevFactura) => ({
        ...prevFactura,
        estado: pagoUpdates.estado,
        fechaPago: pagoUpdates.fechaPago,
      }));
      if (estado !== "pagada") setShowConfirmAnular(false);
      setShowFechaPagoModal(false);
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.error || "Error al actualizar la factura");
    }

    setLoading(false);
  };

  const handleFechaPagoSubmit = async (e) => {
    e.preventDefault();
    await handleEstadoUpdate("pagada");
  };

  const handleCloseModificarModal = () => {
    setShowModificarModal(false);
  };

  const handleClosePagarModal = () => {
    setShowFechaPagoModal(false);
  };

  const handleCloseConfirmAnular = () => {
    setShowConfirmAnular(false);
  };

  const handlePagoExitoso = (pagoUpdates) => {
    setFactura((prevFactura) => ({
      ...prevFactura,
      estado: pagoUpdates.estado,
      fechaPago: pagoUpdates.estado === "pagada" ? pagoUpdates.fechaPago : null,
    }));
    handleClosePagarModal();
  };

  const handleFacturaActualizada = (updatedFactura) => {
    setFactura(updatedFactura);
    setShowModificarModal(false);
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
    <Container>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {factura?.estado === "anulada" && (
        <div className="alert alert-warning" role="alert">
          <strong>Factura Anulada!</strong> Esta factura fue anulada.
        </div>
      )}
      {factura && (
        <Card>
          <Card.Header className="header">
            <Card.Title>Datos de la Factura</Card.Title>
            <div className="d-flex justify-content-between mt-3">
              {factura.estado === "pendiente" && (
                <>
                  <Button
                    variant="success"
                    onClick={() => setShowFechaPagoModal(true)}
                  >
                    Marcar como Pagado
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => setShowConfirmAnular(true)}
                  >
                    Anular
                  </Button>
                </>
              )}
              {factura.estado === "pagada" && (
                <Button
                  variant="warning"
                  onClick={() => handleEstadoUpdate("pendiente")}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <strong>Tipo:</strong> {factura.tipo}
              </Col>
              <Col md={6}>
                <strong>Estado:</strong> {factura.estado}
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <strong>Numeración:</strong> {factura.numeracion}
              </Col>
              <Col md={6}>
                <strong>Monto:</strong> ${factura.monto}
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <strong>Fecha de Creación:</strong>{" "}
                {new Date(factura.createdAt).toLocaleDateString()}
              </Col>
              <Col md={6}>
                <strong>Fecha de Pago:</strong>{" "}
                {factura.fechaPago
                  ? new Date(factura.fechaPago).toLocaleDateString()
                  : "sin pagar"}
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <strong>Descripción:</strong> {factura.descripcion}
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <strong>Cliente:</strong>{" "}
                <span
                  style={{ cursor: "pointer", color: "blue" }}
                  onClick={handleClienteClick}
                >
                  {nombreCliente}
                </span>
              </Col>
            </Row>
            <hr />
            {factura.estado !== "anulada" && (
              <>
                <h5>Pedidos</h5>
                {factura.pedidos.map((pedido) => (
                  <Card key={pedido.pedidoId} className="mb-2">
                    <Card.Body>
                      <Row>
                        <Col md={4}>
                          <strong>Pedido:</strong>
                          <span
                            style={{ cursor: "pointer", color: "blue" }}
                            onClick={() => handlePedidoClick(pedido.pedidoId)}
                          >
                            {` ${pedido.pedidoId}`}
                          </span>
                        </Col>
                        <Col md={4}>
                          <strong>Precio:</strong> ${pedido.precio}
                        </Col>
                        <Col md={4}>
                          <strong>Tipo de Pago:</strong> {pedido.tipoPago}
                        </Col>
                      </Row>
                      <Row>
                        <Col md={4}>
                          <strong>Pagado:</strong> {pedido.pagado ? "Sí" : "No"}
                        </Col>
                        <Col md={8}>
                          <strong>Remito:</strong> {pedido.remito || "N/A"}
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
                <Button
                  variant="warning"
                  onClick={() => setShowModificarModal(true)}
                  className="mt-3"
                >
                  Modificar Factura
                </Button>
              </>
            )}
          </Card.Body>
        </Card>
      )}

      {factura && (
        <>
          <ModificarFactura
            factura={factura}
            show={showModificarModal}
            handleClose={handleCloseModificarModal}
            onFacturaActualizada={handleFacturaActualizada}
          />
          <PagarFactura
            factura={factura}
            show={showFechaPagoModal}
            handleClose={handleClosePagarModal}
            onPagoExitoso={handlePagoExitoso}
          />
        </>
      )}

      <Modal show={showFechaPagoModal} onHide={handleClosePagarModal}>
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
              Confirmar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showConfirmAnular} onHide={handleCloseConfirmAnular}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Anulación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            ¿Está seguro de que desea anular esta factura? Esta acción es
            irreversible.
          </p>
          <Button
            variant="danger"
            onClick={() => handleEstadoUpdate("anulada")}
          >
            Anular
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default DatosFactura;