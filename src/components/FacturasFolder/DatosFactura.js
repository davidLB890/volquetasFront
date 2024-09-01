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
import { useDispatch, useSelector } from "react-redux";
import {
  setFactura,
  setLoading,
  setError,
  updateFactura,
} from "../../features/facturaSlice"; // Importa las acciones necesarias
import useAuth from "../../hooks/useAuth";
import ModificarFactura from "./ModificarFactura";
import PagarFactura from "./PagarFactura";
import { getFacturaId, getEmpresaId, getParticularId, putFacturaEstado } from "../../api";

const DatosFactura = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const facturaId = location.state?.facturaId;
  const getToken = useAuth();
  const dispatch = useDispatch();

  // Estado local para manejar datos adicionales y controles de la interfaz
  const [nombreCliente, setNombreCliente] = useState("");
  const [clienteId, setClienteId] = useState(null);
  const [clienteTipo, setClienteTipo] = useState("");
  const [showModificarModal, setShowModificarModal] = useState(false);
  const [showFechaPagoModal, setShowFechaPagoModal] = useState(false);
  const [showConfirmAnular, setShowConfirmAnular] = useState(false);
  const [fechaPago, setFechaPago] = useState("");
  const [success, setSuccess] = useState("");

  // Seleccionar el estado de la factura, carga y error desde Redux
  const factura = useSelector((state) => state.factura.factura);
  const loading = useSelector((state) => state.factura.loading);
  const error = useSelector((state) => state.factura.error);

  const fetchFactura = async () => {
    const usuarioToken = getToken();
    dispatch(setLoading(true));
    try {
      const response = await getFacturaId(facturaId, usuarioToken);
      dispatch(setFactura(response.data));

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
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError("Error al obtener los datos de la factura"));
      dispatch(setLoading(false));
    }
  };
  // Cargar la factura y el cliente cuando el componente se monta o cambia el ID de la factura
  useEffect(() => {

    if (facturaId) {
      fetchFactura();
    } else {
      dispatch(setError("No se proporcionó un ID de factura"));
      dispatch(setLoading(false));
    }
  }, [facturaId, getToken, dispatch]);

  // Manejar la navegación a los detalles del pedido
  const handlePedidoClick = (pedidoId) => {
    navigate(`/pedidos/datos`, { state: { pedidoId, fromFactura: true } });
  };

  // Manejar la navegación a los detalles del cliente
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

// Actualizar el estado de la factura (por ejemplo, marcar como pagada o cancelar el pago)
const handleEstadoUpdate = async (estado) => {
  dispatch(setLoading(true));
  dispatch(setError(""));
  setSuccess("");

  
  const usuarioToken = getToken();
  const pagoUpdates = {
    fechaPago: estado === "pagada" ? fechaPago || null : null,
    estado,
    };
    
    try {
      const response = await putFacturaEstado(factura.id, pagoUpdates, usuarioToken);
      console.log("response", response);
      setSuccess("Factura actualizada correctamente");
      fetchFactura(); // Vuelve a cargar la factura antes de actualizarla

    // Utilizar toda la respuesta para actualizar el estado de la factura
    //dispatch(updateFactura(response.data));

    if (estado !== "pagada") setShowConfirmAnular(false);
    setShowFechaPagoModal(false);
  } catch (error) {
    dispatch(setError(error.response?.data?.error || "Error al actualizar la factura"));
  }

  dispatch(setLoading(false)); 
};


  // Manejar el envío del formulario para actualizar la fecha de pago
  const handleFechaPagoSubmit = async (e) => {
    e.preventDefault();
    await handleEstadoUpdate("pagada");
  };

  // Cerrar el modal de ModificarFactura
  const handleCloseModificarModal = () => {
    setShowModificarModal(false);
  };

  // Cerrar el modal de PagarFactura
  const handleClosePagarModal = () => {
    setShowFechaPagoModal(false);
  };

  // Cerrar el modal de confirmación de anulación
  const handleCloseConfirmAnular = () => {
    setShowConfirmAnular(false);
  };

  // Manejar la actualización exitosa del pago
  const handlePagoExitoso = (pagoUpdates) => {
    dispatch(updateFactura({ ...factura, estado: pagoUpdates.estado, fechaPago: pagoUpdates.fechaPago }));
    handleClosePagarModal();
  };

  // Limpiar mensajes de error y éxito después de un tiempo
  useEffect(() => {
    if (error || success) {
      const timeout = setTimeout(() => {
        dispatch(setError(""));
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [error, success, dispatch]);

  const handleFacturaActualizada = async (updatedFactura) => {
    const usuarioToken = getToken();
    dispatch(setLoading(true));
    try {
      // Actualiza la factura en el estado global
      dispatch(updateFactura(updatedFactura));
  
      // Vuelve a obtener la factura actualizada desde la API para asegurarte de que la información es la más reciente
      const response = await getFacturaId(facturaId, usuarioToken);
      dispatch(setFactura(response.data));
    } catch (error) {
      dispatch(setError("Error al actualizar los datos de la factura"));
    } finally {
      dispatch(setLoading(false));
    }
  
    setShowModificarModal(false); // Cierra el modal después de la actualización
  };
  

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
