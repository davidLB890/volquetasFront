import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  Spinner,
  Alert,
  Button,
  Container,
  Row,
  Col,
  Modal
} from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import { getParticularId } from "../../api";
import {
  fetchParticularStart,
  fetchParticularSuccess,
  fetchParticularFailure,
  createTelefonoSuccess,
  createObraSuccess,
  deleteObraSuccess,
} from "../../features/particularSlice";
import ModificarParticular from "./ModificarParticular";
import TelefonosParticular from "./TelefonosParticular";
import ListaObras from "../ObrasFolder/ListaObras";
import AgregarObra from "../ObrasFolder/AgregarObra";
import AgregarTelefono from "../TelefonosFolder/AgregarTelefono";
import ListaPermisos from "../PermisosFolder/ListaPermisos";
import ListaPedidosEmpresaOParticular from "../PedidosFolder/ListaPedidosEmpresaOParticular";
import AgregarPermiso from "../PermisosFolder/AgregarPermiso";
import { deleteParticular } from "../../api";

const DatosParticular = () => {
  const { particular, loading, error } = useSelector(
    (state) => state.particular
  );
  const [showModificarParticular, setShowModificarParticular] = useState(false);
  const [showAgregarObra, setShowAgregarObra] = useState(false);
  const [showAgregarTelefono, setShowAgregarTelefono] = useState(false);
  const [showAgregarPermiso, setShowAgregarPermiso] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false); // Estado para el modal de confirmación
  const [deleteError, setDeleteError] = useState(null);

  const dispatch = useDispatch();
  const getToken = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { particularId, fromPedido } = location.state;
  const { facturaId, fromFactura } = location.state;

  useEffect(() => {
    const fetchParticular = async () => {
      const usuarioToken = getToken();
      dispatch(fetchParticularStart());
      try {
        const response = await getParticularId(particularId, usuarioToken);
        dispatch(fetchParticularSuccess(response.data));
      } catch (error) {
        dispatch(
          fetchParticularFailure(error.response?.data?.error || error.message)
        );
      }
    };

    fetchParticular();
  }, [particularId, getToken, dispatch]);

  const handleTelefonoAgregado = (nuevoTelefono) => {
    const telefono = {
      id: nuevoTelefono?.nuevoTelefono?.id,
      tipo: nuevoTelefono?.nuevoTelefono?.tipo,
      telefono: nuevoTelefono?.nuevoTelefono?.telefono,
      extension: nuevoTelefono?.nuevoTelefono?.extension,
    };
    dispatch(createTelefonoSuccess(telefono));
  };

  const handleObraAgregada = (nuevaObra) => {
    const obra = {
      id: nuevaObra?.id,
      calle: nuevaObra?.calle,
      esquina: nuevaObra?.esquina,
      numeroPuerta: nuevaObra?.numeroPuerta,
      activa: nuevaObra?.activa,
    };
    dispatch(createObraSuccess(obra));
  };

  const handleObraEliminada = (obraId) => {
    dispatch(deleteObraSuccess(obraId)); // Despacha la acción para eliminar la obra del estado de Redux
  };

  const handleConfirmEliminar = async () => {
    const usuarioToken = getToken();
    try {
      await deleteParticular(particularId, usuarioToken);
      navigate("/particulares");
    } catch (error) {
      setDeleteError(
        error.response?.data?.error || "Error al eliminar el particular"
      );
    } finally {
      setShowConfirmDelete(false); // Cierra el modal después de intentar eliminar el particular
    }
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!particular) {
    return <Alert variant="info">No se encontró el particular</Alert>;
  }

  return (
    <Container>
      {fromPedido && (
        <Button variant="secondary" onClick={() => navigate(-1)}>
          &larr; Volver al Pedido
        </Button>
      )}
      {fromFactura && (
        <Button variant="secondary" onClick={() => navigate(-1)}>
          &larr; Volver a la Factura
        </Button>
      )}
      <Card className="mt-3">
        <Card.Header>
          <h2>{particular?.nombre}</h2>
        </Card.Header>
        <Card.Body>
          <Card.Text>
            <strong>Cédula:</strong> {particular?.cedula}
          </Card.Text>
          <Card.Text>
            <strong>Email:</strong> {particular?.email}
          </Card.Text>
          <Card.Text>
            <strong>Descripción:</strong> {particular?.descripcion}
          </Card.Text>
          
          {/* Grupo de botones con disposición vertical en pantallas pequeñas */}
          <Row>
            <Col xs={12} md={8} className="d-flex flex-column flex-md-row">
            <Button
                onClick={() => setShowConfirmDelete(true)} // Muestra el modal de confirmación
                className="mb-2 mb-md-0 me-md-2"
                variant="danger"
                style={{
                  padding: "0.5rem 1rem",
                }}
              >
                Eliminar Particular
              </Button>
              <Button
                onClick={() => setShowModificarParticular(true)}
                className="mb-2 mb-md-0 me-md-2"
                variant="warning"
                style={{
                  padding: "0.5rem 1rem",
                }}
              >
                Modificar Particular
              </Button>
              <Button
                variant="primary"
                className="mb-2 mb-md-0 me-md-2"
                style={{
                  padding: "0.5rem 1rem",
                }}
                onClick={() => setShowAgregarTelefono(true)}
              >
                Agregar Teléfono
              </Button>
              <Button
                onClick={() => setShowAgregarObra(true)}
                className="mb-2 mb-md-0 me-md-2"
                variant="success"
                style={{
                  padding: "0.5rem 1rem",
                }}
              >
                Agregar Obra
              </Button>
              <Button
                onClick={() => setShowAgregarPermiso(true)}
                className="mb-2 mb-md-0 me-md-2"
                variant="secondary"
                style={{
                  padding: "0.5rem 1rem",
                }}
              >
                Agregar Permiso
              </Button>
            </Col>
          </Row>

          <TelefonosParticular
            telefonos={particular?.Telefonos || []}
            particularId={particular.id}
            nombre={particular?.nombre}
          />
        </Card.Body>
      </Card>
      <ModificarParticular
        show={showModificarParticular}
        onHide={() => setShowModificarParticular(false)}
        particular={particular}
      />
      <ListaObras
        obras={particular?.obras || []}
        onObraEliminada={handleObraEliminada}
      />
      <ListaPermisos particularId={particular.id} />
      <ListaPedidosEmpresaOParticular particularId={particular.id} />

      <AgregarObra
        show={showAgregarObra}
        onHide={() => setShowAgregarObra(false)}
        particularId={particular.id}
        onObraAgregada={handleObraAgregada}
      />

      <AgregarTelefono
        show={showAgregarTelefono}
        onHide={() => setShowAgregarTelefono(false)}
        particularId={particular.id}
        onTelefonoAgregado={handleTelefonoAgregado}
      />

      <AgregarPermiso
        show={showAgregarPermiso}
        onHide={() => setShowAgregarPermiso(false)}
        particularId={particular.id}
      />

      {/* Modal de Confirmación de Eliminación */}
      <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar esta empresa? Esta acción no se
          puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmEliminar}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DatosParticular;