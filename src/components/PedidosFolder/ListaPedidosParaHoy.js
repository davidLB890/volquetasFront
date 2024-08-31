import React from "react";
import { useSelector } from "react-redux";
import { Table, Card, Alert } from "react-bootstrap";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import "../../assets/css/ListaPedidosParaHoy.css"; // Asegúrate de incluir los estilos personalizados

const ListaPedidosParaHoy = ({ onResults }) => {
  const empleados = useSelector((state) => state.empleados.empleados);
  const choferes = empleados.filter(
    (empleado) => empleado.rol === "chofer" && empleado.habilitado
  );

  const navigate = useNavigate();

  const handleRowClick = (pedido) => {
    navigate("/pedidos/datos", { state: { pedidoId: pedido.id } });
  };

  const renderPedidos = (choferId, pedidos = [], tipo) => {
    return pedidos.map((pedido) => {
      const sugerencia =
        tipo === "entrega" && pedido.Movimientos.length === 0
          ? pedido.Sugerencias.find(
              (sug) =>
                sug.tipoSugerido === "entrega" && sug.choferSugeridoId === choferId
            )
          : tipo === "levante" && pedido.Movimientos.length === 1
          ? pedido.Sugerencias.find(
              (sug) =>
                sug.tipoSugerido === "levante" && sug.choferSugeridoId === choferId
            )
          : null;

      const obra = pedido.Obra;
      const direccion = `${obra.calle}, ${obra.numeroPuerta}${
        obra.esquina ? `, esquina ${obra.esquina}` : ""
      }`;

      if (sugerencia) {
        return (
          <tr key={pedido.id} onClick={() => handleRowClick(pedido)} className="clickable-row">
            <td>{obra.particular?.nombre || obra.empresa?.nombre || "N/A"}</td>
            <td>{direccion}</td>
            <td>{moment(sugerencia.horarioSugerido).format("LLLL")}</td>
          </tr>
        );
      }

      return null;
    });
  };

  const tieneSugerencias = (pedidos = [], choferId, tipo) => {
    return pedidos.some((pedido) => {
      const sugerencia =
        tipo === "entrega" && pedido.Movimientos.length === 0
          ? pedido.Sugerencias.some(
              (sug) =>
                sug.tipoSugerido === "entrega" && sug.choferSugeridoId === choferId
            )
          : tipo === "levante" && pedido.Movimientos.length === 1
          ? pedido.Sugerencias.some(
              (sug) =>
                sug.tipoSugerido === "levante" && sug.choferSugeridoId === choferId
            )
          : false;
      return !!sugerencia;
    });
  };

  const choferesConSugerencias = choferes.filter((chofer) => {
    const tieneEntregas = tieneSugerencias(onResults.entrega, chofer.id, "entrega");
    const tieneLevantes = tieneSugerencias(onResults.levante, chofer.id, "levante");
    return tieneEntregas || tieneLevantes;
  });

  if (choferesConSugerencias.length === 0) {
    return <Alert variant="info">Sin sugerencias para hoy.</Alert>;
  }

  return (
    <div>
      {choferesConSugerencias.map((chofer) => (
        <Card key={chofer.id} className="mb-4 chofer-card">
          <Card.Header className="chofer-header">
            <h4>{chofer.nombre}</h4>
          </Card.Header>
          <Card.Body>
            <h5>Entregas</h5>
            <div className="d-none d-md-block">
              <Table striped bordered hover responsive className="compact-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Dirección</th>
                    <th>Horario Sugerido</th>
                  </tr>
                </thead>
                <tbody>
                  {renderPedidos(chofer.id, onResults.entrega, "entrega")}
                </tbody>
              </Table>
            </div>

            <div className="d-md-none">
              {onResults.entrega.length > 0 ? (
                onResults.entrega.map((pedido) => (
                  <Card key={pedido.id} onClick={() => handleRowClick(pedido)} className="mb-2">
                    <Card.Body>
                      <Card.Title>{pedido.Obra.particular?.nombre || pedido.Obra.empresa?.nombre || "N/A"}</Card.Title>
                      <Card.Text>{`${pedido.Obra.calle}, ${pedido.Obra.numeroPuerta}`}</Card.Text>
                      <Card.Text>
                        <small className="text-muted">
                          {moment(pedido.Sugerencias[0]?.horarioSugerido).format("LLLL")}
                        </small>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <Alert variant="info">Sin sugerencias para esta fecha.</Alert>
              )}
            </div>

            <h5>Levantes</h5>
            <div className="d-none d-md-block">
              <Table striped bordered hover responsive className="compact-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Dirección</th>
                    <th>Horario Sugerido</th>
                  </tr>
                </thead>
                <tbody>
                  {renderPedidos(chofer.id, onResults.levante, "levante")}
                </tbody>
              </Table>
            </div>

            <div className="d-md-none">
              {onResults.levante.length > 0 ? (
                onResults.levante.map((pedido) => (
                  <Card key={pedido.id} onClick={() => handleRowClick(pedido)} className="mb-2">
                    <Card.Body>
                      <Card.Title>{pedido.Obra.particular?.nombre || pedido.Obra.empresa?.nombre || "N/A"}</Card.Title>
                      <Card.Text>{`${pedido.Obra.calle}, ${pedido.Obra.numeroPuerta}`}</Card.Text>
                      <Card.Text>
                        <small className="text-muted">
                          {moment(pedido.Sugerencias[0]?.horarioSugerido).format("LLLL")}
                        </small>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <Alert variant="info">Sin sugerencias para esta fecha.</Alert>
              )}
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default ListaPedidosParaHoy;
