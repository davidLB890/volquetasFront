import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, ListGroup, Button, Table, Card, Modal, Col, Row } from 'react-bootstrap';
import ModificarCaja from './ModificarCaja';
import { deleteCaja } from '../../api';
import useAuth from '../../hooks/useAuth';

const ListaCajas = ({ data }) => {
  const [showCard, setShowCard] = useState(false);
  const [showModificarModal, setShowModificarModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedCaja, setSelectedCaja] = useState(null);
  const [cajas, setCajas] = useState(data.cajas || []); // Asegúrate de que 'cajas' siempre sea un array
  const getToken = useAuth();

  const navigate = useNavigate();

  const handleNavigateToPedido = (pedidoId) => {
    navigate('/pedidos/datos', {
      state: { pedidoId },
    });
  };

  const toggleCard = () => {
    setShowCard(!showCard);
  };

  const handleShowModificarModal = (caja) => {
    setSelectedCaja(caja);
    setShowModificarModal(true);
  };

  const handleCloseModificarModal = () => {
    setShowModificarModal(false);
    setSelectedCaja(null);
  };

  const handleShowConfirmDelete = (caja) => {
    setSelectedCaja(caja);
    setShowConfirmDelete(true);
  };

  const handleCloseConfirmDelete = () => {
    setShowConfirmDelete(false);
    setSelectedCaja(null);
  };

  const handleDeleteCaja = async () => {
    const usuarioToken = getToken();
    try {
      await deleteCaja(selectedCaja.id, usuarioToken);
      setCajas((prevCajas) => prevCajas.filter((caja) => caja.id !== selectedCaja.id));
      handleCloseConfirmDelete();
    } catch (error) {
      console.error("Error al eliminar la caja:", error.response?.data?.error || error.message);
    }
  };

  const handleSuccessModification = (updatedCaja) => {
    setCajas((prevCajas) =>
      prevCajas.map((caja) => (caja.id === updatedCaja.id ? updatedCaja : caja))
    );
    setShowModificarModal(false);
  };

  const { datos } = data;

  if (!cajas.length) {
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
        {/* Si la pantalla es md o más grande, muestra una tabla */}
        {window.innerWidth >= 768 ? (
          <Table bordered hover>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Motivo</th>
                <th>Monto</th>
                <th>Descripción</th>
                <th>Empleado</th>
                <th>Pedido</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cajas.map((c) => (
                <tr key={c.id}>
                  <td>{c.fecha}</td>
                  <td>{c.motivo}</td>
                  <td
                    style={
                      c.monto > 0
                        ? { backgroundColor: '#beffcc' }
                        : { backgroundColor: '#ffd9dc' }
                    }
                  >
                    ${c.monto} {c.moneda === 'peso' ? 'UY' : 'USD'}
                  </td>
                  <td>{c.descripcion}</td>
                  <td>{c.Empleado ? c.Empleado.nombre : ''}</td>
                  <td>
                    {c.Pedido ? (
                      <span
                        className="link-primary"
                        onClick={() => handleNavigateToPedido(c.pedidoId)}
                        style={{ cursor: 'pointer' }}
                      >
                        {c.Pedido.Obra.calle}
                      </span>
                    ) : (
                      ''
                    )}
                  </td>
                  <td>
                    <Button variant="secondary" onClick={() => handleShowModificarModal(c)}>
                      Modificar
                    </Button>
                    <Button
                      variant="danger"
                      className="ms-2"
                      onClick={() => handleShowConfirmDelete(c)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          // Para pantallas más pequeñas, muestra tarjetas
          cajas.map((c) => (
            <Card key={c.id} className="mb-3">
              <Card.Body>
                <Row>
                  <Col xs={6}>
                    <strong>Fecha:</strong> {c.fecha}
                  </Col>
                  <Col xs={6}>
                    <strong>Motivo:</strong> {c.motivo}
                  </Col>
                </Row>
                <Row>
                  <Col xs={6}>
                    <strong>Monto:</strong>{' '}
                    <span
                      style={
                        c.monto > 0
                          ? { backgroundColor: '#beffcc' }
                          : { backgroundColor: '#ffd9dc' }
                      }
                    >
                      ${c.monto} {c.moneda === 'peso' ? 'UY' : 'USD'}
                    </span>
                  </Col>
                  <Col xs={6}>
                    <strong>Descripción:</strong> {c.descripcion}
                  </Col>
                </Row>
                <Row>
                  <Col xs={6}>
                    <strong>Empleado:</strong> {c.Empleado ? c.Empleado.nombre : ''}
                  </Col>
                  <Col xs={6}>
                    <strong>Pedido:</strong>{' '}
                    {c.Pedido ? (
                      <span
                        className="link-primary"
                        onClick={() => handleNavigateToPedido(c.pedidoId)}
                        style={{ cursor: 'pointer' }}
                      >
                        {c.Pedido.Obra.calle}
                      </span>
                    ) : (
                      ''
                    )}
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col>
                    <Button variant="secondary" onClick={() => handleShowModificarModal(c)}>
                      Modificar
                    </Button>
                    <Button
                      variant="danger"
                      className="ms-2"
                      onClick={() => handleShowConfirmDelete(c)}
                    >
                      Eliminar
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))
        )}
      </Container>

      {showModificarModal && (
        <ModificarCaja
          cajaId={selectedCaja.id}
          initialData={selectedCaja}
          onSuccess={handleSuccessModification}
          onHide={handleCloseModificarModal}
        />
      )}

      {/* Modal de Confirmación para Eliminar */}
      <Modal show={showConfirmDelete} onHide={handleCloseConfirmDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar la entrada seleccionada?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmDelete}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteCaja}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ListaCajas;
