import React, { useState } from "react";
import { Table, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../assets/css/Movimientos.css"; // Importa el archivo CSS

const Movimientos = ({ movimientos = [], volquetaId }) => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const empleados = useSelector((state) => state.empleados.empleados || []);
  const choferes = empleados.filter(
    (empleado) => empleado.rol === "chofer" && empleado.habilitado
  );

  const handleVerPedido = (pedidoId, volquetaId) => {
    navigate("/pedidos/datos", { state: { pedidoId: pedidoId, volquetaId: volquetaId } });
  };

  return (
    <div>
      {movimientos.length === 0 ? (
        <p>No hay movimientos para esta volqueta.</p>
      ) : (
        <>
          {/* Tabla para pantallas grandes */}
          <Table striped bordered hover className="table">
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

          {/* Lista para pantallas pequeñas */}
          <div className="d-md-none">
            {movimientos.map((movimiento) => (
              <div key={movimiento?.id} className="movimiento-item">
                <div><strong>Número de Volqueta:</strong> {movimiento?.numeroVolqueta || "-"}</div>
                <div><strong>Horario:</strong> {movimiento?.horario ? new Date(movimiento.horario).toLocaleString() : "-"}</div>
                <div><strong>Último movimiento:</strong> {movimiento?.tipo || "-"}</div>
                <div><strong>Chofer:</strong> {choferes.find(chofer => chofer.id === movimiento?.choferId)?.nombre || "Sin chofer asignado"}</div>
                <div className="movimiento-actions">
                  <Button
                    variant="info"
                    onClick={() => handleVerPedido(movimiento?.pedidoId, volquetaId)}
                    className="w-100"
                  >
                    Ver Pedido
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
    </div>
  );
};

export default Movimientos;
