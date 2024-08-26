// src/components/ObrasFolder/ContactosObra.js
import React from "react";
import { Card, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const ContactosObra = ({ obra, handleSeleccionarContacto }) => {
  const location = useLocation();
  return (
    <Card className="mt-3">
      <Card.Body>
        <Card.Title>Contacto Asignado a esta Obra</Card.Title>
        {obra.contactosDesignados.length > 0 ? (
          obra.contactosDesignados.map((contacto) => (
            <Card key={contacto.id} className="mb-2">
              <Card.Body>
                <Card.Text>
                  <strong>Nombre:</strong> {contacto.nombre}
                </Card.Text>
                <Card.Text>
                  <strong>Email:</strong> {contacto.email}
                </Card.Text>
                <Card.Text>
                  <strong>Descripción:</strong> {contacto.descripcion}
                </Card.Text>
                <Card.Text>
                  <strong>Teléfonos:</strong>
                </Card.Text>
                {contacto.Telefonos && contacto.Telefonos.length > 0 ? (
                  <ul>
                    {contacto.Telefonos.map((telefono, index) => (
                      <li key={index}>{telefono.telefono}</li>
                    ))}
                  </ul>
                ) : (
                  <Card.Text>No hay teléfonos asignados</Card.Text>
                )}
              </Card.Body>
            </Card>
          ))
        ) : (
          <Card.Text>No hay contactos asignados</Card.Text>
        )}
        {obra.contactosDesignados.length === 0 && (
        <Button
          variant="primary"
          className="ml-2"
          onClick={handleSeleccionarContacto}
          style={{
            padding: "0.5rem 1rem",
            marginRight: "0.5rem",
          }}
        >
          Asignar contacto existente
        </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default ContactosObra;
