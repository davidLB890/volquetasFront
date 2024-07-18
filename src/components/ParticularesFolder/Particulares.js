import React from "react";
import ListaParticulares from "./ListaParticulares";
import { useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

const Particulares = () => {
  let navigate = useNavigate();

  return (
    <Container>
      <div>
        <div className="header">
          <h1>Lista Particulares</h1>
          <Button
            variant="primary"
            onClick={() => navigate("/particulares/crear")}
          >
            Nuevo particular
          </Button>
        </div>
        <ListaParticulares />
      </div>
    </Container>
  );
};

export default Particulares;
