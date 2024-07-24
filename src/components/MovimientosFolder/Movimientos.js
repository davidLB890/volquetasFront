
import React, { useState } from "react";
import { Table, Button, Card, Alert } from "react-bootstrap";
import AgregarMovimiento from "./AgregarMovimiento";
import ModificarMovimiento from "./ModificarMovimiento";
import { useDispatch } from "react-redux"; // Asegúrate de importar useDispatch
import { deleteMovimiento } from "../../features/pedidoSlice"; // Ajusta la ruta según sea necesario
import useAuth from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";

const Movimientos = ({
  movimientos = [],
  choferes = [],
  pedidoId,
  onMovimientoAgregado,
  onMovimientoModificado,
  onMovimientoEliminado,
}) => {
  const [showAgregarMovimiento, setShowAgregarMovimiento] = useState(false);
  const [showModificarMovimiento, setShowModificarMovimiento] = useState(false);
  const [movimientoSeleccionado, setMovimientoSeleccionado] = useState(null);
  const [tipoMovimiento, setTipoMovimiento] = useState("");
  const [numeroVolqueta, setNumeroVolqueta] = useState("");
  const [error, setError] = useState("");
  const getToken = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleHideModal = () => setShowAgregarMovimiento(false);

  const handleVerPedido = (pedidoId) => {
    navigate("/pedidos/datos", { state: { pedidoId: pedidoId, volquetaId: numeroVolqueta } });
  };

  const handleShowModal = (tipo) => {
    setTipoMovimiento(tipo);
    if (tipo === "levante") {
      const entregaMovimiento = movimientos.find(
        (movimiento) => movimiento.tipo === "entrega"
      );
      if (entregaMovimiento) {
        setNumeroVolqueta(entregaMovimiento.numeroVolqueta || "");
      }
    } else {
      setNumeroVolqueta("");
    }
    setShowAgregarMovimiento(true);
  };

  const handleDeleteMovimiento = async (movimientoId) => {
    const usuarioToken = getToken();
    try {
      await dispatch(deleteMovimiento({ movimientoId, usuarioToken })).unwrap();
      onMovimientoEliminado(); // Ensure this function is called to update the state
    } catch (error) {
      console.error("Error al eliminar el movimiento:", error.response?.data?.error || error.message);
      setError("Error al eliminar el movimiento");
    }
  };

  const handleModificarMovimiento = (movimiento) => {
    setMovimientoSeleccionado(movimiento);
    setShowModificarMovimiento(true);
  };

  const renderAgregarButton = () => {
    if (movimientos.length === 0) {
      return (
        <Button variant="primary" onClick={() => handleShowModal("entrega")}>
          Agregar Entrega
        </Button>
      );
    } else if (movimientos.length === 1) {
      return (
        <Button variant="primary" onClick={() => handleShowModal("levante")}>
          Agregar Levante
        </Button>
      );
    } else {
      return null;
    }
  };

  return (
    <Card>
    <Card.Header>
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Movimientos</h4>
        {location.pathname.includes("/pedidos/datos") && renderAgregarButton()}
      </div>
    </Card.Header>
    <Card.Body>
      {movimientos.length === 0 ? (
        <p>No hay movimientos para este pedido.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Número de Volqueta</th>
              <th>Horario</th>
              <th>Tipo</th>
              <th>Chofer</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map((movimiento) => (
              <tr key={movimiento?.id}>
                <td>{movimiento?.numeroVolqueta || "N/A"}</td>
                <td>{movimiento?.horario ? new Date(movimiento.horario).toLocaleString() : "N/A"}</td>
                <td>{movimiento?.tipo || "N/A"}</td>
                <td>{choferes.find(chofer => chofer.id === movimiento?.choferId)?.nombre || "N/A"}</td>
                <td>
                  {location.pathname.includes("/pedidos/datos") ? (
                    <>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteMovimiento(movimiento?.id)}
                        className="mr-2"
                        style={{
                          padding: "0.5rem 1rem",
                          marginRight: "0.5rem",
                        }}
                      >
                        Eliminar
                      </Button>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleModificarMovimiento(movimiento)}
                        className="mr-2"
                        style={{
                          padding: "0.5rem 1rem",
                          marginRight: "0.5rem",
                        }}
                      >
                        Modificar
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleVerPedido(movimiento?.pedidoId)}
                      className="mr-2"
                    >
                      Ver Pedido
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
    </Card.Body>
  
    <AgregarMovimiento
      show={showAgregarMovimiento}
      onHide={handleHideModal}
      pedidoId={pedidoId}
      choferes={choferes}
      tipoMovimiento={tipoMovimiento}
      numeroVolqueta={numeroVolqueta}
      onMovimientoAgregado={onMovimientoAgregado}
    />
  
    <ModificarMovimiento
      show={showModificarMovimiento}
      onHide={() => setShowModificarMovimiento(false)}
      movimiento={movimientoSeleccionado}
      choferes={choferes}
      onMovimientoModificado={onMovimientoModificado}
    />
  </Card>
  
  );
};

export default Movimientos;
/* import React, { useState } from "react";
import { Table, Button, Card, Alert } from "react-bootstrap";
import AgregarMovimiento from "./AgregarMovimiento"; // Adjust the path as necessary
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteMovimiento } from "../../features/pedidoSlice"; // Adjust the path as necessary
import useAuth from "../../hooks/useAuth";

const Movimientos = ({
  movimientos = [],
  choferes = [],
  pedidoId,
  volquetaId,
  onMovimientoAgregado,
  onMovimientoModificado,
  onMovimientoEliminado,
}) => {
  const [showAgregarMovimiento, setShowAgregarMovimiento] = useState(false);
  const [tipoMovimiento, setTipoMovimiento] = useState("");
  const [numeroVolqueta, setNumeroVolqueta] = useState("");
  const [error, setError] = useState("");
  const getToken = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleHideModal = () => setShowAgregarMovimiento(false);

  const handleVerPedido = (pedidoId) => {
    navigate("/pedidos/datos", { state: { pedidoId: pedidoId, volquetaId: volquetaId } });
  };

  const handleShowModal = (tipo) => {
    setTipoMovimiento(tipo);
    if (tipo === "levante") {
      const entregaMovimiento = movimientos.find(
        (movimiento) => movimiento.tipo === "entrega"
      );
      if (entregaMovimiento) {
        setNumeroVolqueta(entregaMovimiento.numeroVolqueta || "");
      }
    } else {
      setNumeroVolqueta("");
    }
    setShowAgregarMovimiento(true);
  };

  const handleDeleteMovimiento = async (movimientoId) => {
    const usuarioToken = getToken();
    try {
      await dispatch(deleteMovimiento({ movimientoId, usuarioToken })).unwrap();
      onMovimientoEliminado(); // Ensure this function is called to update the state
    } catch (error) {
      console.error("Error al eliminar el movimiento:", error.response?.data?.error || error.message);
      setError("Error al eliminar el movimiento");
    }
  };

  const renderAgregarButton = () => {
    if (movimientos.length === 0) {
      return (
        <Button variant="primary" onClick={() => handleShowModal("entrega")}>
          Agregar Entrega
        </Button>
      );
    } else if (movimientos.length === 1) {
      return (
        <Button variant="primary" onClick={() => handleShowModal("levante")}>
          Agregar Levante
        </Button>
      );
    } else {
      return null;
    }
  };

  return (
    <Card>
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Movimientos</h4>
          {location.pathname.includes("/pedidos/datos") && renderAgregarButton()}
        </div>
      </Card.Header>
      <Card.Body>
        {movimientos.length === 0 ? (
          <p>No hay movimientos para este pedido.</p>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Número de Volqueta</th>
                <th>Horario</th>
                <th>Tipo</th>
                <th>Chofer</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map((movimiento) => (
                <tr key={movimiento?.id}>
                  <td>{movimiento?.numeroVolqueta || "N/A"}</td>
                  <td>{movimiento?.horario ? new Date(movimiento.horario).toLocaleString() : "N/A"}</td>
                  <td>{movimiento?.tipo || "N/A"}</td>
                  <td>{choferes.find(chofer => chofer.id === movimiento?.choferId)?.nombre || "N/A"}</td>
                  <td>
                    {location.pathname.includes("/pedidos/datos") ? (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteMovimiento(movimiento?.id)}
                        className="mr-2"
                      >
                        Eliminar
                      </Button>
                    ) : (
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleVerPedido(movimiento?.pedidoId)}
                        className="mr-2"
                      >
                        Ver Pedido
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        {error && <Alert variant="danger">{error}</Alert>}
      </Card.Body>

      {location.pathname.includes("/pedidos/datos") && (
        <AgregarMovimiento
          show={showAgregarMovimiento}
          onHide={handleHideModal}
          pedidoId={pedidoId}
          choferes={choferes}
          tipoMovimiento={tipoMovimiento}
          numeroVolqueta={numeroVolqueta}
          onMovimientoAgregado={onMovimientoAgregado} // Pass the function to update the state
        />
      )}
    </Card>
  );
};

export default Movimientos;
 */