import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Spinner, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { obtenerCajas } from '../../api';
import Lista from './ListaCajas';
import AgregarEntrada from './AgregarEntrada';
import { useSelector, useDispatch } from 'react-redux';
import { setCajas } from '../../features/cajasSlice';  // Asegúrate de que la ruta sea correcta


const Cajas = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModalAgregar, setShowModalAgregar] = useState(false);
  const navigate = useNavigate();
  const getToken = useAuth();
  const dispatch = useDispatch();

  // Obtén los datos de cajas desde el store de Redux
  const datos = useSelector(state => state.cajas);

  useEffect(() => {
    const usuarioToken = getToken();
    if (!usuarioToken) {
      navigate('/login');
    } else {
      const { inicio, fin } = mes();
      fetchCajas(inicio, fin);
    }
  }, []); 

  const mes = () => {
    const today = new Date();
    const inicio = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const fin = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
    setFechaInicio(inicio);
    setFechaFin(fin);
    return { inicio, fin };
  };

  const fetchCajas = async (inicio = fechaInicio, fin = fechaFin) => {
    //console.log('fetchCajas', inicio, fin);
    const usuarioToken = getToken();
    if (!usuarioToken) {
      navigate('/login');
    } else {
      try {
        const response = await obtenerCajas(inicio, fin, usuarioToken);
        //console.log('Cajas:', response.data);
        const datosDeCaja = response.data;
        //console.log('Datos de Caja:', datosDeCaja.cajas);
        //console.log('contadorMotivos', datosDeCaja.datos);
        // Despacha la acción para actualizar las cajas en el store de Redux
        dispatch(setCajas({
          cajas: datosDeCaja.cajas || [],
          datos: {
            contadorMotivos: datosDeCaja.datos.contadorMotivos || {},
            montoPeso: datosDeCaja.datos.montoPeso || 0,
            montoDolar: datosDeCaja.datos.montoDolar || 0,
          }
        }));
      } catch (error) {
        console.error('Error al obtener Cajas:', error.response?.data?.error || error.message);
      } finally {
        setLoading(false); // Asegúrate de ocultar el spinner incluso si hay un error
      }
    }
  };

  

  const handleShowModalAgregar = () => setShowModalAgregar(true);
  const handleCloseModalAgregar = () => setShowModalAgregar(false);
  
  const handleAgregarSuccess = () => {
    handleCloseModalAgregar();
    fetchCajas();
  };

  return (
    <Container>
      <Container className="card mb-4">
        <div className="row">
          <h2 className="col mt-4 mb-4">Entradas y Salidas</h2>
          <div className="col">
            <Button className="mt-4" variant="primary" onClick={handleShowModalAgregar}>
              Nueva Entrada
            </Button>
          </div>
        </div>
        <Form className="mb-4">
          <div className="row">
            <div className="col">
              <Form.Group controlId="fechaInicio">
                <Form.Label>Traer Registros Desde:</Form.Label>
                <Form.Control type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
              </Form.Group>
            </div>
            <div className="col">
              <Form.Group controlId="fechaFin">
                <Form.Label>Traer Registros Hasta:</Form.Label>
                <Form.Control type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
              </Form.Group>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col">
              <Form.Group>
                <Button type="button" onClick={() => fetchCajas(fechaInicio, fechaFin)}>
                  Traer
                </Button>
              </Form.Group>
            </div>
          </div>
        </Form>
      </Container>

      <Modal show={showModalAgregar} onHide={handleCloseModalAgregar} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nueva Entrada</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AgregarEntrada onSuccess={handleAgregarSuccess} onHide={handleCloseModalAgregar} />
        </Modal.Body>
      </Modal>

      {!loading ? <Lista data={datos} /> : <Spinner animation="border" />}
    </Container>
  );

};

export default Cajas;
