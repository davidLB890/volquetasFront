import React from "react";
import AgregarFactura from "./AgregarFactura";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ListaFacturas from "./ListaFacturas";

const Facturas = () => {
  let navigate = useNavigate();

  return (
    <Container>
        <div>
      <div className="header">
        <h1>Facturas</h1>
        <Button variant="primary" onClick={() => navigate("/facturas/crear")}>
          Nueva Factura
        </Button>
      </div>
        <ListaFacturas />
    </div>
    </Container>
    
  );
};

export default Facturas;
