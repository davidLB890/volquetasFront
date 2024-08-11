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
  const [topEmpresasNoPagados, setTopEmpresasNoPagados] = useState([]);
  const [topParticularesNoPagados, setTopParticularesNoPagados] = useState([]);
  const [empresaNombres, setEmpresaNombres] = useState({});
  const [particularNombres, setParticularNombres] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [fechaInicio, setFechaInicio] = useState(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [fechaFin, setFechaFin] = useState(
    moment().endOf("month").format("YYYY-MM-DD")
  );
  const [tipo, setTipo] = useState("cantidad");
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

  const fetchDeudores = async (fechaInicio, fechaFin, tipo, deudores) => {
    const usuarioToken = getToken();
    try {
      const response = await getDeudoresEstadisticas(
        fechaInicio,
        fechaFin,
        tipo,
        deudores,
        usuarioToken
      );
      setTopEmpresasNoPagados(response.data.topEmpresasNoPagados);
      setTopParticularesNoPagados(response.data.topParticularesNoPagados);
      await fetchNombres(
        response.data.topEmpresasNoPagados,
        response.data.topParticularesNoPagados
      );
      setLoading(false);
    } catch (error) {
      setError("Error al obtener los deudores");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeudores(fechaInicio, fechaFin, tipo, deudores);
  }, [getToken]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchDeudores(fechaInicio, fechaFin, tipo, deudores);
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
        handleEmpresaClick(topEmpresasNoPagados[index].id);
      } else {
        handleParticularClick(topParticularesNoPagados[index].id);
      }
    }
  };

  const getEmpresaChartData = () => {
    return {
      labels: topEmpresasNoPagados.map((empresa) => empresaNombres[empresa.id]),
      datasets: [
        {
          label: "Monto adeudado",
          data: topEmpresasNoPagados.map((empresa) => empresa.monto),
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const getParticularChartData = () => {
    return {
      labels: topParticularesNoPagados.map(
        (particular) => particularNombres[particular.id]
      ),
      datasets: [
        {
          label: "Monto adeudado",
          data: topParticularesNoPagados.map((particular) => particular.monto),
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
              cantidad = topEmpresasNoPagados[index].cantidad;
            } else {
              cantidad = topParticularesNoPagados[index].cantidad;
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
                <Col md={6}>
                  <Form.Group controlId="tipo">
                    <Form.Label>Tipo</Form.Label>
                    <Form.Control
                      as="select"
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value)}
                      required
                    >
                      <option value="cantidad">Cantidad</option>
                      <option value="monto">Monto</option>
                    </Form.Control>
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
                <Col md={12}>
                  <h6>Empresas Deudoras</h6>
                  <Bar
                    data={getEmpresaChartData()}
                    options={chartOptions("empresa")}
                  />
                </Col>
                <Col md={12}>
                  <h6>Particulares Deudores</h6>
                  <Bar
                    data={getParticularChartData()}
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
