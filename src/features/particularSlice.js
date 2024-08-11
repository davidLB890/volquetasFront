import { createSlice } from '@reduxjs/toolkit';

const particularSlice = createSlice({
  name: 'particular',
  initialState: {
    particular: null,
    loading: false,
    error: null,
    success: null,
    permisos: [], // Añadido para gestionar permisos
    permisosLoading: false,
    permisosError: null,
  },
  reducers: {
    fetchParticularStart(state) {
      state.loading = true;
      state.error = null;
      state.success = null;
    },
    fetchParticularSuccess(state, action) {
      state.loading = false;
      state.particular = action.payload;
    },
    fetchParticularFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updateParticularSuccess(state, action) {
      state.particular = {
        ...state.particular, // Mantén los datos existentes
        ...action.payload,   // Sobrescribe con los nuevos datos
      };
      state.success = 'Particular modificado correctamente';
    },
    updateParticularFailure(state, action) {
      state.error = action.payload;
    },
    createTelefonoSuccess(state, action) {
      if (state.particular) {
        state.particular.Telefonos = [...state.particular.Telefonos, action.payload];
      }
      state.success = 'Teléfono agregado correctamente';
    },
    createTelefonoFailure(state, action) {
      state.error = action.payload;
    },
    modifyTelefonoSuccess(state, action) {
      if (state.particular) {
        state.particular.Telefonos = state.particular.Telefonos.map((tel) =>
          tel.id === action.payload.id ? action.payload : tel
        );
      }
      state.success = 'Teléfono modificado correctamente';
    },
    modifyTelefonoFailure(state, action) {
      state.error = action.payload;
    },
    createObraSuccess(state, action) {
      if (state.particular) {
        state.particular.obras = [...state.particular.obras, action.payload];
      }
      state.success = 'Obra agregada correctamente';
    },
    createObraFailure(state, action) {
      state.error = action.payload;
    },
    modifyObraSuccess(state, action) {
      if (state.particular) {
        state.particular.obras = state.particular.obras.map((obra) =>
          obra.id === action.payload.id ? action.payload : obra
        );
      }
      state.success = 'Obra modificada correctamente';
    },
    modifyObraFailure(state, action) {
      state.error = action.payload;
    },
    fetchPermisosStart(state) {
      state.permisosLoading = true;
      state.permisosError = null;
    },
    fetchPermisosSuccess(state, action) {
      state.permisosLoading = false;
      state.permisos = action.payload;
    },
    fetchPermisosFailure(state, action) {
      state.permisosLoading = false;
      state.permisosError = action.payload;
    },
    createPermisoParticularSuccess(state, action) {
      console.log("en slice", action.payload)
      state.permisos = [...state.permisos, action.payload];
      state.success = 'Permiso agregado correctamente';
    },
    createPermisoFailure(state, action) {
      state.error = action.payload;
    },
    deleteObraSuccess(state, action) {
      if (state.particular) {
        state.particular.obras = state.particular.obras.filter((obra) => obra.id !== action.payload);
      }
      state.success = 'Obra eliminada correctamente';
    },
    clearSuccess(state) {
      state.success = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  fetchParticularStart,
  fetchParticularSuccess,
  fetchParticularFailure,
  updateParticularSuccess,
  updateParticularFailure,
  createTelefonoSuccess,
  createTelefonoFailure,
  modifyTelefonoSuccess,
  modifyTelefonoFailure,
  createObraSuccess,
  createObraFailure,
  modifyObraSuccess,
  modifyObraFailure,
  fetchPermisosStart,
  fetchPermisosSuccess,
  fetchPermisosFailure,
  createPermisoParticularSuccess,
  createPermisoSuccess,
  createPermisoFailure,
  deleteObraSuccess,
  clearSuccess,
  clearError,
} = particularSlice.actions;

export default particularSlice.reducer;
