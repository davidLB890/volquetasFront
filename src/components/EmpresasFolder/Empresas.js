import React from "react";
import ListaEmpresas from "./ListaEmpresas";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Empresas = () => {
  let navigate = useNavigate();
  return (
    <div>
      <div className="header">
        <h1>Lista Empresas</h1>
        <Button variant="primary" onClick={() => navigate("/empresas/crear")}>Nueva Empresa</Button>
      </div>
      <ListaEmpresas />
    </div>
  );
};

export default Empresas;



