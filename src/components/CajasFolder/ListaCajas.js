import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, ListGroup, Button, Table, Card, Modal, Col, Row, Form } from 'react-bootstrap';
import ModificarCaja from './ModificarCaja';
import { deleteCaja } from '../../api';
import { useSelector, useDispatch } from 'react-redux';
import { eliminarCaja, modificarCaja } from '../../features/cajasSlice';
import useAuth from '../../hooks/useAuth';

const ListaCajas = ({ actualizacionSuccess }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getToken = useAuth();

  const [showCard, setShowCard] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showModificarModal, setShowModificarModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedCaja, setSelectedCaja] = useState(null);

  // Asegúrate de que los selectores se correspondan correctamente con el estado en el store
  const cajas = useSelector((state) => state.cajas.cajas);
  const datos = useSelector(state => state.cajas.datos);

  const [filtroMotivo, setFiltroMotivo] = useState("");
  const [ordenFechaAsc, setOrdenFechaAsc] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleNavigateToPedido = (pedidoId) => {
    navigate('/pedidos/datos', {
      state: { pedidoId, fromCajas: true },
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
      dispatch(eliminarCaja(selectedCaja.id));
      handleCloseConfirmDelete();
    } catch (error) {
      console.error("Error al eliminar la caja:", error.response?.data?.error || error.message);
    }
  };

/*   const handleSuccessModification = (updatedCaja) => {
    dispatch(modificarCaja(updatedCaja));
    setShowModificarModal(false);
  }; */

  const handleFiltroMotivoChange = (e) => {
    setFiltroMotivo(e.target.value);
  };

  const handleOrdenFecha = () => {
    setOrdenFechaAsc(!ordenFechaAsc);
  };

  const handleSuccessModification = () => {
    //dispatch(modificarCaja(updatedCaja));
    actualizacionSuccess()
    setShowModificarModal(false);
  };

  const cajasFiltradas = cajas
    .filter(caja =>
      filtroMotivo === "" || caja.motivo.toLowerCase() === filtroMotivo.toLowerCase()
    )
    .sort((a, b) => ordenFechaAsc
      ? new Date(a.fecha) - new Date(b.fecha)
      : new Date(b.fecha) - new Date(a.fecha)
    );

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
        {isMobile ? (
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
        ) : (
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th style={{ width: '15%', cursor: 'pointer' }} onClick={handleOrdenFecha}>
                  Fecha {ordenFechaAsc ? '▲' : '▼'}
                </th>
                <th style={{ width: '20%' }}>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <Form.Control
                      as="select"
                      value={filtroMotivo}
                      onChange={handleFiltroMotivoChange}
                      style={{
                        display: 'inline-block',
                        width: 'auto',
                        border: 'none',
                        padding: '0 1.5rem 0 0',
                        background: 'none',
                      }}
                    >
                      <option value="">Motivo</option>
                      <option value="vale">Vale</option>
                      <option value="gasto">Gasto</option>
                      <option value="estraccion">Extracción</option>
                      <option value="ingreso">Ingreso</option>
                      <option value="ingreso pedido">Ingreso Pedido</option>
                      <option value="ingreso cochera">Ingreso Cochera</option>
                    </Form.Control>
                    <i
                      className="bi bi-caret-down-fill"
                      style={{
                        position: 'absolute',
                        right: '0.5rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                      }}
                    ></i>
                  </div>
                </th>
                <th style={{ width: '15%' }}>Monto</th>
                <th style={{ width: '20%' }}>Descripción</th>
                <th style={{ width: '15%' }}>Empleado</th>
                <th style={{ width: '15%' }}>Pedido</th>
                <th style={{ width: '15%' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cajasFiltradas.map((c) => (
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
                  <td style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
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
        )}
      </Container>

      {showModificarModal && (
        <ModificarCaja
          cajaId={selectedCaja.id}
          initialData={selectedCaja}
          onUpdateSuccess={handleSuccessModification}
          onHide={handleCloseModificarModal}
        />
      )}

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