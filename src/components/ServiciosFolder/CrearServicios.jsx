import React, { useRef, useState } from "react";
import { postServicio } from "../../api";
import useAuth from "../../hooks/useAuth";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const CrearServicio = ({ idCamion /*, onSuccess */ }) => {
  const tipoRef = useRef(null);
  const fechaRef = useRef(null);
  const precioRef = useRef(null);
  const descripcionRef = useRef(null);

  const [mostrar, setMostrar] = useState(false);
  const [botonHabilitado, setBotonHabilitado] = useState(false);
  const [error, setError] = useState('');
  const getToken = useAuth();

  const crearServicio = async () => {
    const usuarioToken = getToken();
    const camionId = idCamion;
    const tipo = tipoRef.current.value;
    const fecha = fechaRef.current.value;
    const precio = precioRef.current.value;
    const descripcion = descripcionRef.current.value;

    try {
      const response = await postServicio({ camionId, tipo, fecha, precio, descripcion }, usuarioToken);
      const datos = response.data;
      if (datos.error) {
        console.error(datos.error);
        setError('Verifica los datos e intenta nuevamente.');
      } else {
        console.log("Servicio creado correctamente", datos);
        setError('');
        //onSuccess(); // Llama a la función onSuccess proporcionada para manejar el éxito (puede ser recargar datos, etc.)
      }
    } catch (error) {
      console.error('Error al crear el servicio:', error.response?.data || error.message);
      setError('Error al crear el servicio. Por favor, verifica los datos e intenta nuevamente.');
    }
  };

  const habilitarBoton = () => {
    const tipo = tipoRef.current.value;
    const fecha = fechaRef.current.value;
    const precio = precioRef.current.value;
    const descripcion = descripcionRef.current.value;
    setBotonHabilitado(tipo && fecha && precio && descripcion);
  };

  const toggleMostrar = () => {
    setMostrar(!mostrar);
  };

  return (
    <Container>
      <Button variant="info" onClick={toggleMostrar} className="mb-3">
        {mostrar ? "Cancelar" : "Agregar un servicio"}
      </Button>
      {mostrar && (
        <Row className="align-items-end">
          <Col md={8}>
            <Form.Group controlId="tipoServicio">
              <Form.Control
                type="text"
                ref={tipoRef}
                placeholder="Tipo de Servicio"
                onChange={habilitarBoton}
                required
              />
            </Form.Group>
            <Form.Group controlId="fechaServicio" className="mt-3">
              <Form.Control
                type="datetime-local"
                ref={fechaRef}
                placeholder="Fecha"
                onChange={habilitarBoton}
                required
              />
            </Form.Group>
            <Form.Group controlId="precioServicio" className="mt-3">
              <Form.Control
                type="number"
                ref={precioRef}
                placeholder="Precio"
                onChange={habilitarBoton}
                required
              />
            </Form.Group>
            <Form.Group controlId="descripcionServicio" className="mt-3">
              <Form.Control
                as="textarea"
                ref={descripcionRef}
                rows="3"
                placeholder="Descripción"
                onChange={habilitarBoton}
                required
              />
            </Form.Group>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </Col>
          <Col md={4} className="text-md-right">
            <Button
              variant="primary"
              onClick={crearServicio}
              disabled={!botonHabilitado}
              className="mt-3 mt-md-0"
            >
              Crear Servicio
            </Button>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default CrearServicio;





/* import React, { useRef, useState } from "react";
import { postServicio } from "../../api";
import useAuth from "../../hooks/useAuth";
import { Button } from "react-bootstrap";

const CrearServicio = ({ idCamion, onSuccess }) => {
  //const camionRef = useRef(null);
  const tipoRef = useRef(null);
  const fechaRef = useRef(null);
  const precioRef = useRef(null);
  const descripcionRef = useRef(null);

  const [mostrar, setMostrar] = useState(false);
  const [botonHabilitado, setBotonHabilitado] = useState(false);
  const [error, setError] = useState('');
  const getToken = useAuth();

  const crearServicio = async () => {
    const usuarioToken = getToken();
    
    //const camionId = camionRef.current.value;
    const camionId = idCamion;
    const tipo = tipoRef.current.value;
    const fecha = fechaRef.current.value;
    const precio = precioRef.current.value;
    const descripcion = descripcionRef.current.value;

    try {
      const response = await postServicio({ 
        camionId, tipo, fecha, precio, descripcion 
      }, usuarioToken);
      
      const datos = response.data;
      if (datos.error) {
        console.error(datos.error);
        setError('Verifica los datos e intenta nuevamente.');
      } else {
        console.log("Servicio creado correctamente", datos);
        setError('');
        onSuccess(); // Llama a la función onSuccess proporcionada para manejar el éxito (puede ser recargar datos, etc.)
      }
    } catch (error) {
      console.error('Error al crear el servicio:', error.response?.data || error.message);
      setError('Error al crear el servicio. Por favor, verifica los datos e intenta nuevamente.');
    }
  };

  const habilitarBoton = () => {
    //const camion = camionRef.current.value;
    const tipo = tipoRef.current.value;
    const fecha = fechaRef.current.value;
    const precio = precioRef.current.value;
    const descripcion = descripcionRef.current.value;

    setBotonHabilitado(tipo && fecha && precio && descripcion);
  };

  const toggleMostrar = () => {
    setMostrar(!mostrar);
  };


  return (
    
    <div className="card">
      <Button variant="info" onClick={toggleMostrar}>
        {mostrar ? "Cancelar" : "Agregar Servicios"}
      </Button>

      {mostrar && (
      <div className="card-body">

        <div className="form-group">
          <input ref={tipoRef} type="text" className="form-control" placeholder="Tipo de Servicio" onChange={habilitarBoton} required />
        </div>

        <div className="form-group">
          <input ref={fechaRef} type="datetime-local" className="form-control" placeholder="Fecha" onChange={habilitarBoton} required />
        </div>

        <div className="form-group">
          <input ref={precioRef} type="number" className="form-control" placeholder="Precio" onChange={habilitarBoton} required />
        </div>

        <div className="form-group">
          <textarea ref={descripcionRef} className="form-control" rows="3" placeholder="Descripción" onChange={habilitarBoton} required></textarea>
        </div>

        {error && <div className="alert alert-danger" role="alert">{error}</div>}

        <button type="submit" className="btn btn-primary" disabled={!botonHabilitado} onClick={crearServicio}>Crear Servicio</button>
      </div>
      )}
    </div>
  );
};

export default CrearServicio; */
