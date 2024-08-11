import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import AlertMessage from "../AlertMessage";
import { putTelefono } from "../../api";
import useAuth from "../../hooks/useAuth";

const ModificarTelefono = ({
  show,
  onHide,
  telefonoActual,
  onTelefonoModificado,
}) => {
  const [telefono, setTelefono] = useState("");
  const [tipo, setTipo] = useState("");
  const [extension, setExtension] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getToken = useAuth();

  useEffect(() => {
    if (telefonoActual) {
      setTelefono(telefonoActual.telefono);
      setTipo(telefonoActual.tipo);
      setExtension(telefonoActual.extension);
    }
  }, [telefonoActual]);

  const handleChangeTelefono = (e) => setTelefono(e.target.value);
  const handleChangeTipo = (e) => setTipo(e.target.value);
  const handleChangeExtension = (e) => setExtension(e.target.value);

  const handleModificarTelefono = async (e) => {
    e.preventDefault();
    const usuarioToken = getToken();

    if (telefono.trim() === "" || tipo.trim() === "") {
      setError("El teléfono y el tipo son obligatorios");
      setTimeout(() => setError(""), 5000);
      return;
    }

    try {
      const requestBody = { telefono, tipo, extension };
      const response = await putTelefono(telefonoActual.id, requestBody, usuarioToken);

      setSuccess("Teléfono modificado correctamente");
      setTimeout(() => setSuccess(""), 7000);

      onTelefonoModificado(response.data); // Pasa el teléfono modificado
      onHide(); // Cierra el modal en caso de éxito
    } catch (error) {
      setError(error.response?.data?.error || "Error al modificar el teléfono");
      setTimeout(() => setError(""), 7000);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar teléfono</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleModificarTelefono}>
          {error && <AlertMessage type="error" message={error} />}
          {success && <AlertMessage type="success" message={success} />}
          <Form.Group controlId="modificarTelefono">
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
              className="mt-3 me-2"
              variant="secondary"
              onClick={onHide}
            >
              Cerrar
            </Button>
          <Button
            className="mt-3"
            variant="primary"
            type="submit"
          >
            Modificar Teléfono
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModificarTelefono;
