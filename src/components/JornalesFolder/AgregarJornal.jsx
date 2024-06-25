import React, { useState } from 'react';
import { Form, Button, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { postJornal } from '../../api';

const AgregarJornal = ({ show, onHide, empleadoId, empleadoNombre, onJornalAgregado }) => {
  const [nuevoJornal, setNuevoJornal] = useState({empleadoId: '', fecha: '', entrada: '', salida: '', tipo: ''});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const getToken = useAuth();

  const handleAgregarJornal = async () => {
    const usuarioToken = getToken();
    if (!usuarioToken) {
      navigate('/login');
    } else {
      try {
        const response = await postJornal({ ...nuevoJornal, empleadoId }, usuarioToken);
        setNuevoJornal({ empleadoId: '', fecha: '', entrada: '', salida: '', tipo: '' });
        console.log('response:', response.data)
        if (response.object !== null) {
          setSuccess('Jornal agregado correctamente.');
          setTimeout(() => {
            setSuccess('');
          }, 10000);
          setError('');
          onJornalAgregado();
        } else {
          setError(response.data.error || 'Error al agregar jornal.');
          setSuccess('');
        }
      } catch (error) {
        console.error('Error al agregar jornal:', error);
        setError(error.response?.data?.error || 'Error al agregar jornal.');
        setSuccess('');
      }
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Agregando Jornal a {empleadoNombre}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form.Group controlId="nuevoJornalFecha">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              value={nuevoJornal.fecha}
              onChange={(e) => setNuevoJornal({ ...nuevoJornal, fecha: e.target.value })}/>
          </Form.Group>

          <Form.Group controlId="nuevoJornalEntrada">
            <Form.Label>Entrada</Form.Label>
            <Form.Control
              type="time"
              value={nuevoJornal.entrada}
              onChange={(e) => setNuevoJornal({ ...nuevoJornal, entrada: e.target.value })}/>
          </Form.Group>

          <Form.Group controlId="nuevoJornalSalida">
            <Form.Label>Salida</Form.Label>
            <Form.Control
              type="time"
              value={nuevoJornal.salida}
              onChange={(e) => setNuevoJornal({ ...nuevoJornal, salida: e.target.value })}/>
          </Form.Group>

          <Form.Group controlId="nuevoJornalTipo">
            <Form.Label>Tipo</Form.Label>
            <Form.Control as="select"
              value={nuevoJornal.tipo}
              onChange={(e) => setNuevoJornal({ ...nuevoJornal, tipo: e.target.value })}>
              <option value="">Seleccione un tipo de Jornal</option>
              <option value="trabajo">Trabajo</option>
              <option value="licencia">Licencia</option>
              <option value="enfermedad">Enfermedad</option>
              <option value="falta">Falta</option>
            </Form.Control>
          </Form.Group>

          <Button className="mt-3" onClick={handleAgregarJornal}>Agregar Jornal</Button>

        </Form>
      </Modal.Body>
    </Modal>

    );
  };

export default AgregarJornal;
