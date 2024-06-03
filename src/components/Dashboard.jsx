import { Link, Navigate } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { guardarUsuarios } from "../features/usuariosSlice";
import { useDispatch, useSelector } from "react-redux" 
import * as bootstrap from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Usuarios from "./Usuarios";


const Dashboard = () => {

  /* let usuarioId = localStorage.getItem('id'); */
  let usuarioToken = localStorage.getItem('apiToken');
 
  let navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem('apiToken') === null) {
      console.log("No hay token");
      navigate("/");
    } else {
        //fetch(`https://crypto.develotion.com/transacciones.php?idUsuario=${usuarioId}`, {
          fetch("http://localhost:3000/api/usuarios", {
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
              
              
              //dispatch(guardarUsuarios(usuarios))
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

        <article className="col-6">
          <Usuarios />
        
        </article>

        <section className="row text-center">

        </section>

        <section className="row text-center">

        </section>
        <footer></footer>

      </main>
/*     </body> */
      

  )
}

      export default Dashboard