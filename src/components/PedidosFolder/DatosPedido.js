import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Spinner,
  Alert,
  Container,
  Row,
  Col,
  Card,
  Button,
} from "react-bootstrap";
import {
  fetchPedido,
  fetchObra,
  fetchPermisos,
  updatePedido,
} from "../../features/pedidoSlice";
import useAuth from "../../hooks/useAuth";
import MovimientosYSugerencias from "../MovimientosFolder/MovimientosYSugerencias"; // Ajusta la ruta según sea necesario
import DetallesPedido from "./DetallesPedido"; // Ajusta la ruta según sea necesario
import ContactosObraPedido from "../ObrasFolder/ContactosObraPedido";
import PagoPedido from "../PagosPedidoFolder/PagosPedido";
import Multiples from "./Multiples";
import Recambio from "../RecambioFolder/Recambio";

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

      <Card className="mt-3">
        <Card.Header>
          <Row>
            <Col md={6}>
              <h2>
                Detalles del pedido{" "}
                {pedido.creadoComo === "multiple"
                  ? ` ${pedido.id} (multiple) `
                  : pedido.id}{" "}
                en {obra?.calle}
              </h2>
            </Col>
            <Col md={6}>
              {obra && <ContactosObraPedido />}
              {pedido.creadoComo === "multiple" && <Multiples />}
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <MovimientosYSugerencias />
          <Row>
            <Col md={6}>
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
          >
            Recambio
          </Button>
          <Recambio
            show={showRecambioModal}
            onHide={() => setShowRecambioModal(false)}
            pedido={pedido}
          />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DatosPedido;
