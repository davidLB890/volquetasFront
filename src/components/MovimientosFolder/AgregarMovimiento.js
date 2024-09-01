import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { postMovimiento } from "../../api";
import useAuth from "../../hooks/useAuth";
import { addMovimiento } from "../../features/pedidoSlice";
import { useDispatch } from "react-redux";
import { TIPOS_MOVIMIENTO } from "../../config/config";
import UbicacionTemporal from "../VolquetasFolder/UbicacionTemporal";

const AgregarMovimiento = ({ show, onHide, pedidoId, choferes, tipoMovimiento, numeroVolqueta }) => {
  const getToken = useAuth();
  const [choferId, setChoferId] = useState("");
  const [horario, setHorario] = useState("");
  const [tipo, setTipo] = useState(tipoMovimiento || "");
  const [numero, setNumero] = useState(numeroVolqueta || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showUbicacionTemporal, setShowUbicacionTemporal] = useState(false);
  const [omitido, setOmitido] = useState(false);
  const [volquetaId, setVolquetaId] = useState(null);
  const [successResponse, setSuccessResponse] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      numeroVolqueta = parseInt(numeroVolqueta);
    } else {
      numeroVolqueta = null;
    }

    const horarioUTC = new Date(horario).toISOString();

    const movimiento = {
      pedidoId,
      choferId,
      horario: horarioUTC,
      tipo,
      numeroVolqueta: numeroVolqueta || null,
    };

    try {
      const response = await postMovimiento(movimiento, usuarioToken);
      setSuccess("Movimiento agregado correctamente");
      setSuccessResponse(response.data);
      setError("");
      setIsSubmitted(true); // Marca el estado como enviado
      
      if (tipo === "levante" && numeroVolqueta) {
        setVolquetaId(numeroVolqueta);
        setShowUbicacionTemporal(true);
      } else {
        dispatch(addMovimiento(response.data));
        setTimeout(() => {
          setSuccess("");
          handleCloseModal();
        }, 500);
      }
    } catch (error) {
      console.error("Error al agregar el movimiento:", error.response?.data?.error || error.message);
      setError(error.response?.data?.detalle);
      setSuccess("");
      setIsSubmitted(false); // Restablece el estado si hay un error
    }
  };

  const handleUbicacionTemporalSuccess = () => {
    setShowUbicacionTemporal(false);
    dispatch(addMovimiento(successResponse));
    setTimeout(() => {
      setSuccess("");
      handleCloseModal();
    }, 500);
  };

  const handleCloseModal = () => {
    if (successResponse && !showUbicacionTemporal && isSubmitted) {
      // Solo despacha si la respuesta fue exitosa y el modal no requiere ubicacion temporal
      dispatch(addMovimiento(successResponse));
    }
    setShowUbicacionTemporal(false);
    setSuccessResponse(null);
    setSuccess("");
    setIsSubmitted(false);
    onHide();
  };

  const handleOmitido = () => {
    setOmitido(true);
    setShowUbicacionTemporal(false);
    dispatch(addMovimiento(successResponse));
    setTimeout(() => {
      setSuccess("");
      handleCloseModal();
    }, 500);
  }

  return (
    <Modal show={show} onHide={handleCloseModal}>
      <Modal.Header>
        <Modal.Title>Agregar Movimiento</Modal.Title>
        <Button 
          variant="link" 
          onClick={handleCloseModal} 
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
                disabled
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
            <Button variant="secondary" onClick={handleCloseModal} className="mr-2">
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
            onOmitir={handleOmitido}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default AgregarMovimiento;
