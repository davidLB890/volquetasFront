import React, { useEffect, useState } from 'react';
import { Table, Alert, Button, Collapse } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getDatosJornalEmpleado, deleteJornal } from '../../api';
import useAuth from '../../hooks/useAuth';
import ModificarJornal from './ModificarJornal';
import AgregarJornal from './AgregarJornal';
import JornalEspecifico from './JornalEspecifico'; // Importa el nuevo componente
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import localeData from 'dayjs/plugin/localeData';
dayjs.extend(localeData);
dayjs.locale('es');

const ListaJornalesDatos = ({
  empleadoId,
  empleadoNombre,
  empleadoRol,
  fechaInicio,
  fechaFin,
}) => {
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState('');
  const [showModificar, setShowModificar] = useState(false);
  const [showAgregar, setShowAgregar] = useState(false);
  const [jornalSeleccionado, setJornalSeleccionado] = useState(null);
  const [visibleJornales, setVisibleJornales] = useState({}); // Estado para manejar la visibilidad de JornalEspecifico

  const rolUsuario = localStorage.getItem('userRol');
  const navigate = useNavigate();
  const getToken = useAuth();

  const fetchDatos = async () => {
    const usuarioToken = getToken();
    if (!usuarioToken) {
      navigate('/login');
      return;
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    const fechaInicioActual = fechaInicio || startOfMonth;
    const fechaFinActual = fechaFin || endOfMonth;

    try {
      const response = await getDatosJornalEmpleado(empleadoId, fechaInicioActual, fechaFinActual, usuarioToken);
      const datosEmpleado = response.data || {};

      setDatos(datosEmpleado);
    } catch (error) {
      console.error('Error al obtener datos del empleado:', error);
      setError('Error al obtener datos del empleado.');
      setDatos([]);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, [getToken, navigate, empleadoId, fechaInicio, fechaFin]);

  const handleEliminarJornal = async (jornalId) => {
    const usuarioToken = getToken();
    if (!usuarioToken) {
      navigate('/login');
      return;
    }

    try {
      await deleteJornal(jornalId, usuarioToken);
      fetchDatos();
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
    fetchDatos();
  };

  const handleMostrarAgregar = () => {
    setShowAgregar(true);
  };

  const toggleJornales = (empleadoId) => {
    setVisibleJornales((prev) => ({
      ...prev,
      [empleadoId]: !prev[empleadoId],
    }));
  };

  return (
    <>
      {datos.registros ? (
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
            <tr>
              <td>{datos.registros}</td>
              <td>{datos.diasTrabajo}</td>
              <td>{datos.diasLicencia}</td>
              <td>{datos.diasEnfermedad}</td>
              <td>{datos.diasFalta}</td>
              <td>{parseFloat(datos.horasTrabajadas).toFixed(2)}</td>{/* para mostrar solo 2 lugares después de la coma */}
              <td>{datos.horasExtra}</td>
            </tr>
          </tbody>
        </Table>
      ) : (
        <Alert variant="info">No se encontraron datos del empleado en ese rango de fechas.</Alert>
      )}

      <Button variant="primary" onClick={() => toggleJornales(empleadoId)}>
        {visibleJornales[empleadoId] ? 'Ocultar Jornales' : 'Ver Jornales'}
      </Button>

      <Collapse in={visibleJornales[empleadoId]}>
        <div>
          {visibleJornales[empleadoId] && (
            <JornalEspecifico
              empleadoId={empleadoId}
              empleadoRol={empleadoRol}
              fechaInicio={fechaInicio}
              fechaFin={fechaFin}
              handleMostrarModificar={handleMostrarModificar}
              handleEliminarJornal={handleEliminarJornal}
            />
          )}
        </div>
      </Collapse>

      {error && <Alert variant="danger">{error}</Alert>}

      <Button
        variant="info"
        onClick={handleMostrarAgregar}
      >
        Agregar Jornal
      </Button>

      <AgregarJornal
        show={showAgregar}
        onHide={() => setShowAgregar(false)}
        empleadoId={empleadoId}
        empleadoNombre={empleadoNombre}
        onJornalAgregado={fetchDatos}
      />

      <ModificarJornal
        show={showModificar}
        onHide={handleCloseModificar}
        jornal={jornalSeleccionado}
        onJornalModificado={handleJornalModificado}
      />
    </>
  );
};

export default ListaJornalesDatos;
