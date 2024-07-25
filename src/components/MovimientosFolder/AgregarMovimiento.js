import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { postMovimiento } from "../../api"; // Adjust the path as necessary
import useAuth from "../../hooks/useAuth";
import { TIPOS_MOVIMIENTO } from "../../config/config"; // Adjust the path as necessary

const AgregarMovimiento = ({ show, onHide, pedidoId, choferes, tipoMovimiento, numeroVolqueta, onMovimientoAgregado }) => {
  const getToken = useAuth();
  const [choferId, setChoferId] = useState("");
  const [horario, setHorario] = useState("");
  const [tipo, setTipo] = useState(tipoMovimiento || "");
  const [numero, setNumero] = useState(numeroVolqueta || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setTipo(tipoMovimiento);
    if (tipoMovimiento === "levante" && numeroVolqueta) {
      setNumero(numeroVolqueta);
    } else {
      setNumero("");
    }
  }, [tipoMovimiento, numeroVolqueta]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const usuarioToken = getToken();
    
    // Asegúrate de que numero sea una cadena antes de llamar a trim
    let numeroVolqueta = numero;
    if (numeroVolqueta !== null && numeroVolqueta !== undefined) {
        numeroVolqueta = String(numeroVolqueta).trim();
    } else {
        numeroVolqueta = null;
    }

    const movimiento = {
      pedidoId,
      choferId,
      horario,
      tipo,
      numeroVolqueta: numeroVolqueta || null,
    };
    try {
      const response = await postMovimiento(movimiento, usuarioToken);
      setSuccess("Movimiento agregado correctamente");
      setError("");
      setTimeout(() => {
        onMovimientoAgregado(response.data);
        setSuccess("");
        onHide();
      }, 1000);
    } catch (error) {
      console.error("Error al agregar el movimiento:", error.response?.data?.error || error.message);
      setError(error.response?.data?.detalle);
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
          <Form.Group controlId="formTipo">
            <Form.Label>Tipo</Form.Label>
            <Form.Control
              as="select"
              value={tipo}
              required
              disabled // Disable to prevent changes, since it's pre-selected
            >
              {TIPOS_MOVIMIENTO.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formNumeroVolqueta">
            <Form.Label>Número de Volqueta</Form.Label>
            <Form.Control
              type="text"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
            />
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