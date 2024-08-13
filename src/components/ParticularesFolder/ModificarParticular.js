import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { putParticular } from "../../api";
import useAuth from "../../hooks/useAuth";
import { updateParticularSuccess, updateParticularFailure } from "../../features/particularSlice";

const ModificarParticular = ({ particular, show, onHide }) => {
  const [nombre, setNombre] = useState(particular.nombre);
  const [descripcion, setDescripcion] = useState(particular.descripcion);
  const [email, setEmail] = useState(particular.email);
  const [cedula, setCedula] = useState(particular.cedula);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const dispatch = useDispatch();
  const getToken = useAuth();

  useEffect(() => {
    setNombre(particular.nombre);
    setDescripcion(particular.descripcion);
    setEmail(particular.email);
    setCedula(particular.cedula);
  }, [particular]);

  const handleModificarParticular = async () => {
    const usuarioToken = getToken();
    const particularModificado = { nombre, descripcion, email, cedula };

    try {
      const response = await putParticular(particular.id, particularModificado, usuarioToken);
      dispatch(updateParticularSuccess(response.data));
      setSuccess("Particular modificado correctamente");
      setTimeout(() => {
        setSuccess("");
        onHide();
      }, 3000);
    } catch (error) {
      dispatch(updateParticularFailure(error.response?.data?.error || error.message));
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
            <Form.Control type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formDescripcion">
            <Form.Label>Descripción</Form.Label>
            <Form.Control type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formCedula">
            <Form.Label>Cédula</Form.Label>
            <Form.Control type="text" value={cedula} onChange={(e) => setCedula(e.target.value)} />
          </Form.Group>

          <Button variant="secondary" onClick={onHide}
      className="mt-3"
      style={{
        padding: "0.5rem 1rem",
        marginRight: "0.5rem",
      }}>
        Cancelar
      </Button>
          <Button variant="primary" onClick={handleModificarParticular}
          className="mt-3"
          style={{
            padding: "0.5rem 1rem",
            marginRight: "0.5rem",
          }}>Modificar Particular</Button>

        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModificarParticular;
