import React, { useState } from "react";
import { Modal, Form, Button, Alert, Row, Col, Spinner } from "react-bootstrap";
import { putObra, putObraDetalle } from "../../api";
import useAuth from "../../hooks/useAuth";

const ModificarObra = ({ obra, show, onHide, onUpdate }) => {
  const getToken = useAuth();

  const [nuevaObra, setNuevaObra] = useState({
    calle: obra?.calle || '',
    esquina: obra?.esquina || '',
    barrio: obra?.barrio || '',
    coordenadas: obra?.coordenadas || '',
    numeroPuerta: obra?.numeroPuerta || '',
    descripcion: obra?.descripcion || '',
    clienteEmpresaId: obra?.clienteEmpresaId || null,
  });

  const [detalleObra, setDetalleObra] = useState({
    detalleResiduos: obra?.ObraDetalle?.detalleResiduos || '',
    residuosMezclados: obra?.ObraDetalle?.residuosMezclados || false,
    residuosReciclados: obra?.ObraDetalle?.residuosReciclados || false,
    frecuenciaSemanal: obra?.ObraDetalle?.frecuenciaSemanal || '',
    destinoFinal: obra?.ObraDetalle?.destinoFinal || '',
    dias: obra?.ObraDetalle?.dias || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    if (name in nuevaObra) {
      setNuevaObra({ ...nuevaObra, [name]: val });
    } else {
      setDetalleObra({ ...detalleObra, [name]: val });
    }
  };

const handleModificar = async () => {
  const usuarioToken = getToken();
  setLoading(true);
  setError("");
  setSuccess("");

  try {
    if (Object.keys(nuevaObra).some(key => nuevaObra[key] !== obra[key])) {
      await putObra(obra.id, nuevaObra, usuarioToken);
    }
    if (Object.keys(detalleObra).some(key => detalleObra[key] !== obra.ObraDetalle?.[key])) {
      await putObraDetalle(obra.ObraDetalle.id, detalleObra, usuarioToken);
    }
    setSuccess("Obra actualizada correctamente");
    onUpdate(nuevaObra, detalleObra); // Pasar por separado
    onHide(); // Cierra el modal después de actualizar
  } catch (error) {
    console.error("Error al actualizar la obra:", error);
    setError(error.response?.data?.error || "Error al actualizar la obra");
  }

  setLoading(false);
};


  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Modificar Obra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form>
          <Form.Group controlId="formCalle" className="mb-2">
            <Form.Label>Calle</Form.Label>
            <Form.Control
              type="text"
              name="calle"
              value={nuevaObra.calle}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Row>
            {/* <Col md={4}>
              <Form.Group controlId="formEsquina" className="mb-2">
                <Form.Label>Esquina</Form.Label>
                <Form.Control
                  type="text"
                  name="esquina"
                  value={nuevaObra.esquina}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="formNumeroPuerta" className="mb-2">
                <Form.Label>Número de Puerta</Form.Label>
                <Form.Control
                  type="text"
                  name="numeroPuerta"
                  value={nuevaObra.numeroPuerta}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col> */}
            <Col md={4}>
              <Form.Group controlId="formBarrio" className="mb-2">
                <Form.Label>Barrio</Form.Label>
                <Form.Control
                  type="text"
                  name="barrio"
                  value={nuevaObra.barrio}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formDescripcion" className="mb-2">
                <Form.Label>Referencias / Descripción</Form.Label>
                <Form.Control
                  type="text"
                  name="descripcion"
                  value={nuevaObra.descripcion}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            
          </Row>

          {obra.ObraDetalle && (
            <>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="formResiduos" className="mb-2">
                    <Form.Label>Detalle de Residuos</Form.Label>
                    <Form.Control
                      type="text"
                      name="detalleResiduos"
                      value={detalleObra.detalleResiduos}
                      onChange={handleInputChange}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Residuos Mezclados"
                      name="residuosMezclados"
                      checked={detalleObra.residuosMezclados}
                      onChange={handleInputChange}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Residuos Reciclados"
                      name="residuosReciclados"
                      checked={detalleObra.residuosReciclados}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <Form.Group controlId="formFrecuenciaSemanalMinima" className="mb-2">
                    <Form.Label>Frecuencia Semanal Mínima</Form.Label>
                    <Form.Control
                      type="text"
                      name="frecuenciaSemanalMinima"
                      value={detalleObra.frecuenciaSemanalMinima}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="formFrecuenciaSemanalMaxima" className="mb-2">
                    <Form.Label>Frecuencia Semanal Máxima</Form.Label>
                    <Form.Control
                      type="text"
                      name="frecuenciaSemanalMaxima"
                      value={detalleObra.frecuenciaSemanalMaxima}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="formDestinoFinal" className="mb-2">
                    <Form.Label>Destino Final</Form.Label>
                    <Form.Control
                      type="text"
                      name="destinoFinal"
                      value={detalleObra.destinoFinal}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group controlId="formDias" className="mb-2">
                <Form.Label>Días</Form.Label>
                <Form.Control
                  type="text"
                  name="dias"
                  value={detalleObra.dias}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </>
          )}
          <div className="text-center">
            <Button
              type="button"
              variant="primary"
              onClick={handleModificar}
              disabled={loading}
            >
              Guardar Cambios
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModificarObra;
