import React from "react";
import Movimientos from "./Movimientos";
import { useSelector } from "react-redux";

const MovimientosYSugerencias = ({
  movimientos,
  pedidoId,
  onMovimientoAgregado,
  onMovimientoModificado,
  onMovimientoEliminado,
}) => {
  const empleados = useSelector((state) => state.empleados.empleados);
  const choferes = empleados.filter((empleado) => empleado.rol === "chofer");

  return (
    <div>
      <Movimientos
        movimientos={movimientos}
        choferes={choferes}
        pedidoId={pedidoId}
        onMovimientoAgregado={onMovimientoAgregado}
        onMovimientoModificado={onMovimientoModificado}
        onMovimientoEliminado={onMovimientoEliminado}
      />
    </div>
  );
};

export default MovimientosYSugerencias;






