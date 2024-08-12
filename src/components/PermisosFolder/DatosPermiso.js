import React, { useEffect, useState } from "react";
import { Spinner, Alert, Container, Form, Row, Col, Table } from "react-bootstrap";
import { getPermisoIdFiltro, getPedidoId } from "../../api"; // Importar la función getPedidoById
import useAuth from "../../hooks/useAuth";
import moment from "moment";
import { useNavigate } from "react-router-dom"; // Importar useNavigate

const DatosPermiso = ({ permisoId }) => {
  const [permiso, setPermiso] = useState(null);
  const [pedidos, setPedidos] = useState([]); // Estado para almacenar los datos completos de los pedidos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fechaInicio, setFechaInicio] = useState(moment().startOf('month').format('YYYY-MM-DD'));
  const [fechaFin, setFechaFin] = useState(moment().endOf('month').format('YYYY-MM-DD'));
  const getToken = useAuth();
  const navigate = useNavigate(); // Usar useNavigate para redirigir

  useEffect(() => {
    const fetchPermisoYPedidos = async () => {
      const usuarioToken = getToken();
      try {
        // Obtener el permiso y sus pedidos asociados
        const permisoResponse = await getPermisoIdFiltro(permisoId, usuarioToken, { fechaInicio, fechaFin });
        setPermiso(permisoResponse.data);

        // Obtener la información completa de cada pedido
        const pedidosPromises = permisoResponse.data.Pedidos.map((pedido) =>
          getPedidoId(pedido.id, usuarioToken)
        );
        const pedidosResponses = await Promise.all(pedidosPromises);

        // Guardar los pedidos en el estado
        setPedidos(pedidosResponses.map(response => response.data));
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los datos:", error.response?.data?.error || error.message);
        setError("Error al obtener los datos");
        setLoading(false);
      }
    };

    fetchPermisoYPedidos();
  }, [permisoId, fechaInicio, fechaFin, getToken]);

  const handleNavigateToPedido = (pedidoId) => {
    navigate('/pedidos/datos', {
      state: { pedidoId },
    });
  };

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
      <h3>Datos del Permiso y Pedidos donde se usa</h3>
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
        </Row>
      </Form>
      {permiso && (
        <div className="mt-3">
          <p><strong>ID:</strong> {permiso.id}</p>
          <p><strong>Fecha de Creación:</strong> {moment(permiso.fechaCreacion).format("YYYY-MM-DD")}</p>
          <p><strong>Fecha de Vencimiento:</strong> {moment(permiso.fechaVencimiento).format("YYYY-MM-DD")}</p>
          {pedidos.length > 0 ? (
            <Table striped bordered hover className="mt-3">
              <thead>
                <tr>
                  <th>Calle del Pedido</th>
                  <th>Fecha de Creación</th>
                  <th>Fecha de Vencimiento</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.id} onClick={() => handleNavigateToPedido(pedido.id)} style={{ cursor: 'pointer' }}>
                    <td>{pedido.Obra?.calle || "Calle no disponible"}</td>
                    <td>{moment(pedido.createdAt).format("YYYY-MM-DD")}</td>
                    <td>{moment(pedido.fechaVencimiento).format("YYYY-MM-DD")}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No hay pedidos asociados a este permiso en ese rango de fechas.</p>
          )}
        </div>
      )}
    </Container>
  );
};

export default DatosPermiso;
