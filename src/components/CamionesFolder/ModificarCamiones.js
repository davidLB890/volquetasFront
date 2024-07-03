import React, { useState } from "react";
import { putCamion } from "../../api";
import { Form, Button, Modal } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";

const ModificarCamion = ({ camion, onHide, onUpdate }) => {
  const getToken = useAuth();

  const [nuevoCamion, setNuevoCamion] = useState({
    matricula: camion.matricula,
    modelo: camion.modelo,
    anio: camion.anio,
    estado: camion.estado,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoCamion({ ...nuevoCamion, [name]: value });
  };

  const handleModificar = async () => {
    const usuarioToken = getToken();
    try {
      // Aquí deberías obtener el token de autenticación desde tu contexto o props

      const response = await putCamion(camion.id, nuevoCamion, usuarioToken);
      const datos = response.data;
      console.log("Camión actualizado:", datos);
      onUpdate(datos); // Llama a la función para actualizar el estado de camiones en el componente padre
      onHide(); // Cierra el modal después de actualizar
    } catch (error) {
      console.error(
        "Error al actualizar el camión:",
        error.response?.data?.error || error.message
      );
    }
  };

  return (
    <Modal show={true} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar Camión</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="formMatricula">
          <Form.Label>Matrícula</Form.Label>
          <Form.Control
            type="text"
            name="matricula"
            value={nuevoCamion.matricula}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formModelo">
          <Form.Label>Modelo</Form.Label>
          <Form.Control
            type="text"
            name="modelo"
            value={nuevoCamion.modelo}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formAnio">
          <Form.Label>Año</Form.Label>
          <Form.Control
            type="number"
            name="anio"
            value={nuevoCamion.anio}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formEstado">
          <Form.Label>Estado</Form.Label>
          <Form.Control
            type="text"
            name="estado"
            value={nuevoCamion.estado}
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

export default ModificarCamion;
