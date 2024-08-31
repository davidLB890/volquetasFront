import React, { useState } from 'react';
import FiltrosPedidoParaHoy from './FiltrosPedidoParaHoy';
import ListaPedidosParaHoy from './ListaPedidosParaHoy';

const PedidosParaHoy = () => {
    const [resultados, setResultados] = useState({ entrega: [], levante: [] });

    return (
        <div>
            <h1>Pedidos para hoy</h1>
            <FiltrosPedidoParaHoy onResults={setResultados} />
            <ListaPedidosParaHoy onResults={resultados} />
        </div>
    );
}

export default PedidosParaHoy;
