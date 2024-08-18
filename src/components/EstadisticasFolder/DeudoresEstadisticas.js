import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Spinner,
  Alert,
  Card,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import {
  getDeudoresEstadisticas,
  getEmpresaId,
  getParticularId,
} from "../../api";
import useAuth from "../../hooks/useAuth";
import moment from "moment";
import { useNavigate } from "react-router-dom";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Deudores = () => {
  const [topEmpresasNoPagadosMonto, setTopEmpresasNoPagadosMonto] = useState([]);
  const [topParticularesNoPagadosMonto, setTopParticularesNoPagadosMonto] =
    useState([]);
  const [topEmpresasNoPagadosCantidad, setTopEmpresasNoPagadosCantidad] =
    useState([]);
  const [topParticularesNoPagadosCantidad, setTopParticularesNoPagadosCantidad] =
    useState([]);
  const [empresaNombres, setEmpresaNombres] = useState({});
  const [particularNombres, setParticularNombres] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [fechaInicio, setFechaInicio] = useState(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [fechaFin, setFechaFin] = useState(
    moment().endOf("month").format("YYYY-MM-DD")
  );
  const [deudores, setDeudores] = useState(3);
  const getToken = useAuth();
  const navigate = useNavigate();

  const fetchNombres = async (deudoresEmpresas, deudoresParticulares) => {
    const usuarioToken = getToken();
    const empresaPromises = deudoresEmpresas.map((empresa) =>
      getEmpresaId(empresa.id, usuarioToken)
    );
    const particularPromises = deudoresParticulares.map((particular) =>
      getParticularId(particular.id, usuarioToken)
    );

    try {
      const empresasRes = await Promise.all(empresaPromises);
      const particularesRes = await Promise.all(particularPromises);

      const empresas = {};
      const particulares = {};

      empresasRes.forEach((res, idx) => {
        empresas[deudoresEmpresas[idx].id] = res.data.nombre;
      });
      particularesRes.forEach((res, idx) => {
        particulares[deudoresParticulares[idx].id] = res.data.nombre;
      });

      setEmpresaNombres(empresas);
      setParticularNombres(particulares);
    } catch (error) {
      console.error("Error al obtener los nombres:", error);
    }
  };

  const fetchDeudores = async (fechaInicio, fechaFin, deudores) => {
    const usuarioToken = getToken();
    try {
      const [montoResponse, cantidadResponse] = await Promise.all([
        getDeudoresEstadisticas(fechaInicio, fechaFin, "monto", deudores, usuarioToken),
        getDeudoresEstadisticas(fechaInicio, fechaFin, "cantidad", deudores, usuarioToken),
      ]);

      setTopEmpresasNoPagadosMonto(montoResponse.data.topEmpresasNoPagados);
      setTopParticularesNoPagadosMonto(montoResponse.data.topParticularesNoPagados);
      setTopEmpresasNoPagadosCantidad(cantidadResponse.data.topEmpresasNoPagados);
      setTopParticularesNoPagadosCantidad(cantidadResponse.data.topParticularesNoPagados);

      await fetchNombres(
        [...montoResponse.data.topEmpresasNoPagados, ...cantidadResponse.data.topEmpresasNoPagados],
        [...montoResponse.data.topParticularesNoPagados, ...cantidadResponse.data.topParticularesNoPagados]
      );

      setLoading(false);
    } catch (error) {
      setError("Error al obtener los deudores");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeudores(fechaInicio, fechaFin, deudores);
  }, [getToken]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchDeudores(fechaInicio, fechaFin, deudores);
  };

  const handleEmpresaClick = (empresaId) => {
    navigate("/empresas/datos", { state: { empresaId } });
  };

  const handleParticularClick = (particularId) => {
    navigate("/particulares/datos", { state: { particularId } });
  };

  const handleChartClick = (event, elements, type) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      if (type === "empresa") {
        handleEmpresaClick(topEmpresasNoPagadosMonto[index].id);
      } else {
        handleParticularClick(topParticularesNoPagadosMonto[index].id);
      }
    }
  };

  const getMontoChartData = () => {
    return {
      labels: topEmpresasNoPagadosMonto.map(
        (empresa) => empresaNombres[empresa.id]
      ),
      datasets: [
        {
          label: "Monto adeudado",
          data: topEmpresasNoPagadosMonto.map((empresa) => empresa.monto),
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const getCantidadChartData = () => {
    return {
      labels: topEmpresasNoPagadosCantidad.map(
        (empresa) => empresaNombres[empresa.id]
      ),
      datasets: [
        {
          label: "Cantidad de deudas",
          data: topEmpresasNoPagadosCantidad.map((empresa) => empresa.cantidad),
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = (type) => ({
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const index = context.dataIndex;
            const label = context.dataset.label || "";
            const value = context.raw;
            let cantidad;
            if (type === "empresa") {
              cantidad = topEmpresasNoPagadosMonto[index].cantidad;
            } else {
              cantidad = topParticularesNoPagadosMonto[index].cantidad;
            }
            return `${label}: ${value} (Cantidad de deudas: ${cantidad})`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    onClick: (event, elements) => handleChartClick(event, elements, type),
  });

  return (
    <Container>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <Card.Title className="mb-0">Top {deudores} Deudores</Card.Title>
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            Filtros
          </Button>
        </Card.Header>
        <Card.Body className="pt-2">
          {showFilters && (
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
              <Row>
                <Col md={6}>
                  <Form.Group controlId="deudores">
                    <Form.Label>Cantidad de Deudores</Form.Label>
                    <Form.Control
                      type="number"
                      value={deudores}
                      onChange={(e) => setDeudores(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button variant="primary" type="submit">
                Aplicar
              </Button>
            </Form>
          )}
          {!loading && !error && (
            <>
              <Row className="mt-4">
                <Col md={6}>
                  <h6>Empresas Deudoras - Monto</h6>
                  <Bar
                    data={getMontoChartData()}
                    options={chartOptions("empresa")}
                  />
                </Col>
                <Col md={6}>
                  <h6>Empresas Deudoras - Cantidad</h6>
                  <Bar
                    data={getCantidadChartData()}
                    options={chartOptions("empresa")}
                  />
                </Col>
              </Row>
              <Row className="mt-4">
                <Col md={6}>
                  <h6>Particulares Deudores - Monto</h6>
                  <Bar
                    data={getMontoChartData()}
                    options={chartOptions("particular")}
                  />
                </Col>
                <Col md={6}>
                  <h6>Particulares Deudores - Cantidad</h6>
                  <Bar
                    data={getCantidadChartData()}
                    options={chartOptions("particular")}
                  />
                </Col>
              </Row>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Deudores;
