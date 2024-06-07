import { Link, Navigate } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { guardarUsuarios } from "../features/usuariosSlice";
import { useDispatch, useSelector } from "react-redux" 
import * as bootstrap from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Usuarios from "./UsuariosFolder/Usuarios";
import ConfirmarUsuario from "./UsuariosFolder/ConfirmarUsuario";
import axios from "axios"; // Importa axios
import { obtenerUsuarios } from "../api"; // Importa la función obtenerUsuarios desde api.js

const Dashboard = () => {
  /* let usuarioId = localStorage.getItem('id'); */
  let usuarioToken = localStorage.getItem('apiToken');
  const apiUrl = import.meta.env.VITE_API_URL;
 
  let navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (usuarioToken === null) {
      console.log("No hay token");
      navigate("/");
    } else {
      // Realiza la solicitud para obtener los usuarios usando axios
      obtenerUsuarios(usuarioToken)
        .then((response) => {
          const datos = response.data;
          if (datos.error) {
            console.error(datos.error);
            navigate("/");
          } else {
            dispatch(guardarUsuarios(datos));
          }
        })
        .catch((error) => {
          console.error("Error al obtener usuarios:", error);
          navigate("/");
        });
    }
  }, [dispatch, navigate, usuarioToken]);

  /* const cerrarSesion = () => {
    localStorage.clear();
    navigate("/");
  } */

  return (
/*     <body> */
      <main className="container-fluid">

        <header className="row text-center">
          <h1>Volquetas</h1>
          {/* <input type="button" value="logout" onClick={cerrarSesion}/> */}
        </header>

        <section className="row text-center">
          <Usuarios />
        </section>

        <section className="row text-center">
          <ConfirmarUsuario />
        </section>

        <section className="row text-center">

        </section>
        <footer></footer>

      </main>
/*     </body> */
      

  )
}

      export default Dashboard