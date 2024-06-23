//todo Una lista con los empleados ordenados por rol (chofer, recepcionista) 
//todo Al seleccionar un empleado se vean sus jornales (LISTAjORNALES) por defecto del mes actual
//todo Opción de elegir un rango de fechas
//todo dentro de cada empleado un botón para agregar un jornal (AGREGARjORNALES)
import React, { useEffect, useState } from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { obtenerEmpleados } from '../../api';
import ListaJornales from './ListaJornales'; // Asegúrate de importar tu componente ListaJornales

const Jornales = () => {
  const [empleadosPorRol, setEmpleadosPorRol] = useState({});
  const navigate = useNavigate();
  const getToken = useAuth();

  useEffect(() => {
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

  return (
    <Container>
      <h1 className="mt-4 mb-4">Jornales de Empleados</h1>
      {Object.keys(empleadosPorRol).map((rol) => (
        <div key={rol}>
          <h2 className="mt-4 mb-3">{rol}</h2>
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
                    {/* Mostrar los datos adicionales del empleado */}
                    <ListaJornales empleadoId={empleado.id} />
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