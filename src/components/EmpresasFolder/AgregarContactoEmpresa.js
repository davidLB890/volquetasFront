import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Alert } from "react-bootstrap";
import { postContactoEmpresa } from "../../api";
import useAuth from "../../hooks/useAuth";
import AgregarTelefono from "../TelefonosFolder/AgregarTelefono";

const AgregarContactoEmpresa = ({ empresaId, show, onHide, onContactoAgregado }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [email, setEmail] = useState("");
  const [empresaIdInput, setEmpresaIdInput] = useState("");
  const [error, setError] = useState("");
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [contactoSeleccionado, setContactoSeleccionado] = useState(null);
  const [showAgregarTelefono, setShowAgregarTelefono] = useState(false);

  const getToken = useAuth();

  useEffect(() => {
    const checkSubmitEnabled = () => {
      const isEmpresaIdValid = empresaId || empresaIdInput;
      setSubmitEnabled(nombre && descripcion && email && isEmpresaIdValid);
    };

    checkSubmitEnabled();
  }, [nombre, descripcion, email, empresaIdInput, empresaId]);

  const handleAgregarContacto = async () => {
    const usuarioToken = getToken();
    const nuevoContacto = {
      nombre,
      descripcion,
      email,
      empresaId: empresaId || empresaIdInput,
      obraId: null,
    };

    try {
      const response = await postContactoEmpresa(nuevoContacto, usuarioToken);
      onContactoAgregado(response.data);
      setContactoSeleccionado(response.data);
      const agregarTelefono = window.confirm("¿Desea agregar un teléfono a este contacto?");
      if (agregarTelefono) {
        setShowAgregarTelefono(true);
      } else {
        onHide();
      }
    } catch (error) {
      console.error("Error al agregar el contacto:", error.response?.data?.error || error.message);
      setError("Error al agregar el contacto");
    }
  };

  const handleTelefonoAgregado = (nuevoTelefono) => {
    onHide();
    setShowAgregarTelefono(false);
    setContactoSeleccionado(null);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Contacto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
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
          {!empresaId && (
            <Form.Group controlId="formEmpresaId">
              <Form.Label>ID de la Empresa</Form.Label>
              <Form.Control
                type="text"
                value={empresaIdInput}
                onChange={(e) => setEmpresaIdInput(e.target.value)}
              />
            </Form.Group>
          )}
          <Button
            variant="primary"
            onClick={handleAgregarContacto}
            disabled={!submitEnabled}
          >
            Agregar Contacto
          </Button>
        </Form>
      </Modal.Body>
      {contactoSeleccionado && (
        <AgregarTelefono
          show={showAgregarTelefono}
          onHide={() => setShowAgregarTelefono(false)}
          contactoEmpresaId={contactoSeleccionado.id}
          nombre={contactoSeleccionado.nombre}
          onTelefonoAgregado={handleTelefonoAgregado}
        />
      )}
    </Modal>
  );
};

export default AgregarContactoEmpresa;
