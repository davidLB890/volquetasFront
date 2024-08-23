import React, { useRef, useState } from "react";
import { postServicio } from "../../api";
import useAuth from "../../hooks/useAuth";
import useHabilitarBoton from "../../hooks/useHabilitarBoton";
import { Modal, Form, Button } from "react-bootstrap";
import AgregarSalidaCaja from "../CajasFolder/AgregarSalidaCaja"; // Importa el nuevo componente

const MAX_LENGTH = 255;

const AgregarServicio = ({ idCamion, onSuccess, show, onHide }) => {
  const tipoRef = useRef(null);
  const fechaRef = useRef(null);
  const monedaRef = useRef(null);
  const precioRef = useRef(null);
  const descripcionRef = useRef(null);

  const [error, setError] = useState('');
  const [servicioAgregado, setServicioAgregado] = useState(false);
  const [agregarCaja, setAgregarCaja] = useState(false);
  const [servicioData, setServicioData] = useState({});
  const getToken = useAuth();

  const refs = [tipoRef, fechaRef, monedaRef, precioRef ];
  const botonHabilitado = useHabilitarBoton(refs);

  const handleAgregarServicio = async () => {
    const usuarioToken = getToken();
    const tipo = tipoRef.current.value;
    const fecha = fechaRef.current.value;
    const moneda = monedaRef.current.value;
    const precio = parseFloat(precioRef.current.value);
    const descripcion = descripcionRef.current.value;

    if (tipo.length > MAX_LENGTH || descripcion.length > MAX_LENGTH) {
      setError('Los campos no pueden exceder los 255 caracteres.');
      return;
    }

    try {
      const response = await postServicio(
        {
          camionId: idCamion,
          tipo,
          fecha,
          moneda,
          precio,
          descripcion,
        },
        usuarioToken
      );
      const datos = response.data;
      if (datos.error) {
        console.error(datos.error);
        setError('Verifica los datos e intenta nuevamente.');
      } else {
        console.log("Servicio creado correctamente", datos);
        setError('');
        setServicioAgregado(true); // Indica que el servicio fue agregado
        setServicioData({ fecha, monto: precio, moneda }); // Guarda los datos del servicio
      }
    } catch (error) {
      console.error('Error al crear el servicio:', error.response?.data || error.message);
      setError('Error al crear el servicio. Por favor, verifica los datos e intenta nuevamente.');
    }
  };

  const handleDecisionCaja = (decision) => {
    if (decision === 'si') {
      setAgregarCaja(true); // Mostrar los campos para agregar salida de caja
    } else {
      onHide(); // Cerrar el modal si se selecciona "No"
    }
  };

  const handleAgregarCajaSuccess = () => {
    onSuccess(); // Recargar datos, etc.
    onHide(); // Cerrar el modal después de agregar la salida de caja
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar un servicio</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}

        {!servicioAgregado && (
          <Form>
            <Form.Group controlId="tipoServicio">
              <Form.Label>Tipo de Servicio</Form.Label>
              <Form.Select ref={tipoRef} required>
                <option value="">Seleccione un tipo de servicio</option>
                <option value="arreglo">Arreglo</option>
                <option value="service">Service</option>
                <option value="chequeo">Chequeo</option>
                <option value="pintura">Pintura</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="fechaServicio">
              <Form.Label>Fecha</Form.Label>
              <Form.Control type="datetime-local" ref={fechaRef} required />
            </Form.Group>
            <Form.Group controlId="monedaServicio">
              <Form.Label>Moneda</Form.Label>
              <Form.Select ref={monedaRef} required>
                <option value="">Moneda</option>
                <option value="peso">UYU</option>
                <option value="dolar">U$D</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="precioServicio">
              <Form.Label>Precio</Form.Label>
              <Form.Control type="number" ref={precioRef} required />
            </Form.Group>
            <Form.Group controlId="descripcionServicio">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" ref={descripcionRef} rows="3" required />
            </Form.Group>
          </Form>
        )}

        {servicioAgregado && !agregarCaja && (
          <div>
            <p>¿Desea agregar una salida de caja para este servicio?</p>
            <Button variant="primary" onClick={() => handleDecisionCaja('si')}>
              Sí
            </Button>
            <Button variant="secondary" onClick={() => handleDecisionCaja('no')}>
              No
            </Button>
          </div>
        )}

        {agregarCaja && (
          <AgregarSalidaCaja
            fecha={servicioData.fecha}
            monto={servicioData.monto}
            moneda={servicioData.moneda}
            onSuccess={handleAgregarCajaSuccess}
            onHide={onHide}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        {!servicioAgregado && (
          <Button variant="primary" onClick={handleAgregarServicio} disabled={!botonHabilitado}>
            Crear Servicio
          </Button>
        )}
        {servicioAgregado && !agregarCaja && (
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default AgregarServicio;