import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useSelector } from 'react-redux';
import AgregarEmpresa from "../EmpresasFolder/AgegarEmpresa";
import AgregarParticular from "../ParticularesFolder/AgregarParticular";
import BuscarEmpresa from "../PedidosFolder/BuscarEmpresa";
import BuscarParticular from "../PedidosFolder/BuscarParticular";
import SelectObra from "../ObrasFolder/SelectObra";
import AgregarObra from "../ObrasFolder/AgregarObra";
import useAuth from "../../hooks/useAuth";
import { getPermisoIdEmpresa, postPedidoNuevo, postPedidoMultiple, postPedidoEntregaLevante } from '../../api';
import SelectPermiso from "../PermisosFolder/selectPermiso"; // Importa desde la carpeta PermisosFolder

const AgregarPedido = () => {
  const [clienteTipo, setClienteTipo] = useState("");
  const [clienteEstado, setClienteEstado] = useState("");
  const [clienteNuevo, setClienteNuevo] = useState(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [obras, setObras] = useState([]);
  const [obraSeleccionada, setObraSeleccionada] = useState(null);
  const [horarioSugerido, setHorarioSugerido] = useState("");
  const [tipoPedido, setTipoPedido] = useState("");
  const [loadingObras, setLoadingObras] = useState(false);
  const [errorObras, setErrorObras] = useState("");
  const [showAgregarObra, setShowAgregarObra] = useState(false);
  const [choferSeleccionado, setChoferSeleccionado] = useState("");
  const [permisoSeleccionado, setPermisoSeleccionado] = useState("");
  const [pagado, setPagado] = useState(false); 
  const [cantidad, setCantidad] = useState(1); 
  const [descripcion, setDescripcion] = useState(""); 
  const [tipoPago, setTipoPago] = useState("transferencia"); 
  const [precio, setPrecio] = useState(1000); 
  const [error, setError] = useState(""); 
  const [success, setSuccess] = useState(""); 

  const empleados = useSelector(state => state.empleados.empleados);
  const choferes = empleados.filter(empleado => empleado.rol === "chofer");

  const getToken = useAuth();

  useEffect(() => {
    if (clienteSeleccionado) {
      console.log("Obras:", obras);
    }
  }, [obras]);

  const handleClienteTipoChange = (e) => {
    setClienteTipo(e.target.value);
    setClienteNuevo(null);
    setClienteEstado("");
    setClienteSeleccionado(null);
    setObras([]);
    setObraSeleccionada(null);
  };

  const handleClienteEstadoChange = (e) => {
    setClienteEstado(e.target.value);
  };

  const handleAgregarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    if (cliente.obras && Array.isArray(cliente.obras)) {
      setObras(cliente.obras);
    } else {
      setObras([]);
    }
    setClienteNuevo(null);
  };

  const handleAgregarObra = (obra) => {
    setObras([...obras, obra]);
    setObraSeleccionada(obra);
    setShowAgregarObra(false);
  };

  const handleTipoPedidoChange = (e) => {
    setTipoPedido(e.target.value);
  };

  const handlePermisoChange = (permisoId) => {
    setPermisoSeleccionado(permisoId);
  };

  const handleEnviarPedido = async () => {
    const usuarioToken = getToken();
    const pedido = {
      //clienteId: clienteSeleccionado?.id,
      obraId: obraSeleccionada,
      descripcion,
      permisoId: permisoSeleccionado === "" ? null : permisoSeleccionado,
      precio,
      pagado,
      tipoPago,
      horarioSugerido,
      choferSugeridoId: choferSeleccionado,
      cantidadMultiple: cantidad,
    };

    try {
      let response;
      if (tipoPedido === "simple") {
        response = await postPedidoNuevo(pedido, usuarioToken);
      } else if (tipoPedido === "multiple") {
        response = await postPedidoMultiple({ ...pedido, cantidad }, usuarioToken);
      } else if (tipoPedido === "entrega/levante") {
        response = await postPedidoEntregaLevante(pedido, usuarioToken);
      }

      console.log(response.data);
      setSuccess("Pedido enviado correctamente");
      setError("");

      // Limpiar los campos del formulario después de enviar el pedido
      setClienteTipo("");
      setClienteEstado("");
      setClienteNuevo(null);
      setClienteSeleccionado(null);
      setObras([]);
      setObraSeleccionada(null);
      setHorarioSugerido("");
      setTipoPedido("");
      setChoferSeleccionado("");
      setPermisoSeleccionado("");
      setPagado(false);
      setCantidad(1);
      setDescripcion("");
      setTipoPago("transferencia");
      setPrecio(1000);
    } catch (error) {
      console.error("Error al enviar el pedido:", error.response?.data?.error, error.response?.data?.detalle || error.message);
      setError(error.response?.data?.error + " - " + error.response?.data?.detalle);
      setSuccess("");
    }
  };

  return (
    <Container>
      <h1>
        Nuevo Pedido{" "}
        {clienteSeleccionado ? `para ${clienteSeleccionado.nombre}` : ""}
      </h1>
      <Form>
        <Row>
          <Col>
            <Form.Group controlId="clienteTipo">
              <Form.Label>Tipo de Cliente</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  label="Empresa"
                  value="empresa"
                  checked={clienteTipo === "empresa"}
                  onChange={handleClienteTipoChange}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Particular"
                  value="particular"
                  checked={clienteTipo === "particular"}
                  onChange={handleClienteTipoChange}
                />
              </div>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="clienteEstado">
              <Form.Label>Estado del Cliente</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  label="Nuevo"
                  value="nuevo"
                  checked={clienteEstado === "nuevo"}
                  onChange={handleClienteEstadoChange}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Registrado"
                  value="registrado"
                  checked={clienteEstado === "registrado"}
                  onChange={handleClienteEstadoChange}
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
    
        {clienteEstado === "nuevo" && clienteTipo === "empresa" && (
          <AgregarEmpresa
            onSubmit={handleAgregarCliente}
            onCancel={() => setClienteEstado("")}
          />
        )}
    
        {clienteEstado === "nuevo" && clienteTipo === "particular" && (
          <AgregarParticular
            onSubmit={handleAgregarCliente}
            onCancel={() => setClienteEstado("")}
          />
        )}
    
        {clienteEstado === "registrado" &&
          clienteTipo === "empresa" &&
          !clienteSeleccionado && (
            <BuscarEmpresa
              onSeleccionar={handleAgregarCliente}
              getToken={getToken}
            />
          )}
    
        {clienteEstado === "registrado" &&
          clienteTipo === "particular" &&
          !clienteSeleccionado && (
            <BuscarParticular
              onSeleccionar={handleAgregarCliente}
              getToken={getToken}
            />
          )}
    
        {clienteSeleccionado && (
          <>
            {loadingObras && <Spinner animation="border" />}
            {errorObras && <Alert variant="danger">{errorObras}</Alert>}
            {!loadingObras && !errorObras && obras.length === 0 && (
              <Alert variant="info">Sin obras hasta ahora</Alert>
            )}
            <SelectObra
              obras={obras}
              onSelect={(id) => setObraSeleccionada(id)}
              onNuevaObra={() => setShowAgregarObra(true)}
            />
            <Button
              variant="primary"
              onClick={() => setShowAgregarObra(true)}
              className="mt-2"
            >
              Nueva Obra
            </Button>
          </>
        )}
    
        {showAgregarObra && (
          <AgregarObra
            empresaId={clienteSeleccionado.id}
            onObraAgregada={handleAgregarObra}
          />
        )}
    
        {clienteTipo === "empresa" && clienteSeleccionado && (
          <SelectPermiso
            empresaId={clienteSeleccionado.id}
            onSelect={handlePermisoChange}
          />
        )}
    
        <Row>
          <Col>
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
          <Col>
            <Form.Group controlId="horarioSugerido">
              <Form.Label>Horario Sugerido</Form.Label>
              <Form.Control
                type="datetime-local"
                value={horarioSugerido}
                onChange={(e) => setHorarioSugerido(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
    
        <Row>
          <Col>
            <Form.Group controlId="tipoPedido">
              <Form.Label>Tipo de Pedido</Form.Label>
              <div>
                <Form.Check
                  type="radio"
                  label="Simple"
                  value="simple"
                  checked={tipoPedido === "simple"}
                  onChange={handleTipoPedidoChange}
                />
                <Form.Check
                  type="radio"
                  label="Múltiple"
                  value="multiple"
                  checked={tipoPedido === "multiple"}
                  onChange={handleTipoPedidoChange}
                />
                <Form.Check
                  type="radio"
                  label="Entrega/Levante"
                  value="entrega/levante"
                  checked={tipoPedido === "entrega/levante"}
                  onChange={handleTipoPedidoChange}
                />
              </div>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="descripcion">
              <Form.Label>Descripción (opcional)</Form.Label>
              <Form.Control
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
    
        {tipoPedido === "multiple" && (
          <Form.Group controlId="cantidad">
            <Form.Label>Cantidad</Form.Label>
            <Form.Control
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value))}
              min="1"
            />
          </Form.Group>
        )}
    
        <Form.Group controlId="pagado">
          <Form.Check
            type="checkbox"
            label="Pagado"
            checked={pagado}
            onChange={(e) => setPagado(e.target.checked)}
          />
        </Form.Group>
    
        <Row>
          <Col>
            <Form.Group controlId="tipoPago">
              <Form.Label>Tipo de Pago</Form.Label>
              <Form.Control
                as="select"
                value={tipoPago}
                onChange={(e) => setTipoPago(e.target.value)}
              >
                <option value="transferencia">Transferencia</option>
                <option value="efectivo">Efectivo</option>
                <option value="cheque">Cheque</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="precio">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                value={precio}
                onChange={(e) => setPrecio(parseFloat(e.target.value))}
                min="0"
              />
            </Form.Group>
          </Col>
        </Row>
    
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
    
        <Button variant="primary" onClick={handleEnviarPedido}>
          Enviar Pedido
        </Button>
      </Form>
    </Container>    
  );
};

export default AgregarPedido;
