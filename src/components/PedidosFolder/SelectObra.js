import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const SelectObra = ({ obras, onSelect, onNuevaObra }) => {
  const [obraSeleccionada, setObraSeleccionada] = useState('');

  const handleSelectChange = (e) => {
    setObraSeleccionada(e.target.value);
  };

  return (
    <Form.Group controlId="selectObra">
      <Form.Label>Obra</Form.Label>
      <Form.Control
        as="select"
        value={obraSeleccionada}
        onChange={handleSelectChange}
      >
        <option value="">Seleccione una obra...</option>
        {obras.map((obra) => (
          <option key={obra.id} value={obra.id}>
            {obra.nombre}
          </option>
        ))}
      </Form.Control>
      <Button variant="link" onClick={onNuevaObra}>
        Agregar nueva obra
      </Button>
    </Form.Group>
  );
};

export default SelectObra;
