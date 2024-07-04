import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { postObra } from "../../api";
import useAuth from "../../hooks/useAuth";
import AlertMessage from "../AlertMessage";
import useHabilitarBoton from "../../hooks/useHabilitarBoton";
import { Form, Button, Card, Alert } from "react-bootstrap";

const AgregarObra = () => {
  const calleRef = useRef("");
  const esquinaRef = useRef("");
  const barrioRef = useRef("");
  const coordenadasRef = useRef("");
  const numeroPuertaRef = useRef("");
  const descripcionRef = useRef("");
  const empresaIdRef = useRef("");

  const [detalleResiduos, setDetalleResiduos] = useState("");
  const [residuosMezclados, setResiduosMezclados] = useState(false);
  const [residuosReciclados, setResiduosReciclados] = useState(false);
  const [frecuenciaSemanal, setFrecuenciaSemanal] = useState([]);
  const [destinoFinal, setDestinoFinal] = useState("");
  const [dias, setDias] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mostrar, setMostrar] = useState(false);

  const refs = [calleRef, esquinaRef, barrioRef, coordenadasRef, numeroPuertaRef, descripcionRef, empresaIdRef];
  const boton = useHabilitarBoton(refs);

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
      calle: calleRef.current.value,
      esquina: esquinaRef.current.value,
      barrio: barrioRef.current.value,
      coordenadas: coordenadasRef.current.value,
      numeroPuerta: numeroPuertaRef.current.value,
      descripcion: descripcionRef.current.value,
      empresaId: empresaIdRef.current.value,
      detalleResiduos,
      residuosMezclados,
      residuosReciclados,
      frecuenciaSemanal,
      destinoFinal,
      dias
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
        setMostrar(true);
        setSuccess("Obra creada correctamente");
        setError("");

        // Limpiar los campos del formulario
        refs.forEach(ref => ref.current.value = "");
        setDetalleResiduos("");
        setResiduosMezclados(false);
        setResiduosReciclados(false);
        setFrecuenciaSemanal([]);
        setDestinoFinal("");
        setDias("");

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
          <Card.Title>Registro de Obra</Card.Title>
        </Card.Header>
        <Card.Body>
          <Form>
            <Form.Group controlId="formCalle" className="mb-2">
              <Form.Label><span className="text-danger">*</span> Calle</Form.Label>
              <Form.Control
                ref={calleRef}
                type="text"
                placeholder="Calle"
                required
              />
            </Form.Group>

            <Form.Group controlId="formEsquina" className="mb-2">
              <Form.Label><span className="text-danger">*</span> Esquina</Form.Label>
              <Form.Control
                ref={esquinaRef}
                type="text"
                placeholder="Esquina"
                required
              />
            </Form.Group>

            <Form.Group controlId="formBarrio" className="mb-2">
              <Form.Label><span className="text-danger">*</span> Barrio</Form.Label>
              <Form.Control
                ref={barrioRef}
                type="text"
                placeholder="Barrio"
                required
              />
            </Form.Group>

            <Form.Group controlId="formCoordenadas" className="mb-2">
              <Form.Label><span className="text-danger">*</span> Coordenadas</Form.Label>
              <Form.Control
                ref={coordenadasRef}
                type="text"
                placeholder="Coordenadas"
                required
              />
            </Form.Group>

            <Form.Group controlId="formNumeroPuerta" className="mb-2">
              <Form.Label><span className="text-danger">*</span> Número de Puerta</Form.Label>
              <Form.Control
                ref={numeroPuertaRef}
                type="text"
                placeholder="Número de Puerta"
                required
              />
            </Form.Group>

            <Form.Group controlId="formDescripcion" className="mb-2">
              <Form.Label><span className="text-danger">*</span> Descripción</Form.Label>
              <Form.Control
                ref={descripcionRef}
                type="text"
                placeholder="Descripción"
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmpresaId" className="mb-2">
              <Form.Label><span className="text-danger">*</span> ID de la Empresa</Form.Label>
              <Form.Control
                ref={empresaIdRef}
                type="text"
                placeholder="ID de la Empresa"
                required
              />
            </Form.Group>

            <h5 className="mt-4">Campos Opcionales</h5>

            <Form.Group controlId="formDetalleResiduos" className="mb-2">
              <Form.Label>Detalle de Residuos</Form.Label>
              <Form.Control
                type="text"
                placeholder="Detalle de Residuos"
                value={detalleResiduos}
                onChange={(e) => setDetalleResiduos(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formResiduosMezclados" className="mb-2">
              <Form.Check
                type="checkbox"
                label="Residuos Mezclados"
                checked={residuosMezclados}
                onChange={(e) => setResiduosMezclados(e.target.checked)}
              />
            </Form.Group>

            <Form.Group controlId="formResiduosReciclados" className="mb-2">
              <Form.Check
                type="checkbox"
                label="Residuos Reciclados"
                checked={residuosReciclados}
                onChange={(e) => setResiduosReciclados(e.target.checked)}
              />
            </Form.Group>

            <Form.Group controlId="formFrecuenciaSemanal" className="mb-2">
              <Form.Label>Frecuencia Semanal</Form.Label>
              <Form.Control
                type="text"
                placeholder="Días de la semana (ej: 2,5)"
                value={frecuenciaSemanal}
                onChange={(e) => setFrecuenciaSemanal(e.target.value.split(',').map(Number))}
              />
            </Form.Group>

            <Form.Group controlId="formDestinoFinal" className="mb-2">
              <Form.Label>Destino Final</Form.Label>
              <Form.Control
                type="text"
                placeholder="Destino Final"
                value={destinoFinal}
                onChange={(e) => setDestinoFinal(e.target.value)}
              />
            </Form.Group>

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
                disabled={!boton}
              >
                Crear Obra
              </Button>
            </div>

            {error && <AlertMessage type="error" message={error} className="mb-2" />}
            {success && <AlertMessage type="success" message={success} className="mb-2" />}
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AgregarObra;
