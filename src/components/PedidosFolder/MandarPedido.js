import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { postPedidoNuevo, postPedidoMultiple, postPedidoEntregaLevante } from "../../api";
import useAuth from "../../hooks/useAuth";

const MandarPedido = ({ pedido, tipoPedido, onPedidoEnviado }) => {
  const [cantidad, setCantidad] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const getToken = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const usuarioToken = getToken();

    try {
      let response;
      if (tipoPedido === "simple") {
        response = await postPedidoNuevo(pedido, usuarioToken);
      } else if (tipoPedido === "multiple") {
        response = await postPedidoMultiple({ ...pedido, cantidad }, usuarioToken);
      } else if (tipoPedido === "entrega/levante") {
        response = await postPedidoEntregaLevante(pedido, usuarioToken);
      }

      setSuccess("Pedido enviado correctamente");
      onPedidoEnviado(response.data);

      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (error) {
      setError(error.response?.data?.error || "Error al enviar el pedido");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {tipoPedido === "multiple" && (
        <Form.Group controlId="formCantidad">
          <Form.Label>Cantidad</Form.Label>
          <Form.Control
            type="number"
            min="1"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />
        </Form.Group>
      )}

      <Button variant="primary" type="submit">
        Enviar Pedido
      </Button>
    </Form>
  );
};

export default MandarPedido;
