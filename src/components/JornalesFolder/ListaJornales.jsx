// ListaJornales.jsx
import React, { useEffect, useState } from 'react';
import { getJornalesEmpleado } from '../../api';
import useAuth from '../../hooks/useAuth';
import { Table, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

//import moment from 'moment';
//moment.locale('es');
//cómo hacer para formatear la fecha, para ver los días de la semana además del número de la fecha en sí


const ListaJornales = ({ empleadoId }) => {
  const [jornales, setJornales] = useState([]);
  const [datos, setDatos] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const getToken = useAuth();

  useEffect(() => {
    const usuarioToken = getToken();
    if (!usuarioToken) {
      navigate("/login");
    } else {
      // Determina las fechas de inicio y fin del mes actual si no están especificadas
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];

      const fechaInicioActual = fechaInicio || startOfMonth;
      const fechaFinActual = fechaFin || endOfMonth;

      try {
        getJornalesEmpleado(empleadoId, fechaInicioActual, fechaFinActual, usuarioToken)
          .then((response) => {
            setDatos(response.data.datos || []);
            setJornales(response.data.jornales || []);
          })
          .catch((error) => {
            console.error('Error al obtener jornales del empleado:', error);
            setError('Error al obtener jornales del empleado.');
            setDatos([]);
            setJornales([]);
          });
      } catch (error) {
        console.error("Error al obtener jornales:", error.response?.data?.error || error.message);
        setError("Error al obtener jornales");
        if (error.response?.status === 401) {
          navigate("/login");
        }
      }
    }
  }, [getToken, navigate, empleadoId, fechaInicio, fechaFin]);

  return (
<>
      {datos.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Días hábiles</th>
              <th>Días de Trabajo</th>
              <th>Días de Licencia</th>
              <th>Días de Enfermedad</th>
              {/* Agrega más columnas según sea necesario */}
            </tr>
          </thead>
          <tbody>
            {datos.map((dato) => (
              <tr key={dato.empleadoId}>
                <td>{dato.registros}</td>
                <td>{dato.diasTrabajo}</td>
                <td>{dato.diasLicencia}</td>
                <td>{dato.diasEnfermedad}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert variant="info">No se encontraron datos del empleado.</Alert>
      )}

      {jornales.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Entrada</th>
              <th>Salida</th>
              <th>Horas Extra</th>
              <th>Tareas Realizadas</th>
            </tr>
          </thead>
          <tbody>
            {jornales.map((jornal) => (
              <tr key={jornal.id}>
                <td>{jornal.fecha}</td>
                <td>{jornal.entrada}</td>
                <td>{jornal.salida}</td>
                <td>{jornal.horasExtra}</td>
                <td>{jornal.tareasRealizadas}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert variant="info">No se encontraron jornales para el empleado seleccionado en el rango de fechas especificado.</Alert>
      )}
    </>
  );
};

export default ListaJornales;





/* // ListaJornales.jsx
import React, { useEffect, useState } from 'react';
import { getJornalesEmpleado } from '../../api';
import useAuth from '../../hooks/useAuth';
import { Table, Alert, Card } from 'react-bootstrap';

const ListaJornales = ({ empleadoId, fechaInicio, fechaFin }) => {
  const [datos, setDatos] = useState([]);
  const [jornales, setJornales] = useState([]);
  const [error, setError] = useState(null);
  const getToken = useAuth();

  useEffect(() => {
    const fetchJornales = async () => {
      const usuarioToken = getToken();
      try {
        const response = await getJornalesEmpleado(empleadoId, fechaInicio, fechaFin, usuarioToken);
        setDatos(response.datos || []);
        setJornales(response.jornales || []);
      } catch (error) {
        console.error('Error al obtener jornales del empleado:', error);
        setError('Error al obtener jornales del empleado.');
        setDatos([]);
        setJornales([]);
      }
    };

    fetchJornales();
  }, [empleadoId, fechaInicio, fechaFin, getToken]);

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  // Agrupar los jornales por empleado
  const empleadoData = datos.find((dato) => dato.empleadoId === empleadoId);
  const empleadoJornales = jornales.filter((jornal) => jornal.empleadoId === empleadoId);

  return (
    <Card className="mb-3">
      <Card.Header>Empleado ID: {empleadoId}</Card.Header>
      <Card.Body>
        <h5>Datos del Empleado</h5>
        {empleadoData ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Registros</th>
                <th>Días de Trabajo</th>
                <th>Días de Licencia</th>
                <th>Días de Enfermedad</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{empleadoData.registros}</td>
                <td>{empleadoData.diasTrabajo}</td>
                <td>{empleadoData.diasLicencia}</td>
                <td>{empleadoData.diasEnfermedad}</td>
              </tr>
            </tbody>
          </Table>
        ) : (
          <Alert variant="info">No se encontraron datos del empleado.</Alert>
        )}
        <h5>Jornales del Empleado</h5>
        {empleadoJornales.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Horas Trabajadas</th>
                <th>Tareas Realizadas</th>
              </tr>
            </thead>
            <tbody>
              {empleadoJornales.map((jornal) => (
                <tr key={jornal.id}>
                  <td>{jornal.fecha}</td>
                  <td>{jornal.entrada}</td>
                  <td>{jornal.salida}</td>
                  <td>{jornal.horasTrabajadas}</td>
                  <td>{jornal.tareasRealizadas}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Alert variant="info">No se encontraron jornales para el empleado seleccionado en el rango de fechas especificado.</Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default ListaJornales; */




















/*  import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { getJornalesEmpleado } from '../../api';

const ListaJornales = ({ empleadoId }) => {
  const [jornales, setJornales] = useState([]);

  useEffect(() => {
    const fetchJornales = async () => {
      try {
        // Lógica para obtener los jornales del empleado
        const response = await getJornalesEmpleado(empleadoId);
        const datos = response.data;
        
        // Asumiendo que datos contiene tanto resumen como jornales detallados
        if (datos.jornales) {
          setJornales(datos.jornales); // Actualiza el estado con los jornales obtenidos
        } else {
          console.warn('No se encontraron jornales para el empleado.');
        }
      } catch (error) {
        console.error('Error al obtener los jornales:', error);
        // Manejo de errores, por ejemplo setJornales([]) o mostrar un mensaje al usuario
      }
    };

    fetchJornales();
  }, [empleadoId]);

  return (
    <div>
      <h3>Jornales del Empleado</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Fecha</th>
            <th>Entrada</th>
            <th>Salida</th>
            <th>Horas Extra</th>
          </tr>
        </thead>
        <tbody>
          {jornales.map((jornal, index) => (
            <tr key={jornal.id}>
              <td>{index + 1}</td>
              <td>{jornal.fecha}</td>
              <td>{jornal.entrada}</td>
              <td>{jornal.salida}</td>
              <td>{jornal.horasExtra}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ListaJornales; */






/* import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getJornalesEmpleado } from "../../api";
import useAuth from "../../hooks/useAuth";
import { Container, Row, Col, Table, Form, Button } from "react-bootstrap";

const ListaJornales = ({ empleadoId }) => {
  const [jornales, setJornales] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const getToken = useAuth();

  useEffect(() => {
    const usuarioToken = getToken();
    if (!usuarioToken) {
      navigate("/login");
    } else {
      // Determina las fechas de inicio y fin del mes actual si no están especificadas
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];

      const fechaInicioActual = fechaInicio || startOfMonth;
      const fechaFinActual = fechaFin || endOfMonth;

      try {
        getJornalesEmpleado(empleadoId, fechaInicioActual, fechaFinActual, usuarioToken)
          .then((response) => {
            const jornales = response.data;
            setJornales(jornales);
          })
          .catch((error) => {
            console.error("Error al obtener jornales:", error.response?.data?.error || error.message);
            setError("Error al obtener jornales");
          });
      } catch (error) {
        console.error("Error al obtener jornales:", error.response?.data?.error || error.message);
        setError("Error al obtener jornales");
        if (error.response?.status === 401) {
          navigate("/login");
        }
      }
    }
  }, [getToken, navigate, empleadoId, fechaInicio, fechaFin]);

  return (
    <Container>
      <Form>
        <Row>
            {error && <div className="alert alert-danger">{error}</div>}
          <Col md={6}>
            <Form.Group controlId="fechaInicio">
              <Form.Label>Fecha Inicio</Form.Label>
              <Form.Control
                type="text"
                value={fechaInicio}
                placeholder="Fecha Inicio"
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (e.target.type = "text")}
                onChange={(e) => setFechaInicio(e.target.value)}
                />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="fechaFin">
              <Form.Label>Fecha Fin</Form.Label>
              <Form.Control
                type="text"
                value={fechaFin}
                placeholder="Fecha Fin"
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (e.target.type = "text")}
                onChange={(e) => setFechaFin(e.target.value)}
                />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" onClick={() => setError('')} className="mt-3">
          Actualizar
        </Button>
      </Form>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Fecha</th>
            <th>Horas</th>
            <th>Pago</th>
          </tr>
        </thead>
        <tbody>
          {jornales.map((jornal, index) => (
            <tr key={jornal.id}>
              <td>{index + 1}</td>
              <td>{jornal.fecha}</td>
              <td>{jornal.horas}</td>
              <td>{jornal.pago}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ListaJornales;
 */