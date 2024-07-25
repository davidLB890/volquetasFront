import React from "react";
import Movimientos from "./Movimientos";
import Sugerencias from "../SugerenciasFolder/Sugerencias";
import { useSelector } from "react-redux";

const MovimientosYSugerencias = ({
  movimientos,
  sugerencias,
  pedidoId,
  onMovimientoAgregado,
  onMovimientoModificado,
  onMovimientoEliminado,
  onSugerenciaAgregada,
  onSugerenciaModificada,
  onSugerenciaEliminada,
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
      <Sugerencias
        sugerencias={sugerencias}
        choferes={choferes}
        pedidoId={pedidoId}
        onSugerenciaAgregada={onSugerenciaAgregada}
        onSugerenciaModificada={onSugerenciaModificada}
        onSugerenciaEliminada={onSugerenciaEliminada}
      />
    </div>
  );
};

export default MovimientosYSugerencias;






