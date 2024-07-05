import React from "react";
import { Card, ListGroup } from "react-bootstrap";

const DatosContactoEmpresa = ({ contacto }) => {
  return (
    <Card className="mt-3">
      <Card.Header>{contacto.nombre}</Card.Header>
      <Card.Body>
        <Card.Text><strong>Email:</strong> {contacto.email}</Card.Text>
        <Card.Text><strong>Descripción:</strong> {contacto.descripcion}</Card.Text>
        <ListGroup variant="flush">
          {contacto.Telefonos.map((telefono, index) => (
            <ListGroup.Item key={index}>
              <strong>{telefono.tipo}:</strong> {telefono.telefono}
              {telefono.extension && ` (Ext: ${telefono.extension})`}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default DatosContactoEmpresa;

