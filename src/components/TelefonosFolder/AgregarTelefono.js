import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import AlertMessage from "../AlertMessage";
import { postTelefono } from "../../api";
import useAuth from "../../hooks/useAuth";

const AgregarTelefono = ({
  show,
  onHide,
  empleadoId,
  nombre,
  onTelefonoAgregado,
}) => {
  const [telefono, setTelefono] = useState("");
  const [tipo, setTipo] = useState("telefono");
  const [extension, setExtension] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getToken = useAuth();

  const handleChangeTelefono = (e) => setTelefono(e.target.value);
  const handleChangeTipo = (e) => setTipo(e.target.value);
  const handleChangeExtension = (e) => setExtension(e.target.value);

  const handleAgregarTelefono = async (e) => {
    e.preventDefault();
    const usuarioToken = getToken();

    if (telefono.trim() === "" || tipo.trim() === "") {
      setError("El teléfono y el tipo son obligatorios");
      setTimeout(() => setError(""), 5000);
      return;
    }

    try {
      const requestBody = { telefono, tipo, extension, empleadoId };
      const response = await postTelefono(requestBody, usuarioToken);

      setSuccess("Teléfono agregado correctamente");
      setTelefono("");
      setTipo("telefono");
      setExtension("");
      setTimeout(() => setSuccess(""), 7000);

      onTelefonoAgregado(response.data); // Pasa el nuevo teléfono correctamente
    } catch (error) {
      setError(error.response?.data?.error || "Error al agregar el teléfono");
      setTimeout(() => setError(""), 7000);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Agregando teléfono a {nombre}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleAgregarTelefono}>
          {error && <AlertMessage type="error" message={error} />}
          {success && <AlertMessage type="success" message={success} />}
          <Form.Group controlId="nuevoTelefono">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              value={telefono}
              onChange={handleChangeTelefono}
            />
          </Form.Group>
          <Form.Group controlId="tipo">
            <Form.Label>Tipo</Form.Label>
            <Form.Control as="select" value={tipo} onChange={handleChangeTipo}>
              <option value="telefono">Teléfono</option>
              <option value="celular">Celular</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="extension">
            <Form.Label>Extensión</Form.Label>
            <Form.Control
              type="text"
              value={extension}
              onChange={handleChangeExtension}
            />
          </Form.Group>
          <Button
            className="mt-3"
            variant="primary"
            type="submit"
          >
            Agregar Teléfono
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AgregarTelefono;


/* import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AlertMessage from './AlertMessage'; // Asegúrate de importar correctamente el componente
import { postTelefono } from '../api'; // Asegúrate de importar correctamente la función
import useAuth from '../hooks/useAuth';
import { Modal } from 'react-bootstrap';

const AgregarTelefono = ( show, onHide, empleadoId, clienteParticularId, contactoEmpresaId, nombre ) => {
  //const location = useLocation();
  //const { id, clienteParticularId, contactoEmpresaId, nombre } = location.state;

  const [telefono, setTelefono] = useState('');
  const [tipo, setTipo] = useState('telefono');
  const [extension, setExtension] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getToken = useAuth();

  const handleChangeTelefono = (e) => {
    setTelefono(e.target.value);
  };

  const handleChangeTipo = (e) => {
    setTipo(e.target.value);
  };

  const handleChangeExtension = (e) => {
    setExtension(e.target.value);
  };

  const handleAgregarTelefono = async (e) => {
    e.preventDefault();
    const usuarioToken = getToken();

    if (telefono.trim() === '' || tipo.trim() === '') {
      setError('El teléfono y el tipo son obligatorios');
      setTimeout(() => setError(""), 5000); // Ocultar mensaje después de 5 segundos
      return;
    }

    setError("");
    try {
      const requestBody = {
        telefono,
        tipo,
        extension,
        empleadoId: empleadoId || undefined,
        clienteParticularId: clienteParticularId || undefined,
        contactoEmpresaId: contactoEmpresaId || undefined
      };

      const response = await postTelefono(requestBody, usuarioToken);
      console.log(response);
      setSuccess('Teléfono agregado correctamente');
      setTelefono('');
      setTipo('telefono'); // Restaurar el valor predeterminado de tipo
      setExtension('');
      setTimeout(() => setSuccess(''), 7000); // Ocultar mensaje después de 7 segundos
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.error || 'Error al agregar el teléfono');
      setTimeout(() => setError(""), 7000); // Ocultar mensaje después de 7 segundos
    }
  };

  return (

     <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Agregando teléfono a {nombre}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {error && <AlertMessage type="error" message={error} />}
          {success && <AlertMessage type="success" message={success} />}

          <Form.Group controlId="nuevoTelefono">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              value={telefono}
              onChange={handleChangeTelefono}
            />
          </Form.Group>

          <Form.Group controlId="tipo">
            <Form.Label>Tipo</Form.Label>
            <Form.Control
              as="select"
              value={tipo}
              onChange={handleChangeTipo}
            >
              <option value="telefono">Teléfono</option>
              <option value="celular">Celular</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="extension">
            <Form.Label>Extensión</Form.Label>
            <Form.Control
              type="text"
              value={extension}
              onChange={handleChangeExtension}
            />
          </Form.Group>

          <Button className="mt-3" variant="primary" onClick={handleAgregarTelefono}>Agregar Jornal</Button>

        </Form>
      </Modal.Body>
    </Modal> 


     <div className='container'>
      <h2>Agrega los teléfonos de {nombre}</h2>
      <div className="col-md-3">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input
              type="text"
              className="form-control"
              id="telefono"
              name="telefono"
              value={telefono}
              onChange={handleChangeTelefono}
            />
          </div>
          <label htmlFor="tipo">Tipo</label>
          <div className="form-group">
            <select value={tipo} className="form-control" onChange={handleChangeTipo}>
              <option value="telefono">Teléfono</option>
              <option value="celular">Celular</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="extension">Extensión</label>
            <input
              type="text"
              className="form-control"
              id="extension"
              name="extension"
              value={extension}
              onChange={handleChangeExtension}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Agregar
          </button>
          {error && <AlertMessage type="error" message={error} />}
          {success && <AlertMessage type="success" message={success} />}
        </form>
      </div>
    </div> 
  );
};

export default AgregarTelefono; */
