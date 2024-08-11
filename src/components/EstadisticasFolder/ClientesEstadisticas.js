import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Spinner,
  Alert,
  Card,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import {
  getClienteEstadisticas,
  getEmpresaId,
  getParticularId,
} from "../../api";
import useAuth from "../../hooks/useAuth";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import BuscarEmpresaPorNombre from "../EmpresasFolder/BuscarEmpresaPorNombre";
import BuscarParticularPorNombre from "../ParticularesFolder/BuscarParticularPorNombre";
import { ESTADOS_PEDIDO } from "../../config/config"; // Asegúrate de tener esta configuración

const ClientesEstadisticas = () => {
  const [estadisticas, setEstadisticas] = useState({});
  const [loading, setLoading] = useState(false); // No cargar por defecto
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [fechaInicio, setFechaInicio] = useState(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [fechaFin, setFechaFin] = useState(
    moment().endOf("month").format("YYYY-MM-DD")
  );
  const [empresaId, setEmpresaId] = useState(null);
  const [empresaNombre, setEmpresaNombre] = useState("");
  const [particularId, setParticularId] = useState(null);
  const [particularNombre, setParticularNombre] = useState("");
  const [obras, setObras] = useState([]);
  const [estado, setEstado] = useState("");
  const [tipoBusqueda, setTipoBusqueda] = useState(""); // Estado para el tipo de búsqueda
  const getToken = useAuth();
  const navigate = useNavigate();

  const buscarCliente = async (id, tipo) => {
    const usuarioToken = getToken();
    try {
      if (tipo === "empresa") {
        const response = await getEmpresaId(id, usuarioToken);
        setObras(response.data.obras);
      } else if (tipo === "particular") {
        const response = await getParticularId(id, usuarioToken);
        setParticularNombre(response.data.nombre);
      }
    } catch (error) {
      console.log(error);
      setError("Error al obtener el cliente");
    }
  };

  const fetchEstadisticas = async (
    fechaInicio,
    fechaFin,
    empresaId,
    particularId,
    estado
  ) => {
    if (!empresaId && !particularId) {
      setError("Debe seleccionar una empresa o particular");
      setTimeout(() => setError(""), 5000);
      return;
    } else {
      const usuarioToken = getToken();
      try {
        const response = await getClienteEstadisticas(
          fechaInicio,
          fechaFin,
          empresaId,
          particularId,
          estado,
          usuarioToken
        );
        if (empresaId) {
          buscarCliente(empresaId, "empresa");
        }
        if (particularId) {
          buscarCliente(particularId, "particular");
        }

        setEstadisticas(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error al obtener las estadísticas de clientes");
        setLoading(false);
      }
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setEmpresaId(null);
    setEmpresaNombre("");
    setParticularId(null);
    setParticularNombre("");
    setTipoBusqueda(""); // Resetear el tipo de búsqueda al cerrar el modal
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchEstadisticas(fechaInicio, fechaFin, empresaId, particularId, estado);
  };

  const handleEmpresaSeleccionada = (id, nombre) => {
    setEmpresaId(id);
    setEmpresaNombre(nombre);
  };

  const handleParticularSeleccionado = (id, nombre) => {
    setParticularId(id);
    setParticularNombre(nombre);
  };

  const handleCancelarSeleccion = () => {
    setEmpresaId(null);
    setEmpresaNombre("");
    setParticularId(null);
    setParticularNombre("");
    setTipoBusqueda("");
  };

  const handlePedidoClick = (idPedido) => {
    navigate("/pedidos/datos", { state: { pedidoId: idPedido } });
  };

  const [mostrarPagados, setMostrarPagados] = useState(false);
  const [mostrarNoPagados, setMostrarNoPagados] = useState(false);
  const [mostrarEstados, setMostrarEstados] = useState({
    levantado: false,
    entregado: false,
    iniciado: false,
    cancelado: false,
  });
  const [mostrarObras, setMostrarObras] = useState({});
  const toggleMostrarPagados = () => {
    setMostrarPagados(!mostrarPagados);
  };
  const toggleMostrarNoPagados = () => {
    setMostrarNoPagados(!mostrarNoPagados);
  };
  const toggleMostrarEstado = (estado) => {
    setMostrarEstados((prev) => ({
      ...prev,
      [estado]: !prev[estado],
    }));
  };
  const toggleMostrarObra = (obraId) => {
    setMostrarObras((prev) => ({
      ...prev,
      [obraId]: !prev[obraId],
    }));
  };
  const getObraCalle = (id) => {
    const obra = obras.find((obra) => obra.id === parseInt(id));
    return obra ? obra.calle : `Obra ID ${id}`;
  };

  const tieneEstadisticas = Object.keys(estadisticas).length > 0;

  return (
    <Container>
      {loading && <Spinner animation="border" />}
      <Card className="mb-4">
        <Card.Header>
          <Card.Title>
            {empresaId
              ? `Estadísticas de Empresa: ${empresaNombre}`
              : particularId
              ? `Estadísticas de Particular: ${particularNombre}`
              : `Estadísticas de Cliente`}
          </Card.Title>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleFormSubmit} className="mt-3">
            <Row>
              <Col md={6}>
                <Form.Group controlId="fechaInicio">
                  <Form.Label>Fecha de Inicio</Form.Label>
                  <Form.Control
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    required
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
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {!empresaId && !particularId && (
              <Row>
                <Col md={6}>
                  <Form.Group controlId="tipoBusqueda">
                    <Form.Label>Buscar por</Form.Label>
                    <Form.Control
                      as="select"
                      value={tipoBusqueda}
                      onChange={(e) => setTipoBusqueda(e.target.value)}
                      required
                    >
                      <option value="">Seleccione...</option>
                      <option value="empresa">Empresa</option>
                      <option value="particular">Particular</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            )}
            {tipoBusqueda === "empresa" && !empresaId && (
              <Row>
                <Col md={12}>
                  <BuscarEmpresaPorNombre
                    onSeleccionar={handleEmpresaSeleccionada}
                  />
                </Col>
              </Row>
            )}
            {tipoBusqueda === "particular" && !particularId && (
              <Row>
                <Col md={12}>
                  <BuscarParticularPorNombre
                    onSeleccionar={handleParticularSeleccionado}
                  />
                </Col>
              </Row>
            )}
            {(empresaId || particularId) && (
              <Row>
                <Col md={6} className="d-flex align-items-center">
                  <Form.Label>
                    {empresaId
                      ? `Empresa: ${empresaNombre}`
                      : `Particular: ${particularNombre}`}
                  </Form.Label>
                  <Button
                    variant="danger"
                    className="mt-3"
                    onClick={handleCancelarSeleccion}
                  >
                    Otra Búsqueda
                  </Button>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="estado">
                    <Form.Label>Estado</Form.Label>
                    <Form.Control
                      as="select"
                      value={estado}
                      onChange={(e) => setEstado(e.target.value)}
                    >
                      <option value="">Todos</option>
                      {ESTADOS_PEDIDO.map((estado) => (
                        <option key={estado.value} value={estado.value}>
                          {estado.label}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            )}

            <Row>
              <Col md={6}>
                <Button variant="primary" type="submit" className="mt-4">
                  Aplicar
                </Button>
              </Col>
            </Row>
          </Form>
          {!loading && !error && tieneEstadisticas && (
            <>
            <Row>
  <Col md={6}>
    <ul style={{ listStyleType: "none", padding: 0 }}>
      <li style={{ marginBottom: "2px" }}>
        <strong>Total: </strong>
        {estadisticas.total || 0}
      </li>
      <li style={{ marginBottom: "2px" }}>
        <strong>Pagados: </strong>{" "}
        {estadisticas.pagados?.cantidad > 0
          ? `Cantidad: ${estadisticas.pagados.cantidad}, Monto: $${estadisticas.pagados.monto}`
          : "Cantidad: 0, Monto: $0"}
        {estadisticas.pagados?.ids && estadisticas.pagados.ids.length > 0 && (
          <>
            <Button
              variant="link"
              onClick={toggleMostrarPagados}
              className="mt-2"
              style={{
                marginLeft: "10px",
                padding: 0,
                fontSize: "0.9rem",
              }}
            >
              {mostrarPagados ? "Mostrar menos" : "Mostrar más"}
            </Button>
            {mostrarPagados && (
              <div style={{ marginLeft: "20px" }}>
                {estadisticas.pagados.ids.map((id) => (
                  <div
                    key={id}
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={() => handlePedidoClick(id)}
                  >
                    Pedido {id}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </li>
      <li style={{ marginBottom: "2px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <strong>No Pagados:</strong>
          {estadisticas.nopagados?.cantidad > 0
            ? `Cantidad: ${estadisticas.nopagados.cantidad}, Monto: $${estadisticas.nopagados.monto}`
            : "Cantidad: 0, Monto: $0"}
          {estadisticas.nopagados?.ids &&
            estadisticas.nopagados.ids.length > 0 && (
              <Button
                variant="link"
                onClick={toggleMostrarNoPagados}
                className="mt-3"
                style={{
                  marginLeft: "10px",
                  padding: 0,
                  fontSize: "0.9rem",
                }}
              >
                {mostrarNoPagados ? "Mostrar menos" : "Mostrar más"}
              </Button>
            )}
        </div>
        {mostrarNoPagados && (
          <div style={{ marginLeft: "20px" }}>
            {estadisticas.nopagados.ids.map((id) => (
              <div
                key={id}
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => handlePedidoClick(id)}
              >
                Pedido {id}
              </div>
            ))}
          </div>
        )}
      </li>

      <li style={{ marginBottom: "2px" }}>
        <strong>Estado:</strong>
        {estadisticas.estado && (
          <>
            {estadisticas.estado.levantado.cantidad > 0 && (
              <div style={{ marginBottom: "2px", marginLeft: "20px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <strong>Levantado:</strong>{" "}
                  {`Cantidad: ${estadisticas.estado.levantado.cantidad}`}
                  <Button
                    variant="link"
                    className="mt-2"
                    onClick={() => toggleMostrarEstado("levantado")}
                    style={{
                      marginLeft: "10px",
                      padding: 0,
                      fontSize: "0.9rem",
                    }}
                  >
                    {mostrarEstados.levantado
                      ? "Mostrar menos"
                      : "Mostrar más"}
                  </Button>
                </div>
                {mostrarEstados.levantado && (
                  <div style={{ marginLeft: "20px" }}>
                    {estadisticas.estado.levantado.ids.map((id) => (
                      <div
                        key={id}
                        style={{ cursor: "pointer", color: "blue" }}
                        onClick={() => handlePedidoClick(id)}
                      >
                        Pedido {id}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {estadisticas.estado.entregado.cantidad > 0 && (
              <div style={{ marginBottom: "2px", marginLeft: "20px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <strong>Entregado:</strong>{" "}
                  {`Cantidad: ${estadisticas.estado.entregado.cantidad}`}
                  <Button
                    variant="link"
                    className="mt-2"
                    onClick={() => toggleMostrarEstado("entregado")}
                    style={{
                      marginLeft: "10px",
                      padding: 0,
                      fontSize: "0.9rem",
                    }}
                  >
                    {mostrarEstados.entregado
                      ? "Mostrar menos"
                      : "Mostrar más"}
                  </Button>
                </div>
                {mostrarEstados.entregado && (
                  <div style={{ marginLeft: "20px" }}>
                    {estadisticas.estado.entregado.ids.map((id) => (
                      <div
                        key={id}
                        style={{ cursor: "pointer", color: "blue" }}
                        onClick={() => handlePedidoClick(id)}
                      >
                        Pedido {id}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {estadisticas.estado.iniciado.cantidad > 0 && (
              <div style={{ marginBottom: "2px", marginLeft: "20px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <strong>Iniciado:</strong>{" "}
                  {`Cantidad: ${estadisticas.estado.iniciado.cantidad}`}
                  <Button
                    variant="link"
                    className="mt-2"
                    onClick={() => toggleMostrarEstado("iniciado")}
                    style={{
                      marginLeft: "10px",
                      padding: 0,
                      fontSize: "0.9rem",
                    }}
                  >
                    {mostrarEstados.iniciado
                      ? "Mostrar menos"
                      : "Mostrar más"}
                  </Button>
                </div>
                {mostrarEstados.iniciado && (
                  <div style={{ marginLeft: "20px" }}>
                    {estadisticas.estado.iniciado.ids.map((id) => (
                      <div
                        key={id}
                        style={{ cursor: "pointer", color: "blue" }}
                        onClick={() => handlePedidoClick(id)}
                      >
                        Pedido {id}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {estadisticas.estado.cancelado.cantidad > 0 && (
              <div style={{ marginBottom: "2px", marginLeft: "20px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <strong>Cancelado:</strong>{" "}
                  {`Cantidad: ${estadisticas.estado.cancelado.cantidad}`}
                  <Button
                    variant="link"
                    className="mt-2"
                    onClick={() => toggleMostrarEstado("cancelado")}
                    style={{
                      marginLeft: "10px",
                      padding: 0,
                      fontSize: "0.9rem",
                    }}
                  >
                    {mostrarEstados.cancelado
                      ? "Mostrar menos"
                      : "Mostrar más"}
                  </Button>
                </div>
                {mostrarEstados.cancelado && (
                  <div style={{ marginLeft: "20px" }}>
                    {estadisticas.estado.cancelado.ids.map((id) => (
                      <div
                        key={id}
                        style={{ cursor: "pointer", color: "blue" }}
                        onClick={() => handlePedidoClick(id)}
                      >
                        Pedido {id}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </li>
    </ul>
  </Col>

  <Col md={6}>
    <ul style={{ listStyleType: "none", padding: 0 }}>
      <li style={{ marginBottom: "2px" }}>
        <strong>Obras:</strong>
        {estadisticas.obras &&
          Object.keys(estadisticas.obras).map((key) => (
            <div key={key} style={{ marginBottom: "2px", marginLeft: "20px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <strong>{getObraCalle(key)}:</strong>{" "}
                {`Cantidad: ${estadisticas.obras[key].cantidad || 0}`}
                {estadisticas.obras[key].ids.length > 0 && (
                  <Button
                    variant="link"
                    onClick={() => toggleMostrarObra(key)}
                    style={{
                      marginLeft: "10px",
                      padding: 0,
                      fontSize: "0.9rem",
                    }}
                  >
                    {mostrarObras[key] ? "Mostrar menos" : "Mostrar más"}
                  </Button>
                )}
              </div>
              {mostrarObras[key] && (
                <div style={{ marginLeft: "20px" }}>
                  {estadisticas.obras[key].ids.map((id) => (
                    <div
                      key={id}
                      style={{ cursor: "pointer", color: "blue" }}
                      onClick={() => handlePedidoClick(id)}
                    >
                      Pedido {id}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </li>
    </ul>
  </Col>
</Row>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ClientesEstadisticas;
