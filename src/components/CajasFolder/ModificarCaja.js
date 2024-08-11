import React, { useState } from "react";
import { Form, Button, Row, Col, Modal, Alert, Spinner, Dropdown } from "react-bootstrap";
import { putCaja } from "../../api";
import useAuth from "../../hooks/useAuth";
import { useSelector } from "react-redux";

const ModificarCaja = ({ cajaId, initialData, onSuccess, onHide }) => {
  const [fecha, setFecha] = useState(initialData?.fecha || "");
  const [motivo, setMotivo] = useState(initialData?.motivo || "");
  const [monto, setMonto] = useState(initialData?.monto || "");
  const [moneda, setMoneda] = useState(initialData?.moneda || "peso");
  const [descripcion, setDescripcion] = useState(initialData?.descripcion || "");
  const [empleadoId, setEmpleadoId] = useState(initialData?.empleadoId || "");
  const [pedidoId, setPedidoId] = useState(initialData?.pedidoId || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [descripcionError, setDescripcionError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [filteredEmpleados, setFilteredEmpleados] = useState([]);

  const empleados = useSelector((state) => state.empleados.empleados);

  const MAX_DESCRIPCION_LENGTH = 255;
  const getToken = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (descripcion.length > MAX_DESCRIPCION_LENGTH) {
      setDescripcionError(`La descripción no puede exceder ${MAX_DESCRIPCION_LENGTH} caracteres.`);
      setLoading(false);
      return;
    }

    const usuarioToken = getToken();
    const caja = {
      fecha: fecha || undefined,
      motivo: motivo || undefined,
      monto: monto !== "" ? parseFloat(monto) : undefined,
      moneda: moneda || undefined,
      descripcion: descripcion || undefined,
      empleadoId: empleadoId ? parseInt(empleadoId) : undefined,
      pedidoId: pedidoId ? parseInt(pedidoId) : undefined,
    };

    try {
      const response = await putCaja(cajaId, caja, usuarioToken);
      const updatedData = response.data;
      onSuccess(updatedData); // Pasa la caja actualizada al callback onSuccess
      onHide(); // Cierra el modal después de la operación
    } catch (err) {
      setError(err.response?.data?.error || "Error al modificar la entrada");
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
    } else {
      setFilteredEmpleados(empleados);
    }
    setShowDropdown(true);
  };

  const handleEmpleadoSelect = (empleado) => {
    setSelectedEmpleado(empleado);
    setShowDropdown(false);
    setSearchTerm(empleado.nombre);
    setEmpleadoId(empleado.id);
  };

  const handleSearchClick = () => {
    setFilteredEmpleados(empleados);
    setShowDropdown(true);
  };

  return (
    <Modal show onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Modificar Entrada</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="fecha">
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="motivo">
                <Form.Label>Motivo</Form.Label>
                <Form.Control
                  as="select"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
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
                <Form.Label>Monto</Form.Label>
                <Form.Control
                  type="number"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="moneda">
                <Form.Label>Moneda</Form.Label>
                <Form.Control
                  as="select"
                  value={moneda}
                  onChange={(e) => setMoneda(e.target.value)}
                >
                  <option value="peso">Peso</option>
                  <option value="dolar">Dólar</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="searchEmpleado">
                <Form.Label>Buscar Empleado</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Buscar por nombre"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onClick={handleSearchClick}
                />
                {showDropdown && (
                  <Dropdown.Menu show>
                    {filteredEmpleados.map((empleado) => (
                      <Dropdown.Item
                        key={empleado.id}
                        onClick={() => handleEmpleadoSelect(empleado)}
                      >
                        {empleado.nombre}{empleado.rol === "normal" && " (oficina)"}
                        {empleado.rol === "chofer" && " (chofer)"}
                        {empleado.rol === "admin" && " (admin)"}
                      </Dropdown.Item>
                    ))}
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
          <div className="d-flex justify-content-end mt-4">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar Cambios
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModificarCaja;

/*import React, { useState } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { putCaja } from '../../api';
import useAuth from '../../hooks/useAuth';

const ModificarCaja = ({ cajaId, initialData, onSuccess, onHide }) => {
  const [fecha, setFecha] = useState(initialData.fecha || '');
  const [motivo, setMotivo] = useState(initialData.motivo || '');
  const [monto, setMonto] = useState(initialData.monto || '');
  const [moneda, setMoneda] = useState(initialData.moneda || 'peso');
  const [descripcion, setDescripcion] = useState(initialData.descripcion || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const getToken = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const usuarioToken = getToken();
    const updatedCaja = {
      fecha,
      motivo,
      monto: parseFloat(monto),
      moneda,
      descripcion: descripcion || undefined,
    };

    try {
      const response = await putCaja(cajaId, updatedCaja, usuarioToken);
      const updatedData = response.data;
      onSuccess(updatedData); // Pass the updated data back to the parent component
    } catch (err) {
      setError(err.response?.data?.error || 'Error al modificar la entrada');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar Entrada</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="fecha">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="motivo">
            <Form.Label>Motivo</Form.Label>
            <Form.Control
              as="select"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              required
            >
              <option value="vale">Vale</option>
              <option value="gasto">Gasto</option>
              <option value="ingreso pedido">Ingreso Pedido</option>
              <option value="ingreso cochera">Ingreso Cochera</option>
              <option value="extraccion">Extracción</option>
              <option value="ingreso">Ingreso</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="monto">
            <Form.Label>Monto</Form.Label>
            <Form.Control
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="moneda">
            <Form.Label>Moneda</Form.Label>
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
          <Form.Group controlId="descripcion">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </Form.Group>
          <div className="d-flex justify-content-end mt-4">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModificarCaja;
 */