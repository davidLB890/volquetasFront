import { createSlice } from "@reduxjs/toolkit";

const empresaSlice = createSlice({
  name: "empresa",
  initialState: {
    empresa: null,
    error: null,
    permisos: [],
    obras: [],
    contactos: [], // telefonos está dentro de contactos
  },
  reducers: {
    fetchEmpresaStart(state) {
      state.error = null;
      state.success = null;
    },
    fetchEmpresaSuccess(state, action) {
      state.empresa = action.payload;
      state.permisos = action.payload.Permisos || [];
      state.obras = action.payload.obras || [];
      state.contactos = action.payload.contactos || [];
    },
    fetchEmpresaFailure(state, action) {
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
      state.permisos = [...state.permisos, action.payload];
      state.success = "Permiso agregado correctamente";
    },
    createPermisoFailure(state, action) {
      state.error = action.payload;
    },
    createTelefonoSuccess(state, action) {
      const { contactId, obraId, telefono } = action.payload;
      if (contactId) {
        const contacto = state.contactos.find(contacto => contacto.id === contactId);
        if (contacto) {
          contacto.Telefonos = [...contacto.Telefonos, telefono];
        }
      } else if (obraId) {
        const obra = state.obras.find(obra => obra.id === obraId);
        if (obra) {
          obra.Telefonos = [...obra.Telefonos, telefono];
        }
      }
      state.success = "Teléfono agregado correctamente";
    },
    createTelefonoFailure(state, action) {
      state.error = action.payload;
    },
    deleteTelefonoSuccess(state, action) {
      const { contactId, telefonoId } = action.payload;
      console.log("en el slice", contactId, telefonoId);
    
      // Buscar el contacto correspondiente por su ID
      const contacto = state.contactos.find(contacto => contacto.id === contactId);
      
      if (contacto) {
        // Filtrar el teléfono eliminado de la lista de teléfonos del contacto
        contacto.Telefonos = contacto.Telefonos.filter(tel => tel.id !== telefonoId);
      }
    
      state.success = "Teléfono eliminado correctamente";
    },
    
    
    createContactoSuccess(state, action) {
      const nuevoContacto = {
        ...action.payload,
        Telefonos: action.payload.Telefonos || [],
      };
      state.contactos.push(nuevoContacto);
      state.success = "Contacto agregado correctamente";
    },
    modifyContactoSuccess(state, action) {
      const updatedContacto = action.payload;
      state.contactos = state.contactos.map(contacto => 
        contacto.id === updatedContacto.id 
          ? { ...contacto, ...updatedContacto } // Mantiene los Telefonos y sobrescribe los demás campos
          : contacto
      );
      state.success = "Contacto modificado correctamente";
    },
    
    modifyTelefonoSuccess(state, action) {
      const { contactId, obraId, telefono } = action.payload;
      if (contactId) {
        const contacto = state.contactos.find(contacto => contacto.id === contactId);
        if (contacto) {
          contacto.Telefonos = contacto.Telefonos.map(tel =>
            tel.id === telefono.id ? telefono : tel
          );
        }
      } else if (obraId) {
        const obra = state.obras.find(obra => obra.id === obraId);
        if (obra) {
          obra.Telefonos = obra.Telefonos.map(tel =>
            tel.id === telefono.id ? telefono : tel
          );
        }
      }
      state.success = "Teléfono modificado correctamente";
    },
    deleteContactoSuccess(state, action) {
      state.contactos = state.contactos.filter(contacto => contacto.id !== action.payload);
      state.success = "Contacto eliminado correctamente";
    },
    fetchPermisosStart(state) {
      state.error = null;
    },
    fetchPermisosSuccess(state, action) {
      state.permisos = action.payload;
    },
    fetchPermisosFailure(state, action) {
      state.error = action.payload;
    },
    deleteObraSuccess(state, action) {
      state.obras = state.obras.filter((obra) => obra.id !== action.payload);
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
  deleteTelefonoSuccess,
  createContactoSuccess,
  modifyContactoSuccess,
  deleteContactoSuccess, // Exporta la acción para eliminar el contacto
  modifyTelefonoSuccess,
  fetchPermisosStart,
  fetchPermisosSuccess,
  fetchPermisosFailure,
  deleteObraSuccess,
  clearSuccess,
  clearError,
} = empresaSlice.actions;

export default empresaSlice.reducer;
