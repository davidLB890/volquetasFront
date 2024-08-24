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
  const [horario, setHorario] = useState(new Date (movimiento?.horario) || "");
  const [numeroVolqueta, setNumeroVolqueta] = useState(movimiento?.numeroVolqueta || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  //const [volquetaSigueIgual, setVolquetaSigueIgual] = useState(false);

  useEffect(() => {
    if (movimiento) {
      setChoferId(movimiento.choferId);
      setHorario(formatDateForInput(movimiento.horario));
      setNumeroVolqueta(movimiento.numeroVolqueta);
    }
  }, [movimiento]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const usuarioToken = getToken();

    //si la volqueta no cambia, la paso en null (por restruccion de la api)
    let numero = numeroVolqueta;
    if (numero !== null && numero !== undefined && numero > 0 && numero !== movimiento.numeroVolqueta) {
      numero = String(numero).trim();
    } else {
      numero = null;
    }

    const movimientoModificado = {
      id: movimiento.id,
      choferId,
      horario,
      numeroVolqueta: numero || null,
      numeroVolqueta: numero || null,
    };

    try {
      const response = await putMovimiento(movimiento.id, movimientoModificado, usuarioToken);
      
      if (response.status === 200 && response.data.length > 0) {
        const movimientoModificadoApi = {
          id: response.data[0].id,
          choferId: response.data[0].choferId,
          horario: response.data[0].horario,
          numeroVolqueta: response.data[0].numeroVolqueta,
        };
        console.log("Movimiento modificado:", movimientoModificadoApi);
    
        dispatch(modifyMovimiento(movimientoModificadoApi));
        setSuccess("Movimiento modificado correctamente");
        setError("");
    
        setTimeout(() => {
          setSuccess("");
          onHide();
        }, 2000);
      } else {
        setError("No se pudo modificar el movimiento");
      }
    } catch (error) {
      console.error("Error al modificar el movimiento:", error);
      setError(error.response.data.error);
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
              type="number"
              value={numeroVolqueta}
              onChange={(e) => setNumeroVolqueta(e.target.value)}
            />
          </Form.Group>
          <Button variant="secondary" onClick={onHide} className="mr-2">
            Cerrar
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
