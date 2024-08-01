import React, { useEffect, useState } from "react";
import {
  Table,
  Spinner,
  Alert,
  Form,
  Row,
  Col,
  Button,
  Modal,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchVolquetas } from "../../features/volquetasSlice";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ModificarVolqueta from "./ModificarVolqueta";
import { TAMANOS_VOLQUETA, ESTADOS_VOLQUETA } from "../../config/config";
import "../../assets/css/tituloBoton.css"; // Asegúrate de ajustar la ruta según sea necesario
import { deleteVolquetaAPI, putVolquetaAPI } from "../../api";

const ListaVolquetas = () => {
  const dispatch = useDispatch();
  const { volquetas, loading, error } = useSelector((state) => state.volquetas);
  const [filtroOcupada, setFiltroOcupada] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [volquetaSeleccionada, setVolquetaSeleccionada] = useState(null);
  const [showModificarVolqueta, setShowModificarVolqueta] = useState(false);
  const getToken = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioToken = getToken();
    dispatch(fetchVolquetas(usuarioToken));
  }, [dispatch, getToken]);

  const handleFiltroOcupadaChange = (e) => {
    setFiltroOcupada(e.target.value);
  };

  const handleFiltroTipoChange = (e) => {
    setFiltroTipo(e.target.value);
  };

  const handleFiltroEstadoChange = (e) => {
    setFiltroEstado(e.target.value);
  };

  const handleEliminar = async (volquetaId) => {
    const usuarioToken = getToken();
    await deleteVolquetaAPI(volquetaId, usuarioToken);
    dispatch(fetchVolquetas(usuarioToken));
    setShowConfirmModal(false);
  };

  const handleUpdateVolqueta = (volqueta) => {
    dispatch(fetchVolquetas(getToken()));
    setShowModificarVolqueta(false);
  };

  const confirmarEliminar = (volqueta) => {
    setVolquetaSeleccionada(volqueta);
    setShowConfirmModal(true);
  };

  const handleConfirmEliminar = () => {
    handleEliminar(volquetaSeleccionada.numeroVolqueta);
  };

  const volquetasFiltradas = volquetas.filter((volqueta) => {
    return (
      (filtroOcupada === "" ||
        (filtroOcupada === "si" ? volqueta.ocupada : !volqueta.ocupada)) &&
      (filtroTipo === "" || volqueta.tipo === filtroTipo) &&
      (filtroEstado === "" || volqueta.estado === filtroEstado)
    );
  });

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <Form.Group controlId="filtroOcupada">
            <Form.Label>Ocupada</Form.Label>
            <Form.Control
              as="select"
              value={filtroOcupada}
              onChange={handleFiltroOcupadaChange}
            >
              <option value="">Todas</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="filtroTipo">
            <Form.Label>Tamaño</Form.Label>
            <Form.Control
              as="select"
              value={filtroTipo}
              onChange={handleFiltroTipoChange}
            >
              <option value="">Todos</option>
              {TAMANOS_VOLQUETA.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="filtroEstado">
            <Form.Label>Estado</Form.Label>
            <Form.Control
              as="select"
              value={filtroEstado}
              onChange={handleFiltroEstadoChange}
            >
              {ESTADOS_VOLQUETA.map((estado) => (
                <option key={estado.value} value={estado.value}>
                  {estado.label}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Table striped bordered hover size="sm" className="table-sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Estado</th>
            <th>Tipo</th>
            <th>Ocupada</th>
            <th>Último movimiento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {volquetasFiltradas.map((volqueta) => (
            <tr
              key={volqueta.numeroVolqueta}
              className={
                volqueta.estado === "perdida" ? "volqueta-perdida" : ""
              }
            >
              <td>{volqueta.numeroVolqueta}</td>
              <td>{volqueta.estado}</td>
              <td>{volqueta.tipo}</td>
              <td>{volqueta.ocupada ? "Sí" : "No"}</td>
              <td>
                {volqueta.Movimientos.length > 0 &&
                  volqueta.Movimientos.map((movimiento, index) => (
                    <div key={index}>
                      {movimiento.tipo === "entrega"
                        ? `Entregada en ${movimiento?.Pedido?.Obra?.calle}`
                        : movimiento.tipo === "levante"
                        ? `Levantada en ${movimiento?.Pedido?.Obra?.calle}`
                        : ""}
                    </div>
                  ))}
              </td>

              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => confirmarEliminar(volqueta)}
                  style={{
                    padding: "0.5rem 1rem",
                    marginRight: "0.5rem",
                  }}
                >
                  Eliminar
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  style={{
                    padding: "0.5rem 1rem",
                    marginRight: "0.5rem",
                  }}
                  onClick={() => {
                    setVolquetaSeleccionada(volqueta);
                    setShowModificarVolqueta(true);
                  }}
                >
                  Modificar
                </Button>
                <Button
                  variant="info"
                  size="sm"
                  style={{
                    padding: "0.5rem 1rem",
                    marginRight: "0.5rem",
                  }}
                  onClick={() =>
                    navigate("/volquetas/datos", {
                      state: { volquetaId: volqueta.numeroVolqueta },
                    })
                  }
                >
                  Datos
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {showModificarVolqueta && volquetaSeleccionada && (
        <ModificarVolqueta
          volqueta={volquetaSeleccionada}
          onHide={() => setShowModificarVolqueta(false)}
          onUpdate={handleUpdateVolqueta}
        />
      )}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar la volqueta número{" "}
          {volquetaSeleccionada?.numeroVolqueta}?
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
    </div>
  );
};

export default ListaVolquetas;
