import React, { useRef, useState, useEffect } from "react";
import { Modal, Form, Button, Alert, Row, Col } from "react-bootstrap";
import useHabilitarBoton from "../../hooks/useHabilitarBoton";
import AlertMessage from "../AlertMessage";
import { postObra } from "../../api";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const AgregarObra = ({
  show,
  onHide,
  onObraAgregada,
  empresaId,
  particularId,
}) => {
  const calleRef = useRef(null);
  const esquinaRef = useRef(null);
  const barrioRef = useRef(null);
  const coordenadasRef = useRef(null);
  const numeroPuertaRef = useRef(null);
  const descripcionRef = useRef(null);
  const empresaIdRef = useRef(null);
  const particularIdRef = useRef(null);

  const [detalleResiduos, setDetalleResiduos] = useState("");
  const [residuosMezclados, setResiduosMezclados] = useState(false);
  const [residuosReciclados, setResiduosReciclados] = useState(false);
  const [frecuenciaSemanalMinima, setFrecuenciaSemanalMinima] = useState([]);
  const [frecuenciaSemanalMaxima, setFrecuenciaSemanalMaxima] = useState([]);
  const [destinoFinal, setDestinoFinal] = useState("");
  const [dias, setDias] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const refs = [calleRef];
  const botonHabilitado = useHabilitarBoton(refs);

  const navigate = useNavigate();
  const getToken = useAuth();

  useEffect(() => {
    const usuarioToken = getToken();
    if (!usuarioToken) {
      navigate("/");
    }
  }, [getToken, navigate]);

  const registrarObra = async () => {
    const usuarioToken = getToken();

    const obra = {
      calle: calleRef.current?.value || "",
      esquina: esquinaRef.current?.value || "",
      barrio: barrioRef.current?.value || "",
      coordenadas: coordenadasRef.current?.value || "",
      numeroPuerta: numeroPuertaRef.current?.value || "",
      descripcion: descripcionRef.current?.value || "",
      empresaId: empresaId || empresaIdRef.current?.value || "",
      particularId: particularId || particularIdRef.current?.value || "",
      detalleResiduos,
      residuosMezclados,
      residuosReciclados,
      frecuenciaSemanalMinima,
      frecuenciaSemanalMaxima,
      destinoFinal,
      dias,
    };

    try {
      const response = await postObra(obra, usuarioToken);
      const datos = response.data;

      if (datos.error) {
        console.error(datos.error);
        setError(datos.error.message || "Error al crear la obra");
        setSuccess("");
      } else {
        console.log("Obra creada correctamente", datos);
        setSuccess("Obra creada correctamente");
        setError("");
        onObraAgregada(datos);

        // Limpiar los campos del formulario
        if (calleRef.current) calleRef.current.value = "";
        if (esquinaRef.current) esquinaRef.current.value = "";
        if (barrioRef.current) barrioRef.current.value = "";
        if (coordenadasRef.current) coordenadasRef.current.value = "";
        if (numeroPuertaRef.current) numeroPuertaRef.current.value = "";
        if (descripcionRef.current) descripcionRef.current.value = "";
        if (empresaIdRef.current) empresaIdRef.current.value = "";
        if (particularIdRef.current) particularIdRef.current.value = "";
        setDetalleResiduos("");
        setResiduosMezclados(false);
        setResiduosReciclados(false);
        setFrecuenciaSemanalMinima([]);
        setFrecuenciaSemanalMaxima([]);
        setDestinoFinal("");
        setDias("");

        setTimeout(() => {
          setSuccess("");
        }, 10000);
      }
    } catch (error) {
      console.error(error.response?.data || error.message);

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
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Registro de Obra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formCalle" className="mb-2">
            <Form.Label>
              <span className="text-danger">*</span> Calle
            </Form.Label>
            <Form.Control
              ref={calleRef}
              type="text"
              placeholder="Calle"
              required
            />
          </Form.Group>

          <h5 className="mt-4">Detalles extra</h5>

          <Row>
            <Col md={4}>
              <Form.Group controlId="formEsquina" className="mb-2">
                <Form.Label>Esquina</Form.Label>
                <Form.Control
                  ref={esquinaRef}
                  type="text"
                  placeholder="Esquina"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="formNumeroPuerta" className="mb-2">
                <Form.Label>Número de Puerta</Form.Label>
                <Form.Control
                  ref={numeroPuertaRef}
                  type="text"
                  placeholder="Número de Puerta"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="formBarrio" className="mb-2">
                <Form.Label>Barrio</Form.Label>
                <Form.Control
                  ref={barrioRef}
                  type="text"
                  placeholder="Barrio"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="formDescripcion" className="mb-2">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  ref={descripcionRef}
                  type="text"
                  placeholder="Descripción"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formResiduos" className="mb-2">
                <Form.Label>Detalle de Residuos</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Detalle de Residuos"
                  value={detalleResiduos}
                  onChange={(e) => setDetalleResiduos(e.target.value)}
                />
                <Form.Check
                  type="checkbox"
                  label="Residuos Mezclados"
                  checked={residuosMezclados}
                  onChange={(e) => setResiduosMezclados(e.target.checked)}
                />
                <Form.Check
                  type="checkbox"
                  label="Residuos Reciclados"
                  checked={residuosReciclados}
                  onChange={(e) => setResiduosReciclados(e.target.checked)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group
                controlId="formFrecuenciaSemanalMinima"
                className="mb-2"
              >
                <Form.Label>Frecuencia Semanal Mínima</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Mínima"
                  value={frecuenciaSemanalMinima}
                  onChange={(e) =>
                    setFrecuenciaSemanalMinima(
                      e.target.value.split(",").map(Number)
                    )
                  }
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group
                controlId="formFrecuenciaSemanalMaxima"
                className="mb-2"
              >
                <Form.Label>Frecuencia Semanal Máxima</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Máxima"
                  value={frecuenciaSemanalMaxima}
                  onChange={(e) =>
                    setFrecuenciaSemanalMaxima(
                      e.target.value.split(",").map(Number)
                    )
                  }
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="formDestinoFinal" className="mb-2">
                <Form.Label>Destino Final</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Destino Final"
                  value={destinoFinal}
                  onChange={(e) => setDestinoFinal(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="formDias" className="mb-2">
            <Form.Label>Días</Form.Label>
            <Form.Control
              type="text"
              placeholder="Días (ej: A solicitud)"
              value={dias}
              onChange={(e) => setDias(e.target.value)}
            />
          </Form.Group>

          <div className="text-center">
            <Button
              type="button"
              variant="primary"
              onClick={registrarObra}
              disabled={!botonHabilitado}
            >
              Crear Obra
            </Button>
          </div>

          {error && (
            <AlertMessage type="error" message={error} className="mb-2" />
          )}
          {success && (
            <AlertMessage type="success" message={success} className="mb-2" />
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AgregarObra;
