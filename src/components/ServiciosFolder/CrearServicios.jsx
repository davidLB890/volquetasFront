import React, { useRef, useState } from "react";
import { postServicio } from "../../api";
import useAuth from "../../hooks/useAuth";
import useHabilitarBoton from "../../hooks/useHabilitarBoton";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const CrearServicio = ({ idCamion, onSuccess }) => {
  const tipoRef = useRef(null);
  const fechaRef = useRef(null);
  const monedaRef = useRef(null);
  const precioRef = useRef(null);
  const descripcionRef = useRef(null);

  const [mostrar, setMostrar] = useState(false);
  const [error, setError] = useState('');
  const getToken = useAuth();

  const refs = [tipoRef, fechaRef, monedaRef, precioRef, descripcionRef];
  const botonHabilitado = useHabilitarBoton(refs);

  const crearServicio = async () => {
    const usuarioToken = getToken();
    const camionId = idCamion;
    const tipo = tipoRef.current.value;
    const fecha = fechaRef.current.value;
    const moneda = monedaRef.current.value;
    const precio = precioRef.current.value;
    const descripcion = descripcionRef.current.value;

    try {
      const response = await postServicio({ camionId, tipo, fecha, moneda, precio, descripcion }, usuarioToken);
      const datos = response.data;
      if (datos.error) {
        console.error(datos.error);
        setError('Verifica los datos e intenta nuevamente.');
      } else {
        console.log("Servicio creado correctamente", datos);
        setError('');
        resetForm();
        onSuccess(); // Llama a la función onSuccess proporcionada para manejar el éxito (puede ser recargar datos, etc.)
        setMostrar(false);
      }
    } catch (error) {
      console.error('Error al crear el servicio:', error.response?.data || error.message);
      setError('Error al crear el servicio. Por favor, verifica los datos e intenta nuevamente.');
    }
  };

  const resetForm = () => {
    refs.forEach(ref => ref.current.value = "");
  };

  const toggleMostrar = () => {
    setMostrar(!mostrar);
  };

  return (
    <Container>
      <Button variant="info" onClick={toggleMostrar} className="mb-3">
        {mostrar ? "Cancelar" : "Agregar un servicio"}
      </Button>

      {mostrar && (
        <Row className="align-items-end">
          <Col md={8}>
            <Form.Group controlId="tipoServicio">
              <Form.Select
                ref={tipoRef}
                required
              >
                <option value="">Seleccione un tipo de servicio</option>
                <option value="arreglo">Arreglo</option>
                <option value="service">Service</option>
                <option value="chequeo">Chequeo</option>
                <option value="pintura">Pintura</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="fechaServicio" className="mt-3">
              <Form.Control
                type="datetime-local"
                ref={fechaRef}
                placeholder="Fecha"
                required
              />
            </Form.Group>
            <Form.Group controlId="monedaServicio" className="mt-3">
              <Form.Select
                ref={monedaRef}
                required
              >
                <option value="">Moneda</option>
                <option value="peso">UYU</option>
                <option value="dolar">U$D</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="precioServicio" className="mt-3">
              <Form.Control
                type="number"
                ref={precioRef}
                placeholder="Precio"
                required
              />
            </Form.Group>
            <Form.Group controlId="descripcionServicio" className="mt-3">
              <Form.Control
                as="textarea"
                ref={descripcionRef}
                rows="3"
                placeholder="Descripción"
                required
              />
            </Form.Group>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </Col>
          <Col md={4} className="text-md-right">
            <Button
              variant="primary"
              onClick={crearServicio}
              disabled={!botonHabilitado}
              className="mt-3 mt-md-0"
            >
              Crear Servicio
            </Button>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default CrearServicio;

