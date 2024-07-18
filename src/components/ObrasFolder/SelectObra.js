import React from 'react';
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
              {`${obra.calle} y ${obra.esquina}`}
            </option>
          ))
        ) : (
          <option value="">Sin obras hasta ahora</option>
        )}
      </Form.Control>
    </Form.Group>
  );
};

export default SelectObra;
