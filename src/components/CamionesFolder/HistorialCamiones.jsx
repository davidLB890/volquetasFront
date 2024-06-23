import React, { useState, useEffect } from "react";
import { getHistoricoCamion, getHistoricoCamionEmpleado } from "../../api";
import { Container, Row, Col, Form, Table, Alert } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";

const HistorialCamiones = () => {
  const [camiones, setCamiones] = useState([]);
  const [choferes, setChoferes] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [error, setError] = useState('');
  const [selectedCamion, setSelectedCamion] = useState('');
  const [selectedChofer, setSelectedChofer] = useState('');

  const getToken = useAuth();

  useEffect(() => {
    const fetchDatos = async () => {
      const usuarioToken = getToken();
      try {
        const response = await getHistoricoCamion(usuarioToken);
        const datos = response.data;

        const uniqueCamiones = [...new Map(datos.map(item => [item.Camione.id, item.Camione])).values()];
        const uniqueChoferes = [...new Map(datos.map(item => [item.Empleado.id, item.Empleado])).values()];

        setCamiones(uniqueCamiones);
        setChoferes(uniqueChoferes);
      } catch (error) {
        console.error("Error al obtener los datos del historial:", error);
        setError('Error al obtener los datos del historial.');
      }
    };
    fetchDatos();
  }, [getToken]);

  const handleCamionChange = async (e) => {
    setSelectedCamion(e.target.value);
    setSelectedChofer('');
    const usuarioToken = getToken();
    try {
      const response = await getHistoricoCamion(usuarioToken);
      const datos = response.data.filter(d => d.camionId === parseInt(e.target.value));
      setHistorial(datos);
    } catch (error) {
      console.error("Error al obtener el historial del camión:", error);
      setError('Error al obtener el historial del camión.');
    }
  };

  const handleChoferChange = async (e) => {
    setSelectedChofer(e.target.value);
    setSelectedCamion('');
    const usuarioToken = getToken();
    try {
      const response = await getHistoricoCamionEmpleado(e.target.value, usuarioToken);
      const datos = response.data;
      setHistorial(datos);
    } catch (error) {
      console.error("Error al obtener el historial del chofer:", error);
      setError('Error al obtener el historial del chofer.');
    }
  };

  const isActual = (record) => !record.fechaFin;

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Seleccionar Camión</Form.Label>
            <Form.Control as="select" value={selectedCamion} onChange={handleCamionChange}>
              <option value="">Seleccione un camión</option>
              {camiones.map(camion => (
                <option key={camion.id} value={camion.id}>{camion.matricula}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Seleccionar Chofer</Form.Label>
            <Form.Control as="select" value={selectedChofer} onChange={handleChoferChange}>
              <option value="">Seleccione un chofer</option>
              {choferes.map(chofer => (
                <option key={chofer.id} value={chofer.id}>{chofer.nombre}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      {error && <Alert variant="danger">{error}</Alert>}
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
            <tr key={record.id} className={isActual(record) ? 'table-success' : ''}>
              <td>{index + 1}</td>
              <td>{record.Empleado.nombre}</td>
              <td>{record.Camione.matricula}</td>
              <td>{new Date(record.fechaInicio).toLocaleDateString()}</td>
              <td>{record.fechaFin ? new Date(record.fechaFin).toLocaleDateString() : 'Actual'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default HistorialCamiones;


