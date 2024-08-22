import React, { useEffect, useState } from "react";
import { Container, Button, Spinner, Alert, Card, Form, Row, Col } from "react-bootstrap";
import moment from "moment";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import useAuth from "../../hooks/useAuth";
import { getEstadisticasPedidos } from "../../api";
import { useNavigate } from "react-router-dom";

// Registra los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PedidosEstadisticas = () => {
  const [fechaInicio, setFechaInicio] = useState( moment().startOf("isoWeek").format("YYYY-MM-DD"));
  const [fechaFin, setFechaFin] = useState( moment().endOf("isoWeek").format("YYYY-MM-DD"));
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const getToken = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!getToken()) {
      navigate("/login");
    }
  }, [getToken, navigate]);

  useEffect(() => {
    fetchEstadisticasPedidos(fechaInicio, fechaFin);
  }, []);

  const fetchEstadisticasPedidos = async (fechaInicio, fechaFin) => {
    const usuarioToken = getToken();
    setLoading(true);
    try {
      const response = await getEstadisticasPedidos(
        fechaInicio,
        fechaFin,
        usuarioToken
      );
      setEstadisticas(response.data);
      setLoading(false);
      setError("");
      setShowModal(true);
    } catch (error) {
      setError("Error al obtener las estadísticas de pedidos");
      setLoading(false);
    }
  };

  const handleShowModal = () => {
    fetchEstadisticasPedidos(fechaInicio, fechaFin);
  };

  const handleCloseModal = () => setShowModal(false);
  const handleFormSubmit = (e) => {
    e.preventDefault();
    fetchEstadisticasPedidos(fechaInicio, fechaFin);
  };

  const getPagadosNoPagadosData = () => {
    return {
      labels: ["Pagados", "No Pagados"],
      datasets: [
        {
          label: "Cantidad",
          data: [
            estadisticas.pagados.cantidad,
            estadisticas.nopagados.cantidad,
          ],
          backgroundColor: [
            "rgba(75, 192, 192, 0.2)",
            "rgba(255, 99, 132, 0.2)",
          ],
          borderColor: ["rgb(75, 192, 192)", "rgb(255, 99, 132)"],
          borderWidth: 1,
        },
      ],
    };
  };

  const optionsPagadosNoPagados = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = "";
            label += context.raw;
            if (context.dataIndex === 0) {
              label += ` (Monto: ${estadisticas.pagados.monto})`;
            } else if (context.dataIndex === 1) {
              label += ` (Monto: ${estadisticas.nopagados.monto})`;
            }
            return label;
          },
        },
      },
    },
  };

  const getEstadoData = () => {
    return {
      labels: ["Iniciado", "Entregado", "Levantado", "Cancelado"],
      datasets: [
        {
          label: "Cantidad",
          data: [
            estadisticas.estado.iniciado.cantidad,
            estadisticas.estado.entregado.cantidad,
            estadisticas.estado.levantado.cantidad,
            estadisticas.estado.cancelado.cantidad,
          ],
          backgroundColor: [
            "rgba(54, 162, 235, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 99, 132, 0.2)",
          ],
          borderColor: [
            "rgb(54, 162, 235)",
            "rgb(153, 102, 255)",
            "rgb(255, 159, 64)",
            "rgb(255, 99, 132)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    (
      <Container>
        {loading && <Spinner animation="border" />}
  
        <Card className="mb-4">
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
              <Card.Title className="mb-0">Estadísticas de Pedidos</Card.Title>
            </div>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
  
            <Form onSubmit={handleFormSubmit} className="mt-1">
              <Row className="align-items-end">
                <Col md={4}>
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
                <Col md={4}>
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
                <Col md={1} className="d-flex justify-content-between">
                  <Button variant="primary" type="submit" className="ml-2 align-self-end">
                    Aplicar
                  </Button>
                </Col>
              </Row>
            </Form>
  
            {!loading && estadisticas && (
              <Row style={{ marginTop: "20px" }}>
                <Col md={6}>
                  <h5>Pagados</h5>
                  <Bar data={getPagadosNoPagadosData()} options={optionsPagadosNoPagados} />
                </Col>
                <Col md={6}>
                  <h5>Estado</h5>
                  <Bar data={getEstadoData()} />
                </Col>
              </Row>
            )}
          </Card.Body>
        </Card>
      </Container>
    )
  );
};

export default PedidosEstadisticas;
