import React, { useEffect, useState } from "react";
import {
  Table,
  Spinner,
  Alert,
  Form,
  Button,
  Row,
  Col,
  Collapse,
  Container,
} from "react-bootstrap";
import { getPedidosFiltro } from "../../api"; // Asegúrate de tener esta función en api.js
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import moment from "moment";
import BuscarEmpresaPorNombre from "../EmpresasFolder/BuscarEmpresaPorNombre"; // Ajusta la ruta según sea necesario
import BuscarParticularPorNombre from "../ParticularesFolder/BuscarParticularPorNombre"; // Ajusta la ruta según sea necesario
import { TIPOS_HORARIO_PEDIDO, ESTADOS_PEDIDO } from "../../config/config"; // Importa las constantes

const ListaPedido = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fechaInicio, setFechaInicio] = useState(moment().format("YYYY-MM-DD"));
  const [fechaFin, setFechaFin] = useState(moment().format("YYYY-MM-DD"));
  const [estado, setEstado] = useState(null);
  const [tipoHorario, setTipoHorario] = useState("creacion");
  const [empresaId, setEmpresaId] = useState(null);
  const [particularId, setParticularId] = useState(null);
  const [empresaNombre, setEmpresaNombre] = useState("");
  const [particularNombre, setParticularNombre] = useState("");
  const [openFilters, setOpenFilters] = useState(false); // Estado para manejar el despliegue de filtros
  const [filtroTipo, setFiltroTipo] = useState("empresa"); // Estado para manejar el filtro de empresa o particular
  const getToken = useAuth();
  const navigate = useNavigate();

  const fetchPedidos = async (params) => {
    const usuarioToken = getToken();
    try {
      const response = await getPedidosFiltro(usuarioToken, params);
      console.log("Pedidos:", response);
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
    const defaultParams = {
      estado,
      fechaInicio,
      fechaFin,
      tipoHorario,
      empresaId,
      particularId,
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
      particularId,
    };
    setLoading(true);
    fetchPedidos(params);
  };

  const handleEmpresaSeleccionada = (id, nombre) => {
    setEmpresaId(id);
    setEmpresaNombre(nombre);
    setParticularId(null);
    setParticularNombre("");
  };

  const handleParticularSeleccionado = (id, nombre) => {
    setParticularId(id);
    setParticularNombre(nombre);
    setEmpresaId(null);
    setEmpresaNombre("");
  };

  const handleRowClick = (pedido) => {
    let idPedido = pedido.id;
    navigate("/pedidos/datos", { state: { pedidoId: idPedido } });
  };

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
              <Col md={4}>
                <Form.Group controlId="fechaInicio">
                  <Form.Label>Fecha de Inicio *</Form.Label>
                  <Form.Control
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="fechaFin">
                  <Form.Label>Fecha de Fin *</Form.Label>
                  <Form.Control
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="tipoHorario">
                  <Form.Label>Tipo de Horario *</Form.Label>
                  <Form.Control
                    as="select"
                    value={tipoHorario}
                    onChange={(e) => setTipoHorario(e.target.value)}
                    required
                  >
                    {TIPOS_HORARIO_PEDIDO.map((tipo) => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={2}>
                <Form.Group controlId="estado">
                  <Form.Label>Estado</Form.Label>
                  <Form.Control
                    as="select"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                  >
                    {ESTADOS_PEDIDO.map((estado) => (
                      <option key={estado.value} value={estado.value}>
                        {estado.label}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="filtroTipo">
                  <Form.Label>Filtro</Form.Label>
                  <Form.Control
                    as="select"
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                  >
                    <option value="empresa">Empresa</option>
                    <option value="particular">Particular</option>
                  </Form.Control>
                </Form.Group>
                {filtroTipo === "empresa" ? (
                  <>
                    {empresaNombre && (
                      <Form.Text>
                        Empresa seleccionada: {empresaNombre}
                      </Form.Text>
                    )}
                    <BuscarEmpresaPorNombre
                      onSeleccionar={handleEmpresaSeleccionada}
                    />
                  </>
                ) : (
                  <>
                    {particularNombre && (
                      <Form.Text>
                        Particular seleccionado: {particularNombre}
                      </Form.Text>
                    )}
                    <BuscarParticularPorNombre
                      onSeleccionar={handleParticularSeleccionado}
                    />
                  </>
                )}
              </Col>
            </Row>
            <Button type="submit" className="mt-3">
              Aplicar filtros
            </Button>
          </Form>
        </div>
      </Collapse>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>
              {tipoHorario === "creacion" && "Fecha Creación"} 
              {(tipoHorario === "sugerenciaEntrega" || tipoHorario === "sugerenciaLevante") && "Fecha Sugerida"}
              {(tipoHorario === "movimientoLevante") && "Fecha Levante"}
              {(tipoHorario === "movimientoEntrega") && "Fecha Entrega"}
            </th>
            <th>Cliente</th>
            <th>Estado</th>
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
                style={{ backgroundColor: colorFondo, cursor: "pointer" }}
                onClick={() => handleRowClick(pedido)}
              >
                <td>
                  {tipoHorario === "creacion" &&
                    (pedido.createdAt ? new Date(pedido.createdAt).toLocaleDateString(): "N/A")}
                  {(tipoHorario === "sugerenciaEntrega" || tipoHorario === "sugerenciaLevante") &&
                    (() => {const sugerencia = pedido.Sugerencias.find((s) => s.horarioSugerido);
                    return sugerencia? new Date(sugerencia.horarioSugerido).toLocaleDateString(): "N/A";})()}        
                  {(tipoHorario === "movimientoLevante") &&
                  (() => {const movimientoLevante = pedido.Movimientos.find((m) => m.tipo === "levante");
                    return movimientoLevante ? new Date(movimientoLevante.horario).toLocaleDateString() : "N/A";})()}
                  {(tipoHorario === "movimientoEntrega") &&
                  (() => {const movimientosEntrega = pedido.Movimientos.filter((m) => m.tipo === "entrega");
                  const segundoMovimientoEntrega = movimientosEntrega[1];
                    return segundoMovimientoEntrega ? new Date(segundoMovimientoEntrega.horario).toLocaleDateString() : "N/A";})()}
                </td>
                <td>
                  {esEmpresa
                    ? pedido.Obra.empresa?.nombre
                    : pedido.Obra.particular?.nombre}
                </td>
                <td>{pedido.estado}</td>
                <td>
                  {pedido.Obra.calle}{" "}
                  {pedido.Obra.esquina ? pedido.Obra.esquina : ""}{" "}
                  {pedido.Obra.numeroPuerta ? pedido.Obra.numeroPuerta : ""}
                </td>
                <td>${pedido.pagoPedido.precio}</td>
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
