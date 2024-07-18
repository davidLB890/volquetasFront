import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Spinner, Alert, Form, Container, Row, Col } from "react-bootstrap";
import { getPedidoId } from "../../api"; // Asegúrate de tener esta función en api.js
import useAuth from "../../hooks/useAuth";

const DatosPedido = () => {
  const { pedidoId } = useParams();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const getToken = useAuth();

  useEffect(() => {
    const fetchPedido = async () => {
      const usuarioToken = getToken();
      try {
        const response = await getPedidoId(pedidoId, usuarioToken);
        setPedido(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener el pedido:", error.response?.data?.error || error.message);
        setError("Error al obtener el pedido");
        setLoading(false);
      }
    };

    fetchPedido();
  }, [pedidoId, getToken]);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!pedido) {
    return <Alert variant="info">Pedido no encontrado</Alert>;
  }

  return (
    <Container>
      <h1>Detalles del Pedido</h1>
      <Row>
        <Col>
          <p><strong>Estado:</strong> {pedido.estado}</p>
          <p><strong>Descripción:</strong> {pedido.descripcion}</p>
          <p><strong>Creado Como:</strong> {pedido.creadoComo}</p>
          <p>
            <strong>Cliente:</strong>{" "}
            {pedido.Obra.particular ? (
              <Link to={`/particulares/${pedido.Obra.particular.id}`}>
                {pedido.Obra.particular.nombre}
              </Link>
            ) : (
              <Link to={`/empresas/${pedido.Obra.empresa.id}`}>
                {pedido.Obra.empresa.nombre}
              </Link>
            )}
          </p>
          <p>
            <strong>Obra:</strong>{" "}
            <Link to={`/obras/${pedido.Obra.id}`}>
              {pedido.Obra.descripcion}
            </Link>
          </p>
          <p><strong>Horario Sugerido:</strong> {new Date(pedido.Sugerencias[0].horarioSugerido).toLocaleString()}</p>
          <Form.Group controlId="formPago">
            <Form.Check
              type="checkbox"
              label="Pago"
              checked={pedido.pagoPedido.pagado}
              readOnly
            />
          </Form.Group>
        </Col>
      </Row>
    </Container>
  );
};

export default DatosPedido;
