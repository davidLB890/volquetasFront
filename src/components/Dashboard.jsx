import { Link, Navigate } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { guardarUsuarios } from "../features/usuariosSlice";
import { useDispatch, useSelector } from "react-redux" 
import * as bootstrap from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Usuarios from "./Usuarios";
import ConfirmarUsuario from "./ConfirmarUsuario";

const Dashboard = () => {
  /* let usuarioId = localStorage.getItem('id'); */
  let usuarioToken = localStorage.getItem('apiToken');
  const apiUrl = import.meta.env.VITE_API_URL;
 
  let navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem('apiToken') === null) {
      console.log("No hay token");
      navigate("/");
    } else {
      //fetch(`https://crypto.develotion.com/transacciones.php?idUsuario=${usuarioId}`, {
      fetch(`${apiUrl}usuarios`, {
        method: "GET",
        headers: {
          "authorization": usuarioToken,
          "Content-Type": "application/json",
        }
      }).then(r => r.json())
        .then(datos => {
          //console.log(datos.transacciones);
          
          if (datos.error) {
            console.error(datos.error);
            navigate("/");
            console.log("token malo");
          }else{
            dispatch(guardarUsuarios(datos));
          }
          //dispatch(guardarUsuarios(datos))
        })
    }
  }, []);

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