import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPedidoId, getObraId, getPermisoIdEmpresa, putPagoPedidos, deleteMovimientoAPI, putMovimiento 
  , postSugerencia, putSugerencia, deleteSugerenciaAPI
} from '../api';


//THUNKS
// funciones asíncronas que se utilizan para manejar la lógica de negocio compleja, 
//como llamadas a APIs, antes de despachar acciones al store de Redux.
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

export const deleteMovimiento = createAsyncThunk('pedido/deleteMovimiento', async ({ movimientoId, usuarioToken }, { rejectWithValue }) => {
  try {
    await deleteMovimientoAPI(movimientoId, usuarioToken); // Utilizando el nuevo nombre aquí
    return movimientoId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message);
  }
});

export const modifyMovimiento = createAsyncThunk('pedido/modifyMovimiento', async ({ movimientoId, movimiento, usuarioToken }, { rejectWithValue }) => {
  try {
    const response = await putMovimiento(movimientoId, movimiento, usuarioToken);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message);
  }
});

export const modifySugerencia = createAsyncThunk('pedido/modifySugerencia', async ({ sugerenciaId, sugerencia, usuarioToken }, { rejectWithValue }) => {
  try {
    const response = await putSugerencia(sugerenciaId, sugerencia, usuarioToken);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message);
  }
});

export const deleteSugerencia = createAsyncThunk('pedido/deleteSugerencia', async ({ sugerenciaId, usuarioToken }, { rejectWithValue }) => {
  try {
    await deleteSugerenciaAPI(sugerenciaId, usuarioToken);
    return sugerenciaId;
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
    },
    addMovimiento: (state, action) => {
      state.pedido.Movimientos.push(action.payload);
    },
    addSugerencia: (state, action) => {
      state.pedido.Sugerencias.push(action.payload);
    },
    updateObra: (state, action) => {
      state.pedido.Obra = action.payload;
    },
    deleteMovimiento: (state, action) => {
      state.pedido.Movimientos = state.pedido.Movimientos.filter(movimiento => movimiento.id !== action.payload);
    },
    modifyMovimiento: (state, action) => {
      const index = state.pedido.Movimientos.findIndex(movimiento => movimiento.id === action.payload.id);
      if (index !== -1) {
        state.pedido.Movimientos[index] = action.payload;
      }
    },
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
      })
      .addCase(deleteMovimiento.fulfilled, (state, action) => {
        state.pedido.Movimientos = state.pedido.Movimientos.filter(movimiento => movimiento.id !== action.payload);
      })
      .addCase(modifyMovimiento.fulfilled, (state, action) => {
        const index = state.pedido.Movimientos.findIndex(movimiento => movimiento.id === action.payload.id);
        if (index !== -1) {
          state.pedido.Movimientos[index] = action.payload;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(modifyMovimiento.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(modifySugerencia.fulfilled, (state, action) => {
        const index = state.pedido.Sugerencias.findIndex(sugerencia => sugerencia.id === action.payload.id);
        if (index !== -1) {
          state.pedido.Sugerencias[index] = action.payload;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(modifySugerencia.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteSugerencia.fulfilled, (state, action) => {
        state.pedido.Sugerencias = state.pedido.Sugerencias.filter(sugerencia => sugerencia.id !== action.payload);
      });
  },
});

export const { updatePedido, addMovimiento, addSugerencia, updateObra } = pedidoSlice.actions;

export default pedidoSlice.reducer;
