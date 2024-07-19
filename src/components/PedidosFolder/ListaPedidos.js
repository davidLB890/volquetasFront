import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Form, Button, Row, Col, Collapse, Container } from "react-bootstrap";
import { getPedidosFiltro } from "../../api"; // Asegúrate de tener esta función en api.js
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import moment from "moment";

const ListaPedido = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fechaInicio, setFechaInicio] = useState(moment().startOf('week').format('YYYY-MM-DD'));
  const [fechaFin, setFechaFin] = useState(moment().endOf('week').format('YYYY-MM-DD'));
  const [estado, setEstado] = useState(null);
  const [tipoHorario, setTipoHorario] = useState('creacion');
  const [empresaId, setEmpresaId] = useState(null);
  const [openFilters, setOpenFilters] = useState(false); // Estado para manejar el despliegue de filtros
  const getToken = useAuth();
  const navigate = useNavigate();

  const fetchPedidos = async (params) => {
    const usuarioToken = getToken();
    try {
      const response = await getPedidosFiltro(usuarioToken, params);
      setPedidos(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los pedidos:", error.response?.data?.error || error.message);
      setError("Error al obtener los pedidos");
      setLoading(false);
    }
  };

  useEffect(() => {
    const defaultParams = {
      estado,
      fechaInicio,
      fechaFin,
      tipoHorario,
      empresaId,
    };
    fetchPedidos(defaultParams);
  }, [getToken]);

  const handleFilterChange = (e) => {
    e.preventDefault();
    const params = {
      estado,
      fechaInicio,
      fechaFin,
      tipoHorario,
      empresaId,
    };
    setLoading(true);
    fetchPedidos(params);
  };

  const handleRowClick = (pedido) => {
    navigate('/pedidos/datos', { state: { pedido } });
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container>
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
                    {/* Añade más estados si es necesario */}
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
                    {/* Añade más tipos de horario si es necesario */}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="empresaId">
                  <Form.Label>Empresa ID</Form.Label>
                  <Form.Control
                    type="number"
                    value={empresaId}
                    onChange={(e) => setEmpresaId(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button type="submit" className="mt-3">Aplicar filtros</Button>
          </Form>
        </div>
      </Collapse>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Fecha Creación</th>
            <th>Cliente</th>
            <th>Dirección</th>
            <th>Precio</th>
            <th>Pagado</th>
            <th>Tipo Sugerido</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => {
            const esEmpresa = !!pedido.Obra.empresa;
            const colorFondo = esEmpresa ? "lightblue" : "lavender";

            return (
              <tr
                key={pedido.id}
                style={{ backgroundColor: colorFondo, cursor: 'pointer' }}
                onClick={() => handleRowClick(pedido)}
              >
                <td>{pedido.createdAt ? new Date(pedido.createdAt).toLocaleDateString() : "N/A"}</td>
                <td>{esEmpresa ? pedido.Obra.empresa?.nombre : pedido.Obra.particular?.nombre}</td>
                <td>{pedido.Obra.calle}</td>
                <td>{pedido.pagoPedido.precio}</td>
                <td>{pedido.pagoPedido.pagado ? "Sí" : "No"}</td>
                <td>{pedido.Sugerencias[0]?.tipoSugerido || "N/A"}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default ListaPedido;

