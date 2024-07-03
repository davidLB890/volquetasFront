import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { confirmarUsuario, obtenerUsuarios } from '../../api';
import { Button, Form } from 'react-bootstrap';
import useAuth from '../../hooks/useAuth';
import AlertMessage from '../AlertMessage'; // Asegúrate de importar tu componente AlertMessage

const ConfirmarUsuario = () => {
  const navigate = useNavigate();
  const [cambios, setCambios] = useState(false);
  const [filtroEmail, setFiltroEmail] = useState('');
  const [filtroRol, setFiltroRol] = useState('');
  const [usuariosSinConfirmar, setUsuariosSinConfirmar] = useState([]);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getToken = useAuth();
  
  useEffect(() => {
    const fetchUsuarios = async () => {
      const usuarioToken = getToken();
      if (!usuarioToken) {
        navigate("/login");
        return;
      } else if (localStorage.getItem('userRol') !== "admin") {
        navigate("/");
        return;
      }
  
      try {
        const response = await obtenerUsuarios(usuarioToken);
        const usuarios = response.data;
        setUsuariosSinConfirmar(usuarios.filter(usuario => !usuario.activo));
      } catch (error) {
        console.error("Error al obtener usuarios:", error.response?.data?.error || error.message);
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      }
    }; 
    fetchUsuarios();
  }, [navigate, cambios, getToken]);

  const confirmar = async (usuarioEmail) => {
    const usuarioToken = getToken();
    try {
      const response = await confirmarUsuario(usuarioEmail, usuarioToken);
      const datos = response.data;

      if (datos.error) {
        console.error(datos.error); 
      } else {
        console.log("Usuario confirmado correctamente", datos);
        setSuccess("Usuario confirmado correctamente");
        setCambios(prev => !prev); // Toggle cambios para refrescar la lista
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      setError(errorMessage);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const usuariosFiltrados = usuariosSinConfirmar.filter((usuario) => {
    return (
      (filtroEmail === '' || usuario.email.toString().startsWith(filtroEmail)) &&
      (filtroRol === '' || usuario.rol === filtroRol)
    );
  });

  return (
    <div className="container card">
      <h1>Lista de Usuarios sin confirmar</h1>
      <AlertMessage type="error" message={error} />
      <AlertMessage type="success" message={success} />
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Email</th>
            <th scope="col">Rol</th>
            <th scope="col">Acciones</th>
          </tr>
          <tr>
            <th></th>
            <th>
              <Form.Control
                type="text"
                placeholder="Filtrar por Email"
                value={filtroEmail}
                onChange={(e) => setFiltroEmail(e.target.value)}
              />
            </th>
            <th>
              <Form.Control
                as="select"
                value={filtroRol}
                onChange={(e) => setFiltroRol(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="admin">Admin</option>
                <option value="normal">Normal</option>
              </Form.Control>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map((usuario, index) => (
            <tr key={usuario.id}>
              <th scope="row">{index + 1}</th>
              <td>{usuario.email}</td>
              <td>{usuario.rol}</td>
              <td>
                <Button variant="danger" onClick={() => confirmar(usuario.email)}>
                  Confirmar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ConfirmarUsuario;

