import React, { useState, useEffect } from "react";
import { putEmpleado } from "../../api";
import { Form, Button, Modal, Alert } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";

const ModificarEmpleado = ({ empleado, onHide, onUpdate }) => {
  const getToken = useAuth();

  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: empleado.nombre,
    rol: empleado.rol,
    fechaEntrada: empleado.fechaEntrada,
    fechaSalida: empleado.fechaSalida,
    cedula: empleado.cedula,
    diereccion: empleado.direccion,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoEmpleado({ ...nuevoEmpleado, [name]: value });
  };

  const handleModificar = async () => {
    const usuarioToken = getToken();
    try {
      const response = await putEmpleado(empleado.id, nuevoEmpleado, usuarioToken);
      const datos = response.data;
      onUpdate(datos); // Llama a la función para actualizar el estado de empleados en el componente padre
      setSuccess("Empleado actualizado correctamente");
      setTimeout(() => {
        setSuccess("");
        onHide(); // Cierra el modal después de actualizar
      }, 2000);
    } catch (error) {
      console.error(
        "Error al actualizar el empleado:",
        error.response?.data?.error || error.message
      );
      setError(error.response?.data?.error || "Error al actualizar el empleado");
      setTimeout(() => setError(""), 5000);
    }
  };

  useEffect(() => {
    setNuevoEmpleado({
      nombre: empleado.nombre,
      rol: empleado.rol,
      fechaEntrada: empleado.fechaEntrada,
      fechaSalida: empleado.fechaSalida,
      cedula: empleado.cedula,
      direccion: empleado.direccion
    });
  }, [empleado]);

  return (
    <Modal show={true} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar Empleado</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form.Group controlId="formNombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={nuevoEmpleado.nombre}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formRol">
          <Form.Label>Rol</Form.Label>
          <Form.Control
            as="select"
            name="rol"
            value={nuevoEmpleado.rol}
            onChange={handleInputChange}
            required
          >
            <option value="admin">Admin</option>
            <option value="chofer">Chofer</option>
            <option value="normal">Normal</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formFechaEntrada">
          <Form.Label>Fecha de Entrada</Form.Label>
          <Form.Control
            type="date"
            name="fechaEntrada"
            value={nuevoEmpleado.fechaEntrada}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formFechaSalida">
          <Form.Label>Fecha de Salida</Form.Label>
          <Form.Control
            type="date"
            name="fechaSalida"
            value={nuevoEmpleado.fechaSalida}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formCedula">
          <Form.Label>Cédula</Form.Label>
          <Form.Control
            type="text"
            name="cedula"
            value={nuevoEmpleado.cedula}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formDireccion">
          <Form.Label>Dirección</Form.Label>
          <Form.Control
            type="text"
            name="direccion"
            value={nuevoEmpleado.direccion}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleModificar}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModificarEmpleado;
