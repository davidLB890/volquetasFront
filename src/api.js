// src/api.js
import axios from 'axios';

//const API_URL = 'http://localhost:3000/api'; // Ajusta la URL según sea necesario
const API_URL = process.env.REACT_APP_API_URL;


const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // Puedes ajustar el tiempo de espera según tus necesidades
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Errores de respuesta del servidor (códigos 4xx y 5xx)
      //console.error(error.response.status, error.response.data);
      return Promise.reject(error.response.data); // Devolvemos el error específico de la respuesta
    } else if (error.request) {
      // Errores de solicitud (sin respuesta del servidor)
      console.error('Error de solicitud', error.request);
      return Promise.reject({ error: 'No se pudo conectar con el servidor. Inténtelo más tarde.' });
    } else {
      // Otros errores
      console.error('Error', error.message);
      return Promise.reject({ error: 'Ocurrió un error inesperado. Inténtelo más tarde.' });
    }
  }
);





//EMPLEADOS
//check 
export const crearEmpleado = (empleado, usuarioToken) => { 
  return axios.post(`${API_URL}/empleados`, empleado, {
    headers: {
      'Authorization': usuarioToken, 
      'Content-Type': 'application/json', 
    }
  });
}

//check
export const eliminarEmpleado = (empleadoId, usuarioToken) => {
  return axios.delete(`${API_URL}/empleados/${empleadoId}`, {
    headers: {
      'Authorization': usuarioToken,
      'Content-Type': 'application/json',
    },
  });
};

//check
  export const cambiarEstadoEmpleado = (empleadoId, usuarioToken) => {

    let hoy = new Date();
    let fechaSalida = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

    return axios.patch(`${API_URL}/empleados/${empleadoId}/estado`, {fechaSalida}, {
      headers: {
        'Authorization': usuarioToken, 
      }
    });
  };

//chek
export const obtenerEmpleados = (usuarioToken) => {
  return axios.get(`${API_URL}/empleados`, {
      headers: {
        'Authorization': usuarioToken, 
        'Content-Type': 'application/json', 
      }
    });
};

//check
export const obtenerEmpleado = (empleadoId, usuarioToken) => {
  return axios.get(`${API_URL}/empleados/${empleadoId}`, {
    headers: {
      'Authorization': usuarioToken, 
    }
  });
};
//check
export const getEmpleadosSinUsuario = () => {
  return axios.get(`${API_URL}/empleados/sin-usuario-activos`, {
    headers: {
      'Content-Type': 'application/json', 
    }
  })};

export const putEmpleado = (empleadoId, empleado, usuarioToken) => {
  return axios.put(`${API_URL}/empleados/${empleadoId}`, empleado, {
    headers: {
      'Authorization': usuarioToken, 
    }
  });
}





//USUARIOS
//check
export const loginUsuario = (email, password) => { 
  return api.post(`${API_URL}/usuarios/login`, { email, password });
};

//check
//hacer que no se vean los usuarios que ya cuentan con una cuenta
export const crearUsuario = (usuario) => { 
  return axios.post(`${API_URL}/usuarios`, usuario);
}

//check
export const confirmarUsuario = (email, usuarioToken) => {
  return axios.post(`${API_URL}/usuarios/confirmar`, { email }, {
    headers: {
      'Authorization': usuarioToken, 
      'Content-Type': 'application/json', 
    }
  });
};

//check
export const obtenerUsuarios = (usuarioToken) => { 
    return axios.get(`${API_URL}/usuarios`, {
      headers: {
        'Authorization': usuarioToken, 
        'Content-Type': 'application/json', 
      }
    });
};




//CAMIONES
//check
export const getCamiones = (usuarioToken) => {
  return axios.get(`${API_URL}/camiones`, {
    headers: {
      'Authorization': usuarioToken, 
      'Content-Type': 'application/json', 
    }
  });
}

export const getCamioneId = (camionId, usuarioToken) => {
  return axios.get(`${API_URL}/camiones${camionId}`, {
    headers: {
      'Authorization': usuarioToken, 
      'Content-Type': 'application/json', 
    }
  });
}

//check
export const crearCamion = (camion, usuarioToken) => {
  return axios.post(`${API_URL}/camiones`, camion, {
    headers: {
      'Authorization': usuarioToken, 
      'Content-Type': 'application/json', 
    }
  });
};

//check
export const deleteCamion = (camionId, usuarioToken) => {
  return axios.delete(`${API_URL}/camiones/${camionId}`, {
    headers: {
      'Authorization': usuarioToken,
      'Content-Type': 'application/json',
    },
  });
};

export const putCamion = (camionId, camion, usuarioToken) => {
  return axios.put(`${API_URL}/camiones/${camionId}`, camion, {
    headers: {
      'Authorization': usuarioToken, 
    }
  });
};



//HISTÓRICO-CAMION

export const getHistoricoCamionActual = (usuarioToken) => {
  return axios.get(`${API_URL}/historico-camion/asignacion`, {
    headers: {
      'Authorization': usuarioToken, 
      'Content-Type': 'application/json', 
    }
  });
}

export const getHistoricoCamion = (camionId, usuarioToken) => {
  return axios.get(`${API_URL}/historico-camion?camionId=${camionId}`, {
    headers: {
      'Authorization': usuarioToken, 
      'Content-Type': 'application/json', 
    }
  });
}
export const getHistoricoChofer = (empleadoId, usuarioToken) => {
  console.log("id chofer " + empleadoId)
  return axios.get(`${API_URL}/historico-camion?empleadoId=${empleadoId}`, {
    headers: {
      'Authorization': usuarioToken,
      'Content-Type': 'application/json',
    }
  });
};



export const postHistoricoCamion = (camionId, choferId, fechaInicio, usuarioToken) => {
  const body = {
    camionId: camionId,
    empleadoId: choferId,
    fechaInicio: fechaInicio
  };
  return axios.post(`${API_URL}/historico-camion`, body, {
    headers: {
      'Authorization': usuarioToken, 
      'Content-Type': 'application/json', 
    }
  });
}




//SERVICIOS
export const postServicio = (servicio, usuarioToken) => {
  return axios.post(`${API_URL}/servicios`, servicio, {
    headers: {
      'Authorization': usuarioToken, 
      'Content-Type': 'application/json', 
    }
  });
}

export const getServicioPorCamion = (camionId, usuarioToken) => {
  return axios.get(`${API_URL}/servicios/${camionId}`, {
    headers: {
      'Authorization': usuarioToken, 
      'Content-Type': 'application/json', 
    }
  });
};




//JORNALES
  export const getJornalesEmpleado = (empleadoId, fechaInicio, fechaFin, usuarioToken) => {
    return axios.get(`${API_URL}/jornales/${empleadoId}/${fechaInicio}/${fechaFin}`, {
      headers: {
        'Authorization': usuarioToken, 
        'Content-Type': 'application/json', 
      }
    });
  }

export const getDatosJornales = (fechaInicio, fechaFin, usuarioToken) => {
  return axios.get(`${API_URL}/datos/todos/${fechaInicio}/${fechaFin}`, {
    headers: {
      'Authorization': usuarioToken, 
      'Content-Type': 'application/json', 
    }
  });
}

export const getDatosJornalEmpleado = (empleadoId, fechaInicio, fechaFin, usuarioToken) => {
  return axios.get(`${API_URL}/datos/${empleadoId}/${fechaInicio}/${fechaFin}`, {
    headers: {
      'Authorization': usuarioToken, 
      'Content-Type': 'application/json', 
    }
  });
}


export const postJornal = (jornal, usuarioToken) => {
  return axios.post(`${API_URL}/jornales`, jornal, {
    headers: {
      'Authorization': usuarioToken, 
      'Content-Type': 'application/json', 
    }
  });
};

export const deleteJornal = (jornalId, usuarioToken) => {
  return axios.delete(`${API_URL}/jornales/${jornalId}`, {
    headers: {
      'Authorization': usuarioToken,
      'Content-Type': 'application/json',
    },
  });
};

export const putJornal = (jornalId, jornal, usuarioToken) => {
  return axios.put(`${API_URL}/jornales/${jornalId}`, jornal, {
    headers: {
      'Authorization': usuarioToken, 
    }
  });
};


//TELÉFONOS
export const postTelefono = (telefonoData, usuarioToken) => {
  return axios.post(`${API_URL}/telefonos`, telefonoData, {
    headers: {
      'Authorization': usuarioToken,
      'Content-Type': 'application/json',
    }
  });
};




//CLIENTES
//Particulares
export const getParticulares = (usuarioToken) => {
  return axios.get(`${API_URL}/particulares`, {
    headers: {
      'Authorization': usuarioToken, 
      'Content-Type': 'application/json', 
    }
  });
}

export const postParticular = (particular, usuarioToken) => {
  return axios.post(`${API_URL}/particulares`, particular, {
    headers: {
      'Authorization': usuarioToken, 
      'Content-Type': 'application/json', 
    }
  });
}

//Empresas
export const getEmpresas = (usuarioToken) => {
  return axios.get(`${API_URL}/empresas`, {
    headers: {
      'Authorization': usuarioToken, 
      'Content-Type': 'application/json', 
    }
  });
}

export const postEmpresa = (empresa, usuarioToken) => {
  return axios.post(`${API_URL}/empresas`, empresa, {
    headers: {
      'Authorization': usuarioToken, 
      'Content-Type': 'application/json', 
    }
  });
}

//Contacto-Empresa
export const getContactoEmpresa = (usuarioToken) => {
  return axios.get(`${API_URL}/contacto-empresas`, {
    headers: {
      'Authorization': usuarioToken, 
      'Content-Type': 'application/json', 
    }
  });
}