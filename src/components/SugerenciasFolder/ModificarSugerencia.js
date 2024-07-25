import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { modifySugerencia } from "../../features/pedidoSlice"; // Ajusta la ruta según sea necesario
import useAuth from "../../hooks/useAuth";

const ModificarSugerencia = ({ show, onHide, sugerencia, choferes, onSugerenciaModificada }) => {
  const dispatch = useDispatch();
  const getToken = useAuth();
  const [choferSugeridoId, setChoferSugeridoId] = useState(sugerencia?.choferSugeridoId || "");
  const [horarioSugerido, setHorarioSugerido] = useState(sugerencia?.horarioSugerido || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (sugerencia) {
      setChoferSugeridoId(sugerencia.choferSugeridoId);
      setHorarioSugerido(sugerencia.horarioSugerido);
    }
  }, [sugerencia]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const usuarioToken = getToken();

    const sugerenciaModificada = {
      choferSugeridoId: Number(choferSugeridoId) || null,
      horarioSugerido: horarioSugerido || null,
    };

    try {
      const response = await dispatch(modifySugerencia({ sugerenciaId: sugerencia.id, sugerencia: sugerenciaModificada, usuarioToken })).unwrap();
      setSuccess("Sugerencia modificada correctamente");
      setError("");
      onSugerenciaModificada(response);
      setTimeout(() => {
        setSuccess("");
        onHide();
      }, 2000);
    } catch (error) {
      setError(error);
      setSuccess("");
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar Sugerencia</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formChoferId">
            <Form.Label>Chofer</Form.Label>
            <Form.Control
              as="select"
              value={choferSugeridoId}
              onChange={(e) => setChoferSugeridoId(e.target.value)}
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
          <Form.Group controlId="formHorarioSugerido">
            <Form.Label>Horario Sugerido</Form.Label>
            <Form.Control
              type="datetime-local"
              value={horarioSugerido}
              onChange={(e) => setHorarioSugerido(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="secondary" onClick={onHide} className="mr-2">
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Modificar Sugerencia
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModificarSugerencia;