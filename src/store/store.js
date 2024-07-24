import { configureStore } from '@reduxjs/toolkit';
import empleadosReducer from '../features/empleadosSlice';
import camionesReducer from '../features/camionesSlice';
import pedidoReducer from '../features/pedidoSlice';

export const store = configureStore({
    reducer: {
        /* usuarioIngresado: usuarioReducer */
        empleados: empleadosReducer,
        camiones: camionesReducer,
        pedido: pedidoReducer
    }
});
