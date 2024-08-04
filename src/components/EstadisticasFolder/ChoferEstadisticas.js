import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Container,
  Button,
  Spinner,
  Alert,
  Modal,
  Form,
  Row,
  Col,
  Table,
} from "react-bootstrap";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { getChoferEstadisticas } from "../../api";

const ChoferEstadisticas = () => {
  const [choferId, setChoferId] = useState("");
  const [choferNombre, setChoferNombre] = useState("");
  const [choferEstadisticas, setChoferEstadisticas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [fechaInicio, setFechaInicio] = useState(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [fechaFin, setFechaFin] = useState(
    moment().endOf("month").format("YYYY-MM-DD")
  );
  const [valorJornal, setValorJornal] = useState(0);
  const [valorExtra, setValorExtra] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const getToken = useAuth();
  const navigate = useNavigate();

  const empleados = useSelector((state) => state.empleados.empleados || []);
  const choferes = empleados.filter(
    (empleado) => empleado.rol === "chofer" && empleado.habilitado
  );

  const fetchChoferEstadisticas = async (
    fechaInicio,
    fechaFin,
    valorJornal,
    valorExtra
  ) => {
    const usuarioToken = getToken();
    try {
      const response = await getChoferEstadisticas(
        choferId,
        fechaInicio,
        fechaFin,
        valorJornal,
        valorExtra,
        usuarioToken
      );
      setChoferEstadisticas(response.data);
      setLoading(false);
      setError("");
    } catch (error) {
      setError("Error al obtener las estadísticas del chofer");
      setLoading(false);
    }
  };

  const handleSeleccionChofer = (event) => {
    const id = event.target.value;
    const nombre = choferes.find((chofer) => chofer.id === id)?.nombre || "";
    setChoferId(id);
    setChoferNombre(nombre);
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchChoferEstadisticas(fechaInicio, fechaFin, valorJornal, valorExtra);
  };

  return (
    <Container>
      <Button variant="link" onClick={handleShowModal} className="btn bg-gradient-default">
        <h5>Chofer</h5>
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
          <Modal.Title>Estadísticas del Chofer {choferNombre ? choferNombre : ""}</Modal.Title>
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
            <Row>
              <Col md={4}>
                <Form.Group controlId="valorJornal">
                  <Form.Label>Valor Jornal</Form.Label>
                  <Form.Control
                    type="number"
                    value={valorJornal}
                    onChange={(e) => setValorJornal(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="valorExtra">
                  <Form.Label>Valor Extra</Form.Label>
                  <Form.Control
                    type="number"
                    value={valorExtra}
                    onChange={(e) => setValorExtra(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="choferId">
                  <Form.Label>Chofer</Form.Label>
                  <Form.Control
                    as="select"
                    value={choferId}
                    onChange={handleSeleccionChofer}
                    required
                  >
                    <option value="">Seleccionar chofer</option>
                    {choferes.map((chofer) => (
                      <option key={chofer.id} value={chofer.id}>
                        {chofer.nombre}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit">
              Aplicar
            </Button>
          </Form>
          {!loading && choferEstadisticas && (
            <>
              <div style={{ overflowX: "auto" }}>
                <Table striped bordered hover className="mt-3">
                  <thead>
                    <tr>
                      <th>Día</th>
                      <th>Tipo</th>
                      <th>Horas</th>
                      <th>Extra</th>
                      <th>Entregas</th>
                      <th>Levantes</th>
                      <th>Viajes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {choferEstadisticas.jornales.map((jornal, index) => (
                      <tr key={index}>
                        <td>{jornal.jornal.dia}</td>
                        <td>{jornal.jornal.tipo}</td>
                        <td>{jornal.jornal.horas}</td>
                        <td>{jornal.jornal.extra}</td>
                        <td>{jornal.viajes.entregas}</td>
                        <td>{jornal.viajes.levantes}</td>
                        <td>{jornal.viajes.viajes}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div>
                <h3>Resumen</h3>
                <Row>
                  <Col md={6}>
                    <p><strong>Días de trabajo:</strong> {choferEstadisticas.datos.diasTrabajo}</p>
                    <p><strong>Horas totales:</strong> {choferEstadisticas.datos.horas}</p>
                    <p><strong>Horas extra:</strong> {choferEstadisticas.datos.extra}</p>
                    <p><strong>Entregas:</strong> {choferEstadisticas.datos.entregas}</p>
                    <p><strong>Levantes:</strong> {choferEstadisticas.datos.levantes}</p>
                    <p><strong>Viajes:</strong> {choferEstadisticas.datos.viajes}</p>
                  </Col>
                  <Col md={6}>
                    <p>
                      <strong>Promedio de horas por día:</strong> {" "}
                      {choferEstadisticas.datos.promedioHorasPorDia}
                    </p>
                    <p>
                      <strong>Promedio de viajes por día:</strong> {" "}
                      {choferEstadisticas.datos.promedioViajesPorDia}
                    </p>
                    <p><strong>Salario:</strong> {choferEstadisticas.datos.salario}</p>
                    <p><strong>Info:</strong> {choferEstadisticas.datos.info}</p>
                  </Col>
                </Row>
              </div>
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

export default ChoferEstadisticas;
