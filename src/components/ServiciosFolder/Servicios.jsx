import React, { useState, useEffect } from "react";
import { getServicioPorCamion } from "../../api";
import { Container, Button, Table, Alert } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";

const ServiciosCamion = ({ camionId }) => {
  const [servicios, setServicios] = useState([]);
  const [mostrarServicios, setMostrarServicios] = useState(false);
  const [error, setError] = useState('');

  const getToken = useAuth();

  useEffect(() => {
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

    fetchServicios();
  }, [camionId, getToken]);

  const toggleMostrarServicios = () => {
    setMostrarServicios(!mostrarServicios);
  };

  return (
    <Container>
      <Button variant="info" onClick={toggleMostrarServicios} className="mb-3">
        {mostrarServicios ? "Ocultar Servicios" : "Mostrar servicios de este camión"}
      </Button>
      {mostrarServicios && (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Tipo</th>
                <th>Fecha</th>
                <th>Precio</th>
                <th>Descripción</th>
                <th>Camión id</th>
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
                  <td>{servicio.camionId}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {error && <Alert variant="danger">{error}</Alert>}
        </>
      )}
    </Container>
  );
};

export default ServiciosCamion;







/* // ServiciosCamion.jsx

import React, { useState, useEffect } from "react";
import { getServicioPorCamion } from "../../api";
import { Button, Table } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";

const ServiciosCamion = ({ camionId }) => {
  const [servicios, setServicios] = useState([]);
  const [mostrarServicios, setMostrarServicios] = useState(false);
  const [error, setError] = useState('');


  const getToken = useAuth();

  useEffect(() => {
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

    fetchServicios();
  }, [camionId, getToken]);

  const toggleMostrarServicios = () => {
    setMostrarServicios(!mostrarServicios);
  };

  return (
    <>
      <Button variant="info" onClick={toggleMostrarServicios}>
        {mostrarServicios ? "Ocultar Servicios" : "Mostrar Servicios"}
      </Button>
      {mostrarServicios && (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Tipo</th>
            <th>Fecha</th>
            <th>Precio</th>
            <th>Descripción</th>
            <th>Camión id</th>
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
              <td>{servicio.camionId}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      )}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
    </>
  );
};

export default ServiciosCamion; */



/* // ServiciosCamion.jsx

import React, { useState, useEffect } from "react";
import { getServicioPorCamion } from "../../api";
import { Button, Table } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";

const ServiciosCamion = ({ camionId }) => {
  const [servicios, setServicios] = useState([]);
  const [mostrarServicios, setMostrarServicios] = useState(false);
  const [error, setError] = useState('');

  const getToken = useAuth();

  useEffect(() => {
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

    if (mostrarServicios) {
      fetchServicios();
    }
  }, [camionId, mostrarServicios, getToken]);

  const toggleMostrarServicios = () => {
    setMostrarServicios(!mostrarServicios);
  };

  return (
    <>
      <Button variant="info" onClick={toggleMostrarServicios}>
        {mostrarServicios ? "Ocultar Servicios" : "Mostrar Servicios"}
      </Button>
      {mostrarServicios && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Tipo</th>
              <th>Fecha</th>
              <th>Precio</th>
              <th>Descripción</th>
              <th>Camión id</th>
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
                <td>{servicio.camionId}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
    </>
  );
};

export default ServiciosCamion;

 */