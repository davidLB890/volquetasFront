import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { putParticular } from "../../api";
import useAuth from "../../hooks/useAuth";

const ModificarParticular = ({ particular, show, onHide, onParticularModificado }) => {
  const [nombre, setNombre] = useState(particular.nombre);
  const [descripcion, setDescripcion] = useState(particular.descripcion);
  const [email, setEmail] = useState(particular.email);
  const [cedula, setCedula] = useState(particular.cedula);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getToken = useAuth();

  useEffect(() => {
    setNombre(particular.nombre);
    setDescripcion(particular.descripcion);
    setEmail(particular.email);
    setCedula(particular.cedula);
  }, [particular]);

  const handleModificarParticular = async () => {
    const usuarioToken = getToken();
    const particularModificado = {
      nombre,
      descripcion,
      email,
      cedula,
    };

    try {
      const response = await putParticular(particular.id, particularModificado, usuarioToken);
      setSuccess("Particular modificado correctamente");
      setTimeout(() => {
        setSuccess("");
        onParticularModificado(response.data);
        onHide();
      }, 3000);
    } catch (error) {
      console.error("Error al modificar el particular:", error.response?.data?.error || error.message);
      setError("Error al modificar el particular");
      setTimeout(() => setError(""), 5000);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar Particular</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form>
          <Form.Group controlId="formNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formDescripcion">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formCedula">
            <Form.Label>Cédula</Form.Label>
            <Form.Control
              type="text"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
            />
          </Form.Group>
          <Button
            variant="primary"
            onClick={handleModificarParticular}
          >
            Modificar Particular
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModificarParticular;
