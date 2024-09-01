import { createSlice } from '@reduxjs/toolkit';

const facturaSlice = createSlice({
  name: 'factura',
  initialState: {
    facturas: [], // Almacena una lista de facturas
    factura: null, // Almacena una factura específica
    loading: false,
    error: null,
  },
  reducers: {
    // Acciones para cargar facturas
    setFacturas: (state, action) => {
      state.facturas = action.payload;
    },
    setFactura: (state, action) => {
      state.factura = action.payload;
    },
    
    // Acciones para manejar el estado de carga
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Acciones para manejar errores
    setError: (state, action) => {
      state.error = action.payload;
    },

    // Acciones para agregar una nueva factura
    addFactura: (state, action) => {
      state.facturas.push(action.payload);
    },

    // Acciones para actualizar una factura existente
    updateFactura: (state, action) => {
      const index = state.facturas.findIndex(factura => factura.id === action.payload.id);
      if (index !== -1) {
        state.facturas[index] = action.payload;
      }
    },

    // Acciones para eliminar una factura
    deleteFactura: (state, action) => {
      state.facturas = state.facturas.filter(factura => factura.id !== action.payload);
    },

    // Acción para limpiar el estado de factura
    clearFacturaState: (state) => {
      state.factura = null;
      state.facturas = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setFacturas,
  setFactura,
  setLoading,
  setError,
  addFactura,
  updateFactura,
  deleteFactura,
  clearFacturaState,
} = facturaSlice.actions;

export default facturaSlice.reducer;
