import React, { useRef, useState, useEffect } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addVolqueta } from "../../features/volquetasSlice";
import useAuth from "../../hooks/useAuth";
import useHabilitarBoton from "../../hooks/useHabilitarBoton";
import { TAMANOS_VOLQUETA, ESTADOS_VOLQUETA } from "../../config/config";

const AgregarVolqueta = () => {
  const numeroVolquetaRef = useRef("");
  const tipoRef = useRef("");
  const estadoRef = useRef("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const dispatch = useDispatch();
  const { error: addError } = useSelector((state) => state.volquetas);
  const refs = [numeroVolquetaRef, tipoRef, estadoRef];
  const boton = useHabilitarBoton(refs);
  const navigate = useNavigate();
  const getToken = useAuth();

  useEffect(() => {
    if (addError) {
      setError(addError);
      setSuccess("");
    }
  }, [addError]);

  const registrarVolqueta = async () => {
    const usuarioToken = getToken();
    const volqueta = {
      numeroVolqueta: numeroVolquetaRef.current.value,
      tipo: tipoRef.current.value,
      estado: estadoRef.current.value,
    };

    try {
      await dispatch(addVolqueta({ volqueta, usuarioToken })).unwrap();
      setSuccess("Volqueta creada correctamente");
      setError("");

      numeroVolquetaRef.current.value = "";
      tipoRef.current.value = "";
      estadoRef.current.value = "";

      setTimeout(() => {
        setSuccess("");
      }, 10000);
    } catch (error) {
      setError(error);
      setSuccess("");
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
        </Card.Body>
      </Card>
    </div>
  );
};

export default AgregarVolqueta;
