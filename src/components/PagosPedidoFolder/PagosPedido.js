import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updatePagoPedido } from "../../features/pedidoSlice"; 
import { putPagoPedidos } from "../../api";
import useAuth from "../../hooks/useAuth";
import AlertMessage from "../AlertMessage";
import ModificarPagoPedido from "./ModificarPagoPedido";
import AgregarEntrada from "../CajasFolder/AgregarEntrada";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";

const PagoPedido = () => {
  const dispatch = useDispatch();
  const getToken = useAuth();
  const pago = useSelector((state) => state.pedido.pagoPedido);
  const [showModal, setShowModal] = useState(false);
  const [showAgregarEntradaModal, setShowAgregarEntradaModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" });

  const handlePagadoChange = () => {
    if (pago.tipoPago === "efectivo" && !pago.pagado) {
      setShowConfirm(true);
    } else {
      togglePagado();
    }
  };

  const handleConfirmYes = () => {
    setShowConfirm(false);
    setShowAgregarEntradaModal(true);
  };

  const handleConfirmNo = () => {
    setShowConfirm(false);
    togglePagado();
  };

  const togglePagado = async () => {
    const usuarioToken = getToken();
    const nuevoEstadoPagado = !pago.pagado;
  
    try {
      // Llama a la API para actualizar el pago
      const response = await putPagoPedidos(pago.id, { ...pago, pagado: nuevoEstadoPagado }, usuarioToken);
  
      // Despacha la actualización del pago al estado global
      dispatch(updatePagoPedido(response.data));
  
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
    backgroundColor: pago?.pagado ? "#d4edda" : "#f8d7da",
    borderColor: pago?.pagado ? "#c3e6cb" : "#f5c6cb",
  };

  const titleStyle = {
    color: pago?.pagado ? "#28a745" : "#dc3545",
  };

  if (!pago) return null;

  const handleFacturaClick = () => {
    let idFactura = pago.facturaId;
    navigate("/facturas/datos", { state: { facturaId: idFactura } });
  };

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
              <p>
                <strong>Precio:</strong> ${pago.precio}
              </p>
              <Form.Check
                type="checkbox"
                label="Pagado"
                name="pagado"
                checked={pago.pagado}
                onChange={handlePagadoChange}
                inline
              />
              <p>
                <strong>Remito:</strong>{" "}
                {pago.remito ? pago.remito : "No disponible"}
              </p>
            </Col>
            <Col xs={12}>
              <p>
                <strong>Tipo de Pago:</strong> {pago.tipoPago}
              </p>
              <p>
                <strong>Factura:</strong>{" "}
                {pago.facturaId ? (
                  <span
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={handleFacturaClick}
                  >
                    {pago.facturaId}
                  </span>
                ) : (
                  "No disponible"
                )}
              </p>
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
                <p>
                  <strong>Precio:</strong> ${pago.precio}
                </p>
                <Form.Check
                  type="checkbox"
                  label="Pagado"
                  name="pagado"
                  checked={pago.pagado}
                  onChange={handlePagadoChange}
                  inline
                />
                <p>
                  <strong>Remito:</strong>{" "}
                  {pago.remito ? pago.remito : "No disponible"}
                </p>
              </Col>
              <Col md={6}>
                <p>
                  <strong>Tipo de Pago:</strong> {pago.tipoPago}
                </p>
                <p>
                <strong>Factura:</strong>{" "}
                {pago.facturaId ? (
                  <span
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={handleFacturaClick}
                  >
                    {pago.facturaId}
                  </span>
                ) : (
                  "No disponible"
                )}
              </p>
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

      {/* Modal de Confirmación para Agregar Entrada */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Entrada de Caja</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Desea agregar un registro de caja para este pago en efectivo?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleConfirmNo}>
            No
          </Button>
          <Button variant="primary" onClick={handleConfirmYes}>
            Sí
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para Agregar Entrada */}
      <Modal
        show={showAgregarEntradaModal}
        onHide={() => {
          setShowAgregarEntradaModal(false);
          togglePagado(); // Ejecuta togglePagado cuando se cierra el modal
        }}
        size="lg"
        onExited={togglePagado} // Se asegura de ejecutar togglePagado incluso después de cerrar
      >
        <Modal.Header closeButton>
          <Modal.Title>Agregar Entrada</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AgregarEntrada
            onSuccess={() => setShowAgregarEntradaModal(false)}
            onHide={() => setShowAgregarEntradaModal(false)}
            efectivo={true}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default PagoPedido;
