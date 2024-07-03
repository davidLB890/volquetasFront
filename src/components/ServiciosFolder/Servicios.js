import React, { useState, useEffect } from "react";
import { getServicioPorCamion } from "../../api";
import { Container, Table, Alert, Button } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import CrearServicio from "./CrearServicios";

const ServiciosCamion = ({ camionId }) => {
  const [servicios, setServicios] = useState([]);
  const [error, setError] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);

  const getToken = useAuth();

  const fetchServicios = async () => {
    const usuarioToken = getToken();

    try {
      const response = await getServicioPorCamion(camionId, usuarioToken);
      const datos = response.data;
      setServicios(datos);
    } catch (error) {
      console.error("Error al obtener servicios del camión:", error);
      setError('Error al obtener los servicios del camión.');
    }
  };

  useEffect(() => {
    fetchServicios();
  }, [camionId, getToken]);

  const handleMostrarModal = () => {
    setMostrarModal(true);
  };

  const handleCloseModal = () => {
    setMostrarModal(false);
  };

  const handleSuccess = () => {
    fetchServicios();
  };

  return (
    <Container>
      <>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Tipo</th>
              <th>Fecha</th>
              <th>Precio</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {servicios.map((servicio, index) => (
              <tr key={servicio.id}>
                <td>{index + 1}</td>
                <td>{servicio.tipo}</td>
                <td>{servicio.fecha}</td>
                <td>{servicio.precio}</td>
                <td>{servicio.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Button variant="primary" onClick={handleMostrarModal}>
          Agregar Servicio
        </Button>

        <CrearServicio
          idCamion={camionId}
          onSuccess={handleSuccess}
          show={mostrarModal}
          onHide={handleCloseModal}
        />

        {error && <Alert variant="danger">{error}</Alert>}
      </>
    </Container>
  );
};

export default ServiciosCamion;
