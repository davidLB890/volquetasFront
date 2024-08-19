import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getVolquetas } from '../api'; // Asegúrate de tener esta función en tu api.js

// Thunks para operaciones asincrónicas
export const fetchVolquetas = createAsyncThunk('volquetas/fetchVolquetas', async (usuarioToken, { rejectWithValue }) => {
  try {
    const response = await getVolquetas(usuarioToken);
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
    modificarVolquetaSuccess(state, action) {
      const volquetaActualizada = action.payload;
      const index = state.volquetas.findIndex(volqueta => volqueta.numeroVolqueta === volquetaActualizada.numeroVolqueta);
      if (index !== -1) {
        state.volquetas[index] = volquetaActualizada;
      }
    },
    deleteVolquetaSuccess(state, action) {
      const numeroVolqueta = action.payload;
      state.volquetas = state.volquetas.filter(volqueta => volqueta.numeroVolqueta !== numeroVolqueta);
    },
    agregarUbicacionTemporalSuccess(state, action) {
      const { numeroVolqueta, ubicacionTemporal } = action.payload;
      const index = state.volquetas.findIndex(volqueta => volqueta.numeroVolqueta === numeroVolqueta);
      if (index !== -1) {
        state.volquetas[index].ubicacionTemporal = ubicacionTemporal;
      }
    },
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
      });
  },
});
export const { modificarVolquetaSuccess, deleteVolquetaSuccess, agregarUbicacionTemporalSuccess } = volquetasSlice.actions;
export default volquetasSlice.reducer;
