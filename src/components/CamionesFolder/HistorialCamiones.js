import React, { useState, useEffect } from "react";
import {
  getHistoricoCamionActual,
  getHistoricoChofer,
  getHistoricoCamion,
  obtenerEmpleados,
  getCamiones,
} from "../../api";
import { Container, Row, Col, Form, Table, Alert } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const HistorialCamiones = () => {
  const [camiones, setCamiones] = useState([]);
  const [choferes, setChoferes] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [error, setError] = useState("");
  const [selectedCamion, setSelectedCamion] = useState("");
  const [selectedChofer, setSelectedChofer] = useState("");
  const navigate = useNavigate();

  const getToken = useAuth();

  useEffect(() => {
    const fetchDatos = async () => {
      const usuarioToken = getToken();
      if(!usuarioToken){
        navigate("/");
      }
      try {
        const responseCamiones = await getCamiones(usuarioToken);
        const responseChoferes = await obtenerEmpleados(usuarioToken);
        const datosCamion = responseCamiones.data;
        const datosChofer = responseChoferes.data.filter(
          (empleado) => empleado.rol === "chofer"
        );

        const listaCamiones = [
          ...new Map(datosCamion.map((item) => [item.id, item])).values(),
        ];
        const listaChoferes = [
          ...new Map(datosChofer.map((item) => [item.id, item])).values(),
        ];

        setCamiones(listaCamiones);
        setChoferes(listaChoferes);
      } catch (error) {
        console.error("Error al obtener los datos del historial:", error);
        setError("Error al obtener los datos del historial.");
      }
    };
    fetchDatos();
  }, [getToken]);

  const handleCamionChange = async (e) => {
    setSelectedCamion(e.target.value);
    setSelectedChofer("");
    const usuarioToken = getToken();
    if (e.target.value) {
      try {
        const response = await getHistoricoCamion(e.target.value, usuarioToken);
        const datos = response.data;
        setHistorial(datos);
      } catch (error) {
        console.error("Error al obtener el historial del camión:", error);
        setError("Error al obtener el historial del camión.");
      }
    }
  };

  const handleChoferChange = async (e) => {
    setSelectedChofer(e.target.value);
    setSelectedCamion("");
    const usuarioToken = getToken();
    if(e.target.value){
      try {
        const response = await getHistoricoChofer(e.target.value, usuarioToken);
        const datos = response.data;
        setHistorial(datos);
      } catch (error) {
        console.error("Error al obtener el historial del chofer:", error);
        setError("Error al obtener el historial del chofer.");
      }
    }
  };
  

  const isActual = (record) => !record.fechaFin;

  return (
    <Container className="card">
      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>
              Seleccione un camión para ver su historial de choferes
            </Form.Label>
            <Form.Control
              as="select"
              value={selectedCamion}
              onChange={handleCamionChange}
            >
              <option value="">Seleccione un camión</option>
              {camiones.map((camion) => (
                <option key={camion.id} value={camion.id}>
                  {camion.matricula}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>
              Seleccione un chofer para ver su historial de camiones
            </Form.Label>
            <Form.Control
              as="select"
              value={selectedChofer}
              onChange={handleChoferChange}
            >
              <option value="">Seleccione un chofer</option>
              {choferes.map((chofer) => (
                <option key={chofer.id} value={chofer.id}>
                  {chofer.nombre}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      {error && <Alert variant="danger">{error}</Alert>}
      {historial.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Chofer</th>
              <th>Camión</th>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((record, index) => (
              <tr
                key={record.id}
                className={isActual(record) ? "table-success" : ""}
              >
                <td>{index + 1}</td>
                <td>{record.Empleado ? record.Empleado.nombre : "N/A"}</td>
                <td>{record.Camione ? record.Camione.matricula : "N/A"}</td>
                <td>{new Date(record.fechaInicio).toLocaleDateString()}</td>
                <td>
                  {record.fechaFin
                    ? new Date(record.fechaFin).toLocaleDateString()
                    : "Actual"}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default HistorialCamiones;
