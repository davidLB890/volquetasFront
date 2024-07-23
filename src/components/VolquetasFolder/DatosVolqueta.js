// src/components/VolquetasFolder/DatosVolqueta.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Spinner, Alert, Container, Card } from "react-bootstrap";
import { getVolquetaId, obtenerEmpleado, getPedidoId } from "../../api"; // Asegúrate de ajustar la ruta según sea necesario
import useAuth from "../../hooks/useAuth";
import Movimientos from "../MovimientosFolder/Movimientos"; // Asegúrate de ajustar la ruta según sea necesario

const DatosVolqueta = () => {
  const location = useLocation();
  const volquetaId = location.state?.volquetaId;
  const [volqueta, setVolqueta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [choferes, setChoferes] = useState({});
  const getToken = useAuth();
  const navigate = useNavigate();

  const buscarChofer = async (choferId) => {
    const usuarioToken = getToken();
    try {
      const response = await obtenerEmpleado(choferId, usuarioToken);
      return response.data.nombre;
    } catch (error) {
      console.error(
        "Error al obtener el chofer de la volqueta:",
        error.response?.data?.error || error.message
      );
      setError("Error al obtener el chofer de la volqueta");
      setTimeout(() => setError(""), 5000);
      return "Error al obtener chofer";
    }
  };

  const handleVerPedido = async (pedidoId) => {
    const usuarioToken = getToken();
    try {
      const response = await getPedidoId(pedidoId, usuarioToken);
      navigate("/pedidos/datos", { state: { pedido: response.data, volquetaId } });
    } catch (error) {
      console.error("Error al obtener los detalles del pedido:", error.response?.data?.error || error.message);
      setError("Error al obtener los detalles del pedido");
      setTimeout(() => setError(""), 5000);
    }
  };

  useEffect(() => {
    const fetchVolqueta = async () => {
      const usuarioToken = getToken();
      try {
        const response = await getVolquetaId(volquetaId, usuarioToken);
        setVolqueta(response.data);

        const nuevosChoferes = {};
        for (const movimiento of response.data.Movimientos) {
          if (movimiento.choferId) {
            const nombreChofer = await buscarChofer(movimiento.choferId);
            nuevosChoferes[movimiento.choferId] = nombreChofer;
          }
        }
        setChoferes(nuevosChoferes);

        setLoading(false);
      } catch (error) {
        console.error(
          "Error al obtener los detalles de la volqueta:",
          error.response?.data?.error || error.message
        );
        setError("Error al obtener los detalles de la volqueta");
        setLoading(false);
      }
    };

    fetchVolqueta();
  }, [volquetaId, getToken]);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!volqueta) {
    return (
      <Alert variant="danger">No se encontraron detalles de la volqueta.</Alert>
    );
  }

  return (
    <Container>
      <Card className="mt-3">
        <Card.Header>
          <h1>Detalles de la Volqueta {volqueta.numeroVolqueta}</h1>
        </Card.Header>
        <Card.Body>
          <p>
            <strong>Estado:</strong> {volqueta.estado}
          </p>
          <p>
            <strong>Tipo:</strong> {volqueta.tipo}
          </p>
          <p>
            <strong>Ocupada:</strong> {volqueta.ocupada ? "Sí" : "No"}
          </p>
          <Movimientos
            movimientos={volqueta.Movimientos}
            choferes={choferes}
            volquetaId={volquetaId}
            handleVerPedido={handleVerPedido}
          />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DatosVolqueta;
