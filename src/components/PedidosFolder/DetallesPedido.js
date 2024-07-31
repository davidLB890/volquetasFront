import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Modal, Button, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import DatosObra from "../ObrasFolder/DatosObra";
import ModificarPedido from "./ModificarPedido";
import { updateObra } from "../../features/pedidoSlice";

const DetallesPedido = () => {
  const [mostrarObra, setMostrarObra] = useState(false);
  const [mostrarModificar, setMostrarModificar] = useState(false);
  const dispatch = useDispatch();
  const { pedido, obra } = useSelector((state) => state.pedido);

  const handleToggleObra = () => {
    setMostrarObra(!mostrarObra);
  };

  const handleCloseObra = () => {
    setMostrarObra(false);
  };

  const handleToggleModificar = () => {
    setMostrarModificar(!mostrarModificar);
  };

  const handleObraModificada = (obraModificada) => {
    dispatch(updateObra(obraModificada));
    setMostrarObra(false);
  };

  useEffect(() => {
    if (pedido?.Obra) {
      dispatch(updateObra(pedido.Obra));
    }
  }, [pedido, dispatch]);

  if (!pedido) {
    return (
      <Container>
        <Alert variant="danger">No se encontraron detalles del pedido.</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Card className="mt-3">
        <Card.Header>
          <div className="header">
            <h4>Información</h4>
            <Button variant="secondary" onClick={handleToggleModificar}>
              Modificar
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p>
                <strong>Fecha de Creación:</strong>{" "}
                {pedido.createdAt
                  ? new Date(pedido.createdAt).toLocaleDateString()
                  : "-"}
              </p>
              <p>
                <strong>Estado:</strong> {pedido.estado}
              </p>
              {pedido.descripcion ? (
                <p>
                  <strong>Descripción:</strong> {pedido.descripcion}
                </p>
              ) : null}
            </Col>
            <Col md={6}>
              <p>
                <strong>Dirección:</strong>{" "}
                <span
                  className="link-primary"
                  onClick={handleToggleObra}
                  style={{ cursor: "pointer" }} 
                >
                  {obra?.calle} {obra?.numeroPuerta ? obra.numeroPuerta : ""}{" "}
                  {obra?.esquina ? "esq. " + obra.esquina : ""}
                </span>
              </p>
              <p>
                <strong>Creado Como:</strong> {pedido.creadoComo}
              </p>
              <p>
                <strong>Permiso:</strong> {pedido.permisoId}
              </p>
              <p>
                <strong>Nro Pesada:</strong> {pedido.nroPesada}
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Modal show={mostrarObra} onHide={handleCloseObra} size="lg">
        <Modal.Body>
          <DatosObra
            obraId={obra?.id}
            onObraModificada={handleObraModificada}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseObra}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <ModificarPedido
        show={mostrarModificar}
        onHide={handleToggleModificar}
      />
    </Container>
  );
};

export default DetallesPedido;
