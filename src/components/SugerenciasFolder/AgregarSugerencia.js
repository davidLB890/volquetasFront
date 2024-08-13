import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { postSugerencia as postSugerenciaAPI } from "../../api"; // Ajusta la ruta según sea necesario
import { addSugerencia } from "../../features/pedidoSlice"; // Ajusta la ruta según sea necesario
import useAuth from "../../hooks/useAuth";

const AgregarSugerencia = ({
  show,
  onHide,
  pedidoId,
  choferes,
  tipoSugerencia,
}) => {
  const getToken = useAuth();
  const [choferSugeridoId, setChoferSugeridoId] = useState("");
  const [horarioSugerido, setHorarioSugerido] = useState("");
  const [tipo, setTipo] = useState(tipoSugerencia);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    setTipo(tipoSugerencia);
  }, [tipoSugerencia]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const usuarioToken = getToken();
    const sugerencia = {
      pedidoId,
      choferSugeridoId,
      horarioSugerido,
      tipoSugerido: tipo,
    };

    try {
      const response = await postSugerenciaAPI(sugerencia, usuarioToken);
      dispatch(addSugerencia(response.data));
      setSuccess("Sugerencia agregada correctamente");
      setError("");
      setTimeout(() => {
        setSuccess("");
        onHide();
      }, 1000);
    } catch (error) {
      console.error("Error al agregar la sugerencia:", error.response?.data?.error || error.message);
      setError(error.response?.data?.error || error.message);
      setSuccess("");
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Sugerencia</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formChoferSugeridoId">
            <Form.Label>Chofer Sugerido</Form.Label>
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
          <Form.Group controlId="formTipoSugerido">
            <Form.Label>Tipo</Form.Label>
            <Form.Control
              as="select"
              value={tipo}
              required
              disabled // Disable to prevent changes, since it's pre-selected
            >
              <option value="entrega">Entrega</option>
              <option value="levante">Levante</option>
            </Form.Control>
          </Form.Group>
          <Button variant="secondary" onClick={onHide} className="mr-2">
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Agregar Sugerencia
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AgregarSugerencia;
