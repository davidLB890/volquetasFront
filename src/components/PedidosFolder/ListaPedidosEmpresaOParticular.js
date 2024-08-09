import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Spinner,
  Alert,
  Form,
  Button,
  Row,
  Col,
  Collapse,
} from "react-bootstrap";
import { getPedidosFiltro } from "../../api"; // Asegúrate de tener esta función en api.js
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import moment from "moment";

const ListaPedidosEmpresaOParticular = ({ empresaId, particularId }) => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fechaInicio, setFechaInicio] = useState(
    moment().startOf("day").add(1, "hours").format("YYYY-MM-DDTHH:mm")
  );
  const [fechaFin, setFechaFin] = useState(
    moment().endOf("day").format("YYYY-MM-DDTHH:mm")
  );
  const [estado, setEstado] = useState("");
  const [tipoHorario, setTipoHorario] = useState("creacion");
  const [openFilters, setOpenFilters] = useState(false); // Estado para manejar el despliegue de filtros
  const [open, setOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  const getToken = useAuth();
  const navigate = useNavigate();

  const fetchPedidos = async (params) => {
    const usuarioToken = getToken();
    try {
      const response = await getPedidosFiltro(usuarioToken, params);
      setPedidos(response.data);
      setLoading(false);
    } catch (error) {
      console.error(
        "Error al obtener los pedidos:",
        error.response?.data?.error || error.message
      );
      setError("Error al obtener los pedidos");
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const defaultParams = {
      estado,
      fechaInicio,
      fechaFin,
      tipoHorario,
      empresaId,
      particularId,
    };
    fetchPedidos(defaultParams);
  }, [empresaId, particularId, getToken]);

  const handleFilterChange = (e) => {
    e.preventDefault();
    const params = {
      estado,
      fechaInicio,
      fechaFin,
      tipoHorario,
      empresaId,
      particularId,
    };
    setLoading(true);
    fetchPedidos(params);
  };

  const handleRowClick = (pedido) => {
    console.log("Pedido:", pedido);
    navigate("/pedidos/datos", {
      state: { pedidoId: pedido.id, empresaId: empresaId, particularId: particularId },
    });
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
        aria-controls="lista-pedidos-collapse"
        aria-expanded={open}
        className="mb-3 boton-personalizado"
      >
        Lista de Pedidos
      </Button>
      <Collapse in={open}>
        <div id="lista-pedidos-collapse">
          <Button
            onClick={() => setOpenFilters(!openFilters)}
            aria-controls="filtros-collapse"
            aria-expanded={openFilters}
            className="mb-3"
          >
            Filtros
          </Button>
          <Collapse in={openFilters}>
            <div id="filtros-collapse">
              <Form onSubmit={handleFilterChange}>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="fechaInicio">
                      <Form.Label>Fecha de Inicio</Form.Label>
                      <Form.Control
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="fechaFin">
                      <Form.Label>Fecha de Fin</Form.Label>
                      <Form.Control
                        type="date"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <Form.Group controlId="estado">
                      <Form.Label>Estado</Form.Label>
                      <Form.Control
                        as="select"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                      >
                        <option value="">Todos</option>
                        <option value="entregado">Entregado</option>
                        <option value="iniciado">Iniciado</option>
                        <option value="cancelado">Cancelado</option>
                        <option value="levantado">Levantado</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="tipoHorario">
                      <Form.Label>Tipo de Horario</Form.Label>
                      <Form.Control
                        as="select"
                        value={tipoHorario}
                        onChange={(e) => setTipoHorario(e.target.value)}
                      >
                        <option value="creacion">Creación</option>
                        <option value="sugerenciaLevante">Sugerencia Entrega</option>
                        <option value="sugerenciaEntrega">Sugerencia Levante</option>
                        <option value="movimientoLevante">Movimiento Levante</option>
                        <option value="movimientoEntrega">Movimiento Entrega</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Button type="submit" className="mt-3">
                  Aplicar filtros
                </Button>
              </Form>
            </div>
          </Collapse>

          {isSmallScreen ? (
            pedidos.map((pedido) => (
              <div key={pedido.id} className="p-3 mb-3 border bg-light">
                <h5>Fecha de Creación: {pedido.createdAt ? new Date(pedido.createdAt).toLocaleDateString() : "N/A"}</h5>
                <p>Dirección: {pedido.Obra.calle}</p>
                <p>Precio: {pedido.pagoPedido.precio}</p>
                <p>Pagado: {pedido.pagoPedido.pagado ? "Sí" : "No"}</p>
                <Button
                  variant="primary"
                  onClick={() => handleRowClick(pedido)}
                >
                  Ver Detalles
                </Button>
              </div>
            ))
          ) : (
            <Table striped bordered hover className="mt-3">
              <thead>
                <tr>
                  <th>Fecha creación</th>
                  <th>Dirección</th>
                  <th>Precio</th>
                  <th>Pagado</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr
                    key={pedido.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRowClick(pedido)}
                  >
                    <td>{pedido.createdAt ? new Date(pedido.createdAt).toLocaleDateString() : "N/A"}</td>
                    <td>{pedido.Obra.calle}</td>
                    <td>{pedido.pagoPedido.precio}</td>
                    <td>{pedido.pagoPedido.pagado ? "Sí" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </Collapse>
    </Container>
  );
};

export default ListaPedidosEmpresaOParticular;
