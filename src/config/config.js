export const TIPOS_HORARIO_PEDIDO = [
  { value: "creacion", label: "Creación" },
  { value: "sugerenciaEntrega", label: "Sugerencia Entrega" },
  { value: "sugerenciaLevante", label: "Sugerencia Levante" },
  { value: "movimientoLevante", label: "Movimiento Levante" },
  { value: "movimientoEntrega", label: "Movimiento Entrega" },
];

export const ESTADOS_PEDIDO = [
  { value: "entregado", label: "Entregado" },
  { value: "iniciado", label: "Iniciado" },
  { value: "cancelado", label: "Cancelado" },
  { value: "levantado", label: "Levantado" },
];

export const ESTADOS_VOLQUETA = [
  { value: "ok", label: "Ok" },
  { value: "para pintar", label: "Para pintar" },
  { value: "inutilizable", label: "Inutilizable" },
  { value: "quemada", label: "Quemada" },
  { value: "perdida", label: "Perdida" },
];

export const TAMANOS_VOLQUETA = [
  { value: "grande", label: "Grande" },
  { value: "chica", label: "Chica" },
];

export const TIPOS_PAGO = [
  { value: "efectivo", label: "Efectivo" },
  { value: "transferencia", label: "Transferencia" },
  { value: "cheque", label: "Cheque" },
];
export const DESTINO_FINAL = [
  { value: "RCD", label: "RCD" },
  { value: "USINA 8", label: "USINA 8" },
];

export const TIPOS_MOVIMIENTO = ["entrega", "levante"];

export const PRECIO_VOLQUETA_GRANDE = 3200;
export const PRECIO_VOLQUETA_PEQUENA = 1600;
export const IVA = 0.13;