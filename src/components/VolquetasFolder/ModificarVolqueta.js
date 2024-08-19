import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Alert } from "react-bootstrap";
import { useDispatch } from "react-redux";
import useAuth from "../../hooks/useAuth";
import { ESTADOS_VOLQUETA } from "../../config/config";
import { modificarVolquetaSuccess, agregarUbicacionTemporalSuccess } from "../../features/volquetasSlice";
import UbicacionTemporal from "./UbicacionTemporal"; // Asegúrate de importar el componente
import { putVolquetaAPI } from "../../api"; // Asegúrate de importar la función de la API

const ModificarVolqueta = ({ volqueta, onHide, onUpdate }) => {
  const getToken = useAuth();
  const dispatch = useDispatch();

  const [nuevaVolqueta, setNuevaVolqueta] = useState({
    numeroVolqueta: "",
    tipo: "",
    estado: "",
    ocupada: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (volqueta) {
      setNuevaVolqueta({
        numeroVolqueta: volqueta?.numeroVolqueta || "",
        tipo: volqueta?.tipo || "grande",
        estado: volqueta?.estado || "ok",
        ocupada: volqueta?.ocupada ? "si" : "no",
      });
    }
  }, [volqueta]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaVolqueta({ ...nuevaVolqueta, [name]: value });
  };

  const handleModificar = async () => {
    const usuarioToken = getToken();
    try {
      const response = await putVolquetaAPI(
        volqueta.numeroVolqueta,
        {
          ...nuevaVolqueta,
          ocupada: nuevaVolqueta.ocupada === "si",
        },
        usuarioToken
      );
      const datos = response.data;
      console.log("Volqueta actualizada:", datos);

      // Despacha la acción para actualizar la volqueta en Redux
      dispatch(modificarVolquetaSuccess(datos));

      onUpdate(datos);
      setSuccess("Volqueta actualizada correctamente");
      setTimeout(() => {
        setSuccess("");
        onHide();
      }, 2000);
    } catch (error) {
      console.error("Error al actualizar la volqueta:", error.response?.data?.error || error.message);
      const errorMsg = typeof error.response?.data?.error === 'string'
        ? error.response.data.error
        : 'Error al actualizar la volqueta';
      setError(errorMsg);
      setTimeout(() => setError(""), 5000);
    }
  };

  const hacerDispatchUbicacion = () => {
      setTimeout(() => {
        setSuccess("");
        onHide();
      }, 1500);
  }

  return (
    <Modal show={true} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>Modificar Volqueta</Modal.Title>
        <div style={{ marginLeft: 'auto' }}>
          <Button
            variant="secondary"
            onClick={onHide}
            style={{ border: 'none', color: 'black', background: 'transparent' }}
          >
            ✖
          </Button>
        </div>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form.Group controlId="formTipo">
          <Form.Label>Tipo</Form.Label>
          <Form.Control
            as="select"
            name="tipo"
            value={nuevaVolqueta.tipo}
            onChange={handleInputChange}
            required
          >
            <option value="grande">Grande</option>
            <option value="chica">Chica</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formEstado">
          <Form.Label>Estado</Form.Label>
          <Form.Control
            as="select"
            name="estado"
            value={nuevaVolqueta.estado}
            onChange={handleInputChange}
            required
          >
            {ESTADOS_VOLQUETA.map((estado) => (
              <option key={estado.value} value={estado.value}>
                {estado.label}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        {/* Mostrar el componente UbicacionTemporal solo si la volqueta no está ocupada */}
        {nuevaVolqueta.ocupada === "no" && (
          <UbicacionTemporal
            volquetaId={volqueta?.numeroVolqueta}
            show={true}
            onHide={onHide}
            onSuccess={hacerDispatchUbicacion}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleModificar}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModificarVolqueta;
