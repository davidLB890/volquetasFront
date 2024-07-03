import React, { useEffect, useState } from 'react';
import { Container, ListGroup, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { obtenerEmpleados } from '../../api';
import ListaJornalesDatos from './ListaJornalesDatos';

const Jornales = () => {
  const [empleadosPorRol, setEmpleadosPorRol] = useState({});
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const navigate = useNavigate();
  const getToken = useAuth();

  useEffect(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

    setFechaInicio(firstDayOfMonth);
    setFechaFin(lastDayOfMonth);

    const fetchEmpleados = async () => {
      const usuarioToken = getToken();
      if (!usuarioToken) {
        navigate('/login');
      } else {
        try {
          const response = await obtenerEmpleados(usuarioToken);
          agruparEmpleadosPorRol(response.data);
        } catch (error) {
          console.error('Error al obtener empleados:', error.response.data.error);
        }
      }
    };

    fetchEmpleados();
  }, [getToken, navigate]);

  const agruparEmpleadosPorRol = (empleadosData) => {
    const empleadosPorRolTemp = {};
    empleadosData.forEach((empleado) => {
      if (!empleadosPorRolTemp[empleado.rol]) {
        empleadosPorRolTemp[empleado.rol] = [];
      }
      empleadosPorRolTemp[empleado.rol].push({ ...empleado, isSelected: false });
    });
    setEmpleadosPorRol(empleadosPorRolTemp);
  };

  const handleEmpleadoClick = (empleadoId) => {
    const updatedEmpleadosPorRol = { ...empleadosPorRol };

    // Recorrer y actualizar el estado isSelected del empleado seleccionado
    Object.keys(updatedEmpleadosPorRol).forEach((rol) => {
      updatedEmpleadosPorRol[rol] = updatedEmpleadosPorRol[rol].map((empleado) => ({
        ...empleado,
        isSelected: empleado.id === empleadoId ? !empleado.isSelected : false,
      }));
    });

    setEmpleadosPorRol(updatedEmpleadosPorRol);
  };

  const titulosPorRol = {
    chofer: 'Choferes',
    normal: 'Oficina',
    admin: 'Administradores',
  };

  return (
    <Container className='card' >
      <h1 className="mt-4 mb-4">Jornales de Empleados</h1>
      <Form className="mb-4">
        <div className="row">
          <div className="col">
            <Form.Group controlId="fechaInicio">
              <Form.Label>Fecha de Inicio</Form.Label>
              <Form.Control
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </Form.Group>
          </div>
          <div className="col">
            <Form.Group controlId="fechaFin">
              <Form.Label>Fecha de Fin</Form.Label>
              <Form.Control
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </Form.Group>
          </div>
        </div>
      </Form>
      {Object.keys(empleadosPorRol).map((rol) => (
        <div key={rol}>
          <h2 className="mt-4 mb-3">{titulosPorRol[rol] || rol}</h2>
          <ListGroup>
            {empleadosPorRol[rol].map((empleado) => (
              <React.Fragment key={empleado.id}>
                <ListGroup.Item
                  action
                  onClick={() => handleEmpleadoClick(empleado.id)}
                  active={empleado.isSelected}
                >
                  {empleado.nombre}
                </ListGroup.Item>
                {empleado.isSelected && (
                  <ListGroup.Item>
                    <ListaJornalesDatos
                      empleadoId={empleado.id}
                      empleadoNombre={empleado.nombre}
                      empleadoRol={rol}
                      fechaInicio={fechaInicio}
                      fechaFin={fechaFin}
                    />
                  </ListGroup.Item>
                )}
              </React.Fragment>
            ))}
          </ListGroup>
        </div>
      ))}
    </Container>
  );
};

export default Jornales;

