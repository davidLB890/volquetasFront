import React, { useState, useEffect } from 'react';
import { getServicioPorCamionFecha } from '../../api';
import { Container, Table, Alert, Button } from 'react-bootstrap';
import useAuth from '../../hooks/useAuth';
import AgregarServicio from './AgregarServicio';
import moment from 'moment';
/* import './ServiciosCamion.css'; */ // Importa el archivo CSS

const ServiciosCamion = ({ camionId, mes, anio }) => {
  const [servicios, setServicios] = useState([]);
  const [error, setError] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);

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
    console.log(fetchServicios());
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
          </div>
        ))}
      </div>

      <Button variant="primary" onClick={handleMostrarModal}>
        Agregar Servicio
      </Button>

      <AgregarServicio idCamion={camionId} onSuccess={handleSuccess} show={mostrarModal} onHide={handleCloseModal} />

      {error && <Alert variant="danger">{error}</Alert>}
    </Container>
  );
};

export default ServiciosCamion;
