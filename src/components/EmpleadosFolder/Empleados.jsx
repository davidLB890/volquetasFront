// src/components/EmpleadosList.js
import React, { useEffect, useState } from 'react';
import { obtenerEmpleados, eliminarEmpleado, cambiarEstadoEmpleado } from '../../api';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import useAuth from '../../hooks/useAuth';

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [cambios, setCambios] = useState(true);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroRol, setFiltroRol] = useState('');
  const [filtroCedula, setFiltroCedula] = useState('');

  let navigate = useNavigate();
  const getToken = useAuth();

  useEffect(() => {
    // Verifica el token al montar el componente
    const usuarioToken = getToken();
    if (usuarioToken === null) {
      navigate("/login");
    } else {
      // Realiza la solicitud para obtener los empleados
      if(cambios) {
        try {
          obtenerEmpleados(usuarioToken)
          .then((response) => {
            const empleados = response.data;
            setEmpleados(empleados);
            setCambios(false);
          })
          .catch((error) => {
            console.error("Error al obtener usuarios:", error.response.data.error);
            navigate("/login");
        });
        } catch (error) {
          console.error("Error al obtener usuarios:", error.response.data.error);
          if(error.status === 401) {  
            navigate("/login");
          }
        }
      }
      
    }
  }, [cambios, getToken]);

  const eliminar = async (empleadoId) => {
    const usuarioToken = getToken();

    eliminarEmpleado(empleadoId, usuarioToken)
    .then((response) => {
      const datos = response.data;
      if (datos.error) {
          console.error(datos.error);
      } else {
          console.log(datos);
          setCambios(true);
      }
      })
      .catch((error) => {
      console.error("Error al conectar con el servidor:", error.response.data.error);
      });
  };  

  const cambiarEstadoDelEmpleado = async (empleadoId) => {
    const usuarioToken = getToken();

    try {
      const response = await cambiarEstadoEmpleado(empleadoId, usuarioToken);
      const datos = response.data;

       if (datos.error) {
        console.error(datos.error);
      } else {
        console.log(datos);
        setCambios(true);
      }

    } catch (error) {
      console.error("Error al cambiar estado del empleado:", error.data.error);
      if(error.status === 401) {  // Unauthorized (no autorizado)
        navigate("/login");
      }
    } 
  };  

  // Función para filtrar los empleados
  const empleadosFiltrados = empleados.filter((empleado) => {
    return (
      (filtroNombre === '' || empleado.nombre.toLowerCase().startsWith(filtroNombre.toLowerCase())) &&
      (filtroCedula === '' || empleado.cedula.toString().startsWith(filtroCedula)) &&
      (filtroEstado === '' || empleado.habilitado === (filtroEstado === 'true')) &&
      (filtroRol === '' || empleado.rol === filtroRol)
    );
  });

  return (
    <div className="container">
      <h1>Lista de Empleados</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Nombre</th>
            <th scope="col">Cédula</th>
            <th scope="col">Estado</th>
            <th scope="col">Rol</th>
            <th scope="col">Acciones</th>
          </tr>
          <tr>
            <th></th>
            <th>
              <Form.Control
                type="text"
                placeholder="Filtrar por Nombre"
                value={filtroNombre}
                onChange={(e) => setFiltroNombre(e.target.value)}
              />
            </th>
            <th>
              <Form.Control
                type="text"
                placeholder="Filtrar por CI"
                value={filtroCedula}
                onChange={(e) => setFiltroCedula(e.target.value)}
              >
              </Form.Control>
            </th>
            <th>
              <Form.Control
                as="select"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="true">Habilitado</option>
                <option value="false">Deshabilitado</option>
              </Form.Control>
            </th>
            <th>
              <Form.Control
                as="select"
                value={filtroRol}
                onChange={(e) => setFiltroRol(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="admin">Admin</option>
                <option value="chofer">Chofer</option>
                <option value="normal">Normal</option>
              </Form.Control>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {empleadosFiltrados.map((empleado, index) => (
            <tr key={empleado.id}>
              <th scope="row">{index + 1}</th>
              <td>{empleado.nombre}</td>
              <td>{empleado.cedula}</td>
              <td>{empleado.habilitado ? 'Habilitado' : 'Deshabilitado'}</td>
              <td>{empleado.rol}</td>
              <td>
                <Button variant="danger" onClick={() => eliminar(empleado.id)}>
                  Eliminar
                </Button>
                <Button
                  variant={empleado.habilitado ? 'danger' : 'success'}
                  onClick={() => cambiarEstadoDelEmpleado(empleado.id)}
                  className="me-2"
                >
                  {empleado.habilitado ? 'Deshabilitar' : 'Habilitar'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Empleados;
