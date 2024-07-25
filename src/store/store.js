import { configureStore } from '@reduxjs/toolkit';
import empleadosReducer from '../features/empleadosSlice';
import camionesReducer from '../features/camionesSlice';
import pedidoReducer from '../features/pedidoSlice';
import volquetasReducer from '../features/volquetasSlice'; // Asegúrate de importar el slice correcto

export const store = configureStore({
    reducer: {
        /* usuarioIngresado: usuarioReducer */
        empleados: empleadosReducer,
        camiones: camionesReducer,
        pedido: pedidoReducer,
        volquetas: volquetasReducer, // Asegúrate de agregar el slice correcto
    }
});
