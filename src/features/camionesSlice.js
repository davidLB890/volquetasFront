// src/features/camionesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCamiones, deleteCamion } from '../api';

export const fetchCamiones = createAsyncThunk('camiones/fetchCamiones', async (usuarioToken, { rejectWithValue }) => {
  try {
    const response = await getCamiones(usuarioToken);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message);
  }
});

export const removeCamion = createAsyncThunk('camiones/removeCamion', async ({ camionId, usuarioToken }, { rejectWithValue }) => {
  try {
    await deleteCamion(camionId, usuarioToken);
    return camionId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message);
  }
});

const camionesSlice = createSlice({
  name: 'camiones',
  initialState: {
    camiones: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCamiones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCamiones.fulfilled, (state, action) => {
        state.loading = false;
        state.camiones = action.payload;
      })
      .addCase(fetchCamiones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeCamion.fulfilled, (state, action) => {
        state.camiones = state.camiones.filter(camion => camion.id !== action.payload);
      });
  }
});

export default camionesSlice.reducer;
