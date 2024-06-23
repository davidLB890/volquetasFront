//import moment from 'moment';
//moment.locale('es');
//cómo hacer para formatear la fecha, para ver los días de la semana además del número de la fecha en sí
import React, { useEffect, useState } from 'react';
import { Table, Alert, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AgregarJornal from './AgregarJornal';
import { getJornalesEmpleado, deleteJornal } from '../../api';
import useAuth from '../../hooks/useAuth';
import ModificarJornal from './ModificarJornal'; // Importamos el nuevo componente
import '../../styles/jornales.css';

const ListaJornales = ({ empleadoId, empleadoRol, fechaInicio, fechaFin }) => {
  const [jornales, setJornales] = useState([]);
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState('');
  const [showModificar, setShowModificar] = useState(false);
  const [jornalSeleccionado, setJornalSeleccionado] = useState(null);

  const navigate = useNavigate();
  const getToken = useAuth();

  const fetchJornales = async () => {
    const usuarioToken = getToken();
    if (!usuarioToken) {
      navigate("/login");
      return;
    }
  
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
  
    const fechaInicioActual = fechaInicio || startOfMonth;
    const fechaFinActual = fechaFin || endOfMonth;
  
    try {
      const response = await getJornalesEmpleado(empleadoId, fechaInicioActual, fechaFinActual, usuarioToken);
      const jornalesData = response.data.jornales || [];
      
      // Ordenar los jornales por fecha
      const jornalesOrdenados = jornalesData.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      
      setDatos(response.data.datos || []);
      setJornales(jornalesOrdenados);
    } catch (error) {
      console.error('Error al obtener jornales del empleado:', error);
      setError('Error al obtener jornales del empleado.');
      setDatos([]);
      setJornales([]);
    }
  };
  

  useEffect(() => {
    fetchJornales();
  }, [getToken, navigate, empleadoId, fechaInicio, fechaFin]);

  const handleEliminarJornal = async (jornalId) => {
    const usuarioToken = getToken();
    if (!usuarioToken) {
      navigate("/login");
      return;
    }

    try {
      await deleteJornal(jornalId, usuarioToken);
      fetchJornales();
    } catch (error) {
      console.error('Error al eliminar el jornal:', error);
      setError('Error al eliminar el jornal.');
    }
  };

  const handleMostrarModificar = (jornal) => {
    setJornalSeleccionado(jornal);
    setShowModificar(true);
  };

  const handleCloseModificar = () => {
    setShowModificar(false);
    setJornalSeleccionado(null);
  };

  const handleJornalModificado = () => {
    setShowModificar(false);
    setJornalSeleccionado(null);
    fetchJornales();
  };

  return (
    <>
      {datos.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Registros</th>
              <th>Días de Trabajo</th>
              <th>Días de Licencia</th>
              <th>Días de Enfermedad</th>
              <th>Faltas</th>
              <th>Horas trabajadas</th>
              <th>Horas extra</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((dato) => (
              <tr key={dato.empleadoId}>
                <td>{dato.registros}</td>
                <td>{dato.diasTrabajo}</td>
                <td>{dato.diasLicencia}</td>
                <td>{dato.diasEnfermedad}</td>
                <td>{dato.diasFalta}</td>
                <td>{dato.horasTrabajadas}</td>
                <td>{dato.horasExtra}</td>
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
              <th>Tipo</th>
              {empleadoRol === 'chofer' && <th>Viajes Realizados</th>}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {jornales.map((jornal) => (
              <tr key={jornal.id} className={jornal.tipo === 'trabajo' ? 'trabajo' : jornal.tipo === 'licencia' ? 'licencia' : jornal.tipo === 'falta' ? 'falta' : 'enfermedad'}>
                <td>{jornal.fecha}</td>
                <td>{jornal.entrada}</td>
                <td>{jornal.salida}</td>
                <td>{jornal.horasExtra}</td>
                <td>{jornal.tipo}</td>
                {empleadoRol === 'chofer' && <td>{jornal.tareasRealizadas}</td>}
                <td>
                  <Button variant="info" onClick={() => handleMostrarModificar(jornal)}>Modificar</Button>
                  <Button variant="danger" onClick={() => handleEliminarJornal(jornal.id)} className="ml-2">Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert variant="info">No se encontraron jornales para el empleado seleccionado en el rango de fechas especificado.</Alert>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      <AgregarJornal empleadoId={empleadoId} empleadoRol={empleadoRol} onJornalAgregado={fetchJornales} />

      <ModificarJornal
        show={showModificar}
        onHide={handleCloseModificar}
        jornal={jornalSeleccionado}
        onJornalModificado={handleJornalModificado}
      />
    </>
  );
};

export default ListaJornales;




