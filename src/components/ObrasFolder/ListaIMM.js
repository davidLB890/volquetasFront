import React, { useEffect, useState, useRef } from "react";
import { Table, Spinner, Alert, Container, Button, Form, Row, Col } from "react-bootstrap";
import { getObrasMeses } from "../../api";
import useAuth from "../../hooks/useAuth";
import * as XLSX from "xlsx";

const ListaIMM = () => {
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cantidadMeses, setCantidadMeses] = useState(4); // Default value
  const getToken = useAuth();
  const componentRef = useRef();

  useEffect(() => {
    const fetchObras = async () => {
      const usuarioToken = getToken();
      try {
        const response = await getObrasMeses(cantidadMeses, usuarioToken);
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
        "Detalle Residuos": obra.ObraDetalle?.detalleResiduos || "",
        "Res. Mezclados": obra.ObraDetalle?.residuosMezclados ? "Sí" : "No",
        "Res. Reciclados": obra.ObraDetalle?.residuosReciclados ? "Sí" : "No",
        Frecuencia:
          obra.ObraDetalle?.frecuenciaSemanal
            ?.map((frecuencia) => `${frecuencia.value} ${frecuencia.inclusive ? "(Inclusivo)" : "(Exclusivo)"}`)
            .join(", ") || "N/A",
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
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && (
        <>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formCantidadMeses">
                <Form.Label>Cantidad de Meses:</Form.Label>
                <Form.Control
                  type="number"
                  value={cantidadMeses}
                  onChange={handleMesesChange}
                  min="1"
                />
              </Form.Group>
            </Col>
            <Col md={6} className="d-flex justify-content-end align-items-end">
              <Button onClick={exportToExcel} className="mb-3">
                Exportar a Excel
              </Button>
            </Col>
          </Row>
          <div
            id="table-to-pdf"
            style={{
              maxHeight: "80vh", // Ajusta esta altura según tus necesidades
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
        </>
      )}
    </Container>
  );
};

export default ListaIMM;
