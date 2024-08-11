import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import DeudoresEstadisticas from "./DeudoresEstadisticas";
import PedidosEstadisticas from "./PedidosEstadisticas";
import ClientesEstadisticas from "./ClientesEstadisticas";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Estadisticas = () => {

    const getToken = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        let usuarioToken = getToken();
        if(!usuarioToken){
            navigate('/login');
        }
    }, [getToken]);

  return (
    <Container>
      <div>
        <h1>Estadísticas</h1>
      </div>
      <Row>
        <Col>
          <DeudoresEstadisticas />
        </Col>
        <Col>
          <PedidosEstadisticas />
        </Col>
      </Row>
      <Row>
        <Col>
          <ClientesEstadisticas />
        </Col>
      </Row>
    </Container>
  );
};

export default Estadisticas;
