import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { postMovimiento } from "../../api"; // Ajusta la ruta según sea necesario
import useAuth from "../../hooks/useAuth";
import { addMovimiento } from "../../features/pedidoSlice"; // Ajusta la ruta según sea necesario
import { useDispatch } from "react-redux";
import { TIPOS_MOVIMIENTO } from "../../config/config"; // Ajusta la ruta según sea necesario
import UbicacionTemporal from "../VolquetasFolder/UbicacionTemporal"; // Importa el componente UbicacionTemporal

const AgregarMovimiento = ({ show, onHide, pedidoId, choferes, tipoMovimiento, numeroVolqueta }) => {
  const getToken = useAuth();
  const [choferId, setChoferId] = useState("");
  const [horario, setHorario] = useState("");
  const [tipo, setTipo] = useState(tipoMovimiento || "");
  const [numero, setNumero] = useState(numeroVolqueta || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showUbicacionTemporal, setShowUbicacionTemporal] = useState(false);
  const [volquetaId, setVolquetaId] = useState(null);
  const [successResponse, setSuccessResponse] = useState(null);

  const dispatch = useDispatch();

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
    
    let numeroVolqueta = numero;
    if (numeroVolqueta !== null && numeroVolqueta !== undefined && numeroVolqueta > 0) {
      numeroVolqueta = parseInt(numeroVolqueta); // Convertir a número si es necesario
    } else {
      numeroVolqueta = null;
    }

    // Convertir la hora local a UTC, esto para que coincida con la hora del servidor
    const horarioUTC = new Date(horario).toISOString();

    const movimiento = {
      pedidoId,
      choferId,
      ///horario,
      horario: horarioUTC, // Usar la hora en UTC
      tipo,
      numeroVolqueta: numeroVolqueta || null,
    };

    try {
      const response = await postMovimiento(movimiento, usuarioToken);
      setSuccess("Movimiento agregado correctamente");
      setSuccessResponse(response.data);
      setError("");
      
      // Si el tipo de movimiento es "levante" y hay una volqueta, mostrar la sección para agregar ubicación temporal
      if (tipo === "levante" && numeroVolqueta) {
        setVolquetaId(numeroVolqueta);
        setShowUbicacionTemporal(true); // Mostrar sección de ubicación temporal
        } else {
        dispatch(addMovimiento(response.data));
        setTimeout(() => {
          setSuccess("");
          onHide();
        }, 1000);
      }
    } catch (error) {
      console.error("Error al agregar el movimiento:", error.response?.data?.error || error.message);
      setError(error.response?.data?.detalle);
      setSuccess("");
    }
  };

  const handleUbicacionTemporalSuccess = () => {
    setShowUbicacionTemporal(false);
    dispatch(addMovimiento(successResponse));
    setTimeout(() => {
      setSuccess("");
      onHide();
    }, 1000);
  };

  const cerrarModal = () => {
    setShowUbicacionTemporal(false);
    setSuccess("");
    onHide();
    if(successResponse) {
      dispatch(addMovimiento(successResponse));
    }
  }

  return (
    //<Modal show={show} onHide={onHide}>
    <Modal show={show} onHide={cerrarModal}>
      <Modal.Header>
        <Modal.Title>Agregar Movimiento</Modal.Title>
        <Button 
          variant="link" 
          onClick={cerrarModal} 
          style={{
            textDecoration: "none",
            color: "black",
            position: "absolute",
            top: "10px",
            right: "10px",
            fontSize: "1.5rem",
          }}
        >
          &times;
        </Button>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        {!showUbicacionTemporal ? (
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
                type="number"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
              />
            </Form.Group>
            <Button variant="secondary" onClick={onHide} className="mr-2">
              Cerrar
            </Button>
            <Button variant="primary" type="submit">
              Agregar Movimiento
            </Button>
          </Form>
        ) : (
          <UbicacionTemporal
            volquetaId={volquetaId}
            show={showUbicacionTemporal}
            onSuccess={handleUbicacionTemporalSuccess}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default AgregarMovimiento;