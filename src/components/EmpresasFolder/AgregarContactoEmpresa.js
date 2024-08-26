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
import { addContactoSuccess } from "../../features/pedidoSlice"; // Asegúrate de importar correctamente las acciones
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

const AgregarContactoEmpresa = ({ empresaId, obras = [], obraId, show, onHide }) => {
  const nombreRef = useRef("");
  const descripcionRef = useRef("");
  const emailRef = useRef("");
  const empresaIdRef = useRef("");
  const [contacto, setContacto] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [contactoSeleccionado, setContactoSeleccionado] = useState(null);
  const [showAgregarTelefono, setShowAgregarTelefono] = useState(false);
  const [obraSeleccionada, setObraSeleccionada] = useState(null);
  const [telefono, setTelefono] = useState("");
  const [tipo, setTipo] = useState("telefono");
  const [extension, setExtension] = useState("");
  const [formularioVisible, setFormularioVisible] = useState(true);
  const location = useLocation();

  const MAX_LENGTH = 255;

  const refs = [nombreRef];
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
    if(descripcionRef.current.value.length > MAX_LENGTH){
      setError("La descripción no puede tener más de 255 caracteres");
      setTimeout(() => {
        setError("");
      }, 1500);
      return;
    }
    const nuevoContacto = {
      nombre: nombreRef.current.value,
      descripcion: descripcionRef.current.value,
      email: emailRef.current.value === "" ? null : emailRef.current.value,
      empresaId: empresaId || empresaIdRef.current.value,
      obraId: obraId ? obraId : obraSeleccionada,
    };
  
    try {
      const response = await postContactoEmpresa(nuevoContacto, usuarioToken);
      const contacto = response.data;
      setContacto(response.data);
  
      // Dispatch para agregar el contacto
      dispatch(createContactoSuccess(contacto));
      if (obraId && !telefono) {
        dispatch(addContactoSuccess(contacto));
      }
  
      setContactoSeleccionado(contacto);
      setSuccess("Contacto agregado correctamente");
      setError("");
      setFormularioVisible(false); // Ocultar el formulario al crear el contacto con éxito
  
      // Si el campo teléfono no está vacío, intentar agregar el teléfono
      if (telefono) {
        const telefonoResponse = await agregarTelefono(contacto);
        if (!telefonoResponse.error) {
          onHide(); // Cerrar el modal si todo es exitoso
        }
      } else {
        setTimeout(() => {
          setSuccess("");
          onHide(); // Cerrar el modal si no se agrega un teléfono
        }, 2000);
      }
    } catch (error) {
      console.log(
        "Error al agregar el contacto:",
        error
      );
      setError(error.response?.data?.error || "Error al agregar el contacto");
      setSuccess("");
      setTimeout(() => {
        setError("");
      }, 4000);
    }
  };
  
  const agregarTelefono = async (contactoEmpresa) => {
    const usuarioToken = getToken();
  
    try {
      const response = await postTelefono(
        {
          contactoEmpresaId: contactoEmpresa.id,
          tipo,
          telefono,
          extension,
        },
        usuarioToken
      );
  
      const telefonoFiltrado = {
        telefono: response.data.nuevoTelefono.telefono,
        tipo: response.data.nuevoTelefono.tipo,
        extension: response.data.nuevoTelefono.extension,
      };
      const contactoCompleto = {
        ...contactoEmpresa,
        Telefonos: [telefonoFiltrado]
      };
      console.log("contactoCompleto", contactoCompleto);
      if (obraId) {
        dispatch(addContactoSuccess(contactoCompleto));
      }
  
      const datos = response.data;
  
      if (datos.error) {
        console.error(datos.error);
        setError(datos.error.message || "Error al agregar el teléfono");
        setSuccess("");
        setShowAgregarTelefono(true); // Mostrar el formulario de agregar teléfono si hay un error
        setTimeout(() => {
          setError("");
        }, 4000);
        return { error: true }; // Retornar un objeto indicando que hubo un error
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
        const telefonoPayload = {
          contactId: contactoEmpresa.id,
          telefono: tel,
        };
        dispatch(createTelefonoSuccess(telefonoPayload));
  
        setTimeout(() => {
          setSuccess("");
        }, 4000);
      }
      return { error: false }; // Retornar un objeto indicando que no hubo errores
    } catch (error) {
      console.error(
        "Error al conectar con el servidor:",
        error.response?.data || error.message
      );
      setError(error.response?.data?.error || "Error al agregar el teléfono");
      setSuccess("");
      setShowAgregarTelefono(true); // Mostrar el formulario de agregar teléfono si hay un error
      setTimeout(() => {
        setError("");
      }, 4000);
      return { error: true }; // Retornar un objeto indicando que hubo un error
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

    const telefonoFiltrado = {
      telefono: telefono.nuevoTelefono.telefono,
      tipo: telefono.nuevoTelefono.tipo,
      extension: telefono.nuevoTelefono.extension,
    };
    const contactoCompleto = {
      ...contacto,
      Telefonos: [telefonoFiltrado]
    };
    console.log("contactoCompleto", contactoCompleto);
    if(obraId){
    dispatch(addContactoSuccess(contactoCompleto));  
    } 

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
      <Modal.Header>
    <Modal.Title>Agregar Contacto</Modal.Title>
    <Button 
      variant="link" 
      onClick={onHide} 
      style={{
        textDecoration: "none",
        color: "black",
        position: "absolute",
        top: "10px",
        right: "10px",
        fontSize: "1.5rem",
      }}
    >
      &times;
    </Button>
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
            {obraId ? null : (
              <SelectObra
                obras={obras}
                obraSeleccionada={obraSeleccionada}
                onSelect={(id) => setObraSeleccionada(id)}
              />
            )}
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
