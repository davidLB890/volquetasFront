import React from "react";
import Movimientos from "./Movimientos";
import { useSelector } from "react-redux";

const MovimientosYSugerencias = ({
  movimientos,
  handleVerPedido,
  pedidoId,
}) => {
  const empleados = useSelector((state) => state.empleados.empleados);
  const choferes = empleados.filter((empleado) => empleado.rol === "chofer");
  return (
    <div>
      <Movimientos
        movimientos={movimientos}
        choferes={choferes}
        handleVerPedido={handleVerPedido}
        pedidoId={pedidoId}
      />
    </div>
  );
};

export default MovimientosYSugerencias;
