import React, { useState, useEffect } from "react";
import { Form, Spinner, Alert, Container } from "react-bootstrap";
import moment from "moment";
import { getPedidosFiltro } from "../../api";
import useAuth from "../../hooks/useAuth";

const FiltrosPedidoParaHoy = ({ onResults }) => {
  const getToken = useAuth();
  const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
  const [fechaInicio, setFechaInicio] = useState(
    moment().startOf("day").add(1, "hours").format("YYYY-MM-DDTHH:mm")
  );
  const [fechaFin, setFechaFin] = useState(
    moment().endOf("day").format("YYYY-MM-DDTHH:mm")
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const newFechaInicio = moment(selectedDate)
      .startOf("day")
      .add(1, "hours")
      .format("YYYY-MM-DDTHH:mm");
    const newFechaFin = moment(selectedDate)
      .endOf("day")
      .format("YYYY-MM-DDTHH:mm");

    setFechaInicio(newFechaInicio);
    setFechaFin(newFechaFin);
  }, [selectedDate]);

  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      setError("");
      const usuarioToken = getToken();

      try {
        const [entregaResponse, levanteResponse] = await Promise.all([
          getPedidosFiltro(usuarioToken, {
            estado: "",
            fechaInicio,
            fechaFin,
            tipoHorario: "sugerenciaEntrega",
            empresaId: null,
            particularId: null,
            obraId: null,
            choferId: null,
          }),
          getPedidosFiltro(usuarioToken, {
            estado: "",
            fechaInicio,
            fechaFin,
            tipoHorario: "sugerenciaLevante",
            empresaId: null,
            particularId: null,
            obraId: null,
            choferId: null,
          }),
        ]);
        /* console.log("fechaInicio", fechaInicio);
        console.log("fechaFin", fechaFin);
        console.log("entregaResponse", entregaResponse.data);
        console.log("levanteResponse", levanteResponse.data); */

        onResults({
          entrega: entregaResponse.data,
          levante: levanteResponse.data,
        });
      } catch (error) {
        setError("Error al cargar los pedidos. Intenta nuevamente.");
        console.error("Error fetching pedidos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos(); // Fetch pedidos whenever fechaInicio or fechaFin changes
  }, [fechaInicio, fechaFin, getToken, onResults]);

  return (
    <Container>
    <div>
      <Form>
        <Form.Group controlId="formSelectedDate">
          <Form.Label>Seleccione un día</Form.Label>
          <Form.Control
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </Form.Group>
      </Form>

      {loading && <Spinner animation="border" size="sm" />}
      {error && <Alert variant="danger">{error}</Alert>}
    </div>
    </Container>
  );
};

export default FiltrosPedidoParaHoy;
