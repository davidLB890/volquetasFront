import { Link, Navigate } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
/* import { guardarUsuarios } from "../features/usuariosSlice"; */
import { useDispatch, useSelector } from "react-redux" 
import * as bootstrap from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ConfirmarUsuario from "./UsuariosFolder/ConfirmarUsuario";
import axios from "axios"; // Importa axios
import { obtenerUsuarios } from "../api"; // Importa la función obtenerUsuarios desde api.js
import useAuth from "../hooks/useAuth";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import  CustomNavbar from "./SideNav";
import Singin from "./UsuariosFolder/Singin";
import CrearEmpleados from "./EmpleadosFolder/CrearEmpleados";
import Empleados from "./EmpleadosFolder/Empleados"


const Dashboard = () => {
  /* let usuarioId = localStorage.getItem('id'); */
  //let usuarioToken = localStorage.getItem('apiToken');
 
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const getToken = useAuth();
  
  useEffect(() => {
    const usuarioToken = getToken();
    if (usuarioToken === null) {
      console.log("No hay token");
      navigate("/login");
    } /* else {
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
          console.error("Error al obtener usuarios:", error.response.data.error);
          navigate("/");
        });
    } */
  }, [dispatch, navigate, getToken]);

  return (

      <main className="container-fluid">
        

        <header className="row text-center">
          <h1></h1>
        </header>



      </main>
      

  )
}

      export default Dashboard