import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Referencia = () => {
  const { pedido } = useSelector((state) => state.pedido);
  const referenciaId = pedido?.referenciaId;
  const creadoRecambio = pedido?.creadoComo === "recambio";

  const navigate = useNavigate();

  const handleNavigateToPedido = () => {
    navigate("/pedidos/datos", { state: { pedidoId: referenciaId } });
  };

  return (
    <div>
      {creadoRecambio && referenciaId && (
        <div>
          <span className="link-primary" style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} onClick={handleNavigateToPedido}>
            Ir a su referencia
          </span>
        </div>
      )}
    </div>
  );
};

export default Referencia;

