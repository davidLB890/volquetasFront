import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPedidoId, getObraId, getPermisoIdEmpresa, putPagoPedidos } from '../api';

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

export const updatePago = createAsyncThunk('pedido/updatePago', async ({ pago, usuarioToken }, { rejectWithValue }) => {
  try {
    const response = await putPagoPedidos(pago.id, pago, usuarioToken);
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
    addMovimiento: (state, action) => {
      state.pedido.Movimientos.push(action.payload);
    },
    addSugerencia: (state, action) => {
      state.pedido.Sugerencias.push(action.payload);
    },
    deleteSugerencia: (state, action) => {
      state.pedido.Sugerencias = state.pedido.Sugerencias.filter(sugerencia => sugerencia.id !== action.payload);
    },
    modifySugerencia: (state, action) => {
      const index = state.pedido.Sugerencias.findIndex(sugerencia => sugerencia.id === action.payload.id);
      if (index !== -1) {
        state.pedido.Sugerencias[index] = action.payload;
      }
    },
    updateObra: (state, action) => {
      state.pedido.Obra = action.payload;
    },
    deleteMovimiento: (state, action) => {
      state.pedido.Movimientos = state.pedido.Movimientos.filter(movimiento => movimiento.id !== action.payload);
    },
    modifyMovimiento: (state, action) => {
      const movimientoIndex = state.pedido.Movimientos.findIndex(movimiento => movimiento.id === action.payload.id);
    
      if (movimientoIndex !== -1) {
        // Actualiza el movimiento específico con los nuevos datos
        state.pedido.Movimientos[movimientoIndex] = { 
          ...state.pedido.Movimientos[movimientoIndex], 
          ...action.payload 
        };
    
        // Si necesitas actualizar un movimiento relacionado, puedes hacerlo aquí
        const movimientoRelacionadoIndex = state.pedido.Movimientos.findIndex(movimiento => 
          movimiento.pedidoId === state.pedido.Movimientos[movimientoIndex].pedidoId && 
          movimiento.tipo !== state.pedido.Movimientos[movimientoIndex].tipo
        );
    
        if (movimientoRelacionadoIndex !== -1) {
          state.pedido.Movimientos[movimientoRelacionadoIndex].numeroVolqueta = state.pedido.Movimientos[movimientoIndex].numeroVolqueta;
        }
      }
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
      .addCase(updatePago.fulfilled, (state, action) => {
        state.pedido.pagoPedido = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(updatePago.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updatePedido, addMovimiento, modifyMovimiento, addSugerencia, updateObra, deleteMovimiento, deleteSugerencia, modifySugerencia, addTelefonoToObra, addContactoSuccess  } = pedidoSlice.actions;

export default pedidoSlice.reducer;