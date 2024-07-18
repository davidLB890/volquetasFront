import React, { useRef, useState, useEffect } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { postVolqueta } from "../../api";
import useAuth from "../../hooks/useAuth";
import useHabilitarBoton from "../../hooks/useHabilitarBoton";

const AgregarVolqueta = () => {
  const numeroVolquetaRef = useRef("");
  const tipoRef = useRef("");
  const estadoRef = useRef("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const refs = [numeroVolquetaRef, tipoRef, estadoRef];
  const boton = useHabilitarBoton(refs);

  const navigate = useNavigate();
  const getToken = useAuth();

  useEffect(() => {
    const usuarioToken = getToken();
    if (!usuarioToken) {
      navigate("/");
    }
  }, [getToken, navigate]);

  const registrarVolqueta = async () => {
    const usuarioToken = getToken();

    const volqueta = {
      numeroVolqueta: numeroVolquetaRef.current.value,
      tipo: tipoRef.current.value,
      estado: estadoRef.current.value,
    };

    try {
      const response = await postVolqueta(volqueta, usuarioToken);
      const datos = response.data;

      if (datos.error) {
        console.error(datos.error);
        setError(datos.error.message || "Error al crear la volqueta");
        setSuccess("");
      } else {
        console.log("Volqueta creada correctamente", datos);
        setSuccess("Volqueta creada correctamente");
        setError("");

        // Limpiar los campos del formulario
        numeroVolquetaRef.current.value = "";
        tipoRef.current.value = "";
        estadoRef.current.value = "";

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
          <Card.Title>Agregar Volqueta</Card.Title>
        </Card.Header>
        <Card.Body>
          <Form>
            <Form.Group controlId="formNumeroVolqueta" className="mb-2">
              <Form.Label>Número de Volqueta</Form.Label>
              <Form.Control
                ref={numeroVolquetaRef}
                type="number"
                placeholder="Número de Volqueta"
                required
              />
            </Form.Group>

            <Form.Group controlId="formTipo" className="mb-2">
              <Form.Label>Tipo</Form.Label>
              <Form.Control as="select" ref={tipoRef} required>
                <option value="">Seleccione el tipo</option>
                <option value="grande">Grande</option>
                <option value="mediana">Mediana</option>
                <option value="pequeña">Pequeña</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formEstado" className="mb-2">
              <Form.Label>Estado</Form.Label>
              <Form.Control as="select" ref={estadoRef} required>
                <option value="">Seleccione el estado</option>
                <option value="sana">Sana</option>
                <option value="dañada">Dañada</option>
                <option value="perdida">Perdida</option>
              </Form.Control>
            </Form.Group>

            {error && (
              <Alert variant="danger" className="text-center mb-2">
                {error}
              </Alert>
            )}
            {success && (
              <Alert variant="success" className="text-center mb-2">
                {success}
              </Alert>
            )}

            <div className="text-center">
              <Button
                type="button"
                variant="primary"
                onClick={registrarVolqueta}
                disabled={!boton}
              >
                Confirmar
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AgregarVolqueta;
