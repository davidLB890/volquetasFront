import React, { useEffect, useState } from "react";
import { getEmpresaId } from "../../api";
import { useLocation } from "react-router-dom";
import { Card, Spinner, Alert, Button, Collapse, Modal } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import ContactosEmpresa from "./ContactosEmpresa";
import AgregarContactoEmpresa from "./AgregarContactoEmpresa";
import ModificarEmpresa from "./ModificarEmpresa";
import ListaObras from "../ObrasFolder/ListaObras";
import ListaPermisos from "../PermisosFolder/ListaPermisos";
import AgregarObra from "../ObrasFolder/AgregarObra";

const DatosEmpresa = () => {
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showContactos, setShowContactos] = useState(false);
  const [showAgregarContacto, setShowAgregarContacto] = useState(false);
  const [showModificarEmpresa, setShowModificarEmpresa] = useState(false);
  const [showAgregarObra, setShowAgregarObra] = useState(false);

  const getToken = useAuth();
  const location = useLocation();
  const { empresaId } = location.state;

  useEffect(() => {
    const fetchEmpresa = async () => {
      const usuarioToken = getToken();
      try {
        const response = await getEmpresaId(empresaId, usuarioToken);
        setEmpresa(response.data);
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
      obras: [...prevEmpresa.obras, nuevaObra],
    }));
    setShowAgregarObra(false);
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
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
          <Collapse in={showContactos}>
            <div id="contactos-collapse">
              <ContactosEmpresa contactos={empresa.contactos} />
            </div>
          </Collapse>
        </Card.Body>
      </Card>
      <AgregarContactoEmpresa
        show={showAgregarContacto}
        onHide={() => setShowAgregarContacto(false)}
        empresaId={empresaId}
        obras={empresa.obras}
        onContactoAgregado={handleContactoAgregado}
      />
      <ModificarEmpresa
        show={showModificarEmpresa}
        onHide={() => setShowModificarEmpresa(false)}
        empresa={empresa}
        onEmpresaModificada={handleEmpresaModificada}
      />
      <ListaObras obras={empresa.obras} />
      <ListaPermisos empresaId={empresaId} />
      <Modal show={showAgregarObra} onHide={() => setShowAgregarObra(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Obra</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AgregarObra
            empresaId={empresaId}
            onObraAgregada={handleObraAgregada}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DatosEmpresa;
