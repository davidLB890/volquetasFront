import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { modifyMovimiento } from "../../features/pedidoSlice"; // Asegúrate de ajustar la ruta
import useAuth from "../../hooks/useAuth";
import { putMovimiento } from "../../api"; // Asegúrate de tener un módulo API para manejar las solicitudes

const ModificarMovimiento = ({ show, onHide, movimiento, choferes }) => {
  const dispatch = useDispatch();
  const getToken = useAuth();
  const [choferId, setChoferId] = useState(movimiento?.choferId || "");
  const [horario, setHorario] = useState(movimiento?.horario || "");
  const [numeroVolqueta, setNumeroVolqueta] = useState(movimiento?.numeroVolqueta || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (movimiento) {
      setChoferId(movimiento.choferId);
      setHorario(formatDateForInput(movimiento.horario));
      setNumeroVolqueta(movimiento.numeroVolqueta);
    }
  }, [movimiento]);

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const usuarioToken = getToken();

    let numero = numeroVolqueta;
    if (numero !== null && numero !== undefined) {
      numero = String(numero).trim();
    } else {
      numero = null;
    }

    const movimientoModificado = {
      id: movimiento.id,
      choferId,
      horario,
      numeroVolqueta: numero || null,
    };

    try {
      const response = await putMovimiento(movimiento.id, movimientoModificado, usuarioToken);
      if (response.status === 200) {
        //TODO: la data no devuelve el movimiento, solo dice ok, por lo tanto no actualiza
        dispatch(modifyMovimiento(response.data));
        setSuccess("Movimiento modificado correctamente");
        setError("");
        setTimeout(() => {
          setSuccess("");
          onHide();
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.error || "Error al modificar el movimiento");
      setTimeout(() => {
        setError("");
        onHide();
      }, 2000);
      setSuccess("");
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar Movimiento</Modal.Title>
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
            <Form.Label>Número de Volqueta</Form.Label>
            <Form.Control
              type="text"
              value={numeroVolqueta}
              onChange={(e) => setNumeroVolqueta(e.target.value)}
            />
          </Form.Group>
          <Button variant="secondary" onClick={onHide} className="mr-2">
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Modificar Movimiento
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModificarMovimiento;
