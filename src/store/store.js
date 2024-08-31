import { configureStore } from '@reduxjs/toolkit';
import empleadosReducer from '../features/empleadosSlice';
import camionesReducer from '../features/camionesSlice';
import pedidoReducer from '../features/pedidoSlice';
import volquetasReducer from '../features/volquetasSlice';
import particularReducer from '../features/particularSlice';
import empresaReducer from '../features/empresaSlice';
import cajasReducer from '../features/cajasSlice';

export const store = configureStore({
    reducer: {
        /* usuarioIngresado: usuarioReducer */
        empleados: empleadosReducer,
        camiones: camionesReducer,
        particular: particularReducer,
        pedido: pedidoReducer,
        volquetas: volquetasReducer, 
        empresa: empresaReducer,
        cajas: cajasReducer,

    }
});
