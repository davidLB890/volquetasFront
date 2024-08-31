import React, { useEffect, useRef, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useHabilitarBoton from "../../hooks/useHabilitarBoton";
import { TAMANOS_VOLQUETA, ESTADOS_VOLQUETA } from "../../config/config";
import { postVolquetaAPI } from "../../api"; // Asegúrate de tener esta función en api.js

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
      await postVolquetaAPI(volqueta, usuarioToken);
      setSuccess("Volqueta creada correctamente");
      setError("");

      numeroVolquetaRef.current.value = "";
      tipoRef.current.value = "";
      estadoRef.current.value = "";

      setTimeout(() => {
        setSuccess("");
      }, 10000);
    } catch (error) {
      setError(error.response?.data?.error + " " + error.response?.data?.detalle || error.message);
      setSuccess("");
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center flex-column mt-5">
      <h2>Agregar Volqueta</h2>
      <Form className="w-50">
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
          <Form.Label>Tamaño</Form.Label>
          <Form.Control as="select" ref={tipoRef} required>
            {TAMANOS_VOLQUETA.map((tamano) => (
              <option key={tamano.value} value={tamano.value}>
                {tamano.label}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formEstado" className="mb-2">
          <Form.Label>Estado</Form.Label>
          <Form.Control as="select" ref={estadoRef} required>
            {ESTADOS_VOLQUETA.map((estado) => (
              <option key={estado.value} value={estado.value}>
                {estado.label}
              </option>
            ))}
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
    </div>
  );
};

export default AgregarVolqueta;
