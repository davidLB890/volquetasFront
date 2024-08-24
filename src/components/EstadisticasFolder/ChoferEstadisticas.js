import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Container, Button, Spinner, Alert, Card, Form, Row,Col, Table } from "react-bootstrap";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { getChoferEstadisticas } from "../../api";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import "jspdf-autotable";

const ChoferEstadisticas = () => {
  const [choferId, setChoferId] = useState("");
  const [choferNombre, setChoferNombre] = useState("");
  const [choferEstadisticas, setChoferEstadisticas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  useEffect(() => {
    if (!getToken()) {
      navigate("/login");
    }
  }, [getToken, navigate]);

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
    if(valorExtra === 0 || valorJornal === 0) {
      setError("Los valores de jornal y extra no pueden ser 0");
      setLoading(false);
      return;
    }else if(valorExtra > 10000000 || valorJornal > 10000000) {
      setError("Los valores de jornal y extra no pueden ser tan grandes");
      setLoading(false);
      return;
    }
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
    console.log(id)
    const nombre = id ? choferes.find((chofer) => chofer.id === Number(id))?.nombre || "" : "";
    console.log(nombre)
    console.log(choferes)
    setChoferId(id);
    setChoferNombre(nombre);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchChoferEstadisticas(fechaInicio, fechaFin, valorJornal, valorExtra);
  };

  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      choferEstadisticas.jornales.map((jornal) => ({
        Día: jornal.jornal.dia,
        Tipo: jornal.jornal.tipo,
        Horas: jornal.jornal.horas,
        Extra: jornal.jornal.extra,
        Entregas: jornal.viajes.entregas,
        Levantes: jornal.viajes.levantes,
        Viajes: jornal.viajes.viajes,
      }))
    );
  
    // Agregar el resumen al final de la hoja
    const resumen = [
      [],
      ["Resumen"],
      ["Días de trabajo:", choferEstadisticas.datos.diasTrabajo],
      ["Horas totales:", choferEstadisticas.datos.horas],
      ["Horas extra:", choferEstadisticas.datos.extra],
      ["Entregas:", choferEstadisticas.datos.entregas],
      ["Levantes:", choferEstadisticas.datos.levantes],
      ["Viajes:", choferEstadisticas.datos.viajes],
      ["Promedio de horas por día:", choferEstadisticas.datos.promedioHorasPorDia],
      ["Promedio de viajes por día:", choferEstadisticas.datos.promedioViajesPorDia],
      ["Salario:", choferEstadisticas.datos.salario],
      ["Info:", choferEstadisticas.datos.info],
    ];
  
    XLSX.utils.sheet_add_aoa(ws, resumen, { origin: -1 }); // Agrega el resumen al final
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Estadísticas Chofer");
    XLSX.writeFile(wb, `Chofer_${choferNombre}_Estadisticas.xlsx`);
  };
  
  
  const exportarPDF = () => {
    const doc = new jsPDF();
    
    // Cambia el texto del título, agregando el nombre del chofer
    doc.text(`Reporte del Chofer: ${choferNombre}`, 20, 10);
    console.log("chofer", choferNombre);
  
    // Agregar la tabla de estadísticas
    doc.autoTable({
      head: [["Día", "Tipo", "Horas", "Extra", "Entregas", "Levantes", "Viajes"]],
      body: choferEstadisticas.jornales.map((jornal) => [
        jornal.jornal.dia,
        jornal.jornal.tipo,
        jornal.jornal.horas,
        jornal.jornal.extra,
        jornal.viajes.entregas,
        jornal.viajes.levantes,
        jornal.viajes.viajes,
      ]),
      startY: 20,
    });
  
    // Agregar el resumen al final del PDF
    const startY = doc.autoTable.previous.finalY + 10; // Espacio después de la tabla
    doc.text("Resumen", 20, startY);
    doc.autoTable({
      body: [
        ["Días de trabajo:", choferEstadisticas.datos.diasTrabajo],
        ["Horas totales:", choferEstadisticas.datos.horas],
        ["Horas extra:", choferEstadisticas.datos.extra],
        ["Entregas:", choferEstadisticas.datos.entregas],
        ["Levantes:", choferEstadisticas.datos.levantes],
        ["Viajes:", choferEstadisticas.datos.viajes],
        ["Promedio de horas por día:", choferEstadisticas.datos.promedioHorasPorDia],
        ["Promedio de viajes por día:", choferEstadisticas.datos.promedioViajesPorDia],
        ["Salario:", choferEstadisticas.datos.salario],
        ["Info:", choferEstadisticas.datos.info],
      ],
      startY: startY + 10,
      theme: "plain", // Sin estilo adicional
      margin: { left: 20 }, // Alineado a la izquierda
    });
  
    doc.save(`Chofer_${choferNombre}_Estadisticas.pdf`);
  };

  return (
    <Container>
      {loading && <Spinner animation="border" />}

       <Card>
        <Card.Header closeButton>
          <h1>Reporte de Chofer {choferNombre ? choferNombre : ""}</h1>
        </Card.Header>
        <Card.Body>
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
            <Button variant="success" onClick={exportarExcel} className="mr-2">
              Exportar a Excel
            </Button>
            <Button variant="danger" onClick={exportarPDF}>
              Exportar a PDF
            </Button>
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
        </Card.Body>

      </Card>
    </Container>
  );
};

export default ChoferEstadisticas;
