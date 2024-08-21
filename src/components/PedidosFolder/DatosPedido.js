import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Spinner, Alert, Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { fetchPedido, fetchObra, fetchPermisos } from "../../features/pedidoSlice";
import useAuth from "../../hooks/useAuth";
import MovimientosYSugerencias from "../MovimientosFolder/MovimientosYSugerencias";
import DetallesPedido from "./DetallesPedido";
import ContactosObraPedido from "../ObrasFolder/ContactosObraPedido";
import PagoPedido from "../PagosPedidoFolder/PagosPedido";
import Multiples from "./Multiples";
import Recambio from "../RecambioFolder/Recambio";
import Referencia from "./Referencia";
import { deletePedidoId } from "../../api";
import ListaVolquetasResumida from "../VolquetasFolder/ListaVolquetasResumida";

const DatosPedido = () => {
  const location = useLocation();
  const pedidoId = location.state?.pedidoId;
  const volquetaId = location.state?.volquetaId;
  const empresaId = location.state?.empresaId;
  const particularId = location.state?.particularId;
  const dispatch = useDispatch();
  const { pedido, obra, loading, error } = useSelector((state) => state.pedido);
  const getToken = useAuth();
  const navigate = useNavigate();

  const [showRecambioModal, setShowRecambioModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const { fromFactura } = location.state;
  const { fromCajas } = location.state;

  useEffect(() => {
    const usuarioToken = getToken();
    dispatch(fetchPedido({ pedidoId, usuarioToken }));
  }, [dispatch, getToken, pedidoId]);

  useEffect(() => {
    if (pedido?.obraId) {
      const usuarioToken = getToken();
      dispatch(fetchObra({ obraId: pedido.obraId, usuarioToken }));
    }
  }, [dispatch, getToken, pedido]);

  useEffect(() => {
    if (pedido?.Obra?.empresa?.id) {
      const usuarioToken = getToken();
      dispatch(
        fetchPermisos({ empresaId: pedido.Obra.empresa.id, usuarioToken })
      );
    }
  }, [dispatch, getToken, pedido]);

  const handleShowConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const handleHideConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const handleConfirmEliminar = async () => {
    const usuarioToken = getToken();
    const body = {
      obraId: pedido.Obra.id,
      descripcion: pedido.descripcion ? pedido.descripcion : "",
      permisoId: pedido.permisoId ? pedido.permisoId : null,
      nroPesada: pedido.nroPesada ? pedido.nroPesada : null,
    };
    try {
      await deletePedidoId(pedidoId, body, usuarioToken);
      navigate("/");
    } catch (error) {
      setDeleteError(
        error.response?.data?.error || "Error al eliminar el pedido"
      );
    } finally {
      setShowConfirmModal(false);
    }
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!pedido) {
    return (
      <Alert variant="danger">No se encontraron detalles del pedido.</Alert>
    );
  }

  return (
    <Container>
      {volquetaId && (
        <Button
          variant="secondary"
          className="mt-3 ml-3"
          onClick={() =>
            navigate("/volquetas/datos", { state: { volquetaId } })
          }
        >
          Volver a Volqueta
        </Button>
      )}
      {empresaId && (
        <Button
          variant="secondary"
          className="mt-3 ml-3"
          onClick={() => navigate("/empresas/datos", { state: { empresaId } })}
        >
          Volver a Empresa
        </Button>
      )}
      {particularId && (
        <Button
          variant="secondary"
          className="mt-3 ml-3"
          onClick={() =>
            navigate("/particulares/datos", { state: { particularId } })
          }
        >
          Volver a Particular
        </Button>
      )}
      {fromFactura && (
        <Button variant="secondary" onClick={() => navigate(-1)}>
          &larr; Volver a la Factura
        </Button>
      )}
      {fromCajas && (
        <Button variant="secondary" onClick={() => navigate(-1)}>
          &larr; Volver a lista de Entradas
        </Button>
      )}
      <Card className="mt-3">
        <Card.Header>
          <Row>
            <Col md={12}>
              {pedido.estado === "cancelado" && (
                <div className="alert alert-warning" role="alert">
                  <strong>Pedido Cancelado!</strong> Este pedido fue cancelado.
                </div>
              )}
            </Col>
            <Col xs={12} md={6}>
              {pedido.creadoComo === "recambio" && <Referencia />}
              <h2>
                Pedido{" "}
                {pedido.creadoComo === "multiple"
                  ? `  (multiple) `
                  : " "}
                en {obra?.calle}
              </h2>
              <p>nro identificador: {pedido.id}</p>
            </Col>
            <Col
              xs={12}
              md={6}
              className="d-flex flex-column align-items-start"
            >
              {obra && <ContactosObraPedido />}
              {pedido.creadoComo === "multiple" && <Multiples />}
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <MovimientosYSugerencias />
          <Row>
            <Col md={6} xs={12}>
              <DetallesPedido />
            </Col>
            <Col md={6}>
              <PagoPedido />
            </Col>
          </Row>
          <Button
            variant="warning"
            className="mt-3"
            onClick={() => setShowRecambioModal(true)}
            style={{
              padding: "0.5rem 1rem",
              marginRight: "0.5rem",
            }}
          >
            Recambio
          </Button>
          <Recambio
            show={showRecambioModal}
            onHide={() => setShowRecambioModal(false)}
            pedido={pedido}
          />
          <Button
            variant="danger"
            className="mt-3"
            onClick={handleShowConfirmModal}
            style={{
              padding: "0.5rem 1rem",
              marginRight: "0.5rem",
            }}
          >
            Eliminar
          </Button>
          {deleteError && (
            <Alert variant="danger" className="mt-3">
              {deleteError}
            </Alert>
          )}
        </Card.Body>
      </Card>

      <ListaVolquetasResumida />

      <Modal show={showConfirmModal} onHide={handleHideConfirmModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar este pedido?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleHideConfirmModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmEliminar}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DatosPedido;
