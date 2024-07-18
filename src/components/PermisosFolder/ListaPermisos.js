import React, { useEffect, useState } from "react";
import {
  Table,
  Spinner,
  Alert,
  Button,
  Collapse,
  Card,
  Container,
  Modal,
} from "react-bootstrap";
import { getPermisoIdEmpresa, getPermisoIdParticular, deletePermiso } from "../../api"; // Ajusta la ruta según sea necesario
import useAuth from "../../hooks/useAuth";
import moment from "moment";
import ModificarPermiso from "./ModificarPermiso"; // Ajusta la ruta según sea necesario
import DatosPermiso from "./DatosPermiso"; // Ajusta la ruta según sea necesario

const ListaPermisos = ({ empresaId, particularId, actualizar }) => {
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false); // Estado para manejar el despliegue
  const [showModificarPermiso, setShowModificarPermiso] = useState(false); // Estado para manejar el modal de modificar permiso
  const [permisoSeleccionado, setPermisoSeleccionado] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false); // Estado para manejar el modal de confirmación de eliminación
  const [permisoAEliminar, setPermisoAEliminar] = useState(null);
  const [mostrarDatosPermiso, setMostrarDatosPermiso] = useState(false);
  const getToken = useAuth();

  useEffect(() => {
    const fetchPermisos = async () => {
      const usuarioToken = getToken();
      try {
        let response;
        if (empresaId) {
          response = await getPermisoIdEmpresa(empresaId, usuarioToken); // Agrega 'true' para el parámetro 'activo'
        } else if (particularId) {
          response = await getPermisoIdParticular(particularId, usuarioToken); // Agrega 'true' para el parámetro 'activo'
        } else {
          setError("No se ha proporcionado un ID de empresa o particular.");
          setLoading(false);
          return;
        }
        setPermisos(response.data);
        setLoading(false);
      } catch (error) {
        console.error(
          "Error al obtener los permisos:",
          error.response?.data?.error || error.message
        );
        setError("Error al obtener los permisos");
        setLoading(false);
      }
    };

    fetchPermisos();
  }, [empresaId, particularId, getToken, actualizar]);

  const handlePermisoModificado = (permisoModificado) => {
    setPermisos((prevPermisos) =>
      prevPermisos.map((permiso) =>
        permiso.id === permisoModificado.id ? permisoModificado : permiso
      )
    );
    setShowModificarPermiso(false); // Cierra el modal después de modificar
  };

  const handleModificarPermiso = (permiso) => {
    setPermisoSeleccionado(permiso);
    setShowModificarPermiso(true);
  };

  const handleConfirmarEliminar = (permiso) => {
    setPermisoAEliminar(permiso);
    setShowConfirmDelete(true);
  };

  const handleEliminarPermiso = async () => {
    const usuarioToken = getToken();
    try {
      await deletePermiso(permisoAEliminar.id, usuarioToken);
      setPermisos((prevPermisos) =>
        prevPermisos.filter((permiso) => permiso.id !== permisoAEliminar.id)
      );
      setShowConfirmDelete(false);
    } catch (error) {
      console.error(
        "Error al eliminar el permiso:",
        error.response?.data?.error || error.message
      );
      setError("Error al eliminar el permiso");
    }
  };

  const handleMostrarDatosPermiso = (permiso) => {
    setPermisoSeleccionado(permiso);
    setMostrarDatosPermiso(true);
  };

  const handleVolver = () => {
    setMostrarDatosPermiso(false);
    setPermisoSeleccionado(null);
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container className="card">
      <Button
        onClick={() => setOpen(!open)}
        aria-controls="lista-permisos-collapse"
        aria-expanded={open}
        className="mb-3"
      >
        Lista de permisos
      </Button>
      <Collapse in={open}>
        <div id="lista-permisos-collapse">
          {mostrarDatosPermiso && permisoSeleccionado ? (
            <div>
              <Button variant="secondary" onClick={handleVolver}>
                Volver
              </Button>
              <DatosPermiso permisoId={permisoSeleccionado.id} />
            </div>
          ) : (
            <div>
              <Card>
                <Card.Body>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Fecha de Creación</th>
                        <th>Fecha de Vencimiento</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {permisos.map((permiso) => (
                        <tr
                          key={permiso.id}
                          style={{
                            backgroundColor: moment().isAfter(
                              moment(permiso.fechaVencimiento)
                            )
                              ? "red"
                              : "white",
                            color: moment().isAfter(
                              moment(permiso.fechaVencimiento)
                            )
                              ? "white"
                              : "black",
                          }}
                        >
                          <td>{permiso.id}</td>
                          <td>
                            {moment(permiso.fechaCreacion).format("YYYY-MM-DD")}
                          </td>
                          <td>
                            {moment(permiso.fechaVencimiento).format("YYYY-MM-DD")}
                          </td>
                          <td>
                            <Button
                              variant="info"
                              onClick={() => handleMostrarDatosPermiso(permiso)}
                              style={{
                                padding: "0.5rem 1rem",
                                marginRight: "0.5rem",
                              }}
                            >
                              Datos
                            </Button>
                            <Button
                              variant="warning"
                              onClick={() => handleModificarPermiso(permiso)}
                              style={{
                                padding: "0.5rem 1rem",
                                marginRight: "0.5rem",
                              }}
                            >
                              Modificar
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => handleConfirmarEliminar(permiso)}
                              className="ml-2"
                              style={{
                                padding: "0.5rem 1rem",
                                marginRight: "0.5rem",
                              }}
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </div>
          )}
        </div>
      </Collapse>
      {permisoSeleccionado && (
        <Modal
          show={showModificarPermiso}
          onHide={() => setShowModificarPermiso(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Modificar Permiso</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ModificarPermiso
              permiso={permisoSeleccionado}
              onHide={() => setShowModificarPermiso(false)}
              onPermisoModificado={handlePermisoModificado}
            />
          </Modal.Body>
        </Modal>
      )}
      <Modal
        show={showConfirmDelete}
        onHide={() => setShowConfirmDelete(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar el permiso con ID{" "}
          {permisoAEliminar?.id}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmDelete(false)} style={{
              padding: "0.5rem 1rem",
              marginRight: "0.5rem",
            }}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleEliminarPermiso} style={{
              padding: "0.5rem 1rem",
              marginRight: "0.5rem",
            }}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ListaPermisos;
