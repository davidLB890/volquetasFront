import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPedidoId, getObraId, getPermisoIdEmpresa } from '../api';

// Thunks para las otras operaciones que necesitan lógica asíncrona
export const fetchPedido = createAsyncThunk('pedido/fetchPedido', async ({ pedidoId, usuarioToken }, { rejectWithValue }) => {
  try {
    const response = await getPedidoId(pedidoId, usuarioToken);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message);
  }
});

export const fetchObra = createAsyncThunk('obra/fetchObra', async ({ obraId, usuarioToken }, { rejectWithValue }) => {
  try {
    const response = await getObraId(obraId, usuarioToken);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message);
  }
});

export const fetchPermisos = createAsyncThunk('permisos/fetchPermisos', async ({ empresaId, usuarioToken }, { rejectWithValue }) => {
  try {
    const response = await getPermisoIdEmpresa(empresaId, usuarioToken);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message);
  }
});

const pedidoSlice = createSlice({
  name: 'pedido',
  initialState: {
    pedido: null,
    obra: null,
    permisos: [],
    movimientos: [], 
    sugerencias: [], 
    pagoPedido: null,
    loading: false,
    error: null,
  },
  reducers: {
    updatePedido: (state, action) => {
      state.pedido = { ...state.pedido, ...action.payload };
      if (action.payload.obraId && action.payload.obraId !== state.obra?.id) {
        state.obra = action.payload.Obra;
      }
    },
    updatePagoPedido: (state, action) => {
      state.pagoPedido = action.payload;
    },
    addMovimiento: (state, action) => {
      state.movimientos.push(action.payload); // Acceder a movimientos directamente
    },
    modifyMovimiento: (state, action) => {
      const movimientoIndex = state.movimientos.findIndex(movimiento => movimiento.id === action.payload.id);
      if (movimientoIndex !== -1) {
        state.movimientos[movimientoIndex] = { 
          ...state.movimientos[movimientoIndex], 
          ...action.payload 
        };
      }
    },
    deleteMovimiento: (state, action) => {
      state.movimientos = state.movimientos.filter(movimiento => movimiento.id !== action.payload);
    },
    addSugerencia: (state, action) => {
      state.sugerencias.push(action.payload); // Acceder a sugerencias directamente
    },
    deleteSugerencia: (state, action) => {
      state.sugerencias = state.sugerencias.filter(sugerencia => sugerencia.id !== action.payload);
    },
    modifySugerencia: (state, action) => {
      const index = state.sugerencias.findIndex(sugerencia => sugerencia.id === action.payload.id);
      if (index !== -1) {
        state.sugerencias[index] = action.payload;
      }
    },
    updateObra: (state, action) => {
      state.obra = action.payload;
    },
    addTelefonoToObra: (state, action) => {
      if (state.obra && state.obra.particular) {
        state.obra.particular.Telefonos.push(action.payload);
      }
    },
    addContactoSuccess: (state, action) => {
      if (state.obra) {
        if (!state.obra.contactosDesignados) {
          state.obra.contactosDesignados = [];
        }
        state.obra.contactosDesignados.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPedido.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPedido.fulfilled, (state, action) => {
        state.loading = false;
        state.pedido = action.payload;
        state.movimientos = action.payload.Movimientos || [];
        state.sugerencias = action.payload.Sugerencias || [];
        state.pagoPedido = action.payload.pagoPedido || null; // Asigna movimientos directamente al estado
      })
      .addCase(fetchPedido.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchObra.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchObra.fulfilled, (state, action) => {
        state.loading = false;
        state.obra = action.payload;
      })
      .addCase(fetchObra.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPermisos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermisos.fulfilled, (state, action) => {
        state.loading = false;
        state.permisos = action.payload;
      })
      .addCase(fetchPermisos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      /* .addCase(updatePago.fulfilled, (state, action) => {
        state.pedido.pagoPedido = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(updatePago.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }); */
  },
});

export const { 
  updatePedido, 
  updatePagoPedido,
  addMovimiento, 
  modifyMovimiento, 
  addSugerencia, 
  updateObra, 
  deleteMovimiento, 
  deleteSugerencia, 
  modifySugerencia, 
  addTelefonoToObra, 
  addContactoSuccess 
} = pedidoSlice.actions;

export default pedidoSlice.reducer;