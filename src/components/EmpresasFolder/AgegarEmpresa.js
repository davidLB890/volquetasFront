import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postEmpresa } from "../../api";
import useAuth from "../../hooks/useAuth";
import AlertMessage from "../AlertMessage";
import useHabilitarBoton from "../../hooks/useHabilitarBoton";
import { Form, Button, Card, Alert } from "react-bootstrap";
import AgregarContactoEmpresa from "./AgregarContactoEmpresa";

const AgregarEmpresa = ({ onSubmit }) => {
  const rutRef = useRef("");
  const nombreRef = useRef("");
  const razonSocialRef = useRef("");
  const descripcionRef = useRef("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [showAgregarContacto, setShowAgregarContacto] = useState(false);
  const [empresaAgregada, setEmpresaAgregada] = useState(null);
  const [formularioVisible, setFormularioVisible] = useState(true); // Nuevo estado para controlar la visibilidad del formulario

  const refs = [/* rutRef,  */nombreRef];
  const boton = useHabilitarBoton(refs);

  const navigate = useNavigate();
  const getToken = useAuth();

  useEffect(() => {
    const usuarioToken = getToken();
    if (!usuarioToken) {
      navigate("/");
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
        setEmpresaAgregada({ id: datos.id, nombre: datos.nombre });
        setSuccess("Empresa creada correctamente");
        setError("");
        setFormularioVisible(false); // Ocultar el formulario al crear la empresa con éxito

        // Aquí llamamos a onSubmit con los datos de la empresa creada
        onSubmit({ id: datos.id, nombre: datos.nombre });

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

  const handleContactoAgregado = () => {
    setShowAgregarContacto(false);
    setEmpresaAgregada(null);
  };

  const handleMostrarAgregarContacto = () => {
    setShowAgregarContacto(true);
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <Card className="mt-5 w-40">
        <Card.Header>
          <Card.Title>Registro de Empresa</Card.Title>
        </Card.Header>
        <Card.Body>
          {formularioVisible ? (
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
                  disabled={!boton}
                >
                  Crear Empresa
                </Button>
              </div>

              {error && <AlertMessage type="error" message={error} className="mb-2" />}
              {success && <AlertMessage type="success" message={success} className="mb-2" />}
            </Form>
          ) : (
            <div className="text-center">
              <Button
                variant="secondary"
                className="ml-2"
                onClick={handleMostrarAgregarContacto}
              >
                Click aquí para agregar contacto
              </Button>
            </div>
          )}

          {empresaAgregada && (
            <AgregarContactoEmpresa
              show={showAgregarContacto}
              onHide={() => setShowAgregarContacto(false)}
              empresaId={empresaAgregada.id}
              nombre={empresaAgregada.nombre}
              onContactoAgregado={handleContactoAgregado}
              className="mb-2"
            />
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default AgregarEmpresa;
