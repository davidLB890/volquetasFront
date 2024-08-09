import React, { useEffect, useState } from 'react';
import { Table, Alert, Button } from 'react-bootstrap';
import { getJornalesEmpleado } from '../../api';
import useAuth from '../../hooks/useAuth';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import localeData from 'dayjs/plugin/localeData';
import '../../assets/css/JornalEspecifico.css'; // Importa los estilos

dayjs.extend(localeData);
dayjs.locale('es');

const JornalEspecifico = ({ empleadoId, empleadoRol, fechaInicio, fechaFin, handleMostrarModificar, handleEliminarJornal }) => {
  const [jornales, setJornales] = useState([]);
  const [error, setError] = useState('');
  const rolUsuario = localStorage.getItem('userRol');
  const getToken = useAuth();

  const fetchJornales = async () => {
    const usuarioToken = getToken();
    if (!usuarioToken) {
      return;
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    const fechaInicioActual = fechaInicio || startOfMonth;
    const fechaFinActual = fechaFin || endOfMonth;

    try {
      const response = await getJornalesEmpleado(empleadoId, fechaInicioActual, fechaFinActual, usuarioToken);
      const jornalesData = response.data || [];

      // Ordenar los jornales por fecha de forma descendente
      const jornalesOrdenados = jornalesData.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

      setJornales(jornalesOrdenados);
    } catch (error) {
      console.error('Error al obtener jornales del empleado:', error);
      setError('Error al obtener jornales del empleado.');
      setJornales([]);
    }
  };

  useEffect(() => {
    fetchJornales();
  }, []); // Dependencias vacías para que se ejecute solo una vez cuando el componente se monta

  return (
    <>
      {/* Tabla para pantallas medianas y grandes */}
      <div className="table-responsive d-none d-md-block">
        {jornales.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Horas Extra</th>
                <th>Tipo</th>
                {empleadoRol === 'chofer' && <th>Viajes Realizados</th>}
                {rolUsuario === 'admin' && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {jornales.map((jornal) => (
                <tr
                  key={jornal.id}
                  className={
                    jornal.tipo === 'trabajo'
                      ? 'trabajo'
                      : jornal.tipo === 'licencia'
                      ? 'licencia'
                      : jornal.tipo === 'falta'
                      ? 'falta'
                      : 'enfermedad'
                  }
                >
                  <td>{dayjs(jornal.fecha).format('dddd, DD/MM/YYYY')}</td>
                  <td>{jornal.entrada}</td>
                  <td>{jornal.salida}</td>
                  <td>{jornal.horasExtra}</td>
                  <td>{jornal.tipo}</td>
                  {empleadoRol === 'chofer' && <td>-viajes: {jornal.viajes} -entregas: {jornal.entregas} -levantes: {jornal.levantes}</td>}
                  {rolUsuario === 'admin' && (
                    <td>
                      <Button
                        variant="info"
                        onClick={() => handleMostrarModificar(jornal)}
                      >
                        Modificar
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleEliminarJornal(jornal.id)}
                        className="ml-2"
                      >
                        Eliminar
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Alert variant="info">
            No se encontraron jornales para el empleado seleccionado en el rango
            de fechas especificado.
          </Alert>
        )}
      </div>

      {/* Tarjetas para pantallas pequeñas */}
      <div className="d-md-none">
        {jornales.length > 0 ? (
          jornales.map((jornal) => (
            <div key={jornal.id} className="jornal-item">
              <p><strong>Fecha:</strong> {dayjs(jornal.fecha).format('dddd, DD/MM/YYYY')}</p>
              <p><strong>Entrada:</strong> {jornal.entrada}</p>
              <p><strong>Salida:</strong> {jornal.salida}</p>
              <p><strong>Horas Extra:</strong> {jornal.horasExtra}</p>
              <p><strong>Tipo:</strong> {jornal.tipo}</p>
              {empleadoRol === 'chofer' && (
                <p><strong>Viajes Realizados:</strong> {`-viajes: ${jornal.viajes} -entregas: ${jornal.entregas} -levantes: ${jornal.levantes}`}</p>
              )}
              {rolUsuario === 'admin' && (
                <div className="jornal-actions">
                  <Button
                    variant="info"
                    className="mb-2 w-100"
                    onClick={() => handleMostrarModificar(jornal)}
                  >
                    Modificar
                  </Button>
                  <Button
                    variant="danger"
                    className="w-100"
                    onClick={() => handleEliminarJornal(jornal.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              )}
            </div>
          ))
        ) : (
          <Alert variant="info">
            No se encontraron jornales para el empleado seleccionado en el rango
            de fechas especificado.
          </Alert>
        )}
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
    </>
  );
};

export default JornalEspecifico;
