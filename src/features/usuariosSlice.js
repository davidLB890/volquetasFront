import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    usuarios: []
}

export const usuariosSlice = createSlice({
    name: "usuarios",
    initialState,
    reducers: {
        guardarUsuarios: (state, action) => {
            state.usuarios = action.payload
        }
    }
})

export const { guardarUsuarios } = usuariosSlice.actions
export default usuariosSlice.reducer;