import React, { useRef, useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { postHistoricoCamion, obtenerEmpleados } from "../../api";
import { Form, Button, Modal, Alert } from "react-bootstrap";

const AsignarChofer = ({ camionId, onHide }) => {
  const [choferIdSeleccionado, setChoferIdSeleccionado] = useState("");
  const [choferes, setChoferes] = useState([]);
  const [error, setError] = useState("");

  const getToken = useAuth();
  const choferIdRef = useRef();
  const fechaInicioRef = useRef();

  useEffect(() => {
    const fetchEmpleados = async () => {
      const usuarioToken = getToken();
      try {
        const response = await obtenerEmpleados(usuarioToken);
        const empleados = response.data;
        const choferesFiltrados = empleados.filter(
          (empleado) => empleado.rol === "chofer"
        );
        setChoferes(choferesFiltrados);
      } catch (error) {
        console.error("Error al obtener empleados:", error);
        setError("Error al obtener la lista de empleados.");
      }
    };

    fetchEmpleados();
  }, [getToken]);

  const handleAsignarChofer = async () => {
    const usuarioToken = getToken();
    const choferId = choferIdRef.current.value;
    const fechaInicio = fechaInicioRef.current.value;

    // Verificar que ambos campos estén completos
    if (!choferId || !fechaInicio) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    try {
      const response = await postHistoricoCamion(
        camionId,
        choferId,
        fechaInicio,
        usuarioToken
      );
      const datos = response.data;
      if (datos.error) {
        console.error(datos.error);
        setError(datos.error);
      } else {
        console.log("Chofer asignado correctamente", datos);
        onHide(); // Cerrar el modal después de asignar el chofer correctamente
      }
    } catch (error) {
      console.error(
        "Error al asignar chofer:",
        error.response?.data?.error || error.message
      );
      setError(error.response?.data?.error || "Error al asignar chofer.");
    }
  };

  return (
    <Modal show={true} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Asignar Chofer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group controlId="selectChofer">
            <Form.Label>Chofer</Form.Label>
            <Form.Control
              as="select"
              ref={choferIdRef}
              value={choferIdSeleccionado}
              required
              onChange={(e) => setChoferIdSeleccionado(e.target.value)}
            >
              <option value="">Seleccionar Chofer</option>
              {choferes.map((chofer) => (
                <option key={chofer.id} value={chofer.id}>
                  {chofer.nombre}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="fechaInicio">
            <Form.Label>Fecha de Inicio</Form.Label>
            <Form.Control type="datetime-local" ref={fechaInicioRef} required />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
        <Button
          variant="primary"
          onClick={handleAsignarChofer}
        >
          Asignar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AsignarChofer;

/* <Container>
            <Row className="align-items-end">
              <h3>Asignar chofer</h3>
                <Col md={8}>
                <Form.Group controlId="selectChofer">
                    <Form.Control
                    as="select"
                    ref={choferIdRef}
                    value={choferIdSeleccionado}
                    onChange={(e) => setChoferIdSeleccionado(e.target.value)}
                    >
                    <option value="">Seleccionar Chofer</option>
                    {choferes.map((chofer) => (
                        <option key={chofer.id} value={chofer.id}>
                        {chofer.nombre}
                        </option>
                    ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="fechaInicio">
                    <Form.Control
                    type="datetime-local"
                    ref={fechaInicioRef}
                    className="form-control"
                    placeholder="Fecha"
                    required
                    />
                </Form.Group>
                </Col>
                <Col md={4} className="text-md-right">
                <Button
                    variant="primary"
                    onClick={handleAsignarChofer}
                    disabled={!botonAsignar}
                    className="mt-3 mt-md-0"
                >
                    Asignar
                </Button>
                </Col>
            </Row>
    </Container> */
