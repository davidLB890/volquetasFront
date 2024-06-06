// src/components/EmpleadosList.js
/* import React, { useEffect, useState } from 'react';
import { obtenerEmpleados, eliminarEmpleado, cambiarEstadoEmpleado } from '../api';
import EmpleadoItem from './EmpleadoItem';

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    const fetchEmpleados = async () => {
      const response = await obtenerEmpleados();
      setEmpleados(response.data);
    };

    fetchEmpleados();
  }, []);

  const handleEliminar = async (empleadoId) => {
    try {
      await eliminarEmpleado(empleadoId);
      setEmpleados(empleados.filter((emp) => emp.id !== empleadoId));
    } catch (error) {
      console.error('Error al eliminar el empleado:', error);
    }
  };

  const handleCambiarEstado = async (empleadoId) => {
    try {
      await cambiarEstadoEmpleado(empleadoId);
      const updatedEmpleados = empleados.map((emp) =>
        emp.id === empleadoId ? { ...emp, habilitado: !emp.habilitado } : emp
      );
      setEmpleados(updatedEmpleados);
    } catch (error) {
      console.error('Error al cambiar estado del empleado:', error);
    }
  };

  return (
    <div>
      <h1>Lista de Empleados</h1>
      {empleados.map((empleado) => (
        <EmpleadoItem
          key={empleado.id}
          empleado={empleado}
          onEliminar={handleEliminar}
          onCambiarEstado={handleCambiarEstado}
        />
      ))}
    </div>
  );
};

export default Empleados; */
