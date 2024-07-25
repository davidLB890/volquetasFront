import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getVolquetas, deleteVolquetaAPI, putVolquetaAPI, postVolquetaAPI, getPedidoId } from '../api'; // Asegúrate de tener estas funciones en tu api.js

// Thunks para operaciones asincrónicas
export const fetchVolquetas = createAsyncThunk('volquetas/fetchVolquetas', async (usuarioToken, { rejectWithValue }) => {
  try {
    const response = await getVolquetas(usuarioToken);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message);
  }
});

export const fetchVolquetaUbicacion = createAsyncThunk('volquetas/fetchVolquetaUbicacion', async ({ pedidoId, volquetaId, usuarioToken }, { rejectWithValue }) => {
  try {
    const response = await getPedidoId(pedidoId, usuarioToken);
    return { volquetaId, ubicacion: response.data.Obra.calle };
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message);
  }
});

export const deleteVolqueta = createAsyncThunk('volquetas/deleteVolqueta', async ({ volquetaId, usuarioToken }, { rejectWithValue }) => {
  try {
    await deleteVolquetaAPI(volquetaId, usuarioToken);
    return volquetaId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message);
  }
});

export const modifyVolqueta = createAsyncThunk('volquetas/modifyVolqueta', async ({ volquetaId, volqueta, usuarioToken }, { rejectWithValue }) => {
  try {
    const response = await putVolquetaAPI(volquetaId, volqueta, usuarioToken);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message);
  }
});

export const addVolqueta = createAsyncThunk('volquetas/addVolqueta', async ({ volqueta, usuarioToken }, { rejectWithValue }) => {
  try {
    const response = await postVolquetaAPI(volqueta, usuarioToken);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message);
  }
});

// Slice de Volquetas
const volquetasSlice = createSlice({
  name: 'volquetas',
  initialState: {
    volquetas: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Reducer para acciones sincronas
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVolquetas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVolquetas.fulfilled, (state, action) => {
        state.loading = false;
        state.volquetas = action.payload.sort((a, b) => a.numeroVolqueta - b.numeroVolqueta);
      })
      .addCase(fetchVolquetas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchVolquetaUbicacion.fulfilled, (state, action) => {
        const { volquetaId, ubicacion } = action.payload;
        const index = state.volquetas.findIndex(volqueta => volqueta.numeroVolqueta === volquetaId);
        if (index !== -1) {
          state.volquetas[index].ubicacion = ubicacion;
        }
      })
      .addCase(deleteVolqueta.fulfilled, (state, action) => {
        state.volquetas = state.volquetas.filter(volqueta => volqueta.numeroVolqueta !== action.payload);
      })
      .addCase(deleteVolqueta.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(modifyVolqueta.fulfilled, (state, action) => {
        const index = state.volquetas.findIndex(volqueta => volqueta.numeroVolqueta === action.payload.numeroVolqueta);
        if (index !== -1) {
          state.volquetas[index] = action.payload;
        }
      })
      .addCase(modifyVolqueta.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(addVolqueta.fulfilled, (state, action) => {
        state.volquetas.push(action.payload);
      })
      .addCase(addVolqueta.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default volquetasSlice.reducer;
