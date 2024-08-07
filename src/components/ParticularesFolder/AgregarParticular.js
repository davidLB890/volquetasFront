import React from 'react';
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { postParticular, postTelefono } from "../../api";
import useAuth from "../../hooks/useAuth";
import AlertMessage from "../AlertMessage";
import useHabilitarBoton from "../../hooks/useHabilitarBoton";
import { Form, Button, Card, Alert, Col, Row } from "react-bootstrap";
import AgregarTelefono from "../TelefonosFolder/AgregarTelefono"; // Asegúrate de importar AgregarTelefono

const AgregarParticular = ({ onSubmit = () => {} }) => {
  const nombreRef = useRef("");
  const descripcionRef = useRef("");
  const emailRef = useRef("");
  const cedulaRef = useRef("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [showAgregar, setShowAgregar] = useState(false);
  const [particularSeleccionado, setParticularSeleccionado] = useState(null);
  const [formularioVisible, setFormularioVisible] = useState(true); // Nuevo estado para controlar la visibilidad del formulario
  const [telefono, setTelefono] = useState("");
  const [tipo, setTipo] = useState("telefono");
  const [extension, setExtension] = useState("");

  const refs = [nombreRef];
  const boton = useHabilitarBoton(refs);

  const navigate = useNavigate();
  const getToken = useAuth();

  const handleChangeTelefono = (e) => setTelefono(e.target.value);
  const handleChangeTipo = (e) => setTipo(e.target.value);
  const handleChangeExtension = (e) => setExtension(e.target.value);

  useEffect(() => {
    const usuarioToken = getToken();
    if (!usuarioToken) {
      navigate("/");
    }
  }, [getToken, navigate]);

  const registrarParticular = async () => {
    const usuarioToken = getToken();

    const nombre = nombreRef.current.value;
    const descripcion = descripcionRef.current.value;
    const email = emailRef.current.value;
    const cedula = cedulaRef.current.value;

    try {
      const response = await postParticular(
        {
          nombre,
          descripcion,
          email,
          cedula,
        },
        usuarioToken
      );

      const datos = response.data;

      if (datos.error) {
        console.error(datos.error);
        setError(datos.error.message || "Error al crear el particular");
        setSuccess("");
      } else {
        console.log("Particular creado correctamente", datos);
        setMostrar(true);
        setParticularSeleccionado({ id: datos.id, nombre: datos.nombre });
        setSuccess("Particular creado correctamente");
        setError("");
        setFormularioVisible(false); // Ocultar el formulario al crear el particular con éxito

        // Aquí llamamos a onSubmit con los datos del particular creado
        onSubmit({ id: datos.id, nombre: datos.nombre });

        // Si el campo teléfono no está vacío, intentar agregar el teléfono
        if (telefono) {
          await agregarTelefono(datos.id);
        } else {
          setTimeout(() => {
            setSuccess("");
          }, 10000);
        }
      }
    } catch (error) {
      console.error(
        "Error al conectar con el servidor:",
        error.response?.data || error.message
      );

      let errorMessage = "Error inesperado. Inténtelo más tarde.";
      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (typeof error.response.data === "object") {
          if (
            error.response.data.detalle &&
            Array.isArray(error.response.data.detalle)
          ) {
            errorMessage = error.response.data.detalle.join(", ");
          } else {
            errorMessage =
              error.response.data.error || JSON.stringify(error.response.data);
          }
        }
      } else {
        errorMessage = error.message;
      }

      setError(errorMessage);
      setSuccess("");

      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const agregarTelefono = async (particularId) => {
    const usuarioToken = getToken();

    try {
      const response = await postTelefono(
        {
          particularId,
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
      } else {
        console.log("Teléfono agregado correctamente", datos);
        setSuccess("Teléfono agregado correctamente");
        setError("");

        setTimeout(() => {
          setSuccess("");
        }, 10000);
      }
    } catch (error) {
      console.error(
        "Error al conectar con el servidor:",
        error.response?.data || error.message
      );

      let errorMessage = "Error inesperado. Inténtelo más tarde.";
      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (typeof error.response.data === "object") {
          if (
            error.response.data.detalle &&
            Array.isArray(error.response.data.detalle)
          ) {
            errorMessage = error.response.data.detalle.join(", ");
          } else {
            errorMessage =
              error.response.data.error || JSON.stringify(error.response.data);
          }
        }
      } else {
        errorMessage = error.message;
      }

      setError(errorMessage);
      setSuccess("");
      
    }
  };

  const handleTelefonoAgregado = () => {
    // Mantener la ventana abierta y mostrar un mensaje de "listo" para agregar más números
    setSuccess("Teléfono agregado correctamente. Puede agregar más números.");
  };

  const handleMostrarAgregar = () => {
    setShowAgregar(true);
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <Card className="mt-5 w-40">
        <Card.Header>
          <Card.Title>Registro de Particular</Card.Title>
        </Card.Header>
        <Card.Body>
          {formularioVisible ? (
            <Form>
              <Form.Group controlId="formNombre" className="mb-2">
                <Form.Label><span className="text-danger">*</span> Nombre</Form.Label>
                <Form.Control
                  ref={nombreRef}
                  type="text"
                  placeholder="Nombre"
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group controlId="formEmail" className="mb-2">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      ref={emailRef}
                      type="email"
                      placeholder="Email"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formCedula" className="mb-2">
                    <Form.Label>Cédula</Form.Label>
                    <Form.Control
                      ref={cedulaRef}
                      type="text"
                      placeholder="Cédula"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group controlId="formDescripcion" className="mb-2">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  ref={descripcionRef}
                  type="text"
                  placeholder="Descripción"
                  required
                />
              </Form.Group>

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

              <div className="text-center">
                <Button
                  type="button"
                  variant="primary"
                  onClick={registrarParticular}
                  disabled={!boton}
                >
                  Crear Particular
                </Button>
              </div>

              {error && (
                <AlertMessage type="error" message={error} className="mb-2" />
              )}
              {success && (
                <AlertMessage
                  type="success"
                  message={success}
                  className="mb-2"
                />
              )}
            </Form>
          ) : (
            <div className="text-center">
              {showAgregar ? (
                <AgregarTelefono
                  show={showAgregar}
                  onHide={() => setShowAgregar(false)}
                  particularId={particularSeleccionado?.id}
                  nombre={particularSeleccionado?.nombre}
                  onTelefonoAgregado={handleTelefonoAgregado}
                  className="mb-2"
                />
              ) : (
                <>
                  <Button
                    variant="secondary"
                    className="ml-2"
                    onClick={handleMostrarAgregar}
                  >
                    Click aquí para agregar teléfono
                  </Button>
                  {error && (
                    <AlertMessage type="error" message={error} className="mt-2" />
                  )}
                </>
              )}
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default AgregarParticular;
