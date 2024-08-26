import React, { useState, useEffect } from "react";
import { Container, Card, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap"
import { getPedidosFiltro, postFactura } from "../../api";
import useAuth from "../../hooks/useAuth";
import SelectEmpresaPorNombre from "../EmpresasFolder/SelectEmpresaPorNombre";
import SelectParticularPorNombre from "../ParticularesFolder/SelectParticularPorNombre";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const AgregarFactura = () => {
  const [empresaId, setEmpresaId] = useState(null);
  const [empresaNombre, setEmpresaNombre] = useState("");
  const [particularId, setParticularId] = useState(null);
  const [particularNombre, setParticularNombre] = useState("");
  const [pedidos, setPedidos] = useState([]);
  const [selectedPedidos, setSelectedPedidos] = useState([]);
  const [tipo, setTipo] = useState("contado");
  const [tipoCliente, setTipoCliente] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [numeracion, setNumeracion] = useState("");
  const [fechaInicio, setFechaInicio] = useState(moment().startOf("month").format("YYYY-MM-DD"));
  const [fechaFin, setFechaFin] = useState(moment().endOf("month").format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [descripcionError, setDescripcionError] = useState("");
  const [success, setSuccess] = useState("");
  const getToken = useAuth();
  const navigate = useNavigate();

  const MAX_DESCRIPCION_LENGTH = 255;

  //navigate("/facturas/datos", { state: { facturaId: idFactura } });

  useEffect(() => {
    if (empresaId || particularId) {
      fetchPedidos();
    }
  }, [empresaId, particularId, fechaInicio, fechaFin]);

  const fetchPedidos = async () => {
    setLoading(true);
    const usuarioToken = getToken();
    try {
      const response = await getPedidosFiltro(usuarioToken, {
        estado: null,
        fechaInicio,
        fechaFin,
        tipoHorario: "creacion",
        empresaId,
        particularId,
        obraId: null,
      });
      const pedidosNoPagados = response.data.filter(pedido => !pedido.pagoPedido.pagado);
      setPedidos(pedidosNoPagados);
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
      setError("Error al obtener los pedidos");
      setTimeout(() => setError(""), 5000);
    }
    setLoading(false);
  };

  const handleEmpresaSeleccionada = (id, nombre) => {
    setEmpresaId(id);
    setEmpresaNombre(nombre);
    setParticularId(null);
    setParticularNombre("");
  };

  const handleParticularSeleccionada = (id, nombre) => {
    setParticularId(id);
    setParticularNombre(nombre);
    setEmpresaId(null);
    setEmpresaNombre("");
  };

  const handlePedidoChange = (e) => {
    const { value, checked } = e.target;
    setSelectedPedidos((prev) =>
      checked ? [...prev, value] : prev.filter((pedidoId) => pedidoId !== value)
    );
  };

  const handleDescripcionChange = (e) => {
    const value = e.target.value;
    if (value.length > MAX_DESCRIPCION_LENGTH) {
      setDescripcionError(`La descripción no puede exceder ${MAX_DESCRIPCION_LENGTH} caracteres.`);
    } else {
      setDescripcionError("");
      setDescripcion(value);
    }
  };

  const handleSubmit = async (e) => {
    const usuarioToken = getToken();
    e.preventDefault();
    if (!empresaId && !particularId) {
      setError("Debe seleccionar una empresa o un particular");
      setTimeout(() => setError(""), 5000);
      return;
    }
    if (selectedPedidos.length === 0) {
      setError("Debe seleccionar al menos un pedido");
      setTimeout(() => setError(""), 5000);
      return;
    }
    if (descripcion.length > MAX_DESCRIPCION_LENGTH) {
      setDescripcionError(`La descripción no puede exceder ${MAX_DESCRIPCION_LENGTH} caracteres.`);
      return;
    }

    const factura = {
      empresaId,
      particularId,
      pedidosIds: selectedPedidos,
      tipo,
      descripcion,
      numeracion : numeracion || null,
    };

    try {
      const response = await postFactura(factura, usuarioToken);
      console.log("Factura creada correctamente", response.data);
      setError("");
      setSuccess("Factura creada correctamente");
      setTimeout(() => 
        navigate("/facturas/datos", { state: { facturaId: response.data.id } }),
        setSuccess("")
      , 500);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.error || "Error al crear la factura");
      setTimeout(() => setError(""), 5000);
    }
  };

  return (
    <Container>
      <Card>
        <Card.Header>
          <Card.Title>
            {empresaId
              ? `Factura para Empresa: ${empresaNombre}`
              : particularId
              ? `Factura para Particular: ${particularNombre}`
              : `Agregar Factura`}
          </Card.Title>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={3}>
                <Form.Group controlId="fechaInicio">
                  <Form.Label>Traer Pedidos Desde:</Form.Label>
                  <Form.Control
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="fechaFin">
                  <Form.Label>Traer Pedidos Hasta:</Form.Label>
                  <Form.Control
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={5}>
                {!empresaId && !particularId && (
                  <>
                    <Form.Group controlId="tipoBusqueda">
                      <Form.Label>Del Cliente:</Form.Label>
                      <Form.Control
                        as="select"
                        value={tipoCliente}
                        onChange={(e) => setTipoCliente(e.target.value)}
                        required
                      >
                        <option value="">Seleccione...</option>
                        <option value="empresa">Empresa</option>
                        <option value="particular">Particular</option>
                      </Form.Control>
                    </Form.Group>
                    {tipoCliente === "empresa" && (
                      <SelectEmpresaPorNombre
                        onSeleccionar={handleEmpresaSeleccionada}
                      />
                    )}
                    {tipoCliente === "particular" && (
                      <SelectParticularPorNombre
                        onSeleccionar={handleParticularSeleccionada}
                      />
                    )}
                  </>
                )}
                {empresaId || particularId ? (
                  <div>
                    <strong>
                      {empresaId
                        ? `Empresa: ${empresaNombre}`
                        : `Particular: ${particularNombre}`}
                    </strong>
                    <Button
                      variant="danger"
                      className="ml-3"
                      onClick={() => {
                        setEmpresaId(null);
                        setEmpresaNombre("");
                        setParticularId(null);
                        setParticularNombre("");
                        setPedidos([]);
                        setSelectedPedidos([]);
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                ) : null}
              </Col>
            </Row>
            {loading && <Spinner animation="border" />}
            {pedidos.length > 0 && (
              <Row>
                <Col md={12}>
                  <Form.Group controlId="pedidos">
                    <Form.Label>Seleccionar Pedidos</Form.Label>
                    <div
                      style={{
                        maxHeight: "200px",
                        overflowY: "auto",
                        border: "1px solid #ccc",
                        padding: "10px",
                      }}
                    >
                      {pedidos.map((pedido) => (
                        <Form.Check
                          type="checkbox"
                          key={pedido.id}
                          label={`Pedido ${pedido.id} - ${pedido.Obra?.calle}`}
                          value={pedido.id}
                          onChange={handlePedidoChange}
                        />
                      ))}
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            )}
            <Row>
              <Col md={3}>
                <Form.Group controlId="tipo">
                  <Form.Label>Tipo</Form.Label>
                  <Form.Control
                    as="select"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    required
                  >
                    <option value="contado">Contado</option>
                    <option value="credito">Crédito</option>
                    <option value="recibo">Recibo</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="numeracion">
                  <Form.Label>Numeración</Form.Label>
                  <Form.Control
                    type="text"
                    value={numeracion}
                    onChange={(e) => setNumeracion(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={5}>
                <Form.Group controlId="descripcion">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={descripcion}
                    onChange={handleDescripcionChange}
                    isInvalid={!!descripcionError}
                  />
                  <Form.Control.Feedback type="invalid">
                    {descripcionError}
                  </Form.Control.Feedback>
                  <Form.Text muted>
                    {descripcion.length}/{MAX_DESCRIPCION_LENGTH} caracteres
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit">
              Agregar Factura
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AgregarFactura;
