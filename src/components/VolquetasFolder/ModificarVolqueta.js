import React, { useState, useEffect } from "react";
import { putVolqueta } from "../../api"; // Asegúrate de tener esta función en api.js
import { Form, Button, Modal, Alert } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import { ESTADOS_VOLQUETA } from "../../config/config";

const ModificarVolqueta = ({ volqueta, onHide, onUpdate }) => {
  const getToken = useAuth();

  const [nuevaVolqueta, setNuevaVolqueta] = useState({
    numeroVolqueta: "",
    tipo: "",
    estado: "",
    ocupada: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (volqueta) {
      setNuevaVolqueta({
        numeroVolqueta: volqueta.numeroVolqueta,
        tipo: volqueta.tipo,
        estado: volqueta.estado,
        ocupada: volqueta.ocupada ? "si" : "no",
      });
    }
  }, [volqueta]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaVolqueta({ ...nuevaVolqueta, [name]: value });
  };

  const handleModificar = async () => {
    const usuarioToken = getToken();
    try {
      const response = await putVolqueta(volqueta.numeroVolqueta, {
        ...nuevaVolqueta,
        ocupada: nuevaVolqueta.ocupada === "si",
      }, usuarioToken);
      const datos = response.data;
      console.log("Volqueta actualizada:", datos);
      onUpdate(datos);
      setSuccess("Volqueta actualizada correctamente");
      setTimeout(() => {
        setSuccess("");
        onHide();
      }, 2000);
    } catch (error) {
      console.error("Error al actualizar la volqueta:", error.response?.data?.error || error.message);
      setError(error.response?.data?.error || "Error al actualizar la volqueta");
      setTimeout(() => setError(""), 5000);
    }
  };

  return (
    <Modal show={true} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar Volqueta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form.Group controlId="formTipo">
          <Form.Label>Tipo</Form.Label>
          <Form.Control
            as="select"
            name="tipo"
            value={nuevaVolqueta.tipo}
            onChange={handleInputChange}
            required
          >
            <option value="grande">Grande</option>
            <option value="chica">Chica</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formEstado">
          <Form.Label>Estado</Form.Label>
          <Form.Control
            as="select"
            name="estado"
            value={nuevaVolqueta.estado}
            onChange={handleInputChange}
            required
          >
            {ESTADOS_VOLQUETA.map((estado) => (
              <option key={estado.value} value={estado.value}>
                {estado.label}
              </option>
            ))}
          </Form.Control>
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

export default ModificarVolqueta;

