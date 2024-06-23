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
              <th>Viajes Realizados</th>
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