import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Container, Modal, Dropdown, ButtonGroup } from "react-bootstrap";
import { Gear, PencilSquare, Trash, Wrench, Person } from "react-bootstrap-icons";
import ModificarCamion from "./ModificarCamiones";
import ServiciosCamion from "../ServiciosFolder/Servicios";
import AsignarChofer from "./AsignarChofer";
import useAuth from "../../hooks/useAuth";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { fetchCamiones, removeCamion } from "../../features/camionesSlice";
import "../../assets/css/Camiones.css"; // Importa el archivo CSS

const Camiones = () => {
  const camiones = useSelector((state) => state.camiones.camiones);
  const dispatch = useDispatch();
  const [filtroMatricula, setFiltroMatricula] = useState("");
  const [filtroModelo, setFiltroModelo] = useState("");
  const [mostrarModificarCamion, setMostrarModificarCamion] = useState(null);
  const [mostrarFormularioServicio, setMostrarFormularioServicio] = useState(null);
  const [mostrarServiciosCamion, setMostrarServiciosCamion] = useState(null);
  const [mostrarAsignarChofer, setMostrarAsignarChofer] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [camionSeleccionado, setCamionSeleccionado] = useState(null);
  const [mesSeleccionado, setMesSeleccionado] = useState(moment().month() + 1); // Mes actual
  const [anioSeleccionado, setAnioSeleccionado] = useState(moment().year()); // Año actual

  const rolUsuario = localStorage.getItem("userRol");

  const navigate = useNavigate();
  const getToken = useAuth();

  useEffect(() => {
    const usuarioToken = getToken();
    if (usuarioToken === null) {
      navigate("/login");
    } else {
      dispatch(fetchCamiones(usuarioToken)); // Fetch camiones al montar el componente
    }
  }, [getToken, navigate, dispatch]);

  const handleEliminar = async (camionId) => {
    const usuarioToken = getToken();
    dispatch(removeCamion({ camionId, usuarioToken }));
  };

  const confirmarEliminar = (camion) => {
    setCamionSeleccionado(camion);
    setShowConfirmModal(true);
  };

  const handleConfirmEliminar = () => {
    handleEliminar(camionSeleccionado.id);
    setShowConfirmModal(false);
  };

  const handleModificar = (camion) => {
    setMostrarModificarCamion(camion);
  };

  const handleActualizarCamion = (camionActualizado) => {
    const usuarioToken = getToken();
    setMostrarModificarCamion(null);
    // Volver a cargar la lista de camiones
    dispatch(fetchCamiones(usuarioToken));
  };

  const handleCancelarModificar = () => {
    setMostrarModificarCamion(null);
  };

  const handleFiltrarMatricula = (e) => {
    setFiltroMatricula(e.target.value);
  };

  const handleFiltrarModelo = (e) => {
    setFiltroModelo(e.target.value);
  };

  const handleMostrarServicios = (camionId) => {
    setMostrarServiciosCamion((prev) => (prev === camionId ? null : camionId));
    setMostrarFormularioServicio(camionId === mostrarFormularioServicio ? null : camionId);
  };

  const handleMostrarAsignarChofer = (camionId) => {
    setMostrarAsignarChofer((prev) => (prev === camionId ? null : camionId));
  };

  const handleMesChange = (e) => {
    setMesSeleccionado(e.target.value);
  };

  const handleAnioChange = (e) => {
    setAnioSeleccionado(e.target.value);
  };

  const camionesFiltrados = camiones.filter((camion) => {
    const matriculaMatches = camion.matricula.toLowerCase().startsWith(filtroMatricula.toLowerCase());
    const modeloMatches = camion.modelo.toString().toLowerCase().startsWith(filtroModelo.toLowerCase());
    return (
      (filtroMatricula === "" || matriculaMatches) &&
      (filtroModelo === "" || modeloMatches)
    );
  });

  return (
    <Container className="card">
      <div className="header">
        <h1>Lista de Camiones</h1>
        <Button variant="primary" onClick={() => navigate("/camiones/crear")}>
          Nuevo Camión
        </Button>
      </div>
      <div className="filters">
        <Form.Group>
          <Form.Label>Fecha de servicio:</Form.Label>
          <div className="d-flex">
            <Form.Control
              as="select"
              value={mesSeleccionado}
              onChange={handleMesChange}
              className="mr-2"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {moment().month(i).format("MMMM")}
                </option>
              ))}
            </Form.Control>
            <Form.Control
              as="select"
              value={anioSeleccionado}
              onChange={handleAnioChange}
            >
              {Array.from({ length: 20 }, (_, i) => (
                <option key={i} value={moment().year() - i}>
                  {moment().year() - i}
                </option>
              ))}
            </Form.Control>
          </div>
        </Form.Group>
      </div>

      {/* Tabla para pantallas medianas y grandes */}
      <div className="table-responsive d-none d-md-block">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Matricula</th>
              <th scope="col">Modelo</th>
              <th scope="col">Año</th>
              <th scope="col">Estado</th>
              <th scope="col"></th>
            </tr>
            <tr>
              
              <th>
                <Form.Control
                  type="text"
                  placeholder="Filtrar por Matricula"
                  value={filtroMatricula}
                  onChange={handleFiltrarMatricula}
                />
              </th>
              <th>
                <Form.Control
                  type="text"
                  placeholder="Filtrar por Modelo"
                  value={filtroModelo}
                  onChange={handleFiltrarModelo}
                />
              </th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {camionesFiltrados.map((camion, index) => (
              <React.Fragment key={camion.id}>
                <tr>
                  <td>{camion.matricula}</td>
                  <td>{camion.modelo}</td>
                  <td>{camion.anio}</td>
                  <td>{camion.estado}</td>
                  <td>
                    <Dropdown as={ButtonGroup}>
                      <Dropdown.Toggle
                        split
                        variant="link"
                        style={{ padding: 0, margin: 0, border: "none" }}
                      >
                        <Gear size={20} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {rolUsuario === "admin" && (
                          <Dropdown.Item onClick={() => confirmarEliminar(camion)}>
                            <Trash className="me-2" /> Eliminar
                          </Dropdown.Item>
                        )}
                        <Dropdown.Item onClick={() => handleModificar(camion)}>
                          <PencilSquare className="me-2" /> Modificar
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleMostrarServicios(camion.id)}>
                          <Wrench className="me-2" /> Servicios
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleMostrarAsignarChofer(camion.id)}>
                          <Person className="me-2" /> Chofer
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
                {mostrarModificarCamion === camion && (
                  <tr>
                    <td colSpan="6">
                      <ModificarCamion
                        camion={camion}
                        onUpdate={handleActualizarCamion}
                        onHide={handleCancelarModificar}
                      />
                    </td>
                  </tr>
                )}
                {mostrarServiciosCamion === camion.id && (
                  <tr>
                    <td colSpan="6">
                      <ServiciosCamion
                        camionId={camion.id}
                        mes={mesSeleccionado}
                        anio={anioSeleccionado}
                      />
                    </td>
                  </tr>
                )}
                {mostrarAsignarChofer === camion.id && (
                  <tr>
                    <td colSpan="6">
                      <AsignarChofer
                        camionId={camion.id}
                        onHide={() => handleMostrarAsignarChofer(null)}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tarjetas para pantallas pequeñas */}
      <div className="d-md-none">
        {camionesFiltrados.map((camion) => (
          <div key={camion.id} className="camion-item">
            <p><strong>Matricula:</strong> {camion.matricula}</p>
            <p><strong>Modelo:</strong> {camion.modelo}</p>
            <p><strong>Año:</strong> {camion.anio}</p>
            <p><strong>Estado:</strong> {camion.estado}</p>
            <div className="camion-actions">
            <Dropdown as={ButtonGroup}>
    <Dropdown.Toggle
      split
      variant="link"
      style={{ padding: 0, margin: 0, border: "none" }}
    >
      <Gear size={20} />
    </Dropdown.Toggle>
    <Dropdown.Menu>
      {rolUsuario === "admin" && (
        <Dropdown.Item onClick={() => confirmarEliminar(camion)}>
          <Trash className="me-2" /> Eliminar
        </Dropdown.Item>
      )}
      <Dropdown.Item onClick={() => handleModificar(camion)}>
        <PencilSquare className="me-2" /> Modificar
      </Dropdown.Item>
      <Dropdown.Item onClick={() => handleMostrarServicios(camion.id)}>
        <Wrench className="me-2" /> Servicios
      </Dropdown.Item>
      <Dropdown.Item onClick={() => handleMostrarAsignarChofer(camion.id)}>
        <Person className="me-2" /> Chofer
      </Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
            </div>
            {mostrarModificarCamion === camion && (
              <div className="mt-3">
                <ModificarCamion
                  camion={camion}
                  onUpdate={handleActualizarCamion}
                  onHide={handleCancelarModificar}
                />
              </div>
            )}
            {mostrarServiciosCamion === camion.id && (
              <div className="mt-3">
                <ServiciosCamion
                  camionId={camion.id}
                  mes={mesSeleccionado}
                  anio={anioSeleccionado}
                />
              </div>
            )}
            {mostrarAsignarChofer === camion.id && (
              <div className="mt-3">
                <AsignarChofer
                  camionId={camion.id}
                  onHide={() => handleMostrarAsignarChofer(null)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar el camión con matrícula{" "}
          {camionSeleccionado?.matricula}?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmEliminar}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Camiones;
