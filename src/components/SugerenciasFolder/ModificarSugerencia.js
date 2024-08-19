import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { modifySugerencia } from "../../features/pedidoSlice"; // Asegúrate de ajustar la ruta
import useAuth from "../../hooks/useAuth";
import { putSugerencia, verificarSugerencia } from "../../api"; // Asegúrate de tener un módulo API para manejar las solicitudes

const ModificarSugerencia = ({ show, onHide, sugerencia, choferes }) => {
  const dispatch = useDispatch();
  const getToken = useAuth();
  const [choferSugeridoId, setChoferSugeridoId] = useState(sugerencia?.choferSugeridoId || "");
  const [horarioSugerido, setHorarioSugerido] = useState("");
  const [tipoSugerido, setTipoSugerido] = useState(sugerencia?.tipoSugerido || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  //console.log("horario Sugerido", horarioSugerido)
  useEffect(() => {
    if (sugerencia) {
      setChoferSugeridoId(sugerencia.choferSugeridoId);
      setHorarioSugerido(formatDateForInput(sugerencia.horarioSugerido));
      setTipoSugerido(sugerencia.tipoSugerido);
    }
  }, [sugerencia]);

  // Función para formatear la fecha en un formato que acepta el input de tipo hacerla con el date sin toISO
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    console.log("date", date)
    console.log("Tolocale", date.toLocaleString())
    console.log("TOISO", date.toISOString())
    return date.toLocaleString().slice(0, 16);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const usuarioToken = getToken();

    const sugerenciaModificada = {
      choferSugeridoId: Number(choferSugeridoId) || null,
      horarioSugerido: horarioSugerido || null,
      tipoSugerido: tipoSugerido || ""
    };

    try {
      await putSugerencia(sugerencia.id, sugerenciaModificada, usuarioToken);
      dispatch(modifySugerencia({ id: sugerencia.id, ...sugerenciaModificada }));
      setSuccess("Sugerencia modificada correctamente");
      setError("");
      setTimeout(() => {
        setSuccess("");
        onHide();
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.detalle || "Error al modificar la sugerencia");
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
          <Form.Group controlId="formTipoSugerido">
            <Form.Label>Tipo</Form.Label>
            <Form.Control
              as="select"
              value={tipoSugerido}
              onChange={(e) => setTipoSugerido(e.target.value)}
              required
            >
              <option value="">Seleccione un tipo</option>
              <option value="entrega">Entrega</option>
              <option value="levante">Levante</option>
            </Form.Control>
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
