import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ListaObras from "./ListaObras";



const Obras = () => {
    let navigate = useNavigate();

  return (
    <div className="container card">
      <div className='header'>
        <h1>Lista de Obras</h1>
        <Button variant="primary" onClick={() => navigate("/obras/crear")}>Nueva Obra</Button>
      </div>
      <div>
        <ListaObras />
      </div>
    </div>
  );
};

export default Obras;
