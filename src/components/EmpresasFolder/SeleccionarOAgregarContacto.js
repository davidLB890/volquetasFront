import React, { useState } from "react";
import { Form, Button, Modal, Alert } from "react-bootstrap";
import { asignarContactoEmpresa } from "../../api";
import useAuth from "../../hooks/useAuth";

const SeleccionarOAgregarContacto = ({ empresa, obraId, onContactoSeleccionado }) => {
  const [contactoSeleccionado, setContactoSeleccionado] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const getToken = useAuth();

  const handleContactoChange = (e) => {
    const contactoId = e.target.value;
    const contacto = empresa.contactos.find(contacto => contacto.id === parseInt(contactoId));
    setContactoSeleccionado(contacto);
  };

  const handleSubmit = async () => {
    if (!contactoSeleccionado) {
      setError("Por favor seleccione o agregue un contacto.");
      return;
    }

    setLoading(true);
    setError("");
    const usuarioToken = getToken();

    try {
      await asignarContactoEmpresa(contactoSeleccionado.id, obraId, usuarioToken);
      onContactoSeleccionado(contactoSeleccionado);
    } catch (error) {
      console.error("Error al asignar el contacto:", error.response?.data?.error || error.message);
      setError(error.response?.data?.error || "Error al asignar el contacto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form.Group controlId="formContacto" className="mt-3">
        <Form.Control as="select" onChange={handleContactoChange}>
          <option value="">Seleccione un contacto</option>
          {empresa.contactos.map((contacto) => (
            <option key={contacto.id} value={contacto.id}>
              {contacto.nombre}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button variant="success" className="mt-3" onClick={handleSubmit} disabled={loading}>
        {loading ? "Asignando..." : "Confirmar Contacto"}
      </Button>
    </div>
  );
};

export default SeleccionarOAgregarContacto;
