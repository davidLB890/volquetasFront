import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Spinner, Alert, Button, Container, Modal } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import { getParticularId } from "../../api";
import {
  fetchParticularStart,
  fetchParticularSuccess,
  fetchParticularFailure,
  createTelefonoSuccess,
  createObraSuccess,
} from "../../features/particularSlice";
import ModificarParticular from "./ModificarParticular";
import TelefonosParticular from "./TelefonosParticular";
import ListaObras from "../ObrasFolder/ListaObras";
import AgregarObra from "../ObrasFolder/AgregarObra";
import AgregarTelefono from "../TelefonosFolder/AgregarTelefono";
import ListaPermisos from "../PermisosFolder/ListaPermisos";
import ListaPedidosEmpresaOParticular from "../PedidosFolder/ListaPedidosEmpresaOParticular";
import AgregarPermiso from "../PermisosFolder/AgregarPermiso"; // Asegúrate de tener este componente

const DatosParticular = () => {
  const { particular, loading, error } = useSelector((state) => state.particular);
  const [showModificarParticular, setShowModificarParticular] = useState(false);
  const [showAgregarObra, setShowAgregarObra] = useState(false);
  const [showAgregarTelefono, setShowAgregarTelefono] = useState(false);
  const [showAgregarPermiso, setShowAgregarPermiso] = useState(false);

  const dispatch = useDispatch();
  const getToken = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { particularId, fromPedido } = location.state;

  useEffect(() => {
    const fetchParticular = async () => {
      const usuarioToken = getToken();
      dispatch(fetchParticularStart());
      try {
        const response = await getParticularId(particularId, usuarioToken);
        dispatch(fetchParticularSuccess(response.data));
      } catch (error) {
        dispatch(fetchParticularFailure(error.response?.data?.error || error.message));
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
            onClick={() => setShowAgregarTelefono(true)}
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

          <Button
            onClick={() => setShowAgregarPermiso(true)}
            className="ml-2"
            variant="info"
            style={{
              padding: "0.5rem 1rem",
              marginRight: "0.5rem",
            }}
          >
            Agregar Permiso
          </Button>

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
      <ListaObras obras={particular?.obras || []} />
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
    </Container>
  );
};

export default DatosParticular;








/* import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Spinner, Alert, Button, Container, Modal } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import { getParticularId } from "../../api";
import {
  fetchParticularStart,
  fetchParticularSuccess,
  fetchParticularFailure,
  createTelefonoSuccess,
  createObraSuccess
} from "../../features/particularSlice";
import ModificarParticular from "./ModificarParticular";
import TelefonosParticular from "./TelefonosParticular";
import ListaObras from "../ObrasFolder/ListaObras";
import AgregarObra from "../ObrasFolder/AgregarObra";
import AgregarTelefono from "../TelefonosFolder/AgregarTelefono";
import ListaPermisos from "../PermisosFolder/ListaPermisos";
import ListaPedidosEmpresaOParticular from "../PedidosFolder/ListaPedidosEmpresaOParticular";

const DatosParticular = () => {
  const { particular, loading, error } = useSelector((state) => state.particular);
  const [showModificarParticular, setShowModificarParticular] = useState(false);
  const [showAgregarObra, setShowAgregarObra] = useState(false);
  const [showAgregarTelefono, setShowAgregarTelefono] = useState(false);
  const [showAgregarPermiso, setShowAgregarPermiso] = useState(false);
  const [actualizarPermisos, setActualizarPermisos] = useState(false);

  const dispatch = useDispatch();
  const getToken = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { particularId, fromPedido } = location.state;

  useEffect(() => {
    const fetchParticular = async () => {
      const usuarioToken = getToken();
      dispatch(fetchParticularStart());
      try {
        const response = await getParticularId(particularId, usuarioToken);
        dispatch(fetchParticularSuccess(response.data));
      } catch (error) {
        dispatch(fetchParticularFailure(error.response?.data?.error || error.message));
      }
    };

    fetchParticular();
  }, [particularId, getToken, dispatch]);

  const handleTelefonoAgregado = (nuevoTelefono) => {
    console.log(nuevoTelefono)
    const telefono = {
      id: nuevoTelefono?.nuevoTelefono?.id,
      tipo: nuevoTelefono?.nuevoTelefono?.tipo,
      telefono: nuevoTelefono?.nuevoTelefono?.telefono,
      extension: nuevoTelefono?.nuevoTelefono?.extension,
    }
    console.log(telefono)
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

  const handlePermisoAgregado = (nuevoPermiso) => {
    setEmpresa((prevEmpresa) => ({
      ...prevEmpresa,
      permisos: [...(prevEmpresa.permisos || []), nuevoPermiso],
    }));
    setShowAgregarPermiso(false);
    setActualizarPermisos(!actualizarPermisos); // Cambia la bandera para actualizar ListaPermisos
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
            onClick={() => setShowAgregarTelefono(true)}
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
      <ListaObras obras={particular?.obras || []} />
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

export default DatosParticular;
 */