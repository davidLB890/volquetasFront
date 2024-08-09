import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  Spinner,
  Alert,
  Button,
  Container,
  Collapse,
  Row,
  Col,
} from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import { getEmpresaId } from "../../api";
import {
  fetchEmpresaStart,
  fetchEmpresaSuccess,
  fetchEmpresaFailure,
  createContactoSuccess,
  createObraSuccess,
  createPermisoEmpresaSuccess,
  deleteObraSuccess, // Importa la acción para eliminar una obra
} from "../../features/empresaSlice";
import ContactosEmpresa from "./ContactosEmpresa";
import AgregarContactoEmpresa from "./AgregarContactoEmpresa";
import ModificarEmpresa from "./ModificarEmpresa";
import ListaObras from "../ObrasFolder/ListaObras";
import ListaPermisos from "../PermisosFolder/ListaPermisos";
import ListaPedidosEmpresaOParticular from "../PedidosFolder/ListaPedidosEmpresaOParticular";
import AgregarObra from "../ObrasFolder/AgregarObra";
import AgregarPermiso from "../PermisosFolder/AgregarPermiso";

const DatosEmpresa = () => {
  const { empresa, obras, contactos, loading, error, permisos } = useSelector((state) => state.empresa);
  const [showContactos, setShowContactos] = useState(false);
  const [showAgregarContacto, setShowAgregarContacto] = useState(false);
  const [showModificarEmpresa, setShowModificarEmpresa] = useState(false);
  const [showAgregarObra, setShowAgregarObra] = useState(false);
  const [showAgregarPermiso, setShowAgregarPermiso] = useState(false);

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
      try {
        const response = await getEmpresaId(empresaId, usuarioToken);
        dispatch(fetchEmpresaSuccess(response.data));
      } catch (error) {
        dispatch(fetchEmpresaFailure(error.response?.data?.error || error.message));
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
    console.log("obra", obra);
    dispatch(createObraSuccess(obra));
    setShowAgregarObra(false);
  };

  const handleObraEliminada = (obraId) => {
    dispatch(deleteObraSuccess(obraId)); // Despacha la acción para eliminar la obra del estado de Redux
  };

  const handlePermisoAgregado = (nuevoPermiso) => {
    dispatch(createPermisoEmpresaSuccess(nuevoPermiso));
    setShowAgregarPermiso(false);
  };

  const handleSeleccionarPedido = (pedido) => {
    navigate("/pedidos/datos", { state: { pedido } });
  };

  const handleCerrarAgregarContacto = () => {
    setShowAgregarContacto(false);
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
        <Card.Header>
          <h2>{empresa?.nombre}</h2>
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
          
          {/* Grupo de botones con disposición vertical en pantallas pequeñas */}
          <Row>
            <Col xs={12} md={8} className="d-flex flex-column flex-md-row">
              <Button
                onClick={() => setShowModificarEmpresa(true)}
                className="mb-2 mb-md-0 me-md-2"
                variant="warning"
                style={{
                  padding: "0.5rem 1rem",
                }}
              >
                Modificar Empresa
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
                variant="primary"
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
                variant="info"
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
        onHide={handleCerrarAgregarContacto}
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
    </Container>
  );
};

export default DatosEmpresa;
