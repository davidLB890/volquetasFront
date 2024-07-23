import React, { useState } from "react";
import { Container, Row, Col, Card, Modal, Button } from "react-bootstrap";
import DatosObra from "../ObrasFolder/DatosObra"; // Asegúrate de ajustar la ruta según sea necesario
import ModificarPedido from "./ModificarPedido"; // Asegúrate de ajustar la ruta según sea necesario

const DetallesPedido = ({ detalles, onPedidoModificado }) => {
  const [mostrarObra, setMostrarObra] = useState(false);
  const [mostrarModificar, setMostrarModificar] = useState(false);
  const [obra, setObra] = useState(detalles.Obra);

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
    setObra(obraModificada);
    setMostrarObra(false); // Cierra el modal después de la modificación
  };

  return (
    <Container>
      <Card className="mt-3">
        <Card.Header>
          <div className="header">
            <h4>Información</h4>
            <Button variant="primary" onClick={handleToggleModificar}>
              Modificar
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p>
                <strong>Fecha de Creación:</strong>{" "}
                {detalles.createdAt
                  ? new Date(detalles.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>Estado:</strong> {detalles.estado}
              </p>
              {detalles.descripcion ? (
                <p>
                  <strong>Descripción:</strong> {detalles.descripcion}
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
                <strong>Creado Como:</strong> {detalles.creadoComo}
              </p>
              <p>
                <strong>Permiso:</strong> {detalles.permisoId}
              </p>
              <p>
                <strong>Nro Pesada:</strong> {detalles.nroPesada}
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
        pedido={detalles}
        onPedidoModificado={onPedidoModificado}
      />
    </Container>
  );
};

export default DetallesPedido;
