// src/components/Dashboard.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Container, Row, Col } from "react-bootstrap";
import { fetchEmpleados } from "../features/empleadosSlice";
import useAuth from "../hooks/useAuth";
import ListaPedido from "./PedidosFolder/ListaPedidos";
import Deudores from "./EstadisticasFolder/DeudoresEstadisticas";
import ClientesEstadisticas from "./EstadisticasFolder/ClientesEstadisticas";
import ChoferEstadisticas from "./EstadisticasFolder/ChoferEstadisticas";
import PedidosEstadisticas from "./EstadisticasFolder/PedidosEstadisticas";

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
        <h1>Inicio</h1>
        <Button variant="primary" onClick={handleAgregarPedido}>
          Agregar Nuevo Pedido
        </Button>
      </div>
      <div>
        <h3>Estadísticas:</h3>
        <Row>
          <Col md={3}>
            <PedidosEstadisticas />
          </Col>
          <Col md={3}>
            <ClientesEstadisticas />
          </Col>
          <Col md={3}>
            <ChoferEstadisticas />
          </Col>
          <Col md={3}>
            <Deudores />
          </Col>
        </Row>
      </div>
      <h3>Lista de Pedidos:</h3>
      <ListaPedido />
    </Container>
  );
};

export default Dashboard;
