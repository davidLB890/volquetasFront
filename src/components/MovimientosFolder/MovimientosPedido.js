import React, { useState } from "react";
import { Table, Button, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import AgregarMovimiento from "./AgregarMovimiento";
import ModificarMovimiento from "./ModificarMovimiento";
import { deleteMovimientoAPI } from "../../api"; // Importa la función de la API
import { deleteMovimiento } from "../../features/pedidoSlice"; // Importa la acción de Redux
import useAuth from "../../hooks/useAuth";

const MovimientosPedido = () => {
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

  //const { pedido } = useSelector((state) => state.pedido);
  //const movimientosViej = pedido?.Movimientos || [];
  const movimientos = useSelector((state) => state.pedido.movimientos) || [];
  const empleados = useSelector((state) => state.empleados.empleados || []);
  const choferes = empleados.filter(
    (empleado) => empleado.rol === "chofer" && empleado.habilitado
  );
  const pedidoId = useSelector((state) => state.pedido.pedido?.id);

  const handleHideModal = () => setShowAgregarMovimiento(false);

  const handleVerPedido = (pedidoId, volquetaId) => {
    navigate("/pedidos/datos", { state: { pedidoId, volquetaId } });
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
      await deleteMovimientoAPI(movimientoId, usuarioToken); // Llama a la API para eliminar el movimiento
      dispatch(deleteMovimiento(movimientoId)); // Despacha la acción de Redux para actualizar el estado
    } catch (error) {
      setError(error.response.data.error || "Error al eliminar el movimiento");
      setTimeout(() => {
        setError("");
      }, 3000);
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
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
        <h4 className="mb-2 mb-md-0">Movimientos</h4>
        {location.pathname.includes("/pedidos/datos") && renderAgregarButton()}
      </div>
      <div>
        {movimientos.length === 0 ? (
          <p>No hay movimientos para este pedido.</p>
        ) : (
          <>
            {/* Renderiza tabla para pantallas medianas y mayores */}
            <div className="d-none d-md-block">
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
                  {movimientos.map((movimiento) => {
                    // Buscar el chofer correspondiente al movimiento
                    /* const choferNombre = choferes.find(
                      (chofer) => chofer.id === movimiento?.choferId
                    )?.nombre; */
                    const choferNombre = choferes.find((chofer) => chofer.id === Number(movimiento?.choferId))?.nombre ;

                    return (
                      <tr key={movimiento?.id}>
                        <td>{movimiento?.numeroVolqueta || "-"}</td>
                        <td>
                          {movimiento?.horario
                            ? new Date(movimiento.horario).toLocaleString()
                            : "-"}
                        </td>
                        <td>{movimiento?.tipo || "-"}</td>
                        <td>{choferNombre || "Sin chofer asignado"}</td>
                        <td>
                          {location.pathname.includes("/pedidos/datos") ? (
                            <>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() =>
                                  handleDeleteMovimiento(movimiento?.id)
                                }
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
                                onClick={() =>
                                  handleModificarMovimiento(movimiento)
                                }
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
                              onClick={() =>
                                handleVerPedido(
                                  movimiento?.pedidoId,
                                  movimiento?.numeroVolqueta
                                )
                              }
                              className="mr-2"
                            >
                              Ver Pedido
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>

      {/* Renderiza un formato alternativo para pantallas pequeñas */}
      <div className="d-block d-md-none">
        {movimientos.map((movimiento) => (
          <div key={movimiento?.id} className="mb-3 p-2 border rounded">
            <div><strong>Número de Volqueta:</strong> {movimiento?.numeroVolqueta || "-"}</div>
            <div><strong>Horario:</strong> {movimiento?.horario ? new Date(movimiento.horario).toLocaleString() : "-"}</div>
            <div><strong>Tipo:</strong> {movimiento?.tipo || "-"}</div>
            <div><strong>Chofer:</strong> {choferes.find(chofer => chofer.id === movimiento?.choferId)?.nombre || "Sin chofer asignado"}</div>
            <div className="mt-2">
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
                  onClick={() =>
                    handleVerPedido(
                      movimiento?.pedidoId,
                      movimiento?.numeroVolqueta
                    )
                  }
                  className="mr-2"
                >
                  Ver Pedido
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )}
  {error && <Alert variant="danger">{error}</Alert>}
</div>

      <AgregarMovimiento
        show={showAgregarMovimiento}
        onHide={handleHideModal}
        pedidoId={pedidoId}
        choferes={choferes}
        tipoMovimiento={tipoMovimiento}
        numeroVolqueta={numeroVolqueta}
      />

      <ModificarMovimiento
        show={showModificarMovimiento}
        onHide={() => setShowModificarMovimiento(false)}
        movimiento={movimientoSeleccionado}
        choferes={choferes}
      />
    </div>
  );
};

export default MovimientosPedido;
