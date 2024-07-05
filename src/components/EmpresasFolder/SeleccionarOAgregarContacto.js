import React, { useState } from "react";
import { Form, Button, Modal, Alert } from "react-bootstrap";
import AgregarContactoEmpresa from "./AgregarContactoEmpresa"; // Ajusta la ruta según sea necesario

const SeleccionarOAgregarContacto = ({ empresa, onContactoSeleccionado }) => {
  const [showAgregarContacto, setShowAgregarContacto] = useState(false);
  const [contactoSeleccionado, setContactoSeleccionado] = useState(null);
  const [error, setError] = useState("");

  const handleContactoChange = (e) => {
    const contactoId = e.target.value;
    const contacto = empresa.contactos.find(contacto => contacto.id === parseInt(contactoId));
    setContactoSeleccionado(contacto);
  };

  const handleAgregarContacto = (nuevoContacto) => {
    empresa.contactos.push(nuevoContacto);
    setContactoSeleccionado(nuevoContacto);
    setShowAgregarContacto(false);
    onContactoSeleccionado(nuevoContacto);
  };

  const handleSubmit = () => {
    if (!contactoSeleccionado) {
      setError("Por favor seleccione o agregue un contacto.");
    } else {
      onContactoSeleccionado(contactoSeleccionado);
    }
  };

  return (
    <div>
      <Button variant="primary" onClick={() => setShowAgregarContacto(true)}>
        Agregar Nuevo Contacto
      </Button>
      <Form.Group controlId="formContacto" className="mt-3">
        <Form.Label>Seleccionar Contacto</Form.Label>
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
      <Button variant="success" className="mt-3" onClick={handleSubmit}>
        Confirmar Contacto
      </Button>
      <AgregarContactoEmpresa
        show={showAgregarContacto}
        onHide={() => setShowAgregarContacto(false)}
        empresaId={empresa.id}
        onContactoAgregado={handleAgregarContacto}
      />
    </div>
  );
};

export default SeleccionarOAgregarContacto;
