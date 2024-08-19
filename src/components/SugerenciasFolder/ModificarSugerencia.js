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
  const [mostrarAdvertencia, setMostrarAdvertencia] = useState(false);
  const [advertencia, setAdvertencia] = useState("");

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
  
    // Obtener cada parte de la fecha y tiempo
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son de 0 a 11
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    // Combinar todo en el formato "yyyy-MM-ddThh:mm"
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  

  const confirmarSugerencia = async () => {
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
  }

  const handleSubmit = async (e) => {

    e.preventDefault();
    const usuarioToken = getToken();
    try {
      console.log("horario", horarioSugerido)
      const horario = horarioSugerido
      const response = await verificarSugerencia(choferSugeridoId, horario, usuarioToken);
      if (response.data.message === "No hay sugerencias en el rango de tiempo especificado") {
        confirmarSugerencia();
      } else {
        const sugerenciaConflicto = response.data[0]
        console.log("sugerenciaConflicto", sugerenciaConflicto)
        const chofer = choferes.find((chofer) => chofer.id === parseInt(choferSugeridoId));
        
        if (chofer) {
          setAdvertencia(`El chofer ${chofer.nombre} tiene un pedido a las 
            ${new Date(sugerenciaConflicto.horarioSugerido).toLocaleTimeString()}, 
            en ${sugerenciaConflicto.Pedido.Obra.calle}. ¿Está seguro de que quiere continuar?`);
          setMostrarAdvertencia(true); 
        } else {
          console.error("No se encontró el chofer con el ID especificado.");
        }
      }
    } catch (error) {
      setError("El chofer ya tiene una sugerencia en ese horario");
    }
  };

  const handleConfirmarAdvertencia = () => {
    setMostrarAdvertencia(false);
    confirmarSugerencia();
  };

  const handleCancelarAdvertencia = () => {
    setMostrarAdvertencia(false);
    // Permanece en el modal
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Modificar Sugerencia</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        {!mostrarAdvertencia ? (
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
        ) : (
          <Alert variant="warning">
            {advertencia}
            <div className="mt-3">
              <Button
                variant="danger"
                onClick={handleCancelarAdvertencia}
                className="mr-2"
              >
                No
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmarAdvertencia}
              >
                Sí
              </Button>
            </div>
          </Alert>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ModificarSugerencia;
