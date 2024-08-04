import React, { useState } from "react";
import {
  Container,
  Button,
  Spinner,
  Alert,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import moment from "moment";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import useAuth from "../../hooks/useAuth";
import { getEstadisticasPedidos } from "../../api";

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
  const [fechaInicio, setFechaInicio] = useState(
    moment().startOf("isoWeek").format("YYYY-MM-DD")
  );
  const [fechaFin, setFechaFin] = useState(
    moment().endOf("isoWeek").format("YYYY-MM-DD")
  );
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const getToken = useAuth();

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
    <Container>
      <Button variant="link" onClick={handleShowModal} className="btn bg-gradient-default">
        <h5>Pedidos</h5>
      </Button>
      {loading && <Spinner animation="border" />}

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Estadísticas de Pedidos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleFormSubmit} className="mt-3">
            <Row>
              <Col md={6}>
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
              <Col md={6}>
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
            <Button variant="primary" type="submit">
              Aplicar
            </Button>
          </Form>

          {!loading && estadisticas && (
            <>
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
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PedidosEstadisticas;
