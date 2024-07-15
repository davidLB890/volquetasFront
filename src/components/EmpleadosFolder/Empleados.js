import React, { useState, useEffect } from "react";
import { eliminarEmpleado } from "../../api";
import { useNavigate } from "react-router-dom";
import { Button, Form, Alert, Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import useAuth from "../../hooks/useAuth";
import DatosEmpleado from "./DatosEmpleado";
import ModificarEmpleado from "./ModificarEmpleado";
import HabilitarDeshabilitarEmpleado from "./HabilitarDeshabilitarEmpleado";
import "../../assets/css/tituloBoton.css";
import { fetchEmpleados } from "../../features/empleadosSlice";

const Empleados = () => {
  const empleados = useSelector((state) => state.empleados.empleados);
  const dispatch = useDispatch();
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroRol, setFiltroRol] = useState("");
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [showModificarEmpleado, setShowModificarEmpleado] = useState(false);
  const [showDatosEmpleado, setShowDatosEmpleado] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const rolUsuario = localStorage.getItem("userRol");

  let navigate = useNavigate();
  const getToken = useAuth();

  useEffect(() => {
    const usuarioToken = getToken();
    if (!usuarioToken) {
      navigate("/login");
    }
  }, [getToken, navigate]);

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
          setError("");
          dispatch(fetchEmpleados(usuarioToken)); // Refrescar la lista de empleados después de eliminar
          setTimeout(() => setSuccess(""), 5000);
        }
      })
      .catch((error) => {
        console.error(
          "Error al conectar con el servidor:",
          error.response.data.error
        );
        setError(error.response.data.error || "Error al eliminar el empleado");
        setSuccess("");
        setTimeout(() => setError(""), 5000);
      });
  };

  const confirmarEliminar = (empleado) => {
    setEmpleadoSeleccionado(empleado);
    setShowConfirmModal(true);
  };

  const handleConfirmEliminar = () => {
    eliminar(empleadoSeleccionado.id);
    setShowConfirmModal(false);
  };

  const modificar = (empleado) => {
    setEmpleadoSeleccionado(empleado);
    setShowModificarEmpleado(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch({
      type: 'empleados/updateEmpleado',
      payload: { id: editando, name, value }
    });
  };

  const toggleDatosEmpleado = (empleado) => {
    if (empleadoSeleccionado && empleadoSeleccionado.id === empleado.id && showDatosEmpleado) {
      setShowDatosEmpleado(false);
    } else {
      setEmpleadoSeleccionado(empleado);
      setShowDatosEmpleado(true);
    }
  };

  const empleadosFiltrados = empleados.filter((empleado) => {
    return (
      (filtroNombre === "" ||
        empleado.nombre.toLowerCase().startsWith(filtroNombre.toLowerCase())) &&
      (filtroRol === "" || empleado.rol === filtroRol)
    );
  });

  return (
    <div className="container card">
      <div className='header'>
        <h1>Lista de Empleados</h1>
        <Button variant="primary" onClick={() => navigate("/empleados/crear")}>Nuevo Empleado</Button>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Nombre</th>
            <th scope="col">Rol</th>
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
        <tbody >
          {empleadosFiltrados.sort((a, b) => a.id - b.id).map((empleado, index) => ( //ordena por el id
            <React.Fragment key={empleado.id}>
              <tr>
                <th scope="row">{index + 1}</th>
                <td>
                  {editando === empleado.id ? (
                    <Form.Control
                      type="text"
                      name="nombre"
                      value={empleado.nombre}
                      onChange={handleInputChange}
                    />
                  ) : (
                    empleado.nombre
                  )}
                </td>
                <td>
                  {editando === empleado.id ? (
                    <Form.Control
                      as="select"
                      name="rol"
                      value={empleado.rol}
                      onChange={handleInputChange}
                    >
                      <option value="admin">Admin</option>
                      <option value="chofer">Chofer</option>
                      <option value="normal">Normal</option>
                    </Form.Control>
                  ) : (
                    empleado.rol
                  )}
                </td>
                <td>
                  <>
                    {rolUsuario === "admin" && (
                      <Button
                        variant="danger"
                        style={{ padding: "0.5rem 1rem", marginRight: "0.5rem" }}
                        onClick={() => confirmarEliminar(empleado)}
                      >
                        Eliminar
                      </Button>
                    )}
                    <Button
                      variant="primary"
                      style={{ padding: "0.5rem 1rem", marginRight: "0.5rem" }}
                      onClick={() => modificar(empleado)}
                    >
                      Modificar
                    </Button>
                    <Button
                      variant="dark"
                      style={{ marginRight: "0.5rem" }}
                      onClick={() => toggleDatosEmpleado(empleado)}
                    >
                      Datos
                    </Button>
                    {rolUsuario === "admin" && (
                      <HabilitarDeshabilitarEmpleado
                        empleado={empleado}
                        onUpdate={() => dispatch(fetchEmpleados(getToken()))}
                      />
                    )}
                  </>
                </td>
              </tr>

              {showDatosEmpleado && empleadoSeleccionado && empleadoSeleccionado.id === empleado.id && (
                <tr>
                  <td colSpan="5">
                    <DatosEmpleado idEmpleado={empleado.id} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {showModificarEmpleado && (
        <ModificarEmpleado
          empleado={empleadoSeleccionado}
          onHide={() => setShowModificarEmpleado(false)}
          onUpdate={() => dispatch(fetchEmpleados(getToken()))}
        />
      )}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar a {empleadoSeleccionado?.nombre}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmEliminar}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Empleados;