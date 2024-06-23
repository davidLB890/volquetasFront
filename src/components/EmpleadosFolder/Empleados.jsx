import React, { useEffect, useState } from 'react';
import { obtenerEmpleados, eliminarEmpleado, cambiarEstadoEmpleado, putEmpleado } from '../../api';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Collapse } from 'react-bootstrap';
import useAuth from '../../hooks/useAuth';
import AlertMessage from "../AlertMessage";
import "../../styles/empleados.css";
import "../../styles/global.css"

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [cambios, setCambios] = useState(true);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroRol, setFiltroRol] = useState('');
  const [filtroCedula, setFiltroCedula] = useState('');
  const [editando, setEditando] = useState(null);
  const [formValues, setFormValues] = useState({ nombre: '', cedula: '', rol: ''});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [telefonosVisible, setTelefonosVisible] = useState({});

  let navigate = useNavigate();
  const getToken = useAuth();

  useEffect(() => {
    const usuarioToken = getToken();
    if (usuarioToken === null) {
      navigate("/login");
    } else {
      if (cambios) {
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
          if (error.status === 401) {
            navigate("/login");
          }
        }
      }
    }
  }, [cambios, getToken, navigate]);

  const eliminar = async (empleadoId) => {
    const usuarioToken = getToken();

    eliminarEmpleado(empleadoId, usuarioToken)
      .then((response) => {
        const datos = response.data;
        if (datos.error) {
          console.error(datos.error);
          setError(datos.error.message || "Error al eliminar el empleado");
          setTimeout(() => setError(""), 5000);
        } else {
          console.log(datos);
          setSuccess(datos.detalle);
          setError('');
          setCambios(true);
          setTimeout(() => setSuccess(''), 5000);
        }
      })
      .catch((error) => {
        console.error("Error al conectar con el servidor:", error.response.data.error);
        setError(error.response.data.error || "Error al eliminar el empleado");
        setSuccess('');
        setTimeout(() => setError(""), 5000);
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
      if (error.status === 401) {
        navigate("/login");
      }
      }
      };
      
  const modificar = (empleado) => {
    setEditando(empleado.id);
    setFormValues({ nombre: empleado.nombre, cedula: empleado.cedula, rol: empleado.rol })
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const aceptarCambio = async () => {
    const usuarioToken = getToken();
    try {
      const response = await putEmpleado(editando, formValues, usuarioToken);
      setCambios(true);
      setEditando(null);
      setSuccess("Empleado actualizado correctamente");
      setTimeout(() => setSuccess(''), 5000);
      console.log(response.data);
      const datos = response.data;

      console.log(datos);
    } catch (error) {
      console.error("Error al actualizar el camión:", error.response.data.error);
      setError(error.response.data.error || "Error al actualizar el empleado");
    }
  };

  const cancelarCambio = () => {
    setEditando(null);
  };


  const agregar = (empleadoId, empleadoNombre) => {
    navigate("/empleados/telefonos", { state: { id: empleadoId, nombre: empleadoNombre } });
  };

  const toggleTelefonos = (empleadoId) => {
    setTelefonosVisible(prevState => ({
      ...prevState,
      [empleadoId]: !prevState[empleadoId]
    }));
  };

  const empleadosFiltrados = empleados.filter((empleado) => {
    return (
      (filtroNombre === '' || empleado.nombre.toLowerCase().startsWith(filtroNombre.toLowerCase())) &&
      (filtroCedula === '' || empleado.cedula.toString().startsWith(filtroCedula)) &&
      (filtroRol === '' || empleado.rol === filtroRol)
    );
  });

  return (
    <div className="container">
      <div className='header'>
        <h1>Lista de Empleados</h1>
        <Button variant="primary" onClick={() => navigate("/empleados/crear")}>Nuevo Empleado</Button>
      </div>
      {error && <AlertMessage type="error" message={error} />}
      {success && <AlertMessage type="success" message={success} />}
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Nombre</th>
            <th scope="col">Cédula</th>
            <th scope="col">Rol</th>
            <th></th>
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
                <option value="chofer">Chofer</option>
                <option value="normal">Normal</option>
              </Form.Control>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {empleadosFiltrados.map((empleado, index) => (
            <React.Fragment key={empleado.id}>
              <tr>
                <th scope="row">{index + 1}</th>
                <td>
                  {editando === empleado.id ? (
                    <Form.Control
                      type="text"
                      name="nombre"
                      value={formValues.nombre}
                      onChange={handleInputChange}
                    />
                  ) : (
                    empleado.nombre
                  )}
                </td>
                <td>
                  {editando === empleado.id ? (
                    <Form.Control
                      type="text"
                      name="cedula"
                      value={formValues.cedula}
                      onChange={handleInputChange}
                    />
                  ) : (
                    empleado.cedula
                  )}
                </td>
                <td>
                  {editando === empleado.id ? (
                    <Form.Control
                      type="text"
                      name="rol"
                      value={formValues.rol}
                      onChange={handleInputChange}
                    />
                  ) : (
                    empleado.rol
                  )}
                </td>
                <td></td>
                <td>
                {editando === empleado.id ? (
                  <>
                  <Button variant="success" onClick={aceptarCambio}>Aceptar</Button>
                  <Button variant="secondary" onClick={cancelarCambio}>Cancelar</Button>
                </>
              ) : (
                <>
                  <Button variant="danger" onClick={() => eliminar(empleado.id)}>
                    Eliminar
                  </Button>
                  <Button variant="primary" onClick={() => modificar(empleado)}>
                    Modificar
                  </Button>
                  <Button variant="dark" onClick={() => toggleTelefonos(empleado.id)}>
                    Teléfonos
                  </Button>
                  <Button variant={empleado.habilitado ? 'secondary' : 'light'}
                    onClick={() => cambiarEstadoDelEmpleado(empleado.id)}
                    className="me-2">
                    {empleado.habilitado ? 'Deshabilitar' : 'Habilitar'}
                  </Button>
                </>
                )}
                </td>
              </tr>
              <tr>
                <td colSpan="7">
                  <Collapse in={telefonosVisible[empleado.id]}>
                    <div>
                      <ul>
                        {empleado.Telefonos.length > 0 ? (
                          empleado.Telefonos.map((telefono) => (
                            <li key={telefono.id}>{`${telefono.tipo}: ${telefono.telefono} (Ext: ${telefono.extension})`}</li>
                          ))
                        ) : (
                          <li>No tiene teléfonos registrados</li>
                        )}
                        <Button variant="secondary" onClick={() => agregar(empleado.id, empleado.nombre)}>
                          Agregar teléfono
                        </Button>
                      </ul>
                    </div>
                  </Collapse>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Empleados;