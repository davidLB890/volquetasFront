import { Link } from "react-router-dom";
import React from 'react';


const NotFound = () => {
  const usuarioIngresado = localStorage.getItem("userId");
  if (usuarioIngresado) {
    return (
      <h2>
        Lo sentimos, pero esta direccion URL no existe.
        <br />
        <Link to="/">Volver al inicio</Link>
      </h2>
    );
  } else {
    return (
      <h2>
        Lo sentimos, pero esta direccion URL no existe.
        <br />
        <Link to="/singin">Registrarme</Link> |{" "}
        <Link to="/login">Ingresar</Link>
      </h2>
    );
  }
};

export default NotFound;
