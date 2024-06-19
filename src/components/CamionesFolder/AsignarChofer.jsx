import React, { useRef, useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { postHistoricoCamion, obtenerEmpleados } from '../../api';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const AsignarChofer = ({ camionId }) => {
  const [choferIdSeleccionado, setChoferIdSeleccionado] = useState('');
  const [choferes, setChoferes] = useState([]);
  const [botonAsignar, setBotonAsignar] = useState(false);
  const [mostrar, setMostrar] = useState(false);

  const getToken = useAuth();
  const choferIdRef = useRef();
  const fechaInicioRef = useRef();

  useEffect(() => {
    const fetchEmpleados = async () => {
      const usuarioToken = getToken();
      try {
        const response = await obtenerEmpleados(usuarioToken);
        const empleados = response.data;
        const choferesFiltrados = empleados.filter(empleado => empleado.rol === "chofer");
        setChoferes(choferesFiltrados);
      } catch (error) {
        console.error("Error al obtener empleados:", error);
      }
    };

    fetchEmpleados();
  }, [getToken]);

  useEffect(() => {
    // Verificar si hay un chofer seleccionado para habilitar el botón
    setBotonAsignar(choferIdSeleccionado !== "");
  }, [choferIdSeleccionado]);

  const handleAsignarChofer = async () => {
    const usuarioToken = getToken();
    try {
      const response = await postHistoricoCamion(camionId, choferIdRef.current.value, fechaInicioRef.current.value ,usuarioToken);
      const datos = response.data;
      if (datos.error) {
        console.error(datos.error);
      } else {
        console.log("Chofer asignado correctamente", datos);
      }
    } catch (error) {
      console.error("Error al asignar chofer:", error.response.data.error);
    }
  };

  const toggleMostrar = () => {
    setMostrar(!mostrar);
  };

  return (
    <Container>
        <Button variant="info" onClick={toggleMostrar} className="mb-3">
            {mostrar ? "Cancelar" : "Asignar un chofer"}
        </Button>
        {mostrar && (
            <Row className="align-items-end">
                <Col md={8}>
                <Form.Group controlId="selectChofer">
                    <Form.Control
                    as="select"
                    ref={choferIdRef}
                    value={choferIdSeleccionado}
                    onChange={(e) => setChoferIdSeleccionado(e.target.value)}
                    >
                    <option value="">Seleccionar Chofer</option>
                    {choferes.map((chofer) => (
                        <option key={chofer.id} value={chofer.id}>
                        {chofer.nombre}
                        </option>
                    ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="fechaInicio">
                    <Form.Control
                    type="datetime-local"
                    ref={fechaInicioRef}
                    className="form-control"
                    placeholder="Fecha"
                    required
                    />
                </Form.Group>
                </Col>
                <Col md={4} className="text-md-right">
                <Button
                    variant="primary"
                    onClick={handleAsignarChofer}
                    disabled={!botonAsignar}
                    className="mt-3 mt-md-0"
                >
                    Asignar
                </Button>
                </Col>
            </Row>
        )}
    </Container>
  );
};

export default AsignarChofer;
