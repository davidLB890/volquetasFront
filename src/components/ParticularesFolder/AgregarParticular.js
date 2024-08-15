import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postParticular, postTelefono } from "../../api";
import useAuth from "../../hooks/useAuth";
import AlertMessage from "../AlertMessage";
import useHabilitarBoton from "../../hooks/useHabilitarBoton";
import { Form, Button, Card, Alert, Col, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const AgregarParticular = ({ onSubmit = () => {} }) => {
  const nombreRef = useRef("");
  const descripcionRef = useRef("");
  const emailRef = useRef("");
  const cedulaRef = useRef("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formularioVisible, setFormularioVisible] = useState(true);
  const [telefonoVisible, setTelefonoVisible] = useState(false);
  const [telefono, setTelefono] = useState("");
  const [tipo, setTipo] = useState("telefono");
  const [extension, setExtension] = useState("");
  const [particularId, setParticularId] = useState(null);

  const refs = [nombreRef];
  const boton = useHabilitarBoton(refs);

  const location = useLocation();
  const navigate = useNavigate();
  const getToken = useAuth();

  const handleChangeTelefono = (e) => setTelefono(e.target.value);
  const handleChangeTipo = (e) => setTipo(e.target.value);
  const handleChangeExtension = (e) => setExtension(e.target.value);

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
        setError(datos.error.message || "Error al crear el particular");
        setSuccess("");
      } else {
        setParticularId(datos.id);
        setFormularioVisible(false); // Ocultar el formulario si el particular se creó correctamente
  
        // Si el teléfono fue ingresado, intentar agregarlo con la primera función
        if (telefono) {
          try {
            await agregarTelefono(datos.id);
            setSuccess("Particular y teléfono agregados correctamente");
            setError("");
            if (location.pathname === "/particulares/crear") {
              navigate("/particulares/datos", { state: { particularId: datos.id } });
            }
            // Resetea el estado del teléfono
            setTelefono("");
            setExtension("");
            setTipo("telefono");
          } catch (error) {
            // Mostrar mensaje de error específico del teléfono
            setError(`Particular creado, pero error al agregar el teléfono: ${error.message || error}`);
            setTelefonoVisible(true); // Mostrar campos para el teléfono
          }
        } else {
          setSuccess("Particular creado correctamente");
          setError("");
          if (location.pathname === "/particulares/crear") {
            navigate("/particulares/datos", { state: { particularId: datos.id } });
          }
        }
  
        // Llamada a onSubmit con los datos del particular creado
        onSubmit({ id: datos.id, nombre: datos.nombre });
      }
    } catch (error) {
      setError("Error al crear el particular");
      setSuccess("");
  
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };  
  
  const agregarTelefono = async (particularId) => {
    const usuarioToken = getToken();
    try {
      await postTelefono(
        {
          particularId,
          tipo,
          telefono,
          extension,
        },
        usuarioToken
      );
      // Si tiene éxito
      setSuccess("Teléfono agregado correctamente");
      setError("");
      setTelefonoVisible(false); // Ocultar los campos de teléfono después del éxito
    } catch (error) {
      console.error("Error al agregar el teléfono:", error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || error.message);
    }
  };

  const reintentarAgregarTelefono = async () => {
    const usuarioToken = getToken();
  
    try {
      await postTelefono(
        {
          particularId, // Usar el ID del particular creado anteriormente
          tipo,
          telefono,
          extension,
        },
        usuarioToken
      );
  
      setSuccess("Teléfono agregado correctamente");
      setError("");
      if (location.pathname === "/particulares/crear") {
        navigate("/particulares/datos", { state: { particularId: particularId } });
      }
      setTelefonoVisible(false); // Ocultar los campos de teléfono después del éxito
    } catch (error) {
      console.error("Error al agregar el teléfono:", error.response?.data?.error || error.message);
      setError(error.response?.data?.error);
      setSuccess("");
    }
  }; 

  return (
    <div className="d-flex justify-content-center align-items-center">
      <Card className="mt-5 w-40">
        <Card.Header>
          <Card.Title>Registro de Particular</Card.Title>
        </Card.Header>
        <Card.Body>
          {formularioVisible && (
            <Form>
              <Form.Group controlId="formNombre" className="mb-2">
                <Form.Label>
                  <span className="text-danger">*</span> Nombre
                </Form.Label>
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
          )}

          {telefonoVisible && (
            <Form>
              <Alert variant="danger">
                <strong>Error:</strong> {error}
              </Alert>
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
                  onClick={reintentarAgregarTelefono}
                  disabled={!telefono}
                >
                  Reintentar agregar Teléfono
                </Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default AgregarParticular;




/* if (location.pathname === "/particulares/crear") {
            navigate("/particulares/datos", { state: { particularId: datos.id } });
          } */
