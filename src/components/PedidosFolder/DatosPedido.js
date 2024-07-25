import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {Spinner,Alert,Container,Row,Col,Card,Button,} from "react-bootstrap";
import {fetchPedido,fetchObra,fetchPermisos,updatePedido,addMovimiento,deleteMovimiento,modifyMovimiento,
  addSugerencia,  deleteSugerencia,modifySugerencia,} from "../../features/pedidoSlice";
import useAuth from "../../hooks/useAuth";
import DatosObra from "../ObrasFolder/DatosObra";
import MovimientosYSugerencias from "../MovimientosFolder/MovimientosYSugerencias"; // Asegúrate de ajustar la ruta según sea necesario
import DetallesPedido from "./DetallesPedido"; // Asegúrate de ajustar la ruta según sea necesario
import ContactosObraSimple from "../ObrasFolder/ContactosObraSimple";
import PagoPedido from "../PagosPedidoFolder/PagosPedido";
import ContactosObraPedido from "../ObrasFolder/ContactosObraPedido";

const DatosPedido = () => {
  const location = useLocation();
  const pedidoId = location.state?.pedidoId;
  const volquetaId = location.state?.volquetaId;
  const empresaId = location.state?.empresaId;
  const particularId = location.state?.particularId;
  const dispatch = useDispatch();
  const { pedido, obra, permisos, loading, error } = useSelector(
    (state) => state.pedido
  );
  const getToken = useAuth();
  const navigate = useNavigate();
  const [mostrarObra, setMostrarObra] = useState(false);

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

  const handleToggleObra = () => {
    setMostrarObra(!mostrarObra);
  };

  const handleMovimientoAgregado = (nuevoMovimiento) => {
    dispatch(addMovimiento(nuevoMovimiento));
  };

  const handleSugerenciaAgregada = (nuevaSugerencia) => {
    dispatch(addSugerencia(nuevaSugerencia));
  };

  const handleMovimientoModificado = (movimientoModificado) => {
    const usuarioToken = getToken();
    dispatch(
      modifyMovimiento({
        movimientoId: movimientoModificado.id,
        movimiento: movimientoModificado,
        usuarioToken,
      })
    );
  };

  const handleMovimientoEliminado = (movimientoId) => {
    const usuarioToken = getToken();
    dispatch(deleteMovimiento({ movimientoId, usuarioToken }));
  };


  const handleSugerenciaModificada = (sugerenciaModificada) => {
    const usuarioToken = getToken();
    dispatch(
      modifySugerencia({
        sugerenciaId: sugerenciaModificada.id,
        sugerencia: {
          ...sugerenciaModificada,
          choferSugeridoId: Number(sugerenciaModificada.choferSugeridoId),
        },
        usuarioToken,
      })
    );
  };

  const handlePedidoModificado = (updatedPedido) => {
    dispatch(updatePedido(updatedPedido));
  };

  const handleSugerenciaEliminada = (sugerenciaId) => {
    const usuarioToken = getToken();
    dispatch(deleteSugerencia({ sugerenciaId, usuarioToken }));
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

      <Card className="mt-3">
        <Card.Header>
        <Row>
          <Col md={6}>
          <h2>
            Detalles del Pedido {pedido.id}{" "}
            {pedido.referenciaId ? pedido.referenciaId : ""}
          </h2>
          </Col>
          <Col md={5}>
          {obra && (
                <ContactosObraPedido
                  obra={obra}
                  cliente={
                    pedido.Obra.particular
                      ? { particular: pedido.Obra.particular }
                      : { empresa: pedido.Obra.empresa }
                  }
                />
              )}
          </Col>
        </Row>
        </Card.Header>
        <Card.Body>
          <MovimientosYSugerencias
            movimientos={pedido.Movimientos}
            sugerencias={pedido.Sugerencias}
            pedidoId={pedidoId}
            onMovimientoAgregado={handleMovimientoAgregado}
            onMovimientoModificado={handleMovimientoModificado}
            onMovimientoEliminado={handleMovimientoEliminado}
            onSugerenciaAgregada={handleSugerenciaAgregada}
            onSugerenciaModificada={handleSugerenciaModificada}
            onSugerenciaEliminada={handleSugerenciaEliminada}
          />
          <Row>
            <Col md={6}>
              <DetallesPedido
                detalles={pedido}
                onPedidoModificado={handlePedidoModificado}
              />
            </Col>
            <Col md={6}>
              {/* {obra && (
                <ContactosObraSimple
                  obra={obra}
                  cliente={
                    pedido.Obra.particular
                      ? { particular: pedido.Obra.particular }
                      : { empresa: pedido.Obra.empresa }
                  }
                />
              )} */}
              
              <PagoPedido />
            </Col>
          </Row>
        </Card.Body>
      </Card>
      {mostrarObra && <DatosObra obraId={pedido.Obra?.id} />}
    </Container>
  );
};

export default DatosPedido;