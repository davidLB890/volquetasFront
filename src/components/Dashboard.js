// src/components/Dashboard.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Container } from "react-bootstrap";
import { fetchEmpleados } from "../features/empleadosSlice";
import useAuth from "../hooks/useAuth";
import ListaPedido from "./PedidosFolder/ListaPedidos";

const Dashboard = () => {
  const navigate = useNavigate();
  const getToken = useAuth();

  useEffect(() => {
    const usuarioToken = getToken();
    if (usuarioToken === null) {
      navigate("/login");
    } 
  }, [getToken, navigate]);

  const handleAgregarPedido = () => {
    navigate("/pedidos/crear");
  };

  return (
    <Container>
      <div className="header">
        <h1>Pedidos</h1>
        <Button variant="primary" onClick={handleAgregarPedido}>
          Agregar Nuevo Pedido
        </Button>
      </div>
      <ListaPedido />
    </Container>
  );
};

export default Dashboard;
