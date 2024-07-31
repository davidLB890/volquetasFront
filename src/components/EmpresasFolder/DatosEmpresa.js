import React, { useEffect, useState } from "react";
import { getEmpresaId } from "../../api";
import { useLocation, useNavigate } from "react-router-dom";
import {Card,Spinner,Alert,Button,Collapse,Modal,Container,} from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import ContactosEmpresa from "./ContactosEmpresa";
import AgregarContactoEmpresa from "./AgregarContactoEmpresa";
import ModificarEmpresa from "./ModificarEmpresa";
import ListaObras from "../ObrasFolder/ListaObras";
import ListaPermisos from "../PermisosFolder/ListaPermisos";
import ListaPedidosEmpresaOParticular from "../PedidosFolder/ListaPedidosEmpresaOParticular";
import AgregarObra from "../ObrasFolder/AgregarObra";
import AgregarPermiso from "../PermisosFolder/AgregarPermiso"; // Ajusta la ruta según sea necesario

const DatosEmpresa = () => {
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showContactos, setShowContactos] = useState(false);
  const [showAgregarContacto, setShowAgregarContacto] = useState(false);
  const [showModificarEmpresa, setShowModificarEmpresa] = useState(false);
  const [showAgregarObra, setShowAgregarObra] = useState(false);
  const [showAgregarPermiso, setShowAgregarPermiso] = useState(false); // Estado para manejar el modal de agregar permiso
  const [actualizarPermisos, setActualizarPermisos] = useState(false); // Estado para manejar la actualización de permisos

  const getToken = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { empresaId, fromPedido } = location.state;

  useEffect(() => {
    const fetchEmpresa = async () => {
      const usuarioToken = getToken();
      try {
        const response = await getEmpresaId(empresaId, usuarioToken);
        setEmpresa({
          ...response.data,
          permisos: response.data.permisos || [], // Asegurarse de que permisos sea un arreglo
        });
        setLoading(false);
      } catch (error) {
        console.error(
          "Error al obtener la empresa:",
          error.response?.data?.error || error.message
        );
        setError("Error al obtener la empresa");
        setLoading(false);
      }
    };

    fetchEmpresa();
  }, [empresaId, getToken]);

  const handleEmpresaModificada = (empresaModificada) => {
    setEmpresa(empresaModificada);
  };

  const handleContactoAgregado = (nuevoContacto) => {
    setEmpresa((prevEmpresa) => ({
      ...prevEmpresa,
      contactos: [...prevEmpresa.contactos, nuevoContacto],
    }));
  };

  const handleObraAgregada = (nuevaObra) => {
    setEmpresa((prevEmpresa) => ({
      ...prevEmpresa,
      obras: [...(prevEmpresa.obras || []), nuevaObra],
    }));
    setShowAgregarObra(false);
  };

  const handlePermisoAgregado = (nuevoPermiso) => {
    setEmpresa((prevEmpresa) => ({
      ...prevEmpresa,
      permisos: [...(prevEmpresa.permisos || []), nuevoPermiso],
    }));
    setShowAgregarPermiso(false);
    setActualizarPermisos(!actualizarPermisos); // Cambia la bandera para actualizar ListaPermisos
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
          <h2>{empresa.nombre}</h2>
        </Card.Header>
        <Card.Body>
          <Card.Text>
            <strong>Razón Social:</strong> {empresa.razonSocial}
          </Card.Text>
          <Card.Text>
            <strong>RUT:</strong> {empresa.rut}
          </Card.Text>
          <Card.Text>
            <strong>Descripción:</strong> {empresa.descripcion}
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
              <ContactosEmpresa contactos={empresa.contactos || []} />
            </div>
          </Collapse>
        </Card.Body>
      </Card>
      <ModificarEmpresa
        show={showModificarEmpresa}
        onHide={() => setShowModificarEmpresa(false)}
        empresa={empresa}
        onEmpresaModificada={handleEmpresaModificada}
      />
      <AgregarContactoEmpresa
        show={showAgregarContacto}
        onHide={handleCerrarAgregarContacto}
        empresaId={empresaId}
        obras={empresa.obras || []}
        onContactoAgregado={handleContactoAgregado}
      />
      <ListaObras obras={empresa.obras || []} />
      <ListaPermisos empresaId={empresaId} actualizar={actualizarPermisos} />
      <ListaPedidosEmpresaOParticular empresaId={empresaId} />

      <AgregarObra
        show={showAgregarObra}
        onHide={() => setShowAgregarObra(false)}
        empresaId={empresaId}
        onObraAgregada={handleObraAgregada}
      />
      <Modal
        size="lg"
        show={showAgregarPermiso}
        onHide={() => setShowAgregarPermiso(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Agregar Permiso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AgregarPermiso
            empresaId={empresaId}
            onHide={() => setShowAgregarPermiso(false)}
            onPermisoAgregado={handlePermisoAgregado}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default DatosEmpresa;
