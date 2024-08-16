import React from "react";
import { Form } from "react-bootstrap";

const SelectObra = ({ obras, obraSeleccionada, onSelect, onNuevaObra, label="Obra" }) => {
  return (
    <Form.Group controlId="obraSeleccionada">
      <Form.Label>{label} </Form.Label>
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
    </Form.Group>
  );
};

export default SelectObra;

