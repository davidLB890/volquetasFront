// src/components/EmpleadosList.js
import React, { useEffect, useState } from 'react';
import { obtenerEmpleados, eliminarEmpleado, cambiarEstadoEmpleado } from '../../api';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  let usuarioToken = localStorage.getItem('apiToken');

  useEffect(() => {
    // Verifica el token al montar el componente
    if (usuarioToken === null) {
      navigate("/login");
    } else {
      // Realiza la solicitud para obtener los empleados
      obtenerEmpleados(usuarioToken)
        .then((response) => {
          const empleados = response.data;
          setEmpleados(empleados);
        })
        .catch((error) => {
          console.error("Error al obtener empleados:", error);
          navigate("/login");
        });
    }
  }, []);

  const eliminar = async (empleadoId) => {
    try {
      await eliminarEmpleado(empleadoId);
      setEmpleados(empleados.filter((emp) => emp.id !== empleadoId));
    } catch (error) {
      console.error('Error al eliminar el empleado:', error);
    }
  };

  const cambiarEmpleado = async (empleadoId) => {

    cambiarEstadoEmpleado(empleadoId, usuarioToken)
    .then((response) => {
      const datos = response.data;
      if (datos.error) {
          console.error(datos.error);
      } else {
          console.log("Usuario creado correctamente", datos);
          // Realizar alguna acción adicional si es necesario
      }
      })
      .catch((error) => {
      console.error("Error al conectar con el servidor:", error.response.data.error);
      });
    const updatedEmpleados = empleados.map((emp) =>
      emp.id === empleadoId ? { ...emp, habilitado: !emp.habilitado } : emp
    );
    setEmpleados(updatedEmpleados);
  };  

  return (
    <div className="container">
      {empleados.map((empleado) => (
        <div key={empleado.id} className="row align-items-center mb-3">
          <div className="col">
            <h5 className="mb-0">{empleado.nombre}</h5>
          </div>
          <div className="col">
            <p className="mb-0">{empleado.correo}</p>
          </div>
          <div className="col">
            <p className="mb-0">{empleado.habilitado ? 'Habilitado' : 'Deshabilitado'}</p>
          </div>
          <div className="col">
            <p className="mb-0">{empleado.rol}</p>
          </div>
          <div className="col-auto">
            <Button
              variant={empleado.habilitado ? 'danger' : 'success'}
              /* disabled={!empleado.habilitado} */
              onClick={() => cambiarEmpleado(empleado.id)}
              className="me-2"
            >
              {empleado.habilitado ? 'Deshabilitar' : 'Habilitar'}
            </Button>
            <Button variant="danger" onClick={() => eliminar(empleado.id)}>
              Eliminar
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Empleados;
