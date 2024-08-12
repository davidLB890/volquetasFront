/* import React, { useState } from "react";
import { putObraDetalle } from "../../api";
import { Form, Button, Modal } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";

const ModificarObraDetalle = ({ obra, onHide, onUpdate }) => {
  const getToken = useAuth();

  const [detalleObra, setDetalleObra] = useState({
    detalleResiduos: obra.detalleResiduos,
    residuosMezclados: obra.residuosMezclados,
    residuosReciclados: obra.residuosReciclados,
    frecuenciaSemanal: obra.frecuenciaSemanal,
    destinoFinal: obra.destinoFinal,
    dias: obra.dias,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setDetalleObra({ ...detalleObra, [name]: val });
  };

  const handleModificar = async () => {
    const usuarioToken = getToken();
    try {
      const response = await putObraDetalle(obra.id, detalleObra, usuarioToken);
      const datos = response.data;
      onUpdate(datos); // Llama a la función para actualizar el estado de obras en el componente padre
      onHide(); // Cierra el modal después de actualizar
    } catch (error) {
      console.error(
        "Error al actualizar los detalles de la obra:",
        error.response?.data?.error || error.message
      );
    }
  };

  return (
    <Modal show={true} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar Detalles de la Obra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="formDetalleResiduos">
          <Form.Label>Detalle de Residuos</Form.Label>
          <Form.Control
            type="text"
            name="detalleResiduos"
            value={detalleObra.detalleResiduos}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formResiduosMezclados">
          <Form.Check
            type="checkbox"
            label="Residuos Mezclados"
            name="residuosMezclados"
            checked={detalleObra.residuosMezclados}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="formResiduosReciclados">
          <Form.Check
            type="checkbox"
            label="Residuos Reciclados"
            name="residuosReciclados"
            checked={detalleObra.residuosReciclados}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="formFrecuenciaSemanal">
          <Form.Label>Frecuencia Semanal</Form.Label>
          <Form.Control
            type="text"
            name="frecuenciaSemanal"
            placeholder="Días de la semana (ej: 1,2)"
            value={detalleObra.frecuenciaSemanal}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formDestinoFinal">
          <Form.Label>Destino Final</Form.Label>
          <Form.Control
            type="text"
            name="destinoFinal"
            value={detalleObra.destinoFinal}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formDias">
          <Form.Label>Días</Form.Label>
          <Form.Control
            type="text"
            name="dias"
            value={detalleObra.dias}
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

export default ModificarObraDetalle; */
