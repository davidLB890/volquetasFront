import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import ListaVolquetas from "./ListaVolquetas";

const Volquetas = () => {
  const navigate = useNavigate();
  const getToken = useAuth();

  useEffect(() => {
    const usuarioToken = getToken();
    if (!usuarioToken) {
      navigate("/login");
    }
  }, [navigate, getToken]);

  const handleAgregarVolqueta = () => {
    navigate("/volquetas/crear");
  };

  return (
    <Container>
      <div className="header">
        <h1>Volquetas</h1>
        <Button variant="primary" onClick={handleAgregarVolqueta}>
          Nueva Volqueta
        </Button>
      </div>
      <ListaVolquetas />
    </Container>
  );
};

export default Volquetas;