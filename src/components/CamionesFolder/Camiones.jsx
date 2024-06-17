
import React, { useEffect, useState } from 'react';
import { deleteCamion, putCamion, getCamiones, } from '../../api';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import useAuth from '../../hooks/useAuth';

const Camiones = () => {
  const [camiones, setCamiones] = useState([]);
  const [cambios, setCambios] = useState(true);
  const [filtroMatricula, setFiltroMatricula] = useState('');
  const [filtroModelo, setFiltroModelo] = useState('');
  const [editandoCamion, setEditandoCamion] = useState(null); // Nuevo estado para editar
  const [formValues, setFormValues] = useState({ matricula: '', modelo: '', anio: '', estado: '' }); // Valores del formulario

  let navigate = useNavigate();
  const getToken = useAuth();
  //let usuarioToken = localStorage.getItem('apiToken');

  useEffect(() => {
    const usuarioToken = getToken();
    if (usuarioToken === null) {
      navigate("/login");
    } else {
      // Realiza la solicitud para obtener los empleados
      if(cambios) {
        try {
            getCamiones(usuarioToken)
            .then((response) => {
            const camiones = response.data;
            setCamiones(camiones);
            setCambios(false);
          })
          .catch((error) => {
            console.error("Error al  camiones:", error.response.data.error);
            if(error.response.status === 401) {  
                navigate("/login");
            }
        });
        } catch (error) {
          console.error("Error al obtener :", error.response.data.error);
          if(error.status === 401) {  
            navigate("/login");
          }
        }
      }
      
    }
  }, [cambios, getToken]);

  const eliminar = async (camionId) => {
    const usuarioToken = getToken();

    deleteCamion(camionId, usuarioToken)
    .then((response) => {
      const datos = response.data;
      if (datos.error) {
          console.error(datos.error);
      } else {
          console.log(datos);
          setCambios(true);
      }
      })
      .catch((error) => {
      console.error("Error al conectar con el servidor:", error.response.data.error);
      });
  };  


  const cambiar = (camion) => {
    setEditandoCamion(camion.id);
    setFormValues({ matricula: camion.matricula, modelo: camion.modelo, anio: camion.anio, estado: camion.estado });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const aceptarCambio = async () => {
    const usuarioToken = getToken();
    try {
      const response = await putCamion(editandoCamion, formValues, usuarioToken); // Asegúrate de tener esta función en tu API
      setCambios(true);
      setEditandoCamion(null);

      const datos = response.data;

      console.log(datos);
    } catch (error) {
      console.error("Error al actualizar el camión:", error.response.data.error );
    }
  };

  const cancelarCambio = () => {
    setEditandoCamion(null);
  };

  const camionesFiltrados = camiones.filter((camion) => {
    return (
      (filtroMatricula === '' || camion.matricula.toLowerCase().startsWith(filtroMatricula.toLowerCase())) &&
      (filtroModelo === '' || camion.modelo.toString().startsWith(filtroModelo))
    );
  });

  return (
    <div className="container">
      <h1>Lista de Camiones</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Matricula</th>
            <th scope="col">Modelo</th>
            <th scope="col">Año</th>
            <th scope="col">Estado</th>
            <th scope="col">Acciones</th>
          </tr>
          <tr>
            <th></th>
            <th>
              <Form.Control
                type="text"
                placeholder="Filtrar por Matricula"
                value={filtroMatricula}
                onChange={(e) => setFiltroMatricula(e.target.value)}
              />
            </th>
            <th>
              <Form.Control
                type="text"
                placeholder="Filtrar por Modelo"
                value={filtroModelo}
                onChange={(e) => setFiltroModelo(e.target.value)}
              >
              </Form.Control>
            </th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {camionesFiltrados.map((camion, index) => (
            <tr key={camion.id}>
              <th scope="row">{index + 1}</th>
              <td>
                {editandoCamion === camion.id ? (
                  <Form.Control
                    type="text"
                    name="matricula"
                    value={formValues.matricula}
                    onChange={handleInputChange}
                  />
                ) : (
                  camion.matricula
                )}
              </td>
              <td>
                {editandoCamion === camion.id ? (
                  <Form.Control
                    type="text"
                    name="modelo"
                    value={formValues.modelo}
                    onChange={handleInputChange}
                  />
                ) : (
                  camion.modelo
                )}
              </td>
              <td>
                {editandoCamion === camion.id ? (
                  <Form.Control
                    type="text"
                    name="anio"
                    value={formValues.anio}
                    onChange={handleInputChange}
                  />
                ) : (
                  camion.anio
                )}
              </td>
              <td>
                {editandoCamion === camion.id ? (
                  <Form.Control
                    type="text"
                    name="estado"
                    value={formValues.estado}
                    onChange={handleInputChange}
                  />
                ) : (
                  camion.estado
                )}
              </td>
              <td>
                {editandoCamion === camion.id ? (
                  <>
                    <Button variant="success" onClick={aceptarCambio}>Aceptar</Button>
                    <Button variant="secondary" onClick={cancelarCambio}>Cancelar</Button>
                  </>
                ) : (
                  <>
                    <Button variant="danger" onClick={() => eliminar(camion.id)}>Eliminar</Button>
                    <Button variant="primary" onClick={() => cambiar(camion)}>Cambiar</Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Camiones;


/* const Camiones = () => {
  const [empleados, setEmpleados] = useState([]);
  const [camiones, setCamiones] = useState([]);
  const [cambios, setCambios] = useState(true);
  const [filtroMatricula, setFiltroMatricula] = useState('');
  const [filtroModelo, setFiltroModelo] = useState('');

  let navigate = useNavigate();

  let usuarioToken = localStorage.getItem('apiToken');

  useEffect(() => {
    // Verifica el token al montar el componente
    if (usuarioToken === null) {
      navigate("/login");
    } else {
      // Realiza la solicitud para obtener los empleados
      if(cambios) {
        try {
            getCamiones(usuarioToken)
          .then((response) => {
            const camiones = response.data;
            setCamiones(camiones);
            setCambios(false);
          })
          .catch((error) => {
            console.error("Error al obtener usuarios:", error.response.data.error);
        });
        } catch (error) {
          console.error("Error al obtener usuarios:", error.response.data.error);
          if(error.status === 401) {  
            navigate("/login");
          }
        }
      }
      
    }
  }, [cambios]);

  const eliminar = async (camionId) => {

    deleteCamion(camionId, usuarioToken)
    .then((response) => {
      const datos = response.data;
      if (datos.error) {
          console.error(datos.error);
      } else {
          console.log(datos);
          setCambios(true);
      }
      })
      .catch((error) => {
      console.error("Error al conectar con el servidor:", error.response.data.error);
      });
  };  

  const cambiar = async (camionId) => {

    let camion = camiones.find((cam) => cam.id === camionId)

 /*    try {
      const response = await putCamion(camionId, empleado, usuarioToken);
      const datos = response.data;

       if (datos.error) {
        console.error(datos.error);
      } else {
        console.log(datos);
        setCambios(true);
      }

    } catch (error) {
      console.error("Error al cambiar estado del empleado:", error.data.error);
      if(error.status === 401) {  // Unauthorized (no autorizado)
        navigate("/login");
      }
      };  
      
      // Función para filtrar los empleados
      const camionesFiltrados = camiones.filter((camion) => {
        return (
            (filtroMatricula === '' || camion.matricula.toLowerCase().startsWith(filtroMatricula.toLowerCase())) &&
            (filtroModelo === '' || camion.modelo.toString().startsWith(filtroModelo))
            );
            });
            
            return (
                <div className="container">
                <h1>Lista de Camiones</h1>
                <table className="table table-striped">
                <thead>
                <tr>
                <th scope="col"></th>
                <th scope="col">Matricula</th>
                <th scope="col">Modelo</th>
                <th scope="col">Estado</th>
                <th scope="col">Año</th>
                <th scope="col">Acciones</th>
                </tr>
                <tr>
                <th></th>
                <th>
                <Form.Control
                type="text"
                placeholder="Filtrar por Matricula"
                value={filtroMatricula}
                onChange={(e) => setFiltroMatricula(e.target.value)}
                />
                </th>
                <th>
                <Form.Control
                type="text"
                placeholder="Filtrar por Modelo"
                value={filtroModelo}
                onChange={(e) => setFiltroModelo(e.target.value)}
                >
                </Form.Control>
                </th>
                <th></th>
                <th></th>
                <th></th>
          </tr>
        </thead>
        <tbody>
        {camionesFiltrados.map((camion, index) => (
            <tr key={camion.id}>
            <th scope="row">{index + 1}</th>
            <td>{camion.matricula}</td>
            <td>{camion.modelo}</td>
            <td>{camion.anio}</td>
            <td>{camion.estado}</td>
            <td>
            <Button variant="danger" onClick={() => eliminar(camion.id)}>
            Eliminar
            </Button>
            <Button variant="danger" onClick={() => cambiar(camion.id)}>
            Cambiar
            </Button>
            </td>
            </tr>
            ))}
            </tbody>
            </table>
            </div>
            );
            };
            
            export default Camiones;
            
}  */