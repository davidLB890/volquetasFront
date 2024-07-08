import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import AlertMessage from "../AlertMessage";
import { postTelefono } from "../../api";
import useAuth from "../../hooks/useAuth";

const AgregarTelefono = ({
  show,
  onHide,
  empleadoId,
  particularId,
  empresaId,
  contactoEmpresaId,
  nombre,
  onTelefonoAgregado,
}) => {
  const [telefono, setTelefono] = useState("");
  const [tipo, setTipo] = useState("telefono");
  const [extension, setExtension] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getToken = useAuth();

  const handleChangeTelefono = (e) => setTelefono(e.target.value);
  const handleChangeTipo = (e) => setTipo(e.target.value);
  const handleChangeExtension = (e) => setExtension(e.target.value);

  const handleAgregarTelefono = async (e) => {
    e.preventDefault();
    const usuarioToken = getToken();

    if (telefono.trim() === "" || tipo.trim() === "") {
      setError("El teléfono y el tipo son obligatorios");
      setTimeout(() => setError(""), 5000);
      return;
    }

    try {
      const requestBody = {
        telefono,
        tipo,
        extension,
        empleadoId,
        particularId,
        empresaId,
        contactoEmpresaId,
      };
      const response = await postTelefono(requestBody, usuarioToken);

      setSuccess("Teléfono agregado correctamente");
      setTelefono("");
      setTipo("telefono");
      setExtension("");
      setTimeout(() => setSuccess(""), 7000);

      onTelefonoAgregado(response.data);
    } catch (error) {
      setError(error.response?.data?.error || "Error al agregar el teléfono");
      setTimeout(() => setError(""), 7000);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Agregando teléfono a {nombre}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleAgregarTelefono}>
          {error && <AlertMessage type="error" message={error} />}
          {success && <AlertMessage type="success" message={success} />}
          <Form.Group controlId="nuevoTelefono">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              value={telefono}
              onChange={handleChangeTelefono}
            />
          </Form.Group>
          <Form.Group controlId="tipo">
            <Form.Label>Tipo</Form.Label>
            <Form.Control as="select" value={tipo} onChange={handleChangeTipo}>
              <option value="telefono">Teléfono</option>
              <option value="celular">Celular</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="extension">
            <Form.Label>Extensión</Form.Label>
            <Form.Control
              type="text"
              value={extension}
              onChange={handleChangeExtension}
            />
          </Form.Group>
          <Button
            className="mt-3"
            variant="primary"
            type="submit"
          >
            Agregar Teléfono
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AgregarTelefono;
