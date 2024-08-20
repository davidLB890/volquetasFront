import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Spinner,  Alert, Button, Container, Collapse, Row,Col, Modal, Dropdown} from "react-bootstrap";
import { PencilSquare, Trash, GearFill} from "react-bootstrap-icons";
import useAuth from "../../hooks/useAuth";
import { getEmpresaId } from "../../api";
import { fetchEmpresaStart, fetchEmpresaSuccess, fetchEmpresaFailure, createContactoSuccess,
 createObraSuccess, createPermisoEmpresaSuccess, deleteObraSuccess } from "../../features/empresaSlice";
import ContactosEmpresa from "./ContactosEmpresa";
import AgregarContactoEmpresa from "./AgregarContactoEmpresa";
import ModificarEmpresa from "./ModificarEmpresa";
import ListaObras from "../ObrasFolder/ListaObras";
import ListaPermisos from "../PermisosFolder/ListaPermisos";
import ListaPedidosEmpresaOParticular from "../PedidosFolder/ListaPedidosEmpresaOParticular";
import AgregarObra from "../ObrasFolder/AgregarObra";
import AgregarPermiso from "../PermisosFolder/AgregarPermiso";
import { deleteEmpresa } from "../../api";

const DatosEmpresa = () => {
  const { empresa, obras, contactos, loading, error, permisos } = useSelector(
    (state) => state.empresa
  );
  const [showContactos, setShowContactos] = useState(false);
  const [showAgregarContacto, setShowAgregarContacto] = useState(false);
  const [showModificarEmpresa, setShowModificarEmpresa] = useState(false);
  const [showAgregarObra, setShowAgregarObra] = useState(false);
  const [showAgregarPermiso, setShowAgregarPermiso] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false); // Estado para mostrar el modal de confirmación
  const [deleteError, setDeleteError] = useState(null);

  const dispatch = useDispatch();
  const getToken = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { empresaId, fromPedido } = location.state;
  const { facturaId, fromFactura } = location.state;

  useEffect(() => {
    const fetchEmpresa = async () => {
      const usuarioToken = getToken();
      dispatch(fetchEmpresaStart());
      if (!usuarioToken) {
        navigate("/");
      }
      try {
        const response = await getEmpresaId(empresaId, usuarioToken);
        dispatch(fetchEmpresaSuccess(response.data));
      } catch (error) {
        dispatch(
          fetchEmpresaFailure(error.response?.data?.error || error.message)
        );
      }
    };

    fetchEmpresa();
  }, [empresaId, getToken, dispatch]);

  const handleObraAgregada = (nuevaObra) => {
    const obra = {
      id: nuevaObra?.id,
      calle: nuevaObra?.calle,
      esquina: nuevaObra?.esquina,
      numeroPuerta: nuevaObra?.numeroPuerta,
      activa: nuevaObra?.activa,
    };
    dispatch(createObraSuccess(obra));
    setShowAgregarObra(false);
  };

  const handleObraEliminada = (obraId) => {
    dispatch(deleteObraSuccess(obraId));
  };

  const handlePermisoAgregado = (nuevoPermiso) => {
    dispatch(createPermisoEmpresaSuccess(nuevoPermiso));
    setShowAgregarPermiso(false);
  };

  const handleConfirmEliminar = async () => {
    const usuarioToken = getToken();
    try {
      await deleteEmpresa(empresaId, usuarioToken);
      navigate("/empresas");
    } catch (error) {
      setDeleteError(
        error.response?.data?.error || "Error al eliminar la empresa"
      );
    } finally {
      setShowConfirmDelete(false); // Cierra el modal después de eliminar o intentar eliminar la empresa
    }
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
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
        <Card.Header style={{ display: "flex", alignItems: "center", padding: "0.5rem 1rem" }}>    
          <h2 style={{ margin: 0, marginRight: "0.5rem" }}>{empresa?.nombre}</h2>
          <Dropdown
            onClick={(e) => e.stopPropagation()} // Evitar que el clic en el Dropdown se propague
          >
            <Dropdown.Toggle
              as={Button}
              variant="link"
              style={{
                padding: 0,
                margin: 0,
                border: "none",
                background: "none",
                boxShadow: "none",
              }}
            >
              <GearFill size={24} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={(e) => {
                  e.stopPropagation();
                  setShowModificarEmpresa(true); // Muestra el modal de modificación
                }}
              >
                <PencilSquare className="me-2" /> Modificar Empresa
              </Dropdown.Item>
              <Dropdown.Item
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirmDelete(true); // Muestra el modal de confirmación de eliminación
                }}
              >
                <Trash className="me-2" /> Eliminar Empresa
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Card.Header>
        <Card.Body>
          <Card.Text>
            <strong>Razón Social:</strong> {empresa?.razonSocial}
          </Card.Text>
          <Card.Text>
            <strong>RUT:</strong> {empresa?.rut}
          </Card.Text>
          <Card.Text>
            <strong>Descripción:</strong> {empresa?.descripcion}
          </Card.Text>

          <Row>
            <Col xs={12} md={8} className="d-flex flex-column flex-md-row">
              {/* <Button
                onClick={() => setShowConfirmDelete(true)} // Muestra el modal de confirmación
                variant="danger"
                className="mb-2 mb-md-0 me-md-2"
                style={{
                  padding: "0.5rem 1rem",
                }}
              >
                Eliminar Empresa
              </Button>
              <Button
                onClick={() => setShowModificarEmpresa(true)}
                className="mb-2 mb-md-0 me-md-2"
                variant="warning"
                style={{
                  padding: "0.5rem 1rem",
                }}
              >
                Modificar Empresa
              </Button> */}
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
                variant="info"
                style={{
                  padding: "0.5rem 1rem",
                }}
              >
                Agregar Permiso
              </Button>
              <Button
                onClick={() => setShowContactos(!showContactos)}
                aria-controls="contactos-collapse"
                aria-expanded={showContactos}
                variant="secondary"
                className="mb-2 mb-md-0 me-md-2"
                style={{
                  padding: "0.5rem 1rem",
                }}
              >
                {showContactos ? "Ocultar Contactos" : "Mostrar Contactos"}
              </Button>
            </Col>
          </Row>

          <Collapse in={showContactos}>
            <div id="contactos-collapse" className="mt-3">
              <Button
                onClick={() => setShowAgregarContacto(true)}
                variant="primary"
                className="mb-3"
                style={{
                  padding: "0.5rem 1rem",
                }}
              >
                Agregar Contacto
              </Button>
              <ContactosEmpresa contactos={contactos || []} />
            </div>
          </Collapse>
        </Card.Body>
      </Card>

      <ModificarEmpresa
        show={showModificarEmpresa}
        onHide={() => setShowModificarEmpresa(false)}
        empresa={empresa}
      />
      <AgregarContactoEmpresa
        show={showAgregarContacto}
        onHide={() => setShowAgregarContacto(false)}
        empresaId={empresaId}
        obras={empresa?.obras || []}
      />
      <ListaObras obras={obras || []} onObraEliminada={handleObraEliminada} />
      <ListaPermisos empresaId={empresaId} />
      <ListaPedidosEmpresaOParticular empresaId={empresaId} />

      <AgregarObra
        show={showAgregarObra}
        onHide={() => setShowAgregarObra(false)}
        empresaId={empresaId}
        onObraAgregada={handleObraAgregada}
      />

      <AgregarPermiso
        empresaId={empresaId}
        onHide={() => setShowAgregarPermiso(false)}
        show={showAgregarPermiso}
        onPermisoAgregado={handlePermisoAgregado}
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

export default DatosEmpresa;
