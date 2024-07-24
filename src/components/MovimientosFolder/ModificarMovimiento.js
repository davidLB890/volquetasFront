import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { modifyMovimiento } from "../../features/pedidoSlice"; // Ajusta la ruta según sea necesario
import useAuth from "../../hooks/useAuth";

const ModificarMovimiento = ({ show, onHide, movimiento, choferes, onMovimientoModificado }) => {
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
      setHorario(movimiento.horario);
      setNumeroVolqueta(movimiento.numeroVolqueta);
      /* setTipo(tipoMovimiento); */
    }
  }, [movimiento]);


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
      choferId,
      horario,
      numeroVolqueta: numero || null,
    };

    try {
      const response = await dispatch(modifyMovimiento({ movimientoId: movimiento.id, movimiento: movimientoModificado, usuarioToken })).unwrap();
      setSuccess("Movimiento modificado correctamente");
      setError("");
      onMovimientoModificado(response);
      setTimeout(() => {
        setSuccess("");
        onHide();
      }, 2000);
    } catch (error) {
      console.error("Error al modificar el movimiento:", error.response?.data?.error || error.message);
      setError(error.response?.data?.detalle);
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
