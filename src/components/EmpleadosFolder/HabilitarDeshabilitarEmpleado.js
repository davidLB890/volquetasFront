import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { cambiarEstadoEmpleado } from "../../api";
import useAuth from "../../hooks/useAuth";

const HabilitarDeshabilitarEmpleado = ({ empleado, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [fechaSalida, setFechaSalida] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const getToken = useAuth();

  const handleHabilitarDeshabilitar = async () => {
    const usuarioToken = getToken();
    try {
      const body = empleado.habilitado
        ? {}
        : { fechaSalida };

      const response = await cambiarEstadoEmpleado(empleado.id, usuarioToken, body);
      const datos = response.data;
      console.log("Empleado actualizado:", datos);
      onUpdate(datos); // Llama a la función para actualizar el estado de empleados en el componente padre
      setSuccess(`Empleado ${empleado.habilitado ? "habilitado" : "deshabilitado"} correctamente`);
      setTimeout(() => {
        setSuccess("");
        setShowModal(false); // Cierra el modal después de actualizar
      }, 2000);
    } catch (error) {
      console.error(
        "Error al actualizar el empleado:",
        error.response?.data?.error || error.message
      );
      setError(error.response?.data?.error || `Error al ${empleado.habilitado ? "habilitar" : "deshabilitar"} el empleado`);
      setTimeout(() => setError(""), 5000);
    }
  };

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <>
      <Button
        variant={empleado.habilitado ? "secondary" : "light"}
        onClick={handleShow}
      >
        {empleado.habilitado ? "Deshabilitar" : "Habilitar"}
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{empleado.habilitado ? "Deshabilitar" : "Habilitar"} Empleado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          {empleado.habilitado ? (
            <Form.Group controlId="formFechaSalida">
              <Form.Label>Fecha de Salida</Form.Label>
              <Form.Control
                type="date"
                name="fechaSalida"
                value={fechaSalida}
                onChange={(e) => setFechaSalida(e.target.value)}
                required
              />
            </Form.Group>
          ) : (
            <p>¿Estás seguro de que deseas habilitar a este empleado?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleHabilitarDeshabilitar}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default HabilitarDeshabilitarEmpleado;
