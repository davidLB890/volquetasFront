import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Form, Row, Col, Button, Modal } from "react-bootstrap";
import { getVolquetas, deleteVolqueta, getPedidoId } from "../../api";
import useAuth from "../../hooks/useAuth";
import ModificarVolqueta from "./ModificarVolqueta";
import "../../assets/css/tituloBoton.css"; // Asegúrate de ajustar la ruta según sea necesario

const ListaVolquetas = () => {
  const [volquetas, setVolquetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroOcupada, setFiltroOcupada] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [volquetaSeleccionada, setVolquetaSeleccionada] = useState(null);
  const [showModificarVolqueta, setShowModificarVolqueta] = useState(false);
  const getToken = useAuth();

  useEffect(() => {
    const fetchVolquetas = async () => {
      const usuarioToken = getToken();
      try {
        const response = await getVolquetas(usuarioToken);
        const volquetasConUbicacion = await Promise.all(
          response.data.map(async (volqueta) => {
            const movimientoEntrega = volqueta.Movimientos.find(mov => mov.tipo === 'entrega');
            if (movimientoEntrega) {
              const ubicacion = await buscarUbicacion(movimientoEntrega.pedidoId);
              return { ...volqueta, ubicacion };
            }
            return { ...volqueta, ubicacion: "No disponemos de la ubicación" };
          })
        );
        setVolquetas(volquetasConUbicacion);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener las volquetas:", error.response?.data?.error || error.message);
        setError("Error al obtener las volquetas");
        setLoading(false);
      }
    };

    fetchVolquetas();
  }, [getToken]);

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
    try {
      await deleteVolqueta(volquetaId, usuarioToken);
      setVolquetas(volquetas.filter(volqueta => volqueta.numeroVolqueta !== volquetaId));
      setShowConfirmModal(false);
    } catch (error) {
      console.error("Error al eliminar la volqueta:", error.response?.data?.error || error.message);
      setError("Error al eliminar la volqueta");
      setTimeout(() => setError(""), 5000);
    }
  };

  const confirmarEliminar = (volqueta) => {
    setVolquetaSeleccionada(volqueta);
    setShowConfirmModal(true);
  };

  const handleConfirmEliminar = () => {
    handleEliminar(volquetaSeleccionada.numeroVolqueta);
  };

  const buscarUbicacion = async (pedidoId) => {
    const usuarioToken = getToken();
    try {
      const response = await getPedidoId(pedidoId, usuarioToken);
      return response.data.Obra.calle;
    } catch (error) {
      console.error("Error al obtener la ubicación del pedido:", error.response?.data?.error || error.message);
      setError("Error al obtener la ubicación del pedido");
      setTimeout(() => setError(""), 5000);
      return "Error al obtener ubicación";
    }
  };

  const volquetasFiltradas = volquetas.filter((volqueta) => {
    return (
      (filtroOcupada === "" || (filtroOcupada === "si" ? volqueta.ocupada : !volqueta.ocupada)) &&
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
            <Form.Control as="select" value={filtroOcupada} onChange={handleFiltroOcupadaChange}>
              <option value="">Todas</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="filtroTipo">
            <Form.Label>Tipo</Form.Label>
            <Form.Control as="select" value={filtroTipo} onChange={handleFiltroTipoChange}>
              <option value="">Todos</option>
              <option value="grande">Grande</option>
              <option value="chica">Chica</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="filtroEstado">
            <Form.Label>Estado</Form.Label>
            <Form.Control as="select" value={filtroEstado} onChange={handleFiltroEstadoChange}>
              <option value="">Todos</option>
              <option value="sana">Sana</option>
              <option value="perdida">Perdida</option>
              <option value="danada">Dañada</option>
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
            <th>Ubicación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {volquetasFiltradas.map((volqueta) => (
            <tr key={volqueta.numeroVolqueta} className={volqueta.estado === "perdida" ? "volqueta-perdida" : ""}>
              <td>{volqueta.numeroVolqueta}</td>
              <td>{volqueta.estado}</td>
              <td>{volqueta.tipo}</td>
              <td>{volqueta.ocupada ? "Sí" : "No"}</td>
              <td>{volqueta.ubicacion}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => confirmarEliminar(volqueta)}
                >
                  Eliminar
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setVolquetaSeleccionada(volqueta);
                    setShowModificarVolqueta(true);
                  }}
                >
                  Modificar
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
          onUpdate={(updatedVolqueta) => {
            setVolquetas(volquetas.map(v => v.numeroVolqueta === updatedVolqueta.numeroVolqueta ? updatedVolqueta : v));
            setShowModificarVolqueta(false);
          }}
        />
      )}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar la volqueta número {volquetaSeleccionada?.numeroVolqueta}?
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

export default ListaVolquetas;
