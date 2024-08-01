import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
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
import { getEmpresaId, getParticularId, getPedidosFiltro } from "../../api"; // Asegúrate de tener esta función en api.js
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import moment from "moment";
import BuscarEmpresaPorNombre from "../EmpresasFolder/BuscarEmpresaPorNombre"; // Ajusta la ruta según sea necesario
import BuscarParticularPorNombre from "../ParticularesFolder/BuscarParticularPorNombre"; // Ajusta la ruta según sea necesario
import { TIPOS_HORARIO_PEDIDO, ESTADOS_PEDIDO } from "../../config/config"; // Importa las constantes

const ListaPedido = () => {
  const [pedidos, setPedidos] = useState([]);
  const [pedidosMultiples, setPedidosMultiples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Establecer fecha de inicio y fin por defecto al día corriente
  const [fechaInicio, setFechaInicio] = useState(
    moment().startOf("day").add(1, "hours").format("YYYY-MM-DDTHH:mm")
  );
  const [fechaFin, setFechaFin] = useState(
    moment().endOf("day").format("YYYY-MM-DDTHH:mm")
  );
  const [estado, setEstado] = useState("");
  const [tipoHorario, setTipoHorario] = useState("creacion");
  const [empresaId, setEmpresaId] = useState(null);
  const [obras, setObras] = useState([]);
  const [obraId, setObraId] = useState("");
  const [particularId, setParticularId] = useState(null);
  const [empresaNombre, setEmpresaNombre] = useState("");
  const [particularNombre, setParticularNombre] = useState("");
  const [openFilters, setOpenFilters] = useState(false); // Estado para manejar el despliegue de filtros
  const [filtroTipo, setFiltroTipo] = useState("empresa"); // Estado para manejar el filtro de empresa o particular
  const hasMounted = useRef(false); // Ref para verificar si el componente está montado
  const empleados = useSelector((state) => state.empleados.empleados);
  const choferes = empleados.filter(
    (empleado) => empleado.rol === "chofer" && empleado.habilitado
  );
  const [choferSeleccionado, setChoferSeleccionado] = useState("");
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
    const defaultParams = {
      estado,
      fechaInicio,
      fechaFin,
      tipoHorario,
      empresaId,
      particularId,
      obraId,
      choferId: choferSeleccionado,
    };
    fetchPedidos(defaultParams);
  }, [getToken]);

  useEffect(() => {
    const fetchObras = async () => {
      const usuarioToken = getToken();
      let response;
      if (empresaId) {
        response = await getEmpresaId(empresaId, usuarioToken);
      } else if (particularId) {
        response = await getParticularId(particularId, usuarioToken);
      }
      if (response && response.data && response.data.obras) {
        setObras(response.data.obras);
      }
    };

    if (hasMounted.current && (empresaId || particularId)) {
      fetchObras();
    } else {
      hasMounted.current = true;
    }
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
      obraId: obraId === "" ? "" : Number(obraId),
      choferId: choferSeleccionado,
    };
    console.log(params);
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

  const handleCancelarSeleccionEmpresa = () => {
    setEmpresaId(null);
    setEmpresaNombre("");
  };

  const handleCancelarSeleccionParticular = () => {
    setParticularId(null);
    setParticularNombre("");
  };

  const filtrarPedidos = (fechaCreacion, pedidoId, creadoComo) => {
    const pedidosFiltrados = pedidos.filter(
      (pedido) =>
        pedido.createdAt === fechaCreacion &&
        pedido.creadoComo === creadoComo &&
        (pedido.referenciaId === pedidoId || pedido.id === pedidoId)
    );
    setPedidosMultiples(pedidosFiltrados);
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
              <Col md={2}>
                <Form.Group controlId="fechaInicio">
                  <Form.Label>Fecha de Inicio *</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group controlId="fechaFin">
                  <Form.Label>Fecha de Fin *</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group controlId="tipoHorario">
                  <Form.Label>Tipo *</Form.Label>
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
              <Col md={2}>
                <Form.Group controlId="estado">
                  <Form.Label>Estado</Form.Label>
                  <Form.Control
                    as="select"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                  >
                    <option value="">Todos</option> {/* Opción adicional */}
                    {ESTADOS_PEDIDO.map((estado) => (
                      <option key={estado.value} value={estado.value}>
                        {estado.label}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={3}>
                {!empresaId && !particularId && (
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
                )}
                {filtroTipo === "empresa" ? (
                  empresaId ? (
                    <>
                      <Form.Text>
                        Empresa seleccionada: {empresaNombre}
                      </Form.Text>
                      <Button
                        variant="danger"
                        onClick={handleCancelarSeleccionEmpresa}
                      >
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <BuscarEmpresaPorNombre
                      onSeleccionar={handleEmpresaSeleccionada}
                    />
                  )
                ) : particularId ? (
                  <>
                    <Form.Text>
                      Particular seleccionado: {particularNombre}
                    </Form.Text>
                    <Button
                      variant="danger"
                      onClick={handleCancelarSeleccionParticular}
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <BuscarParticularPorNombre
                    onSeleccionar={handleParticularSeleccionado}
                  />
                )}
              </Col>
              <Col md={3}>
                <Form.Group controlId="formObra">
                  <Form.Label>Selecciona una obra</Form.Label>
                  <Form.Control
                    as="select"
                    value={obraId}
                    onChange={(e) => setObraId(e.target.value)}
                    disabled={obras.length === 0}
                  >
                    <option value="">Sin obra</option>
                    {obras.length === 0 ? (
                      <option>No hay obras disponibles</option>
                    ) : (
                      obras.map((obra) => (
                        <option key={obra.id} value={obra.id}>
                          {obra.calle} {obra.esquina} {obra.numeroPuerta}
                        </option>
                      ))
                    )}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group controlId="choferSeleccionado">
                  <Form.Label>Seleccionar Chofer</Form.Label>
                  <Form.Control
                    as="select"
                    value={choferSeleccionado}
                    onChange={(e) => setChoferSeleccionado(e.target.value)}
                  >
                    <option value="">Seleccione un chofer</option>
                    {choferes.map((chofer) => (
                      <option key={chofer.id} value={chofer.id}>
                        {chofer.nombre}
                      </option>
                    ))}
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

      <div className="table-container">
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th className="column-fecha">
                {tipoHorario === "creacion" && "Fecha Creación"}
                {(tipoHorario === "sugerenciaEntrega" ||
                  tipoHorario === "sugerenciaLevante") &&
                  "Fecha Sugerida"}
                {tipoHorario === "movimientoLevante" && "Fecha Levante"}
                {tipoHorario === "movimientoEntrega" && "Fecha Entrega"}
              </th>
              <th className="column-cliente">Cliente</th>
              <th className="column-direccion">Dirección</th>
              <th className="column-precio">Precio</th>
              <th className="column-pagado">Pagado</th>
              <th className="column-tipo-sugerido">Tipo Sugerido</th>
              <th className="column-estado">Estado</th>
              <th className="column-chofer">
                {tipoHorario === "creacion" && "Chofer"}
                {tipoHorario === "sugerenciaEntrega" && "Chofer Sug. ent."}
                {tipoHorario === "sugerenciaLevante" && "Chofer Sug. lev."}
                {tipoHorario === "movimientoEntrega" && "Chofer Entrega"}
                {tipoHorario === "movimientoLevante" && "Chofer Levante"}
              </th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => {
              const esEmpresa = !!pedido.Obra.empresa;
              const colorFondoCliente = esEmpresa ? "lightblue" : "lavender";
              const colorFondoPago = pedido.pagoPedido?.pagado
                ? "#d4edda"
                : "#f8d7da"; // Verde claro o rojo claro para el pago

              return (
                <tr
                  key={pedido.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRowClick(pedido)}
                >
                  <td className="column-fecha">
                    {tipoHorario === "creacion" &&
                      (pedido.createdAt
                        ? new Date(pedido.createdAt).toLocaleDateString()
                        : "N/A")}
                    {(tipoHorario === "sugerenciaEntrega" ||
                      tipoHorario === "sugerenciaLevante") &&
                      (() => {
                        const sugerencia = pedido.Sugerencias.find(
                          (s) => s.horarioSugerido
                        );
                        return sugerencia
                          ? new Date(
                              sugerencia.horarioSugerido
                            ).toLocaleDateString()
                          : "N/A";
                      })()}
                    {tipoHorario === "movimientoLevante" &&
                      (() => {
                        const movimientoLevante = pedido.Movimientos.find(
                          (m) => m.tipo === "levante"
                        );
                        return movimientoLevante
                          ? new Date(
                              movimientoLevante.horario
                            ).toLocaleDateString()
                          : "N/A";
                      })()}
                    {tipoHorario === "movimientoEntrega" &&
                      (() => {
                        const movimientosEntrega = pedido.Movimientos.filter(
                          (m) => m.tipo === "entrega"
                        );
                        const segundoMovimientoEntrega = movimientosEntrega[1];
                        return segundoMovimientoEntrega
                          ? new Date(
                              segundoMovimientoEntrega.horario
                            ).toLocaleDateString()
                          : "N/A";
                      })()}
                  </td>
                  <td
                    className="column-cliente"
                    style={{ backgroundColor: colorFondoCliente }}
                  >
                    {esEmpresa
                      ? pedido.Obra.empresa?.nombre
                      : pedido.Obra.particular?.nombre}
                  </td>
                  <td className="column-direccion">
                    {pedido.Obra.calle}{" "}
                    {pedido.Obra.esquina ? pedido.Obra.esquina : ""}{" "}
                    {pedido.Obra.numeroPuerta ? pedido.Obra.numeroPuerta : ""}
                  </td>
                  <td className="column-precio">${pedido.pagoPedido?.precio}</td>
                  <td
                    className="column-pagado"
                    style={{ backgroundColor: colorFondoPago }}
                  >
                    {pedido.pagoPedido?.pagado ? "Sí" : "No"}
                  </td>
                  <td className="column-chofer">
                    {pedido.Sugerencias[0]?.tipoSugerido || "N/A"}
                  </td>
                  <td className="column-tipo-sugerido">{pedido.estado}</td>
                  <td className="column-chofer">
                    {tipoHorario === "creacion" && pedido.Movimientos.length > 0
                      ? choferes.find(
                          (chofer) =>
                            chofer.id ===
                            pedido.Movimientos[pedido.Movimientos.length - 1]
                              .choferId
                        )?.nombre || "-"
                      : tipoHorario === "sugerenciaEntrega"
                      ? choferes.find(
                          (chofer) =>
                            chofer.id ===
                            pedido.Sugerencias.find(
                              (s) => s.tipoSugerido === "entrega"
                            )?.choferSugeridoId
                        )?.nombre || "-"
                      : tipoHorario === "sugerenciaLevante"
                      ? choferes.find(
                          (chofer) =>
                            chofer.id ===
                            pedido.Sugerencias.find(
                              (s) => s.tipoSugerido === "levante"
                            )?.choferSugeridoId
                        )?.nombre || "-"
                      : tipoHorario === "movimientoEntrega"
                      ? choferes.find(
                          (chofer) =>
                            chofer.id ===
                            pedido.Movimientos.find((m) => m.tipo === "entrega")
                              ?.choferId
                        )?.nombre || "-"
                      : tipoHorario === "movimientoLevante"
                      ? choferes.find(
                          (chofer) =>
                            chofer.id ===
                            pedido.Movimientos.find((m) => m.tipo === "levante")
                              ?.choferId
                        )?.nombre || "-"
                      : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <div className="table-responsive-scroll"></div>
      </div>
    </Container>
  );
};

export default ListaPedido;
