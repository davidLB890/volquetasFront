import React, { useState } from "react";
import { Table, Button, Card } from "react-bootstrap";
import AgregarMovimiento from "./AgregarMovimiento"; // Ajusta la ruta según sea necesario

const Movimientos = ({
  movimientos = [],
  choferes = [],
  handleVerPedido,
  pedidoId,
}) => {
  const [showAgregarMovimiento, setShowAgregarMovimiento] = useState(false);

  const handleHideModal = () => setShowAgregarMovimiento(false);
  const handleShowModal = () => setShowAgregarMovimiento(true);

  return (
    <Card>
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Movimientos</h4>
          <Button variant="primary" onClick={handleShowModal}>
            Agregar Movimiento
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {movimientos.length === 0 ? (
          <p>No hay movimientos para este pedido.</p>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Número de Volqueta</th>
                <th>Horario</th>
                <th>Tipo</th>
                <th>Chofer</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map((movimiento) => (
                <tr key={movimiento.id}>
                  <td>{movimiento.numeroVolqueta}</td>
                  <td>{new Date(movimiento.horario).toLocaleString()}</td>
                  <td>{movimiento.tipo}</td>
                  <td>{choferes.find(chofer => chofer.id === movimiento.choferId)?.nombre}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleVerPedido(movimiento.pedidoId)}
                      className="mr-2"
                    >
                      Ver Pedido
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>

      <AgregarMovimiento
        show={showAgregarMovimiento}
        onHide={handleHideModal}
        pedidoId={pedidoId}
        choferes={choferes}
      />
    </Card>
  );
};

export default Movimientos;