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
import { getPermisoIdEmpresa, getPermisoIdParticular, deletePermiso } from "../../api";
import useAuth from "../../hooks/useAuth";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPermisosStart as fetchPermisosStartParticular,
  fetchPermisosSuccess as fetchPermisosSuccessParticular,
  fetchPermisosFailure as fetchPermisosFailureParticular,
} from "../../features/particularSlice";
import {
  fetchPermisosStart as fetchPermisosStartEmpresa,
  fetchPermisosSuccess as fetchPermisosSuccessEmpresa,
  fetchPermisosFailure as fetchPermisosFailureEmpresa,
} from "../../features/empresaSlice";
import ModificarPermiso from "./ModificarPermiso";
import DatosPermiso from "./DatosPermiso";

const ListaPermisos = ({ empresaId, particularId }) => {
  const particularState = useSelector((state) => state.particular);
  const empresaState = useSelector((state) => state.empresa);

  const [open, setOpen] = useState(false);
  const [showModificarPermiso, setShowModificarPermiso] = useState(false);
  const [permisoSeleccionado, setPermisoSeleccionado] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [permisoAEliminar, setPermisoAEliminar] = useState(null);
  const [mostrarDatosPermiso, setMostrarDatosPermiso] = useState(false);

  const getToken = useAuth();
  const dispatch = useDispatch();

  const isEmpresa = !!empresaId;
  const { permisos, permisosLoading, permisosError } = isEmpresa ? empresaState : particularState;

  useEffect(() => {
    const fetchPermisos = async () => {
      const usuarioToken = getToken();
      if (isEmpresa) {
        dispatch(fetchPermisosStartEmpresa());
      } else {
        dispatch(fetchPermisosStartParticular());
      }

      try {
        let response;
        if (empresaId) {
          response = await getPermisoIdEmpresa(empresaId, usuarioToken);
        } else if (particularId) {
          response = await getPermisoIdParticular(particularId, usuarioToken);
        } else {
          if (isEmpresa) {
            dispatch(fetchPermisosFailureEmpresa("No se ha proporcionado un ID de empresa o particular."));
          } else {
            dispatch(fetchPermisosFailureParticular("No se ha proporcionado un ID de empresa o particular."));
          }
          return;
        }

        if (isEmpresa) {
          dispatch(fetchPermisosSuccessEmpresa(response.data));
        } else {
          dispatch(fetchPermisosSuccessParticular(response.data));
        }
      } catch (error) {
        if (isEmpresa) {
          dispatch(fetchPermisosFailureEmpresa(error.response?.data?.error || error.message));
        } else {
          dispatch(fetchPermisosFailureParticular(error.response?.data?.error || error.message));
        }
      }
    };

    fetchPermisos();
  }, [empresaId, particularId, getToken, dispatch, isEmpresa]);

  const handlePermisoModificado = (permisoModificado) => {
    if (isEmpresa) {
      dispatch(fetchPermisosSuccessEmpresa(
        permisos.map((permiso) =>
          permiso.id === permisoModificado.id ? permisoModificado : permiso
        )
      ));
    } else {
      dispatch(fetchPermisosSuccessParticular(
        permisos.map((permiso) =>
          permiso.id === permisoModificado.id ? permisoModificado : permiso
        )
      ));
    }
    setShowModificarPermiso(false);
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
      if (isEmpresa) {
        dispatch(fetchPermisosSuccessEmpresa(
          permisos.filter((permiso) => permiso.id !== permisoAEliminar.id)
        ));
      } else {
        dispatch(fetchPermisosSuccessParticular(
          permisos.filter((permiso) => permiso.id !== permisoAEliminar.id)
        ));
      }
      setShowConfirmDelete(false);
    } catch (error) {
      console.error(
        "Error al eliminar el permiso:",
        error.response?.data?.error || error.message
      );
      if (isEmpresa) {
        dispatch(fetchPermisosFailureEmpresa("Error al eliminar el permiso"));
      } else {
        dispatch(fetchPermisosFailureParticular("Error al eliminar el permiso"));
      }
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

  if (permisosLoading) {
    return <Spinner animation="border" />;
  }

  if (permisosError) {
    return <Alert variant="danger">{permisosError}</Alert>;
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
