import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cajas: [],  // Asegúrate de que el estado inicial tenga cajas como un array vacío
  datos: {
    contadorMotivos: {},
    montoPeso: 0,
    montoDolar: 0,
  }
};

const cajasSlice = createSlice({
  name: 'cajas',
  initialState,
  reducers: {
    setCajas: (state, action) => {
        console.log('setCajas', action.payload);
        state.cajas = action.payload.cajas;
        state.datos = action.payload.datos;
      },
    agregarCaja: (state, action) => {
      state.cajas.push(action.payload);
    },
    eliminarCaja: (state, action) => {
      state.cajas = state.cajas.filter(caja => caja.id !== action.payload);
    },
    modificarCaja: (state, action) => {
      const index = state.cajas.findIndex(caja => caja.id === action.payload.id);
      if (index !== -1) {
        state.cajas[index] = action.payload;
      }
    },
  },
});

export const { setCajas, agregarCaja, eliminarCaja, modificarCaja } = cajasSlice.actions;

export default cajasSlice.reducer;
