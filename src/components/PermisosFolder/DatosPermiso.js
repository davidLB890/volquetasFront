import React, { useEffect, useState } from "react";
import { Spinner, Alert, Container, Form, Button, Row, Col, Table } from "react-bootstrap";
import { getPermisoIdFiltro } from "../../api"; // Ajusta la ruta según sea necesario
import useAuth from "../../hooks/useAuth";
import moment from "moment";

const DatosPermiso = ({ permisoId }) => {
  const [permiso, setPermiso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fechaInicio, setFechaInicio] = useState(moment().startOf('month').format('YYYY-MM-DD'));
  const [fechaFin, setFechaFin] = useState(moment().endOf('month').format('YYYY-MM-DD'));
  const getToken = useAuth();

  useEffect(() => {
    const fetchPermiso = async () => {
      const usuarioToken = getToken();
      try {
        const response = await getPermisoIdFiltro(permisoId, usuarioToken, { fechaInicio, fechaFin });
        setPermiso(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener el permiso:", error.response?.data?.error || error.message);
        setError("Error al obtener el permiso");
        setLoading(false);
      }
    };

    fetchPermiso();
  }, [permisoId, fechaInicio, fechaFin, getToken]);

  const handleFilter = (e) => {
    e.preventDefault();
    setLoading(true);
    setPermiso(null);
    setError("");
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container>
      <h3>Datos del Permiso</h3>
      <Form onSubmit={handleFilter}>
        <Row>
          <Col>
            <Form.Group controlId="fechaInicio">
              <Form.Label>Fecha Inicio</Form.Label>
              <Form.Control
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="fechaFin">
              <Form.Label>Fecha Fin</Form.Label>
              <Form.Control
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col className="d-flex align-items-end">
            <Button variant="primary" type="submit">
              Filtrar
            </Button>
          </Col>
        </Row>
      </Form>
      {permiso && (
        <div className="mt-3">
          <p><strong>ID:</strong> {permiso.id}</p>
          <p><strong>Fecha de Creación:</strong> {moment(permiso.fechaCreacion).format("YYYY-MM-DD")}</p>
          <p><strong>Fecha de Vencimiento:</strong> {moment(permiso.fechaVencimiento).format("YYYY-MM-DD")}</p>
          {permiso.Pedidos && permiso.Pedidos.length > 0 ? (
            <Table striped bordered hover className="mt-3">
              <thead>
                <tr>
                  <th>ID Pedido</th>
                  <th>Fecha de Creación</th>
                  <th>Fecha de Vencimiento</th>
                </tr>
              </thead>
              <tbody>
                <strong>Pedidos donde se usa este permiso:</strong>
                {permiso.Pedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td>{pedido.id}</td>
                    <td>{moment(pedido.fechaCreacion).format("YYYY-MM-DD")}</td>
                    <td>{moment(pedido.fechaVencimiento).format("YYYY-MM-DD")}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No hay pedidos asociados a este permiso.</p>
          )}
        </div>
      )}
    </Container>
  );
};

export default DatosPermiso;
