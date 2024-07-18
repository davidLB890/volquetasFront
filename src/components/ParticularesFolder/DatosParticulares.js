import React, { useEffect, useState } from "react";
import { getParticularId } from "../../api";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Spinner, Alert, Button, Modal, Container } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import ModificarParticular from "./ModificarParticular"; // Ajusta la ruta según sea necesario
import TelefonosParticular from "./TelefonosParticular"; // Ajusta la ruta según sea necesario
import ListaObras from "../ObrasFolder/ListaObras"; // Ajusta la ruta según sea necesario
import AgregarObra from "../ObrasFolder/AgregarObra"; // Ajusta la ruta según sea necesario
import AgregarTelefono from "../TelefonosFolder/AgregarTelefono"; // Ajusta la ruta según sea necesario
import ListaPermisos from "../PermisosFolder/ListaPermisos";
import ListaPedidosEmpresa from "../PedidosFolder/ListaPedidosEmpresa"; // Asegúrate de ajustar la ruta según sea necesario

const DatosParticular = () => {
  const [particular, setParticular] = useState(null);
  const [telefonos, setTelefonos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModificarParticular, setShowModificarParticular] = useState(false);
  const [showAgregarObra, setShowAgregarObra] = useState(false);
  const [showAgregarTelefono, setShowAgregarTelefono] = useState(false);

  const getToken = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { particularId, fromPedido } = location.state;

  useEffect(() => {
    const fetchParticular = async () => {
      const usuarioToken = getToken();
      try {
        const response = await getParticularId(particularId, usuarioToken);
        setParticular(response.data);
        setTelefonos(response.data.Telefonos || []);
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

  const handleShowAgregarTelefono = () => {
    setShowAgregarTelefono(true);
  };

  const handleHideAgregarTelefono = () => {
    setShowAgregarTelefono(false);
  };

  const handleTelefonoAgregado = (nuevoTelefono) => {
    setTelefonos((prevTelefonos) => [...prevTelefonos, nuevoTelefono]);
    handleHideAgregarTelefono();
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
            style={{
              padding: "0.5rem 1rem",
              marginRight: "0.5rem",
            }}
          >
            Modificar Particular
          </Button>

          <Button
            variant="primary"
            className="ml-2"
            style={{
              padding: "0.5rem 1rem",
              marginRight: "0.5rem",
            }}
            onClick={handleShowAgregarTelefono}
          >
            Agregar Teléfono
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

          <TelefonosParticular
            telefonos={telefonos}
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
      <ListaPermisos particularId={particular.id} />
      <ListaPedidosEmpresa empresaId={particular.id} />
      <Modal show={showAgregarObra} onHide={() => setShowAgregarObra(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Obra</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AgregarObra
            particularId={particularId}
            onObraAgregada={handleObraAgregada}
          />
        </Modal.Body>
      </Modal>
      <AgregarTelefono
        show={showAgregarTelefono}
        onHide={handleHideAgregarTelefono}
        particularId={particularId}
        onTelefonoAgregado={handleTelefonoAgregado}
      />
    </Container>
  );
};

export default DatosParticular;
