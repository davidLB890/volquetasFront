import React, { useEffect, useState, useRef } from "react";
import { Table, Spinner, Alert, Container, Button, Form, Row, Col, Card } from "react-bootstrap";
import { getObrasMeses } from "../../api";
import useAuth from "../../hooks/useAuth";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

const ListaIMM = () => {
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cantidadMeses, setCantidadMeses] = useState(4); // Default value
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  const getToken = useAuth();
  const componentRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioToken = getToken();
    if (!usuarioToken) {
      navigate("/");
    }
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchObras = async () => {
      const usuarioToken = getToken();
      try {
        const response = await getObrasMeses(cantidadMeses, usuarioToken);
        // Ordenar las obras por el nombre de la empresa antes de almacenarlas en el estado
      const sortedObras = response.data.sort((a, b) => {
        const nombreA = a.empresa?.nombre?.toLowerCase() || "";
        const nombreB = b.empresa?.nombre?.toLowerCase() || "";
        return nombreA.localeCompare(nombreB);
      });
      
        setObras(response.data);
      } catch (error) {
        setError("Error al obtener las obras");
      }
      setLoading(false);
    };

    fetchObras();
  }, [cantidadMeses, getToken]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      obras.map((obra) => ({
        Empresa: obra.empresa?.nombre || "N/A",
        Dirección: `${obra.calle}, ${obra.esquina}, ${obra.barrio}`,
        // Teléfono: obra.empresa?.telefono || "N/A",
        Rut: obra.empresa?.rut || "N/A",
        "Detalle Residuos": obra.ObraDetalle?.detalleResiduos || "",
        "Res. Mezclados": obra.ObraDetalle?.residuosMezclados ? "Sí" : "No",
        "Res. Reciclados": obra.ObraDetalle?.residuosReciclados ? "Sí" : "No",
        Frecuencia:
          obra.ObraDetalle?.frecuenciaSemanal
            ?.map((frecuencia) => `${frecuencia.value}`)
            .join(" A ") || "N/A",
        "Destino Final": obra.ObraDetalle?.destinoFinal || "",
        Días: obra.ObraDetalle?.dias || "",
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Obras");
    XLSX.writeFile(wb, "obras.xlsx");
  };

  const handleMesesChange = (e) => {
    setCantidadMeses(Number(e.target.value));
  };

  return (
    <Container>
      <h1>Lista de Obras para la IMM</h1>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && (
        <>
          <Row className="mb-3">
            <Col md={6}>


              <Form.Group controlId="formCantidadMeses">
                <Form.Label>
                  Cargar obras que tengan pedidos en los últimos{" "}
                  <Form.Control
                    as="select"
                    value={cantidadMeses}
                    onChange={handleMesesChange}
                    style={{ display: "inline-block", width: "auto", marginLeft: "5px", marginRight: "5px" }}
                  >
                    {[1, 3, 4, 6, 12, 24].map((meses) => (
                      <option key={meses} value={meses}>
                        {meses}
                      </option>
                    ))}
                  </Form.Control>
                  {" "}meses:
                </Form.Label>
              </Form.Group>
            </Col>
            <Col md={6} className="d-flex justify-content-end align-items-end">
              <Button onClick={exportToExcel} className="mb-3">
                Exportar a Excel
              </Button>
            </Col>
          </Row>

          {isSmallScreen ? (
            obras.map((obra) => (
              <Card key={obra.id} className="mb-3">
                <Card.Body>
                  <Card.Title>{obra.empresa?.nombre || "N/A"}</Card.Title>
                  <Card.Text>
                    <strong>Dirección:</strong> {obra.calle}, {obra.esquina}, {obra.barrio} <br />
                    <strong>Rut:</strong> {obra.empresa?.rut || "N/A"} <br />
                    <strong>Detalle Residuos:</strong> {obra.ObraDetalle?.detalleResiduos || ""} <br />
                    <strong>Res. Mezclados:</strong> {obra.ObraDetalle?.residuosMezclados ? "Sí" : "No"} <br />
                    <strong>Res. Reciclados:</strong> {obra.ObraDetalle?.residuosReciclados ? "Sí" : "No"} <br />
                    <strong>Frecuencia:</strong>{" "}
                    {obra.ObraDetalle?.frecuenciaSemanal?.map((frecuencia, index) => (
                      <span key={index}>
                        {frecuencia.value}{" "}
                        {index < obra.ObraDetalle.frecuenciaSemanal.length - 1 ? " A " : ""}
                      </span>
                    )) || "N/A"}{" "}
                    <br />
                    <strong>Destino Final:</strong> {obra.ObraDetalle?.destinoFinal || ""} <br />
                    <strong>Días:</strong> {obra.ObraDetalle?.dias || ""} <br />
                  </Card.Text>
                </Card.Body>
              </Card>
            ))
          ) : (
            <div
              id="table-to-pdf"
              style={{
                maxHeight: "80vh",
                overflowY: "auto",
                overflowX: "auto",
              }}
            >
              <Table
                striped
                bordered
                hover
                ref={componentRef}
                style={{ display: "block", width: "100%", whiteSpace: "nowrap" }}
              >
                <thead>
                  <tr>
                    <th>Empresa</th>
                    <th>Dirección</th>
                    {/* <th>Teléfono</th> */}
                    <th>Rut</th>
                    <th>Detalle Residuos</th>
                    <th>Res. Mezclados</th>
                    <th>Res. Reciclados</th>
                    <th>Frecuencia</th>
                    <th>Destino Final</th>
                    <th>Días</th>
                  </tr>
                </thead>
                <tbody>
                  {obras.map((obra) => (
                    <tr key={obra.id}>
                      <td>{obra.empresa?.nombre || "N/A"}</td>
                      <td>
                        {obra.calle}, {obra.esquina}, {obra.barrio}
                      </td>
                      {/* <td>{obra.empresa?.telefono || "N/A"}</td> */}
                      <td>{obra.empresa?.rut || "N/A"}</td>
                      <td>{obra.ObraDetalle?.detalleResiduos || ""}</td>
                      <td>{obra.ObraDetalle?.residuosMezclados ? "Sí" : "No"}</td>
                      <td>{obra.ObraDetalle?.residuosReciclados ? "Sí" : "No"}</td>
                      <td>
                        {obra.ObraDetalle?.frecuenciaSemanal?.map((frecuencia, index) => (
                          <span key={index}>
                            {frecuencia.value} {index < obra.ObraDetalle.frecuenciaSemanal.length - 1 ? " A " : ""}
                          </span>
                        )) || "N/A"}
                      </td>
                      <td>{obra.ObraDetalle?.destinoFinal || ""}</td>
                      <td>{obra.ObraDetalle?.dias || ""}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default ListaIMM;
