import React, { useEffect, useState } from "react";
import { getEmpresaId } from "../../api";
import { useLocation } from "react-router-dom";
import { Card, Spinner, Alert, Button, Collapse } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import ContactosEmpresa from "./ContactosEmpresa"; // Ajusta la ruta según sea necesario
import AgregarContactoEmpresa from "./AgregarContactoEmpresa"; // Ajusta la ruta según sea necesario

const DatosEmpresa = () => {
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showContactos, setShowContactos] = useState(false);
  const [showAgregarContacto, setShowAgregarContacto] = useState(false);

  const getToken = useAuth();
  const location = useLocation();
  const { empresaId } = location.state;

  const fetchEmpresa = async () => {
    const usuarioToken = getToken();
    try {
      const response = await getEmpresaId(empresaId, usuarioToken);
      setEmpresa(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener la empresa:", error.response?.data?.error || error.message);
      setError("Error al obtener la empresa");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpresa();
  }, [empresaId, getToken]);

  const handleContactoAgregado = () => {
    setShowAgregarContacto(false);
    fetchEmpresa(); // Refrescar los datos de la empresa
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
        <Card.Header><h2>{empresa.nombre}</h2></Card.Header>
        <Card.Body>
          <Card.Text><strong>Razón Social:</strong> {empresa.razonSocial}</Card.Text>
          <Card.Text><strong>RUT:</strong> {empresa.rut}</Card.Text>
          <Card.Text><strong>Descripción:</strong> {empresa.descripcion}</Card.Text>
          <Button
            onClick={() => setShowContactos(!showContactos)}
            aria-controls="contactos-collapse"
            aria-expanded={showContactos}
            variant="info"
          >
            {showContactos ? "Ocultar Contactos" : "Mostrar Contactos"}
          </Button>
          <Button
            onClick={() => setShowAgregarContacto(true)}
            className="ml-2"
            variant="primary"
          >
            Agregar Contacto
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
        onContactoAgregado={handleContactoAgregado}
      />
    </div>
  );
};

export default DatosEmpresa;
