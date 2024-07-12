import React, { useEffect, useState } from "react";
import { getParticularId } from "../../api";
import { useLocation } from "react-router-dom";
import { Card, Spinner, Alert, Button, Modal } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import ModificarParticular from "./ModificarParticular"; // Ajusta la ruta según sea necesario
import TelefonosParticular from "./TelefonosParticular"; // Ajusta la ruta según sea necesario
import ListaObras from "../ObrasFolder/ListaObras"; // Ajusta la ruta según sea necesario
import AgregarObra from "../ObrasFolder/AgregarObra"; // Ajusta la ruta según sea necesario

const DatosParticular = () => {
  const [particular, setParticular] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModificarParticular, setShowModificarParticular] = useState(false);
  const [showAgregarObra, setShowAgregarObra] = useState(false);

  const getToken = useAuth();
  const location = useLocation();
  const { particularId } = location.state;

  useEffect(() => {
    const fetchParticular = async () => {
      const usuarioToken = getToken();
      try {
        const response = await getParticularId(particularId, usuarioToken);
        setParticular(response.data);
        setLoading(false);
      } catch (error) {
        console.error(
          "Error al obtener el particular:",
          error.response?.data?.error || error.message
        );
        setError("Error al obtener el particular");
        setLoading(false);
      }
    };

    fetchParticular();
  }, [particularId, getToken]);

  const handleParticularModificado = (particularModificado) => {
    setParticular(particularModificado);
  };

  const handleObraAgregada = (nuevaObra) => {
    setParticular((prevParticular) => ({
      ...prevParticular,
      obras: [...prevParticular.obras, nuevaObra],
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
          <h2>{particular.nombre}</h2>
        </Card.Header>
        <Card.Body>
          <Card.Text>
            <strong>Cédula:</strong> {particular.cedula}
          </Card.Text>
          <Card.Text>
            <strong>Email:</strong> {particular.email}
          </Card.Text>
          <Card.Text>
            <strong>Descripción:</strong> {particular.descripcion}
          </Card.Text>
          <Button
            onClick={() => setShowModificarParticular(true)}
            className="ml-2"
            variant="warning"
          >
            Modificar Particular
          </Button>
          <Button
            onClick={() => setShowAgregarObra(true)}
            className="ml-2"
            variant="success"
          >
            Agregar Obra
          </Button>
          <TelefonosParticular
            telefonos={particular?.Telefonos || []}
            particularId={particular.id}
            nombre={particular.nombre}
          />
        </Card.Body>
      </Card>
      <ModificarParticular
        show={showModificarParticular}
        onHide={() => setShowModificarParticular(false)}
        particular={particular}
        onParticularModificado={handleParticularModificado}
      />
      <ListaObras obras={particular.obras} />
      <Modal show={showAgregarObra} onHide={() => setShowAgregarObra(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Obra</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AgregarObra particularId={particularId} onObraAgregada={handleObraAgregada} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DatosParticular;
