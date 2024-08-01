import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Spinner,
  Alert,
  Container,
  Card,
  Form,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { getVolquetaId } from "../../api"; // Asegúrate de ajustar la ruta según sea necesario
import useAuth from "../../hooks/useAuth";
import Movimientos from "../MovimientosFolder/Movimientos"; // Asegúrate de ajustar la ruta según sea necesario

const DatosVolqueta = () => {
  const location = useLocation();
  const volquetaId = location.state?.volquetaId;
  const getToken = useAuth();

  const [volqueta, setVolqueta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Establecer las fechas por defecto a la semana actual
  const getStartOfWeek = () => {
    const now = new Date();
    const firstDayOfWeek = new Date(
      now.setDate(now.getDate() - now.getDay() + 1)
    );
    return firstDayOfWeek.toISOString().split("T")[0];
  };
  const getEndOfWeek = () => {
    const now = new Date();
    const lastDayOfWeek = new Date(
      now.setDate(now.getDate() - now.getDay() + 7)
    );
    return lastDayOfWeek.toISOString().split("T")[0];
  };

  const [fechaInicio, setFechaInicio] = useState(getStartOfWeek());
  const [fechaFin, setFechaFin] = useState(getEndOfWeek());

  const fetchVolquetaData = async (fechaInicio, fechaFin) => {
    const usuarioToken = getToken();
    try {
      const response = await getVolquetaId(
        volquetaId,
        usuarioToken,
        fechaInicio,
        fechaFin
      );
      setVolqueta(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error.response?.data || error.message);
      setError("Error al obtener los detalles de la volqueta");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolquetaData(fechaInicio, fechaFin);
  }, [volquetaId, fechaInicio, fechaFin]);

  const handleFetchVolqueta = () => {
    setLoading(true);
    fetchVolquetaData(fechaInicio, fechaFin);
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!volqueta) {
    return (
      <Alert variant="danger">No se encontraron detalles de la volqueta.</Alert>
    );
  }

  return (
    <Container>
      <Card className="mt-3">
        <Card.Header>
          <h1>Detalles de la Volqueta {volqueta.numeroVolqueta}</h1>
        </Card.Header>
        <Card.Body>
          <p>
            <strong>Estado:</strong> {volqueta.estado}
          </p>
          <p>
            <strong>Tipo:</strong> {volqueta.tipo}
          </p>
          <p>
            <strong>Ocupada:</strong> {volqueta.ocupada ? "Sí" : "No"}
          </p>
          <Form>
            <Row>
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Movimientos</h4>
              </div>
              <Col>
                <Form.Group controlId="fechaInicio">
                  <Form.Label>Fecha de Inicio</Form.Label>
                  <Form.Control
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="fechaFin">
                  <Form.Label>Fecha de Fin</Form.Label>
                  <Form.Control
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
          <Movimientos
            movimientos={volqueta.Movimientos}
            volquetaId={volquetaId}
          />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DatosVolqueta;
