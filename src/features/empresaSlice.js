import { createSlice } from '@reduxjs/toolkit';

const empresaSlice = createSlice({
  name: "empresa",
  initialState: {
    empresa: null,
    loading: false,
    error: null,
    success: null,
    permisos: [],
    obras: [],
    contactos: [],
    telefonos: [],
  },
  reducers: {
    fetchEmpresaStart(state) {
      state.loading = true;
      state.error = null;
      state.success = null;
    },
    fetchEmpresaSuccess(state, action) {
      state.loading = false;
      state.empresa = action.payload;
      state.permisos = action.payload.permisos || [];
      state.obras = action.payload.obras || [];
      state.contactos = action.payload.contactos || [];
      state.telefonos = action.payload.telefonos || [];
    },
    fetchEmpresaFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updateEmpresaSuccess(state, action) {
      state.empresa = action.payload;
      state.success = "Empresa modificada correctamente";
    },
    updateEmpresaFailure(state, action) {
      state.error = action.payload;
    },
    createObraSuccess(state, action) {
      state.obras.push(action.payload);
      state.success = "Obra agregada correctamente";
    },
    createObraFailure(state, action) {
      state.error = action.payload;
    },
    createPermisoEmpresaSuccess(state, action) {
      console.log("en slice", action.payload);
      state.permisos = [...state.permisos, action.payload];
      state.success = 'Permiso agregado correctamente';
    },
    createPermisoFailure(state, action) {
      state.error = action.payload;
    },
    createTelefonoSuccess(state, action) {
      state.telefonos.push(action.payload);
      state.success = "Teléfono agregado correctamente";
    },
    createTelefonoFailure(state, action) {
      state.error = action.payload;
    },
    createContactoSuccess(state, action) {
      state.contactos.push(action.payload);
      state.success = "Contacto agregado correctamente";
    },
    fetchPermisosStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPermisosSuccess(state, action) {
      state.loading = false;
      state.permisos = action.payload;
    },
    fetchPermisosFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
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
  fetchEmpresaStart,
  fetchEmpresaSuccess,
  fetchEmpresaFailure,
  updateEmpresaSuccess,
  updateEmpresaFailure,
  createObraSuccess,
  createObraFailure,
  createPermisoEmpresaSuccess,
  createPermisoFailure,
  createTelefonoSuccess,
  createTelefonoFailure,
  createContactoSuccess,
  fetchPermisosStart,
  fetchPermisosSuccess,
  fetchPermisosFailure,
  clearSuccess,
  clearError,
} = empresaSlice.actions;

export default empresaSlice.reducer;

  