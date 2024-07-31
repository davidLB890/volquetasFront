import React, { useState } from "react";
import { Table, Button, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import AgregarSugerencia from "./AgregarSugerencia";
import ModificarSugerencia from "./ModificarSugerencia";
import { deleteSugerenciaAPI } from "../../api"; // Importa la función de la API
import { deleteSugerencia } from "../../features/pedidoSlice"; // Importa la acción de Redux
import useAuth from "../../hooks/useAuth";

const Sugerencias = () => {
  const [showAgregarSugerencia, setShowAgregarSugerencia] = useState(false);
  const [showModificarSugerencia, setShowModificarSugerencia] = useState(false);
  const [sugerenciaSeleccionada, setSugerenciaSeleccionada] = useState(null);
  const [tipoSugerencia, setTipoSugerencia] = useState("");
  const [numeroVolqueta, setNumeroVolqueta] = useState("");
  const [error, setError] = useState("");
  const getToken = useAuth();
  const dispatch = useDispatch();

  const { pedido } = useSelector((state) => state.pedido);
  const sugerencias = pedido?.Sugerencias || [];
  const empleados = useSelector((state) => state.empleados.empleados || []);
  const choferes = empleados.filter((empleado) => empleado.rol === "chofer" && empleado.habilitado);
  const pedidoId = useSelector((state) => state.pedido.pedido?.id);

  const handleHideModal = () => setShowAgregarSugerencia(false);

  const handleShowModal = (tipo) => {
    setTipoSugerencia(tipo);
    if (tipo === "levante") {
      const entregaMovimiento = sugerencias.find(
        (sugerencia) => sugerencia.tipo === "entrega"
      );
      if (entregaMovimiento) {
        setNumeroVolqueta(entregaMovimiento.numeroVolqueta || "");
      }
    } else {
      setNumeroVolqueta("");
    }
    setShowAgregarSugerencia(true);
  };

  const handleDeleteSugerencia = async (sugerenciaId) => {
    const usuarioToken = getToken();
    try {
      await deleteSugerenciaAPI(sugerenciaId, usuarioToken); // Llama a la API para eliminar la sugerencia
      dispatch(deleteSugerencia(sugerenciaId)); // Despacha la acción de Redux para actualizar el estado
    } catch (error) {
      console.error("Error al eliminar la sugerencia:", error.response?.data?.error || error.message);
      setError(error.response?.data?.error + " " + error.response?.data?.detalle);
    }
  };

  const handleModificarMovimiento = (movimiento) => {
    setSugerenciaSeleccionada(movimiento);
    setShowModificarSugerencia(true);
  };

  const renderAgregarButton = () => {
    if (sugerencias.length === 0) {
      return (
        <div className="d-flex">
          <Button variant="primary" onClick={() => handleShowModal("entrega")} className="me-2">
            Agregar Sugerencia Entrega
          </Button>
          <Button variant="primary" onClick={() => handleShowModal("levante")}>
            Agregar Sugerencia Levante
          </Button>
        </div>
      );
    } else if (sugerencias.length === 1) {
      if (sugerencias[0].tipoSugerido === "entrega") {
        return (
          <Button variant="primary" onClick={() => handleShowModal("levante")}>
            Agregar Sugerencia Levante
          </Button>
        );
      } else {
        return (
          <Button variant="primary" onClick={() => handleShowModal("entrega")}>
            Agregar Sugerencia Entrega
          </Button>
        );
      }
    } else {
      return null;
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Sugerencias</h4>
        {renderAgregarButton()}
      </div>
      <div>
        {sugerencias.length === 0 ? (
          <p>No hay sugerencias para este pedido.</p>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Horario</th>
                <th>Tipo</th>
                <th>Chofer</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sugerencias.map((sugerencia) => (
                <tr key={sugerencia?.id}>
                  <td>{sugerencia?.horarioSugerido ? new Date(sugerencia.horarioSugerido).toLocaleString() : "-"}</td>
                  <td>{sugerencia?.tipoSugerido || "-"}</td>
                  <td>{choferes.find(chofer => chofer.id === sugerencia?.choferSugeridoId)?.nombre || "-"}</td>
                  <td>
                    <>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteSugerencia(sugerencia?.id)}
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
                        onClick={() => handleModificarMovimiento(sugerencia)}
                        className="mr-2"
                        style={{
                          padding: "0.5rem 1rem",
                          marginRight: "0.5rem",
                        }}
                      >
                        Modificar
                      </Button>
                    </>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        {error && <Alert variant="danger">{error}</Alert>}
      </div>

      <AgregarSugerencia
        show={showAgregarSugerencia}
        onHide={handleHideModal}
        pedidoId={pedidoId}
        choferes={choferes}
        tipoSugerencia={tipoSugerencia}
        numeroVolqueta={numeroVolqueta}
      />

      <ModificarSugerencia
        show={showModificarSugerencia}
        onHide={() => setShowModificarSugerencia(false)}
        sugerencia={sugerenciaSeleccionada}
        choferes={choferes}
      />
    </div>
  );
};

export default Sugerencias;
