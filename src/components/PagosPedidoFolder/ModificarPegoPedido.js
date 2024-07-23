import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { putPagoPedidos } from "../../api"; // Ajusta la ruta según sea necesario
import useAuth from "../../hooks/useAuth";
import AlertMessage from "../AlertMessage";

const ModificarPagoPedido = ({ show, onHide, pago }) => {
  const [editablePago, setEditablePago] = useState({ ...pago });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const getToken = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditablePago({
      ...editablePago,
      [name]: value,
    });
  };

  const handleSave = async () => {
    const usuarioToken = getToken();
    try {
      await putPagoPedidos(editablePago.id, editablePago, usuarioToken);
      setSuccess("Detalles de pago modificados correctamente");
      setError("");
      setTimeout(() => {
        setSuccess("");
        onHide();
      }, 2000);
    } catch (error) {
      console.error("Error al modificar los detalles de pago:", error.response?.data?.error || error.message);
      setError("Error al modificar los detalles de pago");
      setSuccess("");
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar Detalles de Pago</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <AlertMessage type="error" message={error} />}
        {success && <AlertMessage type="success" message={success} />}
        <Form>
          <Form.Group controlId="formPrecio">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              name="precio"
              value={editablePago.precio}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formTipoPago">
            <Form.Label>Tipo de Pago</Form.Label>
            <Form.Control
              as="select"
              name="tipoPago"
              value={editablePago.tipoPago}
              onChange={handleInputChange}
            >
              <option value="transferencia">Transferencia</option>
              <option value="efectivo">Efectivo</option>
              <option value="cheque">Cheque</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formRemito">
            <Form.Label>Remito</Form.Label>
            <Form.Control
              type="text"
              name="remito"
              value={editablePago.remito || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formFacturaId">
            <Form.Label>ID de Factura</Form.Label>
            <Form.Control
              type="text"
              name="facturaId"
              value={editablePago.facturaId || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModificarPagoPedido;
