import { configureStore } from '@reduxjs/toolkit';
import empleadosReducer from '../features/empleadosSlice';
import camionesReducer from '../features/camionesSlice';

export const store = configureStore({
    reducer: {
        /* usuarioIngresado: usuarioReducer */
        empleados: empleadosReducer,
        camiones: camionesReducer
    }
});
