import React, { useState } from "react";
import { Card, Collapse, Button, Row, Col } from "react-bootstrap";
import TelefonosContactoEmpresa from "./TelefonosContactoEmpresa"; // Ajusta la ruta según sea necesario

const ContactosEmpresa = ({ contactos = [], onTelefonoAgregado }) => {
  const [expandedContactId, setExpandedContactId] = useState(null);

  const toggleExpandContact = (contactId) => {
    setExpandedContactId(expandedContactId === contactId ? null : contactId);
  };

  return (
    <div>
      {contactos.map((contacto) => (
        <Card key={contacto.id} className="mb-3">
          <Card.Header
            onClick={() => toggleExpandContact(contacto.id)}
            style={{ cursor: "pointer" }}
          >
            {contacto.nombre}
          </Card.Header>
          <Collapse in={expandedContactId === contacto.id}>
            <Card.Body>
              <Row>
                <Col>
                  <Card.Text><strong>Email:</strong> {contacto.email}</Card.Text>
                  <Card.Text><strong>Descripción:</strong> {contacto.descripcion}</Card.Text>
                </Col>
                <Col>
                  <TelefonosContactoEmpresa
                    telefonos={contacto.Telefonos || []}
                    contactoEmpresaId={contacto.id}
                    nombre={contacto.nombre}
                    onTelefonoAgregado={onTelefonoAgregado}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Collapse>
        </Card>
      ))}
    </div>
  );
};

export default ContactosEmpresa;
