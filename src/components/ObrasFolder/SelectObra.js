/* import React from 'react';
import { Form } from 'react-bootstrap';

const SelectObra = ({ obras, onSelect, onNuevaObra }) => {
  return (
    <Form.Group controlId="selectObra">
      <Form.Label>Seleccione una Obra</Form.Label>
      <Form.Control as="select" onChange={(e) => onSelect(e.target.value)}>
        <option value="">Seleccione una obra</option>
        {obras.length > 0 ? (
          obras.map((obra) => (
            <option key={obra.id} value={obra.id}>
              {`${obra.calle}${obra.esquina ? ` y ${obra.esquina}` : ""}${obra.numeroPuerta ? `, ${obra.numeroPuerta}` : ""}`}
            </option>
          ))
        ) : (
          <option value="">Sin obras hasta ahora</option>
        )}
      </Form.Control>
    </Form.Group>
  );
};

export default SelectObra; */

import React from "react";
import { Form, Button } from "react-bootstrap";

const SelectObra = ({ obras, obraSeleccionada, onSelect, onNuevaObra }) => {
  return (
    <Form.Group controlId="obraSeleccionada">
      <Form.Label>Seleccionar Obra</Form.Label>
      <Form.Control
        as="select"
        value={obraSeleccionada || ""}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">Seleccione una obra</option>
        {obras.map((obra) => (
          <option key={obra.id} value={obra.id}>
            {`${obra.calle}${obra.esquina ? ` y ${obra.esquina}` : ""}${obra.numeroPuerta ? `, ${obra.numeroPuerta}` : ""}`}
          </option>
        ))}
      </Form.Control>
      {/* <Button variant="link" onClick={onNuevaObra}>
        Nueva Obra
      </Button> */}
    </Form.Group>
  );
};

export default SelectObra;

