import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postEmpresa } from "../../api"; // Asegúrate de que la ruta es correcta
import useAuth from "../../hooks/useAuth";
import AlertMessage from "../AlertMessage";
import { Form, Button, Card, Alert } from "react-bootstrap";

const AgregarClienteEmpresa = () => {
  const rutRef = useRef("");
  const nombreRef = useRef("");
  const razonSocialRef = useRef("");
  const descripcionRef = useRef("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mostrar, setMostrar] = useState(false);

  const navigate = useNavigate();
  const getToken = useAuth();

  useEffect(() => {
    const usuarioToken = getToken();
    if (!usuarioToken) {
      navigate("/login");
    }
  }, [getToken, navigate]);

  const registrarEmpresa = async () => {
    const usuarioToken = getToken();

    const empresa = {
      rut: rutRef.current.value,
      nombre: nombreRef.current.value,
      razonSocial: razonSocialRef.current.value,
      descripcion: descripcionRef.current.value,
    };

    try {
      const response = await postEmpresa(empresa, usuarioToken);
      const datos = response.data;

      if (datos.error) {
        console.error(datos.error);
        setError(datos.error.message || "Error al crear la empresa");
        setSuccess("");
      } else {
        console.log("Empresa creada correctamente", datos);
        setMostrar(true);
        setSuccess("Empresa creada correctamente");
        setError("");

        // Limpiar los campos del formulario
        rutRef.current.value = "";
        nombreRef.current.value = "";
        razonSocialRef.current.value = "";
        descripcionRef.current.value = "";

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
          <Card.Title>Registro de Empresa</Card.Title>
        </Card.Header>
        <Card.Body>
          <Form>
            <Form.Group controlId="formRut" className="mb-2">
              <Form.Control
                ref={rutRef}
                type="text"
                placeholder="RUT"
                required
              />
            </Form.Group>

            <Form.Group controlId="formNombre" className="mb-2">
              <Form.Control
                ref={nombreRef}
                type="text"
                placeholder="Nombre"
                required
              />
            </Form.Group>

            <Form.Group controlId="formRazonSocial" className="mb-2">
              <Form.Control
                ref={razonSocialRef}
                type="text"
                placeholder="Razón Social"
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

            <div className="text-center">
              <Button
                type="button"
                variant="primary"
                onClick={registrarEmpresa}
              >
                Crear Empresa
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

export default AgregarClienteEmpresa;
