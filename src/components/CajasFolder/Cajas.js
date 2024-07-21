import React, { useEffect, useState } from 'react';
import { Container, ListGroup, Form, Button, Col, ButtonGroup, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { obtenerCajas } from '../../api';
import Lista from './ListaCajas';

const Cajas = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [datos, setDatos] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const getToken = useAuth();

  useEffect(() => {
    const { inicio, fin } = mes();
    fetchCajas(inicio, fin);
  }, [getToken, navigate]);

  const mes = () => {
    const today = new Date();
    const inicio = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const fin = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
    setFechaInicio(inicio);
    setFechaFin(fin);
    return { inicio, fin };
  };
  const fetchCajas = async (inicio, fin) => {
    const usuarioToken = getToken();
    if (!usuarioToken) {
      navigate('/login');
    } else {
      try {
        let response;
        if (inicio && fin) {
          console.log('a', inicio, fin);
          response = await obtenerCajas(inicio, fin, usuarioToken);
        } else {
          response = await obtenerCajas(fechaInicio, fechaFin, usuarioToken);
        }
        console.log(response);
        const datosDeCaja = response.data;
        setDatos(datosDeCaja);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener Cajas:', error.response.data.error);
        setLoading(false);
      }
    }
  };

  return (
    <Container>
      <Container className="card mb-4">
        <div className="row">
          <h2 className="col mt-4 mb-4">Entradas y Salidas</h2>
          <div className="col">
            <Button className="mt-4" variant="primary" onClick={''}>
              Nueva Entrada
            </Button>
          </div>
        </div>
        <Form className="mb-4">
          <div className="row">
            <div className="col">
              <Form.Group controlId="fechaInicio">
                <Form.Label>Fecha de Inicio</Form.Label>
                <Form.Control type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
              </Form.Group>
            </div>
            <div className="col">
              <Form.Group controlId="fechaFin">
                <Form.Label>Fecha de Fin</Form.Label>
                <Form.Control type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
              </Form.Group>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col">
              <Form.Group>
                <Button type="button" onClick={(e) => fetchCajas(fechaInicio, fechaFin)}>
                  Traer
                </Button>
              </Form.Group>
            </div>
          </div>
        </Form>
      </Container>

      {!loading ? <Lista data={datos} /> : <Spinner animation="border" />}
    </Container>
  );
};

export default Cajas;
