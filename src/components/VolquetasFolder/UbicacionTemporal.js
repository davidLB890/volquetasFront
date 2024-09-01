import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { ubicacionTemporalVolqueta } from "../../api"; // Ajusta la ruta según sea necesario
import useAuth from "../../hooks/useAuth"; // Importa el hook para obtener el token
import { useDispatch } from "react-redux";
import { agregarUbicacionTemporalSuccess } from "../../features/volquetasSlice"; // Ajusta la ruta según sea necesario

const UbicacionTemporal = ({ volquetaId, onSuccess, onOmitir }) => {
  const [ubicacionTemporal, setUbicacionTemporal] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const getToken = useAuth(); // Obtén el token del usuario
    const dispatch = useDispatch();

  const handleChange = (e) => {
    setUbicacionTemporal(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const usuarioToken = getToken();

    try {
      const response = await ubicacionTemporalVolqueta(volquetaId, ubicacionTemporal, usuarioToken);
      setSuccess(true);
      dispatch(agregarUbicacionTemporalSuccess(response.data));
      onSuccess(); // Ejecutar función de éxito
      setError(null);
      setTimeout(() => setSuccess(false), 5000); // Ocultar mensaje de éxito después de 5 segundos
    } catch (error) {
      setError("Error al actualizar la ubicación temporal");
      setSuccess(false);
      console.error("Error al actualizar la ubicación temporal:", error);
    }
  };

  return (
    <div>
      <h4>Asignar Ubicación Temporal a Volqueta</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="ubicacionTemporal">
          <Form.Label>Ubicación Temporal</Form.Label>
          <Form.Control
            type="text"
            value={ubicacionTemporal}
            onChange={handleChange}
            placeholder="Ingresa la nueva ubicación"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Asignar Ubicación
        </Button>
        <Button variant="primary" onClick={onOmitir}>
          Omitir este paso
        </Button>
      </Form>
      {success && <Alert variant="success">Ubicación temporal asignada correctamente.</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
    </div>
  );
};

export default UbicacionTemporal;
