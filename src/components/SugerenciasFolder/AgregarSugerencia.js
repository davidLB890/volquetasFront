import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { postSugerencia as postSugerenciaAPI, verificarSugerencia } from "../../api"; // Ajusta la ruta según sea necesario
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
  const [mostrarAdvertencia, setMostrarAdvertencia] = useState(false);
  const [advertencia, setAdvertencia] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    setTipo(tipoSugerencia);
  }, [tipoSugerencia]);

  const confirmarSugerencia = async () => {
    const usuarioToken = getToken();

    // Convertir la hora local a UTC antes de enviarla a la API
    const horarioSugeridoUTC = new Date(horarioSugerido).toISOString();

    const sugerencia = {
      pedidoId,
      choferSugeridoId,
      horarioSugerido,
      //horarioSugerido: horarioSugeridoUTC, // Usar la hora en UTC
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
      console.error("Error al agregar la sugerencia:", error);
      setTimeout(() => {
        setError("");
      }
      , 1500);
      setError(error.response?.data?.detalle);
      setSuccess("");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const usuarioToken = getToken();

    // Convertir la hora local a UTC antes de la verificación
    const horarioSugeridoUTC = new Date(horarioSugerido).toISOString();

    try {
      console.log("horario", horarioSugerido)
      const horario = horarioSugerido
      const response = await verificarSugerencia(choferSugeridoId, horario, usuarioToken);
      //const response = await verificarSugerencia(choferSugeridoId, horarioSugeridoUTC, usuarioToken);
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
        <Modal.Title>Agregar Sugerencia</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        {!mostrarAdvertencia ? (
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
}  

export default AgregarSugerencia;
