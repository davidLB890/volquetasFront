import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Spinner,
  Alert,
  Form,
  Container,
  Row,
  Col,
  Card,
  Button,
} from "react-bootstrap";
import { obtenerEmpleado, getPermisoIdEmpresa } from "../../api";
import useAuth from "../../hooks/useAuth";
import DatosObra from "../ObrasFolder/DatosObra";
import SelectPermiso from "../PermisosFolder/selectPermiso"; // Asegúrate de ajustar la ruta según sea necesario

const DatosPedido = () => {
  const location = useLocation();
  const pedido = location.state?.pedido;
  const [error, setError] = useState("");
  const [mostrarObra, setMostrarObra] = useState(false);
  const [choferes, setChoferes] = useState({});
  const [permisos, setPermisos] = useState([]);
  const [movimientos, setMovimientos] = useState(pedido?.Movimientos || []);
  const [selectedPermiso, setSelectedPermiso] = useState(pedido?.permisoId || "");
  const navigate = useNavigate();
  const getToken = useAuth();

  const handleNavigateToEmpresa = (empresaId) => {
    navigate("/empresas/datos", { state: { empresaId, fromPedido: true } });
  };

  const handleNavigateToParticular = (particularId) => {
    navigate("/particulares/datos", {
      state: { particularId, fromPedido: true },
    });
  };

  const handleToggleObra = () => {
    setMostrarObra(!mostrarObra);
  };

  const buscarChofer = async (choferId) => {
    const usuarioToken = getToken();
    try {
      const response = await obtenerEmpleado(choferId, usuarioToken);
      return response.data.nombre;
    } catch (error) {
      console.error(
        "Error al obtener el chofer del pedido:",
        error.response?.data?.error || error.message
      );
      setError("Error al obtener el chofer del pedido");
      setTimeout(() => setError(""), 5000);
      return "Error al obtener chofer";
    }
  };

  useEffect(() => {
    const fetchChoferes = async () => {
      if (pedido && pedido.Sugerencias) {
        const nuevosChoferes = {};
        for (const sugerencia of pedido.Sugerencias) {
          if (sugerencia.choferSugeridoId) {
            const nombreChofer = await buscarChofer(sugerencia.choferSugeridoId);
            nuevosChoferes[sugerencia.choferSugeridoId] = nombreChofer;
          }
        }
        setChoferes(nuevosChoferes);
      }
    };
    fetchChoferes();
  }, [pedido]);

  useEffect(() => {
    const fetchPermisos = async () => {
      if (pedido && pedido.Obra && pedido.Obra.empresa) {
        const usuarioToken = getToken();
        try {
          const response = await getPermisoIdEmpresa(pedido.Obra.empresa.id, usuarioToken);
          setPermisos(response.data);
        } catch (error) {
          console.error(
            "Error al obtener los permisos:",
            error.response?.data?.error || error.message
          );
          setError("Error al obtener los permisos");
          setTimeout(() => setError(""), 5000);
        }
      }
    };
    fetchPermisos();
  }, [pedido, getToken]);

  const handlePermisoSelect = (permisoId) => {
    setSelectedPermiso(permisoId);
  };

  const handleMovimientoChange = (index, key, value) => {
    const newMovimientos = [...movimientos];
    newMovimientos[index][key] = value;
    setMovimientos(newMovimientos);
  };

  if (!pedido) {
    return (
      <Alert variant="danger">No se encontraron detalles del pedido.</Alert>
    );
  }

  return (
    <Container>
      <Card className="mt-3">
        <Card.Header>
          <h1>Detalles del Pedido {pedido.id} {pedido.referenciaId ? pedido.referenciaId : ""}</h1>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p>
                <strong>Estado:</strong> {pedido.estado}
              </p>
              <p>
                <strong>Fecha de creación: </strong>
                {pedido.createdAt
                  ? new Date(pedido.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>Descripción:</strong> {pedido.descripcion}
              </p>
              <p>
                <strong>Cliente:</strong>{" "}
                {pedido.Obra?.particular ? (
                  <span
                    className="link-primary"
                    onClick={() =>
                      handleNavigateToParticular(pedido.Obra.particular.id)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {pedido.Obra.particular.nombre}
                  </span>
                ) : (
                  <span
                    className="link-primary"
                    onClick={() =>
                      handleNavigateToEmpresa(pedido.Obra.empresa.id)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {pedido.Obra?.empresa?.nombre}
                  </span>
                )}
              </p>
              <p>
                <strong>Obra:</strong>{" "}
                <span
                  className="link-primary"
                  onClick={handleToggleObra}
                  style={{ cursor: "pointer" }}
                >
                  {pedido.Obra?.calle}{" "}
                  {pedido.Obra?.numeroPuerta ? pedido.Obra.numeroPuerta : ""}{" "}
                  {pedido.Obra?.esquina ? "esq. " + pedido.Obra.esquina : ""}
                </span>
              </p>
              <p>
                <strong>Sugerencias:</strong>
              </p>
              {pedido.Sugerencias.map((sugerencia) => (
                <div key={sugerencia.id} style={{ marginLeft: "20px" }}>
                  <p>
                    <strong>Tipo:</strong> {sugerencia.tipoSugerido}
                  </p>
                  <p>
                    <strong>Horario:</strong>{" "}
                    {new Date(sugerencia.horarioSugerido).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Chofer:</strong>{" "}
                    {sugerencia.choferSugeridoId
                      ? choferes[sugerencia.choferSugeridoId] || "Cargando..."
                      : "Sin chofer asignado"}
                  </p>
                </div>
              ))}
              <Form.Group controlId="formPago">
                <Form.Check
                  type="checkbox"
                  label="Pago"
                  checked={pedido.pagoPedido?.pagado}
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              {pedido.Obra?.empresa && (
                <SelectPermiso empresaId={pedido.Obra.empresa.id} onSelect={handlePermisoSelect} />
              )}
              <p>
                <strong>Permiso Asignado:</strong> {selectedPermiso ? selectedPermiso : "Ninguno"}
              </p>
              <h3>Movimientos</h3>
              {movimientos.length > 0 ? (
                movimientos.map((movimiento, index) => (
                  <div key={movimiento.id} style={{ marginBottom: "10px" }}>
                    <Form.Group controlId={`movimiento-tipo-${index}`}>
                      <Form.Label>Tipo</Form.Label>
                      <Form.Control
                        as="select"
                        value={movimiento.tipo}
                        onChange={(e) =>
                          handleMovimientoChange(index, "tipo", e.target.value)
                        }
                      >
                        <option value="entrega">Entrega</option>
                        <option value="levante">Levante</option>
                        <option value="otro">Otro</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group controlId={`movimiento-horario-${index}`}>
                      <Form.Label>Horario</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        value={new Date(movimiento.horario).toISOString().slice(0, 16)}
                        onChange={(e) =>
                          handleMovimientoChange(index, "horario", e.target.value)
                        }
                      />
                    </Form.Group>
                    <Form.Group controlId={`movimiento-chofer-${index}`}>
                      <Form.Label>Chofer</Form.Label>
                      <Form.Control
                        type="text"
                        value={movimiento.choferId}
                        onChange={(e) =>
                          handleMovimientoChange(index, "choferId", e.target.value)
                        }
                      />
                    </Form.Group>
                  </div>
                ))
              ) : (
                <p>No hay movimientos para este pedido.</p>
              )}
            </Col>
          </Row>
          <Button variant="primary" className="mt-3">
            Guardar Cambios
          </Button>
        </Card.Body>
      </Card>
      {mostrarObra && <DatosObra obraId={pedido.Obra?.id} />}
    </Container>
  );
};

export default DatosPedido;
