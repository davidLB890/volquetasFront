import React, { useEffect, useState } from "react";
import { getObraId, getEmpresaId } from "../../api";
import { Container, Spinner, Alert, Modal, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import SeleccionarOAgregarContacto from "../EmpresasFolder/SeleccionarOAgregarContacto";
import ModificarObra from "./ModificarObra";
import ContactosObra from "./ContactosObra";

const DatosObra = ({ obraId, onObraModificada }) => {
  const [obra, setObra] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingEmpresa, setLoadingEmpresa] = useState(false);
  const [error, setError] = useState("");
  const [showSeleccionarContacto, setShowSeleccionarContacto] = useState(false);
  const [showModificarObra, setShowModificarObra] = useState(false);

  const getToken = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchObra = async () => {
      const usuarioToken = getToken();
      try {
        const response = await getObraId(obraId, usuarioToken);
        setObra(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener la obra:", error.response?.data?.error || error.message);
        setError("Error al obtener la obra");
        setLoading(false);
      }
    };

    fetchObra();
  }, [obraId, getToken]);

  const fetchEmpresa = async (empresaId) => {
    const usuarioToken = getToken();
    setLoadingEmpresa(true);
    try {
      const response = await getEmpresaId(empresaId, usuarioToken);
      setEmpresa(response.data);
    } catch (error) {
      console.error("Error al obtener la empresa:", error.response?.data?.error || error.message);
      setError("Error al obtener la empresa");
    } finally {
      setLoadingEmpresa(false);
    }
  };

  const handleNavigateToEmpresa = () => {
    navigate("/empresas/datos", { state: { empresaId: obra.empresaId } });
  };

  const handleSeleccionarContacto = () => {
    if (obra.empresaId) {
      fetchEmpresa(obra.empresaId);
      setShowSeleccionarContacto(true);
    } else {
      setError("No hay empresa asociada a esta obra.");
    }
  };

  const handleContactoSeleccionado = (contacto) => {
    setObra((prevObra) => ({
      ...prevObra,
      contactosDesignados: [...prevObra.contactosDesignados, contacto],
    }));
    setShowSeleccionarContacto(false);
  };

  const handleModificarObra = (obraModificada) => {
    setObra(obraModificada);
    setShowModificarObra(false);
    if (onObraModificada) onObraModificada(obraModificada);
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  const {
    calle,
    esquina,
    barrio,
    coordenadas,
    numeroPuerta,
    descripcion,
    ObraDetalle
  } = obra;

  const renderDetallesAdicionales = () => {
    if (!ObraDetalle) {
      return null;
    }

    const {
      detalleResiduos,
      residuosMezclados,
      residuosReciclados,
      frecuenciaSemanal,
      destinoFinal,
      dias
    } = ObraDetalle;

    return (
      <div>
        <h5>Detalles Adicionales</h5>
        <p><strong>Detalle Residuos:</strong> {detalleResiduos || ''}</p>
        <p><strong>Residuos Mezclados:</strong> {residuosMezclados ? 'Sí' : 'No'}</p>
        <p><strong>Residuos Reciclados:</strong> {residuosReciclados ? 'Sí' : 'No'}</p>
        <p><strong>Frecuencia Semanal:</strong> {frecuenciaSemanal?.map(freq => `${freq.value} (${freq.inclusive ? 'Inclusivo' : 'Exclusivo'})`).join(', ') || 'N/A'}</p>
        <p><strong>Destino Final:</strong> {destinoFinal || ''}</p>
        <p><strong>Días:</strong> {dias || ''}</p>
      </div>
    );
  };

  return (
    <Container>
      <h3>Datos de la Obra</h3>
      <Row>
        <Col md={6}>
          <div>
            <h4>Detalles de la Obra</h4>
            <p><strong>Calle:</strong> {calle || ''}</p>
            <p><strong>Esquina:</strong> {esquina || ''}</p>
            <p><strong>Barrio:</strong> {barrio || ''}</p>
            <p><strong>Número de Puerta:</strong> {numeroPuerta || ''}</p>
            <p><strong>Descripción:</strong> {descripcion || ''}</p>
            {renderDetallesAdicionales()}
            <Button onClick={() => setShowModificarObra(true)}>Modificar Obra</Button>
          </div>
        </Col>
        <Col md={6}>
          {obra.empresa && (
            <ContactosObra obra={obra} handleSeleccionarContacto={handleSeleccionarContacto} />
          )}
        </Col>
      </Row>

      <Modal show={showSeleccionarContacto} onHide={() => setShowSeleccionarContacto(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Seleccionar Contacto de la empresa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Si desea crear un nuevo contacto, diríjase a "Agregar contacto"</p>
          {loadingEmpresa ? (
            <Spinner animation="border" />
          ) : (
            empresa && (
              <SeleccionarOAgregarContacto
                empresa={empresa}
                obraId={obraId}
                onContactoSeleccionado={handleContactoSeleccionado}
              />
            )
          )}
        </Modal.Body>
      </Modal>

      {showModificarObra && (
        <ModificarObra
          show={showModificarObra}
          onHide={() => setShowModificarObra(false)}
          obra={obra}
          onUpdate={handleModificarObra}
        />
      )}
    </Container>
  );
};

export default DatosObra;



/* import React, { useEffect, useState } from "react";
import { getObraId, getEmpresaId } from "../../api";
import { Container, Spinner, Alert, Modal, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import SeleccionarOAgregarContacto from "../EmpresasFolder/SeleccionarOAgregarContacto";
import ModificarObra from "./ModificarObra";
import DetallesObra from "./DetallesObra";
import ContactosObra from "./ContactosObra";

const DatosObra = ({ obraId, onObraModificada }) => {
  const [obra, setObra] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingEmpresa, setLoadingEmpresa] = useState(false);
  const [error, setError] = useState("");
  const [showSeleccionarContacto, setShowSeleccionarContacto] = useState(false);
  const [showModificarObra, setShowModificarObra] = useState(false);

  const getToken = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchObra = async () => {
      const usuarioToken = getToken();
      try {
        const response = await getObraId(obraId, usuarioToken);
        setObra(response.data);
        setLoading(false);
      } catch (error) {
        console.error(
          "Error al obtener la obra:",
          error.response?.data?.error || error.message
        );
        setError("Error al obtener la obra");
        setLoading(false);
      }
    };

    fetchObra();
  }, [obraId, getToken]);

  const fetchEmpresa = async (empresaId) => {
    const usuarioToken = getToken();
    setLoadingEmpresa(true);
    try {
      const response = await getEmpresaId(empresaId, usuarioToken);
      setEmpresa(response.data);
    } catch (error) {
      console.error(
        "Error al obtener la empresa:",
        error.response?.data?.error || error.message
      );
      setError("Error al obtener la empresa");
    } finally {
      setLoadingEmpresa(false);
    }

  };

  const handleNavigateToEmpresa = () => {
    navigate("/empresas/datos", { state: { empresaId: obra.empresaId } });
  };

  const handleSeleccionarContacto = () => {
    if (obra.empresaId) {
      fetchEmpresa(obra.empresaId);
      setShowSeleccionarContacto(true);
    } else {
      setError("No hay empresa asociada a esta obra.");
    }
  };

  const handleContactoSeleccionado = (contacto) => {
    setObra((prevObra) => ({
      ...prevObra,
      contactosDesignados: [...prevObra.contactosDesignados, contacto],
    }));
    setShowSeleccionarContacto(false);
  };

  const handleModificarObra = (obraModificada) => {
    setObra(obraModificada);
    setShowModificarObra(false);
    if (onObraModificada) onObraModificada(obraModificada);
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container>
      <h3>Datos de la Obra</h3>
      <Row>
        <Col md={6}>
          <DetallesObra obra={obra} setShowModificarObra={setShowModificarObra} />
        </Col>
        <Col md={6}>
          {obra.empresa && (
            <ContactosObra obra={obra} handleSeleccionarContacto={handleSeleccionarContacto} />
          )}
        </Col>
      </Row>

      <Modal
        show={showSeleccionarContacto}
        onHide={() => setShowSeleccionarContacto(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Seleccionar Contacto de la empresa </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Si desea crear un nuevo contacto, diríjase a "Agregar contacto"</p>
          {loadingEmpresa ? (
            <Spinner animation="border" />
          ) : (
            empresa && (
              <SeleccionarOAgregarContacto
                empresa={empresa}
                obraId={obraId}
                onContactoSeleccionado={handleContactoSeleccionado}
              />
            )
          )}
        </Modal.Body>
      </Modal>

      {showModificarObra && (
        <ModificarObra
          show={showModificarObra}
          onHide={() => setShowModificarObra(false)}
          obra={obra}
          onUpdate={handleModificarObra}
        />
      )}
    </Container>
  );
};

export default DatosObra; */



//ya tengo la empresa acá mismo, si lo quiero mandar a los datos de la empresa en vez de que lo busque ahí, ya debería pasarle la empresa
