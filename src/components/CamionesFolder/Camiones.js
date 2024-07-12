import React, { useEffect, useState } from "react";
import { deleteCamion, getCamiones } from "../../api";
import { useNavigate } from "react-router-dom";
import { Button, Form, Container, Modal } from "react-bootstrap";
import ModificarCamion from "./ModificarCamiones";
import ServiciosCamion from "../ServiciosFolder/Servicios";
import AsignarChofer from "./AsignarChofer";
import useAuth from "../../hooks/useAuth";
import moment from "moment";

const Camiones = () => {
  const [camiones, setCamiones] = useState([]);
  const [cambios, setCambios] = useState(true);
  const [filtroMatricula, setFiltroMatricula] = useState("");
  const [filtroModelo, setFiltroModelo] = useState("");
  const [mostrarModificarCamion, setMostrarModificarCamion] = useState(null);
  const [mostrarFormularioServicio, setMostrarFormularioServicio] =
    useState(null);
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
    const fetchCamiones = async () => {
      const usuarioToken = getToken();
      if (!usuarioToken) {
        navigate("/login");
      } else {
        try {
          const response = await getCamiones(usuarioToken);
          setCamiones(response.data);
          setCambios(false);
        } catch (error) {
          console.error(
            "Error al obtener camiones:",
            error.response?.data?.error || error.message
          );
          if (error.response?.status === 401) {
            navigate("/login");
          }
        }
      }
    };

    if (cambios) {
      fetchCamiones();
    }
  }, [cambios, getToken, navigate]);

  const handleEliminar = async (camionId) => {
    const usuarioToken = getToken();

    try {
      await deleteCamion(camionId, usuarioToken);
      setCambios(true);
    } catch (error) {
      console.error(
        "Error al conectar con el servidor:",
        error.response?.data?.error || error.message
      );
    }
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
    const camionesActualizados = camiones.map((c) =>
      c.id === camionActualizado.id ? camionActualizado : c
    );
    setCamiones(camionesActualizados);
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
    setMostrarFormularioServicio(
      camionId === mostrarFormularioServicio ? null : camionId
    );
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
    const matriculaMatches = camion.matricula
      .toLowerCase()
      .startsWith(filtroMatricula.toLowerCase());
    const modeloMatches = camion.modelo
      .toString()
      .toLowerCase()
      .startsWith(filtroModelo.toLowerCase());
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
        <Form.Control
          as="select"
          value={mesSeleccionado}
          onChange={handleMesChange}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {moment()
                .month(i)
                .format("MMMM")}
            </option>
          ))}
        </Form.Control>
        <Form.Control
          as="select"
          value={anioSeleccionado}
          onChange={handleAnioChange}
          size={10}
        >
          {Array.from({ length: 20 }, (_, i) => (
            <option key={i} value={moment().year() - i}>
              {moment().year() - i}
            </option>
          ))}
        </Form.Control>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Matricula</th>
            <th scope="col">Modelo</th>
            <th scope="col">Año</th>
            <th scope="col">Estado</th>
            <th scope="col">Acciones</th>
          </tr>
          <tr>
            <th></th>
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
                <th scope="row">{index + 1}</th>
                <td>{camion.matricula}</td>
                <td>{camion.modelo}</td>
                <td>{camion.anio}</td>
                <td>{camion.estado}</td>
                <td>
                  {rolUsuario === "admin" && (
                    <Button
                      variant="danger"
                      style={{
                        padding: "0.5rem 1rem",
                        marginRight: "0.5rem",
                      }}
                      onClick={() => confirmarEliminar(camion)}
                    >
                      Eliminar
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    style={{
                      padding: "0.5rem 1rem",
                      marginRight: "0.5rem",
                    }}
                    onClick={() => handleModificar(camion)}
                  >
                    Modificar
                  </Button>
                  <Button
                    variant="info"
                    style={{
                      padding: "0.5rem 1rem",
                      marginRight: "0.5rem",
                    }}
                    onClick={() => handleMostrarServicios(camion.id)}
                  >
                    Servicios
                  </Button>
                  <Button
                    variant="warning"
                    style={{
                      padding: "0.5rem 1rem",
                      marginRight: "0.5rem",
                    }}
                    onClick={() => handleMostrarAsignarChofer(camion.id)}
                  >
                    Chofer
                  </Button>
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
                    <ServiciosCamion camionId={camion.id} mes={mesSeleccionado} anio={anioSeleccionado} />
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
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar el camión con matrícula {camionSeleccionado?.matricula}?
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
    </Container>
  );
};

export default Camiones;