import React, { useRef, useState } from "react";
import { postServicio } from "../../api";
import useAuth from "../../hooks/useAuth";
import useHabilitarBoton from "../../hooks/useHabilitarBoton";
import { Modal, Form, Button } from "react-bootstrap";

const AgregarServicio = ({ idCamion, onSuccess, show, onHide }) => {
  const tipoRef = useRef(null);
  const fechaRef = useRef(null);
  const monedaRef = useRef(null);
  const precioRef = useRef(null);
  const descripcionRef = useRef(null);

  const [error, setError] = useState('');
  const getToken = useAuth();

  const refs = [tipoRef, fechaRef, monedaRef, precioRef, descripcionRef];
  const botonHabilitado = useHabilitarBoton(refs);

  const handleAgregarServicio = async () => {
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
        onHide(); // Oculta el modal después de crear el servicio correctamente
      }
    } catch (error) {
      console.error('Error al crear el servicio:', error.response?.data || error.message);
      setError('Error al crear el servicio. Por favor, verifica los datos e intenta nuevamente.');
    }
  };

  const resetForm = () => {
    refs.forEach(ref => ref.current.value = "");
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar un servicio</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="tipoServicio">
            <Form.Label>Tipo de Servicio</Form.Label>
            <Form.Select ref={tipoRef} required>
              <option value="">Seleccione un tipo de servicio</option>
              <option value="arreglo">Arreglo</option>
              <option value="service">Service</option>
              <option value="chequeo">Chequeo</option>
              <option value="pintura">Pintura</option>
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="fechaServicio">
            <Form.Label>Fecha</Form.Label>
            <Form.Control type="datetime-local" ref={fechaRef} required />
          </Form.Group>
          <Form.Group controlId="monedaServicio">
            <Form.Label>Moneda</Form.Label>
            <Form.Select ref={monedaRef} required>
              <option value="">Moneda</option>
              <option value="peso">UYU</option>
              <option value="dolar">U$D</option>
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="precioServicio">
            <Form.Label>Precio</Form.Label>
            <Form.Control type="number" ref={precioRef} required />
          </Form.Group>
          <Form.Group controlId="descripcionServicio">
            <Form.Label>Descripción</Form.Label>
            <Form.Control as="textarea" ref={descripcionRef} rows="3" required />
          </Form.Group>
          {error && <div className="alert alert-danger">{error}</div>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleAgregarServicio} disabled={!botonHabilitado}>
          Crear Servicio
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AgregarServicio;


