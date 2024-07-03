import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postParticular } from "../../api"; // Asegúrate de que la ruta es correcta
import useAuth from "../../hooks/useAuth";
import AlertMessage from "../AlertMessage";
import { Form, Button, Card } from "react-bootstrap";

const AgregarClienteParticular = () => {
  const nombreRef = useRef("");
  const descripcionRef = useRef("");
  const emailRef = useRef("");
  const cedulaRef = useRef("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const getToken = useAuth();

  useEffect(() => {
    const usuarioToken = getToken();
    if (!usuarioToken) {
      navigate("/login");
    }
  }, [getToken, navigate]);

  const registrarParticular = async () => {
    const usuarioToken = getToken();

    const particular = {
      nombre: nombreRef.current.value,
      descripcion: descripcionRef.current.value,
      email: emailRef.current.value,
      cedula: cedulaRef.current.value,
    };

    try {
      const response = await postParticular(particular, usuarioToken);
      const datos = response.data;

      if (datos.error) {
        console.error(datos.error);
        setError(datos.error.message || "Error al crear el particular");
        setSuccess("");
      } else {
        console.log("Particular creado correctamente", datos);
        setSuccess("Particular creado correctamente");
        setError("");

        // Limpiar los campos del formulario
        nombreRef.current.value = "";
        descripcionRef.current.value = "";
        emailRef.current.value = "";
        cedulaRef.current.value = "";

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

      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <Card className="mt-5 w-40">
        <Card.Header>
          <Card.Title>Registro de Particular</Card.Title>
        </Card.Header>
        <Card.Body>
          <Form>
            <Form.Group controlId="formNombre" className="mb-2">
              <Form.Control
                ref={nombreRef}
                type="text"
                placeholder="Nombre"
                required
              />
            </Form.Group>

            <Form.Group controlId="formDescripcion" className="mb-2">
              <Form.Control
                ref={descripcionRef}
                type="text"
                placeholder="Descripción"
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-2">
              <Form.Control
                ref={emailRef}
                type="email"
                placeholder="Email"
                required
              />
            </Form.Group>

            <Form.Group controlId="formCedula" className="mb-2">
              <Form.Control
                ref={cedulaRef}
                type="text"
                placeholder="Cédula"
                required
              />
            </Form.Group>

            <div className="text-center">
              <Button
                type="button"
                variant="primary"
                onClick={registrarParticular}
              >
                Crear Particular
              </Button>
            </div>

            {error && <AlertMessage type="error" message={error} className="mt-2" />}
            {success && <AlertMessage type="success" message={success} className="mt-2" />}
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AgregarClienteParticular;

