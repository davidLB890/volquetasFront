import React from "react";
import ListaEmpresas from "./ListaEmpresas";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Empresas = () => {
  let navigate = useNavigate();
  return (
    <Container>
      <div>
        <div className="header">
          <h1>Lista Empresas</h1>
          <Button variant="primary" onClick={() => navigate("/empresas/crear")}>
            Nueva Empresa
          </Button>
        </div>
        <ListaEmpresas />
      </div>
    </Container>
  );
};

export default Empresas;
