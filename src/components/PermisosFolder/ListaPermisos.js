import React, { useEffect, useState } from "react";
import {
  Table,
  Spinner,
  Alert,
  Button,
  Collapse,
  Card,
  Container,
  Modal,
} from "react-bootstrap";
import { getPermisoIdEmpresa, getPermisoIdParticular } from "../../api"; // Ajusta la ruta según sea necesario
import useAuth from "../../hooks/useAuth";
import moment from "moment";
import AgregarPermiso from "./AgregarPermiso"; // Ajusta la ruta según sea necesario
import ModificarPermiso from "./ModificarPermiso"; // Ajusta la ruta según sea necesario

const ListaPermisos = ({ empresaId, particularId }) => {
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false); // Estado para manejar el despliegue
  const [showAgregarPermiso, setShowAgregarPermiso] = useState(false); // Estado para manejar el modal de agregar permiso
  const [showModificarPermiso, setShowModificarPermiso] = useState(false); // Estado para manejar el modal de modificar permiso
  const [permisoSeleccionado, setPermisoSeleccionado] = useState(null);
  const getToken = useAuth();

  useEffect(() => {
    const fetchPermisos = async () => {
      const usuarioToken = getToken();
      try {
        let response;
        if (empresaId) {
          response = await getPermisoIdEmpresa(empresaId, usuarioToken); // Agrega 'true' para el parámetro 'activo'
        } else if (particularId) {
          response = await getPermisoIdParticular(particularId, usuarioToken); // Agrega 'true' para el parámetro 'activo'
        } else {
          setError("No se ha proporcionado un ID de empresa o particular.");
          setLoading(false);
          return;
        }
        setPermisos(response.data);
        setLoading(false);
      } catch (error) {
        console.error(
          "Error al obtener los permisos:",
          error.response?.data?.error || error.message
        );
        setError("Error al obtener los permisos");
        setLoading(false);
      }
    };

    fetchPermisos();
  }, [empresaId, particularId, getToken]);

  const handlePermisoAgregado = (nuevoPermiso) => {
    setPermisos((prevPermisos) => [...prevPermisos, nuevoPermiso]);
    setShowAgregarPermiso(false); // Cierra el modal después de agregar
  };

  const handlePermisoModificado = (permisoModificado) => {
    setPermisos((prevPermisos) =>
      prevPermisos.map((permiso) =>
        permiso.id === permisoModificado.id ? permisoModificado : permiso
      )
    );
    setShowModificarPermiso(false); // Cierra el modal después de modificar
  };

  const handleModificarPermiso = (permiso) => {
    setPermisoSeleccionado(permiso);
    setShowModificarPermiso(true);
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container className="card">
      <Button
        onClick={() => setOpen(!open)}
        aria-controls="lista-permisos-collapse"
        aria-expanded={open}
        className="mb-3"
        
      >
        Lista de permisos
      </Button>
      <Collapse in={open}>
        <div id="lista-permisos-collapse">
          <Card>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha de Creación</th>
                    <th>Fecha de Vencimiento</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {permisos.map((permiso) => (
                    <tr
                      key={permiso.id}
                      style={{
                        backgroundColor: moment().isAfter(
                          moment(permiso.fechaVencimiento)
                        )
                          ? "red"
                          : "white",
                        color: moment().isAfter(
                          moment(permiso.fechaVencimiento)
                        )
                          ? "white"
                          : "black",
                      }}
                    >
                      <td>{permiso.id}</td>
                      <td>
                        {moment(permiso.fechaCreacion).format("YYYY-MM-DD")}
                      </td>
                      <td>
                        {moment(permiso.fechaVencimiento).format("YYYY-MM-DD")}
                      </td>
                      <td>
                        <Button
                          variant="warning"
                          onClick={() => handleModificarPermiso(permiso)}
                        >
                          Modificar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <Button
            variant="primary"
            onClick={() => setShowAgregarPermiso(true)}
            className="mt-3"
          >
            Agregar Permiso
          </Button>
        </div>
      </Collapse>
      <Modal
        show={showAgregarPermiso}
        onHide={() => setShowAgregarPermiso(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Agregar Permiso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AgregarPermiso
            empresaId={empresaId}
            particularId={particularId}
            onHide={() => setShowAgregarPermiso(false)}
            onPermisoAgregado={handlePermisoAgregado}
          />
        </Modal.Body>
      </Modal>
      {permisoSeleccionado && (
        <Modal
          show={showModificarPermiso}
          onHide={() => setShowModificarPermiso(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Modificar Permiso</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ModificarPermiso
              permiso={permisoSeleccionado}
              onHide={() => setShowModificarPermiso(false)}
              onPermisoModificado={handlePermisoModificado}
            />
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
};

export default ListaPermisos;
