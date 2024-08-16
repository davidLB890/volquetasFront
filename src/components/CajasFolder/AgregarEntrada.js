import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Row, Col, Alert, Spinner, Container, Dropdown } from "react-bootstrap";
import { postCaja } from "../../api";
import useAuth from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const AgregarEntrada = ({ onSuccess, onHide, efectivo }) => {
  const [fecha, setFecha] = useState("");
  const [motivo, setMotivo] = useState(efectivo ? "ingreso pedido" : "");
  const [monto, setMonto] = useState("");
  const montoAPagar = useSelector((state) => state.pedido.pedido.pagoPedido.precio);
  const [moneda, setMoneda] = useState("peso");
  const [descripcion, setDescripcion] = useState("");
  const [empleadoId, setEmpleadoId] = useState("");
  const [pedidoId, setPedidoId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [descripcionError, setDescripcionError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmpleados, setFilteredEmpleados] = useState([]);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const empleados = useSelector((state) => state.empleados.empleados);
  const MAX_DESCRIPCION_LENGTH = 255;

  const getToken = useAuth();
  useEffect(() => {
    if (efectivo) {
      setMonto(montoAPagar);
    }
  }, [efectivo, montoAPagar]);

  useEffect(() => {
    if (efectivo) {
      // Filtrar solo choferes si es efectivo
      setFilteredEmpleados(empleados.filter((empleado) => empleado.rol === "chofer" && empleado.habilitado));
    } else {
      setFilteredEmpleados(empleados.filter((empleado) => empleado.habilitado));
    }
  }, [efectivo, empleados]);

    // Solo accede al pedido desde el store si la ruta es /pedidos/datos
    //Esto para no pedir el pedidoId si estoy agregando una entrada EN un pedido
    const pedido = useSelector((state) => state.pedido.pedido);

    useEffect(() => {
      if (location.pathname === "/pedidos/datos" && pedido?.id) {
        setPedidoId(pedido.id);
      }
    }, [location, pedido]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (descripcion.length > MAX_DESCRIPCION_LENGTH) {
      setDescripcionError(`La descripción no puede exceder ${MAX_DESCRIPCION_LENGTH} caracteres.`);
      setLoading(false);
      return;
    }

    const usuarioToken = getToken();
    const caja = {
      fecha,
      motivo,
      monto: parseFloat(monto),
      moneda,
      descripcion: descripcion || undefined,
      empleadoId: empleadoId ? parseInt(empleadoId) : undefined,
      pedidoId: pedidoId ? parseInt(pedidoId) : undefined,
    };

    try {
      await postCaja(caja, usuarioToken);
      setSuccess("Entrada agregada exitosamente");
      /* if (onSuccess)  */onSuccess(); // Cierra el modal al agregar con éxito
    } catch (err) {
      setError(err.response?.data?.error || "Error al agregar la entrada");
    } finally {
      setLoading(false);
    }
  };

  const handleDescripcionChange = (e) => {
    const value = e.target.value;
    setDescripcion(value);

    if (value.length > MAX_DESCRIPCION_LENGTH) {
      setDescripcionError(`La descripción no puede exceder ${MAX_DESCRIPCION_LENGTH} caracteres.`);
    } else {
      setDescripcionError("");
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length > 0) {
      const filtered = filteredEmpleados.filter(
        (empleado) => empleado.nombre.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredEmpleados(filtered);
      setShowDropdown(true);
    } else {
      setFilteredEmpleados([]);
      setShowDropdown(false);
    }
  };

  const handleEmpleadoSelect = (empleado) => {
    setEmpleadoId(empleado.id);
    setSearchTerm(empleado.nombre);
    setShowDropdown(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Container>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="fecha">
              <Form.Label>Fecha *</Form.Label>
              <Form.Control
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="motivo">
              <Form.Label>Motivo *</Form.Label>
              <Form.Control
                as="select"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                required
                disabled={efectivo} // Deshabilitar si es efectivo
              >
                <option value="">Seleccione motivo</option>
                <option value="vale">Vale</option>
                <option value="gasto">Gasto</option>
                <option value="ingreso pedido">Ingreso Pedido</option>
                <option value="ingreso cochera">Ingreso Cochera</option>
                <option value="extraccion">Extracción</option>
                <option value="ingreso">Ingreso</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group controlId="monto">
              <Form.Label>Monto *</Form.Label>
              <Form.Control
                type="number"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="moneda">
              <Form.Label>Moneda *</Form.Label>
              <Form.Control
                as="select"
                value={moneda}
                onChange={(e) => setMoneda(e.target.value)}
                required
              >
                <option value="peso">Peso</option>
                <option value="dolar">Dólar</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
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
        <Row>
          <Col md={6}>
            <Form.Group controlId="searchEmpleado" ref={dropdownRef}>
              <Form.Label>Buscar Empleado</Form.Label>
              <Form.Control
                type="text"
                placeholder="Buscar por nombre"
                value={searchTerm}
                onChange={handleSearchChange}
                onClick={() => setShowDropdown(true)}
              />
              {showDropdown && (
                <Dropdown.Menu show style={{ width: "100%" }}>
                  {filteredEmpleados.length > 0 ? (
                    filteredEmpleados.map((empleado) => (
                      <Dropdown.Item
                        key={empleado.id}
                        onClick={() => handleEmpleadoSelect(empleado)}
                      >
                        {empleado.nombre} ({empleado.rol})
                      </Dropdown.Item>
                    ))
                  ) : (
                    <Dropdown.Item disabled>No se encontraron resultados</Dropdown.Item>
                  )}
                </Dropdown.Menu>
              )}
            </Form.Group>
          </Col>

          {!location.pathname === "/pedidos/datos" && (
            <Col md={6}>
              <Form.Group controlId="pedidoId">
                <Form.Label>Nro Identificador del Pedido</Form.Label>
                <Form.Control
                  type="number"
                  value={pedidoId}
                  onChange={(e) => setPedidoId(e.target.value)}
                  disabled={location.pathname === "/pedidos/datos"} // Deshabilitar si la ruta es /pedidos/datos
                />
              </Form.Group>
            </Col>
          )}
        </Row>
        <div className="d-flex justify-content-end mt-4">
          <Button variant="secondary" onClick={onHide} className="me-2">
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Agregar
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AgregarEntrada;


/*import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Row, Col, Alert, Spinner, Container, Dropdown } from "react-bootstrap";
import { postCaja } from "../../api";
import useAuth from "../../hooks/useAuth";
import { useSelector } from "react-redux";

const AgregarEntrada = ({ onSuccess, onHide, efectivo }) => {
  const [fecha, setFecha] = useState("");
  const [motivo, setMotivo] = useState("");
  const [monto, setMonto] = useState("");
  const [moneda, setMoneda] = useState("peso");
  const [descripcion, setDescripcion] = useState("");
  const [empleadoId, setEmpleadoId] = useState("");
  const [pedidoId, setPedidoId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [descripcionError, setDescripcionError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmpleados, setFilteredEmpleados] = useState([]);
  const dropdownRef = useRef(null);

  const empleados = useSelector((state) => state.empleados.empleados);
  const MAX_DESCRIPCION_LENGTH = 255;

  const getToken = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (descripcion.length > MAX_DESCRIPCION_LENGTH) {
      setDescripcionError(`La descripción no puede exceder ${MAX_DESCRIPCION_LENGTH} caracteres.`);
      setLoading(false);
      return;
    }

    const usuarioToken = getToken();
    const caja = {
      fecha,
      motivo,
      monto: parseFloat(monto),
      moneda,
      descripcion: descripcion || undefined,
      empleadoId: empleadoId ? parseInt(empleadoId) : undefined,
      pedidoId: pedidoId ? parseInt(pedidoId) : undefined,
    };

    try {
      await postCaja(caja, usuarioToken);
      setSuccess("Entrada agregada exitosamente");
      if (onSuccess) onSuccess(); // Cierra el modal al agregar con éxito
    } catch (err) {
      setError(err.response?.data?.error || "Error al agregar la entrada");
    } finally {
      setLoading(false);
    }
  };

  const handleDescripcionChange = (e) => {
    const value = e.target.value;
    setDescripcion(value);

    if (value.length > MAX_DESCRIPCION_LENGTH) {
      setDescripcionError(`La descripción no puede exceder ${MAX_DESCRIPCION_LENGTH} caracteres.`);
    } else {
      setDescripcionError("");
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length > 0) {
      const filtered = empleados.filter(
        (empleado) => empleado.habilitado && empleado.nombre.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredEmpleados(filtered);
      setShowDropdown(true);
    } else {
      setFilteredEmpleados([]);
      setShowDropdown(false);
    }
  };

  const handleEmpleadoSelect = (empleado) => {
    setEmpleadoId(empleado.id);
    setSearchTerm(empleado.nombre);
    setShowDropdown(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Container>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="fecha">
              <Form.Label>Fecha *</Form.Label>
              <Form.Control
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="motivo">
              <Form.Label>Motivo *</Form.Label>
              <Form.Control
                as="select"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                required
              >
                <option value="">Seleccione un motivo</option>
                <option value="vale">Vale</option>
                <option value="gasto">Gasto</option>
                <option value="ingreso pedido">Ingreso Pedido</option>
                <option value="ingreso cochera">Ingreso Cochera</option>
                <option value="extraccion">Extracción</option>
                <option value="ingreso">Ingreso</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group controlId="monto">
              <Form.Label>Monto *</Form.Label>
              <Form.Control
                type="number"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="moneda">
              <Form.Label>Moneda *</Form.Label>
              <Form.Control
                as="select"
                value={moneda}
                onChange={(e) => setMoneda(e.target.value)}
                required
              >
                <option value="peso">Peso</option>
                <option value="dolar">Dólar</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
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
        <Row>
          <Col md={6}>
            <Form.Group controlId="searchEmpleado" ref={dropdownRef}>
              <Form.Label>Buscar Empleado</Form.Label>
              <Form.Control
                type="text"
                placeholder="Buscar por nombre"
                value={searchTerm}
                onChange={handleSearchChange}
                onClick={() => setShowDropdown(true)}
              />
              {showDropdown && (
                <Dropdown.Menu show style={{ width: "100%" }}>
                  {filteredEmpleados.length > 0 ? (
                    filteredEmpleados.map((empleado) => (
                      <Dropdown.Item
                        key={empleado.id}
                        onClick={() => handleEmpleadoSelect(empleado)}
                      >
                        {empleado.nombre} ({empleado.rol})
                      </Dropdown.Item>
                    ))
                  ) : (
                    <Dropdown.Item disabled>No se encontraron resultados</Dropdown.Item>
                  )}
                </Dropdown.Menu>
              )}
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="pedidoId">
              <Form.Label>ID del Pedido</Form.Label>
              <Form.Control
                type="number"
                value={pedidoId}
                onChange={(e) => setPedidoId(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <div className="d-flex justify-content-end mt-4">
          <Button variant="secondary" onClick={onHide} className="me-2">
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Agregar
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AgregarEntrada;
 */












