import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import AgregarEmpresa from '../EmpresasFolder/AgegarEmpresa';
import AgregarParticular from '../ParticularesFolder/AgregarParticular';
import BuscarEmpresaPorNombre from '../EmpresasFolder/BuscarEmpresaPorNombre'; // Ajusta la ruta según sea necesario
import BuscarParticularPorNombre from '../ParticularesFolder/BuscarParticularPorNombre'; // Ajusta la ruta según sea necesario
import SelectObra from './SelectObra';
import useAuth from '../../hooks/useAuth';

const AgregarPedido = () => {
  const [clienteTipo, setClienteTipo] = useState('');
  const [clienteEstado, setClienteEstado] = useState('');
  const [clienteNuevo, setClienteNuevo] = useState(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [obras, setObras] = useState([]);
  const [horarioSugerido, setHorarioSugerido] = useState('');
  const [tipoPedido, setTipoPedido] = useState('');
  const [loadingObras, setLoadingObras] = useState(false);
  const [errorObras, setErrorObras] = useState('');

  const getToken = useAuth();

  const handleClienteTipoChange = (e) => {
    setClienteTipo(e.target.value);
    setClienteNuevo(null);
    setClienteEstado('');
    setClienteSeleccionado(null);
    setObras([]);
  };

  const handleClienteEstadoChange = (e) => {
    setClienteEstado(e.target.value);
  };

  const handleAgregarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    if (cliente.obras && Array.isArray(cliente.obras)) {
      setObras(cliente.obras);
      console.log('Obras:', cliente.obras);
      console.log('Obras2:', obras);
    } else {
      setObras([]);
    }
    setClienteNuevo(null);
  };

  const handleAgregarObra = (obra) => {
    setObras([...obras, obra]);
  };

  const handleTipoPedidoChange = (e) => {
    setTipoPedido(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para manejar el envío del pedido
  };

  return (
    <Container>
      <h1>Nuevo Pedido {clienteSeleccionado ? `para ${clienteSeleccionado.nombre}` : ''}</h1>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Group controlId="clienteTipo">
              <Form.Label>Tipo de Cliente</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  label="Empresa"
                  value="empresa"
                  checked={clienteTipo === 'empresa'}
                  onChange={handleClienteTipoChange}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Particular"
                  value="particular"
                  checked={clienteTipo === 'particular'}
                  onChange={handleClienteTipoChange}
                />
              </div>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="clienteEstado">
              <Form.Label>Estado del Cliente</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  label="Nuevo"
                  value="nuevo"
                  checked={clienteEstado === 'nuevo'}
                  onChange={handleClienteEstadoChange}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Registrado"
                  value="registrado"
                  checked={clienteEstado === 'registrado'}
                  onChange={handleClienteEstadoChange}
                />
              </div>
            </Form.Group>
          </Col>
        </Row>

        {clienteEstado === 'nuevo' && clienteTipo === 'empresa' && (
          <AgregarEmpresa onSubmit={handleAgregarCliente} onCancel={() => setClienteEstado('')} />
        )}

        {clienteEstado === 'nuevo' && clienteTipo === 'particular' && (
          <AgregarParticular onSubmit={handleAgregarCliente} onCancel={() => setClienteEstado('')} />
        )}

        {clienteEstado === 'registrado' && clienteTipo === 'empresa' && !clienteSeleccionado && (
          <BuscarEmpresaPorNombre
            onSeleccionar={handleAgregarCliente}
            getToken={getToken}
          />
        )}

        {clienteEstado === 'registrado' && clienteTipo === 'particular' && !clienteSeleccionado && (
          <BuscarParticularPorNombre
            onSeleccionar={handleAgregarCliente}
            getToken={getToken}
          />
        )}

        {clienteSeleccionado && (
          <>
            {loadingObras && <Spinner animation="border" />}
            {errorObras && <Alert variant="danger">{errorObras}</Alert>}
            {!loadingObras && !errorObras && obras.length === 0 && (
              <Alert variant="info">Sin obras hasta ahora</Alert>
            )}
            <SelectObra obras={obras} onSelect={(id) => console.log('Obra seleccionada:', id)} onNuevaObra={handleAgregarObra} />
          </>
        )}

        <Form.Group controlId="horarioSugerido">
          <Form.Label>Horario Sugerido</Form.Label>
          <Form.Control
            type="text"
            value={horarioSugerido}
            onChange={(e) => setHorarioSugerido(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="tipoPedido">
          <Form.Label>Tipo de Pedido</Form.Label>
          <div>
            <Form.Check
              type="radio"
              label="Simple"
              value="simple"
              checked={tipoPedido === 'simple'}
              onChange={handleTipoPedidoChange}
            />
            <Form.Check
              type="radio"
              label="Múltiple"
              value="multiple"
              checked={tipoPedido === 'multiple'}
              onChange={handleTipoPedidoChange}
            />
            <Form.Check
              type="radio"
              label="Entrega/Levante"
              value="entrega/levante"
              checked={tipoPedido === 'entrega/levante'}
              onChange={handleTipoPedidoChange}
            />
          </div>
        </Form.Group>

        <Button variant="primary" type="submit">
          Guardar Pedido
        </Button>
      </Form>
    </Container>
  );
};

export default AgregarPedido;
