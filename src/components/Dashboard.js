// src/components/Dashboard.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button, Container } from 'react-bootstrap';
import { fetchEmpleados } from '../features/empleadosSlice';
import useAuth from '../hooks/useAuth';

const Dashboard = () => {
  const navigate = useNavigate();
  const getToken = useAuth();

  useEffect(() => {
    const usuarioToken = getToken();
    if (!usuarioToken) {
      navigate('/login');
    } 
  }, [navigate, getToken]);

  const handleAgregarPedido = () => {
    navigate('/pedidos/crear');
  };

  return (
    <Container>
      <h1>Pedidos</h1>
      <Button variant="primary" onClick={handleAgregarPedido}>
        Agregar Nuevo Pedido
      </Button>
    </Container>
  );
};

export default Dashboard;
