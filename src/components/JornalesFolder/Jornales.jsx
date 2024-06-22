//Una lista con los empleados ordenados por rol (chofer, recepcionista) 
//Al seleccionar un empleado se vean sus jornales (LISTAjORNALES) por defecto del mes actual
//Opción de elegir un rango de fechas
//dentro de cada empleado un botón para agregar un jornal (AGREGARjORNALES)



import React, { useEffect, useState } from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { obtenerEmpleados } from '../../api';
import ListaJornales from './ListaJornales'; // Asegúrate de importar tu componente ListaJornales

const Jornales = () => {
  const [empleados, setEmpleados] = useState([]);
  const [empleadosPorRol, setEmpleadosPorRol] = useState({});
  const navigate = useNavigate();
  const getToken = useAuth();

  useEffect(() => {
    const fetchEmpleados = async () => {
      const usuarioToken = getToken();
      if (!usuarioToken) {
        navigate('/login');
      } else {
        try {
          const response = await obtenerEmpleados(usuarioToken);
          setEmpleados(response.data);
          agruparEmpleadosPorRol(response.data);
        } catch (error) {
          console.error('Error al obtener empleados:', error.response.data.error);
        }
      }
    };

    fetchEmpleados();
  }, [getToken, navigate]);

  const agruparEmpleadosPorRol = (empleadosData) => {
    const empleadosPorRolTemp = {};
    empleadosData.forEach((empleado) => {
      if (!empleadosPorRolTemp[empleado.rol]) {
        empleadosPorRolTemp[empleado.rol] = [];
      }
      empleadosPorRolTemp[empleado.rol].push({ ...empleado, isSelected: false });
    });
    setEmpleadosPorRol(empleadosPorRolTemp);
  };

  const handleEmpleadoClick = (empleadoId) => {
    const updatedEmpleadosPorRol = { ...empleadosPorRol };

    // Recorrer y actualizar el estado isSelected del empleado seleccionado
    Object.keys(updatedEmpleadosPorRol).forEach((rol) => {
      updatedEmpleadosPorRol[rol] = updatedEmpleadosPorRol[rol].map((empleado) => ({
        ...empleado,
        isSelected: empleado.id === empleadoId ? !empleado.isSelected : false,
      }));
    });

    setEmpleadosPorRol(updatedEmpleadosPorRol);
  };

  return (
    <Container>
      <h1 className="mt-4 mb-4">Jornales de Empleados</h1>
      {Object.keys(empleadosPorRol).map((rol) => (
        <div key={rol}>
          <h2 className="mt-4 mb-3">{rol}</h2>
          <ListGroup>
            {empleadosPorRol[rol].map((empleado) => (
              <React.Fragment key={empleado.id}>
                <ListGroup.Item
                  action
                  onClick={() => handleEmpleadoClick(empleado.id)}
                  active={empleado.isSelected}
                >
                  {empleado.nombre}
                </ListGroup.Item>
                {empleado.isSelected && (
                  <ListGroup.Item>
                    {/* Mostrar los datos adicionales del empleado */}
                    <ListaJornales empleadoId={empleado.id} />
                  </ListGroup.Item>
                )}
              </React.Fragment>
            ))}
          </ListGroup>
        </div>
      ))}
    </Container>
  );
};

export default Jornales;


// Jornales.jsx
/* import React, { useEffect, useState } from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { obtenerEmpleados } from '../../api';
import ListaJornales from './ListaJornales'; // Asegúrate de importar tu componente ListaJornales

const Jornales = () => {
  const [empleados, setEmpleados] = useState([]);
  const [empleadosPorRol, setEmpleadosPorRol] = useState({});
  const [selectedEmpleadoId, setSelectedEmpleadoId] = useState(null);
  const navigate = useNavigate();
  const getToken = useAuth();

  useEffect(() => {
    const fetchEmpleados = async () => {
      const usuarioToken = getToken();
      if (!usuarioToken) {
        navigate('/login');
      } else {
        try {
          const response = await obtenerEmpleados(usuarioToken);
          setEmpleados(response.data);
          agruparEmpleadosPorRol(response.data);
        } catch (error) {
          console.error('Error al obtener empleados:', error.response.data.error);
        }
      }
    };

    fetchEmpleados();
  }, [getToken, navigate]);

  const agruparEmpleadosPorRol = (empleadosData) => {
    const empleadosPorRolTemp = {};
    empleadosData.forEach((empleado) => {
      if (!empleadosPorRolTemp[empleado.rol]) {
        empleadosPorRolTemp[empleado.rol] = [];
      }
      empleadosPorRolTemp[empleado.rol].push(empleado);
    });
    setEmpleadosPorRol(empleadosPorRolTemp);
  };

  const handleEmpleadoClick = (empleadoId) => {
    setSelectedEmpleadoId(empleadoId);
  };

  return (
    <Container>
      <h1 className="mt-4 mb-4">Jornales de Empleados</h1>
      {Object.keys(empleadosPorRol).map((rol) => (
        <div key={rol}>
          <h2 className="mt-4 mb-3">{rol}</h2>
          <ListGroup>
            {empleadosPorRol[rol].map((empleado) => (
              <ListGroup.Item
                key={empleado.id}
                action
                onClick={() => handleEmpleadoClick(empleado.id)}
              >
                {empleado.nombre}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      ))}
      {selectedEmpleadoId && (
        <div className="mt-4">
          {/* Asegúrate de tener el componente ListaJornales para mostrar los jornales 
          <ListaJornales empleadoId={selectedEmpleadoId} />
        </div>
      )}
    </Container>
  );
};

export default Jornales; */


/* // Jornales.jsx
import React, { useEffect, useState } from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { obtenerEmpleados, getJornalesEmpleado } from '../../api';

const Jornales = () => {
  const [empleados, setEmpleados] = useState([]);
  const [empleadosPorRol, setEmpleadosPorRol] = useState({});
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const navigate = useNavigate();
  const getToken = useAuth();

  useEffect(() => {
    const fetchEmpleados = async () => {
      const usuarioToken = getToken();
      if (!usuarioToken) {
        navigate('/login');
      } else {
        try {
          const response = await obtenerEmpleados(usuarioToken);
          setEmpleados(response.data);
          agruparEmpleadosPorRol(response.data);
        } catch (error) {
          console.error('Error al obtener empleados:', error.response.data.error);
        }
      }
    };

    fetchEmpleados();
  }, [getToken, navigate]);

  const agruparEmpleadosPorRol = (empleadosData) => {
    const empleadosPorRolTemp = {};
    empleadosData.forEach((empleado) => {
      if (!empleadosPorRolTemp[empleado.rol]) {
        empleadosPorRolTemp[empleado.rol] = [];
      }
      empleadosPorRolTemp[empleado.rol].push(empleado);
    });
    setEmpleadosPorRol(empleadosPorRolTemp);
  };

  const handleEmpleadoClick = async (empleadoId) => {
    try {
      const response = await getJornalesEmpleado(empleadoId);
      setSelectedEmpleado(response.data);
    } catch (error) {
      console.error('Error al obtener jornales del empleado:', error.response.data.error);
    }
  };

  return (
    <Container>
      <h1 className="mt-4 mb-4">Jornales de Empleados</h1>
      {Object.keys(empleadosPorRol).map((rol) => (
        <div key={rol}>
          <h2 className="mt-4 mb-3">{rol}</h2>
          <ListGroup>
            {empleadosPorRol[rol].map((empleado) => (
              <ListGroup.Item
                key={empleado.id}
                action
                onClick={() => handleEmpleadoClick(empleado.id)}
              >
                {empleado.nombre}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      ))}
      {selectedEmpleado && (
        <div className="mt-4">
          <h2 className="mb-4">Jornales de {selectedEmpleado.nombre}</h2>
          {/* Asegúrate de tener el componente ListaJornales para mostrar los jornales
          {/* <ListaJornales jornales={selectedEmpleado.jornales} /> 
        </div>
      )}
    </Container>
  );
};

export default Jornales; */





/* // Jornales.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Row, Col, Container } from 'react-bootstrap';
import ListaJornales from './ListaJornales';
import useAuth from '../../hooks/useAuth';
import { obtenerEmpleados } from '../../api';

const Jornales = () => {
  const [empleados, setEmpleados] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [fechaFin, setFechaFin] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]);
  const getToken = useAuth();
  let navigate = useNavigate();

  useEffect(() => {
    const fetchEmpleados = async () => {
      const usuarioToken = getToken();
      if (!usuarioToken) {
        navigate('/login');
      } else {
        try {
          const response = await obtenerEmpleados(usuarioToken);
          setEmpleados(response.data);
          agruparEmpleadosPorRol(response.data);
        } catch (error) {
          console.error('Error al obtener empleados:', error.response.data.error);
        }
      }
    };

    fetchEmpleados();
  }, [getToken, navigate]);
  return (
    <Container>
      <Row>
        <Col>
          <h1>Jornales de Empleados</h1>
          <Form>
            <Row>
              <Col>
                <Form.Group controlId="fechaInicio">
                  <Form.Label>Fecha de Inicio</Form.Label>
                  <Form.Control
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="fechaFin">
                  <Form.Label>Fecha de Fin</Form.Label>
                  <Form.Control
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
          {empleados.map((empleado) => (
            <ListaJornales
              key={empleado.id}
              empleadoId={empleado.id}
              fechaInicio={fechaInicio}
              fechaFin={fechaFin}
            />
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default Jornales; */









/* // Jornales.jsx
import React, { useEffect, useState } from 'react';
import { Container, ListGroup, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { obtenerEmpleados } from '../../api';
import ListaJornales from './ListaJornales'; // Asegúrate de importar el componente

const Jornales = () => {
  const [empleados, setEmpleados] = useState([]);
  const [empleadosPorRol, setEmpleadosPorRol] = useState({});
  const [selectedEmpleadoId, setSelectedEmpleadoId] = useState(null);
  const [fechaInicio, setFechaInicio] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [fechaFin, setFechaFin] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]);
  const navigate = useNavigate();
  const getToken = useAuth();

  useEffect(() => {
    const fetchEmpleados = async () => {
      const usuarioToken = getToken();
      if (!usuarioToken) {
        navigate('/login');
      } else {
        try {
          const response = await obtenerEmpleados(usuarioToken);
          setEmpleados(response.data);
          agruparEmpleadosPorRol(response.data);
        } catch (error) {
          console.error('Error al obtener empleados:', error.response.data.error);
        }
      }
    };

    fetchEmpleados();
  }, [getToken, navigate]);

  const agruparEmpleadosPorRol = (empleadosData) => {
    const empleadosPorRolTemp = {};
    empleadosData.forEach((empleado) => {
      if (!empleadosPorRolTemp[empleado.rol]) {
        empleadosPorRolTemp[empleado.rol] = [];
      }
      empleadosPorRolTemp[empleado.rol].push(empleado);
    });
    setEmpleadosPorRol(empleadosPorRolTemp);
  };

  const handleEmpleadoClick = (empleadoId) => {
    setSelectedEmpleadoId(empleadoId);
  };

  const handleFechaChange = (e) => {
    const { name, value } = e.target;
    if (name === 'fechaInicio') {
      setFechaInicio(value);
    } else {
      setFechaFin(value);
    }
  };

  return (
    <Container>
      <h1 className="mt-4 mb-4">Jornales de Empleados</h1>
      <Form className="mb-4">
        <Form.Group controlId="fechaInicio" className="mb-3">
          <Form.Label>Fecha Inicio</Form.Label>
          <Form.Control
            type="date"
            name="fechaInicio"
            value={fechaInicio}
            onChange={handleFechaChange}
          />
        </Form.Group>
        <Form.Group controlId="fechaFin" className="mb-3">
          <Form.Label>Fecha Fin</Form.Label>
          <Form.Control
            type="date"
            name="fechaFin"
            value={fechaFin}
            onChange={handleFechaChange}
          />
        </Form.Group>
      </Form>
      {Object.keys(empleadosPorRol).map((rol) => (
        <div key={rol}>
          <h2 className="mt-4 mb-3">{rol}</h2>
          <ListGroup>
            {empleadosPorRol[rol].map((empleado) => (
              <ListGroup.Item
                key={empleado.id}
                action
                onClick={() => handleEmpleadoClick(empleado.id)}
              >
                {empleado.nombre}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      ))}
      {selectedEmpleadoId && (
        <div className="mt-4">
          <h2 className="mb-4">Jornales del Empleado Seleccionado</h2>
          <ListaJornales
            empleadoId={selectedEmpleadoId}
            fechaInicio={fechaInicio}
            fechaFin={fechaFin}
          />
        </div>
      )}
    </Container>
  );
};

export default Jornales; */










/* // Jornales.jsx
import React, { useEffect, useState } from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { obtenerEmpleados, getJornalesEmpleado } from '../../api';

const Jornales = () => {
  const [empleados, setEmpleados] = useState([]);
  const [empleadosPorRol, setEmpleadosPorRol] = useState({});
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const navigate = useNavigate();
  const getToken = useAuth();

  useEffect(() => {
    const fetchEmpleados = async () => {
      const usuarioToken = getToken();
      if (!usuarioToken) {
        navigate('/login');
      } else {
        try {
          const response = await obtenerEmpleados(usuarioToken);
          setEmpleados(response.data);
          agruparEmpleadosPorRol(response.data);
        } catch (error) {
          console.error('Error al obtener empleados:', error.response.data.error);
        }
      }
    };

    fetchEmpleados();
  }, [getToken, navigate]);

  const agruparEmpleadosPorRol = (empleadosData) => {
    const empleadosPorRolTemp = {};
    empleadosData.forEach((empleado) => {
      if (!empleadosPorRolTemp[empleado.rol]) {
        empleadosPorRolTemp[empleado.rol] = [];
      }
      empleadosPorRolTemp[empleado.rol].push(empleado);
    });
    setEmpleadosPorRol(empleadosPorRolTemp);
  };

  const handleEmpleadoClick = async (empleadoId) => {
    try {
      const response = await getJornalesEmpleado(empleadoId);
      setSelectedEmpleado(response.data);
    } catch (error) {
      console.error('Error al obtener jornales del empleado:', error.response.data.error);
    }
  };

  return (
    <Container>
      <h1 className="mt-4 mb-4">Jornales de Empleados</h1>
      {Object.keys(empleadosPorRol).map((rol) => (
        <div key={rol}>
          <h2 className="mt-4 mb-3">{rol}</h2>
          <ListGroup>
            {empleadosPorRol[rol].map((empleado) => (
              <ListGroup.Item
                key={empleado.id}
                action
                onClick={() => handleEmpleadoClick(empleado.id)}
              >
                {empleado.nombre}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      ))}
      {selectedEmpleado && (
        <div className="mt-4">
          <h2 className="mb-4">Jornales de {selectedEmpleado.nombre}</h2>
          /* Asegúrate de tener el componente ListaJornales para mostrar los jornales */
          /* <ListaJornales jornales={selectedEmpleado.jornales} /> 
        </div>
      )}
    </Container>
  );
};

export default Jornales; */






// Jornales.jsx
/* import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { obtenerEmpleados, getJornalesEmpleado } from '../../api';
import ListaJornales from './ListaJornales';

const Jornales = () => {
  const [empleados, setEmpleados] = useState([]);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const navigate = useNavigate();
  const getToken = useAuth();

  useEffect(() => {
    const fetchEmpleados = async () => {
      const usuarioToken = getToken();
      if (!usuarioToken) {
        navigate('/login');
      } else {
        try {
          const response = await obtenerEmpleados(usuarioToken);
          setEmpleados(response.data);
        } catch (error) {
          console.error('Error al obtener empleados:', error.response.data.error);
        }
      }
    };

    fetchEmpleados();
  }, [getToken, navigate]);

  const handleEmpleadoClick = async (empleadoId) => {
    try {
      const response = await getJornalesEmpleado(empleadoId);
      setSelectedEmpleado(response.data);
    } catch (error) {
      console.error('Error al obtener jornales del empleado:', error.response.data.error);
    }
  };

  return (
    <Container>
      <h1 className="mt-4 mb-4">Jornales de Empleados</h1>
      <Row>
        {empleados.map((empleado) => (
          <Col key={empleado.id} lg={4} md={6} sm={12} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{empleado.nombre}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{empleado.rol}</Card.Subtitle>
                <Button variant="primary" onClick={() => handleEmpleadoClick(empleado.id)}>Ver Jornales</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {selectedEmpleado && (
        <div className="mt-4">
          <h2 className="mb-4">Jornales de {selectedEmpleado.nombre}</h2>
          <ListaJornales jornales={selectedEmpleado.jornales} />
        </div>
      )}
    </Container>
  );
};

export default Jornales; */









/* import React, { useEffect, useState } from 'react';
import { Table, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { obtenerEmpleados } from '../../api';
import ListaJornales from './ListaJornales';

const Jornales = () => {
  const [empleados, setEmpleados] = useState([]);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const navigate = useNavigate();
  const getToken = useAuth();

  useEffect(() => {
    const usuarioToken = getToken();
    if (!usuarioToken) {
      navigate("/login");
    } else {
      try {
        obtenerEmpleados(usuarioToken)
          .then((response) => {
            const empleados = response.data;
            const empleadosOrdenados = empleados.sort((a, b) => a.rol.localeCompare(b.rol));
            setEmpleados(empleadosOrdenados);
          })
          .catch((error) => {
            console.error("Error al obtener usuarios:", error.response.data.error);
          });
      } catch (error) {
        console.error("Error al obtener usuarios:", error.response.data.error);
        if (error.status === 401) {
          navigate("/login");
        }
      }
    }
  }, [getToken, navigate]);

  const roles = Array.from(new Set(empleados.map(empleado => empleado.rol)));

  return (
    <Container>
      <h1>Jornales</h1>
      {roles.map(rol => (
        <div key={rol}>
          <h2>{rol.charAt(0).toUpperCase() + rol.slice(1)}s</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nombre</th>
              </tr>
            </thead>
            <tbody>
              {empleados
                .filter(empleado => empleado.rol === rol)
                .map((empleado) => (
                  <tr key={empleado.id}>
                    <td
                      style={{ cursor: 'pointer', color: 'blue' }}
                      onClick={() => setSelectedEmpleado(empleado.id)}
                    >
                      {empleado.nombre}
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      ))}
      {selectedEmpleado && <ListaJornales empleadoId={selectedEmpleado} />}
    </Container>
  );
};

export default Jornales; */





//dentro de cada jornal un botón para agregar un viaje (de a 0.5) FALSISIMO PORQUE ES AUTOMÁTICO CON LOS PEDIDOS