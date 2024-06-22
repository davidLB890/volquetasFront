import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { getHistoricoCamion } from '../../api';
import { Button, Container, Row, Col } from 'react-bootstrap';

const HistorialCamion = ({ camionId }) => {
  const [asignaciones, setAsicnaciones] = useState('');
  const [mostrar, setMostrar] = useState(false);

  const getToken = useAuth();

/*   useEffect(() => {
    const fetchAsignaciones = async () => {
      const usuarioToken = getToken();
      try {
        const response = await getHistoricoCamion(usuarioToken);
        setAsicnaciones(response.data)
        const choferesFiltrados = empleados.filter(empleado => empleado.rol === "chofer");
        setChoferes(choferesFiltrados);
      } catch (error) {
        console.error("Error al obtener empleados:", error);
      }
    };

    fetchAsignaciones();
  }, [getToken]); */

  const toggleMostrar = () => {
    setMostrar(!mostrar);
  };

  return (
    <Container>
        <Button variant="info" onClick={toggleMostrar} className="mb-3">
            {mostrar ? "Cancelar" : "Historial choferes asignados"}
        </Button>
        {mostrar && (
            <Row className="align-items-end">
                <Col md={8}>
                
                    
                </Col>
            </Row>
        )}
    </Container>
  );
};

export default HistorialCamion;
