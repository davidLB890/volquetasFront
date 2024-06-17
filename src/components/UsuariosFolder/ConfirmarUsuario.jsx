import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { confirmarUsuario, obtenerUsuarios } from '../../api';
import { Button, Form } from 'react-bootstrap';
import useAuth from '../../hooks/useAuth';

const ConfirmarUsuario = () => {
  const navigate = useNavigate();
  const usuarioEmail = useRef(null);
  const [cambios, setCambios] = useState(false);
  const [filtroEmail, setFiltroEmail] = useState('');
  const [filtroRol, setFiltroRol] = useState('');
  //const [botonConfirmar, setBotonConfirmar] = useState(true);
  const [usuariosSinConfirmar, setUsuariosSinConfirmar] = useState([]);

  const getToken = useAuth();
  //let usuarioToken = localStorage.getItem('apiToken');
  
  useEffect(() => {
    const fetchUsuarios = async () => {
      const usuarioToken = getToken();
      if (!usuarioToken) {
        navigate("/login");
        return;
      }else if(localStorage.getItem('userRol') !== "admin"){
        navigate("/");
        return;
      }
  
      try {
        const response = await obtenerUsuarios(usuarioToken);
        const usuarios = response.data;
        setUsuariosSinConfirmar(usuarios.filter(usuario => !usuario.activo));
      } catch (error) {
        console.error("Error al obtener usuarios:", error.response ? error.response.data.error : error.message);
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      }
  }; 
    fetchUsuarios();
  }, [navigate, cambios, getToken]);
  
/*   useEffect(() => {
    let usuarioToken = getToken();
    if (!usuarioToken) {
      navigate("/login");
    }else{
      try {
        obtenerUsuarios(usuarioToken)
          .then((response) => {
            const usuarios = response.data;
            setUsuariosSinConfirmar(usuarios.filter(usuario => !usuario.activo));
          })  
          .catch((error) => {
            console.error("Error al obtener usuarios:", error.response.data.error);
            if(error.status === 401) {
              navigate("/login");
            }
          });
      } catch (error) {
        console.error("Error al obtener usuarios:", error.response.data.error);
        if(error.status === 401) {
          navigate("/login");
        }
      }
    }

  }, [navigate, getToken, cambios]); */

  const confirmar = async (usuarioEmail) => {
    let usuarioToken = getToken();
    try {
      const response = confirmarUsuario(usuarioEmail, usuarioToken);
      const datos = response.data;

      if (datos.error) {
        console.error(datos.error);
      } else {
        console.log("Usuario confirmado correctamente", datos);
        setCambios(true);
        // Realizar alguna acción adicional si es necesario
      }

    } catch (error) {
      console.error("Error al confirmar usuario:", error.data.error);
      if(error.status === 401) {
        navigate("/login");
      }
    }
  };

const usuariosFiltrados = usuariosSinConfirmar.filter((usuario) => {
  return (
    //(filtroNombre === '' || usuario.nombre.toLowerCase().startsWith(filtroNombre.toLowerCase())) &&
    (filtroEmail === '' || usuario.cedula.toString().startsWith(filtroEmail)) &&
    (filtroRol === '' || usuario.rol === filtroRol)
  );
});

return (
  <div className="container">
    <h1>Lista de Usuarios sin confirmar</h1>
    <table className="table table-striped">
      <thead>
        <tr>
          <th scope="col"></th>
{/*           <th scope="col">Nombre usuario</th> */}
          <th scope="col">Email</th>
          <th scope="col">Rol</th>
          <th scope="col">Acciones</th>
        </tr>
        <tr>
          <th></th>
{/*           <th>
            <Form.Control
              type="text"
              placeholder="Filtrar por Nombre"
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
            />
          </th> */}
          <th>
            <Form.Control
              type="text"
              placeholder="Filtrar por Email"
              value={filtroEmail}
              onChange={(e) => setFiltroEmail(e.target.value)}
            >
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
            {/* <td>{usuario.nombre}</td> */}
            <td>{usuario.email}</td>
            <td>{usuario.rol}</td>
            <td>
              <Button variant="danger" onClick={() => confirmar(usuario.email)}>
                Confirmar
              </Button>
              {/* <Button variant="danger" onClick={() => eliminar(usuario.id)}>
                Eliminar
              </Button> */}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
    /* <div className="d-flex justify-content-center h-100">
      <div className="card">
        <div className="card-header">
          <h3>Confirmar usuario</h3>
        </div>
        <div className="card-body">
          <form>
            <div className="input-group form-group" onChange={habilitarBoton}>
              <select ref={usuarioEmail} name="slcUsuario" id="usuSlc" className="form-control">
                <option value="">Seleccione usuario</option>
                {usuariosSinConfirmar.map(usu => <option key={usu.id} value={usu.email}> {usu.email} </option>)}
              </select>
            </div>
            <div className="form-group">
              <button type="button" className="btn btn-primary styled-button" onClick={confirmar} disabled={!botonConfirmar}>
                Confirmar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div> */
  );
}

export default ConfirmarUsuario;
