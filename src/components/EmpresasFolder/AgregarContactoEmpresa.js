import React, { useState, useRef, useEffect } from "react";
import { Form, Button, Modal, Alert, Row, Col } from "react-bootstrap";
import { postContactoEmpresa, postTelefono } from "../../api";
import useAuth from "../../hooks/useAuth";
import AgregarTelefono from "../TelefonosFolder/AgregarTelefono";
import SelectObra from "../ObrasFolder/SelectObra"; // Asegúrate de importar correctamente el componente SelectObra
import useHabilitarBoton from "../../hooks/useHabilitarBoton";
import AlertMessage from "../AlertMessage"; // Asegúrate de importar correctamente el componente AlertMessage
import {
  createContactoSuccess,
  createTelefonoSuccess,
} from "../../features/empresaSlice"; // Asegúrate de importar correctamente las acciones
import { useDispatch } from "react-redux";

const AgregarContactoEmpresa = ({ empresaId, obras = [], show, onHide }) => {
  const nombreRef = useRef("");
  const descripcionRef = useRef("");
  const emailRef = useRef("");
  const empresaIdRef = useRef("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [contactoSeleccionado, setContactoSeleccionado] = useState(null);
  const [showAgregarTelefono, setShowAgregarTelefono] = useState(false);
  const [obraSeleccionada, setObraSeleccionada] = useState(null);
  const [telefono, setTelefono] = useState("");
  const [tipo, setTipo] = useState("telefono");
  const [extension, setExtension] = useState("");
  const [formularioVisible, setFormularioVisible] = useState(true);

  const refs = [nombreRef, emailRef];
  const boton = useHabilitarBoton(refs);
  const dispatch = useDispatch();

  const getToken = useAuth();

  const handleChangeTelefono = (e) => setTelefono(e.target.value);
  const handleChangeTipo = (e) => setTipo(e.target.value);
  const handleChangeExtension = (e) => setExtension(e.target.value);

  const resetForm = () => {
    setFormularioVisible(true);
    setContactoSeleccionado(null);
    setShowAgregarTelefono(false);
    setObraSeleccionada(null);
    setTelefono("");
    setTipo("telefono");
    setExtension("");
    setError("");
    setSuccess("");

    if (nombreRef.current) nombreRef.current.value = "";
    if (descripcionRef.current) descripcionRef.current.value = "";
    if (emailRef.current) emailRef.current.value = "";
    if (empresaIdRef.current) empresaIdRef.current.value = "";
  };

  const handleAgregarContacto = async () => {
    const usuarioToken = getToken();
    const nuevoContacto = {
      nombre: nombreRef.current.value,
      descripcion: descripcionRef.current.value,
      email: emailRef.current.value,
      empresaId: empresaId || empresaIdRef.current.value,
      obraId: obraSeleccionada,
    };

    try {
      const response = await postContactoEmpresa(nuevoContacto, usuarioToken);
      const contacto = response.data;

      // Dispatch para agregar el contacto
      dispatch(createContactoSuccess(contacto));

      setContactoSeleccionado(contacto);
      setSuccess("Contacto agregado correctamente");
      setError("");
      setFormularioVisible(false); // Ocultar el formulario al crear el contacto con éxito

      // Si el campo teléfono no está vacío, intentar agregar el teléfono
      if (telefono) {
        await agregarTelefono(contacto.id);
      } else {
        setTimeout(() => {
          setSuccess("");
        }, 4000);
      }
    } catch (error) {
      console.error(
        "Error al agregar el contacto:",
        error.response?.data?.error || error.message
      );
      setError(error.response?.data?.error || "Error al agregar el contacto");
      setSuccess("");
      setTimeout(() => {
        setError("");
      }, 4000);
    }
  };

  const agregarTelefono = async (contactoEmpresaId) => {
    const usuarioToken = getToken();

    try {
      const response = await postTelefono(
        {
          contactoEmpresaId,
          tipo,
          telefono,
          extension,
        },
        usuarioToken
      );

      const datos = response.data;

      if (datos.error) {
        console.error(datos.error);
        setError(datos.error.message || "Error al agregar el teléfono");
        setSuccess("");
        setTimeout(() => {
          setError("");
        }, 4000);
      } else {
        console.log("Teléfono agregado correctamente", datos);
        setSuccess("Teléfono agregado correctamente");
        setError("");

        const tel = {
          id: datos.nuevoTelefono.id,
          tipo: datos.nuevoTelefono.tipo,
          telefono: datos.nuevoTelefono.telefono,
          extension: datos.nuevoTelefono.extension,
        };
        // Dispatch para agregar el teléfono
        const telefonoPayload = {
          contactId: contactoEmpresaId,
          telefono: tel,
        };
        console.log();
        dispatch(createTelefonoSuccess(telefonoPayload));

        setTimeout(() => {
          setSuccess("");
        }, 4000);
      }
    } catch (error) {
      console.error(
        "Error al conectar con el servidor:",
        error.response?.data || error.message
      );
      setError(error.response?.data?.error || "Error al agregar el teléfono");
      setSuccess("");
      setTimeout(() => {
        setError("");
      }, 4000);
    }
  };

  const handleTelefonoAgregado = (telefono) => {
    const tel = {
      id: telefono.nuevoTelefono.id,
      tipo: telefono.nuevoTelefono.tipo,
      telefono: telefono.nuevoTelefono.telefono,
      extension: telefono.nuevoTelefono.extension,
    };
    const telefonoPayload = {
      contactId: telefono.nuevoTelefono.contactoEmpresaId,
      telefono: tel,
    };
    console.log();
    dispatch(createTelefonoSuccess(telefonoPayload));
    console.log("telefono", telefono);
    setSuccess("Teléfono agregado correctamente. Puede agregar más números.");
    setTimeout(() => {
      setSuccess("");
    }, 4000);
  };

  const handleMostrarAgregarTelefono = () => {
    setShowAgregarTelefono(true);
  };

  useEffect(() => {
    if (show) {
      resetForm();
    }
  }, [show]);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Contacto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <AlertMessage type="error" message={error} />}
        {success && <AlertMessage type="success" message={success} />}
        {formularioVisible ? (
          <Form>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre *</Form.Label>
              <Form.Control
                type="text"
                ref={nombreRef}
                placeholder="Nombre"
                required
              />
            </Form.Group>
            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                ref={descripcionRef}
                placeholder="Descripción"
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                ref={emailRef}
                placeholder="Email"
                required
              />
            </Form.Group>
            {!empresaId && (
              <Form.Group controlId="formEmpresaId">
                <Form.Label>ID de la Empresa</Form.Label>
                <Form.Control
                  type="text"
                  ref={empresaIdRef}
                  placeholder="ID de la Empresa"
                  required
                />
              </Form.Group>
            )}
            <SelectObra
              obras={obras}
              obraSeleccionada={obraSeleccionada}
              onSelect={(id) => setObraSeleccionada(id)}
            />
            <Row>
              <Col md={4}>
                <Form.Group controlId="tipo">
                  <Form.Label>Tipo</Form.Label>
                  <Form.Control
                    as="select"
                    value={tipo}
                    onChange={handleChangeTipo}
                  >
                    <option value="telefono">Teléfono</option>
                    <option value="celular">Celular</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="nuevoTelefono">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    value={telefono}
                    onChange={handleChangeTelefono}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="extension">
                  <Form.Label>Extensión</Form.Label>
                  <Form.Control
                    type="text"
                    value={extension}
                    onChange={handleChangeExtension}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="secondary" 
          className="mt-3"
            style={{
              padding: "0.5rem 1rem",
              marginRight: "0.5rem",
            }}
            onClick={onHide}>
            Cerrar
          </Button>
            <Button
              variant="primary"
              className="mt-3"
            style={{
              padding: "0.5rem 1rem",
              marginRight: "0.5rem",
            }}
              onClick={handleAgregarContacto}
              disabled={!boton}
            >
              Agregar Contacto
            </Button>
          </Form>
        ) : (
          <div className="text-center">
            {showAgregarTelefono ? (
              <AgregarTelefono
                show={showAgregarTelefono}
                onHide={() => setShowAgregarTelefono(false)}
                contactoEmpresaId={contactoSeleccionado?.id}
                nombre={contactoSeleccionado?.nombre}
                onTelefonoAgregado={handleTelefonoAgregado}
                className="mb-2"
              />
            ) : (
              <Button
                variant="secondary"
                className="ml-2"
                onClick={handleMostrarAgregarTelefono}
              >
                Click aquí para agregar teléfono
              </Button>
            )}
          </div>
          
        )}
        
      </Modal.Body>
    </Modal>
  );
};

export default AgregarContactoEmpresa;
