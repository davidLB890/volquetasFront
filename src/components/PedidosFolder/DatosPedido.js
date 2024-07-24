import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { Spinner, Alert, Container, Row, Col, Card, Button } from "react-bootstrap";
import { fetchPedido, fetchObra, fetchPermisos, updatePedido, addMovimiento, deleteMovimiento, modifyMovimiento } from '../../features/pedidoSlice';
import useAuth from "../../hooks/useAuth";
import DatosObra from "../ObrasFolder/DatosObra";
import MovimientosYSugerencias from "../MovimientosFolder/MovimientosYSugerencias"; // Asegúrate de ajustar la ruta según sea necesario
import DetallesPedido from "./DetallesPedido"; // Asegúrate de ajustar la ruta según sea necesario
import ContactosObraSimple from "../ObrasFolder/ContactosObraSimple";
import PagoPedido from "../PagosPedidoFolder/PagosPedido";

const DatosPedido = () => {
  const location = useLocation();
  const pedidoId = location.state?.pedidoId;
  const volquetaId = location.state?.volquetaId;
  const empresaId = location.state?.empresaId;
  const particularId = location.state?.particularId;
  const dispatch = useDispatch();
  const { pedido, obra, permisos, loading, error } = useSelector((state) => state.pedido);
  const getToken = useAuth();
  const navigate = useNavigate();
  const [mostrarObra, setMostrarObra] = useState(false);

  useEffect(() => {
    const usuarioToken = getToken();
    dispatch(fetchPedido({ pedidoId, usuarioToken }));
  }, [dispatch, getToken, pedidoId]);

  useEffect(() => {
    if (pedido?.obraId) {
      const usuarioToken = getToken();
      dispatch(fetchObra({ obraId: pedido.obraId, usuarioToken }));
    }
  }, [dispatch, getToken, pedido]);

  useEffect(() => {
    if (pedido?.Obra?.empresa?.id) {
      const usuarioToken = getToken();
      dispatch(fetchPermisos({ empresaId: pedido.Obra.empresa.id, usuarioToken }));
    }
  }, [dispatch, getToken, pedido]);

  const handleToggleObra = () => {
    setMostrarObra(!mostrarObra);
  };

  const handleMovimientoModificado = (movimientoModificado) => {
    dispatch(modifyMovimiento(movimientoModificado));
  };

  const handleMovimientoEliminado = (movimientoId) => {
    dispatch(deleteMovimiento(movimientoId));
  };

  const handlePedidoModificado = (updatedPedido) => {
    dispatch(updatePedido(updatedPedido));
  };

  const handleMovimientoAgregado = (nuevoMovimiento) => {
    dispatch(addMovimiento(nuevoMovimiento));
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!pedido) {
    return <Alert variant="danger">No se encontraron detalles del pedido.</Alert>;
  }

  return (
    <Container>
      {volquetaId && (
        <Button
          variant="secondary"
          className="mt-3 ml-3"
          onClick={() => navigate("/volquetas/datos", { state: { volquetaId } })}
        >
          Volver a Volqueta
        </Button>
      )}
      {empresaId && (
        <Button
          variant="secondary"
          className="mt-3 ml-3"
          onClick={() => navigate("/empresas/datos", { state: { empresaId } })}
        >
          Volver a Empresa
        </Button>
      )}
      {particularId && (
        <Button
          variant="secondary"
          className="mt-3 ml-3"
          onClick={() => navigate("/particulares/datos", { state: { particularId } })}
        >
          Volver a Particular
        </Button>
      )}

      <Card className="mt-3">
        <Card.Header>
          <h1>
            Detalles del Pedido {pedido.id}{" "}
            {pedido.referenciaId ? pedido.referenciaId : ""}
          </h1>
        </Card.Header>
        <Card.Body>
          <MovimientosYSugerencias
            movimientos={pedido.Movimientos}
            pedidoId={pedidoId}
            onMovimientoAgregado={handleMovimientoAgregado}
            onMovimientoModificado={handleMovimientoModificado}
            onMovimientoEliminado={handleMovimientoEliminado}
          />
          <Row>
            <Col md={6}>
              <DetallesPedido
                detalles={pedido}
                onPedidoModificado={handlePedidoModificado}
              />
            </Col>
            <Col md={6}>
              {obra && (
                <ContactosObraSimple
                  obra={obra}
                  cliente={
                    pedido.Obra.particular
                      ? { particular: pedido.Obra.particular }
                      : { empresa: pedido.Obra.empresa }
                  }
                />
              )}
              <PagoPedido />
            </Col>
          </Row>
        </Card.Body>
      </Card>
      {mostrarObra && <DatosObra obraId={pedido.Obra?.id} />}
    </Container>
  );
};

export default DatosPedido;








// src/components/PedidosFolder/DatosPedido.js
/* import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Spinner,
  Alert,
  Container,
  Row,
  Col,
  Card,
  Button,
} from "react-bootstrap";
import { obtenerEmpleado, getPermisoIdEmpresa, getPedidoId } from "../../api"; // Asegúrate de ajustar la ruta según sea necesario
import useAuth from "../../hooks/useAuth";
import DatosObra from "../ObrasFolder/DatosObra";
import SelectPermiso from "../PermisosFolder/selectPermiso"; // Asegúrate de ajustar la ruta según sea necesario
import Movimientos from "../MovimientosFolder/Movimientos"; // Asegúrate de ajustar la ruta según sea necesario
import DetallesPedido from "./DetallesPedido"; // Asegúrate de ajustar la ruta según sea necesario
import ContactosObraSimple from "../ObrasFolder/ContactosObraSimple";

const DatosPedido = () => {
  const location = useLocation();
  const pedidoId = location.state?.pedidoId;
  const volquetaId = location.state?.volquetaId;
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mostrarObra, setMostrarObra] = useState(false);
  const [choferes, setChoferes] = useState({});
  const [permisos, setPermisos] = useState([]);
  const [selectedPermiso, setSelectedPermiso] = useState("");
  const navigate = useNavigate();
  const getToken = useAuth();

  const fetchPedido = async () => {
    const usuarioToken = getToken();
    try {
      const response = await getPedidoId(pedidoId, usuarioToken);
      setPedido(response.data);
      setLoading(false);
      if (response.data.permisoId) {
        setSelectedPermiso(response.data.permisoId);
      }
    } catch (error) {
      console.error(
        "Error al obtener los detalles del pedido:",
        error.response?.data?.error || error.message
      );
      setError("Error al obtener los detalles del pedido");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pedidoId) {
      fetchPedido();
    }
  }, [pedidoId, getToken]);

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

  const handleVerPedido = async (pedidoId) => {
    const usuarioToken = getToken();
    try {
      const response = await getPedidoId(pedidoId, usuarioToken);
      navigate("/pedidos/datos", { state: { pedidoId } });
    } catch (error) {
      console.error(
        "Error al obtener los detalles del pedido:",
        error.response?.data?.error || error.message
      );
      setError("Error al obtener los detalles del pedido");
      setTimeout(() => setError(""), 5000);
    }
  };

  useEffect(() => {
    const fetchChoferes = async () => {
      if (pedido && pedido.Sugerencias) {
        const nuevosChoferes = {};
        for (const sugerencia of pedido.Sugerencias) {
          if (sugerencia.choferSugeridoId) {
            const nombreChofer = await buscarChofer(
              sugerencia.choferSugeridoId
            );
            nuevosChoferes[sugerencia.choferSugeridoId] = nombreChofer;
          }
        }
        setChoferes(nuevosChoferes);
      }
    };
    if (pedido) {
      fetchChoferes();
    }
  }, [pedido]);

  useEffect(() => {
    const fetchPermisos = async () => {
      if (pedido && pedido.Obra && pedido.Obra.empresa) {
        const usuarioToken = getToken();
        try {
          const response = await getPermisoIdEmpresa(
            pedido.Obra.empresa.id,
            usuarioToken
          );
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
    if (pedido) {
      fetchPermisos();
    }
  }, [pedido, getToken]);

  const handlePermisoSelect = (permisoId) => {
    setSelectedPermiso(permisoId);
  };

  const handlePedidoModificado = () => {
    fetchPedido();
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container>
      {volquetaId && (
        <Button
          variant="secondary"
          className="mt-3 ml-3"
          onClick={() =>
            navigate("/volquetas/datos", { state: { volquetaId } })
          }
        >
          Volver a Volqueta
        </Button>
      )}
      <Card className="mt-3">
        <Card.Header>
          <h1>
            Detalles del Pedido {pedido.id}{" "}
            {pedido.referenciaId ? pedido.referenciaId : ""}
          </h1>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <DetallesPedido
                detalles={pedido}
                onPedidoModificado={handlePedidoModificado}
              />
            </Col>
            <Col md={6}>
              <Card>
                {/*    }  
              
              </Card>
              {pedido.Obra?.empresa && (
                <SelectPermiso
                  empresaId={pedido.Obra.empresa.id}
                  onSelect={handlePermisoSelect}
                />
              )}
              <p>
                <strong>Permiso Asignado:</strong>{" "}
                {selectedPermiso ? selectedPermiso : "Ninguno"}
              </p>
            </Col>
          </Row>
          <Movimientos
            movimientos={pedido.Movimientos}
            choferes={choferes}
            handleVerPedido={handleVerPedido}
          />
        </Card.Body>
      </Card>
      {mostrarObra && <DatosObra obraId={pedido.Obra?.id} />}
    </Container>
  );
};

export default DatosPedido; */

/* import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Spinner,
  Alert,
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import { obtenerEmpleado, getPermisoIdEmpresa, getPedidoId } from "../../api"; // Asegúrate de ajustar la ruta según sea necesario
import useAuth from "../../hooks/useAuth";
import DatosObra from "../ObrasFolder/DatosObra";
import SelectPermiso from "../PermisosFolder/selectPermiso"; // Asegúrate de ajustar la ruta según sea necesario
import Movimientos from "../MovimientosFolder/Movimientos"; // Asegúrate de ajustar la ruta según sea necesario

const DatosPedido = () => {
  const location = useLocation();
  const pedidoId = location.state?.pedidoId;
  const volquetaId = location.state?.volquetaId;
  const [pedido, setPedido] = useState(null);
  const [error, setError] = useState("");
  const [mostrarObra, setMostrarObra] = useState(false);
  const [choferes, setChoferes] = useState({});
  const [permisos, setPermisos] = useState([]);
  const [selectedPermiso, setSelectedPermiso] = useState("");
  const navigate = useNavigate();
  const getToken = useAuth();

  useEffect(() => {
    const fetchPedido = async () => {
      const usuarioToken = getToken();
      try {
        const response = await getPedidoId(pedidoId, usuarioToken);
        setPedido(response.data);
        if (response.data.permisoId) {
          setSelectedPermiso(response.data.permisoId);
        }
      } catch (error) {
        console.error(
          "Error al obtener los detalles del pedido:",
          error.response?.data?.error || error.message
        );
        setError("Error al obtener los detalles del pedido");
        setTimeout(() => setError(""), 5000);
      }
    };

    if (pedidoId) {
      fetchPedido();
    }
  }, [pedidoId, getToken]);

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

  const handleVerPedido = async (pedidoId) => {
    const usuarioToken = getToken();
    try {
      const response = await getPedidoId(pedidoId, usuarioToken);
      navigate("/pedidos/datos", { state: { pedidoId } });
    } catch (error) {
      console.error(
        "Error al obtener los detalles del pedido:",
        error.response?.data?.error || error.message
      );
      setError("Error al obtener los detalles del pedido");
      setTimeout(() => setError(""), 5000);
    }
  };

  useEffect(() => {
    const fetchChoferes = async () => {
      if (pedido && pedido.Sugerencias) {
        const nuevosChoferes = {};
        for (const sugerencia of pedido.Sugerencias) {
          if (sugerencia.choferSugeridoId) {
            const nombreChofer = await buscarChofer(
              sugerencia.choferSugeridoId
            );
            nuevosChoferes[sugerencia.choferSugeridoId] = nombreChofer;
          }
        }
        setChoferes(nuevosChoferes);
      }
    };
    if (pedido) {
      fetchChoferes();
    }
  }, [pedido]);

  useEffect(() => {
    const fetchPermisos = async () => {
      if (pedido && pedido.Obra && pedido.Obra.empresa) {
        const usuarioToken = getToken();
        try {
          const response = await getPermisoIdEmpresa(
            pedido.Obra.empresa.id,
            usuarioToken
          );
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
    if (pedido) {
      fetchPermisos();
    }
  }, [pedido, getToken]);

  const handlePermisoSelect = (permisoId) => {
    setSelectedPermiso(permisoId);
  };

  if (!pedido) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container>
      {volquetaId && (
        <Button
          variant="secondary"
          className="mt-3 ml-3"
          onClick={() =>
            navigate("/volquetas/datos", { state: { volquetaId } })
          }
        >
          Volver a Volqueta
        </Button>
      )}
      <Card className="mt-3">
        <Card.Header>
          <h1>
            Detalles del Pedido {pedido.id}{" "}
            {pedido.referenciaId ? pedido.referenciaId : ""}
          </h1>
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
                <SelectPermiso
                  empresaId={pedido.Obra.empresa.id}
                  onSelect={handlePermisoSelect}
                />
              )}
              <p>
                <strong>Permiso Asignado:</strong>{" "}
                {selectedPermiso ? selectedPermiso : "Ninguno"}
              </p>
            </Col>
          </Row>
          <Movimientos
            movimientos={pedido.Movimientos}
            choferes={choferes}
            handleVerPedido={handleVerPedido}
          />
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
 */
