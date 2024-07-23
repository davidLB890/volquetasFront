import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { postMovimiento } from "../../api"; // Ajusta la ruta según sea necesario
import useAuth from "../../hooks/useAuth";
import { TIPOS_MOVIMIENTO } from "../../config/config"; // Ajusta la ruta según sea necesario

const AgregarMovimiento = ({ show, onHide, pedidoId, choferes }) => {
  const getToken = useAuth();

  const [choferId, setChoferId] = useState("");
  const [horario, setHorario] = useState("");
  const [numeroVolqueta, setNumeroVolqueta] = useState("");
  const [tipo, setTipo] = useState(TIPOS_MOVIMIENTO[0]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const usuarioToken = getToken();
    const movimiento = {
      pedidoId,
      choferId,
      horario,
      numeroVolqueta: numeroVolqueta || null,
      tipo,
    };

    try {
      console.log("Movimiento a agregar:", movimiento);
      await postMovimiento(movimiento, usuarioToken);
      setSuccess("Movimiento agregado correctamente");
      setError("");
      setTimeout(() => {
        setSuccess("");
        onHide();
      }, 2000);
    } catch (error) {
      console.error("Error al agregar el movimiento:", error.response || error.message);
      setError(error.response?.data?.error + error.response?.data?.detalle);
      setSuccess("");
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Movimiento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formChoferId">
            <Form.Label>Chofer</Form.Label>
            <Form.Control
              as="select"
              value={choferId}
              onChange={(e) => setChoferId(e.target.value)}
              required
            >
              <option value="">Seleccione un chofer</option>
              {choferes.map((chofer) => (
                <option key={chofer.id} value={chofer.id}>
                  {chofer.nombre}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formHorario">
            <Form.Label>Horario</Form.Label>
            <Form.Control
              type="datetime-local"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formNumeroVolqueta">
            <Form.Label>Número de Volqueta (opcional)</Form.Label>
            <Form.Control
              type="text"
              value={numeroVolqueta}
              onChange={(e) => setNumeroVolqueta(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formTipo">
            <Form.Label>Tipo</Form.Label>
            <Form.Control
              as="select"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              required
            >
              {TIPOS_MOVIMIENTO.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button variant="secondary" onClick={onHide} className="mr-2">
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Agregar Movimiento
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AgregarMovimiento;