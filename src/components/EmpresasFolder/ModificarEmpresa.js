import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { putEmpresa } from "../../api";
import useAuth from "../../hooks/useAuth";

const ModificarEmpresa = ({ empresa, show, onHide, onEmpresaModificada }) => {
  const [nombre, setNombre] = useState(empresa.nombre);
  const [rut, setRut] = useState(empresa.rut);
  const [razonSocial, setRazonSocial] = useState(empresa.razonSocial);
  const [descripcion, setDescripcion] = useState(empresa.descripcion);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getToken = useAuth();

  useEffect(() => {
    setNombre(empresa.nombre);
    setRut(empresa.rut);
    setRazonSocial(empresa.razonSocial);
    setDescripcion(empresa.descripcion);
  }, [empresa]);

  const handleModificarEmpresa = async () => {
    const usuarioToken = getToken();
    const empresaModificada = {
      nombre,
      rut,
      razonSocial,
      descripcion,
    };

    try {
      const response = await putEmpresa(empresa.id, empresaModificada, usuarioToken);
      setSuccess("Empresa modificada correctamente");
      setTimeout(() => {
        setSuccess("");
        onEmpresaModificada(response.data);
        onHide();
      }, 3000);
    } catch (error) {
      console.error("Error al modificar la empresa:", error.response?.data?.error || error.message);
      setError("Error al modificar la empresa");
      setTimeout(() => setError(""), 5000);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar Empresa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form>
          <Form.Group controlId="formRut">
            <Form.Label>RUT</Form.Label>
            <Form.Control
              type="text"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formRazonSocial">
            <Form.Label>Razón Social</Form.Label>
            <Form.Control
              type="text"
              value={razonSocial}
              onChange={(e) => setRazonSocial(e.target.value)}
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
          <Button
            variant="primary"
            onClick={handleModificarEmpresa}
          >
            Modificar Empresa
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModificarEmpresa;
