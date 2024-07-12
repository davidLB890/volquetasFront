import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const SelectCliente = ({ clientes, onSelect, onNuevoCliente }) => {
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');

  const handleSelectChange = (e) => {
    setClienteSeleccionado(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'n') {
      onNuevoCliente();
    }
  };

  return (
    <Form.Group controlId="selectCliente">
      <Form.Label>Cliente</Form.Label>
      <Form.Control
        as="select"
        value={clienteSeleccionado}
        onChange={handleSelectChange}
        onKeyDown={handleKeyDown}
      >
        <option value="">Seleccione un cliente...</option>
        {clientes.map((cliente) => (
          <option key={cliente.id} value={cliente.id}>
            {cliente.nombre}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export default SelectCliente;
