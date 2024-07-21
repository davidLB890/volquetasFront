import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, ListGroup, Form, Button, Col, ButtonGroup, Table, Card } from 'react-bootstrap';
import { obtenerCajas } from '../../api';

const ListaCajas = ({ data }) => {
  const [showCard, setShowCard] = useState(false);
  const navigate = useNavigate();

  const handleNavigateToPedido = (pedidoId) => {
    navigate('/pedidos/datos', {
      state: { pedidoId },
    });
  };
  const toggleCard = () => {
    setShowCard(!showCard);
  };
  const { cajas, datos } = data;
  console.log(cajas, datos);

  if (cajas.length === 0) {
    return (
      <Card className="mb-4" style={{ width: '100%' }}>
        <Card.Body>
          <strong>No hay Entradas o Salidas para esas fechas</strong>
        </Card.Body>
      </Card>
    );
  }
  return (
    <>
      <Card className="mb-4" style={{ width: '100%' }}>
        <Button className="m-1" variant="primary" onClick={toggleCard}>
          {showCard ? 'Ocultar' : 'Mostrar'} Detalles
        </Button>
        {showCard && (
          <Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <strong>Monto Total en Pesos:</strong> $ {datos.montoPeso}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Monto Total en Dolares:</strong> $ {datos.montoDolar}
              </ListGroup.Item>
              <ListGroup.Item>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Motivo</th>
                      <th>Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(datos.contadorMotivos).map(([motivo, contador]) => (
                      <tr key={motivo}>
                        <td>{motivo.charAt(0).toUpperCase() + motivo.slice(1).toLowerCase()}</td>
                        <td>{contador}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        )}
      </Card>
      <Container className="card pt-4">
        <Table bordered hover>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Motivo</th>
              <th>Monto</th>
              <th>Descripcion</th>
              <th>Empleado</th>
              <th>Pedido</th>
            </tr>
          </thead>
          <tbody>
            {cajas.map((c) => (
              <tr key={c.id}>
                <td>{c.fecha}</td>
                <td>{c.motivo}</td>
                <td style={c.monto > 0 ? { backgroundColor: '#beffcc' } : { backgroundColor: '#ffd9dc' }}>
                  ${c.monto} {c.moneda === 'peso' ? 'UY' : 'USD'}
                </td>
                <td>{c.descripcion}</td>
                <td>{c.Empleado ? c.Empleado.nombre : ''}</td>
                <td>
                  {c.Pedido ? (
                    <span className="link-primary" onClick={() => handleNavigateToPedido(c.pedidoId)} style={{ cursor: 'pointer' }}>
                      {c.Pedido.Obra.calle} {c.Pedido.Obra.numeroPuerta}
                    </span>
                  ) : (
                    ''
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default ListaCajas;
