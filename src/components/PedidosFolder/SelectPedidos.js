import React, { useState, useEffect } from "react";
import { Form, Spinner, Alert } from "react-bootstrap";
import { getPedidosFiltro } from "../../api";
import useAuth from "../../hooks/useAuth";
import moment from "moment";

const SelectPedido = ({ empresaId, particularId, onSelect }) => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPedido, setSelectedPedido] = useState(null);
  const getToken = useAuth();

  useEffect(() => {
    const fetchPedidos = async () => {
      const usuarioToken = getToken();
      if (!usuarioToken) return;

      const fechaFin = moment().endOf("month").format("YYYY-MM-DD");
      const fechaInicio = moment().subtract(3, "months").startOf("month").format("YYYY-MM-DD");

      try {
        const response = await getPedidosFiltro(usuarioToken, {
          estado: null,
          fechaInicio,
          fechaFin,
          tipoHorario: "creacion",
          empresaId: empresaId || null,
          particularId: particularId || null,
          obraId: null,
          choferId: null,
        });

        setPedidos(response.data);
      } catch (err) {
        setError("Error al cargar los pedidos");
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [empresaId, particularId, getToken]);

  const handleSelectChange = (e) => {
    const pedidoId = e.target.value;
    const selected = pedidos.find((pedido) => pedido.id === Number(pedidoId));
    setSelectedPedido(selected);
    if (onSelect) onSelect(selected);
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Form.Group controlId="selectPedido">
      <Form.Label>Seleccione un pedido</Form.Label>
      <Form.Control as="select" value={selectedPedido?.id || ""} onChange={handleSelectChange}>
        <option value="">Seleccione un pedido</option>
        {pedidos.map((pedido) => (
          <option key={pedido.id} value={pedido.id}>
            {`Nro Pedido: ${pedido.id}, Creado: ${moment(pedido.createdAt).format("DD/MM/YYYY")}`}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export default SelectPedido;