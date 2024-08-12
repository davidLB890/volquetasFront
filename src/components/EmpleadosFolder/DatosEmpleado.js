import React, { useEffect, useState } from "react";
import TelefonosEmpleado from "./TelefonosEmpleado";
import { obtenerEmpleado } from "../../api";
import useAuth from "../../hooks/useAuth";

const DatosEmpleado = ({ idEmpleado, forceUpdate }) => {
  const [showAgregar, setShowAgregar] = useState(false);
  const [telefonos, setTelefonos] = useState([]);
  const [empleado, setEmpleado] = useState(null);

  const getToken = useAuth();

  useEffect(() => {
    const usuarioToken = getToken();
    const fetchEmpleado = async () => {
      try {
        const response = await obtenerEmpleado(idEmpleado, usuarioToken);
        const empleadoEncontrado = response.data;
        setTelefonos(empleadoEncontrado.Telefonos || []);
        setEmpleado(empleadoEncontrado);
      } catch (error) {
        console.error("Error al obtener el empleado", error);
      }
    };

    fetchEmpleado();
  }, [idEmpleado, forceUpdate, getToken]);

  if (!empleado) {
    return <div>Cargando datos del empleado...</div>;
  }

  return (
    <div>
      <div style={{ textAlign: "left" }}>
        <p>
          <strong>Cédula:</strong> {empleado.cedula}
        </p>
        <p>
          <strong>Dirección:</strong> {empleado.direccion}
        </p>
        <p>
          <strong>Fecha de entrada:</strong> {empleado.fechaEntrada}
        </p>
        {empleado.fechaSalida && (
          <p>
            <strong>Fecha de salida:</strong> {empleado.fechaSalida}
          </p>
        )}
      </div>
      <div style={{ textAlign: "left" }}>
        <TelefonosEmpleado
          telefonos={telefonos}
          empleadoId={empleado.id}
          nombre={empleado.nombre}
        />
      </div>
    </div>
  );
};

export default DatosEmpleado;
