import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Table, Spinner, Alert, Row, Col, Form, Button, Card } from "react-bootstrap";
import { getFacturas, getParticularId, getEmpresaId } from "../../api";
import useAuth from "../../hooks/useAuth";
import moment from "moment";
import SelectEmpresaPorNombre from "../EmpresasFolder/SelectEmpresaPorNombre";
import SelectParticularPorNombre from "../ParticularesFolder/SelectParticularPorNombre";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import "jspdf-autotable";

const ListaFacturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fechaInicio, setFechaInicio] = useState(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [fechaFin, setFechaFin] = useState(
    moment().endOf("month").format("YYYY-MM-DD")
  );
  const [ultimo, setUltimo] = useState(10);
  const [estado, setEstado] = useState("");
  const [tipoCliente, setTipoCliente] = useState("");
  const [empresaId, setEmpresaId] = useState(null);
  const [empresaNombre, setEmpresaNombre] = useState("");
  const [particularId, setParticularId] = useState(null);
  const [particularNombre, setParticularNombre] = useState("");
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  const getToken = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!getToken()) {
      navigate("/");
    }
    fetchFacturas();
  }, []);

  const fetchFacturas = async () => {
    setLoading(true);
    const usuarioToken = getToken();
    try {
      const response = await getFacturas(
        fechaInicio,
        fechaFin,
        ultimo,
        empresaId,
        particularId,
        estado,
        usuarioToken
      );
      const facturasConNombre = await Promise.all(
        response.data.map(async (factura) => {
          let nombre = "";
          if (factura.particularId) {
            const particularResponse = await getParticularId(
              factura.particularId,
              usuarioToken
            );
            nombre = particularResponse.data.nombre;
          } else if (factura.empresaId) {
            const empresaResponse = await getEmpresaId(
              factura.empresaId,
              usuarioToken
            );
            nombre = empresaResponse.data.nombre;
          }
          return { ...factura, nombre };
        })
      );

      // Ordenar las facturas alfabéticamente por el nombre del cliente
      const facturasOrdenadas = facturasConNombre.sort((a, b) => {
        if (a.nombre < b.nombre) return -1;
        if (a.nombre > b.nombre) return 1;
        return 0;
      });

      setFacturas(facturasOrdenadas);
    } catch (error) {
      console.error("Error al obtener las facturas:", error);
      setError("Error al obtener las facturas");
    }
    setLoading(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    fetchFacturas();
  };

  const handleEmpresaSeleccionada = (id, nombre) => {
    setEmpresaId(id);
    setEmpresaNombre(nombre);
    setParticularId(null);
    setParticularNombre("");
  };

  const handleParticularSeleccionada = (id, nombre) => {
    setParticularId(id);
    setParticularNombre(nombre);
    setEmpresaId(null);
    setEmpresaNombre("");
  };

  const handleCancelarSeleccion = () => {
    setEmpresaId(null);
    setEmpresaNombre("");
    setParticularId(null);
    setParticularNombre("");
    setTipoCliente("");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Tipo",
      "Numeración",
      "Monto",
      "Nombre",
      "Fecha Creación",
      "Estado",
      "Fecha de Pago",
    ];
    const tableRows = [];

    facturas.forEach((factura) => {
      const facturaData = [
        factura.tipo,
        factura.numeracion,
        factura.monto,
        factura.nombre,
        moment(factura.createdAt).format("YYYY-MM-DD"),
        factura.estado,
        factura.fechaPago
          ? moment(factura.fechaPago).format("YYYY-MM-DD")
          : "No Pagado",
      ];
      tableRows.push(facturaData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("Lista de Facturas", 14, 15);
    const currentDate = moment().format("YYYY-MM-DD");
    doc.save(`lista_de_facturas(${currentDate}).pdf`);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      facturas.map(factura => ({
        Tipo: factura.tipo,
        Numeración: factura.numeracion,
        Monto: factura.monto,
        Nombre: factura.nombre,
        "Fecha Creación": moment(factura.createdAt).format("YYYY-MM-DD"),
        Estado: factura.estado,
        "Fecha de Pago": factura.fechaPago
          ? moment(factura.fechaPago).format("YYYY-MM-DD")
          : "No Pagado",
      }))
    );
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Facturas");
  
    const currentDate = moment().format("YYYY-MM-DD");
    XLSX.writeFile(wb, `lista_de_facturas(${currentDate}).xlsx`);
  };

  const handleRowClick = (factura) => {
    let idFactura = factura.id;
    navigate("/facturas/datos", { state: { facturaId: idFactura } });
  };

  return (
    <Container>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleFormSubmit} className="mb-3">
        <Row>
          <Col md={3}>
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
          <Col md={3}>
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
          <Col md={3}>
            <Form.Group controlId="ultimo">
              <Form.Label>Últimas</Form.Label>
              <Form.Control
                type="number"
                value={ultimo}
                onChange={(e) => setUltimo(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="estado">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="pagada">Pagada</option>
                <option value="pendiente">Pendiente</option>
                <option value="cancelada">Cancelada</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            {!empresaId && !particularId && (
              <Form.Group controlId="tipoCliente">
                <Form.Label>Buscar por</Form.Label>
                <Form.Control
                  as="select"
                  value={tipoCliente}
                  onChange={(e) => setTipoCliente(e.target.value)}
                >
                  <option value="">Seleccione...</option>
                  <option value="empresa">Empresa</option>
                  <option value="particular">Particular</option>
                </Form.Control>
              </Form.Group>
            )}
            {tipoCliente === "empresa" && !empresaId && (
              <SelectEmpresaPorNombre
                onSeleccionar={handleEmpresaSeleccionada}
              />
            )}
            {tipoCliente === "particular" && !particularId && (
              <SelectParticularPorNombre
                onSeleccionar={handleParticularSeleccionada}
              />
            )}
            {(empresaId || particularId) && (
              <div>
                <strong>
                  {empresaId
                    ? `Empresa: ${empresaNombre}`
                    : `Particular: ${particularNombre}`}
                </strong>
                <Button
                  variant="danger"
                  className="ml-3"
                  onClick={handleCancelarSeleccion}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </Col>
          <Col md={3} className="d-flex align-items-end">
            <Button type="submit" variant="primary" className="mt-4">
              Aplicar Filtros
            </Button>
          </Col>
        </Row>
      </Form>
      <Button 
        variant="success" 
        onClick={exportToPDF} 
        style={{ padding: "0.4rem 0.8rem", fontSize: "0.875rem" }} 
        className="mb-3 me-2"  // Agrega margen a la derecha para separar los botones
        disabled={facturas.length === 0}
      >
        Exportar a PDF
      </Button>
      <Button 
        variant="info" 
        style={{ padding: "0.4rem 0.8rem", fontSize: "0.875rem" }} 
        onClick={exportToExcel} 
        className="mb-3"
        disabled={facturas.length === 0}
      >
        Exportar a Excel
      </Button>
      {isSmallScreen ? (
        facturas.map((factura) => (
          <Card key={factura.id} className="mb-3">
            <Card.Body onClick={() => handleRowClick(factura)}>
              <Card.Title>{factura.tipo}</Card.Title>
              <Card.Text>
                <strong>Numeración:</strong> {factura.numeracion} <br />
                <strong>Monto:</strong> ${factura.monto} <br />
                <strong>Nombre:</strong> {factura.nombre} <br />
                <strong>Fecha creación:</strong>{" "}
                {moment(factura.createdAt).format("YYYY-MM-DD")} <br />
                <strong>Estado:</strong> {factura.estado} <br />
                <strong>Fecha Pago:</strong>{" "}
                {factura.fechaPago
                  ? moment(factura.fechaPago).format("YYYY-MM-DD")
                  : "No Pagado"}
              </Card.Text>
            </Card.Body>
          </Card>
        ))
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Numeración</th>
              <th>Monto</th>
              <th>Nombre</th>
              <th>Fecha creación</th>
              <th>Estado</th>
              <th>Fecha Pago</th>
            </tr>
          </thead>
          <tbody>
          {facturas.map((factura) => (
            <tr
              key={factura.id}
              onClick={() => handleRowClick(factura)}
              style={{
                backgroundColor: factura.estado === "anulada" 
                  ? "#ffcccc" 
                  : factura.estado === "pagada"
                  ? "#ccffcc" // Verde clarito
                  : "white",
              }}
            >
              <td>{factura.tipo}</td>
              <td>{factura.numeracion}</td>
              <td>{factura.monto}</td>
              <td>{factura.nombre}</td>
              <td>{moment(factura.createdAt).format("YYYY-MM-DD")}</td>
              <td>{factura.estado}</td>
              <td>
                {factura.fechaPago
                  ? moment(factura.fechaPago).format("YYYY-MM-DD")
                  : "No Pagado"}
              </td>
            </tr>
          ))}


          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ListaFacturas;
