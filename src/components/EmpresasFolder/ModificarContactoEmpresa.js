import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Modal, Button } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import { putContactoEmpresa } from "../../api";
import { modifyContactoSuccess } from "../../features/empresaSlice";
import SelectObra from "../ObrasFolder/SelectObra"; // Asegúrate de importar SelectObra

const ModificarContactoEmpresa = ({ show, onHide, contactoId }) => {
  const dispatch = useDispatch();
  const getToken = useAuth();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [email, setEmail] = useState('');
  const [obraId, setObraId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const contactos = useSelector((state) => state.empresa.contactos);
  const empresa = useSelector((state) => state.empresa.empresa);
  const contacto = contactos.find((c) => c.id === contactoId);
  console.log(contacto);
  const obras = empresa.obras;

  useEffect(() => {
    if (contacto) {
      setNombre(contacto.nombre || '');
      setDescripcion(contacto.descripcion || '');
      setEmail(contacto.email || '');
      setObraId(contacto.obraId || null);
    }
  }, [contacto]); // Esto asegura que los valores se actualicen cada vez que contacto cambie

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const usuarioToken = getToken();
    const contactoEmpresa = {
      nombre,
      descripcion,
      email,
      empresaId: contacto.empresaId,
      obraId
    };

    try {
      const response = await putContactoEmpresa(contactoId, contactoEmpresa, usuarioToken);
      dispatch(modifyContactoSuccess(response.data));
      setSuccess('Contacto modificado correctamente');
      onHide(); // Cierra el modal al finalizar
    } catch (err) {
      setError(err.response?.data?.error || 'Error al modificar el contacto');
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar Contacto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formDescripcion">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          {/* <SelectObra
            obras={obras}
            obraSeleccionada={obraId}
            onSelect={setObraId}
            label="Obra"
          /> */}
          {error && <div className="text-danger">{error}</div>}
          {success && <div className="text-success">{success}</div>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
        <Button variant="primary" onClick={handleSubmit}>Guardar Cambios</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModificarContactoEmpresa;