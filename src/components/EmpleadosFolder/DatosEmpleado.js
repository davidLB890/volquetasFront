import React, { useEffect, useState } from "react";
import TelefonosEmpleado from "./TelefonosEmpleado";
import CedulaDireccionEmpleado from "./CedulaDireccionEmpleado";
import { obtenerEmpleado } from "../../api";
import useAuth from "../../hooks/useAuth";

const DatosEmpleado = ({ idEmpleado }) => {
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
  }, [idEmpleado, getToken]);

  if (!empleado) {
    return <div>Cargando datos del empleado...</div>;
  }

  return (
    <div>
      <div>
        <CedulaDireccionEmpleado empleado={empleado} />
      </div>
      <div>
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
