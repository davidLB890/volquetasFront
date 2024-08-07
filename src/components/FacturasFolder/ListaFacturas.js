import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Table,
  Spinner,
  Alert,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";
import { getFacturas, getParticularId, getEmpresaId } from "../../api";
import useAuth from "../../hooks/useAuth";
import moment from "moment";
import BuscarEmpresaPorNombre from "../EmpresasFolder/BuscarEmpresaPorNombre";
import BuscarParticularPorNombre from "../ParticularesFolder/BuscarParticularPorNombre";
import jsPDF from "jspdf";
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
  const getToken = useAuth();

    const navigate = useNavigate();

  useEffect(() => {
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
      setFacturas(facturasConNombre);
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
      "Creado En",
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
        factura.fechaPago
          ? moment(factura.fechaPago).format("YYYY-MM-DD")
          : "No Pagado",
      ];
      tableRows.push(facturaData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("Lista de Facturas", 14, 15);
    doc.save("lista_de_facturas.pdf");
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
              <BuscarEmpresaPorNombre
                onSeleccionar={handleEmpresaSeleccionada}
              />
            )}
            {tipoCliente === "particular" && !particularId && (
              <BuscarParticularPorNombre
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
            <Button type="submit" variant="primary">
              Buscar
            </Button>
          </Col>
        </Row>
      </Form>
      <Button variant="success" onClick={exportToPDF} className="mb-3">
        Exportar a PDF
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Factura</th>
            <th>Numeración</th>
            <th>Monto</th>
            <th>Nombre</th>
            <th>Fecha creación</th>
            <th>Fecha Pago</th>
          </tr>
        </thead>
        <tbody>
          {facturas.map((factura) => (
            <tr key={factura.id}
            onClick={() => handleRowClick(factura)}>
              <td>{factura.tipo}</td>
              <td>{factura.numeracion}</td>
              <td>{factura.monto}</td>
              <td>{factura.nombre}</td>
              <td>{moment(factura.createdAt).format("YYYY-MM-DD")}</td>
              <td>
                {factura.fechaPago
                  ? moment(factura.fechaPago).format("YYYY-MM-DD")
                  : "No Pagado"}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ListaFacturas;
