import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import { postPedidoRecambio, postPermiso } from "../../api"; // Asegúrate de tener estas funciones en api.js
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SelectPermiso from "../PermisosFolder/selectPermiso";

const Recambio = ({ show, onHide, pedido }) => {
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState(pedido.pagoPedido?.precio);
  const [tipoPago, setTipoPago] = useState(pedido.pagoPedido?.tipoPago);
  const [permisoSeleccionado, setPermisoSeleccionado] = useState(
    pedido.permisoId || ""
  );
  const [useNuevoPermiso, setUseNuevoPermiso] = useState(false);
  const [useOtroPermiso, setUseOtroPermiso] = useState(false);
  const [nuevoPermiso, setNuevoPermiso] = useState({
    fechaCreacion: "",
    fechaVencimiento: "",
    empresaId: pedido.Obra?.empresa?.id || null,
    particularId: pedido.Obra?.particular?.id || null,
    id: "",
  });
  const [pagado, setPagado] = useState(false);
  const [horarioSugerido, setHorarioSugerido] = useState("");
  const [choferSugeridoId, setChoferSugeridoId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const getToken = useAuth();
  const navigate = useNavigate();

  const MAX_LENGTH = 255;

  const empleados = useSelector((state) => state.empleados.empleados);
  const choferes = empleados.filter(
    (empleado) => empleado.rol === "chofer" && empleado.habilitado
  );

  useEffect(() => {
    // Resetea el state cuando el pedido cambia
    setDescripcion("");
    setPrecio(pedido?.pagoPedido?.precio || 0);
    setTipoPago(pedido?.pagoPedido?.tipoPago || "efectivo");
    setPermisoSeleccionado(pedido.permisoId || "");
    setUseNuevoPermiso(false);
    setUseOtroPermiso(false);
    setNuevoPermiso({
      fechaCreacion: "",
      fechaVencimiento: "",
      empresaId: pedido.Obra?.empresa?.id || null,
      particularId: pedido.Obra?.particular?.id || null,
      id: "",
    });
    setPagado(false);
    setHorarioSugerido("");
    setChoferSugeridoId("");
    setError("");
    setLoading(false);
  }, [pedido]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const usuarioToken = getToken();
    let permisoId = permisoSeleccionado;

    if(descripcion.length > MAX_LENGTH) {
      setError(`La descripción no puede superar los ${MAX_LENGTH} caracteres`);
      setLoading(false);
      return;
    }

    if (useNuevoPermiso) {
      try {
        const responsePermiso = await postPermiso(nuevoPermiso, usuarioToken);
        permisoId = responsePermiso.data.id;
      } catch (error) {
        setError(
          "Error al crear el permiso" + " - " + error.response.data.error
        );
        setLoading(false);
        return;
      }
    }

    const recambioData = {
      obraId: pedido.Obra.id,
      descripcion,
      referenciaId: pedido.id,
      precio,
      pagado,
      tipoPago,
      horarioSugerido: horarioSugerido || null,
      choferSugeridoId: choferSugeridoId || null,
      permisoId: permisoId || null,
    };

    try {
      const response = await postPedidoRecambio(recambioData, usuarioToken);
      onHide();
      navigate(`/pedidos/datos`, {
        state: { pedidoId: response.data.nuevoPedido.id },
      });
    } catch (error) {
      setError(
        error.response?.data?.error + " - " + error.response?.data?.detalle ||
          "Error al crear el recambio"
      );
      setLoading(false);
    }
  };

  const handleNuevoPermisoChange = (e) => {
    const { name, value } = e.target;
    setNuevoPermiso({ ...nuevoPermiso, [name]: value });
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Crear Pedido de Recambio</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="descripcion">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="precio">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              value={precio}
              onChange={(e) => setPrecio(parseFloat(e.target.value))}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPermisoOption">
            <Form.Label>Permiso</Form.Label>
            <div style={{ marginLeft: "20px" }}>
              <Form.Check
                type="checkbox"
                label="Usar otro permiso"
                checked={useOtroPermiso}
                onChange={() => {
                  setUseOtroPermiso(!useOtroPermiso);
                  setUseNuevoPermiso(false);
                }}
              />
              {!useOtroPermiso && (
                <Form.Text>
                  Permiso actual: {pedido.permisoId || "Ninguno"}
                </Form.Text>
              )}
              {useOtroPermiso && (
                <div>
                  <Form.Check
                    type="checkbox"
                    label="Crear Nuevo Permiso"
                    checked={useNuevoPermiso}
                    onChange={() => setUseNuevoPermiso(!useNuevoPermiso)}
                  />
                  {useNuevoPermiso ? (
                    <>
                      <Form.Group
                        controlId="formFechaCreacion"
                        style={{ marginLeft: "20px" }}
                      >
                        <Form.Label>Fecha de Creación *</Form.Label>
                        <Form.Control
                          type="date"
                          name="fechaCreacion"
                          value={nuevoPermiso.fechaCreacion}
                          onChange={handleNuevoPermisoChange}
                          required
                        />
                      </Form.Group>
                      <Form.Group
                        controlId="formFechaVencimiento"
                        style={{ marginLeft: "20px" }}
                      >
                        <Form.Label>Fecha de Vencimiento *</Form.Label>
                        <Form.Control
                          type="date"
                          name="fechaVencimiento"
                          value={nuevoPermiso.fechaVencimiento}
                          onChange={handleNuevoPermisoChange}
                          required
                        />
                      </Form.Group>
                      <Form.Group
                        controlId="formNumero"
                        style={{ marginLeft: "20px" }}
                      >
                        <Form.Label>Número permiso *</Form.Label>
                        <Form.Control
                          type="text"
                          name="id"
                          value={nuevoPermiso.id}
                          onChange={handleNuevoPermisoChange}
                          required
                        />
                      </Form.Group>
                    </>
                  ) : (
                    <Form.Group
                      controlId="formPermisoId"
                      style={{ marginLeft: "20px" }}
                    >
                      <SelectPermiso
                        empresaId={pedido.Obra.empresa?.id}
                        particularId={pedido.Obra.particular?.id}
                        onSelect={(permisoId) =>
                          setPermisoSeleccionado(permisoId)
                        }
                        selectedPermisoId={permisoSeleccionado}
                      />
                    </Form.Group>
                  )}
                </div>
              )}
            </div>
          </Form.Group>
          <Form.Group controlId="tipoPago">
            <Form.Label>Tipo de Pago</Form.Label>
            <Form.Control
              as="select"
              value={tipoPago}
              onChange={(e) => setTipoPago(e.target.value)}
              required
            >
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="cheque">Cheque</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="pagado">
            <Form.Check
              type="checkbox"
              label="Pagado"
              checked={pagado}
              onChange={(e) => setPagado(e.target.checked)}
            />
          </Form.Group>
          <Form.Group controlId="horarioSugerido">
            <Form.Label>Horario Sugerido</Form.Label>
            <Form.Control
              type="datetime-local"
              value={horarioSugerido}
              onChange={(e) => setHorarioSugerido(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="choferSugeridoId">
            <Form.Label>Chofer Sugerido</Form.Label>
            <Form.Control
              as="select"
              value={choferSugeridoId}
              onChange={(e) => setChoferSugeridoId(parseInt(e.target.value))}
            >
              <option value="">Selecciona un chofer</option>
              {choferes.map((chofer) => (
                <option key={chofer.id} value={chofer.id}>
                  {chofer.nombre}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear Recambio"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Recambio;
