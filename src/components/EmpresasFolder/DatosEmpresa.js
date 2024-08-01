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
  Modal,
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
  const { empresa, loading, error, permisos } = useSelector(
    (state) => state.empresa
  );
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

  useEffect(() => {
    const fetchEmpresa = async () => {
      const usuarioToken = getToken();
      dispatch(fetchEmpresaStart());
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

  const handleContactoAgregado = (nuevoContacto) => {
    dispatch(createContactoSuccess(nuevoContacto));
  };

  const handleObraAgregada = (nuevaObra) => {
    dispatch(createObraSuccess(nuevaObra));
    setShowAgregarObra(false);
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
          <Button
            onClick={() => setShowContactos(!showContactos)}
            aria-controls="contactos-collapse"
            aria-expanded={showContactos}
            style={{
              padding: "0.5rem 1rem",
              marginRight: "0.5rem",
            }}
            variant="info"
          >
            {showContactos ? "Ocultar Contactos" : "Mostrar Contactos"}
          </Button>
          <Button
            onClick={() => setShowAgregarContacto(true)}
            className="ml-2"
            variant="primary"
            style={{
              padding: "0.5rem 1rem",
              marginRight: "0.5rem",
            }}
          >
            Agregar Contacto
          </Button>
          <Button
            onClick={() => setShowModificarEmpresa(true)}
            className="ml-2"
            variant="warning"
            style={{
              padding: "0.5rem 1rem",
              marginRight: "0.5rem",
            }}
          >
            Modificar Empresa
          </Button>
          <Button
            onClick={() => setShowAgregarObra(true)}
            className="ml-2"
            variant="success"
            style={{
              padding: "0.5rem 1rem",
              marginRight: "0.5rem",
            }}
          >
            Agregar Obra
          </Button>
          <Button
            onClick={() => setShowAgregarPermiso(true)}
            className="ml-2"
            variant="primary"
            style={{
              padding: "0.5rem 1rem",
              marginRight: "0.5rem",
            }}
          >
            Agregar Permiso
          </Button>
          <Collapse in={showContactos}>
            <div id="contactos-collapse">
              <ContactosEmpresa contactos={empresa?.contactos || []} />
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
        onContactoAgregado={handleContactoAgregado}
      />
      <ListaObras obras={empresa?.obras || []} />
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
      />
    </Container>
  );
};

export default DatosEmpresa;
