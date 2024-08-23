import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Spinner, Alert, Button, Row, Col, Container, Form, } from "react-bootstrap";
import { getPedidosFiltro } from "../../api";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import FiltrosPedido from "./FiltrosPedido";

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtros, setFiltros] = useState({});
  
  const [tipoSugerencia, setTipoSugerencia] = useState("general");
  const [filtroPago, setFiltroPago] = useState("todos");
  const [filtroCliente, setFiltroCliente] = useState("todos");
  const [filtroMovimiento, setFiltroMovimiento] = useState("todos");

  const empleados = useSelector((state) => state.empleados.empleados);
  const choferes = empleados.filter(
    (empleado) => empleado.rol === "chofer" && empleado.habilitado
  );
  const getToken = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedFiltros = JSON.parse(localStorage.getItem("filtrosPedido"));
    if (savedFiltros) {
      setFiltros(savedFiltros);
      setTipoSugerencia(savedFiltros.tipoSugerencia || "general");
      setFiltroPago(savedFiltros.filtroPago || "todos");
      setFiltroCliente(savedFiltros.filtroCliente || "todos");
      setFiltroMovimiento(savedFiltros.filtroMovimiento || "todos");
    }
  }, []);

  // Guardar los filtros en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem("filtrosPedido", JSON.stringify(filtros));
  }, [filtros]);

  const fetchPedidos = async (params) => {  
    if (!params.fechaInicio || !params.fechaFin) {
      params = {
        ...params, // Mantener otras propiedades de params si las hay
        fechaInicio: moment().startOf("day").add(1, "hours").format("YYYY-MM-DDTHH:mm"),
        fechaFin: moment().endOf("day").format("YYYY-MM-DDTHH:mm"),
        tipoHorario: "creacion"
      };
    }
    const usuarioToken = getToken();
    try {
      const response = await getPedidosFiltro(usuarioToken, params);
      setPedidos(response.data);
      setLoading(false);
      setError("");
    } catch (error) {
      console.error(
        "Error al obtener los pedidos:",
        error.response?.data?.error || error.message
      );
      setError(error.response?.data?.error || "Error desconocido");
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchPedidos(filtros);
  }, [filtros, getToken]);

  const handleRowClick = (pedido) => {
    let idPedido = pedido.id;
    navigate("/pedidos/datos", { state: { pedidoId: idPedido } });
  };

  const resetFiltrosEnPedidos = (filtrosPorDefecto) => {
    setTipoSugerencia(filtrosPorDefecto.tipoSugerencia);
    setFiltroPago(filtrosPorDefecto.filtroPago);
    setFiltroCliente(filtrosPorDefecto.filtroCliente);
    setFiltroMovimiento(filtrosPorDefecto.filtroMovimiento);
    setFiltros(filtrosPorDefecto);
  };

  const renderSugerencia = (pedido) => {
    if (tipoSugerencia === "entrega") {
      const sugerenciaEntrega = pedido.Sugerencias.find(
        (s) => s.tipoSugerido === "entrega"
      );
      if (sugerenciaEntrega) {
        const chofer = choferes.find(
          (c) => c.id === sugerenciaEntrega.choferSugeridoId
        );
        return chofer
          ? `Entrega - ${chofer.nombre} - ${new Date(
              sugerenciaEntrega.horarioSugerido
            ).toLocaleString()}`
          : "Chofer no encontrado";
      }
      return "-";
    } else if (tipoSugerencia === "levante") {
      const sugerenciaLevante = pedido.Sugerencias.find(
        (s) => s.tipoSugerido === "levante"
      );
      if (sugerenciaLevante) {
        const chofer = choferes.find(
          (c) => c.id === sugerenciaLevante.choferSugeridoId
        );
        return chofer
          ? `Levante - ${chofer.nombre} - ${new Date(
              sugerenciaLevante.horarioSugerido
            ).toLocaleString()}`
          : "Chofer no encontrado";
      }
      return "-";
    } else if (tipoSugerencia === "entregaChofer") {
      const sugerenciaEntrega = pedido.Sugerencias.find(
        (s) => s.tipoSugerido === "entrega"
      );
      if (sugerenciaEntrega) {
        const chofer = choferes.find(
          (c) => c.id === sugerenciaEntrega.choferSugeridoId
        );
        return chofer
          ? `Entrega - ${chofer.nombre} - ${new Date(
              sugerenciaEntrega.horarioSugerido
            ).toLocaleString()}`
          : "Chofer no encontrado";
      }
      return "-";
    } else if (tipoSugerencia === "levanteChofer") {
      const sugerenciaLevante = pedido.Sugerencias.find(
        (s) => s.tipoSugerido === "levante"
      );
      if (sugerenciaLevante) {
        const chofer = choferes.find(
          (c) => c.id === sugerenciaLevante.choferSugeridoId
        );
        return chofer
          ? `Levante - ${chofer.nombre} - ${new Date(
              sugerenciaLevante.horarioSugerido
            ).toLocaleString()}`
          : "Chofer no encontrado";
      }
      return "-";
    } else {
      // Default - General
      if (pedido.Movimientos.length === 0) {
        const sugerenciaEntrega = pedido.Sugerencias.find(
          (s) => s.tipoSugerido === "entrega"
        );
        if (sugerenciaEntrega) {
          const chofer = choferes.find(
            (c) => c.id === sugerenciaEntrega.choferSugeridoId
          );
          return chofer
            ? `Entrega - ${chofer.nombre} - ${new Date(
                sugerenciaEntrega.horarioSugerido
              ).toLocaleString()}`
            : "Chofer no encontrado";
        }
        return "-";
      } else if (pedido.Movimientos.length === 1) {
        const sugerenciaLevante = pedido.Sugerencias.find(
          (s) => s.tipoSugerido === "levante"
        );
        if (sugerenciaLevante) {
          const chofer = choferes.find(
            (c) => c.id === sugerenciaLevante.choferSugeridoId
          );
          return chofer
            ? `Levante - ${chofer.nombre} - ${new Date(
                sugerenciaLevante.horarioSugerido
              ).toLocaleString()}`
            : "Chofer no encontrado";
        }
        return "-";
      } else if (pedido.Movimientos.length === 2) {
        return "Completo";
      }
    }
  };

  // Agrupación y renderizado por chofer
  const agruparPedidosPorChofer = (pedidos) => {
    const grupos = {};

    pedidos.forEach((pedido) => {
      let choferId = null;
      if (tipoSugerencia === "entregaChofer") {
        const sugerenciaEntrega = pedido.Sugerencias.find(
          (s) => s.tipoSugerido === "entrega"
        );
        if (sugerenciaEntrega) choferId = sugerenciaEntrega.choferSugeridoId;
      } else if (tipoSugerencia === "levanteChofer") {
        const sugerenciaLevante = pedido.Sugerencias.find(
          (s) => s.tipoSugerido === "levante"
        );
        if (sugerenciaLevante) choferId = sugerenciaLevante.choferSugeridoId;
      }

      if (choferId) {
        if (!grupos[choferId]) grupos[choferId] = [];
        grupos[choferId].push(pedido);
      } else {
        if (!grupos["sinChofer"]) grupos["sinChofer"] = [];
        grupos["sinChofer"].push(pedido);
      }
    });

    return grupos;
  };

  // Definición de la función renderMovimiento
  const renderMovimiento = (pedido) => {
    if (pedido.Movimientos.length === 0) {
      return "-";
    } else if (pedido.Movimientos.length === 1) {
      const movimiento = pedido.Movimientos[0];
      const chofer = choferes.find((c) => c.id === movimiento.choferId);
      return chofer
        ? `Entregado - ${chofer.nombre} - ${new Date(
            movimiento.horario
          ).toLocaleString()}`
        : "Chofer no encontrado";
    } else if (pedido.Movimientos.length === 2) {
      const movimiento = pedido.Movimientos[1];
      const chofer = choferes.find((c) => c.id === movimiento.choferId);
      return chofer
        ? `Levantado - ${chofer.nombre} - ${new Date(
            movimiento.horario
          ).toLocaleString()}`
        : "Chofer no encontrado";
    }
  };

  const pedidosFiltrados = pedidos.filter((pedido) => {
    console.log("Filtrando pedido:", pedido);
  
    const esEmpresa = !!pedido.Obra.empresa;
    console.log("Es empresa:", esEmpresa);
  
    if (filtroCliente === "empresa" && !esEmpresa) return false;
    if (filtroCliente === "particular" && esEmpresa) return false;
  
    if (filtroPago === "pagado" && !pedido.pagoPedido?.pagado) return false;
    if (filtroPago === "noPagado" && pedido.pagoPedido?.pagado) return false;
  
    const movimientos = pedido.Movimientos.map((mov) => mov.tipo);
    console.log("Movimientos del pedido:", movimientos);
  
    if (filtroMovimiento === "sinEntrega") return !movimientos.includes("entrega");
    if (filtroMovimiento === "entregado") return movimientos.includes("entrega") && !movimientos.includes("levante");
    if (filtroMovimiento === "levantado") return movimientos.includes("levante");
  
    return true;
  });
  

  const handleFiltroClienteChange = (e) => {
    setFiltroCliente(e.target.value);
    setFiltros((prev) => ({ ...prev, filtroCliente: e.target.value }));
  };

  const handleFiltroMovimientoChange = (e) => {
    setFiltroMovimiento(e.target.value);
    setFiltros((prev) => ({ ...prev, filtroMovimiento: e.target.value }));
  };

  const handleFiltroPagoChange = (e) => {
    setFiltroPago(e.target.value);
    setFiltros((prev) => ({ ...prev, filtroPago: e.target.value }));
  };

  const handleTipoSugerenciaChange = (e) => {
    setTipoSugerencia(e.target.value);
    setFiltros((prev) => ({ ...prev, tipoSugerencia: e.target.value }));
  };

  const handleAgregarPedido = () => {
    navigate("/pedidos/crear");
  };

  const pedidosAgrupados = agruparPedidosPorChofer(pedidosFiltrados);

  return (
    <Container>
      <div className="header d-flex justify-content-between align-items-center">
        <h1>Pedidos</h1>
        <Button variant="primary" onClick={handleAgregarPedido}>
          Nuevo Pedido
        </Button>
      </div>
      <Row className="mb-3">
        <Col>
          <FiltrosPedido setFiltros={setFiltros} onCleanFiltros={resetFiltrosEnPedidos}/>
        </Col>
      </Row>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Mostrar alerta si no hay pedidos */}
      {pedidos.length === 0 && !loading && (
        <Alert variant="info">
          No hay pedidos registrados en ese rango de fechas
        </Alert>
      )}

      {/* Vista para pantallas grandes */}
      {pedidos.length > 0 && (
        <div className="table-container d-none d-md-block">
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Fecha Creación</th>
                <th>
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <Form.Control
                      as="select"
                      value={filtroCliente}
                      onChange={handleFiltroClienteChange}
                      style={{
                        display: "inline-block",
                        width: "auto",
                        border: "none",
                        padding: "0 1.5rem 0 0", // Espacio a la derecha para el ícono
                        background: "none", // Elimina fondo predeterminado
                      }}
                    >
                      <option value="todos">Cliente</option>
                      <option value="empresa">Cliente Empresa</option>
                      <option value="particular">Cliente Particular</option>
                    </Form.Control>
                    <i
                      className="bi bi-caret-down-fill"
                      style={{
                        position: "absolute",
                        right: "0.5rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                      }}
                    ></i>
                  </div>
                </th>
                <th>Dirección</th>
                <th>Precio</th>
                <th>
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <Form.Control
                      as="select"
                      value={filtroPago}
                      onChange={handleFiltroPagoChange}
                      style={{
                        display: "inline-block",
                        width: "auto",
                        border: "none",
                        padding: "0 1.5rem 0 0", // Espacio a la derecha para el ícono
                        background: "none", // Elimina fondo predeterminado
                      }}
                    >
                      <option value="todos">Pagado</option>
                      <option value="pagado">Pagado: sí</option>
                      <option value="noPagado">Pagado: no</option>
                    </Form.Control>
                    <i
                      className="bi bi-caret-down-fill"
                      style={{
                        position: "absolute",
                        right: "0.5rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                      }}
                    ></i>
                  </div>
                </th>
                <th>
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <Form.Control
                      as="select"
                      value={tipoSugerencia}
                      onChange={handleTipoSugerenciaChange}
                      style={{
                        display: "inline-block",
                        width: "auto",
                        border: "none",
                        padding: "0 1.5rem 0 0", // Espacio a la derecha para el ícono
                        background: "none", // Elimina fondo predeterminado
                      }}
                    >
                      <option value="general">Sugerencia</option>
                      <option value="entrega">Sugerencia Entrega</option>
                      <option value="levante">Sugerencia Levante</option>
                      <option value="entregaChofer">Sugerencia Entrega Chofer</option>
                      <option value="levanteChofer">Sugerencia Levante Chofer</option>
                    </Form.Control>
                    <i
                      className="bi bi-caret-down-fill"
                      style={{
                        position: "absolute",
                        right: "0.5rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                      }}
                    ></i>
                  </div>
                </th>
                <th>
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <Form.Control
                      as="select"
                      value={filtroMovimiento}
                      onChange={handleFiltroMovimientoChange}
                      style={{
                        display: "inline-block",
                        width: "auto",
                        border: "none",
                        padding: "0 1.5rem 0 0", // Espacio a la derecha para el ícono
                        background: "none", // Elimina fondo predeterminado
                      }}
                    >
                      <option value="todos">Último Movimiento</option>
                      <option value="sinEntrega">Sin Entregar</option>
                      <option value="entregado">Entregado</option>
                      <option value="levantado">Levantado</option>
                    </Form.Control>
                    <i
                      className="bi bi-caret-down-fill"
                      style={{
                        position: "absolute",
                        right: "0.5rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                      }}
                    ></i>
                  </div>
                  </th>
              </tr>
            </thead>
            <tbody>
              {tipoSugerencia === "entregaChofer" ||
              tipoSugerencia === "levanteChofer"
                ? Object.keys(pedidosAgrupados).map((choferId) => {
                    const grupoPedidos = pedidosAgrupados[choferId];
                    const chofer = choferes.find(
                      (c) => c.id === parseInt(choferId)
                    );

                    return (
                      <React.Fragment key={choferId}>
                        {chofer && (
                          <tr>
                            <td colSpan="7">
                              <strong>Chofer: {chofer.nombre}</strong>
                            </td>
                          </tr>
                        )}
                        {grupoPedidos.map((pedido) => {
                          const esEmpresa = !!pedido.Obra.empresa;
                          const colorFondoCliente = esEmpresa
                            ? "lightblue"
                            : "lavender";
                          const colorFondoPago = pedido.pagoPedido?.pagado
                            ? "#d4edda"
                            : "#f8d7da";

                          return (
                            <tr
                              key={pedido.id}
                              style={{ cursor: "pointer" }}
                              onClick={() => handleRowClick(pedido)}
                            >
                              <td>
                                {new Date(
                                  pedido.createdAt
                                ).toLocaleDateString()}
                              </td>
                              <td
                                style={{ backgroundColor: colorFondoCliente }}
                              >
                                {esEmpresa
                                  ? pedido.Obra.empresa?.nombre
                                  : pedido.Obra.particular?.nombre}
                              </td>
                              <td>
                                {pedido.Obra.calle} {pedido.Obra.numeroPuerta}
                              </td>
                              <td>${pedido.pagoPedido?.precio}</td>
                              <td style={{ backgroundColor: colorFondoPago }}>
                                {pedido.pagoPedido?.pagado ? "Sí" : "No"}
                              </td>
                              <td>{renderSugerencia(pedido)}</td>
                              <td>{renderMovimiento(pedido)}</td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    );
                  })
                : pedidosFiltrados.map((pedido) => {
                    const esEmpresa = !!pedido.Obra.empresa;
                    const colorFondoCliente = esEmpresa
                      ? "lightblue"
                      : "lavender";
                    const colorFondoPago = pedido.pagoPedido?.pagado
                      ? "#d4edda"
                      : "#f8d7da";

                    return (
                      <tr
                        key={pedido.id}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleRowClick(pedido)}
                      >
                        <td>
                          {new Date(pedido.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ backgroundColor: colorFondoCliente }}>
                          {esEmpresa
                            ? pedido.Obra.empresa?.nombre
                            : pedido.Obra.particular?.nombre}
                        </td>
                        <td>
                          {pedido.Obra.calle} {pedido.Obra.numeroPuerta}
                        </td>
                        <td>${pedido.pagoPedido?.precio}</td>
                        <td style={{ backgroundColor: colorFondoPago }}>
                          {pedido.pagoPedido?.pagado ? "Sí" : "No"}
                        </td>
                        <td>{renderSugerencia(pedido)}</td>
                        <td>{renderMovimiento(pedido)}</td>
                      </tr>
                    );
                  })}
            </tbody>
          </Table>
        </div>
      )}

      {/* Vista para pantallas pequeñas */}
      {pedidos.length > 0 && (
        <div className="d-md-none">
          {/* Estilo personalizado para los selectores */}
    <style>
      {`
        .custom-select {
          border: 1px solid #ced4da;
          border-radius: 8px;
          padding: 0.5rem 1.5rem;
          background-color: #f8f9fa;
          color: #495057;
          appearance: none;
          font-size: 1rem;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .custom-select:focus {
          border-color: #80bdff;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
          outline: none;
        }

        .custom-select-container {
          position: relative;
          display: inline-block;
          margin-bottom: 1rem;
        }

        .custom-select-icon {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #495057;
        }
      `}
    </style>

    {/* Selector de Cliente */}
    <div className="custom-select-container">
      <Form.Control
        as="select"
        value={filtroCliente}
        onChange={handleFiltroClienteChange}
        className="custom-select"
      >
        <option value="todos">Cliente</option>
        <option value="empresa">Cliente Empresa</option>
        <option value="particular">Cliente Particular</option>
      </Form.Control>
      <i className="bi bi-caret-down-fill custom-select-icon"></i>
    </div>

    {/* Selector de Pago */}
    <div className="custom-select-container">
      <Form.Control
        as="select"
        value={filtroPago}
        onChange={handleFiltroPagoChange}
        className="custom-select"
      >
        <option value="todos">Pagado</option>
        <option value="pagado">Pagado: sí</option>
        <option value="noPagado">Pagado: no</option>
      </Form.Control>
      <i className="bi bi-caret-down-fill custom-select-icon"></i>
    </div>

    {/* Selector de Sugerencia */}
    <div className="custom-select-container">
      <Form.Control
        as="select"
        value={tipoSugerencia}
        onChange={handleTipoSugerenciaChange}
        className="custom-select"
      >
        <option value="general">Sugerencia</option>
        <option value="entrega">Sugerencia Entrega</option>
        <option value="levante">Sugerencia Levante</option>
        <option value="entregaChofer">Sugerencia Entrega Chofer</option>
        <option value="levanteChofer">Sugerencia Levante Chofer</option>
      </Form.Control>
      <i className="bi bi-caret-down-fill custom-select-icon"></i>
    </div>
                  
          {pedidosFiltrados.map((pedido) => (
            <div key={pedido.id} className="pedido-item mb-3 p-3 border">
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(pedido.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Cliente:</strong>{" "}
                {pedido.Obra.empresa
                  ? pedido.Obra.empresa.nombre
                  : pedido.Obra.particular.nombre}
              </p>
              <p>
                <strong>Dirección:</strong> {pedido.Obra.calle}{" "}
                {pedido.Obra.numeroPuerta}
              </p>
              <p>
                <strong>Precio:</strong> ${pedido.pagoPedido?.precio}
              </p>
              <p>
                <strong>Pagado:</strong>{" "}
                {pedido.pagoPedido?.pagado ? "Sí" : "No"}
              </p>
              <p>
                <strong>Sugerencia:</strong> {renderSugerencia(pedido)}
              </p>
              <p>
                <strong>Movimiento:</strong> {renderMovimiento(pedido)}
              </p>
              <Button variant="primary" onClick={() => handleRowClick(pedido)}>
                Ver Detalles
              </Button>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default Pedidos;
