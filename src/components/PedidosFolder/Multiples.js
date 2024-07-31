import React, { useEffect, useState } from "react";
import { Container, Dropdown, DropdownButton, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getPedidosMultiples } from "../../api"; // Ajusta la ruta según sea necesario
import useAuth from "../../hooks/useAuth";

const Multiples = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const getToken = useAuth();
  const { pedido } = useSelector((state) => state.pedido);

  useEffect(() => {
    const fetchPedidosMultiples = async () => {
      const usuarioToken = getToken();
      try {
        const response = await getPedidosMultiples(pedido.id, usuarioToken);
        // Filtramos el pedido actual
        const filteredPedidos = response.data.filter(p => p.id !== pedido.id);
        setPedidos(filteredPedidos);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError("Error al obtener los pedidos múltiples");
        setLoading(false);
      }
    };

    if (pedido?.id) {
      fetchPedidosMultiples();
    }
  }, [pedido, getToken]);

  const handleNavigateToPedido = (pedido) => {
    navigate("/pedidos/datos", { state: { pedidoId: pedido.id } });
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container>
      <Row className="align-items-center">
        <Col md={12} className="d-flex justify-content-end">
          <DropdownButton id="dropdown-pedidos" title="Pedidos multiples" variant="light">
            {pedidos.length > 0 ? (
              pedidos.map((pedido) => (
                <Dropdown.Item key={pedido.id} onClick={() => handleNavigateToPedido(pedido)}>
                  Pedido {pedido.id} - {pedido.estado}
                </Dropdown.Item>
              ))
            ) : (
              <Dropdown.Item disabled>No hay pedidos disponibles</Dropdown.Item>
            )}
          </DropdownButton>
        </Col>
      </Row>
    </Container>
  );
};

export default Multiples;


