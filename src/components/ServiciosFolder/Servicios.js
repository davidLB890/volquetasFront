import React, { useState, useEffect } from 'react';
import { getServicioPorCamionFecha, deleteServicio } from '../../api'; // Importa la función deleteServicio
import { Container, Table, Alert, Button, Modal } from 'react-bootstrap';
import useAuth from '../../hooks/useAuth';
import AgregarServicio from './AgregarServicio';
import moment from 'moment';

const ServiciosCamion = ({ camionId, mes, anio }) => {
  const [servicios, setServicios] = useState([]);
  const [error, setError] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Modal de confirmación
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null); // Servicio a eliminar

  const getToken = useAuth();

  const fetchServicios = async () => {
    const usuarioToken = getToken();

    try {
      const response = await getServicioPorCamionFecha(camionId, mes, anio, usuarioToken);
      const datos = response.data;
      const ordenados = datos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setServicios(ordenados);
    } catch (error) {
      console.error('Error al obtener servicios del camión:', error);
      setError('Error al obtener los servicios del camión.');
    }
  };

  useEffect(() => {
    fetchServicios();
  }, [camionId, mes, anio, getToken]);

  const handleMostrarModal = () => {
    setMostrarModal(true);
  };

  const handleCloseModal = () => {
    setMostrarModal(false);
  };

  const handleSuccess = () => {
    fetchServicios();
  };

  const handleConfirmDelete = (servicio) => {
    setServicioSeleccionado(servicio);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    const usuarioToken = getToken();
    try {
      await deleteServicio(servicioSeleccionado.id, usuarioToken);
      setShowConfirmModal(false);
      fetchServicios(); // Actualiza la lista de servicios
    } catch (error) {
      console.error('Error al eliminar el servicio:', error);
      setError('Error al eliminar el servicio.');
    }
  };

  return (
    <Container>
      {/* Tabla para pantallas medianas y grandes */}
      <div className="table-responsive d-none d-md-block">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {servicios.map((servicio) => (
              <tr key={servicio.id}>
                <td>{moment(servicio.fecha).format('lll')}</td>
                <td>{servicio.tipo}</td>
                <td>{servicio.descripcion}</td>
                <td>
                  $ {servicio.precio} {servicio.moneda === 'peso' ? 'UYU' : 'USD'}
                </td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleConfirmDelete(servicio)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Tarjetas para pantallas pequeñas */}
      <div className="d-md-none">
        {servicios.map((servicio) => (
          <div key={servicio.id} className="servicio-item">
            <p><strong>Fecha:</strong> {moment(servicio.fecha).format('lll')}</p>
            <p><strong>Tipo:</strong> {servicio.tipo}</p>
            <p><strong>Descripción:</strong> {servicio.descripcion}</p>
            <p><strong>Precio:</strong> $ {servicio.precio} {servicio.moneda === 'peso' ? 'UYU' : 'USD'}</p>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleConfirmDelete(servicio)}
            >
              Eliminar
            </Button>
          </div>
        ))}
      </div>

      <Button variant="primary" onClick={handleMostrarModal}>
        Agregar Servicio
      </Button>

      <AgregarServicio idCamion={camionId} onSuccess={handleSuccess} show={mostrarModal} onHide={handleCloseModal} />

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Modal de confirmación para eliminar */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar el servicio del {moment(servicioSeleccionado?.fecha).format('lll')}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ServiciosCamion;
