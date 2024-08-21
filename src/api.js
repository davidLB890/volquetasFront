// src/api.js
import axios from "axios";

//const API_URL = 'http://localhost:3000/api'; // Ajusta la URL según sea necesario
const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // Puedes ajustar el tiempo de espera según tus necesidades
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Errores de respuesta del servidor (códigos 4xx y 5xx)
      //console.error(error.response.status, error.response.data);
      return Promise.reject(error.response.data); // Devolvemos el error específico de la respuesta
    } else if (error.request) {
      // Errores de solicitud (sin respuesta del servidor)
      //console.error("Error de solicitud", error.request);
      return Promise.reject({
        error: "No se pudo conectar con el servidor. Inténtelo más tarde.",
      });
    } else {
      // Otros errores
      //console.error("Error", error.message);
      return Promise.reject({
        error: "Ocurrió un error inesperado. Inténtelo más tarde.",
      });
    }
  }
);




//EMPLEADOS
export const crearEmpleado = (empleado, usuarioToken) => {
  return axios.post(`${API_URL}empleados`, empleado, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const eliminarEmpleado = (empleadoId, usuarioToken) => {
  return axios.delete(`${API_URL}empleados/${empleadoId}`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const cambiarEstadoEmpleado = (fechaSalida, empleadoId, usuarioToken) => {
  return axios.patch(
    `${API_URL}empleados/${empleadoId}/estado`,
    { fechaSalida },
    {
      headers: {
        Authorization: usuarioToken,
      },
    }
  );
};
export const obtenerEmpleados = (usuarioToken) => {
  return axios.get(`${API_URL}empleados`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const obtenerEmpleado = (empleadoId, usuarioToken) => {
  return axios.get(`${API_URL}empleados/${empleadoId}`, {
    headers: {
      Authorization: usuarioToken,
    },
  });
};
export const getEmpleadosSinUsuario = () => {
  return axios.get(`${API_URL}empleados/sin-usuario-activos`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const putEmpleado = (empleadoId, empleado, usuarioToken) => {
  return axios.put(`${API_URL}empleados/${empleadoId}`, empleado, {
    headers: {
      Authorization: usuarioToken,
    },
  });
};




//USUARIOS
export const loginUsuario = (email, password) => {
  return api.post(`${API_URL}usuarios/login`, { email, password });
};
export const crearUsuario = (usuario) => {
  return axios.post(`${API_URL}usuarios`, usuario);
};
export const confirmarUsuario = (email, usuarioToken) => {
  return axios.post(
    `${API_URL}usuarios/confirmar`,
    { email },
    {
      headers: {
        Authorization: usuarioToken,
        "Content-Type": "application/json",
      },
    }
  );
};
export const obtenerUsuarios = (usuarioToken) => {
  return axios.get(`${API_URL}usuarios`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const cambiarContrasenaAdministrador = (email, newPassword, confirmNewPassword, usuarioToken) => {
  return axios.put(
    `${API_URL}usuarios-contrasenia-admin`,
    { email, newPassword, confirmNewPassword },
    {
      headers: {
        Authorization: usuarioToken,
        "Content-Type": "application/json",
      },
    }
  );
}
export const cambiarContrasena = (email, oldPassword, newPassword, confirmNewPassword, usuarioToken) => {
  return axios.put(
    `${API_URL}usuarios-contrasenia`,
    { email, oldPassword, newPassword, confirmNewPassword },
    {
      headers: {
        Authorization: usuarioToken,
        "Content-Type": "application/json",
      },
    }
  );
}




//CAMIONES
export const getCamiones = (usuarioToken) => {
  return axios.get(`${API_URL}camiones`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const getCamioneId = (camionId, usuarioToken) => {
  return axios.get(`${API_URL}camiones${camionId}`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const crearCamion = (camion, usuarioToken) => {
  return axios.post(`${API_URL}camiones`, camion, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const deleteCamion = (camionId, usuarioToken) => {
  return axios.delete(`${API_URL}camiones/${camionId}`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const putCamion = (camionId, camion, usuarioToken) => {
  return axios.put(`${API_URL}camiones/${camionId}`, camion, {
    headers: {
      Authorization: usuarioToken,
    },
  });
};




//HISTÓRICO-CAMION
export const getHistoricoCamionActual = (usuarioToken) => {
  return axios.get(`${API_URL}historico-camion/asignacion`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const getHistoricoCamion = (camionId, usuarioToken) => {
  return axios.get(`${API_URL}historico-camion?camionId=${camionId}`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const getHistoricoChofer = (empleadoId, usuarioToken) => {
  console.log("id chofer " + empleadoId);
  return axios.get(`${API_URL}historico-camion?empleadoId=${empleadoId}`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const postHistoricoCamion = (
  camionId,
  choferId,
  fechaInicio,
  usuarioToken
) => {
  const body = {
    camionId: camionId,
    empleadoId: choferId,
    fechaInicio: fechaInicio,
  };
  return axios.post(`${API_URL}historico-camion`, body, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};




//SERVICIOS
export const postServicio = (servicio, usuarioToken) => {
  return axios.post(`${API_URL}servicios`, servicio, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const getServicioPorCamion = (camionId, usuarioToken) => {
  return axios.get(`${API_URL}servicios/${camionId}`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const getServicioPorCamionFecha = (camionId, mes, anio, usuarioToken) => {
  return axios.get(`${API_URL}servicios/mensuales`, {
    params: {
      month: mes,
      year: anio,
      camionId: camionId
    },
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
}
export const deleteServicio = (servicioId, usuarioToken) => {
  return axios.delete(`${API_URL}servicios/${servicioId}`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
}


//JORNALES
export const getJornalesEmpleado = (empleadoId, fechaInicio, fechaFin,usuarioToken) => {
  return axios.get(
    `${API_URL}jornales/${empleadoId}/${fechaInicio}/${fechaFin}`,
    {
      headers: {
        Authorization: usuarioToken,
        "Content-Type": "application/json",
      },
    }
  );
};
export const getDatosJornales = (fechaInicio, fechaFin, usuarioToken) => {
  return axios.get(`${API_URL}datos/todos/${fechaInicio}/${fechaFin}`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const getDatosJornalEmpleado = (
  empleadoId,
  fechaInicio,
  fechaFin,
  usuarioToken
) => {
  return axios.get(
    `${API_URL}datos/${empleadoId}/${fechaInicio}/${fechaFin}`,
    {
      headers: {
        Authorization: usuarioToken,
        "Content-Type": "application/json",
      },
    }
  );
};
export const postJornal = (jornal, usuarioToken) => {
  return axios.post(`${API_URL}jornales`, jornal, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const deleteJornal = (jornalId, usuarioToken) => {
  return axios.delete(`${API_URL}jornales/${jornalId}`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const putJornal = (jornalId, jornal, usuarioToken) => {
  return axios.put(`${API_URL}jornales/${jornalId}`, jornal, {
    headers: {
      Authorization: usuarioToken,
    },
  });
};




//TELÉFONOS
export const postTelefono = (telefonoData, usuarioToken) => {
  return axios.post(`${API_URL}telefonos`, telefonoData, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const putTelefono = (telefonoId, telefonoData, usuarioToken) => {
  return axios.put(`${API_URL}telefonos/${telefonoId}`, telefonoData, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const deleteTelefono = (telefonoId, usuarioToken) => {
  return axios.delete(`${API_URL}telefonos/${telefonoId}`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
}


//CLIENTES
//Particulares
export const getParticulares = (usuarioToken) => {
  return axios.get(`${API_URL}particulares`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const postParticular = (particular, usuarioToken) => {
  return axios.post(`${API_URL}particulares`, particular, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const getParticularId = (particularId, usuarioToken) => {
  return axios.get(`${API_URL}particulares/${particularId}`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const getParticularLetra = (letra, usuarioToken) => {
  return axios.get(`${API_URL}particulares/buscar?letraInicial=${letra}`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const getParticularNombre = (nombre, usuarioToken) => {
  return axios.get(`${API_URL}particulares/buscar?nombre=${nombre}`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
}
export const putParticular = (particularId, particular, usuarioToken) => {
  return axios.put(`${API_URL}particulares/${particularId}`, particular, {
    headers: {
      Authorization: usuarioToken,
    },
  });
}
export const deleteParticular = (particularId, usuarioToken) => {
  return axios.delete(`${API_URL}particulares/${particularId}`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
}
//Empresas
export const getEmpresas = (usuarioToken) => {
  return axios.get(`${API_URL}empresas`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const getEmpresasLetra = (letra, usuarioToken) => {
  return axios.get(`${API_URL}empresas/buscar?letraInicial=${letra}`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const getEmpresasNombre = (nombre, usuarioToken) => {
  return axios.get(`${API_URL}empresas/buscar?nombre=${nombre}`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
}
export const getEmpresaId = (empresaId, usuarioToken) => {
  return axios.get(`${API_URL}empresas/${empresaId}`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
}
export const postEmpresa = (empresa, usuarioToken) => {
  return axios.post(`${API_URL}empresas`, empresa, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const putEmpresa = (empresaId, empresa, usuarioToken) => {
  return axios.put(`${API_URL}empresas/${empresaId}`, empresa, {
    headers: {
      Authorization: usuarioToken,
    },
  });
}
export const deleteEmpresa = (empresaId, usuarioToken) => {
  return axios.delete(`${API_URL}empresas/${empresaId}`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
}
//Contacto-Empresa
export const getContactoEmpresa = (usuarioToken) => {
  return axios.get(`${API_URL}contacto-empresas`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const postContactoEmpresa = (contactoEmpresa, usuarioToken) => {
  return axios.post(`${API_URL}contacto-empresas`, contactoEmpresa, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const asignarContactoEmpresa = (contactoId, obraId, usuarioToken) => {
  return axios.put(`${API_URL}contacto-empresas/asignar/${contactoId}`, { obraId }, {
    headers: {
      Authorization: usuarioToken,
    },
  });
};
export const deleteContactoEmpresa = (contactoId, usuarioToken) => {
  return axios.delete(`${API_URL}contacto-empresas/${contactoId}`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
}
export const putContactoEmpresa = (contactoId, contactoEmpresa, usuarioToken) => {
  return axios.put(`${API_URL}contacto-empresas/${contactoId}`, contactoEmpresa, {
    headers: {
      Authorization: usuarioToken,
    },
  });
}




//OBRAS
export const getObras = (usuarioToken) => {
  return axios.get(`${API_URL}obras`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const getObrasMeses = (cantidadMeses, usuarioToken) => {
  return axios.get(`${API_URL}obras-ultimos-meses`, {
    params: {
      cantidadMeses: cantidadMeses, 
    },
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const getObraId = (obraId, usuarioToken) => {
  return axios.get(`${API_URL}obras/${obraId}`, {
    params: {
      detalle: "si",
    },
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const postObra = (obra, usuarioToken) => {
  return axios.post(`${API_URL}obras`, obra, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const putObra = (obraId, obra, usuarioToken) => {
  return axios.put(`${API_URL}obras/${obraId}`, obra, {
    headers: {
      Authorization: usuarioToken,
    },
  });
};
export const putObraDetalle = (obraId, obra, usuarioToken) => {
  console.log(obraId, obra)
  return axios.put(`${API_URL}obras-detalle/${obraId}`, obra, {
    headers: {
      Authorization: usuarioToken,
    },
  });
};
export const deleteObra = (obraId, usuarioToken) => {
  return axios.delete(`${API_URL}obras/${obraId}`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};




//PERMISOS
export const getPermisos = (usuarioToken) => {
  return axios.get(`${API_URL}permisos`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const getPermisoIdEmpresa = (empresaId, usuarioToken) => {
  return axios.get(`${API_URL}permisos/empresa/${empresaId}`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const getPermisoIdParticular = (particularId, usuarioToken) => {
  return axios.get(`${API_URL}permisos/particular/${particularId}`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const getPermisoIdFiltro = (permisoId, usuarioToken, {fechaInicio, fechaFin}) => {
  return axios.get(`${API_URL}permisos/${permisoId}`, {
    params: {
      fechaInicio,
      fechaFin,
    },
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const postPermiso = (permiso, usuarioToken) => {
  return axios.post(`${API_URL}permisos`, permiso, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
}
export const putPermiso = (permisoId, permiso, usuarioToken) => {
  return axios.put(`${API_URL}permisos/${permisoId}`, permiso, {
    headers: {
      Authorization: usuarioToken,
    },
  });
}
export const deletePermiso = (permisoId, usuarioToken) => {
  return axios.delete(`${API_URL}permisos/${permisoId}`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
}



//PEDIDOS
export const getPedidos = (usuarioToken) => {
  return axios.get(`${API_URL}pedidos-filtro`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const getPedidosFiltro = (usuarioToken, { estado, fechaInicio, fechaFin, tipoHorario, empresaId, particularId, obraId, choferId }) => {
  return axios.get(`${API_URL}pedidos-filtro`, {
    params: {
      estado,
      fechaInicio,
      fechaFin,
      tipoHorario,
      empresaId,
      particularId,
      obraId,
      choferId,
    },
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const getPedidosPorEmpresa = (empresaId, usuarioToken) => {
  return axios.get(`${API_URL}pedidos/empresa/${empresaId}`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
}
export const getPedidoId = (pedidoId, usuarioToken) => {
  return axios.get(`${API_URL}pedidos/${pedidoId}`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const getPedidosMultiples = (pedidoId, usuarioToken) => {
  return axios.get(`${API_URL}pedidos-multiples/${pedidoId}`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
}
export const postPedidoNuevo = (pedido, usuarioToken) => {
  return axios.post(`${API_URL}pedidos/nuevo`, pedido, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const postPedidoMultiple = (pedido, usuarioToken) => {
  return axios.post(`${API_URL}pedidos/multiple`, pedido, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const postPedidoEntregaLevante = (pedido, usuarioToken) => {
  return axios.post(`${API_URL}pedidos/entrega-levante`, pedido, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const postPedidoRecambio = (pedido, usuarioToken) => {
  console.log(pedido)
  return axios.post(`${API_URL}pedidos/recambio`, pedido, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const putPedido = (pedidoId, pedido, usuarioToken) => {
  return axios.put(`${API_URL}pedidos/${pedidoId}`, pedido, {
    headers: {
      Authorization: usuarioToken,
    },
  });
}
export const putPedidoPermiso = (pedidoId, permisoId, usuarioToken) => {
  return axios.put(`${API_URL}pedidos-permiso/${pedidoId}`, { permisoId }, {
    headers: {
      Authorization: usuarioToken,
    },
  });
}
export const deletePedidoId = (pedidoId, body, usuarioToken) => {
  return axios.delete(`${API_URL}pedidos/${pedidoId}`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
    data: body,
  });
}




//VOLQUETAS
export const getVolquetas = (usuarioToken) => {
  return axios.get(`${API_URL}volquetas`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const getVolquetaId = (volquetaId, usuarioToken, fechaInicio, fechaFin) => {
  let url = `${API_URL}/volquetas/${volquetaId}`;
  if (fechaInicio && fechaFin) {
    url += `?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
  }
  return axios.get(url, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });

};
export const postVolquetaAPI = (volqueta, usuarioToken) => {
  return axios.post(`${API_URL}volquetas`, volqueta, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const putVolquetaAPI = (volquetaId, volqueta, usuarioToken) => {
  return axios.put(`${API_URL}volquetas/${volquetaId}`, volqueta, {
    headers: {
      Authorization: usuarioToken,
    },
  });
};
export const deleteVolquetaAPI = (volquetaId, usuarioToken) => {
  return axios.delete(`${API_URL}volquetas/${volquetaId}`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const ubicacionTemporalVolqueta = (volquetaId, ubicacionTemporal, usuarioToken) => {
  return axios.put(`${API_URL}volquetas-ubicacion/${volquetaId}`, { ubicacionTemporal }, {
    headers: {
      Authorization: usuarioToken,
    },
  });
};
export const volquetasVencidas = (usuarioToken) => {
  return axios.get(`${API_URL}volquetas-48hs`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
}




//PAGO-PEDIDO
export const putPagoPedidos = (pedidoId, pago, usuarioToken) => {
  return axios.put(`${API_URL}pago-pedidos/${pedidoId}`, pago, {
    headers: {
      Authorization: usuarioToken,
    },
  });
};


//MOVIMIENTOS
export const postMovimiento = (movimiento, usuarioToken) => {
  return axios.post(`${API_URL}movimientos`, movimiento, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
}
export const putMovimiento = (movimientoId, movimiento, usuarioToken) => {
  return axios.put(`${API_URL}movimientos/${movimientoId}`, movimiento, {
    headers: {
      Authorization: usuarioToken,
    },
  });
}
export const deleteMovimientoAPI = (movimientoId, usuarioToken) => {
  return axios.delete(`${API_URL}movimientos/${movimientoId}`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
}

//SUGERENCIAS
export const postSugerencia = (sugerencia, usuarioToken) => {
  return axios.post(`${API_URL}sugerencias`, sugerencia, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
}
export const putSugerencia = (sugerenciaId, sugerencia, usuarioToken) => {
  return axios.put(`${API_URL}sugerencias/${sugerenciaId}`, sugerencia, {
    headers: {
      Authorization: usuarioToken,
    },
  }); 
}
export const deleteSugerenciaAPI = (sugerenciaId, usuarioToken) => {
  return axios.delete(`${API_URL}sugerencias/${sugerenciaId}`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
}
export const verificarSugerencia = (choferId, horario, usuarioToken) => {
  return axios.get(`${API_URL}sugerencias/verificar`, {
    params: {
      choferId,
      horario,
    },
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
}

//ESTADISTICAS
export const getDeudoresEstadisticas = (fechaInicio, fechaFin, tipo, deudores, usuarioToken) => {
  return axios.get(`${API_URL}estadisticas-deudores`, {
    params: {
      fechaInicio,
      fechaFin,
      tipo,
      deudores,
    },
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
}
export const getClienteEstadisticas = (fechaInicio, fechaFin, empresaId, particularId, estado, usuarioToken) => {
  return axios.get(`${API_URL}estadisticas-cliente`, {
    params: {
      fechaInicio,
      fechaFin,
      empresaId,
      particularId,
      estado,
    },
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const getClientesEstadisticas = (fechaInicio, fechaFin, estado, usuarioToken) => {
  return axios.get(`${API_URL}estadisticas-cliente`, {
    params: {
      fechaInicio,
      fechaFin,
      estado,
    },
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
};
export const getChoferEstadisticas = (choferId, fechaInicio, fechaFin, valorJornal, valorExtra, usuarioToken) => {
  return axios.get(`${API_URL}estadisticas-chofer/${choferId}`, {
    params: {
      fechaInicio,
      fechaFin,
      valorJornal,
      valorExtra,
    },
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
}
export const getEstadisticasPedidos = (fechaInicio, fechaFin, usuarioToken) => {
  return axios.get(`${API_URL}estadisticas-pedidos`, {
    params: {
      fechaInicio,
      fechaFin,
    },
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
}


//FACTURAS
export const postFactura = (factura, usuarioToken) => {
  return axios.post(`${API_URL}facturas`, factura, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
}

export const getFacturas = (fechaInicio, fechaFin, ultimo, empresaId, particularId, estado, usuarioToken) => { 
  return axios.get(`${API_URL}facturas`, {
    params: {
      fechaInicio,
      fechaFin,
      ultimo,
      empresaId,
      particularId,
      estado
    },
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
}

export const getFacturaId = (facturaId, usuarioToken) => {
  return axios.get(`${API_URL}facturas/${facturaId}`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
}

export const putFacturaRecalcular = (facturaId, fechaPago, usuarioToken) => {
  return axios.put(`${API_URL}facturas-recalcular/${facturaId}`, { fechaPago }, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
}

export const putFactura = (facturaId, factura, usuarioToken) => {
  return axios.put(`${API_URL}facturas/${facturaId}`, factura, {
    headers: {
      Authorization: usuarioToken,
    },
  });
}

export const putFacturaEstado = (facturaId, estado, usuarioToken) => {
  return axios.put(`${API_URL}facturas-estado/${facturaId}`, estado, {
    headers: {
      Authorization: usuarioToken,
    },
  });
}

export const deleteFactura = (facturaId, usuarioToken) => {
  return axios.delete(`${API_URL}facturas/${facturaId}`, {
    headers: {
      Authorization: usuarioToken,
      "Content-Type": "application/json",
    },
  });
}

//CAJAS
export const obtenerCajas = (fechaInicio, fechaFin, usuarioToken) => {
  return axios.get(`${API_URL}cajas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, {
    headers: {
      Authorization: usuarioToken,
      'Content-Type': 'application/json',
    },
  });
};
export const postCaja = (caja, usuarioToken) => {
  return axios.post(`${API_URL}cajas`, caja, {
    headers: {
      Authorization: usuarioToken,
      'Content-Type': 'application/json',
    },
  });
}
export const putCaja = (cajaId, caja, usuarioToken) => {
  return axios.put(`${API_URL}cajas/${cajaId}`, caja, {
    headers: {
      Authorization: usuarioToken,
    },
  });
}
export const deleteCaja = (cajaId, usuarioToken) => {
  return axios.delete(`${API_URL}cajas/${cajaId}`, {
    headers: {
      Authorization: usuarioToken,
      'Content-Type': 'application/json',
    },
  });
}
