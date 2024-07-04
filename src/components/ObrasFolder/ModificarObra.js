import React, { useState } from "react";
import { putObra } from "../../api";
import { Form, Button, Modal } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";

const ModificarObra = ({ obra, onHide, onUpdate }) => {
  const getToken = useAuth();

  const [nuevaObra, setNuevaObra] = useState({
    calle: obra.calle,
    esquina: obra.esquina,
    barrio: obra.barrio,
    coordenadas: obra.coordenadas,
    numeroPuerta: obra.numeroPuerta,
    descripcion: obra.descripcion,
    clienteEmpresaId: obra.clienteEmpresaId,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaObra({ ...nuevaObra, [name]: value });
  };

  const handleModificar = async () => {
    const usuarioToken = getToken();
    try {
      const response = await putObra(obra.id, nuevaObra, usuarioToken);
      const datos = response.data;
      onUpdate(datos); // Llama a la función para actualizar el estado de obras en el componente padre
      onHide(); // Cierra el modal después de actualizar
    } catch (error) {
      console.error(
        "Error al actualizar la obra:",
        error.response?.data?.error || error.message
      );
    }
  };

  return (
    <Modal show={true} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar Obra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="formCalle">
          <Form.Label>Calle</Form.Label>
          <Form.Control
            type="text"
            name="calle"
            value={nuevaObra.calle}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formEsquina">
          <Form.Label>Esquina</Form.Label>
          <Form.Control
            type="text"
            name="esquina"
            value={nuevaObra.esquina}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formBarrio">
          <Form.Label>Barrio</Form.Label>
          <Form.Control
            type="text"
            name="barrio"
            value={nuevaObra.barrio}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formCoordenadas">
          <Form.Label>Coordenadas</Form.Label>
          <Form.Control
            type="text"
            name="coordenadas"
            value={nuevaObra.coordenadas}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formNumeroPuerta">
          <Form.Label>Número de Puerta</Form.Label>
          <Form.Control
            type="text"
            name="numeroPuerta"
            value={nuevaObra.numeroPuerta}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formDescripcion">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            type="text"
            name="descripcion"
            value={nuevaObra.descripcion}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formClienteEmpresaId">
          <Form.Label>ID de la Empresa Cliente</Form.Label>
          <Form.Control
            type="text"
            name="clienteEmpresaId"
            value={nuevaObra.clienteEmpresaId}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleModificar}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModificarObra;
