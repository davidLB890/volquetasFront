// src/api.js
import axios from 'axios';

//const API_URL = 'http://localhost:3000/api'; // Ajusta la URL según sea necesario
const API_URL = import.meta.env.VITE_API_URL;

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

export const eliminarEmpleado = (empleadoId, usuarioToken) => {
  return axios.delete(`${API_URL}/empleados/${empleadoId}`, {
    headers: {
      'Authorization': usuarioToken, 
      'Content-Type': 'application/json', 
    }
  });
};

export const cambiarEstadoEmpleado = (empleadoId, usuarioToken) => {
  return axios.post(`${API_URL}/empleados/${empleadoId}/estado`, {
    headers: {
      'Authorization': usuarioToken, 
      'Content-Type': 'application/json', 
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

export const obtenerEmpleado = (empleadoId) => {
  return axios.get(`${API_URL}/empleados/${empleadoId}`);
};

//USUARIOS
//check
export const loginUsuario = (email, password) => { 
  return axios.post(`${API_URL}/usuarios/login`, { email, password });
};

//check
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
export const obtenerCamiones = () => {
  return axios.get(`${API_URL}/camiones`);
};

export const crearCamion = (camion) => {
  return axios.post(`${API_URL}/camiones`, camion);
};
