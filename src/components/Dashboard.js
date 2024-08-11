// src/components/Dashboard.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Container, Row, Col } from "react-bootstrap";
import { fetchEmpleados } from "../features/empleadosSlice";
import useAuth from "../hooks/useAuth";
import Pedidos from "./PedidosFolder/Pedidos";
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
      {/* <div className="custom-background">
        <Row>
          <Col xs={6} md={3}>
            <PedidosEstadisticas />
          </Col>
          <Col xs={6} md={3}>
            <ClientesEstadisticas />
          </Col>
          <Col xs={6} md={3}>
            <ChoferEstadisticas />
          </Col>
          <Col xs={6} md={3}>
            <Deudores />
          </Col>
        </Row>
      </div> */}
      <Pedidos />
    </Container>
  );
};

export default Dashboard;
