//implementado por volquetas y datos de clientes
import React, { useState } from "react";
import { Table, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Movimientos = ({
  movimientos = [],
  volquetaId
}) => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const empleados = useSelector((state) => state.empleados.empleados || []);
  const choferes = empleados.filter((empleado) => empleado.rol === "chofer" && empleado.habilitado);

  const handleVerPedido = (pedidoId, volquetaId) => {
    navigate("/pedidos/datos", { state: { pedidoId: pedidoId, volquetaId: volquetaId } });
  };

  return (
    <div>
      <div>
        {movimientos.length === 0 ? (
          <p>No hay movimientos para esta volqueta.</p>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Número de Volqueta</th>
                <th>Horario</th>
                <th>Último movimiento</th>
                <th>Chofer</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map((movimiento) => (
                <tr key={movimiento?.id}>
                  <td>{movimiento?.numeroVolqueta || "-"}</td>
                  <td>{movimiento?.horario ? new Date(movimiento.horario).toLocaleString() : "-"}</td>
                  <td>{movimiento?.tipo || "-"}</td>
                  <td>{choferes.find(chofer => chofer.id === movimiento?.choferId)?.nombre || "Sin chofer asignado"}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleVerPedido(movimiento?.pedidoId, volquetaId)}
                      className="mr-2"
                    >
                      Ver Pedido
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        {error && <Alert variant="danger">{error}</Alert>}
      </div>
    </div>
  );
};

export default Movimientos;
