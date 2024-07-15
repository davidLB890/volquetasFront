import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { obtenerEmpleados } from '../api'; // Asegúrate de tener este endpoint en api.js

export const fetchEmpleados = createAsyncThunk('empleados/fetchEmpleados', async (usuarioToken, { rejectWithValue }) => {
  try {
    const response = await obtenerEmpleados(usuarioToken);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || error.message);
  }
});

const empleadosSlice = createSlice({
  name: 'empleados',
  initialState: {
    empleados: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmpleados.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmpleados.fulfilled, (state, action) => {
        state.loading = false;
        state.empleados = action.payload;
      })
      .addCase(fetchEmpleados.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default empleadosSlice.reducer;
