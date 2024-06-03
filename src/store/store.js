import { configureStore } from "@reduxjs/toolkit";
import usuariosReducer from "../features/usuariosSlice";


export const store = configureStore({
    reducer: {
        usuarios: usuariosReducer
    }
})