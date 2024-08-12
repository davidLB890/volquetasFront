import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { putJornal } from '../../api';
import useAuth from '../../hooks/useAuth';

const ModificarJornalModal = ({ show, onHide, jornal, onJornalModificado }) => {

  const [nuevoJornal, setNuevoJornal] = useState({
    fecha: '',
    entrada: '',
    salida: '',
    horasExtra: '',
    tipo: 'trabajo', // Valor por defecto
  });
  const [error, setError] = useState('');

    const getToken = useAuth();

  // Actualizar el estado de nuevoJornal cuando cambia el jornal prop
  useEffect(() => {
    if (jornal) {
      setNuevoJornal({
        fecha: jornal.fecha || '',
        entrada: jornal.entrada || '',
        salida: jornal.salida || '',
        horasExtra: jornal.horasExtra || '',
        tipo: jornal.tipo?.toLowerCase() || 'trabajo', // Valor por defecto
      });
      console.log(nuevoJornal);
    }
  }, [jornal]);

  const handleModificarJornal = async () => {
    const usuarioToken = getToken();
    if(nuevoJornal.tipo === 'trabajo'){
      if(nuevoJornal.entrada === '' || nuevoJornal.salida === ''){
        setError('Debe ingresar la hora de entrada y salida para un jornal de trabajo');
        return;
      }
    }
    try {
      await putJornal(jornal.id, nuevoJornal, usuarioToken);
      onJornalModificado();
    } catch (error) {
      console.error('Error al modificar el jornal:', error);
      // Manejo de errores
    }
  };

  if (!jornal) {
    return null; // Manejo del caso donde jornal es null
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar Jornal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formFecha">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              value={nuevoJornal.fecha}
              onChange={(e) => setNuevoJornal({ ...nuevoJornal, fecha: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="formEntrada">
            <Form.Label>Entrada</Form.Label>
            <Form.Control
              type="time"
              value={nuevoJornal.entrada}
              onChange={(e) => setNuevoJornal({ ...nuevoJornal, entrada: e.target.value })}
              
            />
          </Form.Group>
          <Form.Group controlId="formSalida">
            <Form.Label>Salida</Form.Label>
            <Form.Control
              type="time"
              value={nuevoJornal.salida}
              onChange={(e) => setNuevoJornal({ ...nuevoJornal, salida: e.target.value })}
              
            />
          </Form.Group>
          <Form.Group controlId="formHorasExtra">
            <Form.Label>Horas Extra</Form.Label>
            <Form.Control
              type="text"
              value={nuevoJornal.horasExtra}
              readOnly
            />
          </Form.Group>
          <Form.Group controlId="formTipo">
            <Form.Label>Tipo</Form.Label>
            <Form.Control
              as="select"
              value={nuevoJornal.tipo}
              onChange={(e) => setNuevoJornal({ ...nuevoJornal, tipo: e.target.value })}
            >
              <option value="trabajo">Trabajo</option>
              <option value="licencia">Licencia</option>
              <option value="enfermedad">Enfermedad</option>
              <option value="falta">Falta</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleModificarJornal}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModificarJornalModal;
